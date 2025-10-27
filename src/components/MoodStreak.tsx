import { Card, CardContent } from './ui/card';
import { Flame, Trophy, Target } from 'lucide-react';
import { motion } from 'motion/react';

interface MoodStreakProps {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
}

export function MoodStreak({ currentStreak, longestStreak, totalEntries }: MoodStreakProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="pt-4 pb-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: currentStreak > 0 ? Infinity : 0, repeatDelay: 2 }}
            className="flex justify-center mb-2"
          >
            <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-full p-3">
              <Flame className="h-5 w-5 text-white" />
            </div>
          </motion.div>
          <p className="text-center text-2xl mb-1">{currentStreak}</p>
          <p className="text-center text-xs text-gray-600">Day Streak</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <CardContent className="pt-4 pb-3">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full p-3">
              <Trophy className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-center text-2xl mb-1">{longestStreak}</p>
          <p className="text-center text-xs text-gray-600">Best Streak</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="pt-4 pb-3">
          <div className="flex justify-center mb-2">
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full p-3">
              <Target className="h-5 w-5 text-white" />
            </div>
          </div>
          <p className="text-center text-2xl mb-1">{totalEntries}</p>
          <p className="text-center text-xs text-gray-600">Total Logs</p>
        </CardContent>
      </Card>
    </div>
  );
}
