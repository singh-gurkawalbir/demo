/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { selectors } from '../../../../reducers';
import { _fetchRawDataForFileAdaptors } from '.';

describe('fileAdaptorUpdates sagas', () => {
  describe('_fetchRawDataForFileAdaptors saga', () => {
    test('should do nothing if there is no resourceId', () => expectSaga(_fetchRawDataForFileAdaptors, {})
      .returns(undefined)
      .run());
    test('should consider type as exports when not passed ', () => {
      const resourceId = 'ftp-123';
      const ftpExport = {
        _id: 'ftp-123',
        name: 'FTP export',
        adaptorType: 'FTPExport',
        ftp: {
          directoryPath: '/Test',
        },
        file: {
          type: 'json',
        },
      };
      const rawData = { test: 5 };

      return expectSaga(_fetchRawDataForFileAdaptors, { resourceId })
        .provide([
          [select(
            selectors.resource,
            'exports',
            resourceId
          ), ftpExport],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'raw'
          ), { data: rawData }],
        ])
        .returns({ test: 5 })
        .run();
    });
    test('should extract file data from raw stage incase of file type is not xlsx/file definition', () => {
      const resourceId = 'ftp-123';
      const ftpExport = {
        _id: 'ftp-123',
        name: 'FTP export',
        adaptorType: 'FTPExport',
        ftp: {
          directoryPath: '/Test',
        },
        file: {
          output: 'records',
          skipDelete: false,
          type: 'csv',
          csv: {
            columnDelimiter: '|',
            rowDelimiter: '\n',
            hasHeaderRow: true,
            trimSpaces: true,
            rowsToSkip: 0,
          },
        },
      };
      const rawData = "CUSTOMER_NUMBER|VENDOR_NAME|VENDOR_PART_NUM|DISTRIBUTOR_PART_NUM|LIST_PRICE|DESCRIPTION|CONTRACT_PRICE|QUANTITY_AVAILABLE\nC1000010839|Sato|12S000357CS|12S000357CS|99.12|wax rib 3.00\"X84',T113L,CSO,1\"core,24/cs|60.53|0\nC1000010839|Unitech|1400-900035G|1400-900035G|80.00|PA720/PA726 3.6V 3120mAH BATTERY -20C|43.53|0\nC1000010839|Magtek|21073131-NMI|21073131NMI|150.00|iDynamo 5 with NMI Encryption|89.29|0";

      return expectSaga(_fetchRawDataForFileAdaptors, { resourceId })
        .provide([
          [select(
            selectors.resource,
            'exports',
            resourceId
          ), ftpExport],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'raw'
          ), { data: rawData }],
        ])
        .returns(rawData)
        .run();
    });
    test('should extract file data from parse stage incase of file type is file definition', () => {
      const rawData = 'UNB+UNOC:3+<Sender GLN>:14+<Receiver GLN>:14+140407:1000+100+ + + + +EANCOM';
      const resourceId = 'ftp-123';
      const ftpExport = {
        _id: 'ftp-123',
        name: 'FTP export',
        adaptorType: 'FTPExport',
        ftp: {
          directoryPath: '/Test',
        },
        file: {
          output: 'records',
          skipDelete: false,
          type: 'filedefinition',
          fileDefinition: {
            resourcePath: 'SYNTAX IDENTIFIER',
            _fileDefinitionId: '5fda05801730a97681d30444',
          },
        },
      };

      return expectSaga(_fetchRawDataForFileAdaptors, { resourceId })
        .provide([
          [select(
            selectors.resource,
            'exports',
            resourceId
          ), ftpExport],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'raw'
          ), { data: rawData }],
        ])
        .returns(rawData)
        .run();
    });
    test('should extract file data from csv stage incase of file type is xlsx', () => {
      const rawData = 'name,age,gender name0,21,male , , name1,22,male ,, name2,23,female name3,21,male name4,22,male ,, name5,23,female name6,21,male ,, name7,22,male ,, name8,23,female name9,21,male ';
      const resourceId = 'ftp-123';
      const ftpExport = {
        _id: 'ftp-123',
        name: 'FTP export',
        adaptorType: 'FTPExport',
        ftp: {
          directoryPath: '/Test',
        },
        file: {
          output: 'records',
          skipDelete: false,
          type: 'xlsx',
          xlsx: {
            hasHeaderRow: false,
          },
        },
      };

      return expectSaga(_fetchRawDataForFileAdaptors, { resourceId })
        .provide([
          [select(
            selectors.resource,
            'exports',
            resourceId
          ), ftpExport],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'csv'
          ), { data: rawData }],
        ])
        .returns(rawData)
        .run();
    });
    test('should extract file data from parse stage for imports and file type is json', () => {
      const rawData = {
        test: [
          {
            abc: 3,
            test: 44,
            win: 1,
          },
        ],
      };
      const resourceId = 'ftp-123';
      const ftpImport = {
        _id: 'ftp-123',
        name: 'FTP import',
        _connectionId: '5ef5d613a56953365bd18006',
        distributed: false,
        apiIdentifier: 'i7e476cbd5',
        file: {
          type: 'json',
        },
        ftp: {
          directoryPath: '/test',
          fileName: 'dfgbn',
        },
        adaptorType: 'FTPImport',
      };

      return expectSaga(_fetchRawDataForFileAdaptors, { resourceId, type: 'imports' })
        .provide([
          [select(
            selectors.resource,
            'imports',
            resourceId
          ), ftpImport],
          [select(
            selectors.getResourceSampleDataWithStatus,
            resourceId,
            'parse'
          ), { data: rawData }],
        ])
        .returns(rawData)
        .run();
    });
  });
});
