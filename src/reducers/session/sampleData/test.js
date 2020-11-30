/* global describe, test, expect */
import reducer, { selectors, extractStages, getResourceSampleData } from '.';
import actions from '../../../actions';

describe('sampleData reducer', () => {
  const resourceType = 'exports';
  const resourceId = '123';

  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toBe(oldState);
  });

  test('should return default state if the state is undefined', () => {
    const prevState = undefined;
    const currState = reducer(prevState, { type: 'RANDOM_ACTION'});

    expect(currState).toEqual({});
  });

  describe('REQUEST and LOOKUP_REQUEST action', () => {
    test('should update the state with status = requested', () => {
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedStateWithRequestAction = {
        123: { status: 'requested' },
        456: { status: 'received', data: {}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.sampleData.request(resourceId, resourceType)
      );

      expect(newState).toEqual(expectedStateWithRequestAction);

      const newState1 = reducer(
        newState,
        actions.sampleData.requestLookupPreview('999')
      );
      const expectedStateWithLookupAction = {
        456: { status: 'received', data: {}},
        789: { status: 'received', data: {} },
        123: { status: 'requested' },
        999: { status: 'requested' },
      };

      expect(newState1).toEqual(expectedStateWithLookupAction);
    });
  });

  describe('RECEIVED action', () => {
    test('should add the state and not throw error if state doesnt exist', () => {
      const previewData = {
        sku: 'abc',
        price: 23,
      };
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'received',
          data: {parse: previewData},
        },
      };
      const newState = reducer(
        initialState,
        actions.sampleData.received(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should update the existing state with status and data', () => {
      const previewData = {
        sku: 'abc',
        price: 23,
      };
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const stateAfterRequest = reducer(
        initialState,
        actions.sampleData.request(resourceId, resourceType)
      );
      const expectedState = {
        123: {
          status: 'received',
          data: {parse: previewData},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },

      };
      const newState = reducer(
        stateAfterRequest,
        actions.sampleData.received(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('UPDATE action', () => {
    test('should add the state and not throw error if state doesnt exist', () => {
      const processedData = {
        data: [{
          url: 'https://api.mocki.io/v1/awe',
          method: 'GET',
        }],
      };
      const stage = 'request';
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'received',
          data: {[stage]: processedData.data},
        },
      };
      const newState = reducer(
        initialState,
        actions.sampleData.update(resourceId, processedData, stage)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update the existing state with status and stage data', () => {
      const processedData = {
        data: [{
          url: 'https://api.mocki.io/v1/awe',
          method: 'GET',
        }],
      };
      const stage = 'request';
      const initialState = {
        123: {
          status: 'received',
          data: {parse: [{
            name: 'Bob',
            age: 23,
          }]},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        123: {
          status: 'received',
          data: {
            parse: [{
              name: 'Bob',
              age: 23,
            }],
            [stage]: processedData.data},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },

      };
      const newState = reducer(
        initialState,
        actions.sampleData.update(resourceId, processedData, stage)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should not throw error and update state correctly if processedData is null', () => {
      const stage = 'request';
      const initialState = {
        123: {
          status: 'received',
          data: {parse: [{
            name: 'Bob',
            age: 23,
          }]},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        123: {
          status: 'received',
          data: {
            parse: [{
              name: 'Bob',
              age: 23,
            }],
            [stage]: undefined},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },

      };
      const newState = reducer(
        initialState,
        actions.sampleData.update(resourceId, null, stage)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('RECEIVED_ERROR action', () => {
    test('should add the state with status = error and not throw error if state doesnt exist', () => {
      const error = {
        errors: [{
          code: 'invalid_json_str',
          source: 'resource',
          message: 'Invalid JSON',
        }],
      };
      const stage = 'request';
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'error',
          error: error.errors,
          data: {parse: error},
        },
      };
      const newState = reducer(
        initialState,
        actions.sampleData.receivedError(resourceId, error, stage)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should update the existing state with status = error', () => {
      const error = {
        errors: [{
          code: 'invalid_json_str',
          source: 'resource',
          message: 'Invalid JSON',
        }],
      };
      const stage = 'request';
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'requested',
        },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'error',
          error: error.errors,
          data: {parse: error},
        },
      };
      const newState = reducer(
        initialState,
        actions.sampleData.receivedError(resourceId, error, stage)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should not throw error and update state correctly if error object is null', () => {
      const stage = 'request';
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'requested',
        },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'error',
          error: undefined,
          data: {parse: null},
        },
      };
      const newState = reducer(
        initialState,
        actions.sampleData.receivedError(resourceId, null, stage)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('RESET action', () => {
    test('should empty the existing state', () => {
      const initialState = {
        123: {
          status: 'received',
          data: {parse: {name: 'Bob'}},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        123: {},
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };

      const newState = reducer(
        initialState,
        actions.sampleData.reset(resourceId)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('PATCH', () => {
    test('should add the state with the patch provided if state doesnt exist', () => {
      const patch = {
        recordSize: 25,
      };
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          recordSize: 25,
        },
      };
      const newState = reducer(
        initialState,
        actions.sampleData.patch(resourceId, patch)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should update the existing state with the  patch provided', () => {
      const patch = {
        recordSize: 25,
      };
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'received',
          data: {parse: [{
            name: 'Bob',
            age: 23,
          }],
          } },
      };

      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'received',
          data: {parse: [{
            name: 'Bob',
            age: 23,
          }],
          },
          recordSize: 25,
        },
      };
      const newState = reducer(
        initialState,
        actions.sampleData.patch(resourceId, patch)
      );

      expect(newState).toEqual(expectedState);
    });
  });
});

describe('sampleData selectors', () => {
  const resourceId = '123';

  describe('getResourceSampleDataWithStatus', () => {
    test('should return state object with undefined keys when state is empty.', () => {
      const expectedOutput = {data: undefined, error: undefined, status: undefined};

      expect(selectors.getResourceSampleDataWithStatus(undefined, resourceId)).toEqual(
        expectedOutput
      );
      expect(selectors.getResourceSampleDataWithStatus({}, resourceId)).toEqual(expectedOutput);
    });

    test('should return correct state when match is found.', () => {
      const processedData = {
        data: [{
          url: 'https://api.mocki.io/v1/awe',
          method: 'GET',
        }],
      };
      const stage = 'request';

      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };

      const expectedOutput = {data: processedData.data, error: undefined, status: 'received'};

      const newState = reducer(
        initialState,
        actions.sampleData.update(resourceId, processedData, stage)
      );

      expect(selectors.getResourceSampleDataWithStatus(newState, resourceId, stage)).toEqual(expectedOutput);
    });
  });

  describe('mkPreviewStageDataList', () => {
  });
});

describe('sampleData extractStages util function', () => {
  test('should return empty object if sample data is empty', () => {
    expect(extractStages()).toEqual({});
  });

  test('should return only parse stage map if no stage is present in sample data', () => {
    const sampleData = {
      sku: 'abc',
      price: 23,
    };
    const expectedStageMap = {
      parse: {
        sku: 'abc',
        price: 23,
      },
    };

    expect(extractStages(sampleData)).toEqual(expectedStageMap);
  });

  test('should return stage key map if stages are present in sample data', () => {
    const sampleData = {
      stages: [
        {
          name: 'parse',
          data: [{
            name: 'Bob',
            age: 23,
          }],
        },
        {
          name: 'request',
          data: [{
            url: 'https://api.mocki.io/v1/awe',
            method: 'GET',
          }],
        },
      ],

    };
    const expectedStageMap = {
      parse: [{
        name: 'Bob',
        age: 23,
      }],
      request: [{
        url: 'https://api.mocki.io/v1/awe',
        method: 'GET',
      }],
    };

    expect(extractStages(sampleData)).toEqual(expectedStageMap);
  });
});

describe('sampleData getResourceSampleData util function', () => {
  test('should return undefined if there is no resource data', () => {
    const resourceIdSampleData = {
      status: 'requested',
    };

    expect(getResourceSampleData(resourceIdSampleData, 'raw')).toEqual(undefined);
  });

  test('should return undefined if the asked stage does not exist in the state', () => {
    const resourceIdSampleData = {
      status: 'received',
      data: {parse: [{
        name: 'Bob',
        age: 23,
      }]},
    };

    expect(getResourceSampleData(resourceIdSampleData, 'raw')).toEqual(undefined);
  });

  test('should return the asked stage data from the resource state', () => {
    const resourceIdSampleData = {
      status: 'received',
      data: {
        parse: [{
          name: 'Bob',
          age: 23,
        }],
        request: [{
          url: 'https://api.mocki.io/v1/awe',
          method: 'GET',
        }],
      },
    };
    const expectedOutput = {
      name: 'Bob',
      age: 23,
    };

    expect(getResourceSampleData(resourceIdSampleData, 'parse')).toEqual(expectedOutput);
  });
});
