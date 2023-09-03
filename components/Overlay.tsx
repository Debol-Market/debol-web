import { FC } from "react";

type props = {
  onClick: VoidFunction;
  children: React.ReactNode;
};

const Overlay: FC<props> = ({ onClick, children }) => {
  return (
    <div
      className="z-50 fixed flex items-center justify-center top-0 bottom-0 left-0 h-full w-screen bg-neutral-700/30 backdrop-blur-sm"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Overlay;
