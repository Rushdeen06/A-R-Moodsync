import { Card } from './ui/card';
import { motion } from 'motion/react';

interface QuickMoodCheckProps {
  onMoodSelect: (mood: string) => void;
}

const MOODS = [
  { value: 'happy', emoji: '😊', color: 'from-green-400 to-green-600' },
  { value: 'sad', emoji: '😢', color: 'from-blue-400 to-blue-600' },
  { value: 'angry', emoji: '😠', color: 'from-red-400 to-red-600' },
  { value: 'anxious', emoji: '😰', color: 'from-yellow-400 to-yellow-600' },
  { value: 'calm', emoji: '😌', color: 'from-purple-400 to-purple-600' },
  { value: 'excited', emoji: '🤩', color: 'from-pink-400 to-pink-600' },
];

export function QuickMoodCheck({ onMoodSelect }: QuickMoodCheckProps) {
  return (
    <Card className="p-4 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <div className="mb-3">
        <h3 className="text-lg">Quick Mood Check 🎯</h3>
        <p className="text-xs text-gray-600">Tap to log your current mood</p>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.value}
            whileTap={{ scale: 0.9 }}
            onClick={() => onMoodSelect(mood.value)}
            className={`aspect-square rounded-xl bg-gradient-to-br ${mood.color} flex items-center justify-center text-2xl shadow-md active:shadow-sm transition-shadow`}
          >
            {mood.emoji}
          </motion.button>
        ))}
      </div>
    </Card>
  );
}
