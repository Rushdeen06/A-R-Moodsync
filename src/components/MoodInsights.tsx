import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Sun, Moon, Lightbulb } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
}

interface MoodInsightsProps {
  entries: MoodEntry[];
}

export function MoodInsights({ entries }: MoodInsightsProps) {
  if (entries.length === 0) {
    return null;
  }

  // Calculate insights
  const recentEntries = entries.slice(-7);
  const olderEntries = entries.slice(-14, -7);
  
  const avgRecentIntensity = recentEntries.reduce((sum, e) => sum + e.intensity, 0) / recentEntries.length;
  const avgOlderIntensity = olderEntries.length > 0 
    ? olderEntries.reduce((sum, e) => sum + e.intensity, 0) / olderEntries.length 
    : avgRecentIntensity;
  
  const trend = avgRecentIntensity > avgOlderIntensity ? 'up' : 'down';
  
  // Most common time of day
  const morningEntries = entries.filter(e => new Date(e.timestamp).getHours() < 12).length;
  const afternoonEntries = entries.filter(e => {
    const hour = new Date(e.timestamp).getHours();
    return hour >= 12 && hour < 18;
  }).length;
  const eveningEntries = entries.filter(e => new Date(e.timestamp).getHours() >= 18).length;
  
  let mostActiveTime = 'morning';
  let maxEntries = morningEntries;
  if (afternoonEntries > maxEntries) {
    mostActiveTime = 'afternoon';
    maxEntries = afternoonEntries;
  }
  if (eveningEntries > maxEntries) {
    mostActiveTime = 'evening';
  }

  // Most improved mood
  const moodChanges: Record<string, number[]> = {};
  entries.forEach(entry => {
    if (!moodChanges[entry.mood]) moodChanges[entry.mood] = [];
    moodChanges[entry.mood].push(entry.intensity);
  });

  const insights = [
    {
      icon: trend === 'up' ? TrendingUp : TrendingDown,
      title: 'Intensity Trend',
      value: trend === 'up' ? 'Increasing' : 'Decreasing',
      color: trend === 'up' ? 'text-green-600' : 'text-blue-600',
      bgColor: trend === 'up' ? 'bg-green-50' : 'bg-blue-50',
      description: `Your emotional intensity has been ${trend === 'up' ? 'trending up' : 'stabilizing'} this week`,
    },
    {
      icon: mostActiveTime === 'morning' ? Sun : Moon,
      title: 'Most Active',
      value: mostActiveTime.charAt(0).toUpperCase() + mostActiveTime.slice(1),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: `You check in most during the ${mostActiveTime}`,
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-purple-500" />
          Your Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className={`p-3 rounded-lg ${insight.bgColor}`}>
              <div className="flex items-start gap-3">
                <div className={`${insight.color} mt-0.5`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">{insight.title}</span>
                    <Badge variant="secondary" className="text-xs">{insight.value}</Badge>
                  </div>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
