import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../utils/ThemeProvider';
import { Download, FileText, Calendar as CalendarIcon, Shield } from 'lucide-react';
import { toast } from '../ui/sonner';

interface ReportExporterProps {
  teamId: string;
  teamName: string;
  onGenerateReport: (type: string, dateRange: {start: Date; end: Date}) => Promise<Blob>;
}

const REPORT_TYPES = [
  { 
    id: 'wellbeing', 
    label: 'Team Wellbeing Summary', 
    description: 'Aggregated mood scores, participation rates, trend analysis',
    icon: '📊'
  },
  { 
    id: 'engagement', 
    label: 'Engagement & Participation', 
    description: 'Check-in frequency, day patterns, consistency metrics',
    icon: '📈'
  },
  { 
    id: 'interventions', 
    label: 'Manager Interventions Log', 
    description: 'Check-ins scheduled, support actions taken (anonymized)',
    icon: '🤝'
  },
  { 
    id: 'feedback', 
    label: 'Anonymous Feedback Summary', 
    description: 'Aggregated themes, sentiment analysis, top concerns',
    icon: '💬'
  },
];

export function ReportExporter({ teamName, onGenerateReport }: ReportExporterProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [generating, setGenerating] = React.useState<string | null>(null);
  const [dateRange, setDateRange] = React.useState({
    start: new Date(Date.now() - 30*24*60*60*1000),
    end: new Date()
  });

  const handleGenerate = async (type: string) => {
    setGenerating(type);
    try {
      const blob = await onGenerateReport(type, dateRange);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${teamName}_${type}_${dateRange.end.toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully ✅');
    } catch (error) {
      console.error('Report generation failed:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  const sectionStyle: React.CSSProperties = {
    background: isDark ? 'rgba(45,55,72,0.85)' : 'rgba(255,255,255,0.85)',
    boxShadow: isDark ? '0 4px 24px 0 #2d7a8b22' : '0 4px 24px 0 #4fb3c522',
    backdropFilter: 'blur(10px)',
    border: isDark ? '1.5px solid #2d7a8b33' : '1.5px solid #4fb3c533',
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice */}
      <motion.div layout className="rounded-2xl p-4 flex items-start gap-3" style={{
        background:isDark?'#2d3748':'#E8F6F8',
        border:`1px solid ${isDark?'#4FB3C533':'#4FB3C522'}`
      }}>
        <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color:'#4FB3C5'}}/>
        <div>
          <p className="text-xs font-semibold mb-1" style={{color:isDark?'#fff':'#2D7A8B'}}>
            Privacy & Compliance
          </p>
          <p className="text-xs" style={{color:isDark?'#bbb':'#557'}}>
            All reports are anonymized and aggregate data only. Individual employee data is never exposed. GDPR compliant.
          </p>
        </div>
      </motion.div>

      {/* Date Range Selector */}
      <motion.div layout className="rounded-3xl p-5" style={sectionStyle}>
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5" style={{color:'#4FB3C5'}}/>
          <h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
            Date Range
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-xs font-semibold mb-2" style={{color:isDark?'#bbb':'#557'}}>
              Start Date
            </span>
            <input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={e => setDateRange({...dateRange, start: new Date(e.target.value)})}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background:isDark?'#232946':'#F5F8FA',
                color:isDark?'#fff':'#2D7A8B',
                border:`1px solid ${isDark?'#2d7a8b33':'#4fb3c533'}`
              }}
              aria-label="Report start date"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-xs font-semibold mb-2" style={{color:isDark?'#bbb':'#557'}}>
              End Date
            </span>
            <input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={e => setDateRange({...dateRange, end: new Date(e.target.value)})}
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background:isDark?'#232946':'#F5F8FA',
                color:isDark?'#fff':'#2D7A8B',
                border:`1px solid ${isDark?'#2d7a8b33':'#4fb3c533'}`
              }}
              aria-label="Report end date"
            />
          </label>
        </div>
      </motion.div>

      {/* Report Types */}
      <motion.div layout className="rounded-3xl p-5" style={sectionStyle}>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" style={{color:'#7DD4A8'}}/>
          <h3 className="text-lg font-semibold" style={{color:isDark?'#fff':'#2D7A8B'}}>
            Available Reports
          </h3>
        </div>
        <div className="space-y-3">
          {REPORT_TYPES.map(report => (
            <div key={report.id} className="flex items-center justify-between p-4 rounded-xl" style={{
              background:isDark?'#232946':'#F5F8FA'
            }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl">{report.icon}</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1" style={{color:isDark?'#fff':'#2D7A8B'}}>
                    {report.label}
                  </p>
                  <p className="text-xs" style={{color:isDark?'#889':'#557'}}>
                    {report.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleGenerate(report.id)}
                disabled={generating === report.id}
                className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all"
                style={{
                  background: generating === report.id ? isDark?'#2d3748':'#E8F6F8' : '#4FB3C5',
                  color: generating === report.id ? isDark?'#889':'#557' : '#fff',
                  cursor: generating === report.id ? 'not-allowed' : 'pointer',
                  opacity: generating === report.id ? 0.6 : 1
                }}
                aria-label={`Download ${report.label}`}
              >
                {generating === report.id ? (
                  'Generating...'
                ) : (
                  <>
                    <Download className="w-4 h-4"/>
                    Export
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Info Footer */}
      <p className="text-xs text-center px-4" style={{color:isDark?'#889':'#557'}}>
        Reports are generated in CSV format. For detailed analytics or custom reports, contact your HR administrator.
      </p>
    </div>
  );
}
