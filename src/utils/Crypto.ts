import {AES, enc, mode, pad} from 'crypto-js';
import {AES_HASH_KEY, AES_SECRET_KEY, AES_IV} from '@env';

export const getHash = (type: string) => {
  const timeStamp = new Date().getTime();
  const hash = `type=${type}&timeStamp=${timeStamp}&key=${AES_HASH_KEY}`;
  const cipher = AES.encrypt(hash, enc.Utf8.parse(AES_SECRET_KEY), {
    iv: enc.Utf8.parse(AES_IV),
    padding: pad.Pkcs7,
    mode: mode.CBC,
  });
  return cipher.toString();
};
