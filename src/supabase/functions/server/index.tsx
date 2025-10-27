import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createClient } from '@supabase/supabase-js';
import * as kv from './kv_store';

export const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Environment helper (works in Node and Deno)
const getEnv = (name: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) return process.env[name];
  if (typeof (globalThis as any).Deno !== 'undefined' && (globalThis as any).Deno?.env?.get) {
    return (globalThis as any).Deno.env.get(name);
  }
  return undefined;
};

const getSupabaseClient = (opts?: { anon?: boolean }) => {
  const url = getEnv('SUPABASE_URL') || '';
  // Prefer service role key when performing admin actions
  const key = opts?.anon ? (getEnv('SUPABASE_ANON_KEY') || '') : (getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('SUPABASE_ANON_KEY') || '');
  return createClient(url, key);
};

// Helper to verify user authentication using an access token
const verifyAuth = async (authHeader?: string | null) => {
  if (!authHeader) return { error: 'No authorization header', user: null };
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const supabase = getSupabaseClient({ anon: true });
  try {
    const { data, error } = await supabase.auth.getUser(token as any);
    if (error || !data?.user) return { error: 'Unauthorized', user: null };
    return { error: null, user: data.user };
  } catch (err) {
    console.error('verifyAuth error:', err);
    return { error: 'Unauthorized', user: null };
  }
};

// Auth routes
app.post('/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password || !name) return c.json({ error: 'Missing required fields' }, 400);

    // Admin actions require service role key
    if (!getEnv('SUPABASE_SERVICE_ROLE_KEY')) {
      return c.json({ error: 'SERVER_NOT_CONFIGURED', message: 'Service role key missing on server' }, 500);
    }

    const supabase = getSupabaseClient({ anon: false });
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    } as any);

    if (error) {
      console.error('Signup error:', error);
      if ((error as any).message?.includes('already') || (error as any).status === 422) {
        return c.json({ error: 'USER_EXISTS', message: 'An account with this email already exists. Please sign in instead.' }, 409);
      }
      return c.json({ error: (error as any).message || 'Signup failed' }, 400);
    }

    const user = (data as any).user;
    return c.json({ user: { id: user.id, email: user.email, name: user.user_metadata?.name || null } });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

app.post('/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: 'Missing email or password' }, 400);

    const supabase = getSupabaseClient({ anon: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password } as any);

    if (error) {
      console.error('Sign in error:', error);
      return c.json({ error: (error as any).message || 'Sign in failed' }, 401);
    }

    const user = (data as any).user;
    const accessToken = (data as any).session?.access_token || null;

    return c.json({ access_token: accessToken, user: user ? { id: user.id, email: user.email, name: user.user_metadata?.name } : null });
  } catch (error) {
    console.error('Sign in error:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// Mood entries routes (protected)
app.post('/moods', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyAuth(authHeader);
    if (authError || !user) return c.json({ error: authError || 'Unauthorized' }, 401);

    const { mood, note, intensity } = await c.req.json();
    if (!mood || intensity === undefined) return c.json({ error: 'Missing required fields' }, 400);

    const entry = { id: `${user.id}_${Date.now()}`, userId: user.id, mood, note: note || '', intensity, timestamp: new Date().toISOString() };
    await kv.set(`mood_entry:${entry.id}`, entry);
    return c.json({ entry });
  } catch (error) {
    console.error('Create mood entry error:', error);
    return c.json({ error: 'Failed to create mood entry' }, 500);
  }
});

app.get('/moods', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyAuth(authHeader);
    if (authError || !user) return c.json({ error: authError || 'Unauthorized' }, 401);

    const prefix = `mood_entry:${user.id}_`;
    const entries = await kv.getByPrefix(prefix) || [];
    const sortedEntries = (entries as any[]).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ entries: sortedEntries });
  } catch (error) {
    console.error('Get mood entries error:', error);
    return c.json({ error: 'Failed to retrieve mood entries' }, 500);
  }
});

app.delete('/moods/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyAuth(authHeader);
    if (authError || !user) return c.json({ error: authError || 'Unauthorized' }, 401);

    const id = c.req.param('id');
    const key = `mood_entry:${id}`;
    const entry = await kv.get(key);
    if (!entry || entry.userId !== user.id) return c.json({ error: 'Entry not found or unauthorized' }, 404);
    await kv.del(key);
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    return c.json({ error: 'Failed to delete mood entry' }, 500);
  }
});

// Settings routes (protected)
app.get('/settings', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyAuth(authHeader);
    if (authError || !user) return c.json({ error: authError || 'Unauthorized' }, 401);

    const settings = (await kv.get(`settings:${user.id}`)) || { remindersEnabled: false, lastReminderTime: null };
    return c.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    return c.json({ error: 'Failed to retrieve settings' }, 500);
  }
});

app.put('/settings', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const { error: authError, user } = await verifyAuth(authHeader);
    if (authError || !user) return c.json({ error: authError || 'Unauthorized' }, 401);

    const settings = await c.req.json();
    await kv.set(`settings:${user.id}`, settings);
    return c.json({ settings });
  } catch (error) {
    console.error('Update settings error:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Only call Deno.serve when running under Deno; otherwise export app for Node usage
if (typeof (globalThis as any).Deno !== 'undefined' && typeof (globalThis as any).Deno.serve === 'function') {
  (globalThis as any).Deno.serve(app.fetch);
}


export default app;
