/* global describe, test, expect */
import {
  isValidFileType,
  isValidFileSize,
  getUploadedFileStatus,
  getFileReaderOptions,
  getJSONContentFromString,
  generateCSVFields,
  getFileColumns,
} from '.';
import messageStore from '../../constants/messages';

describe('isValidFileType util', () => {
  test('should return true if fileType is empty eg ADP connector', () => {
    const file = {
      name: 'certificate',
      size: 531,
      type: 'text',
      webkitRelativePath: '',
    };

    expect(isValidFileType()).toEqual(true);
    expect(isValidFileType(null, file)).toEqual(true);
  });
  test('should return true if fileType is passed but file is empty or does not have type', () => {
    expect(isValidFileType('json')).toEqual(true);
    expect(isValidFileType('json', { type: ''})).toEqual(true);
  });
  test('should return false if passed file has invalid type', () => {
    const fileType = 'json';
    const file = {
      name: '3_csv.txt',
      size: 531,
      type: 'text/plain',
      webkitRelativePath: '',
    };

    expect(isValidFileType(fileType, file)).toEqual(false);
  });
  test('should return true if uploaded file\'s type is valid', () => {
    const fileType = 'xml';
    const file = {
      name: 'Req-T48982.xml',
      size: 7538,
      type: 'text/xml',
      webkitRelativePath: '',
    };

    expect(isValidFileType(fileType, file)).toEqual(true);
  });
});

describe('isValidFileSize util', () => {
  test('should return false if file or max size is empty', () => {
    expect(isValidFileSize()).toEqual(false);
    expect(isValidFileSize(null, 5000)).toEqual(false);
    expect(isValidFileSize({size: 500})).toEqual(false);
  });
  test('should return true if file size is less than max size', () => {
    const file = {
      name: 'certificate',
      size: 531,
      type: 'text',
      webkitRelativePath: '',
    };

    expect(isValidFileSize(file, 5000)).toEqual(true);
  });
  test('should return false if file size is greater than max size', () => {
    const file = {
      name: 'certificate',
      size: 10000,
      type: 'text',
      webkitRelativePath: '',
    };

    expect(isValidFileSize(file, 5000)).toEqual(false);
  });
});

describe('getUploadedFileStatus util', () => {
  test('should return empty object if file is not passed', () => {
    expect(getUploadedFileStatus()).toEqual({});
  });
  test('should return error msg if file does not have valid size', () => {
    const file = {
      name: 'certificate',
      size: 1500,
      type: '',
      webkitRelativePath: '',
    };
    const expectedObj = {
      success: false,
      error: messageStore('FILE_SIZE_EXCEEDED'),
    };

    expect(getUploadedFileStatus(file, 'json', {maxSize: 1000})).toEqual(expectedObj);
  });
  test('should return error msg if file type is invalid', () => {
    const file = {
      name: 'certificate',
      size: 500,
      type: 'text/plain',
      webkitRelativePath: '',
    };
    const expectedObj = {
      success: false,
      error: messageStore('FILE_TYPE_INVALID', {fileType: 'json'}),
    };

    expect(getUploadedFileStatus(file, 'json', {maxSize: 1000})).toEqual(expectedObj);
  });
  test('should return success without error if file is valid', () => {
    const file = {
      name: 'certificate',
      size: 500,
      type: 'application/json',
      webkitRelativePath: '',
    };
    const expectedObj = {
      success: true,
    };

    expect(getUploadedFileStatus(file, 'json', {maxSize: 1000})).toEqual(expectedObj);
  });
});

describe('getFileReaderOptions util', () => {
  test('return empty object if type is not passed or is not supported', () => {
    expect(getFileReaderOptions()).toEqual({});
    expect(getFileReaderOptions('xml')).toEqual({});
  });
  test('return content type as json if type is passed as json', () => {
    expect(getFileReaderOptions('json')).toEqual({ expectedContentType: 'json' });
  });
  test('return readAsArrayBuffer as true if type is xlsx', () => {
    expect(getFileReaderOptions('xlsx')).toEqual({ readAsArrayBuffer: true });
  });
});

describe('getJSONContentFromString util', () => {
  test('should return error if provided data is empty or not a json string', () => {
    expect(getJSONContentFromString()).toEqual({ success: false, error: messageStore('FILE_TYPE_INVALID', {fileType: 'JSON'})});
    expect(getJSONContentFromString('')).toEqual({ success: false, error: messageStore('FILE_TYPE_INVALID', {fileType: 'JSON'})});
    expect(getJSONContentFromString('{some}')).toEqual({ success: false, error: messageStore('FILE_TYPE_INVALID', {fileType: 'JSON'})});
  });
  test('should return success with parsed content if valid json string is provided', () => {
    expect(getJSONContentFromString('{"key":"value"}')).toEqual({ success: true, data: {key: 'value'}});
  });
});

