import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TeamMoodEntry } from '../../types/workspace';

interface TeamMoodBoardProps {
  entries: TeamMoodEntry[];
  teamName?: string;
}

const MOOD_COLORS: Record<string, string> = {
  great: '#7DD4A8',
  good: '#4FB3C5',
  okay: '#FFB84D',
  low: '#FF8C61',
  'very-low': '#FF6B9D',
};

const MOOD_EMOJIS: Record<string, string> = {
  great: '😄',
  good: '😊',
  okay: '😐',
  low: '😔',
  'very-low': '😢',
};

export function TeamMoodBoard({ entries, teamName = 'Team' }: TeamMoodBoardProps) {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const filteredEntries = useMemo(() => {
    const now = new Date();
    const cutoff = new Date();
    
    if (timeRange === 'today') {
      cutoff.setHours(0, 0, 0, 0);
    } else if (timeRange === 'week') {
      cutoff.setDate(now.getDate() - 7);
    } else {
      cutoff.setMonth(now.getMonth() - 1);
    }

    return entries.filter(e => e.timestamp >= cutoff && !e.isPrivate);
  }, [entries, timeRange]);

  const teamStats = useMemo(() => {
    if (!filteredEntries.length) return null;
    
    const moodCounts: Record<string, number> = {};
    let totalIntensity = 0;
    
    filteredEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      totalIntensity += entry.intensity;
    });

    const avgMood = (totalIntensity / filteredEntries.length).toFixed(1);
    const dominantMood = Object.entries(moodCounts).reduce((a, b) => 
      b[1] > a[1] ? b : a
    )[0];

    return {
      totalEntries: filteredEntries.length,
      avgMood,
      dominantMood,
      moodCounts,
    };
  }, [filteredEntries]);

  const uniqueUsers = useMemo(() => {
    const users = new Set(filteredEntries.map(e => e.userName));
    return users.size;
  }, [filteredEntries]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            {teamName} Mood Board
          </h2>
          <p className="text-sm text-gray-500 mt-1">Team wellbeing overview</p>
        </div>
        
        <div className="flex gap-2">
          {(['today', 'week', 'month'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Team Stats */}
      {teamStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Members</p>
                    <p className="text-3xl font-bold text-teal-600">{uniqueUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-teal-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Check-ins</p>
                    <p className="text-3xl font-bold text-purple-600">{teamStats.totalEntries}</p>
                  </div>
                  <Target className="w-8 h-8 text-purple-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Average Mood</p>
                    <p className="text-3xl font-bold text-blue-600">{teamStats.avgMood}/5</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Team Mood</p>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{MOOD_EMOJIS[teamStats.dominantMood]}</span>
                      <p className="text-lg font-semibold capitalize">{teamStats.dominantMood}</p>
                    </div>
                  </div>
                  <Zap className="w-8 h-8 text-yellow-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Team Member Moods */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Team Moods</CardTitle>
      <CardDescription>Latest mood check-ins from your team</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            <div className="space-y-3">
              {filteredEntries.slice(0, 10).map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: MOOD_COLORS[entry.mood] }}
                  >
                    {entry.userName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{entry.userName}</p>
                      <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-gray-600 truncate mt-1">{entry.note}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No team mood entries yet for this period</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
