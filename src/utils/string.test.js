/* global describe, test, expect */
import { getTextAfterCount, getTrimmedTitle } from './string';

describe('getTextAfterCount util test cases', () => {
  test('should return correct string when count is zero', () => {
    expect(getTextAfterCount('value', 0)).toEqual('0 values');
  });
  test('should return correct string when count is 1', () => {
    expect(getTextAfterCount('value', 1)).toEqual('1 value');
  });
  test('should return correct string when count is greater than 1', () => {
    expect(getTextAfterCount('value', 2)).toEqual('2 values');
    expect(getTextAfterCount('value', 3)).toEqual('3 values');
    expect(getTextAfterCount('value', 4)).toEqual('4 values');
  });
});

describe('getTrimmedTitle util test cases', () => {
  const longTitle = 'TITLE WITH LENGTH GREATER THAN FORTY CHARACTERS';

  test('should return empty string if no title is passed', () => {
    expect(getTrimmedTitle()).toEqual('');
  });
  test('should consider maxLength as 40 by default when no maxLength is passed', () => {
    const trimmedTitle = 'TITLE WITH LENGTH GREATER THAN FORTY ...';

    expect(getTrimmedTitle(longTitle)).toEqual(trimmedTitle);
  });

  test('should return the passed title  if the length is less than the maxLength', () => {
    const title = 'AMAZON TO NETSUITE';

    expect(getTrimmedTitle(title)).toBe(title);
  });
  test('should return trimmed title with "..." at the end when the title length exceeds maxLength', () => {
    const title = 'AMAZON TO NETSUITE';
    const trimmedTitle = 'AMAZON TO NE...';

    expect(getTrimmedTitle(title, 15)).toEqual(trimmedTitle);
  });
});

