import React, { useState, useEffect, Suspense, lazy } from 'react';
// Dynamically code-split infrequently used / heavier screens
const MobileLoginScreen = lazy(() => import('./components/mobile/MobileLoginScreen').then(m => ({ default: m.MobileLoginScreen })));
const MobileOnboarding = lazy(() => import('./components/mobile/MobileOnboarding').then(m => ({ default: m.MobileOnboarding })));
const MobileHome = lazy(() => import('./components/mobile/MobileHome').then(m => ({ default: m.MobileHome })));
const MobileMoodCheckIn = lazy(() => import('./components/mobile/MobileMoodCheckIn').then(m => ({ default: m.MobileMoodCheckIn })));
const MobileAISuggestions = lazy(() => import('./components/mobile/MobileAISuggestions').then(m => ({ default: m.MobileAISuggestions })));
const MobileBreakBuddy = lazy(() => import('./components/mobile/MobileBreakBuddy').then(m => ({ default: m.MobileBreakBuddy })));
const MobileSocialBoard = lazy(() => import('./components/mobile/MobileSocialBoard').then(m => ({ default: m.MobileSocialBoard })));
const MobileDashboard = lazy(() => import('./components/mobile/MobileDashboard').then(m => ({ default: m.MobileDashboard })));
const MobileMoodCalendar = lazy(() => import('./components/mobile/MobileMoodCalendar').then(m => ({ default: m.MobileMoodCalendar })));
const MobileProfile = lazy(() => import('./components/mobile/MobileProfile').then(m => ({ default: m.MobileProfile })));
const MobileBreathing = lazy(() => import('./components/mobile/MobileBreathing').then(m => ({ default: m.MobileBreathing })));
// Keep lightweight, frequently visible UI components eagerly loaded
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { MobileFloatingAction } from './components/mobile/MobileFloatingAction';
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

type Screen = 'home' | 'calendar' | 'dashboard' | 'social' | 'profile' | 'mood-check-in' | 'ai-suggestions' | 'break-buddy' | 'breathing';

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
  const [currentScreen, setCurrentScreen] = useState('home' as Screen);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [latestMood, setLatestMood] = useState({ mood: 'okay', level: 3 } as { mood: string; level: number });
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

  const handleMoodSubmit = async (mood: string, note: string, activities?: string[], energyLevel?: number) => {
    try {
      const intensityMap: Record<string, number> = {
        'great': 5,
        'good': 4,
        'okay': 3,
        'low': 2,
        'very-low': 1
      };
      const intensity = intensityMap[mood] || 3;
      
      // Enhanced note with activities and energy level
      let enhancedNote = note;
      if (activities && activities.length > 0) {
        enhancedNote += (note ? '\n' : '') + `Activities: ${activities.join(', ')}`;
      }
      if (energyLevel) {
        enhancedNote += `\nEnergy: ${energyLevel}/5`;
      }
      
      const { entry } = await api.createMoodEntry(mood, enhancedNote, intensity);
      const newEntry: MoodEntry = {
        ...entry,
        timestamp: new Date(entry.timestamp),
      };
      setEntries([...entries, newEntry]);
      setLatestMood({ mood, level: intensity });
      toast.success('Mood logged! 🎉');
      
      // Show AI suggestions after mood check-in
      if (intensity <= 2) {
        setCurrentScreen('ai-suggestions');
      } else {
        setCurrentScreen('home');
      }
    } catch (error) {
      console.error('Failed to create mood entry:', error);
      toast.error('Failed to save mood entry');
    }
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    toast.success(`Great choice! ${suggestion} 🌟`);
    setCurrentScreen('break-buddy');
  };

  const handleSkipSuggestion = () => {
    toast('Maybe next time! 👍');
    setCurrentScreen('home');
  };

  const handleBreakBuddyRequest = (coworker: string, activity: string) => {
    toast.success(`Request sent to ${coworker} for ${activity}! 🎉`);
  };

  // Check if user logged mood today
  const hasLoggedToday = entries.some((entry: any) => {
    const today = new Date();
    const entryDate = new Date(entry.timestamp);
    return today.toDateString() === entryDate.toDateString();
  });

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

  const mainScreens = ['home', 'calendar', 'dashboard', 'social', 'profile'];
  const showBottomNav = mainScreens.includes(currentScreen);

  const LoadingFallback = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
    </div>
  );

  return (
    <>
      <Toaster />
      
      {currentScreen === 'home' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileHome
            userName={user!.name.split(' ')[0]}
            todaySuggestion={hasLoggedToday ? "Great job logging today! 🌟" : "Don't forget to check in today"}
            onLogMood={() => setCurrentScreen('mood-check-in')}
            onViewSocial={() => setCurrentScreen('social')}
            onMenuClick={() => setCurrentScreen('breathing')}
          />
        </Suspense>
      )}

      {currentScreen === 'calendar' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileMoodCalendar
            entries={entries}
          />
        </Suspense>
      )}

      {currentScreen === 'dashboard' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileDashboard
            entries={entries}
            onBack={() => setCurrentScreen('home')}
            onLogMood={() => setCurrentScreen('mood-check-in')}
            onViewSuggestions={entries.length > 0 ? () => setCurrentScreen('ai-suggestions') : undefined}
          />
        </Suspense>
      )}

      {currentScreen === 'social' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileSocialBoard
            entries={entries.map((e: any) => ({ 
              ...e, 
              userName: e.userId === user!.email ? user!.name : 'Anonymous User',
              category: Math.random() > 0.5 ? 'Editing' : 'Leading'
            }))}
            onBack={() => setCurrentScreen('home')}
          />
        </Suspense>
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

      {currentScreen === 'mood-check-in' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileMoodCheckIn
            onSubmit={handleMoodSubmit}
            onBack={() => setCurrentScreen('home')}
          />
        </Suspense>
      )}

      {currentScreen === 'ai-suggestions' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileAISuggestions
            latestMood={latestMood.mood}
            moodLevel={latestMood.level}
            onAccept={handleAcceptSuggestion}
            onSkip={handleSkipSuggestion}
            onFindBuddy={() => setCurrentScreen('break-buddy')}
            onBack={() => setCurrentScreen('home')}
          />
        </Suspense>
      )}

      {currentScreen === 'break-buddy' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileBreakBuddy
            userName={user!.name}
            onBack={() => setCurrentScreen('ai-suggestions')}
            onRequestSent={handleBreakBuddyRequest}
          />
        </Suspense>
      )}

      {currentScreen === 'breathing' && (
        <Suspense fallback={<LoadingFallback />}>
          <MobileBreathing
            onComplete={() => {
              toast.success('Great session! You completed breathing exercises 🌬️');
              setCurrentScreen('home');
            }}
          />
        </Suspense>
      )}

      {/* Floating Action Button */}
      {showBottomNav && (
        <MobileFloatingAction onClick={() => setCurrentScreen('mood-check-in')} />
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
