import { useEffect, useState } from 'react';
import { api } from '../utils/api';

interface User {
  name: string;
  email: string;
  bio: string;
  id: string;
}

export function UserPrivacyPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [publicView, setPublicView] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_ROOT = 'http://localhost:4000';
  const isStaticGithub = typeof window !== 'undefined' && /github\.io$/.test(window.location.hostname);

  const fetchUser = async (secret?: any) => {
    // In static GitHub mode, use localStorage data
    if (isStaticGithub) {
      setLoading(true);
      try {
        const userDataStr = localStorage.getItem('moodsync_user');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          setUser({
            id: 'static-user',
            name: userData.name || 'User',
            email: userData.email || 'user@example.com',
            bio: 'Static demo user'
          });
          setPublicView(false); // Owner view in static mode
        }
      } catch (e) {
        console.error('Failed to load static user data:', e);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Original backend fetch logic
    setLoading(true);
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      const appToken = api.getAccessToken();
      if (appToken) headers['Authorization'] = `Bearer ${appToken}`;
      if (secret) headers['x-owner-secret'] = secret;
      const res = await fetch(`${API_ROOT}/api/user`, { headers });
      const data = await res.json();
      setPublicView(data.public);
      setUser(data.user);
    } catch (e) {
      console.error('Failed to fetch user:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    // Don't poll in static mode
    if (isStaticGithub) {
      return;
    }

    // Re-run when the app's auth token changes
    // (we could subscribe to auth events; for simplicity poll localStorage)
    const interval = setInterval(() => {
      const token = api.getAccessToken();
      if (token) {
        fetchUser();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4">
      <div className="bg-white rounded-xl p-4 mb-4">
        <h4 className="text-sm" style={{ color: '#2D7A8B' }}>Profile preview</h4>
        {loading && <p className="text-xs" style={{ color: '#4FB3C5' }}>Loading...</p>}

        {!loading && user && (
          <div className="mt-2">
            <p className="text-sm" style={{ color: '#2D7A8B' }}><strong>Name:</strong> {user.name ?? '—'}</p>
            <p className="text-sm" style={{ color: '#2D7A8B' }}><strong>Email:</strong> {user.email ?? '—'}</p>
            <p className="text-sm" style={{ color: '#2D7A8B' }}><strong>Bio:</strong> {user.bio ?? '—'}</p>
            <p className="text-xs mt-2" style={{ color: '#4FB3C5' }}>{publicView ? 'This is the public (masked) view when sharing a link.' : 'You are viewing full data (owner).'}</p>
          </div>
        )}

        {!loading && !user && (
          <p className="text-xs" style={{ color: '#4FB3C5' }}>No user data available.</p>
        )}
      </div>

      <div className="bg-white rounded-xl p-4">
        <h4 className="text-sm mb-2" style={{ color: '#2D7A8B' }}>Developer access</h4>
        <p className="text-xs" style={{ color: '#4FB3C5' }}>
          Full data will appear here if you sign in through the app (Supabase auth). This component no longer exposes a dev login form.
        </p>
      </div>
    </div>
  );
}
