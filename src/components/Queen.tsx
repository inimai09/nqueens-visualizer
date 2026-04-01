import { motion } from 'framer-motion';

interface QueenProps {
  conflict?: boolean;
  isNew?: boolean;
}

export function Queen({ conflict, isNew }: QueenProps) {
  return (
    <motion.div
      initial={isNew ? { scale: 0, rotate: -180 } : { scale: 1 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="w-full h-full flex items-center justify-center select-none"
    >
      <div
        className={`queen-piece ${conflict ? 'conflict' : ''}`}
        style={{
          fontSize: 'clamp(12px, 3.5vmin, 36px)',
          textShadow: conflict
            ? '0 0 8px #ff003c, 0 0 20px #ff003c, 0 0 40px #ff003c'
            : '0 0 8px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
          filter: conflict ? 'hue-rotate(180deg) brightness(1.5)' : 'brightness(1.3)',
          transition: 'all 0.3s ease',
        }}
      >
        ♛
      </div>
    </motion.div>
  );
}
