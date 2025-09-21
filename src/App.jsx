import { useState, useEffect } from "react";
import backgroundMusic from "./assets/background-music.mp3";
import Fruit from "./Fruit";
import Basket from "./Basket";
import Display from "./Display";
import useWindowDimensions from "./Dimensions";
import GameTimer from './GameTimer';  
import useFruitSpawning from './FruitSpawning';
import {FRUIT_SIZE, fruitImages} from './GameUtils';
import AudioManager from './AudioManager';
import MoveBasket from './MoveBasket';
import './App.css';

//  Now Add Comments
  export default function App() {
  const { width: GAME_WIDTH, height: GAME_HEIGHT } = useWindowDimensions();
  const basketWidth = GAME_WIDTH * 0.2; // Calculate 20% of current game width
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - basketWidth / 2);
  const [score, setScore] = useState(0);
  const [volumeLevel, setVolumeLevel] = useState(5);
  const gameTime = 5;
  //  AudioManager makes the background music play and pause and controls the volume
   const { audioRef, startMusic, pauseMusic } = AudioManager(volumeLevel);
  //  Timer controls the game time and game over
   const {   
    timer,   
    gameOver,   
    gameStarted,   
    setGameOver,   
    resetTimer,   
    startTimer   
  } = GameTimer(gameTime);  

  // Handle when a fruit is caught
  const handleFruitCaught = () => {
    setScore(prevScore => prevScore + 0.5);
  };

  const { fruits, resetFruits } = useFruitSpawning({  
    gameStarted,   
    gameOver,   
    gameWidth: GAME_WIDTH,
    gameHeight: GAME_HEIGHT,
    basketX,
    basketWidth,
    fruitImages,
    onFruitCaught: handleFruitCaught
  });
  // 🍎 NEW EFFECT TO PAUSE AUDIO ON GAME OVER 🎶
  useEffect(() => {
   if (gameOver) pauseMusic();
 }, [gameOver]);
 // Reset basket position when GAME_WIDTH changes
  useEffect(() => {
    setBasketX(GAME_WIDTH / 2 - basketWidth / 2);
  }, [GAME_WIDTH, basketWidth]);
  
  
  MoveBasket(gameOver, GAME_WIDTH, basketWidth, setBasketX, GAME_HEIGHT);
  


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
      {gameOver && <Display restartGame={restartGame} score={score} startMusic={startMusic}/>}
      {!gameStarted && (
        <div
        className="start-modal"
        >
          <div className="volume-info">Press keys 1 to 9 to change volume (current: {volumeLevel})</div>
          <div className="start-text">Start Game!</div>
         {/* Show Start button if game hasn't started */}
        {/* Show Start button if game has NOT started */}
        <button className="start-button"
  onClick={() => {
   startTimer();  // Start the game
   startMusic(); // Start the music
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