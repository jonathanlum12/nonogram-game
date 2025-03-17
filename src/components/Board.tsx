import React, { useEffect } from 'react';
import { Cell } from './Cell';
import { GameState, CellState } from '../types';

interface BoardProps {
  gameState: GameState;
  onCellClick: (row: number, col: number, action: 'fill' | 'mark') => void;
}

export const Board: React.FC<BoardProps> = ({ gameState, onCellClick }) => {
  const { grid, rowHints, colHints, solution } = gameState;

  useEffect(() => {
    const preventContextMenu = (e: Event) => e.preventDefault();
    window.addEventListener('contextmenu', preventContextMenu);
    return () => window.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  // Check if a row is complete
  const isRowComplete = (rowIndex: number): boolean => {
    return grid[rowIndex].every((cell, colIndex) => {
      const cellState = cell.endsWith('-error') ? cell.replace('-error', '') as CellState : cell;
      return (cellState === 'filled') === solution[rowIndex][colIndex];
    });
  };

  // Check if a column is complete
  const isColumnComplete = (colIndex: number): boolean => {
    return grid.every((row, rowIndex) => {
      const cellState = row[colIndex].endsWith('-error') ? row[colIndex].replace('-error', '') as CellState : row[colIndex];
      return (cellState === 'filled') === solution[rowIndex][colIndex];
    });
  };

  // Handle cell click with error checking
  const handleCellClick = (row: number, col: number, action: 'fill' | 'mark') => {
    const currentState = grid[row][col];
    const shouldBeFilled = solution[row][col];
    
    // If it's already in an error state, don't allow changes
    if (currentState.endsWith('-error')) {
      return;
    }

    // For fill action
    if (action === 'fill') {
      if (currentState === 'filled') {
        onCellClick(row, col, action); // Allow unfilling
      } else if (shouldBeFilled) {
        onCellClick(row, col, action); // Correct fill
      } else {
        // Incorrect fill - mark as error
        const newState: CellState = 'filled-error';
        onCellClick(row, col, action, newState);
      }
    }
    // For mark action
    else if (action === 'mark') {
      if (currentState === 'marked') {
        onCellClick(row, col, action); // Allow unmarking
      } else if (!shouldBeFilled) {
        onCellClick(row, col, action); // Correct mark
      } else {
        // Incorrect mark - mark as error
        const newState: CellState = 'marked-error';
        onCellClick(row, col, action, newState);
      }
    }
  };

  // Calculate hint dimensions
  const maxHintWidth = Math.max(...rowHints.map(hints => hints.length)) * 40;
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
          <div 
            key={col} 
            className="hints" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '2px',
              opacity: isColumnComplete(col) ? 0.3 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
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
          <div 
            key={row} 
            className="hints" 
            style={{ 
              height: 'var(--grid-size)',
              opacity: isRowComplete(row) ? 0.3 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
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
              onClick={() => handleCellClick(rowIndex, colIndex, 'fill')}
              onContextMenu={(e) => {
                e.preventDefault();
                handleCellClick(rowIndex, colIndex, 'mark');
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}; 