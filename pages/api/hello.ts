// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import admin from "@/services/firebase-admin";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  admin.database().ref("test").set("success");
  res.status(200).json({ name: "John Doe" });
}
