import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../utils/ThemeProvider';
import { Brain, Coffee, Timer, CalendarDays, Moon, Activity, Sparkles } from 'lucide-react';
import { toast } from '../ui/sonner';

interface InsightsHubProps {
  entries: { mood: string; note: string; intensity: number; timestamp: Date }[];
}

// Helper computations
function getWeekEntries(entries: InsightsHubProps['entries']) {
  const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
  return entries.filter(e => e.timestamp >= weekAgo);
}

function getWellbeingScore(entries: InsightsHubProps['entries']) {
  if (!entries.length) return 0;
  const avg = entries.reduce((s,e)=>s+e.intensity,0)/entries.length; // 1-5
  const variance = getMoodVariance(entries);
  const consistency = getLoggingConsistency(entries);
  // Scale components into 0-100
  const moodComponent = (avg-1)/4 * 60; // up to 60
  const stabilityComponent = (1-Math.min(variance/4,1)) * 20; // lower variance better
  const consistencyComponent = consistency * 20; // up to 20
  return Math.round(moodComponent + stabilityComponent + consistencyComponent);
}

function getMoodVariance(entries: InsightsHubProps['entries']) {
  if (entries.length < 2) return 0;
  const avg = entries.reduce((s,e)=>s+e.intensity,0)/entries.length;
  return entries.reduce((s,e)=> s + Math.pow(e.intensity-avg,2),0)/entries.length;
}

function getLoggingConsistency(entries: InsightsHubProps['entries']) {
  if (!entries.length) return 0;
  // Percentage of days in last 7 days with at least one entry
  const days = new Set<string>();
  const weekEntries = getWeekEntries(entries);
  weekEntries.forEach(e => days.add(e.timestamp.toDateString()));
  return days.size / 7; // 0-1
}

function getBurnoutRisk(entries: InsightsHubProps['entries']) {
  // Heuristic: many low moods + high variance + inconsistent logging
  if (!entries.length) return 'low';
  const variance = getMoodVariance(entries);
  const lowCount = entries.filter(e=> e.intensity <=2 ).length;
  const lowRatio = lowCount / entries.length;
  const consistency = getLoggingConsistency(entries);
  if (lowRatio > 0.4 && variance > 1.2 && consistency < 0.5) return 'high';
  if (lowRatio > 0.25 && variance > 1.0) return 'medium';
  return 'low';
}

