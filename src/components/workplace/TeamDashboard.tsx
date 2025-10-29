import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../utils/ThemeProvider';
import { Users, TrendingUp, AlertTriangle, Award, Shield, Calendar } from 'lucide-react';
import type { TeamMember, TeamMetrics } from '../../types/employee';

interface TeamDashboardProps {
  teamMembers: TeamMember[];
  entries: { mood: string; note: string; intensity: number; timestamp: Date; userId?: string }[];
  onViewMember: (memberId: string) => void;
  onScheduleCheckIn: (memberId: string) => void;
}

function calculateTeamMetrics(members: TeamMember[], entries: any[]): TeamMetrics {
  const last7Days = entries.filter(e => {
    const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
    return e.timestamp >= weekAgo;
  });

  const memberScores: Record<string, number[]> = {};
  last7Days.forEach(e => {
    if (e.userId) {
      if (!memberScores[e.userId]) memberScores[e.userId] = [];
      memberScores[e.userId].push(e.intensity);
    }
  });

  const avgWellbeing = Object.values(memberScores).reduce((sum, scores) => {
    const avg = scores.reduce((s,v)=>s+v,0)/scores.length;
    return sum + avg;
  }, 0) / Math.max(Object.keys(memberScores).length, 1);

  const participationRate = Object.keys(memberScores).length / Math.max(members.length, 1);
  
  const atRiskCount = members.filter(m => m.riskLevel === 'high' || m.riskLevel === 'medium').length;

  // Trend: compare this week avg to prior week
  const priorWeekEntries = entries.filter(e => {
    const twoWeeksAgo = new Date(Date.now() - 14*24*60*60*1000);
    const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
    return e.timestamp >= twoWeeksAgo && e.timestamp < weekAgo;
  });
  const priorAvg = priorWeekEntries.length 
    ? priorWeekEntries.reduce((s,e)=>s+e.intensity,0)/priorWeekEntries.length
    : avgWellbeing;
  
  const trendDirection = avgWellbeing > priorAvg + 0.2 ? 'improving' : avgWellbeing < priorAvg - 0.2 ? 'declining' : 'stable';

  // Top concerns from notes
  const noteWords: Record<string, number> = {};
  last7Days.filter(e=>e.note).forEach(e => {
    e.note.toLowerCase().split(/\s+/).forEach((w:string) => {
      const clean = w.replace(/[^a-z0-9]/g,'');
      if (clean.length >= 4) noteWords[clean] = (noteWords[clean]||0)+1;
    });
  });
  const topConcerns = Object.entries(noteWords).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([w])=>w);

  return { avgWellbeing: avgWellbeing * 20, participationRate, atRiskCount, trendDirection, topConcerns };
}

