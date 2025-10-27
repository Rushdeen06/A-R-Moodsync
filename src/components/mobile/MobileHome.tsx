import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Menu, TrendingUp, Flame, Calendar, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MobileHomeProps {
  userName: string;
  todaySuggestion: string;
  onLogMood: () => void;
  onViewSocial: () => void;
  onMenuClick: () => void;
  totalEntries?: number;
  currentStreak?: number;
  weekMoodAverage?: number;
}

export function MobileHome({ 
  userName, 
  todaySuggestion, 
  onLogMood, 
  onViewSocial,
  onMenuClick,
  totalEntries = 0,
  currentStreak = 0,
  weekMoodAverage = 3.5
}: MobileHomeProps) {
  const [greeting, setGreeting] = useState('');
  const [motivationalQuote, setMotivationalQuote] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }

    const quotes = [
      'Every day is a fresh start',
      'Your feelings are valid',
      'Small steps lead to big changes',
      'You\'re doing better than you think',
      'Progress, not perfection',
    ];
    setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const moodEmoji = weekMoodAverage >= 4 ? '😊' : weekMoodAverage >= 3 ? '🙂' : '😐';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 pb-24"
      style={{ backgroundColor: '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm" style={{ color: '#4FB3C5' }}>{greeting}</p>
            <h1 className="text-2xl font-semibold" style={{ color: '#2D7A8B' }}>
              {userName}
            </h1>
          </div>
          <button 
            onClick={onMenuClick} 
            className="p-2.5 rounded-full transition-all active:scale-95"
            style={{ backgroundColor: 'white' }}
          >
            <Menu className="w-5 h-5" style={{ color: '#2D7A8B' }} />
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFE6E6' }}>
                <Flame className="w-5 h-5" style={{ color: '#FF6B6B' }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-center mb-1" style={{ color: '#2D7A8B' }}>
              {currentStreak}
            </p>
            <p className="text-xs text-center" style={{ color: '#A8C9C7' }}>
              Day Streak
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F6F8' }}>
                <Calendar className="w-5 h-5" style={{ color: '#4FB3C5' }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-center mb-1" style={{ color: '#2D7A8B' }}>
              {totalEntries}
            </p>
            <p className="text-xs text-center" style={{ color: '#A8C9C7' }}>
              Logs Total
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF5E1' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#FFB84D' }} />
              </div>
            </div>
            <p className="text-2xl text-center mb-1" style={{ color: '#2D7A8B' }}>
              {moodEmoji}
            </p>
            <p className="text-xs text-center" style={{ color: '#A8C9C7' }}>
              This Week
            </p>
          </motion.div>
        </div>

        {/* Main Check-in Card */}
        <motion.div 
          className="bg-gradient-to-br from-white to-[#F5FBFC] rounded-3xl p-6 shadow-md mb-4"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" style={{ color: '#FF6B6B' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#2D7A8B' }}>
                How are you feeling?
              </h2>
            </div>
          </div>

          <p className="text-sm mb-6" style={{ color: '#4FB3C5' }}>
            {motivationalQuote}
          </p>

          <Button
            onClick={onLogMood}
            className="w-full h-14 rounded-xl text-white text-lg font-semibold shadow-lg transition-all active:scale-95"
            style={{ backgroundColor: '#4FB3C5' }}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Check In Now
          </Button>
        </motion.div>

        {/* Today's Insight Card */}
        <motion.div 
          className="bg-white rounded-3xl p-5 shadow-sm mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F6F8' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#4FB3C5' }} />
            </div>
            <h3 className="text-base font-semibold" style={{ color: '#2D7A8B' }}>
              Today's Insight
            </h3>
          </div>
          <p className="text-sm mb-3" style={{ color: '#4A7B78' }}>
            {todaySuggestion}
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <motion.button
            onClick={onViewSocial}
            className="w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-98"
            style={{ backgroundColor: 'white' }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                <Heart className="w-5 h-5" style={{ color: '#9B7FD8' }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: '#2D7A8B' }}>
                  Community Board
                </p>
                <p className="text-xs" style={{ color: '#A8C9C7' }}>
                  See what others are feeling
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#A8C9C7' }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
