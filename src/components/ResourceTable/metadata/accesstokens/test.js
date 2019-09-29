/* global describe, expect */
import each from 'jest-each';
import moment from 'moment';
import { getAutoPurgeAtAsString } from './util';

describe.only('getAutoPurgeAtAsString util method', () => {
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
      expect(getAutoPurgeAtAsString({ autoPurgeAt })).toBe(expected);
    }
  );
});