export function TeamDashboard({ teamMembers, entries, onViewMember, onScheduleCheckIn }: TeamDashboardProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const metrics = useMemo(() => calculateTeamMetrics(teamMembers, entries), [teamMembers, entries]);

  const atRiskMembers = teamMembers.filter(m => m.riskLevel === 'high' || m.riskLevel === 'medium');

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
        {/* Header */}
        <div className="rounded-3xl p-6 mb-6" style={{
          background: isDark ? 'linear-gradient(135deg,#2D7A8B,#1a5f6f)' : 'linear-gradient(135deg,#4FB3C5,#2D7A8B)',
          boxShadow: isDark ? '0 8px 32px 0 rgba(31,38,135,0.37)' : '0 8px 32px 0 rgba(80,180,197,0.15)',
          backdropFilter: 'blur(8px)',
          border: isDark ? '1.5px solid #2d7a8b44' : '1.5px solid #4fb3c544',
        }}>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Users className="w-6 h-6"/>Team Wellbeing
          </h2>
          <p className="text-sm" style={{color:'rgba(255,255,255,0.85)'}}>
            Overview of your team's mood and engagement
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <motion.div layout className="rounded-2xl p-4" style={sectionStyle}>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" style={{color:'#4FB3C5'}}/>
              <p className="text-xs font-semibold" style={{color:isDark?'#bbb':'#557'}}>Wellbeing</p>
            </div>
            <p className="text-2xl font-bold" style={{color:isDark?'#fff':'#2D7A8B'}}>
              {metrics.avgWellbeing.toFixed(0)}/100
            </p>
          </motion.div>

          <motion.div layout className="rounded-2xl p-4" style={sectionStyle}>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5" style={{color:'#7DD4A8'}}/>
              <p className="text-xs font-semibold" style={{color:isDark?'#bbb':'#557'}}>Participation</p>
            </div>
            <p className="text-2xl font-bold" style={{color:isDark?'#fff':'#2D7A8B'}}>
              {(metrics.participationRate*100).toFixed(0)}%
            </p>
          </motion.div>

          <motion.div layout className="rounded-2xl p-4" style={sectionStyle}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" style={{color:'#FFB84D'}}/>
              <p className="text-xs font-semibold" style={{color:isDark?'#bbb':'#557'}}>At Risk</p>
            </div>
            <p className="text-2xl font-bold" style={{color:isDark?'#fff':'#2D7A8B'}}>
              {metrics.atRiskCount}
            </p>
          </motion.div>

          <motion.div layout className="rounded-2xl p-4" style={sectionStyle}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5" style={{color:metrics.trendDirection==='improving'?'#7DD4A8':metrics.trendDirection==='declining'?'#FF6B6B':'#FFB84D'}}/>
              <p className="text-xs font-semibold" style={{color:isDark?'#bbb':'#557'}}>Trend</p>
            </div>
            <p className="text-sm font-bold capitalize" style={{color:isDark?'#fff':'#2D7A8B'}}>
              {metrics.trendDirection}
            </p>
          </motion.div>
        </div>

        {/* At-Risk Members Alert */}
        {atRiskMembers.length > 0 && (
          <motion.div layout className="rounded-3xl p-5 mb-6" style={{
            ...sectionStyle,
            borderLeft: '4px solid #FFB84D'
          }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5" style={{color:'#FFB84D'}}/>
              <h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
                Team Members Needing Support
              </h3>
            </div>
            <div className="space-y-3">
              {atRiskMembers.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-xl" style={{background:isDark?'#232946':'#F5F8FA'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{background:'#4FB3C5'}}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{color:isDark?'#fff':'#2D7A8B'}}>{member.name}</p>
                      <p className="text-xs" style={{color:isDark?'#889':'#557'}}>
                        Risk: <span className="font-semibold" style={{color:member.riskLevel==='high'?'#FF6B6B':'#FFB84D'}}>{member.riskLevel}</span>
                        {member.lastCheckIn && ` • Last check-in ${Math.floor((Date.now() - member.lastCheckIn.getTime())/86400000)}d ago`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewMember(member.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{background:isDark?'#2d3748':'#E8F6F8', color:isDark?'#4FB3C5':'#2D7A8B'}}
                      aria-label={`View ${member.name} details`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => onScheduleCheckIn(member.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{background:'#4FB3C5'}}
                      aria-label={`Schedule check-in with ${member.name}`}
                    >
                      <Calendar className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Top Concerns */}
        {metrics.topConcerns.length > 0 && (
          <motion.div layout className="rounded-3xl p-5 mb-6" style={sectionStyle}>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" style={{color:'#4FB3C5'}}/>
              <h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
                Common Themes This Week
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {metrics.topConcerns.map(concern => (
                <span key={concern} className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{
                  background:isDark?'#2d3748':'#E8F6F8',
                  color:isDark?'#4FB3C5':'#2D7A8B'
                }}>
                  {concern}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Team Members */}
        <motion.div layout className="rounded-3xl p-5 mb-24" style={sectionStyle}>
          <h3 className="text-lg font-semibold mb-4" style={{color:isDark?'#fff':'#2D7A8B'}}>
            Team Members ({teamMembers.length})
          </h3>
          <div className="space-y-2">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-opacity-70 transition-all" style={{background:isDark?'#232946':'#F5F8FA'}}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm" style={{background:'#4FB3C5'}}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{color:isDark?'#fff':'#2D7A8B'}}>{member.name}</p>
                    <p className="text-xs" style={{color:isDark?'#889':'#557'}}>{member.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => onViewMember(member.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{background:isDark?'#2d3748':'#E8F6F8', color:isDark?'#4FB3C5':'#2D7A8B'}}
                  aria-label={`View ${member.name} insights`}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
