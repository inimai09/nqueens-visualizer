import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Chessboard } from './components/Chessboard';
import { Controls } from './components/Controls';
import { InfoPanel } from './components/InfoPanel';
import { ExplainerPanel } from './components/ExplainerPanel';
import { useNQueensSolver } from './hooks/useNQueensSolver';
import './index.css';

function App() {
  const solver = useNQueensSolver();
  const { state, setN, solve, nextSolution, prevSolution, reset, setMode,
    initStepMode, stepForward, stepBack, togglePlay, setSpeed, placeManual } = solver;

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key) {
        case ' ': e.preventDefault(); state.mode === 'step' ? stepForward() : togglePlay(); break;
        case 'Enter': solve(); break;
        case 'ArrowRight': state.mode === 'solution' ? nextSolution() : stepForward(); break;
        case 'ArrowLeft': state.mode === 'solution' ? prevSolution() : stepBack(); break;
        case 'r': reset(); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.mode, solve, nextSolution, prevSolution, stepForward, stepBack, togglePlay, reset]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-dark)' }}>
      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'rgba(0,240,255,0.15)', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)' }}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-4">
          <motion.span
            className="text-3xl"
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            style={{ display: 'inline-block' }}
          >
            ♛
          </motion.span>
          <div>
            <h1 className="text-xl font-display font-black tracking-widest flicker neon-text-blue">
              N-QUEENS
            </h1>
            <p className="text-[10px] font-mono tracking-widest opacity-40">BACKTRACKING VISUALIZER</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Keyboard hint */}
          <div className="hidden md:flex gap-3 text-[10px] font-mono opacity-30">
            <span>[ENTER] SOLVE</span>
            <span>[SPACE] STEP</span>
            <span>[←→] NAV</span>
            <span>[R] RESET</span>
          </div>
          {/* Mode badge */}
          <div
            className="px-3 py-1 rounded text-xs font-mono tracking-widest"
            style={{
              color: state.mode === 'solution' ? '#00f0ff' : state.mode === 'step' ? '#bf00ff' : '#ffaa00',
              border: `1px solid currentColor`,
              background: 'rgba(0,0,0,0.5)',
            }}
          >
            {state.mode.toUpperCase()}
          </div>
        </div>
      </motion.header>

      {/* Main layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

        {/* Left: Chessboard */}
        <motion.main
          className="flex-1 flex items-center justify-center p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col items-center gap-4 w-full max-w-lg">
            <Chessboard
              state={state}
              onSquareClick={state.mode === 'manual' ? placeManual : undefined}
            />

            {/* Step action indicator */}
            {state.mode === 'step' && state.currentStepIndex >= 0 && (
              <motion.div
                key={state.currentStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-mono text-center px-4 py-2 rounded"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${
                    state.steps[state.currentStepIndex]?.action === 'conflict'
                      ? 'rgba(255,0,60,0.4)'
                      : state.steps[state.currentStepIndex]?.action === 'remove'
                      ? 'rgba(255,170,0,0.4)'
                      : 'rgba(0,240,255,0.4)'
                  }`,
                  color:
                    state.steps[state.currentStepIndex]?.action === 'conflict'
                      ? '#ff003c'
                      : state.steps[state.currentStepIndex]?.action === 'remove'
                      ? '#ffaa00'
                      : '#00f0ff',
                }}
              >
                {state.steps[state.currentStepIndex]?.action === 'place' &&
                  `✓ PLACED queen at col ${state.steps[state.currentStepIndex].col + 1}, row ${state.steps[state.currentStepIndex].row + 1}`}
                {state.steps[state.currentStepIndex]?.action === 'remove' &&
                  `↩ BACKTRACK — removing from col ${state.steps[state.currentStepIndex].col + 1}`}
                {state.steps[state.currentStepIndex]?.action === 'conflict' &&
                  `✗ CONFLICT at col ${state.steps[state.currentStepIndex].col + 1}, row ${state.steps[state.currentStepIndex].row + 1}`}
              </motion.div>
            )}
          </div>
        </motion.main>

        {/* Right sidebar */}
        <motion.aside
          className="lg:w-72 xl:w-80 flex flex-col gap-3 p-4 border-t lg:border-t-0 lg:border-l overflow-y-auto"
          style={{ borderColor: 'rgba(0,240,255,0.1)', background: 'rgba(0,3,10,0.8)' }}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <InfoPanel state={state} />
          <Controls
            state={state}
            onSetN={setN}
            onSolve={solve}
            onPrev={prevSolution}
            onNext={nextSolution}
            onReset={reset}
            onSetMode={setMode}
            onInitStep={initStepMode}
            onStepForward={stepForward}
            onStepBack={stepBack}
            onTogglePlay={togglePlay}
            onSetSpeed={setSpeed}
          />
          <ExplainerPanel />
        </motion.aside>
      </div>

      {/* Footer */}
      <footer className="text-center py-2 text-[10px] font-mono opacity-20 border-t"
        style={{ borderColor: 'rgba(0,240,255,0.08)' }}>
        N-QUEENS VISUALIZER · BACKTRACKING ALGORITHM · PRESS ENTER TO SOLVE
      </footer>
    </div>
  );
}

export default App;
