import each from 'jest-each';
import { getTextAfterCount, camelCase, isHTML, getTrimmedTitle, getParsedMessage, escapeSpecialChars, hasWhiteSpace, isNumber } from './string';

describe('getTextAfterCount util test cases', () => {
  test('should return correct string when count is zero', () => {
    expect(getTextAfterCount('value', 0)).toBe('0 values');
  });
  test('should return correct string when count is 1', () => {
    expect(getTextAfterCount('value', 1)).toBe('1 value');
  });
  test('should return correct string when count is greater than 1', () => {
    expect(getTextAfterCount('value', 2)).toBe('2 values');
    expect(getTextAfterCount('value', 3)).toBe('3 values');
    expect(getTextAfterCount('value', 4)).toBe('4 values');
    expect(getTextAfterCount('error')).toBe('0 errors');
  });
});

describe('camelCase util test cases', () => {
  test('should not throw exception if invalid or empty args are supplied', () => {
    expect(camelCase()).toBe('');
    expect(camelCase('')).toBe('');
    expect(camelCase(null)).toBeNull();
  });
  test('should return camel cases string', () => {
    expect(camelCase('Magento store')).toBe('magento store');
    expect(camelCase('Shopify')).toBe('shopify');
  });
});

describe('isHTML util test cases', () => {
  test('should not throw exception if invalid or empty args are supplied', () => {
    expect(isHTML()).toBe(false);
    expect(isHTML(null)).toBe(false);
  });
  test('should return false if invalid html is provided', () => {
    expect(isHTML('test string')).toBe(false);
    expect(isHTML('<xml')).toBe(false);
  });
  test('should return true if passed string is html', () => {
    expect(isHTML('<br></br>')).toBe(true);
  });
});
describe('getTrimmedTitle util test cases', () => {
  const longTitle = 'TITLE WITH LENGTH GREATER THAN FORTY CHARACTERS';

  test('should return empty string if no title is passed', () => {
    expect(getTrimmedTitle()).toBe('');
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

describe('getParsedMessage util test cases', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(getParsedMessage()).toBeUndefined();
    expect(getParsedMessage(null)).toBeNull();
  });
  test('should return original string if its not a valid json string', () => {
    const message = '"{\\"error\\":\\"invalid_grant\\",\\"error_description\\":\\"AADSTS700082: The refresh token has expired due to inactivity.\\\\r\\\\nTrace ID: 7878\\\\r\\\\nCorrelation ID: 999\\\\r\\",\\"error_codes\\":[700082,\\"correlation_id\\":\\"9996c...';

    expect(getParsedMessage(message)).toEqual(message);
  });
  test('should return nicely structured string if input is double stringified xml', () => {
    const message = '"<?xml version=\\"1.0\\" encoding=\\"utf-8\\"?><Error><Code>ContainerNotFound</Code><Message>The specified container does not exist.\\nRequestId:000\\nTime:2022-01-13</Message></Error>"';
    const output = '<?xml version="1.0" encoding="utf-8"?><Error><Code>ContainerNotFound</Code><Message>The specified container does not exist.\nRequestId:000\nTime:2022-01-13</Message></Error>';

    expect(getParsedMessage(message)).toEqual(output);
  });
  test('should return nicely structured string if input is json string', () => {
    const message = '"{\\"code\\":\\"invalid_credentials\\",\\"message\\":\\"You have to be logged in to perform this action.\\"}"';
    const output = '{"code":"invalid_credentials","message":"You have to be logged in to perform this action."}';

    expect(getParsedMessage(message)).toEqual(output);
  });
  test('should return original string if input is already json formatted', () => {
    const message = '{"name":"INVALID_REQUEST","message":"Invalid request - see details.","debug_id":"da0f59843057d","details":[{"field":"end_date","value":"2021-08-09","location":"query","issue":"start_date is later than end_date"},{"field":"start_date","value":"2021-08-09","location":"query","issue":"start_date is later than end_date"}],"links":[]}';

    expect(getParsedMessage(message)).toEqual(message);
  });
  test('should return original string if input is plain string', () => {
    const message = 'Failed to load search with SearchId: 117865, because That search or mass update does not exist.';

    expect(getParsedMessage(message)).toEqual(message);
  });
});

describe('escapeSpecialChars util test cases', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(escapeSpecialChars()).toBeUndefined();
    expect(escapeSpecialChars(null)).toBe('null');
  });
  test('should return correct string with escaped chars if  present', () => {
    expect(escapeSpecialChars('false')).toBe('false');
    expect(escapeSpecialChars(false)).toBe('false');
    expect(escapeSpecialChars(undefined)).toBe();
    expect(escapeSpecialChars(true)).toBe('true');
    expect(escapeSpecialChars('\n')).toBe('\\n');
    expect(escapeSpecialChars('\r\n')).toBe('\\r\\n');
    expect(escapeSpecialChars('*')).toBe('*');
    expect(escapeSpecialChars({id: '[]'})).toEqual(JSON.stringify({id: '[]'}));
  });
});

describe('hasWhiteSpace util test cases', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(hasWhiteSpace()).toBe(false);
    expect(hasWhiteSpace(null)).toBe(false);
  });
  test('should return correct boolean value for given string', () => {
    expect(hasWhiteSpace('valid')).toBe(false);
    expect(hasWhiteSpace('valid string')).toBe(true);
    expect(hasWhiteSpace('valid  string')).toBe(true);
    expect(hasWhiteSpace(`valid
    string`)).toBe(true);
  });
});

describe('isNumber function test', () => {
  const testCases = [
    [
      'should return false for string',
      'value',
      false,
    ],
    [
      'should return true for number string',
      '1234',
      true,
    ],
    [
      'should return false for non numeric string',
      '1234abc',
      false,
    ],
    [
      'should return true for float string',
      '1.23',
      true,
    ],
    [
      'should return false for empty string',
      '',
      false,
    ],
    [
      'should return true for number',
      123,
      true,
    ],
  ];

  each(testCases).test('%s', (testName, inpValue, expected) => {
    // eslint-disable-next-line jest/no-standalone-expect
    expect(isNumber(inpValue)).toBe(expected);
  });
});
