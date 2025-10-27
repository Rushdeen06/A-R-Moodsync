import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Wind } from 'lucide-react';

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // Move to next phase
        if (phase === 'inhale') {
          setPhase('hold');
          return 7;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return 8;
        } else {
          setPhase('inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const toggleExercise = () => {
    if (!isActive) {
      setPhase('inhale');
      setCountdown(4);
    }
    setIsActive(!isActive);
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-blue-600';
      case 'hold':
        return 'from-purple-400 to-purple-600';
      case 'exhale':
        return 'from-green-400 to-green-600';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.2;
      case 'hold':
        return 1.2;
      case 'exhale':
        return 0.8;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-blue-500" />
          Breathing Exercise
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-48 flex items-center justify-center">
          <AnimatePresence>
            {isActive && (
              <motion.div
                key={phase}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: getScale(), opacity: 1 }}
                transition={{ duration: phase === 'inhale' ? 4 : phase === 'hold' ? 7 : 8 }}
                className={`absolute w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-2xl`}
              />
            )}
          </AnimatePresence>
          
          <div className="relative z-10 text-center">
            <div className="text-5xl mb-2">{countdown}</div>
            <div className="text-sm uppercase tracking-wider text-gray-600">
              {isActive ? phase : 'Ready'}
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-600 mb-3">
          4-7-8 Breathing Technique: Inhale (4s) → Hold (7s) → Exhale (8s)
        </div>

        <Button onClick={toggleExercise} className="w-full h-12">
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-2" /> Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" /> Start Exercise
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
