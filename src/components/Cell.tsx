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
  return (
    <div
      className={`cell ${state}`}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e);
      }}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onDragStart={(e) => e.preventDefault()}
    />
  );
}; 