import { useState, useEffect, useRef } from 'react';  
  
export default function FruitSpawning(gameStarted, gameOver, gameWidth, fruitImages) {  
  const [fruits, setFruits] = useState([]);  
  const fruitIdRef = useRef(0);  
  const fruitSpawnIndex = useRef(0);  
  
  // Fruit spawning effect  
  useEffect(() => {  
    if (gameOver) return;  
  
    const spawnInterval = setInterval(() => {  
      if (!gameStarted) return;  
      setFruits((fruits) => {  
        // Use fruitSpawnIndex ref to pick image in alternating fashion  
        const image = fruitImages[fruitSpawnIndex.current % fruitImages.length];  
        fruitSpawnIndex.current++;  
  
        const x = getRandomX(gameWidth);  
        // Add new fruit with assigned image and unique id  
        return [...fruits, { x, y: 0, id: fruitIdRef.current++, image }];  
      });  
    }, 1000);  
  
    return () => clearInterval(spawnInterval);  
  }, [gameOver, gameStarted, gameWidth, fruitImages]);  
  
  const resetFruits = () => {  
    setFruits([]);  
    fruitIdRef.current = 0;  
    fruitSpawnIndex.current = 0;  
  };  
  
  return {  
    fruits,  
    setFruits,  
    resetFruits  
  };  
}  
  
function getRandomX(maxWidth) {  
  const FRUIT_SIZE = 50;  
  return Math.floor(Math.random() * (maxWidth - FRUIT_SIZE));  
}