import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [circles, setCircles] = useState([]);
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(0);
  const [nextNumber, setNextNumber] = useState(1);
  const [autoPlay, setAutoPlay] = useState(false);
  const [error, setError] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [numLimit, setNumLimit] = useState(5); // Giới hạn số vòng tròn
  const [allCleared, setAllCleared] = useState(false); // Trạng thái hoàn thành trò chơi
  const [gameOver, setGameOver] = useState(false); // Trạng thái game over

  useEffect(() => {
    generateCircles();
  }, [numLimit]);

  useEffect(() => {
    if (gameStarted && circles.length > 0) {
      const id = setInterval(() => {
        setTime(prevTime => prevTime + 0.1);
      }, 100);
      setIntervalId(id);
    } else if (!gameStarted && intervalId) {
      clearInterval(intervalId);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (autoPlay && gameStarted) {
      autoPlayGame();
    }
  }, [autoPlay, gameStarted, nextNumber]);

  const generateCircles = () => {
    const numbers = Array.from({ length: numLimit }, (_, i) => i + 1);
    const positions = numbers.map(number => ({
      number,
      left: Math.random() * 90,
      top: Math.random() * 90,
      zIndex: numLimit - number,
    }));
    setCircles(positions);
  };

  const startGame = () => {
    setPoints(0);
    setTime(0);
    setNextNumber(1);
    setError('');
    setAllCleared(false);
    setGameOver(false);
    setGameStarted(true);
    setAutoPlay(false);
  };

  const restartGame = () => {
    setPoints(0);
    setTime(0);
    setNextNumber(1);
    setError('');
    setGameStarted(true);
    setAutoPlay(false);
    setGameOver(false);
    setAllCleared(false);
    generateCircles();
  };

  const checkNumber = (number) => {
    if (number === nextNumber) {
      setPoints(points + 1);
      setNextNumber(nextNumber + 1);
      setCircles(prev => prev.filter(circle => circle.number !== number));
      setError('');
      if (nextNumber === numLimit) {
        setGameStarted(false);
        setAllCleared(true);
      }
    } else {
      setError('Game Over.');
      setGameOver(true);
    }
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  const autoPlayGame = () => {
    setTimeout(() => {
      const circle = circles.find(circle => circle.number === nextNumber);
      if (circle && autoPlay) {
        checkNumber(circle.number);
      }
    }, 500);
  };

  return (
    <div className="game-container">
      <div className='header'>
        <h1 className={allCleared ? "all-cleared" : gameOver ? "game-over" : ""}>
          {allCleared ? "ALL CLEARED" : gameOver ? "GAME OVER" : "LET'S PLAY"}
        </h1>
        <div className="scoreboard">
          Points: <input
            type="text"
            value={numLimit}
            onChange={(e) => setNumLimit(Number(e.target.value))}
          /><br />
          Time: <span id="time">{time.toFixed(1)}</span> seconds
        </div>
      </div>
      <div className="game-board" id="gameBoard">
        {gameStarted && circles.sort((a, b) => a.number - b.number).map((circle, index) => (
          <div
            key={index}
            className={`circle `}
            style={{ left: `${circle.left}%`, top: `${circle.top}%`, zIndex: circle.zIndex }}  // Số nhỏ hơn ở trên
            onClick={() => !autoPlay && checkNumber(circle.number)}
          >
            {circle.number}
          </div>
        ))}
      </div>
      <div className="controls">
        {!gameStarted && !gameOver && !allCleared && <button onClick={startGame}>Play</button>}
        {(gameStarted || gameOver || allCleared) && <button onClick={restartGame}>Restart</button>}
        {gameStarted && !gameOver && !allCleared && (
          <button onClick={toggleAutoPlay}>
            Auto Play {autoPlay ? 'ON' : 'OFF'}
          </button>
        )}
      </div>
      <div>Next: <span id="nextNumber">{nextNumber}</span></div>
      <div className="error">{error}</div>
    </div>
  );
}

export default App;
