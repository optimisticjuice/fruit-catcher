const FRUIT_SIZE = 50;

const Fruit = ({ x, y, image }) => {
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
};

export default Fruit;