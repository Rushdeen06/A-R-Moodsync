import { Users } from 'lucide-react';

interface DemoUser {
  email: string;
  password: string;
  name: string;
}

interface MobileDemoUsersProps {
  onSelectUser: (email: string, password: string) => void;
}

const DEMO_USERS: DemoUser[] = [
  { email: 'demo@example.com', password: 'demo123', name: 'Demo User' },
  { email: 'sarah@example.com', password: 'sarah123', name: 'Sarah Chen' },
  { email: 'john@example.com', password: 'john123', name: 'John Doe' },
];

export function MobileDemoUsers({ onSelectUser }: MobileDemoUsersProps) {
  return (
    <div className="mt-6 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(75, 179, 197, 0.1)' }}>
      <div className="flex items-center gap-2 justify-center mb-3">
        <Users className="w-4 h-4" style={{ color: '#4FB3C5' }} />
        <p className="text-xs" style={{ color: '#2D7A8B' }}>
          Try Demo Accounts
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {DEMO_USERS.map((user) => (
          <button
            key={user.email}
            onClick={() => onSelectUser(user.email, user.password)}
            className="p-3 rounded-xl text-center transition-all hover:scale-105 active:scale-95"
            style={{ 
              backgroundColor: 'white',
              border: '2px solid #D4E9F1'
            }}
          >
            <div 
              className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-base"
              style={{ backgroundColor: '#4FB3C5', color: 'white' }}
            >
              {user.name.charAt(0)}
            </div>
            <p className="text-xs" style={{ color: '#2D7A8B' }}>
              {user.name.split(' ')[0]}
            </p>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-center" style={{ color: '#4FB3C5' }}>
        Click any user to auto-fill login
      </p>
    </div>
  );
}
