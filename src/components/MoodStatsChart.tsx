import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MoodStatsChartProps {
  entries: Array<{ mood: string; intensity?: number }>;
}

const COLORS: Record<string, string> = {
  great: '#7DD4A8',
  good: '#4FB3C5',
  okay: '#FFB84D',
  low: '#FF8C61',
  'very-low': '#FF6B9D'
};

export function MoodStatsChart({ entries }: MoodStatsChartProps) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1; });
    return Object.entries(counts).map(([mood, value]) => ({ mood, value }));
  }, [entries]);

  if (!data.length) {
    return <p className="text-xs text-center opacity-60">No mood data yet</p>;
  }

  return (
    <div style={{ width: '100%', height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="mood"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
          >
            {data.map(d => (
              <Cell key={d.mood} fill={COLORS[d.mood] || '#4FB3C5'} />
            ))}
          </Pie>
          <Tooltip formatter={(v:number, name:string) => [`${v} entries`, name]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}