// @ts-nocheck
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createClient } from '@supabase/supabase-js';
import * as kv from './kv_store';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client (works in Node and Deno)
const getSupabaseClient = () => {
  const url = typeof process !== 'undefined' && process.env.SUPABASE_URL
    ? process.env.SUPABASE_URL
    : (typeof (globalThis as any).Deno !== 'undefined' ? (globalThis as any).Deno.env.get('SUPABASE_URL') : '');

  const key = typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : (typeof (globalThis as any).Deno !== 'undefined' ? (globalThis as any).Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') : '');

  return createClient(url || '', key || '');
};

// Initialize demo users on server startup
const initializeDemoUsers = async () => {
  const supabase = getSupabaseClient();
  const demoUsers = [
    { email: 'demo@moodsync.com', password: 'demo123', name: 'Demo User' },
    { email: 'alex@example.com', password: 'alex123', name: 'Alex Johnson' },
    { email: 'sarah@example.com', password: 'sarah123', name: 'Sarah Chen' }
  ];

  for (const user of demoUsers) {
    try {
      const { error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        user_metadata: { name: user.name },
        email_confirm: true
      });

      if (error && !error.message?.includes('already')) {
        console.error(`Failed to create demo user ${user.email}:`, error);
      } else if (!error) {
        console.log(`✅ Demo user created: ${user.email}`);
      }
    } catch (error) {
      console.error(`Error initializing demo user ${user.email}:`, error);
    }
  }
};

initializeDemoUsers().catch(console.error);

// Helper to verify user authentication
const verifyAuth = async (authHeader: string | null) => {
  if (!authHeader) return { error: 'No authorization header', user: null };
  const token = authHeader.replace('Bearer ', '');
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser(token as any);
  if (error || !user) return { error: 'Unauthorized', user: null };
  return { error: null, user };
};

// Routes
app.post('/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    if (!email || !password || !name) return c.json({ error: 'Missing required fields' }, 400);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });
    if (error) {
      if (error.message?.includes('already') || error.status === 422) {
        return c.json({ error: 'USER_EXISTS', message: 'An account with this email already exists.' }, 409);
      }
      return c.json({ error: error.message }, 400);
    }
    return c.json({ user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata.name } });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

app.post('/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: 'Missing email or password' }, 400);
    const supabase = createClient(
      typeof process !== 'undefined' && process.env.SUPABASE_URL ? process.env.SUPABASE_URL : (typeof (globalThis as any).Deno !== 'undefined' ? (globalThis as any).Deno.env.get('SUPABASE_URL') : ''),
      typeof process !== 'undefined' && process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY : (typeof (globalThis as any).Deno !== 'undefined' ? (globalThis as any).Deno.env.get('SUPABASE_ANON_KEY') : '')
    );
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return c.json({ error: error.message }, 401);
    return c.json({ access_token: data.session.access_token, user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata.name } });
  } catch (error) {
    console.error('Sign in error:', error);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

app.post('/moods', async (c) => {
  try {
  const authHeader = c.req.header('Authorization');
  const { error: authError, user } = await verifyAuth(authHeader ?? null);
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
  const { error: authError, user } = await verifyAuth(authHeader ?? null);
    if (authError || !user) return c.json({ error: authError || 'Unauthorized' }, 401);
    const prefix = `mood_entry:${user.id}_`;
    const entries = await kv.getByPrefix(prefix);
    const sortedEntries = entries.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return c.json({ entries: sortedEntries });
  } catch (error) {
    console.error('Get mood entries error:', error);
    return c.json({ error: 'Failed to retrieve mood entries' }, 500);
  }
});

app.delete('/moods/:id', async (c) => {
  try {
  const authHeader = c.req.header('Authorization');
  const { error: authError, user } = await verifyAuth(authHeader ?? null);
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

app.get('/settings', async (c) => {
  try {
  const authHeader = c.req.header('Authorization');
  const { error: authError, user } = await verifyAuth(authHeader ?? null);
    if (authError || !user) return c.json({ error: authError || 'Unauthorized' }, 401);
    const settings = await kv.get(`settings:${user.id}`) || { remindersEnabled: false, lastReminderTime: null };
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

app.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }));

// If running in Deno (Supabase Functions), hand off to Deno.serve
if (typeof (globalThis as any).Deno !== 'undefined' && (globalThis as any).Deno.serve) {
  (globalThis as any).Deno.serve(app.fetch);
}

// Always export the app so Node-based bundlers can import it
export default app;
