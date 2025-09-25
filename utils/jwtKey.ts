export async function getJwtCryptoKey(
  secret: string | null | undefined,
): Promise<CryptoKey> {
  console.log("getJwtCryptoKey scret string:", secret);
  if (!secret) {
    throw new Error("jwtKey missing from context");
  }

  const secretBytes = new TextEncoder().encode(secret);

  return await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign", "verify"],
  );
}
