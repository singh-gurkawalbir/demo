/* eslint-disable jest/no-conditional-in-test */

import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { apiCallWithRetry } from '../../index';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import {
  requestResourceFormSampleData,
  _requestExportSampleData,
  _requestPGExportSampleData,
  _requestExportPreviewData,
  _requestRealTimeSampleData,
  _requestFileSampleData,
  _requestLookupSampleData,
  _requestImportSampleData,
  _requestImportFileSampleData,
  _parseFileData,
  _handlePreviewError,
  _getProcessorOutput,
  _fetchFBActionsSampleData,
  _requestPageProcessorSampleData,
} from '.';
import { _fetchResourceInfoFromFormKey, extractFileSampleDataProps, executeTransformationRules, executeJavascriptHook } from './utils';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import { pageProcessorPreview } from '../utils/previewCalls';
import { getCsvFromXlsx } from '../../../utils/file';
import { STANDALONE_INTEGRATION } from '../../../constants';
import {
  constructResourceFromFormValues,
  constructSuiteScriptResourceFromFormValues,
} from '../../utils';
import { evaluateExternalProcessor } from '../../editor';
import { message } from '../../../utils/messageStore';

const formKey = 'form-123';
const resourceId = 'export-123';
const flowId = 'flow-123';
const integrationId = 'int-123';
const ssLinkedConnectionId = 'ss-con-123';

