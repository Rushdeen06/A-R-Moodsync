import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  Calendar,
  BarChart3,
  Heart,
  Coffee,
  Clock
} from 'lucide-react';

interface MoodEntry {
  timestamp: Date;
  mood: string;
  intensity: number;
  note?: string;
}

interface AdminDashboardProps {
  entries: MoodEntry[];
  onBack: () => void;
}

export function AdminDashboard({ entries, onBack }: AdminDashboardProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('week');

  const analytics = useMemo(() => {
    const now = new Date();
    const daysMap = { week: 7, month: 30, quarter: 90 };
    const days = daysMap[timeRange];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const filteredEntries = entries.filter(e => e.timestamp >= cutoffDate);

    // Wellbeing score (average intensity)
    const avgIntensity = filteredEntries.length > 0
      ? filteredEntries.reduce((sum, e) => sum + e.intensity, 0) / filteredEntries.length
      : 0;

    // Participation rate (assume 20 employees for demo)
    const totalEmployees = 20;
    const activeUsers = Math.min(filteredEntries.length, totalEmployees);
    const participationRate = (activeUsers / totalEmployees) * 100;

    // Mood distribution
    const moodCounts: Record<string, number> = {};
    filteredEntries.forEach(e => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });

    // At-risk count (intensity < 2)
    const atRiskCount = filteredEntries.filter(e => e.intensity < 2).length;

    // Trend (compare to previous period)
    const previousCutoff = new Date(cutoffDate.getTime() - days * 24 * 60 * 60 * 1000);
    const previousEntries = entries.filter(
      e => e.timestamp >= previousCutoff && e.timestamp < cutoffDate
    );
    const prevAvg = previousEntries.length > 0
      ? previousEntries.reduce((sum, e) => sum + e.intensity, 0) / previousEntries.length
      : 0;
    const trend = prevAvg > 0 ? ((avgIntensity - prevAvg) / prevAvg) * 100 : 0;

    return {
      avgIntensity,
      participationRate,
      moodCounts,
      atRiskCount,
      trend,
      totalEntries: filteredEntries.length,
    };
  }, [entries, timeRange]);

  const wellbeingScore = Math.round((analytics.avgIntensity / 5) * 100);

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Wellness Insights</h1>
            <p className="text-xs text-gray-500">Team wellbeing analytics</p>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="p-4">
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="px-4 space-y-3">
        {/* Wellbeing Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Team Wellbeing Score</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl font-bold text-teal-700">{wellbeingScore}</h2>
                <span className="text-sm text-gray-500">/100</span>
              </div>
            </div>
            <div className="p-3 bg-teal-100 rounded-lg">
              <Heart className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp
              className={`w-4 h-4 ${analytics.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}
            />
            <span
              className={`text-sm font-medium ${
                analytics.trend >= 0 ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {analytics.trend >= 0 ? '+' : ''}
              {analytics.trend.toFixed(1)}% vs previous period
            </span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Participation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <p className="text-xs text-gray-600">Participation</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.participationRate.toFixed(0)}%
            </p>
          </motion.div>

          {/* Total Check-ins */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <p className="text-xs text-gray-600">Check-ins</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics.totalEntries}</p>
          </motion.div>

          {/* At-Risk */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-orange-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <p className="text-xs text-gray-600">Low Mood Entries</p>
            </div>
            <p className="text-2xl font-bold text-orange-700">{analytics.atRiskCount}</p>
          </motion.div>

          {/* Avg Intensity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              <p className="text-xs text-gray-600">Avg Mood Level</p>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics.avgIntensity.toFixed(1)}
              <span className="text-sm text-gray-500">/5</span>
            </p>
          </motion.div>
        </div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-700" />
            <h3 className="font-semibold text-gray-900">Mood Distribution</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(analytics.moodCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([mood, count]) => {
                const percentage =
                  analytics.totalEntries > 0 ? (count / analytics.totalEntries) * 100 : 0;
                return (
                  <div key={mood}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 capitalize">{mood}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="bg-teal-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-5 border border-blue-100"
        >
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-teal-600" />
            Recommendations
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {analytics.participationRate < 50 && (
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>
                  Consider increasing awareness campaigns to boost participation above 50%
                </span>
              </li>
            )}
            {analytics.atRiskCount > 3 && (
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span>
                  {analytics.atRiskCount} low mood entries detected. Consider wellness check-ins.
                </span>
              </li>
            )}
            {wellbeingScore >= 70 && (
              <li className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Team wellbeing is strong. Keep up the positive culture!</span>
              </li>
            )}
            {wellbeingScore < 50 && (
              <li className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span>
                  Wellbeing score needs attention. Consider team-building or support resources.
                </span>
              </li>
            )}
          </ul>
        </motion.div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 leading-relaxed">
            🔒 <strong>Privacy Protected:</strong> All data is anonymized. Individual mood entries
            are not identifiable to protect employee privacy. This dashboard shows aggregate trends
            only.
          </p>
        </div>
      </div>
    </div>
  );
}
