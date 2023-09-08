import useApp from "@/services/appContext";
import { BsCurrencyExchange } from "react-icons/bs";
import { FC, useEffect, useState } from "react";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import Cart from "../Cart";
import Logo from "../Logo";
import SearchBar, { SearchSvg } from "./SearchBar";
import Link from "next/link";
import CartBtn from "./CartBtn";
import CurrencyModal from "./CurrencyModal";
import DropdownMenu from "./DropdownMenu";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window == "undefined" ? 1080 : window?.innerWidth,
  );
  const { user, onAuthChange } = useApp();
  const [isCart, setIsCart] = useState(false);
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);

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

  if (windowWidth < 760)
    return (
      <div className="flex justify-center h-16 sticky top-0 border-b border-neutral-300 bg-white z-20">
        <div className="flex w-full ml-4 sm:mr-4 items-center">
          <Logo />
          <div className="sm:grow flex justify-end ml-auto">
            <button
              onClick={() => setIsSearchOpen((p) => !p)}
              className="text-black fill-black p-2 rounded-full hover:bg-slate-100 my-3 aspect-square"
            >
              {isSearchOpen ? (
                <GrClose size={24} />
              ) : (
                <SearchSvg color="black" />
              )}
            </button>
            <CartBtn setIsCart={setIsCart} />
            <button
              className="rounded-full p-2 my-3 hover:bg-slate-100"
              onClick={() => setDropdown((p) => !p)}
            >
              {dropdown ? <GrClose size={24} /> : <AiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
        {isSearchOpen && (
          <div className="absolute top-16 right-0 w-full bg-white py-2 shadow-md flex justify-center">
            <SearchBar />
          </div>
        )}
        {currencyModal && (
          <CurrencyModal closeModal={() => setCurrencyModal(false)} />
        )}
        {dropdown && (
          <DropdownMenu
            loggedIn={!!user}
            setDropdown={setDropdown}
            onAuthChange={onAuthChange}
            setCurrencyModal={setCurrencyModal}
          />
        )}
        {isCart && <Cart onClose={() => setIsCart(false)} />}
      </div>
    );

  return (
    <>
      <div className="flex justify-center h-16 sticky top-0 border-b border-neutral-300 bg-white z-20">
        <div className="flex w-full ml-4 sm:mr-4 items-center">
          <Logo />
          <div className={`sm:grow flex justify-center ml-auto `}>
            <SearchBar />
          </div>
          <div className="flex h-full  ml-1">
            {!user ? (
              <>
                <button
                  className="rounded-full p-2 text-slate-800 my-2 hover:bg-slate-200"
                  onClick={() => setCurrencyModal((p) => !p)}
                >
                  <BsCurrencyExchange size={24} />
                </button>
                <Link
                  href={`/register?redirect=${encodeURIComponent(
                    router.asPath,
                  )}`}
                >
                  <div className="h-full px-2.5 flex items-center hover:bg-slate-100 text-lg">
                    Register
                  </div>
                </Link>
                <Link href="/contacts">
                  <div className="h-full px-2.5 flex items-center hover:bg-slate-100 text-lg">
                    Contact Us
                  </div>
                </Link>
                <CartBtn setIsCart={setIsCart} />
              </>
            ) : (
              <>
                <CartBtn setIsCart={setIsCart} />
                <button
                  className="rounded-full p-2 my-3 hover:bg-slate-100"
                  onClick={() => setDropdown((p) => !p)}
                >
                  {dropdown ? (
                    <GrClose size={24} />
                  ) : (
                    <AiOutlineMenu size={24} />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {dropdown && (
        <DropdownMenu
          loggedIn={!!user}
          setDropdown={setDropdown}
          onAuthChange={onAuthChange}
          setCurrencyModal={setCurrencyModal}
        />
      )}
      {currencyModal && (
        <CurrencyModal closeModal={() => setCurrencyModal(false)} />
      )}
      {isCart && <Cart onClose={() => setIsCart(false)} />}
    </>
  );
};

export default Navbar;
