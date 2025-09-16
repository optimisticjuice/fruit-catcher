import { useCallback, useEffect } from 'react';  
  
export default function useBasketControls(  
  gameOver,   
  gameWidth,   
  basketWidth,   
  setBasketX  
) {  
  const moveBasket = useCallback(  
    (e) => {  
      if (gameOver) return;  
    
      if (e.key === "ArrowLeft") {  
        setBasketX((x) => Math.max(0, x - 20));  
      } else if (e.key === "ArrowRight") {  
        setBasketX((x) => Math.min(gameWidth - basketWidth, x + 20));  
      }  
    },  
    [gameOver, gameWidth, basketWidth, setBasketX]  
  );  
    
  useEffect(() => {  
    window.addEventListener("keydown", moveBasket);  
    return () => window.removeEventListener("keydown", moveBasket);  
  }, [moveBasket]);  
  
  return {  
    moveBasket // Export in case you need direct access  
  };  
}