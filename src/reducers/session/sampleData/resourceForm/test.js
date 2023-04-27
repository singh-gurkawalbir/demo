
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
  describe('UPDATE_DATA_TYPE action', () => {
    test('should update the state with status = requested', () => {
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedStateWithSendSampleDataType = {
        [resourceId]: { typeOfSampleData: 'send', preview: {} },
        456: { status: 'received', data: {}},
        789: { status: 'received', data: {} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );

      expect(newState).toEqual(expectedStateWithSendSampleDataType);

      const newState1 = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'preview')
      );
      const expectedStateWithPreviewSampleDataType = {
        456: { status: 'received', data: {}},
        789: { status: 'received', data: {} },
        [resourceId]: { typeOfSampleData: 'preview', preview: {} },
      };

      expect(newState1).toEqual(expectedStateWithPreviewSampleDataType);
    });
  });

  describe('SET_STATUS action', () => {
    test('should update the state with status = requested for preview sample data type', () => {
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedStateWithRequestAction = {
        [resourceId]: { preview: {status: 'requested'} },
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
        [resourceId]: { preview: {status: 'received'} },
      };

      expect(newState1).toEqual(expectedStateWithLookupAction);
    });
    test('should update the state with status = requested for send sample data type', () => {
      const initialState = {
        [resourceId]: {typeOfSampleData: 'send'},
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedStateWithRequestAction = {
        [resourceId]: { send: {status: 'requested'}, typeOfSampleData: 'send' },
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
        [resourceId]: { send: {status: 'received'}, typeOfSampleData: 'send' },
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

    test('should add the resource state if doesn\'t exist already for preview sample data type', () => {
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: { preview: {status: 'received', data: expectedPreviewStagesData }},
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should add the resource state if doesn\'t exist already for send sample data type', () => {
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {data: {}, typeOfSampleData: 'send'},
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: { data: {}, send: {status: 'received', data: expectedPreviewStagesData }, typeOfSampleData: 'send'},
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update existing resource state with received status and data as preview stages for preview sample data type', () => {
      const initialFilledState = {
        [resourceId]: { preview: {status: 'received', data: {}}},
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: { preview: {status: 'received', data: expectedPreviewStagesData} },
      };
      const newState = reducer(
        initialFilledState,
        actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);
    });
    test('should update existing resource state with received status and data as preview stages for send sample data type', () => {
      const initialFilledState = {
        [resourceId]: { preview: {status: 'received', data: {}}, typeOfSampleData: 'send'},
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: { send: {status: 'received', data: expectedPreviewStagesData}, typeOfSampleData: 'send', preview: {status: 'received', data: {}} },
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
        [resourceId]: {
          preview: {
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
        },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateForSendSampleDataType = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {
          typeOfSampleData: 'send',
          preview: {},
          send: {
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
        },
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );

      const newState1 = reducer(
        sendState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState1).toEqual(expectedStateForSendSampleDataType);
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
        [resourceId]: { preview: {status: 'requested'} },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {
          preview: {
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
        },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateForSendSampleDataType = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {
          preview: {status: 'requested'},
          typeOfSampleData: 'send',
          send: {
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
        },
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );
      const newState1 = reducer(
        sendState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState1).toEqual(expectedStateForSendSampleDataType);
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
        [resourceId]: {
          preview: {status: 'requested'},
        },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {
          preview: {
            status: 'error',
            error: error.errors,
            data: {
              parse: error,
            },
          },
        },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateForSendSampleDataType = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {
          preview: {status: 'requested'},
          typeOfSampleData: 'send',
          send: {
            status: 'error',
            error: error.errors,
            data: {
              parse: error,
            },
          },
        },
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );
      const newState1 = reducer(
        sendState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(newState1).toEqual(expectedStateForSendSampleDataType);
    });

    test('should not throw error and update state correctly if error object is null', () => {
      const initialState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {
          preview: {status: 'requested'},
        },
      };
      const expectedState = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {
          preview: {
            status: 'error',
            error: undefined,
            data: {parse: null},
          },
        },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, null)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateForSendSampleDataType = {
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        [resourceId]: {
          preview: {status: 'requested'},
          send: {
            status: 'error',
            error: undefined,
            data: {parse: null},
          },
          typeOfSampleData: 'send',
        },
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );
      const newState1 = reducer(
        sendState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, null)
      );

      expect(newState1).toEqual(expectedStateForSendSampleDataType);
    });
  });

  describe('SET_PARSE_DATA action', () => {
    const initialState = {
      456: { preview: {status: 'received', data: {}} },
      789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
    };
    const sampleParseData = {
      name: 'user1',
      id: '1',
    };

    test('should wrap parse data in an array and update parse stage for the passed resourceId for send and preview sample data types', () => {
      const wrappedParseData = [sampleParseData];
      const expectedState = {
        456: { preview: {status: 'received', data: { parse: wrappedParseData}}},
        789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData('456', sampleParseData)
      );

      expect(newState).toEqual(expectedState);

      const expectedState1 = {
        456: { preview: {status: 'received', data: {}} },
        789: { send: {status: 'received', data: { parse: wrappedParseData}}, typeOfSampleData: 'send' },
      };
      const newState1 = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData('789', sampleParseData)
      );

      expect(newState1).toEqual(expectedState1);
    });
    test('should add new resource state with parse stage filled with parse data passed for send and preview sample data types', () => {
      const expectedState = {
        [resourceId]: { preview: {data: { parse: [sampleParseData]}}},
        ...initialState,
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData(resourceId, sampleParseData)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateSend = {
        [resourceId]: { preview: {}, send: {data: { parse: [sampleParseData]}}, typeOfSampleData: 'send'},
        ...initialState,
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );
      const newStateSend = reducer(
        sendState,
        actions.resourceFormSampleData.setParseData(resourceId, sampleParseData)
      );

      expect(newStateSend).toEqual(expectedStateSend);
    });
    test('should update parse stage as undefined if no parse data is passed', () => {
      const expectedState = {
        456: { preview: {status: 'received', data: { parse: undefined}}},
        ...initialState,
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setParseData('456')
      );

      expect(newState).toEqual(expectedState);

      const expectedStateSend = {
        456: {
          preview: {status: 'received', data: {}},
          send: {data: { parse: undefined }},
          typeOfSampleData: 'send',
        },
        789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType('456', 'send')
      );
      const newStateSend = reducer(
        sendState,
        actions.resourceFormSampleData.setParseData('456')
      );

      expect(newStateSend).toEqual(expectedStateSend);
    });
  });
  describe('SET_RAW_FILE_DATA action', () => {
    const initialState = {
      456: { preview: {status: 'received', data: {}} },
      789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
    };
    const rawJSONData = {
      id: '1',
      name: 'user1',
    };

    test('should add new resource state with raw stage filled with raw data passed for send and preview sample data types', () => {
      const expectedState = {
        [resourceId]: { preview: {data: { raw: rawJSONData}}},
        ...initialState,
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setRawData(resourceId, rawJSONData)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateSend = {
        [resourceId]: { preview: {}, send: {data: { raw: rawJSONData}}, typeOfSampleData: 'send'},
        ...initialState,
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );

      const newStateSend = reducer(
        sendState,
        actions.resourceFormSampleData.setRawData(resourceId, rawJSONData)
      );

      expect(newStateSend).toEqual(expectedStateSend);
    });
    test('should update existing resource state with raw stage filled with raw data passed for send and preview sample data types', () => {
      const expectedState = {
        456: { preview: {status: 'received',
          data: {raw: {
            id: '1',
            name: 'user1',
          }}} },
        789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setRawData('456', rawJSONData)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateSend = {
        456: { preview: {status: 'received', data: {}} },
        789: { send: {status: 'received',
          data: {raw: {
            id: '1',
            name: 'user1',
          }}},
        typeOfSampleData: 'send' },
      };
      const newStateSend = reducer(
        initialState,
        actions.resourceFormSampleData.setRawData('789', rawJSONData)
      );

      expect(newStateSend).toEqual(expectedStateSend);
    });
  });
  describe('SET_PREVIEW_DATA action', () => {
    const initialState = {
      456: { preview: {status: 'received', data: {}} },
      789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
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

    test('should add new resource state with preview stage filled with preview data passed for send and preview sample data types', () => {
      const expectedState = {
        [resourceId]: { preview: {data: { preview: previewData}}},
        ...initialState,
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setPreviewData(resourceId, previewData)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateSend = {
        [resourceId]: { preview: {}, send: {data: { preview: previewData}}, typeOfSampleData: 'send'},
        ...initialState,
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );
      const newStateSend = reducer(
        sendState,
        actions.resourceFormSampleData.setPreviewData(resourceId, previewData)
      );

      expect(newStateSend).toEqual(expectedStateSend);
    });
    test('should update existing resource state with preview stage filled with preview data passed for send and preview sample data types', () => {
      const expectedState = {
        456: { preview: {status: 'received', data: { preview: previewData}} },
        789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setPreviewData('456', previewData)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateSend = {
        456: { preview: {status: 'received', data: {}} },
        789: { send: {status: 'received', data: { preview: previewData}}, typeOfSampleData: 'send' },
      };
      const newStateSend = reducer(
        initialState,
        actions.resourceFormSampleData.setPreviewData('789', previewData)
      );

      expect(newStateSend).toEqual(expectedStateSend);
    });
  });
  describe('SET_CSV_FILE_DATA action', () => {
    const initialState = {
      456: { preview: {status: 'received', data: { parse: { test: 5} }} },
      789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
    };
    const sampleCsvData = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE\nC1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0\nC1000010839|Unitech|1400-900035G|1400-900035G|80.00|PA720/PA726 3.6V 3120mAH BATTERY -20C|43.53|0\nC1000010839|Magtek|21073131-NMI|21073131NMI|150.00|iDynamo 5 with NMI Encryption|89.29|0";

    test('should add new resource state with csv stage filled with csv data passed', () => {
      const expectedState = {
        [resourceId]: { preview: {data: { csv: sampleCsvData}}},
        ...initialState,
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setCsvFileData(resourceId, sampleCsvData)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateSend = {
        [resourceId]: { preview: {}, typeOfSampleData: 'send', send: {data: { csv: sampleCsvData}}},
        ...initialState,
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );
      const newStateSend = reducer(
        sendState,
        actions.resourceFormSampleData.setCsvFileData(resourceId, sampleCsvData)
      );

      expect(newStateSend).toEqual(expectedStateSend);
    });
    test('should update existing resource state with csv stage filled with csv data passed for send and preview sample data types', () => {
      const expectedState = {
        456: { preview: {status: 'received', data: { parse: { test: 5}, csv: sampleCsvData } } },
        789: { send: {status: 'received', data: {}}, typeOfSampleData: 'send' },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.setCsvFileData('456', sampleCsvData)
      );

      expect(newState).toEqual(expectedState);

      const expectedStateSend = {
        456: { preview: {status: 'received', data: { parse: { test: 5} }} },
        789: { send: {status: 'received', data: {csv: sampleCsvData}}, typeOfSampleData: 'send' },
      };
      const newStateSend = reducer(
        initialState,
        actions.resourceFormSampleData.setCsvFileData('789', sampleCsvData)
      );

      expect(newStateSend).toEqual(expectedStateSend);
    });
  });

  describe('CLEAR action', () => {
    test('should empty the existing state', () => {
      const initialState = {
        [resourceId]: {
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
        [resourceId]: {
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
    test('should empty the existing resource state\'s stages data for current sample data type', () => {
      const initialState = {
        [resourceId]: {
          preview: {
            status: 'received',
            data: {parse: {name: 'Bob'}},
          },
          send: {
            status: 'received',
            data: {parse: {name: 'Bob'}},
          },
        },
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
      };
      const expectedState = {
        [resourceId]: {
          preview: {status: 'received', data: {}},
          send: {
            status: 'received',
            data: {parse: {name: 'Bob'}},
          } },
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
      };

      const newState1 = reducer(
        initialState,
        actions.resourceFormSampleData.clearStages(resourceId)
      );

      expect(newState1).toEqual(expectedState);

      const newState2 = reducer(
        {
          ...initialState,
          [resourceId]: {
            preview: {
              status: 'received',
              data: {parse: {name: 'Bob'}},
            },
            send: {
              status: 'received',
              data: {parse: {name: 'Bob'}},
            },
            typeOfSampleData: 'send',
          },
        },
        actions.resourceFormSampleData.clearStages(resourceId)
      );
      const expectedState2 = {
        [resourceId]: {
          preview: {
            status: 'received',
            data: {parse: {name: 'Bob'}},
          },
          send: {
            status: 'received',
            data: {},
          },
          typeOfSampleData: 'send',
        },
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
      };

      expect(newState2).toEqual(expectedState2);

      const initialReqState = {
        [resourceId]: { preview: {status: 'requested'} },
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
      };
      const expectedReceivedState = {
        [resourceId]: { preview: {status: 'received', data: {}} },
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
      };
      const newState3 = reducer(
        initialReqState,
        actions.resourceFormSampleData.clearStages(resourceId)
      );

      expect(newState3).toEqual(expectedReceivedState);
    });
    test('should retain the existing state if the resourceId does not exist to clear data', () => {
      const initialState = {
        [resourceId]: {
          status: 'received',
          data: {parse: {name: 'Bob'}},
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };

      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.clearStages()
      );

      expect(newState).toEqual(initialState);
    });
  });

  describe('UPDATE_RECORD_SIZE action', () => {
    test('should add the state with the recordSize provided if state doesn\'t exist for send and preview sample data types', () => {
      const recordSize = 25;

      const initialState = {
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
      };
      const expectedState = {
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
        [resourceId]: { preview: {recordSize} },
      };
      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.updateRecordSize(resourceId, recordSize)
      );

      expect(newState).toEqual(expectedState);

      const expectedState1 = {
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
        [resourceId]: { preview: {}, send: {recordSize}, typeOfSampleData: 'send' },
      };
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );
      const newState1 = reducer(
        sendState,
        actions.resourceFormSampleData.updateRecordSize(resourceId, recordSize)
      );

      expect(newState1).toEqual(expectedState1);
    });

    test('should update the existing state with the recordSize provided', () => {
      const recordSize = 25;
      const initialState = {
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
        [resourceId]: {
          preview: {
            status: 'received',
            data: {parse: [{
              name: 'Bob',
              age: 23,
            }],
            },
          },
        },
      };

      const expectedState = {
        456: { preview: {status: 'received', data: {} } },
        789: { preview: {status: 'received', data: {} }},
        [resourceId]: {
          preview: {
            status: 'received',
            data: {parse: [{
              name: 'Bob',
              age: 23,
            }],
            },
            recordSize,
          },
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

  describe('typeOfSampleData selector', () => {
    test('should return default sample data type for invalid arguments', () => {
      expect(selectors.typeOfSampleData()).toBe('preview');
      expect(selectors.typeOfSampleData({}, 123)).toBe('preview');
      expect(selectors.typeOfSampleData({123: {data: '123'}}, 123)).toBe('preview');
    });
    test('should return correct sample data type for send sample data type', () => {
      const state = reducer({}, actions.resourceFormSampleData.updateType(resourceId, 'send'));

      expect(selectors.typeOfSampleData(state, resourceId)).toBe('send');
    });
    test('should return correct sample data type for preview sample data type', () => {
      const state = reducer({}, actions.resourceFormSampleData.updateType(resourceId, 'preview'));

      expect(selectors.typeOfSampleData(state, resourceId)).toBe('preview');
    });
  });
  describe('getResourceSampleDataWithStatus', () => {
    test('should return state object with undefined keys when state is empty.', () => {
      const expectedOutput = {data: undefined, error: undefined, status: undefined};

      expect(selectors.getResourceSampleDataWithStatus(undefined, resourceId)).toEqual(
        expectedOutput
      );
      expect(selectors.getResourceSampleDataWithStatus({}, resourceId)).toEqual(expectedOutput);
    });

    test('should return correct state when match is found for preview sample data type', () => {
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
        456: { preview: {status: 'received', data: {}} },
        789: { preview: {status: 'received', data: {}} },
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
    test('should return correct state when match is found for send sample data type', () => {
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
        456: { preview: {status: 'received', data: {}} },
        789: { preview: {status: 'received', data: {}} },
      };

      const expectedOutput = {data: parsedData, error: undefined, status: 'received'};
      const sendState = reducer(
        initialState,
        actions.resourceFormSampleData.updateType(resourceId, 'send')
      );
      const parseState = reducer(
        sendState,
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
      [resourceId]: {
        preview: {
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
    test('should return correct stage data object if stages are passed for preview sample data type', () => {
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
    test('should return correct stage data object if stages are passed for send sample data type', () => {
      const initialSendState = {
        [resourceId]: {
          typeOfSampleData: 'send',
          send: {
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
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
      };
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

      expect(sel(initialSendState, resourceId, previewStages)).toEqual(expectedOutput);
    });
  });

  describe('sampleDataError', () => {
    test('should return undefined incase of invalid args', () => {
      expect(selectors.sampleDataError()).toBeUndefined();
      expect(selectors.sampleDataError({}, 123)).toBeUndefined();
      expect(selectors.sampleDataError({123: {data: '123'}}, 123)).toBeUndefined();
    });
    test('should return undefined if the resource has no error for preview', () => {
      const state = {
        123: {
          preview: {
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
        },
        456: { preview: { status: 'received', data: {} } },
        789: { preview: { status: 'received', data: {} } },
        111: { preview: { status: 'requested'} },
      };

      expect(selectors.sampleDataError(state, 123)).toBeUndefined();
      expect(selectors.sampleDataError(state, 456)).toBeUndefined();
      expect(selectors.sampleDataError(state, 111)).toBeUndefined();
    });
    test('should return error when the resource has preview error', () => {
      const error = [{
        classification: 'value',
        code: 'cannot_evaluate_static_lookup',
        message: 'Cannot evaluate the static lookup: "lookupName" using searchKey: "test".',
        occurredAt: 1671780841390,
        resolved: false,
        source: 'application',
      }];
      const state = {
        123: {
          preview: {
            status: 'error',
            error,
            data: {
              request: [{
                url: 'https://api.mocki.io/v1/awe',
                method: 'GET',
              }],
            },
          },
        },
      };

      expect(selectors.sampleDataError(state, 123)).toEqual(error);
    });
  });
  describe('getAllParsableErrors', () => {
    test('should return all parsable errors when there are no stages in the response, this scenario occurs when IO errors out', () => {
      const error = {
        errors: [{field: 'http', code: 'missing_required_field', message: 'http subschema not defined'}],
        stages: null,
      };
      const initialState = {
        [resourceId]: { preview: {status: 'requested'} },
      };

      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(selectors.getAllParsableErrors(newState, resourceId))
        .toEqual([{field: 'http', code: 'missing_required_field', message: 'http subschema not defined'}]);
    });
    test('should return errors when there are errors with request but no response returned from the connection', () => {
      const previewError = {
        errors: [{
          classification: 'value',
          code: 'cannot_evaluate_static_lookup',
          message: 'Cannot evaluate the static lookup: "lookupName" using searchKey: "test".',
          occurredAt: 1671780841390,
          resolved: false,
          source: 'application',
        }],

        stages: [{
          name: 'request',
          data: [{
            body: { name: 'test', email: 'test', Name: '' },
            headers: { 'content-type': 'application/json', accept: 'application/json'},
            method: 'POST',
            url: 'http://demo0822471.mockable.io/abcd',
          }],
        }],
      };

      const initialState = {
        [resourceId]: { preview: {status: 'requested'} },
      };

      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, previewError)
      );

      expect(selectors.getAllParsableErrors(newState, resourceId)).toEqual(previewError.errors);
    });
    test('should return errors when there are errors even though all stages are given', () => {
      const previewError = {
        errors: [{
          classification: 'value',
          code: 'cannot_evaluate_static_lookup',
          message: 'Cannot evaluate the static lookup: "lookupName" using searchKey: "test".',
          occurredAt: 1671780841390,
          resolved: false,
          source: 'application',
        }],

        stages: [{
          name: 'request',
          data: [{
            body: { name: 'test', email: 'test', Name: '' },
            headers: { 'content-type': 'application/json', accept: 'application/json'},
            method: 'POST',
            url: 'http://demo0822471.mockable.io/abcd',
          }],
        },
        {
          name: 'raw',
          data: [{
            body: { name: 'test', email: 'test', Name: '' },
            headers: { 'content-type': 'application/json', accept: 'application/json'},
            method: 'POST',
            url: 'http://demo0822471.mockable.io/abcd',
          }],
        }, {
          name: 'parse',
          data: [{
            body: { name: 'test', email: 'test', Name: '' },
            headers: { 'content-type': 'application/json', accept: 'application/json'},
            method: 'POST',
            url: 'http://demo0822471.mockable.io/abcd',
          }],
        }],
      };

      const initialState = {
        [resourceId]: { preview: {status: 'requested'} },
      };

      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, previewError)
      );

      expect(selectors.getAllParsableErrors(newState, resourceId)).toEqual(previewError.errors);
    });

    test('should return no errors when there are stages in the response, this scenario occurs when the endpoint errors out', () => {
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
        [resourceId]: { status: 'requested' },
      };

      const newState = reducer(
        initialState,
        actions.resourceFormSampleData.receivedPreviewError(resourceId, error)
      );

      expect(selectors.getAllParsableErrors(newState, '[resourceId]')).toBeUndefined();
    });
  });
  describe('getResourceSampleDataStages', () => {
    const initialState = {
      123: {
        preview: {
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
      },
      456: { preview: { status: 'received', data: {} } },
      789: { preview: { status: 'received', data: {} } },
      111: { preview: { status: 'requested'} },
    };

    test('should return empty list if there is no sample data for the passed resourceId', () => {
      expect(selectors.getResourceSampleDataStages({}, '111')).toEqual([]);
      expect(selectors.getResourceSampleDataStages(initialState, '111')).toEqual([]);
      expect(selectors.getResourceSampleDataStages(initialState, '456')).toEqual([]);
    });
    test('should return correct stage data list if the state has stages corresponding to the passed resourceId for preview sample data type', () => {
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
    test('should return correct stage data list if the state has stages corresponding to the passed resourceId for send sample data type', () => {
      const initialSendState = {
        123: {
          typeOfSampleData: 'send',
          send: {
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
        },
        456: { status: 'received', data: {} },
        789: { status: 'received', data: {} },
        111: { status: 'requested'},
      };
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

      expect(selectors.getResourceSampleDataStages(initialSendState, '123')).toEqual(expectedOutput);
    });
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

    expect(getResourceSampleData(resourceIdSampleData, 'raw')).toBeUndefined();
  });

  test('should return undefined if the asked stage does not exist in the state', () => {
    const resourceIdSampleData = {
      status: 'received',
      data: {parse: [{
        name: 'Bob',
        age: 23,
      }]},
    };

    expect(getResourceSampleData(resourceIdSampleData, 'raw')).toBeUndefined();
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

  test('should return the group stage data from the resource state when requested for parse stage and group stage is available', () => {
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
        group: [
          [{
            name: 'Bob',
            age: 23,
          }],
        ],
        request: [{
          url: 'https://api.mocki.io/v1/awe',
          method: 'GET',
        }],
      },
    };
    const expectedOutput = [{
      name: 'Bob',
      age: 23,
    }];
    const expectedOutputForpreview = {
      name: 'Bob',
      age: 23,
    };
    const expectedOutputForRequest = [{
      url: 'https://api.mocki.io/v1/awe',
      method: 'GET',
    }];

    expect(getResourceSampleData(resourceIdSampleData, 'parse')).toEqual(expectedOutput);
    expect(getResourceSampleData(resourceIdSampleData, 'preview')).toEqual(expectedOutputForpreview);
    expect(getResourceSampleData(resourceIdSampleData, 'request')).toEqual(expectedOutputForRequest);
  });
});
