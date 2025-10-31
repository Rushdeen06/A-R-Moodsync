import { useState } from 'react';
import { AchievementsSystem } from '../components/gamification/AchievementsSystem';
import { TeamLeaderboard } from '../components/gamification/TeamLeaderboard';
import type { TeamMember } from '../types/workspace';

interface AchievementsScreenProps {
  totalEntries: number;
  currentStreak: number;
  entries: Array<{
    id: string;
    mood: string;
    note: string;
    timestamp: Date;
    intensity: number;
    userName?: string;
  }>;
}

export function AchievementsScreen({ totalEntries, currentStreak, entries }: AchievementsScreenProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard'>('achievements');

  // Mock social posts and insights viewed for demo
  const socialPosts = 5;
  const insightsViewed = 3;

  // Create sample team members from unique users
  const uniqueUsers = Array.from(new Set(entries.map(e => e.userName || 'You')));
  const teamMembers: TeamMember[] = uniqueUsers.map((userName, idx) => {
    const userEntries = entries.filter(e => (e.userName || 'You') === userName);
    
    return {
      id: 'user-' + idx,
      teamId: 'default-team',
      userId: 'user-' + idx,
      userName,
      email: `${userName.toLowerCase().replace(/\s+/g, '.')}@company.com`,
      role: 'member',
      joinedAt: new Date(Math.min(...userEntries.map(e => e.timestamp.getTime()))),
    };
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'achievements'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🏆 Achievements
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📊 Leaderboard
        </button>
      </div>

      {/* Content */}
      {activeTab === 'achievements' ? (
        <AchievementsSystem
          totalEntries={totalEntries}
          currentStreak={currentStreak}
          socialPosts={socialPosts}
          insightsViewed={insightsViewed}
        />
      ) : (
        <TeamLeaderboard members={teamMembers} entries={entries} />
      )}
    </div>
  );
}
