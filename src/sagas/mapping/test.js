import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import * as GenerateMediumId from '../../utils/string';
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
  getAutoMapperSuggestion,
} from '.';
import {requestSampleData as requestFlowSampleData, _getContextSampleData} from '../sampleData/flows';
import { commitStagedChanges } from '../resources';
import { autoEvaluateProcessorWithCancel } from '../editor';
import {generateId} from '../../utils/string';
import { MAPPING_DATA_TYPES } from '../../utils/mapping';
import errorMessageStore from '../../utils/errorStore';

jest.mock('../../utils/string');

describe('fetchRequiredMappingData saga', () => {
  test('should trigger mapping initFailed in case of invalid import id', () => {
    const flowId = 'flow1';
    const importId = 'import1';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), undefined],
      ])
      .put(actions.mapping.initFailed())
      .run();
  });
  test('should make requestImportSampleData call in case import sample data is not loaded', () => {
    const flowId = 'flow2';
    const importId = 'import2';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'import2', _connectionId: 'conn1', name: 'test'}],
        [select(selectors.resource, 'connections', 'conn1'), {_id: 'conn1', name: 'Conn 1'}],
        [select(selectors.getImportSampleData, importId, {}), {}],
      ])
      .call(requestFlowSampleData,
        {
          flowId,
          resourceId: importId,
          resourceType: 'imports',
          stage: 'importMappingExtract',
        }
      ).call(requestImportSampleData, {
        resourceId: importId,
        options: {},
      })
      .run();
  });
  test('should not make requestImportSampleData call in case import sample data is not loaded', () => {
    const flowId = 'flow3';
    const importId = 'import3';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'import3', name: 'test'}],
        [select(selectors.resource, 'connections', 'conn1'), {_id: 'conn1', name: 'Conn 1'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .call(requestFlowSampleData,
        {
          flowId,
          resourceId: importId,
          resourceType: 'imports',
          stage: 'importMappingExtract',
        }
      )
      .not.call(requestImportSampleData, {
        resourceId: importId,
        options: {},
      })
      .run();
  });

  test('should make requestFlowSampleData call', () => {
    const flowId = 'flow4';
    const importId = 'import4';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'import4', name: 'test'}],
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
    const flowId = 'flow5';
    const importId = 'import5';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'import5', name: 'test'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .not.call(requestAssistantMetadata)
      .run();
  });
  test('should not make requestAssistantMetadata call in case assistantType = financialforce', () => {
    const flowId = 'f1ow6';
    const importId = 'import6';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'import6', name: 'test', assistant: 'financialforce', type: 'rest'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .not.call(requestAssistantMetadata)
      .run();
  });

  test('should make requestAssistantMetadata call in case of assistants', () => {
    const flowId = 'flow7';
    const importId = 'import7';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'import7', name: 'test', assistant: 'any_other', type: 'rest'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
        [call(requestAssistantMetadata, {
          adaptorType: 'rest',
          assistant: 'any_other',
        }), {}],
      ])
      .call(requestAssistantMetadata, {
        adaptorType: 'rest',
        assistant: 'any_other',
      })
      .run();
  });

  test('should not make getIAMappingMetadata call in case of non-IA', () => {
    const flowId = 'flow8';
    const importId = 'import8';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'import8', name: 'test', type: 'rest'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
      ])
      .not.call(getIAMappingMetadata)
      .run();
  });
  test('should make getIAMappingMetadata call in case of IA', () => {
    const flowId = 'flow9';
    const importId = 'import9';

    expectSaga(fetchRequiredMappingData, { flowId, importId })
      .provide([
        [select(selectors.resource, 'imports', importId), {_id: 'import9', name: 'test', _connectorId: 'c1', _integrationId: 'iA1'}],
        [select(selectors.getImportSampleData, importId, {}), {status: 'received'}],
        [call(getIAMappingMetadata, {integrationId: 'iA1'}), undefined],
      ])
      .call(getIAMappingMetadata, {integrationId: 'iA1'})
      .run();
  });
});

