import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
const MobileBreathing = (await import('../components/mobile/MobileBreathing')).MobileBreathing;

export function BreathingScreen({ onComplete }: { onComplete: () => void }) {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-teal-600" /></div>}>
      <MobileBreathing onComplete={onComplete} />
    </Suspense>
  );
}
