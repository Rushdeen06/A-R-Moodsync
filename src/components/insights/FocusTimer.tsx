import { useTheme } from '../../utils/ThemeProvider';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface FocusTimerProps {
  defaultMinutes?: number;
  onSessionComplete?: (minutes: number) => void;
  onSessionCancel?: () => void;
}

export function FocusTimer({ defaultMinutes = 25, onSessionComplete, onSessionCancel }: FocusTimerProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const totalSecondsInitial = defaultMinutes * 60;
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (prev === 0) {
            setMinutes(m => m - 1);
            return 59;
          }
          return prev - 1;
        });
        setElapsed(e => e + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running]);

  useEffect(() => {
    if (minutes < 0) {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      setRunning(false);
      setMinutes(0); setSeconds(0);
      if (onSessionComplete) onSessionComplete(defaultMinutes);
    }
  }, [minutes, onSessionComplete, defaultMinutes]);

  const progress = Math.min(elapsed / totalSecondsInitial, 1);

  const handleReset = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setRunning(false);
    setMinutes(defaultMinutes);
    setSeconds(0);
    setElapsed(0);
    if (onSessionCancel) onSessionCancel();
  };

  return (
    <div className="rounded-3xl p-5 mb-6" style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>Focus Timer</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" stroke={isDark ? '#3d3d3d' : '#E8F6F8'} strokeWidth="8" fill="none" />
            <circle
              cx="50" cy="50" r="45"
              stroke="#4FB3C5"
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={(1 - progress) * 2 * Math.PI * 45}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fontSize="18" fill={isDark ? '#fff' : '#2D7A8B'}>
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </text>
          </svg>
        </div>
        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setRunning(r => !r)} className="px-4 py-2 rounded-xl font-medium flex items-center gap-2" style={{ backgroundColor: running ? '#FFB84D' : '#4FB3C5', color: 'white' }}>
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? 'Pause' : 'Start'}
          </motion.button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleReset} className="px-4 py-2 rounded-xl font-medium flex items-center gap-2" style={{ backgroundColor: isDark ? '#3d3d3d' : '#F5F8FA', color: isDark ? '#fff' : '#2D7A8B' }}>
            <RotateCcw className="w-4 h-4" /> Reset
          </motion.button>
        </div>
      </div>
    </div>
  );
}
