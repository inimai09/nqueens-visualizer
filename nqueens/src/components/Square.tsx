import { motion, AnimatePresence } from 'framer-motion';
import { Queen } from './Queen';

interface SquareProps {
  col: number;
  row: number;
  n: number;
  hasQueen: boolean;
  isLight: boolean;
  isAttacked: boolean;
  isConflict: boolean;
  isTrying: boolean;
  onClick?: () => void;
}

export function Square({
  col, row, n, hasQueen, isLight, isAttacked, isConflict, isTrying, onClick
}: SquareProps) {
  const getBackground = () => {
    if (isConflict) return 'rgba(255,0,60,0.35)';
    if (isTrying) return 'rgba(255,200,0,0.25)';
    if (isAttacked && !hasQueen) return isLight ? 'rgba(0,240,255,0.08)' : 'rgba(0,240,255,0.05)';
    return isLight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.35)';
  };

  const getBorder = () => {
    if (isConflict) return '1px solid rgba(255,0,60,0.7)';
    if (isTrying) return '1px solid rgba(255,200,0,0.5)';
    if (isAttacked && !hasQueen) return '1px solid rgba(0,240,255,0.2)';
    return isLight ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.2)';
  };

  return (
    <motion.div
      className="relative flex items-center justify-center cursor-pointer overflow-hidden"
      style={{
        background: getBackground(),
        border: getBorder(),
        transition: 'background 0.2s ease, border 0.2s ease',
        aspectRatio: '1',
      }}
      onClick={onClick}
      whileHover={{ brightness: 1.3 }}
    >
      {/* Grid coordinates for small boards */}
      {n <= 6 && (
        <span className="absolute top-0.5 left-1 text-[8px] opacity-20 font-mono text-cyan-400">
          {col},{row}
        </span>
      )}

      {/* Attack indicator dots */}
      {isAttacked && !hasQueen && (
        <motion.div
          className="w-1 h-1 rounded-full"
          style={{ background: isConflict ? '#ff003c' : 'rgba(0,240,255,0.4)' }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      <AnimatePresence>
        {hasQueen && (
          <Queen conflict={isConflict} isNew={true} />
        )}
      </AnimatePresence>

      {/* Corner accent on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
        style={{ background: 'radial-gradient(circle at center, rgba(0,240,255,0.1) 0%, transparent 70%)' }}
      />
    </motion.div>
  );
}
