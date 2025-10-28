import { motion } from 'motion/react';
import { Calendar as CalendarIcon, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../utils/ThemeProvider';

interface MoodEntry {
  mood: string;
  timestamp: Date;
  note: string;
  intensity: number;
}

interface MobileMoodCalendarProps {
  entries: MoodEntry[];
}

const MOOD_COLORS: Record<string, string> = {
  'great': '#7DD4A8',
  'good': '#9DD4C7',
  'okay': '#FFB84D',
  'low': '#FFA07A',
  'very-low': '#FF6B6B',
};

const MOOD_EMOJIS: Record<string, string> = {
  'great': '😄',
  'good': '😊',
  'okay': '😐',
  'low': '😔',
  'very-low': '😢',
};

export function MobileMoodCalendar({ entries }: MobileMoodCalendarProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = entry.timestamp.toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, MoodEntry[]>);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDayEntries = (day: number) => {
    const date = new Date(year, month, day).toISOString().split('T')[0];
    return entriesByDate[date] || [];
  };

  const getDayColor = (day: number) => {
    const dayEntries = getDayEntries(day);
  if (dayEntries.length === 0) return isDark ? '#2d2d2d' : '#F5F8FA';
    
    // Get average mood for the day
    const avgIntensity = dayEntries.reduce((sum, e) => sum + e.intensity, 0) / dayEntries.length;
    if (avgIntensity >= 4.5) return MOOD_COLORS['great'];
    if (avgIntensity >= 3.5) return MOOD_COLORS['good'];
    if (avgIntensity >= 2.5) return MOOD_COLORS['okay'];
    if (avgIntensity >= 1.5) return MOOD_COLORS['low'];
    return MOOD_COLORS['very-low'];
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pb-20"
  style={{ backgroundColor: isDark ? '#1a1a1a' : '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#4FB3C5' }}
            >
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              Mood History
            </h2>
          </div>
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: isDark ? '#3d3d3d' : '#D4E9F1' }}
          >
            <TrendingUp className="w-5 h-5" style={{ color: '#4FB3C5' }} />
          </div>
        </div>

        {/* Calendar */}
  <div className="rounded-3xl p-6 mb-6 shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={handlePrevMonth} className="p-2">
              <ChevronLeft className="w-5 h-5" style={{ color: isDark ? '#4FB3C5' : '#2D7A8B' }} />
            </button>
            <h3 className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              {monthNames[month]} {year}
            </h3>
            <button onClick={handleNextMonth} className="p-2">
              <ChevronRight className="w-5 h-5" style={{ color: isDark ? '#4FB3C5' : '#2D7A8B' }} />
            </button>
          </div>

          {/* Day Labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <div key={day} className="text-center text-xs" style={{ color: '#4FB3C5' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEntries = getDayEntries(day);
              const hasEntries = dayEntries.length > 0;
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

              return (
                <motion.button
                  key={day}
                  onClick={() => hasEntries && setSelectedEntry(dayEntries[0])}
                  className="aspect-square rounded-xl flex items-center justify-center text-sm relative"
                  style={{
                    backgroundColor: getDayColor(day),
                    border: isToday ? '2px solid #4FB3C5' : 'none',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span style={{ color: hasEntries ? 'white' : (isDark ? '#666' : '#A8C9C7') }}>
                    {day}
                  </span>
                  {dayEntries.length > 1 && (
                    <div 
                      className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="rounded-3xl p-6 mb-6 shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
          <h3 className="text-sm mb-4 font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
            Mood Legend
          </h3>
          <div className="space-y-3">
            {Object.entries(MOOD_COLORS).map(([mood, color]) => (
              <div key={mood} className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: color }}
                >
                  {MOOD_EMOJIS[mood]}
                </div>
                <span className="text-sm capitalize" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>
                  {mood.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Entry Detail */}
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 shadow-sm"
            style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg mb-1 font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                  {selectedEntry.timestamp.toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </h3>
                <p className="text-sm capitalize" style={{ color: '#4FB3C5' }}>
                  {selectedEntry.mood.replace('-', ' ')} mood
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: MOOD_COLORS[selectedEntry.mood] }}
              >
                {MOOD_EMOJIS[selectedEntry.mood]}
              </div>
            </div>
            {selectedEntry.note && (
              <p className="text-sm" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>
                {selectedEntry.note}
              </p>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {entries.length === 0 && (
          <div className="rounded-3xl p-12 text-center shadow-sm" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8F6F8' }}
            >
              <CalendarIcon className="w-10 h-10" style={{ color: isDark ? '#666' : '#A8C9C7' }} />
            </div>
            <h3 className="text-lg mb-2 font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              No Mood History Yet
            </h3>
            <p className="text-sm" style={{ color: isDark ? '#999' : '#4FB3C5' }}>
              Start logging your moods to see your history here
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
