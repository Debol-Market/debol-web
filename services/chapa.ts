import { Chapa } from "chapa-nodejs";

const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECKEY ?? "",
});

export default chapa;
