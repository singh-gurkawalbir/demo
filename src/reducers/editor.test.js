/* global describe, expect, beforeEach, test */
import { selectors } from '.';
import { USER_ACCESS_LEVELS } from '../utils/constants';

describe('AFE region selectors test cases', () => {
  const editorId = 'abc';
  let state;

  beforeEach(() => {
    state = {
      data: {
        resources: {},
      },
      session: {
        editors: {
          helperFunctions: {
            abs: '{{abs field}}',
            add: '{{add field field}}',
            timestamp: '{{timestamp format timezone}}',
            uppercase: '{{uppercase field}}',
          },
        },
      },
      user: {
        profile: { email: 'something@test.com', name: 'First Last', timezone: 'Asia/Calcutta' },
        preferences: { defaultAShareId: 'own' },
      },
    };
  });

  describe('selectors.editorHelperFunctions test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.editorHelperFunctions()).toEqual({});
      expect(selectors.editorHelperFunctions(null)).toEqual({});
    });
    test('should return original helper functions if timestamp function is not present', () => {
      delete state.session.editors.helperFunctions.timestamp;
      expect(selectors.editorHelperFunctions(state)).toEqual(state.session.editors.helperFunctions);
    });
    test('should return original helper functions if user timezone is empty', () => {
      delete state.user.profile.timezone;
      expect(selectors.editorHelperFunctions(state)).toEqual(state.session.editors.helperFunctions);
    });
    test('should return updated timestamp function if user timezone is present', () => {
      const expectedOutput = {
        abs: '{{abs field}}',
        add: '{{add field field}}',
        timestamp: '{{timestamp format "Asia/Calcutta"}}',
        uppercase: '{{uppercase field}}',
      };

      expect(selectors.editorHelperFunctions(state)).toEqual(expectedOutput);
    });
  });

  describe('selectors.editorSupportsOnlyV2Data test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.editorSupportsOnlyV2Data()).toEqual(false);
    });
    test('should return true for filters stage', () => {
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        editorType: 'exportFilter',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(true);
    });
    test('should return true for graphql resource and graphql http field', () => {
      state.data.resources.exports = [{
        _id: '123',
        type: 'graph_ql',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        fieldId: 'http.body',
        stage: 'flowInput',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(true);
    });
    test('should return false for graphql resource when fieldId is not a graphql http field', () => {
      state.data.resources.exports = [{
        _id: '123',
        type: 'graph_ql',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        fieldId: 'abc',
        stage: 'flowInput',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(false);
    });
    test('should return false if resource is a page generator', () => {
      state.data.resources.exports = [{
        _id: '123',
        type: 'webhook',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        fieldId: 'abc.0',
        stage: 'flowInput',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(false);
    });
    test('should return true for csv generator, backup path, file json body and traceKeyTemplate fields', () => {
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'csvGenerator',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'file.csv',
        stage: 'flowInput',
      };
      state.session.editors.def = {
        id: 'def',
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'file.backupPath',
        stage: 'flowInput',
      };
      state.session.editors.def1 = {
        id: 'def1',
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '1234',
        fieldId: 'traceKeyTemplate',
        stage: 'flowInput',
      };
      state.session.editors.def2 = {
        id: 'def2',
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '1234',
        fieldId: 'file.json.body',
        stage: 'flowInput',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(true);
      expect(selectors.editorSupportsOnlyV2Data(state, 'def')).toEqual(true);
      expect(selectors.editorSupportsOnlyV2Data(state, 'def1')).toEqual(true);
      expect(selectors.editorSupportsOnlyV2Data(state, 'def2')).toEqual(true);
    });
    test('should return false for all other cases', () => {
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'http.body',
        stage: 'flowInput',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(false);
    });
  });

  describe('selectors.isEditorDisabled test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isEditorDisabled()).toEqual(false);
    });
    test('should return true if formKey is present in the editor and the field state is disabled', () => {
      state.session.editors[editorId] = {
        id: editorId,
        formKey: 'new-dbfh7',
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'http.body',
        stage: 'flowInput',
      };
      state.session.form = {
        'new-dbfh7': {
          fields: {
            'http.body': {
              id: 'http.body',
              disabled: true,
              type: 'httprequestbody',
              label: 'HTTP request body',
            },
          },
        },
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(true);
    });

    test('should return false if formKey is present in the editor and the field type is iaexpression though field is disabled', () => {
      state.session.editors[editorId] = {
        id: editorId,
        formKey: 'new-dbfh7',
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'http.body',
        stage: 'flowInput',
      };
      state.session.form = {
        'new-dbfh7': {
          fields: {
            'http.body': {
              id: 'http.body',
              type: 'iaexpression',
              disabled: true,
              label: 'HTTP request body',
            },
          },
        },
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(false);
    });
    test('should return true for monitor user if stage is input/output filter and active mode is filter', () => {
      state.user = {
        org: {
          accounts: [{_id: 'someid', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR}],
        },
        preferences: { defaultAShareId: 'someid' },
      };
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'outputFilter',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'outputFilter',
        activeProcessor: 'filter',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(true);
    });
    test('should return true for monitor user for mappings editor', () => {
      state.user = {
        org: {
          accounts: [{_id: 'someid', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR}],
        },
        preferences: { defaultAShareId: 'someid' },
      };
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'mappings',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'importMappingExtract',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(true);
    });
    test('should return false for manage user if stage is input/output filter and active mode is filter', () => {
      state.user = {
        org: {
          accounts: [{
            _id: 'someid',
            accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
            integrationAccessLevel: [
              {accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
                _integrationId: 'int-id'},
            ],
          }],
        },
        preferences: { defaultAShareId: 'someid' },
      };
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'outputFilter',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'outputFilter',
        activeProcessor: 'filter',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(false);
    });
    test('should return false for manage user for mappings editor', () => {
      state.user = {
        org: {
          accounts: [{
            _id: 'someid',
            accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
            integrationAccessLevel: [
              {accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
                _integrationId: 'int-id'},
            ],
          }],
        },
        preferences: { defaultAShareId: 'someid' },
      };
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'mappings',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'importMappingExtract',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(false);
    });
    test('should return false for IA for response mappings editor', () => {
      state.user = {
        org: {
          accounts: [{_id: 'someid', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR}],
        },
        preferences: { defaultAShareId: 'someid' },
      };
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
        _connectorId: 'co-123',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'responseMappings',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'responseMappingExtract',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(false);
    });
    test('should return true for monitor non IA user for response mappings editor', () => {
      state.user = {
        org: {
          accounts: [{_id: 'someid', accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR}],
        },
        preferences: { defaultAShareId: 'someid' },
      };
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'responseMappings',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'responseMappingExtract',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(true);
    });
    test('should return false for manage user for response mappings editor', () => {
      state.user = {
        org: {
          accounts: [{
            _id: 'someid',
            accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
            integrationAccessLevel: [
              {accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
                _integrationId: 'int-id'},
            ],
          }],
        },
        preferences: { defaultAShareId: 'someid' },
      };
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'responseMappings',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'responseMappingExtract',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(false);
    });
    test('should return true if user is in flow view mode', () => {
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
        _connectorId: 'connector-id',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'flowInput',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(true);
    });
    test('should return true if its a free flow', () => {
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
        free: true,
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'flowInput',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(true);
    });
    test('should return false if field state is not disabled', () => {
      state.session.editors[editorId] = {
        id: editorId,
        formKey: 'new-dbfh7',
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'http.body',
        stage: 'flowInput',
      };
      state.session.form = {
        'new-dbfh7': {
          fields: {
            'http.body': {
              id: 'http.body',
              disabled: false,
              type: 'httprequestbody',
              label: 'HTTP request body',
            },
          },
        },
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(false);
    });
    test('should return false if user has manage access to the flow', () => {
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
      }];
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'flowInput',
      };

      expect(selectors.isEditorDisabled(state, editorId)).toEqual(false);
    });
  });

  describe('selectors.isEditorLookupSupported test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isEditorLookupSupported()).toEqual(false);
    });
    test('should return false if resource type is exports', () => {
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        fieldId: 'abc.0',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(false);
    });
    test('should return false if field is of lookup type', () => {
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        fieldId: '_query',
      };
      state.session.editors.def = {
        id: 'def',
        resourceType: 'imports',
        resourceId: '657',
        fieldId: '_body',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(false);
      expect(selectors.isEditorLookupSupported(state, 'def')).toEqual(false);
    });
    test('should return false if result mode is text for non-sql fields', () => {
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'ftp.body',
        resultMode: 'text',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(false);
    });
    test('should return false if it is a import and its connection is of bigquery rdbms type', () => {
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'ftp.body',
      };
      state.data.resources = {
        imports: [{
          _id: '123',
          adaptorType: 'RESTImport',
          _connectionId: 'conn-id',
        }],
        connections: [{
          _id: 'conn-id',
          type: 'rdbms',
          rdbms: {
            type: 'bigquery',
          },
        }],
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(false);
    });
    test('should return true for http body or sql fields', () => {
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'sql',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'queryInsert',
        resultMode: 'text',
      };
      state.session.editors.def = {
        id: 'def',
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '889',
        fieldId: 'http.body',
        resultMode: 'json',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(true);
      expect(selectors.isEditorLookupSupported(state, 'def')).toEqual(true);
    });
    test('should return true for relative uri field', () => {
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'http.relativeURI',
        resultMode: 'text',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(true);
    });
    test('should return true for editor type equal to databaseMapping for imports', () => {
      state.session.editors[editorId] = {
        id: editorId,
        editorType: 'databaseMapping',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'rdbms.query',
        resultMode: 'text',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(true);
    });
  });

  describe('selectors.shouldGetContextFromBE test cases', () => {
    const sampleData = {
      name: 'Bob',
      age: '30',
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.shouldGetContextFromBE()).toEqual({ shouldGetContextFromBE: true });
    });
    test('should not throw any exception for undefined connection', () => {
      state.data.resources = {
        imports: [{
          _id: '123',
          adaptorType: 'RESTImport',
          _connectionId: 'conn-id',
        }],
      };

      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'inputFilter',
        editorType: 'inputFilter',
      };
      const expectedOutput = {
        shouldGetContextFromBE: false,
        sampleData: {
          record: {
            name: 'Bob',
            age: '30',
          },
        },
      };

      expect(selectors.shouldGetContextFromBE(state, editorId, sampleData)).toEqual(expectedOutput);
    });
    test('should return shouldGetContextFromBE as false with sample data if resource is native REST adaptor type', () => {
      state.data.resources = {
        exports: [{
          _id: '123',
          adaptorType: 'RESTExport',
          _connectionId: 'conn-id',
        }],
        connections: [{
          _id: 'conn-id',
          isHTTP: false,
        }],
      };
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'exportFilter',
        editorType: 'exportFilter',
      };
      const expectedOutput = {
        shouldGetContextFromBE: false,
        sampleData: {
          record: {
            name: 'Bob',
            age: '30',
          },
        },
      };

      expect(selectors.shouldGetContextFromBE(state, editorId, sampleData)).toEqual(expectedOutput);
    });
    test('should return shouldGetContextFromBE as false with sample data for transform and hook stages', () => {
      state.data.resources = {
        exports: [{
          _id: '123',
          adaptorType: 'FTPExport',
          _connectionId: 'conn-id',
        }],
        imports: [{
          _id: '999',
          adaptorType: 'FTPImport',
          _connectionId: 'conn-id',
        }],
      };
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'transform',
        editorType: 'flowTransform',
      };
      state.session.editors.def = {
        id: 'def',
        resourceType: 'imports',
        resourceId: '999',
        flowId: 'flow-456',
        stage: 'postResponseMapHook',
        editorType: 'postResponseMapHook',
      };
      const expectedOutput = {
        shouldGetContextFromBE: false,
        sampleData: {
          name: 'Bob',
          age: '30',
        },
      };

      expect(selectors.shouldGetContextFromBE(state, editorId, sampleData)).toEqual(expectedOutput);
      expect(selectors.shouldGetContextFromBE(state, 'def', sampleData)).toEqual(expectedOutput);
    });
    test('should return shouldGetContextFromBE as false with sample data for lookup fields', () => {
      state.data.resources = {
        exports: [{
          _id: '123',
          adaptorType: 'HTTPExport',
          _connectionId: 'conn-id',
        }],
      };
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        flowId: 'flow-456',
        fieldId: '_body',
        stage: 'flowInput',
      };
      const expectedOutput = {
        shouldGetContextFromBE: false,
        sampleData: {
          data: sampleData,
        },
      };

      expect(selectors.shouldGetContextFromBE(state, editorId, sampleData)).toEqual(expectedOutput);
      state.session.editors.def = {
        id: 'def',
        resourceType: 'exports',
        resourceId: '123',
        flowId: 'flow-456',
        fieldId: 'lookup.body',
        stage: 'flowInput',
      };
      expect(selectors.shouldGetContextFromBE(state, 'def', sampleData)).toEqual(expectedOutput);
    });
    test('should return shouldGetContextFromBE as true for all other cases', () => {
      state.data.resources = {
        imports: [{
          _id: '123',
          adaptorType: 'S3Import',
          _connectionId: 'conn-id',
        }],
      };
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        fieldId: 'file.fileName',
        stage: 'flowInput',
      };
      const expectedOutput = {
        shouldGetContextFromBE: true,
      };

      expect(selectors.shouldGetContextFromBE(state, editorId, sampleData)).toEqual(expectedOutput);
    });
  });

  describe('selectors.isEditorSaveInProgress test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isEditorSaveInProgress()).toBeFalsy();
    });
    test('should return true if editor state has in progress save status', () => {
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'inputFilter',
        saveStatus: 'requested',
      };

      expect(selectors.isEditorSaveInProgress(state, editorId)).toEqual(true);
    });
    test('should return true if mapping state has in progress save status', () => {
      state.session.mapping = {
        mapping: {
          resourceType: 'imports',
          resourceId: '123',
          flowId: 'flow-456',
          saveStatus: 'requested',
        }};

      expect(selectors.isEditorSaveInProgress(state, editorId)).toEqual(true);
    });
    test('should return true if response mapping state has in progress save status', () => {
      state.session.responseMapping = {
        mapping: {
          resourceType: 'imports',
          resourceId: '123',
          flowId: 'flow-456',
          saveStatus: 'requested',
        }};

      expect(selectors.isEditorSaveInProgress(state, editorId)).toEqual(true);
    });
    test('should return false if no save is in progress', () => {
      state.session.editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'inputFilter',
        saveStatus: 'completed',
      };
      state.session.mapping = {
        mapping: {
          resourceType: 'imports',
          resourceId: '123',
          flowId: 'flow-456',
          saveStatus: 'failed',
        }};
      state.session.responseMapping = {
        mapping: {
          resourceType: 'imports',
          resourceId: '123',
          flowId: 'flow-456',
        }};

      expect(selectors.isEditorSaveInProgress(state, editorId)).toEqual(false);
    });
  });
});
