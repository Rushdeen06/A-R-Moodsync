import { motion } from 'motion/react';
import { Home, TrendingUp, Calendar, User, Brain, Users } from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
  { id: 'history', icon: Calendar, label: 'History' },
  { id: 'insights', icon: Brain, label: 'Insights' },
  { id: 'social', icon: Users, label: 'Social' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function MobileBottomNav({ currentScreen, onNavigate }: MobileBottomNavProps) {
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe backdrop-blur-md"
      style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
        borderTop: '1px solid rgba(232, 246, 248, 0.5)',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)' 
      }}
    >
  <div className="grid grid-cols-6 h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center gap-1 relative"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                  style={{ backgroundColor: '#4FB3C5' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ 
                    color: isActive ? '#4FB3C5' : '#A8C9C7',
                    strokeWidth: isActive ? 2.5 : 2,
                  }} 
                />
              </motion.div>
              
              {/* Label */}
              <span 
                className="text-xs"
                style={{ 
                  color: isActive ? '#2D7A8B' : '#A8C9C7',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {item.label}
              </span>
              
              {/* Removed social unread badge in simplified app */}
            </button>
          );
          })}
        </div>
      </motion.div>
    );
  }