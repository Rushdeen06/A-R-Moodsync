import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { FileText, Download, Calendar, TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface MoodEntry {
  id: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
  category?: string;
}

interface MoodReportsProps {
  entries: MoodEntry[];
  userName: string;
  currentStreak: number;
}

const MOOD_COLORS: Record<string, string> = {
  great: '#7DD4A8',
  good: '#4FB3C5',
  okay: '#FFB84D',
  low: '#FF8C61',
  'very-low': '#FF6B9D',
};

export function MoodReports({ entries, userName, currentStreak }: MoodReportsProps) {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

  const reportData = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    if (reportType === 'weekly') {
      cutoffDate.setDate(now.getDate() - 7);
    } else {
      cutoffDate.setMonth(now.getMonth() - 1);
    }

    const filteredEntries = entries.filter(e => e.timestamp >= cutoffDate);

    // Mood distribution
    const moodCounts: Record<string, number> = {};
    filteredEntries.forEach(e => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });

    const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      color: MOOD_COLORS[mood],
    }));

    // Average intensity
    const avgIntensity = filteredEntries.length
      ? (filteredEntries.reduce((sum, e) => sum + e.intensity, 0) / filteredEntries.length).toFixed(1)
      : '0';

    // Daily trend
    const dailyTrend: Array<{ date: string; avgMood: number; count: number }> = [];
    const days = reportType === 'weekly' ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayEntries = filteredEntries.filter(e => {
        const entryDate = new Date(e.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      });

      const avgMood = dayEntries.length
        ? dayEntries.reduce((sum, e) => sum + e.intensity, 0) / dayEntries.length
        : 0;

      dailyTrend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        avgMood: Number(avgMood.toFixed(1)),
        count: dayEntries.length,
      });
    }

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    filteredEntries.forEach(e => {
      const cat = e.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    // Insights
    const insights: string[] = [];
    
    if (avgIntensity >= '4') {
      insights.push('🎉 Your average mood is above 4/5 - excellent wellbeing!');
    } else if (avgIntensity < '3') {
      insights.push('💙 Your mood has been lower than usual. Consider reaching out for support.');
    }

    if (currentStreak >= 7) {
      insights.push(`🔥 Amazing ${currentStreak}-day streak! Consistency is key.`);
    }

    const mostCommonMood = moodDistribution.sort((a, b) => b.count - a.count)[0];
    if (mostCommonMood) {
      insights.push(`📊 Your most common mood: ${mostCommonMood.mood} (${mostCommonMood.count} times)`);
    }

    return {
      totalEntries: filteredEntries.length,
      avgIntensity,
      moodDistribution,
      dailyTrend,
      categoryBreakdown,
      insights,
      startDate: cutoffDate,
      endDate: now,
    };
  }, [entries, reportType, currentStreak]);

  const exportCSV = () => {
    const csvContent = [
      ['Date', 'Mood', 'Intensity', 'Note', 'Category'].join(','),
      ...entries.map(e =>
        [
          new Date(e.timestamp).toISOString(),
          e.mood,
          e.intensity,
          `"${e.note.replace(/"/g, '""')}"`,
          e.category || 'General',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    // Create HTML report for printing/PDF
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Mood Report - ${userName}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { color: #4FB3C5; }
          .stat { display: inline-block; margin: 20px; padding: 15px; background: #f0f0f0; border-radius: 8px; }
          .insight { padding: 10px; margin: 10px 0; background: #e8f6f8; border-left: 4px solid #4FB3C5; }
        </style>
      </head>
      <body>
        <h1>Mood Report: ${reportType === 'weekly' ? 'Weekly' : 'Monthly'}</h1>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Period:</strong> ${reportData.startDate.toLocaleDateString()} - ${reportData.endDate.toLocaleDateString()}</p>
        
        <h2>Summary</h2>
        <div class="stat"><strong>Total Entries:</strong> ${reportData.totalEntries}</div>
        <div class="stat"><strong>Average Mood:</strong> ${reportData.avgIntensity}/5</div>
        <div class="stat"><strong>Current Streak:</strong> ${currentStreak} days</div>
        
        <h2>Insights</h2>
        ${reportData.insights.map(insight => `<div class="insight">${insight}</div>`).join('')}
        
        <h2>Mood Distribution</h2>
        <ul>
          ${reportData.moodDistribution.map(m => `<li><strong>${m.mood}:</strong> ${m.count} entries</li>`).join('')}
        </ul>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Mood Reports
          </h2>
          <p className="text-sm text-gray-500 mt-1">Detailed insights and analytics</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportPDF} size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setReportType('weekly')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            reportType === 'weekly'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Weekly Report
        </button>
        <button
          onClick={() => setReportType('monthly')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            reportType === 'monthly'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Monthly Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Entries</p>
                <p className="text-3xl font-bold text-teal-600">{reportData.totalEntries}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-teal-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Mood</p>
                <p className="text-3xl font-bold text-purple-600">{reportData.avgIntensity}/5</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">{currentStreak}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <CardDescription>Personalized observations from your mood data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.insights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg bg-teal-50 border-l-4 border-teal-500"
              >
                <p className="text-gray-700">{insight}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Trend Over Time</CardTitle>
          <CardDescription>Daily average mood and entry count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reportData.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis yAxisId="left" domain={[0, 5]} stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="avgMood"
                  stroke="#4FB3C5"
                  strokeWidth={2}
                  name="Avg Mood"
                  dot={{ fill: '#4FB3C5', r: 4 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="count"
                  stroke="#7DD4A8"
                  strokeWidth={2}
                  name="Entries"
                  dot={{ fill: '#7DD4A8', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Mood Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Breakdown of your moods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportData.moodDistribution}
                    dataKey="count"
                    nameKey="mood"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {reportData.moodDistribution.map((entry) => (
                      <Cell key={entry.mood} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Entries by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData.categoryBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4FB3C5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
