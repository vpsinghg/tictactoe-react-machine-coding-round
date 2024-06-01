import React from 'react';
import Cell from './Cell';

const Board = ({
  isBoardActive,
  boardState,
  winningCells,
  handleCellClick,
}) => {
  const boardIteration = Array.from({ length: boardState.length });
  return (
    <div className="board">
      {boardIteration.map((_, index) => {
        return (
          <Cell
            isBoardActive={isBoardActive}
            className={`board-cell ${
              winningCells.includes(index) ? 'winning-cell' : 'normal-cell'
            } `}
            key={index}
            cellId={index}
            cellState={boardState[index]}
            handleCellClick={handleCellClick}
          />
        );
      })}
    </div>
  );
};

export default Board;
