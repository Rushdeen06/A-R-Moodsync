import { useTheme } from '../../utils/ThemeProvider';
import { Heart, Coffee, Activity, Brain } from 'lucide-react';
import { motion } from 'motion/react';

interface WellbeingSummaryProps {
  moodAverage: number; // 1-5
  streak: number;
  breakCountToday: number;
  focusMinutes: number;
}

export function WellbeingSummary({ moodAverage, streak, breakCountToday, focusMinutes }: WellbeingSummaryProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const avgLabel = moodAverage >= 4 ? 'Positive' : moodAverage >= 3 ? 'Stable' : 'Low';
  return (
    <div className="rounded-3xl p-5 mb-6" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>Wellbeing Summary</h3>
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard
          icon={<Heart className="w-5 h-5" style={{ color: '#FF6B6B' }} />}
          label="Avg Mood"
          value={moodAverage.toFixed(1)}
          sub={avgLabel}
          isDark={isDark}
        />
        <SummaryCard
          icon={<Activity className="w-5 h-5" style={{ color: '#4FB3C5' }} />}
          label="Focus (min)"
          value={focusMinutes.toString()}
          sub={focusMinutes >= 50 ? 'Great Focus' : focusMinutes >= 25 ? 'Steady' : 'Needs Breaks'}
          isDark={isDark}
        />
        <SummaryCard
          icon={<Coffee className="w-5 h-5" style={{ color: '#FFB84D' }} />}
          label="Breaks"
          value={breakCountToday.toString()}
          sub={breakCountToday >= 4 ? 'Well Balanced' : breakCountToday >= 2 ? 'Keep Going' : 'Take a Pause'}
          isDark={isDark}
        />
        <SummaryCard
          icon={<Brain className="w-5 h-5" style={{ color: '#7DD4A8' }} />}
          label="Streak"
          value={streak.toString()}
          sub={streak >= 7 ? 'Strong Routine' : streak >= 3 ? 'Forming Habit' : 'Start Today'}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, sub, isDark }: { icon: React.ReactNode; label: string; value: string; sub: string; isDark: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA' }}>
      <div className="flex items-center gap-3 mb-2">{icon}
        <p className="text-xs font-medium" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>{label}</p>
      </div>
      <p className="text-xl font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>{value}</p>
      <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>{sub}</p>
    </motion.div>
  );
}
