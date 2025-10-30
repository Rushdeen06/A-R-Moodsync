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
import { useState, useEffect } from 'react';

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
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth >= 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showAdminTab = userRole === 'hr' || userRole === 'admin' || true; // TODO: Remove "|| true" in production

  const allItems = showAdminTab ? [...NAV_ITEMS, ...ADMIN_ITEMS] : NAV_ITEMS;

  return (
    <>
      {/* Mobile Menu Button - Teams Style */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-md shadow-md"
        style={{ backgroundColor: '#6264a7' }}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Side Navigation - Teams Style */}
      <motion.nav
        initial={false}
        animate={{
          width: isCollapsed ? 72 : 280,
          x: isMobileMenuOpen || isDesktop ? 0 : -280,
        }}
        className={`fixed left-0 top-0 h-full z-40 text-gray-800 ${
          isMobileMenuOpen ? 'block' : 'hidden lg:block'
        }`}
        style={{
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
        }}
      >
        {/* Header - Teams Style */}
        <div className="p-3 flex items-center justify-between" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 flex-1"
            >
              <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ backgroundColor: '#6264a7' }}>
                <span className="text-lg font-bold text-white">MS</span>
              </div>
              <div className="flex-1">
                <h1 className="text-sm font-semibold text-gray-900">A&R MoodSync</h1>
                <p className="text-xs text-gray-500">Workplace Wellness</p>
              </div>
            </motion.div>
          )}
          {isCollapsed && (
            <div className="w-9 h-9 rounded-md flex items-center justify-center mx-auto" style={{ backgroundColor: '#6264a7' }}>
              <span className="text-base font-bold text-white">MS</span>
            </div>
          )}
        </div>

        {/* Navigation Items - Teams Style */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 mb-0.5 rounded-md transition-all relative ${
                  isActive
                    ? 'bg-white shadow-sm'
                    : 'hover:bg-gray-200/50'
                }`}
                whileTap={{ scale: 0.98 }}
                style={{
                  backgroundColor: isActive ? '#fff' : 'transparent',
                }}
              >
                {/* Active Indicator - Left Border */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-0.5 h-full rounded-r"
                    style={{ backgroundColor: '#6264a7' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div
                  className="flex-shrink-0"
                  style={{
                    color: isActive ? '#6264a7' : '#616161'
                  }}
                >
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
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
                      className="text-sm font-medium"
                      style={{
                        color: isActive ? '#252423' : '#424242'
                      }}
                    >
                      {item.label}
                    </div>
                    {!isCollapsed && (
                      <div className="text-xs" style={{ color: '#616161' }}>
                        {item.description}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Footer - Teams Style Settings */}
        <div className="p-2" style={{ borderTop: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" style={{ color: '#616161' }} />
            {!isCollapsed && (
              <span className="text-sm" style={{ color: '#424242' }}>
                {isCollapsed ? 'Expand' : 'Collapse'}
              </span>
            )}
          </button>
        </div>
      </motion.nav>
    </>
  );
}
