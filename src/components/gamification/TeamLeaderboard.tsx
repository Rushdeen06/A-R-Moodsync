import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TeamMember } from '../../types/workspace';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  streak: number;
  totalEntries: number;
  rank: number;
}

interface TeamLeaderboardProps {
  teamMembers: TeamMember[];
  entriesByUser: Record<string, Array<{ mood: string; timestamp: Date; intensity: number }>>;
  allowAnonymous?: boolean;
}

export function TeamLeaderboard({ teamMembers, entriesByUser, allowAnonymous = false }: TeamLeaderboardProps) {
  const [showAnonymous, setShowAnonymous] = useState(allowAnonymous);

  const leaderboard: LeaderboardEntry[] = useMemo(() => {
    const entries = teamMembers.map(member => {
      const userEntries = entriesByUser[member.id] || [];
      
      // Calculate streak
      const sortedEntries = [...userEntries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const entry of sortedEntries) {
        const entryDate = new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === streak) {
          streak++;
        } else if (diffDays > streak) {
          break;
        }
      }

      // Calculate score: entries + streak * 10 + mood quality bonus
      const avgIntensity = userEntries.length
        ? userEntries.reduce((sum, e) => sum + e.intensity, 0) / userEntries.length
        : 0;
      
      const score = userEntries.length + (streak * 10) + Math.floor(avgIntensity * 5);

      return {
        userId: member.id,
  userName: member.name,
        score,
        streak,
        totalEntries: userEntries.length,
        rank: 0,
      };
    });

    // Sort by score and assign ranks
    entries.sort((a, b) => b.score - a.score);
    entries.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    return entries;
  }, [teamMembers, entriesByUser]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'bg-gray-50 border-gray-200';
    if (rank === 3) return 'bg-orange-50 border-orange-200';
    return 'bg-white border-gray-100';
  };

  const displayName = (name: string, userId: string) => {
    if (showAnonymous) {
      return `User ${userId.slice(0, 4)}`;
    }
    return name;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Team Leaderboard
          </h2>
          <p className="text-sm text-gray-500 mt-1">Top performers this month</p>
        </div>

        {allowAnonymous && (
          <button
            onClick={() => setShowAnonymous(!showAnonymous)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {showAnonymous ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="text-sm">Anonymous</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-sm">Show Names</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
              {leaderboard[1].userName.charAt(0)}
            </div>
            <Medal className="w-8 h-8 text-gray-400 mb-2" />
            <p className="font-bold text-center">{displayName(leaderboard[1].userName, leaderboard[1].userId)}</p>
            <p className="text-2xl font-bold text-gray-600">{leaderboard[1].score}</p>
            <p className="text-xs text-gray-500">points</p>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center -mt-4"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-xl ring-4 ring-yellow-300">
              {leaderboard[0].userName.charAt(0)}
            </div>
            <Trophy className="w-10 h-10 text-yellow-500 mb-2" />
            <p className="font-bold text-center">{displayName(leaderboard[0].userName, leaderboard[0].userId)}</p>
            <p className="text-3xl font-bold text-yellow-600">{leaderboard[0].score}</p>
            <p className="text-xs text-gray-500">points</p>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
              {leaderboard[2].userName.charAt(0)}
            </div>
            <Medal className="w-8 h-8 text-orange-600 mb-2" />
            <p className="font-bold text-center">{displayName(leaderboard[2].userName, leaderboard[2].userId)}</p>
            <p className="text-2xl font-bold text-orange-600">{leaderboard[2].score}</p>
            <p className="text-xs text-gray-500">points</p>
          </motion.div>
        </div>
      )}

      {/* Full Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
          <CardDescription>All team members sorted by performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {leaderboard.map((entry, idx) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-lg border-2 ${getRankColor(entry.rank)} hover:shadow-md transition-all`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                    {entry.userName.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">
                      {displayName(entry.userName, entry.userId)}
                    </p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        🔥 {entry.streak} day streak
                      </span>
                      <span className="text-xs text-gray-500">
                        📝 {entry.totalEntries} entries
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-600">{entry.score}</p>
                    <p className="text-xs text-gray-500">points</p>
                  </div>

                  {/* Trend (if top 3) */}
                  {entry.rank <= 3 && (
                    <div>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scoring Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">How Points Are Calculated</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-1">
          <p>• 1 point per mood entry</p>
          <p>• 10 points per day in current streak</p>
          <p>• Bonus points for positive mood consistency</p>
        </CardContent>
      </Card>
    </div>
  );
}
