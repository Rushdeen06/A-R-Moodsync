import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Heart, Target, Award } from 'lucide-react';
import { useTheme } from '../../utils/ThemeProvider';

interface UnifiedDashboardProps {
  entries: { mood: string; note: string; intensity: number; timestamp: Date }[];
  onSubmitMood: (mood: string, note: string) => void;
  currentStreak: number;
  userName: string;
}

const MOODS = [
  { emoji: '\ud83d\ude0a', label: 'Great', value: 'great', level: 5, bg: '#2d7A8B' },
  { emoji: '\ud83d\ude42', label: 'Good', value: 'good', level: 4, bg: '#4FB3C5' },
  { emoji: '\ud83d\ude10', label: 'Okay', value: 'okay', level: 3, bg: '#FFB84D' },
  { emoji: '\ud83d\ude14', label: 'Low', value: 'low', level: 2, bg: '#FF6B6B' },
  { emoji: '\ud83d\ude22', label: 'Very Low', value: 'very-low', level: 1, bg: '#C24141' },
];

export function UnifiedDashboard({ entries, onSubmitMood, currentStreak, userName }: UnifiedDashboardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');

  const avgMood = entries.length === 0 ? 0 : entries.reduce((a, e) => a + (e.intensity || 3), 0) / entries.length;

  const handleSubmit = () => {
    if (!selectedMood) return;
    onSubmitMood(selectedMood, note.trim());
    setSelectedMood('');
    setNote('');
  };

  const recent = [...entries].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0,5);

  return (
    <div className="min-h-screen pb-24 relative" style={{
      background: isDark
        ? 'linear-gradient(135deg, #181c2b 0%, #232946 100%)'
        : 'linear-gradient(135deg, #E8F6F8 0%, #C9E7F2 100%)',
      overflow: 'hidden'
    }}>
      {/* Animated blurred background shape */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '-80px',
        width: '340px',
        height: '340px',
        background: isDark
          ? 'radial-gradient(circle at 60% 40%, #4FB3C5 0%, #232946 80%)'
          : 'radial-gradient(circle at 60% 40%, #4FB3C5 0%, #E8F6F8 80%)',
        filter: 'blur(80px)',
        opacity: 0.5,
        zIndex: 0
      }} />
      <div className="max-w-md mx-auto p-4 relative z-10">
        {/* Header */}
        <div className="rounded-3xl p-6 mb-5 shadow-lg" style={{
          background: isDark
            ? 'linear-gradient(135deg,#2D7A8B,#1a5f6f)'
            : 'linear-gradient(135deg,#4FB3C5,#2D7A8B)',
          boxShadow: isDark
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            : '0 8px 32px 0 rgba(80, 180, 197, 0.15)',
          backdropFilter: 'blur(8px)',
          border: isDark ? '1.5px solid #2d7a8b44' : '1.5px solid #4fb3c544',
        }}>
          <h2 className="text-2xl font-bold mb-1 text-white drop-shadow-lg">Welcome back, {userName.split(' ')[0]}</h2>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Log how you feel and track your progress.</p>
        </div>

        {/* Mood Logger */}
        <div className="rounded-3xl p-6 mb-6 shadow-xl" style={{
          background: isDark
            ? 'rgba(45, 55, 72, 0.85)'
            : 'rgba(255,255,255,0.85)',
          boxShadow: isDark
            ? '0 4px 24px 0 rgba(31, 38, 135, 0.18)'
            : '0 4px 24px 0 rgba(80, 180, 197, 0.10)',
          backdropFilter: 'blur(12px)',
          border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
        }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: isDark ? '#fff' : '#2D7A8B', letterSpacing: 0.2 }}>How are you feeling?</h3>
          <div className="flex justify-between gap-2 mb-5">
            {MOODS.map(m => (
              <motion.button
                whileTap={{ scale: 1.15 }}
                whileHover={{ scale: 1.08 }}
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center flex-1 py-3 rounded-2xl shadow-md transition-all duration-200 ${selectedMood === m.value ? 'ring-4 ring-[#4FB3C5] scale-105' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${m.bg} 60%, #fff0 100%)`,
                  boxShadow: selectedMood === m.value
                    ? '0 4px 24px 0 #4FB3C544'
                    : '0 2px 8px 0 rgba(80, 180, 197, 0.08)',
                  border: selectedMood === m.value
                    ? '2px solid #4FB3C5'
                    : '1.5px solid #e8f6f8',
                  color: isDark ? '#fff' : '#2D7A8B',
                  fontWeight: 600,
                  fontSize: 22,
                  cursor: 'pointer',
                  transition: 'all 0.18s cubic-bezier(.4,2,.6,1)'
                }}
              >
                <span className="text-3xl mb-1 drop-shadow-lg">{m.emoji}</span>
                <span className="text-xs font-bold tracking-wide" style={{ color: selectedMood === m.value ? '#4FB3C5' : isDark ? '#fff' : '#2D7A8B' }}>{m.label}</span>
              </motion.button>
            ))}
          </div>
          <Textarea
            placeholder="Add a quick note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full min-h-[90px] rounded-xl border-none resize-none mb-4 text-base font-medium"
            style={{ backgroundColor: isDark ? '#232946' : '#F5F8FA', color: isDark ? '#fff' : '#2D7A8B', boxShadow: '0 1px 4px 0 #0001' }}
          />
          <Button
            disabled={!selectedMood}
            onClick={handleSubmit}
            className="w-full h-14 rounded-xl text-white font-semibold text-lg shadow-lg"
            style={{ background: 'linear-gradient(90deg,#4FB3C5,#2D7A8B)', border: 'none' }}
          >
            Log Mood
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-7">
          <StatCard label="Total Logs" value={entries.length.toString()} icon={<Heart className="w-5 h-5" style={{ color: '#FF6B6B' }} />} isDark={isDark} />
          <StatCard label="Streak" value={currentStreak.toString()} icon={<Award className="w-5 h-5" style={{ color: '#FFB84D' }} />} isDark={isDark} />
          <StatCard label="Avg Mood" value={avgMood.toFixed(1)} icon={<Target className="w-5 h-5" style={{ color: '#4FB3C5' }} />} isDark={isDark} />
        </div>

        {/* Recent Entries */}
        <div className="rounded-3xl p-5 mb-7 shadow-xl" style={{
          background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
        }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>Recent Moods</h3>
          {recent.length === 0 && <p className="text-base font-medium" style={{ color: isDark ? '#999' : '#2D7A8B' }}>No moods logged yet.</p>}
          <div className="space-y-3">
            {recent.map(r => (
              <div key={r.timestamp.getTime()} className="flex items-center justify-between p-3 rounded-xl shadow-sm" style={{ background: isDark ? 'rgba(61,61,61,0.7)' : '#F5F8FA', color: isDark ? '#fff' : '#2D7A8B' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {MOODS.find(m => m.value === r.mood)?.emoji || '🙂'}
                  </span>
                  <div>
                    <p className="text-base font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>{r.mood.charAt(0).toUpperCase() + r.mood.slice(1)}</p>
                    {r.note && <p className="text-xs" style={{ color: isDark ? '#bbb' : '#A8C9C7' }}>{r.note.slice(0,40)}{r.note.length > 40 ? '…' : ''}</p>}
                  </div>
                </div>
                <span className="text-xs font-bold" style={{ color: isDark ? '#FFB84D' : '#4FB3C5' }}>{r.intensity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder mini heatmap (future) */}
        <div className="rounded-3xl p-5 mb-8 shadow-xl" style={{
          background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
        }}>
          <h3 className="text-lg font-bold mb-3" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>This Week</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = new Date(); day.setDate(day.getDate() - (6 - i));
              const entry = entries.find(e => new Date(e.timestamp).toDateString() === day.toDateString());
              const intensity = entry?.intensity || 0;
              const color = intensity >= 4 ? '#4FB3C5' : intensity === 3 ? '#FFB84D' : intensity === 2 ? '#FF6B6B' : intensity === 1 ? '#C24141' : (isDark ? '#232946' : '#E8F6F8');
              return <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shadow-sm" style={{ backgroundColor: color, color: '#fff', opacity: intensity ? 1 : 0.5 }}>{day.toLocaleDateString('en-US',{ weekday:'short'}).slice(0,1)}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, isDark }: { label: string; value: string; icon: React.ReactNode; isDark: boolean }) {
  return (
    <div className="p-4 rounded-2xl shadow-sm flex flex-col items-center" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}>{icon}</div>
      <p className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide" style={{ color: isDark ? '#999' : '#A8C9C7' }}>{label}</p>
    </div>
  );
}
