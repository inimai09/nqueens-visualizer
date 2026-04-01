import { StepRecord } from '../types';

/**
 * Check if placing a queen at (col, row) is safe
 * board[c] = row of queen in column c, -1 = empty
 */
export function isSafe(board: number[], col: number, row: number): boolean {
  for (let c = 0; c < col; c++) {
    const r = board[c];
    if (r === row) return false; // same row
    if (Math.abs(r - row) === Math.abs(c - col)) return false; // diagonal
  }
  return true;
}

/**
 * Find all solutions using backtracking
 */
export function solveAllNQueens(n: number): { solutions: number[][]; nodesExplored: number } {
  const solutions: number[][] = [];
  const board = new Array(n).fill(-1);
  let nodesExplored = 0;

  function backtrack(col: number) {
    if (col === n) {
      solutions.push([...board]);
      return;
    }
    for (let row = 0; row < n; row++) {
      nodesExplored++;
      if (isSafe(board, col, row)) {
        board[col] = row;
        backtrack(col + 1);
        board[col] = -1;
      }
    }
  }

  backtrack(0);
  return { solutions, nodesExplored };
}

/**
 * Generate all steps for the backtracking visualization
 */
export function generateSteps(n: number): StepRecord[] {
  const steps: StepRecord[] = [];
  const board = new Array(n).fill(-1);
  let nodesExplored = 0;

  function backtrack(col: number) {
    if (col === n) return;
    for (let row = 0; row < n; row++) {
      nodesExplored++;
      if (isSafe(board, col, row)) {
        board[col] = row;
        steps.push({ board: [...board], col, row, action: 'place', nodesExplored });
        backtrack(col + 1);
        board[col] = -1;
        steps.push({ board: [...board], col, row, action: 'remove', nodesExplored });
      } else {
        steps.push({ board: [...board], col, row, action: 'conflict', nodesExplored });
      }
    }
  }

  backtrack(0);
  return steps;
}

/**
 * Get all squares attacked by queens currently on the board
 * Returns a set of "col,row" strings
 */
export function getAttackedSquares(board: number[], n: number): Set<string> {
  const attacked = new Set<string>();
  for (let col = 0; col < n; col++) {
    const row = board[col];
    if (row === -1) continue;
    for (let c = 0; c < n; c++) {
      if (c !== col) attacked.add(`${c},${row}`); // row
      const d = Math.abs(c - col);
      if (row - d >= 0) attacked.add(`${c},${row - d}`); // diag up
      if (row + d < n) attacked.add(`${c},${row + d}`); // diag down
    }
    for (let r = 0; r < n; r++) {
      if (r !== row) attacked.add(`${col},${r}`); // col
    }
  }
  return attacked;
}

/**
 * Check if the current board has conflicts
 */
export function getConflicts(board: number[], n: number): Set<string> {
  const conflicts = new Set<string>();
  for (let c1 = 0; c1 < n; c1++) {
    if (board[c1] === -1) continue;
    for (let c2 = c1 + 1; c2 < n; c2++) {
      if (board[c2] === -1) continue;
      const r1 = board[c1], r2 = board[c2];
      if (r1 === r2 || Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
        conflicts.add(`${c1},${r1}`);
        conflicts.add(`${c2},${r2}`);
      }
    }
  }
  return conflicts;
}
