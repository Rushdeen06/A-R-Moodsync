import { motion } from 'motion/react';
import { Home, TrendingUp, Award, User, FileText, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
  { id: 'achievements', icon: Award, label: 'Rewards' },
  { id: 'reports', icon: FileText, label: 'Reports' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function MobileBottomNav({ currentScreen, onNavigate }: MobileBottomNavProps) {
  return (
    <motion.nav
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed top-0 left-0 z-50 h-full w-16 backdrop-blur-md flex flex-col py-4"
      style={{
        backgroundColor: 'rgba(32,35,41,0.92)',
        borderRight: '1px solid rgba(60,70,80,0.4)',
        boxShadow: '2px 0 8px -2px rgba(0,0,0,0.4)'
      }}
      data-testid="mobile-side-nav"
    >
      <div className="flex-1 flex flex-col items-center gap-2 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.9 }}
              className={
                'relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-colors ' +
                (isActive
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-700/40 hover:text-gray-200')
              }
              data-testid={`mobile-nav-${item.id}`}
            >
              {isActive && (
                <motion.span
                  layoutId="mobileActiveGlow"
                  className="absolute inset-0 rounded-xl ring-2 ring-teal-300/60"
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                />
              )}
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1 font-medium tracking-wide">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}