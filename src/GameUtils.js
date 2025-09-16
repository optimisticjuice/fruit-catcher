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

export {FRUIT_SIZE, fruitImages, getRandomX};
