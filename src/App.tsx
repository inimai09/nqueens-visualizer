import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Chessboard } from './components/Chessboard';
import { Controls } from './components/Controls';
import { InfoPanel } from './components/InfoPanel';
import { ExplainerPanel } from './components/ExplainerPanel';
import { SolutionTree } from './components/SolutionTree';
import { useNQueensSolver } from './hooks/useNQueensSolver';
import './index.css';

function App() {
  const solver = useNQueensSolver();
  const { state, setN, solve, nextSolution, prevSolution, reset, setMode,
    initStepMode, stepForward, stepBack, togglePlay, setSpeed, placeManual } = solver;

  const selectSolution = useCallback((index: number) => {
    if (state.solutions.length === 0) return;
    const current = state.currentSolutionIndex;
    if (index === current) return;
    const forward = (index - current + state.solutions.length) % state.solutions.length;
    const backward = (current - index + state.solutions.length) % state.solutions.length;
    if (forward <= backward) {
      for (let i = 0; i < forward; i++) nextSolution();
    } else {
      for (let i = 0; i < backward; i++) prevSolution();
    }
  }, [state.solutions.length, state.currentSolutionIndex, nextSolution, prevSolution]);

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

  const currentStep = state.steps[state.currentStepIndex];
  const isComplete = state.status === 'complete';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-dark)' }}>
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
            <h1 className="text-2xl font-display font-black tracking-widest flicker neon-text-blue">
              N-QUEENS VISUALIZER
            </h1>
            <p className="text-xs font-display font-bold tracking-widest opacity-50">BACKTRACKING ALGORITHM</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 text-xs font-display font-bold opacity-40">
            <span>[ENTER] SOLVE</span>
            <span>[SPACE] STEP</span>
            <span>[←→] NAV</span>
            <span>[R] RESET</span>
          </div>
          <div
            className="px-4 py-1.5 rounded text-sm font-display font-black tracking-widest"
            style={{
              color: state.mode === 'solution' ? '#00f0ff' : state.mode === 'step' ? '#bf00ff' : '#ffaa00',
              border: '2px solid currentColor',
              background: 'rgba(0,0,0,0.5)',
            }}
          >
            {state.mode.toUpperCase()}
          </div>
        </div>
      </motion.header>

      {/* Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Board area */}
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

            {/* Step status bar */}
            {state.mode === 'step' && state.currentStepIndex >= 0 && !isComplete && currentStep && (
              <motion.div
                key={state.currentStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full text-sm font-display font-black text-center px-5 py-3 rounded-lg tracking-wider uppercase"
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  border: `2px solid ${
                    currentStep.action === 'conflict' ? '#ff003c'
                    : currentStep.action === 'remove' ? '#ffaa00'
                    : '#00f0ff'
                  }`,
                  color:
                    currentStep.action === 'conflict' ? '#ff003c'
                    : currentStep.action === 'remove' ? '#ffaa00'
                    : '#00f0ff',
                  boxShadow: `0 0 20px ${
                    currentStep.action === 'conflict' ? 'rgba(255,0,60,0.3)'
                    : currentStep.action === 'remove' ? 'rgba(255,170,0,0.3)'
                    : 'rgba(0,240,255,0.3)'
                  }`,
                }}
              >
                {currentStep.action === 'place' &&
                  `✓ PLACED — Column ${currentStep.col + 1}, Row ${currentStep.row + 1}`}
                {currentStep.action === 'remove' &&
                  `↩ BACKTRACK — Removing from Column ${currentStep.col + 1}`}
                {currentStep.action === 'conflict' &&
                  `✗ CONFLICT — Col ${currentStep.col + 1}, Row ${currentStep.row + 1} is attacked`}
              </motion.div>
            )}

            {/* Completion banner */}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center px-5 py-4 rounded-lg"
                style={{
                  background: 'rgba(0,255,136,0.08)',
                  border: '2px solid #00ff88',
                  boxShadow: '0 0 40px rgba(0,255,136,0.2)',
                }}
              >
                <div className="text-2xl font-display font-black tracking-widest mb-1" style={{ color: '#00ff88', textShadow: '0 0 20px #00ff88' }}>
                  ★ ALGORITHM COMPLETE ★
                </div>
                <div className="text-sm font-display font-bold" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Found <span style={{ color: '#00f0ff' }}>{state.solutions.length}</span> solutions · Displaying Solution #1
                </div>
              </motion.div>
            )}
          </div>
        </motion.main>

        {/* Sidebar */}
        <motion.aside
          className="lg:w-80 xl:w-96 flex flex-col gap-3 p-4 border-t lg:border-t-0 lg:border-l overflow-y-auto"
          style={{ borderColor: 'rgba(0,240,255,0.1)', background: 'rgba(0,3,10,0.85)' }}
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
          <SolutionTree state={state} onSelect={selectSolution} />
          <ExplainerPanel />
        </motion.aside>
      </div>

      <footer className="text-center py-2 border-t" style={{ borderColor: 'rgba(0,240,255,0.08)' }}>
        <span className="text-xs font-display font-bold opacity-30 tracking-widest">
          N-QUEENS VISUALIZER · BACKTRACKING ALGORITHM · PRESS ENTER TO SOLVE
        </span>
      </footer>
    </div>
  );
}

export default App;
