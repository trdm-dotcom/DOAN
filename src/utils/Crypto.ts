import { AES, enc, mode, pad } from 'crypto-js';

export const getHash = (type: string) => {
  const timeStamp = new Date().getTime();
  const hash = `type=${type}&timeStamp=${timeStamp}&key=wfyxb3sR1O`;
  const cipher = AES.encrypt(hash, enc.Utf8.parse(key), {
    iv: enc.Utf8.parse(iv),
    padding: pad.Pkcs7,
    mode: mode.CBC,
  });
  return cipher.toString();
};
