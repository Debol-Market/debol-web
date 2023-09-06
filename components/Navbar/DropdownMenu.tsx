import { logout } from "@/services/auth";
import Link from "next/link";
import { FC } from "react";

type Props = {
  loggedIn: boolean;
  onAuthChange: (p: any) => void;
  setDropdown: (p: boolean) => void;
  setCurrencyModal: (p: boolean) => void;
};

const DropdownMenu: FC<Props> = ({
  loggedIn,
  setDropdown,
  onAuthChange,
  setCurrencyModal,
}) => {
  return (
    <div className="fixed top-16 sm:top-[72px] right-0 sm:right-10 border border-neutral-200/90 w-full sm:w-[240px] sm:rounded-lg shadow-lg bg-white py-2 flex justify-center flex-col z-20">
      {loggedIn ? (
        <>
          <Link href="/order">
            <div className="py-2.5 pl-5 hover:bg-slate-100/80">Orders</div>
          </Link>

          <div
            onClick={() => {
              setDropdown(false);
              logout().then(() => onAuthChange(null));
            }}
            className="py-2.5 pl-5 hover:bg-slate-100/80 cursor-pointer"
          >
            Logout
          </div>
        </>
      ) : (
        <Link href="/register">
          <div className="py-2.5 pl-5 hover:bg-slate-100/80">Register</div>
        </Link>
      )}

      <Link href="/contacts">
        <div className="py-2.5 pl-5 hover:bg-slate-100/80">Contact Us</div>
      </Link>
      <div
        onClick={() => {
          setDropdown(false);
          setCurrencyModal(true);
        }}
        className="py-2.5 pl-5 hover:bg-slate-100/80 cursor-pointer"
      >
        Change Currency
      </div>
    </div>
  );
};

export default DropdownMenu;
