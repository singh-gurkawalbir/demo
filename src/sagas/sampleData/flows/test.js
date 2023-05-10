
import { deepClone } from 'fast-json-patch';
import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { evaluateExternalProcessor } from '../../editor';
import { apiCallWithRetry } from '../..';
import { getResource } from '../../resources';
import {
  _initFlowData,
  requestSampleData,
  _processData,
  _processMappingData,
  fetchPageProcessorPreview,
  fetchPageGeneratorPreview,
  requestProcessorData,
  _processResponseTransformData,
} from '.';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import requestFileAdaptorSampleData from '../sampleDataGenerator/fileAdaptorSampleData';
import { getConstructedResourceObj } from './utils';
import { exportPreview, pageProcessorPreview } from '../utils/previewCalls';
import {
  requestSampleDataForExports,
  requestSampleDataForImports,
  updateStateForProcessorData,
  handleFlowDataStageErrors,
  getFlowResourceNode,
  getPreProcessedResponseMappingData,
  getFlowStageData,
} from '../utils/flowDataUtils';
import { getAllDependentSampleDataStages, getSampleDataStage, getBlobResourceSampleData, getSampleFileMeta } from '../../../utils/flowData';
import getPreviewOptionsForResource, { _getUIDataForResource } from './pageProcessorPreviewOptions';

