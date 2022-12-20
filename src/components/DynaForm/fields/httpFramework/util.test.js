/* global describe, test, expect */
import { selectOptions, semiAssistantExportConfig, semiAssistantExportOperationOptions } from './util';

describe('Util functions\' tests', () => {
  test('should provide expected results for "selectedOptions" in different scenarios', () => {
    // field type version of length == 1
    let params = {
      assistantFieldType: 'version',
      assistantData: { export: { versions: [{ hidden: false, version: 'v3' }] } },
      resourceType: 'exports',
    };

    expect(selectOptions(params)).toEqual([{ label: 'v3', value: 'v3' }]);

    // field type of resource
    params = {
      assistantFieldType: 'resource',
      assistantData: { export: { resources: [{ hidden: false, name: 'resource1', id: 'res1' }] } },
      resourceType: 'exports',
    };

    expect(selectOptions(params)).toEqual([{ label: 'resource1', value: 'res1' }]);

    // field type of operation for exports
    params = {
      assistantFieldType: 'operation',
      assistantData: { export: { resources: [{ id: 'res1', endpoints: [{ hidden: false, name: 'tickets', url: '/tickets' }] }] } },
      resourceType: 'exports',
      formContext: { resource: 'res1' },
    };

    expect(selectOptions(params)).toEqual([{ label: 'tickets', value: '/tickets' }]);

    // field type of operation for imports
    params = {
      assistantFieldType: 'operation',
      assistantData: {
        import: {
          resources: [{
            id: 'res1',
            operations: [
              { hidden: false, name: 'tickets', id: '/tickets' },
              { hidden: false, name: 'users', url: ['/users'], method: ['GET'] },
              { hidden: false, name: 'organizations', url: '/organizations', method: 'POST' },
            ],
          }],
        },
      },
      resourceType: 'imports',
      formContext: { resource: 'res1' },
    };

    expect(selectOptions(params)).toEqual([{ label: 'tickets', value: '/tickets' }, { label: 'users', value: 'GET:/users' }, { label: 'organizations', value: 'POST:/organizations' }]);

    // field type version with version length > 1
    const versions = [{ version: 'v2', _id: 'v2' }, { version: 'v3', _id: 'v3' }, {_id: '', version: 'emptyVersion'}];

    params = {
      assistantFieldType: 'version',
      assistantData: {
        export: {
          resources: [
            { id: 'res1', versions, _versionIds: ['v1', 'v3', ''] },
            { id: 'res2+res3', versions, endpoints: [{ id: 'create', _httpConnectorResourceIds: ['res1'] }] },
          ],
          versions,
        },
        import: {
          resources: [
            { id: 'res4', versions, _versionIds: ['v2'] },
            { id: 'res5+res6', versions, operations: [{ id: 'update', _httpConnectorResourceIds: ['res4'] }] },
          ],
          versions,
        },
      },
      resourceType: 'exports',
      formContext: { resource: 'res1', operation: 'create+update' },
    };

    expect(selectOptions(params)).toEqual([{ label: 'emptyVersion', value: 'emptyVersion' }, { label: 'v2', value: 'v2' }, { label: 'v3', value: 'v3' }]);

    // version options with filtered versionIds for export
    params.formContext.resource = 'res2+res3';

    expect(selectOptions(params)).toEqual([{ label: 'emptyVersion', value: 'emptyVersion' }, { label: 'v3', value: 'v3' }]);

    // version options with filtered versionIds for import
    params.formContext.resource = 'res5+res6';
    params.resourceType = 'imports';
    expect(selectOptions(params)).toEqual([{ label: 'v2', value: 'v2' }]);

    // verfiying when emptyArray is retured
    params = {
      assistantFieldType: 'operation',
      resourceType: 'exports',
      formContext: { resource: 'res1' },
    };

    expect(selectOptions(params)).toEqual([]);

    params = {
      assistantFieldType: 'something',
      assistantData: { export: {resources: [{id: 'resId'}]} },
      formContext: {resource: 'resId'},
    };

    expect(selectOptions(params)).toEqual([]);

    params = {
      assistantFieldType: 'something',
      assistantData: { export: {resources: [{id: 'resId'}]} },
      formContext: {resource: 'resId', operation: 'adapterType' },
    };

    expect(selectOptions(params)).toEqual([]);
  });
  test('should provide expected results for "semiAssistantExportConfig" in different scenarios', () => {
    const assistantData = {
      export:
        {
          config: {
            configField: {value: 'config-parent-target', name: 'Parent config'},
            http: { body: 'body', paging: {} },
            doesNotSupportPaging: true,
          },
          http: { body: 'body', paging: {} },
          versions: [{ hidden: false, version: 'v3' }],
          endpoints: [{ key: 'op1', config: {configField: {name: 'Endpoint config'}}}],
        },
    };

    expect(semiAssistantExportConfig(assistantData, 'op1.op2')).toEqual({
      configField: {value: 'config-parent-target', name: 'Endpoint config'},
      doesNotSupportPaging: true,
      http: {
        body: 'body',
      },
      type: 'all'});

    // when assistantData meta has children instead of endpoints
    assistantData.export.config.type = 'once';
    assistantData.export.endpoints = null;
    assistantData.export.children = [{key: 'op1'}];
    expect(semiAssistantExportConfig(assistantData, 'op1.op2')).toEqual({
      configField: {value: 'config-parent-target', name: 'Parent config'},
      doesNotSupportPaging: true,
      http: {
        body: 'body',
      },
      type: 'once'});
  });
  test('should provide expected results for "semiAssistantExportOperationOptions" in different scenarios', () => {
    const assistantData = {
      export:
        {
          endpoints: [
            { key: 'operation1', children: [{ key: 'key1' }], title: 'increment ticket' },
            { key: 'operation2', children: [{ key: 'key2', title: 'child2' }], title: 'increment user access' },
            { key: 'operation3', children: [{ key: 'key3', title: 'child3', folder: true, children: [{key: 'subChild1', folder: true, children: [{title: 'grandChild'}]}]}], title: 'increment ticket count' },
          ],
        },
    };

    expect(semiAssistantExportOperationOptions(assistantData)).toEqual([{items: [{label: undefined, value: 'operation1.key1'}, {label: 'child2', value: 'operation2.key2'}, {label: 'child3 : undefined : grandChild', value: 'operation3.key3.subChild1.'}]}]);
  });
});
