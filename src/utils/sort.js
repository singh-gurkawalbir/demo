import get from 'lodash/get';
import isObject from 'lodash/isObject';
import { TILE_STATUS } from './constants';

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

export const tileCompare = (sortProperty, isDescending) => (tileA, tileB) => {
  if (sortProperty !== 'status') {
    return stringCompare(sortProperty, isDescending)(tileA, tileB);
  }
  // console.log('tilecompare called');
  const { status: statusA, numError: numErrorA = 0, offlineConnections: offlineConnectionsA } = tileA || {};
  const { status: statusB, numError: numErrorB = 0, offlineConnections: offlineConnectionsB } = tileB || {};

  const numOfflineConnectionsA = offlineConnectionsA?.length || 0;
  const numOfflineConnectionsB = offlineConnectionsB?.length || 0;

  // connection errors should be given higher priority
  if (numErrorA === 0 && numOfflineConnectionsB === 0 &&
    numErrorB !== 0 && numOfflineConnectionsA === numErrorB) {
    return isDescending ? -1 : 1;
  }
  if (numErrorB === 0 && numOfflineConnectionsA === 0 &&
    numErrorA !== 0 && numOfflineConnectionsB === numErrorA) {
    return isDescending ? 1 : -1;
  }

  const totalErrorCountA = numOfflineConnectionsA + numErrorA;
  const totalErrorCountB = numOfflineConnectionsB + numErrorB;
  const compareValue = totalErrorCountA - totalErrorCountB;

  if (compareValue !== 0 || statusA === statusB) return isDescending ? -compareValue : compareValue;

  if (statusA === TILE_STATUS.SUCCESS) {
    return isDescending ? -1 : 1;
  }
  if (statusB === TILE_STATUS.SUCCESS) {
    return isDescending ? 1 : -1;
  }
  if (statusA === TILE_STATUS.IS_PENDING_SETUP) {
    return isDescending ? -1 : 1;
  }
  if (statusB === TILE_STATUS.IS_PENDING_SETUP) {
    return isDescending ? 1 : -1;
  }

  return isDescending ? -compareValue : compareValue;
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
