import { ManagerDashboard } from '../components/workplace/ManagerDashboard';
import type { TeamMoodEntry, TeamMember } from '../types/workspace';

interface ManagerScreenProps {
  entries: Array<{
    id: string;
    mood: string;
    note: string;
    timestamp: Date;
    intensity: number;
    userName?: string;
  }>;
}

export function ManagerScreen({ entries }: ManagerScreenProps) {
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

  // Create sample team members from unique users
  const uniqueUsers = Array.from(new Set(teamEntries.map(e => e.userId)));
  const teamMembers: TeamMember[] = uniqueUsers.map(userId => {
    const userEntries = teamEntries.filter(e => e.userId === userId);
    const userName = userEntries[0]?.userName || 'Team Member';
    
    return {
      id: userId,
      teamId: 'default-team',
      userId,
      userName,
      email: `${userName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      role: 'member',
      joinedAt: new Date(Math.min(...userEntries.map(e => e.timestamp.getTime()))),
    };
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <ManagerDashboard entries={teamEntries} teamMembers={teamMembers} />
    </div>
  );
}
