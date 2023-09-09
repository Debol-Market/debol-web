import { default as admin, default as firebaseAdmin } from "@/services/firebase-admin";
import generator from 'generate-password-ts';
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "No token is provided" });

  let uid;

  try {
    uid = (await firebaseAdmin.auth().verifyIdToken(token)).uid;
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }

  const user = await admin.auth().getUser(uid)

  if (user?.customClaims)
  return res.status(403).json({ error: "not authorized" });

if (user.customClaims?.role !== "admin")
  return res.status(403).json({ error: "not authorized" });

  const { driverCode } = req.body as {
    driverCode?: string;
  };

  if (!driverCode)
  return res.status(400).send({ error: "No driverCode is provided" });

  const {name, email} = req.body as {
    name: string;
    email: string;
  } 
 const password = generator.generate({
    length: 10,
    uppercase: true,
    lowercase: true,
    numbers: true
 });

  const driver = await admin.auth().createUser({
       displayName: name,
       email: email,
       password: password 
  });



  admin.auth().setCustomUserClaims(driver.uid,{role: 'driver'});

  res.status(200).send({url: driver}); 

}