import React, { useState, useEffect } from 'react';

interface GridProps {
  rows: number;
  columns: number;
}

enum Direction {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

const Grid: React.FC<GridProps> = ({ rows, columns }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [playerRow, setPlayerRow] = useState(0);
  const [playerColumn, setPlayerColumn] = useState(0);
  const [targetRow, setTargetRow] = useState<number | null>(null);
  const [targetColumn, setTargetColumn] = useState<number | null>(null);
  const [remainingMoves, setRemainingMoves] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [gameMessage, setGameMessage] = useState('Grid Search');
  const clickAudio = new Audio('/click.wav');
  const winAudio = new Audio('/win.wav');
  const loseAudio = new Audio('/lose.wav');

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    if (remainingMoves === 0 || win) {
      setGameOver(true);
      if (win) {
        setGameMessage('You win!');
        winAudio.play();
      } else {
        setGameMessage('You lose!');
        loseAudio.play();
      }
    } else {
      setGameMessage(`Grid Search - Remaining Moves: ${remainingMoves}`);
    }
  }, [remainingMoves, win]);

  useEffect(() => {
    if (playerRow === targetRow && playerColumn === targetColumn) {
      setWin(true);
    }
  }, [playerRow, playerColumn, targetRow, targetColumn]);

  const initializeGrid = () => {
    const newGrid = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => 0)
    );
    setGrid(newGrid);
    setTarget();
    setGameMessage(`Grid Search - Remaining Moves: ${remainingMoves}`);
  };

  const setTarget = () => {
    const randomRow = Math.floor(Math.random() * rows);
    const randomColumn = Math.floor(Math.random() * columns);

    if (randomRow === playerRow && randomColumn === playerColumn) {
      setTarget();
      return;
    }

    setTargetRow(randomRow);
    setTargetColumn(randomColumn);
  };

  const movePlayer = (direction: Direction) => {
    if (!gameOver) {
      clickAudio.play();
      let newRow = playerRow;
      let newColumn = playerColumn;

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

      setPlayerRow(newRow);
      setPlayerColumn(newColumn);
      setRemainingMoves(remainingMoves - 1);
    }
  };

  const restartGame = () => {
    setPlayerRow(0);
    setPlayerColumn(0);
    setWin(false);
    setRemainingMoves(10);
    setGameOver(false);
    initializeGrid();
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold text-tomato font-quicksand mb-4">
        {gameMessage}
      </h1>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 60px)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`p-4 border ${
                playerRow === rowIndex && playerColumn === colIndex
                  ? 'bg-blue-500'
                  : ''
              }`}
            >
              {(win &&
                rowIndex === targetRow &&
                colIndex === targetColumn) ||
              (rowIndex === playerRow &&
                colIndex === playerColumn &&
                gameOver &&
                win)
                ? 'X'
                : ''}
            </div>
          ))
        )}
      </div>
      <div className="flex justify-center mt-4">
        <div className="keypad" >
          <button
            className="btn"
            onClick={() => movePlayer(Direction.Up)}
            disabled={gameOver}
            style={{margin: '1.5em', border : 'solid 0.5em green',borderRadius : '8px', padding: '0.5em'}}
          >
            Up
          </button>
          <button
            className="btn"
            onClick={() => movePlayer(Direction.Down)}
            disabled={gameOver}
            style={{margin : '1.5em', border : 'solid 0.5em green',borderRadius : '8px', padding: '0.5em'}}
          >
            Down
          </button>
          <button
            className="btn"
            onClick={() => movePlayer(Direction.Left)}
            disabled={gameOver}
            style={{margin: '1.5em', border : 'solid 0.5em green',borderRadius : '8px' , padding: '0.5em'}}
          >
            Left
          </button>
          <button
            className="btn"
            onClick={() => movePlayer(Direction.Right)}
            disabled={gameOver}
            style={{margin: '1.5em', border : 'solid 0.5em green',borderRadius : '8px' , padding: '0.5em'}}
          >
            Right
          </button>
          <button
            className="btn"
            onClick={restartGame}
            style={{margin: '1.5em', border : 'solid 0.5em green',borderRadius : '8px', padding: '0.5em'}}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Grid;
