declare const DISCORD_PUBLIC_KEY: string;

const keyData = new TextEncoder().encode(DISCORD_PUBLIC_KEY).slice(0, 16);
const cryptoKey = crypto.subtle.importKey("raw", keyData, 'AES-CTR', false, ["encrypt", "decrypt"]);

export const encode = async (str: string) => {
    const strData = new TextEncoder().encode(str);
    const key_encoded = await cryptoKey;
    const result: ArrayBuffer = await crypto.subtle.encrypt({
        name: 'AES-CTR',
        counter: keyData,
        length: 64
    }, key_encoded, strData);
    return btoa(String.fromCharCode(...new Uint8Array(result)));
}

export const decode = async (encrypted: string) => {
    const strData = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const key_encoded = await cryptoKey;
    const result: ArrayBuffer = await crypto.subtle.decrypt({
        name: 'AES-CTR',
        counter: keyData,
        length: 64
    }, key_encoded, strData);

    return new TextDecoder().decode(result);
}