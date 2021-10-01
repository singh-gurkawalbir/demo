/* global describe, expect, test */
import reducer, { selectors } from '.';
import actions from '../actions';

describe('Mappings region selector testcases', () => {
  const flows = [
    {
      _id: 1,
      name: 'testing1',
      pageProcessors: [
        { _importId: 1},
        { _importId: 2},
        { _importId: 3},
      ],
    },
    {
      _id: 2,
      name: 'testing2',
      pageProcessors: [
        { _importId: 6},
        { _importId: 7},
      ],
    },
    {
      _id: 3,
      name: 'testing3',
      pageProcessors: [
        { _importId: 10},
        { _importId: 11},
      ],
    },
    {
      _id: 4,
      name: 'testing4',
      pageProcessors: [
        { _importId: 12},
      ],
    },
    {
      _id: '5',
      name: 'testing4',
      pageProcessorsMap: {
        12: {
          preMap: {
            data: {
              column1: 123,
              column2: 1234,
              column3: 1,
            },
          },
        },
      },
    },
    {
      _id: 6,
    },
    {
      _id: 7,
      name: 'testing4',
      pageProcessors: [
        { _importId: 22, type: 'import'},
      ],
    },
    {
      _id: 8,
      name: 'flowwithonlyimport',
      pageProcessors: [
        { _importId: 15, type: 'import'},
      ],
    },
    {
      _id: 9,
      name: 'testing4',
      pageProcessors: [
        { _exportId: 12, type: 'export'},
      ],
    },
    {
      _id: 10,
      name: 'testing4',
      pageProcessors: [
        { _importId: 12},
      ],
    },
  ];
  const imports = [
    { _id: 1 },
    { _id: 2},
    { _id: 3, _integrationId: 2, http: {requestMediaType: 'json'}},
    { _id: 4, _integrationId: 3, http: {requestMediaType: 'xml'}, _connectionId: 1},
    { _id: 5, _integrationId: 3, http: {requestMediaType: 'json'}, _connectionId: 1},
    { _id: 10 },
    { _id: 11, adaptorType: 'MongodbExport' },
    {_id: 12, adaptorType: 'MongoDbImport'},
    {_id: 13, adaptorType: 'NetSuiteDistributedImport'},
    {_id: 14, adaptorType: 'NetSuiteImport'},
    {_id: 15},
    {_id: 16,
      sampleData: {
        column1: 123,
        column2: 1234,
        column3: 1,
      },
    },
    {_id: 17,
      sampleData: JSON.stringify({
        column1: 123,
        column2: 1234,
        column3: 1,
      }),
    },
    { _id: 18, _integrationId: 3, http: {requestMediaType: 'xml', body: ['hello']}, _connectionId: 1},
    { _id: 19,
      _integrationId: 3,
      http: {requestMediaType: 'xml', body: ['test']},
      _connectionId: 1,
      sampleData: {
        column1: 123,
        column2: 1234,
        column3: 1,
      },
    },
    { _id: 20, _integrationId: 3, http: {requestMediaType: 'xml', body: ['test']}, _connectionId: 1},
    { _id: 21, _integrationId: 3, http: {requestMediaType: 'xml'}, _connectionId: 1},
    {_id: 22,
      sampleData: {
        column1: 123,
        column2: 1234,
        column3: 1,
      },
    },
    {
      _id: 23,
      adaptorType: 'SalesforceImport',
      _connectionId: 2,
      salesforce: {
        sObjectType: 'account',
      },
    },
    {
      _id: 24,
      adaptorType: 'SalesforceImport',
      _connectionId: 2,
    },
  ];

  const exports = [
    { _id: '1' },
    { _id: '2', type: 'simple'},
    { _id: '3', _integrationId: 2, http: {requestMediaType: 'json'}},
    { _id: '4', assistant: 'square'},
    { _id: '5', _integrationId: 3, http: {requestMediaType: 'json'}, _connectionId: 1},
    { _id: 10 },
    { _id: 11, adaptorType: 'MongodbExport' },
    {_id: 12, adaptorType: 'MongoDbImport'},
    {_id: 13, adaptorType: 'NetSuiteDistributedImport'},
    {_id: 14, adaptorType: 'NetSuiteImport'},
    {_id: 15},
    {_id: 16, adaptorType: 'WebhookExport', webhook: {provider: 'webhookprovider'}},
    {_id: 17, adaptorType: 'WebhookExport' },
    {_id: 18},
    {_id: 19, adaptorType: 'http', http: {formType: 'rest'}},
    {_id: 20, _connectionId: 6, adaptorType: 'rdbms'},
    {_id: 21, adaptorType: 'HTTPExport', http: {formType: 'rest'}},
    {_id: 22, assistant: 'square'},
    {_id: 23, adaptorType: 'rdbms'},
  ];
  const connections = [
    { _id: 1, http: {mediaType: 'xml'} },
    { _id: 2 },
    { _id: 3 },
    { _id: 4 },
    { _id: 5 },
    {_id: 6, rdbms: {type: 'rdbmsconnection'}},
    {_id: 7, type: 'http'},
    {_id: 8, type: 'rdbms', rdbms: {type: 'rdbmsconnection'}},
  ];
  let state = reducer(
    undefined,
    actions.resource.receivedCollection('flows', flows)
  );

  state = reducer(
    state,
    actions.resource.receivedCollection('imports', imports)
  );
  state = reducer(
    state,
    actions.resource.receivedCollection('connections', connections)
  );
  state = reducer(
    state,
    actions.resource.receivedCollection('exports', exports)
  );
  describe('selectors.flowImports test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.flowImports()).toEqual([]);
    });
    test('should not throw any exception for null arguments', () => {
      expect(selectors.flowImports(null, null)).toEqual([]);
    });
    test('should not throw any exception if state is null', () => {
      expect(selectors.flowImports(null, 1)).toEqual([]);
    });
    test('should return empty array if flowId is null', () => {
      expect(selectors.flowImports(state, null)).toEqual([]);
    });
    test('should return all imports used in a flow', () => {
      expect(selectors.flowImports(state, 1)).toEqual([
        { _id: 1 },
        { _id: 2 },
        { _id: 3, _integrationId: 2, http: {requestMediaType: 'json'}},
      ]);
    });
    test('should return empty array if imports used in a flow are not in state', () => {
      expect(selectors.flowImports(state, 2)).toEqual([]);
    });
  });

  describe('selectors.flowMappingsImportsList test cases', () => {
    const selector = selectors.flowMappingsImportsList();

    test('should not throw any exception for invalid arguments', () => {
      expect(selector()).toEqual([]);
    });
    test('should return empty array if importId and flowId are undefined ', () => {
      expect(selector(state)).toEqual([]);
    });
    test('should return correct import if importId is passed and flowId is undefined', () => {
      expect(selector(state, undefined, 1)).toEqual([{ _id: 1 }]);
    });
    test('should return correct import if importId and flowId are passed', () => {
      expect(selector(state, 1, 1)).toEqual([{ _id: 1 }]);
    });
    test('should return all imports used in the flow which have import mapping available', () => {
      expect(selector(state, 3)).toEqual([{ _id: 10 }]);
    });
    test('should return all imports used in the flow which have query builder supported', () => {
      expect(selector(state, 4)).toEqual([{ _id: 12, adaptorType: 'MongoDbImport' }]);
    });
  });

  describe('selectors.getAllPageProcessorImports test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getAllPageProcessorImports()).toEqual([]);
    });
    test('should return all pageprocessor imports used in a flow', () => {
      expect(selectors.getAllPageProcessorImports(state, flows[2].pageProcessors)).toEqual([
        { _id: 10 },
        { _id: 11, adaptorType: 'MongodbExport' },
      ]);
    });
    test('should return empty array if pageprocessor imports are not in state', () => {
      expect(selectors.getAllPageProcessorImports(state, flows[1].pageProcessors)).toEqual([]);
    });
  });

  describe('selectors.httpAssistantSupportsMappingPreview test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.httpAssistantSupportsMappingPreview(undefined, {})).toBeFalsy();
    });
    test('should return false if import does not contain _integrationId', () => {
      expect(selectors.httpAssistantSupportsMappingPreview(state, 1)).toBeFalsy();
    });
    test('should return false if import does not contain http property', () => {
      expect(selectors.httpAssistantSupportsMappingPreview(state, 2)).toBeFalsy();
    });
    test('should return true if import is using xml as request media type', () => {
      expect(selectors.httpAssistantSupportsMappingPreview(state, 4)).toBeTruthy();
    });
    test('should return false if import requestMediaType is not xml and connection.http.mediaType is not xml', () => {
      expect(selectors.httpAssistantSupportsMappingPreview(state, 3)).toBeFalsy();
    });
    test('should return true if import requestMediaType is not xml and connection.http.mediaType is xml', () => {
      expect(selectors.httpAssistantSupportsMappingPreview(state, 5)).toBeTruthy();
    });
  });

  describe('selectors.mappingPreviewType test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingPreviewType()).toBeUndefined();
    });
    test('should return undefined if state does not contain the import with given importId', () => {
      expect(selectors.mappingPreviewType(state, 1234)).toBeUndefined();
    });
    describe('If adaptor type is netsuite', () => {
      test('should return netsuite if adaptor type is NetSuiteDistributedImport', () => {
        expect(selectors.mappingPreviewType(state, 13)).toEqual('netsuite');
      });
      test('should return netsuite if adaptor type is NetSuiteImport', () => {
        expect(selectors.mappingPreviewType(state, 14)).toEqual('netsuite');
      });
      test('should return netsuite if adaptor type is NetSuiteImport', () => {
        expect(selectors.mappingPreviewType(state, 10)).not.toEqual('netsuite');
      });
    });
    describe('If adaptorType is SalesforceImport', () => {
      const connId = 2;
      const masterRecordTypeInfoMetadata = {
        searchLayoutable: {
          a: 'b',
        },
        recordTypeInfos: [
          {
            master: true,
            recordTypeId: 'c',
          },
        ],
      };

      const commMetaPath = 'salesforce/metadata/connections/2/sObjectTypes/account';

      let newState = reducer(
        undefined,
        actions.metadata.request(connId, commMetaPath)
      );

      newState = reducer(
        newState,
        actions.metadata.receivedCollection(
          masterRecordTypeInfoMetadata,
          connId,
          commMetaPath
        )
      );
      const imp = [
        {
          _id: 'i1',
          _connectionId: 2,
          adaptorType: 'SalesforceImport',
          salesforce: {
            sObjectType: 'account',
          },
        },
        {
          _id: 'i2',
          _connectionId: 3,
          adaptorType: 'SalesforceImport',
        },
      ];

      newState = reducer(
        newState,
        actions.resource.receivedCollection('imports', imp)
      );
      test('should return undefined if record type info is not available for the import', () => {
        expect(selectors.mappingPreviewType(newState, 'i2')).toBeUndefined();
      });
      test('should return salesforce if record type info is available for the import', () => {
        expect(selectors.mappingPreviewType(newState, 'i1')).toEqual('salesforce');
      });
    });
    describe('If import is http', () => {
      test('should return http if http assistant supports mapping preview', () => {
        expect(selectors.mappingPreviewType(state, 4)).toEqual('http');
      });
      test('should return undefined if http assistant does not supports mapping preview', () => {
        expect(selectors.mappingPreviewType(state, 3)).toBeUndefined();
      });
    });
  });

  describe('selectors.isPreviewPanelAvailableForResource test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isPreviewPanelAvailableForResource()).toBeFalsy();
    });
    test('should return false if resource is not an export', () => {
      expect(selectors.isPreviewPanelAvailableForResource(state, 1, 'imports', 1)).toBeFalsy();
    });
    test('should return true if resource is a Data loader export', () => {
      expect(selectors.isPreviewPanelAvailableForResource(state, '2', 'exports', 2)).toBeTruthy();
    });
    test('should return false if resource is not a Data loader export', () => {
      expect(selectors.isPreviewPanelAvailableForResource(state, '1', 'exports', 2)).toBeFalsy();
    });
    test('should return true if export application supports preview panel', () => {
      expect(selectors.isPreviewPanelAvailableForResource(state, '4', 'exports', 2)).toBeTruthy();
    });
    test('should return false if application does not support preview panel', () => {
      expect(selectors.isPreviewPanelAvailableForResource(state, '5', 'exports', 2)).toBeFalsy();
    });
  });

  describe('selectors.applicationType test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.applicationType()).toEqual('');
    });
    const newState = {
      ...state,
      session: {
        stage: {
          16: {
            patch: [{
              op: 'replace',
              path: '/webhook/provider',
              value: 'webhookstagedprovider',
            }],
          },
          10: {
            patch: [{
              op: 'replace',
              path: '/type',
              value: 'simple',
            }],
          },
          23: {
            patch: [{
              op: 'replace',
              path: '/_connectionId',
              value: 6,
            }],
          },
          44: {},
          2: {
            patch: [{
              op: 'replace',
              path: '/type',
              value: 'rest',
            }],
          },
        },
      },
    };

    describe('adaptor type is WebhookExport', () => {
      test('should return webhook provider for the export', () => {
        expect(selectors.applicationType(state, 'exports', 16)).toEqual('webhookprovider');
      });
      test('should return staged value of the resource with path /webhook/provider', () => {
        expect(selectors.applicationType(newState, 'exports', 16)).toEqual('webhookstagedprovider');
      });
      test('should return undefined if export does not have webhook provider and is not staged', () => {
        expect(selectors.applicationType(state, 'exports', 17)).toBeFalsy();
      });
    });

    test('should return rest if adaptor type is http and form type is rest', () => {
      expect(selectors.applicationType(state, 'exports', 19)).toEqual('rest');
    });

    describe('resource is data loader', () => {
      test('should return empty string in case of data loader', () => {
        expect(selectors.applicationType(state, 'exports', 2)).toEqual('');
      });
      test('should return empty string if a resource is patched to be a data loader', () => {
        expect(selectors.applicationType(newState, 'exports', 10)).toEqual('');
      });
    });
    describe('adaptor type is rdbms', () => {
      test('should return correct connection rdbms type', () => {
        expect(selectors.applicationType(state, 'exports', 20)).toEqual('rdbmsconnection');
      });
      test('should return correct connection rdbms type from staged resource with connectionId patched', () => {
        expect(selectors.applicationType(newState, 'exports', 23)).toEqual('rdbmsconnection');
      });
    });
    describe('resource is a connection', () => {
      test('should return connection type', () => {
        expect(selectors.applicationType(state, 'connections', 7)).toEqual('http');
      });
      test('should return staged connection type', () => {
        expect(selectors.applicationType(newState, 'connections', 2)).toEqual('rest');
      });
      test('should return connection rdbms type if connection is of type rdbms', () => {
        expect(selectors.applicationType(newState, 'connections', 8)).toEqual('rdbmsconnection');
      });
    });

    test('should replace HTTP with REST if adaptor type starts with HTTP and form type is rest', () => {
      expect(selectors.applicationType(state, 'exports', 21)).toEqual('RESTExport');
    });
    test('should return assistant if resource has assistant prop', () => {
      expect(selectors.applicationType(state, 'exports', 22)).toEqual('square');
    });
    test('should return empty string if staged resource exists but resource does not exist', () => {
      expect(selectors.applicationType(newState, 'exports', 44)).toEqual('');
    });
  });

  describe('selectors.mappingGenerates test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingGenerates()).toEqual([]);
    });
    test('should return empty array if sample data is not found for the import', () => {
      expect(selectors.mappingGenerates(state, 1)).toEqual([]);
    });
    const expectedGenerateData = [
      {
        id: 'column1',
        name: 'column1',
        type: 'number',
      },
      {
        id: 'column2',
        name: 'column2',
        type: 'number',
      },
      {
        id: 'column3',
        name: 'column3',
        type: 'number',
      },
    ];

    test('should return correct generate data if import has sample data as object', () => {
      expect(selectors.mappingGenerates(state, 16)).toEqual(expectedGenerateData);
    });
    test('should return correct generate data if import has sample data as stringified object', () => {
      expect(selectors.mappingGenerates(state, 17)).toEqual(expectedGenerateData);
    });
  });

  describe('selectors.mappingExtracts test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingExtracts()).toEqual([]);
    });
    const newState = {
      ...state,
      session: {
        flowData: {
          7: {
            _id: 7,
            name: 'test',
            pageProcessorsMap: {
              22: {
                preMap: {
                  data: {
                    column1: 123,
                    column2: 1234,
                    column3: 1,
                  },
                },
              },
            },
          },
          8: {
            _id: 8,
            name: 'test',
            pageProcessorsMap: {
              22: {
                responseMappingExtracts: {
                  data: {
                    column1: 123,
                    column2: 1234,
                    column3: 1,
                  },
                },
              },
            },
          },
          9: {
            _id: 9,
            name: 'test',
            pageProcessorsMap: {
              22: {
                preMap: {
                  data: 'string',
                },
              },
            },
          },
        },

      },
    };

    test('should return correct mapping extracts if flow data exists', () => {
      expect(selectors.mappingExtracts(newState, 22, 7)).toEqual([
        {
          id: 'column1',
          name: 'column1',
        },
        {
          id: 'column2',
          name: 'column2',
        },
        {
          id: 'column3',
          name: 'column3',
        },
      ]);
    });
    test('should return empty array if flow data exists but extract path cannot be generated', () => {
      expect(selectors.mappingExtracts(newState, 22, 9)).toEqual([]);
    });
    test('should return empty array if flow data does not exist', () => {
      expect(selectors.mappingExtracts(newState, 22, 8)).toEqual([]);
    });
  });

  describe('selectors.mappingHttpAssistantPreviewData test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.mappingHttpAssistantPreviewData()).toEqual();
    });
    test('should return undefined if mapping preview type is not http', () => {
      expect(selectors.mappingHttpAssistantPreviewData(state, 3)).toBeUndefined();
    });
    describe('preview data present in state', () => {
      const newState = {...state,
        session: {mapping: {mapping: {
          preview: {
            data: {
              column1: 123,
              column2: 1234,
              column3: 1,
            },
          },
        }}}};

      test('should return correct transformation of preview data', () => {
        expect(selectors.mappingHttpAssistantPreviewData(newState, 18)).toEqual(
          {
            rule: 'hello',
            data: JSON.stringify({
              connection: { _id: 1, http: {mediaType: 'xml'} },
              data: {
                column1: 123,
                column2: 1234,
                column3: 1,
              }}),
          }
        );
      });
    });
    describe('preview data absent in state', () => {
      test('should return correct preview data if import contains sample data', () => {
        expect(selectors.mappingHttpAssistantPreviewData(state, 19)).toEqual(
          {
            rule: 'test',
            data: JSON.stringify({
              connection: { _id: 1, http: { mediaType: 'xml' } },
              data: [{ column1: 123, column2: 1234, column3: 1 }],
            }),
          }
        );
      });
      test('should return the default preview data if preview data in state and import sample data are absent', () => {
        expect(selectors.mappingHttpAssistantPreviewData(state, 20)).toEqual(
          {
            rule: 'test',
            data: JSON.stringify({
              connection: { _id: 1, http: { mediaType: 'xml' } },
              data: [],
            }),
          }
        );
      });
    });
  });

  describe('selectors.responseMappingExtracts test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.responseMappingExtracts()).toEqual([]);
    });
    test('should return empty array if flow does not contain pageprocessor for given resource', () => {
      expect(selectors.responseMappingExtracts(state, 2, 2)).toEqual([]);
    });
    test('should return empty array if resource with given resourceId does not exist', () => {
      expect(selectors.responseMappingExtracts(state, 6, 2)).toEqual([]);
    });
    test('should return empty array if flow does not contain page processors', () => {
      expect(selectors.responseMappingExtracts(state, 1, 6)).toEqual([]);
    });
    describe('page processor resource is import', () => {
      const newState = {
        ...state,
        session: {
          flowData: {
            7: {
              _id: 7,
              name: 'test',
              pageProcessorsMap: {
                22: {
                  responseTransform: {
                    data: {
                      column1: 123,
                      column2: 1234,
                      column3: 1,
                    },
                  },
                },
              },
            },
          },

        },
      };

      test('should return correct extract paths from the sample data of import', () => {
        expect(selectors.responseMappingExtracts(newState, 22, 7)).toEqual([
          {id: 'column1', name: 'column1'},
          {id: 'column2', name: 'column2'},
          {id: 'column3', name: 'column3'},
        ]);
      });
      test('should return default response mapping extract if import does not have sample data', () => {
        expect(selectors.responseMappingExtracts(state, 15, 8)).toEqual([
          {
            id: 'id',
            name: 'id',
          },
          {
            id: 'errors',
            name: 'errors',
          },
          {
            id: 'ignored',
            name: 'ignored',
          },
          {
            id: 'statusCode',
            name: 'statusCode',
          },
        ]);
      });
    });
    describe('resource is not import', () => {
      test('should return default response mapping extract', () => {
        expect(selectors.responseMappingExtracts(state, 12, 9)).toEqual([
          { id: 'data', name: 'data' },
          { id: 'errors', name: 'errors' },
          { id: 'ignored', name: 'ignored' },
          { id: 'statusCode', name: 'statusCode' },
        ]);
      });
    });
  });
});

