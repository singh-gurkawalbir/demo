/* global describe, expect */
import each from 'jest-each';
import sortTiles from './util';

describe('sortTiles util method', () => {
  const testCases = [];
  const tiles = [
    { _integrationId: 't1' },
    { _integrationId: 't2' },
    { _id: 't3' },
    { _id: 't4' },
    { _integrationId: 't5' },
    { _id: 't6' },
    { _id: 't7' },
    { _id: 't8' },
  ];

  testCases.push([tiles, tiles, undefined]);
  testCases.push([tiles, tiles, []]);
  testCases.push([
    tiles,
    tiles,
    ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],
  ]);
  testCases.push([
    [
      { _integrationId: 't1' },
      { _integrationId: 't2' },
      { _integrationId: 't5' },
      { _id: 't3' },
      { _id: 't4' },
      { _id: 't6' },
      { _id: 't7' },
      { _id: 't8' },
    ],
    tiles,
    ['t1', 't2', 't5'],
  ]);
  testCases.push([
    [
      { _integrationId: 't2' },
      { _id: 't3' },
      { _id: 't6' },
      { _id: 't7' },
      { _integrationId: 't1' },
      { _id: 't4' },
      { _integrationId: 't5' },
      { _id: 't8' },
    ],
    tiles,
    ['t2', 't3', 't6', 't7'],
  ]);

  each(testCases).test(
    'should return %o for tiles %o and tilesOrder %o',
    (expected, tiles, tilesOrder) => {
      expect(sortTiles(tiles, tilesOrder)).toEqual(expected);
    }
  );
});