// TODO: describe('getCsvFromXlsx util', () => {});
// requires some research on how to read a file locally

describe('generateCSVFields util', () => {
  test('should return empty array if data is empty', () => {
    expect(generateCSVFields()).toEqual([]);
  });
  test('should return default headers if includeHeader is false', () => {
    const data = `C1000010839|Sato|12S000357CS
      C1000010839|Unitech|1400-900035G`;

    const expectedHeaders = [
      ['Column0',
        'Column0'],
      ['Column1',
        'Column1'],
      ['Column2',
        'Column2'],
    ];

    expect(generateCSVFields(data, {includeHeader: false, columnDelimiter: '|'})).toEqual(expectedHeaders);
  });
  test('should return correct headers if includeHeader is true', () => {
    const data = `CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM
    C1000010839|Sato|12S000357CS
    C1000010839|Unitech|1400-900035G`;

    const expectedHeaders = [
      ['CUSTOMER_NUMBER',
        'CUSTOMER_NUMBER'],
      ['VENDOR_NAME',
        'VENDOR_NAME'],
      ['VENDOR_PART_NUM',
        'VENDOR_PART_NUM'],
    ];

    expect(generateCSVFields(data, {includeHeader: true, columnDelimiter: '|'})).toEqual(expectedHeaders);
  });
  test('should remove whitespace from headers if data contains the same', () => {
    const data = ` CUSTOMER_NUMBER   | VENDOR_NAME|VENDOR_PART_NUM
    C1000010839|Sato|12S000357CS
    C1000010839|Unitech|1400-900035G`;

    const expectedHeaders = [
      ['CUSTOMER_NUMBER',
        'CUSTOMER_NUMBER'],
      ['VENDOR_NAME',
        'VENDOR_NAME'],
      ['VENDOR_PART_NUM',
        'VENDOR_PART_NUM'],
    ];

    expect(generateCSVFields(data, {includeHeader: true, columnDelimiter: '|'})).toEqual(expectedHeaders);
  });
  test('should take default column and/or row delimiter if not provided in the options', () => {
    const data = `CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM
    C1000010839|Sato|12S000357CS
    C1000010839|Unitech|1400-900035G`;

    const expectedHeaders = [
      ['CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM',
        'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM'],
    ];

    expect(generateCSVFields(data)).toEqual(expectedHeaders);
  });
  test('should return empty array if data is not a string', () => {
    const data = {
      data: `CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM
    C1000010839|Sato|12S000357CS
    C1000010839|Unitech|1400-900035G`,
    };

    expect(generateCSVFields(data, { columnDelimiter: '|' })).toEqual([]);
  });
});

describe('getFileColumns util', () => {
  test('should return empty array if input data is empty', () => {
    expect(getFileColumns()).toEqual([]);
    expect(getFileColumns(null)).toEqual([]);
    expect(getFileColumns({})).toEqual([]);
  });
  test('should return empty array if input data does not contains columnsData or data', () => {
    expect(getFileColumns({columnsData: {}})).toEqual([]);
    expect(getFileColumns({data: {}})).toEqual([]);
  });
  test('should return correct file columns if input data is valid and of array of objects type', () => {
    const result = {
      columnsData: [{
        Column0: 'C1000010839',
        Column1: 'T113L',
      },
      {
        Column0: 'C1000010909',
        Column1: 'K6423',
      }],
    };

    expect(getFileColumns(result)).toEqual(['Column0', 'Column1']);
  });
  test('should return correct file columns if input data is valid and of array of array type', () => {
    const result = {
      data: [[{
        CUSTOMER_NUM: 'C1000010839',
        CODE: 'T113L',
      }],
      [{
        CUSTOMER_NUM: 'C1000010909',
        CODE: 'K6423',
      }],
      ],
    };

    expect(getFileColumns(result)).toEqual(['CUSTOMER_NUM', 'CODE']);
  });
  test('should return first object columns without failing if input data is grouped with different keys', () => {
    const result = {
      data: [[{
        CUSTOMER_NUM: 'C1000010839',
        CODE: 'T113L',
      }],
      [{
        ID: 'C1000010909',
        CODE: 'K6423',
      }],
      ],
    };

    expect(getFileColumns(result)).toEqual(['CUSTOMER_NUM', 'CODE']);
  });
});
