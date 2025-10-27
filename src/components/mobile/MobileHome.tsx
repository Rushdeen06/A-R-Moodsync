import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Menu, Search, ArrowRight } from 'lucide-react';

interface MobileHomeProps {
  userName: string;
  todaySuggestion: string;
  onLogMood: () => void;
  onViewSocial: () => void;
  onMenuClick: () => void;
}

export function MobileHome({ 
  userName, 
  todaySuggestion, 
  onLogMood, 
  onViewSocial,
  onMenuClick 
}: MobileHomeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen p-6"
      style={{ backgroundColor: '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl" style={{ color: '#2D7A8B' }}>
            A&R MoodSync
          </h1>
          <button onClick={onMenuClick} className="p-2">
            <Menu className="w-6 h-6" style={{ color: '#2D7A8B' }} />
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">
          <div className="mb-8">
            <h2 className="text-3xl mb-2" style={{ color: '#2D7A8B' }}>
              Hi {userName},
            </h2>
            <p className="text-2xl" style={{ color: '#2D7A8B' }}>
              how are you
            </p>
            <p className="text-2xl" style={{ color: '#2D7A8B' }}>
              feeling today?
            </p>
          </div>

          <Button
            onClick={onLogMood}
            className="w-full h-14 rounded-xl text-white text-lg mb-8"
            style={{ backgroundColor: '#4FB3C5' }}
          >
            Log Mood
          </Button>

          <div className="mb-4">
            <h3 className="text-lg mb-3" style={{ color: '#2D7A8B' }}>
              Today's Suggestion
            </h3>
            <p className="text-base mb-4" style={{ color: '#2D7A8B' }}>
              {todaySuggestion}
            </p>
          </div>

          <Button
            onClick={onViewSocial}
            variant="outline"
            className="w-full h-14 rounded-xl text-lg border-2"
            style={{ 
              backgroundColor: '#E8DFF5',
              borderColor: '#E8DFF5',
              color: '#2D7A8B'
            }}
          >
            View Social Board
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
