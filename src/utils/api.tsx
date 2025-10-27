import { projectId, publicAnonKey } from './supabase/info';

const REMOTE_API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-310f32f3`;
// Detect hosting on GitHub Pages (static, no backend)
const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const isStaticGithub = typeof window !== 'undefined' && /github\.io$/.test(window.location.hostname);
if (typeof window !== 'undefined') {
  console.log('[API] Static GitHub mode?', isStaticGithub, 'hostname:', window.location.hostname);
}
// If static hosted, we will emulate API locally with fallbacks
const API_BASE = isLocal ? 'http://localhost:4000/api' : (isStaticGithub ? '' : REMOTE_API_BASE);

export interface MoodEntry {
  id: string;
  userId: string;
  mood: string;
  note: string;
  intensity: number;
  timestamp: string;
}

export interface Settings {
  remindersEnabled: boolean;
  lastReminderTime: string | null;
}

class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('moodsync_access_token', token);
    } else {
      localStorage.removeItem('moodsync_access_token');
    }
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('moodsync_access_token');
    }
    return this.accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}, requiresAuth: boolean = true) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // For authenticated requests, use access token if available
    // For public requests, use the public anon key
    const token = requiresAuth ? this.getAccessToken() : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (!requiresAuth) {
      // Use public anon key for unauthenticated requests
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }

    const url = `${API_BASE}${endpoint}`;
    console.log('API Request:', url || '(static-fallback)' , options.method || 'GET', 'Auth required:', requiresAuth);

    // Static fallback: emulate certain endpoints entirely client-side
    if (isStaticGithub) {
      // Auth endpoints
      if (endpoint === '/auth/signin' && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        const demoUsers: Record<string,string> = {
          'demo@example.com': 'Demo User',
          'sarah@example.com': 'Sarah Connor',
          'john@example.com': 'John Doe'
        };
        if (demoUsers[body.email]) {
          const fakeToken = 'static-demo-token-' + btoa(body.email);
          this.setAccessToken(fakeToken);
          return {
            access_token: fakeToken,
            user: { name: demoUsers[body.email], email: body.email }
          };
        }
        throw new Error('Invalid credentials (static)');
      }
      if (endpoint === '/auth/signup' && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        const fakeToken = 'static-signup-token-' + btoa(body.email);
        this.setAccessToken(fakeToken);
        return { access_token: fakeToken, user: { name: body.name, email: body.email } };
      }
      // Mood creation
      if (endpoint === '/moods' && options.method === 'POST') {
        const body = JSON.parse(options.body as string);
        const entry = { id: 'local-' + Date.now(), mood: body.mood, note: body.note, intensity: body.intensity, timestamp: new Date().toISOString() };
        const existing = JSON.parse(localStorage.getItem('moodsync_entries') || '[]');
        existing.push(entry);
        localStorage.setItem('moodsync_entries', JSON.stringify(existing));
        return { entry };
      }
      if (endpoint === '/moods' && (!options.method || options.method === 'GET')) {
        const entries = JSON.parse(localStorage.getItem('moodsync_entries') || '[]');
        return { entries };
      }
      if (/^\/moods\//.test(endpoint) && options.method === 'DELETE') {
        const id = endpoint.split('/').pop();
        let entries: any[] = JSON.parse(localStorage.getItem('moodsync_entries') || '[]');
        entries = entries.filter(e => e.id !== id);
        localStorage.setItem('moodsync_entries', JSON.stringify(entries));
        return { success: true };
      }
      if (endpoint === '/settings' && (!options.method || options.method === 'GET')) {
        const settings = JSON.parse(localStorage.getItem('moodsync_settings') || '{"remindersEnabled":false, "lastReminderTime":null}');
        return { settings };
      }
      if (endpoint === '/settings' && options.method === 'PUT') {
        const body = JSON.parse(options.body as string);
        localStorage.setItem('moodsync_settings', JSON.stringify(body));
        return { settings: body };
      }
      if (endpoint === '/health') {
        return { status: 'static' };
      }
    }

    try {
      if (isStaticGithub) {
        // If we didn't early-return above, endpoint unsupported in static mode
        throw new Error('Endpoint unsupported in static mode: ' + endpoint);
      }
      const response = await fetch(url, { ...options, headers });

      console.log('API Response status:', response.status);

      let data: any = null;
      try {
        // Try to parse JSON; if it fails, capture text for diagnostics
        data = await response.json();
      } catch (e) {
        const text = await response.text().catch(() => '');
        console.warn('Response not JSON:', text);
        // If 404 or other client error, return a minimal structure to allow graceful degradation
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        // If OK but non-JSON, return empty object
        return {};
      }

      if (!response.ok) {
        console.error('API Error:', data);
        // Pass through the exact error message or code from the server
        if (data && data.error === 'USER_EXISTS') {
          throw new Error('USER_EXISTS');
        }
        throw new Error(data?.error || data?.message || `Request failed with status ${response.status}`);
      }

      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth (public endpoints - don't require user auth)
  async signup(email: string, password: string, name: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }, false); // false = doesn't require user authentication
  }

  async signin(email: string, password: string) {
    const data = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false); // false = doesn't require user authentication
    
    if (data.access_token) {
      this.setAccessToken(data.access_token);
    }
    
    return data;
  }

  signout() {
    this.setAccessToken(null);
  }

  // Mood entries
  async createMoodEntry(mood: string, note: string, intensity: number) {
    try {
      return await this.request('/moods', {
        method: 'POST',
        body: JSON.stringify({ mood, note, intensity }),
      });
    } catch (e) {
      console.warn('createMoodEntry failed, returning fallback:', e);
      return { entry: { id: 'local-fallback', mood, note, intensity, timestamp: new Date().toISOString() } };
    }
  }

  async getMoodEntries(): Promise<{ entries: MoodEntry[] }> {
    try {
      return await this.request('/moods');
    } catch (e) {
      console.warn('getMoodEntries failed, returning empty list:', e);
      return { entries: [] };
    }
  }

  async deleteMoodEntry(id: string) {
    try {
      return await this.request(`/moods/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('deleteMoodEntry failed, returning failure object:', e);
      return { success: false };
    }
  }

  // Settings
  async getSettings(): Promise<{ settings: Settings }> {
    try {
      return await this.request('/settings');
    } catch (e) {
      console.warn('getSettings failed, returning defaults:', e);
      return { settings: { remindersEnabled: false, lastReminderTime: null } };
    }
  }

  async updateSettings(settings: Settings) {
    try {
      return await this.request('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } catch (e) {
      console.warn('updateSettings failed, returning passed settings as fallback:', e);
      return { settings };
    }
  }

  // Health check
  async healthCheck() {
    try {
      return await this.request('/health', {}, false);
    } catch (e) {
      console.warn('healthCheck failed:', e);
      return { status: 'unreachable' };
    }
  }
}

export const api = new ApiClient();
