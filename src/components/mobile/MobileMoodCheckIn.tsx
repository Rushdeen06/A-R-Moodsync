import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, Briefcase, Dumbbell, Users, Coffee, Heart, Book, Music, Zap } from 'lucide-react';

interface MobileMoodCheckInProps {
  onSubmit: (mood: string, note: string, activities?: string[], energyLevel?: number) => void;
  onBack: () => void;
}

const MOODS = [
  { emoji: '😊', label: 'Great', color: '#D4F1E8', value: 'great', level: 5 },
  { emoji: '🙂', label: 'Good', color: '#E0F7E0', value: 'good', level: 4 },
  { emoji: '😐', label: 'Okay', color: '#FFF5E1', value: 'okay', level: 3 },
  { emoji: '😔', label: 'Low', color: '#FFE6E6', value: 'low', level: 2 },
  { emoji: '😢', label: 'Very Low', color: '#FFD6D6', value: 'very-low', level: 1 },
];

const EMOTIONS = [
  { emoji: '😄', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😤', label: 'Stressed', value: 'stressed' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '😡', label: 'Angry', value: 'angry' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
  { emoji: '🤗', label: 'Grateful', value: 'grateful' },
];

const ACTIVITIES = [
  { icon: Briefcase, label: 'Work', value: 'work', color: '#4FB3C5' },
  { icon: Dumbbell, label: 'Exercise', value: 'exercise', color: '#FF6B6B' },
  { icon: Users, label: 'Social', value: 'social', color: '#9B7FD8' },
  { icon: Coffee, label: 'Relax', value: 'relax', color: '#FFB84D' },
  { icon: Heart, label: 'Self Care', value: 'selfcare', color: '#FF69B4' },
  { icon: Book, label: 'Learning', value: 'learning', color: '#4A7B78' },
  { icon: Music, label: 'Creative', value: 'creative', color: '#7DD4A8' },
];

export function MobileMoodCheckIn({ onSubmit, onBack }: MobileMoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [note, setNote] = useState('');

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleSubmit = () => {
    if (selectedMood) {
      onSubmit(selectedMood, note, selectedActivities, energyLevel);
      setSelectedMood('');
      setSelectedEmotions([]);
      setSelectedActivities([]);
      setEnergyLevel(3);
      setNote('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="min-h-screen p-6 bg-gradient-to-b from-[#E8F6F8] to-[#F5FBFC] pb-24"
    >
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button onClick={onBack} className="mb-6 p-2">
          <ArrowLeft className="w-6 h-6" style={{ color: '#2D7A8B' }} />
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
          <h2 className="text-2xl text-center mb-4" style={{ color: '#2D7A8B' }}>
            How are you feeling?
          </h2>

          {/* Mood Scale */}
          <p className="text-xs text-center mb-4" style={{ color: '#4FB3C5' }}>
            Overall mood (1 = Very Low, 5 = Great)
          </p>

          <div className="flex justify-center gap-3 mb-6">
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
                  style={{ backgroundColor: mood.color }}
                >
                  {mood.emoji}
                </div>
                <span className="text-xs" style={{ color: '#2D7A8B' }}>
                  {mood.level}
                </span>
              </button>
            ))}
          </div>

          {/* Emotions Section */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <h3 className="text-sm mb-3 text-center" style={{ color: '#2D7A8B' }}>
                What emotions are you feeling? (optional)
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {EMOTIONS.map((emotion) => (
                  <button
                    key={emotion.value}
                    onClick={() => toggleEmotion(emotion.value)}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                      selectedEmotions.includes(emotion.value)
                        ? 'bg-[#E8F6F8] ring-2 ring-[#4FB3C5]'
                        : 'bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{emotion.emoji}</span>
                    <span className="text-[10px]" style={{ color: '#2D7A8B' }}>
                      {emotion.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Energy Level */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm" style={{ color: '#2D7A8B' }}>
                  Energy Level
                </h3>
                <span className="text-lg font-semibold" style={{ color: '#4FB3C5' }}>
                  {energyLevel}/5
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setEnergyLevel(level)}
                    className="flex-1 h-8 rounded-lg transition-all flex items-center justify-center"
                    style={{
                      backgroundColor: level <= energyLevel ? '#4FB3C5' : '#E8F6F8',
                    }}
                  >
                    <Zap
                      className="w-4 h-4"
                      style={{ color: level <= energyLevel ? 'white' : '#A8C9C7' }}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activities Section */}
          {selectedMood && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6"
            >
              <h3 className="text-sm mb-3 text-center" style={{ color: '#2D7A8B' }}>
                What have you been doing? (optional)
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {ACTIVITIES.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <button
                      key={activity.value}
                      onClick={() => toggleActivity(activity.value)}
                      className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                        selectedActivities.includes(activity.value)
                          ? 'bg-[#E8F6F8] ring-2 ring-[#4FB3C5]'
                          : 'bg-gray-50'
                      }`}
                    >
                      <Icon
                        className="w-5 h-5 mb-1"
                        style={{
                          color: selectedActivities.includes(activity.value)
                            ? activity.color
                            : '#A8C9C7',
                        }}
                      />
                      <span
                        className="text-[10px]"
                        style={{ color: '#2D7A8B' }}
                      >
                        {activity.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Note Input */}
          <div className="mb-6">
            <Textarea
              placeholder="Add a note about your day... (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full min-h-[100px] rounded-xl border-none resize-none"
              style={{
                backgroundColor: '#F5F8FA',
                color: '#2D7A8B',
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
