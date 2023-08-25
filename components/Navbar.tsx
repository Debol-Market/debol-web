import useApp from "@/services/appContext";
import { useState } from "react";
import Cart from "./Cart";

const Navbar = () => {
  const { cart } = useApp();
  const [isCart, setIsCart] = useState(false);

  return (
    <>
      <div className="flex justify-center h-16 shadow-md sticky top-0">
        <div className="max-w-screen-lg justify-between flex w-full mx-6 items-center">
          <h1>logo</h1>
          <p onClick={() => setIsCart(!isCart)}>Cart</p>
          <span className="absolute">{cart.length}</span>
        </div>
      </div>
      {isCart && <Cart onClose={() => setIsCart(false)} />}
    </>
  );
};

export default Navbar;
