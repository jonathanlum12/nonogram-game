import React, { useEffect } from 'react';
import { Cell } from './Cell';
import { GameState, CellState } from '../types';

interface BoardProps {
  gameState: GameState;
  onCellClick: (row: number, col: number, action: 'fill' | 'mark', errorState?: CellState) => void;
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
      if (solution[rowIndex][colIndex]) {
        // For cells that should be filled
        return cell === 'filled' || cell === 'filled-error';
      } else {
        // For cells that should be empty
        return cell === 'empty' || cell === 'marked' || cell === 'marked-error';
      }
    });
  };

  // Check if a column is complete
  const isColumnComplete = (colIndex: number): boolean => {
    return grid.every((row, rowIndex) => {
      if (solution[rowIndex][colIndex]) {
        // For cells that should be filled
        return row[colIndex] === 'filled' || row[colIndex] === 'filled-error';
      } else {
        // For cells that should be empty
        return row[colIndex] === 'empty' || row[colIndex] === 'marked' || row[colIndex] === 'marked-error';
      }
    });
  };

  // Handle cell click with error checking
  const handleCellClick = (row: number, col: number, action: 'fill' | 'mark') => {
    const currentState = grid[row][col];
    const shouldBeFilled = solution[row][col];
    
    // For fill action
    if (action === 'fill') {
      if (currentState === 'filled' || currentState === 'filled-error') {
        onCellClick(row, col, 'fill'); // Allow unfilling
      } else if (shouldBeFilled) {
        onCellClick(row, col, 'fill'); // Correct fill
      } else {
        // Incorrect fill - mark as error
        onCellClick(row, col, 'fill', 'filled-error');
      }
    }
    // For mark action
    else if (action === 'mark') {
      if (currentState === 'marked' || currentState === 'marked-error') {
        onCellClick(row, col, 'mark'); // Allow unmarking
      } else if (!shouldBeFilled) {
        onCellClick(row, col, 'mark'); // Correct mark
      } else {
        // Incorrect mark - mark as error
        onCellClick(row, col, 'mark', 'marked-error');
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