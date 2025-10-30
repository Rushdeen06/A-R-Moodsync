import { UnifiedDashboard } from '../components/mobile/UnifiedDashboard';
import { MoodEntry } from './types';

interface DashboardScreenProps {
  entries: MoodEntry[];
  onSubmitMood: (mood: string, note: string) => void;
  currentStreak: number;
  userName: string;
  onNavigate: (screen: string) => void;
}

export function DashboardScreen({ entries, onSubmitMood, currentStreak, userName, onNavigate }: DashboardScreenProps) {
  return (
    <UnifiedDashboard
      entries={entries}
      onSubmitMood={onSubmitMood}
      currentStreak={currentStreak}
      userName={userName}
      onNavigate={onNavigate}
    />
  );
}
