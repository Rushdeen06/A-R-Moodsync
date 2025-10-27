import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface MobileMoodCheckInProps {
  onSubmit: (mood: string, note: string) => void;
  onBack: () => void;
}

const MOODS = [
  { emoji: '😊', label: 'Great', color: '#D4F1E8', value: 'great', level: 5 },
  { emoji: '🙂', label: 'Good', color: '#E0F7E0', value: 'good', level: 4 },
  { emoji: '😐', label: 'Okay', color: '#FFF5E1', value: 'okay', level: 3 },
  { emoji: '😔', label: 'Low', color: '#FFE6E6', value: 'low', level: 2 },
  { emoji: '😢', label: 'Very Low', color: '#FFD6D6', value: 'very-low', level: 1 },
];

export function MobileMoodCheckIn({ onSubmit, onBack }: MobileMoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (selectedMood) {
      onSubmit(selectedMood, note);
      setSelectedMood('');
      setNote('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="min-h-screen p-6 bg-gradient-to-b from-[#E8F6F8] to-[#F5FBFC]"
    >
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button onClick={onBack} className="mb-6 p-2">
          <ArrowLeft className="w-6 h-6" style={{ color: '#2D7A8B' }} />
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl text-center mb-8" style={{ color: '#2D7A8B' }}>
            Mood Check in
          </h2>

          {/* Mood Scale Info */}
          <p className="text-xs text-center mb-4" style={{ color: '#4FB3C5' }}>
            How are you feeling? (1 = Very Low, 5 = Great)
          </p>

          {/* Mood Emojis */}
          <div className="flex justify-center gap-3 mb-8">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className="flex flex-col items-center transition-transform hover:scale-110"
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1 transition-all ${
                    selectedMood === mood.value ? 'ring-4 ring-offset-2 ring-[#4FB3C5]' : ''
                  }`}
                  style={{ 
                    backgroundColor: mood.color
                  }}
                >
                  {mood.emoji}
                </div>
                <span className="text-xs" style={{ color: '#2D7A8B' }}>
                  {mood.level}
                </span>
              </button>
            ))}
          </div>

          {/* Note Input */}
          <div className="mb-8">
            <Textarea
              placeholder="Feeling tired after lunch"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full min-h-[100px] rounded-xl border-none text-center resize-none"
              style={{ 
                backgroundColor: '#F5F8FA',
                color: '#2D7A8B'
              }}
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className="w-full h-14 rounded-xl text-white text-lg"
            style={{ backgroundColor: '#4FB3C5' }}
          >
            Submit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
