import Spinner from "@/components/Spinner";
import useApp from "@/services/appContext";
import useRedirect from "@/utils/useRedirect";
import { ConfirmationResult } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import AuthCode, { AuthCodeRef } from "react-auth-code-input";
import { MdDone } from "react-icons/md";
import Btn from "./Btn";
import Overlay from "./Overlay";

type props = {
  phone: string;
  closeModal: () => void;
  confirmation: ConfirmationResult;
};

const OTPModal = ({ phone, confirmation, closeModal }: props) => {
  const router = useRouter();
  const redirectUrl = useRedirect();
  const { onAuthChange } = useApp();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const AuthInputRef = useRef<AuthCodeRef>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (code.length == 6) formSubmit();
  }, [code]);

  const formSubmit = () => {
    if (!confirmation) return;
    setLoading(true);
    confirmation
      .confirm(code)
      .then(({ user }) => {
        setLoading(false);
        setVerified(true);

        setTimeout(() => {
          onAuthChange(user).then(() => router.push(redirectUrl));
        }, 1200);
      })
      .catch((err) => {
        setLoading(false);
        if (err.code == "auth/invalid-verification-code")
          setError("Invalid verification code.");
        setTimeout(() => {
          AuthInputRef.current?.clear();
        }, 1200);
      });
  };

  return (
    <Overlay onClick={closeModal}>
      <div
        className="bg-white rounded-xl flex py-6 max-w-md w-full flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {verified ? (
          <div className="flex w-full flex-col items-center py-6">
            <MdDone className="h-20 w-20 text-primary" />
            <h1 className="text-3xl my-3">Success!</h1>
            <p>Your Phone number verified successfully!</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl text-primary mb-2 font-semibold">
              Verification Code
            </h1>
            <div className="flex flex-col items-center ">
              <p className="max-w-xs text-center my-2">
                Please Enter the 6-digit Code we have sent to{" "}
                <span className="font-semibold">{phone}</span> by SMS.
              </p>
              <AuthCode
                ref={AuthInputRef}
                onChange={setCode}
                allowedCharacters="numeric"
                containerClassName="flex gap-2.5 mx-4 my-2"
                inputClassName="max-w-[42px] aspect-square rounded-lg border border-slate-300 text-2xl focus:shadow px-1 text-center"
              />
              {error ? <p className="text-red-600 mb-3">{error}</p> : null}

              <div className="my-6">
                {loading ? (
                  <div className="flex items-center rounded-md opacity-80 py-2.5 px-4 bg-gradient">
                    <Spinner />
                  </div>
                ) : (
                  <Btn
                    id="signInBtn"
                    onClick={formSubmit}
                    disabled={code.length < 6}
                    label="Confirm"
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
};

export default OTPModal;
