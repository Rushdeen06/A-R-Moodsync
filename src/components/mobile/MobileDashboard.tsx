import { motion } from 'motion/react';
import { ArrowLeft, Plus, Sparkles, TrendingUp, TrendingDown, Calendar, Heart, Zap, Award, Target, Brain } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../ui/button';
import { useTheme } from '../../utils/ThemeProvider';

interface MobileDashboardProps {
  entries: Array<{
    mood: string;
    timestamp: Date;
    intensity?: number;
  }>;
  onBack: () => void;
  onLogMood?: () => void;
  onViewSuggestions?: () => void;
}

export function MobileDashboard({ entries, onBack, onLogMood, onViewSuggestions }: MobileDashboardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Build per-entry graph data for the last 7 calendar days.
  const sevenDaysAgo = (() => { const d = new Date(); d.setDate(d.getDate() - 6); d.setHours(0,0,0,0); return d; })();
  const graphData = entries
    .filter(e => e.timestamp >= sevenDaysAgo)
    .map(e => {
      const d = new Date(e.timestamp);
      return {
        ts: d.getTime(),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: e.intensity || 3,
        productivity: e.intensity ? Math.min(5, (e.intensity + (Math.random()*1 - 0.4))) : 3,
        timeLabel: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        fullTimestamp: d.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
      };
    })
    .sort((a,b) => a.ts - b.ts);

  // Fallback placeholder points (one per day) if no entries yet
  const placeholderData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(12,0,0,0);
    return {
      ts: d.getTime(),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      mood: 0,
      productivity: 0,
      timeLabel: '—',
      fullTimestamp: 'No entry'
    };
  });

  const moodData = graphData.length > 0 ? graphData : placeholderData;

  // (Removed old displayData fallback; moodData already handles placeholders.)

  // Calculate statistics
  const avgMood = moodData.length > 0 ? (moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length) : 0;
  const latestMood = moodData.length > 0 ? moodData[moodData.length - 1].mood : 0;
  const moodTrend = moodData.length >= 2 ? latestMood - moodData[0].mood : 0;
  const bestDay = moodData.length > 0 ? moodData.reduce((max, curr) => curr.mood > max.mood ? curr : max) : null;
  const consistency = entries.length >= 7 ? Math.min(100, Math.floor((entries.length / 30) * 100)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen pb-24"
      style={{ 
        backgroundColor: isDark ? '#1a1a1a' : '#E8F6F8',
        overscrollBehavior: 'none' 
      }}
    >
      <div className="max-w-md mx-auto p-4">
        {/* Header with gradient */}
        <div 
          className="rounded-3xl p-6 mb-4 shadow-lg relative overflow-hidden"
          style={{ 
            background: isDark 
              ? 'linear-gradient(135deg, #2D7A8B 0%, #1a5f6f 100%)' 
              : 'linear-gradient(135deg, #4FB3C5 0%, #2D7A8B 100%)'
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background: 'white', transform: 'translate(30%, -30%)' }}></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20" style={{ background: 'white', transform: 'translate(-30%, 30%)' }}></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <motion.button 
                onClick={onBack} 
                className="p-2 rounded-full bg-white bg-opacity-20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>
              {onLogMood && (
                <motion.button 
                  onClick={onLogMood}
                  className="p-2 rounded-full bg-white bg-opacity-20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-6 h-6 text-white" />
                </motion.button>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-bold text-white">
                Analytics
              </h2>
            </div>
            <p className="text-sm text-white opacity-80">
              Your mood insights & trends
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <motion.div 
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? '#3d3d3d' : '#FFE6E6' }}>
                <Heart className="w-5 h-5" style={{ color: '#FF6B6B' }} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                  {entries.length}
                </p>
                <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                  Total Logs
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8F6F8' }}>
                <Target className="w-5 h-5" style={{ color: '#4FB3C5' }} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                  {avgMood.toFixed(1)}
                </p>
                <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                  Avg Mood
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? '#3d3d3d' : '#FFF5E1' }}>
                {moodTrend >= 0 ? (
                  <TrendingUp className="w-5 h-5" style={{ color: '#7DD4A8' }} />
                ) : (
                  <TrendingDown className="w-5 h-5" style={{ color: '#FFB84D' }} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                  {moodTrend >= 0 ? '+' : ''}{moodTrend.toFixed(1)}
                </p>
                <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                  Week Trend
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="rounded-2xl p-4 shadow-sm"
            style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: isDark ? '#3d3d3d' : '#E8DFF5' }}>
                <Award className="w-5 h-5" style={{ color: '#9B7FD8' }} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                  {consistency}%
                </p>
                <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                  Consistency
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Insights Card */}
        {bestDay && (
          <motion.div 
            className="rounded-2xl p-4 mb-4 shadow-sm"
            style={{ 
              backgroundColor: isDark ? '#2d2d2d' : 'white',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: isDark ? '#3d5d4d' : '#D4F1E8' }}>
                <Sparkles className="w-5 h-5" style={{ color: '#7DD4A8' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
                  Best Day This Week
                </p>
                <p className="text-xs mb-2" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
                  Your mood peaked on <span className="font-semibold" style={{ color: '#7DD4A8' }}>{bestDay.day}</span> with a score of {bestDay.mood.toFixed(1)}
                </p>
                {moodTrend > 0 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" style={{ color: '#7DD4A8' }} />
                    <p className="text-xs" style={{ color: '#7DD4A8' }}>
                      You're trending upward!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Chart Card */}
        <div 
          className="rounded-3xl p-5 mb-4 shadow-sm"
          style={{ backgroundColor: isDark ? '#2d2d2d' : 'white' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" style={{ color: '#4FB3C5' }} />
            <h3 className="text-lg font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
              7-Day Trends
            </h3>
          </div>
          <p className="text-xs mb-3 text-center" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
            Scale: 0 (Low) → 5 (High)
          </p>
          <div 
            className="rounded-2xl p-4"
            style={{ 
              background: isDark 
                ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
                : 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)'
            }}
          >
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={moodData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={isDark ? '#333' : '#E0E0E0'} 
                  />
                  <XAxis 
                    dataKey="ts"
                    type="number"
                    domain={[moodData[0].ts, moodData[moodData.length-1].ts]}
                    tickFormatter={(value: number) => {
                      const d = new Date(value);
                      return d.toLocaleDateString('en-US', { weekday: 'short' }) + '\n' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                    }}
                    fontSize={11}
                    stroke={isDark ? '#999' : '#2D7A8B'}
                    interval={0}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                    fontSize={11}
                    stroke={isDark ? '#999' : '#2D7A8B'}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const p = payload[0].payload;
                      return (
                        <div style={{
                          backgroundColor: isDark ? '#2d2d2d' : 'white',
                          border: `1px solid ${isDark ? '#444' : '#E0E0E0'}`,
                          borderRadius: '12px',
                          padding: '12px',
                          minWidth: '190px'
                        }}>
                          <p style={{ margin: 0, fontWeight: '600', color: isDark ? '#fff' : '#2D7A8B' }}>{p.fullTimestamp}</p>
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: isDark ? '#bbb' : '#555' }}>Mood: <strong style={{ color: '#9B7FD8' }}>{p.mood}/5</strong></p>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: isDark ? '#bbb' : '#555' }}>Productivity: <strong style={{ color: '#4FB3C5' }}>{p.productivity.toFixed(1)}/5</strong></p>
                        </div>
                      );
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#9B7FD8" 
                    strokeWidth={3}
                    dot={{ fill: '#9B7FD8', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Mood"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#4FB3C5" 
                    strokeWidth={3}
                    dot={{ fill: '#4FB3C5', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Productivity"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex flex-col items-center justify-center">
                <Zap className="w-12 h-12 mb-3 opacity-30" style={{ color: isDark ? '#666' : '#A8C9C7' }} />
                <p className="text-sm mb-2 font-medium" style={{ color: isDark ? '#999' : '#2D7A8B' }}>
                  No data yet
                </p>
                <p className="text-xs text-center" style={{ color: isDark ? '#666' : '#A8C9C7' }}>
                  Start logging your mood to see trends!
                </p>
              </div>
            )}
          </div>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#9B7FD8' }}></div>
              <span className="text-xs font-medium" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>Mood</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4FB3C5' }}></div>
              <span className="text-xs font-medium" style={{ color: isDark ? '#ccc' : '#2D7A8B' }}>Productivity</span>
            </div>
          </div>
        </div>

        {/* AI Suggestions CTA */}
        {onViewSuggestions && entries.length > 0 && (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onViewSuggestions}
              className="w-full py-6 rounded-2xl text-white font-semibold shadow-lg"
              style={{ 
                background: 'linear-gradient(135deg, #FFB84D 0%, #FF9A3D 100%)'
              }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get AI-Powered Insights
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
