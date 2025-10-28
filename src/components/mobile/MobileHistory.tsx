import { useTheme } from '../../utils/ThemeProvider';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useState } from 'react';

interface MobileHistoryProps {
  entries: { mood: string; note: string; intensity: number; timestamp: Date }[];
}

export function MobileHistory({ entries }: MobileHistoryProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get current month calendar days
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const calendarDays = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getEntryForDay = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    return entries.find(e => {
      const entryDate = new Date(e.timestamp);
      return entryDate.toDateString() === date.toDateString();
    });
  };

  const selectedEntry = selectedDate ? entries.find(e => 
    new Date(e.timestamp).toDateString() === selectedDate.toDateString()
  ) : null;

  return (
    <div className="min-h-screen pb-24 relative" style={{
      background: isDark
        ? 'linear-gradient(135deg, #181c2b 0%, #232946 100%)'
        : 'linear-gradient(135deg, #E8F6F8 0%, #C9E7F2 100%)',
    }}>
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
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">History</h2>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="rounded-3xl p-6 mb-6 shadow-xl" style={{
          background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
        }}>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-bold" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              if (!day) return <div key={idx} />;
              
              const entry = getEntryForDay(day);
              const isToday = day === today.getDate();
              const date = new Date(currentYear, currentMonth, day);
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedDate(date)}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center relative"
                  style={{
                    background: entry 
                      ? entry.intensity >= 4 ? '#7DD4A8' : entry.intensity === 3 ? '#FFB84D' : '#FF6B6B'
                      : isDark ? '#232946' : '#F5F8FA',
                    border: isSelected ? '2px solid #4FB3C5' : isToday ? '2px solid #FFB84D' : 'none',
                    boxShadow: isSelected ? '0 4px 12px #4fb3c544' : 'none'
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: entry ? 'white' : isDark ? '#fff' : '#2D7A8B' }}>
                    {day}
                  </span>
                  {entry && (
                    <span className="text-xs mt-1">
                      {entry.intensity >= 4 ? '😊' : entry.intensity === 3 ? '😐' : '😔'}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Selected Entry Details */}
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 mb-8 shadow-xl"
            style={{
              background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
              boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
              backdropFilter: 'blur(10px)',
              border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
            }}
          >
            <h3 className="text-lg font-bold mb-3" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              Entry Details
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">
                {selectedEntry.intensity >= 4 ? '😊' : selectedEntry.intensity === 3 ? '😐' : selectedEntry.intensity === 2 ? '😔' : '😢'}
              </span>
              <div className="flex-1">
                <p className="text-xl font-bold mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                  {selectedEntry.mood.charAt(0).toUpperCase() + selectedEntry.mood.slice(1)}
                </p>
                <div className="flex items-center gap-2 text-sm" style={{ color: isDark ? '#bbb' : '#A8C9C7' }}>
                  <Clock className="w-4 h-4" />
                  <span>{new Date(selectedEntry.timestamp).toLocaleString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              <span className="text-lg font-bold px-4 py-2 rounded-full" style={{
                backgroundColor: selectedEntry.intensity >= 4 ? '#7DD4A8' : selectedEntry.intensity === 3 ? '#FFB84D' : '#FF6B6B',
                color: 'white'
              }}>
                {selectedEntry.intensity}/5
              </span>
            </div>
            {selectedEntry.note && (
              <div className="p-4 rounded-xl" style={{ background: isDark ? '#232946' : '#F5F8FA' }}>
                <p className="text-sm font-medium" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>
                  {selectedEntry.note}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Legend */}
        <div className="rounded-3xl p-5 mb-8 shadow-xl" style={{
          background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
        }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: '#7DD4A8' }} />
              <span className="text-xs" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>Great/Good mood (4-5)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: '#FFB84D' }} />
              <span className="text-xs" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>Okay mood (3)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: '#FF6B6B' }} />
              <span className="text-xs" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>Low mood (1-2)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