export function InsightsHub({ entries }: InsightsHubProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Break reminder state
  const [breakIntervalMin, setBreakIntervalMin] = useState<number>(() => {
    const saved = localStorage.getItem('insights_break_interval');
    return saved ? parseInt(saved) : 60;
  });
  const [lastBreak, setLastBreak] = useState<Date>(() => {
    const saved = localStorage.getItem('insights_last_break');
    return saved ? new Date(saved) : new Date();
  });
  const [quietStart, setQuietStart] = useState<number>(() => {
    const saved = localStorage.getItem('insights_qh_start');
    return saved ? parseInt(saved) : 22;
  });
  const [quietEnd, setQuietEnd] = useState<number>(() => {
    const saved = localStorage.getItem('insights_qh_end');
    return saved ? parseInt(saved) : 7;
  });

  // Timer for break countdown
  const [now, setNow] = useState<Date>(new Date());
  useEffect(()=>{
    const id = setInterval(()=> setNow(new Date()), 1000*30); // update every 30s
    return ()=> clearInterval(id);
  },[]);

  useEffect(()=>{
    localStorage.setItem('insights_break_interval', String(breakIntervalMin));
  },[breakIntervalMin]);
  useEffect(()=>{
    localStorage.setItem('insights_last_break', lastBreak.toISOString());
  },[lastBreak]);
  useEffect(()=>{
    localStorage.setItem('insights_qh_start', String(quietStart));
  },[quietStart]);
  useEffect(()=>{
    localStorage.setItem('insights_qh_end', String(quietEnd));
  },[quietEnd]);

  const minutesSinceBreak = Math.floor((now.getTime() - lastBreak.getTime())/60000);
  const minutesToNextBreak = Math.max(breakIntervalMin - minutesSinceBreak,0);

  useEffect(()=>{
    if (minutesToNextBreak === 0) {
      toast('Time for a quick break 🌿');
      setLastBreak(new Date());
    }
  },[minutesToNextBreak]);

  // Derived metrics
  const last7 = useMemo(()=> getWeekEntries(entries),[entries]);
  const wellbeingScore = useMemo(()=> getWellbeingScore(last7),[last7]);
  const variance = useMemo(()=> getMoodVariance(last7),[last7]);
  const consistency = useMemo(()=> getLoggingConsistency(entries),[entries]);
  const burnoutRisk = useMemo(()=> getBurnoutRisk(last7),[last7]);

  // Focus time recommendation (best 2-hour block) from entry intensities by hour
  const focusSuggestion = useMemo(()=>{
    if (!entries.length) return null;
    const hourScores: Record<number,{sum:number,count:number}> = {};
    entries.forEach(e=>{
      const h = new Date(e.timestamp).getHours();
      if (!hourScores[h]) hourScores[h] = {sum:0,count:0};
      hourScores[h].sum += e.intensity;
      hourScores[h].count += 1;
    });
    // Evaluate rolling 2-hour window avg
    let bestWindow: {start:number; score:number} | null = null;
    for (let h=0; h<24; h++) {
      const h1 = hourScores[h];
      const h2 = hourScores[(h+1)%24];
      const combinedSum = (h1?.sum||0) + (h2?.sum||0);
      const combinedCount = (h1?.count||0) + (h2?.count||0);
      const avg = combinedCount? combinedSum/combinedCount : 0;
      if (!bestWindow || avg > bestWindow.score) {
        bestWindow = { start: h, score: avg };
      }
    }
    return bestWindow;
  },[entries]);

  const isQuietHour = (date: Date) => {
    const h = date.getHours();
    if (quietStart < quietEnd) {
      return h >= quietStart && h < quietEnd;
    }
    // Overnight range (e.g., 22 -> 7)
    return h >= quietStart || h < quietEnd;
  };

  const quietHourEntries = last7.filter(e=> isQuietHour(e.timestamp));

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
      <div className="max-w-md mx-auto p-4">
        <div className="rounded-3xl p-6 mb-6" style={{
          background: isDark ? 'linear-gradient(135deg,#2D7A8B,#1a5f6f)' : 'linear-gradient(135deg,#4FB3C5,#2D7A8B)',
          boxShadow: isDark ? '0 8px 32px 0 rgba(31,38,135,0.37)' : '0 8px 32px 0 rgba(80,180,197,0.15)',
          backdropFilter: 'blur(8px)',
          border: isDark ? '1.5px solid #2d7a8b44' : '1.5px solid #4fb3c544',
        }}>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2"><Brain className="w-6 h-6"/>Insights</h2>
          <p className="text-sm" style={{color:'rgba(255,255,255,0.85)'}}>
            Your personalized wellbeing and focus guidance.
          </p>
        </div>

        {/* Daily Briefing */}
        <motion.div layout className="rounded-3xl p-5 mb-5" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-3"><Sparkles className="w-5 h-5"/><h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>Daily Briefing</h3></div>
          {entries.length === 0 && <p className="text-sm" style={{color:isDark?'#bbb':'#2D7A8B'}}>Log a mood to start receiving insights.</p>}
          {entries.length > 0 && (
            <ul className="text-sm space-y-2" style={{color:isDark?'#ccc':'#2D7A8B'}}>
              <li>Wellbeing score: <strong>{wellbeingScore}/100</strong> ({burnoutRisk === 'high' ? '⚠️ monitor stress' : burnoutRisk === 'medium' ? 'steady attention' : 'looking good'})</li>
              <li>Logging consistency: {(consistency*100).toFixed(0)}%</li>
              <li>Avg mood (7d): {last7.length ? (last7.reduce((s,e)=>s+e.intensity,0)/last7.length).toFixed(2) : '—'}</li>
              {focusSuggestion && <li>Best focus window: {focusSuggestion.start}:00 - {(focusSuggestion.start+2)%24}:00 (avg {(focusSuggestion.score).toFixed(2)})</li>}
            </ul>
          )}
        </motion.div>

        {/* Wellbeing Score */}
        <motion.div layout className="rounded-3xl p-5 mb-5" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-3"><Activity className="w-5 h-5"/><h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>Wellbeing Score</h3></div>
          <div className="space-y-3">
            <div className="h-3 w-full rounded-full overflow-hidden" style={{background:isDark?'#1a2332':'#E8F6F8'}}>
              <motion.div initial={{width:0}} animate={{width:`${wellbeingScore}%`}} transition={{duration:0.8}} className="h-full" style={{background: wellbeingScore>70 ? '#7DD4A8' : wellbeingScore>40? '#FFB84D':'#FF6B6B'}} />
            </div>
            <p className="text-sm" style={{color:isDark?'#ccc':'#2D7A8B'}}>Composite of mood quality, stability and logging habits.</p>
            <p className="text-xs" style={{color:isDark?'#889':'#557'}}>Variance: {variance.toFixed(2)} • Consistency: {(consistency*100).toFixed(0)}% • Burnout risk: {burnoutRisk}</p>
          </div>
        </motion.div>

        {/* Focus Time Suggestion */}
        <motion.div layout className="rounded-3xl p-5 mb-5" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-3"><Timer className="w-5 h-5"/><h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>Focus Time</h3></div>
          {!focusSuggestion && <p className="text-sm" style={{color:isDark?'#bbb':'#2D7A8B'}}>Need more data to recommend an optimal window.</p>}
          {focusSuggestion && (
            <div>
              <p className="text-sm mb-2" style={{color:isDark?'#ccc':'#2D7A8B'}}>Suggested 2-hour deep work block:</p>
              <p className="text-base font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>{focusSuggestion.start}:00 - {(focusSuggestion.start+2)%24}:00</p>
              <p className="text-xs mt-1" style={{color:isDark?'#889':'#557'}}>Based on your higher mood / intensity periods.</p>
            </div>
          )}
        </motion.div>

        {/* Break Reminders */}
        <motion.div layout className="rounded-3xl p-5 mb-5" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-3"><Coffee className="w-5 h-5"/><h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>Break Reminders</h3></div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm" style={{color:isDark?'#ccc':'#2D7A8B'}}>
              Interval (minutes):
              <select aria-label="Break interval" value={breakIntervalMin} onChange={e=> setBreakIntervalMin(parseInt(e.target.value))} className="px-2 py-1 rounded" style={{background:isDark?'#232946':'#E8F6F8', color:isDark?'#fff':'#2D7A8B'}}>
                {[30,45,60,90,120].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <p className="text-xs" style={{color:isDark?'#889':'#557'}}>Next break in {minutesToNextBreak} min.</p>
            <button onClick={()=> { setLastBreak(new Date()); toast('Break taken ✅'); }} className="text-xs px-3 py-1 rounded-full" style={{background:'#4FB3C5', color:'#fff'}}>Log Break</button>
          </div>
        </motion.div>

        {/* Quiet Hours */}
        <motion.div layout className="rounded-3xl p-5 mb-5" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-3"><Moon className="w-5 h-5"/><h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>Quiet Hours</h3></div>
          <div className="flex flex-wrap gap-4 items-end mb-3">
            <label className="flex flex-col text-xs" style={{color:isDark?'#ccc':'#2D7A8B'}}>Start
              <input aria-label="Quiet hours start" type="number" min={0} max={23} value={quietStart} onChange={e=> setQuietStart(parseInt(e.target.value)||0)} className="mt-1 px-2 py-1 rounded" style={{background:isDark?'#232946':'#E8F6F8', color:isDark?'#fff':'#2D7A8B'}} />
            </label>
            <label className="flex flex-col text-xs" style={{color:isDark?'#ccc':'#2D7A8B'}}>End
              <input aria-label="Quiet hours end" type="number" min={0} max={23} value={quietEnd} onChange={e=> setQuietEnd(parseInt(e.target.value)||0)} className="mt-1 px-2 py-1 rounded" style={{background:isDark?'#232946':'#E8F6F8', color:isDark?'#fff':'#2D7A8B'}} />
            </label>
          </div>
          <p className="text-xs" style={{color:isDark?'#889':'#557'}}>Entries during quiet hours (7d): {quietHourEntries.length}</p>
        </motion.div>

        {/* Weekly Digest */}
        <motion.div layout className="rounded-3xl p-5 mb-24" style={sectionStyle}>
          <div className="flex items-center gap-2 mb-3"><CalendarDays className="w-5 h-5"/><h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>Weekly Digest</h3></div>
          {last7.length === 0 && <p className="text-sm" style={{color:isDark?'#bbb':'#2D7A8B'}}>Not enough data yet.</p>}
          {last7.length>0 && (
            <div className="space-y-2 text-sm" style={{color:isDark?'#ccc':'#2D7A8B'}}>
              <p>Entries: {last7.length}</p>
              <p>Average mood: {(last7.reduce((s,e)=>s+e.intensity,0)/last7.length).toFixed(2)}</p>
              <p>Most frequent mood: {(() => { const map:Record<string,number>={}; last7.forEach(e=> map[e.mood]=(map[e.mood]||0)+1); return Object.entries(map).sort((a,b)=>b[1]-a[1])[0][0]; })()}</p>
              <div>
                <p className="font-semibold mt-2">Top notes themes:</p>
                <ul className="list-disc ml-5 text-xs">
                  {(() => {
                    const noteWords: Record<string, number> = {};
                    last7.filter(e=> e.note).forEach(e=> {
                      e.note.split(/\s+/).forEach(w=> {
                        const k = w.toLowerCase().replace(/[^a-z0-9]/g,'');
                        if (!k || k.length < 4) return;
                        noteWords[k] = (noteWords[k]||0)+1;
                      });
                    });
                    return Object.entries(noteWords).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([w,c])=> <li key={w}>{w} ({c})</li>);
                  })()}
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
