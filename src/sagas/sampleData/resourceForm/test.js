/* global describe, test */

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
  _fetchResourceInfoFromFormKey,
  _hasSampleDataOnResource,
  _getProcessorOutput,
} from '.';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import { pageProcessorPreview } from '../utils/previewCalls';
import { getCsvFromXlsx } from '../../../utils/file';
import { STANDALONE_INTEGRATION } from '../../../utils/constants';

const formKey = 'form-123';
const resourceId = 'export-123';
const flowId = 'flow-123';
const integrationId = 'int-123';

describe('resourceFormSampleData sagas', () => {
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
    test('should dispatch requested status and call _requestExportSampleData with refreshCache option incase of exports resourceType ', () => {
      const resourceId = 'import-123';

      return expectSaga(requestResourceFormSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceType: 'imports' }],
          [call(_requestImportSampleData, { formKey }), {}],
        ])
        .delay(500)
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'requested'))
        .not.call.fn(_requestExportSampleData)
        .call(_requestImportSampleData, { formKey })
        .run(500);
    });
    test('should dispatch requested status and call _requestImportSampleData incase of imports resourceType ', () => {
      const refreshCache = true;

      return expectSaga(requestResourceFormSampleData, { formKey, options: {refreshCache} })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceType: 'exports' }],
          [call(_requestExportSampleData, { formKey, refreshCache }), {}],
        ])
        .delay(500)
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'requested'))
        .call(_requestExportSampleData, { formKey, refreshCache })
        .not.call.fn(_requestImportSampleData)
        .run(500);
    });
  });
  describe('_requestExportSampleData saga', () => {
    const refreshCache = true;

    test('should call _requestPGExportSampleData if the resource is PG export or stand alone export', () => {
      const testPGWithoutFlowId = expectSaga(_requestExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId }],
          [call(_requestPGExportSampleData, { formKey, refreshCache }), {}],
        ])
        .call(_requestPGExportSampleData, { formKey, refreshCache })
        .not.call.fn(_requestLookupSampleData)
        .run();
      const testPGWithFlowId = expectSaga(_requestExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId }],
          [select(selectors.isPageGenerator, flowId, resourceId), true],
          [call(_requestPGExportSampleData, { formKey, refreshCache }), {}],
        ])
        .call(_requestPGExportSampleData, { formKey, refreshCache })
        .not.call.fn(_requestLookupSampleData)
        .run();
      const testStandaloneExport = expectSaga(_requestExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId }],
          [select(selectors.isPageGenerator, flowId, resourceId), false],
          [select(selectors.isStandaloneExport, flowId, resourceId), true],
          [call(_requestPGExportSampleData, { formKey, refreshCache }), {}],
        ])
        .call(_requestPGExportSampleData, { formKey, refreshCache })
        .not.call.fn(_requestLookupSampleData)
        .run();

      return testPGWithoutFlowId && testPGWithFlowId && testStandaloneExport;
    });
    test('should call _requestLookupSampleData if the resource is a PP lookup', () => expectSaga(_requestExportSampleData, { formKey, refreshCache })
      .provide([
        [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId }],
        [select(selectors.isPageGenerator, flowId, resourceId), false],
        [select(selectors.isStandaloneExport, flowId, resourceId), false],
        [call(_requestLookupSampleData, { formKey, refreshCache }), {}],
      ])
      .call(_requestLookupSampleData, { formKey, refreshCache })
      .not.call.fn(_requestPGExportSampleData)
      .run());
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

      return expectSaga(_requestPGExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource }],
          [call(_requestFileSampleData, { formKey }), {}],
        ])
        .call(_requestFileSampleData, { formKey })
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

      return expectSaga(_requestPGExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: nsResource }],
          [call(_requestRealTimeSampleData, { formKey, refreshCache }), {}],
        ])
        .call(_requestRealTimeSampleData, { formKey, refreshCache })
        .not.call.fn(_requestFileSampleData)
        .not.call.fn(_requestExportPreviewData)
        .run();
    });
    test('should _requestExportPreviewData if the export\'s sample data can be extracted from preview call', () => {
      const restResource = {
        _id: '123',
        adaptorType: 'RESTExport',
      };

      return expectSaga(_requestPGExportSampleData, { formKey, refreshCache })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: restResource }],
          [call(_requestExportPreviewData, { formKey }), {}],
        ])
        .call(_requestExportPreviewData, { formKey })
        .not.call.fn(_requestFileSampleData)
        .not.call.fn(_requestRealTimeSampleData)
        .run();
    });
  });
  describe('_requestExportPreviewData saga', () => {
    const sampleDataRecordSize = 5;

    test('should construct body with needed props for making preview call and dispatch receivedPreviewStages on success', () => {
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
        _integrationId: integrationId,
        test: {
          limit: sampleDataRecordSize,
        },
      };

      return expectSaga(_requestExportPreviewData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceObj, resourceId, flowId, integrationId }],
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
        _integrationId: undefined,
        test: {
          limit: sampleDataRecordSize,
        },
      };

      return expectSaga(_requestExportPreviewData, { formKey })
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
    test('should call _handlePreviewError saga on preview error ', () => {
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

      return expectSaga(_requestExportPreviewData, { formKey })
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

    test('should call requestRealTimeMetadata and dispatch parseData action to update the same', () => {
      const realTimeSampleData = [
        {group: 'Body Field', id: 'thirdpartyacct', name: '3rd Party Billing Account Number', type: 'text'},
      ];

      return expectSaga(_requestRealTimeSampleData, { formKey, refreshCache })
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
      .not.call.fn(_hasSampleDataOnResource)
      .not.call.fn(_parseFileData)
      .run());
    test('should call parseFileData for File definitions by fetching sampleData and rules from fileDefinitionSampleData selector', () => {
      const ftpResource = {
        _id: 'export-123',
        name: 'FTP export',
        file: {
          type: 'filedefinition',
        },
        adaptorType: 'FTPExport',
        sampleData: { test: 5 },
      };
      const fieldState = {
        userDefinitionId: 'id-123',
        options: {format: 'edi'},
      };
      const fileDefinitionSampleData = 'UNB+UNOC:3+<Sender GLN>:14+<Receiver GLN>:14+140407:1000+100+ + + + +EANCOM';
      const rule = {
        name: '84 Lumber 810',
        description: 'Invoice',
        sampleData: 'ISA*02*SW810 *00* *01*84EXAMPLE *12',
        rules: [{
          maxOccurrence: 1,
          skipRowSuffix: true,
        }],
      };

      return expectSaga(_requestFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource}],
          [select(selectors.fieldState, formKey, 'file.filedefinition.rules'), fieldState],
          [select(selectors.fileDefinitionSampleData, {
            userDefinitionId: fieldState.userDefinitionId,
            resourceType: 'exports',
            options: { format: fieldState.options.format, definitionId: undefined, resourcePath: undefined },
          }), { rule, sampleData: fileDefinitionSampleData }],
          [call(_parseFileData, {
            resourceId,
            fileContent: fileDefinitionSampleData,
            parserOptions: rule,
            fileType: 'fileDefinitionParser',
          }), {}],
        ])
        .call(_parseFileData, {
          resourceId,
          fileContent: fileDefinitionSampleData,
          parserOptions: rule,
          fileType: 'fileDefinitionParser',
        })
        .not.put(actions.resourceFormSampleData.clearStages(resourceId))
        .run();
    });
    test('should check for uploaded file content from getUploadedFile and call parseFileData saga with that content for other valid file types ', () => {
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
      const fileId = `${resourceId}-uploadFile`;
      const uploadedFile = {
        file: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
      };

      return expectSaga(_requestFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource}],
          [select(selectors.getUploadedFile, fileId), uploadedFile],
          [call(_parseFileData, {
            resourceId,
            fileContent: uploadedFile.file,
            fileType: 'csv',
            parserOptions,
            fileProps,
            isNewSampleData: true}), {}],
        ])
        .call(_parseFileData, {
          resourceId,
          fileContent: uploadedFile.file,
          fileType: 'csv',
          parserOptions,
          fileProps,
          isNewSampleData: true})
        .not.put(actions.resourceFormSampleData.clearStages(resourceId))
        .run();
    });
    test('should call _hasSampleDataOnResource saga and pass resourceObj\'s sampleData as fileContent for parseFileData saga', () => {
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
        sampleData: "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE↵C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0",
      };
      const fileId = `${resourceId}-uploadFile`;

      return expectSaga(_requestFileSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, resourceObj: ftpResource}],
          [select(selectors.getUploadedFile, fileId), undefined],
          [call(_hasSampleDataOnResource, { formKey }), true],
          [call(_parseFileData, { resourceId, fileContent: ftpResource.sampleData, fileProps, fileType: 'csv', parserOptions }), {}],
        ])
        .call(_parseFileData, { resourceId, fileContent: ftpResource.sampleData, fileProps, fileType: 'csv', parserOptions })
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

      return expectSaga(_requestLookupSampleData, { formKey })
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
      };
      const previewData = {
        stages: [{
          name: 'parse',
          data: {
            test: 5,
          },
        }],
      };

      return expectSaga(_requestLookupSampleData, { formKey })
        .provide([
          [call(_fetchResourceInfoFromFormKey, { formKey }), { resourceId, flowId, resourceObj: restResource}],
          [matchers.call.fn(pageProcessorPreview), previewData],
        ])
        .not.call.fn(_requestFileSampleData)
        .call.fn(pageProcessorPreview)
        .put(actions.resourceFormSampleData.receivedPreviewStages(resourceId, previewData))
        .run();
    });
    test('should call pageProcessorPreview saga to fetch preview data for lookup and call _handlePreviewError saga on failure', () => {
      const restResource = {
        _id: resourceId,
        adaptorType: 'RESTExport',
      };
      const error = { status: 401, message: '{"code":"error code"}' };

      return expectSaga(_requestLookupSampleData, { formKey })
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

      return expectSaga(_requestImportSampleData, { formKey })
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

      return expectSaga(_requestImportSampleData, { formKey })
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

      return expectSaga(_requestImportFileSampleData, { formKey })
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

      return expectSaga(_requestImportFileSampleData, { formKey })
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

      return expectSaga(_requestImportFileSampleData, { formKey })
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
      };
      const processorResponse = {
        data: {
          data: {
            users: { test: 5 },
          },
        },
      };

      return expectSaga(_parseFileData, { resourceId, fileContent, fileProps: ftpResource.file.csv, parserOptions, isNewSampleData: true, fileType: 'csv' })
        .provide([
          [call(_getProcessorOutput, { processorData }), processorResponse],
        ])
        .put(actions.resourceFormSampleData.setRawData(resourceId, fileContent))
        .call.fn(_getProcessorOutput)
        .put(actions.resourceFormSampleData.setParseData(resourceId))
        .put(actions.resourceFormSampleData.setPreviewData(resourceId))
        .put(actions.resourceFormSampleData.setStatus(resourceId, 'received'))
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
      };
      const processorResponse = {
        data: {
          data: {
            users: { test: 5 },
          },
        },
      };

      const parseData = processorResponse.data.data;

      return expectSaga(_parseFileData, { resourceId, fileContent, fileProps: ftpResource.file.csv, parserOptions, isNewSampleData: true, fileType: 'csv' })
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

