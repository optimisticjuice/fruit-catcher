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
  // Ensure we don't go below 0 if FRUIT_SIZE is larger than maxWidth
  const effectiveWidth = Math.max(0, maxWidth - FRUIT_SIZE);
  return Math.floor(Math.random() * effectiveWidth);
}

export {FRUIT_SIZE, fruitImages, getRandomX};
