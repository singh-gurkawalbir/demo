import get from 'lodash/get';
import isObject from 'lodash/isObject';

export const stringCompare = (sortProperty, isDescending) => (a, b) => {
  const firstEl = sortProperty && isObject(a) ? get(a, sortProperty) || '' : a;
  const secondEl = sortProperty && isObject(b) ? get(b, sortProperty) || '' : b;

  if (typeof firstEl !== 'string' || typeof secondEl !== 'string') {
    return 0;
  }

  return isDescending
    ? -firstEl.localeCompare(secondEl)
    : firstEl.localeCompare(secondEl);
};

export const celigoListCompare = (a, b) => {
  if (
    (a.id && b.id && a.id.indexOf('[*]') > -1 && b.id.indexOf('[*]') > -1) ||
    (a.id && b.id && a.id.indexOf('[*]') === -1 && b.id.indexOf('[*]') === -1)
  ) {
    return a.id > b.id ? 1 : -1;
  }

  if (a.id && b.id && a.id.indexOf('[*]') === -1 && b.id.indexOf('[*]') > -1) {
    return -1;
  }

  if (a.id && b.id && a.id.indexOf('[*]') > -1 && b.id.indexOf('[*]') === -1) {
    return 1;
  }

  return 0;
};
