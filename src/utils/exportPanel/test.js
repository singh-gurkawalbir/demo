
import {
  getAvailablePreviewStages,
  getPreviewDataPageSizeInfo,
  previewFileData,
  HTTP_STAGES,
  PREVIEW_STAGE,
  getRequestURL,
  getDecodedURL,
  isPreviewPanelAvailable,
  getLatestReqResData,
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
    const fileAdaptors = ['FTPExport', 'S3Export', 'AS2Export', 'VANExport'];
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
  test('should return false if the resourceType is not exports or imports', () => {
    const resource = { _id: 1, adaptorType: 'HTTPExport'};

    expect(isPreviewPanelAvailable(resource, 'pageGenerator')).toBe(false);
  });
  test('should return true if the resource is HTTP import', () => {
    const resource = { _id: 1, adaptorType: 'HTTPImport'};

    expect(isPreviewPanelAvailable(resource, 'imports')).toBe(true);
  });
  test('should return false if the resource is of blob type is not exports', () => {
    const blobResource1 = { _id: 1, adaptorType: 'HTTPExport', type: 'blob'};
    const blobResource2 = { _id: 2, adaptorType: 'HTTPExport', file: {output: 'blobKeys'}};
    const newBlobResource = { _id: 'newID', resourceType: 'lookupFiles' };

    expect(isPreviewPanelAvailable(blobResource1, 'exports')).toBe(false);
    expect(isPreviewPanelAvailable(blobResource2, 'exports')).toBe(false);
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
  test('should return 1 Page and 0 record for empty preview data', () => {
    expect(getPreviewDataPageSizeInfo({data: {}})).toBe('1 Page, 0 Records');
    expect(getPreviewDataPageSizeInfo({data: undefined})).toBe('1 Page, 0 Records');
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
    const previewData = { request: requestData };

    expect(getRequestURL(previewData)).toBeUndefined();
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
    const previewData = { request: requestData };

    expect(getRequestURL(previewData)).toBe('https://celigohelp.zendesk.com/api/v2/tickets');
  });
  test('should return request url of the latest request if the request data has multiple requests', () => {
    const sampleWithMultipleRequests = {
      name: 'request',
      errors: null,
      data: [
        {
          headers: {
            accept: 'application/json',
            'x-amz-access-token': '********',
            Host: 'sellingpartnerapi-na.amazon.com',
            'X-Amz-Date': '20211216T121633Z',
            Authorization: 'AWS4-HMAC-SHA256 Credential=AKIASXM4V7ZF66ZMNGMI/20211216/us-east-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-access-token;x-amz-date, Signature=b965e5a2035f7c621d96cc9541138d9759cf6ffb9287ad62e9d1420fcb14e4e5',
          },
          url: 'url1',
          method: 'GET',
        },
        {
          headers: {
            accept: 'application/json',
            'x-amz-access-token': '********',
            Host: 'sellingpartnerapi-na.amazon.com',
            'X-Amz-Date': '20211216T121633Z',
            Authorization: 'AWS4-HMAC-SHA256 Credential=AKIASXM4V7ZF66ZMNGMI/20211216/us-east-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-access-token;x-amz-date, Signature=b965e5a2035f7c621d96cc9541138d9759cf6ffb9287ad62e9d1420fcb14e4e5',
          },
          url: 'url2',
          method: 'GET',
        },
        {
          headers: {
            accept: 'application/json',
            'x-amz-access-token': '********',
            Host: 'sellingpartnerapi-na.amazon.com',
            'X-Amz-Date': '20211216T121633Z',
            Authorization: 'AWS4-HMAC-SHA256 Credential=AKIASXM4V7ZF66ZMNGMI/20211216/us-east-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-access-token;x-amz-date, Signature=b965e5a2035f7c621d96cc9541138d9759cf6ffb9287ad62e9d1420fcb14e4e5',
          },
          url: 'url3',
          method: 'GET',
        },
      ],
    };
    const previewData = { request: sampleWithMultipleRequests };

    expect(getRequestURL(previewData)).toBe('url3');
  });
});

describe('getDecodedURL util', () => {
  test('should return undefined incase of empty/undefined url', () => {
    expect(getDecodedURL('')).toBeUndefined();
    expect(getDecodedURL(null)).toBeUndefined();
  });
  test('should return decoded request url from a valid url by removing escape sequences', () => {
    const requestUrl1 = '/v1/labels?page=1&created_at_end=04%2F05%2F2022%2001%3A18%3A58';
    const requestUrl2 = '/v1.0/teams/12345/channels?$filter=startswith(givenName,%22P%22)';

    expect(getDecodedURL(requestUrl1)).toBe('/v1/labels?page=1&created_at_end=04/05/2022 01:18:58');
    expect(getDecodedURL(requestUrl2)).toBe('/v1.0/teams/12345/channels?$filter=startswith(givenName,"P")');
  });
});

describe('getLatestReqResData util', () => {
  test('should return undefined if there is no reqResData or reqResData is not an array', () => {
    expect(getLatestReqResData()).toBeUndefined();
    expect(getLatestReqResData(null)).toBeUndefined();
    expect(getLatestReqResData({})).toBeUndefined();
  });
  test('should return the object if the reqResData array has a single object', () => {
    const sampleResponseData = {
      name: 'raw',
      errors: null,
      data: [
        {
          headers: {
            'content-type': 'application/json',
          },
          body: '{}',
          url: 'https://sellingpartnerapi-na.amazon.com/orders/v0/orders?MarketplaceIds=ATVPDKIKX0DER&CreatedAfter=2020-01-01',
          statusCode: 200,
        },
      ],
    };
    const sampleRequestData = {
      name: 'request',
      errors: null,
      data: [
        {
          headers: {
            accept: 'application/json',
            'x-amz-access-token': '********',
            Host: 'sellingpartnerapi-na.amazon.com',
            'X-Amz-Date': '20211216T121633Z',
            Authorization: 'AWS4-HMAC-SHA256 Credential=AKIASXM4V7ZF66ZMNGMI/20211216/us-east-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-access-token;x-amz-date, Signature=b965e5a2035f7c621d96cc9541138d9759cf6ffb9287ad62e9d1420fcb14e4e5',
          },
          url: 'https://sellingpartnerapi-na.amazon.com/orders/v0/orders?MarketplaceIds=ATVPDKIKX0DER&CreatedAfter=2020-01-01',
          method: 'GET',
        },
      ],
    };

    const previewData = {
      request: sampleRequestData,
      raw: sampleResponseData,
    };

    expect(getLatestReqResData(previewData, 'request')).toBe(previewData.request.data[0]);
    expect(getLatestReqResData(previewData, 'raw')).toBe(previewData.raw.data[0]);
  });
  test('should return the last item in the reqResData array if it has more than one item', () => {
    const previewData = {
      request: {
        name: 'request',
        errors: null,
        data: [
          {
            headers: {
              accept: 'application/json',
              'x-amz-access-token': '********',
              Host: 'sellingpartnerapi-na.amazon.com',
              'X-Amz-Date': '20211216T121633Z',
              Authorization: 'AWS4-HMAC-SHA256 Credential=AKIASXM4V7ZF66ZMNGMI/20211216/us-east-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-access-token;x-amz-date, Signature=b965e5a2035f7c621d96cc9541138d9759cf6ffb9287ad62e9d1420fcb14e4e5',
            },
            url: 'url1',
            method: 'GET',
          },
          {
            headers: {
              accept: 'application/json',
              'x-amz-access-token': '********',
              Host: 'sellingpartnerapi-na.amazon.com',
              'X-Amz-Date': '20211216T121633Z',
              Authorization: 'AWS4-HMAC-SHA256 Credential=AKIASXM4V7ZF66ZMNGMI/20211216/us-east-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-access-token;x-amz-date, Signature=b965e5a2035f7c621d96cc9541138d9759cf6ffb9287ad62e9d1420fcb14e4e5',
            },
            url: 'url2',
            method: 'GET',
          },
          {
            headers: {
              accept: 'application/json',
              'x-amz-access-token': '********',
              Host: 'sellingpartnerapi-na.amazon.com',
              'X-Amz-Date': '20211216T121633Z',
              Authorization: 'AWS4-HMAC-SHA256 Credential=AKIASXM4V7ZF66ZMNGMI/20211216/us-east-1/execute-api/aws4_request, SignedHeaders=accept;host;x-amz-access-token;x-amz-date, Signature=b965e5a2035f7c621d96cc9541138d9759cf6ffb9287ad62e9d1420fcb14e4e5',
            },
            url: 'url3',
            method: 'GET',
          },
        ],
      },
    };

    expect(getLatestReqResData(previewData, 'request')).toBe(previewData.request.data[2]);
  });
});
