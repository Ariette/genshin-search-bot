import { GenshinClient } from './GenshinClient';

export const clientCache = new Map<string, GenshinClient>();

export const getClient = (key: string) => {
  if (!clientCache.has(key)) {
    clientCache.set(key, new GenshinClient());
  }
  return clientCache.get(key)!;
};