import React, { useState } from 'react';
import Grid from './Grid';

interface Level {
  level: number;
  rows: number;
  columns: number;
  moves: number;
}

const App: React.FC = () => {
  // Generate levels
  const levels: Level[] = Array.from({ length: 100 }, (_, i) => ({
    level: i + 1,
    rows: (i + 1) * 5,
    columns: (i + 1) * 5,
    moves: (i + 1) * 10,
  }));

  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [gameStatus, setGameStatus] = useState<string | null>(null);

  const handleLevelComplete = () => {
    setGameStatus('Congratulations! You found the X!');
    setTimeout(() => {
      if (currentLevelIndex < levels.length - 1) {
        setCurrentLevelIndex(currentLevelIndex + 1);
        setGameStatus(null);
      } else {
        setGameStatus('You completed all levels! 🎉');
      }
    }, 1000);
  };

  const handleGameOver = () => {
    setGameStatus('Game Over! Try again.');
    setTimeout(() => {
      setGameStatus(null);
    }, 1000);
  };

  const resetGame = () => {
    setCurrentLevelIndex(0);
    setGameStatus(null);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black">
      <h1 className="text-4xl font-bold mb-4 text-center" style={{color : 'white'}}>Grid Search - Find the X!</h1>
      <Grid
        rows={levels[currentLevelIndex].rows}
        columns={levels[currentLevelIndex].columns}
        moves={levels[currentLevelIndex].moves}
        onLevelComplete={handleLevelComplete}
        onGameOver={handleGameOver}
      />
      <div className="mt-4">
        {gameStatus && <p className="text-lg text-center">{gameStatus}</p>}
        <button onClick={resetGame} className="btn-reset" style={{color : 'white'}}>
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default App;
