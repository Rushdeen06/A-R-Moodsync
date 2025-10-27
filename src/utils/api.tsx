import { projectId, publicAnonKey } from './supabase/info';

const REMOTE_API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-310f32f3`;
// During local development prefer the local backend express server
const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const API_BASE = isLocal ? 'http://localhost:4000/api' : REMOTE_API_BASE;

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
    console.log('API Request:', url, options.method || 'GET', 'Auth required:', requiresAuth);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

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
