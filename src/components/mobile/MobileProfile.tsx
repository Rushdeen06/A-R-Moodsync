import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Settings, LogOut, Award, Bell, Moon, Sun, Download, Heart, Trophy, Target } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../../utils/ThemeProvider';
import { Switch } from '../ui/switch';
import { UserPrivacyPanel } from '../UserPrivacyPanel';
import { useState } from 'react';

interface MobileProfileProps {
  userName: string;
  userEmail: string;
  totalEntries: number;
  currentStreak: number;
  onLogout: () => void;
}

export function MobileProfile({ userName, userEmail, totalEntries, currentStreak, onLogout }: MobileProfileProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return Notification.permission === 'granted';
  });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Handle notification permission
  const handleNotificationChange = async (enabled: boolean) => {
    if (enabled) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications', 'enabled');
      } else {
        setNotificationsEnabled(false);
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notifications', 'disabled');
    }
  };

  // Handle data export
  const handleExportData = async () => {
    try {
      const data = {
        userInfo: { name: userName, email: userEmail },
        stats: { totalEntries, currentStreak },
        settings: { notificationsEnabled, darkMode: theme === 'dark' },
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `moodsync-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  // Calculate achievement level
  const achievementLevel = totalEntries < 10 ? 'Beginner' : totalEntries < 50 ? 'Explorer' : totalEntries < 100 ? 'Dedicated' : 'Master';
  const achievementColor = totalEntries < 10 ? '#A8C9C7' : totalEntries < 50 ? '#4FB3C5' : totalEntries < 100 ? '#FFB84D' : '#7DD4A8';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-24"
      style={{ backgroundColor: isDark ? '#1a1a1a' : '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto p-4">
        {/* Header with gradient */}
        <div 
          className="rounded-3xl p-6 mb-4 shadow-lg relative overflow-hidden"
          style={{ 
            background: isDark 
              ? 'linear-gradient(135deg, #2D7A8B 0%, #1a5f6f 100%)' 
              : 'linear-gradient(135deg, #4FB3C5 0%, #2D7A8B 100%)'
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background: 'white', transform: 'translate(30%, -30%)' }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20" style={{ background: 'white', transform: 'translate(-30%, 30%)' }}></div>
          
          <div className="relative z-10">
            {/* Avatar with ring */}
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold relative z-10"
                style={{ 
                  backgroundColor: isDark ? '#2d2d2d' : 'white',
                  color: '#4FB3C5',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              {currentStreak > 0 && (
                <motion.div 
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FFB84D', boxShadow: '0 2px 10px rgba(255, 184, 77, 0.4)' }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-1 text-center text-white">
              {userName}
            </h2>
            <p className="text-sm text-center mb-3" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {userEmail}
            </p>
            
            {/* Achievement Badge */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-white opacity-80" />
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: achievementColor, color: 'white' }}>
                {achievementLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.div 
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? '#3d3d3d' : '#FFE6E6' }}>
                <Heart className="w-5 h-5" style={{ color: '#FF6B6B' }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-center mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              {totalEntries}
            </p>
            <p className="text-xs text-center" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
              Total Logs
            </p>
          </motion.div>

          <motion.div 
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? '#3d3d3d' : '#FFF5E1' }}>
                <Award className="w-5 h-5" style={{ color: '#FFB84D' }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-center mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              {currentStreak}
            </p>
            <p className="text-xs text-center" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
              Day Streak
            </p>
          </motion.div>

          <motion.div 
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8F6F8' }}>
                <Target className="w-5 h-5" style={{ color: '#4FB3C5' }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-center mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              {Math.floor((totalEntries / 100) * 100)}%
            </p>
            <p className="text-xs text-center" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
              To 100
            </p>
          </motion.div>
        </div>

        {/* Privacy panel */}
        <div className="mb-4">
          <UserPrivacyPanel />
        </div>

        {/* Settings Section */}
        <div className="rounded-3xl p-5 mb-4 shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5" style={{ color: '#4FB3C5' }} />
            <h3 className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              Settings
            </h3>
          </div>

          <div className="space-y-3">
            {/* Notifications */}
            <motion.div 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDark ? '#4d3d5d' : '#E8DFF5' }}
                >
                  <Bell className="w-5 h-5" style={{ color: '#9B7FD8' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                    Notifications
                  </p>
                  <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                    Daily mood reminders
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationChange}
              />
            </motion.div>

            {/* Dark Mode */}
            <motion.div 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDark ? '#5d4d3d' : '#FFF4E6' }}
                >
                  {isDark ? (
                    <Moon className="w-5 h-5" style={{ color: '#FFB84D' }} />
                  ) : (
                    <Sun className="w-5 h-5" style={{ color: '#FFB84D' }} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                    Dark Mode
                  </p>
                  <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                    {isDark ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <ThemeToggle />
            </motion.div>

            {/* Export Data */}
            <motion.div 
              className="flex items-center justify-between p-3 rounded-xl cursor-pointer"
              style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}
              onClick={handleExportData}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDark ? '#3d5d4d' : '#D4F1E8' }}
                >
                  <Download className="w-5 h-5" style={{ color: '#7DD4A8' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                    Export Data
                  </p>
                  <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                    Download your information
                  </p>
                </div>
              </div>
            </motion.div>

            {/* App Settings */}
            <motion.div 
              className="flex items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: isDark ? '#3d4d5d' : '#E8F6F8' }}
                >
                  <Settings className="w-5 h-5" style={{ color: '#4FB3C5' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                    App Settings
                  </p>
                  <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                    Preferences & options
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Logout Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onLogout}
            className="w-full py-6 rounded-2xl text-base font-semibold shadow-lg"
            style={{ 
              backgroundColor: '#FF6B6B',
              color: 'white'
            }}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </Button>
        </motion.div>

        {/* App Version */}
        <p className="text-center text-xs mt-6" style={{ color: isDark ? '#666' : '#A8C9C7' }}>
          A&R Mood Sync v1.0.0
        </p>
      </div>
    </motion.div>
  );
}
