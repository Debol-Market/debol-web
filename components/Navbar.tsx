import useApp from "@/services/appContext";
import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import Cart from "./Cart";
import Logo from "./Logo";
import SearchBar, { SearchSvg } from "./SearchBar";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window == "undefined" ? 1080 : window?.innerWidth
  );

  useEffect(() => {
    if (typeof window == "undefined") return;
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="flex justify-center h-16 sticky top-0 border-b border-neutral-300 bg-white">
        <div className="flex w-full ml-4 sm:mr-4 items-center">
          <Logo />
          <div className={`sm:grow flex justify-center ml-auto `}>
            {windowWidth < 640 ? (
              <>
                <button
                  onClick={() => setIsSearchOpen((p) => !p)}
                  className="text-black fill-black"
                >
                  {isSearchOpen ? (
                    <GrClose size={24} />
                  ) : (
                    <SearchSvg color="black" />
                  )}
                </button>
                {isSearchOpen && (
                  <div className="absolute top-16 right-0 w-full bg-white py-2 shadow-md flex justify-center">
                    <SearchBar />
                  </div>
                )}
              </>
            ) : (
              <SearchBar />
            )}
          </div>
          <CartBtn />
        </div>
      </div>
    </>
  );
};

const CartBtn: FC = () => {
  const { cart } = useApp();
  const [isCart, setIsCart] = useState(false);

  return (
    <>
      <motion.button
        key={cart.toString()}
        animate={{
          x: [0, -2, 2, 0],
          rotate: [0, 10, -10, 0],
        }}
        onClick={() => setIsCart(!isCart)}
        className="p-2 m-2 relative rounded-full hover:bg-slate-100 "
      >
        <AiOutlineShoppingCart className="h-8 w-8" />
        {cart.length > 0 ? (
          <motion.div
            animate={{ scale: [1, 2, 1] }}
            className="h-2.5 w-2.5 rounded-full bg-red-500 absolute top-2.5 right-2"
          ></motion.div>
        ) : (
          <></>
        )}
      </motion.button>
      {isCart && <Cart onClose={() => setIsCart(false)} />}
    </>
  );
};

export default Navbar;
