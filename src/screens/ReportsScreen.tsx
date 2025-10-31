import { MoodReports } from '../components/reports/MoodReports';

interface ReportsScreenProps {
  entries: Array<{
    id: string;
    mood: string;
    note: string;
    timestamp: Date;
    intensity: number;
    category?: string;
  }>;
  userName: string;
  currentStreak: number;
}

export function ReportsScreen({ entries, userName, currentStreak }: ReportsScreenProps) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <MoodReports entries={entries} userName={userName} currentStreak={currentStreak} />
    </div>
  );
}
