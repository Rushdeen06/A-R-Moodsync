import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, TrendingUp, Users, Brain, Sun } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
}

interface AffirmationsProps {
  entries: MoodEntry[];
  currentMood: string;
  currentStreak: number;
  userName: string;
}

interface Affirmation {
  text: string;
  icon: React.ReactNode;
  color: string;
  category: string;
}

const AFFIRMATIONS_BY_MOOD: Record<string, Affirmation[]> = {
  great: [
    {
      text: "You're radiating positive energy! Keep shining bright. 🌟",
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      category: 'celebration',
    },
    {
      text: "Your great mood is contagious! Share that smile today.",
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-pink-100 text-pink-700 border-pink-300',
      category: 'social',
    },
    {
      text: "This is your moment! You're capable of amazing things.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-green-100 text-green-700 border-green-300',
      category: 'motivation',
    },
  ],
  good: [
    {
      text: "You're doing great! Keep up this positive momentum.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-teal-100 text-teal-700 border-teal-300',
      category: 'encouragement',
    },
    {
      text: "Your consistency is inspiring. One day at a time!",
      icon: <Sun className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      category: 'consistency',
    },
    {
      text: "You're making progress. Be proud of how far you've come.",
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      category: 'progress',
    },
  ],
  okay: [
    {
      text: "It's okay to have neutral days. You're doing your best.",
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-gray-100 text-gray-700 border-gray-300',
      category: 'acceptance',
    },
    {
      text: "Tomorrow is a new opportunity. Rest and recharge tonight.",
      icon: <Sun className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      category: 'rest',
    },
    {
      text: "Small steps forward are still progress. Keep going!",
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      category: 'perseverance',
    },
  ],
  low: [
    {
      text: "This feeling is temporary. You've overcome challenges before.",
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      category: 'resilience',
    },
    {
      text: "Be gentle with yourself today. You're doing the best you can.",
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      category: 'self-compassion',
    },
    {
      text: "Reach out to someone you trust. You don't have to face this alone.",
      icon: <Users className="w-5 h-5" />,
      color: 'bg-teal-100 text-teal-700 border-teal-300',
      category: 'support',
    },
  ],
  'very-low': [
    {
      text: "You matter. Your feelings are valid. Please reach out for support.",
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-red-100 text-red-700 border-red-300',
      category: 'care',
    },
    {
      text: "This moment doesn't define you. Better days are ahead.",
      icon: <Sun className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-700 border-orange-300',
      category: 'hope',
    },
    {
      text: "You've survived 100% of your difficult days so far. You're stronger than you think.",
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      category: 'strength',
    },
  ],
};

const STREAK_AFFIRMATIONS: Array<{ minStreak: number; affirmation: Affirmation }> = [
  {
    minStreak: 3,
    affirmation: {
      text: "3 days strong! You're building a powerful habit.",
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-green-100 text-green-700 border-green-300',
      category: 'streak',
    },
  },
  {
    minStreak: 7,
    affirmation: {
      text: "A full week! Your commitment to self-care is inspiring.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-teal-100 text-teal-700 border-teal-300',
      category: 'streak',
    },
  },
  {
    minStreak: 14,
    affirmation: {
      text: "Two weeks of consistency! You're creating lasting change.",
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700 border-purple-300',
      category: 'streak',
    },
  },
  {
    minStreak: 30,
    affirmation: {
      text: "30 days! This is now a part of who you are. Incredible!",
      icon: <Heart className="w-5 h-5" />,
      color: 'bg-pink-100 text-pink-700 border-pink-300',
      category: 'streak',
    },
  },
];

export function PersonalizedAffirmations({
  entries,
  currentMood,
  currentStreak,
  userName,
}: AffirmationsProps) {
  const affirmations = useMemo(() => {
    const result: Affirmation[] = [];

    // Add mood-based affirmations
    const moodAffirmations = AFFIRMATIONS_BY_MOOD[currentMood] || AFFIRMATIONS_BY_MOOD.okay;
    result.push(...moodAffirmations);

    // Add streak affirmation if applicable
    const streakAffirmation = STREAK_AFFIRMATIONS.filter(s => currentStreak >= s.minStreak)
      .sort((a, b) => b.minStreak - a.minStreak)[0];

    if (streakAffirmation) {
      result.push(streakAffirmation.affirmation);
    }

    // Analyze recent trend
    const recentEntries = entries.slice(0, 7);
    if (recentEntries.length >= 3) {
      const avgRecent =
        recentEntries.slice(0, 3).reduce((sum, e) => sum + e.intensity, 0) / 3;
      const avgOlder =
        recentEntries.slice(3, 6).reduce((sum, e) => sum + e.intensity, 0) / 3;

      if (avgRecent > avgOlder + 0.5) {
        result.push({
          text: "Your mood has been improving lately! You're on an upward trend. 📈",
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'bg-green-100 text-green-700 border-green-300',
          category: 'trend',
        });
      }
    }

    // Add personalized affirmation
    const totalEntries = entries.length;
    if (totalEntries >= 10) {
      result.push({
        text: `${userName || 'You'}'ve logged ${totalEntries} entries! Your self-awareness is growing.`,
        icon: <Brain className="w-5 h-5" />,
        color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
        category: 'milestone',
      });
    }

    return result;
  }, [entries, currentMood, currentStreak, userName]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-600" />
          Personalized Affirmations
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Messages tailored to your mood and journey
        </p>
      </div>

      {/* Affirmations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {affirmations.map((affirmation, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`border-2 hover:shadow-lg transition-all ${affirmation.color}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-white/50">{affirmation.icon}</div>
                  <div className="flex-1">
                    <p className="text-lg font-medium leading-relaxed">{affirmation.text}</p>
                    <Badge variant="outline" className="mt-3 text-xs">
                      {affirmation.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Daily Inspiration */}
      <Card className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-900">
            <Sun className="w-5 h-5" />
            Daily Inspiration
          </CardTitle>
          <CardDescription className="text-teal-700">
            A reminder for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg italic text-teal-900 leading-relaxed">
            "The greatest glory in living lies not in never falling, but in rising every time we fall."
          </p>
          <p className="text-sm text-teal-600 mt-2">— Nelson Mandela</p>
        </CardContent>
      </Card>

      {/* Crisis Resources (if mood is very low) */}
      {(currentMood === 'very-low' || currentMood === 'low') && (
        <Card className="border-2 border-blue-300 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Users className="w-5 h-5" />
              Support Resources
            </CardTitle>
            <CardDescription className="text-blue-700">
              You don't have to face difficult times alone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-white">
              <p className="font-medium text-blue-900">Crisis Text Line</p>
              <p className="text-sm text-blue-700">Text "HELLO" to 741741</p>
            </div>
            <div className="p-3 rounded-lg bg-white">
              <p className="font-medium text-blue-900">National Suicide Prevention Lifeline</p>
              <p className="text-sm text-blue-700">Call 988 or 1-800-273-8255</p>
            </div>
            <div className="p-3 rounded-lg bg-white">
              <p className="font-medium text-blue-900">Online Support</p>
              <p className="text-sm text-blue-700">Visit 7cups.com for free listeners</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
