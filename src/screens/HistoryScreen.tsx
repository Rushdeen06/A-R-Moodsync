import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { MoodEntry } from './types';
const MobileHistory = (await import('../components/mobile/MobileHistory')).MobileHistory;

export function HistoryScreen({ entries }: { entries: MoodEntry[] }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}>
      <MobileHistory entries={entries} />
    </Suspense>
  );
}