describe('flow sample data sagas', () => {
  describe('_initFlowData saga', () => {
    const flowId = 'flow-123';
    const exportId = 'export-123';
    const importId = 'import-123';
    const exportResource = { _id: exportId, name: 'rest export' };
    const importResource = { _id: importId, name: 'rest import'};

    test('should dispatch init action if the flowId and resourceId are not new, with refresh and formKey as a new property in addition to flow doc', () => {
      const flow = { _id: flowId, pageGenerators: [exportResource], pageProcessors: [importResource]};

      expectSaga(_initFlowData, { flowId, resourceId: exportId, resourceType: 'exports'})
        .provide([
          [select(selectors.resourceData, 'flows', flowId), { merged: flow }],
        ])
        .put(actions.flowData.init({...flow, refresh: false}))
        .run();
      expectSaga(_initFlowData, { flowId, resourceId: exportId, resourceType: 'exports', refresh: true, formKey: 'form-123'})
        .provide([
          [select(selectors.resourceData, 'flows', flowId), { merged: flow }],
        ])
        .put(actions.flowData.init({...flow, refresh: true, formKey: 'form-123'}))
        .run();
    });
    test('should dispatch init action if the resourceId is new export and flowId is existed , with refresh and new pg doc for the export', () => {
      const newExportId = 'new-123';
      const newExport = { _id: newExportId, name: 'new export'};
      const flow = { _id: flowId, pageGenerators: [exportResource], pageProcessors: [importResource]};
      const flowObjectToInit = deepClone({...flow, refresh: false});

      flowObjectToInit.pageGenerators.push({
        type: 'export',
        _exportId: newExportId,
      });

      expectSaga(_initFlowData, { flowId, resourceId: newExportId, resourceType: 'exports'})
        .provide([
          [select(selectors.resourceData, 'flows', flowId), { merged: flow }],
          [select(selectors.resourceData, 'exports', newExportId), { merged: newExport }],
        ])
        .put(actions.flowData.init(flowObjectToInit))
        .run();
    });
    test('should dispatch init action if the resourceId is new lookup and flowId is existed , with refresh and new pp doc for the lookup', () => {
      const newExportId = 'new-123';
      const newLookup = { _id: newExportId, name: 'new export', isLookup: true};
      const flow = { _id: flowId, pageGenerators: [exportResource], pageProcessors: [importResource]};
      const flowObjectToInit = deepClone({...flow, refresh: false});

      flowObjectToInit.pageProcessors.push({
        type: 'export',
        _exportId: newExportId,
      });

      expectSaga(_initFlowData, { flowId, resourceId: newExportId, resourceType: 'exports'})
        .provide([
          [select(selectors.resourceData, 'flows', flowId), { merged: flow }],
          [select(selectors.resourceData, 'exports', newExportId), { merged: newLookup }],
        ])
        .put(actions.flowData.init(flowObjectToInit))
        .run();
    });
    test('should dispatch init action if the resourceId is new import and flowId is existed , with refresh and new pp doc for the import', () => {
      const newImportId = 'new-123';
      const newImport = { _id: newImportId, name: 'new import'};
      const flow = { _id: flowId, pageGenerators: [exportResource], pageProcessors: [importResource]};
      const flowObjectToInit = deepClone({...flow, refresh: false});

      flowObjectToInit.pageProcessors.push({
        type: 'import',
        _importId: newImportId,
      });

      expectSaga(_initFlowData, { flowId, resourceId: newImportId, resourceType: 'imports'})
        .provide([
          [select(selectors.resourceData, 'flows', flowId), { merged: flow }],
          [select(selectors.resourceData, 'imports', newImport), { merged: newImport }],
        ])
        .put(actions.flowData.init(flowObjectToInit))
        .run();
    });
    test('should dispatch init action if the flowId and resourceId are new , a mocked flowObject including _id, refresh and pg/pp doc depending on resourceType', () => {
      const newImportId = 'new-123';
      const newImport = { _id: newImportId, name: 'new import'};
      const flow = {};
      const newFlowId = 'new-flow-123';
      const flowObjectToInit = {
        _id: newFlowId,
        pageProcessors: [{
          type: 'import',
          _importId: newImportId,
        }],
        refresh: false,
      };

      expectSaga(_initFlowData, { flowId: newFlowId, resourceId: newImportId, resourceType: 'imports' })
        .provide([
          [select(selectors.resourceData, 'flows', newFlowId), { merged: flow }],
          [select(selectors.resourceData, 'imports', newImport), { merged: newImport }],
        ])
        .put(actions.flowData.init(flowObjectToInit))
        .run();
    });
  });
  describe('requestSampleData saga', () => {
    const flowId = 'flow-123';
    const exportId = 'export-123';
    const importId = 'import-123';

    test('should do nothing incase of no flowId/resourceId or when added invalid resource type', () => {
      expectSaga(requestSampleData, {}).returns(undefined).run();
      expectSaga(requestSampleData, {
        resourceId: 'flow-123',
        flowId: 'flow-123',
        resourceType: 'flows',
      }).returns(undefined).run();
    });
    test('should return dummy as2 object incase of connections resourceType', () => {
      const expected = { as2: { sample: { data: 'coming soon' } } };

      expectSaga(requestSampleData, { flowId, resourceId: 'conn-123', resourceType: 'connections'})
        .returns(expected)
        .run();
    });
    test('should not call _initFlowData if isInitialized property is true', () =>
      expectSaga(requestSampleData, { flowId, resourceId: exportId, resourceType: 'exports', stage: 'transform', isInitialized: true })
        .not.call.fn(_initFlowData)
        .run()
    );
    test('should dispatch resetStages action incase of refresh passed true', () => {
      const stage = 'transform';
      const stages = getAllDependentSampleDataStages(stage, 'exports');

      expectSaga(requestSampleData, { flowId, resourceId: exportId, resourceType: 'exports', stage, refresh: true })
        .put(actions.flowData.resetStages(flowId, exportId, stages, 'refresh'))
        .run();
    }
    );
    test('should dispatch requestStage action and call requestSampleDataForImports for imports', () => {
      const stage = 'importMapping';
      const sampleDataStage = getSampleDataStage(stage, 'imports');

      expectSaga(requestSampleData, { flowId, resourceId: importId, resourceType: 'imports', stage })
        .put(actions.flowData.requestStage(flowId, importId, sampleDataStage))
        .call(requestSampleDataForImports, { flowId,
          resourceId: importId,
          hidden: true,
          sampleDataStage,
        })
        .run();
    });
    test('should dispatch requestStage action and call requestSampleDataForExports for exports', () => {
      const stage = 'transform';
      const sampleDataStage = getSampleDataStage(stage, 'exports');

      expectSaga(requestSampleData, { flowId, resourceId: exportId, resourceType: 'exports', stage })
        .put(actions.flowData.requestStage(flowId, exportId, sampleDataStage))
        .call(requestSampleDataForExports, {
          flowId,
          resourceId: exportId,
          hidden: true,
          sampleDataStage,
        })
        .run();
    });
    test('should call handleFlowDataStageErrors when requestSampleDataForImports/requestSampleDataForExports saga throws error', () => {
      const stage = 'transform';
      const sampleDataStage = getSampleDataStage(stage, 'exports');
      const error = JSON.stringify({
        errors: [{status: 404, message: '{"code":"error code"}'}],
      });

      expectSaga(requestSampleData, { flowId, resourceId: exportId, resourceType: 'exports', stage })
        .provide([
          [call(requestSampleDataForExports, {
            flowId,
            resourceId: exportId,
            sampleDataStage,
            hidden: true,
          }), throwError(error)],
        ])
        .put(actions.flowData.requestStage(flowId, exportId, sampleDataStage))
        .call(handleFlowDataStageErrors, {
          flowId,
          resourceId: exportId,
          stage: sampleDataStage,
          error,
        })
        .run();
    });
    test('should throw error if isInitialized is true ( if the saga is called internally ) and enters catch block when requestSampleDataForImports/requestSampleDataForExports saga throws error', () => {
      const stage = 'transform';
      const sampleDataStage = getSampleDataStage(stage, 'exports');
      const error = JSON.stringify({
        errors: [{status: 404, message: '{"code":"error code"}'}],
      });

      expectSaga(requestSampleData, { flowId, resourceId: exportId, resourceType: 'exports', stage, isInitialized: true })
        .provide([
          [call(requestSampleDataForExports, {
            flowId,
            resourceId: exportId,
            hidden: true,
            sampleDataStage,
          }), throwError(error)],
        ])
        .put(actions.flowData.requestStage(flowId, exportId, sampleDataStage))
        .call(handleFlowDataStageErrors, {
          flowId,
          resourceId: exportId,
          stage: sampleDataStage,
          error,
        })
        .throws(error)
        .run();
    });
  });
  describe('_processData saga', () => {
    const flowId = 'flow-123';
    const resourceId = 'export-123';

    test('should call evaluateExternalProcessor saga to fetch processor data and call updateStateForProcessorData saga with the response of processor data', () => {
      const processorData = { editorType: 'transform', rules: [] };
      const processedData = { test: 5 };

      expectSaga(_processData, { flowId, resourceId, processorData, stage: 'transform' })
        .provide([
          [call(evaluateExternalProcessor, {
            processorData,
          }), processedData],
        ])
        .call(updateStateForProcessorData, {
          flowId,
          resourceId,
          stage: 'transform',
          processedData,
          wrapInArrayProcessedData: undefined,
          removeDataPropFromProcessedData: undefined,
          isFilterScript: undefined,
          sampleData: undefined,
        })
        .run();
    });
    test('should extract needed properties from processorData passed and proxy the same to  updateStateForProcessorData when called', () => {
      const processorData = { editorType: 'transform', rules: [], wrapInArrayProcessedData: true, removeDataPropFromProcessedData: true };
      const processedData = { test: 5 };

      expectSaga(_processData, { flowId, resourceId, processorData, stage: 'transform' })
        .provide([
          [call(evaluateExternalProcessor, {
            processorData,
          }), processedData],
        ])
        .call(evaluateExternalProcessor, { processorData })
        .call(updateStateForProcessorData, {
          flowId,
          resourceId,
          stage: 'transform',
          processedData,
          wrapInArrayProcessedData: true,
          removeDataPropFromProcessedData: true,
          isFilterScript: undefined,
          sampleData: undefined,
        })
        .run();
    });
  });
  describe('_processMappingData saga', () => {
    const flowId = 'flow-123';
    const resourceId = 'export-123';

    test('should construct mapping body with passed mappings and invoke mapperProcessor api', () => {
      const mappings = {
        fields: [{ extract: 'id', generate: 'ticketID'}, { extract: 'name', generate: 'ticketName'}],
        lists: [],
      };
      const preProcessedData = {
        id: '1',
        name: 'test',
        users: [],
      };
      const body = {
        rules: {
          rules: [mappings],
        },
        data: [preProcessedData],
        options: undefined,
      };
      const processedData = {
        mediaType: 'json',
        duration: 1,
        data: [{
          mappedObject: {
            ticketID: '1',
            ticketName: 'test',
          },
        }],
      };

      expectSaga(_processMappingData, {
        flowId,
        resourceId,
        mappings,
        stage: 'importMapping',
        preProcessedData,
      })
        .provide([
          [call(apiCallWithRetry, {
            path: '/processors/mapperProcessor',
            opts: {
              method: 'POST',
              body,
            },
            hidden: true,
          }), processedData],
        ])
        .call(apiCallWithRetry, {
          path: '/processors/mapperProcessor',
          opts: {
            method: 'POST',
            body,
          },
          hidden: true,
        })
        .run();
    });
    test('should dispatch receivedProcessorData action on successful api response', () => {
      const mappings = {
        fields: [{ extract: 'id', generate: 'ticketID'}, { extract: 'name', generate: 'ticketName'}],
        lists: [],
      };
      const preProcessedData = {
        id: '1',
        name: 'test',
        users: [],
      };
      const body = {
        rules: {
          rules: [mappings],
        },
        data: [preProcessedData],
        options: undefined,
      };
      const processedMappingData = {
        mediaType: 'json',
        duration: 1,
        data: [{
          mappedObject: {
            ticketID: '1',
            ticketName: 'test',
          },
        }],
      };
      const processedData = {
        data: [{
          ticketID: '1',
          ticketName: 'test',
        }],
      };

      expectSaga(_processMappingData, {
        flowId,
        resourceId,
        mappings,
        stage: 'importMapping',
        preProcessedData,
      })
        .provide([
          [call(apiCallWithRetry, {
            path: '/processors/mapperProcessor',
            opts: {
              method: 'POST',
              body,
            },
            hidden: true,
          }), processedMappingData],
        ])
        .put(
          actions.flowData.receivedProcessorData(
            flowId,
            resourceId,
            'importMapping',
            processedData
          )
        )
        .run();
    });
    test('should throw exception incase of mapperProcessor api failure', () => {
      const mappings = {};
      const preProcessedData = {
        id: '1',
        name: 'test',
        users: [],
      };
      const body = {
        rules: {
          rules: [mappings],
        },
        data: [preProcessedData],
        options: undefined,
      };

      expectSaga(_processMappingData, {
        flowId,
        resourceId,
        mappings,
        stage: 'importMapping',
        preProcessedData,
      })
        .provide([
          [call(apiCallWithRetry, {
            path: '/processors/mapperProcessor',
            opts: {
              method: 'POST',
              body,
            },
            hidden: true,
          }), throwError({ message: 'mapping error' })],
        ])
        .throws({ message: 'mapping error' })
        .run();
    });
  });
  describe('_processResponseTransformData saga', () => {
    const flowId = 'flow-123';
    const resourceId = 'export-123';

    test('should call evaluateExternalProcessor saga to fetch processor data and call updateStateForProcessorData saga with the response of processor data merged with mock response', () => {
      const processorData = { editorType: 'transform', rules: [] };
      const mockResponse = [{id: '123', _json: {somedata: {}}}];
      const resource = { mockResponse };
      const stage = 'responseTransform';
      const transformedData = { data: {test: 5} };
      const processedData = {
        data: [
          {
            ...mockResponse[0],
            _json: transformedData.data,
          },
        ],
      };

      expectSaga(_processResponseTransformData, {
        flowId,
        resourceId,
        processorData,
        stage,
        hasNoRulesToProcess: false,
        resource,
      })
        .provide([
          [call(evaluateExternalProcessor, {
            processorData,
          }), transformedData],
        ])
        .call(updateStateForProcessorData, {
          flowId,
          resourceId,
          stage,
          processedData,
          wrapInArrayProcessedData: undefined,
          removeDataPropFromProcessedData: undefined,
        })
        .run();
    });
    test('should not call evaluateExternalProcessor saga if there are no rules to process and call updateStateForProcessorData saga with mock response', () => {
      const processorData = { editorType: 'transform', rules: [] };
      const mockResponse = [{id: '123', _json: {somedata: {}}}];
      const resource = { mockResponse };
      const stage = 'responseTransform';
      const processedData = {
        data: mockResponse,
      };

      expectSaga(_processResponseTransformData, {
        flowId,
        resourceId,
        processorData,
        stage,
        hasNoRulesToProcess: true,
        resource,
      })
        .not.call(evaluateExternalProcessor, {processorData })
        .call(updateStateForProcessorData, {
          flowId,
          resourceId,
          stage,
          processedData,
          wrapInArrayProcessedData: undefined,
          removeDataPropFromProcessedData: undefined,
        })
        .run();
    });
  });
  describe('fetchPageProcessorPreview saga', () => {
    test('should do nothing incase of no flowId/_pageProcessorId', () => expectSaga(fetchPageProcessorPreview, {}).returns(undefined).run());
    test('should call pageProcessorPreview and the result is dispatched to receivedPreviewData action', () => {
      const flowId = 'flow-123';
      const _pageProcessorId = 'export-123';
      const resourceType = 'exports';

      expectSaga(fetchPageProcessorPreview, {
        flowId,
        _pageProcessorId,
        previewType: 'raw',
        resourceType,
        hidden: true,
      })
        .provide([
          [call(getConstructedResourceObj, {
            resourceId: _pageProcessorId,
            resourceType,
            formKey: undefined,
          }), {}],
        ])
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId,
          routerId: undefined,
          _pageProcessorDoc: undefined,
          previewType: 'raw',
          resourceType: 'exports',
          throwOnError: true,
          refresh: undefined,
          editorId: undefined,
          hidden: true,
          runOffline: true,
        })
        .run();
    });
    test('should consider resourceObj constructed from form state incase of formKey and construct body to make pp preview call', () => {
      const flowId = 'flow-123';
      const _pageProcessorId = 'export-123';
      const resourceType = 'exports';
      const formKey = 'form-export-123';
      const resourceObj = { _id: _pageProcessorId, name: 'test', adaptorType: 'RESTExport'};

      expectSaga(fetchPageProcessorPreview, {
        flowId,
        _pageProcessorId,
        previewType: 'raw',
        resourceType,
        hidden: true,
      })
        .provide([
          [select(selectors.getFlowDataState, flowId), { formKey }],
          [call(getConstructedResourceObj, {
            resourceId: _pageProcessorId,
            resourceType,
            formKey,
          }), resourceObj],
        ])
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId,
          routerId: undefined,
          _pageProcessorDoc: resourceObj,
          previewType: 'raw',
          resourceType: 'exports',
          throwOnError: true,
          refresh: undefined,
          hidden: true,
          editorId: undefined,
          runOffline: true,
        })
        .run();
    });

    test('should call pageProcessorPreview with refresh true if the flow sampledata state has refresh as true', () => {
      const flowId = 'flow-123';
      const _pageProcessorId = 'export-123';
      const resourceType = 'exports';
      const flow = { _id: flowId, pageGenerators: [], pageProcessors: []};
      const flowData = {...flow, refresh: true};

      expectSaga(fetchPageProcessorPreview, {
        flowId,
        _pageProcessorId,
        routerId: undefined,
        previewType: 'raw',
        resourceType,
        hidden: true,
      })
        .provide([
          [call(getConstructedResourceObj, {
            resourceId: _pageProcessorId,
            resourceType,
            formKey: undefined,
          }), { merged: {} }],
          [select(selectors.getFlowDataState, flowId), flowData],
        ])
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId,
          routerId: undefined,
          _pageProcessorDoc: undefined,
          previewType: 'raw',
          resourceType,
          throwOnError: true,
          refresh: true,
          hidden: true,
          editorId: undefined,
          runOffline: true,
        })
        .run();
    });
  });
  describe('fetchPageGeneratorPreview saga', () => {
    const flowId = 'flow-123';
    const _pageGeneratorId = 'export-123';

    test('should do nothing incase of no flowId/_pageGeneratorId', () => expectSaga(fetchPageGeneratorPreview, {}).returns(undefined).run());
    test('should dispatch receivedPreviewData with blob preview data incase of blobType PG', () => {
      const blobResource = {
        _id: 'export-123',
        type: 'blob',
        name: 'blob export',
      };
      const previewData = getBlobResourceSampleData();

      expectSaga(fetchPageGeneratorPreview, { flowId, _pageGeneratorId })
        .provide([
          [select(selectors.resourceData, 'exports', _pageGeneratorId), { merged: blobResource }],
        ])
        .put(
          actions.flowData.receivedPreviewData(
            flowId,
            _pageGeneratorId,
            previewData,
            'raw'
          )
        )
        .run();
    });
    test('should dispatch receivedPreviewData with sampleData on the resource incase of an Integration App resource', () => {
      const IAResource = {
        _id: 'export-123',
        _connectorId: 'connector-123',
        name: 'IA export',
        sampleData: { test: 5 },
      };
      const flow = {
        _id: flowId,
        _connectorId: 'connector-123',
        name: 'testing flow',
        pageGenerators: [],
        pageProcessors: [],
      };
      const previewData = { test: 5 };

      expectSaga(fetchPageGeneratorPreview, { flowId, _pageGeneratorId })
        .provide([
          [select(selectors.resourceData, 'exports', _pageGeneratorId), { merged: IAResource }],
          [select(selectors.resourceData, 'flows', flowId), { merged: flow }],
        ])
        .put(
          actions.flowData.receivedPreviewData(
            flowId,
            _pageGeneratorId,
            previewData,
            'raw'
          )
        )
        .run();
    });
    test('should call requestFileAdaptorSampleData incase of File type PG and the result is dispatched to receivedPreviewData action', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'json',
        },
        adaptorType: 'FTPExport',
        sampleData: { test: 5 },
      };
      const fileSampleData = { test: 5 };

      expectSaga(fetchPageGeneratorPreview, { flowId, _pageGeneratorId })
        .provide([
          [select(selectors.resourceData, 'exports', _pageGeneratorId), { merged: ftpResource }],
          [call(requestFileAdaptorSampleData, { resource: ftpResource, formKey: undefined }), fileSampleData],
        ])
        .call(requestFileAdaptorSampleData, { resource: ftpResource, formKey: undefined })
        .put(
          actions.flowData.receivedPreviewData(
            flowId,
            _pageGeneratorId,
            fileSampleData,
            'raw'
          )
        )
        .run();
    });
    test('should call requestRealTimeMetadata saga incase of real time PG and the result is dispatched to receivedPreviewData action', () => {
      const netsuiteResource = {
        _id: 'export-123',
        name: 'NS export',
        type: 'distributed',
        adaptorType: 'NetSuiteExport',
      };
      const metadata = { test: 5 };

      expectSaga(fetchPageGeneratorPreview, { flowId, _pageGeneratorId })
        .provide([
          [select(selectors.resourceData, 'exports', _pageGeneratorId), { merged: netsuiteResource }],
          [call(requestRealTimeMetadata, { resource: netsuiteResource }), metadata],
        ])
        .call(requestRealTimeMetadata, { resource: netsuiteResource })
        .put(
          actions.flowData.receivedPreviewData(
            flowId,
            _pageGeneratorId,
            metadata,
            'raw'
          )
        )
        .run();
    });
    test('should call exportPreview saga incase of PG being a preview based adaptor like REST/HTTP/DB and the result is dispatched to receivedPreviewData action', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
      };
      const previewResponse = {
        stages: [{
          name: 'parse',
          data: [{ test: 5 }],
        }],
      };
      const previewData = { test: 5 };

      expectSaga(fetchPageGeneratorPreview, { flowId, _pageGeneratorId })
        .provide([
          [call(getConstructedResourceObj, {
            resourceId: _pageGeneratorId,
            resourceType: 'exports',
            formKey: undefined,
          }), restExport],
          [call(exportPreview, {
            resourceId: _pageGeneratorId,
            runOffline: true,
            throwOnError: true,
            flowId,
            formKey: undefined,
          }), previewResponse],
        ])
        .call(exportPreview, {
          resourceId: _pageGeneratorId,
          runOffline: true,
          throwOnError: true,
          flowId,
          formKey: undefined,
        })
        .put(
          actions.flowData.receivedPreviewData(
            flowId,
            _pageGeneratorId,
            previewData,
            'raw'
          )
        )
        .run();
    });
    test('should call exportPreview saga incase of PG being a preview based adaptor like REST/HTTP/DB and the result is dispatched to receivedPreviewData action1', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
      };
      const formKey = 'form-export-123';
      const previewResponse = {
        stages: [{
          name: 'parse',
          data: [{ test: 5 }],
        }],
      };
      const previewData = { test: 5 };

      expectSaga(fetchPageGeneratorPreview, { flowId, _pageGeneratorId })
        .provide([
          [select(selectors.getFlowDataState, flowId), {formKey}],
          [call(getConstructedResourceObj, {
            resourceId: _pageGeneratorId,
            resourceType: 'exports',
            formKey,
          }), restExport],
          [call(exportPreview, {
            resourceId: _pageGeneratorId,
            runOffline: true,
            throwOnError: true,
            flowId,
            formKey,
          }), previewResponse],
        ])
        .call(exportPreview, {
          resourceId: _pageGeneratorId,
          runOffline: true,
          throwOnError: true,
          flowId,
          formKey,
        })
        .put(
          actions.flowData.receivedPreviewData(
            flowId,
            _pageGeneratorId,
            previewData,
            'raw'
          )
        )
        .run();
    });
  });
  describe('requestProcessorData saga ----', () => {
    const flowId = 'flow-123';
    const resourceId = 'export-1234';
    const resourceType = 'exports';

    test('should call updateStateForProcessorData with preProcessedSampleData if the current stage has no rules to process', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
      };
      const preProcessedSampleData = {test: 5};
      const preProcessedData = {
        records: {
          test: 5,
        },
        setting: {},
      };
      const stage = 'transform';

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restExport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            resourceType,
            stage,
            isInitialized: true,
          }), preProcessedData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
        ])
        .call(updateStateForProcessorData, {
          flowId,
          resourceId,
          processedData: { data: [preProcessedSampleData] },
          stage,
        })
        .run();
    });
    test('should call _processData for transform processor when stage is transform/responseTransform with preProcessedData', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
        transform: {
          type: 'expression',
          expression: {
            rules: [[{ extract: 'count', generate: 'total'}]],
          },
        },
      };
      const preProcessedSampleData = { count: 5 };
      const preProcessedData = {
        records: {
          count: 5,
        },
        setting: {},
      };
      const stage = 'transform';
      const processorData = {
        data: preProcessedSampleData,
        rule: [{ extract: 'count', generate: 'total'}],
        editorType: 'transform',
      };

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restExport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            resourceType,
            stage,
            isInitialized: true,
          }), preProcessedData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
        ])
        .call(_processData, {
          flowId,
          resourceId,
          processorData,
          stage,
        })
        .run();
    });
    test('should call _processResponseTransformData for transform processor when stage is responseTransform with preProcessedData', () => {
      const restExport = {
        _id: resourceId,
        name: 'NS export',
        adaptorType: 'RESTExport',
        responseTransform: {
          type: 'expression',
          expression: {
            rules: [[{ extract: 'count', generate: 'total'}]],
          },
        },
      };
      const preProcessedSampleData = { count: 5 };
      const preProcessedData = {
        records: {
          count: 5,
        },
        setting: {},
      };
      const stage = 'responseTransform';
      const processorData = {
        data: preProcessedSampleData,
        rule: [{ extract: 'count', generate: 'total'}],
        editorType: 'transform',
      };
      const responseTransformData = {};

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restExport }],
          [matchers.call.fn(getFlowStageData), preProcessedData],
          [matchers.call.fn(_processResponseTransformData), responseTransformData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
        ])
        .call(_processResponseTransformData, {
          flowId,
          resource: restExport,
          resourceId,
          processorData,
          hasNoRulesToProcess: false,
          stage,
        })
        .run();
    });
    test('should call _processData for javascript processor when stage is related to hooks or transform with type script', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
        transform: {
          type: 'script',
          script: {
            _scriptId: 'script-123',
            function: 'transform',
          },
        },
      };
      const script = { _id: 'script-123', name: 'transform script', content: 'function transform() {}'};
      const preProcessedSampleData = { count: 5 };
      const preProcessedData = {
        records: {
          count: 5,
        },
        setting: {},
      };
      const stage = 'transform';
      const processorData = {
        data: preProcessedData,
        editorType: 'javascript',
        rule: {
          code: script.content,
          entryFunction: 'transform',
          scriptId: 'script-123',
        },
        wrapInArrayProcessedData: true,
      };

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restExport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            routerId: undefined,
            resourceType,
            stage,
            isInitialized: true,
          }), preProcessedData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
          [call(getResource, {
            resourceType: 'scripts',
            id: 'script-123',
          }), script],
          [matchers.call.fn(_processData), {}],
        ])
        .call(_processData, {
          flowId,
          resourceId,
          processorData,
          stage,
        })
        .run();
    });
    test('should call _processData and not call getScripts for javascript processor when stage is related to hooks or transform with type script for IAs', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
        transform: {
          type: 'script',
          script: {
            _scriptId: 'script-123',
            function: 'transform',
          },
        },
        _connectorId: 'abc',
      };
      const preProcessedSampleData = { count: 5 };
      const preProcessedData = {
        records: {
          count: 5,
        },
        setting: {},
      };
      const stage = 'transform';
      const processorData = {
        data: preProcessedData,
        rule: {
          entryFunction: 'transform',
          scriptId: 'script-123',
        },
        editorType: 'javascript',
        wrapInArrayProcessedData: true,
      };

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restExport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            routerId: undefined,
            resourceType,
            stage,
            isInitialized: true,
          }), preProcessedData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
          [matchers.call.fn(_processData), {}],
        ])
        .not.call(getResource, {
          resourceType: 'scripts',
          id: 'script-123',
        })
        .call.fn(_processData, {
          flowId,
          resourceId,
          processorData,
          stage,
        })
        .run();
    });
    test('should call _processData for mapper processor when stage is importMapping', () => {
      const resourceType = 'imports';
      const resourceId = 'import-123';
      const mappings = {
        fields: [
          {
            extract: 'AAAAAAAAAAAAA',
            generate: 'Purchase Order Acknowledge Date',
          },
          {
            extract: 'count',
            generate: 'Purchase Order Acknowledge Status',
          },
        ],
      };
      const restImport = {
        _id: 'import-123',
        name: 'rest import',
        adaptorType: 'RESTImport',
        mapping: mappings,
      };
      const preProcessedSampleData = { count: 5 };
      const preProcessedData = {
        records: {
          count: 5,
        },
        setting: {},
      };
      const stage = 'importMapping';

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restImport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            resourceType,
            routerId: undefined,
            stage,
            isInitialized: true,
          }), preProcessedData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
          [matchers.call.fn(apiCallWithRetry), undefined],
        ])
        .call(getFlowStageData, {
          flowId,
          resourceId,
          resourceType,
          stage,
          routerId: undefined,
          isInitialized: true,
        })
        .call.fn(_processMappingData)
        .run();
    });
    test('should call _processMappingData for mapper processor when stage is importMapping and v2 mappings exist', () => {
      const resourceType = 'imports';
      const resourceId = 'import-123';
      const mappings = [
        {
          extract: 'AAAAAAAAAAAAA',
          generate: 'Purchase Order Acknowledge Date',
          dataType: 'string',
        },
      ];
      const restImport = {
        _id: 'import-123',
        name: 'rest import',
        adaptorType: 'RESTImport',
        _connectionId: 'conn-123',
        lookups: [{name: 'some-lookup'}],
        mappings,
      };
      const preProcessedSampleData = { count: 5 };
      const preProcessedData = {
        records: {
          count: 5,
        },
        setting: {},
      };
      const stage = 'importMapping';

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restImport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            resourceType,
            routerId: undefined,
            stage,
            isInitialized: true,
          }), preProcessedData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
          [matchers.call.fn(apiCallWithRetry), undefined],
          [select(selectors.resource, 'connections', 'conn-123'), {_id: 'conn-123'}],
        ])
        .call(getFlowStageData, {
          flowId,
          resourceId,
          resourceType,
          stage,
          routerId: undefined,
          isInitialized: true,
        })
        .call(_processMappingData, {
          flowId,
          resourceId,
          mappings: {mappings, lookups: [{name: 'some-lookup'}]},
          stage,
          preProcessedData,
          options: {connection: {_id: 'conn-123'}, _flowId: flowId, import: restImport, _integrationId: undefined},
        })
        .run();
    });
    test('should call getPreProcessedResponseMappingData and call _processMappingData if mappings exist for responseMapping stage', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
      };
      const flowNode = {
        responseMapping: {
          fields: [
            {
              extract: 'data',
              generate: 'sdfg',
            },
          ],
          lists: [],
        },
        type: 'export',
        _exportId: 'export-123',
      };
      const preProcessedSampleData = { count: 5 };
      const preProcessedData = {
        records: {
          count: 5,
        },
        setting: {},
      };
      const stage = 'responseMapping';

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restExport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            resourceType,
            stage,
            routerId: undefined,
            isInitialized: true,
          }), preProcessedData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
          [call(getFlowResourceNode, {
            flowId,
            resourceId,
            resourceType,
          }), flowNode],
          [matchers.call.fn(apiCallWithRetry), undefined],
        ])
        .call(getPreProcessedResponseMappingData, {
          resourceType,
          preProcessedData,
          adaptorType: restExport.adaptorType,
        })
        .call.fn(_processMappingData)
        .run();
    });
    test('should process oneToMany path on flowInput data and update the state incase of oneToMany for processedFlowInput stage', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
        oneToMany: true,
        pathToMany: 'e.check.f',
      };
      const sampleData = {
        a: 5,
        c: { d: 7 },
        e: { check: { f: [{ a: 1}]} },
      };
      const stage = 'processedFlowInput';
      const formKey = 'form-123';
      const oneToManySampleData = {
        _PARENT: { a: 5, c: { d: 7}, e: { check: {} } },
        a: 1,
      };

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: sampleData}],
          [select(selectors.getFlowDataState, flowId), { formKey }],
          [call(getConstructedResourceObj, {
            resourceId,
            resourceType,
            formKey,
          }), restExport],
        ])
        .put(actions.flowData.receivedProcessorData(flowId, resourceId, stage, { data: [oneToManySampleData]}))
        .run();
    });
    test('should update the state with flowInput data if the resource is not oneToMany for processedFlowInput stage', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
      };
      const sampleData = {
        a: 5,
        c: { d: 7 },
        e: { check: { f: [{ a: 1}]} },
      };
      const stage = 'processedFlowInput';
      const formKey = 'form-123';

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: sampleData}],
          [select(selectors.getFlowDataState, flowId), { formKey }],
          [call(getConstructedResourceObj, {
            resourceId,
            resourceType,
            formKey,
          }), restExport],
        ])
        .put(actions.flowData.receivedProcessorData(flowId, resourceId, stage, { data: [sampleData]}))
        .run();
    });
    test('should do nothing if mappings does not exist for responseMapping stage', () => {
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
      };
      const flowNode = {
        type: 'export',
        _exportId: 'export-123',
      };
      const preProcessedSampleData = { count: 5 };
      const preProcessedData = {
        records: {
          count: 5,
        },
        setting: {},
      };
      const stage = 'responseMapping';

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restExport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            resourceType,
            stage,
            routerId: undefined,
            isInitialized: true,
          }), preProcessedData],
          [select(selectors.getSampleDataContext, {
            flowId,
            resourceId,
            resourceType,
            stage,
          }), {data: preProcessedSampleData}],
          [call(getFlowResourceNode, {
            flowId,
            resourceId,
            resourceType,
          }), flowNode],
        ])
        .call(getPreProcessedResponseMappingData, {
          resourceType,
          preProcessedData,
          adaptorType: restExport.adaptorType,
        })
        .returns(undefined)
        .run();
    });
    test('should call updateStateForProcessorData when the stage is invalid', () => {
      const stage = 'INVALID_STAGE';
      const restExport = {
        _id: 'export-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
      };

      expectSaga(requestProcessorData, {
        flowId,
        resourceId,
        resourceType,
        processor: stage,
      })
        .provide([
          [select(selectors.resourceData, resourceType, resourceId), { merged: restExport }],
          [call(getFlowStageData, {
            flowId,
            resourceId,
            resourceType,
            stage,
            routerId: undefined,
            isInitialized: true,
          }), {}],
        ])
        .call.fn(updateStateForProcessorData)
        .not.call.fn(_processData)
        .run();
    });
  });
});

