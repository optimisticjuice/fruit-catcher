import useWindowDimensions from "./Dimensions";
import { useRef } from "react";
export default function Display({restartGame, score}){
    const { width: GAME_WIDTH, height: GAME_HEIGHT } = useWindowDimensions();
    const audioRef = useRef(null);
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