describe('refreshGenerates saga', () => {
  test('should request import sample data in case where non SF/NS adaptor', () => {
    const importId = 'import11';

    expectSaga(refreshGenerates, {})
      .provide([
        [select(selectors.mapping), {mappings: [], importId}],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.resource, 'imports', importId), {_id: 'import11', adaptorType: 'anything_else'}],
      ])
      .put(actions.importSampleData.request(
        importId,
        {},
        true
      ))
      .run();
  });

  test('should request import sample data in case of Netsuite Import', () => {
    const importId = 'import12';

    expectSaga(refreshGenerates, {})
      .provide([
        [select(selectors.mapping), {mappings: [], importId}],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.resource, 'imports', importId), {_id: 'import12', adaptorType: 'NetSuiteImport'}],
      ])
      .put(actions.importSampleData.request(
        importId,
        {},
        true
      ))
      .run();
  });

  test('should request import sample data in case of Netsuite Subrecord Import Mapping', () => {
    const importId = 'import13';
    const subRecordMappingId = 'subRecord1';

    expectSaga(refreshGenerates, {})
      .provide([
        [select(selectors.mapping), {mappings: [], importId, subRecordMappingId }],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), []],
        [select(selectors.mappingNSRecordType, importId, subRecordMappingId), 'record1'],
        [select(selectors.resource, 'imports', importId), {_id: 'import13', adaptorType: 'NetSuiteDistributedImport'}],

      ])
      .put(actions.importSampleData.request(
        importId,
        {recordType: 'record1'},
        true
      ))
      .run();
  });

  test('should request import sample data in case of Netsuite Import [isInit = true]', () => {
    const importId = 'import14';
    const subRecordMappingId = 'subRecord1';

    expectSaga(refreshGenerates, {isInit: true})
      .provide([
        [select(selectors.mapping), {mappings: [], importId, subRecordMappingId }],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), []],
        [select(selectors.resource, 'imports', importId), {_id: 'import14', adaptorType: 'NetSuiteDistributedImport'}],
      ])
      .not.put(actions.importSampleData.request(
        importId,
        {recordType: 'record1'},
        true
      ))
      .run();
  });

  test('should request import sample data in case of salesforce import', () => {
    const importId = 'import15';
    const connectionId = 'c1';

    expectSaga(refreshGenerates, {})
      .provide([
        [select(selectors.mapping), {mappings: [], importId }],
        [select(selectors.mappingGenerates, importId), [{id: 'a1[*].f1'}, {id: 'a2[*].f1'}]],
        [select(selectors.resource, 'imports', importId), {_id: 'import15', adaptorType: 'SalesforceImport', _connectionId: connectionId, salesforce: {sObjectType: 'sObject1'}}],
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
    const importId = 'import16';
    const connectionId = 'c1';

    expectSaga(refreshGenerates, {isInit: true})
      .provide([
        [select(selectors.mapping), {mappings: [], importId }],
        [select(selectors.mappingGenerates, importId, undefined), [{id: 'a1[*].f1'}, {id: 'a2[*].f1'}]],
        [select(selectors.resource, 'imports', importId), {_id: 'import16', adaptorType: 'SalesforceImport', _connectionId: connectionId, salesforce: {sObjectType: 'sObject1'}}],
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
    const importId = 'import17';
    const connectionId = 'c1';

    expectSaga(refreshGenerates, {isInit: true})
      .provide([
        [select(selectors.mapping), {mappings: [], importId }],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.resource, 'imports', importId), {_id: 'import17', adaptorType: 'SalesforceImport', _connectionId: connectionId, salesforce: {sObjectType: 'sObject1'}}],
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
  test('should call fetchRequiredMappingData', () => {
    const flowId = 'flow22';
    const importId = 'import22';

    expectSaga(mappingInit, {flowId, importId})
      .call(fetchRequiredMappingData, {
        flowId,
        importId,
        subRecordMappingId: undefined,
      })
      .run();
  });

  test('should trigger mapping init failed action in case of invalid importId', () => {
    const flowId = 'flow23';
    const importId = 'import23';

    expectSaga(mappingInit, {flowId, importId})
      .provide([
        [select(selectors.resource, 'imports', importId), null],
      ])
      .put(actions.mapping.initFailed())
      .run();
  });

  test('should trigger mapping init correctly for FTPImport', async () => {
    const flowId = 'flow24';
    const importId = 'import24';
    const exportId = 'export24';
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    mock.mockReturnValue('mock_key');

    const saga1 = await expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId, subRecordMappingId: undefined}), {}],
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
        version: 1,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: [{key: 'mock_key', isEmptyRow: true, title: '', disabled: false, dataType: MAPPING_DATA_TYPES.STRING, sourceDataType: MAPPING_DATA_TYPES.STRING}],
        extractsTree: [
          {key: 'mock_key',
            title: '',
            dataType: '[object]',
            propName: '$',
            children: [
              {key: 'mock_key', parentKey: 'mock_key', title: '', jsonPath: 'id', propName: 'id', dataType: MAPPING_DATA_TYPES.STRING},
            ]}],
        isMonitorLevelAccess: false,
        destinationTree: [],
        requiredMappingsJsonPaths: [],
      }))
      .run();

    expect(saga1).toBeTruthy();
    mock.mockRestore();
  });

  test('should trigger mapping init correctly for Netsuite import', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    const flowId = 'flow25';
    const importId = 'import25';
    const exportId = 'export25';

    mock.mockReturnValue('mock_key');

    const saga2 = await expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId, subRecordMappingId: undefined}), {}],
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
        version: 1,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: undefined,
        extractsTree: undefined,
        isMonitorLevelAccess: false,
        importId,
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
        destinationTree: undefined,
        requiredMappingsJsonPaths: [],
      }))
      .run();

    expect(saga2).toBeTruthy();
    mock.mockRestore();
  });

  test('should trigger mapping init correctly for Netsuite subrecord import mapping', async () => {
    const subRecordMappingId = 'item[*].celigo_inventorydetail';
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    const flowId = 'flow26';
    const importId = 'import26';
    const exportId = 'export26';

    mock.mockReturnValue('mock_key');
    const saga3 = await expectSaga(mappingInit, {flowId, importId, subRecordMappingId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId, subRecordMappingId}), {}],
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
        version: 1,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: undefined,
        extractsTree: undefined,
        isMonitorLevelAccess: false,
        destinationTree: undefined,
        requiredMappingsJsonPaths: [],
      }))
      .run();

    expect(saga3).toBeTruthy();
    mock.mockRestore();
  });

  test('should trigger mapping init correctly for assistants', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    const flowId = 'flow27';
    const importId = 'import27';
    const exportId = 'export27';

    mock.mockReturnValue('mock_key');
    const saga4 = await expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId}), {}],
        [call(apiCallWithRetry, {path: '/ui/assistants/3dcart', opts: {method: 'GET'}}), {export: {}, import: {}}],
        [matchers.call.fn(_getContextSampleData), {}],
        [select(selectors.resource, 'imports', importId), {
          _id: importId,
          _connectionId: 'conn1',
          assistantMetadata: {lookups: {}, operation: 'create_organization_fields', resource: 'organization_fields', version: 'v2'},
          adaptorType: 'RESTImport',
          assistant: '3dcart',
          lookups: [],
          mapping: {
            fields: [{generate: 'a', extract: 'b'}],
            lists: [],
          },
        }],
        [select(selectors.hasLoadedAllResourceUIFields, []), true],
        [select(selectors.resource, 'connections', 'conn1'), {assistant: '3dcart'}],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
        [select(selectors.assistantData, {
          adaptorType: 'rest',
          assistant: '3dcart',
        }), {export: {}, import: {}}],
      ])
      .put(actions.flowData.init({refresh: false}))
      .put(actions.assistantMetadata.received({adaptorType: 'rest', assistant: '3dcart', metadata: {export: {}, import: {}}}))
      .put(actions.flowData.requestStage(flowId, 'import27', 'preMap'))
      .put(actions.flowData.requestStage(flowId, 'import27', 'inputFilter'))
      .put(actions.flowData.requestStage(flowId, 'import27', 'processedFlowInput'))
      .put(actions.flowData.requestStage(flowId, 'import27', 'flowInput'))
      .put(actions.flowData.receivedPreviewData(flowId, 'import27', undefined, 'flowInput'))
      .put(actions.flowData.receivedProcessorData(flowId, 'import27', 'processedFlowInput', {data: []}))
      .put(actions.flowData.receivedProcessorData(flowId, 'import27', 'inputFilter', {data: []}))
      .put(actions.flowData.receivedProcessorData(flowId, 'import27', 'preMap', {data: []}))
      .put(actions.mapping.initComplete({
        mappings: [{ generate: 'a', extract: 'b', key: 'mock_key' }],
        lookups: [],
        flowId: 'flow27',
        importId: 'import27',
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
        version: 1,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: [{
          key: 'mock_key',
          isEmptyRow: true,
          title: '',
          disabled: false,
          dataType: MAPPING_DATA_TYPES.STRING,
          sourceDataType: MAPPING_DATA_TYPES.STRING,
        }],
        extractsTree: [
          {key: 'mock_key',
            title: '',
            dataType: '[object]',
            propName: '$',
            children: [
              {key: 'mock_key', parentKey: 'mock_key', title: '', jsonPath: 'id', propName: 'id', dataType: MAPPING_DATA_TYPES.STRING},
            ]}],
        isMonitorLevelAccess: false,
        destinationTree: [],
        requiredMappingsJsonPaths: [],
      }))
      .run();

    expect(saga4).toBeTruthy();
    mock.mockRestore();
  });

  test('should trigger mapping init correctly for IA', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn
    const flowId = 'flow28';
    const importId = 'import28';
    const exportId = 'export28';

    mock.mockReturnValue('mock_key');
    const saga5 = await expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId}), {}],
        [call(apiCallWithRetry, {path: '/integrations/_i1/settings/getMappingMetadata',
          opts: {
            method: 'PUT',
            body: {},
          },
          hidden: true}), {}],
        [matchers.call.fn(_getContextSampleData), {}],
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
        [select(selectors.hasLoadedAllResourceUIFields, []), true],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
      ])
      .put(actions.flowData.init({refresh: false}))
      .put(actions.flowData.requestStage(flowId, 'import28', 'preMap'))
      .put(actions.flowData.requestStage(flowId, 'import28', 'inputFilter'))
      .put(actions.flowData.requestStage(flowId, 'import28', 'processedFlowInput'))
      .put(actions.flowData.requestStage(flowId, 'import28', 'flowInput'))
      .put(actions.flowData.receivedPreviewData(flowId, 'import28', undefined, 'flowInput'))
      .put(actions.flowData.receivedProcessorData(flowId, 'import28', 'processedFlowInput', {data: []}))
      .put(actions.flowData.receivedProcessorData(flowId, 'import28', 'inputFilter', {data: []}))
      .put(actions.flowData.receivedProcessorData(flowId, 'import28', 'preMap', {data: []}))
      .put(actions.mapping.initComplete({
        mappings: [
          {extract: 'b', generate: 'a', key: 'mock_key'},
        ],
        lookups: [],
        flowId,
        importId,
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
        version: 1,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: undefined,
        extractsTree: undefined,
        isMonitorLevelAccess: false,
        destinationTree: undefined,
        requiredMappingsJsonPaths: [],
      }))
      .run();

    expect(saga5).toBeTruthy();
    mock.mockRestore();
  });
  test('qqshould trigger mapping init correctly for IA which has mappings2', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn
    const flowId = 'flow28';
    const importId = 'import28';
    const exportId = 'export28';

    mock.mockReturnValue('mock_key');

    const saga5 = await expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId}), {}],
        [call(apiCallWithRetry, {path: '/integrations/_i1/settings/getMappingMetadata',
          opts: {
            method: 'PUT',
            body: {},
          },
          hidden: true}), {}],
        [matchers.call.fn(_getContextSampleData), {}],
        [select(selectors.resource, 'imports', importId), {
          _id: importId,
          _connectorId: '_c1',
          _integrationId: '_i1',
          adaptorType: 'RESTImport',
          externalId: 'e1',
          lookups: [],
          mappings: [{extract: 'id', generate: 'id', dataType: MAPPING_DATA_TYPES.STRING}],
        }],
        [select(selectors.integrationAppMappingMetadata, '_i1'), {mappingMetadata: {}}],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [select(selectors.hasLoadedAllResourceUIFields, []), true],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
      ])
      .put(actions.flowData.init({refresh: false}))
      .put(actions.flowData.requestStage(flowId, 'import28', 'preMap'))
      .put(actions.flowData.requestStage(flowId, 'import28', 'inputFilter'))
      .put(actions.flowData.requestStage(flowId, 'import28', 'processedFlowInput'))
      .put(actions.flowData.requestStage(flowId, 'import28', 'flowInput'))
      .put(actions.flowData.receivedPreviewData(flowId, 'import28', undefined, 'flowInput'))
      .put(actions.flowData.receivedProcessorData(flowId, 'import28', 'processedFlowInput', {data: []}))
      .put(actions.flowData.receivedProcessorData(flowId, 'import28', 'inputFilter', {data: []}))
      .put(actions.flowData.receivedProcessorData(flowId, 'import28', 'preMap', {data: []}))
      .put(actions.mapping.initComplete({
        mappings: [],
        lookups: [],
        flowId,
        importId,
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
        version: 2,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: [{
          key: 'mock_key',
          title: '',
          parentKey: undefined,
          parentExtract: undefined,
          disabled: false,
          hidden: undefined,
          className: undefined,
          isRequired: false,
          extract: 'id',
          generate: 'id',
          jsonPath: 'id',
          dataType: MAPPING_DATA_TYPES.STRING,
          sourceDataType: MAPPING_DATA_TYPES.STRING,
        }],
        extractsTree: [
          {key: 'mock_key',
            title: '',
            dataType: '[object]',
            propName: '$',
            children: [
              {key: 'mock_key', parentKey: 'mock_key', title: '', jsonPath: 'id', propName: 'id', dataType: MAPPING_DATA_TYPES.STRING},
            ]}],
        isMonitorLevelAccess: false,
        destinationTree: [],
        requiredMappingsJsonPaths: [],
      }))
      .run();

    expect(saga5).toBeTruthy();
    mock.mockRestore();
  });
  test('should not save v2 mappings in the state for non file and http/rest import', async () => {
    const flowId = 'flow24';
    const importId = 'import24';
    const exportId = 'export24';
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    const dbSaga = await expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId, subRecordMappingId: undefined}), {}],
        [select(selectors.resource, 'imports', importId), {_id: importId,
          adaptorType: 'RDBMSImport',
          lookups: [],
          mapping: {fields: [{extract: 'e1', generate: 'g1'}], lists: [{generate: 'l1', fields: [{extract: 'x', generate: 'y'}]}]},
          mappings: [{extract: 'id', generate: 'id', dataType: MAPPING_DATA_TYPES.STRING}],
        }],
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
        version: 1,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: undefined,
        extractsTree: undefined,
        isMonitorLevelAccess: false,
        destinationTree: undefined,
        requiredMappingsJsonPaths: [],
      }))
      .run();

    expect(dbSaga).toBeTruthy();
    mock.mockRestore();
  });
  test('should save v2 mappings in the state for file import with csv file type', async () => {
    const flowId = 'flow24';
    const importId = 'import24';
    const exportId = 'export24';
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    mock.mockReturnValue('mock_key');

    const as2Saga = await expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId, subRecordMappingId: undefined}), {}],
        [select(selectors.resource, 'imports', importId), {_id: importId,
          adaptorType: 'AS2Import',
          file: {type: 'csv'},
          lookups: [],
          mapping: {fields: [{extract: 'e1', generate: 'g1'}], lists: [{generate: 'l1', fields: [{extract: 'x', generate: 'y'}]}]},
        }],
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
        version: 1,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: [
          {key: 'mock_key',
            generateDisabled: true,
            title: '',
            disabled: false,
            dataType: 'objectarray',
            children: [
              {
                key: 'mock_key', parentKey: 'mock_key', isEmptyRow: true, title: '', disabled: false, dataType: MAPPING_DATA_TYPES.STRING, sourceDataType: MAPPING_DATA_TYPES.STRING,
              },
            ]}],
        extractsTree: [
          {key: 'mock_key',
            title: '',
            dataType: '[object]',
            propName: '$',
            children: [
              {key: 'mock_key', parentKey: 'mock_key', title: '', jsonPath: 'id', propName: 'id', dataType: MAPPING_DATA_TYPES.STRING},
            ]}],
        isMonitorLevelAccess: false,
        destinationTree: [],
        requiredMappingsJsonPaths: [],
      }))
      .run();

    expect(as2Saga).toBeTruthy();
    mock.mockRestore();
  });
  test('should save v2 mappings in the state for http/rest import', () => {
    const flowId = 'flow24';
    const importId = 'import24';
    const exportId = 'export24';

    generateId.mockReturnValue('unique-key');

    expectSaga(mappingInit, {flowId, importId})
      .provide([
        [call(fetchRequiredMappingData, {flowId, importId, subRecordMappingId: undefined}), {}],
        [select(selectors.resource, 'imports', importId), {_id: importId,
          adaptorType: 'HTTPImport',
          lookups: [],
          mappings: [{extract: 'id', generate: 'id', dataType: MAPPING_DATA_TYPES.STRING}],
        }],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: [{id: 'a'}]}],
      ])
      .put(actions.mapping.initComplete({
        mappings: [],
        lookups: [],
        flowId,
        importId,
        subRecordMappingId: undefined,
        isGroupedSampleData: true,
        version: 2,
        requiredMappings: [],
        importSampleData: undefined,
        v2TreeData: [{
          key: 'unique-key',
          title: '',
          parentKey: undefined,
          parentExtract: undefined,
          disabled: false,
          hidden: undefined,
          className: undefined,
          isRequired: false,
          extract: 'id',
          generate: 'id',
          jsonPath: 'id',
          dataType: MAPPING_DATA_TYPES.STRING,
          sourceDataType: MAPPING_DATA_TYPES.STRING,
        }],
        extractsTree: [
          {key: 'unique-key',
            title: '',
            dataType: '[object]',
            propName: '$',
            children: [
              {key: 'unique-key', parentKey: 'unique-key', title: '', jsonPath: 'id', propName: 'id', dataType: MAPPING_DATA_TYPES.STRING},
            ]}],
        isMonitorLevelAccess: false,
        destinationTree: [],
        requiredMappingsJsonPaths: [],
      }))
      .run();
  });
});

