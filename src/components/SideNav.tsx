import { motion } from 'motion/react';
import { 
  Home, 
  MessageSquare, 
  BarChart3, 
  Brain, 
  User, 
  Users,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

interface SideNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userRole?: 'employee' | 'hr' | 'admin';
}

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home', description: 'Mood check-in' },
  { id: 'social', icon: MessageSquare, label: 'Social', description: 'Community board' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics', description: 'Your insights' },
  { id: 'insights', icon: Brain, label: 'Insights', description: 'Wellbeing tips' },
  { id: 'profile', icon: User, label: 'Profile', description: 'Your account' },
];

const ADMIN_ITEMS = [
  { id: 'admin', icon: Users, label: 'Admin', description: 'Team wellness' },
];

export function SideNav({ currentScreen, onNavigate, userRole }: SideNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const showAdminTab = userRole === 'hr' || userRole === 'admin' || true; // TODO: Remove "|| true" in production

  const allItems = showAdminTab ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS;

  return (
    <>
      {/* Mobile Menu Button (Top-left on mobile) */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        style={{ backgroundColor: '#fff', border: '1px solid #E8F6F8' }}
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <motion.nav
        initial={false}
        animate={{
          width: isCollapsed ? 72 : 240,
          x: isMobileMenuOpen || window.innerWidth >= 1024 ? 0 : -240,
        }}
        className={`fixed left-0 top-0 h-full z-40 bg-gradient-to-b from-[#2D7A8B] to-[#1a5f6f] text-white shadow-xl ${
          isMobileMenuOpen ? 'block' : 'hidden lg:block'
        }`}
        style={{
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-lg font-bold">M</span>
              </div>
              <div>
                <h1 className="text-sm font-bold">MoodSync</h1>
                <p className="text-xs text-white/70">Workplace Wellness</p>
              </div>
            </motion.div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 mb-1 rounded-lg transition-all ${
                  isActive
                    ? 'bg-white/20 shadow-lg'
                    : 'hover:bg-white/10'
                }`}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-white/70'
                  }`}
                >
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Label & Description (hidden when collapsed) */}
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 text-left"
                  >
                    <div
                      className={`text-sm font-medium ${
                        isActive ? 'text-white' : 'text-white/90'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs text-white/60">{item.description}</div>
                  </motion.div>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer (Collapse toggle hint for desktop) */}
        {!isCollapsed && (
          <div className="hidden lg:block p-4 border-t border-white/10">
            <p className="text-xs text-white/60 text-center">
              Click menu to collapse
            </p>
          </div>
        )}
      </motion.nav>
    </>
  );
}
