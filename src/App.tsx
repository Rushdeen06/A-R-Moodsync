import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
// Build stamp injected at runtime for cache/version diagnostics
const BUILD_STAMP = `${new Date().toISOString()}|${import.meta.env?.MODE}|${(import.meta as any).env?.BASE_URL}`;
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DashboardScreen } from './screens/DashboardScreen';
import { AnalyticsScreen } from './screens/AnalyticsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SocialBoardScreen } from './screens/SocialBoardScreen';
import { BreathingScreen } from './screens/BreathingScreen';
import { TeamScreen } from './screens/TeamScreen';
import { ManagerScreen } from './screens/ManagerScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TeamsLayout } from './components/TeamsLayout';
import { MobileBottomNav } from './components/mobile/MobileBottomNav';
import { InstallPrompt } from './components/InstallPrompt';
import { Loader2 } from 'lucide-react';
import { Toaster, toast } from './components/ui/sonner';
import { api } from './utils/api';

const MobileLoginScreen = lazy(() => import('./components/mobile/MobileLoginScreen').then(m => ({ default: m.MobileLoginScreen })));
const MobileOnboarding = lazy(() => import('./components/mobile/MobileOnboarding').then(m => ({ default: m.MobileOnboarding })));

interface User { name: string; email: string; accessToken: string; }
interface MoodEntry { id: string; mood: string; note: string; timestamp: Date; intensity: number; category?: string; userName?: string; }

