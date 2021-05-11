/* global describe, test, expect */
import reducer, { selectors } from '.';
import actionTypes from '../../../../actions/types';
import { getMockHttpErrorDoc } from '../../../../utils/errorManagement';

const defaultState = {};

const reqAndResKey = 'key-123';

const mockResponse = getMockHttpErrorDoc();

describe('errorHttpDoc in EM2.0 reducers', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = defaultState;
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });
  describe('ERROR_HTTP_DOC.REQUEST action', () => {
    test('should create new state if the passed reqAndResKey\'s does not exists and update status as requested', () => {
      const currState = reducer(defaultState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, reqAndResKey });
      const expectedState = {
        [reqAndResKey]: {
          status: 'requested',
        },
      };

      expect(currState).toEqual(expectedState);
    });

    test('should update status as requested for the passed reqAndResKey state if already exists', () => {
      const prevState = {
        [reqAndResKey]: {
          status: 'received',
          data: {},
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, reqAndResKey });
      const expectedState = {
        [reqAndResKey]: {
          status: 'requested',
          data: {},
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('ERROR_HTTP_DOC.RECEIVED action', () => {
    test('should retain previous state if the passed reqAndResKey does exist ', () => {
      const prevState = {
        [reqAndResKey]: {
          status: 'received',
          data: mockResponse,
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.RECEIVED, reqAndResKey: 'key-456' });

      expect(currState).toBe(prevState);
    });
    test('should update status to received and data as passed http doc ', () => {
      const prevState = {
        [reqAndResKey]: {
          status: 'received',
          data: { request: {}, response: {}},
        },
      };
      const reqState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, reqAndResKey: 'key-456' });
      const currState = reducer(reqState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.RECEIVED, reqAndResKey: 'key-456', errorHttpDoc: mockResponse });

      const expectedState = {
        ...prevState,
        'key-456': {
          status: 'received',
          data: mockResponse,
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should update data as undefined when there is no http doc passed', () => {
      const prevState = {
        [reqAndResKey]: {
          status: 'received',
          data: mockResponse,
        },
      };
      const reqState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, reqAndResKey: 'key-456' });
      const currState = reducer(reqState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.RECEIVED, reqAndResKey: 'key-456' });

      const expectedState = {
        ...prevState,
        'key-456': {
          status: 'received',
          data: undefined,
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
  describe('ERROR_HTTP_DOC.ERROR action', () => {
    test('should retain previous state if the passed reqAndResKey does exist ', () => {
      const prevState = {
        [reqAndResKey]: {
          status: 'received',
          data: mockResponse,
        },
      };
      const currState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.ERROR, reqAndResKey: 'key-456' });

      expect(currState).toBe(prevState);
    });
    test('should update status to error and update error ', () => {
      const prevState = {
        [reqAndResKey]: {
          status: 'received',
          data: { request: {}, response: {}},
        },
      };
      const error = { message: 's3 key expired' };
      const reqState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, reqAndResKey: 'key-456' });
      const currState = reducer(reqState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.ERROR, reqAndResKey: 'key-456', error });

      const expectedState = {
        ...prevState,
        'key-456': {
          status: 'error',
          error,
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should update status to error and update error by retaining any data if exist before for that reqAndResKey ', () => {
      const prevState = {
        [reqAndResKey]: {
          status: 'received',
          data: { request: {}, response: {}},
        },
      };
      const error = { message: 's3 key expired' };
      const reqState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, reqAndResKey });
      const currState = reducer(reqState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.ERROR, reqAndResKey, error });

      const expectedState = {
        [reqAndResKey]: {
          status: 'error',
          data: { request: {}, response: {}},
          error,
        },
      };

      expect(currState).toEqual(expectedState);
    });
    test('should update error prop as undefined when there is no error passed', () => {
      const prevState = {
        [reqAndResKey]: {
          status: 'received',
          data: mockResponse,
        },
      };
      const reqState = reducer(prevState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.REQUEST, reqAndResKey: 'key-456' });
      const currState = reducer(reqState, { type: actionTypes.ERROR_MANAGER.ERROR_HTTP_DOC.ERROR, reqAndResKey: 'key-456' });

      const expectedState = {
        ...prevState,
        'key-456': {
          status: 'error',
          error: undefined,
        },
      };

      expect(currState).toEqual(expectedState);
    });
  });
});

