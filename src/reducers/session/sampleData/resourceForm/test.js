/* global describe, test, expect */
import reducer, { selectors, extractStages, getResourceSampleData } from '.';
import actions from '../../../../actions';

describe('resourceFormSampleData reducer', () => {
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

  describe('SET_STATUS action', () => {
    test('should update the state with status = requested', () => {
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedStateWithRequestAction = {
        [resourceId]: { status: 'requested' },
        456: { status: 'received', data: {}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setStatus(resourceId, 'requested')
      );

      expect(newState).toEqual(expectedStateWithRequestAction);

      const newState1 = reducer(
        newState,
        actions.resourceFormSampleData.setStatus(resourceId, 'received')
      );
      const expectedStateWithLookupAction = {
        456: { status: 'received', data: {}},
        789: { status: 'received', data: {} },
        [resourceId]: { status: 'received' },
      };

      expect(newState1).toEqual(expectedStateWithLookupAction);
    });
  });

  describe('RECEIVED_PREVIEW_STAGES action', () => {
    const previewData = {
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
    const expectedPreviewStagesData = {
      parse: [{
        name: 'Bob',
        age: 23,
      }],
      request: [{
        url: 'https://api.mocki.io/v1/awe',
        method: 'GET',
      }],
    };

    test('should add the resource state if doesn\'t exist already', () => {
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: { status: 'received', data: expectedPreviewStagesData },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update existing resource state with received status and data as preview stages', () => {
      const initialFilledState = {
        123: { status: 'received', data: {} },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: { status: 'received', data: expectedPreviewStagesData },
      };
      const newState = reducer(
        initialFilledState,
        actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('RECEIVED_PREVIEW_ERROR action', () => {
    test('should add the resource state with status = error if doesn\'t exist already', () => {
      const error = {
        errors: [{
          code: '401',
          source: 'application',
          message: "{\"error\":\"Couldn't authenticate you\"}",
        }],
        stages: [{
          name: 'request',
          data: [{
            body: 'test',
          }],
        }, {
          name: 'raw',
          data: [{
            error: "{\"error\":\"Couldn't authenticate you\"}",
          }],
        }],
      };
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
          data: {
            request: [{
              body: 'test',
            }],
            raw: [{
              error: "{\"error\":\"Couldn't authenticate you\"}",
            }],
          },
        },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should update the existing state with status = error', () => {
      const error = {
        errors: [{
          code: '401',
          source: 'application',
          message: "{\"error\":\"Couldn't authenticate you\"}",
        }],
        stages: [{
          name: 'request',
          data: [{
            body: 'test',
          }],
        }, {
          name: 'raw',
          data: [{
            error: "{\"error\":\"Couldn't authenticate you\"}",
          }],
        }],
      };
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: { status: 'requested' },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: {
          status: 'error',
          error: error.errors,
          data: {
            request: [{
              body: 'test',
            }],
            raw: [{
              error: "{\"error\":\"Couldn't authenticate you\"}",
            }],
          },
        },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should update the existing state with status = error and default parse stage, if no stages are returned', () => {
      const error = {
        errors: [{
          code: '401',
          source: 'application',
          message: "{\"error\":\"Couldn't authenticate you\"}",
        }],
        stages: null,
      };
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
          data: {
            parse: error,
          },
        },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should not throw error and update state correctly if error object is null', () => {
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
        actions.resourceFormSampleData.receivedPreviewError(resourceId, null)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('SET_PARSE_DATA action', () => {
    const initialState = {
      456: { status: 'received', data: {} },
      789: { status: 'received', data: {} },
    };
    const sampleParseData = {
      name: 'user1',
      id: '1',
    };

    test('should wrap parse data in an array and update parse stage for the passed resourceId ', () => {
      const wrappedParseData = [sampleParseData];
      const expectedState = {
        456: { status: 'received', data: { parse: wrappedParseData}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData('456', sampleParseData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should add new resource state with parse stage filled with parse data passed', () => {
      const expectedState = {
        123: { data: { parse: [sampleParseData]}},
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData(resourceId, sampleParseData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update existing resource state with parse stage filled with parse data passed', () => {
      const expectedState = {
        456: { status: 'received', data: { parse: [sampleParseData]}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData('456', sampleParseData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update parse stage as undefined if no parse data is passed ', () => {
      const expectedState = {
        456: { status: 'received', data: { parse: undefined}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData('456')
      );

      expect(newState).toEqual(expectedState);
    });
  });
  describe('SET_RAW_FILE_DATA action', () => {
    const initialState = {
      456: { status: 'received', data: { parse: { test: 5} } },
      789: { status: 'received', data: {} },
    };
    const rawJSONData = {
      id: '1',
      name: 'user1',
    };

    test('should add new resource state with raw stage filled with raw data passed', () => {
      const expectedState = {
        123: { data: { raw: rawJSONData}},
        456: { status: 'received', data: {parse: { test: 5}} },
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setRawData(resourceId, rawJSONData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update existing resource state with raw stage filled with raw data passed', () => {
      const expectedState = {
        456: { status: 'received', data: { parse: { test: 5}, raw: rawJSONData}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setRawData('456', rawJSONData)
      );

      expect(newState).toEqual(expectedState);
    });
  });
  describe('SET_PREVIEW_DATA action', () => {
    const initialState = {
      456: { status: 'received', data: { parse: { test: 5} } },
      789: { status: 'received', data: {} },
    };
    const previewData = [{
      id: '1',
      name: 'user1',
    }, {
      id: '2',
      name: 'user2',
    }, {
      id: '3',
      name: 'user3',
    }];

    test('should add new resource state with preview stage filled with preview data passed', () => {
      const expectedState = {
        123: { data: { preview: previewData}},
        456: { status: 'received', data: {parse: { test: 5}} },
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setPreviewData(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update existing resource state with preview stage filled with preview data passed', () => {
      const expectedState = {
        456: { status: 'received', data: { parse: { test: 5}, preview: previewData}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setPreviewData('456', previewData)
      );

      expect(newState).toEqual(expectedState);
    });
  });
  describe('SET_CSV_FILE_DATA action', () => {
    const initialState = {
      456: { status: 'received', data: { parse: { test: 5} } },
      789: { status: 'received', data: {} },
    };
    const sampleCsvData = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE\nC1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0\nC1000010839|Unitech|1400-900035G|1400-900035G|80.00|PA720/PA726 3.6V 3120mAH BATTERY -20C|43.53|0\nC1000010839|Magtek|21073131-NMI|21073131NMI|150.00|iDynamo 5 with NMI Encryption|89.29|0";

    test('should add new resource state with csv stage filled with csv data passed', () => {
      const expectedState = {
        123: { data: { csv: sampleCsvData}},
        456: { status: 'received', data: {parse: { test: 5}} },
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setCsvFileData(resourceId, sampleCsvData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update existing resource state with csv stage filled with csv data passed', () => {
      const expectedState = {
        456: { status: 'received', data: { parse: { test: 5}, csv: sampleCsvData}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setCsvFileData('456', sampleCsvData)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('CLEAR action', () => {
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
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };

      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.clear(resourceId)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should retain the existing state if the resourceId does not exist', () => {
      const initialState = {
        123: {
          status: 'received',
          data: {parse: {name: 'Bob'}},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };

      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.clear('INVALID_RESOURCE_ID')
      );

      expect(newState).toEqual(initialState);
    });
  });

  describe('CLEAR_STAGES action', () => {
    test('should empty the existing resource state\'s stages data', () => {
      const initialState = {
        123: {
          status: 'received',
          data: {parse: {name: 'Bob'}},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        123: { status: 'received', data: {} },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };

      const newState1 = reducer(
        initialState,
        actions.resourceFormSampleData.clearStages(resourceId)
      );

      expect(newState1).toEqual(expectedState);

      const initialReqState = {
        123: { status: 'requested' },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedReceivedState = {
        123: { status: 'received', data: {} },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const newState2 = reducer(
        initialReqState,
        actions.resourceFormSampleData.clearStages(resourceId)
      );

      expect(newState2).toEqual(expectedReceivedState);
    });
    test('should retain the existing state if the resourceId does not exist to clear data', () => {
      const initialState = {
        123: {
          status: 'received',
          data: {parse: {name: 'Bob'}},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };

      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.clearStages('INVALID_RESOURCE_ID')
      );

      expect(newState).toEqual(initialState);
    });
  });

  describe('UPDATE_RECORD_SIZE action', () => {
    test('should add the state with the recordSize provided if state doesn\'t exist', () => {
      const recordSize = 25;

      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        123: { recordSize },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.updateRecordSize(resourceId, recordSize)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should update the existing state with the recordSize provided', () => {
      const recordSize = 25;
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
          recordSize,
        },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.updateRecordSize(resourceId, recordSize)
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
      const parsedData = [{
        users: [
          {
            name: 'user1',
            id: '1',
          },
        ],
      }];
      const stage = 'parse';

      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };

      const expectedOutput = {data: parsedData, error: undefined, status: 'received'};

      const parseState = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData(resourceId, parsedData)
      );
      const receivedState = reducer(
        parseState,
        actions.resourceFormSampleData.setStatus(resourceId, 'received')
      );

      expect(selectors.getResourceSampleDataWithStatus(receivedState, resourceId, stage)).toEqual(expectedOutput);
    });
  });

  describe('mkPreviewStageDataList', () => {
    const sel = selectors.mkPreviewStageDataList();

    const initialState = {
      123: {
        status: 'received',
        data: {
          parse: [{
            name: 'Bob',
            age: 23,
          }],
          raw: [{
            url: 'https://api.mocki.io/v1/awe',
            statusCode: 200,
            body: '{"name":"Bob","age":23}',
          }],
          request: [{
            url: 'https://api.mocki.io/v1/awe',
            method: 'GET',
          }]},
      },
      456: { status: 'received', data: {} },
      789: { status: 'received', data: {} },
    };

    test('should return stage map with undefined values when state is empty', () => {
      const previewStages = ['parse', 'preview', 'raw'];
      const expectedOutput = {
        parse: {
          data: undefined,
          error: undefined,
          status: undefined,
        },
        preview: {
          data: undefined,
          error: undefined,
          status: undefined,
        },
        raw: {
          data: undefined,
          error: undefined,
          status: undefined,
        },
      };

      expect(sel(undefined, resourceId, previewStages)).toEqual(expectedOutput);
    });
    test('should return empty object if stages are not passed', () => {
      expect(sel(initialState, resourceId)).toEqual({});
    });
    test('should return correct stage data object if stages are passed', () => {
      const previewStages = ['parse', 'preview', 'raw'];
      const expectedOutput = {
        parse: {
          data: {
            name: 'Bob',
            age: 23,
          },
          error: undefined,
          status: 'received',
        },
        preview: {
          data: [{
            name: 'Bob',
            age: 23,
          }],
          error: undefined,
          status: 'received',
        },
        raw: {
          data: [{
            url: 'https://api.mocki.io/v1/awe',
            statusCode: 200,
            body: '{"name":"Bob","age":23}',
          }],
          error: undefined,
          status: 'received',
        },

      };

      expect(sel(initialState, resourceId, previewStages)).toEqual(expectedOutput);
    });
  });
});

describe('getResourceSampleDataStages', () => {
  const initialState = {
    123: {
      status: 'received',
      data: {
        parse: [{
          name: 'Bob',
          age: 23,
        }],
        raw: [{
          url: 'https://api.mocki.io/v1/awe',
          statusCode: 200,
          body: '{"name":"Bob","age":23}',
        }],
        request: [{
          url: 'https://api.mocki.io/v1/awe',
          method: 'GET',
        }]},
    },
    456: { status: 'received', data: {} },
    789: { status: 'received', data: {} },
    111: { status: 'requested'},
  };

  test('should return empty list if there is no sample data for the passed resourceId', () => {
    expect(selectors.getResourceSampleDataStages({}, '111')).toEqual([]);
    expect(selectors.getResourceSampleDataStages(initialState, '111')).toEqual([]);
    expect(selectors.getResourceSampleDataStages(initialState, '456')).toEqual([]);
  });
  test('should return correct stage data list if the state has stages corresponding to the passed resourceId', () => {
    const expectedOutput = [
      {
        name: 'parse',
        data: [{
          name: 'Bob',
          age: 23,
        }],
      },
      {
        name: 'raw',
        data: [{
          url: 'https://api.mocki.io/v1/awe',
          statusCode: 200,
          body: '{"name":"Bob","age":23}',
        }],
      },
      {
        name: 'request',
        data: [{
          url: 'https://api.mocki.io/v1/awe',
          method: 'GET',
        }],
      },
    ];

    expect(selectors.getResourceSampleDataStages(initialState, '123')).toEqual(expectedOutput);
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
        preview: {
          name: 'Bob',
          age: 23,
        },
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
    const expectedOutputForRequest = [{
      url: 'https://api.mocki.io/v1/awe',
      method: 'GET',
    }];

    expect(getResourceSampleData(resourceIdSampleData, 'parse')).toEqual(expectedOutput);
    expect(getResourceSampleData(resourceIdSampleData, 'preview')).toEqual(expectedOutput);
    expect(getResourceSampleData(resourceIdSampleData, 'request')).toEqual(expectedOutputForRequest);
  });
});
