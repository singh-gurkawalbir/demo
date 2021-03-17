/* global expect, describe, test */
import { getContentType, getHttpReqResFields } from '.';

describe('getHttpReqResFields util', () => {
  test('should return empty object in case of null/undefined httpPayload', () => {
    expect(getHttpReqResFields()).toEqual({});
    expect(getHttpReqResFields(null)).toEqual({});
  });
  test('should return undefined body with headers and all other fields as others in case of httpPayload without body', () => {
    const httpPayload = {
      headers: { 'content-type': 'application/json' },
      status: 200,
      url: 'https://www.mockurl.com/api/v2/users',
    };
    const expectedHttpFields = {
      body: undefined,
      headers: { 'content-type': 'application/json' },
      others: {
        status: 200,
        url: 'https://www.mockurl.com/api/v2/users',
      },
    };

    expect(getHttpReqResFields(httpPayload)).toEqual(expectedHttpFields);
  });
  test('should return with body, headers and all other properties from httpPayload included in others ', () => {
    const httpPayloadWithBody = {
      body: { test: 5},
      headers: { 'content-type': 'application/json' },
      status: 200,
      url: 'https://www.mockurl.com/api/v2/users',
    };
    const expectedHttpFields = {
      body: { test: 5},
      headers: { 'content-type': 'application/json' },
      others: {
        status: 200,
        url: 'https://www.mockurl.com/api/v2/users',
      },
    };

    expect(getHttpReqResFields(httpPayloadWithBody)).toEqual(expectedHttpFields);
  });
  test('should exclude URL from the others if the variant is previewPanel', () => {
    const httpPayloadWithBody = {
      body: '{"test":5}',
      headers: { 'content-type': 'application/json' },
      status: 200,
      url: 'https://www.mockurl.com/api/v2/users',
    };
    const expectedHttpPreviewPanelFields = {
      body: '{"test":5}',
      headers: { 'content-type': 'application/json' },
      others: {
        status: 200,
      },
    };

    expect(getHttpReqResFields(httpPayloadWithBody, 'previewPanel')).toEqual(expectedHttpPreviewPanelFields);
  });
});

describe('getContentType util', () => {
  test('should return json incase of invalid httpPayload', () => {
    expect(getContentType()).toBe('json');
    expect(getContentType(null)).toBe('json');
    expect(getContentType({})).toBe('json');
  });
  test('should return json if the body is stringified JSON irrespective of the content type in the headers', () => {
    const httpPayload = {
      body: '{"test":5}',
      headers: { 'content-type': 'application/xml' },
      status: 200,
      url: 'https://www.mockurl.com/api/v2/users',
    };

    expect(getContentType(httpPayload)).toBe('json');
  });
  test('should return json/xml/csv depending on the content type in the headers as application/json, application/xml, application/csv respectively', () => {
    const httpXmlPayload = {
      headers: { 'content-type': 'application/xml' },
      status: 200,
      url: 'https://www.mockurl.com/api/v2/users',
    };
    const httpJsonPayload = {
      headers: { 'content-type': 'application/json' },
      status: 200,
      url: 'https://www.mockurl.com/api/v2/users',
    };
    const httpCsvPayload = {
      headers: { 'content-type': 'application/csv' },
      status: 200,
      url: 'https://www.mockurl.com/api/v2/users',
    };

    expect(getContentType(httpXmlPayload)).toBe('xml');
    expect(getContentType(httpCsvPayload)).toBe('csv');
    expect(getContentType(httpJsonPayload)).toBe('json');
  });
});

