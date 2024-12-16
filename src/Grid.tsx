import React, { useState, useEffect } from 'react';

interface GridProps {
  rows: number;
  columns: number;
  moves: number;
  onLevelComplete: () => void;
  onGameOver: () => void;
}

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

const Grid: React.FC<GridProps> = ({ rows, columns, moves, onLevelComplete, onGameOver }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [playerRow, setPlayerRow] = useState(0);
  const [playerColumn, setPlayerColumn] = useState(0);
  const [targetRow, setTargetRow] = useState<number | null>(null);
  const [targetColumn, setTargetColumn] = useState<number | null>(null);
  const [remainingMoves, setRemainingMoves] = useState(moves);
  const [showRetry, setShowRetry] = useState(false);

  const clickAudio = new Audio('/click.wav');
  const winAudio = new Audio('/win.wav');
  const loseAudio = new Audio('/lose.wav');

  useEffect(() => {
    initializeGrid();
  }, [rows, columns, moves]);

  useEffect(() => {
    if (playerRow === targetRow && playerColumn === targetColumn) {
      winAudio.play();
      setTimeout(onLevelComplete, 1000);
    }
  }, [playerRow, playerColumn, targetRow, targetColumn]);

  useEffect(() => {
    if (remainingMoves === 0) {
      loseAudio.play();
      setShowRetry(true);
      setTimeout(onGameOver, 1000);
    }
  }, [remainingMoves]);

  // Add keydown event listener for WASD/Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (remainingMoves === 0) return; // Ignore input if no moves left
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          movePlayer(Direction.Up);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer(Direction.Down);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer(Direction.Left);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer(Direction.Right);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [remainingMoves, playerRow, playerColumn]);

  const initializeGrid = () => {
    const newGrid = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => 0)
    );
    setGrid(newGrid);
    setPlayerRow(0);
    setPlayerColumn(0);
    setRemainingMoves(moves);
    setRandomTarget(rows, columns);
  };

  const setRandomTarget = (rows: number, columns: number) => {
    const randomRow = Math.floor(Math.random() * rows);
    const randomColumn = Math.floor(Math.random() * columns);

    if (randomRow === playerRow && randomColumn === playerColumn) {
      setRandomTarget(rows, columns);
      return;
    }

    setTargetRow(randomRow);
    setTargetColumn(randomColumn);
  };

  const movePlayer = (direction: Direction) => {
    let newRow = playerRow;
    let newColumn = playerColumn;
    if (remainingMoves > 0) {
      switch (direction) {
        case Direction.Up:
          if (playerRow > 0) newRow = playerRow - 1;
          break;
        case Direction.Down:
          if (playerRow < rows - 1) newRow = playerRow + 1;
          break;
        case Direction.Left:
          if (playerColumn > 0) newColumn = playerColumn - 1;
          break;
        case Direction.Right:
          if (playerColumn < columns - 1) newColumn = playerColumn + 1;
          break;
        default:
          break;
      }
    }

    if (newRow !== playerRow || newColumn !== playerColumn) {
      setPlayerRow(newRow);
      setPlayerColumn(newColumn);
      setRemainingMoves(remainingMoves - 1);
      clickAudio.play();
    }
  };

  const retryLevel = () => {
    setShowRetry(false);
    initializeGrid();
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${columns}, 50px)`, backgroundColor: 'black' }}
      >
        {grid.map((row, rowIndex) =>
          row.map((_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`p-4 border rounded ${
                playerRow === rowIndex && playerColumn === colIndex
                  ? 'bg-blue-500 text-white' // Player's position
                  : ''
              }`}
            >
              {targetRow === rowIndex && targetColumn === colIndex && (
                <div
                  className={`absolute bg-red-500 text-white p-2 rounded-full w-6 h-6 flex items-center justify-center ${
                    ((playerRow === rowIndex) && (playerColumn === colIndex)) || (remainingMoves === 0) ? 'visible' : 'invisible'
                  }`}
                >
                  X
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col mt-4 gap-2">
        <button
          onClick={() => movePlayer(Direction.Up)}
          className="btn-dpad border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
          style={{ color: 'white' }}
        >
          Up
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => movePlayer(Direction.Left)}
            className="btn-dpad border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
            style={{ color: 'white' }}
          >
            Left
          </button>
          <button
            onClick={() => movePlayer(Direction.Right)}
            className="btn-dpad border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
            style={{ color: 'white' }}
          >
            Right
          </button>
        </div>
        <button
          onClick={() => movePlayer(Direction.Down)}
          className="btn-dpad border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-200"
          style={{ color: 'white' }}
        >
          Down
        </button>
      </div>
      <p className="mt-2 text-white">Remaining Moves: {remainingMoves}</p>
      {showRetry && (
        <div className="mt-4">
          <button
            onClick={retryLevel}
            className="btn-retry border border-gray-300 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-200"
            style={{ color: 'white' }}
          >
            Retry Level
          </button>
        </div>
      )}
    </div>
  );
};

export default Grid;
