import stableStringify from 'fast-json-stable-stringify';

export const safeParse = o => {
  if (typeof o === 'object') return o;

  try {
    return JSON.parse(o);
  } catch (e) {
    return undefined;
  }
};

export const hashCode = (s, stable) => {
  let hash = 0;
  let i;
  let chr;
  let str = s;

  if (typeof s === 'object')
    str = stable ? stableStringify(s) : JSON.stringify(s);

  if (!str || str.length === 0) return hash;

  for (i = 0; i < str.length; i += 1) {
    chr = str.charCodeAt(i);
    /* eslint-disable no-bitwise */
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
    /* eslint */
  }

  return hash;
};

export const isJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

export default { hashCode, isJsonString, safeParse };
