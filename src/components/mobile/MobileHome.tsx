import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { TrendingUp, Flame, Calendar, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MobileHomeProps {
  userName: string;
  todaySuggestion: string;
  onLogMood: () => void;
  onViewSocial: () => void;
  totalEntries?: number;
  currentStreak?: number;
  weekMoodAverage?: number;
}

export function MobileHome({ 
  userName, 
  todaySuggestion, 
  onLogMood, 
  onViewSocial,
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
      className="min-h-screen"
      style={{ backgroundColor: '#fafafa' }}
    >
      {/* Teams-style Header Bar */}
      <div className="sticky top-0 z-30 px-4 lg:px-8 py-3" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold" style={{ color: '#252423' }}>
              Home
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: '#616161' }}>{greeting}, {userName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">

        {/* Quick Stats Cards - Teams Style */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-md p-4 border"
            style={{ backgroundColor: '#fff', borderColor: '#e0e0e0' }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFE6E6' }}>
                <Flame className="w-5 h-5" style={{ color: '#FF6B6B' }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-center mb-1" style={{ color: '#252423' }}>
              {currentStreak}
            </p>
            <p className="text-xs text-center" style={{ color: '#616161' }}>
              Day Streak
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-md p-4 border"
            style={{ backgroundColor: '#fff', borderColor: '#e0e0e0' }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F6F8' }}>
                <Calendar className="w-5 h-5" style={{ color: '#4FB3C5' }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-center mb-1" style={{ color: '#252423' }}>
              {totalEntries}
            </p>
            <p className="text-xs text-center" style={{ color: '#616161' }}>
              Logs Total
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-md p-4 border"
            style={{ backgroundColor: '#fff', borderColor: '#e0e0e0' }}
          >
            <div className="flex justify-center mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FFF5E1' }}>
                <TrendingUp className="w-5 h-5" style={{ color: '#FFB84D' }} />
              </div>
            </div>
            <p className="text-2xl text-center mb-1" style={{ color: '#252423' }}>
              {moodEmoji}
            </p>
            <p className="text-xs text-center" style={{ color: '#616161' }}>
              This Week
            </p>
          </motion.div>
        </div>

        {/* Main Check-in Card - Teams Style */}
        <motion.div 
          className="rounded-md p-6 border mb-6"
          style={{ backgroundColor: '#fff', borderColor: '#e0e0e0' }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" style={{ color: '#6264a7' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#252423' }}>
                How are you feeling?
              </h2>
            </div>
          </div>

          <p className="text-sm mb-6" style={{ color: '#616161' }}>
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

        {/* Today's Insight Card - Teams Style */}
        <motion.div 
          className="rounded-md p-5 border mb-6"
          style={{ backgroundColor: '#fff', borderColor: '#e0e0e0' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8F6F8' }}>
              <Sparkles className="w-4 h-4" style={{ color: '#6264a7' }} />
            </div>
            <h3 className="text-base font-semibold" style={{ color: '#252423' }}>
              Today's Insight
            </h3>
          </div>
          <p className="text-sm mb-3" style={{ color: '#616161' }}>
            {todaySuggestion}
          </p>
        </motion.div>

        {/* Quick Actions - Teams Style */}
        <div className="space-y-3">
          <motion.button
            onClick={onViewSocial}
            className="w-full flex items-center justify-between p-4 rounded-md border transition-all active:scale-98"
            style={{ backgroundColor: '#fff', borderColor: '#e0e0e0' }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                <Heart className="w-5 h-5" style={{ color: '#6264a7' }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: '#252423' }}>
                  Community Board
                </p>
                <p className="text-xs" style={{ color: '#616161' }}>
                  See what others are feeling
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#616161' }} />
          </motion.button>
        </div>
        </div>
      </div>
    </motion.div>
  );
}
