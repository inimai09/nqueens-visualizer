import { motion } from 'framer-motion';
import { SolverState } from '../types';

interface InfoPanelProps {
  state: SolverState;
}

const SOLUTIONS_COUNT: Record<number, number> = {
  1: 1, 2: 0, 3: 0, 4: 2, 5: 10, 6: 4, 7: 40,
  8: 92, 9: 352, 10: 724, 11: 2680, 12: 14200,
};

function StatBox({ label, value, color = '#00f0ff' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest opacity-50 font-mono">{label}</span>
      <motion.span
        key={String(value)}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-display font-bold"
        style={{ color }}
      >
        {value}
      </motion.span>
    </div>
  );
}

export function InfoPanel({ state }: InfoPanelProps) {
  const { n, solutions, currentSolutionIndex, status, nodesExplored, solveTime, steps, currentStepIndex } = state;
  const totalKnown = SOLUTIONS_COUNT[n] ?? '?';

  const statusColor = {
    idle: '#888',
    solving: '#ffaa00',
    solved: '#00f0ff',
    stepping: '#bf00ff',
    complete: '#00ff88',
  }[status];

  const statusLabel = {
    idle: 'READY',
    solving: 'COMPUTING...',
    solved: 'SOLVED',
    stepping: `STEP ${currentStepIndex + 1}/${steps.length}`,
    complete: 'COMPLETE',
  }[status];

  const queensPlaced = state.board.filter(r => r !== -1).length;

  return (
    <motion.div
      className="flex flex-col gap-4 p-4 rounded-lg"
      style={{
        background: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(0,240,255,0.15)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Status */}
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: statusColor }}
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="text-xs font-mono tracking-widest" style={{ color: statusColor }}>
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatBox label="Solutions" value={solutions.length > 0 ? solutions.length : totalKnown} />
        {status === 'solved' && solutions.length > 0 && (
          <StatBox label="Viewing" value={`${currentSolutionIndex + 1} / ${solutions.length}`} color="#bf00ff" />
        )}
        {status !== 'solved' && (
          <StatBox label="Queens" value={`${queensPlaced} / ${n}`} color="#bf00ff" />
        )}
        <StatBox label="Nodes" value={nodesExplored > 0 ? nodesExplored.toLocaleString() : '—'} color="#ffaa00" />
        <StatBox label="Time" value={solveTime > 0 ? `${solveTime.toFixed(1)}ms` : '—'} color="#00ff88" />
      </div>

      {/* Progress bar for stepping */}
      {state.mode === 'step' && steps.length > 0 && (
        <div>
          <div className="flex justify-between text-[10px] font-mono opacity-50 mb-1">
            <span>PROGRESS</span>
            <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="h-1 bg-black/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #bf00ff, #00f0ff)' }}
              animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
