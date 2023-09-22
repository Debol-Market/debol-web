import { useRouter } from "next/router";
import { FC } from "react";
import Btn from "../Btn";
import Overlay from "../Overlay";

const LoginModal: FC<{ onClose: VoidFunction }> = ({ onClose }) => {
  const router = useRouter();

  return (
    <Overlay onClick={onClose}>
      <div
        className="bg-white p-6 rounded-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl">Register</h2>
        <p className="my-3 text-neutral-800 mb-7">
          You need to Register inorder to Checkout
        </p>
        <Btn
          label="Register"
          onClick={() =>
            router.push(
              `/register?redirect=${encodeURIComponent(router.asPath)}`
            )
          }
        />
      </div>
    </Overlay>
  );
};

export default LoginModal;
