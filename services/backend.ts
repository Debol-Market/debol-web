import crypto from "crypto";

const key = process.env.ENCRYPTION_KEY ?? "";

// Encrypt JSON object
export function encrypt(data: object): string {
  return crypto
    .createHmac("sha256", key)
    .update(JSON.stringify(data))
    .digest("base64");
}
