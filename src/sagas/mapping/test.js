/* global describe, test, jest */
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga/effects';
import shortid from 'shortid';
import {requestSampleData as requestImportSampleData} from '../sampleData/imports';
import { apiCallWithRetry } from '..';
import actions from '../../actions';
import { selectors } from '../../reducers';
import {getMappingMetadata as getIAMappingMetadata} from '../integrationApps/settings';
import {requestAssistantMetadata} from '../resources/meta';
import {
  checkForIncompleteSFGenerateWhilePatch,
  fetchRequiredMappingData,
  mappingInit,
  previewMappings,
  refreshGenerates,
  saveMappings,
  updateImportSampleData,
  validateMappings,
  patchGenerateThroughAssistant,
} from '.';
import {requestSampleData as requestFlowSampleData} from '../sampleData/flows';
import { SCOPES } from '../resourceForm';
import { commitStagedChanges } from '../resources';

describe('fetchRequiredMappingData saga', () => {
  test('should trigger mapping initFailed in case of invalid import id', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), undefined],
      ])
      .put(actions.mapping.initFailed())
      .run();
  });
  test('should make requestImportSampleData call in case import sample data is not loaded', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test'}],
        [select(selectors.getImportSampleData, importId, {}), {}],
      ])
      .call(requestImportSampleData, {
        resourceId: importId,
        options: {},
      })
      .run();
  });
  test('should not make requestImportSampleData call in case import sample data is not loaded', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .not.call(requestImportSampleData, {
        resourceId: importId,
        options: {},
      })
      .run();
  });

  test('should make requestFlowSampleData call', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .call(requestFlowSampleData, {
        flowId,
        resourceId: importId,
        resourceType: 'imports',
        stage: 'importMappingExtract',
      })
      .run();
  });

  test('should make requestFlowSampleData call', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .call(requestFlowSampleData, {
        flowId,
        resourceId: importId,
        resourceType: 'imports',
        stage: 'importMappingExtract',
      })
      .run();
  });

  test('should not make requestAssistantMetadata call in case of  non-assistant resource', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .not.call(requestAssistantMetadata)
      .run();
  });
  test('should not make requestAssistantMetadata call in case assistantType = financialforce', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test', assistant: 'financialforce', type: 'rest'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .not.call(requestAssistantMetadata)
      .run();
  });

  test('should make requestAssistantMetadata call in case of assistants', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test', assistant: 'any_other', type: 'rest'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .call(requestAssistantMetadata, {
        adaptorType: 'rest',
        assistant: 'any_other',
      })
      .run();
  });

  test('should not make getIAMappingMetadata call in case of non-IA', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test', assistant: 'any_other', type: 'rest'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .not.call(getIAMappingMetadata)
      .run();
  });
  test('should make getIAMappingMetadata call in case of IA', () => {
    const flowId = 'f1';
    const importId = 'imp1';

    return expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'imp1', name: 'test', _connectorId: 'c1', _integrationId: 'iA1'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .call(getIAMappingMetadata, {integrationId: 'iA1'})
      .run();
  });
});

