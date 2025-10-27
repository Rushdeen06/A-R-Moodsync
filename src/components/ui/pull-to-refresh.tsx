import { motion, useMotionValue, useTransform, useAnimation } from 'motion/react';
import { useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const y = useMotionValue(0);
  const controls = useAnimation();
  const pullProgress = useTransform(y, [0, 80], [0, 1]);
  
  useEffect(() => {
    return y.on('change', (current: number) => {
      if (current > 80) {
        controls.start('refreshing');
        onRefresh().then(() => {
          controls.start('idle');
          y.set(0);
        });
      }
    });
  }, [controls, onRefresh, y]);

  return (
    <motion.div
      style={{ y }}
      drag="y"
      dragElastic={0.3}
      dragConstraints={{ top: 0, bottom: 0 }}
    >
      <motion.div
        style={{
          height: useTransform(y, [0, 80], [0, 40]),
          opacity: pullProgress
        }}
        className="flex items-center justify-center"
      >
        <motion.div
          animate={controls}
          variants={{
            idle: { rotate: 0 },
            refreshing: { rotate: 360 }
          }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
          className="w-6 h-6 border-2 border-primary rounded-full border-t-transparent"
        />
      </motion.div>
      {children}
    </motion.div>
  );
}