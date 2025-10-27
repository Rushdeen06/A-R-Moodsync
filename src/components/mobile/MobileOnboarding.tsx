import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ChevronRight, Heart, TrendingUp, Users, Wind } from 'lucide-react';

interface MobileOnboardingProps {
  onComplete: () => void;
}

const SLIDES = [
  {
    icon: Heart,
    color: '#FF6B6B',
    title: 'Track Your Mood',
    description: 'Check in daily with a simple 1-5 scale and optional notes',
  },
  {
    icon: TrendingUp,
    color: '#4FB3C5',
    title: 'See Your Progress',
    description: 'Visualize trends and patterns in your mood over time',
  },
  {
    icon: Wind,
    color: '#7DD4A8',
    title: 'Stay Balanced',
    description: 'Get AI-powered suggestions and breathing exercises',
  },
  {
    icon: Users,
    color: '#9B7FD8',
    title: 'Connect & Share',
    description: 'Find break buddies and share with your community',
  },
];

export function MobileOnboarding({ onComplete }: MobileOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8F6F8' }}>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Skip Button */}
        <div className="w-full max-w-md mb-8">
          <button
            onClick={handleSkip}
            className="text-sm ml-auto block"
            style={{ color: '#4FB3C5' }}
          >
            Skip
          </button>
        </div>

        {/* Icon */}
        <motion.div
          key={currentSlide}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-32 h-32 rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: `${slide.color}20` }}
        >
          <Icon className="w-16 h-16" style={{ color: slide.color }} />
        </motion.div>

        {/* Content */}
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center max-w-md mb-12"
        >
          <h2 className="text-3xl mb-4" style={{ color: '#2D7A8B' }}>
            {slide.title}
          </h2>
          <p className="text-lg" style={{ color: '#4FB3C5' }}>
            {slide.description}
          </p>
        </motion.div>

        {/* Dots */}
        <div className="flex gap-2 mb-8">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="rounded-full transition-all"
              style={{
                width: currentSlide === index ? '32px' : '8px',
                height: '8px',
                backgroundColor: currentSlide === index ? '#4FB3C5' : '#D4E9F1',
              }}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          className="w-full max-w-md h-14 rounded-xl text-white"
          style={{ backgroundColor: '#4FB3C5' }}
        >
          {currentSlide < SLIDES.length - 1 ? (
            <>
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            "Let's Get Started!"
          )}
        </Button>
      </div>
    </div>
  );
}
