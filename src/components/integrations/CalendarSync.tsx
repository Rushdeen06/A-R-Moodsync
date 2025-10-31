import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Link, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  type: 'meeting' | 'focus' | 'break' | 'social' | 'other';
  moodBefore?: number;
  moodAfter?: number;
}

interface MoodEntry {
  id: string;
  mood: string;
  timestamp: Date;
  intensity: number;
}

interface CalendarSyncProps {
  entries: MoodEntry[];
  onConnectCalendar?: () => void;
}

// Mock calendar events for demo
const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Standup',
    startTime: new Date(Date.now() - 3600000 * 2),
    endTime: new Date(Date.now() - 3600000 * 1.5),
    type: 'meeting',
    moodBefore: 4,
    moodAfter: 4,
  },
  {
    id: '2',
    title: 'Focus Time: Code Review',
    startTime: new Date(Date.now() - 3600000 * 4),
    endTime: new Date(Date.now() - 3600000 * 2),
    type: 'focus',
    moodBefore: 4,
    moodAfter: 5,
  },
  {
    id: '3',
    title: 'Client Presentation',
    startTime: new Date(Date.now() - 86400000),
    endTime: new Date(Date.now() - 86400000 + 3600000),
    type: 'meeting',
    moodBefore: 3,
    moodAfter: 2,
  },
  {
    id: '4',
    title: 'Lunch Break',
    startTime: new Date(Date.now() - 86400000 * 2),
    endTime: new Date(Date.now() - 86400000 * 2 + 3600000),
    type: 'break',
    moodBefore: 3,
    moodAfter: 4,
  },
];

const EVENT_TYPE_COLORS: Record<string, string> = {
  meeting: 'bg-blue-100 text-blue-700',
  focus: 'bg-purple-100 text-purple-700',
  break: 'bg-green-100 text-green-700',
  social: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-700',
};

export function CalendarSync({ onConnectCalendar }: CalendarSyncProps) {
  const [isConnected] = useState(false); // Would be true if user has connected calendar
  const [events] = useState<CalendarEvent[]>(MOCK_EVENTS);

  const eventAnalysis = useMemo(() => {
    const typeImpact: Record<string, { count: number; totalChange: number; avgChange: number }> = {};

    events.forEach(event => {
      if (event.moodBefore !== undefined && event.moodAfter !== undefined) {
        if (!typeImpact[event.type]) {
          typeImpact[event.type] = { count: 0, totalChange: 0, avgChange: 0 };
        }

        const change = event.moodAfter - event.moodBefore;
        typeImpact[event.type].count++;
        typeImpact[event.type].totalChange += change;
      }
    });

    Object.keys(typeImpact).forEach(type => {
      typeImpact[type].avgChange = typeImpact[type].totalChange / typeImpact[type].count;
    });

    // Sort by impact (most positive to most negative)
    const sortedImpact = Object.entries(typeImpact)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.avgChange - a.avgChange);

    // Upcoming events correlation
    const upcomingEvents = events
      .filter(e => e.startTime > new Date())
      .slice(0, 5);

    // Best/worst event types
    const bestType = sortedImpact[0];
    const worstType = sortedImpact[sortedImpact.length - 1];

    return {
      sortedImpact,
      upcomingEvents,
      bestType,
      worstType,
      totalEvents: events.length,
    };
  }, [events]);

  const getMoodChange = (before?: number, after?: number) => {
    if (before === undefined || after === undefined) return null;
    const change = after - before;
    return change;
  };

  const getMoodChangeDisplay = (change: number | null) => {
    if (change === null) return null;
    if (change > 0) return <span className="text-green-600">+{change.toFixed(1)} ↑</span>;
    if (change < 0) return <span className="text-red-600">{change.toFixed(1)} ↓</span>;
    return <span className="text-gray-600">±0</span>;
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-teal-600" />
            Calendar Integration
          </CardTitle>
          <CardDescription>Connect your calendar to track mood patterns around events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              Connect your calendar to automatically correlate mood changes with meetings, focus time, and
              breaks
            </p>
            <Button onClick={onConnectCalendar} className="bg-teal-600 hover:bg-teal-700">
              <Link className="w-4 h-4 mr-2" />
              Connect Google Calendar
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Privacy Note</h4>
                <p className="text-sm text-blue-700 mt-1">
                  We only read event titles and times to correlate with your mood entries. We never modify or
                  share your calendar data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-teal-600" />
            Calendar Insights
          </h2>
          <p className="text-sm text-gray-500 mt-1">How events affect your wellbeing</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sync Now
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Events Tracked</p>
                <p className="text-3xl font-bold text-teal-600">{eventAnalysis.totalEvents}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-teal-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        {eventAnalysis.bestType && (
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-500">Best Event Type</p>
                <p className="text-xl font-bold text-green-600 capitalize">{eventAnalysis.bestType.type}</p>
                <p className="text-sm text-green-600">
                  +{eventAnalysis.bestType.avgChange.toFixed(1)} avg mood boost
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {eventAnalysis.worstType && (
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-500">Challenging Events</p>
                <p className="text-xl font-bold text-orange-600 capitalize">{eventAnalysis.worstType.type}</p>
                <p className="text-sm text-orange-600">
                  {eventAnalysis.worstType.avgChange.toFixed(1)} avg mood change
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Event Type Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Event Impact Analysis</CardTitle>
          <CardDescription>Average mood change by event type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eventAnalysis.sortedImpact.map((item, idx) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge className={EVENT_TYPE_COLORS[item.type]}>{item.type}</Badge>
                  <span className="text-sm text-gray-600">{item.count} events</span>
                </div>
                <div className="flex items-center gap-4">
                  {item.avgChange > 0 && <TrendingUp className="w-5 h-5 text-green-600" />}
                  {item.avgChange < 0 && <TrendingUp className="w-5 h-5 text-red-600 rotate-180" />}
                  <span
                    className={`text-lg font-semibold ${
                      item.avgChange > 0
                        ? 'text-green-600'
                        : item.avgChange < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.avgChange > 0 ? '+' : ''}
                    {item.avgChange.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events & Mood Impact</CardTitle>
          <CardDescription>See how specific events affected your mood</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.slice(0, 10).map((event, idx) => {
              const change = getMoodChange(event.moodBefore, event.moodAfter);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge className={`${EVENT_TYPE_COLORS[event.type]} text-xs`}>{event.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {event.startTime.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Before: {event.moodBefore}/5</span>
                      <span className="text-gray-300">→</span>
                      <span className="text-gray-500">After: {event.moodAfter}/5</span>
                    </div>
                    <div className="text-sm font-medium mt-1">{getMoodChangeDisplay(change)}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
