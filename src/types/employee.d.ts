// Employee and Team type definitions for workplace features

export type UserRole = 'employee' | 'manager' | 'admin';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId: string;
  joinedAt: Date;
  lastCheckIn?: Date;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface Team {
  id: string;
  name: string;
  managerId: string;
  memberIds: string[];
  department?: string;
  createdAt: Date;
}

export interface TeamMetrics {
  avgWellbeing: number;
  participationRate: number;
  atRiskCount: number;
  trendDirection: 'improving' | 'stable' | 'declining';
  topConcerns: string[];
}

export interface AnonymousFeedback {
  id: string;
  teamId: string;
  category: 'workload' | 'culture' | 'management' | 'growth' | 'other';
  message: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
  resolved: boolean;
}

export interface Intervention {
  id: string;
  managerId: string;
  employeeId: string;
  type: 'check-in' | 'support' | 'accommodation';
  notes: string;
  scheduledDate?: Date;
  completedDate?: Date;
  status: 'pending' | 'completed' | 'cancelled';
}
