/* global describe, test, expect */

import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../../index';
import { SCOPES } from '../../resourceForm';
import { evaluateExternalProcessor } from '../../editor';
import { getNetsuiteOrSalesforceMeta } from '../../resources/meta';
import { exportPreview, pageProcessorPreview } from './previewCalls';
import {
  generateFileParserOptionsFromResource,
  parseFileData,
  parseFileDefinition,
} from './fileParserUtils';
import {
  fetchPageProcessorPreview,
  fetchPageGeneratorPreview,
  requestProcessorData,
  requestSampleData,
} from '../flows';
import {
  getFlowResourceNode,
  filterPendingResources,
  fetchResourceDataForNewFlowResource,
  fetchFlowResources,
  requestSampleDataForImports,
  requestSampleDataForExports,
  updateStateForProcessorData,
  handleFlowDataStageErrors,
  getPreProcessedResponseMappingData,
  getFlowStageData,
} from './flowDataUtils';
import fetchMetadata from './metadataUtils';
import saveTransformationRulesForNewXMLExport, {
  _getXmlFileAdaptorSampleData,
  _getXmlHttpAdaptorSampleData,
} from './xmlTransformationRulesGenerator';
import getPreviewOptionsForResource from '../flows/pageProcessorPreviewOptions';

describe('Flow sample data utility sagas', () => {
  describe('fileParserUtils sagas', () => {
    describe('generateFileParserOptionsFromResource util', () => {
      test('should return undefined if the resource is not of file type', () => {
        const resource = { _id: 'id-123', adaptorType: 'RESTSExport', name: 'test'};

        expect(generateFileParserOptionsFromResource(resource)).toBeUndefined();
        expect(generateFileParserOptionsFromResource()).toBeUndefined();
        expect(generateFileParserOptionsFromResource(null)).toBeUndefined();
      });
      test('should return csv parse rules object incase of csv file resource', () => {
        const ftpCsvResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          file: {
            type: 'csv',
            csv: {
              columnDelimiter: ',',
              rowDelimiter: ' ',
              hasHeaderRow: false,
              trimSpaces: true,
              rowsToSkip: 0,
            },
          },
        };
        const expectedOptions = {
          columnDelimiter: ',',
          hasHeaderRow: false,
          keyColumns: undefined,
          multipleRowsPerRecord: undefined,
          rowDelimiter: ' ',
          rowsToSkip: 0,
          trimSpaces: true,
        };

        expect(generateFileParserOptionsFromResource(ftpCsvResource)).toEqual(expectedOptions);
      });
      test('should return xml parse rules object incase of xml file resource', () => {
        const ftpXmlResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          file: {
            type: 'xml',
            resourcePath: '/',
          },
          parsers: [
            {
              type: 'xml',
              version: '1',
              rules: {
                V0_json: false,
                trimSpaces: true,
                stripNewLineChars: true,
                attributePrefix: 'name',
                textNodeName: 'locations',
                listNodes: [
                  '/addresses', '/names',
                ],
                includeNodes: [
                  '/city/pin', '/branch',
                ],
                excludeNodes: [
                  '/desc', '/others',
                ],
              },
            },
          ],
        };
        const expectedOptions = {
          V0_json: false,
          attributePrefix: 'name',
          excludeNodes: ['/desc', '/others'],
          includeNodes: ['/city/pin', '/branch'],
          listNodes: ['/addresses', '/names'],
          resourcePath: undefined,
          stripNewLineChars: true,
          textNodeName: 'locations',
          trimSpaces: true,
        };

        expect(generateFileParserOptionsFromResource(ftpXmlResource)).toEqual(expectedOptions);
      });
      test('should return empty object incase of json as there are no parse rules', () => {
        const ftpJsonResource = {
          _id: 'export-123',
          name: 'FTP export',
          file: {
            type: 'json',
          },
          adaptorType: 'FTPExport',
          sampleData: { test: 5 },
        };

        expect(generateFileParserOptionsFromResource(ftpJsonResource)).toEqual({});
      });
      test('should return file definition rules if existed on resource for file definition type', () => {
        const ftpFileDefResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          ftp: {
            directoryPath: '/test',
          },
          file: {
            output: 'records',
            skipDelete: false,
            type: 'filedefinition',
            filedefinition: {
              resourcePath: 'SYNTAX IDENTIFIER',
              _fileDefinitionId: '5fda05801730a97681d30444',
              rules: {
                resourcePath: '',
                fileDefinition: {
                  _id: '5fda05801730a97681d30444',
                  lastModified: '2020-12-16T13:04:39.296Z',
                  name: 'Amazon Vendor Central EDIFACT DESADV',
                  description: 'Despatch advice message',
                  version: '1',
                  format: 'delimited/edifact',
                  delimited: {
                    rowSuffix: "'",
                    rowDelimiter: '\n',
                    colDelimiter: '+',
                  },
                  rules: [
                    {
                      maxOccurrence: 1,
                      required: true,
                      skipRowSuffix: true,
                      elements: [
                        {
                          name: 'UNB',
                          value: 'UNB',
                        },
                      ],
                      children: [
                        {
                          maxOccurrence: 1,
                          skipRowSuffix: true,
                          required: true,
                        },
                      ],

                    },
                  ],
                },
              },
            },
          },
        };
        const expectedOptions = { rule: ftpFileDefResource.file.filedefinition.rules };

        expect(generateFileParserOptionsFromResource(ftpFileDefResource)).toEqual(expectedOptions);
      });
    });
    describe('parseFileData saga', () => {
      test('should not call evaluateExternalProcessor saga if the resource is empty/null', () =>
        expectSaga(parseFileData, {sampleData: undefined, resource: null})
          .not.call.fn(evaluateExternalProcessor)
          .run() &&
          expectSaga(parseFileData, {})
            .not.call.fn(evaluateExternalProcessor)
            .run() &&
            expectSaga(parseFileData, {sampleData: undefined, resource: { _id: '123', name: 'test', adaptorType: 'RESTExport'}})
              .not.call.fn(evaluateExternalProcessor)
              .run()
      );
      test('should not call evaluateExternalProcessor saga if the resource file type is not supported', () => {
        const ftpFileDefResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          ftp: {
            directoryPath: '/test',
          },
          file: {
            output: 'records',
            skipDelete: false,
            type: 'filedefinition',
            filedefinition: {
              resourcePath: 'SYNTAX IDENTIFIER',
              _fileDefinitionId: '5fda05801730a97681d30444',
            },
          },
        };

        return expectSaga(parseFileData, { sampleData: { test: 5 }, resource: ftpFileDefResource})
          .not.call.fn(evaluateExternalProcessor)
          .run();
      });
      test('should call evaluateExternalProcessor and return processed data on success ', () => {
        const ftpCsvResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          file: {
            type: 'csv',
            csv: {
              columnDelimiter: ',',
              rowDelimiter: ' ',
              hasHeaderRow: true,
              trimSpaces: true,
              rowsToSkip: 0,
            },
          },
        };
        const sampleData = "occurredAt,source,code,message,traceKey,exportDataURI,importDataURI,oIndex,retryDataKey,errorId,legacyId,_flowJobId,classification,classifiedBy,retryAt\n09/30/2020 12:08:47 pm,connection,DOWNLOAD_ERROR,File object doesn't exist: ftp://unittest@ftp.celigo.com:************@ftp.celigo.com/TEST,,,,0,,840452691,,5f7427f5f874d353bd4bd6f7,missing,autopilot\n";
        const processedData = {
          occurredAt: '09/30/2020 12:08:47 pm',
          source: 'connection',
          code: 'DOWNLOAD_ERROR',
          message: "File object doesn't exist: ftp://unittest@ftp.celigo.com:************@ftp.celigo.com/TEST",
          traceKey: null,
          exportDataURI: null,
          importDataURI: null,
          oIndex: '0',
          retryDataKey: null,
          errorId: '840452691',
          legacyId: null,
          _flowJobId: '5f7427f5f874d353bd4bd6f7',
          classification: 'missing',
          classifiedBy: 'autopilot',
          retryAt: null,
        };
        const processorData = {
          data: sampleData,
          editorType: 'csvParser',
          rule: generateFileParserOptionsFromResource(ftpCsvResource),
        };

        return expectSaga(parseFileData, {sampleData, resource: ftpCsvResource })
          .provide([
            [call(evaluateExternalProcessor, { processorData }), processedData],
          ])
          .call.fn(evaluateExternalProcessor)
          .returns(processedData)
          .run();
      });
      test('should return undefined incase evaluateExternalProcessor throws error ', () => {
        const ftpCsvResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          file: {
            type: 'csv',
            csv: {
              columnDelimiter: ',',
              rowDelimiter: ' ',
            },
          },
        };
        const sampleData = { test: 5 };
        const processorData = {
          data: sampleData,
          editorType: 'csvParser',
          rule: generateFileParserOptionsFromResource(ftpCsvResource),
        };
        const error = JSON.stringify({
          errors: [{status: 404, message: '{"code":"Not a valid data to process"}'}],
        });

        return expectSaga(parseFileData, {sampleData, resource: ftpCsvResource })
          .provide([
            [call(evaluateExternalProcessor, { processorData }), throwError(error)],
          ])
          .call.fn(evaluateExternalProcessor)
          .returns(undefined)
          .run();
      });
    });
    describe('parseFileDefinition saga', () => {
      test('should not invoke file definition processor api if the resource is empty/null', () => expectSaga(parseFileDefinition, {})
        .not.call.fn(apiCallWithRetry)
        .run() &&
        expectSaga(parseFileDefinition, {sampleData: { test: 5 }, resource: null})
          .not.call.fn(apiCallWithRetry)
          .run()
      );
      test('should not invoke file definition processor api if the passed resource is not of file type', () => {
        const resource = { _id: 'id-123', adaptorType: 'RESTSExport', name: 'test'};

        return expectSaga(parseFileDefinition, { sampleData: { test: 5 }, resource})
          .not.call.fn(apiCallWithRetry)
          .run();
      });
      test('should not invoke file definition processor api if the resource does not have _fileDefinitionId or sampleData', () => {
        const ftpCsvResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          file: {
            type: 'csv',
            csv: {
              columnDelimiter: ',',
              rowDelimiter: ' ',
              hasHeaderRow: true,
              trimSpaces: true,
              rowsToSkip: 0,
            },
          },
        };

        return expectSaga(parseFileDefinition, { sampleData: { test: 5 }, resource: ftpCsvResource})
          .not.call.fn(apiCallWithRetry)
          .run();
      });
      test('should invoke file definition processor api and return the response if no resourcePath is provided', () => {
        const sampleData = 'UNB+UNOC:3+<Sender GLN>:14+<Receiver GLN>:14+140407:1000+100+ + + + +EANCOM';
        const _fileDefinitionId = '5fda05801730a97681d30444';
        const ftpFileDefResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          ftp: {
            directoryPath: '/test',
          },
          file: {
            output: 'records',
            skipDelete: false,
            type: 'filedefinition',
            fileDefinition: {
              resourcePath: '',
              _fileDefinitionId,
            },
          },
        };
        const processedData = {
          data: {
            'SYNTAX IDENTIFIER': {
              'Syntax identifier': 'UNOC',
              'Syntax version number': '3',
            },
          },
        };

        return expectSaga(parseFileDefinition, {sampleData, resource: ftpFileDefResource})
          .provide([
            [call(apiCallWithRetry, {
              path: `/fileDefinitions/parse?_fileDefinitionId=${_fileDefinitionId}`,
              opts: {
                method: 'POST',
                body: {
                  data: sampleData,
                  _fileDefinitionId,
                },
              },
              message: 'Loading',
              hidden: true,
            }), processedData],
          ])
          .call.fn(apiCallWithRetry)
          .returns(processedData)
          .run();
      });
      test('should invoke file definition processor api and return the target data when resourcePath is provided', () => {
        const sampleData = 'UNB+UNOC:3+<Sender GLN>:14+<Receiver GLN>:14+140407:1000+100+ + + + +EANCOM';
        const _fileDefinitionId = '5fda05801730a97681d30444';
        const ftpFileDefResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          ftp: {
            directoryPath: '/test',
          },
          file: {
            output: 'records',
            skipDelete: false,
            type: 'filedefinition',
            fileDefinition: {
              resourcePath: 'SYNTAX IDENTIFIER',
              _fileDefinitionId,
            },
          },
        };
        const processedData = {
          data: {
            'SYNTAX IDENTIFIER': {
              'Syntax identifier': 'UNOC',
              'Syntax version number': '3',
            },
          },
        };
        const processedDataWithResourcePath = {
          data: {
            'Syntax identifier': 'UNOC',
            'Syntax version number': '3',
          },
        };

        return expectSaga(parseFileDefinition, {sampleData, resource: ftpFileDefResource})
          .provide([
            [call(apiCallWithRetry, {
              path: `/fileDefinitions/parse?_fileDefinitionId=${_fileDefinitionId}`,
              opts: {
                method: 'POST',
                body: {
                  data: sampleData,
                  _fileDefinitionId,
                },
              },
              message: 'Loading',
              hidden: true,
            }), processedData],
          ])
          .call.fn(apiCallWithRetry)
          .returns(processedDataWithResourcePath)
          .run();
      });
      test('should invoke file definition processor api and return the undefined data when invalid resourcePath is provided', () => {
        const sampleData = 'UNB+UNOC:3+<Sender GLN>:14+<Receiver GLN>:14+140407:1000+100+ + + + +EANCOM';
        const _fileDefinitionId = '5fda05801730a97681d30444';
        const ftpFileDefResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          ftp: {
            directoryPath: '/test',
          },
          file: {
            output: 'records',
            skipDelete: false,
            type: 'filedefinition',
            fileDefinition: {
              resourcePath: 'INVALID_PATH',
              _fileDefinitionId,
            },
          },
        };
        const processedData = {
          data: {
            'SYNTAX IDENTIFIER': {
              'Syntax identifier': 'UNOC',
              'Syntax version number': '3',
            },
          },
        };
        const processedDataWithResourcePath = {
          data: undefined,
        };

        return expectSaga(parseFileDefinition, {sampleData, resource: ftpFileDefResource})
          .provide([
            [call(apiCallWithRetry, {
              path: `/fileDefinitions/parse?_fileDefinitionId=${_fileDefinitionId}`,
              opts: {
                method: 'POST',
                body: {
                  data: sampleData,
                  _fileDefinitionId,
                },
              },
              message: 'Loading',
              hidden: true,
            }), processedData],
          ])
          .call.fn(apiCallWithRetry)
          .returns(processedDataWithResourcePath)
          .run();
      });
      test('should invoke file definition processor api and return undefined when the api fails', () => {
        const sampleData = 'INVALID_DATA';
        const _fileDefinitionId = '5fda05801730a97681d30444';
        const ftpFileDefResource = {
          _id: 'export-123',
          name: 'FTP export',
          adaptorType: 'FTPExport',
          ftp: {
            directoryPath: '/test',
          },
          file: {
            output: 'records',
            skipDelete: false,
            type: 'filedefinition',
            fileDefinition: {
              _fileDefinitionId,
            },
          },
        };
        const error = { status: 404, message: 'Not found' };

        return expectSaga(parseFileDefinition, {sampleData, resource: ftpFileDefResource})
          .provide([
            [call(apiCallWithRetry, {
              path: `/fileDefinitions/parse?_fileDefinitionId=${_fileDefinitionId}`,
              opts: {
                method: 'POST',
                body: {
                  data: sampleData,
                  _fileDefinitionId,
                },
              },
              message: 'Loading',
              hidden: true,
            }), throwError(error)],
          ])
          .call.fn(apiCallWithRetry)
          .returns(undefined)
          .run();
      });
    });
  });
  describe('flowDataUtils sagas', () => {
    describe('getFlowResourceNode saga', () => {
      test('should return nothing if the passed resourceId/flowId is invalid', () => expectSaga(getFlowResourceNode, {})
        .returns(undefined)
        .run());
      test('should return nothing if the resourceId is not part of flow for the passed flowId', () => {
        const flowId = 'flow-123';
        const resourceId = 'export-123';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-111'}],
          pageProcessors: [{ type: 'import', _importId: 'import-111'}],
        };

        return expectSaga(getFlowResourceNode, { resourceId, flowId, resourceType: 'exports'})
          .provide([
            [select(
              selectors.resourceData,
              'flows',
              flowId,
              SCOPES.VALUE
            ), { merged: flow}],
          ])
          .returns(undefined)
          .run();
      });
      test('should return PG node if the passed resourceId is a PG in the flow', () => {
        const flowId = 'flow-123';
        const resourceId = 'export-123';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{type: 'import', _importId: 'import-111'}],
        };
        const expectedNode = flow.pageGenerators[0];

        return expectSaga(getFlowResourceNode, { resourceId, flowId, resourceType: 'exports'})
          .provide([
            [select(
              selectors.resourceData,
              'flows',
              flowId,
              SCOPES.VALUE
            ), { merged: flow}],
            [select(
              selectors.isPageGenerator,
              flowId,
              resourceId,
              'exports'
            ), true],
          ])
          .returns(expectedNode)
          .run();
      });
      test('should return PP node if the passed resourceId is a PP in the flow', () => {
        const flowId = 'flow-123';
        const resourceId = 'import-123';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-1234'}],
          pageProcessors: [
            { type: 'import', _importId: 'import-123', responseMapping: [{extract: 'name', generate: 'userName'}]},
            {type: 'import', _importId: 'import-111'},
          ],
        };
        const expectedNode = flow.pageProcessors[0];

        return expectSaga(getFlowResourceNode, { resourceId, flowId, resourceType: 'imports'})
          .provide([
            [select(
              selectors.resourceData,
              'flows',
              flowId,
              SCOPES.VALUE
            ), { merged: flow}],
            [select(
              selectors.isPageGenerator,
              flowId,
              resourceId,
              'imports'
            ), false],
          ])
          .returns(expectedNode)
          .run();
      });
    });
    describe('filterPendingResources saga', () => {
      test('should return undefined if the flow is null/undefined', () => {
        const flow = null;

        expect(filterPendingResources({ flow })).toBeUndefined();
      });
      test('should return the passed flow if there are no pending PG/PP in the flow', () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-1234'}],
          pageProcessors: [
            { type: 'import', _importId: 'import-123', responseMapping: [{extract: 'name', generate: 'userName'}]},
            { type: 'import', _importId: 'import-111'},
          ],
        };

        expect(filterPendingResources({ flow })).toEqual(flow);
      });
      test('should return the flow without the pending PG/PP from the original flow', () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-1234'}, { _connectionId: 'conn-111'}],
          pageProcessors: [
            { _connectionId: 'conn-123'},
            {type: 'import', _importId: 'import-111'},
          ],
        };
        const expectedFlow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-1234'}],
          pageProcessors: [
            {type: 'import', _importId: 'import-111'},
          ],
        };

        expect(filterPendingResources({ flow })).toEqual(expectedFlow);
      });
    });
    describe('fetchResourceDataForNewFlowResource saga', () => {
      test('should return undefined incase of invalid/no resourceId ', () => expectSaga(fetchResourceDataForNewFlowResource, {})
        .returns(undefined)
        .run());
      test('should add postData on the resource incase of delta export resource', async () => {
        const deltaResource = {
          name: 'Test export',
          _id: '1234',
          type: 'delta',
          rest: {
            once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5}},
            relativeURI: '/api/v2/users.json',
          },
          adaptorType: 'RESTExport',
        };
        const deltaResourceWithPostData = {
          name: 'Test export',
          _id: '1234',
          type: 'delta',
          rest: {
            once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5}},
            relativeURI: '/api/v2/users.json',
          },
          adaptorType: 'RESTExport',
          postData: {
            lastExportDateTime: expect.any(String),
            currentExportDateTime: expect.any(String),
          },
        };
        const { returnValue } = await expectSaga(fetchResourceDataForNewFlowResource, { resourceId: '1234', resourceType: 'exports' })
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              '1234',
              SCOPES.VALUE
            ), { merged: deltaResource}],
          ])
          .run();

        expect(returnValue).toEqual(deltaResourceWithPostData);
      });
    });
    describe('fetchFlowResources saga', () => {
      test('should return empty object incase of flow passed as null or type is INVALID', () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}],
        };

        return expectSaga(fetchFlowResources, {})
          .returns({})
          .run() && expectSaga(fetchFlowResources, {flow, type: 'INVALID'})
          .returns({})
          .run();
      });
      test('should return map of pgs when type is pageGenerators ', () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}, { _exportId: 'export-456'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}],
        };
        const pg1 = { _id: 'export-123', name: 'pg1', adaptorType: 'RESTExport'};
        const pg2 = { _id: 'export-456', name: 'pg2', adaptorType: 'HTTPExport'};
        const resourceType = 'exports';
        const flowResourcesMap = {
          'export-123': {doc: pg1, options: {}},
          'export-456': {doc: pg2, options: {}},
        };

        return expectSaga(fetchFlowResources, { flow, type: 'pageGenerators' })
          .provide([
            [select(
              selectors.resourceData,
              resourceType,
              'export-123',
              SCOPES.VALUE
            ), { merged: pg1}],
            [select(
              selectors.resourceData,
              resourceType,
              'export-456',
              SCOPES.VALUE
            ), { merged: pg2}],
            [call(
              getPreviewOptionsForResource,
              { resource: pg1, flow, refresh: undefined, runOffline: undefined }
            ), {}],
            [call(
              getPreviewOptionsForResource,
              { resource: pg2, flow, refresh: undefined, runOffline: undefined }
            ), {}],
          ])
          .returns(flowResourcesMap)
          .run();
      });
      test('should return map of pps when type is pageProcessors ', () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}, { _exportId: 'export-456'}],
          pageProcessors: [
            { type: 'export', _exportId: 'lookup-123'},
            { type: 'export', _exportId: 'lookup-456'},
            { type: 'import', _importId: 'import-123'},
          ],
        };
        const pp1 = { _id: 'lookup-123', name: 'pp1', adaptorType: 'RESTExport'};
        const pp2 = { _id: 'lookup-456', name: 'pp2', adaptorType: 'HTTPExport'};
        const pp3 = { _id: 'import-123', name: 'pp3', adaptorType: 'HTTPImport'};

        const sampleResponseData = {
          id: '',
          errors: '',
          ignored: '',
          statusCode: '',
          headers: '',
        };
        const lookupResponseData = {
          data: '',
          errors: '',
          ignored: '',
          statusCode: '',
        };

        const flowResourcesMap = {
          'lookup-123': {doc: {...pp1, sampleResponseData: lookupResponseData}, options: {}},
          'lookup-456': {doc: {...pp2, sampleResponseData: lookupResponseData}, options: {}},
          'import-123': {doc: {...pp3, sampleResponseData}, options: {}},
        };

        return expectSaga(fetchFlowResources, { flow, type: 'pageProcessors' })
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              'lookup-123',
              SCOPES.VALUE
            ), { merged: pp1}],
            [select(
              selectors.resourceData,
              'exports',
              'lookup-456',
              SCOPES.VALUE
            ), { merged: pp2}],
            [select(
              selectors.resourceData,
              'imports',
              'import-123',
              SCOPES.VALUE
            ), { merged: pp3}],
            [call(
              getPreviewOptionsForResource,
              { resource: pp1, flow, refresh: undefined, runOffline: undefined }
            ), {}],
            [call(
              getPreviewOptionsForResource,
              { resource: pp2, flow, refresh: undefined, runOffline: undefined }
            ), {}],
          ])
          .returns(flowResourcesMap)
          .run();
      });
      test('should return map of pgs with uiData/postData in the options when type is pageGenerators', async () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}, { _exportId: 'export-456'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}],
        };
        const postData = {
          lastExportDateTime: expect.any(String),
          currentExportDateTime: expect.any(String),
        };
        const pg1Options = {
          uiData: { users: [{_id: 'user1', name: 'user1'}, {_id: 'user2', name: 'user2'}]},
        };
        const pg2Options = {
          uiData: {tickets: [{_id: 'ticket1', name: 'ticket1'}, {_id: 'ticket2', name: 'ticket2'}]},
          postData,
        };

        const pg1 = { _id: 'export-123', name: 'pg1', adaptorType: 'RESTExport'};
        const pg2 = { _id: 'export-456', name: 'pg2', adaptorType: 'HTTPExport', type: 'delta'};
        const resourceType = 'exports';
        const flowResourcesMap = {
          'export-123': {doc: pg1, options: pg1Options},
          'export-456': {doc: {...pg2, postData}, options: pg2Options},
        };

        const { returnValue } = await expectSaga(fetchFlowResources, { flow, type: 'pageGenerators' })
          .provide([
            [select(
              selectors.resourceData,
              resourceType,
              'export-123',
              SCOPES.VALUE
            ), { merged: pg1}],
            [select(
              selectors.resourceData,
              resourceType,
              'export-456',
              SCOPES.VALUE
            ), { merged: pg2}],
            [call(
              getPreviewOptionsForResource,
              { resource: pg1, flow, refresh: undefined, runOffline: undefined }
            ), pg1Options],
            [call(
              getPreviewOptionsForResource,
              { resource: pg2, flow, refresh: undefined, runOffline: undefined }
            ), pg2Options],
          ])
          .run();

        expect(returnValue).toEqual(flowResourcesMap);
      });
      test('should return runOfflineOptions for PGs incase runOffline is true and PG has rawData, should also pass refresh prop to getPreviewOptionsForResource saga if passed true ', async () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}, { _exportId: 'export-456'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}],
        };

        const runOfflineOptions = {
          runOffline: true,
          runOfflineSource: 'db',
        };
        const postData = {
          lastExportDateTime: expect.any(String),
          currentExportDateTime: expect.any(String),
        };

        const pg1 = {
          _id: 'export-123',
          name: 'pg1',
          adaptorType: 'RESTExport',
          rawData: 'EMPTY_RAW_DATA',
        };
        const pg2 = {
          _id: 'export-456',
          name: 'pg2',
          adaptorType: 'HTTPExport',
          type: 'delta',
          rawData: 'rawData123',
        };

        const pg1Options = {
          uiData: { users: [{_id: 'user1', name: 'user1'}, {_id: 'user2', name: 'user2'}]},
        };
        const pg2OptionsWithRunOffline = { runOfflineOptions, postData };

        const resourceType = 'exports';
        const flowResourcesMap = {
          'export-123': {doc: pg1, options: pg1Options},
          'export-456': {doc: {...pg2, postData}, options: pg2OptionsWithRunOffline},
        };
        const runOffline = true;
        const refresh = true;

        const { returnValue } = await expectSaga(fetchFlowResources, { flow, type: 'pageGenerators', runOffline, refresh })
          .provide([
            [select(
              selectors.resourceData,
              resourceType,
              'export-123',
              SCOPES.VALUE
            ), { merged: pg1}],
            [select(
              selectors.resourceData,
              resourceType,
              'export-456',
              SCOPES.VALUE
            ), { merged: pg2}],
            [call(
              getPreviewOptionsForResource,
              { resource: pg1, flow, refresh, runOffline }
            ), pg1Options],
            [call(
              getPreviewOptionsForResource,
              { resource: pg2, flow, refresh, runOffline }
            ), pg2OptionsWithRunOffline],
          ])
          .run();

        expect(returnValue).toEqual(flowResourcesMap);
      });
      test('should trim data processors ( tx,filters, hooks) for IA resource in the resourceMap returned', () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          _connectorId: 'conn-123',
          pageGenerators: [{ _exportId: 'export-123'}, { _exportId: 'export-456'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}],
        };

        const pg1 = {
          _id: 'export-123',
          name: 'pg1',
          adaptorType: 'RESTExport',
          _connectorId: 'conn-123',
          transform: {
            type: 'expression',
            expression: {
              rules: [
                [
                  {
                    extract: 'users[*]',
                    generate: 'customers[*]',
                  },
                ],
              ],
              version: '1',
            },
          },
          filter: {
            type: 'expression',
            expression: {
              rules: [],
              version: '1',
            },
          },
          sampleData: { test: 5 },
        };
        const pg1WithoutProcessors = {
          _id: 'export-123',
          name: 'pg1',
          adaptorType: 'RESTExport',
          _connectorId: 'conn-123',
          sampleData: { test: 5 },
        };
        const pg2 = {
          _id: 'export-456',
          name: 'pg2',
          adaptorType: 'HTTPExport',
          _connectorId: 'conn-123',
        };
        const resourceType = 'exports';
        const flowResourcesMap = {
          'export-123': {doc: pg1WithoutProcessors, options: { uiData: pg1.sampleData }},
          'export-456': {doc: pg2, options: { uiData: undefined }},
        };

        return expectSaga(fetchFlowResources, { flow, type: 'pageGenerators' })
          .provide([
            [select(
              selectors.resourceData,
              resourceType,
              'export-123',
              SCOPES.VALUE
            ), { merged: pg1}],
            [select(
              selectors.resourceData,
              resourceType,
              'export-456',
              SCOPES.VALUE
            ), { merged: pg2}],
            [call(
              getPreviewOptionsForResource,
              { resource: pg1, flow, refresh: undefined, runOffline: undefined }
            ), { uiData: pg1.sampleData }],
            [call(
              getPreviewOptionsForResource,
              { resource: pg2, flow, refresh: undefined, runOffline: undefined }
            ), { uiData: undefined }],
          ])
          .returns(flowResourcesMap)
          .run();
      });
      test('should remove sampleData from any resource returned in case the resource is not an IA', () => {
        const flow = {
          _id: 'flow-123',
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}, { _exportId: 'export-456'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}],
        };

        const pg1 = {
          _id: 'export-123',
          name: 'pg1',
          adaptorType: 'RESTExport',
          sampleData: { test: 5 },
        };
        const pg1WithoutSampledata = {
          _id: 'export-123',
          name: 'pg1',
          adaptorType: 'RESTExport',
        };
        const pg2 = {
          _id: 'export-456',
          name: 'pg2',
          adaptorType: 'HTTPExport',
        };
        const resourceType = 'exports';
        const flowResourcesMap = {
          'export-123': {doc: pg1WithoutSampledata, options: { uiData: undefined }},
          'export-456': {doc: pg2, options: { uiData: undefined }},
        };

        return expectSaga(fetchFlowResources, { flow, type: 'pageGenerators' })
          .provide([
            [select(
              selectors.resourceData,
              resourceType,
              'export-123',
              SCOPES.VALUE
            ), { merged: pg1}],
            [select(
              selectors.resourceData,
              resourceType,
              'export-456',
              SCOPES.VALUE
            ), { merged: pg2}],
          ])
          .returns(flowResourcesMap)
          .run();
      });
    });
    describe('requestSampleDataForImports saga', () => {
      test('should do nothing if the sampleDataStage is not passed / invalid', () => {
        const resourceId = 'import-123';
        const flowId = 'flow-123';

        return expectSaga(requestSampleDataForImports, { resourceId, flowId })
          .not.call.fn(fetchPageProcessorPreview)
          .run();
      });
      test('should call fetchPageProcessorPreview for flowInput stage', () => {
        const resourceId = 'import-123';
        const flowId = 'flow-123';

        return expectSaga(requestSampleDataForImports, { resourceId, flowId, sampleDataStage: 'flowInput' })
          .call(fetchPageProcessorPreview, {
            flowId,
            _pageProcessorId: resourceId,
            resourceType: 'imports',
            hidden: true,
            previewType: 'flowInput',
          })
          .run();
      });
      test('should dispatch receivedPreviewData with parsed sampleResponse if the data is in JSON string format on the resource for the stage sampleResponse', () => {
        const resourceId = 'import-123';
        const flowId = 'flow-123';
        const resource = {
          _id: 'import-123',
          name: 'test',
          adaptorType: 'RESTImport',
          sampleResponseData: '{ "test": 5 }',
        };
        const parsedSampleResponse = {
          test: 5,
        };

        return expectSaga(requestSampleDataForImports, { resourceId, flowId, sampleDataStage: 'sampleResponse' })
          .provide([
            [select(
              selectors.resourceData,
              'imports',
              resourceId,
              SCOPES.VALUE
            ), { merged: resource}],
          ])
          .put(
            actions.flowData.receivedPreviewData(
              flowId,
              resourceId,
              parsedSampleResponse,
              'sampleResponse'
            )
          )
          .run();
      });
      test('should dispatch receivedPreviewData with sampleResponse if the data is not in JSON string format on the resource for the stage sampleResponse', () => {
        const resourceId = 'import-123';
        const flowId = 'flow-123';
        const resource = {
          _id: 'import-123',
          name: 'test',
          adaptorType: 'RESTImport',
          sampleResponseData: { test: 5 },
        };
        const parsedSampleResponse = {
          test: 5,
        };

        return expectSaga(requestSampleDataForImports, { resourceId, flowId, sampleDataStage: 'sampleResponse' })
          .provide([
            [select(
              selectors.resourceData,
              'imports',
              resourceId,
              SCOPES.VALUE
            ), { merged: resource}],
          ])
          .put(
            actions.flowData.receivedPreviewData(
              flowId,
              resourceId,
              parsedSampleResponse,
              'sampleResponse'
            )
          )
          .run();
      });
      test('should dispatch receivedPreviewData with sampleResponse if the data is not in JSON string format ( like XML sampleResponse ) on the resource for the stage sampleResponse', () => {
        const resourceId = 'import-123';
        const flowId = 'flow-123';
        const resource = {
          _id: 'import-123',
          name: 'test',
          adaptorType: 'RESTImport',
          sampleResponseData: '<xml>123</xml>',
        };
        const parsedSampleResponse = '<xml>123</xml>';

        return expectSaga(requestSampleDataForImports, { resourceId, flowId, sampleDataStage: 'sampleResponse' })
          .provide([
            [select(
              selectors.resourceData,
              'imports',
              resourceId,
              SCOPES.VALUE
            ), { merged: resource}],
          ])
          .put(
            actions.flowData.receivedPreviewData(
              flowId,
              resourceId,
              parsedSampleResponse,
              'sampleResponse'
            )
          )
          .run();
      });
      test('should call requestProcessorData for all the other processor stages', () => {
        const resourceId = 'import-123';
        const flowId = 'flow-123';
        const sampleDataStage = 'importMapping';

        return expectSaga(requestSampleDataForImports, { resourceId, flowId, sampleDataStage })
          .call(requestProcessorData, {
            flowId,
            resourceId,
            resourceType: 'imports',
            processor: sampleDataStage,
          })
          .run();
      });
    });
    describe('requestSampleDataForExports saga', () => {
      test('should call fetchPageGeneratorPreview incase of flowInput/raw stages for PG', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const sampleDataStage = 'raw';

        return expectSaga(requestSampleDataForExports, { resourceId, flowId, sampleDataStage })
          .provide([
            [select(
              selectors.isPageGenerator,
              flowId,
              resourceId,
              'exports',
            ), true],
            [matchers.call.fn(apiCallWithRetry), undefined],
          ])
          .call(fetchPageGeneratorPreview, {
            flowId,
            _pageGeneratorId: resourceId,
          })
          .run();
      });
      test('should call fetchPageGeneratorPreview incase of flowInput/raw stages PP and pageprocessor is of type file adaptor', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const sampleDataStage = 'raw';

        return expectSaga(requestSampleDataForExports, { resourceId, flowId, sampleDataStage })
          .provide([
            [select(
              selectors.isPageGenerator,
              flowId,
              resourceId,
              'exports',
            ), false],
            [select(selectors.resource, 'exports', resourceId), {
              adaptorType: 'FTPExport',
            }],
            [matchers.call.fn(apiCallWithRetry), undefined],
          ])
          .call(fetchPageGeneratorPreview, {
            flowId,
            _pageGeneratorId: resourceId,
          })
          .run();
      });
      test('should call fetchPageProcessorPreview incase of flowInput/raw stages for PP', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const sampleDataStage = 'raw';

        return expectSaga(requestSampleDataForExports, { resourceId, flowId, sampleDataStage })
          .provide([
            [select(
              selectors.isPageGenerator,
              flowId,
              resourceId,
              'exports',
            ), false],
            [matchers.call.fn(apiCallWithRetry), undefined],
          ])
          .call(fetchPageProcessorPreview, {
            flowId,
            _pageProcessorId: resourceId,
            previewType: sampleDataStage,
          })
          .run();
      });
      test('should call requestProcessorData for all other processor sampleData stages', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const sampleDataStage = 'preSavePage';

        return expectSaga(requestSampleDataForExports, { resourceId, flowId, sampleDataStage })
          .provide([
            [select(
              selectors.isPageGenerator,
              flowId,
              resourceId,
              'exports',
            ), false],
            [matchers.call.fn(apiCallWithRetry), undefined],
          ])
          .call(requestProcessorData, {
            flowId,
            resourceId,
            resourceType: 'exports',
            processor: sampleDataStage,
          })
          .run();
      });
    });
    describe('updateStateForProcessorData saga', () => {
      test('should dispatch receivedProcessorData with undefined if passed processedData is undefined', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const processedData = undefined;

        return expectSaga(updateStateForProcessorData, { flowId, resourceId, stage, processedData })
          .put(
            actions.flowData.receivedProcessorData(
              flowId,
              resourceId,
              stage,
              undefined
            )
          )
          .run();
      });
      test('should dispatch receivedProcessorData with processedData with data wrapped in array when wrapInArrayProcessedData is true ', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const processedData = {
          data: {test: 5 },
        };
        const resultantProcessedData = {
          data: [{ test: 5}],
        };

        return expectSaga(updateStateForProcessorData, {
          flowId,
          resourceId,
          stage,
          processedData,
          wrapInArrayProcessedData: true,
        })
          .put(
            actions.flowData.receivedProcessorData(
              flowId,
              resourceId,
              stage,
              resultantProcessedData
            )
          )
          .run();
      });
      test('should dispatch receivedProcessorData with processedData with data formatted with data[0] when removeDataPropFromProcessedData is true ', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const processedData = {
          data: [{
            data: {test: 5 },
          }],
        };
        const resultantProcessedData = {
          data: [{ test: 5}],
        };

        return expectSaga(updateStateForProcessorData, {
          flowId,
          resourceId,
          stage,
          processedData,
          removeDataPropFromProcessedData: true,
        })
          .put(
            actions.flowData.receivedProcessorData(
              flowId,
              resourceId,
              stage,
              resultantProcessedData
            )
          )
          .run();
      });
      test('should dispatch receivedProcessorData with processedData passed irrespective of other props passed if it does not meet the expected data format', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const processedData = { test: 5 };

        return expectSaga(updateStateForProcessorData, {
          flowId,
          resourceId,
          stage,
          processedData,
          removeDataPropFromProcessedData: true,
        })
          .put(
            actions.flowData.receivedProcessorData(
              flowId,
              resourceId,
              stage,
              processedData
            )
          )
          .run();
      });
    });
    describe('handleFlowDataStageErrors saga', () => {
      test('should do nothing if error passed is undefined', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const error = undefined;

        return expectSaga(handleFlowDataStageErrors, { resourceId, flowId, stage, error})
          .not.put(
            actions.flowData.receivedError(
              flowId,
              resourceId,
              stage,
              undefined
            )
          )
          .run();
      });
      test('should return undefined if the error status is 401/403 as they are taken care at root saga level', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const error = { status: 401 };

        return expectSaga(handleFlowDataStageErrors, { resourceId, flowId, stage, error })
          .not.put(
            actions.flowData.receivedError(
              flowId,
              resourceId,
              stage,
              undefined
            )
          )
          .run();
      });
      test('should return undefined if the error status is invalid  (<400 or >=500) as those statuses are invalid', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const error = { status: 205 };

        return expectSaga(handleFlowDataStageErrors, { resourceId, flowId, stage, error })
          .not.put(
            actions.flowData.receivedError(
              flowId,
              resourceId,
              stage,
              undefined
            )
          )
          .run();
      });
      test('should return undefined even for a valid status if the error message is not a stringified object as expected', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const error = { status: 404, message: 'Not found' };

        return expectSaga(handleFlowDataStageErrors, { resourceId, flowId, stage, error })
          .not.put(
            actions.flowData.receivedError(
              flowId,
              resourceId,
              stage,
              undefined
            )
          )
          .run();
      });
      test('should dispatch receivedError with received error message for a valid error status', () => {
        const resourceId = 'export-123';
        const flowId = 'flow-123';
        const stage = 'preSavePage';
        const errorMessage = 'Not found';
        const error = { status: 404,
          errors: [
            {
              message: errorMessage,
            },
          ] };

        return expectSaga(handleFlowDataStageErrors, { resourceId, flowId, stage, error })
          .not.put(
            actions.flowData.receivedError(
              flowId,
              resourceId,
              stage,
              errorMessage
            )
          )
          .run();
      });
    });
    describe('getPreProcessedResponseMappingData util', () => {
      test('should return undefined incase of invalid(other than exports/imports)/no resourceType', () => {
        expect(getPreProcessedResponseMappingData({ resourceType: 'connections', preProcessedData: {}, adaptorType: 'HTTPExport'})).toBeUndefined();
        expect(getPreProcessedResponseMappingData({ preProcessedData: {}, adaptorType: 'HTTPExport'})).toBeUndefined();
      });

      test('should return defaultExtractsObj without data prop incase of export lookups with no preProcessedData', () => {
        const lookupDefaultExtracts = {
          errors: '',
          ignored: '',
          statusCode: '',
        };

        expect(getPreProcessedResponseMappingData({resourceType: 'exports', adaptorType: 'RESTExport'}))
          .toEqual(lookupDefaultExtracts);
      });
      test('should return defaultExtractsObj incase of imports with no/empty preProcessedData', () => {
        const importDefaultExtracts = {
          errors: '',
          id: '',
          ignored: '',
          statusCode: '',
          headers: '',
        };

        expect(getPreProcessedResponseMappingData({resourceType: 'imports', adaptorType: 'RESTImport'}))
          .toEqual(importDefaultExtracts);
        expect(getPreProcessedResponseMappingData({resourceType: 'imports', adaptorType: 'RESTImport', preProcessedData: []}))
          .toEqual(importDefaultExtracts);
        expect(getPreProcessedResponseMappingData({resourceType: 'imports', adaptorType: 'RESTImport', preProcessedData: {}}))
          .toEqual(importDefaultExtracts);
      });
      test('should return preProcessedData wrapped in data with extractsObj for export lookups', () => {
        const preProcessedData = {
          users: [{ _id: 'user1', name: 'user1'}],
        };
        const expectedOutput = {
          errors: '',
          ignored: '',
          statusCode: '',
          data: [preProcessedData],
        };

        expect(getPreProcessedResponseMappingData({resourceType: 'exports', adaptorType: 'RESTExport', preProcessedData}))
          .toEqual(expectedOutput);
      });
      test('should return preProcessedData if exists incase of imports', () => {
        const preProcessedData = {
          users: [{ _id: 'user1', name: 'user1'}],
        };

        expect(getPreProcessedResponseMappingData({resourceType: 'imports', adaptorType: 'RESTImport', preProcessedData}))
          .toEqual(preProcessedData);
      });
    });
    describe('getFlowStageData saga', () => {
      const flowId = 'flow-123';
      const resourceId = 'export-123';
      const resourceType = 'exports';
      const stage = 'transform';
      const isInitialized = true;

      test('should not call requestSampleData saga when the flowStageData status is received and return the data', () => {
        const flowStageData = {
          status: 'received',
          data: { test: 5 },
        };

        return expectSaga(getFlowStageData, {flowId,
          resourceId,
          resourceType,
          stage,
          isInitialized})
          .provide([
            [select(selectors.sampleDataWrapper, {
              flowId,
              resourceId,
              resourceType,
              stage,
            }), flowStageData],
          ])
          .not.call.fn(requestSampleData)
          .returns(flowStageData.data)
          .run();
      });
      test('should call requestSampleData saga when the flowStageData status is not received and return the data', () => {
        const flowStageData = {
          status: 'error',
          data: { test: 5 },
        };

        return expectSaga(getFlowStageData, {flowId,
          resourceId,
          resourceType,
          stage,
          isInitialized})
          .provide([
            [select(selectors.sampleDataWrapper, {
              flowId,
              resourceId,
              resourceType,
              stage,
            }), flowStageData],
          ])
          .call.fn(requestSampleData)
          .returns(flowStageData.data)
          .run();
      });
    });
  });
  describe('metadataUtils sagas', () => {
    describe('fetchMetadata saga', () => {
      test('should not call getNetsuiteOrSalesforceMeta and return metadata when state already has metadata loaded', () => {
        const connectionId = 'conn-123';
        const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/users`;
        const metadata = {
          data: {test: 5},
        };

        return expectSaga(fetchMetadata, { connectionId, commMetaPath })
          .provide([
            [select(selectors.getMetadataOptions, {
              connectionId,
              commMetaPath,
              filterKey: 'raw',
            }), metadata],
          ])
          .not.call.fn(getNetsuiteOrSalesforceMeta)
          .run();
      });
      test('should call getNetsuiteOrSalesforceMeta and return metadata when there is no metadata already loaded', () => {
        const connectionId = 'conn-123';
        const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/users`;

        return expectSaga(fetchMetadata, { connectionId, commMetaPath })
          .provide([
            [select(selectors.getMetadataOptions, {
              connectionId,
              commMetaPath,
              filterKey: 'raw',
            }), undefined],
            [matchers.call.fn(apiCallWithRetry), undefined],
          ])
          .call(getNetsuiteOrSalesforceMeta, {
            connectionId,
            commMetaPath,
            addInfo: { refreshCache: false},
          })
          .run();
      });
      test('should call getNetsuiteOrSalesforceMeta (with refreshCache property) though it is already loaded when refresh is true and return response', () => {
        const connectionId = 'conn-123';
        const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/users`;
        const metadata = {
          data: {test: 5},
        };

        return expectSaga(fetchMetadata, { connectionId, commMetaPath, refresh: true })
          .provide([
            [select(selectors.getMetadataOptions, {
              connectionId,
              commMetaPath,
              filterKey: 'raw',
            }), metadata],
            [matchers.call.fn(apiCallWithRetry), undefined],
          ])
          .call(getNetsuiteOrSalesforceMeta, {
            connectionId,
            commMetaPath,
            addInfo: { refreshCache: true},
          })
          .run();
      });
    });
  });
  describe('previewCalls sagas', () => {
    describe('pageProcessorPreview saga', () => {
      test('should do nothing if there is no flowId/_pageProcessorId ', () => expectSaga(pageProcessorPreview, {})
        .not.call.fn(apiCallWithRetry)
        .run());
      test('should do nothing if the flow does not have at least one PG', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'import-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [],
          pageProcessors: [{ type: 'import', _importId: _pageProcessorId}],
        };
        const resourceType = 'imports';

        return expectSaga(pageProcessorPreview, { flowId, _pageProcessorId, resourceType })
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow}],
          ])
          .not.call.fn(apiCallWithRetry)
          .returns(undefined)
          .run();
      });
      test('should construct PP doc if the _pageProcessorId is newId  before passing it to apiCall', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'new-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}],
        };
        const previewData = { test: 5 };
        const newPpDoc = { _id: '456', name: 'test import', adaptorType: 'RESTImport'};
        const pageGeneratorMap = {
          'export-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTExport'}, options: {},
          },
        };
        const pageProcessorMap = {
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
          'new-111': {
            doc: newPpDoc,
          },
        };
        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'import', _importId: 'import-123' },
              { type: 'import', _importId: 'new-111' },
            ],
          },
          _pageProcessorId,
          pageGeneratorMap,
          pageProcessorMap,
          includeStages: false,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: false,
        };

        return expectSaga(pageProcessorPreview, { flowId, _pageProcessorId, resourceType: 'imports' })
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh: false,
              runOffline: false,
            }), pageGeneratorMap],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), pageProcessorMap],
            [call(fetchResourceDataForNewFlowResource, {
              resourceId: _pageProcessorId,
              resourceType: 'imports',
            }), newPpDoc],
            [call(apiCallWithRetry, apiOptions), previewData],
          ])
          .call(apiCallWithRetry, apiOptions)
          .returns(previewData)
          .run();
      });
      test('should consider passed _pageProcessorDoc for corresponding _pageProcessorId while constructing body for preview call', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'import-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}, { type: 'import', _importId: 'import-111'}],
        };
        const previewData = { test: 5 };
        const _pageProcessorDoc = { _id: '456', name: 'test import', adaptorType: 'RESTImport', oneToMany: true, pathToMany: 'users.addresses'};
        const pageGeneratorMap = {
          'export-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTExport'}, options: {},
          },
        };
        const previousPageProcessorMap = {
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
          'import-111': {
            doc: { _id: '456', name: 'test import', adaptorType: 'RESTImport'},
          },
        };
        const pageProcessorMap = {
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
          'import-111': {
            doc: _pageProcessorDoc,
          },
        };
        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'import', _importId: 'import-123' },
              { type: 'import', _importId: 'import-111' },
            ],
          },
          _pageProcessorId,
          pageGeneratorMap,
          pageProcessorMap,
          includeStages: false,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: false,
        };

        return expectSaga(pageProcessorPreview, { flowId, _pageProcessorId, resourceType: 'imports', _pageProcessorDoc })
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh: false,
              runOffline: false,
            }), pageGeneratorMap],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), previousPageProcessorMap],
            [call(apiCallWithRetry, apiOptions), previewData],
          ])
          .call(apiCallWithRetry, apiOptions)
          .returns(previewData)
          .run();
      });
      test('should pass _pageProcessorId resource info as an import though it is a lookup in the request body pageProcessorMap  and we need flow data calculated till that point', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'export-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}, { type: 'export', _exportId: _pageProcessorId}],
        };
        const previewData = { test: 5 };
        const pageGeneratorMap = {
          'export-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTExport'}, options: {},
          },
        };
        const pageProcessorMap = {
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
          [_pageProcessorId]: {
            doc: { _id: '456', name: 'test lookup', adaptorType: 'RESTExport'}, options: {},
          },
        };
        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'import', _importId: 'import-123' },
              { type: 'import', _importId: 'export-111', _exportId: _pageProcessorId },
            ],
          },
          _pageProcessorId,
          pageGeneratorMap,
          pageProcessorMap,
          includeStages: false,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: false,
        };

        return expectSaga(pageProcessorPreview, { flowId, _pageProcessorId, resourceType: 'exports', previewType: 'flowInput'})
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh: false,
              runOffline: false,
            }), pageGeneratorMap],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), pageProcessorMap],
            [call(apiCallWithRetry, apiOptions), previewData],
          ])
          .call(apiCallWithRetry, apiOptions)
          .returns(previewData)
          .run();
      });
      test('should remove processors config if existed incase of previewType raw for lookup pageProcessor Doc before passing it to preview call', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'lookup-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'export', _exportId: _pageProcessorId}, { type: 'import', _importId: 'import-123'}],
        };
        const previewData = { test: 5 };
        const _pageProcessorDoc = {
          _id: _pageProcessorId,
          name: 'test lookup',
          adaptorType: 'RESTExport',
          transform: {
            type: 'expression',
            expression: {
              rules: [
                [
                  {
                    extract: 'users[*]',
                    generate: 'customers[*]',
                  },
                ],
              ],
              version: '1',
            },
          },
          filter: {
            type: 'expression',
            expression: {
              rules: [],
              version: '1',
            },
          },
        };
        const _pageProcessorDocWithoutProcessorsConfig = {
          _id: _pageProcessorId,
          name: 'test lookup',
          adaptorType: 'RESTExport',
        };
        const pageGeneratorMap = {
          'export-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTExport'}, options: {},
          },
        };
        const pageProcessorMap = {
          [_pageProcessorId]: {
            doc: _pageProcessorDoc,
          },
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
        };
        const updatedPageProcessorMap = {
          [_pageProcessorId]: {
            doc: _pageProcessorDocWithoutProcessorsConfig,
          },
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
        };
        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'export', _exportId: _pageProcessorId},
              { type: 'import', _importId: 'import-123'},
            ],
          },
          _pageProcessorId,
          pageGeneratorMap,
          pageProcessorMap: updatedPageProcessorMap,
          includeStages: false,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: false,
        };

        return expectSaga(pageProcessorPreview, { flowId, _pageProcessorId, resourceType: 'exports' })
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh: false,
              runOffline: false,
            }), pageGeneratorMap],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), pageProcessorMap],
            [call(apiCallWithRetry, apiOptions), previewData],
          ])
          .call(apiCallWithRetry, apiOptions)
          .returns(previewData)
          .run();
      });
      test('should remove processors config if existed as part of passed pageProcessorDoc incase of previewType raw for lookup pageProcessor Doc before passing it to preview call', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'lookup-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'export', _exportId: _pageProcessorId}, { type: 'import', _importId: 'import-123'}],
        };
        const previewData = { test: 5 };
        const _pageProcessorDoc = {
          _id: _pageProcessorId,
          name: 'test lookup',
          adaptorType: 'RESTExport',
          transform: {
            type: 'expression',
            expression: {
              rules: [
                [
                  {
                    extract: 'users[*]',
                    generate: 'customers[*]',
                  },
                ],
              ],
              version: '1',
            },
          },
          filter: {
            type: 'expression',
            expression: {
              rules: [],
              version: '1',
            },
          },
        };
        const _pageProcessorDocWithoutProcessorsConfig = {
          _id: _pageProcessorId,
          name: 'test lookup',
          adaptorType: 'RESTExport',
        };
        const pageGeneratorMap = {
          'export-123': {
            doc: {
              _id: '123',
              name: 'test',
              adaptorType: 'RESTExport',
              filter: {
                type: 'expression',
                expression: {
                  rules: [],
                  version: '1',
                },
              },
            },
            options: {},
          },
        };
        const pageProcessorMapWithoutPageProcessorDoc = {
          [_pageProcessorId]: {
            doc: null,
          },
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
        };
        const updatedPageProcessorMap = {
          [_pageProcessorId]: {
            doc: _pageProcessorDocWithoutProcessorsConfig,
          },
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
        };
        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'export', _exportId: _pageProcessorId},
              { type: 'import', _importId: 'import-123'},
            ],
          },
          _pageProcessorId,
          pageGeneratorMap,
          pageProcessorMap: updatedPageProcessorMap,
          includeStages: false,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: false,
        };

        return expectSaga(pageProcessorPreview, { flowId, _pageProcessorId, resourceType: 'exports', _pageProcessorDoc })
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh: false,
              runOffline: false,
            }), pageGeneratorMap],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), pageProcessorMapWithoutPageProcessorDoc],
            [call(apiCallWithRetry, apiOptions), previewData],
          ])
          .call(apiCallWithRetry, apiOptions)
          .returns(previewData)
          .run();
      });

      test('should have runOfflineOptions as part of the _pageProcessorId doc in pageProcessorMap when runOffline is true and also hidden should be true', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'import-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}, { type: 'import', _importId: 'import-111'}],
        };
        const previewData = { test: 5 };
        const _pageProcessorDoc = { _id: '456', name: 'test import', adaptorType: 'RESTImport'};
        const pageGeneratorMapWithRunOfflineOptions = {
          'export-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTExport'},
            options: {
              runOfflineOptions: {
                runOffline: true,
                runOfflineSource: 'db',
              },
            },
          },
        };
        const pageProcessorMap = {
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
          [_pageProcessorId]: {
            doc: _pageProcessorDoc, options: {},
          },
        };
        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'import', _importId: 'import-123' },
              { type: 'import', _importId: 'import-111' },
            ],
          },
          _pageProcessorId,
          pageGeneratorMap: pageGeneratorMapWithRunOfflineOptions,
          pageProcessorMap,
          includeStages: false,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: true,
        };
        const runOffline = true;

        return expectSaga(pageProcessorPreview, { flowId, _pageProcessorId, resourceType: 'imports', runOffline })
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh: false,
              runOffline,
            }), pageGeneratorMapWithRunOfflineOptions],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), pageProcessorMap],
            [call(apiCallWithRetry, apiOptions), previewData],
          ])
          .call(apiCallWithRetry, apiOptions)
          .returns(previewData)
          .run();
      });
      test('should pass refresh and includeStages property as part of sagas being called internally', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'import-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}, { type: 'import', _importId: 'import-111'}],
        };
        const previewData = { test: 5 };
        const _pageProcessorDoc = { _id: '456', name: 'test import', adaptorType: 'RESTImport'};
        const pageGeneratorMap = {
          'export-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTExport'}, options: {},
          },
        };
        const pageProcessorMap = {
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
          [_pageProcessorId]: {
            doc: _pageProcessorDoc, options: {},
          },
        };

        const refresh = true;
        const includeStages = true;

        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'import', _importId: 'import-123' },
              { type: 'import', _importId: 'import-111' },
            ],
          },
          _pageProcessorId,
          pageGeneratorMap,
          pageProcessorMap,
          includeStages,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: false,
        };

        return expectSaga(pageProcessorPreview, { flowId, _pageProcessorId, resourceType: 'imports', refresh, includeStages })
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh,
              runOffline: false,
            }), pageGeneratorMap],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), pageProcessorMap],
            [call(apiCallWithRetry, apiOptions), previewData],
          ])
          .call(apiCallWithRetry, apiOptions)
          .returns(previewData)
          .run();
      });

      test('should throw error if api call throws error and throwOnError is true', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'import-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}, { type: 'import', _importId: 'import-111'}],
        };
        const _pageProcessorDoc = { _id: '456', name: 'test import', adaptorType: 'RESTImport'};
        const pageGeneratorMap = {
          'export-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTExport'}, options: {},
          },
        };
        const pageProcessorMap = {
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
          [_pageProcessorId]: {
            doc: _pageProcessorDoc, options: {},
          },
        };

        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'import', _importId: 'import-123' },
              { type: 'import', _importId: 'import-111' },
            ],
          },
          _pageProcessorId,
          pageGeneratorMap,
          pageProcessorMap,
          includeStages: false,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: false,
        };
        const error = JSON.stringify({
          errors: [{status: 404, message: '{"code":" Error in preview call"}'}],
        });

        return expectSaga(pageProcessorPreview, { throwOnError: true, flowId, _pageProcessorId, resourceType: 'imports'})
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh: false,
              runOffline: false,
            }), pageGeneratorMap],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), pageProcessorMap],
            [call(apiCallWithRetry, apiOptions), throwError(error)],
          ])
          .call(apiCallWithRetry, apiOptions)
          .throws(error)
          .run();
      });
      test('should not throw error and call pageProcessorPreview again when apiCall with offlineMode fails to fetch actual preview data', () => {
        const flowId = 'flow-123';
        const _pageProcessorId = 'import-111';
        const flow = {
          _id: flowId,
          name: 'test flow',
          pageGenerators: [{ _exportId: 'export-123'}],
          pageProcessors: [{ type: 'import', _importId: 'import-123'}, { type: 'import', _importId: 'import-111'}],
        };
        const previewData = { test: 5 };
        const _pageProcessorDoc = { _id: '456', name: 'test import', adaptorType: 'RESTImport'};
        const pageGeneratorMapWithRunOfflineOptions = {
          'export-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTExport'},
            options: {
              runOfflineOptions: {
                runOffline: true,
                runOfflineSource: 'db',
              },
            },
          },
        };
        const pageProcessorMap = {
          'import-123': {
            doc: { _id: '123', name: 'test', adaptorType: 'RESTImport'}, options: {},
          },
          [_pageProcessorId]: {
            doc: _pageProcessorDoc, options: {},
          },
        };
        const body = {
          flow: {
            _id: flowId,
            name: 'test flow',
            pageGenerators: [{ _exportId: 'export-123'}],
            pageProcessors: [
              { type: 'import', _importId: 'import-123' },
              { type: 'import', _importId: 'import-111' },
            ],
          },
          _pageProcessorId,
          pageGeneratorMap: pageGeneratorMapWithRunOfflineOptions,
          pageProcessorMap,
          includeStages: false,
        };
        const apiOptions = {
          path: '/pageProcessors/preview',
          opts: {
            method: 'POST',
            body,
          },
          message: 'Loading',
          hidden: true,
        };
        const runOffline = true;
        const error = JSON.stringify({
          errors: [{status: 404, message: '{"code":" Error in preview call"}'}],
        });
        const previewType = 'raw';
        const throwOnError = true;

        return expectSaga(pageProcessorPreview, {throwOnError, previewType, flowId, _pageProcessorId, resourceType: 'imports', runOffline })
          .provide([
            [select(selectors.resourceData, 'flows', flowId, SCOPES.VALUE), { merged: flow }],
            [call(fetchFlowResources, {
              flow,
              type: 'pageGenerators',
              refresh: false,
              runOffline,
            }), pageGeneratorMapWithRunOfflineOptions],
            [call(fetchFlowResources, {
              flow,
              type: 'pageProcessors',
            }), pageProcessorMap],
            [call(apiCallWithRetry, apiOptions), throwError(error)],
            [call(pageProcessorPreview, {
              flowId,
              _pageProcessorId,
              _pageProcessorDoc: undefined,
              previewType,
              resourceType: 'imports',
              hidden: false,
              throwOnError,
              refresh: false,
              includeStages: false,
            }), previewData],
          ])
          .call(apiCallWithRetry, apiOptions)
          .call(pageProcessorPreview, {
            flowId,
            _pageProcessorId,
            _pageProcessorDoc: undefined,
            previewType,
            resourceType: 'imports',
            hidden: false,
            throwOnError,
            refresh: false,
            includeStages: false,
          })
          .returns(previewData)
          .run();
      });
    });
    describe('exportPreview saga', () => {
      const previewData = {
        data: [{
          users: [
            { _id: 'user1', name: 'user1'},
            { _id: 'user2', name: 'user2'},
            { _id: 'user3', name: 'user3'},
          ],
        }],
        stages: [{
          name: 'request',
          data: [{
            url: 'https://celigohelp.zendesk.com/api/v2/users.json',
            method: 'GET',
          }],
        },
        {
          name: 'raw',
          data: [{
            headers: {
              'content-type': 'application/json',
            },
            statusCode: 200,
            url: 'https://celigohelp.zendesk.com/api/v2/users.json',
            body: '{"users": [{id: "123", name: "user1"}]}',
          }],
        },
        {
          name: 'parse',
          data: {
            users: [{
              id: '123',
              name: 'user1',
            }],
          },
        }],
      };

      test('should do nothing if there is no resourceId passed', () => expectSaga(exportPreview, {})
        .not.call.fn(apiCallWithRetry)
        .returns(undefined)
        .run());
      test('should format the resourceObject, put hidden true and include runOfflineOptions if runOffline is true and resource has valid rawData', () => {
        const resourceId = 'export-123';
        const resource = {
          name: 'Test export',
          _id: resourceId,
          type: 'once',
          rest: {
            once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
            relativeURI: '/api/v2/users.json',
          },
          rawData: 'raw1234',
          adaptorType: 'RESTExport',
        };
        const formattedResourceWithoutOnceDoc = {
          name: 'Test export',
          _id: resourceId,
          rest: {
            relativeURI: '/api/v2/users.json',
          },
          adaptorType: 'RESTExport',
          rawData: 'raw1234',
        };
        const body = {
          ...formattedResourceWithoutOnceDoc,
          verbose: true,
          runOfflineOptions: {
            runOffline: true,
            runOfflineSource: 'db',
          },
        };
        const hidden = false;

        return expectSaga(exportPreview, { resourceId, runOffline: true, hidden })
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              resourceId,
              SCOPES.VALUE
            ), { merged: resource }],
            [call(apiCallWithRetry, {
              path: '/exports/preview',
              opts: { method: 'POST', body },
              message: 'Loading',
              hidden: true,
            }), previewData],
          ])
          .returns(previewData)
          .run();
      });
      test('should not include runOfflineOptions even if runOffline is true but resource does not have valid rawData', () => {
        const resourceId = 'export-123';
        const resource = {
          name: 'Test export',
          _id: resourceId,
          type: 'once',
          rest: {
            once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
            relativeURI: '/api/v2/users.json',
          },
          adaptorType: 'RESTExport',
        };
        const formattedResourceWithoutOnceDoc = {
          name: 'Test export',
          _id: resourceId,
          rest: {
            relativeURI: '/api/v2/users.json',
          },
          adaptorType: 'RESTExport',
        };

        return expectSaga(exportPreview, { resourceId, runOffline: true })
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              resourceId,
              SCOPES.VALUE
            ), { merged: resource }],
            [call(apiCallWithRetry, {
              path: '/exports/preview',
              opts: { method: 'POST', body: formattedResourceWithoutOnceDoc },
              message: 'Loading',
              hidden: false,
            }), previewData],
          ])
          .returns(previewData)
          .run();
      });
      test('should throw error when apiCall throws error and throwOnError is true', () => {
        const resourceId = 'export-123';
        const resource = {
          name: 'Test export',
          _id: resourceId,
          type: 'once',
          rest: {
            once: { relativeURI: '/api/v2/INVALID_URI.json', method: 'PUT', body: { test: 5 }},
            relativeURI: '/api/v2/INVALID_URI.json',
          },
          adaptorType: 'RESTExport',
        };
        const formattedResourceWithoutOnceDoc = {
          name: 'Test export',
          _id: resourceId,
          rest: {
            relativeURI: '/api/v2/INVALID_URI.json',
          },
          adaptorType: 'RESTExport',
        };
        const error = JSON.stringify({
          errors: [{status: 404, message: '{"code":" Invalid relative uri"}'}],
        });

        return expectSaga(exportPreview, { resourceId, runOffline: true, throwOnError: true })
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              resourceId,
              SCOPES.VALUE
            ), { merged: resource }],
            [call(apiCallWithRetry, {
              path: '/exports/preview',
              opts: { method: 'POST', body: formattedResourceWithoutOnceDoc },
              message: 'Loading',
              hidden: false,
            }), throwError(error)],
          ])
          .throws(error)
          .run();
      });
      test('should not throw error when apiCall throws error and throwOnError is false', () => {
        const resourceId = 'export-123';
        const resource = {
          name: 'Test export',
          _id: resourceId,
          type: 'once',
          rest: {
            once: { relativeURI: '/api/v2/INVALID_URI.json', method: 'PUT', body: { test: 5 }},
            relativeURI: '/api/v2/INVALID_URI.json',
          },
          adaptorType: 'RESTExport',
        };
        const formattedResourceWithoutOnceDoc = {
          name: 'Test export',
          _id: resourceId,
          rest: {
            relativeURI: '/api/v2/INVALID_URI.json',
          },
          adaptorType: 'RESTExport',
        };
        const error = JSON.stringify({
          errors: [{status: 404, message: '{"code":" Invalid relative uri"}'}],
        });

        return expectSaga(exportPreview, { resourceId, runOffline: true })
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              resourceId,
              SCOPES.VALUE
            ), { merged: resource }],
            [call(apiCallWithRetry, {
              path: '/exports/preview',
              opts: { method: 'POST', body: formattedResourceWithoutOnceDoc },
              message: 'Loading',
              hidden: false,
            }), throwError(error)],
          ])
          .returns(undefined)
          .run();
      });
      test('should not throw error when apiCall throws error for Offline mode and call exportPreview saga again without runOffline', () => {
        const resourceId = 'export-123';
        const resource = {
          name: 'Test export',
          _id: resourceId,
          type: 'once',
          rest: {
            once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
            relativeURI: '/api/v2/users.json',
          },
          rawData: 'raw1234',
          adaptorType: 'RESTExport',
        };
        const formattedResourceWithoutOnceDoc = {
          name: 'Test export',
          _id: resourceId,
          rest: {
            relativeURI: '/api/v2/users.json',
          },
          adaptorType: 'RESTExport',
          rawData: 'raw1234',
        };
        const body = {
          ...formattedResourceWithoutOnceDoc,
          verbose: true,
          runOfflineOptions: {
            runOffline: true,
            runOfflineSource: 'db',
          },
        };
        const error = JSON.stringify({
          errors: [{status: 404, message: '{"code":" Invalid S3 key"}'}],
        });
        const hidden = false;
        const throwOnError = true;

        return expectSaga(exportPreview, { resourceId, runOffline: true, hidden, throwOnError })
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              resourceId,
              SCOPES.VALUE
            ), { merged: resource }],
            [call(apiCallWithRetry, {
              path: '/exports/preview',
              opts: { method: 'POST', body },
              message: 'Loading',
              hidden: true,
            }), throwError(error)],
            [call(exportPreview, {
              resourceId,
              hidden,
              runOffline: false,
              throwOnError,
            }), previewData],
          ])
          .call(exportPreview, {
            resourceId,
            hidden,
            runOffline: false,
            throwOnError,
          })
          .returns(previewData)
          .run();
      });
    });
  });
  describe('xmlTransformationRulesGenerator sagas', () => {
    describe('_getXmlFileAdaptorSampleData saga', () => {
      test('should return undefined incase of no resource/newResourceId', () => expectSaga(_getXmlFileAdaptorSampleData, {})
        .returns(undefined)
        .run() && expectSaga(_getXmlFileAdaptorSampleData, {resource: { _id: 'id-123', adaptorType: 'FTPExport', file: {type: 'xml'}, parsers: [], name: 'test'}})
        .returns(undefined)
        .run() && expectSaga(_getXmlFileAdaptorSampleData, {resource: null, newResourceId: 'new-123'})
        .returns(undefined)
        .run());
      test('should return undefined if there is no xml data for the resource', () => {
        const resource = { _id: 'export-123', adaptorType: 'RESTSExport', name: 'test'};
        const newResourceId = 'new-123';
        const sampleData = undefined;

        return expectSaga(_getXmlFileAdaptorSampleData, { resource, newResourceId})
          .provide([
            [select(
              selectors.getResourceSampleDataWithStatus,
              newResourceId,
              'raw'
            ), { data: sampleData}],
          ])
          .returns(undefined)
          .run();
      });
      test('should call parseFileData saga with the xml data from the resource and return the result', () => {
        const resource = { _id: 'export-123', adaptorType: 'RESTSExport', name: 'test'};
        const newResourceId = 'new-123';
        const sampleData = {
          body: `<?xml version="1.0" encoding="UTF-8"?>
          <letter>
          </letter>`,
        };
        const fileParserData = {mediaType: 'json', data: [{letter: {}}], duration: 0};

        return expectSaga(_getXmlFileAdaptorSampleData, { resource, newResourceId})
          .provide([
            [select(
              selectors.getResourceSampleDataWithStatus,
              newResourceId,
              'raw'
            ), { data: sampleData}],
            [call(parseFileData, {
              sampleData: sampleData.body,
              resource,
            }), fileParserData],
          ])
          .returns(fileParserData.data[0])
          .run();
      });
      test('should call the parseFileData saga and return undefined if the call does not return data', () => {
        const resource = { _id: 'export-123', adaptorType: 'RESTSExport', name: 'test'};
        const newResourceId = 'new-123';
        const sampleData = {
          body: '<?xml version="1.0" encoding="UTF-8"?>',
        };
        const fileParserData = {mediaType: 'json', data: [], duration: 0};

        return expectSaga(_getXmlFileAdaptorSampleData, { resource, newResourceId})
          .provide([
            [select(
              selectors.getResourceSampleDataWithStatus,
              newResourceId,
              'raw'
            ), { data: sampleData}],
            [call(parseFileData, {
              sampleData: sampleData.body,
              resource,
            }), fileParserData],
          ])
          .returns(undefined)
          .run();
      });
    });
    describe('_getXmlHttpAdaptorSampleData saga', () => {
      test('should return undefined incase of no resource/newResourceId', () => expectSaga(_getXmlHttpAdaptorSampleData, {})
        .returns(undefined)
        .run() && expectSaga(_getXmlHttpAdaptorSampleData, {resource: { _id: 'id-123', adaptorType: 'HTTPExport', http: {successMediaType: 'xml'}, parsers: [], name: 'test'}})
        .returns(undefined)
        .run() && expectSaga(_getXmlHttpAdaptorSampleData, {resource: null, newResourceId: 'new-123'})
        .returns(undefined)
        .run()
      );
      test('should call exportPreview saga incase of an export and return the response', () => {
        const resource = {
          _id: 'id-123',
          adaptorType: 'HTTPExport',
          http: {successMediaType: 'xml'},
          parsers: [],
          name: 'test',
        };
        const newResourceId = 'new-123';
        const previewData = {
          data: [{
            InSituTestRequest: [{
              0: {
                Description: [{
                  0: {
                    TestCase: [{
                      0: {
                        _: 'A2',
                      },
                    }],
                  },
                }],
              },
            }],
          }],
          stages: [
            {
              name: 'parse',
              data: [{
                InSituTestRequest: [{
                  0: {
                    Description: [{
                      0: {
                        TestCase: [{
                          0: {
                            _: 'A2',
                          },
                        }],
                      },
                    }],
                  },
                }],
              }],
            }],
        };
        const xmlParsedData = previewData.stages[0].data[0];

        return expectSaga(_getXmlHttpAdaptorSampleData, { resource, newResourceId })
          .provide([
            [call(exportPreview, {
              resourceId: resource._id,
              hidden: true,
            }), previewData],
          ])
          .returns(xmlParsedData)
          .run();
      });
      test('should call pageProcessorPreview saga incase of a lookup and return the response', () => {
        const resource = {
          _id: 'id-123',
          adaptorType: 'HTTPExport',
          http: {successMediaType: 'xml'},
          parsers: [],
          name: 'test',
          isLookup: true,
        };
        const newResourceId = 'new-123';
        const flowId = 'flow-123';
        const previewData = {
          InSituTestRequest: [{
            0: {
              Description: [{
                0: {
                  TestCase: [{
                    0: {
                      _: 'A2',
                    },
                  }],
                },
              }],
            },
          }],
        };

        return expectSaga(_getXmlHttpAdaptorSampleData, { resource, newResourceId })
          .provide([
            [select(
              selectors.resourceFormState,
              'exports',
              newResourceId
            ), { flowId }],
            [call(pageProcessorPreview, {
              flowId,
              _pageProcessorId: resource._id,
              previewType: 'raw',
              hidden: true,
            }), previewData],
          ])
          .not.call.fn(exportPreview)
          .call.fn(pageProcessorPreview)
          .returns(previewData)
          .run();
      });
    });
    describe('saveTransformationRulesForNewXMLExport saga', () => {
      test('should do nothing if there is no resourceId', () => expectSaga(saveTransformationRulesForNewXMLExport, {})
        .not.call.fn(_getXmlFileAdaptorSampleData)
        .not.call.fn(_getXmlHttpAdaptorSampleData)
        .not.put(actions.resource.patchStaged(undefined, [], SCOPES.VALUE))
        .not.put(actions.resource.commitStaged('exports', undefined, SCOPES.VALUE))
        .run()
      );
      test('should call _getXmlFileAdaptorSampleData saga for FTP XML resource ', () => {
        const tempResourceId = 'new-123';
        const resourceId = 'id-123';
        const ftpXMLExport = {
          _id: 'id-123',
          adaptorType: 'FTPExport',
          file: {type: 'xml'},
          parsers: [],
          name: 'test',
        };

        return expectSaga(saveTransformationRulesForNewXMLExport, { resourceId, tempResourceId})
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              resourceId,
              SCOPES.VALUE
            ), {merged: ftpXMLExport}],
          ])
          .call.fn(_getXmlFileAdaptorSampleData)
          .not.call.fn(_getXmlHttpAdaptorSampleData)
          .run();
      });
      test('should call _getXmlHttpAdaptorSampleData saga  for FTP Http resource', () => {
        const resourceId = 'id-123';
        const tempResourceId = 'new-123';
        const httpXmlExport = {
          _id: resourceId,
          adaptorType: 'HTTPExport',
          http: {successMediaType: 'xml'},
          parsers: [],
          name: 'test',
          isLookup: true,
        };

        return expectSaga(saveTransformationRulesForNewXMLExport, { resourceId, tempResourceId})
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              resourceId,
              SCOPES.VALUE
            ), {merged: httpXmlExport}],
          ])
          .not.call.fn(_getXmlFileAdaptorSampleData)
          .call.fn(_getXmlHttpAdaptorSampleData)
          .run();
      });
      test('should not patch the resource if there are no transformation rules for the xml data ', () => {
        const tempResourceId = 'new-123';
        const resourceId = 'id-123';
        const httpXmlExport = {
          _id: resourceId,
          adaptorType: 'HTTPExport',
          http: {successMediaType: 'xml'},
          parsers: [],
          name: 'test',
          isLookup: true,
        };

        return expectSaga(saveTransformationRulesForNewXMLExport, { resourceId, tempResourceId})
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              'id-123',
              SCOPES.VALUE
            ), { merged: httpXmlExport}],
          ])
          .not.call.fn(_getXmlFileAdaptorSampleData)
          .call.fn(_getXmlHttpAdaptorSampleData)
          .not.put(actions.resource.patchStaged(resourceId, [], SCOPES.VALUE))
          .not.put(actions.resource.commitStaged('exports', resourceId, SCOPES.VALUE))
          .run();
      });

      test('should patch the resource with constructed XML transformation rules and commit the resource when there is XML data and valid rules', () => {
        const tempResourceId = 'new-123';
        const resourceId = 'id-123';
        const httpXmlExport = {
          _id: resourceId,
          adaptorType: 'HTTPExport',
          http: {successMediaType: 'xml'},
          parsers: [],
          name: 'test',
          isLookup: true,
        };
        const previewData = {
          InSituTestRequest: [{
            0: {
              Description: [{
                0: {
                  TestCase: [{
                    0: {
                      _: 'A2',
                    },
                  }],
                },
              }],
            },
          }],
        };
        const transformationRules = [[
          {
            extract: 'InSituTestRequest[0].0.Description[0].0.TestCase[0].0._',
            generate: 'InSituTestRequest.0.Description.0.TestCase.0._',
          },
        ]];

        const patchSet = [
          {
            op: 'replace',
            path: '/transform',
            value: {
              rules: transformationRules,
              version: '1',
            },
          },
        ];

        return expectSaga(saveTransformationRulesForNewXMLExport, { resourceId, tempResourceId})
          .provide([
            [select(
              selectors.resourceData,
              'exports',
              'id-123',
              SCOPES.VALUE
            ), { merged: httpXmlExport}],
            [call(_getXmlHttpAdaptorSampleData, {
              resource: httpXmlExport,
              newResourceId: tempResourceId,
            }), previewData],
          ])
          .not.call.fn(_getXmlFileAdaptorSampleData)
          .call.fn(_getXmlHttpAdaptorSampleData)
          .put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE))
          .put(actions.resource.commitStaged('exports', resourceId, SCOPES.VALUE))
          .run();
      });
    });
  });
});
