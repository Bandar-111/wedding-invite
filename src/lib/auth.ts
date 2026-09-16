// Signed, stateless session tokens using Web Crypto (works in both the
// Node.js runtime and the Edge middleware runtime, no extra dependencies).

export type Role = "admin" | "staff";

const THIRTY_DAYS_MS = 1000 * 60 * 60 * 24 * 30;

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufToHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuf(hex: string): Uint8Array | null {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function createSessionToken(role: Role, secret: string): Promise<string> {
  const payload = `${role}.${Date.now()}`;
  const key = await getKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${bufToHex(sig)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  role: Role,
  secret: string,
  maxAgeMs: number = THIRTY_DAYS_MS
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [tokenRole, timestamp, sigHex] = parts;
  if (tokenRole !== role) return false;

  const age = Date.now() - Number(timestamp);
  if (!Number.isFinite(age) || age < 0 || age > maxAgeMs) return false;

  const sigBytes = hexToBuf(sigHex);
  if (!sigBytes) return false;

  const key = await getKey(secret);
  const payload = `${tokenRole}.${timestamp}`;
  return crypto.subtle.verify("HMAC", key, sigBytes.buffer as ArrayBuffer, new TextEncoder().encode(payload));
}
