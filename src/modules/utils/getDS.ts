import { encoder } from './common';

const salt = '6s25p5ox5y14umn1p61aqyyvbvvl3lrt';

export const getDS = async () => {
  const time = Math.floor(Date.now() / 1000);
  const random = Math.random().toString(36).substring(2, 8);
  const msgUint8 = encoder.encode(`salt=${salt}&t=${time}&r=${random}`);
  const hashBuffer = await crypto.subtle.digest({ name: 'MD5' }, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return `${time},${random},${hashHex}`;
};
