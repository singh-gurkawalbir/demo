/* global describe, test, expect */

import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { parseFileData, parseFileDefinition } from '../utils/fileParserUtils';
import fileAdaptorSampleData, {requestFileAdaptorPreview, parseFilePreviewData} from './fileAdaptorSampleData';

describe('Sample data generator sagas', () => {
  describe('fileAdaptorSampleData related sagas', () => {
    describe('fileAdaptorSampleData saga', () => {
      test('should return undefined incase of not a valid ftp resource', () => {
        const resource = {
          _id: '123',
          adaptorType: 'RESTExport',
        };
        const test1 = expectSaga(fileAdaptorSampleData, { resource })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();
        const test2 = expectSaga(fileAdaptorSampleData, { resource: null })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();

        return test1 && test2;
      });
      test('should call parseFileData saga to calculate sample data for csv, xlsx and xml file types', () => {
        const sampleData = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE\nC1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0\nC1000010839|Unitech|1400-900035G|1400-900035G|80.00|PA720/PA726 3.6V 3120mAH BATTERY -20C|43.53|0\nC1000010839|Magtek|21073131-NMI|21073131NMI|150.00|iDynamo 5 with NMI Encryption|89.29|0";

        const ftpResource = {
          _id: '123',
          file: {
            type: 'csv',
          },
          sampleData,
        };

        const csvParsedData = [{
          CONTRACT_PRICE: 'CONTRACT_PRICE',
          CUSTOMER_NUMBER: 'CUSTOMER_NUMBER',
          DESCRIPTION: 'DESCRIPTION',
          DISTRIBUTOR_PART_NUM: 'DISTRIBUTOR_PART_NUM',
          LIST_PRICE: 'LIST_PRICE',
          QUANTITY_AVAILABLE: 'QUANTITY_AVAILABLE',
          VENDOR_NAME: 'VENDOR_NAME',
          VENDOR_PART_NUM: 'VENDOR_PART_NUM',
        }];

        const expectedCsvSampleData = csvParsedData[0];

        return expectSaga(fileAdaptorSampleData, { resource: ftpResource })
          .provide([
            [call(parseFileData, {
              sampleData,
              resource: ftpResource,
            }), { data: expectedCsvSampleData}],
          ])
          .call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(expectedCsvSampleData)
          .run();
      });
      test('should call parseFileDefinition saga to fetch file definition related sample data for the resource', () => {
        const sampleData = 'UNB+UNOC:3+<Sender GLN>:14+<Receiver GLN>:14+140407:1000+100+ + + + +EANCOM';
        const fileDefResource = {
          _id: '123',
          adaptorType: 'FTPExport',
          file: {
            type: 'filedefinition',
            fileDefinition: {
              _fileDefinitionId: '555',
            },
          },
          sampleData,
        };

        const expectedFileDefSampleData = {
          'SYNTAX IDENTIFIER': {
            'Syntax identifier': 'UNOC',
            'Syntax version number': '3',
          },
        };

        return expectSaga(fileAdaptorSampleData, { resource: fileDefResource })
          .provide([
            [call(parseFileDefinition, {
              sampleData,
              resource: fileDefResource,
            }), { data: expectedFileDefSampleData }],
          ])
          .not.call.fn(parseFileData)
          .call.fn(parseFileDefinition)
          .returns(expectedFileDefSampleData)
          .run();
      });
      test('should return json calculated sample data from the ftp json resource passed  ', () => {
        const sampleData = {
          _id: '999',
          name: 'As2 json',
          file: [{
            type: 'json',
            data: 'jsonData',
          },
          {
            type: 'xml',
            node: true,
          },
          {
            type: 'csv',
            whitespace: '',
          },
          ],
          adaptorType: 'AS2Export',
        };
        const ftpJsonResource = {
          _id: '123',
          file: {
            type: 'json',
            json: {resourcePath: 'file'},
          },
          sampleData,
        };
        const expectedPreviewData = {data: 'jsonData', node: true, type: 'csv', whitespace: ''};

        return expectSaga(fileAdaptorSampleData, { resource: ftpJsonResource })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(expectedPreviewData)
          .run();
      });
      test('should return undefined incase of invalid file type', () => {
        const resource = {
          _id: '123',
          file: {
            type: 'INVALID_FILE_TYPE',
          },
        };

        return expectSaga(fileAdaptorSampleData, { resource })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();
      });
    });
    describe('requestFileAdaptorPreview saga', () => {
      test('should return undefined incase of not a valid ftp resource', () => {
        const resource = {
          _id: '123',
          adaptorType: 'RESTExport',
        };
        const test1 = expectSaga(requestFileAdaptorPreview, { resource })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();
        const test2 = expectSaga(requestFileAdaptorPreview, { resource: null })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();

        return test1 && test2;
      });
      test('should call parseFileData saga to return parsed data for csv, xlsx and xml file types', () => {
        const sampleData = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE\nC1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0\nC1000010839|Unitech|1400-900035G|1400-900035G|80.00|PA720/PA726 3.6V 3120mAH BATTERY -20C|43.53|0\nC1000010839|Magtek|21073131-NMI|21073131NMI|150.00|iDynamo 5 with NMI Encryption|89.29|0";

        const ftpResource = {
          _id: '123',
          file: {
            type: 'csv',
          },
          sampleData,
        };

        const expectedCsvParsedData = [{
          CONTRACT_PRICE: 'CONTRACT_PRICE',
          CUSTOMER_NUMBER: 'CUSTOMER_NUMBER',
          DESCRIPTION: 'DESCRIPTION',
          DISTRIBUTOR_PART_NUM: 'DISTRIBUTOR_PART_NUM',
          LIST_PRICE: 'LIST_PRICE',
          QUANTITY_AVAILABLE: 'QUANTITY_AVAILABLE',
          VENDOR_NAME: 'VENDOR_NAME',
          VENDOR_PART_NUM: 'VENDOR_PART_NUM',
        }];

        return expectSaga(requestFileAdaptorPreview, { resource: ftpResource })
          .provide([
            [call(parseFileData, {
              sampleData,
              resource: ftpResource,
            }), { data: expectedCsvParsedData}],
          ])
          .call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(expectedCsvParsedData)
          .run();
      });
      test('should call parseFileDefinition saga in preview mode  to fetch file definition related data for the resource', () => {
        const sampleData = 'UNB+UNOC:3+<Sender GLN>:14+<Receiver GLN>:14+140407:1000+100+ + + + +EANCOM';
        const fileDefResource = {
          _id: '123',
          adaptorType: 'FTPExport',
          file: {
            type: 'filedefinition',
            fileDefinition: {
              _fileDefinitionId: '555',
            },
          },
          sampleData,
        };

        const expectedFileDefSampleData = {
          'SYNTAX IDENTIFIER': {
            'Syntax identifier': 'UNOC',
            'Syntax version number': '3',
          },
        };

        return expectSaga(requestFileAdaptorPreview, { resource: fileDefResource })
          .provide([
            [call(parseFileDefinition, {
              sampleData,
              resource: fileDefResource,
              mode: 'preview',
            }), { data: expectedFileDefSampleData }],
          ])
          .not.call.fn(parseFileData)
          .call.fn(parseFileDefinition)
          .returns(expectedFileDefSampleData)
          .run();
      });
      test('should return json calculated preview data from the ftp json resource passed  ', () => {
        const sampleData = {
          _id: '999',
          name: 'As2 json',
          file: [{
            type: 'json',
            data: 'jsonData',
          },
          {
            type: 'xml',
            node: true,
          },
          {
            type: 'csv',
            whitespace: '',
          },
          ],
          adaptorType: 'AS2Export',
        };
        const ftpJsonResource = {
          _id: '123',
          file: {
            type: 'json',
            json: {resourcePath: 'file'},
          },
          sampleData,
        };
        const expectedPreviewData = sampleData.file;

        return expectSaga(requestFileAdaptorPreview, { resource: ftpJsonResource })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(expectedPreviewData)
          .run();
      });
      test('should return undefined incase of invalid file type', () => {
        const resource = {
          _id: '123',
          file: {
            type: 'INVALID_FILE_TYPE',
          },
        };

        return expectSaga(requestFileAdaptorPreview, { resource })
          .not.call.fn(parseFileData)
          .not.call.fn(parseFileDefinition)
          .returns(undefined)
          .run();
      });
    });
    describe('parseFilePreviewData util', () => {
      test('should return passed preview data incase of invalid resource/file type', () => {
        const previewData = { test: 5 };
        const resource1 = {
          _id: '123',
          adaptorType: 'RESTExport',
        };
        const resource2 = {
          _id: '123',
          file: {
            json: {
              resourcePath: 'test',
            },
          },
        };

        expect(parseFilePreviewData({ resource: null, previewData: undefined })).toBeUndefined();
        expect(parseFilePreviewData({ resource: resource1, previewData })).toBe(previewData);
        expect(parseFilePreviewData({ resource: resource2, previewData })).toBe(previewData);
      });
      test('should return passed preview data if it is not an array ', () => {
        const previewData = { test: 5 };
        const resource = {
          _id: '123',
          file: {
            type: 'json',
            json: {
              resourcePath: 'test',
            },
          },
        };

        expect(parseFilePreviewData({ resource, previewData })).toBe(previewData);
      });
      test('should return single merged object with all the properties incase of an array preview data', () => {
        const previewData = [{
          type: 'json',
          data: 'jsonData',
        },
        {
          type: 'xml',
          node: true,
        },
        {
          type: 'csv',
          whitespace: '',
        }];
        const resource = {
          _id: '123',
          file: {
            type: 'json',
            json: {
              resourcePath: 'test',
            },
          },
        };
        const expectedMergedPreviewData = {data: 'jsonData', node: true, type: 'csv', whitespace: ''};

        expect(parseFilePreviewData({ resource, previewData })).toEqual(expectedMergedPreviewData);
      });
    });
  });
});
