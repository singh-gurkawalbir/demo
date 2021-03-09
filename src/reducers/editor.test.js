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
        _editors: {},
      },
    };
  });
  describe('selectors.editorSupportsOnlyV2Data test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.editorSupportsOnlyV2Data()).toEqual(false);
    });
    test('should return true for filters stage', () => {
      state.session._editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        stage: 'exportFilter',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(true);
    });
    test('should return false if resource is a page generator', () => {
      state.data.resources.exports = [{
        _id: '123',
        type: 'webhook',
      }];
      state.session._editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        fieldId: 'abc.0',
        stage: 'flowInput',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(false);
    });
    test('should return true for csv generator and backup path fields', () => {
      state.session._editors[editorId] = {
        id: editorId,
        editorType: 'csvGenerator',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'file.csv',
        stage: 'flowInput',
      };
      state.session._editors.def = {
        id: 'def',
        editorType: 'handlebars',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'file.backupPath',
        stage: 'flowInput',
      };

      expect(selectors.editorSupportsOnlyV2Data(state, editorId)).toEqual(true);
      expect(selectors.editorSupportsOnlyV2Data(state, 'def')).toEqual(true);
    });
    test('should return false for all other cases', () => {
      state.session._editors[editorId] = {
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
      state.session._editors[editorId] = {
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
      state.session._editors[editorId] = {
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
      state.session._editors[editorId] = {
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
    test('should return true if user is in flow view mode', () => {
      state.data.resources.flows = [{
        _id: 'flow-456',
        _integrationId: 'int-id',
        _connectorId: 'connector-id',
      }];
      state.session._editors[editorId] = {
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
      state.session._editors[editorId] = {
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
      state.session._editors[editorId] = {
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
      state.session._editors[editorId] = {
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
      state.session._editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        fieldId: 'abc.0',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(false);
    });
    test('should return false if field is of lookup type', () => {
      state.session._editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        fieldId: '_query',
      };
      state.session._editors.def = {
        id: 'def',
        resourceType: 'imports',
        resourceId: '657',
        fieldId: '_body',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(false);
      expect(selectors.isEditorLookupSupported(state, 'def')).toEqual(false);
    });
    test('should return false if result mode is text for non-sql fields', () => {
      state.session._editors[editorId] = {
        id: editorId,
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'realtiveUri',
        resultMode: 'text',
      };
      expect(selectors.isEditorLookupSupported(state, editorId)).toEqual(false);
    });
    test('should return true for http body or sql fields', () => {
      state.session._editors[editorId] = {
        id: editorId,
        editorType: 'sql',
        resourceType: 'imports',
        resourceId: '123',
        fieldId: 'queryInsert',
        resultMode: 'text',
      };
      state.session._editors.def = {
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
    test('should return true for editor type equal to databaseMapping for imports', () => {
      state.session._editors[editorId] = {
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
      state.session._editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'exportFilter',
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
      state.session._editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        flowId: 'flow-456',
        stage: 'transform',
      };
      state.session._editors.def = {
        id: 'def',
        resourceType: 'imports',
        resourceId: '999',
        flowId: 'flow-456',
        stage: 'postResponseMapHook',
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
          type: 'webhook',
          _connectionId: 'conn-id',
        }],
      };
      state.session._editors[editorId] = {
        id: editorId,
        resourceType: 'exports',
        resourceId: '123',
        flowId: 'flow-456',
        fieldId: '_body',
        stage: 'flowInput',
      };
      const expectedOutput = {
        shouldGetContextFromBE: false,
      };

      expect(selectors.shouldGetContextFromBE(state, editorId, sampleData)).toEqual(expectedOutput);
      state.session._editors.def = {
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
      state.session._editors[editorId] = {
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
});
