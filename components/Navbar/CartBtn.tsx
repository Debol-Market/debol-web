import useApp from "@/services/appContext";
import { motion } from "framer-motion";
import React, { FC } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";

type Props = {
  setIsCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const CartBtn: FC<Props> = ({ setIsCart }) => {
  const { basketCart, productCart } = useApp();

  return (
    <motion.button
      id="cart-btn"
      key={basketCart.length.toString() + productCart.length.toString()}
      animate={{
        x: [0, -2, 2, 0],
        rotate: [0, 10, -10, 0],
      }}
      onClick={() => setIsCart((p: boolean) => !p)}
      className="p-2 relative my-2 rounded-full hover:bg-slate-100 "
    >
      <AiOutlineShoppingCart className="h-8 w-8" />
      {basketCart.length > 0 || productCart.length ? (
        <motion.div
          animate={{ scale: [1, 2, 1] }}
          className="h-2.5 w-2.5 rounded-full bg-red-500 absolute top-2.5 right-2"
        ></motion.div>
      ) : (
        <></>
      )}
    </motion.button>
  );
};

export default CartBtn;
