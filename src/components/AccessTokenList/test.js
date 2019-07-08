/* global describe, expect */
import each from 'jest-each';
import moment from 'moment';
import { isPurged, getAutoPurgeAtAsString } from './util';

describe('isPurged util method', () => {
  const testCases = [];
  let autoPurgeAt = moment();

  testCases.push([true, autoPurgeAt.toISOString(), autoPurgeAt.toString()]);

  ['seconds', 'minutes', 'hours', 'days'].forEach(unit => {
    autoPurgeAt = moment().subtract(1, unit);
    testCases.push([true, autoPurgeAt.toISOString(), autoPurgeAt.toString()]);
  });
  ['minutes', 'hours', 'days'].forEach(unit => {
    autoPurgeAt = moment().add(1, unit);
    testCases.push([false, autoPurgeAt.toISOString(), autoPurgeAt.toString()]);
  });
  each(testCases).test(
    'should return %s for %s (%s)',
    (expected, autoPurgeAt) => {
      expect(isPurged(autoPurgeAt)).toBe(expected);
    }
  );
});
describe('getAutoPurgeAtAsString util method', () => {
  const testCases = [];
  let autoPurgeAt = moment();

  testCases.push(['Purged', autoPurgeAt.toISOString(), autoPurgeAt.toString()]);

  ['seconds', 'minutes', 'hours', 'days'].forEach(unit => {
    autoPurgeAt = moment().subtract(1, unit);
    testCases.push([
      'Purged',
      autoPurgeAt.toISOString(),
      autoPurgeAt.toString(),
    ]);
  });

  autoPurgeAt = moment().endOf('day');

  testCases.push(['Today', autoPurgeAt.toISOString(), autoPurgeAt.toString()]);

  ['seconds', 'minutes', 'hours', 'days'].forEach(unit => {
    autoPurgeAt = moment()
      .endOf('day')
      .add(1, unit);
    testCases.push([
      'Tomorrow',
      autoPurgeAt.toISOString(),
      autoPurgeAt.toString(),
    ]);
  });

  [2, 3, 10, 30].forEach(days => {
    autoPurgeAt = moment()
      .endOf('day')
      .add(days, 'days');
    testCases.push([
      `${days} Days`,
      autoPurgeAt.toISOString(),
      autoPurgeAt.toString(),
    ]);
  });

  each(testCases).test(
    'should return %s for %s (%s)',
    (expected, autoPurgeAt) => {
      expect(getAutoPurgeAtAsString(autoPurgeAt)).toBe(expected);
    }
  );
});
