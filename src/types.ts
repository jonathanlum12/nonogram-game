export type CellState = 'empty' | 'filled' | 'marked' | 'filled-error' | 'marked-error';

export interface GameState {
  grid: CellState[][];
  solution: boolean[][];
  rowHints: number[][];
  colHints: number[][];
  isComplete: boolean;
  timer: number;
  mistakes: number;
}

export interface GameSettings {
  size: number;
  difficulty: 'easy' | 'medium' | 'hard';
} 