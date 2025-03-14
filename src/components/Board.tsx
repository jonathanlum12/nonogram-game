import React, { useEffect } from 'react';
import { Cell } from './Cell';
import { GameState } from '../types';

interface BoardProps {
  gameState: GameState;
  onCellClick: (row: number, col: number, action: 'fill' | 'mark') => void;
}

export const Board: React.FC<BoardProps> = ({ gameState, onCellClick }) => {
  const { grid, rowHints, colHints } = gameState;

  useEffect(() => {
    const preventContextMenu = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', preventContextMenu);
    return () => window.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  // Calculate grid dimensions
  const gridWidth = grid[0].length * 50; // 50px is the cell size
  const gridHeight = grid.length * 50;
  const maxHintWidth = Math.max(...rowHints.map(hints => hints.length)) * 40; // Assuming 40px per hint
  const maxHintHeight = Math.max(...colHints.map(hints => hints.length)) * 40;

  return (
    <div 
      className="board-container"
      style={{
        display: 'grid',
        gridTemplateColumns: `${maxHintWidth}px auto`,
        gridTemplateRows: `${maxHintHeight + 40}px auto`,
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0',
        margin: '0 auto',
        width: 'fit-content',
        transform: 'translateX(-40px)'
      }}
    >
      <div style={{ gridColumn: '1 / 2', gridRow: '1 / 2' }} /> {/* Empty top-left corner */}
      <div 
        className="col-hints"
        style={{
          gridColumn: '2 / 3',
          gridRow: '1 / 2',
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0].length}, var(--grid-size))`,
          justifyContent: 'center',
          paddingBottom: '8px',
          position: 'relative',
          zIndex: 1,
          alignSelf: 'end'
        }}
      >
        {colHints.map((hints, col) => (
          <div key={col} className="hints" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '2px'
          }}>
            {hints.map((hint, i) => (
              <div key={i} style={{ 
                minHeight: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                padding: '1px'
              }}>{hint}</div>
            ))}
          </div>
        ))}
      </div>
      <div 
        className="row-hints"
        style={{
          gridColumn: '1 / 2',
          gridRow: '2 / 3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {rowHints.map((hints, row) => (
          <div key={row} className="hints" style={{ height: 'var(--grid-size)' }}>
            {hints.map((hint, i) => (
              <span key={i}>{hint}</span>
            ))}
          </div>
        ))}
      </div>
      <div
        className="game-board"
        style={{
          gridColumn: '2 / 3',
          gridRow: '2 / 3',
          display: 'grid',
          gridTemplateColumns: `repeat(${grid[0].length}, var(--grid-size))`,
          gridTemplateRows: `repeat(${grid.length}, var(--grid-size))`,
          justifySelf: 'center',
          alignSelf: 'center'
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              state={cell}
              onClick={() => onCellClick(rowIndex, colIndex, 'fill')}
              onContextMenu={(e) => {
                e.preventDefault();
                onCellClick(rowIndex, colIndex, 'mark');
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}; 