describe('pageProcessorPreviewOptions sagas', () => {
  describe('_getUIDataForResource saga', () => {
    test('should return nothing if the resource is null/undefined', () => expectSaga(_getUIDataForResource, {}).returns(undefined).run());

    test('should return default Blob sampledata incase of blob resource', () => {
      const blobResource = {
        _id: 'export-123',
        type: 'blob',
        name: 'blob export',
      };
      const previewData = getBlobResourceSampleData();

      expectSaga(_getUIDataForResource, { resource: blobResource }).returns(previewData).run();
    });
    test('should call requestFileAdaptorSampleData and return response incase of file type resource', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'json',
        },
        adaptorType: 'FTPExport',
        sampleData: { test: 5 },
      };
      const fileSampleData = { test: 5 };

      expectSaga(_getUIDataForResource, { resource: ftpResource })
        .provide([
          [call(requestFileAdaptorSampleData, { resource: ftpResource }), fileSampleData],
        ])
        .call(requestFileAdaptorSampleData, { resource: ftpResource })
        .returns(fileSampleData)
        .run();
    });
    test('should call requestRealTimeMetadata and return response incase of real time resource', () => {
      const netsuiteResource = {
        _id: 'export-123',
        name: 'NS export',
        type: 'distributed',
        adaptorType: 'NetSuiteExport',
      };
      const metadata = { test: 5 };

      expectSaga(_getUIDataForResource, { resource: netsuiteResource })
        .provide([
          [call(requestRealTimeMetadata, { resource: netsuiteResource, refresh: undefined }), metadata],
        ])
        .call(requestRealTimeMetadata, { resource: netsuiteResource, refresh: undefined })
        .returns(metadata)
        .run();
    });
    test('should call requestRealTimeMetadata with refresh prop if passed and return response incase of real time resource', () => {
      const netsuiteResource = {
        _id: 'export-123',
        name: 'NS export',
        type: 'distributed',
        adaptorType: 'NetSuiteExport',
      };
      const metadata = { test: 5 };

      expectSaga(_getUIDataForResource, { resource: netsuiteResource, refresh: true })
        .provide([
          [call(requestRealTimeMetadata, { resource: netsuiteResource, refresh: true }), metadata],
        ])
        .call(requestRealTimeMetadata, { resource: netsuiteResource, refresh: true })
        .returns(metadata)
        .run();
    });
    test('should return sample data on resource if existed on empty object for web hook resource', () => {
      const webhookResource = {
        _id: 'export-123',
        name: 'webhook export',
        adaptorType: 'WebhookExport',
        sampleData: { test: 5 },
      };

      expectSaga(_getUIDataForResource, { resource: webhookResource })
        .returns({ test: 5 })
        .run();
    });
    test('should return sampleData on the resource if it is an IA resource and does not fall under above cases', () => {
      const restExport = {
        _id: 'export-123',
        _connectorId: 'connector-123',
        name: 'NS export',
        adaptorType: 'RESTExport',
        sampleData: { test: 5 },
      };
      const iaFlow = {
        _id: 'flow-123',
        _connectorId: 'connector-123',
        name: 'ia flow',
        pageGenerators: [],
        pageProcessors: [],
      };

      expectSaga(_getUIDataForResource, { resource: restExport, flow: iaFlow })
        .returns({ test: 5 })
        .run();
    });
  });
  describe('getPreviewOptionsForResource saga', () => {
    test('should call _getUIDataForResource only if the resource is eligible to pass uiData', () => {
      expectSaga(getPreviewOptionsForResource, { resource: null })
        .not.call.fn(_getUIDataForResource)
        .run();
      const netsuiteResource = {
        _id: 'export-123',
        name: 'NS export',
        type: 'distributed',
        adaptorType: 'NetSuiteExport',
      };

      expectSaga(getPreviewOptionsForResource, { resource: netsuiteResource })
        .call.fn(_getUIDataForResource)
        .run();
    });
    test('should return runOfflineOptions if runOffline is passed true and resource has rawData', () => {
      const restExport = {
        _id: 'export-123',
        _connectionId: 'conn-123',
        name: 'rest export',
        adaptorType: 'RESTExport',
        rawData: 'rawDataKey-123',
      };
      const connectionDoc = { _id: 'conn-123', name: 'connection1'};
      const uiData = { test: 5 };
      const runOfflineOptions = {
        runOffline: true,
        runOfflineSource: 'db',
      };

      expectSaga(getPreviewOptionsForResource, { resource: restExport, runOffline: true })
        .provide([
          [select(
            selectors.resource,
            'connections',
            restExport._connectionId
          ), connectionDoc],
          [
            call(_getUIDataForResource, {
              resource: restExport,
              connection: connectionDoc,
              flow: undefined,
              refresh: undefined,
            }),
            uiData,
          ],
        ])
        .returns({ runOfflineOptions })
        .run();
    });
    test('should return uiData with postData if the resource is of type delta', async () => {
      const iaDeltaResource = {
        _id: 'export-123',
        _connectorId: 'connector-123',
        name: 'IA export',
        sampleData: { test: 5 },
        type: 'delta',
      };
      const flow = {
        _id: 'flow-123',
        _connectorId: 'connector-123',
        name: 'testing flow',
        pageGenerators: [],
        pageProcessors: [],
      };
      const uiData = { test: 5 };
      const postData = {
        lastExportDateTime: expect.any(String),
        currentExportDateTime: expect.any(String),
      };

      const { returnValue } = await expectSaga(getPreviewOptionsForResource, { resource: iaDeltaResource, flow })
        .provide([
          [
            call(_getUIDataForResource, {
              resource: iaDeltaResource,
              connection: null,
              flow,
              refresh: undefined,
            }),
            uiData,
          ],
        ])
        .run();

      expect(returnValue).toEqual({ uiData, postData });
    });
    test('should return uiData with files if the resource is a file adaptor', async () => {
      const flow = {
        _id: 'flow-123',
        _connectorId: 'connector-123',
        name: 'testing flow',
        pageGenerators: [],
        pageProcessors: [],
      };
      const fileAdaptorResource = {
        adaptorType: 'FTPExport',
      };
      const uiData = { test: 5 };

      const { returnValue } = await expectSaga(getPreviewOptionsForResource, { resource: fileAdaptorResource, flow })
        .provide([
          [
            call(_getUIDataForResource, {
              resource: fileAdaptorResource,
              connection: null,
              flow,
              refresh: undefined,
            }),
            uiData,
          ],
        ])
        .run();
      const files = getSampleFileMeta(fileAdaptorResource);

      expect(returnValue).toEqual({ uiData, files });
    });
    test('should return uiData returned from _getUIDataForResource when runOffline is false', () => {
      const iaResource = {
        _id: 'export-123',
        _connectorId: 'connector-123',
        name: 'IA export',
        sampleData: { test: 5 },
      };
      const flow = {
        _id: 'flow-123',
        _connectorId: 'connector-123',
        name: 'testing flow',
        pageGenerators: [],
        pageProcessors: [],
      };
      const uiData = { test: 5 };
      const files = undefined;

      expectSaga(getPreviewOptionsForResource, { resource: iaResource, flow})
        .provide([
          [
            call(_getUIDataForResource, {
              resource: iaResource,
              connection: null,
              flow,
              refresh: undefined,
            }),
            uiData,
          ],
        ])
        .returns({ uiData, files })
        .run();
    });
  });
});
