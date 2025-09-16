// Dimensions.jsx
import { useState, useEffect } from "react";

export default function useWindowDimensions() {
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
    return () => {
      window.removeEventListener("resize", handleResize);
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
    };
  }, []);

  return windowDimensions;
}