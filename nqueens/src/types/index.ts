export type Mode = 'solution' | 'step' | 'manual';
export type Status = 'idle' | 'solving' | 'solved' | 'stepping' | 'complete';

export interface StepRecord {
  board: number[];
  col: number;
  row: number;
  action: 'place' | 'remove' | 'conflict';
  nodesExplored: number;
}

export interface SolverState {
  n: number;
  solutions: number[][];
  currentSolutionIndex: number;
  board: number[]; // board[col] = row of queen, -1 = empty
  status: Status;
  mode: Mode;
  steps: StepRecord[];
  currentStepIndex: number;
  nodesExplored: number;
  solveTime: number;
  isPlaying: boolean;
  speed: number; // ms delay
}
