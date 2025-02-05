import { signal } from "@preact/signals";

export const jwtKey = signal<CryptoKey>(
  await crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
  ),
);
