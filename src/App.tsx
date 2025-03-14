import React, { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { GameState, GameSettings, CellState } from './types';
import { generatePuzzle } from './utils/puzzle-generator';

const DEFAULT_SETTINGS: GameSettings = {
  size: 10,
  difficulty: 'medium'
};

export const App: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [gameState, setGameState] = useState<GameState>(() => ({
    ...generatePuzzle(DEFAULT_SETTINGS),
    mistakes: 0
  }));
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameState.isComplete) {
        setTimer(t => t + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.isComplete]);

  const handleCellClick = (row: number, col: number, action: 'fill' | 'mark') => {
    if (gameState.isComplete) return;

    setGameState(prev => {
      const newGrid = prev.grid.map(r => [...r]);
      const currentState = newGrid[row][col];
      let newMistakes = prev.mistakes;

      if (action === 'fill') {
        const newState = currentState === 'filled' ? 'empty' : 'filled';
        newGrid[row][col] = newState;
        
        // Only count mistakes when filling cells
        if (newState === 'filled' && !prev.solution[row][col]) {
          newMistakes++;
        }
      } else {
        newGrid[row][col] = currentState === 'marked' ? 'empty' : 'marked';
      }

      const isComplete = checkWinCondition(newGrid, prev.solution);
      return { ...prev, grid: newGrid, isComplete, mistakes: newMistakes };
    });
  };

  const checkWinCondition = (grid: CellState[][], solution: boolean[][]): boolean => {
    return grid.every((row, i) =>
      row.every((cell, j) =>
        (cell === 'filled') === solution[i][j]
      )
    );
  };

  const startNewGame = () => {
    const newGame = generatePuzzle(settings);
    setGameState({ ...newGame, mistakes: 0 });
    setTimer(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Nonogram</h1>
        <div className="stats">
          <div>Time: {formatTime(timer)}</div>
          <div>Mistakes: {gameState.mistakes}</div>
          <div>Difficulty: {settings.difficulty}</div>
        </div>
      </header>

      <div className="controls">
        <select
          className="button"
          value={settings.difficulty}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            difficulty: e.target.value as GameSettings['difficulty']
          }))}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          className="button"
          value={settings.size}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            size: Number(e.target.value)
          }))}
        >
          <option value="5">5 x 5</option>
          <option value="10">10 x 10</option>
          <option value="15">15 x 15</option>
        </select>

        <button className="button" onClick={startNewGame}>
          New Game
        </button>
      </div>

      <Board gameState={gameState} onCellClick={handleCellClick} />

      {gameState.isComplete && (
        <div className="completion-message">
          <h2>Puzzle Complete!</h2>
          <p>Time: {formatTime(timer)}</p>
          <p>Mistakes: {gameState.mistakes}</p>
        </div>
      )}
    </div>
  );
}; 