describe('saveMappings saga', () => {
  const flowId = 'f1';
  const importId = 'i1';
  const exportId = 'e1';

  test('should trigger mapping saveFailed action in case of incorrect importId', () => expectSaga(saveMappings)
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
    .run());

  test('should trigger mapping save correctly for Netsuite Import', () => expectSaga(saveMappings)
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}],
        lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
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
        value: [{ name: 'lookup2' }],
      },
    ]))
    .call(commitStagedChanges, {
      resourceType: 'imports',
      id: importId,
      context: { flowId },
    })
    .put(actions.mapping.saveComplete())
    .run());

  test('should trigger mapping save failed action when api fails to save', () => expectSaga(saveMappings)
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
    ]))
    .call(commitStagedChanges, {
      resourceType: 'imports',
      id: importId,
      context: { flowId },
    })
    .put(actions.mapping.saveFailed())
    .run());

  test('should trigger mapping save correctly for Netsuite subrecord import', () => {
    const subRecordMappingId = 'item[*].celigo_inventorydetail';

    expectSaga(saveMappings)
      .provide([
        [select(selectors.mapping), {
          subRecordMappingId,
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
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
                    lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
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
        }]))
      .call(commitStagedChanges, {
        resourceType: 'imports',
        id: importId,
        context: { flowId },
      })
      .put(actions.mapping.saveComplete())
      .run();
  });
  test('should trigger patch staged action for v2 mappings as well if adaptor supports v2 mappings and v2 mappings are changed', () => expectSaga(saveMappings)
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}],
        lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
        v2TreeData: [{extract: 'id', generate: 'new-id', dataType: MAPPING_DATA_TYPES.STRING, key: 'unique'}],
        v2TreeDataCopy: [{extract: 'id', generate: 'id', dataType: MAPPING_DATA_TYPES.STRING, key: 'unique'}],
        importId,
        flowId,
      }],
      [select(selectors.resource, 'imports', importId), {_id: importId, name: 'n1', lookups: [], adaptorType: 'HTTPImport'}],
      [select(selectors.mappingGenerates, importId, undefined), []],
      [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
      [select(selectors.isMapper2Supported), true],
      [select(selectors.v2MappingChanged), true],
      [call(commitStagedChanges, {
        resourceType: 'imports',
        id: importId,
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
        path: '/mapping',
        value: {fields: [{generate: 'g1', extract: 'e1'}], lists: []},
      },
      {
        op: 'replace',
        path: '/http/lookups',
        value: [{ name: 'lookup2' }],
      },
      {
        op: 'replace',
        path: '/mappings',
        value: [{
          generate: 'new-id',
          dataType: MAPPING_DATA_TYPES.STRING,
          extract: 'id',
          status: 'Active',
          sourceDataType: MAPPING_DATA_TYPES.STRING,
          description: undefined,
          extractDateFormat: undefined,
          extractDateTimezone: undefined,
          generateDateFormat: undefined,
          generateDateTimezone: undefined,
          hardCodedValue: undefined,
          lookupName: undefined,
          default: undefined,
          conditional: {when: undefined},
        }],
      },
    ]))
    .call(commitStagedChanges, {
      resourceType: 'imports',
      id: importId,
      context: { flowId },
    })
    .put(actions.mapping.saveComplete())
    .run());
  test('should not trigger patch staged action for v2 mappings path if adaptor supports v2 mappings and no v2 mappings are changed', () => expectSaga(saveMappings)
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}],
        lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
        v2TreeData: [{extract: 'id', generate: 'id', dataType: MAPPING_DATA_TYPES.STRING, key: 'unique'}],
        v2TreeDataCopy: [{extract: 'id', generate: 'id', dataType: MAPPING_DATA_TYPES.STRING, key: 'unique'}],
        importId,
        flowId,
      }],
      [select(selectors.resource, 'imports', importId), {_id: importId, name: 'n1', lookups: [], adaptorType: 'HTTPImport'}],
      [select(selectors.mappingGenerates, importId, undefined), []],
      [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
      [select(selectors.isMapper2Supported), true],
      [select(selectors.v2MappingChanged), false],
      [call(commitStagedChanges, {
        resourceType: 'imports',
        id: importId,
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
        path: '/mapping',
        value: {fields: [{generate: 'g1', extract: 'e1'}], lists: []},
      },
      {
        op: 'replace',
        path: '/http/lookups',
        value: [{ name: 'lookup2' }],
      },
    ]))
    .call(commitStagedChanges, {
      resourceType: 'imports',
      id: importId,
      context: { flowId },
    })
    .put(actions.mapping.saveComplete())
    .run());
});

