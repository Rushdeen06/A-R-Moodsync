import { motion } from 'motion/react';
import { ArrowLeft, Plus, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Button } from '../ui/button';

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
  // Generate mood/productivity data (last 7 entries, scale 0-5)
  const moodData = entries.slice(-7).map((entry, index) => {
    const daysAgo = 6 - index;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      mood: entry.intensity || 3,
      productivity: entry.intensity ? Math.min(5, entry.intensity + (Math.random() * 1 - 0.5)) : 3,
    };
  });

  // If no data, show sample data
  const displayData = moodData.length > 0 ? moodData : [
    { day: 'Mon', mood: 0, productivity: 0 },
    { day: 'Tue', mood: 0, productivity: 0 },
    { day: 'Wed', mood: 0, productivity: 0 },
    { day: 'Thu', mood: 0, productivity: 0 },
    { day: 'Fri', mood: 0, productivity: 0 },
    { day: 'Sat', mood: 0, productivity: 0 },
    { day: 'Sun', mood: 0, productivity: 0 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen p-6 bg-gradient-to-b from-[#E8F6F8] to-[#F5FBFC]"
      style={{ overscrollBehavior: 'none' }}
    >
      <div className="max-w-md mx-auto">
        {/* Header with Back and Add */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="p-2">
            <ArrowLeft className="w-6 h-6" style={{ color: '#2D7A8B' }} />
          </button>
          {onLogMood && (
            <button 
              onClick={onLogMood}
              className="p-2 rounded-full"
              style={{ backgroundColor: '#4FB3C5' }}
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl text-center mb-8" style={{ color: '#2D7A8B' }}>
            Mood Dashboard
          </h2>

          {/* Mood & Productivity Trends */}
          <div className="mb-8">
            <h3 className="text-lg mb-4" style={{ color: '#2D7A8B' }}>
              Mood & Productivity Levels
            </h3>
            <p className="text-xs mb-2 text-center" style={{ color: '#4FB3C5' }}>
              Scale: 0 (Low) → 5 (High)
            </p>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4">
              {moodData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={displayData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                    <XAxis 
                      dataKey="day" 
                      fontSize={11}
                      stroke="#2D7A8B"
                    />
                    <YAxis 
                      domain={[0, 5]}
                      ticks={[0, 1, 2, 3, 4, 5]}
                      fontSize={11}
                      stroke="#2D7A8B"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E0E0E0',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#9B7FD8" 
                      strokeWidth={3}
                      dot={{ fill: '#9B7FD8', r: 4 }}
                      name="Mood"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="productivity" 
                      stroke="#4FB3C5" 
                      strokeWidth={3}
                      dot={{ fill: '#4FB3C5', r: 4 }}
                      name="Productivity"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex flex-col items-center justify-center">
                  <p className="text-sm mb-2" style={{ color: '#2D7A8B' }}>
                    No data yet
                  </p>
                  <p className="text-xs" style={{ color: '#4FB3C5' }}>
                    Start logging your mood to see trends!
                  </p>
                </div>
              )}
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#9B7FD8' }}></div>
                <span className="text-xs" style={{ color: '#2D7A8B' }}>Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4FB3C5' }}></div>
                <span className="text-xs" style={{ color: '#2D7A8B' }}>Productivity</span>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F5F8FA' }}>
              <p className="text-2xl mb-1" style={{ color: '#2D7A8B' }}>
                {entries.length}
              </p>
              <p className="text-xs" style={{ color: '#2D7A8B' }}>
                Total Logs
              </p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F5F8FA' }}>
              <p className="text-2xl mb-1" style={{ color: '#2D7A8B' }}>
                {moodData.length > 0 ? (moodData[moodData.length - 1].mood.toFixed(1)) : '0'}
              </p>
              <p className="text-xs" style={{ color: '#2D7A8B' }}>
                Latest Mood
              </p>
            </div>
            <div className="rounded-xl p-4 text-center" style={{ backgroundColor: '#F5F8FA' }}>
              <p className="text-2xl mb-1" style={{ color: '#2D7A8B' }}>
                {moodData.length > 0 ? (moodData.reduce((sum, d) => sum + d.mood, 0) / moodData.length).toFixed(1) : '0'}
              </p>
              <p className="text-xs" style={{ color: '#2D7A8B' }}>
                Avg Mood
              </p>
            </div>
          </div>

          {/* AI Suggestions CTA */}
          {onViewSuggestions && entries.length > 0 && (
            <Button
              onClick={onViewSuggestions}
              className="w-full h-12 rounded-xl text-white"
              style={{ backgroundColor: '#FFB84D' }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get AI Suggestions
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
