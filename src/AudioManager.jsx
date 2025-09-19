import { useRef, useEffect } from 'react';  
  
export default function AudioManager(volumeLevel) {  
  const audioRef = useRef(null);  
  
  useEffect(() => {  
    if (audioRef.current) {  
      audioRef.current.volume = volumeLevel / 9;  
      if (!audioRef.current.paused && audioRef.current.muted) {  
        audioRef.current.muted = false;  
      }  
    }  
  }, [volumeLevel]);  
  
  const startMusic = () => {  
    if (audioRef.current) {  
      audioRef.current.currentTime = 0;  
      audioRef.current.play().catch(() => {  
        // Ignore play errors due to autoplay restrictions  
      });  
    }  
  };  
  
  const pauseMusic = () => {  
    if (audioRef.current) {  
      audioRef.current.pause();  
    }  
  };  
  
  return {  
    audioRef,  
    startMusic,  
    pauseMusic  
  };  
}