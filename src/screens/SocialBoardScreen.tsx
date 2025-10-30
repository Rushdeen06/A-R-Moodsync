import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { MoodEntry } from './types';
const MobileSocialBoard = (await import('../components/mobile/MobileSocialBoard')).MobileSocialBoard;

export function SocialBoardScreen({ entries }: { entries: MoodEntry[] }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}>
      <MobileSocialBoard entries={entries} onBack={() => window.history.back()} />
    </Suspense>
  );
}
