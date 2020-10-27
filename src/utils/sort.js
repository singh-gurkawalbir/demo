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
    const compareValue = parseInt(firstEl, 10) - parseInt(secondEl, 10);

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
    ? -firstEl.localeCompare(secondEl)
    : firstEl.localeCompare(secondEl);
};

export const celigoListCompare = (a, b) => {
  if (/\[\*\]/.test(a.id) && !/\[\*\]/.test(b.id)) {
    return 1;
  }
  if (!/\[\*\]/.test(a.id) && /\[\*\]/.test(b.id)) {
    return -1;
  }

  return stringCompare('id')(a, b);
};
