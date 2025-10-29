import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Heart, Target, Award, Sparkles, TrendingUp, Clock, Lightbulb, Wind } from 'lucide-react';
import { useTheme } from '../../utils/ThemeProvider';

interface UnifiedDashboardProps {
  entries: { mood: string; note: string; intensity: number; timestamp: Date }[];
  onSubmitMood: (mood: string, note: string) => void;
  currentStreak: number;
  userName: string;
  onNavigate?: (screen: string) => void;
}

const MOODS = [
  { emoji: '😊', label: 'Great', value: 'great', level: 5, bg: '#2d7A8B', color: '#7DD4A8' },
  { emoji: '🙂', label: 'Good', value: 'good', level: 4, bg: '#4FB3C5', color: '#4FB3C5' },
  { emoji: '😐', label: 'Okay', value: 'okay', level: 3, bg: '#FFB84D', color: '#FFB84D' },
  { emoji: '😔', label: 'Low', value: 'low', level: 2, bg: '#FF6B6B', color: '#FF6B6B' },
  { emoji: '😢', label: 'Very Low', value: 'very-low', level: 1, bg: '#C24141', color: '#FF6B6B' },
];

const QUICK_NOTES = [
  '💼 Work was productive',
  '🎯 Accomplished my goals',
  '😴 Feeling tired',
  '😊 Had a good day',
  '🏃 Exercised today',
  '👥 Great social time',
  '💭 Feeling reflective',
  '⚡ High energy',
];

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function UnifiedDashboard({ entries, onSubmitMood, currentStreak, userName, onNavigate }: UnifiedDashboardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');
  const [showQuickNotes, setShowQuickNotes] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const avgMood = entries.length === 0 ? 0 : entries.reduce((a, e) => a + (e.intensity || 3), 0) / entries.length;

  // Calculate insights
  const todayEntries = entries.filter(e => {
    const today = new Date();
    const entryDate = new Date(e.timestamp);
    return entryDate.toDateString() === today.toDateString();
  });

  const last7Days = entries.filter(e => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return e.timestamp >= weekAgo;
  });

  const weekAvg = last7Days.length > 0 ? last7Days.reduce((a, e) => a + e.intensity, 0) / last7Days.length : 0;
  const trend = weekAvg > avgMood ? 'up' : weekAvg < avgMood ? 'down' : 'stable';

  const handleSubmit = () => {
    if (!selectedMood) return;
    onSubmitMood(selectedMood, note.trim());
    setSelectedMood('');
    setNote('');
    setShowQuickNotes(false);
    setJustSubmitted(true);
    setTimeout(() => setJustSubmitted(false), 2000);
  };

  const handleQuickNote = (quickNote: string) => {
    setNote(prev => prev ? `${prev} • ${quickNote}` : quickNote);
    setShowQuickNotes(false);
  };

  const recent = [...entries].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0,5);

  return (
    <div className="min-h-screen pb-32 relative" style={{
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
        {/* Header with insights */}
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
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {todayEntries.length === 0 
              ? "Start your day by logging your mood!" 
              : `You've logged ${todayEntries.length} ${todayEntries.length === 1 ? 'entry' : 'entries'} today`}
          </p>
          
          {/* Week trend indicator */}
          {last7Days.length >= 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center gap-2 text-sm font-semibold"
              style={{ color: 'rgba(255,255,255,0.95)' }}
            >
              {trend === 'up' && (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>You're trending upward this week! 📈</span>
                </>
              )}
              {trend === 'down' && (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Keep going, better days ahead! 💪</span>
                </>
              )}
              {trend === 'stable' && (
                <>
                  <Target className="w-4 h-4" />
                  <span>You're staying consistent! 🎯</span>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Mood Logger with enhanced features */}
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B', letterSpacing: 0.2 }}>
              How are you feeling?
            </h3>
            {justSubmitted && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="flex items-center gap-1 text-sm font-semibold"
                style={{ color: '#7DD4A8' }}
              >
                <Sparkles className="w-4 h-4" />
                <span>Logged!</span>
              </motion.div>
            )}
          </div>

          {/* Mood buttons with intensity slider visual */}
          <div className="flex justify-between gap-2 mb-5">
            {MOODS.map(m => {
              const isSelected = selectedMood === m.value;
              return (
                <motion.button
                  whileTap={{ scale: 1.15 }}
                  whileHover={{ scale: 1.08 }}
                  key={m.value}
                  onClick={() => setSelectedMood(m.value)}
                  aria-label={`Select ${m.label} mood`}
                  aria-pressed={isSelected}
                  role="button"
                  tabIndex={0}
                  className={`flex flex-col items-center flex-1 py-3 rounded-2xl shadow-md transition-all duration-200 relative overflow-hidden`}
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${m.bg} 60%, ${m.color}40 100%)`
                      : `linear-gradient(135deg, ${m.bg}aa 60%, #fff0 100%)`,
                    boxShadow: isSelected
                      ? `0 6px 24px 0 ${m.color}44, 0 0 0 3px ${m.color}33`
                      : '0 2px 8px 0 rgba(80, 180, 197, 0.08)',
                    border: isSelected
                      ? `2px solid ${m.color}`
                      : '1.5px solid #e8f6f844',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 22,
                    cursor: 'pointer',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: 'all 0.18s cubic-bezier(.4,2,.6,1)'
                  }}
                >
                  <span className="text-3xl mb-1 drop-shadow-lg">{m.emoji}</span>
                  <span className="text-xs font-bold tracking-wide" style={{ color: isSelected ? m.color : '#fff' }}>
                    {m.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                      style={{ background: m.color }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Note area with quick notes */}
          <div className="relative mb-4">
            <Textarea
              placeholder="Add a quick note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
              aria-label="Add optional note about your mood"
              className="w-full min-h-[90px] rounded-xl border-none resize-none text-base font-medium"
              style={{ 
                backgroundColor: isDark ? '#232946' : '#F5F8FA', 
                color: isDark ? '#fff' : '#2D7A8B', 
                boxShadow: '0 1px 4px 0 #0001',
                paddingRight: '45px'
              }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowQuickNotes(!showQuickNotes)}
              aria-label={showQuickNotes ? "Hide quick note suggestions" : "Show quick note suggestions"}
              aria-expanded={showQuickNotes}
              className="absolute right-3 top-3 p-2 rounded-lg"
              style={{
                backgroundColor: isDark ? '#2d3748' : '#E8F6F8',
                color: isDark ? '#4FB3C5' : '#2D7A8B'
              }}
            >
              <Lightbulb className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Quick notes suggestions */}
          {showQuickNotes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="flex flex-wrap gap-2 p-3 rounded-xl" style={{
                backgroundColor: isDark ? '#232946' : '#F5F8FA'
              }}>
                {QUICK_NOTES.map((qn, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickNote(qn)}
                    aria-label={`Add quick note: ${qn}`}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: isDark ? '#2d3748' : 'white',
                      color: isDark ? '#4FB3C5' : '#2D7A8B',
                      border: `1px solid ${isDark ? '#4FB3C533' : '#4FB3C522'}`
                    }}
                  >
                    {qn}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <Button
            disabled={!selectedMood}
            onClick={handleSubmit}
            aria-label={selectedMood ? "Submit mood entry" : "Please select a mood first"}
            className="w-full h-14 rounded-xl text-white font-semibold text-lg shadow-lg transition-all"
            style={{ 
              background: selectedMood 
                ? 'linear-gradient(90deg,#4FB3C5,#2D7A8B)' 
                : isDark ? '#2d3748' : '#E0E0E0',
              border: 'none',
              opacity: selectedMood ? 1 : 0.5,
              cursor: selectedMood ? 'pointer' : 'not-allowed'
            }}
          >
            {selectedMood ? '✨ Log Mood' : '👆 Select a mood first'}
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <StatCard label="Total Logs" value={entries.length.toString()} icon={<Heart className="w-5 h-5" style={{ color: '#FF6B6B' }} />} isDark={isDark} />
          <StatCard label="Streak" value={currentStreak.toString()} icon={<Award className="w-5 h-5" style={{ color: '#FFB84D' }} />} isDark={isDark} />
          <StatCard label="Avg Mood" value={avgMood.toFixed(1)} icon={<Target className="w-5 h-5" style={{ color: '#4FB3C5' }} />} isDark={isDark} />
        </div>

        {/* Quick Actions */}
        {onNavigate && (
          <motion.button
            onClick={() => onNavigate('breathing')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl p-5 mb-6 shadow-lg flex items-center justify-between"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #9B7FD8 0%, #7B5FC5 100%)'
                : 'linear-gradient(135deg, #B8A4E8 0%, #9B7FD8 100%)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-lg">Breathing Exercise</p>
                <p className="text-white text-opacity-90 text-sm">Take a mindful break</p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-white text-opacity-80" />
          </motion.button>
        )}

        {/* Recent Entries with enhanced info */}
        <div className="rounded-3xl p-5 mb-7 shadow-xl" style={{
          background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
        }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>Recent Moods</h3>
            {recent.length > 0 && (
              <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{
                backgroundColor: isDark ? '#2d3748' : '#E8F6F8',
                color: isDark ? '#4FB3C5' : '#2D7A8B'
              }}>
                {recent.length} latest
              </span>
            )}
          </div>
          {recent.length === 0 && (
            <div className="text-center py-6">
              <p className="text-base font-medium mb-2" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                No moods logged yet
              </p>
              <p className="text-xs" style={{ color: isDark ? '#666' : '#C9E7F2' }}>
                Start by selecting a mood above! 👆
              </p>
            </div>
          )}
          <div className="space-y-3">
            {recent.map((r, idx) => {
              const moodColor = MOODS.find(m => m.value === r.mood)?.color || '#4FB3C5';
              const timeAgo = getTimeAgo(r.timestamp);
              return (
                <motion.div 
                  key={r.timestamp.getTime()}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl shadow-sm" 
                  style={{ 
                    background: isDark ? 'rgba(61,61,61,0.7)' : '#F5F8FA',
                    border: `1px solid ${moodColor}22`
                  }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{
                      backgroundColor: `${moodColor}22`,
                      border: `2px solid ${moodColor}44`
                    }}>
                      {MOODS.find(m => m.value === r.mood)?.emoji || '🙂'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-base font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                          {r.mood.charAt(0).toUpperCase() + r.mood.slice(1)}
                        </p>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{
                          backgroundColor: moodColor,
                          color: 'white'
                        }}>
                          {r.intensity}/5
                        </span>
                      </div>
                      {r.note && (
                        <p className="text-sm mb-1" style={{ color: isDark ? '#ccc' : '#555' }}>
                          {r.note.slice(0,50)}{r.note.length > 50 ? '…' : ''}
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Placeholder mini heatmap (future) */}
        <div className="rounded-3xl p-5 mb-16 shadow-xl" style={{
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
