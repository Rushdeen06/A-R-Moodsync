import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Play, Pause, RotateCcw, Wind, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MobileBreathingProps {
  onComplete?: () => void;
}

export function MobileBreathing({ onComplete }: MobileBreathingProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);

  const DURATIONS = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  };

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCount((prev) => {
        const currentDuration = DURATIONS[phase];
        if (prev >= currentDuration) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold');
          } else if (phase === 'hold') {
            setPhase('exhale');
          } else {
            setPhase('inhale');
            setTotalCycles((c) => c + 1);
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(0);
    setTotalCycles(0);
  };

  const getCircleSize = () => {
    if (phase === 'inhale') {
      return 120 + (count / DURATIONS.inhale) * 80;
    } else if (phase === 'exhale') {
      return 200 - (count / DURATIONS.exhale) * 80;
    }
    return 200;
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return '#7DD4A8';
      case 'hold': return '#FFB84D';
      case 'exhale': return '#4FB3C5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pb-20 flex flex-col"
      style={{ backgroundColor: '#E8F6F8' }}
    >
      <div className="max-w-md mx-auto p-6 flex-1 flex flex-col relative">
        {/* Back Button */}
        {onComplete && (
          <motion.button
            onClick={onComplete}
            className="absolute top-4 left-4 p-2 rounded-lg backdrop-blur-sm z-10"
            style={{
              color: '#2D7A8B',
              backgroundColor: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        )}
        
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#D4F1E8' }}
          >
            <Wind className="w-8 h-8" style={{ color: '#7DD4A8' }} />
          </div>
          <h2 className="text-2xl mb-2" style={{ color: '#2D7A8B' }}>
            Breathing Exercise
          </h2>
          <p className="text-sm" style={{ color: '#4FB3C5' }}>
            Find your calm with guided breathing
          </p>
        </div>

        {/* Breathing Circle */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                width: 240,
                height: 240,
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                border: '2px solid',
                borderColor: '#D4E9F1',
              }}
            />

            {/* Animated breathing circle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                className="rounded-full flex items-center justify-center"
                animate={{
                  width: getCircleSize(),
                  height: getCircleSize(),
                }}
                transition={{
                  duration: DURATIONS[phase],
                  ease: 'easeInOut',
                }}
                style={{
                  backgroundColor: getPhaseColor(),
                  opacity: 0.8,
                }}
              >
                <div className="text-center text-white">
                  <p className="text-4xl mb-2 capitalize">
                    {phase}
                  </p>
                  <p className="text-6xl font-bold">
                    {DURATIONS[phase] - count}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl mb-1" style={{ color: '#2D7A8B' }}>
                {totalCycles}
              </p>
              <p className="text-xs" style={{ color: '#4FB3C5' }}>
                Cycles
              </p>
            </div>
            <div>
              <p className="text-2xl mb-1" style={{ color: '#2D7A8B' }}>
                {Math.floor(totalCycles * 14 / 60)}
              </p>
              <p className="text-xs" style={{ color: '#4FB3C5' }}>
                Minutes
              </p>
            </div>
            <div>
              <p className="text-2xl mb-1" style={{ color: '#2D7A8B' }}>
                {phase === 'inhale' ? '↑' : phase === 'exhale' ? '↓' : '•'}
              </p>
              <p className="text-xs capitalize" style={{ color: '#4FB3C5' }}>
                {phase}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <Button
            onClick={handleToggle}
            className="flex-1 h-14 rounded-xl text-white"
            style={{ backgroundColor: isActive ? '#FF6B6B' : '#4FB3C5' }}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="h-14 px-6 rounded-xl border-2"
            style={{ 
              borderColor: '#D4E9F1',
              color: '#2D7A8B'
            }}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm mb-3" style={{ color: '#2D7A8B' }}>
            How it works
          </h3>
          <ul className="space-y-2 text-xs" style={{ color: '#4FB3C5' }}>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: '#7DD4A8' }}>1</span>
              <span>Breathe in slowly through your nose for 4 seconds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: '#FFB84D' }}>2</span>
              <span>Hold your breath for 4 seconds</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: '#4FB3C5' }}>3</span>
              <span>Exhale slowly through your mouth for 6 seconds</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
