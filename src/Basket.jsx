import basketImg from './assets/basket.png';

const Basket = ({ x, width }) => {
  const style = {
    position: "absolute",
    bottom: 0,
    left: x,
    width: width,
    height: 30,
    borderRadius: 10,
  };
  return <img src={basketImg} alt="basket" style={style} draggable={false} />;
};

export default Basket;