import { useState, useEffect } from "react"
import { Sun, Moon, RotateCcw, RefreshCcw } from 'lucide-react'

export default function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("tic-tac-toe-theme")
    if (savedTheme) {
      setDarkMode(savedTheme === "dark")
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true)
    }
  }, [])

  // Apply theme
  useEffect(() => {
    localStorage.setItem("tic-tac-toe-theme", darkMode ? "dark" : "light")
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ]

  const checkWinner = (squares) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo }
      }
    }
    return null
  }

  const handleClick = (index) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = isXNext ? "X" : "O"
    setBoard(newBoard)

    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setShowModal(true)
    } else if (newBoard.every((cell) => cell !== null)) {
      setWinner("draw")
      setShowModal(true)
    } else {
      setIsXNext(!isXNext)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setWinner(null)
    setWinningLine([])
    setShowModal(false)
  }

  const getStrikeLineStyle = () => {
    if (winningLine.length === 0) return { display: "none" }

    const [a, b, c] = winningLine
    const style = {
      position: "absolute",
      height: "4px",
      backgroundColor: "#10b981",
      zIndex: 10,
      borderRadius: "2px",
      transition: "all 0.5s ease-out",
    }

    // Rows
    if (a === 0 && c === 2) return { ...style, top: "16.67%", left: "5%", width: "90%" }
    if (a === 3 && c === 5) return { ...style, top: "50%", left: "5%", width: "90%" }
    if (a === 6 && c === 8) return { ...style, top: "83.33%", left: "5%", width: "90%" }

    // Columns
    if (a === 0 && c === 6) return { ...style, top: "5%", left: "16.67%", width: "4px", height: "90%" }
    if (a === 1 && c === 7) return { ...style, top: "5%", left: "50%", width: "4px", height: "90%" }
    if (a === 2 && c === 8) return { ...style, top: "5%", left: "83.33%", width: "4px", height: "90%" }

    // Diagonals
    if (a === 0 && c === 8)
      return { ...style, top: "50%", left: "50%", width: "127%", transform: "translate(-50%, -50%) rotate(45deg)" }
    if (a === 2 && c === 6)
      return { ...style, top: "50%", left: "50%", width: "127%", transform: "translate(-50%, -50%) rotate(-45deg)" }

    return { display: "none" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
      </button>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Tic Tac Toe
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Classic strategy game</p>
          </div>

          {/* Current Player */}
          {!winner && (
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
              <div className="flex items-center justify-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm transition-all duration-300 ${
                    isXNext ? "bg-blue-500 scale-110" : "bg-gray-300 dark:bg-gray-600 scale-90"
                  }`}
                >
                  X
                </div>
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200">VS</span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm transition-all duration-300 ${
                    !isXNext ? "bg-red-500 scale-110" : "bg-gray-300 dark:bg-gray-600 scale-90"
                  }`}
                >
                  O
                </div>
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Player <span className="font-bold text-gray-800 dark:text-gray-200">{isXNext ? "X" : "O"}</span>'s turn
              </p>
            </div>
          )}

          {/* Game Board */}
          <div className="relative inline-block mb-6">
            <div className="grid grid-cols-3 gap-2 w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(index)}
                  className={`
                    w-full h-full text-3xl sm:text-4xl md:text-5xl font-bold border-2 rounded-xl transition-all duration-200
                    ${cell === "X" ? "text-blue-600 dark:text-blue-400" : "text-red-500 dark:text-red-400"}
                    ${
                      winningLine.includes(index)
                        ? "bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-500"
                        : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                    }
                    ${cell || winner ? "cursor-default" : "cursor-pointer hover:scale-105"}
                    active:scale-95
                  `}
                  disabled={cell || winner}
                >
                  {cell}
                </button>
              ))}
            </div>
            <div style={getStrikeLineStyle()}></div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetGame}
            className="text-gray-600 dark:text-blue-400 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-blue-500 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Reset Board
          </button>

          {/* Game Rules */}
          <div className="mt-8 p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">How to Play</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Take turns placing X and O. Get 3 in a row to win!
            </p>
          </div>
        </div>
      </div>

      {/* Winner Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center transform transition-all duration-300 scale-100">
            {winner === "draw" ? (
              <div>
                <div className="text-6xl mb-4">🤝</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">It's a Draw!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Good game, both players!</p>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">Player {winner} Won!</h2>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                      winner === "X" ? "bg-blue-500" : "bg-red-500"
                    }`}
                  >
                    {winner}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">Congratulations!</span>
                </div>
              </div>
            )}
            <button
              onClick={resetGame}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}