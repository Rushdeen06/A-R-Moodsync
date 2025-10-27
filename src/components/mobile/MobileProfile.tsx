import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Settings, LogOut, Award, Bell, Moon, Sun, Download, Heart } from 'lucide-react';
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
        settings: { notificationsEnabled, darkMode: theme === 'dark' }
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'moodsync-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pb-20"
      style={{ backgroundColor: '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto p-6">
        {/* Header with Avatar */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm text-center">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
            style={{ backgroundColor: '#D4E9F1' }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl mb-1" style={{ color: '#2D7A8B' }}>
            {userName}
          </h2>
          <p className="text-sm" style={{ color: '#4FB3C5' }}>
            {userEmail}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div 
              className="rounded-xl p-4"
              style={{ backgroundColor: '#F5F8FA' }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="w-4 h-4" style={{ color: '#FF6B6B' }} />
                <p className="text-2xl" style={{ color: '#2D7A8B' }}>
                  {totalEntries}
                </p>
              </div>
              <p className="text-xs" style={{ color: '#4FB3C5' }}>
                Moods Logged
              </p>
            </div>
            <div 
              className="rounded-xl p-4"
              style={{ backgroundColor: '#F5F8FA' }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="w-4 h-4" style={{ color: '#FFB84D' }} />
                <p className="text-2xl" style={{ color: '#2D7A8B' }}>
                  {currentStreak}
                </p>
              </div>
              <p className="text-xs" style={{ color: '#4FB3C5' }}>
                Day Streak
              </p>
            </div>
          </div>
        </div>

        {/* Privacy panel (shows masked/full data from local backend) */}
        <UserPrivacyPanel />

        {/* Settings Section */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg mb-4" style={{ color: '#2D7A8B' }}>
            Settings
          </h3>

          <div className="space-y-4">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#E8DFF5' }}
                >
                  <Bell className="w-5 h-5" style={{ color: '#9B7FD8' }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#2D7A8B' }}>
                    Notifications
                  </p>
                  <p className="text-xs" style={{ color: '#4FB3C5' }}>
                    Daily mood reminders
                  </p>
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationChange}
              />
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FFF4E6' }}
                >
                    {localStorage.getItem('theme') === 'dark' ? (
                    <Moon className="w-5 h-5" style={{ color: '#FFB84D' }} />
                  ) : (
                    <Sun className="w-5 h-5" style={{ color: '#FFB84D' }} />
                  )}
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#2D7A8B' }}>
                    Dark Mode
                  </p>
                  <p className="text-xs" style={{ color: '#4FB3C5' }}>
                      Toggle dark theme
                  </p>
                </div>
              </div>
                <ThemeToggle />
            </div>

            {/* Export Data */}
            <button className="flex items-center gap-3 w-full">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#D4F1E8' }}
              >
                <Download className="w-5 h-5" style={{ color: '#7DD4A8' }} />
              </div>
              <div className="text-left">
                <p className="text-sm" style={{ color: '#2D7A8B' }}>
                  Export Data
                </p>
                <p className="text-xs" style={{ color: '#4FB3C5' }}>
                  <button 
                onClick={handleExportData}
                className="text-left w-full flex items-center"
              >
                Download your mood history
              </button>
                </p>
              </div>
            </button>

            {/* App Settings */}
            <button className="flex items-center gap-3 w-full">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#E8F6F8' }}
              >
                <Settings className="w-5 h-5" style={{ color: '#4FB3C5' }} />
              </div>
              <div className="text-left">
                <p className="text-sm" style={{ color: '#2D7A8B' }}>
                  App Settings
                </p>
                <p className="text-xs" style={{ color: '#4FB3C5' }}>
                  Customize your experience
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={onLogout}
          className="w-full h-12 rounded-xl text-white"
          style={{ backgroundColor: '#FF6B6B' }}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>

        {/* App Version */}
        <p className="text-xs text-center mt-4" style={{ color: '#A8C9C7' }}>
          A&R MoodSync v1.0.0
        </p>
      </div>
    </motion.div>
  );
}
