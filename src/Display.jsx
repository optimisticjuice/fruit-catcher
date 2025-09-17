import { useRef } from "react";
import './Display.css';

export default function Display({restartGame, score}){
    const audioRef = useRef(null);
    return(
        <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-over-title"
        aria-describedby="game-over-message"
        className="restart-modal"
  >
    Score: {score}
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
      className="restart-button">
      Restart Game
    </button>
  </div>
    ) 
  }