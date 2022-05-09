/* global describe, test, expect */
import { getTextAfterCount, camelCase, isHTML, getTrimmedTitle, getParsedMessage, escapeSpecialChars } from './string';

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
    expect(getTextAfterCount('error')).toEqual('0 errors');
  });
});

describe('camelCase util test cases', () => {
  test('should not throw exception if invalid or empty args are supplied', () => {
    expect(camelCase()).toEqual('');
    expect(camelCase('')).toEqual('');
    expect(camelCase(null)).toEqual(null);
  });
  test('should return camel cases string', () => {
    expect(camelCase('Magento store')).toEqual('magento store');
    expect(camelCase('Shopify')).toEqual('shopify');
  });
});

describe('isHTML util test cases', () => {
  test('should not throw exception if invalid or empty args are supplied', () => {
    expect(isHTML()).toEqual(false);
    expect(isHTML(null)).toEqual(false);
  });
  test('should return false if invalid html is provided', () => {
    expect(isHTML('test string')).toEqual(false);
    expect(isHTML('<xml')).toEqual(false);
  });
  test('should return true if passed string is html', () => {
    expect(isHTML('<br></br>')).toEqual(true);
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

describe('getParsedMessage util test cases', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(getParsedMessage()).toBeUndefined();
    expect(getParsedMessage(null)).toEqual(null);
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
    expect(escapeSpecialChars(null)).toEqual(null);
  });
  test('should return correct string with escaped chars if present', () => {
    expect(escapeSpecialChars('false')).toEqual('false');
    expect(escapeSpecialChars(true)).toEqual('true');
    expect(escapeSpecialChars('\n')).toEqual('\\n');
    expect(escapeSpecialChars('\r\n')).toEqual('\\r\\n');
    expect(escapeSpecialChars('*')).toEqual('*');
    expect(escapeSpecialChars({id: '[]'})).toEqual(JSON.stringify({id: '[]'}));
  });
});
