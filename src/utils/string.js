import stableStringify from 'fast-json-stable-stringify';
import { nanoid } from 'nanoid';

export const safeParse = o => {
  if (typeof o === 'object' || !o) return o;

  try {
    return JSON.parse(o);
  } catch (e) {
    return undefined;
  }
};
export function generateId(num) {
  const length = +num;

  if (num === 24) {
    // If length is 24, probably needed a mongodb ObjectId, generate one randomly
    return `${Math.floor(new Date().getTime() / 1000).toString(16)}0000000000000000`;
  }

  return !Number.isNaN(length) && length < 24 && length > 0 ? nanoid(length) : nanoid();
}

export const camelCase = (str = '') => {
  if (typeof str === 'string' && str.length) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  }

  return str;
};

export const hashCode = (s, stable) => {
  let hash = 0;
  let i;
  let chr;
  let str = s;

  if (typeof s === 'object') str = stable ? stableStringify(s) : JSON.stringify(s);

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
export const capitalizeFirstLetter = (str = '') => str.charAt(0).toUpperCase() + str.slice(1);

export default { hashCode, isJsonString, safeParse, capitalizeFirstLetter };
export const isHTML = text => /<\/?[a-z][\s\S]*>/i.test(text);

export const getTextAfterCount = (displayText, valueCount = 0) => `${valueCount} ${valueCount === 1 ? displayText : `${displayText}s`}`;

export const getTrimmedTitle = (title = '', maxLength = 40) => {
  if (maxLength < 4) return title;

  return title.length > maxLength
    ? `${title.substring(0, maxLength - 3)}...`
    : title;
};

export const getParsedMessage = message => {
  if (!message) return message;

  const formattedMessage = isJsonString(message) ? JSON.parse(message) : message;

  let safeValue = '';

  // this is to support double stringified messages
  // we first parse it and then return the message as string type
  if (typeof formattedMessage === 'string') {
    safeValue = formattedMessage;
  } else if (typeof formattedMessage === 'object') {
    safeValue = JSON.stringify(formattedMessage);
  } else {
    safeValue = `${formattedMessage}`;
  }

  return safeValue;
};

export const escapeSpecialChars = message => {
  let escapedMessage = message;

  if (!escapedMessage) return escapedMessage;

  try {
    // stringify escapes special chars
    // but if oldValue was already a string, then we need to remove extra double quotes
    escapedMessage = JSON.stringify(escapedMessage).replace(/^"|"$/g, '');
  } catch (e) {
  // do nothing
  }

  return escapedMessage;
};

export const generateUniqueKey = () => nanoid();
