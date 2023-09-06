import firebaseAdmin from "@/services/firebase-admin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const getCurrencies = await firebaseAdmin.database().ref("currencies").get();

  if (getCurrencies.exists() && getCurrencies.val() !== null) {
    const cacheAge = Date.now() - getCurrencies.val().cacheTime;
    if (cacheAge < 90 * 60 * 1000) {
      return res.status(200).json({
        currencies: getCurrencies.val(),
      });
    }
  }

  const newCurrencies = await fetch(
    `http://api.exchangeratesapi.io/latest?access_key=${process.env.EXCHANGE_API_KEY}`,
  );

  const currencies = await newCurrencies.json();

  await firebaseAdmin
    .database()
    .ref("currencies")
    .set({ currencies, cacheTime: Date.now() });

  res.status(200).json(currencies);
}
