/* global expect, describe, test */

import {
  getAvailablePreviewStages,
  getPreviewDataPageSizeInfo,
  previewFileData,
  HTTP_STAGES,
  PREVIEW_STAGE,
  getRequestURL,
  getRecordSizeOptions,
  isPreviewPanelAvailable,
} from '.';

describe('getAvailablePreviewStages util', () => {
  test('should return empty list if the resource is null', () => {
    expect(getAvailablePreviewStages(null, {})).toEqual([]);
  });
  test('should return empty list if the adaptorType is invalid', () => {
    const resource = { adaptorType: 'INVALID', _id: 1 };

    expect(getAvailablePreviewStages(resource, {})).toEqual([]);
  });
  test('should return PREVIEW_STAGE for data loader or rest csv export', () => {
    expect(getAvailablePreviewStages({}, { isDataLoader: true })).toBe(PREVIEW_STAGE);
    expect(getAvailablePreviewStages({}, { isRestCsvExport: true })).toBe(PREVIEW_STAGE);
  });
  test('should return PREVIEW_STAGE for file adaptors', () => {
    const fileAdaptors = ['FTPExport', 'S3Export', 'AS2Export'];
    const resource = {
      _id: 1,
      adaptorType: fileAdaptors[Math.floor(Math.random() * fileAdaptors.length)],
    };

    expect(getAvailablePreviewStages(resource, {})).toBe(PREVIEW_STAGE);
  });
  test('should return PREVIEW_STAGE for NS/SF/any DB adaptors', () => {
    const adaptors = ['NetSuiteExport', 'SalesforceExport', 'MongodbExport', 'DynamodbExport', 'RDBMSExport'];
    const resource = {
      _id: 1,
      adaptorType: adaptors[Math.floor(Math.random() * adaptors.length)],
    };

    expect(getAvailablePreviewStages(resource, {})).toBe(PREVIEW_STAGE);
  });
  test('should return request, response and parsed stages for HTTP/REST adaptors', () => {
    const adaptors = ['HTTPExport', 'RESTExport'];
    const resource = {
      _id: 1,
      adaptorType: adaptors[Math.floor(Math.random() * adaptors.length)],
    };

    expect(getAvailablePreviewStages(resource, {})).toBe(HTTP_STAGES);
  });
});

describe('isPreviewPanelAvailable util', () => {
  test('should return false if the resource is null', () => {
    expect(isPreviewPanelAvailable(null)).toBe(false);
  });
  test('should return false if the adaptorType is invalid', () => {
    const resource = { _id: 1, adaptorType: 'INVALID'};

    expect(isPreviewPanelAvailable(resource)).toBe(false);
  });
  test('should return false if the resourceType is not exports', () => {
    const resource = { _id: 1, adaptorType: 'HTTPExport'};

    expect(isPreviewPanelAvailable(resource, 'imports')).toBe(false);
  });
  test('should return false if the resource is of blob type is not exports', () => {
    const resource = { _id: 1, adaptorType: 'HTTPExport', type: 'blob'};
    const newBlobResource = { _id: 'newID', resourceType: 'lookupFiles' };

    expect(isPreviewPanelAvailable(resource, 'exports')).toBe(false);
    expect(isPreviewPanelAvailable(newBlobResource, 'exports')).toBe(false);
  });
  test('should return true for assistants', () => {
    const resource = { _id: 1, adaptorType: 'HTTPExport', assistant: 'bigcommerce'};

    expect(isPreviewPanelAvailable(resource, 'exports')).toBe(true);
  });
  test('should return true for valid applications eligible for preview panel', () => {
    const randomValidAdaptorTypes = ['SalesforceExport', 'MongodbExport', 'FTPExport'];
    const resource = {
      _id: 1,
      adaptorType: randomValidAdaptorTypes[Math.floor(Math.random() * randomValidAdaptorTypes.length)],
    };

    expect(isPreviewPanelAvailable(resource, 'exports')).toBe(true);
  });
});

describe('getPreviewDataPageSizeInfo util', () => {
  test('should return 1 Page and O records for invalid/empty preview data', () => {
    expect(getPreviewDataPageSizeInfo(undefined)).toBe('1 Page, 0 Records');
  });
  test('should return 1 Page and 1 record for preview data with single record', () => {
    const previewData = {
      data: [
        {
          id: 5,
          name: 'user1',
          category: 'category1',
        },
      ]};

    expect(getPreviewDataPageSizeInfo(previewData)).toBe('1 Page, 1 Record');
  });
  test('should return valid page and records info for valid preview data', () => {
    const previewData = {
      data: [
        {
          id: 5,
          name: 'user1',
        },
        {
          id: 6,
          name: 'user2',
        },
        {
          id: 7,
          name: 'user3',
        },
      ]};

    expect(getPreviewDataPageSizeInfo(previewData)).toBe('1 Page, 3 Records');
  });
});

describe('previewFileData util', () => {
  test('should return the passed data if preview data is not an array', () => {
    const previewData = { test: 5 };

    expect(previewFileData(previewData, 5)).toBe(previewData);
  });
  test('should return the passed data if recordSize is invalid', () => {
    const previewData = [{ test: 5 }];

    expect(previewFileData(previewData)).toBe(previewData);
  });
  test('should return the passed data if recordSize is not a number', () => {
    const previewData = [{ id1: 5 }, { id2: 15 }, { id3: 25 }, { id4: 35 }, { id5: 45 }];

    expect(previewFileData(previewData, '5')).toEqual(previewData);
  });
  test('should return extracted data based on valid record size passed', () => {
    const previewData = [{ id1: 5 }, { id2: 15 }, { id3: 25 }, { id4: 35 }, { id5: 45 }];

    expect(previewFileData(previewData, 3)).toEqual([{ id1: 5 }, { id2: 15 }, { id3: 25 }]);
  });
});

describe('getRequestURL util', () => {
  test('should return undefined incase of request data not having request url', () => {
    const requestData = { data: [{ method: 'GET' }]};

    expect(getRequestURL(requestData)).toBeUndefined();
  });
  test('should return request url from valid request data', () => {
    const requestData = {
      data: [
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            authorization: 'Basic *****',
          },
          url: 'https://celigohelp.zendesk.com/api/v2/tickets',
        },
      ],
    };

    expect(getRequestURL(requestData)).toBe('https://celigohelp.zendesk.com/api/v2/tickets');
  });
});

describe('getRecordSizeOptions util', () => {
  test('should return 10 options to select in the record size field', () => {
    const options = [
      { label: '10', value: '10'},
      { label: '20', value: '20'},
      { label: '30', value: '30'},
      { label: '40', value: '40'},
      { label: '50', value: '50'},
      { label: '60', value: '60'},
      { label: '70', value: '70'},
      { label: '80', value: '80'},
      { label: '90', value: '90'},
      { label: '100', value: '100'},
    ];

    expect(getRecordSizeOptions()).toEqual(options);
  });
});
