import React, { useState, useEffect } from 'react';
import Board from './Board.js';
import './index.css';

const BOARD_SIZE = 3;

const initialBoardState = Array.from(
  { length: BOARD_SIZE * BOARD_SIZE },
  (_, i) => ''
);

const GameStatus = {
  NOT_STARTED: 'notstarted',
  COMPLETED: 'completed',
  IN_PROGRESS: 'inprogess',
};

const winningCombination = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const isUndoAllowed = false;

const Game = () => {
  const [turn, setTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  const [boardState, setBoardState] = useState([...initialBoardState]);
  const [gameStatus, setGameStatus] = useState(GameStatus.NOT_STARTED);
  const [winningCells, setWinninCells] = useState([]);

  const [moves, setMoves] = useState([]);

  const handleCellClick = (cellId) => {
    setBoardState((state) => {
      state[cellId] = turn;
      return [...state];
    });
    setMoves((moves) => {
      return [...moves, { cellId, turn }];
    });
    setTurn((turn) => (turn === 'X' ? 'O' : 'X'));
  };

  const checkGameWinner = (boardState) => {
    for (let i = 0; i < winningCombination.length; i++) {
      const [a, b, c] = winningCombination[i];
      if (
        boardState[a] !== '' &&
        boardState[a] === boardState[b] &&
        boardState[b] === boardState[c]
      ) {
        setWinninCells([a, b, c]);
        return boardState[a]; // Return the winner ('X' or 'O')
      }
    }

    // Check if the board is full (tie)
    if (boardState.every((cell) => cell !== '')) {
      return 'tie';
    }

    return null; // No winner yet
  };

  const InitializeGame = () => {
    setBoardState([...initialBoardState]);
    setMoves([]);
    setGameStatus(GameStatus.IN_PROGRESS);
    setTurn('X');
    setWinner(null);
    setWinninCells([]);
  };

  const handleStart = (e) => {
    e.preventDefault();

    setGameStatus(GameStatus.IN_PROGRESS);
  };

  const handleRestartClick = (e) => {
    e.preventDefault();
    InitializeGame();
  };

  const handleJumptoMove = (moveIndex) => {
    const movesAfterJump = moves.slice(0, moveIndex + 1);
    const newGameState = [...initialBoardState];
    let lastTurn;
    movesAfterJump.reduce((gameState, move) => {
      lastTurn = move.turn;
      gameState[move.cellId] = lastTurn;
      return gameState;
    }, newGameState);
    setMoves(movesAfterJump);
    setBoardState(newGameState);
    setTurn(lastTurn === 'X' ? 'O' : 'X');
  };
  useEffect(() => {
    const winner = checkGameWinner(boardState);
    if (winner === 'X') {
      setGameStatus(GameStatus.COMPLETED);
      setWinner(winner);
    } else if (winner === 'O') {
      setWinner(winner);
      setGameStatus(GameStatus.COMPLETED);
    } else if (winner === 'tie') {
      setWinner(null);
      setGameStatus(GameStatus.COMPLETED);
    }
  }, [boardState]);

  return (
    <div>
      <h3>TicTacToe</h3>
      <div className="game">
        <Board
          isBoardActive={GameStatus.IN_PROGRESS === gameStatus}
          boardState={boardState}
          boardSize={BOARD_SIZE}
          winningCells={winningCells}
          handleCellClick={handleCellClick}
        />

        <div className="game-info">
          {gameStatus === GameStatus.IN_PROGRESS && (
            <div className="game-info">{`Player Turn ${turn}`}</div>
          )}
          {gameStatus === GameStatus.IN_PROGRESS && (
            <div className="game-history">
              <h4>Game History </h4>
              {moves.map((move, index) => {
                return (
                  <div key={index} className="move flex-center">
                    <div className="move-index gutter">move: {index + 1}</div>
                    <div className="move-details">{`Player ${move.turn} played at ${move.cellId}`}</div>
                    {isUndoAllowed && (
                      <button
                        className="undo"
                        onClick={() => handleJumptoMove(index)}
                      >
                        Go back to Game at move {index + 1}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {gameStatus === GameStatus.NOT_STARTED && (
            <div className="game-controller">
              <div className="game-action">
                <button onClick={handleStart}>Start Game</button>
              </div>
            </div>
          )}

          {gameStatus === GameStatus.COMPLETED && (
            <div className="game-controller">
              <div className="results-dashboard">
                {winner ? `Player ${winner} Wins !!` : 'Game Tied!'}
              </div>

              <div className="game-action">
                <button onClick={handleRestartClick}>Restart Game </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
