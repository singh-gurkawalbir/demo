/* global describe, test, expect, jest */
import { api } from './';
import * as apiConsts from './apiPaths';

describe('async api tests ', () => {
  // TODO: is setting the node env here okay?
  // checked it doesnt pollute the application after the tests have run
  // check with Dave
  process.env.NODE_ENV = `development`;
  const protocol = 'someProtocol:';
  const host = 'someHost';

  window.sessionStorage = {};

  const respBody = { a: 1, b: 3 };
  const _400Resp = {
    status: 405,
    headers: new Map([['content-type', 'application/json; charset=utf-8']]),
    json: () => respBody,
  };
  const _200Resp = {
    status: 200,
    headers: new Map([['content-type', 'application/json; charset=utf-8']]),
    json: () => respBody,
  };
  const _204Resp = {
    status: 204,
  };
  const _500Resp = {
    status: 505,
    headers: new Map([['content-type', 'application/text; charset=utf-8']]),
    text: () => respBody,
  };
  const sessionExpiredResp = {
    status: 200,
    url: `${protocol}//${host}/signin`,
  };

  test('should throw an exception when the user gets a 400 level response status and the response should go into the exception body', async () => {
    window.fetch = jest.fn().mockImplementationOnce(() => _400Resp);
    window.sessionStorage.getItem = jest.fn().mockImplementationOnce(() => {});

    try {
      await api('/someapi');
      // should not enter here

      expect(true).toBe(false);
    } catch (e) {
      expect(e).toEqual({
        status: _400Resp.status,
        message: respBody,
      });
    }
  });

  test('should throw an exception when the user gets a 500 level response status and the response should go into the exception body', async () => {
    window.fetch = jest.fn().mockImplementationOnce(() => _500Resp);
    // toThrow only verifies the type of exception not the exception content

    try {
      await api('/someapi');
      // should not enter here

      expect(true).toBe(false);
    } catch (e) {
      expect(e).toEqual({
        status: _500Resp.status,
        message: respBody,
      });
    }
  });
  test('should throw a unauthorized exception when the session expires', async () => {
    apiConsts.getHostAndProtocol = jest.fn().mockImplementation(() => ({
      host,
      protocol,
    }));

    window.fetch = jest.fn().mockImplementationOnce(() => sessionExpiredResp);
    window.sessionStorage.getItem = jest.fn().mockImplementationOnce(() => {});

    try {
      await api('/someapi');
      // should not enter here
      expect(true).toBe(false);
    } catch (e) {
      expect(e).toEqual({
        status: 401,
        message: 'Session Expired',
      });
    }
  });

  test('should give the response back to the calle for an ok response ', async () => {
    // TODO:Unable to mock the location host protocol
    window.fetch = jest.fn().mockImplementationOnce(() => _200Resp);
    window.sessionStorage.getItem = jest.fn().mockImplementationOnce(() => {});

    const resp = await api('/someapi');

    expect(resp).toEqual(_200Resp.json());
  });

  test('should not resolve .json() for a 204 response in the response and return null to the calle  ', async () => {
    // TODO:Unable to mock the location host protocol
    window.fetch = jest.fn().mockImplementationOnce(() => _204Resp);

    const resp = await api('/someapi');

    expect(resp).toEqual(null);
  });
});
