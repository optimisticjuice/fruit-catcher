import React, { useState, useEffect, useCallback, useRef } from "react";
import basketImg from './assets/basket.png';
import backgroundMusic from "./assets/background-music.mp3";

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
// After your fruitImages array and before Basket component, replace Fruit component with:


// Custom hook to get dynamic window size
function useWindowDimensions() {
  const getWindowDimensions = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.addEventListener("resize", handleResize);
    return () => {window.removeEventListener("resize", handleResize);
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    }
  }, []);
  
  return windowDimensions;
}

function getRandomX(maxWidth) {
  return Math.floor(Math.random() * (maxWidth - FRUIT_SIZE));
}

function Fruit({ x, y, image }) {
  const style = {
    position: "absolute",
    left: x,
    top: y,
    width: FRUIT_SIZE,
    height: FRUIT_SIZE,
    imageRendering: "pixelated",
    userSelect: "none",
    pointerEvents: "none",
  };
  return <img src={image} alt="fruit" style={style} draggable={false} />;
}


function Basket({ x, width }) {
  const style = {
    position: "absolute",
    bottom: 0,
    left: x,
    width: width,
    height: 30,
    borderRadius: 10,
  };
  return <img src={basketImg} alt="basket" style={style} draggable={false} />;
  ;
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
  const [timer, setTimer] = useState(82);
  const [volumeLevel, setVolumeLevel] = useState(5);
  const [gameStarted, setGameStarted] = useState(false); // tracks if the game has begun
  let fruitSpawnIndex = useRef(0); // define at the top of App() before useEffects


  function Display(){
    return(
      <div
  role="dialog"
  aria-modal="true"
  aria-labelledby="game-over-title"
  aria-describedby="game-over-message"
    style={{
      position: "fixed",
      inset: 0, // cover viewport to create a backdrop
      top: GAME_HEIGHT / 2 - 40, // Center vertically
      left: GAME_WIDTH / 2 - 100, // Center horizontally
      width: 200,
      height: 120,
      backgroundColor: "rgba(0,0,0,0.8)", // Semi-transparent dark overlay
      color: "white",
      textAlign: "center",
      padding: 20,
      borderRadius: 10,
      display: "flex",
      flexDirection: "column", // Stack text + button
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000, // Make sure it overlays game canvas
    }}
  >
    {/* Game Over message */}
    <h3 style={{ margin: 0 }}>Game Over</h3>

    {/* Restart button */}
    <button
      onClick={() => {
        // Restart the game state
        restartGame();

        // Restart the background music if available
        if (audioRef.current) {
          audioRef.current.currentTime = 0; // Reset audio to start
          audioRef.current
            .play()
            .catch(() => {
              // Ignore autoplay errors in browsers
            });
        }
      }}
      style={{
        marginTop: 15,
        padding: "8px 16px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        backgroundColor: "#4caf50", // Green button
        color: "white",
        fontWeight: "bold",
      }}
    >
      Restart Game
    </button>
  </div>
    ) 
  }
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
  
  // Restart game
  const restartGame = () => {
    setScore(0);
    setFruits([]);
    setTimer(82);
    setBasketX(GAME_WIDTH / 2 - basketWidth / 2);
    setGameOver(false);
   
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
      <div style={{ position: "absolute", top: 10, left: 10, fontSize: 18 }}>
        Score: {score}
      </div>
      <div style={{position: "absolute", top: 50, right: 90, fontSize: 15 }}>Press keys 1 to 9 to change volume (current: {volumeLevel})</div>
      <div style={{ position: "absolute", top: 25, right: 25, fontSize: 18 }}>
        Time: {timer}
      </div>
      {gameOver && <Display/>}
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