describe('previewMappings saga', () => {
  const flowId = 'f1';
  const importId = 'i1';
  const exportId = 'e1';
  const connectionId = 'conn1';

  test('should trigger mapping preview failed action in case of incorrect importId', () => expectSaga(previewMappings, {})
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
    .run());

  test('should trigger mapping preview correctly for Netsuite Import', () => {
    const importRes = {_id: importId, _connectionId: connectionId, name: 'n1', lookups: [], adaptorType: 'NetSuiteDistributedImport', netsuite_da: {recordType: 'account', mapping: {fields: [], lists: []}}};

    expectSaga(previewMappings, {})
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

    expectSaga(previewMappings, {})
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
      .put(actions.mapping.previewFailed('xyz'))
      .run();
  });
  test('should trigger mapping preview failed action correctly for Salesforce Import', () => {
    const importRes = {
      _id: importId,
      _connectionId: 'conn111',
      name: 'n1',
      lookups: [],
      adaptorType: 'SalesforceImport',
      mapping: {
        fields: [],
        lists: [],
      },
      salesforce: {
        sObjectType: 'account',
      },
    };

    expectSaga(previewMappings, {})
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: '/connections/conn111/mappingPreview',
          opts: {
            method: 'PUT',
            body: {
              data: [],
              importConfig:
                 {
                   _id: 'i1',
                   _connectionId: 'conn111',
                   name: 'n1',
                   lookups: [],
                   adaptorType: 'SalesforceImport',
                   mapping: {fields: [{extract: 'e1', generate: 'g1'}],
                     lists: [],
                   },
                   salesforce: {
                     sObjectType: 'account',
                     lookups: [{name: 'lookup2'}],
                   },
                 },
            },
          },
          message: 'Loading',
        }
        ), [{errors: [{message: 'invalid lookup'}]}]],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .put(actions.mapping.previewFailed({message: 'invalid lookup'}))
      .run();
  });
  test('should trigger mapping preview correctly for Netsuite subrecord import', () => {
    const subRecordMappingId = 'item[*].celigo_inventorydetail';
    const requestBody = {
      data: [[]],
      celigo_resource: 'previewImportMappingFields',
      importConfig: {
        mapping: {fields: [{extract: 'e1', generate: 'g1'}],
          lists: [
            {generate: 'item',
              fields: [
                {generate: 'celigo_inventorydetail',
                  subRecordMapping: {
                    jsonPath: '$',
                    lookups: [{name: 'lookup2'}],
                    mapping: {fields: [{extract: 'e1', generate: 'g1', internalId: false}], lists: []},
                  }}]}]}}};

    expectSaga(previewMappings, {})
      .provide([
        [select(selectors.mapping), {
          subRecordMappingId,
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
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
          opts: {
            method: 'PUT',
            body: requestBody,
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
        path: `/netsuiteDA/previewImportMappingFields?_connectionId=${connectionId}`,
        opts: {method: 'PUT',
          body: requestBody},
        message: 'Loading'})
      .put(actions.mapping.previewReceived({previewData: 'xyz'}))
      .run();
  });

  test('should trigger mapping preview success action correctly for Salesforce Import', () => {
    const importRes = {
      _id: importId,
      _connectionId: 'conn11',
      name: 'n1',
      lookups: [],
      adaptorType: 'SalesforceImport',
      mapping: {
        fields: [],
        lists: [],
      },
      salesforce: {
        sObjectType: 'account',
      },
    };
    const requestBody = {
      data: [],
      importConfig: {
        _id: 'i1',
        _connectionId: 'conn11',
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
          lookups: [{name: 'lookup2'}],
        },
      },
    };

    expectSaga(previewMappings, {})
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: '/connections/conn11/mappingPreview',
          opts: {
            method: 'PUT',
            body: requestBody,
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
        path: '/connections/conn11/mappingPreview',
        opts: {
          method: 'PUT',
          body: requestBody,
        },
        message: 'Loading',
      })
      .put(actions.mapping.previewReceived({previewData: 'xyz'}))
      .run();
  });
  test('should trigger mapping preview success action correctly with editor sample data', () => {
    const importRes = {
      _id: importId,
      _connectionId: 'conn11',
      name: 'n1',
      lookups: [],
      adaptorType: 'SalesforceImport',
      mapping: {
        fields: [],
        lists: [],
      },
      salesforce: {
        sObjectType: 'account',
      },
    };
    const editorId = '123';

    expectSaga(previewMappings, {editorId})
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: '/connections/conn11/mappingPreview',
          opts: {
            method: 'PUT',
            body: {
              data: [],
              importConfig: {
                _id: 'i1',
                _connectionId: 'conn11',
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
        [select(selectors.editor, editorId), {data: [{id: '1'}]}],
      ])
      .call(apiCallWithRetry, {
        path: '/connections/conn11/mappingPreview',
        opts: {
          method: 'PUT',
          body: {
            data: [{id: '1'}],
            importConfig: {
              _id: 'i1',
              _connectionId: 'conn11',
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
      _connectionId: 'connection2',
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
    const requestBody = {
      data: [],
      importConfig: {
        _id: 'i1',
        _connectionId: 'connection2',
        name: 'n1',
        http: {
          lookups: [{name: 'lookup2'}],
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
    };

    expectSaga(previewMappings, {})
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: '/connections/connection2/mappingPreview',
          opts: {
            method: 'PUT',
            body: requestBody,
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
        path: '/connections/connection2/mappingPreview',
        opts: {
          method: 'PUT',
          body: requestBody,
        },
        message: 'Loading',
      })
      .put(actions.mapping.previewReceived({previewData: 'xyz'}))
      .run();
  });
  test('should trigger mapping preview failed action if api call errors', () => {
    const importRes = {
      _id: importId,
      _connectionId: 'conn3',
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
    const requestBody = {
      data: [

      ],
      importConfig: {
        _id: 'i1',
        _connectionId: 'conn3',
        name: 'n1',
        http: {
          lookups: [{name: 'lookup2'}],
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
    };

    expectSaga(previewMappings, {})
      .provide([
        [select(selectors.mapping), {
          mappings: [{extract: 'e1', generate: 'g1'}],
          lookups: [{name: 'lookup1', isConditionalLookup: true}, {name: 'lookup2'}],
          importId,
          flowId,
        }],
        [select(selectors.resource, 'imports', importId), importRes],
        [select(selectors.mappingGenerates, importId, undefined), []],
        [select(selectors.firstFlowPageGenerator, flowId), {_id: exportId}],
        [call(apiCallWithRetry, {
          path: '/connections/conn3/mappingPreview',
          opts: {
            method: 'PUT',
            body: requestBody,
          },
          message: 'Loading',
        }), throwError('api failure')],
        [select(selectors.getSampleDataContext, {
          flowId,
          resourceId: importId,
          stage: 'importMappingExtract',
          resourceType: 'imports',
        }), {data: []}],

      ])
      .call(apiCallWithRetry, {
        path: '/connections/conn3/mappingPreview',
        opts: {
          method: 'PUT',
          body: requestBody,
        },
        message: 'Loading',
      })
      .put(actions.mapping.previewFailed('api failure'))
      .run();
  });
});

describe('validateMappings saga', () => {
  test('should not trigger mapping setValidation action if mappings are correct', () => expectSaga(validateMappings, {})
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}, {extract: 'e1', generate: 'g2'}],
        lookups: [],
        importId: '123',
      }],
      [call(autoEvaluateProcessorWithCancel, { id: 'mappings-123' }), undefined],
    ])
    .not.put(actions.mapping.setValidationMsg())
    .call(autoEvaluateProcessorWithCancel, { id: 'mappings-123' })
    .run());

  test('should trigger mapping setValidation action if validation changes', () => expectSaga(validateMappings, {})
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}, {extract: 'e1', generate: 'g2'}],
        validationErrMsg: 'have some text',
        lookups: [],
        importId: '123',
      }],
      [call(autoEvaluateProcessorWithCancel, { id: 'mappings-123' }), undefined],
    ])
    .put(actions.mapping.setValidationMsg(undefined))
    .call(autoEvaluateProcessorWithCancel, { id: 'mappings-123' })
    .run());

  test('should trigger mapping setValidation action if validation changes[2]', () => expectSaga(validateMappings, {})
    .provide([
      [select(selectors.mapping), {
        mappings: [{extract: 'e1', generate: 'g1'}, {generate: 'g2'}],
        lookups: [],
        importId: '123',
      }],
      [call(autoEvaluateProcessorWithCancel, { id: 'mappings-123' }), undefined],
    ])
    .put(actions.mapping.setValidationMsg(errorMessageStore('MAPPER1_MISSING_EXTRACT', {fields: 'g2'})))
    .call(autoEvaluateProcessorWithCancel, { id: 'mappings-123' })
    .run());
});

