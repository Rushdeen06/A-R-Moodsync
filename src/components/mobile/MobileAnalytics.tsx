import { useState, useMemo } from 'react';
import { useTheme } from '../../utils/ThemeProvider';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Clock, Sun, Moon, Coffee } from 'lucide-react';

interface MobileAnalyticsProps {
  entries: { mood: string; note: string; intensity: number; timestamp: Date }[];
}

type TimeRange = '7d' | '30d' | 'all';

export function MobileAnalytics({ entries }: MobileAnalyticsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Filter entries based on selected time range with memoization
  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      const now = new Date();
      const entryDate = new Date(e.timestamp);
      if (timeRange === '7d') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return entryDate >= weekAgo;
      } else if (timeRange === '30d') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return entryDate >= monthAgo;
      }
      return true; // 'all'
    });
  }, [entries, timeRange]);

  // Calculate time-of-day patterns
  const morningEntries = filteredEntries.filter(e => {
    const hour = new Date(e.timestamp).getHours();
    return hour >= 6 && hour < 12;
  });
  const afternoonEntries = filteredEntries.filter(e => {
    const hour = new Date(e.timestamp).getHours();
    return hour >= 12 && hour < 18;
  });
  const eveningEntries = filteredEntries.filter(e => {
    const hour = new Date(e.timestamp).getHours();
    return hour >= 18 || hour < 6;
  });

  const morningAvg = morningEntries.length > 0 ? morningEntries.reduce((a, e) => a + e.intensity, 0) / morningEntries.length : 0;
  const afternoonAvg = afternoonEntries.length > 0 ? afternoonEntries.reduce((a, e) => a + e.intensity, 0) / afternoonEntries.length : 0;
  const eveningAvg = eveningEntries.length > 0 ? eveningEntries.reduce((a, e) => a + e.intensity, 0) / eveningEntries.length : 0;

  const bestTimeOfDay = morningAvg > afternoonAvg && morningAvg > eveningAvg ? 'morning' 
    : afternoonAvg > eveningAvg ? 'afternoon' : 'evening';

  // Prepare data for chart with timestamps
  const chartData = [...filteredEntries]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map(e => {
      const date = new Date(e.timestamp);
      return {
        time: date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        intensity: e.intensity,
        mood: e.mood,
        fullTimestamp: date.toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      };
    });

  const avgMood = filteredEntries.length > 0 ? filteredEntries.reduce((a, e) => a + e.intensity, 0) / filteredEntries.length : 0;
  const highestMood = filteredEntries.length > 0 ? Math.max(...filteredEntries.map(e => e.intensity)) : 0;
  const lowestMood = filteredEntries.length > 0 ? Math.min(...filteredEntries.map(e => e.intensity)) : 0;

  return (
    <div className="min-h-screen pb-24 relative" style={{
      background: isDark
        ? 'linear-gradient(135deg, #181c2b 0%, #232946 100%)'
        : 'linear-gradient(135deg, #E8F6F8 0%, #C9E7F2 100%)',
    }}>
      <div className="max-w-md mx-auto p-4 relative z-10">
        {/* Header with time range selector */}
        <div className="rounded-3xl p-6 mb-5 shadow-lg" style={{
          background: isDark
            ? 'linear-gradient(135deg,#2D7A8B,#1a5f6f)'
            : 'linear-gradient(135deg,#4FB3C5,#2D7A8B)',
          boxShadow: isDark
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            : '0 8px 32px 0 rgba(80, 180, 197, 0.15)',
          backdropFilter: 'blur(8px)',
          border: isDark ? '1.5px solid #2d7a8b44' : '1.5px solid #4fb3c544',
        }}>
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Analytics</h2>
          </div>
          <p className="text-base font-medium mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Detailed mood trends over time
          </p>

          {/* Time Range Toggle */}
          <div className="flex gap-2">
            {[
              { value: '7d' as TimeRange, label: 'Week' },
              { value: '30d' as TimeRange, label: 'Month' },
              { value: 'all' as TimeRange, label: 'All Time' }
            ].map(range => (
              <motion.button
                key={range.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range.value)}
                className="flex-1 py-2 rounded-xl font-semibold text-sm transition-all"
                style={{
                  backgroundColor: timeRange === range.value ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.2)',
                  color: timeRange === range.value ? '#2D7A8B' : 'rgba(255,255,255,0.85)',
                  border: timeRange === range.value ? 'none' : '1px solid rgba(255,255,255,0.3)'
                }}
              >
                {range.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Average" value={avgMood.toFixed(1)} isDark={isDark} />
          <StatCard label="Highest" value={highestMood.toString()} isDark={isDark} color="#7DD4A8" />
          <StatCard label="Lowest" value={lowestMood.toString()} isDark={isDark} color="#FF6B6B" />
        </div>

        {/* Smart Insights Panel */}
        {filteredEntries.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 mb-6 shadow-xl"
            style={{
              background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
              boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
              backdropFilter: 'blur(10px)',
              border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              💡 Insights
            </h3>
            <div className="space-y-3">
              {/* Best time of day */}
              {(morningEntries.length > 0 || afternoonEntries.length > 0 || eveningEntries.length > 0) && (
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{
                  backgroundColor: isDark ? '#232946' : '#F5F8FA'
                }}>
                  {bestTimeOfDay === 'morning' && <Sun className="w-5 h-5 mt-0.5" style={{ color: '#FFB84D' }} />}
                  {bestTimeOfDay === 'afternoon' && <Coffee className="w-5 h-5 mt-0.5" style={{ color: '#4FB3C5' }} />}
                  {bestTimeOfDay === 'evening' && <Moon className="w-5 h-5 mt-0.5" style={{ color: '#9B7FD8' }} />}
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                      Best Time of Day
                    </p>
                    <p className="text-xs" style={{ color: isDark ? '#bbb' : '#666' }}>
                      You feel best in the <strong>{bestTimeOfDay}</strong> with an average of{' '}
                      <strong>{(bestTimeOfDay === 'morning' ? morningAvg : bestTimeOfDay === 'afternoon' ? afternoonAvg : eveningAvg).toFixed(1)}/5</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Logging frequency */}
              <div className="flex items-start gap-3 p-3 rounded-xl" style={{
                backgroundColor: isDark ? '#232946' : '#F5F8FA'
              }}>
                <Calendar className="w-5 h-5 mt-0.5" style={{ color: '#4FB3C5' }} />
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                    Logging Frequency
                  </p>
                  <p className="text-xs" style={{ color: isDark ? '#bbb' : '#666' }}>
                    {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} in the last{' '}
                    {timeRange === '7d' ? '7 days' : timeRange === '30d' ? '30 days' : 'recorded period'}
                    {timeRange !== 'all' && ` (avg ${(filteredEntries.length / (timeRange === '7d' ? 7 : 30)).toFixed(1)} per day)`}
                  </p>
                </div>
              </div>

              {/* Trend direction */}
              {filteredEntries.length >= 4 && (
                <div className="flex items-start gap-3 p-3 rounded-xl" style={{
                  backgroundColor: isDark ? '#232946' : '#F5F8FA'
                }}>
                  <TrendingUp className="w-5 h-5 mt-0.5" style={{ 
                    color: filteredEntries[filteredEntries.length - 1].intensity > filteredEntries[0].intensity ? '#7DD4A8' : '#FF6B6B'
                  }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                      Overall Trend
                    </p>
                    <p className="text-xs" style={{ color: isDark ? '#bbb' : '#666' }}>
                      {filteredEntries[filteredEntries.length - 1].intensity > filteredEntries[0].intensity ? (
                        <>Your mood has been <strong style={{ color: '#7DD4A8' }}>improving</strong> recently! Keep it up! 🎉</>
                      ) : filteredEntries[filteredEntries.length - 1].intensity < filteredEntries[0].intensity ? (
                        <>Your mood has been <strong style={{ color: '#FF6B6B' }}>declining</strong>. Consider reaching out for support. 💙</>
                      ) : (
                        <>Your mood has been <strong style={{ color: '#4FB3C5' }}>stable</strong>. Consistency is great! 🎯</>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Mood Trend Chart */}
        <div className="rounded-3xl p-6 mb-6 shadow-xl" style={{
          background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
        }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
            Mood Over Time
          </h3>
          {chartData.length === 0 ? (
            <p className="text-center py-8" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
              No data to display yet. Log your first mood!
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#2d7a8b44' : '#4fb3c544'} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: isDark ? '#fff' : '#2D7A8B', fontSize: 9 }}
                  interval="preserveStartEnd"
                  tickFormatter={(value) => {
                    // Show only date without time for cleaner display
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis 
                  domain={[0, 5]}
                  tick={{ fill: isDark ? '#fff' : '#2D7A8B' }}
                  label={{ value: 'Intensity', angle: -90, position: 'insideLeft', fill: isDark ? '#fff' : '#2D7A8B' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#232946' : 'white',
                    border: `1px solid ${isDark ? '#2d7a8b' : '#4fb3c5'}`,
                    borderRadius: '12px',
                    color: isDark ? '#fff' : '#2D7A8B',
                    padding: '12px',
                    fontSize: '13px'
                  }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{ 
                          backgroundColor: isDark ? '#232946' : 'white',
                          border: `2px solid ${isDark ? '#2d7a8b' : '#4fb3c5'}`,
                          borderRadius: '12px',
                          padding: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }}>
                          <p style={{ 
                            fontWeight: 'bold', 
                            marginBottom: '6px',
                            color: isDark ? '#4FB3C5' : '#2D7A8B',
                            fontSize: '14px'
                          }}>
                            {data.mood} - {data.intensity}/5
                          </p>
                          <p style={{ 
                            fontSize: '12px',
                            color: isDark ? '#bbb' : '#666',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            🕒 {data.fullTimestamp}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="intensity" 
                  stroke="#4FB3C5" 
                  strokeWidth={3}
                  dot={{ fill: '#4FB3C5', r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Detailed Entry List with Timestamps */}
        <div className="rounded-3xl p-6 mb-8 shadow-xl" style={{
          background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
          backdropFilter: 'blur(10px)',
          border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
        }}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
            <Clock className="w-5 h-5" />
            All Mood Entries
          </h3>
          {entries.length === 0 ? (
            <p className="text-center py-4" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
              No entries yet
            </p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {[...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((entry, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-xl shadow-sm"
                  style={{ background: isDark ? 'rgba(61,61,61,0.7)' : '#F5F8FA' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">
                        {entry.intensity >= 4 ? '😊' : entry.intensity === 3 ? '😐' : entry.intensity === 2 ? '😔' : '😢'}
                      </span>
                      <div>
                        <p className="text-base font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                          {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                        </p>
                        <div className="flex items-center gap-2 text-xs" style={{ color: isDark ? '#bbb' : '#A8C9C7' }}>
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(entry.timestamp).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                          <Clock className="w-3 h-3 ml-1" />
                          <span>{new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit'
                          })}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold px-3 py-1 rounded-full" style={{
                      backgroundColor: entry.intensity >= 4 ? '#7DD4A8' : entry.intensity === 3 ? '#FFB84D' : '#FF6B6B',
                      color: 'white'
                    }}>
                      {entry.intensity}/5
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-sm mt-2 pl-11" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>
                      {entry.note}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, isDark, color = '#4FB3C5' }: { label: string; value: string; isDark: boolean; color?: string }) {
  return (
    <div className="p-4 rounded-2xl shadow-sm" style={{
      background: isDark ? 'rgba(45, 55, 72, 0.85)' : 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(10px)',
      border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
    }}>
      <p className="text-2xl font-bold text-center mb-1" style={{ color }}>
        {value}
      </p>
      <p className="text-xs text-center uppercase tracking-wide" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
        {label}
      </p>
    </div>
  );
}