describe('resourceFormSampleData sagas', () => {
  describe('_handlePreviewError saga', () => {
    test('should do nothing if there is no resourceId or invalid error', () => {
      const e = {
        status: 401,
        message: '{"message":"invalid processor", "code":"code"}',
      };

      expectSaga(_handlePreviewError, { e })
        .returns(undefined)
        .run();
      expectSaga(_handlePreviewError, { e: {} })
        .returns(undefined)
        .run();
      expectSaga(_handlePreviewError, { resourceId })
        .returns(undefined)
        .run();
    });
    test('should dispatch receivedPreviewError action when there is a valid error', () => {
      const e = {
        status: 422,
        message: '{"message":"invalid processor", "code":"code"}',
      };
      const parsedMessage = { message: 'invalid processor', code: 'code'};

      expectSaga(_handlePreviewError, { e, resourceId })
        .put(actions.resourceFormSampleData.receivedPreviewError(resourceId, parsedMessage))
        .run();
    });
    test('should dispatch receivedPreviewError action when there is a internal server error', () => {
      const e = {
        status: 500,
        message: '{"message":"any message", "code":"code"}',
      };

      expectSaga(_handlePreviewError, { e, resourceId })
        .put(actions.resourceFormSampleData.receivedPreviewError(resourceId, {errors: message.PREVIEW_FAILED}))
        .run();
    });
  });
  describe('_getProcessorOutput saga', () => {
    test('should return nothing if the output of processor call has violations', () => {
      const processorOutput = { violations: { dataError: 'must have sample data'}};

      expectSaga(_getProcessorOutput, { processorData: {} })
        .provide([
          [call(evaluateExternalProcessor, { processorData: {} }), processorOutput],
        ])
        .returns(undefined)
        .run();
    });
    test('should return processor output incase of proper output or error', () => {
      const processorOutput = { data: { test: 5 }};
      const errorOutput = {
        status: 422,
        message: '{"message":"invalid data to process", "code":"code"}',
      };

      expectSaga(_getProcessorOutput, { processorData: {} })
        .provide([
          [call(evaluateExternalProcessor, { processorData: {} }), processorOutput],
        ])
        .returns(processorOutput)
        .run();
      expectSaga(_getProcessorOutput, { processorData: {} })
        .provide([
          [call(evaluateExternalProcessor, { processorData: {} }), errorOutput],
        ])
        .returns(errorOutput)
        .run();
    });
  });
  describe('_fetchFBActionsSampleData saga', () => {
    const resourceObj = {
      _id: 'id-123',
      adaptorType: 'RESTExport',
      rest: {},
      transform: {
        type: 'expression',
        expression: {
          rules: [[{ extract: 'active', generate: 'Active'}]],
          version: '1',
        },
      },
      hook: {
        _scriptId: 'id-123',
        function: 'preSavePage',
      },
    };

    test('should dispatch undefined as stages data incase of invalid resource', () => expectSaga(_fetchFBActionsSampleData, { formKey })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId }],
        [select(
          selectors.getResourceSampleDataWithStatus,
          resourceId,
          'parse'
        ), { data: undefined }],
      ])
      .put(actions.resourceFormSampleData.setProcessorData({
        resourceId,
        processor: 'transform',
        processorData: undefined,
      }))
      .put(actions.resourceFormSampleData.setProcessorData({
        resourceId,
        processor: 'preSavePageHook',
        processorData: undefined,
      }))
      .run());

    test('should dispatch parse stage data if there are no transform rules to process on the resource', () => {
      const r = {
        _id: 'id-123',
        adaptorType: 'RESTExport',
        rest: {},
      };
      const parsedData = { test: 5 };

      expectSaga(_fetchFBActionsSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj: r, resourceId }],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'parse'
          ), { data: parsedData }],
        ])
        .put(actions.resourceFormSampleData.setProcessorData({
          resourceId,
          processor: 'transform',
          processorData: parsedData,
        }))
        .run();
    });
    test('should dispatch transform output for hooks stage if there are no hooks configured', () => {
      const r = {
        _id: 'id-123',
        adaptorType: 'RESTExport',
        rest: {},
        transform: {
          type: 'expression',
          expression: {
            rules: [[{ extract: 'active', generate: 'Active'}]],
            version: '1',
          },
        },
      };
      const parsedData = { active: 5 };
      const transformedData = { Active: 5 };

      expectSaga(_fetchFBActionsSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj: r, resourceId }],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'parse'
          ), { data: parsedData }],
          [call(executeTransformationRules, {
            transform: resourceObj?.transform,
            sampleData: parsedData,
            isIntegrationApp: false,
          }), { data: transformedData }],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'transform'
          ), { data: transformedData }],
        ])
        .put(actions.resourceFormSampleData.setProcessorData({
          resourceId,
          processor: 'transform',
          processorData: transformedData,
        }))
        .put(actions.resourceFormSampleData.setProcessorData({
          resourceId,
          processor: 'preSavePageHook',
          processorData: transformedData,
        }))
        .run();
    });
    test('should dispatch transform and hooks output for their respective stages when the same are configured on the resource', () => {
      const parsedData = { active: 5 };
      const transformedData = { Active: 5 };
      const preSavePageHookData = { Active: 5, test: 1 };

      expectSaga(_fetchFBActionsSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj, resourceId }],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'parse'
          ), { data: parsedData }],
          [call(executeTransformationRules, {
            transform: resourceObj?.transform,
            sampleData: parsedData,
            isIntegrationApp: false,
          }), { data: transformedData}],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'transform'
          ), { data: transformedData }],
          [call(executeJavascriptHook, {
            hook: resourceObj?.hooks?.preSavePage,
            sampleData: transformedData,
            isIntegrationApp: false,
          }), { data: preSavePageHookData }],
        ])
        .put(actions.resourceFormSampleData.setProcessorData({
          resourceId,
          processor: 'transform',
          processorData: transformedData,
        }))
        .put(actions.resourceFormSampleData.setProcessorData({
          resourceId,
          processor: 'preSavePageHook',
          processorData: preSavePageHookData,
        }))
        .run();
    });
  });

  describe('_fetchResourceInfoFromFormKey saga', () => {
    test('should call constructResourceFromFormValues to fetch resourceObj and return all form properties', () => {
      const parentContext = { resourceId, resourceType: 'imports' };
      const formState = {
        parentContext,
        value: {},
      };
      const expectedOutput = {
        formState,
        resourceId,
        resourceType: 'imports',
        resourceObj: {},
      };

      expectSaga(_fetchResourceInfoFromFormKey, { formKey })
        .provide([
          [select(selectors.formState, formKey), formState],
          [select(selectors.formParentContext, formKey), parentContext],
          [call(constructResourceFromFormValues, {
            formValues: {},
            resourceId,
            resourceType: 'imports',
          }), {}],
        ])
        .call.fn(constructResourceFromFormValues)
        .not.call.fn(constructSuiteScriptResourceFromFormValues)
        .returns(expectedOutput)
        .run();
    });
    test('should call constructSuiteScriptResourceFromFormValues incase of suite script form and return all form properties', () => {
      const parentContext = {
        resourceId,
        resourceType: 'exports',
        integrationId,
        ssLinkedConnectionId,
      };
      const formState = {
        parentContext,
        value: {},
      };
      const ssResource = {
        type: 'import',
        version: 'V2',
        _integrationId: integrationId,
        ssLinkedConnectionId,
        _id: resourceId,
        import: {},
        export: {
          file: {
            csv: {
              columnDelimiter: ',',
              hasHeaderRow: true,
            },
          },
          type: 'ftp',
        },
      };
      const expectedOutput = {
        formState,
        resourceId,
        resourceType: 'exports',
        resourceObj: ssResource.export,
        integrationId,
        ssLinkedConnectionId,
      };

      expectSaga(_fetchResourceInfoFromFormKey, { formKey })
        .provide([
          [select(selectors.formState, formKey), formState],
          [select(selectors.formParentContext, formKey), parentContext],
          [call(constructSuiteScriptResourceFromFormValues, {
            formValues: formState?.value || {},
            resourceId,
            resourceType: 'exports',
            ssLinkedConnectionId,
            integrationId,
          }), ssResource],
        ])
        .call.fn(constructSuiteScriptResourceFromFormValues)
        .not.call.fn(constructResourceFromFormValues)
        .returns(expectedOutput)
        .run();
    });
  });

  describe('requestResourceFormSampleData saga', () => {
    test('should do nothing if there is no formKey', () => expectSaga(requestResourceFormSampleData, {})
      .not.delay(500)
      .not.put(actions.resourceFormSampleData.setStatus(undefined, 'requested'))
      .not.call.fn(_requestExportSampleData)
      .not.call.fn(_requestImportSampleData)
      .run());
    test('should do nothing if the formKey passed does not associate with any resourceId or resourceType is not a valid one for sample data', () => expectSaga(requestResourceFormSampleData, { formKey })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), {}],
      ])
      .not.delay(500)
      .not.put(actions.resourceFormSampleData.setStatus(undefined, 'requested'))
      .not.call.fn(_requestExportSampleData)
      .not.call.fn(_requestImportSampleData)
      .run());
    test('should dispatch requested status and call _requestExportSampleData with refreshCache option incase of imports resourceType', () => {
      const resourceId = 'import-123';

      expectSaga(requestResourceFormSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceType: 'imports', resourceObj: {} }],
          [call(_requestImportSampleData, { formKey }), {}],
        ])
        .delay(500)
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'requested'))
        .not.call.fn(_requestExportSampleData)
        .call(_requestImportSampleData, { formKey, refreshCache: undefined })
        .run(500);
    });
    test('should dispatch requested status and call _requestImportSampleData incase of exports resourceType', () => {
      const refreshCache = true;

      expectSaga(requestResourceFormSampleData, { formKey, options: {refreshCache} })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceType: 'exports' }],
          [call(_requestExportSampleData, { formKey, refreshCache, executeProcessors: undefined }), {}],
        ])
        .delay(500)
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'requested'))
        .call(_requestExportSampleData, { formKey, refreshCache, executeProcessors: undefined})
        .not.call.fn(_requestImportSampleData)
        .run(500);
    });
    test('should dispatch requested status and call _requestExportSampleData incase of exports resourceType and put async task start and end actions if async key is present', () => {
      const refreshCache = true;
      const asyncKey = 'export-123';

      expectSaga(requestResourceFormSampleData, { formKey, options: {refreshCache, asyncKey} })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceType: 'exports' }],
          [call(_requestExportSampleData, { formKey, refreshCache, executeProcessors: undefined }), {}],
        ])
        .delay(500)
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'requested'))
        . put(actions.asyncTask.start(asyncKey))
        .call(_requestExportSampleData, { formKey, refreshCache, executeProcessors: undefined})
        .not.call.fn(_requestImportSampleData)
        .put(actions.asyncTask.success(asyncKey))
        .run(500);
    });
  });
  describe('_requestExportSampleData saga', () => {
    const refreshCache = true;

    test('should call _requestPGExportSampleData if the resource is PG export or stand alone export', () => {
      expectSaga(_requestExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId }],
          [call(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: undefined }), {}],
        ])
        .call(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: undefined })
        .not.call.fn(_requestLookupSampleData)
        .run();

      expectSaga(_requestExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId }],
          [select(selectors.isPageGenerator, flowId, resourceId), true],
          [call(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: undefined }), {}],
        ])
        .call(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: undefined })
        .not.call.fn(_requestLookupSampleData)
        .run();

      expectSaga(_requestExportSampleData, { formKey, refreshCache, executeProcessors: undefined })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId }],
          [select(selectors.isPageGenerator, flowId, resourceId), false],
          [select(selectors.isStandaloneExport, flowId, resourceId), true],
          [call(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: undefined }), {}],
        ])
        .call(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: undefined })
        .not.call.fn(_requestLookupSampleData)
        .run();
    });
    test('should call _requestLookupSampleData if the resource is a PP lookup', () => expectSaga(_requestExportSampleData, { formKey, refreshCache })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId, resourceObj: {} }],
        [select(selectors.isLookUpExport, {flowId, resourceId, resourceType: 'exports'}), true],
        [call(_requestLookupSampleData, { formKey, refreshCache }), {}],
      ])
      .call(_requestLookupSampleData, { formKey, refreshCache })
      .not.call.fn(_requestPGExportSampleData)
      .run());
    test('should call _requestFileSampleData incase of suitescript file resource', () => {
      const resourceObj = {
        type: 'fileCabinet',
        file: {
          csv: {
            columnDelimiter: ',',
            hasHeaderRow: true,
          },
        },
      };

      expectSaga(_requestExportSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, ssLinkedConnectionId, resourceObj }],
        ])
        .call(_requestFileSampleData, { formKey })
        .not.call(_requestLookupSampleData, { formKey })
        .not.call.fn(_requestPGExportSampleData)
        .run();
    });
    test('should dispatch clearStages incase of suitescript but not of a file resource', () => {
      const resourceObj = {
        type: 'rakuten',
      };

      expectSaga(_requestExportSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, ssLinkedConnectionId, resourceObj }],
        ])
        .put(actions.resourceFormSampleData.clearStages(resourceId))
        .not.call(_requestFileSampleData, { formKey })
        .not.call(_requestLookupSampleData, { formKey })
        .not.call.fn(_requestPGExportSampleData)
        .run();
    });
  });
  describe('_requestPGExportSampleData saga', () => {
    const refreshCache = true;

    test('should call _requestFileSampleData incase of file adaptor export', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'json',
        },
        adaptorType: 'FTPExport',
        sampleData: { test: 5 },
      };

      expectSaga(_requestPGExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource }],
          [call(_requestFileSampleData, { formKey }), {}],
        ])
        .call(_requestFileSampleData, { formKey })
        .not.call.fn(_fetchFBActionsSampleData)
        .not.call.fn(_requestRealTimeSampleData)
        .not.call.fn(_requestExportPreviewData)
        .run();
    });
    test('should call _fetchFBActionsSampleData for file adaptors if executeProcessors is passed true', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'json',
        },
        adaptorType: 'FTPExport',
        sampleData: { test: 5 },
      };

      expectSaga(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: true })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource }],
          [call(_requestFileSampleData, { formKey }), {}],
          [call(_fetchFBActionsSampleData, { formKey }), {}],
        ])
        .call(_requestFileSampleData, { formKey })
        .call(_fetchFBActionsSampleData, { formKey })
        .not.call.fn(_requestRealTimeSampleData)
        .not.call.fn(_requestExportPreviewData)
        .run();
    });
    test('should call _requestRealTimeSampleData incase of real time export', () => {
      const nsResource = {
        _id: '123',
        adaptorType: 'NetSuiteExport',
        netsuite: {
          distributed: { recordType: 'accounts' },
        },
        type: 'distributed',
      };

      expectSaga(_requestPGExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: nsResource }],
          [call(_requestRealTimeSampleData, { formKey, refreshCache }), {}],
        ])
        .call(_requestRealTimeSampleData, { formKey, refreshCache })
        .not.call(_fetchFBActionsSampleData, { formKey })
        .not.call.fn(_requestFileSampleData)
        .not.call.fn(_requestExportPreviewData)
        .run();
    });
    test('should call _fetchFBActionsSampleData when executeProcessors is true incase of real time export', () => {
      const nsResource = {
        _id: '123',
        adaptorType: 'NetSuiteExport',
        netsuite: {
          distributed: { recordType: 'accounts' },
        },
        type: 'distributed',
      };

      expectSaga(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: true })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: nsResource }],
          [call(_requestRealTimeSampleData, { formKey, refreshCache }), {}],
          [call(_fetchFBActionsSampleData, { formKey }), {}],
        ])
        .call(_requestRealTimeSampleData, { formKey, refreshCache })
        .call(_fetchFBActionsSampleData, { formKey })
        .not.call.fn(_requestFileSampleData)
        .not.call.fn(_requestExportPreviewData)
        .run();
    });
    test('should call _requestExportPreviewData if the export\'s sample data can be extracted from preview call', () => {
      const restResource = {
        _id: '123',
        adaptorType: 'RESTExport',
      };

      expectSaga(_requestPGExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: restResource }],
          [call(_requestExportPreviewData, { formKey, executeProcessors: undefined }), {}],
        ])
        .call(_requestExportPreviewData, { formKey, executeProcessors: undefined })
        .not.call.fn(_requestFileSampleData)
        .not.call.fn(_requestRealTimeSampleData)
        .run();
    });
    test('should call _requestExportPreviewData with executeProcessors true when the same is passed to _requestPGExportSampleData saga as true', () => {
      const restResource = {
        _id: '123',
        adaptorType: 'RESTExport',
      };

      expectSaga(_requestPGExportSampleData, { formKey, refreshCache, executeProcessors: true })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: restResource }],
          [call(_requestExportPreviewData, { formKey, executeProcessors: true }), {}],
        ])
        .call(_requestExportPreviewData, { formKey, executeProcessors: true })
        .not.call.fn(_requestFileSampleData)
        .not.call.fn(_requestRealTimeSampleData)
        .not.call(_fetchFBActionsSampleData, { formKey })
        .run();
    });
  });
  describe('_requestExportPreviewData saga', () => {
    const sampleDataRecordSize = 5;

    test('should construct body with needed props for making preview call and dispatch receivedPreviewStages on success', () => {
      const resourceObj = {
        _id: '123',
        adaptorType: 'RESTExport',
        transform: { rules: []},
        hooks: {
          preSavePage: {
            _scriptId: 'script-23',
            function: 'fn',
          },
        },
      };
      const flow = {
        _id: flowId,
        pageGenerators: [],
        pageProcessors: [],
        settings: {},
      };

      const path = `/integrations/${integrationId}/flows/${flowId}/exports/preview`;
      const body = {
        _id: '123',
        adaptorType: 'RESTExport',
        test: {
          limit: sampleDataRecordSize,
        },
      };

      expectSaga(_requestExportPreviewData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj, resourceId, flowId, integrationId }],
          [select(selectors.resource, 'flows', flowId), flow],
          [select(selectors.sampleDataRecordSize, resourceId), sampleDataRecordSize],
          [call(apiCallWithRetry, {
            path,
            opts: { method: 'POST', body },
            hidden: true,
          }), { test: 5 }],
        ])
        .call(apiCallWithRetry, {
          path,
          opts: { method: 'POST', body },
          hidden: true,
        })
        .run();
    });
    test('should construct body with needed props and remove mockOutput if present, for making preview call and dispatch receivedPreviewStages on success', () => {
      const resourceObj = {
        _id: '123',
        adaptorType: 'RESTExport',
        transform: { rules: []},
        hooks: {
          preSavePage: {
            _scriptId: 'script-23',
            function: 'fn',
          },
        },
        mockOutput: {data: 'dat'},
      };
      const flow = {
        _id: flowId,
        pageGenerators: [],
        pageProcessors: [],
        settings: {},
      };

      const path = `/integrations/${integrationId}/flows/${flowId}/exports/preview`;
      const body = {
        _id: '123',
        adaptorType: 'RESTExport',
        test: {
          limit: sampleDataRecordSize,
        },
      };

      expectSaga(_requestExportPreviewData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj, resourceId, flowId, integrationId }],
          [select(selectors.resource, 'flows', flowId), flow],
          [select(selectors.sampleDataRecordSize, resourceId), sampleDataRecordSize],
          [call(apiCallWithRetry, {
            path,
            opts: { method: 'POST', body },
            hidden: true,
          }), { test: 5 }],
        ])
        .call(apiCallWithRetry, {
          path,
          opts: { method: 'POST', body },
          hidden: true,
        })
        .run();
    });
    test('should not remove transformations and hooks from the resource when executeProcessors is true while making export preview call', () => {
      const resourceObj = {
        _id: '123',
        adaptorType: 'RESTExport',
        transform: { rules: []},
        hooks: {
          preSavePage: {
            _scriptId: 'script-23',
            function: 'fn',
          },
        },
      };
      const flow = {
        _id: flowId,
        pageGenerators: [],
        pageProcessors: [],
        settings: {},
      };

      const path = `/integrations/${integrationId}/flows/${flowId}/exports/preview`;
      const body = {
        _id: '123',
        adaptorType: 'RESTExport',
        transform: { rules: []},
        hooks: {
          preSavePage: {
            _scriptId: 'script-23',
            function: 'fn',
          },
        },
        test: {
          limit: sampleDataRecordSize,
        },
      };

      expectSaga(_requestExportPreviewData, { formKey, executeProcessors: true })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj, resourceId, flowId, integrationId }],
          [select(selectors.resource, 'flows', flowId), flow],
          [select(selectors.sampleDataRecordSize, resourceId), sampleDataRecordSize],
          [call(apiCallWithRetry, {
            path,
            opts: { method: 'POST', body },
            hidden: true,
          }), { test: 5 }],
        ])
        .call(apiCallWithRetry, {
          path,
          opts: { method: 'POST', body },
          hidden: true,
        })
        .run();
    });
    test('should ignore standalone integration Id while constructing body with needed props for making preview call', () => {
      const resourceObj = {
        _id: '123',
        adaptorType: 'RESTExport',
      };
      const flow = {
        _id: flowId,
        pageGenerators: [],
        pageProcessors: [],
        settings: {},
      };

      const body = {
        ...resourceObj,
        _flowId: flowId,
        test: {
          limit: sampleDataRecordSize,
        },
      };

      expectSaga(_requestExportPreviewData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj, resourceId, flowId, integrationId: STANDALONE_INTEGRATION.id }],
          [select(selectors.resource, 'flows', flowId), flow],
          [select(selectors.sampleDataRecordSize, resourceId), sampleDataRecordSize],
          [call(apiCallWithRetry, {
            path: '/exports/preview',
            opts: { method: 'POST', body },
            hidden: true,
          }), { test: 5 }],
        ])
        .call(apiCallWithRetry, {
          path: '/exports/preview',
          opts: { method: 'POST', body },
          hidden: true,
        })
        .run();
    });
    test('should call _handlePreviewError saga on preview error', () => {
      const resourceObj = {
        _id: '123',
        adaptorType: 'RESTExport',
      };
      const flow = {
        _id: flowId,
        pageGenerators: [],
        pageProcessors: [],
        settings: {},
      };

      const error = { status: 401, message: '{"code":"error code"}' };

      expectSaga(_requestExportPreviewData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj, resourceId, flowId, integrationId }],
          [select(selectors.resource, 'flows', flowId), flow],
          [select(selectors.sampleDataRecordSize, resourceId), sampleDataRecordSize],
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call(_handlePreviewError, { e: error, resourceId })
        .run();
    });
  });
  describe('_requestRealTimeSampleData saga', () => {
    const refreshCache = true;
    const nsResource = {
      _id: '123',
      adaptorType: 'NetSuiteExport',
      netsuite: {
        distributed: { recordType: 'accounts' },
      },
      type: 'distributed',
    };

    test('should pass refreshCache as false if not passed when it calls requestRealTimeMetadata saga', () => {
      const realTimeSampleData = [
        {group: 'Body Field', id: 'thirdpartyacct', name: '3rd Party Billing Account Number', type: 'text'},
      ];

      expectSaga(_requestRealTimeSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: nsResource }],
          [call(requestRealTimeMetadata, { resource: nsResource, refresh: false }), realTimeSampleData],
        ])
        .call(requestRealTimeMetadata, { resource: nsResource, refresh: false })
        .put(actions.resourceFormSampleData.setParseData(resourceId, realTimeSampleData))
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
        .run();
    });

    test('should call requestRealTimeMetadata and dispatch parseData action to update the same', () => {
      const realTimeSampleData = [
        {group: 'Body Field', id: 'thirdpartyacct', name: '3rd Party Billing Account Number', type: 'text'},
      ];

      expectSaga(_requestRealTimeSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: nsResource }],
          [call(requestRealTimeMetadata, { resource: nsResource, refresh: refreshCache }), realTimeSampleData],
        ])
        .call(requestRealTimeMetadata, { resource: nsResource, refresh: refreshCache })
        .put(actions.resourceFormSampleData.setParseData(resourceId, realTimeSampleData))
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
        .run();
    });
    test('should call requestRealTimeMetadata and dispatch parseData action with empty data if there is no metadata', () => expectSaga(_requestRealTimeSampleData, { formKey, refreshCache })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: nsResource }],
        [call(requestRealTimeMetadata, { resource: nsResource, refresh: refreshCache }), undefined],
      ])
      .call(requestRealTimeMetadata, { resource: nsResource, refresh: refreshCache })
      .put(actions.resourceFormSampleData.setParseData(resourceId, undefined))
      .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
      .run());
  });
  describe('_requestFileSampleData saga', () => {
    test('should dispatch clear stages action and do nothing if the file type is not valid or does not exist', () => expectSaga(_requestFileSampleData, { formKey })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), {resourceObj: {}, resourceId}],
      ])
      .put(actions.resourceFormSampleData.clearStages(resourceId))
      .not.call.fn(extractFileSampleDataProps)
      .not.call.fn(_parseFileData)
      .run());
    test('should dispatch clear stages action and do nothing if there is no sample data for the resource', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'filedefinition',
        },
        adaptorType: 'FTPExport',
      };

      expectSaga(_requestFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), {resourceObj: ftpResource, resourceId}],
          [call(extractFileSampleDataProps, { formKey }), {}],
        ])
        .call.fn(extractFileSampleDataProps)
        .not.call.fn(_parseFileData)
        .put(actions.resourceFormSampleData.clearStages(resourceId))
        .run();
    });
    test('should call extractFileSampleDataProps to get file sample data and then call _parseFileData saga to update the state', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'filedefinition',
        },
        adaptorType: 'FTPExport',
        sampleData: { test: 5 },
      };
      const rule = {
        name: '84 Lumber 810',
        description: 'Invoice',
        sampleData: 'ISA*02*SW810 *00* *01*84EXAMPLE *12',
        rules: [{
          maxOccurrence: 1,
          skipRowSuffix: true,
        }],
      };
      const response = {
        sampleData: rule.sampleData,
        parserOptions: rule,
        fileProps: {
          sortByFields: undefined,
          groupByFields: undefined,
        },
      };

      expectSaga(_requestFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource, resourceType: 'exports'}],
          [call(extractFileSampleDataProps, { formKey }), response],
          [matchers.call.fn(_parseFileData)],
        ])
        .call(_parseFileData, {
          resourceId,
          fileContent: response.sampleData,
          fileType: 'fileDefinitionParser',
          fileProps: response.fileProps,
          parserOptions: response.parserOptions,
          isNewSampleData: undefined,
          resourceType: 'exports',
        })
        .not.put(actions.resourceFormSampleData.clearStages(resourceId))
        .run();
    });
    test('should check for uploaded file content from getUploadedFile and call parseFileData saga with that content for other valid file types', () => {
      const fileProps = {
        columnDelimiter: '|',
        hasHeaderRow: true,
        rowsToSkip: 1,
      };
      const parserOptions = {
        rowsToSkip: 1,
        trimSpaces: undefined,
        columnDelimiter: '|',
        hasHeaderRow: true,
        rowDelimiter: undefined,
        sortByFields: [],
        groupByFields: [],
      };
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'csv',
          csv: fileProps,
        },
        adaptorType: 'FTPExport',
      };
      const uploadedFile = {
        file: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
      };

      expectSaga(_requestFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource, resourceType: 'exports'}],
          [call(extractFileSampleDataProps, { formKey }), {
            resourceId,
            sampleData: uploadedFile.file,
            parserOptions,
            fileProps,
            isNewSampleData: true,
          }],
          [matchers.call.fn(_parseFileData)],
        ])
        .call(_parseFileData, {
          resourceId,
          fileContent: uploadedFile.file,
          fileType: 'csv',
          parserOptions,
          fileProps,
          resourceType: 'exports',
          isNewSampleData: true})
        .not.put(actions.resourceFormSampleData.clearStages(resourceId))
        .run();
    });
  });
  describe('_requestLookupSampleData saga', () => {
    test('should call _requestFileSampleData incase of file adaptor lookup export', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'csv',
        },
        isLookup: true,
        adaptorType: 'FTPExport',
        sampleData: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
      };

      expectSaga(_requestLookupSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId, resourceObj: ftpResource}],
          [call(_requestFileSampleData, { formKey }), {}],
        ])
        .call(_requestFileSampleData, { formKey })
        .not.call.fn(pageProcessorPreview)
        .not.put(actions.resourceFormSampleData.receivedPreviewStages(resourceId, undefined))
        .run();
    });
    test('should call pageProcessorPreview saga to fetch preview data for lookup and dispatch receivedPreviewStages on success', () => {
      const restResource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
        transform: {},
        mockOutput: {},
        oneToMany: 'true',
      };
      const previewData = {
        stages: [{
          name: 'parse',
          data: {
            test: 5,
          },
        }],
      };
      const ppDoc = {
        _id: resourceId,
        adaptorType: 'RESTExport',
        oneToMany: true,
        test: { limit: 10 },
      };

      expectSaga(_requestLookupSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId, resourceObj: restResource}],
          [call(pageProcessorPreview, {
            flowId,
            _pageProcessorId: resourceId,
            resourceType: 'exports',
            hidden: true,
            _pageProcessorDoc: ppDoc,
            throwOnError: true,
            includeStages: true,
            refresh: false,
            addMockData: true,
          }), previewData],
        ])
        .not.call.fn(_requestFileSampleData)
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId: resourceId,
          resourceType: 'exports',
          hidden: true,
          _pageProcessorDoc: ppDoc,
          throwOnError: true,
          includeStages: true,
          refresh: false,
          addMockData: true,
        })
        .put(actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData))
        .run();
    });
    test('should call pageProcessorPreview saga to fetch preview data for lookup and call _handlePreviewError saga on failure', () => {
      const restResource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
      };
      const error = { status: 401, message: '{"code":"error code"}' };

      expectSaga(_requestLookupSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId, resourceObj: restResource}],
          [matchers.call.fn(pageProcessorPreview), throwError(error)],
        ])
        .not.call.fn(_requestFileSampleData)
        .call.fn(pageProcessorPreview)
        .not.put(actions.resourceFormSampleData.receivedPreviewStages(resourceId, undefined))
        .call(_handlePreviewError, { e: error, resourceId })
        .run();
    });
  });
  describe('_requestPageProcessorSampleData saga', () => {
    test('should call pageProcessorPreview saga to fetch preview data for import and dispatch receivedPreviewStages on success', () => {
      const restResource = {
        _id: resourceId,
        adaptorType: 'HTTPImport',
        transform: {},
        oneToMany: 'true',
        mockResponse: [{id: '123'}],
      };
      const previewData = {
        stages: [{
          name: 'parse',
          data: {
            test: 5,
          },
        }],
      };
      const ppDoc = {
        _id: resourceId,
        adaptorType: 'HTTPImport',
        oneToMany: true,
        transform: {},
      };

      expectSaga(_requestPageProcessorSampleData, { formKey, addMockData: true })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId, resourceObj: restResource}],
          [call(pageProcessorPreview, {
            flowId,
            _pageProcessorId: resourceId,
            resourceType: 'imports',
            hidden: true,
            _pageProcessorDoc: ppDoc,
            throwOnError: true,
            includeStages: true,
            refresh: false,
            addMockData: true,
          }), previewData],
        ])
        .not.call.fn(_requestFileSampleData)
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId: resourceId,
          resourceType: 'imports',
          hidden: true,
          _pageProcessorDoc: ppDoc,
          throwOnError: true,
          includeStages: true,
          refresh: false,
          addMockData: true,
        })
        .put(actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData))
        .run();
    });
    test('should call pageProcessorPreview saga to fetch preview data for import and call _handlePreviewError saga on failure', () => {
      const restResource = {
        _id: resourceId,
        adaptorType: 'HTTPImport',
      };
      const error = { status: 401, message: '{"code":"error code"}' };

      expectSaga(_requestPageProcessorSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId, resourceObj: restResource}],
          [matchers.call.fn(pageProcessorPreview), throwError(error)],
        ])
        .not.call.fn(_requestFileSampleData)
        .call.fn(pageProcessorPreview)
        .not.put(actions.resourceFormSampleData.receivedPreviewStages(resourceId, undefined))
        .call(_handlePreviewError, { e: error, resourceId })
        .run();
    });
  });
  describe('_requestImportSampleData saga', () => {
    test('should call _requestImportFileSampleData incase of file import', () => {
      const ftpResource = {
        _id: 'import-123',
        name: 'FTP import',
        file: {
          type: 'csv',
        },
        adaptorType: 'FTPImport',
        sampleData: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
      };
      const resourceId = 'import-123';

      expectSaga(_requestImportSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource }],
          [call(_requestImportFileSampleData, { formKey }), {}],
        ])
        .call(_requestImportFileSampleData, { formKey })
        .run();
    });
    test('should do nothing if the import is not a file import', () => {
      const restResource = {
        _id: 'import-123',
        name: 'test',
        adaptorType: 'RESTImport',
      };
      const resourceId = 'import-123';

      expectSaga(_requestImportSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: restResource }],
        ])
        .not.call(_requestImportFileSampleData, { formKey })
        .run();
    });
  });
  describe('_requestImportFileSampleData saga', () => {
    const resourceId = 'import-123';

    test('should dispatch clear stages action and do nothing if the file type does not exist', () => expectSaga(_requestImportFileSampleData, { formKey })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj: {}, resourceId }],
      ])
      .put(actions.resourceFormSampleData.clearStages(resourceId))
      .not.put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
      .not.put(actions.resourceFormSampleData.setRawData(resourceId, undefined))
      .run());
    test('should dispatch clear stages action and set status received if the file type is an invalid one', () => expectSaga(_requestImportFileSampleData, { formKey })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj: { file: { type: 'INVALID_TYPE' }}, resourceId }],
      ])
      .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
      .put(actions.resourceFormSampleData.clearStages(resourceId))
      .run());
    test('should dispatch setRawData action for fileDefinition import with sampleData fetched from fileDefinitionSampleData selector', () => {
      const ftpResource = {
        _id: 'import-123',
        name: 'FTP import',
        file: {
          type: 'filedefinition',
        },
        adaptorType: 'FTPImport',
      };
      const fieldState = {
        userDefinitionId: 'id-123',
        options: {format: 'edi'},
      };
      const fileDefinitionSampleData = {
        'SYNTAX IDENTIFIER': {
          'Syntax identifier': 'UNOC',
          'Syntax version number': '3',
        },
      };

      expectSaga(_requestImportFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj: ftpResource, resourceId }],
          [select(selectors.fieldState, formKey, 'file.filedefinition.rules'), fieldState],
          [select(selectors.fileDefinitionSampleData, {
            userDefinitionId: fieldState.userDefinitionId,
            resourceType: 'imports',
            options: { format: fieldState.options.format, definitionId: undefined },
          }), { sampleData: fileDefinitionSampleData }],
        ])
        .put(actions.resourceFormSampleData.setRawData(resourceId, fileDefinitionSampleData))
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
        .run();
    });
    test('should dispatch setParseData action in addition to setRawData incase of JSON file type', () => {
      const ftpResource = {
        _id: 'import-123',
        name: 'FTP import',
        file: {
          type: 'json',
        },
        adaptorType: 'FTPImport',
      };
      const fileId = `${resourceId}-uploadFile`;
      const uploadedFileContent = { test: 5 };

      expectSaga(_requestImportFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj: ftpResource, resourceId }],
          [select(selectors.getUploadedFile, fileId), { file: uploadedFileContent }],
        ])
        .put(actions.resourceFormSampleData.setRawData(resourceId, uploadedFileContent))
        .put(actions.resourceFormSampleData.setParseData(resourceId, uploadedFileContent))
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
        .run();
    });
    test('should dispatch setCsvData action in addition to setRawData incase of xlsx file type', () => {
      const ftpResource = {
        _id: 'import-123',
        name: 'FTP import',
        file: {
          type: 'xlsx',
        },
        adaptorType: 'FTPImport',
      };
      const fileId = `${resourceId}-uploadFile`;
      const uploadedFileContent = '00123450x12345';
      const csvData = 'users,name,id';

      expectSaga(_requestImportFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj: ftpResource, resourceId }],
          [select(selectors.getUploadedFile, fileId), { file: uploadedFileContent }],
          [call(getCsvFromXlsx, uploadedFileContent), { result: csvData }],
        ])
        .put(actions.resourceFormSampleData.setRawData(resourceId, uploadedFileContent))
        .put(actions.resourceFormSampleData.setCsvFileData(resourceId, csvData))
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
        .run();
    });
  });
  describe('_parseFileData saga', () => {
    test('should dispatch raw, parse and preview stages for json file type with the content passed', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'json',
          json: {
            resourcePath: 'users',
          },
        },
        adaptorType: 'FTPExport',
      };
      const fileContent = { users: { test: 5 }};
      const parserOptions = {
        resourcePath: 'users',
      };

      const processorData = {
        rule: parserOptions,
        data: fileContent,
        editorType: 'jsonParser',
        resourceType: 'exports',
      };
      const processorResponse = {
        data: {
          users: { test: 5 },
        },
      };
      const parsedData = {
        users: { test: 5 },
      };

      expectSaga(_parseFileData, { resourceType: 'exports', resourceId, fileContent, fileProps: ftpResource.file.json, parserOptions, isNewSampleData: true, fileType: 'json' })
        .provide([
          [call(_getProcessorOutput, { processorData }), processorResponse],
        ])
        .put(actions.resourceFormSampleData.setRawData(resourceId, fileContent))
        .call.fn(_getProcessorOutput)
        .put(actions.resourceFormSampleData.setParseData(resourceId, parsedData))
        .put(actions.resourceFormSampleData.setPreviewData(resourceId, parsedData))
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
        .run();
    });
    test('should dispatch receivedProcessorError action incase of processor error for json file type with the content passed', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'json',
          json: {
            resourcePath: 'users',
          },
        },
        adaptorType: 'FTPExport',
      };
      const fileContent = { users: { test: 5 }};
      const parserOptions = {
        resourcePath: 'users',
      };

      const processorData = {
        rule: parserOptions,
        data: fileContent,
        editorType: 'jsonParser',
        resourceType: 'exports',
      };
      const processorResponse = {
        error: {
          status: 422,
          message: '{"message":"invalid data to process", "code":"code"}',
        },
      };
      const parsedData = {
        users: { test: 5 },
      };

      expectSaga(_parseFileData, { resourceType: 'exports', resourceId, fileContent, fileProps: ftpResource.file.json, parserOptions, isNewSampleData: true, fileType: 'json' })
        .provide([
          [call(_getProcessorOutput, { processorData }), processorResponse],
        ])
        .put(actions.resourceFormSampleData.setRawData(resourceId, fileContent))
        .call.fn(_getProcessorOutput)
        .put(actions.resourceFormSampleData.receivedProcessorError(resourceId, processorResponse.error))
        .not.put(actions.resourceFormSampleData.setParseData(resourceId, parsedData))
        .not.put(actions.resourceFormSampleData.setPreviewData(resourceId, parsedData))
        .not.put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
        .run();
    });
    test('should call _getProcessorOutput saga and update corresponding stages for csv, xml and file definition file type', () => {
      const fileProps = {
        columnDelimiter: '|',
        hasHeaderRow: true,
        rowsToSkip: 1,
      };
      const parserOptions = {
        rowsToSkip: 1,
        trimSpaces: undefined,
        columnDelimiter: '|',
        hasHeaderRow: true,
        rowDelimiter: undefined,
        multipleRowsPerRecord: undefined,
        keyColumns: undefined,
      };
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'csv',
          csv: fileProps,
        },
        adaptorType: 'FTPExport',
      };
      const fileContent = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0";

      const processorData = {
        rule: parserOptions,
        data: fileContent,
        editorType: 'csvParser',
        resourceType: 'exports',
      };
      const processorResponse = {
        data: {
          users: { test: 5 },
        },
      };

      const parseData = {
        users: { test: 5 },
      };

      expectSaga(_parseFileData, { resourceType: 'exports', resourceId, fileContent, fileProps: ftpResource.file.csv, parserOptions, isNewSampleData: true, fileType: 'csv' })
        .provide([
          [call(_getProcessorOutput, { processorData }), processorResponse],
        ])
        .put(actions.resourceFormSampleData.setRawData(resourceId, fileContent))
        .call.fn(_getProcessorOutput)
        .put(actions.resourceFormSampleData.setParseData(resourceId, parseData))
        .put(actions.resourceFormSampleData.setPreviewData(resourceId, parseData))
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
        .run();
    });
  });
});