describe('errorHttpDoc selectors', () => {
  const sampleState = {
    [reqAndResKey]: {
      status: 'received',
      data: mockResponse,
    },
  };

  describe('errorHttpDocStatus selector', () => {
    test('should return undefined incase of invalid props/state/reqAndResKey', () => {
      expect(selectors.errorHttpDocStatus()).toBeUndefined();
      expect(selectors.errorHttpDocStatus(null)).toBeUndefined();
      expect(selectors.errorHttpDocStatus(sampleState, 'key-000')).toBeUndefined();
    });
    test('should return the status for the passed reqAndResKey in the state', () => {
      const sampleReqState = {
        [reqAndResKey]: {
          status: 'requested',
        },
      };
      const sampleErrState = {
        [reqAndResKey]: {
          status: 'error',
          error: { message: 's3 key is expired'},
        },
      };

      expect(selectors.errorHttpDocStatus(sampleReqState, reqAndResKey)).toBe('requested');
      expect(selectors.errorHttpDocStatus(sampleState, reqAndResKey)).toBe('received');
      expect(selectors.errorHttpDocStatus(sampleErrState, reqAndResKey)).toBe('error');
    });
  });
  describe('errorHttpDoc selector', () => {
    test('should return undefined incase of invalid props/state/reqAndResKey', () => {
      expect(selectors.errorHttpDoc()).toBeUndefined();
      expect(selectors.errorHttpDoc(null)).toBeUndefined();
      expect(selectors.errorHttpDoc(sampleState, 'key-000')).toBeUndefined();
    });
    test('should return the request data for the passed reqAndResKey in the state if isRequest is true', () => {
      expect(selectors.errorHttpDoc(sampleState, reqAndResKey, true)).toBe(mockResponse.request);
    });
    test('should return the response data for the passed reqAndResKey in the state if isRequest is false', () => {
      expect(selectors.errorHttpDoc(sampleState, reqAndResKey)).toBe(mockResponse.response);
    });
  });
  describe('errorHttpDocError selector', () => {
    const sampleErrState = {
      [reqAndResKey]: {
        status: 'error',
        error: { message: 's3 key is expired'},
      },
    };

    test('should return undefined incase of invalid props/state/reqAndResKey', () => {
      expect(selectors.errorHttpDocError()).toBeUndefined();
      expect(selectors.errorHttpDocError(null)).toBeUndefined();
      expect(selectors.errorHttpDocError(sampleState, 'key-000')).toBeUndefined();
    });
    test('should return the error for the passed reqAndResKey in the state', () => {
      expect(selectors.errorHttpDoc(sampleErrState, reqAndResKey)).toBe(sampleErrState.error);
    });
  });
  describe('s3HttpBlobKey selector', () => {
    const mockResponse2 = {
      request: {
        body: { test: 5, body: {test: 'blob-1234'} },
        others: { status: 200 },
      },
      response: {
        body: { test: 5 },
        others: { status: 200 },
        bodyKey: 'blob-1234',
      },
    };
    const sampleState2 = {
      [reqAndResKey]: {
        status: 'received',
        data: mockResponse2,
      },
    };

    test('should return undefined incase of invalid props/state/reqAndResKey', () => {
      expect(selectors.s3HttpBlobKey()).toBeUndefined();
      expect(selectors.s3HttpBlobKey(null)).toBeUndefined();
      expect(selectors.s3HttpBlobKey(sampleState, 'key-000')).toBeUndefined();
    });
    test('should return the bodyKey if exists for the passed reqAndResKey for both request and response based on isRequest prop in the state', () => {
      expect(selectors.s3HttpBlobKey(sampleState, reqAndResKey, true)).toBe(mockResponse.request.bodyKey);
      expect(selectors.s3HttpBlobKey(sampleState, reqAndResKey, false)).toBeUndefined();
      expect(selectors.s3HttpBlobKey(sampleState2, reqAndResKey, true)).toBeUndefined();
      expect(selectors.s3HttpBlobKey(sampleState2, reqAndResKey, false)).toBe(mockResponse2.response.bodyKey);
    });
  });
});

