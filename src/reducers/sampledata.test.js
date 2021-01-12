/* global describe, expect, test */
import { selectors } from '.';

describe('Sample data region selector testcases', () => {
  describe('selectors.canSelectRecordsInPreviewPanel test cases', () => {
    const sampleState = {
      session: {
        stage: {
          'new-123': {
            patch: [
              {
                op: 'add',
                path: '/resourceType',
                value: undefined,
              },
              {
                op: 'replace',
                path: '/resourceType',
                value: 'realtime',
              },
            ],
          },
        },
      },
      data: {
        resources: {
          exports: [
            {
              _id: '1234',
              name: 'Netsuite Export',
              adaptorType: 'NetSuiteExport',
              type: 'distributed',
            },
            {
              _id: '5678',
              name: 'Rest Export',
              adaptorType: 'RESTExport',
            },
          ],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.canSelectRecordsInPreviewPanel()).toBeTruthy();
    });
    test('should return false for real time resources like distributed NS/SF/webhook ', () => {
      expect(selectors.canSelectRecordsInPreviewPanel(sampleState, '1234', 'exports')).toBeFalsy();
      expect(selectors.canSelectRecordsInPreviewPanel(sampleState, 'new-123', 'exports')).toBeFalsy();
    });
    test('should return true for all other resources if the preview panel is enabled', () => {
      expect(selectors.canSelectRecordsInPreviewPanel(sampleState, '5678', 'exports')).toBeTruthy();
    });
  });

  describe('selectors.fileDefinitionSampleData test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.fileDefinitionSampleData({}, {})).toEqual({});
    });
    test('should return empty object if the sample data does not exist', () => {

    });
    test('should return rule and sampleData for a new File def resource when definitionId and format are passed', () => {

    });
    test('should return user saved rule and sampleData for existing File def resource when userDefinitionId is passed', () => {

    });
    test('should include resourcePath in the rule incase of exports ', () => {

    });
  });

  describe('selectors.fileSampleData test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.fileSampleData(undefined, {})).toBe();
    });
    test('should return undefined if there is no file uploaded yet by the user and resourceObj has no sampleData property in the doc', () => {
      const sampleState = {
        session: {},
        data: {
          resources: {
            exports: [
              {
                _id: 'export-123',
                name: 'test export',
                adaptorType: 'FTPExport',
                file: {
                  type: 'json',
                },
              },
            ],
          },
        },
      };

      expect(selectors.fileSampleData(sampleState, { resourceId: 'export-123', resourceType: 'exports', fileType: 'json'})).toBeUndefined();
    });
    test('should return sampleData on the resourceDoc if there is no file uploaded by user yet', () => {
      const jsonContent = {
        test: [
          {
            flow: 3,
            test: 44,
            win: 1,
          },
        ],
      };
      const sampleState = {
        session: {},
        data: {
          resources: {
            exports: [
              {
                _id: 'export-123',
                name: 'test export',
                adaptorType: 'FTPExport',
                file: {
                  type: 'json',
                },
                sampleData: jsonContent,
              },
            ],
          },
        },
      };

      expect(selectors.fileSampleData(sampleState, { resourceId: 'export-123', resourceType: 'exports', fileType: 'json'})).toEqual(jsonContent);
    });
    test('should return uploaded file content incase of all file types except xlsx', () => {
      const jsonContent = {
        test: [
          {
            flow: 3,
            test: 44,
            win: 1,
          },
        ],
      };
      const jsonFileState = {
        session: {
          sampleData: {
            'export-123': {
              recordSize: 10,
              status: 'received',
              data: {
                rawFile: {
                  body: jsonContent,
                  type: 'json',
                },
              },
            },
          },
        },
      };

      expect(selectors.fileSampleData(jsonFileState, { resourceId: 'export-123', resourceType: 'exports', fileType: 'json'})).toEqual(jsonContent);
    });
    test('should return csv content of the xlsx file uploaded by the  user incase of file type xlsx', () => {
      const csvContent = 'name,age,gender\nname0,21,male\n    ,    ,   \nname1,22,male\n,,\nname2,23,female\nname3,21,male\nname4,22,male\n,,\nname5,23,female\nname6,21,male\n,,\nname7,22,male\n,,\nname8,23,female\nname9,21,male\n';
      const csvFileState = {
        session: {
          sampleData: {
            'export-123': {
              recordSize: 10,
              status: 'received',
              data: {
                csv: {
                  body: csvContent,
                },
              },
            },
          },
        },
      };

      expect(selectors.fileSampleData(csvFileState, { resourceId: 'export-123', resourceType: 'exports', fileType: 'xlsx'})).toEqual(csvContent);
    });
  });

  describe('selectors.getImportSampleData test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getImportSampleData()).toEqual({});
    });
    test('should return empty object if the resource is not an assistant/IA/NS/SF and the resource does not have a sampleData saved', () => {

    });
    test('should return sampleData from the resourceObj if it is not an assistant/IA/NS/SF ', () => {

    });
    test('should return assistant preview data if the assistant is not financialforce', () => {

    });
    test('should return metadata from the state for NS/SF import based on the connectionId', () => {

    });
    test('should return integration app import metadata if the resource is an IA', () => {

    });
  });

  describe('selectors.sampleDataWrapper test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.sampleDataWrapper(undefined, {})).toEqual({status: undefined});
    });
  });

  describe('selectors.isExportPreviewDisabled test cases', () => {
    const sampleState = {
      data: {
        resources: {
          connections: [
            {
              _id: 'conn-123',
              name: 'rest offline conn',
              offline: true,
            },
            {
              _id: 'conn-456',
              name: 'rest online conn ',
            },
          ],
          exports: [
            {
              _id: '1234',
              name: 'Netsuite Export',
              adaptorType: 'NetSuiteExport',
              type: 'distributed',
            },
            {
              _id: '1111',
              name: 'FTP Export',
              adaptorType: 'FTPExport',
              file: {
                type: 'json',
                resourcePath: 'users',
              },
            },
            {
              _id: '5678',
              name: 'Rest Export',
              _connectionId: 'conn-123',
              adaptorType: 'RESTExport',
            },
            {
              _id: '2222',
              name: 'Rest Export 2',
              _connectionId: 'conn-456',
              adaptorType: 'RESTExport',
            },
          ],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isExportPreviewDisabled()).toEqual(null);
    });
    test('should return false if the resource is a file type resource as we always allow user to preview', () => {
      expect(selectors.isExportPreviewDisabled(sampleState, '1111', 'exports')).toBeFalsy();
    });
    test('should return true for the other adaptors if the connection is offline', () => {
      expect(selectors.isExportPreviewDisabled(sampleState, '5678', 'exports')).toBeTruthy();
    });
    test('should return false for the other adaptors if the connection is online', () => {
      expect(selectors.isExportPreviewDisabled(sampleState, '2222', 'exports')).toBeFalsy();
    });
  });

  describe('selectors.getAvailableResourcePreviewStages test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.getAvailableResourcePreviewStages()).toEqual([]);
    });
  });

  describe('selectors.isRequestUrlAvailableForPreviewPanel test cases', () => {
    const sampleState = {
      data: {
        resources: {
          exports: [
            {
              _id: '1111',
              name: 'Rest Export',
              _connectionId: 'conn-123',
              adaptorType: 'RESTExport',
            },
            {
              _id: '2222',
              name: 'Http Export 2',
              _connectionId: 'conn-456',
              adaptorType: 'HTTPExport',
            },
            {
              _id: '1234',
              name: 'Netsuite Export',
              adaptorType: 'NetSuiteExport',
              type: 'distributed',
            },
          ],
        },
      },
    };

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isRequestUrlAvailableForPreviewPanel({})).toBeFalsy();
    });
    test('should return true for the HTTP/REST resources', () => {
      expect(selectors.isRequestUrlAvailableForPreviewPanel(sampleState, '1111', 'exports')).toBeTruthy();
      expect(selectors.isRequestUrlAvailableForPreviewPanel(sampleState, '2222', 'exports')).toBeTruthy();
    });
    test('should return false for the resources other than HTTP/REST', () => {
      expect(selectors.isRequestUrlAvailableForPreviewPanel(sampleState, '1234', 'exports')).toBeFalsy();
    });
  });
});
