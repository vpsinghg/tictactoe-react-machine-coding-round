import React from 'react';

const Cell = ({
  isBoardActive,
  cellId,
  cellState,
  className,
  handleCellClick,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    if (cellState != '') {
      return;
    }
    isBoardActive && handleCellClick(cellId);
  };
  return (
    <div
      className={`board-cell flex-center ${className}`}
      onClick={handleClick}
    >
      {cellState}
    </div>
  );
};

export default Cell;
