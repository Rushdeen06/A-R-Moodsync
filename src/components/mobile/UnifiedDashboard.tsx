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
    <div className="min-h-screen pb-24" style={{ backgroundColor: isDark ? '#1a1a1a' : '#E8F6F8' }}>
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="rounded-3xl p-6 mb-5 shadow-lg" style={{ background: isDark ? 'linear-gradient(135deg,#2D7A8B,#1a5f6f)' : 'linear-gradient(135deg,#4FB3C5,#2D7A8B)' }}>
          <h2 className="text-xl font-semibold mb-1 text-white">Welcome back, {userName.split(' ')[0]}</h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Log how you feel and track your progress.</p>
        </div>

        {/* Mood Logger */}
        <div className="rounded-3xl p-5 mb-6 shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>How are you feeling?</h3>
          <div className="flex justify-between gap-1 mb-4">
            {MOODS.map(m => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center flex-1 py-2 rounded-xl ${selectedMood === m.value ? 'ring-2 ring-offset-2 ring-[#4FB3C5]' : ''}`}
                style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-[10px] font-medium" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>{m.level}</span>
              </motion.button>
            ))}
          </div>
          <Textarea
            placeholder="Optional note..."
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full min-h-[90px] rounded-xl border-none resize-none mb-4"
            style={{ backgroundColor: isDark ? '#1a1a1a' : '#F5F8FA', color: isDark ? '#fff' : '#2D7A8B' }}
          />
          <Button
            disabled={!selectedMood}
            onClick={handleSubmit}
            className="w-full h-12 rounded-xl text-white font-semibold"
            style={{ backgroundColor: '#4FB3C5' }}
          >
            Log Mood
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <StatCard label="Total Logs" value={entries.length.toString()} icon={<Heart className="w-4 h-4" style={{ color: '#FF6B6B' }} />} isDark={isDark} />
          <StatCard label="Streak" value={currentStreak.toString()} icon={<Award className="w-4 h-4" style={{ color: '#FFB84D' }} />} isDark={isDark} />
          <StatCard label="Avg Mood" value={avgMood.toFixed(1)} icon={<Target className="w-4 h-4" style={{ color: '#4FB3C5' }} />} isDark={isDark} />
        </div>

        {/* Recent Entries */}
        <div className="rounded-3xl p-5 mb-6 shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>Recent Moods</h3>
          {recent.length === 0 && <p className="text-sm" style={{ color: isDark ? '#999' : '#2D7A8B' }}>No moods logged yet.</p>}
          <div className="space-y-3">
            {recent.map(r => (
              <div key={r.timestamp.getTime()} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {MOODS.find(m => m.value === r.mood)?.emoji || '🙂'}
                  </span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>{r.mood}</p>
                    {r.note && <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>{r.note.slice(0,40)}{r.note.length > 40 ? '…' : ''}</p>}
                  </div>
                </div>
                <span className="text-xs font-semibold" style={{ color: isDark ? '#FFB84D' : '#4FB3C5' }}>{r.intensity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder mini heatmap (future) */}
        <div className="rounded-3xl p-5 mb-8 shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
          <h3 className="text-lg font-semibold mb-3" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>This Week</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = new Date(); day.setDate(day.getDate() - (6 - i));
              const entry = entries.find(e => new Date(e.timestamp).toDateString() === day.toDateString());
              const intensity = entry?.intensity || 0;
              const color = intensity >= 4 ? '#4FB3C5' : intensity === 3 ? '#FFB84D' : intensity === 2 ? '#FF6B6B' : intensity === 1 ? '#C24141' : (isDark ? '#3d3d3d' : '#E8F6F8');
              return <div key={i} className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium" style={{ backgroundColor: color, color: '#fff' }}>{day.toLocaleDateString('en-US',{ weekday:'short'}).slice(0,1)}</div>;
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
