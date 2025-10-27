import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Smile, Frown, Meh, Heart, TrendingUp } from 'lucide-react';
import { QuickMoodCheck } from './QuickMoodCheck';
import { MoodStreak } from './MoodStreak';
import { MoodInsights } from './MoodInsights';
import { MoodAffirmation } from './MoodAffirmation';
import { motion } from 'motion/react';

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
}

interface DashboardProps {
  entries: MoodEntry[];
  userName: string;
  onQuickMoodSelect: (mood: string) => void;
}

const MOOD_COLORS = {
  happy: '#10b981',
  sad: '#3b82f6',
  angry: '#ef4444',
  anxious: '#f59e0b',
  calm: '#8b5cf6',
  excited: '#ec4899',
};

const MOOD_ICONS = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  anxious: '😰',
  calm: '😌',
  excited: '🤩',
};

// Happiness scale: 0 (lowest) to 10 (happiest)
const MOOD_HAPPINESS_SCORES = {
  angry: 2,
  sad: 3,
  anxious: 4,
  calm: 7,
  happy: 9,
  excited: 10,
};

export function Dashboard({ entries, userName, onQuickMoodSelect }: DashboardProps) {
  // Calculate mood distribution
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(moodCounts).map(([mood, count]) => ({
    name: mood,
    value: count,
    color: MOOD_COLORS[mood as keyof typeof MOOD_COLORS] || '#6b7280',
  }));

  // Prepare trend data (last 7 entries with happiness scores)
  const trendData = entries
    .slice(-7)
    .map((entry, index) => {
      const baseHappiness = MOOD_HAPPINESS_SCORES[entry.mood as keyof typeof MOOD_HAPPINESS_SCORES] || 5;
      // Adjust based on intensity: intensity affects the score by ±2 points
      const intensityAdjustment = (entry.intensity - 5) * 0.4; // -2 to +2 range
      const happinessScore = Math.max(0, Math.min(10, baseHappiness + intensityAdjustment));
      
      return {
        day: `Day ${index + 1}`,
        happiness: Math.round(happinessScore * 10) / 10, // Round to 1 decimal
        mood: entry.mood,
        moodEmoji: MOOD_ICONS[entry.mood as keyof typeof MOOD_ICONS],
      };
    });

  const averageIntensity = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length).toFixed(1)
    : '0';

  const mostCommonMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'calm';
  const latestMood = entries[entries.length - 1]?.mood || 'calm';

  // Calculate streak
  const today = new Date().toDateString();
  const hasLoggedToday = entries.some(e => new Date(e.timestamp).toDateString() === today);
  
  let currentStreak = 0;
  if (hasLoggedToday) {
    currentStreak = 1;
    let checkDate = new Date();
    checkDate.setDate(checkDate.getDate() - 1);
    
    while (currentStreak < entries.length) {
      const hasEntry = entries.some(e => 
        new Date(e.timestamp).toDateString() === checkDate.toDateString()
      );
      if (!hasEntry) break;
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  const longestStreak = currentStreak; // Simplified for now

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-2xl mb-1">Welcome back! 👋</h2>
        <p className="text-gray-600 text-sm">Here's your mood overview</p>
      </div>

      {/* Latest Mood Affirmation */}
      {entries.length > 0 && (
        <MoodAffirmation mood={latestMood} />
      )}

      {/* Quick Mood Check */}
      <QuickMoodCheck onMoodSelect={onQuickMoodSelect} />

      {/* Streak Stats */}
      <MoodStreak 
        currentStreak={currentStreak} 
        longestStreak={longestStreak}
        totalEntries={entries.length}
      />

      {/* Mood Insights */}
      {entries.length >= 3 && (
        <MoodInsights entries={entries} />
      )}

      {/* Charts */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Mood Trend</CardTitle>
            <CardDescription>Happiness scale: 0 (lowest) → 10 (happiest)</CardDescription>
          </CardHeader>
          <CardContent>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="day" 
                    fontSize={11} 
                    stroke="#6b7280"
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    fontSize={11}
                    stroke="#6b7280"
                    ticks={[0, 2, 4, 6, 8, 10]}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="text-sm mb-1">{data.day}</p>
                            <p className="text-xs text-gray-600 mb-1">
                              <span className="text-lg">{data.moodEmoji}</span> {data.mood}
                            </p>
                            <p className="text-sm">
                              Happiness: <span className="font-semibold text-purple-600">{data.happiness}/10</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="happiness" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
                No data yet. Start tracking your moods!
              </div>
            )}
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-2">
              <span>😢 Lowest</span>
              <span>😊 Happiest</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Breakdown of your emotions</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                No data yet. Start tracking your moods!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Your latest mood check-ins</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="space-y-3">
              {entries.slice(-5).reverse().map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{MOOD_ICONS[entry.mood as keyof typeof MOOD_ICONS]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="capitalize text-sm">{entry.mood}</span>
                      <span className="text-xs text-gray-500">• {entry.intensity}/10</span>
                    </div>
                    {entry.note && <p className="text-sm text-gray-600 line-clamp-2">{entry.note}</p>}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8 text-sm">No entries yet. Start tracking your mood!</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
