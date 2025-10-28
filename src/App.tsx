import { useState, useEffect, Suspense, lazy } from 'react';
// Keep only login/onboarding/profile dynamic, dashboard unified screen eagerly loaded to reduce complexity
const MobileLoginScreen = lazy(() => import('./components/mobile/MobileLoginScreen').then(m => ({ default: m.MobileLoginScreen })));
const MobileOnboarding = lazy(() => import('./components/mobile/MobileOnboarding').then(m => ({ default: m.MobileOnboarding })));
const MobileProfile = lazy(() => import('./components/mobile/MobileProfile').then(m => ({ default: m.MobileProfile })));
import { UnifiedDashboard } from './components/mobile/UnifiedDashboard';
// Keep lightweight, frequently visible UI components eagerly loaded
// Simplified navigation: only dashboard & profile; remove floating action
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { Loader2 } from 'lucide-react';
import { Toaster, toast } from './components/ui/sonner';
import { api } from './utils/api';

interface User {
  name: string;
  email: string;
  accessToken: string;
}

interface MoodEntry {
  id: string;
  userId?: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
  category?: string;
}

type Screen = 'dashboard' | 'profile';

export default function App() {
  // Apply theme from localStorage on mount
  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);
  const [user, setUser] = useState(null as User | null);
  const [entries, setEntries] = useState([] as MoodEntry[]);
  const [currentScreen, setCurrentScreen] = useState('dashboard' as Screen);
  const [isLoadingData, setIsLoadingData] = useState(false);
  // Latest mood state removed in simplified version
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Calculate streak
  const currentStreak = (() => {
    if (entries.length === 0) return 0;
    
    const sortedEntries = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);
      entryDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  })();

  // Check for existing session and load data
  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('moodsync_user');
      const accessToken = api.getAccessToken();
      
      if (savedUser && accessToken) {
        try {
          const userData = JSON.parse(savedUser);
          setUser({ ...userData, accessToken });
          await loadUserData();
        } catch (error) {
          console.error('Session restoration failed:', error);
          api.signout();
          localStorage.removeItem('moodsync_user');
        }
      }
    };
    
    checkSession();
  }, []);

  // Load user data from backend
  const loadUserData = async () => {
    setIsLoadingData(true);
    try {
      const { entries: moodEntries } = await api.getMoodEntries();
      setEntries(moodEntries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      })));
    } catch (error) {
      console.error('Failed to load user data:', error);
      toast.error('Failed to load your data');
    } finally {
      setIsLoadingData(false);
    }
  };

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      const { accessToken, ...userData } = user;
      localStorage.setItem('moodsync_user', JSON.stringify(userData));
    }
  }, [user]);

  const handleLogin = async (name: string, email: string, accessToken: string) => {
    setUser({ name, email, accessToken });
    
    // Check if this is first time user (no onboarding seen)
    const hasSeenOnboarding = localStorage.getItem('moodsync_onboarding_complete');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
    
    await loadUserData();
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('moodsync_onboarding_complete', 'true');
    setShowOnboarding(false);
  };

  const handleLogout = () => {
    api.signout();
    setUser(null);
    setEntries([]);
    localStorage.removeItem('moodsync_user');
    toast('Logged out successfully');
  };

  const handleBottomNavNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleMoodSubmit = async (mood: string, note: string) => {
    try {
      const intensityMap: Record<string, number> = {
        'great': 5,
        'good': 4,
        'okay': 3,
        'low': 2,
        'very-low': 1
      };
      const intensity = intensityMap[mood] || 3;
      
      const { entry } = await api.createMoodEntry(mood, note, intensity);
      const newEntry: MoodEntry = {
        ...entry,
        timestamp: new Date(entry.timestamp),
      };
      setEntries([...entries, newEntry]);
      toast.success('Mood logged! 🎉');
    } catch (error) {
      console.error('Failed to create mood entry:', error);
      toast.error('Failed to save mood entry');
    }
  };

  // Removed suggestion and break-buddy related handlers in simplified app

  // Show onboarding for first-time users
  if (showOnboarding && user) {
    return (
      <>
        <Toaster />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen" style={{backgroundColor: "#E8F6F8"}}><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}>
          <MobileOnboarding onComplete={handleOnboardingComplete} />
        </Suspense>
      </>
    );
  }

  // Loading screen
  if (!user) {
    return (
      <>
        <Toaster />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen" style={{backgroundColor: "#E8F6F8"}}><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}>
          <MobileLoginScreen onLogin={handleLogin} />
        </Suspense>
      </>
    );
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8F6F8' }}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: '#2D7A8B' }} />
          <p style={{ color: '#2D7A8B' }}>Loading your mood data...</p>
        </div>
      </div>
    );
  }

  const mainScreens = ['dashboard', 'profile'];
  const showBottomNav = mainScreens.includes(currentScreen);

  const LoadingFallback = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  );

  return (
    <>
      <Toaster />
      
      {currentScreen === 'dashboard' && (
        <UnifiedDashboard
          entries={entries}
          onSubmitMood={handleMoodSubmit}
          currentStreak={currentStreak}
          userName={user!.name}
        />
      )}

      {currentScreen === 'profile' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileProfile
            userName={user!.name}
            userEmail={user!.email}
            totalEntries={entries.length}
            currentStreak={currentStreak}
            onLogout={handleLogout}
          />
        </Suspense>
      )}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <MobileBottomNav
          currentScreen={currentScreen}
          onNavigate={handleBottomNavNavigate}
        />
      )}

      {/* Install Prompt */}
      <InstallPrompt />
    </>
  );
}
