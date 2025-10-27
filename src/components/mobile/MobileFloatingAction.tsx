import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

interface MobileFloatingActionProps {
  onClick: () => void;
}

export function MobileFloatingAction({ onClick }: MobileFloatingActionProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40"
      style={{ backgroundColor: '#4FB3C5' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <Plus className="w-6 h-6 text-white" />
    </motion.button>
  );
}
