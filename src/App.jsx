import React, { useState, useEffect, useCallback, useRef } from "react";
import backgroundMusic from "./assets/background-music.mp3";
import Fruit from "./Fruit";
import Basket from "./Basket";
import Display from "./Display";
import useWindowDimensions from "./Dimensions";

const FRUIT_SIZE = 50;
const fruitImages = [
  "/fruits/pear.png",
  "/fruits/apple.png",
  "/fruits/grape.png",
  "/fruits/naartjie.png",
  "/fruits/banana.png",
  "/fruits/pineapple.png",
  "/fruits/mangoe.png",
  "/fruits/grapefruit.png",
  "/fruits/guava.png",
];
  

function getRandomX(maxWidth) {
  return Math.floor(Math.random() * (maxWidth - FRUIT_SIZE));

}

export default function App() {
  const { width: GAME_WIDTH, height: GAME_HEIGHT } = useWindowDimensions();
  const basketWidth = GAME_WIDTH * 0.2; // Calculate 20% of current game width
  const fruitIdRef = useRef(0);
  const audioRef = useRef(null);
  const [basketX, setBasketX] = useState(GAME_WIDTH / 2 - basketWidth / 2);
  const [fruits, setFruits] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(8);
  const [volumeLevel, setVolumeLevel] = useState(5);
  const [gameStarted, setGameStarted] = useState(false); // tracks if the game has begun
  let fruitSpawnIndex = useRef(0); // define at the top of App() before useEffects

useEffect(() => {
  if (gameOver) return;

  const spawnInterval = setInterval(() => {
    if (!gameStarted) return;
    setFruits((fruits) => {
      // Use fruitSpawnIndex ref to pick image in alternating fashion
      const image = fruitImages[fruitSpawnIndex.current % fruitImages.length];
      fruitSpawnIndex.current++;

      const x = getRandomX(GAME_WIDTH);
      // Add new fruit with assigned image and unique id
      return [...fruits, { x, y: 0, id: fruitIdRef.current++, image }];
    });
  }, 1000);

  return () => clearInterval(spawnInterval);
}, [gameOver, gameStarted, GAME_WIDTH]);

 // 🍎 NEW EFFECT TO PAUSE AUDIO ON GAME OVER 🎶
 useEffect(() => {
  if (gameOver && audioRef.current) {
    audioRef.current.pause();
  }
}, [gameOver]);

  // Reset basket position when GAME_WIDTH changes
  useEffect(() => {
    setBasketX(GAME_WIDTH / 2 - basketWidth / 2);
  }, [GAME_WIDTH, basketWidth]);
  
  // Move basket with arrow keys
  const moveBasket = useCallback(
    (e) => {
      if (gameOver) return;
  
      if (e.key === "ArrowLeft") {
        setBasketX((x) => Math.max(0, x - 20));
      } else if (e.key === "ArrowRight") {
        setBasketX((x) => Math.min(GAME_WIDTH - basketWidth, x + 20));
      }
    },
    [gameOver, GAME_WIDTH, basketWidth]
  );
  
  useEffect(() => {
    window.addEventListener("keydown", moveBasket);
    return () => window.removeEventListener("keydown", moveBasket);
  }, [moveBasket]);

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
            setScore((score) => score + 1); // Increase score if caught
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

  // Timer countdown
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    
    if (timer === 0) {
      
      setGameOver(true);
      }
    const timerId = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timer, gameOver, gameStarted]);
  
  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset audio to start
      audioRef.current.play().catch(() => {
        // Ignore play errors due to autoplay restrictions
      });
    }
  };
  
  // Restart game
  const restartGame = () => {
    setScore(0);
    setFruits([]);
    setTimer(7);
    setBasketX(GAME_WIDTH / 2 - basketWidth / 2);
    setGameOver(false);
    startMusic();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volumeLevel / 9;
      if (!audioRef.current.paused && audioRef.current.muted) {
        audioRef.current.muted = false;
      }
    }
  }, [volumeLevel]);
  

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
     <div
      style={{
        position: "relative",
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        border: "2px solid black",
        backgroundColor: "lightyellow",
        overflow: "hidden",
        margin: "0 auto",
      }}
      >
      {fruits.map(({ id, x, y, image }) => (
        <Fruit key={id} x={x} y={y} image={image} />
      ))}

      <Basket x={basketX} width={basketWidth} />
      <div style={{ position: "absolute", top: 15, left: 35, fontSize: 18 }}>
        Score: {score}
      </div>
      <div style={{position: "absolute", top: 50, right: 90, fontSize: 15 }}>Press keys 1 to 9 to change volume (current: {volumeLevel})</div>
      <div style={{ position: "absolute", top: 25, right: 25, fontSize: 18 }}>
        Time: {timer}
      </div>
      {gameOver && <Display restartGame={restartGame}/>}
      {!gameStarted && !gameOver && (
        <div
        style={{
          position: "absolute",
          top: GAME_HEIGHT / 2 - 40,
          left: GAME_WIDTH / 2 - 100,
          width: 200,
          height: 80,
          backgroundColor: "rgba(0,0,0,0.8)",
          color: "white",
          textAlign: "center",
          padding: 20,
          borderRadius: 10,
        }}
        >
          <div>Start Game!</div>
         {/* Show Start button if game hasn't started */}
        {/* Show Start button if game has NOT started */}
        <button
  onClick={() => {
    setGameStarted(true);  // Start the game

    if (audioRef.current) {
      if (audioRef.current.paused || audioRef.current.ended) {
        audioRef.current.currentTime = 0;  // Reset audio to start
        audioRef.current.play().catch(() => {
          // Ignore play errors due to autoplay restrictions
        });
      }
    }
  }}
  style={{ marginTop: 10 }}
>
  Start Game
</button>

<div>
  {/* Show popup only if the game has started AND is over */}

</div>
      </div>
      )}
    </div>
      </>
  );
}