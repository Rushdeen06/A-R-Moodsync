import { motion } from 'motion/react';
import { X, User, Settings, LogOut, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileMenuProps {
  userName: string;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

export function MobileMenu({ userName, onClose, onNavigate, onLogout }: MobileMenuProps) {
  const menuItems = [
    { icon: User, label: 'Profile', action: 'profile' },
    { icon: BarChart3, label: 'Dashboard', action: 'dashboard' },
    { icon: Settings, label: 'Settings', action: 'settings' },
  ];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'spring', damping: 25 }}
      className="fixed inset-0 z-50"
      style={{ backgroundColor: '#E8F6F8' }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl" style={{ color: '#2D7A8B' }}>
            Menu
          </h2>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" style={{ color: '#2D7A8B' }} />
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl"
              style={{ backgroundColor: '#4FB3C5' }}
            >
              {userName.charAt(0)}
            </div>
            <div>
              <p className="text-lg" style={{ color: '#2D7A8B' }}>
                {userName}
              </p>
              <p className="text-sm" style={{ color: '#4FB3C5' }}>
                Mood Tracker
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.action}
                onClick={() => {
                  onNavigate(item.action);
                  onClose();
                }}
                className="w-full bg-white rounded-xl p-4 flex items-center gap-4 hover:bg-opacity-80 transition-all"
              >
                <Icon className="w-5 h-5" style={{ color: '#4FB3C5' }} />
                <span style={{ color: '#2D7A8B' }}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full h-12 rounded-xl border-2"
          style={{ 
            borderColor: '#FF6B6B',
            color: '#FF6B6B',
            backgroundColor: 'white'
          }}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </motion.div>
  );
}
