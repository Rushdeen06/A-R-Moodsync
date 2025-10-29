import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../utils/ThemeProvider';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Activity, Clock } from 'lucide-react';

interface TeamAnalyticsProps {
  entries: { mood: string; note: string; intensity: number; timestamp: Date; userId?: string }[];
  teamMembers: { id: string; name: string; riskLevel?: string }[];
}

export function TeamAnalytics({ entries, teamMembers }: TeamAnalyticsProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Weekly trend data
  const weeklyData = useMemo(() => {
    const last4Weeks: Record<string, {sum:number, count:number}> = {};
    entries.forEach(e => {
      const weekStart = new Date(e.timestamp);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split('T')[0];
      if (!last4Weeks[key]) last4Weeks[key] = {sum:0, count:0};
      last4Weeks[key].sum += e.intensity;
      last4Weeks[key].count += 1;
    });
    return Object.entries(last4Weeks)
      .sort((a,b)=> a[0].localeCompare(b[0]))
      .slice(-4)
      .map(([week, data]) => ({
        week: new Date(week).toLocaleDateString('en-US', {month:'short', day:'numeric'}),
        avgMood: data.count ? (data.sum / data.count) : 0
      }));
  }, [entries]);

  // Engagement by day of week
  const dayEngagement = useMemo(() => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const counts = Array(7).fill(0);
    entries.forEach(e => {
      counts[e.timestamp.getDay()]++;
    });
    return days.map((day, i) => ({ day, count: counts[i] }));
  }, [entries]);

  // Risk distribution
  const riskDist = useMemo(() => {
    const dist = { low:0, medium:0, high:0 };
    teamMembers.forEach(m => {
      if (m.riskLevel) dist[m.riskLevel as keyof typeof dist]++;
    });
    return [
      { name: 'Low Risk', value: dist.low, color: '#7DD4A8' },
      { name: 'Medium Risk', value: dist.medium, color: '#FFB84D' },
      { name: 'High Risk', value: dist.high, color: '#FF6B6B' }
    ];
  }, [teamMembers]);

  const sectionStyle: React.CSSProperties = {
    background: isDark ? 'rgba(45,55,72,0.85)' : 'rgba(255,255,255,0.85)',
    boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
    backdropFilter: 'blur(10px)',
    border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
  };

  return (
    <div className="min-h-screen pb-24" style={{
      background: isDark
        ? 'linear-gradient(135deg, #181c2b 0%, #232946 100%)'
        : 'linear-gradient(135deg, #E8F6F8 0%, #C9E7F2 100%)'
    }}>
      <div className="max-w-4xl mx-auto p-4">
        <div className="rounded-3xl p-6 mb-6" style={{
          background: isDark ? 'linear-gradient(135deg,#2D7A8B,#1a5f6f)' : 'linear-gradient(135deg,#4FB3C5,#2D7A8B)',
          boxShadow: isDark ? '0 8px 32px 0 rgba(31,38,135,0.37)' : '0 8px 32px 0 rgba(80,180,197,0.15)',
          backdropFilter: 'blur(8px)',
          border: isDark ? '1.5px solid #2d7a8b44' : '1.5px solid #4fb3c544',
        }}>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Activity className="w-6 h-6"/>Team Analytics
          </h2>
          <p className="text-sm" style={{color:'rgba(255,255,255,0.85)'}}>
            Deep insights into team mood patterns and engagement
          </p>
        </div>

        {/* 4-Week Trend */}
        <motion.div layout className="rounded-3xl p-5 mb-6" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" style={{color:'#4FB3C5'}}/>
            <h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
              4-Week Mood Trend
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark?'#2d7a8b33':'#4fb3c533'} />
              <XAxis dataKey="week" stroke={isDark?'#889':'#557'} style={{fontSize:12}} />
              <YAxis domain={[0,5]} stroke={isDark?'#889':'#557'} style={{fontSize:12}} />
              <Tooltip
                contentStyle={{background:isDark?'#232946':'#fff', border:`1px solid ${isDark?'#2d7a8b33':'#4fb3c533'}`, borderRadius:8}}
                labelStyle={{color:isDark?'#fff':'#2D7A8B'}}
              />
              <Line type="monotone" dataKey="avgMood" stroke="#4FB3C5" strokeWidth={3} dot={{fill:'#4FB3C5', r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Engagement by Day */}
        <motion.div layout className="rounded-3xl p-5 mb-6" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{color:'#7DD4A8'}}/>
            <h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
              Check-In Frequency by Day
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dayEngagement}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark?'#2d7a8b33':'#4fb3c533'} />
              <XAxis dataKey="day" stroke={isDark?'#889':'#557'} style={{fontSize:12}} />
              <YAxis stroke={isDark?'#889':'#557'} style={{fontSize:12}} />
              <Tooltip
                contentStyle={{background:isDark?'#232946':'#fff', border:`1px solid ${isDark?'#2d7a8b33':'#4fb3c533'}`, borderRadius:8}}
                labelStyle={{color:isDark?'#fff':'#2D7A8B'}}
              />
              <Bar dataKey="count" fill="#7DD4A8" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Distribution */}
        <motion.div layout className="rounded-3xl p-5 mb-24" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5" style={{color:'#FFB84D'}}/>
            <h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
              Team Risk Distribution
            </h3>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskDist}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={entry => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {riskDist.map(r => (
              <div key={r.name} className="text-center p-3 rounded-xl" style={{background:isDark?'#232946':'#F5F8FA'}}>
                <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{background:r.color}}/>
                <p className="text-xs font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>{r.name}</p>
                <p className="text-lg font-bold" style={{color:isDark?'#fff':'#2D7A8B'}}>{r.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
