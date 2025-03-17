import React from 'react';
import { CellState } from '../types';

interface CellProps {
  state: CellState;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export const Cell: React.FC<CellProps> = ({ state, onClick, onContextMenu, onMouseEnter, onMouseDown }) => {
  const getBackgroundColor = () => {
    switch (state) {
      case 'filled':
        return 'var(--nyt-black)';
      case 'filled-error':
        return '#E20736';
      case 'marked':
        return 'var(--nyt-light-blue)';
      case 'marked-error':
        return '#E87E7E';
      default:
        return 'white';
    }
  };

  const showX = state === 'marked' || state === 'marked-error';
  const xColor = state === 'marked-error' ? '#E20736' : 'var(--nyt-blue)';

  return (
    <div
      className={`cell ${state}`}
      style={{
        backgroundColor: getBackgroundColor(),
        position: 'relative',
        width: 'var(--grid-size)',
        height: 'var(--grid-size)',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e);
      }}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onDragStart={(e) => e.preventDefault()}
    >
      {showX && (
        <>
          <div style={{
            content: '""',
            position: 'absolute',
            backgroundColor: xColor,
            width: '2px',
            height: 'calc(var(--grid-size) * 0.6)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            transition: 'background-color 0.2s ease'
          }} />
          <div style={{
            content: '""',
            position: 'absolute',
            backgroundColor: xColor,
            width: '2px',
            height: 'calc(var(--grid-size) * 0.6)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-45deg)',
            transition: 'background-color 0.2s ease'
          }} />
        </>
      )}
    </div>
  );
}; 