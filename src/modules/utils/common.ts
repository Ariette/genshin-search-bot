declare const DISCORD_PUBLIC_KEY: string;

export const encoder = new TextEncoder();
export const decoder = new TextDecoder();

const keyData = encoder.encode(DISCORD_PUBLIC_KEY).slice(0, 16);
const cryptoKey = crypto.subtle.importKey('raw', keyData, 'AES-CTR', false, ['encrypt', 'decrypt']);

export const encode = async (str: string) => {
  const strData = encoder.encode(str);
  const key_encoded = await cryptoKey;
  const result: ArrayBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-CTR',
      counter: keyData,
      length: 64,
    },
    key_encoded,
    strData,
  );
  return btoa(String.fromCharCode(...new Uint8Array(result)));
};

export const decode = async (encrypted: string) => {
  const strData = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
  const key_encoded = await cryptoKey;
  const result: ArrayBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-CTR',
      counter: keyData,
      length: 64,
    },
    key_encoded,
    strData,
  );

  return decoder.decode(result);
};

export class CustomError extends Error {}

export const qsStringify = (query: Record<string, string>) => {
  return Object.keys(query)
    .map((key) => `${key}=${encodeURIComponent(query[key])}`)
    .join('&');
};
