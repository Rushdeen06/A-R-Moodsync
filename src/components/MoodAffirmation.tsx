import { Card, CardContent } from './ui/card';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface MoodAffirmationProps {
  mood: string;
}

const AFFIRMATIONS = {
  happy: [
    "Your joy is contagious! Keep spreading positivity ✨",
    "You're radiating good energy today! 🌟",
    "This happiness looks amazing on you! 💫",
  ],
  sad: [
    "It's okay to feel this way. You're doing great just by checking in 💙",
    "This feeling is temporary. Brighter days are ahead 🌈",
    "Be gentle with yourself today. You deserve kindness 🤗",
  ],
  angry: [
    "Your feelings are valid. Take a deep breath 🌊",
    "It's okay to feel angry. Let's find a healthy way to process this 💪",
    "You have the strength to work through this ⚡",
  ],
  anxious: [
    "You've handled 100% of your anxious moments before. You've got this 🦋",
    "One breath at a time. You're stronger than your worries 🌸",
    "This too shall pass. Focus on what you can control 🎯",
  ],
  calm: [
    "Your peace is powerful. Enjoy this moment 🧘",
    "This calm energy is beautiful. Soak it in ☮️",
    "You've found your center. Well done 🌺",
  ],
  excited: [
    "Your enthusiasm is inspiring! Channel this energy 🚀",
    "This excitement is fuel for amazing things 🎨",
    "Ride this wave of energy. You're unstoppable! 🌊",
  ],
};

export function MoodAffirmation({ mood }: MoodAffirmationProps) {
  const affirmations = AFFIRMATIONS[mood as keyof typeof AFFIRMATIONS] || AFFIRMATIONS.calm;
  const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 border-purple-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
            </motion.div>
            <p className="text-sm text-gray-700 italic flex-1">"{randomAffirmation}"</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
