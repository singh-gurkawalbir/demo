/* global describe, test, jest */

import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';
import { _getSampleDataRecordSize, _hasSampleDataOnResource, _getProcessorOutput, _updateDataForStages,
  _getPreviewData,
  _processRawData,
  _fetchExportPreviewData,
  requestExportSampleData,
  requestLookupSampleData } from './index';
import { DEFAULT_RECORD_SIZE } from '../../../utils/exportPanel';
import { evaluateExternalProcessor } from '../../editor';
import {
  constructResourceFromFormValues,
} from '../../utils';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import { pageProcessorPreview } from '../utils/previewCalls';
import { requestFileAdaptorPreview } from '../sampleDataGenerator/fileAdaptorSampleData';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';

jest.mock('../../../forms/formFactory/getResourceFromAssets');

// fake the return value of getResourceFormAssets when createFormValuesPatchSet calls this fn
getResourceFormAssets.mockReturnValue({fieldMap: {field1: {fieldId: 'something'}}, preSave: null});

describe('sampleData exports saga', () => {
  const resourceId = '123';
  const resourceType = 'exports';

  describe('_getSampleDataRecordSize saga', () => {
    test('should return default record size if resource id is invalid or undefined', () => expectSaga(_getSampleDataRecordSize, {})
      .returns(DEFAULT_RECORD_SIZE)
      .run());

    test('should return correct record size', () => expectSaga(_getSampleDataRecordSize, {resourceId})
      .provide([
        [select(selectors.sampleDataRecordSize, resourceId), 25],
      ])
      .returns(25)
      .run());
  });

  describe('_hasSampleDataOnResource saga', () => {
    test('should return false if resource doesnt exist or no sample data on body', () => {
      expectSaga(_hasSampleDataOnResource,
        { resourceId, resourceType })
        .provide([
          [select(selectors.resource, resourceType, resourceId), {}],
        ])
        .returns(false)
        .run();

      return expectSaga(_hasSampleDataOnResource,
        { resourceId, resourceType, body: {sampleData: 'abc'} })
        .returns(false)
        .run();
    });

    test('should return false if resource and body file type does not match', () => {
      const resource = {
        file: {
          type: 'csv',
        },
      };
      const body = {
        sampleData: {},
        file: {
          type: 'xml',
        },
      };

      return expectSaga(_hasSampleDataOnResource,
        { resourceId, resourceType, body })
        .provide([
          [select(selectors.resource, resourceType, resourceId), resource],
        ])
        .returns(false)
        .run();
    });

    test('should return true if resource and body file type matches', () => {
      const fileTypes = ['filedefinition', 'fixed', 'delimited/edifact'];
      const resource = {
        file: {
          type: 'filedefinition',
        },
      };
      const body = {
        sampleData: {},
        file: {
          type: fileTypes[Math.floor(Math.random() * fileTypes.length)],
        },
      };

      return expectSaga(_hasSampleDataOnResource,
        { resourceId, resourceType, body })
        .provide([
          [select(selectors.resource, resourceType, resourceId), resource],
        ])
        .returns(true)
        .run();
    });
  });

  describe('_getProcessorOutput saga', () => {
    test('should return data in case the call succeeds', () => {
      const processorData = {
        type: 'csv',
      };
      const processedData = {
        mode: 'text',
        data: {
          sku: 'abc',
        },
      };

      return expectSaga(_getProcessorOutput, { processorData })
        .provide([
          [call(evaluateExternalProcessor, {processorData}), processedData],
        ])
        .returns({ data: processedData })
        .run();
    });
    test('should return error in case of 400-500 exception codes', () => {
      const processorData = {
        type: 'csv',
      };

      return expectSaga(_getProcessorOutput, { processorData })
        .provide([
          [call(evaluateExternalProcessor, {processorData}), throwError({status: 404, message: '{"code":"error code"}'})],
        ])
        .returns({error: {code: 'error code'}})
        .run();
    });

    test('should return undefined in case of <400 or >500 exception codes', () => {
      const processorData = {
        type: 'csv',
      };

      return expectSaga(_getProcessorOutput, { processorData })
        .provide([
          [call(evaluateExternalProcessor, {processorData}), throwError({status: 304, message: '{"code":"error code"}'})],
        ])
        .returns(undefined)
        .run();
    });
  });

  describe('_updateDataForStages saga', () => {
    test('should do nothing if dataForEachStageMap is empty or undefined', () => expectSaga(_updateDataForStages, {resourceId })
      .returns(undefined)
      .run());

    test('should dispatch sample data update actions for all passed stages', () => {
      const dataForEachStageMap = {
        parse: {
          data: [{
            name: 'Bob',
          }],
        },
        preview: {
          data: [{
            name: 'Bob',
          }],
        },
        raw: {
          data: {
            body: '<name>Bob</name>',
          },
        },
      };

      return expectSaga(_updateDataForStages, {resourceId, dataForEachStageMap })
        .put(actions.sampleData.update(resourceId, {
          data: [{
            name: 'Bob',
          }],
        }, 'parse'))
        .put(actions.sampleData.update(resourceId, {
          data: [{
            name: 'Bob',
          }],
        }, 'preview'))
        .put(actions.sampleData.update(resourceId, {
          data: {
            body: '<name>Bob</name>',
          },
        }, 'raw'))
        .run();
    });
  });

  describe('_getPreviewData saga', () => {
    test('should call requestRealTimeMetadata if adaptor is realtime or distributed', () => {
      const constructedBody = {
        _id: '111',
        name: 'mock export',
        rawData: '37383jd8202002jk',
        type: 'webhook',
      };
      const expectedPostBody = {
        _id: '111',
        name: 'mock export',
        rawData: '37383jd8202002jk',
        type: 'webhook',
        verbose: true,
        runOfflineOptions: {
          runOffline: true,
          runOfflineSource: 'db',
        },
        test: {limit: DEFAULT_RECORD_SIZE},
      };

      return expectSaga(_getPreviewData, { resourceId, resourceType, runOffline: true })
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), constructedBody],
        ])
        .call(requestRealTimeMetadata, { resource: expectedPostBody })
        .run();
    });

    test('should make /preview call with rawData body if runOffline is true and adaptor is not realtime or distributed', () => {
      const constructedBody = {
        _id: '111',
        name: 'mock http export',
        rawData: '37383jd8202002jk',
        adaptorType: 'HTTPExport',
      };
      const expectedPostBody = {
        _id: '111',
        name: 'mock http export',
        rawData: '37383jd8202002jk',
        adaptorType: 'HTTPExport',
        verbose: true,
        runOfflineOptions: {
          runOffline: true,
          runOfflineSource: 'db',
        },
        test: {limit: DEFAULT_RECORD_SIZE},
      };

      return expectSaga(_getPreviewData, { resourceId, resourceType, runOffline: true })
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), constructedBody],
        ])
        .call(apiCallWithRetry, {
          path: `/${resourceType}/preview`,
          opts: { method: 'POST', body: expectedPostBody },
          message: 'Loading',
          hidden: true,
        })
        .run();
    });

    test('should dispatch sample data received action when api call is successful', () => {
      const previewData = {
        sku: 'abc',
        id: 1,
      };

      return expectSaga(_getPreviewData, { resourceId, resourceType, runOffline: true })
        .provide([
          [matchers.call.fn(apiCallWithRetry), previewData],
        ])
        .put(actions.sampleData.received(resourceId, previewData))
        .run();
    });

    test('should return undefined when there is 403 or 401 error', () => expectSaga(_getPreviewData, { resourceId, resourceType, runOffline: true })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError({ status: 401, message: '{"code":"error code"}' })],
      ])
      .not.put(
        actions.sampleData.receivedError(resourceId, {code: 'error code'}))
      .returns(undefined)
      .run());

    test('should dispatch sample data error action when there is an error', () => expectSaga(_getPreviewData, { resourceId, resourceType, runOffline: true })
      .provide([
        [matchers.call.fn(apiCallWithRetry), throwError({ status: 422, message: '{"code":"error code"}' })],
      ])
      .put(
        actions.sampleData.receivedError(resourceId, {code: 'error code'}))
      .run());
  });

  describe('_processRawData saga', () => {
    test('should call updateDataForStages and return with preview and parse stage if type is json', () => {
      const values = {
        editorValues: {},
        type: 'json',
        file: {
          _id: 'someId',
          name: 'As2 json',
          file: {
            type: 'json',
          },
          adaptorType: 'AS2Export',
        },
      };
      const body = {
        file: {
          output: 'records',
          skipDelete: false,
          type: 'json',
        },
      };
      const dataForEachStageMap = {
        rawFile: {
          data: {
            body: {
              _id: 'someId',
              name: 'As2 json',
              file: {
                type: 'json',
              },
              adaptorType: 'AS2Export',
            },
            type: 'json',
          },
        },
        raw: {
          data: {
            body: {
              _id: 'someId',
              name: 'As2 json',
              file: {
                type: 'json',
              },
              adaptorType: 'AS2Export',
            },
          },
        },
        preview: {
          data: {
            _id: 'someId',
            name: 'As2 json',
            file: {
              type: 'json',
            },
            adaptorType: 'AS2Export',
          },
        },
        parse: {
          data: [{
            _id: 'someId',
            name: 'As2 json',
            file: {
              type: 'json',
            },
            adaptorType: 'AS2Export',
          }],
        },
      };

      return expectSaga(_processRawData, { resourceId, resourceType, values})
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
        ])
        .call(_updateDataForStages, { resourceId, dataForEachStageMap })
        .returns(undefined)
        .run();
    });

    test('should call getProcessorOutput if type is not json', () => {
      const values = {
        type: 'xml',
        file: '<xml>somedata</xml>',
      };
      const body = {
        _id: 'someId',
        name: 'test ftp',
        file: {
          output: 'records',
          skipDelete: false,
          type: 'xml',
          xml: {
            resourcePath: '/',
          },
        },
      };
      const processorData = {
        rule: {resourcePath: '/'},
        data: '<xml>somedata</xml>',
        editorType: 'xmlParser',
      };

      return expectSaga(_processRawData, { resourceId, resourceType, values})
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
        ])
        .call(_getProcessorOutput, { processorData })
        .run();
    });

    test('should call updateDataForStages if processor output has data', () => {
      const values = {
        type: 'csv',
        file: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
      };
      const body = {
        _id: '5f203ab89b2e7468fbf6d415',
        name: 'test ftp',
        file: {
          output: 'records',
          skipDelete: false,
          type: 'csv',
          csv: {
            columnDelimiter: ',',
            rowDelimiter: '\n',
            hasHeaderRow: false,
            keyColumns: [],
            trimSpaces: true,
            rowsToSkip: 0,
          },
        },
      };

      const processorOutput = {
        data: {
          mediaType: 'json',
          data: [{
            Column0: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|' }],
          duration: 3,
        },
      };
      const dataForEachStageMap = {
        rawFile: {
          data: {
            body: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
            type: 'csv',
          },
        },
        raw: {
          data: {
            body: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
          },
        },
        csv: {
          data: {
            body: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
          },
        },
        preview: {
          data: [{
            Column0: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
          }],
        },
        parse: {
          data: [{
            Column0: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
          }],
        },
      };

      return expectSaga(_processRawData, { resourceId, resourceType, values})
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
          [matchers.call.fn(_getProcessorOutput), processorOutput],
        ])
        .call(_updateDataForStages, { resourceId, dataForEachStageMap })
        .not.put.actionType('RECEIVED_SAMPLEDATA_ERROR')
        .run();
    });

    test('should call updateDataForStages and dispatch sample data error action if processor output failed', () => {
      const values = {
        type: 'csv',
        file: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
      };
      const body = {
        _id: '5f203ab89b2e7468fbf6d415',
        name: 'test ftp',
        file: {
          output: 'records',
          skipDelete: false,
          type: 'csv',
          csv: {
            columnDelimiter: ',',
            rowDelimiter: '\n',
            hasHeaderRow: false,
            keyColumns: [],
            trimSpaces: true,
            rowsToSkip: 0,
          },
        },
      };

      const processorOutput = {
        error: {
          message: 'some error msg',
        },
      };
      const dataForEachStageMap = {
        rawFile: {
          data: {
            body: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
            type: 'csv',
          },
        },
        raw: {
          data: {
            body: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
          },
        },
        csv: {
          data: {
            body: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PAR|',
          },
        },
      };

      return expectSaga(_processRawData, { resourceId, resourceType, values})
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
          [matchers.call.fn(_getProcessorOutput), processorOutput],
        ])
        .call(_updateDataForStages, { resourceId, dataForEachStageMap })
        .put(actions.sampleData.receivedError(resourceId, processorOutput.error, 'parse'))
        .run();
    });
  });

  describe('_fetchExportPreviewData saga', () => {
    test('should dispatch sample data update action if no file is passed for file adaptor', () => {
      const body = {
        adaptorType: 'FTPExport',
      };
      const previewRecordSize = 2;
      const previewData = [{
        Column0: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE',
      }, {
        Column0: "C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84'",
        Column1: 'T113L',
        Column2: 'CSO',
        Column3: '1"core',
        Column4: '24/cs|60.53|0',
      }];

      const previewRecords = [{
        Column0: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE',
      }, {
        Column0: "C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84'",
        Column1: 'T113L',
        Column2: 'CSO',
        Column3: '1"core',
        Column4: '24/cs|60.53|0',
      }];

      const parsedData = [{
        Column0: 'CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE',
      }, {
        Column0: "C1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84'",
        Column1: 'T113L',
        Column2: 'CSO',
        Column3: '1"core',
        Column4: '24/cs|60.53|0',
      }];

      expectSaga(_fetchExportPreviewData, {
        resourceId,
        resourceType,
      })
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
          [call(_getSampleDataRecordSize, { resourceId }), previewRecordSize],
          [select(selectors.getResourceSampleDataWithStatus, resourceId, 'rawFile'), {}],
          [call(_hasSampleDataOnResource, { resourceId, resourceType, body}), true],
          [call(requestFileAdaptorPreview, { resource: body }), previewData],
        ])
        .put(actions.sampleData.update(resourceId, { data: previewRecords }, 'preview'))
        .put(actions.sampleData.update(resourceId, { data: [parsedData] }, 'parse'))
        .run();

      return expectSaga(_fetchExportPreviewData, {
        resourceId,
        resourceType,
      })
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
          [select(selectors.getResourceSampleDataWithStatus, resourceId, 'rawFile'), {}],
          [call(_hasSampleDataOnResource, { resourceId, resourceType, body}), false],
          [call(requestFileAdaptorPreview, { resource: body }), previewData],
        ])
        .put(actions.sampleData.update(resourceId, { data: undefined }, 'preview'))
        .put(actions.sampleData.update(resourceId, { data: undefined }, 'parse'))
        .run();
    });

    test('should dispatch sample data update action with undefined data if output mode is blob', () => {
      const body = {
        adaptorType: 'FTPExport',
        file: {
          output: 'blobKeys',
        },
      };

      return expectSaga(_fetchExportPreviewData, {
        resourceId,
        resourceType,
      })
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
          [select(selectors.getResourceSampleDataWithStatus, resourceId, 'rawFile'), {data: {}}],
        ])
        .put(actions.sampleData.update(resourceId, { data: undefined }, 'preview'))
        .put(actions.sampleData.update(resourceId, { data: undefined}, 'parse'))
        .run();
    });

    test('should call processRawData if file type adaptors', () => {
      const body = {
        adaptorType: 'AS2Export',
      };
      const sampleData = {
        data: {
          type: 'csv',
          body: 'ABC|DEF',
        },
      };

      const fileProps = {type: 'csv', file: 'ABC|DEF', formValues: undefined};

      return expectSaga(_fetchExportPreviewData, {
        resourceId,
        resourceType,
      })
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
          [select(selectors.getResourceSampleDataWithStatus, resourceId, 'rawFile'), sampleData],
        ])
        .call(_processRawData, {
          resourceId,
          resourceType,
          values: fileProps,
        })
        .run();
    });

    test('should call getPreviewData for non file type adaptors', () => {
      const body = {
        adaptorType: 'HTTPExport',
      };

      return expectSaga(_fetchExportPreviewData, {
        resourceId,
        resourceType,
      })
        .provide([
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), body],
        ])
        .call(_getPreviewData, {
          resourceId,
          resourceType,
          values: undefined,
          runOffline: undefined,
        })
        .run();
    });
  });

  describe('requestExportSampleData saga', () => {
    test('should call processRawData if stage is passed', () => expectSaga(requestExportSampleData, {
      resourceId,
      resourceType,
      stage: 'transform',
    })
      .call(_processRawData, {
        resourceId,
        resourceType,
        values: undefined,
        stage: 'transform',
      })
      .not.call.fn(_fetchExportPreviewData)
      .run());

    test('should call fetchExportPreviewData if stage is not passed', () => expectSaga(requestExportSampleData, {
      resourceId,
      resourceType,
    })
      .call(_fetchExportPreviewData, {
        resourceId,
        resourceType,
        values: undefined,
        runOffline: undefined,
      })
      .not.call.fn(_processRawData)
      .run());
  });

  describe('requestLookupSampleData saga', () => {
    test('should call pageProcessorPreview with oneToMany flag and test prop if resource supports the same', () => {
      const flowId = '999';

      const constructedBody = {
        _id: '111',
        name: 'mock export',
        oneToMany: 'true',
        type: 'webhook',
        sampleData: {
          sku: 'abc',
        },
      };

      const expectedDoc = {
        _id: '111',
        name: 'mock export',
        oneToMany: true,
        type: 'webhook',
        test: { limit: 10 },
      };

      return expectSaga(requestLookupSampleData, { resourceId, flowId })
        .provide([
          [select(selectors.sampleDataRecordSize, resourceId), 10],
          [call(constructResourceFromFormValues, {
            formValues: undefined,
            resourceId,
            resourceType,
          }), constructedBody],
        ])
        .call(pageProcessorPreview, {
          flowId,
          _pageProcessorId: resourceId,
          resourceType,
          hidden: true,
          _pageProcessorDoc: expectedDoc,
          throwOnError: true,
          includeStages: true,
        })
        .run();
    });

    test('should dispatch sample data received action if preview call is successful', () => {
      const flowId = '999';

      const pageProcessorPreviewData = {
        sku: 'abc',
        price: 5.0,
      };

      return expectSaga(requestLookupSampleData, { resourceId, flowId })
        .provide([
          [matchers.call.fn(pageProcessorPreview), pageProcessorPreviewData],
        ])
        .put(
          actions.sampleData.received(resourceId, pageProcessorPreviewData)
        )
        .run();
    });

    test('should dispatch sample data error action if preview call failed', () => {
      const flowId = '999';

      return expectSaga(requestLookupSampleData, { resourceId, flowId })
        .provide([
          [matchers.call.fn(pageProcessorPreview), throwError({status: 404, message: '{"code":"error code"}'})],
        ])
        .put(
          actions.sampleData.receivedError(resourceId, {code: 'error code'})
        )
        .run();
    });
  });
});
