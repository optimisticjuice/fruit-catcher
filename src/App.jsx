import { useState, useEffect } from "react";
import backgroundMusic from "./assets/background-music.mp3";
import Fruit from "./Fruit";
import Basket from "./Basket";
import Display from "./Display";
import useWindowDimensions from "./Dimensions";
import GameTimer from './GameTimer';  
import FruitSpawning from './FruitSpawning';
import {FRUIT_SIZE, fruitImages} from './GameUtils';
import AudioManager from './AudioManager';
import MoveBasket from './MoveBasket';
import './App.css';

  export default function App() {
  const { width: GAME_WIDTH, height: GAME_HEIGHT } = useWindowDimensions();
  const basketWidth = GAME_WIDTH * 0.2; // Calculate 20% of current game width
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - basketWidth / 2);
  const [score, setScore] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(5);
  const gameTime = 83;
  //  AudioManager makes the background music play and pause and controls the volume
   const { audioRef, startMusic, pauseMusic } = AudioManager(backgroundMusic, volumeLevel);
  //  Timer controls the game time and game over
   const {   
    timer,   
    gameOver,   
    gameStarted,   
    setGameOver,   
    resetTimer,   
    startTimer   
  } = GameTimer(gameTime);  

  const { fruits, setFruits, resetFruits } = FruitSpawning(  
    gameStarted,   
    gameOver,   
    GAME_WIDTH,   
    fruitImages  
  );  
  // 🍎 NEW EFFECT TO PAUSE AUDIO ON GAME OVER 🎶
  useEffect(() => {
   if (gameOver) pauseMusic();
 }, [gameOver]);
 // Reset basket position when GAME_WIDTH changes
  useEffect(() => {
    setBasketX(GAME_WIDTH / 2 - basketWidth / 2);
  }, [GAME_WIDTH, basketWidth]);
  
  
  MoveBasket(gameOver, GAME_WIDTH, basketWidth, setBasketX);
  
  // Animate fruit falling and check for catch
  useEffect(() => {
    if (!gameStarted || gameOver ) return;
     
    const fallInterval = setInterval(() => {
      setFruits((fruits) => {
        let newFruits = [];
        fruits.forEach((fruit) => {
          const newY = fruit.y + 5;
          // Check if caught
          if (
            newY + FRUIT_SIZE >= GAME_HEIGHT - 30 && // near basket height
            fruit.x + FRUIT_SIZE > basketX &&
            fruit.x < basketX + basketWidth
          ) {
            setScore((score) => score + 0.5); // Increase score if caught
          } else if (newY < GAME_HEIGHT) {
            newFruits.push({ ...fruit, y: newY }); // keep fruit falling
          }
          // Else fruit falls off screen, do not keep
        });
        return newFruits;
      });
    }, 50);

    return () => clearInterval(fallInterval);
  }, [basketX, gameOver,gameStarted, GAME_HEIGHT]);
  // Restart game
  const restartGame = () => {
    setScore(0);
    resetFruits();
    resetTimer();
    setBasketX(GAME_WIDTH / 2 - basketWidth / 2);
    setGameOver(false);
    startMusic();
  };
    // Listen for keypress events to update volume
    useEffect(() => {
      function handleKeyDown(e) {
        if (e.key >= "1" && e.key <= "9") {
          setVolumeLevel(Number(e.key));
        } 
      }
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameStarted]);

  return (
    <>
        <div>
          <audio ref={audioRef} src={backgroundMusic}>Audio Doesn't work</audio>
        </div>   
     <div className="game-container">
      {fruits.map(({ id, x, y, image }) => (
        <Fruit key={id} x={x} y={y} image={image} />
      ))}

      <Basket x={basketX} width={basketWidth} />
      <div className="score">
        Score: {score}
      </div>
      
      <div className="timer">
        Time: {timer}
      </div>
      {gameOver && <Display restartGame={restartGame} score={score}/>}
      {!gameStarted && !gameOver && (
        <div
        className="start-modal"
        >
          <div>Press keys 1 to 9 to change volume (current: {volumeLevel})</div>
          <div>Start Game!</div>
         {/* Show Start button if game hasn't started */}
        {/* Show Start button if game has NOT started */}
        <button className="start-button"
  onClick={() => {
   startTimer();  // Start the game

    if (audioRef.current) {
      if (audioRef.current.paused || audioRef.current.ended) {
        audioRef.current.currentTime = 0;  // Reset audio to start
        audioRef.current.play().catch(() => {
          // Ignore play errors due to autoplay restrictions
        });
      }
    }
  }}
>
  Start Game
</button>
<div>
</div>
      </div>
      )}
    </div>
      </>
  );
}