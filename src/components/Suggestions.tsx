import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BookOpen, Music, Users, Lightbulb, Activity, Headphones } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ReminderSettings } from './ReminderSettings';

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
}

interface SuggestionsProps {
  entries: MoodEntry[];
  remindersEnabled: boolean;
  onToggleReminders: (enabled: boolean) => void;
  lastReminderTime: Date | null;
}

const MOOD_MUSIC = {
  happy: ['Happy Vibes', 'Feel Good Hits', 'Upbeat & Energetic'],
  sad: ['Calm & Reflective', 'Healing Sounds', 'Emotional Release'],
  anxious: ['Calming Nature Sounds', 'Deep Relaxation', 'Peace & Quiet'],
  calm: ['Meditation Music', 'Ambient Sounds', 'Peaceful Piano'],
  angry: ['Release & Let Go', 'Powerful Rock', 'Energy Release'],
  excited: ['High Energy Beats', 'Dance Party', 'Motivation Mix'],
};

const suggestions = {
  happy: [
    {
      icon: Music,
      title: 'Create a Happy Playlist',
      description: 'Capture this positive energy by curating uplifting music',
      category: 'Creative',
      color: 'text-pink-500',
      action: 'View Playlists',
    },
    {
      icon: Users,
      title: 'Share Your Joy',
      description: 'Connect with friends or join a social activity',
      category: 'Social',
      color: 'text-blue-500',
      action: 'Share on Social',
    },
  ],
  sad: [
    {
      icon: BookOpen,
      title: 'Journal Your Feelings',
      description: 'Write down what you\'re experiencing to process emotions',
      category: 'Reflection',
      color: 'text-purple-500',
      action: 'Start Writing',
    },
    {
      icon: Activity,
      title: 'Gentle Movement',
      description: 'Try a light walk or stretching to boost your mood',
      category: 'Physical',
      color: 'text-green-500',
      action: 'View Exercises',
    },
  ],
  anxious: [
    {
      icon: Activity,
      title: 'Breathing Exercise',
      description: '4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8',
      category: 'Mindfulness',
      color: 'text-yellow-500',
      action: 'Start Exercise',
    },
    {
      icon: Headphones,
      title: 'Calming Sounds',
      description: 'Listen to nature sounds or relaxing music',
      category: 'Wellness',
      color: 'text-orange-500',
      action: 'Listen Now',
    },
  ],
  calm: [
    {
      icon: BookOpen,
      title: 'Read or Learn',
      description: 'Use this peaceful state for focused learning',
      category: 'Growth',
      color: 'text-indigo-500',
      action: 'Browse Topics',
    },
    {
      icon: Lightbulb,
      title: 'Plan & Reflect',
      description: 'Great time for goal setting and strategic thinking',
      category: 'Planning',
      color: 'text-purple-500',
      action: 'Set Goals',
    },
  ],
  angry: [
    {
      icon: Activity,
      title: 'Physical Release',
      description: 'Channel energy through exercise or sports',
      category: 'Physical',
      color: 'text-red-500',
      action: 'View Workouts',
    },
    {
      icon: BookOpen,
      title: 'Write It Out',
      description: 'Express your feelings through journaling',
      category: 'Expression',
      color: 'text-orange-500',
      action: 'Start Writing',
    },
  ],
  excited: [
    {
      icon: Lightbulb,
      title: 'Start a New Project',
      description: 'Channel this energy into something creative',
      category: 'Creative',
      color: 'text-pink-500',
      action: 'Get Ideas',
    },
    {
      icon: Users,
      title: 'Share the Energy',
      description: 'Inspire others with your enthusiasm',
      category: 'Social',
      color: 'text-blue-500',
      action: 'Share on Social',
    },
  ],
};

export function Suggestions({ entries, remindersEnabled, onToggleReminders, lastReminderTime }: SuggestionsProps) {
  // Get most recent mood
  const latestMood = entries[entries.length - 1]?.mood || 'calm';
  
  // Get mood patterns
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'calm';
  
  const currentSuggestions = suggestions[latestMood as keyof typeof suggestions] || suggestions.calm;
  const musicPlaylists = MOOD_MUSIC[latestMood as keyof typeof MOOD_MUSIC] || MOOD_MUSIC.calm;

  const handleSuggestionClick = (action: string) => {
    toast(`${action} - Feature coming soon! ✨`);
  };

  const generalTips = [
    {
      icon: Activity,
      title: 'Daily Check-ins',
      description: 'Track your mood at the same time each day for better insights',
      category: 'Habit',
      color: 'text-teal-500',
    },
    {
      icon: Users,
      title: 'Build Your Support Network',
      description: 'Connect with others on the community board',
      category: 'Community',
      color: 'text-blue-500',
    },
    {
      icon: Lightbulb,
      title: 'Professional Support',
      description: 'Consider speaking with a therapist for personalized guidance',
      category: 'Support',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl mb-1">Suggestions 💡</h2>
        <p className="text-gray-600 text-sm">Based on your mood patterns</p>
      </div>

      {/* Reminder Settings */}
      <ReminderSettings 
        enabled={remindersEnabled}
        onToggle={onToggleReminders}
        lastReminder={lastReminderTime}
      />

      {/* Current Mood Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg">For Your Current Mood</h3>
          <Badge variant="secondary" className="capitalize text-xs">{latestMood}</Badge>
        </div>
        <div className="space-y-3">
          {currentSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${suggestion.color === 'text-pink-500' ? 'from-pink-400 to-pink-600' : suggestion.color === 'text-blue-500' ? 'from-blue-400 to-blue-600' : suggestion.color === 'text-purple-500' ? 'from-purple-400 to-purple-600' : suggestion.color === 'text-green-500' ? 'from-green-400 to-green-600' : suggestion.color === 'text-yellow-500' ? 'from-yellow-400 to-yellow-600' : 'from-orange-400 to-orange-600'}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className={`${suggestion.color} mt-1`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{suggestion.title}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">{suggestion.category}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm mb-3">{suggestion.description}</CardDescription>
                    <Button 
                      variant="outline" 
                      className="w-full h-10"
                      onClick={() => handleSuggestionClick(suggestion.action)}
                    >
                      {suggestion.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mood-Based Music */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Headphones className="h-5 w-5 text-purple-500" />
            Music for Your Mood
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {musicPlaylists.map((playlist, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast(`Playing "${playlist}" 🎵`)}
              className="w-full p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all flex items-center justify-between"
            >
              <span className="text-sm">{playlist}</span>
              <Music className="h-4 w-4 text-purple-500" />
            </motion.button>
          ))}
        </CardContent>
      </Card>

      {/* General Wellness Tips */}
      <div>
        <h3 className="text-lg mb-3">General Wellness Tips</h3>
        <div className="space-y-3">
          {generalTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`${tip.color} mt-1`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">{tip.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">{tip.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Mood Pattern Insight */}
      {entries.length > 5 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-5 w-5 text-purple-500" />
              Pattern Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              Over your recent entries, <span className="capitalize">{dominantMood}</span> has been your most common mood. 
              Consider what activities or situations correlate with this feeling and how you can build more 
              awareness around them.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
