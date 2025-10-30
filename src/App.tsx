import { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DashboardScreen } from './screens/DashboardScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SocialBoardScreen } from './screens/SocialBoardScreen';
import { BreathingScreen } from './screens/BreathingScreen';
import { TeamsLayout } from './components/TeamsLayout';
// Lazy only login & onboarding
const MobileLoginScreen = lazy(() => import('./components/mobile/MobileLoginScreen').then(m => ({ default: m.MobileLoginScreen })));
const MobileOnboarding = lazy(() => import('./components/mobile/MobileOnboarding').then(m => ({ default: m.MobileOnboarding })));
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
  userName?: string; // added to unify with MobileSocialBoardEntry shape
}

function AppInner() {
  // Apply theme from localStorage on mount
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (error) {
      console.error('Failed to load theme from localStorage:', error);
      // Fallback to light theme
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);
  const [user, setUser] = useState(null as User | null);
  const [entries, setEntries] = useState([] as MoodEntry[]);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoadingData, setIsLoadingData] = useState(false);
  // Latest mood state removed in simplified version
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Calculate streak with memoization
  const currentStreak = useMemo(() => {
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
  }, [entries]);

  // Check for existing session and load data
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('moodsync_user');
        const accessToken = api.getAccessToken();
        
        if (savedUser && accessToken) {
          try {
            const userData = JSON.parse(savedUser);
            // Validate userData structure
            if (userData && typeof userData === 'object' && userData.name && userData.email) {
              setUser({ ...userData, accessToken });
              await loadUserData();
            } else {
              throw new Error('Invalid user data format');
            }
          } catch (parseError) {
            console.error('Failed to parse saved user data:', parseError);
            api.signout();
            localStorage.removeItem('moodsync_user');
            toast.error('Session data corrupted. Please log in again.');
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        // Clear potentially corrupted data
        try {
          localStorage.removeItem('moodsync_user');
        } catch (cleanupError) {
          console.error('Failed to clean up localStorage:', cleanupError);
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
      try {
        const { accessToken, ...userData } = user;
        localStorage.setItem('moodsync_user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to save user to localStorage:', error);
        // Check if quota exceeded
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          toast.error('Storage quota exceeded. Please clear some data.');
        } else {
          toast.error('Failed to save user data locally');
        }
      }
    }
  }, [user]);

  const handleLogin = async (name: string, email: string, accessToken: string) => {
    setUser({ name, email, accessToken });
    
    try {
      // Check if this is first time user (no onboarding seen)
      const hasSeenOnboarding = localStorage.getItem('moodsync_onboarding_complete');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Failed to check onboarding status:', error);
      // Default to showing onboarding if check fails
      setShowOnboarding(true);
    }
    
    await loadUserData();
  };

  const handleOnboardingComplete = () => {
    try {
      localStorage.setItem('moodsync_onboarding_complete', 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      // Still hide onboarding even if save fails
      setShowOnboarding(false);
    }
  };

  const handleLogout = () => {
    api.signout();
    setUser(null);
    setEntries([]);
    try {
      localStorage.removeItem('moodsync_user');
    } catch (error) {
      console.error('Failed to clear user from localStorage:', error);
    }
    toast('Logged out successfully');
  };

  const handleBottomNavNavigate = (screen: string) => {
    navigate('/' + (screen === 'dashboard' ? '' : screen));
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

  const path = location.pathname.replace(/^\//, '') || 'dashboard';
  const mainScreens = ['dashboard','analytics','history','insights','profile','social'];
  const showBottomNav = mainScreens.includes(path);


  return (
    <>
      <Toaster />
      <div className="app-responsive-wrapper">
        <div className="desktop-only">
          <TeamsLayout userName={user!.name}>
            <Routes>
              <Route path="/" element={<DashboardScreen entries={entries} onSubmitMood={handleMoodSubmit} currentStreak={currentStreak} userName={user!.name} onNavigate={(s) => navigate('/' + (s==='dashboard'?'':s))} />} />
              <Route path="/analytics" element={<AnalyticsScreen entries={entries} />} />
              <Route path="/history" element={<HistoryScreen entries={entries} />} />
              <Route path="/insights" element={<InsightsScreen entries={entries} />} />
              <Route path="/profile" element={<ProfileScreen userName={user!.name} userEmail={user!.email} totalEntries={entries.length} currentStreak={currentStreak} onLogout={handleLogout} />} />
              <Route path="/breathing" element={<BreathingScreen onComplete={() => navigate('/')} />} />
              <Route path="/social" element={<SocialBoardScreen entries={entries} />} />
            </Routes>
          </TeamsLayout>
        </div>
        <div className="mobile-only">
          <Routes>
            <Route path="/" element={<DashboardScreen entries={entries} onSubmitMood={handleMoodSubmit} currentStreak={currentStreak} userName={user!.name} onNavigate={(s) => navigate('/' + (s==='dashboard'?'':s))} />} />
            <Route path="/analytics" element={<AnalyticsScreen entries={entries} />} />
            <Route path="/history" element={<HistoryScreen entries={entries} />} />
            <Route path="/insights" element={<InsightsScreen entries={entries} />} />
            <Route path="/profile" element={<ProfileScreen userName={user!.name} userEmail={user!.email} totalEntries={entries.length} currentStreak={currentStreak} onLogout={handleLogout} />} />
            <Route path="/breathing" element={<BreathingScreen onComplete={() => navigate('/')} />} />
            <Route path="/social" element={<SocialBoardScreen entries={entries} />} />
          </Routes>
          {showBottomNav && (
            <MobileBottomNav
              currentScreen={path}
              onNavigate={handleBottomNavNavigate}
            />
          )}
        </div>
      </div>
      <InstallPrompt />
    </>
  );
}

export default function App() {
  const base = (import.meta as any).env?.BASE_URL || '/A-R-Moodsync/';
  return (
    <BrowserRouter basename={base}>
      <AppInner />
    </BrowserRouter>
  );
}
