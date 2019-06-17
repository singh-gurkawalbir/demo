/* global describe, expect */
import each from 'jest-each';
import {
  showViewDiffLink,
  MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK,
  MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK,
} from './util';

function getSampleObject(length) {
  if (length <= 6) {
    return {};
  }

  if (length === 7) {
    return { '': '' };
  }

  return { a: 'x'.repeat(length - 8) };
}

describe('showViewDiffLink util method', () => {
  const testCases = [
    [
      'should return false, if oldValue & newValue are undefined',
      undefined,
      undefined,
      false,
    ],
    [
      `should return false, if oldValue(string) & newValue(string) lengths < ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK}`,
      'o'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK - 1),
      'n'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK - 1),
      false,
    ],
    [
      `should return false, if oldValue(string) & newValue(string) lengths = ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK}`,
      'o'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK),
      'n'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK),
      false,
    ],
    [
      `should return true, if oldValue(string) length > ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK} & newValue(string) length < ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK}`,
      'o'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK + 1),
      'n'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK - 1),
      true,
    ],
    [
      `should return true, if oldValue(string) length < ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK} & newValue(string) length > ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK}`,
      'o'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK - 1),
      'n'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK + 1),
      true,
    ],
    [
      `should return true, if oldValue(string) & newValue(string) lengths > ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK}`,
      'o'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK + 1),
      'n'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK + 1),
      true,
    ],
    [
      'should return false, if oldValue(Object) & newValue(Object) are empty',
      {},
      {},
      false,
    ],
    [
      `should return false, if oldValue(Object) & newValue(Object) stringified lengths < ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK}`,
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK - 1),
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK - 1),
      false,
    ],
    [
      `should return false, if oldValue(Object) & newValue(Object) stringified lengths = ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK}`,
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK),
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK),
      false,
    ],
    [
      `should return true, if oldValue(Object) stringified length > ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK} & newValue(Object) stringified length < ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK}`,
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK + 1),
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK - 1),
      true,
    ],
    [
      `should return true, if oldValue(Object) stringified length < ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK} & newValue(Object) stringified length > ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK}`,
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK - 1),
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK + 1),
      true,
    ],
    [
      `should return true, if oldValue(Object) & newValue(Object) stringified lengths > ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK}`,
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK + 1),
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK + 1),
      true,
    ],
    [
      `should return false, if oldValue(Object) stringified length < ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK} & newValue(string) length < ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK}`,
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK - 1),
      'something',
      false,
    ],
    [
      `should return true, if oldValue(Object) stringified length < ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK} & newValue(string) length > ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK}`,
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK - 1),
      'n'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK + 1),
      true,
    ],
    [
      `should return false, if oldValue(string) length < ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK} & newValue(Object) stringified length < ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK}`,
      'something',
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK - 1),
      false,
    ],
    [
      `should return true, if oldValue(string) length < ${MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK} & newValue(Object) stringified length > ${MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK}`,
      'o'.repeat(MINIMUM_STRING_LENGTH_TO_SHOW_DIFF_LINK - 1),
      getSampleObject(MINIMUM_STRINGIFIED_OBJECT_LENGTH_TO_SHOW_DIFF_LINK + 1),
      true,
    ],
  ];

  each(testCases).test('%s', (testName, oldValue, newValue, expected) => {
    expect(showViewDiffLink(oldValue, newValue)).toBe(expected);
  });
});
