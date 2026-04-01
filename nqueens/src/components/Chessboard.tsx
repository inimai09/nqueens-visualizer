import { motion } from 'framer-motion';
import { Square } from './Square';
import { getAttackedSquares, getConflicts } from '../utils/nQueensSolver';
import { SolverState } from '../types';

interface ChessboardProps {
  state: SolverState;
  onSquareClick?: (col: number, row: number) => void;
}

export function Chessboard({ state, onSquareClick }: ChessboardProps) {
  const { n, board, mode, steps, currentStepIndex } = state;
  const attacked = getAttackedSquares(board, n);
  const conflicts = getConflicts(board, n);

  // For step mode: which cell is being "tried"
  const tryingCell = mode === 'step' && currentStepIndex >= 0 && currentStepIndex < steps.length
    ? steps[currentStepIndex]
    : null;

  const isTrying = (col: number, row: number) =>
    tryingCell?.action === 'conflict' && tryingCell.col === col && tryingCell.row === row;

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Column labels */}
      <div className="flex gap-0" style={{ paddingLeft: '20px' }}>
        {Array.from({ length: n }, (_, i) => (
          <div
            key={i}
            className="text-center text-xs font-mono opacity-40"
            style={{ width: `min(calc((min(480px, 80vw)) / ${n}), 56px)` }}
          >
            {String.fromCharCode(65 + i)}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {/* Row labels */}
        <div className="flex flex-col justify-around">
          {Array.from({ length: n }, (_, i) => (
            <div key={i} className="text-xs font-mono opacity-40 w-4 text-right leading-none">
              {n - i}
            </div>
          ))}
        </div>

        {/* Board */}
        <motion.div
          className="relative"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${n}, 1fr)`,
            gridTemplateRows: `repeat(${n}, 1fr)`,
            width: `min(480px, 80vw)`,
            height: `min(480px, 80vw)`,
            border: '2px solid rgba(0,240,255,0.3)',
            boxShadow: '0 0 30px rgba(0,240,255,0.15), inset 0 0 30px rgba(0,0,0,0.5)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {Array.from({ length: n }, (_, row) =>
            Array.from({ length: n }, (_, col) => {
              const isLight = (row + col) % 2 === 0;
              const hasQueen = board[col] === row;
              const key = `${col},${row}`;
              const isAttacked = attacked.has(key);
              const isConflict = conflicts.has(key);
              const trying = isTrying(col, row);

              return (
                <Square
                  key={key}
                  col={col}
                  row={row}
                  n={n}
                  hasQueen={hasQueen}
                  isLight={isLight}
                  isAttacked={isAttacked}
                  isConflict={isConflict}
                  isTrying={trying}
                  onClick={() => onSquareClick?.(col, row)}
                />
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
