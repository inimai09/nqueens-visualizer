import { motion } from 'framer-motion';
import { SolverState } from '../types';

interface SolutionTreeProps {
  state: SolverState;
  onSelect: (index: number) => void;
}

function MiniBoard({ solution, n, isActive, index, onClick }: {
  solution: number[];
  n: number;
  isActive: boolean;
  index: number;
  onClick: () => void;
}) {
  const size = Math.max(3, Math.min(6, Math.floor(80 / n)));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.015 }}
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center gap-1"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, ${size}px)`,
          gridTemplateRows: `repeat(${n}, ${size}px)`,
          border: isActive ? '2px solid #00f0ff' : '1px solid rgba(0,240,255,0.2)',
          boxShadow: isActive ? '0 0 12px rgba(0,240,255,0.6)' : 'none',
          borderRadius: '2px',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
        }}
      >
        {Array.from({ length: n }, (_, row) =>
          Array.from({ length: n }, (_, col) => {
            const hasQueen = solution[col] === row;
            const isLight = (row + col) % 2 === 0;
            return (
              <div
                key={`${col}-${row}`}
                style={{
                  width: size,
                  height: size,
                  background: hasQueen
                    ? isActive ? '#00f0ff' : 'rgba(0,240,255,0.7)'
                    : isLight ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.5)',
                  fontSize: size - 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1,
                }}
              />
            );
          })
        )}
      </div>
      <span className="text-[9px] font-mono" style={{ color: isActive ? '#00f0ff' : 'rgba(255,255,255,0.3)' }}>
        #{index + 1}
      </span>
    </motion.div>
  );
}

const KNOWN_COUNTS: Record<number, number> = {
  4: 2, 5: 10, 6: 4, 7: 40, 8: 92, 9: 352, 10: 724, 11: 2680, 12: 14200
};

export function SolutionTree({ state, onSelect }: SolutionTreeProps) {
  const { solutions, n, currentSolutionIndex, status } = state;
  const known = KNOWN_COUNTS[n] ?? '?';

  if (solutions.length === 0 && status !== 'complete') {
    return (
      <div
        className="rounded-lg p-4"
        style={{ border: '1px solid rgba(0,240,255,0.12)', background: 'rgba(0,0,0,0.5)' }}
      >
        <div className="text-xs font-display font-black tracking-widest mb-3" style={{ color: '#00f0ff' }}>
          ◈ SOLUTION TREE
        </div>
        <div className="text-center py-6">
          <div className="text-3xl font-display font-black mb-2" style={{ color: '#00f0ff' }}>
            {known}
          </div>
          <div className="text-xs font-mono tracking-widest opacity-50 uppercase">
            Total solutions for N={n}
          </div>
          <div className="mt-3 text-[10px] font-mono opacity-40 leading-relaxed">
            Press SOLVE or use STEP mode<br/>to explore all possibilities
          </div>
        </div>

        {/* Possibility stats */}
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className="text-sm font-display font-bold" style={{ color: '#bf00ff' }}>
              {(Math.pow(n, n) / 1000).toFixed(0)}K
            </div>
            <div className="text-[9px] font-mono opacity-40">NAIVE GUESSES</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-display font-bold" style={{ color: '#ff003c' }}>
              {((known as number) / Math.pow(n, n) * 100).toFixed(3)}%
            </div>
            <div className="text-[9px] font-mono opacity-40">SUCCESS RATE</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg p-4"
      style={{ border: '1px solid rgba(0,240,255,0.12)', background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-display font-black tracking-widest" style={{ color: '#00f0ff' }}>
          ◈ ALL SOLUTIONS
        </div>
        <div className="text-xs font-mono font-bold" style={{ color: '#00ff88' }}>
          {solutions.length} FOUND
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex gap-3 mb-3 p-2 rounded" style={{ background: 'rgba(0,240,255,0.05)', border: '1px solid rgba(0,240,255,0.1)' }}>
        <div className="text-center flex-1">
          <div className="text-lg font-display font-black" style={{ color: '#00f0ff' }}>{solutions.length}</div>
          <div className="text-[9px] font-mono opacity-50">SOLUTIONS</div>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center flex-1">
          <div className="text-lg font-display font-black" style={{ color: '#bf00ff' }}>{currentSolutionIndex + 1}</div>
          <div className="text-[9px] font-mono opacity-50">VIEWING</div>
        </div>
        <div className="w-px bg-white/10" />
        <div className="text-center flex-1">
          <div className="text-lg font-display font-black" style={{ color: '#ff003c' }}>N={n}</div>
          <div className="text-[9px] font-mono opacity-50">BOARD</div>
        </div>
      </div>

      {/* Mini solution grid */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: '220px' }}
      >
        <div className="flex flex-wrap gap-2 justify-start">
          {solutions.map((sol, i) => (
            <MiniBoard
              key={i}
              solution={sol}
              n={n}
              isActive={i === currentSolutionIndex}
              index={i}
              onClick={() => onSelect(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
