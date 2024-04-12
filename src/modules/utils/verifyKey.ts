import { encoder } from './common';

const KEYS: Record<string, CryptoKey> = {};

function hexToBinary(hex: string | null) {
  if (hex == null) {
    return new Uint8Array(0);
  }

  const buffer = new Uint8Array(Math.ceil(hex.length / 2));
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  return buffer;
}

async function getCryptoKey(publicKey: string) {
  if (KEYS[publicKey] != null) {
    return KEYS[publicKey];
  }

  const key = await crypto.subtle.importKey(
    'raw',
    hexToBinary(publicKey),
    {
      name: 'NODE-ED25519',
      namedCurve: 'NODE-ED25519',
    },
    true,
    ['verify'],
  );

  KEYS[publicKey] = key;
  return key;
}

export async function verifyKey(
  payload: string,
  signature: string,
  timestamp: string,
  publicKey: string,
): Promise<boolean> {
  const key = await getCryptoKey(publicKey);
  const signatureBin = hexToBinary(signature);

  if (signature == null || timestamp == null || payload == null) {
    return false;
  }

  return crypto.subtle.verify('NODE-ED25519', key, signatureBin, encoder.encode(timestamp + payload));
}
