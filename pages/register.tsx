import Btn from "@/components/Btn";
import Logo from "@/components/Logo";
import OTPModal from "@/components/OTPModal";
import PhoneField from "@/components/PhoneField";
import useApp from "@/services/appContext";
import { signInWithGoogle } from "@/services/auth";
import { auth } from "@/services/firebase";
import useRedirect from "@/utils/useRedirect";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  getRedirectResult,
  signInWithPhoneNumber,
} from "firebase/auth";
import { PhoneNumberUtil } from "google-libphonenumber";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

const phoneUtil = PhoneNumberUtil.getInstance();

export const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

function Page() {
  const router = useRouter();
  const redirectUrl = useRedirect();
  const [phone, setPhone] = useState("");
  const isValid = isPhoneValid(phone);
  const [error, setError] = useState<string>();
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult>();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    getRedirectResult(auth).then((res) => {
      if (res) router.push(redirectUrl || "/");
    });
  }, []);

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window == "undefined") return;
    setLoading(true);

    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      },
    );

    signInWithPhoneNumber(auth, phone.replace(" ", ""), recaptchaVerifier)
      .then((confirmationRes) => {
        setOpenModal(true);
        setConfirmation(confirmationRes);
      })
      .catch((err) => {
        if (err.code === "auth/too-many-requests") {
          setError("Too many requests. Try again later.");
        }
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const googleLogin = () => {
    try {
      signInWithGoogle();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center bg-white p-8 gap-3 rounded-xl shadow-lg">
        <header className="mb-3">
          <Logo />
        </header>
        <button
          onClick={googleLogin}
          className="bg-slate-50 hover:bg-slate-100 flex items-center gap-3 w-full py-3 px-4 rounded-lg shadow-md"
        >
          <FcGoogle size={24} />
          Sign in with Google
        </button>
        <form onSubmit={formSubmit} className="flex flex-col">
          <p className="text-center text-neutral-500 text-lg font-bold mb-4 mt-3">
            OR
          </p>
          <PhoneField
            country="us"
            label="Phone Number"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(value) => setPhone(value)}
          />
          <p className="text-red-600 text-sm mb-2 mt-1">
            {!isValid && !isFocused && phone != "+1 "
              ? "Phone Number is not valid."
              : null}
            {error}
          </p>

          <Btn
            type="submit"
            label="Register"
            className="mt-3"
            isLoading={loading}
            disabled={!isValid || !!error}
          />
        </form>
      </div>
      {openModal && confirmation ? (
        <OTPModal
          phone={phone}
          confirmation={confirmation}
          closeModal={() => setOpenModal(false)}
        />
      ) : null}
      <div id="recaptcha-container"></div>
    </div>
  );
}

export default Page;
