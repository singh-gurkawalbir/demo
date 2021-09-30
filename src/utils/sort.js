import get from 'lodash/get';
import isObject from 'lodash/isObject';

const isNumber = el => {
  if (typeof el === 'number') { return true; }
  if (typeof el === 'string') {
    return !/\D/.test(el);
  }

  return false;
};

export const stringCompare = (sortProperty, isDescending) => (a, b) => {
  const firstEl = sortProperty && isObject(a) ? get(a, sortProperty) || '' : a;
  const secondEl = sortProperty && isObject(b) ? get(b, sortProperty) || '' : b;

  if (isNumber(firstEl) && isNumber(secondEl)) {
    const compareValue = +firstEl - +secondEl;

    return isDescending ? -compareValue : compareValue;
  }
  if (isNumber(firstEl)) {
    return isDescending ? 1 : -1;
  }
  if (isNumber(secondEl)) {
    return isDescending ? -1 : 1;
  }

  if (typeof firstEl !== 'string' || typeof secondEl !== 'string') {
    return 0;
  }

  return isDescending
    ? -firstEl.trim().localeCompare(secondEl.trim())
    : firstEl.trim().localeCompare(secondEl.trim());
};

export const celigoListCompare = (a, b) => {
  // If a.id contains "[*]" and b.id doesnot contain "[*]"
  if (/\[\*\]/.test(a.id) && !/\[\*\]/.test(b.id)) {
    return 1;
  }
  // If a.id doesnt contain "[*]" and b.id contains "[*]"
  if (!/\[\*\]/.test(a.id) && /\[\*\]/.test(b.id)) {
    return -1;
  }

  return stringCompare('id')(a, b);
};

export const comparer = ({ order, orderBy }) =>
  order === 'desc' ? stringCompare(orderBy, true) : stringCompare(orderBy);
