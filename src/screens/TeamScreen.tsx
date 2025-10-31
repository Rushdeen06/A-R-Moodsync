import { TeamMoodBoard } from '../components/workplace/TeamMoodBoard';
import type { TeamMoodEntry } from '../types/workspace';

interface TeamScreenProps {
  entries: Array<{
    id: string;
    mood: string;
    note: string;
    timestamp: Date;
    intensity: number;
    userName?: string;
  }>;
}

export function TeamScreen({ entries }: TeamScreenProps) {
  // Convert entries to TeamMoodEntry format
  const teamEntries: TeamMoodEntry[] = entries.map(entry => ({
    id: entry.id,
    teamId: 'default-team',
    userId: entry.userName || 'user-' + Math.random().toString(36).substring(7),
    userName: entry.userName || 'Team Member',
    mood: entry.mood,
    note: entry.note,
    intensity: entry.intensity,
    timestamp: entry.timestamp,
    isPrivate: false,
  }));

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <TeamMoodBoard entries={teamEntries} />
    </div>
  );
}
