import { ReactNode } from 'react';
import { Home, TrendingUp, Calendar, Brain, Users, User, Wind, Award, FileText, Settings, UsersRound, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TeamsLayoutProps {
  children: ReactNode;
  userName: string;
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/' },
  { id: 'analytics', icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  { id: 'history', icon: Calendar, label: 'History', path: '/history' },
  { id: 'insights', icon: Brain, label: 'Insights', path: '/insights' },
  { id: 'social', icon: Users, label: 'Social', path: '/social' },
  { id: 'team', icon: UsersRound, label: 'Team Board', path: '/team' },
  { id: 'achievements', icon: Award, label: 'Achievements', path: '/achievements' },
  { id: 'reports', icon: FileText, label: 'Reports', path: '/reports' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
  { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
];

export function TeamsLayout({ children, userName }: TeamsLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname === '/' ? 'dashboard' : location.pathname.replace('/', '');

  return (
    <div className="teams-shell">
      {/* Left rail */}
      <aside className="teams-rail">
        <div className="teams-logo">A&R</div>
        <nav className="teams-rail-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = current === item.id;
            return (
              <button
                key={item.id}
                className={"teams-rail-btn" + (active ? ' active' : '')}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                data-testid={`nav-${item.id}`}
              >
                <Icon size={20} />
                <span className="teams-rail-tooltip">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="teams-rail-footer" title={userName}>{userName.charAt(0).toUpperCase()}</div>
      </aside>

      {/* Main column */}
      <div className="teams-main">
        {/* Top bar */}
        <header className="teams-topbar">
          <h1 className="teams-title">Mood Sync</h1>
          <div className="teams-topbar-actions">
            <button className="teams-action" onClick={() => navigate('/breathing')}>
              <Wind size={18} /> <span>Breathe</span>
            </button>
          </div>
        </header>
        <div className="teams-content">{children}</div>
      </div>
    </div>
  );
}
