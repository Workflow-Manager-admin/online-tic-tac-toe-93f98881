import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette based on requirements and from env variables if present
const PRIMARY_COLOR = process.env.REACT_APP_PRIMARY_COLOR || '#1976d2';
const SECONDARY_COLOR = process.env.REACT_APP_SECONDARY_COLOR || '#e3f2fd';
const ACCENT_COLOR = process.env.REACT_APP_ACCENT_COLOR || '#ffea00';

// Square Component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      style={{
        background: highlight ? ACCENT_COLOR : SECONDARY_COLOR,
        color: value === 'X' ? PRIMARY_COLOR : '#ff9800',
        borderColor: highlight ? PRIMARY_COLOR : '#b0bec5',
      }}
      onClick={onClick}
      aria-label={value ? `Cell is ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

// Calculate Winner
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Returns the winning line if there is a winner, or null. */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]) {
      return line;
    }
  }
  return null;
}

// Main Board Component
function Board({ squares, onSquareClick, winnerLine }) {
  return (
    <div className="ttt-board">
      {[0, 1, 2].map(row =>
        <div className="ttt-board-row" key={row}>
          {[0,1,2].map(col => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                highlight={winnerLine?.includes(idx)}
              />
            )
          })}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main Tic Tac Toe app.
   * - Handles board state, player turn, win/tie, and restart.
   * - Renders a minimal, modern, responsive UI.
   */

  // Get theme from environment, fallback to 'light'
  // PUBLIC_INTERFACE
  const themeEnv = process.env.REACT_APP_THEME || 'light';
  const [theme, setTheme] = useState(themeEnv);

  // Board: Array(9) with 'X', 'O', or null.
  const [squares, setSquares] = useState(Array(9).fill(null));
  // Player: true = X, false = O
  const [xIsNext, setXIsNext] = useState(true);
  // Game status and winner
  const winnerLine = calculateWinner(squares);
  const winner = winnerLine ? squares[winnerLine[0]] : null;
  const movesLeft = squares.some(sq => sq === null);

  // Result text
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (!movesLeft) {
    status = "It's a tie!";
  } else {
    status = `Next: ${xIsNext ? "X" : "O"}`;
  }

  // Update CSS custom properties for dynamic color palette
  useEffect(() => {
    document.documentElement.style.setProperty('--kavia-primary', PRIMARY_COLOR);
    document.documentElement.style.setProperty('--kavia-secondary', SECONDARY_COLOR);
    document.documentElement.style.setProperty('--kavia-accent', ACCENT_COLOR);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    if (squares[idx] || winner) return;
    const newSquares = squares.slice();
    newSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <header className="App-header ttt-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{status}</div>
        <Board squares={squares} onSquareClick={handleSquareClick} winnerLine={winnerLine} />
        <div className="ttt-controls">
          <button className="ttt-btn" onClick={handleRestart}>Restart Game</button>
        </div>
        <footer className="ttt-footer">
          <span className="ttt-credit">
            Built with React &mdash; Minimal, Modern UI
          </span>
        </footer>
      </header>
    </div>
  );
}

export default App;
