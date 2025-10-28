import { useTheme } from '../../utils/ThemeProvider';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Clock } from 'lucide-react';

interface MobileAnalyticsProps {
  entries: { mood: string; note: string; intensity: number; timestamp: Date }[];
}

export function MobileAnalytics({ entries }: MobileAnalyticsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Prepare data for chart with timestamps
  const chartData = [...entries]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .map(e => ({
      time: new Date(e.timestamp).toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      intensity: e.intensity,
      mood: e.mood,
      fullTimestamp: new Date(e.timestamp).toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }));

  const avgMood = entries.length > 0 ? entries.reduce((a, e) => a + e.intensity, 0) / entries.length : 0;
  const highestMood = entries.length > 0 ? Math.max(...entries.map(e => e.intensity)) : 0;
  const lowestMood = entries.length > 0 ? Math.min(...entries.map(e => e.intensity)) : 0;

  return (
    <div className="min-h-screen pb-24 relative" style={{
      background: isDark
        ? 'linear-gradient(135deg, #181c2b 0%, #232946 100%)'
        : 'linear-gradient(135deg, #E8F6F8 0%, #C9E7F2 100%)',
    }}>
      <div className="max-w-md mx-auto p-4 relative z-10">
        {/* Header */}
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
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Analytics</h2>
          </div>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Detailed mood trends over time
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Average" value={avgMood.toFixed(1)} isDark={isDark} />
          <StatCard label="Highest" value={highestMood.toString()} isDark={isDark} color="#7DD4A8" />
          <StatCard label="Lowest" value={lowestMood.toString()} isDark={isDark} color="#FF6B6B" />
        </div>

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
                  tick={{ fill: isDark ? '#fff' : '#2D7A8B', fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                    color: isDark ? '#fff' : '#2D7A8B'
                  }}
                  formatter={(value: any, _name: string, props: any) => [
                    `Mood: ${value}/5 (${props.payload.mood})`,
                    `Time: ${props.payload.fullTimestamp}`
                  ]}
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
