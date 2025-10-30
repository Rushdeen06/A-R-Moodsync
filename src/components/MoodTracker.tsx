import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { toast } from 'sonner';
import { BreathingExercise } from './BreathingExercise';
import { motion } from 'motion/react';

interface MoodTrackerProps {
  onAddEntry: (mood: string, note: string, intensity: number) => void;
}

const MOODS = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: 'bg-gradient-to-br from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 border-green-300' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: 'bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-blue-300' },
  { value: 'angry', label: 'Angry', emoji: '😠', color: 'bg-gradient-to-br from-red-100 to-red-200 hover:from-red-200 hover:to-red-300 border-red-300' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-gradient-to-br from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 border-yellow-300' },
  { value: 'calm', label: 'Calm', emoji: '😌', color: 'bg-gradient-to-br from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 border-purple-300' },
  { value: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-gradient-to-br from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 border-pink-300' },
];

const JOURNAL_PROMPTS = [
  "What triggered this feeling?",
  "What made you feel this way today?",
  "Describe this moment...",
  "What's on your mind right now?",
  "How does this emotion feel in your body?",
];

export function MoodTracker({ onAddEntry }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState([5]);
  const [prompt] = useState(JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error('Please select a mood');
      return;
    }

    onAddEntry(selectedMood, note, intensity[0]);
    setSelectedMood('');
    setNote('');
    setIntensity([5]);
    toast.success('Mood logged successfully! 🎉');
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400" />
        <CardHeader>
          <CardTitle>How are you feeling? 💭</CardTitle>
          <CardDescription>Take a moment to check in with yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Selection */}
            <div className="space-y-3">
              <Label>Select your mood</Label>
              <div className="grid grid-cols-2 gap-3">
                {MOODS.map((mood, index) => (
                  <motion.button
                    key={mood.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`p-5 rounded-xl border-2 transition-all ${mood.color} ${
                      selectedMood === mood.value ? 'ring-2 ring-offset-2 ring-purple-500 scale-105 shadow-lg' : ''
                    }`}
                    data-testid={`mood-option-${mood.value}`}
                  >
                    <motion.div 
                      className="text-4xl mb-2"
                      animate={selectedMood === mood.value ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {mood.emoji}
                    </motion.div>
                    <div className="text-sm">{mood.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Intensity</Label>
                <span className="text-lg px-3 py-1 bg-purple-100 text-purple-700 rounded-full">{intensity[0]}/10</span>
              </div>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Intense</span>
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note">Journal your thoughts (optional)</Label>
              <p className="text-xs text-gray-500 italic mb-2">💭 {prompt}</p>
              <Textarea
                id="note"
                placeholder="Start writing..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="text-base"
              />
            </div>

            <motion.div whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" size="lg" data-testid="mood-submit">
                Log Mood ✨
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>

      {/* Breathing Exercise */}
      <BreathingExercise />
    </div>
  );
}