function AppInner() {
  useEffect(() => {
    console.log('[MoodSync] Build stamp:', BUILD_STAMP);
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('moodsync_user');
    const token = api.getAccessToken();
    if (saved && token) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.name && parsed?.email) {
          setUser({ ...parsed, accessToken: token });
          loadData();
        }
      } catch { localStorage.removeItem('moodsync_user'); }
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { entries: moodEntries } = await api.getMoodEntries();
      setEntries(moodEntries.map((e: any) => ({ ...e, timestamp: new Date(e.timestamp) })));
    } catch { toast.error('Failed to load data'); } finally { setLoading(false); }
  };

  useEffect(() => {
    if (user) {
      const { accessToken, ...data } = user;
      localStorage.setItem('moodsync_user', JSON.stringify(data));
    }
  }, [user]);

  const handleLogin = async (name: string, email: string, accessToken: string) => {
    setUser({ name, email, accessToken });
    if (!localStorage.getItem('moodsync_onboarding_complete')) setShowOnboarding(true);
    await loadData();
  };

  const handleOnboardingComplete = () => { localStorage.setItem('moodsync_onboarding_complete','true'); setShowOnboarding(false); };
  const handleLogout = () => { api.signout(); setUser(null); setEntries([]); localStorage.removeItem('moodsync_user'); navigate('/'); toast('Logged out'); };
  const handleMoodSubmit = async (mood: string, note: string) => {
    try { const map: Record<string,number>={great:5,good:4,okay:3,low:2,'very-low':1}; const intensity=map[mood]??3; const { entry }=await api.createMoodEntry(mood,note,intensity); setEntries(p=>[...p,{...entry,timestamp:new Date(entry.timestamp)}]); toast.success('Mood logged! 🎉'); } catch { toast.error('Save failed'); }
  };

  const currentStreak = useMemo(() => {
    if (!entries.length) return 0;
    const sorted=[...entries].sort((a,b)=>b.timestamp.getTime()-a.timestamp.getTime());
    let streak=0; const today=new Date(); today.setHours(0,0,0,0);
    for (const e of sorted){ const d=new Date(e.timestamp); d.setHours(0,0,0,0); const diff=Math.floor((today.getTime()-d.getTime())/86400000); if(diff===streak) streak++; else if(diff>streak) break; }
    return streak;
  },[entries]);

  if (showOnboarding && user) return <Suspense fallback={<div className='flex items-center justify-center min-h-screen'><Loader2 className='h-10 w-10 animate-spin'/></div>}><MobileOnboarding onComplete={handleOnboardingComplete} /></Suspense>;
  if (!user) return <Suspense fallback={<div className='flex items-center justify-center min-h-screen'><Loader2 className='h-10 w-10 animate-spin'/></div>}><MobileLoginScreen onLogin={handleLogin} /></Suspense>;
  if (loading) return <div className='flex items-center justify-center min-h-screen'><Loader2 className='h-12 w-12 animate-spin' /></div>;

  const path = location.pathname.replace(/^\//,'') || 'dashboard';
  const mainScreens = ['dashboard','analytics','history','insights','profile','social','team','manager','achievements','reports','settings'];
  const showBottomNav = mainScreens.includes(path);

  return (
    <>
      <Toaster />
      <div className='app-responsive-wrapper'>
        <div className='desktop-only'>
          <TeamsLayout userName={user!.name}>
            <Routes>
              <Route path='/' element={<DashboardScreen entries={entries} onSubmitMood={handleMoodSubmit} currentStreak={currentStreak} userName={user!.name} onNavigate={(s)=>navigate('/'+(s==='dashboard'?'':s))} />} />
              <Route path='/analytics' element={<AnalyticsScreen entries={entries} />} />
              <Route path='/history' element={<HistoryScreen entries={entries} />} />
              <Route path='/insights' element={<InsightsScreen entries={entries} />} />
              <Route path='/profile' element={<ProfileScreen userName={user!.name} userEmail={user!.email} totalEntries={entries.length} currentStreak={currentStreak} onLogout={handleLogout} entries={entries} />} />
              <Route path='/breathing' element={<BreathingScreen onComplete={()=>navigate('/')} />} />
              <Route path='/social' element={<SocialBoardScreen entries={entries} />} />
              <Route path='/team' element={<TeamScreen entries={entries} />} />
              <Route path='/manager' element={<ManagerScreen entries={entries} />} />
              <Route path='/achievements' element={<AchievementsScreen totalEntries={entries.length} currentStreak={currentStreak} entries={entries} />} />
              <Route path='/reports' element={<ReportsScreen entries={entries} userName={user!.name} currentStreak={currentStreak} />} />
              <Route path='/settings' element={<SettingsScreen entries={entries} userName={user!.name} currentStreak={currentStreak} currentMood={entries[0]?.mood || 'okay'} />} />
            </Routes>
          </TeamsLayout>
        </div>
        <div className='mobile-only'>
            <Route path='/team' element={<TeamScreen entries={entries} />} />
            <Route path='/manager' element={<ManagerScreen entries={entries} />} />
            <Route path='/achievements' element={<AchievementsScreen totalEntries={entries.length} currentStreak={currentStreak} entries={entries} />} />
            <Route path='/reports' element={<ReportsScreen entries={entries} userName={user!.name} currentStreak={currentStreak} />} />
            <Route path='/settings' element={<SettingsScreen entries={entries} userName={user!.name} currentStreak={currentStreak} currentMood={entries[0]?.mood || 'okay'} />} />
          <Routes>
            <Route path='/' element={<DashboardScreen entries={entries} onSubmitMood={handleMoodSubmit} currentStreak={currentStreak} userName={user!.name} onNavigate={(s)=>navigate('/'+(s==='dashboard'?'':s))} />} />
            <Route path='/analytics' element={<AnalyticsScreen entries={entries} />} />
            <Route path='/history' element={<HistoryScreen entries={entries} />} />
            <Route path='/insights' element={<InsightsScreen entries={entries} />} />
            <Route path='/profile' element={<ProfileScreen userName={user!.name} userEmail={user!.email} totalEntries={entries.length} currentStreak={currentStreak} onLogout={handleLogout} entries={entries} />} />
            <Route path='/breathing' element={<BreathingScreen onComplete={()=>navigate('/')} />} />
            <Route path='/social' element={<SocialBoardScreen entries={entries} />} />
          </Routes>
          {showBottomNav && <MobileBottomNav currentScreen={path} onNavigate={(s)=>navigate('/'+(s==='dashboard'?'':s))} />}
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
