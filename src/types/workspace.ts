// Team/Workspace Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'member' | 'manager' | 'admin';
  avatarColor?: string;
  joinedDate: Date;
}

export interface TeamMoodEntry {
  id: string;
  userId: string;
  userName: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
  category?: string;
  isPrivate: boolean;
  calendarEventId?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: Date;
  settings: {
    allowAnonymous: boolean;
    enableLeaderboard: boolean;
    shareInsights: boolean;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  target: number;
  category: 'streak' | 'entries' | 'social' | 'insights';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'meeting' | 'focus' | 'break' | 'other';
  moodBefore?: string;
  moodAfter?: string;
}

export interface MoodReport {
  id: string;
  userId: string;
  type: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  data: {
    totalEntries: number;
    averageMood: number;
    moodDistribution: Record<string, number>;
    streakDays: number;
    insights: string[];
    recommendations: string[];
  };
  generatedAt: Date;
}

export interface CustomMoodCategory {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: Date;
}

export interface MoodTrigger {
  id: string;
  userId: string;
  mood: string;
  trigger: string;
  frequency: number;
  lastOccurred: Date;
}
