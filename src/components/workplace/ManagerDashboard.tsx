import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TeamMoodEntry, TeamMember } from '../../types/workspace';

interface ManagerDashboardProps {
  entries: TeamMoodEntry[];
  teamMembers: TeamMember[];
  teamName?: string;
}

export function ManagerDashboard({ entries, teamMembers, teamName = 'Team' }: ManagerDashboardProps) {
  const last7Days = useMemo(() => {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
  const dayEntries = entries.filter(e => {
        const entryDate = new Date(e.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime() && !e.isPrivate;
      });

      const avgIntensity = dayEntries.length
        ? dayEntries.reduce((sum, e) => sum + e.intensity, 0) / dayEntries.length
        : 0;

      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        avgMood: Number(avgIntensity.toFixed(1)),
        checkIns: dayEntries.length,
      });
    }
    
    return days;
  }, [entries]);

  const wellbeingAlerts = useMemo(() => {
    const alerts: Array<{ type: 'warning' | 'info'; message: string; userName: string }> = [];
    const recentCutoff = new Date();
    recentCutoff.setHours(recentCutoff.getHours() - 48);

    // Check for team members with low moods
  const recentLowMoods = entries.filter(
      e => e.timestamp >= recentCutoff && (e.mood === 'low' || e.mood === 'very-low') && !e.isPrivate
    );

    const userLowMoodCounts: Record<string, number> = {};
    recentLowMoods.forEach(e => {
      userLowMoodCounts[e.userName] = (userLowMoodCounts[e.userName] || 0) + 1;
    });

    Object.entries(userLowMoodCounts).forEach(([userName, count]) => {
      if (count >= 2) {
        alerts.push({
          type: 'warning',
          message: `Has logged ${count} low moods in the past 48 hours`,
          userName,
        });
      }
    });

    // Check for inactive members
    const activeUsers = new Set(
      entries.filter(e => e.timestamp >= recentCutoff).map(e => e.userName)
    );
    
    teamMembers.forEach(member => {
      if (!activeUsers.has(member.name)) {
        alerts.push({
          type: 'info',
          message: 'No recent check-ins (48h)',
          userName: member.name,
        });
      }
    });

    return alerts;
  }, [entries, teamMembers]);

  const teamEngagement = useMemo(() => {
    const last7DaysCutoff = new Date();
    last7DaysCutoff.setDate(last7DaysCutoff.getDate() - 7);
    
    const activeMembers = new Set(
      entries.filter(e => e.timestamp >= last7DaysCutoff).map(e => e.userName)
    );

    const engagementRate = teamMembers.length
      ? ((activeMembers.size / teamMembers.length) * 100).toFixed(0)
      : '0';

    return {
      activeMembers: activeMembers.size,
      totalMembers: teamMembers.length,
      engagementRate: Number(engagementRate),
    };
  }, [entries, teamMembers]);

  const moodTrend = useMemo(() => {
    if (last7Days.length < 2) return 'stable';
    
    const recentAvg = (last7Days.slice(-3).reduce((sum, d) => sum + d.avgMood, 0) / 3);
    const olderAvg = (last7Days.slice(0, 3).reduce((sum, d) => sum + d.avgMood, 0) / 3);
    
    if (recentAvg > olderAvg + 0.3) return 'improving';
    if (recentAvg < olderAvg - 0.3) return 'declining';
    return 'stable';
  }, [last7Days]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-purple-600" />
          Manager Dashboard
        </h2>
        <p className="text-sm text-gray-500 mt-1">{teamName} - Team Wellbeing Insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Team Engagement</p>
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-3xl font-bold text-teal-600">{teamEngagement.engagementRate}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {teamEngagement.activeMembers} / {teamEngagement.totalMembers} active (7 days)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Mood Trend</p>
                {moodTrend === 'improving' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : moodTrend === 'declining' ? (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <p className="text-3xl font-bold capitalize">{moodTrend}</p>
              <p className="text-xs text-gray-500 mt-1">Based on 7-day average</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">Wellbeing Alerts</p>
                {wellbeingAlerts.length > 0 ? (
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
              <p className="text-3xl font-bold">{wellbeingAlerts.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {wellbeingAlerts.length === 0 ? 'All clear' : 'Require attention'}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 7-Day Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Mood Trend</CardTitle>
          <CardDescription>Average team mood and daily check-ins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis yAxisId="left" domain={[0, 5]} stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgMood"
                  stroke="#4FB3C5"
                  strokeWidth={2}
                  name="Avg Mood"
                  dot={{ fill: '#4FB3C5', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="checkIns"
                  stroke="#7DD4A8"
                  strokeWidth={2}
                  name="Check-ins"
                  dot={{ fill: '#7DD4A8', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Wellbeing Alerts */}
      {wellbeingAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Wellbeing Alerts
            </CardTitle>
            <CardDescription>Team members who may need support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wellbeingAlerts.map((alert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'warning'
                      ? 'bg-orange-50 border-orange-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{alert.userName}</p>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                    </div>
                    {alert.type === 'warning' && (
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
