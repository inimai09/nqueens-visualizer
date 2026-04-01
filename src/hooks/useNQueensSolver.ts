import { useState, useCallback, useRef, useEffect } from 'react';
import { SolverState, Mode } from '../types';
import { solveAllNQueens, generateSteps } from '../utils/nQueensSolver';

const initialState = (n: number): SolverState => ({
  n,
  solutions: [],
  currentSolutionIndex: 0,
  board: new Array(n).fill(-1),
  status: 'idle',
  mode: 'solution',
  steps: [],
  currentStepIndex: -1,
  nodesExplored: 0,
  solveTime: 0,
  isPlaying: false,
  speed: 150,
});

export function useNQueensSolver() {
  const [state, setState] = useState<SolverState>(initialState(8));
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepsRef = useRef(state.steps);
  stepsRef.current = state.steps;

  const setN = useCallback((n: number) => {
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    setState(initialState(n));
  }, []);

  const solve = useCallback(() => {
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    setState(prev => {
      const start = performance.now();
      const { solutions, nodesExplored } = solveAllNQueens(prev.n);
      const solveTime = performance.now() - start;
      const board = solutions.length > 0 ? [...solutions[0]] : new Array(prev.n).fill(-1);
      return {
        ...prev,
        solutions,
        currentSolutionIndex: 0,
        board,
        status: 'solved',
        mode: 'solution',
        nodesExplored,
        solveTime,
        steps: [],
        currentStepIndex: -1,
        isPlaying: false,
      };
    });
  }, []);

  const nextSolution = useCallback(() => {
    setState(prev => {
      if (prev.solutions.length === 0) return prev;
      const idx = (prev.currentSolutionIndex + 1) % prev.solutions.length;
      return { ...prev, currentSolutionIndex: idx, board: [...prev.solutions[idx]] };
    });
  }, []);

  const prevSolution = useCallback(() => {
    setState(prev => {
      if (prev.solutions.length === 0) return prev;
      const idx = (prev.currentSolutionIndex - 1 + prev.solutions.length) % prev.solutions.length;
      return { ...prev, currentSolutionIndex: idx, board: [...prev.solutions[idx]] };
    });
  }, []);

  const reset = useCallback(() => {
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    setState(prev => ({
      ...initialState(prev.n),
    }));
  }, []);

  const setMode = useCallback((mode: Mode) => {
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    setState(prev => ({
      ...prev,
      mode,
      board: new Array(prev.n).fill(-1),
      steps: [],
      currentStepIndex: -1,
      status: 'idle',
      isPlaying: false,
    }));
  }, []);

  const initStepMode = useCallback(() => {
    if (playTimerRef.current) clearTimeout(playTimerRef.current);
    setState(prev => {
      const steps = generateSteps(prev.n);
      const { solutions, nodesExplored } = solveAllNQueens(prev.n);
      return {
        ...prev,
        mode: 'step',
        steps,
        solutions,
        nodesExplored,
        currentStepIndex: -1,
        board: new Array(prev.n).fill(-1),
        status: 'stepping',
        isPlaying: false,  // ← FIXED: Changed from true to false
      };
    });
  }, []);

  const stepForward = useCallback(() => {
    setState(prev => {
      if (prev.steps.length === 0) return prev;
      const next = Math.min(prev.currentStepIndex + 1, prev.steps.length - 1);
      const step = prev.steps[next];
      const isLast = next === prev.steps.length - 1;
      // On completion, show the FIRST solution clearly
      const finalBoard = isLast
        ? prev.solutions.length > 0
          ? [...prev.solutions[0]]
          : [...step.board]
        : [...step.board];
      return {
        ...prev,
        currentStepIndex: next,
        board: finalBoard,
        nodesExplored: step.nodesExplored,
        currentSolutionIndex: 0,
        status: isLast ? 'complete' : 'stepping',
        isPlaying: isLast ? false : prev.isPlaying,
      };
    });
  }, []);

  const stepBack = useCallback(() => {
    setState(prev => {
      if (prev.currentStepIndex <= 0) {
        return { ...prev, currentStepIndex: -1, board: new Array(prev.n).fill(-1) };
      }
      const next = prev.currentStepIndex - 1;
      const step = prev.steps[next];
      return {
        ...prev,
        currentStepIndex: next,
        board: [...step.board],
        nodesExplored: step.nodesExplored,
        status: 'stepping',
        isPlaying: false, // Stop playing when stepping back
      };
    });
  }, []);

  const togglePlay = useCallback(() => {
    setState(prev => {
      // Don't allow playing if at the end
      if (prev.currentStepIndex >= prev.steps.length - 1 && prev.mode === 'step') {
        return prev;
      }
      return { ...prev, isPlaying: !prev.isPlaying };
    });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const placeManual = useCallback((col: number, row: number) => {
    setState(prev => {
      if (prev.mode !== 'manual') return prev;
      const newBoard = [...prev.board];
      newBoard[col] = newBoard[col] === row ? -1 : row;
      return { ...prev, board: newBoard };
    });
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!state.isPlaying || state.mode !== 'step') return;
    if (state.currentStepIndex >= state.steps.length - 1) {
      setState(prev => ({ ...prev, isPlaying: false }));
      return;
    }
    playTimerRef.current = setTimeout(() => {
      stepForward();
    }, state.speed);
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [state.isPlaying, state.currentStepIndex, state.speed, state.mode, state.steps.length, stepForward]);

  return {
    state,
    setN,
    solve,
    nextSolution,
    prevSolution,
    reset,
    setMode,
    initStepMode,
    stepForward,
    stepBack,
    togglePlay,
    setSpeed,
    placeManual,
  };
}