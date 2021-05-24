/* global describe, expect, test */
import reducer, { selectors } from '.';
import actions from '../actions';

describe('selectors.assistantName test cases', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.assistantName(undefined)).toEqual(undefined);
  });
  test('should return undefined in case of resourceId is not present', () => {
    const testExports = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B' }];
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', testExports)
    );

    expect(selectors.assistantName(state, 'exports', 99)).toEqual(undefined);
  });
  test('should return assistant name in case correct resource id is passed', () => {
    const testExports = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B', assistant: 'myAssistant' }];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', testExports)
    );

    expect(selectors.assistantName(state, 'exports', 567)).toEqual('myAssistant');
  });
  test('should return assistant name in case assistant name is present in connection resource', () => {
    const testExports = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B', _connectionId: 768 }];
    const testConnections = [{ _id: 768, name: 'A', assistant: 'myAssistant'}, { _id: 233, name: 'B'}];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', testExports)
    );
    const newState = reducer(
      state,
      actions.resource.receivedCollection('connections', testConnections)
    );

    expect(selectors.assistantName(newState, 'exports', 567)).toEqual('myAssistant');
  });

  test('should return undefined in case resource is not an assistant', () => {
    const testExports = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B', _connectionId: 768 }];
    const testConnections = [{ _id: 768, name: 'A'}, { _id: 233, name: 'B'}];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', testExports)
    );
    const newState = reducer(
      state,
      actions.resource.receivedCollection('connections', testConnections)
    );

    expect(selectors.assistantName(newState, 'exports', 567)).toEqual(undefined);
  });
});

describe('selectors.recordTypeForAutoMapper test cases', () => {
  test('should not throw any exception for invalid arguments', () => {
    expect(selectors.recordTypeForAutoMapper(undefined)).toEqual('');
  });

  test('should return through exception in case of resourceId is not present', () => {
    const testExports = [{ _id: 234, name: 'A' }, { _id: 567, name: 'B' }];
    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', testExports)
    );

    expect(selectors.recordTypeForAutoMapper(state, 'exports', 99)).toEqual('');
  });

  test('should return recordType for netsuite export [restlet]', () => {
    const testExports = [
      { _id: 234, name: 'A' },
      { _id: 567,
        name: 'B',
        adaptorType: 'NetSuiteExport',
        _connectionId: 768,
        netsuite: {
          type: 'restlet',
          restlet: {
            recordType: 'employee',
          },
        },
      }];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', testExports)
    );

    expect(selectors.recordTypeForAutoMapper(state, 'exports', 567)).toEqual('employee');
  });

  test('should return recordType for netsuite export [distributed]', () => {
    const testExports = [
      { _id: 234, name: 'A' },
      { _id: 567,
        name: 'B',
        adaptorType: 'NetSuiteExport',
        _connectionId: 768,
        netsuite: {
          type: 'distributed',
          distributed: {
            recordType: 'employee',
          },
        },
      }];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('exports', testExports)
    );

    expect(selectors.recordTypeForAutoMapper(state, 'exports', 567)).toEqual('employee');
  });

  test('should return recordType for netsuite import', () => {
    const testImport = [
      { _id: 234, name: 'A' },
      { _id: 567,
        name: 'B',
        adaptorType: 'NetSuiteDistributedImport',
        _connectionId: 768,
        netsuite_da: {
          recordType: 'employee',
          operation: 'add',
          mapping: { lists: [], fields: []},
        },
      }];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('imports', testImport)
    );

    expect(selectors.recordTypeForAutoMapper(state, 'imports', 567)).toEqual('employee');
  });

  test('should return recordType for netsuite import[subrecord]', () => {
    const testImport = [
      { _id: 234, name: 'A' },
      { _id: 567,
        name: 'B',
        adaptorType: 'NetSuiteDistributedImport',
        _connectionId: 768,
        netsuite_da: {
          recordType: 'salesorder',
          operation: 'add',
          mapping: { lists: [{
            generate: 'item',
            fields: [
              {
                generate: 'test',
                subRecordMapping: {
                  recordType: 'inventorydetail',
                  mapping: {lists: [], fields: []},
                },
              },
            ],
          }],
          fields: []},
        },
      }];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('imports', testImport)
    );

    expect(selectors.recordTypeForAutoMapper(state, 'imports', 567, 'item[*].test')).toEqual('inventorydetail');
  });

  test('should return recordType for salesforce', () => {
    const testImport = [
      { _id: 234, name: 'A' },
      { _id: 567,
        name: 'B',
        adaptorType: 'SalesforceExport',
        _connectionId: 768,
        salesforce: {
          sObjectType: 'employee',
        },
      }];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('imports', testImport)
    );

    expect(selectors.recordTypeForAutoMapper(state, 'imports', 567)).toEqual('employee');
  });

  test('should return recordType for assistant', () => {
    const testImport = [
      { _id: 234, name: 'A' },
      { _id: 567,
        name: 'B',
        adaptorType: 'RESTImport',
        assistant: 'zendesk',
        _connectionId: 768,
        rest: {
          relativeURI: '/api/v2/organizations/{{{organizationId}}}.json',
        },
      }];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('imports', testImport)
    );

    expect(selectors.recordTypeForAutoMapper(state, 'imports', 567)).toEqual('organizations');
  });
});
