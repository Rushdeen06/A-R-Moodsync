const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Global error handlers for uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Log but don't exit - keep server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Log but don't exit - keep server running
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../build')));

const PORT = process.env.PORT || 4000;
const OWNER_SECRET = process.env.OWNER_SECRET || 'dev-secret';
const { createClient } = require('@supabase/supabase-js');

// Async error wrapper to catch errors in async route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((error) => {
    console.error('❌ Route handler error:', error);
    next(error);
  });
};

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const user = {
  id: 'user_123',
  name: process.env.SAMPLE_USER_NAME || 'John Doe',
  email: process.env.SAMPLE_USER_EMAIL || 'john@example.com',
  bio: process.env.SAMPLE_USER_BIO || 'Sensitive personal bio stored locally',
};

function mask(u) {
  return {
    id: u.id,
    // show only first and last characters of name
    name: u.name ? u.name.replace(/.(?=.{2,})/g, '*') : null,
    // mask email local-part
    email: u.email ? u.email.replace(/(.).*(?=@)/, '$1***') : null,
    bio: u.bio ? '***' : null,
  };
}

// Returns full user when request supplies correct secret via header x-owner-secret or query param secret
app.get('/api/user', asyncHandler(async (req, res) => {
  // Prefer Authorization Bearer token for authenticated requests
  const authHeader = req.get('Authorization');
  const secret = req.get('x-owner-secret') || req.query.secret;

  // If an Authorization header is present and Supabase client is configured, verify token
  if (authHeader && supabase) {
    try {
      const token = authHeader.replace(/^Bearer\s+/i, '');
      const { data, error } = await supabase.auth.getUser(token);
      if (!error && data && data.user) {
        // Return full user info for the authenticated owner
        return res.json({ public: false, user: { id: data.user.id, name: data.user.user_metadata?.name || user.name, email: data.user.email || user.email, bio: user.bio } });
      }
    } catch (e) {
      console.error('Error verifying Supabase token:', e);
    }
  }

  // Fallback: if x-owner-secret matches the dev secret, return full user
  if (secret && secret === OWNER_SECRET) {
    return res.json({ public: false, user });
  }

  return res.json({ public: true, user: mask(user) });
}));

// Note: dev login removed. Use Supabase auth tokens (Authorization: Bearer <token>) to view full data.

// Auth endpoints for local development
const demoUsers = new Map(); // In-memory user store for local dev

// Pre-seed some demo users for easy testing
const seedDemoUsers = () => {
  const demoAccounts = [
    { email: 'demo@example.com', password: 'demo123', name: 'Demo User' },
    { email: 'sarah@example.com', password: 'sarah123', name: 'Sarah Chen' },
    { email: 'john@example.com', password: 'john123', name: 'John Doe' }
  ];

  demoAccounts.forEach((account, index) => {
    const userId = `user_demo_${index + 1}`;
    const mockAccessToken = `mock_token_${userId}`;
    demoUsers.set(account.email, {
      id: userId,
      email: account.email,
      password: account.password,
      name: account.name,
      accessToken: mockAccessToken
    });
  });

  console.log('✅ Demo users initialized:', demoAccounts.map(u => u.email).join(', '));
};

// Initialize demo users on server start
seedDemoUsers();

app.post('/api/auth/signup', asyncHandler(async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    if (demoUsers.has(email)) {
      return res.status(409).json({ 
        error: 'USER_EXISTS',
        message: 'An account with this email already exists. Please sign in instead.'
      });
    }

    // Create demo user
    const userId = `user_${Date.now()}`;
    const mockAccessToken = `mock_token_${userId}`;
    
    demoUsers.set(email, {
      id: userId,
      email,
      password, // In production, this should be hashed!
      name,
      accessToken: mockAccessToken
    });

    console.log('✅ User signed up:', email);

    return res.json({
      user: {
        id: userId,
        email,
        name
      },
      access_token: mockAccessToken
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}));

app.post('/api/auth/signin', asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }

    // Check if user exists
    const user = demoUsers.get(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ User signed in:', email);

    return res.json({
      access_token: user.accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({ error: 'Failed to sign in' });
  }
}));

app.get('/health', (req, res) => res.send('ok'));

// Simple in-memory store for dev moods and settings
const moodEntries = [];
const settingsStore = {};

// Dev API for moods
app.post('/api/moods', (req, res) => {
  const { mood, note, intensity } = req.body || {};
  const entry = {
    id: `local_${Date.now()}`,
    userId: user.id,
    mood: mood || 'okay',
    note: note || '',
    intensity: typeof intensity === 'number' ? intensity : 3,
    timestamp: new Date().toISOString(),
  };
  moodEntries.push(entry);
  return res.json({ entry });
});

app.get('/api/moods', (req, res) => {
  const entries = moodEntries.filter(e => e.userId === user.id).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  return res.json({ entries });
});

app.delete('/api/moods/:id', (req, res) => {
  const id = req.params.id;
  const idx = moodEntries.findIndex(e => e.id === id && e.userId === user.id);
  if (idx === -1) return res.status(404).json({ error: 'not_found' });
  moodEntries.splice(idx, 1);
  return res.json({ success: true });
});

// Dev API for settings
app.get('/api/settings', (req, res) => {
  const s = settingsStore[user.id] || { remindersEnabled: false, lastReminderTime: null };
  return res.json({ settings: s });
});

app.put('/api/settings', (req, res) => {
  const s = req.body || {};
  settingsStore[user.id] = s;
  return res.json({ settings: s });
});

// Catch-all handler: serve React app for any route not matched above
app.use((req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  } catch (error) {
    console.error('Error serving index.html:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Global error handling middleware - must be last
app.use((err, req, res, next) => {
  console.error('❌ Express Error Handler:', err);
  console.error('Stack:', err.stack);
  
  // Don't leak error details in production
  const errorResponse = {
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  };
  
  res.status(err.status || 500).json(errorResponse);
});

// Start server with error handling
let server;
try {
  server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Please stop the other process or use a different port.`);
      process.exit(1);
    } else {
      console.error('❌ Server error:', error);
    }
  });

  // Set timeout for keep-alive connections
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;

} catch (error) {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
}
