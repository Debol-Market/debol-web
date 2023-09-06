import useApp from "@/services/appContext";
import React from "react";
import Overlay from "../Overlay";

type Props = {
  closeModal: () => void;
};

function CurrencyModal({ closeModal }: Props) {
  const { currency, setCurrency } = useApp();
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

  return (
    <Overlay onClick={closeModal}>
      <div
        className="flex flex-col py-3 gap-4 bg-white rounded-lg overflow-hidden"
        onClick={closeModal}
      >
        <h2 className="text-2xl px-6 font-semibold text-slate-800">
          Choose Currency
        </h2>
        <div className="flex flex-col gap-4 max-h-80 overflow-auto px-6">
          {currencies.map((currency) => (
            <button
              key={currency}
              onClick={() => setCurrency(currency)}
              className="p-2 bg-slate-200 hover:bg-slate-300 rounded-md"
            >
              {currency}
            </button>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

export default CurrencyModal;
