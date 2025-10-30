export interface MoodEntry {
  id: string;
  userId?: string;
  mood: string;
  note: string;
  timestamp: Date;
  intensity: number;
  category?: string;
  userName?: string;
}
