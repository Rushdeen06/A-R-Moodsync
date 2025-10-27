import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Coffee, Footprints, Gamepad2, Wind, MessageCircle, ArrowLeft, Sparkles } from 'lucide-react';

interface MobileAISuggestionsProps {
  latestMood: string;
  moodLevel: number;
  onAccept: (suggestion: string) => void;
  onSkip: () => void;
  onFindBuddy: () => void;
  onBack: () => void;
}

const SUGGESTIONS_MAP: Record<string, Array<{
  icon: any;
  title: string;
  description: string;
  color: string;
}>> = {
  'very-low': [
    { icon: Coffee, title: 'Take a Coffee Break', description: 'A warm drink can help you reset and recharge', color: '#D4A574' },
    { icon: MessageCircle, title: 'Chat with Someone', description: 'Talking to a colleague can help lighten the mood', color: '#4FB3C5' },
    { icon: Wind, title: 'Breathing Exercise', description: 'Take 5 minutes to practice mindful breathing', color: '#9B7FD8' },
  ],
  'low': [
    { icon: Footprints, title: 'Go for a Walk', description: 'A 10-minute walk can boost your energy and mood', color: '#7DD4A8' },
    { icon: Coffee, title: 'Grab a Coffee', description: 'Take a break and enjoy a warm beverage', color: '#D4A574' },
    { icon: Wind, title: 'Deep Breathing', description: 'Practice some calming breathing exercises', color: '#9B7FD8' },
  ],
  'okay': [
    { icon: Footprints, title: 'Quick Walk', description: 'Stretch your legs with a short walk', color: '#7DD4A8' },
    { icon: Gamepad2, title: 'Play a Quick Game', description: 'Take a fun 5-minute break to refresh', color: '#FFB84D' },
    { icon: Coffee, title: 'Coffee Break', description: 'Recharge with your favorite drink', color: '#D4A574' },
  ],
  'good': [
    { icon: Gamepad2, title: 'Celebrate with Games', description: 'You\'re doing great! Enjoy a fun break', color: '#FFB84D' },
    { icon: Coffee, title: 'Social Coffee Break', description: 'Share your positive energy with colleagues', color: '#D4A574' },
    { icon: Footprints, title: 'Energizing Walk', description: 'Keep the momentum going with movement', color: '#7DD4A8' },
  ],
  'great': [
    { icon: MessageCircle, title: 'Share Your Energy', description: 'Help brighten someone else\'s day', color: '#4FB3C5' },
    { icon: Gamepad2, title: 'Fun Activity', description: 'Keep the positive vibes flowing', color: '#FFB84D' },
    { icon: Footprints, title: 'Victory Walk', description: 'Celebrate your great mood with movement', color: '#7DD4A8' },
  ],
};

export function MobileAISuggestions({ 
  latestMood, 
  moodLevel,
  onAccept, 
  onSkip, 
  onFindBuddy,
  onBack 
}: MobileAISuggestionsProps) {
  const suggestions = SUGGESTIONS_MAP[latestMood] || SUGGESTIONS_MAP['okay'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSuggestion = suggestions[currentIndex];
  const Icon = currentSuggestion.icon;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % suggestions.length);
  };

  const getMoodMessage = () => {
    if (moodLevel <= 2) return "Let's help you feel better 💙";
    if (moodLevel === 3) return "Let's boost your energy ⚡";
    if (moodLevel === 4) return "Keep up the good vibes ✨";
    return "You're doing amazing! 🌟";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen p-6"
      style={{ backgroundColor: '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button onClick={onBack} className="mb-6 p-2">
          <ArrowLeft className="w-6 h-6" style={{ color: '#2D7A8B' }} />
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <Sparkles className="w-8 h-8" style={{ color: '#FFB84D' }} />
            </div>
            <h2 className="text-2xl mb-2" style={{ color: '#2D7A8B' }}>
              AI Suggestions
            </h2>
            <p className="text-sm" style={{ color: '#4FB3C5' }}>
              {getMoodMessage()}
            </p>
          </div>

          {/* Suggestion Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl p-8 mb-6"
            style={{ backgroundColor: `${currentSuggestion.color}20` }}
          >
            <div className="flex justify-center mb-4">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ backgroundColor: currentSuggestion.color }}
              >
                <Icon className="w-10 h-10 text-white" />
              </div>
            </div>

            <h3 className="text-xl text-center mb-3" style={{ color: '#2D7A8B' }}>
              {currentSuggestion.title}
            </h3>
            <p className="text-sm text-center" style={{ color: '#4A7B78' }}>
              {currentSuggestion.description}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <Button
              onClick={() => onAccept(currentSuggestion.title)}
              className="w-full h-12 rounded-xl text-white"
              style={{ backgroundColor: '#4FB3C5' }}
            >
              I'll Try This
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleNext}
                variant="outline"
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#D4E9F1',
                  color: '#2D7A8B'
                }}
              >
                Show Another
              </Button>
              <Button
                onClick={onSkip}
                variant="outline"
                className="h-12 rounded-xl border-2"
                style={{ 
                  borderColor: '#D4E9F1',
                  color: '#2D7A8B'
                }}
              >
                Skip
              </Button>
            </div>
          </div>

          {/* Find Break Buddy */}
          <div className="border-t pt-6" style={{ borderColor: '#E8F6F8' }}>
            <p className="text-sm text-center mb-3" style={{ color: '#4A7B78' }}>
              Need someone to chat with?
            </p>
            <Button
              onClick={onFindBuddy}
              className="w-full h-12 rounded-xl"
              style={{ 
                backgroundColor: '#E8DFF5',
                color: '#2D7A8B'
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Find a Break Buddy
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
