import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Award, Trophy, Target, Zap, Calendar, Star, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Achievement } from '../../types/workspace';
import { Badge } from '../ui/badge';

interface AchievementsSystemProps {
  totalEntries: number;
  currentStreak: number;
  socialPosts: number;
  insightsViewed: number;
}

const ACHIEVEMENTS_CONFIG = [
  // Streak achievements
  {
    id: 'streak-3',
    name: 'Getting Started',
    description: 'Log mood for 3 days in a row',
    icon: '🔥',
    target: 3,
    category: 'streak' as const,
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚡',
    target: 7,
    category: 'streak' as const,
    color: 'bg-yellow-100 text-yellow-700',
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Achieve a 30-day streak',
    icon: '🏆',
    target: 30,
    category: 'streak' as const,
    color: 'bg-purple-100 text-purple-700',
  },
  // Entry achievements
  {
    id: 'entries-10',
    name: 'First Steps',
    description: 'Log 10 mood entries',
    icon: '👣',
    target: 10,
    category: 'entries' as const,
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'entries-50',
    name: 'Committed',
    description: 'Reach 50 mood entries',
    icon: '💪',
    target: 50,
    category: 'entries' as const,
    color: 'bg-teal-100 text-teal-700',
  },
  {
    id: 'entries-100',
    name: 'Centurion',
    description: 'Log 100 moods',
    icon: '🎯',
    target: 100,
    category: 'entries' as const,
    color: 'bg-green-100 text-green-700',
  },
  // Social achievements
  {
    id: 'social-5',
    name: 'Social Butterfly',
    description: 'Share 5 posts on social board',
    icon: '🦋',
    target: 5,
    category: 'social' as const,
    color: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'social-20',
    name: 'Community Leader',
    description: 'Create 20 social posts',
    icon: '👥',
    target: 20,
    category: 'social' as const,
    color: 'bg-indigo-100 text-indigo-700',
  },
  // Insights achievements
  {
    id: 'insights-10',
    name: 'Self-Aware',
    description: 'View insights 10 times',
    icon: '🧠',
    target: 10,
    category: 'insights' as const,
    color: 'bg-violet-100 text-violet-700',
  },
];

export function AchievementsSystem({
  totalEntries,
  currentStreak,
  socialPosts,
  insightsViewed,
}: AchievementsSystemProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'streak' | 'entries' | 'social' | 'insights'>('all');

  const achievements: Achievement[] = useMemo(() => {
    return ACHIEVEMENTS_CONFIG.map(config => {
      let progress = 0;
      
      switch (config.category) {
        case 'streak':
          progress = currentStreak;
          break;
        case 'entries':
          progress = totalEntries;
          break;
        case 'social':
          progress = socialPosts;
          break;
        case 'insights':
          progress = insightsViewed;
          break;
      }

      const isUnlocked = progress >= config.target;
      
      return {
        id: config.id,
        name: config.name,
        description: config.description,
        icon: config.icon,
        progress,
        target: config.target,
        category: config.category,
        unlockedAt: isUnlocked ? new Date() : undefined,
      };
    });
  }, [totalEntries, currentStreak, socialPosts, insightsViewed]);

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalPoints = unlockedCount * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Achievements & Rewards
        </h2>
        <p className="text-sm text-gray-500 mt-1">Unlock achievements and earn rewards</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Achievements</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {unlockedCount}/{achievements.length}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Points</p>
                <p className="text-3xl font-bold text-purple-600">{totalPoints}</p>
              </div>
              <Star className="w-8 h-8 text-purple-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">{currentStreak}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'streak', 'entries', 'social', 'insights'] as const).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === category
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map((achievement, idx) => {
          const isUnlocked = achievement.progress >= achievement.target;
          const progressPercent = Math.min((achievement.progress / achievement.target) * 100, 100);
          const config = ACHIEVEMENTS_CONFIG.find(c => c.id === achievement.id);

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`relative overflow-hidden ${isUnlocked ? 'ring-2 ring-yellow-400' : ''}`}>
                <CardContent className="pt-6">
                  {/* Unlock badge */}
                  {isUnlocked && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white">
                        <Award className="w-3 h-3 mr-1" />
                        Unlocked
                      </Badge>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full ${config?.color} flex items-center justify-center text-3xl mx-auto mb-4 ${!isUnlocked && 'opacity-40 grayscale'}`}>
                    {isUnlocked ? achievement.icon : '🔒'}
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg font-bold text-center mb-2 ${!isUnlocked && 'text-gray-400'}`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-sm text-center mb-4 ${!isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>
                        {achievement.progress}/{achievement.target}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${isUnlocked ? 'bg-yellow-500' : 'bg-teal-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      />
                    </div>
                  </div>

                  {/* Points */}
                  {isUnlocked && (
                    <div className="mt-4 text-center">
                      <Badge className="bg-purple-100 text-purple-700">
                        <Star className="w-3 h-3 mr-1" />
                        +100 points
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
