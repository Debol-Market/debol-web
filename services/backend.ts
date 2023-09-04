import crypto from "crypto";

const key = process.env.ENCRYPTION_KEY ?? "";

// Encrypt JSON object
export function encrypt(data: object): string {
  const cipher = crypto.createCipher("aes-256-cbc", key);
  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// Decrypt encrypted data
export function decrypt(encryptedData: string): object {
  const decipher = crypto.createDecipher("aes-256-cbc", key);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return JSON.parse(decrypted);
}
