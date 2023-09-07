import useApp from "@/services/appContext";
import React, { useState } from "react";
import Overlay from "../Overlay";
import { getCurrencyMulti } from "@/services/database";
import Spinner from "../Spinner";

type Props = {
  closeModal: () => void;
};

function CurrencyModal({ closeModal }: Props) {
  const { currency, setCurrency, setCurrencyMultiplier } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const currencies = [
    "USD",
    "EUR",
    "ETB",
    "GBP",
    "JPY",
    "CAD",
    "AUD",
    "NZD",
    "AED",
  ];

  const handleClick = (c: string) => {
    setIsLoading(true);
    getCurrencyMulti(c).then((res) => {
      setCurrency(c);
      setCurrencyMultiplier(res);
      setIsLoading(false);
      closeModal();
    });
  };

  return (
    <Overlay onClick={closeModal}>
      <div
        className="flex relative flex-col py-3 gap-4 bg-white rounded-lg overflow-hidden"
        onClick={closeModal}
      >
        <h2 className="text-2xl px-6 font-semibold text-slate-800">
          Choose Currency
        </h2>
        <div className="flex flex-col gap-4 max-h-80 overflow-auto px-6">
          {currencies.map((c) => (
            <button
              key={c}
              onClick={() => handleClick(c)}
              className={`p-2 ${
                currency === c
                  ? "bg-primary text-white hover:brightness-110"
                  : "bg-slate-200 hover:bg-slate-300"
              } rounded-md`}
            >
              {c}
            </button>
          ))}
        </div>
        {isLoading && (
          <div className="flex z-20 justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-slate-500/40">
            <Spinner className="h-14 w-14 text-accent" />
          </div>
        )}
      </div>
    </Overlay>
  );
}

export default CurrencyModal;
