import { GameState, GameSettings } from '../types';

const generateRandomGrid = (size: number, difficulty: GameSettings['difficulty']): boolean[][] => {
  const fillRate = {
    easy: 0.6,
    medium: 0.5,
    hard: 0.4
  }[difficulty];

  const grid: boolean[][] = Array(size).fill(null).map(() =>
    Array(size).fill(false).map(() => Math.random() < fillRate)
  );
  return grid;
};

const calculateHints = (line: boolean[]): number[] => {
  const hints: number[] = [];
  let count = 0;

  for (let i = 0; i <= line.length; i++) {
    if (i < line.length && line[i]) {
      count++;
    } else if (count > 0) {
      hints.push(count);
      count = 0;
    }
  }

  return hints.length > 0 ? hints : [0];
};

export const generatePuzzle = (settings: GameSettings): GameState => {
  const { size, difficulty } = settings;
  const solution = generateRandomGrid(size, difficulty);

  const rowHints: number[][] = solution.map(row => calculateHints(row));
  const colHints: number[][] = Array(size).fill(null).map((_, i) => 
    calculateHints(solution.map(row => row[i]))
  );

  return {
    grid: Array(size).fill(null).map(() => Array(size).fill('empty')),
    solution,
    rowHints,
    colHints,
    isComplete: false,
    timer: 0,
    mistakes: 0
  };
}; 