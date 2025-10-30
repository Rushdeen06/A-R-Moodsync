import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
const MobileProfile = (await import('../components/mobile/MobileProfile')).MobileProfile;

interface ProfileScreenProps {
  userName: string;
  userEmail: string;
  totalEntries: number;
  currentStreak: number;
  onLogout: () => void;
  entries?: Array<{ mood: string; intensity?: number }>;
}

export function ProfileScreen(props: ProfileScreenProps) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}>
      <MobileProfile {...props} />
    </Suspense>
  );
}
