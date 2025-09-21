import './Display.css';
// import AudioManager from "./AudioManager";

export default function Display({restartGame, score, startMusic}){
  return(
        <div
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
        startMusic();}}
      className="restart-button">
      Restart Game
    </button>
  </div>
    ) 
  }