import useApp from "@/services/appContext";
import { motion } from "framer-motion";
import React, { FC } from "react";
import { ShoppingCart } from 'lucide-react';

type Props = {
  setIsCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const CartBtn: FC<Props> = ({ setIsCart }) => {
  const { basketCart, productCart } = useApp();

  return (
    <motion.button
      id="cart-btn"
      key={basketCart.length.toString() + productCart.length}
      animate={{
        x: [0, -2, 2, 0],
        rotate: [0, 10, -10, 0],
      }}
      onClick={() => setIsCart((p: boolean) => !p)}
      className="p-2 relative my-2 rounded-full hover:bg-slate-100 "
    >
      <ShoppingCart className="h-6 w-6" />
      {basketCart.length + productCart.length > 0 ? (
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