describe('checkForIncompleteSFGenerateWhilePatch saga', () => {
  const flowId = 'flow31';
  const importId = 'import31';
  const connectionId = 'connection31';

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

  test('should trigger mapping patchIncompleteGenerates correctly for salesforce import', () => {
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
  const importId = 'import41';

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

describe('getAutoMapperSuggestion saga', () => {
  const importId = 'import51';
  const flowId = 'flow51';
  const exportId = 'export51';
  const subRecordMappingId = undefined;

  test('should trigger autoMapper fail action in case of incorrect import id', () => expectSaga(getAutoMapperSuggestion, {importId, flowId})
    .provide([
      [select(selectors.mapping), {mappings: [], flowId, importId, subRecordMappingId}],
      [select(selectors.firstFlowPageGenerator, flowId), {name: 'a'}],
      [select(selectors.resource, 'imports', importId), null],
    ])
    .put(actions.mapping.autoMapper.failed('error', 'Failed to fetch mapping suggestions.'))
    .run());

  test('should trigger autoMapper received action correctly', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    const mapperSaga = await expectSaga(getAutoMapperSuggestion, {importId, flowId})
      .provide([
        [select(selectors.mapping), {mappings: [], flowId, importId, subRecordMappingId}],
        [select(selectors.firstFlowPageGenerator, flowId), {adaptorType: 'RESTExport', assistant: 'chargify', _id: exportId}],
        [select(selectors.resource, 'imports', importId), {adaptorType: 'NetsuiteImport', _id: importId, netsuite_da: {recordType: 'record1'}}],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), [{id: 'id1'}]],
        [select(selectors.mappingExtracts, importId, flowId, subRecordMappingId), [{id: 'id2'}, {id: 'id3'}]],
        [select(selectors.applicationName, importId), 'Netsuite'],
        [select(selectors.applicationName, exportId), 'Chargify'],
        [select(selectors.recordTypeForAutoMapper, 'imports', importId), 'record1'],
        [select(selectors.recordTypeForAutoMapper, 'exports', exportId), 'record2'],
        [call(apiCallWithRetry, {
          path: '/autoMapperSuggestions',
          opts: {
            method: 'PUT',
            body: {
              source_application: 'chargify',
              source_fields: [{id: 'id2'}, {id: 'id3'}],
              dest_application: 'netsuite',
              dest_record_type: '',
              source_record_type: 'record2',
              dest_fields: [
                {
                  id: 'id1',
                },
              ],
            },
          },
          hidden: true,
          message: 'Loading',
        }), {
          mappings: {fields: [
            {extract: 'e1', generate: 'g1', weight: 120},
            {extract: 'e2', generate: 'g2', weight: 150},
            {extract: 'e3', generate: 'g1', weight: 140},
            {extract: 'e4', generate: 'g3', weight: 30},
          ],
          lists: []},
          suggested_threshold: 100,
        }],
      ])
      .call(apiCallWithRetry, {
        path: '/autoMapperSuggestions',
        opts: {
          method: 'PUT',
          body: {
            source_application: 'chargify',
            source_fields: [
              {
                id: 'id2',
              },
              {
                id: 'id3',
              },
            ],
            dest_application: 'netsuite',
            dest_record_type: '',
            source_record_type: 'record2',
            dest_fields: [
              {
                id: 'id1',
              },
            ],
          },
        },
        hidden: true,
        message: 'Loading',
      })
      .put(actions.mapping.autoMapper.received(
        [
          {
            generate: 'g1',
            key: 'mock_key',
            extract: 'e1',
          },
          {
            generate: 'g2',
            key: 'mock_key',
            extract: 'e2',
          },
        ]
      ))
      .run();

    expect(mapperSaga).toBeTruthy();
    mock.mockRestore();
  });
  test('should not consider mapping if already present trigger autoMapper received action correctly', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    const autoMapSaga = await expectSaga(getAutoMapperSuggestion, {importId, flowId})
      .provide([
        [select(selectors.mapping), {mappings: [{extract: 'xyz', generate: 'g1'}], flowId, importId, subRecordMappingId}],
        [select(selectors.firstFlowPageGenerator, flowId), {adaptorType: 'RESTExport', assistant: 'jira', _id: exportId}],
        [select(selectors.resource, 'imports', importId), {adaptorType: 'NetsuiteImport', _id: importId, netsuite_da: {recordType: 'record1'}}],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), [{id: 'id1'}]],
        [select(selectors.mappingExtracts, importId, flowId, subRecordMappingId), [{id: 'id2'}, {id: 'id3'}]],
        [select(selectors.applicationName, importId), 'Netsuite'],
        [select(selectors.applicationName, exportId), 'Jira'],
        [select(selectors.recordTypeForAutoMapper, 'imports', importId), 'record1'],
        [select(selectors.recordTypeForAutoMapper, 'exports', exportId), 'record2'],
        [call(apiCallWithRetry, {
          path: '/autoMapperSuggestions',
          opts: {
            method: 'PUT',
            body: {
              source_application: 'jira',
              source_fields: [{id: 'id2'}, {id: 'id3'}],
              dest_application: 'netsuite',
              dest_record_type: '',
              source_record_type: 'record2',
              dest_fields: [
                {
                  id: 'id1',
                },
              ],
            },
          },
          hidden: true,
          message: 'Loading',
        }), {
          mappings: {fields: [
            {extract: 'e1', generate: 'g1', weight: 120},
            {extract: 'e2', generate: 'g2', weight: 150},
            {extract: 'e3', generate: 'g1', weight: 140},
            {extract: 'e4', generate: 'g3', weight: 30},
            {hardCodedValue: 'h1', generate: 'g4', weight: 130},
          ],
          lists: []},
          suggested_threshold: 100,
        }],
      ])
      .call(apiCallWithRetry, {
        path: '/autoMapperSuggestions',
        opts: {
          method: 'PUT',
          body: {
            source_application: 'jira',
            source_fields: [
              {
                id: 'id2',
              },
              {
                id: 'id3',
              },
            ],
            dest_application: 'netsuite',
            dest_record_type: '',
            source_record_type: 'record2',
            dest_fields: [
              {
                id: 'id1',
              },
            ],
          },
        },
        hidden: true,
        message: 'Loading',
      })
      .put(actions.mapping.autoMapper.received(
        [
          {
            generate: 'g2',
            key: 'mock_key',
            extract: 'e2',
          },
          {
            generate: 'g4',
            key: 'mock_key',
            hardCodedValue: 'h1',
          },
        ]
      ))
      .run();

    expect(autoMapSaga).toBeTruthy();
    mock.mockRestore();
  });

  test('should trigger autoMapper failed action with warning correctly', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    const autoMapSaga1 = await expectSaga(getAutoMapperSuggestion, {importId, flowId})
      .provide([
        [select(selectors.mapping), {mappings: [{extract: 'xyz', generate: 'g1'}], flowId, importId, subRecordMappingId}],
        [select(selectors.firstFlowPageGenerator, flowId), {adaptorType: 'RESTExport', assistant: 'zendesk', _id: exportId}],
        [select(selectors.resource, 'imports', importId), {adaptorType: 'NetsuiteImport', _id: importId, netsuite_da: {recordType: 'record1'}}],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), [{id: 'id1'}]],
        [select(selectors.mappingExtracts, importId, flowId, subRecordMappingId), [{id: 'id2'}, {id: 'id3'}]],
        [select(selectors.applicationName, importId), 'Netsuite'],
        [select(selectors.applicationName, exportId), 'Zendesk'],
        [select(selectors.recordTypeForAutoMapper, 'imports', importId), 'record1'],
        [select(selectors.recordTypeForAutoMapper, 'exports', exportId), 'record2'],
        [call(apiCallWithRetry, {
          path: '/autoMapperSuggestions',
          opts: {
            method: 'PUT',
            body: {
              source_application: 'zendesk',
              source_fields: [{id: 'id2'}, {id: 'id3'}],
              dest_application: 'netsuite',
              dest_record_type: '',
              source_record_type: 'record2',
              dest_fields: [
                {
                  id: 'id1',
                },
              ],
            },
          },
          hidden: true,
          message: 'Loading',
        }), {
          mappings: {fields: [
            {extract: 'e1', generate: 'g1', weight: 120},
            {extract: 'e3', generate: 'g1', weight: 140},
            {extract: 'e4', generate: 'g3', weight: 30},
          ],
          lists: []},
          suggested_threshold: 100,
        }],
      ])
      .call(apiCallWithRetry, {
        path: '/autoMapperSuggestions',
        opts: {
          method: 'PUT',
          body: {
            source_application: 'zendesk',
            source_fields: [
              {
                id: 'id2',
              },
              {
                id: 'id3',
              },
            ],
            dest_application: 'netsuite',
            dest_record_type: '',
            source_record_type: 'record2',
            dest_fields: [
              {
                id: 'id1',
              },
            ],
          },
        },
        hidden: true,
        message: 'Loading',
      })
      .put(actions.mapping.autoMapper.failed('warning', 'There are no new fields to auto-map.'))
      .run();

    expect(autoMapSaga1).toBeTruthy();
    mock.mockRestore();
  });

  test('should trigger autoMapper failed action if no response is returned from api call', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    const autoMapSaga2 = await expectSaga(getAutoMapperSuggestion, {importId, flowId})
      .provide([
        [select(selectors.mapping), {mappings: [{extract: 'xyz', generate: 'g1'}], flowId, importId, subRecordMappingId}],
        [select(selectors.firstFlowPageGenerator, flowId), {adaptorType: 'RESTExport', assistant: 'zendesk', _id: exportId}],
        [select(selectors.resource, 'imports', importId), {adaptorType: 'NetsuiteImport', _id: importId, netsuite_da: {recordType: 'record1'}}],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), [{id: 'id1'}]],
        [select(selectors.mappingExtracts, importId, flowId, subRecordMappingId), [{id: 'id2'}, {id: 'id3'}]],
        [select(selectors.applicationName, importId), 'Netsuite'],
        [select(selectors.applicationName, exportId), 'Zendesk'],
        [select(selectors.recordTypeForAutoMapper, 'imports', importId), 'record1'],
        [select(selectors.recordTypeForAutoMapper, 'exports', exportId), 'record2'],
        [call(apiCallWithRetry, {
          path: '/autoMapperSuggestions',
          opts: {
            method: 'PUT',
            body: {
              source_application: 'zendesk',
              source_fields: [{id: 'id2'}, {id: 'id3'}],
              dest_application: 'netsuite',
              dest_record_type: '',
              source_record_type: 'record2',
              dest_fields: [
                {
                  id: 'id1',
                },
              ],
            },
          },
          hidden: true,
          message: 'Loading',
        }), undefined],
      ])
      .call(apiCallWithRetry, {
        path: '/autoMapperSuggestions',
        opts: {
          method: 'PUT',
          body: {
            source_application: 'zendesk',
            source_fields: [
              {
                id: 'id2',
              },
              {
                id: 'id3',
              },
            ],
            dest_application: 'netsuite',
            dest_record_type: '',
            source_record_type: 'record2',
            dest_fields: [
              {
                id: 'id1',
              },
            ],
          },
        },
        hidden: true,
        message: 'Loading',
      })
      .put(actions.mapping.autoMapper.failed('error', 'Failed to fetch mapping suggestions.'))
      .run();

    expect(autoMapSaga2).toBeTruthy();
    mock.mockRestore();
  });
  test('should should trigger autoMapper failed action on api error', async () => {
    const mock = jest.spyOn(GenerateMediumId, 'generateId');  // spy on otherFn

    mock.mockReturnValue('mock_key');
    const autoMapSaga3 = await expectSaga(getAutoMapperSuggestion, {importId, flowId})
      .provide([
        [select(selectors.mapping), {mappings: [{extract: 'xyz', generate: 'g1'}], flowId, importId, subRecordMappingId}],
        [select(selectors.firstFlowPageGenerator, flowId), {adaptorType: 'RESTExport', assistant: 'shopify', _id: exportId}],
        [select(selectors.resource, 'imports', importId), {adaptorType: 'NetsuiteImport', _id: importId, netsuite_da: {recordType: 'record1'}}],
        [select(selectors.mappingGenerates, importId, subRecordMappingId), [{id: 'id1'}]],
        [select(selectors.mappingExtracts, importId, flowId, subRecordMappingId), [{id: 'id2'}, {id: 'id3'}]],
        [select(selectors.applicationName, importId), 'Netsuite'],
        [select(selectors.applicationName, exportId), 'Shopify'],
        [select(selectors.recordTypeForAutoMapper, 'imports', importId), 'record1'],
        [select(selectors.recordTypeForAutoMapper, 'exports', exportId), 'record2'],
        [call(apiCallWithRetry, {
          path: '/autoMapperSuggestions',
          opts: {
            method: 'PUT',
            body: {
              source_application: 'shopify',
              source_fields: [{id: 'id2'}, {id: 'id3'}],
              dest_application: 'netsuite',
              dest_record_type: '',
              source_record_type: 'record2',
              dest_fields: [
                {
                  id: 'id1',
                },
              ],
            },
          },
          hidden: true,
          message: 'Loading',
        }), throwError('internet lost')],
      ])
      .call(apiCallWithRetry, {
        path: '/autoMapperSuggestions',
        opts: {
          method: 'PUT',
          body: {
            source_application: 'shopify',
            source_fields: [
              {
                id: 'id2',
              },
              {
                id: 'id3',
              },
            ],
            dest_application: 'netsuite',
            dest_record_type: '',
            source_record_type: 'record2',
            dest_fields: [
              {
                id: 'id1',
              },
            ],
          },
        },
        hidden: true,
        message: 'Loading',
      })
      .put(actions.mapping.autoMapper.failed('error', 'Failed to fetch mapping suggestions.'))
      .run();

    expect(autoMapSaga3).toBeTruthy();
    mock.mockRestore();
  });
});
