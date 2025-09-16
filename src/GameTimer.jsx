import { useState, useEffect } from 'react';  
  
export default function GameTimer(initialTime) {  
  const [timer, setTimer] = useState(initialTime);  
  const [gameOver, setGameOver] = useState(false);  
  const [gameStarted, setGameStarted] = useState(false);  
  
  // Timer countdown effect  
  useEffect(() => {  
    if (gameOver || !gameStarted) return;  
      
    if (timer === 0) {  
      setGameOver(true);  
      return;  
    }  
      
    const timerId = setTimeout(() => setTimer((t) => t - 1), 1000);  
    return () => clearTimeout(timerId);  
  }, [timer, gameOver, gameStarted]);  
  
  const resetTimer = (newTime = initialTime) => {  
    setTimer(newTime);  
    setGameOver(false);  
  };  
  
  const startTimer = () => {  
    setGameStarted(true);  
  };  
  
  return {  
    timer,  
    gameOver,  
    gameStarted,  
    setGameStarted,  
    setGameOver,  
    resetTimer,  
    startTimer  
  };  
}