describe('refreshGenerates saga', () => {
  test('should request import sample data in case where non SF/NS adaptor', () => {
    const importId = 'import1';

    expectSaga(refreshGenerates, {})
      .provide([
        [select(selectors.mapping), {mappings: [], importId}],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.resource, 'imports', importId), {_id: 'import1', adaptorType: 'anything_else'}],
      ])
      .put(actions.importSampleData.request(
        importId,
        {},
        true
      ))
      .run();
  });

  test('should request import sample data in case of Netsuite Import', () => {
    const importId = 'import1';

    expectSaga(refreshGenerates, {})
      .provide([
        [select(selectors.mapping), {mappings: [], importId}],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.resource, 'imports', importId), {_id: 'import1', adaptorType: 'NetSuiteImport'}],
      ])
      .put(actions.importSampleData.request(
        importId,
        {},
        true
      ))
      .run();
  });

  test('should request import sample data in case of Netsuite Subrecord Import Mapping', () => {
    const importId = 'import1';
    const subRecordMappingId = 'subRecord1';

    expectSaga(refreshGenerates, {})
      .provide([
        [select(selectors.mapping), {mappings: [], importId, subRecordMappingId }],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), []],
        [select(selectors.mappingNSRecordType, importId, subRecordMappingId), 'record1'],
        [select(selectors.resource, 'imports', importId), {_id: 'import1', adaptorType: 'NetSuiteDistributedImport'}],

      ])
      .put(actions.importSampleData.request(
        importId,
        {recordType: 'record1'},
        true
      ))
      .run();
  });

  test('should request import sample data in case of Netsuite Import [isInit = true]', () => {
    const importId = 'import1';
    const subRecordMappingId = 'subRecord1';

    expectSaga(refreshGenerates, {isInit: true})
      .provide([
        [select(selectors.mapping), {mappings: [], importId, subRecordMappingId }],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), []],
        [select(selectors.resource, 'imports', importId), {_id: 'import1', adaptorType: 'NetSuiteDistributedImport'}],
      ])
      .not.put(actions.importSampleData.request(
        importId,
        {recordType: 'record1'},
        true
      ))
      .run();
  });

  test('should request import sample data in case of salesforce import', () => {
    const importId = 'import1';
    const connectionId = 'c1';

    expectSaga(refreshGenerates, {})
      .provide([
        [select(selectors.mapping), {mappings: [], importId }],
        [select(selectors.mappingGenerates, importId), [{id: 'a1[*].f1'}, {id: 'a2[*].f1'}]],
        [select(selectors.resource, 'imports', importId), {_id: 'import1', adaptorType: 'SalesforceImport', _connectionId: connectionId, salesforce: {sObjectType: 'sObject1'}}],
        [select(selectors.getMetadataOptions, {
          connectionId,
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/sObject1`,
          filterKey: 'salesforce-sObjects-childReferenceTo',
        }), {data: [
          {value: 'a1', childSObject: 'a1Object'},
          {value: 'a2', childSObject: 'a2Object'},
          {value: 'a3', childSObject: 'a3Object'},
        ]}],
      ])
      .not.put(actions.importSampleData.request(
        importId,
        {sObjects: ['sObject1', 'a1Object', 'a2Object']},
        true
      ))
      .run();
  });

  test('should request import sample data in case of salesforce import [isInit = true]', () => {
    const importId = 'import1';
    const connectionId = 'c1';

    expectSaga(refreshGenerates, {isInit: true})
      .provide([
        [select(selectors.mapping), {mappings: [], importId }],
        [select(selectors.mappingGenerates, importId, undefined), [{id: 'a1[*].f1'}, {id: 'a2[*].f1'}]],
        [select(selectors.resource, 'imports', importId), {_id: 'import1', adaptorType: 'SalesforceImport', _connectionId: connectionId, salesforce: {sObjectType: 'sObject1'}}],
        [select(selectors.getMetadataOptions, {
          connectionId,
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/sObject1`,
          filterKey: 'salesforce-sObjects-childReferenceTo',
        }), {data: [
          {value: 'a1', childSObject: 'a1Object'},
          {value: 'a2', childSObject: 'a2Object'},
          {value: 'a3', childSObject: 'a3Object'},
        ]}],
      ])
      .not.put(actions.importSampleData.request(
        importId,
        {sObjects: ['a1Object', 'a2Object']},
        true
      ))
      .run();
  });
  test('should request import sample data in case of salesforce import[isInit = true] [2]', () => {
    const importId = 'import1';
    const connectionId = 'c1';

    expectSaga(refreshGenerates, {isInit: true})
      .provide([
        [select(selectors.mapping), {mappings: [], importId }],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.resource, 'imports', importId), {_id: 'import1', adaptorType: 'SalesforceImport', _connectionId: connectionId, salesforce: {sObjectType: 'sObject1'}}],
        [select(selectors.getMetadataOptions, {
          connectionId,
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/sObject1`,
          filterKey: 'salesforce-sObjects-childReferenceTo',
        }), {data: [
          {value: 'a1', childSObject: 'a1Object'},
          {value: 'a2', childSObject: 'a2Object'},
          {value: 'a3', childSObject: 'a3Object'},
        ]}],
      ])
      .not.put(actions.importSampleData.request(
        importId,
        {sObjects: []},
        true
      ))
      .run();
  });
});

describe('mappingInit saga', () => {
  const flowId = 'f1';
  const importId = 'i1';
  const exportId = 'e1';

  test('should call fetchRequiredMappingData', () => {
    expectSaga(mappingInit, {flowId, importId})
      .call(fetchRequiredMappingData, {
        flowId,
        importId,
        subRecordMappingId: undefined,
      })
      .run();
  });

  test('should trigger mapping init failed action in case of invalid importId', () => {
    expectSaga(mappingInit, {flowId, importId})
      .provide([
        [select(selectors.resource, 'imports', importId), null],
      ])
      .put(actions.mapping.initFailed())
      .run();
  });

  test('should trigger mapping init correctly for FTPImport', () => {
    const mock = jest.spyOn(shortid, 'generate');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData), {}],
        [select(selectors.resource, 'imports', importId), {_id: importId, adaptorType: 'FTPImport', lookups: [], mapping: {fields: [{extract: 'e1', generate: 'g1'}], lists: [{generate: 'l1', fields: [{extract: 'x', generate: 'y'}]}]}}],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
      ])
      .put(actions.mapping.initComplete({
        mappings: [
          {extract: 'e1', generate: 'g1', key: 'mock_key'},
          {extract: 'x', generate: 'l1[*].y', useFirstRow: true, key: 'mock_key'},
        ],
        lookups: [],
        flowId,
        importId,
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
      }))
      .run();
    mock.mockRestore();
  });

  test('should trigger mapping init correctly for Netsuite import', () => {
    const mock = jest.spyOn(shortid, 'generate');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData), {}],
        [select(selectors.resource, 'imports', importId), {_id: importId, adaptorType: 'NetSuiteDistributedImport', lookups: [], netsuite_da: {mapping: {fields: [{extract: 'e1', generate: 'g1'}], lists: [{generate: 'l1', fields: [{extract: 'x', generate: 'y'}]}]}}}],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [select(selectors.mappingNSRecordType, importId), 'recordType'],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
      ])
      .put(actions.mapping.initComplete({
        mappings: [
          {extract: 'e1', generate: 'g1', key: 'mock_key', useAsAnInitializeValue: false },
          {extract: 'x', generate: 'l1[*].y', useFirstRow: true, key: 'mock_key'},
        ],
        lookups: [],
        flowId,
        importId,
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
      }))
      .run();
    mock.mockRestore();
  });

  test('should trigger mapping init correctly for Netsuite subrecord import mapping', () => {
    const subRecordMappingId = 'item[*].celigo_inventorydetail';
    const mock = jest.spyOn(shortid, 'generate');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    expectSaga(mappingInit, {flowId, importId, subRecordMappingId})
      .provide([
        [call(fetchRequiredMappingData), {}],
        [select(selectors.resource, 'imports', importId), {_id: importId, adaptorType: 'NetSuiteDistributedImport', lookups: [], netsuite_da: {mapping: {fields: [{extract: 'e1', generate: 'g1'}], lists: [{generate: 'item', fields: [{generate: 'celigo_inventorydetail', subRecordMapping: {jsonPath: '$', lookups: [], mapping: {recordType: 'inventorydetail', fields: [{extract: 'a', generate: 'b'}], lists: []}}}]}]}}}],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [select(selectors.mappingNSRecordType, importId, subRecordMappingId), 'inventorydetail'],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
      ])
      .put(actions.mapping.initComplete({
        mappings: [
          {extract: 'a', generate: 'b', key: 'mock_key', useAsAnInitializeValue: false },
        ],
        lookups: [],
        flowId,
        importId,
        subRecordMappingId,
        isGroupedSampleData: true,
      }))
      .run();
    mock.mockRestore();
  });

  test('should trigger mapping init correctly for assistants', () => {
    const mock = jest.spyOn(shortid, 'generate');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData), {}],
        [select(selectors.resource, 'imports', importId), {
          _id: importId,
          assistantMetadata: {lookups: {}, operation: 'create_organization_fields', resource: 'organization_fields', version: 'v2'},
          adaptorType: 'RESTImport',
          assistant: 'zendesk',
          lookups: [],
          mapping: {
            fields: [{generate: 'a', extract: 'b'}],
            lists: [],
          },
        }],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [select(selectors.assistantData, {
          adaptorType: 'RESTImport',
          assistant: 'zendesk',
        }), undefined],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
      ])
      .put(actions.mapping.initComplete({
        mappings: [
          {extract: 'b', generate: 'a', key: 'mock_key'},
        ],
        lookups: [],
        flowId,
        importId,
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
      }))
      .run();
    mock.mockRestore();
  });

  test('should trigger mapping init correctly for IA', () => {
    const mock = jest.spyOn(shortid, 'generate');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData), {}],
        [select(selectors.resource, 'imports', importId), {
          _id: importId,
          _connectorId: '_c1',
          _integrationId: '_i1',
          adaptorType: 'RESTImport',
          externalId: 'e1',
          lookups: [],
          mapping: {
            fields: [{generate: 'a', extract: 'b'}],
            lists: [],
          },
        }],
        [select(selectors.integrationAppMappingMetadata, '_i1'), {mappingMetadata: {}}],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [select(selectors.assistantData, {
          adaptorType: 'RESTImport',
          assistant: 'zendesk',
        }), undefined],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
      ])
      .put(actions.mapping.initComplete({
        mappings: [
          {extract: 'b', generate: 'a', key: 'mock_key'},
        ],
        lookups: [],
        flowId,
        importId,
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
      }))
      .run();
    mock.mockRestore();
  });
});

describe('saveMappings saga', () => {
  const flowId = 'f1';
  const importId = 'i1';
  const exportId = 'e1';

  test('should trigger mapping saveFailed action in case of incorrect importId', () => {
    expectSaga(saveMappings)
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1', lookupName: 'l1'}],
          lookups: [{name: 'l1'}],
          importId,
          flowId,
        }],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.resource, 'imports', importId), null],
      ])
      .put(actions.mapping.saveFailed())
      .run();
  });

  test('should trigger mapping save correctly for Netsuite Import', () => {
    expectSaga(saveMappings)
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), {_id: importId, name: 'n1', lookups: [], adaptorType: 'NetSuiteDistributedImport', netsuite_da: {recordType: 'account', mapping: {fields: [], lists: []}}}],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.mappingNSRecordType, importId), 'account'],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(commitStagedChanges, {
          resourceType: 'imports',
          id: importId,
          scope: SCOPES.VALUE,
          context: { flowId },
        }), {}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .put(actions.resource.patchStaged(importId, [
        {
          op: 'replace',
          path: '/netsuite_da/mapping',
          value: {fields: [{generate: 'g1', extract: 'e1', internalId: false}], lists: []},
        },
        {
          op: 'replace',
          path: '/netsuite_da/lookups',
          value: [],
        },
      ], SCOPES.VALUE))
      .call(commitStagedChanges, {
        resourceType: 'imports',
        id: importId,
        scope: SCOPES.VALUE,
        context: { flowId },
      })
      .put(actions.mapping.saveComplete())
      .run();
  });

  test('should trigger mapping save failed action when api fails to save', () => {
    expectSaga(saveMappings)
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), {_id: importId, name: 'n1', lookups: [], adaptorType: 'NetSuiteDistributedImport', netsuite_da: {recordType: 'account', mapping: {fields: [], lists: []}}}],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.mappingNSRecordType, importId), 'account'],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(commitStagedChanges, {
          resourceType: 'imports',
          id: importId,
          scope: SCOPES.VALUE,
          context: { flowId },
        }), {error: {}}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .put(actions.resource.patchStaged(importId, [
        {
          op: 'replace',
          path: '/netsuite_da/mapping',
          value: {fields: [{generate: 'g1', extract: 'e1', internalId: false}], lists: []},
        },
        {
          op: 'replace',
          path: '/netsuite_da/lookups',
          value: [],
        },
      ], SCOPES.VALUE))
      .call(commitStagedChanges, {
        resourceType: 'imports',
        id: importId,
        scope: SCOPES.VALUE,
        context: { flowId },
      })
      .put(actions.mapping.saveFailed())
      .run();
  });

  test('should trigger mapping save correctly for Netsuite subrecord import', () => {
    const subRecordMappingId = 'item[*].celigo_inventorydetail';

    expectSaga(saveMappings)
      .provide([
        [select(selectors.mapping), {
          subRecordMappingId,
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), {
          _id: importId,
          adaptorType: 'NetSuiteDistributedImport',
          lookups: [],
          netsuite_da: {
            mapping: {
              fields: [
                {extract: 'e1', generate: 'g1'},
              ],
              lists: [
                {
                  generate: 'item',
                  fields: [
                    {
                      generate: 'celigo_inventorydetail',
                      subRecordMapping: {
                        jsonPath: '$',
                        lookups: [],
                        mapping: {
                          recordType: 'inventorydetail',
                          fields: [{extract: 'a', generate: 'b'}],
                          lists: []},
                      },
                    },
                  ],
                },
              ],
            },
          },
        }],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), []],
        [select(selectors.mappingNSRecordType, importId, subRecordMappingId), 'inventorydetail'],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(commitStagedChanges, {
          resourceType: 'imports',
          id: importId,
          scope: SCOPES.VALUE,
          context: { flowId },
        }), {}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .put(actions.resource.patchStaged(importId, [
        {
          op: 'replace',
          path: '/netsuite_da/mapping',
          value: {
            fields: [
              {extract: 'e1', generate: 'g1'},
            ],
            lists: [
              {generate: 'item',
                fields:
                [{
                  generate: 'celigo_inventorydetail',
                  subRecordMapping: {
                    jsonPath: '$',
                    lookups: [],
                    mapping: {
                      fields: [{
                        extract: 'e1', generate: 'g1', internalId: false,
                      }],
                      lists: [],
                    },
                  },
                },
                ],
              },
            ],
          },
        }], SCOPES.VALUE))
      .call(commitStagedChanges, {
        resourceType: 'imports',
        id: importId,
        scope: SCOPES.VALUE,
        context: { flowId },
      })
      .put(actions.mapping.saveComplete())
      .run();
  });
});

describe('previewMappings saga', () => {
  const flowId = 'f1';
  const importId = 'i1';
  const exportId = 'e1';
  const connectionId = 'conn1';

  test('should trigger mapping preview action in case of incorrect importId', () => {
    expectSaga(previewMappings)
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1', lookupName: 'l1'}],
          lookups: [{name: 'l1'}],
          importId,
          flowId,
        }],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.resource, 'imports', importId), null],
      ])
      .put(actions.mapping.previewFailed())
      .run();
  });

  test('should trigger mapping preview correctly for Netsuite Import', () => {
    const importRes = {_id: importId, _connectionId: connectionId, name: 'n1', lookups: [], adaptorType: 'NetSuiteDistributedImport', netsuite_da: {recordType: 'account', mapping: {fields: [], lists: []}}};

    expectSaga(previewMappings)
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.mappingNSRecordType, importId), 'account'],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: `/netsuiteDA/previewImportMappingFields?_connectionId=${connectionId}`,
          opts: {
            method: 'PUT',
            body: {
              data: [[]],
              celigo_resource: 'previewImportMappingFields',
              importConfig: { recordType: 'account', mapping: {fields: [{extract: 'e1', generate: 'g1', internalId: false}], lists: []}, lookups: [] },
            },
          },
          message: 'Loading',
        }), {preview: 'xyz'}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .call(apiCallWithRetry, {
        path: `/netsuiteDA/previewImportMappingFields?_connectionId=${connectionId}`,
        opts: {
          method: 'PUT',
          body: {
            data: [[]],
            celigo_resource: 'previewImportMappingFields',
            importConfig: { recordType: 'account', mapping: {fields: [{extract: 'e1', generate: 'g1', internalId: false}], lists: []}, lookups: [] },
          },
        },
        message: 'Loading',
      })
      .put(actions.mapping.previewReceived({preview: 'xyz'}))
      .run();
  });

  test('should trigger mapping preview failed action correctly for Netsuite Import', () => {
    const importRes = {_id: importId, _connectionId: connectionId, name: 'n1', lookups: [], adaptorType: 'NetSuiteDistributedImport', netsuite_da: {recordType: 'account', mapping: {fields: [], lists: []}}};

    expectSaga(previewMappings)
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.mappingNSRecordType, importId), 'account'],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: `/netsuiteDA/previewImportMappingFields?_connectionId=${connectionId}`,
          opts: {
            method: 'PUT',
            body: {
              data: [[]],
              celigo_resource: 'previewImportMappingFields',
              importConfig: { recordType: 'account', mapping: {fields: [{extract: 'e1', generate: 'g1', internalId: false}], lists: []}, lookups: [] },
            },
          },
          message: 'Loading',
        }), {data: {returnedObjects: {mappingErrors: [{error: 'xyz'}]}}}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .call(apiCallWithRetry, {
        path: `/netsuiteDA/previewImportMappingFields?_connectionId=${connectionId}`,
        opts: {
          method: 'PUT',
          body: {
            data: [[]],
            celigo_resource: 'previewImportMappingFields',
            importConfig: { recordType: 'account', mapping: {fields: [{extract: 'e1', generate: 'g1', internalId: false}], lists: []}, lookups: [] },
          },
        },
        message: 'Loading',
      })
      .put(actions.mapping.previewFailed())
      .run();
  });

  test('should trigger mapping preview correctly for Netsuite subrecord import', () => {
    const subRecordMappingId = 'item[*].celigo_inventorydetail';

    expectSaga(previewMappings)
      .provide([
        [select(selectors.mapping), {
          subRecordMappingId,
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), {
          _id: importId,
          adaptorType: 'NetSuiteDistributedImport',
          lookups: [],
          _connectionId: connectionId,
          netsuite_da: {
            mapping: {
              fields: [
                {extract: 'e1', generate: 'g1'},
              ],
              lists: [
                {
                  generate: 'item',
                  fields: [
                    {
                      generate: 'celigo_inventorydetail',
                      subRecordMapping: {
                        jsonPath: '$',
                        lookups: [],
                        mapping: {
                          recordType: 'inventorydetail',
                          fields: [{extract: 'a', generate: 'b'}],
                          lists: []},
                      },
                    },
                  ],
                },
              ],
            },
          },
        }],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), []],
        [select(selectors.mappingNSRecordType, importId, subRecordMappingId), 'inventorydetail'],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: `/netsuiteDA/previewImportMappingFields?_connectionId=${connectionId}`,
          opts: {method: 'PUT', body: {data: [[]], celigo_resource: 'previewImportMappingFields', importConfig: {mapping: {fields: [{extract: 'e1', generate: 'g1'}], lists: [{generate: 'item', fields: [{generate: 'celigo_inventorydetail', subRecordMapping: {jsonPath: '$', lookups: [], mapping: {fields: [{extract: 'e1', generate: 'g1', internalId: false}], lists: []}}}]}]}}}},
          message: 'Loading',
        }), {previewData: 'xyz'}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],
      ])
      .call(apiCallWithRetry, {
        path: `/netsuiteDA/previewImportMappingFields?_connectionId=${connectionId}`,
        opts: {method: 'PUT', body: {data: [[]], celigo_resource: 'previewImportMappingFields', importConfig: {mapping: {fields: [{extract: 'e1', generate: 'g1'}], lists: [{generate: 'item', fields: [{generate: 'celigo_inventorydetail', subRecordMapping: {jsonPath: '$', lookups: [], mapping: {fields: [{extract: 'e1', generate: 'g1', internalId: false}], lists: []}}}]}]}}}},
        message: 'Loading',
      })
      .put(actions.mapping.previewReceived({previewData: 'xyz'}))
      .run();
  });

  test('should trigger mapping preview success action correctly for Salesforce Import', () => {
    const importRes = {
      _id: importId,
      _connectionId: connectionId,
      name: 'n1',
      lookups: [
      ],
      adaptorType: 'SalesforceImport',
      mapping: {
        fields: [],
        lists: [],
      },
      salesforce: {
        sObjectType: 'account',
      },
    };

    expectSaga(previewMappings)
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: `/connections/${connectionId}/mappingPreview`,
          opts: {
            method: 'PUT',
            body: {
              data: [],
              importConfig: {
                _id: 'i1',
                _connectionId: 'conn1',
                name: 'n1',
                lookups: [],
                adaptorType: 'SalesforceImport',
                mapping: {
                  fields: [
                    {
                      extract: 'e1',
                      generate: 'g1',
                    },
                  ],
                  lists: [],
                },
                salesforce: {
                  sObjectType: 'account',
                  lookups: [],
                },
              },
            },
          },
          message: 'Loading',
        }), {previewData: 'xyz'}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .call(apiCallWithRetry, {
        path: `/connections/${connectionId}/mappingPreview`,
        opts: {
          method: 'PUT',
          body: {
            data: [

            ],
            importConfig: {
              _id: 'i1',
              _connectionId: 'conn1',
              name: 'n1',
              lookups: [],
              adaptorType: 'SalesforceImport',
              mapping: {
                fields: [
                  {
                    extract: 'e1',
                    generate: 'g1',
                  },
                ],
                lists: [],
              },
              salesforce: {
                sObjectType: 'account',
                lookups: [],
              },
            },
          },
        },
        message: 'Loading',
      })
      .put(actions.mapping.previewReceived({previewData: 'xyz'}))
      .run();
  });

  test('should trigger mapping preview success action correctly for HTTPImport Import', () => {
    const importRes = {
      _id: importId,
      _connectionId: connectionId,
      name: 'n1',
      http: {
        lookups: [],
      },
      adaptorType: 'HTTPImport',
      mapping: {
        fields: [],
        lists: [],
      },
    };

    expectSaga(previewMappings)
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: `/connections/${connectionId}/mappingPreview`,
          opts: {
            method: 'PUT',
            body: {
              data: [],
              importConfig: {
                _id: 'i1',
                _connectionId: 'conn1',
                name: 'n1',
                adaptorType: 'HTTPImport',
                http: {
                  lookups: [],
                },
                mapping: {
                  fields: [
                    {
                      extract: 'e1',
                      generate: 'g1',
                    },
                  ],
                  lists: [],
                },
              },
            },
          },
          message: 'Loading',
        }), {previewData: 'xyz'}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .call(apiCallWithRetry, {
        path: `/connections/${connectionId}/mappingPreview`,
        opts: {
          method: 'PUT',
          body: {
            data: [

            ],
            importConfig: {
              _id: 'i1',
              _connectionId: 'conn1',
              name: 'n1',
              http: {
                lookups: [],
              },
              adaptorType: 'HTTPImport',
              mapping: {
                fields: [
                  {
                    extract: 'e1',
                    generate: 'g1',
                  },
                ],
                lists: [],
              },
            },
          },
        },
        message: 'Loading',
      })
      .put(actions.mapping.previewReceived({previewData: 'xyz'}))
      .run();
  });
});

describe('validateMappings saga', () => {
  test('should not trigger mapping setValidation action if mappings are correct', () => expectSaga(validateMappings, {})
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}, {extract: 'e1', generate: 'g2'}],
        lookups: [],
      }],
    ])
    .not.put(actions.mapping.setValidationMsg())
    .run());

  test('should trigger mapping setValidation action if validation changes', () => expectSaga(validateMappings, {})
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}, {extract: 'e1', generate: 'g2'}],
        validationErrMsg: 'have some text',
        lookups: [],
      }],
    ])
    .put(actions.mapping.setValidationMsg(undefined))
    .run());

  test('should trigger mapping setValidation action if validation changes[2]', () => expectSaga(validateMappings, {})
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}, {generate: 'g2'}],
        lookups: [],
      }],
    ])
    .put(actions.mapping.setValidationMsg('Extract Fields missing for field(s): g2'))
    .run());
});

describe('checkForIncompleteSFGenerateWhilePatch saga', () => {
  const flowId = 'f1';
  const importId = 'imp1';
  const connectionId = 'c1';

  test('should not trigger mapping patchIncompleteGenerates action if field value doesnt contain "_child_"', () => expectSaga(checkForIncompleteSFGenerateWhilePatch, {field: 'generate', value: 'test'})
    .provide([
      [call(validateMappings), undefined],
    ])
    .not.put(actions.mapping.patchIncompleteGenerates())
    .run());

  test('should call validateMappings if field value doesnt contain "_child_"', () => expectSaga(checkForIncompleteSFGenerateWhilePatch, {field: 'generate', value: 'test'})
    .provide([
      [call(validateMappings), undefined],
    ])
    .call(validateMappings)
    .run());

  test('should not trigger mapping patchIncompleteGenerates for invalid importId', () => expectSaga(checkForIncompleteSFGenerateWhilePatch, {field: 'generate', value: 'test'})
    .provide([
      [call(validateMappings), undefined],
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}],
        lookups: [],
        importId,
        flowId,
      }],
      [select(selectors.resource, 'imports', importId), null],
    ])
    .not.put(actions.mapping.patchIncompleteGenerates())
    .run());

  test('should not trigger mapping patchIncompleteGenerates for non salesforce import', () => expectSaga(checkForIncompleteSFGenerateWhilePatch, {field: 'generate', value: 'test'})
    .provide([
      [call(validateMappings), undefined],
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}],
        lookups: [],
        importId,
        flowId,
      }],
      [select(selectors.resource, 'imports', importId), {adaptorType: 'xyz'}],
    ])
    .not.put(actions.mapping.patchIncompleteGenerates())
    .run());

  test('should not trigger mapping patchIncompleteGenerates for non generate fields', () => expectSaga(checkForIncompleteSFGenerateWhilePatch, {field: 'extract', value: 'test'})
    .provide([
      [call(validateMappings), undefined],
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}],
        lookups: [],
        importId,
        flowId,
      }],
      [select(selectors.resource, 'imports', importId), {adaptorType: 'SalesforceImport'}],
    ])
    .not.put(actions.mapping.patchIncompleteGenerates())
    .run());

  test('should trigger mapping patchIncompleteGenerates correctly', () => {
    const importRes = {
      _id: importId,
      _connectionId: connectionId,
      _integrationId: 'i1',
      _connectorId: 'conn1',
      lookups: [
      ],
      mapping: {
        fields: [],
        lists: [],
      },
      salesforce: {
        operation: 'addupdate',
        sObjectType: 'Product2',
        api: 'compositerecord',
      },
      adaptorType: 'SalesforceImport',
    };

    expectSaga(checkForIncompleteSFGenerateWhilePatch, {field: 'generate', value: '_child_Emails'})
      .provide([
        [call(validateMappings), undefined],
        [select(selectors.mappingGenerates, importId, undefined), [
          {
            id: '_child_Emails',
            name: 'Emails : Fields...',
            type: 'childRelationship',
            childSObject: 'EmailMessage',
            relationshipName: 'Emails',
          },
        ]],
        [select(selectors.mapping), {
          mappings: [{
            key: 'k1',
            generate: '_child_Emails',
          }],
          lookups: [],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
      ])
      .put(actions.mapping.patchIncompleteGenerates('k1', 'Emails'))
      .put(actions.importSampleData.request(
        importId,
        {sObjects: ['EmailMessage']}
      ))
      .run();
  });
});

describe('updateImportSampleData saga', () => {
  const importId = 'i1';

  test('should not do anything if incomplete generate list is empty', () => expectSaga(updateImportSampleData)
    .provide([
      [select(selectors.mapping), {mappings: []}],
    ])
    .not.put(actions.mapping.updateMappings())
    .run());

  test('should check for incomplete generate in mapping list and trigger update mapping action correctly', () => expectSaga(updateImportSampleData)
    .provide([
      [select(selectors.mapping), {importId, incompleteGenerates: [{key: 'k1', value: 'Assets'}], mappings: [{key: 'k1', generate: '_child_Emails'}]}],
      [select(selectors.mappingGenerates, importId, undefined), [
        {
          id: 'Assets[*].Id',
        },
        {
          id: 'Assets[*].ContactId',
        },

      ]],
    ])
    .put(actions.mapping.updateMappings([{key: 'k1', generate: 'Assets[*].Id' }]))
    .run());
});

describe('patchGenerateThroughAssistant saga', () => {
  test('should not do anything if lastModifiedRowKey = undefined', () => {
    const lastModifiedRowKey = undefined;

    expectSaga(patchGenerateThroughAssistant, {value: 'abc'})
      .provide([
        [select(selectors.mapping), {lastModifiedRowKey}],
      ])
      .not.put(actions.mapping.patchField('generate', lastModifiedRowKey, 'abc'))
      .run();
  });

  test('should trigger mapping patchField action if lastModifiedRowKey != undefined', () => {
    const lastModifiedRowKey = 'k1';

    expectSaga(patchGenerateThroughAssistant, {value: 'abc'})
      .provide([
        [select(selectors.mapping), { lastModifiedRowKey}],
      ])
      .put(actions.mapping.patchField('generate', lastModifiedRowKey, 'abc'))
      .run();
  });
});
