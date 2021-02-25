/* global describe, test, expect */
import templateUtil from './template';

const { getTemplateUrlName, getApplication } = require('./template');

describe('template util function test', () => {
  describe('getTemplateUrlName function test', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(getTemplateUrlName()).toEqual();
      expect(getTemplateUrlName([])).toEqual();
      expect(getTemplateUrlName(123)).toEqual();
      expect(getTemplateUrlName(null)).toEqual();
      expect(getTemplateUrlName({})).toEqual();
      expect(getTemplateUrlName(new Date())).toEqual();
    });

    test('should return correct name when applications are passed', () => {
      expect(getTemplateUrlName(['netsuite', 'rest'])).toEqual('Netsuite-Rest');
      expect(getTemplateUrlName(['salesforce', 'ftp'])).toEqual('Salesforce-Ftp');
      expect(getTemplateUrlName(['netsuite', 'salesforce', 'ftp'])).toEqual('Netsuite-Salesforce-Ftp');
      expect(getTemplateUrlName(['netsuite', 'salesforce', 'ftp', 'rest'])).toEqual('Netsuite-Salesforce-Ftp-Rest');
    });

    test('should return correct name when applications length is 1', () => {
      expect(getTemplateUrlName(['netsuite'])).toEqual('Netsuite-Netsuite');
      expect(getTemplateUrlName(['salesforce'])).toEqual('Salesforce-Salesforce');
    });

    test('should return correct name when applications contains special characters', () => {
      expect(getTemplateUrlName(['Salesforce.org', 'rest'])).toEqual('Salesforceorg-Rest');
      expect(getTemplateUrlName(['rest', 'Salesforce.org'])).toEqual('Rest-Salesforceorg');
    });
  });
  describe('getApplication function test', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(getApplication()).toEqual({});
      expect(getApplication([])).toEqual({});
      expect(getApplication(123)).toEqual({});
      expect(getApplication(null)).toEqual({});
      expect(getApplication({})).toEqual({});
      expect(getApplication(new Date())).toEqual({});
    });

    test('should return correct application details when connection is passed and has assistant', () => {
      expect(getApplication({assistant: 'ariba'})).toEqual({id: 'ariba', name: 'SAP Ariba'});
      expect(getApplication({assistant: 'skuvault'})).toEqual({id: 'skuvault', name: 'SkuVault'});
      expect(getApplication({assistant: 'strata'})).toEqual({id: 'strata', name: 'Strata'});
      expect(getApplication({assistant: 'svb'})).toEqual({id: 'svb', name: 'SVB'});
      expect(getApplication({assistant: 'wiser', type: 'rest'})).toEqual({id: 'wiser', name: 'Wiser'});
    });

    test('should return correct application details when connection is passed and doesnt have assistant', () => {
      expect(getApplication({type: 'ftp'})).toEqual({id: 'ftp', name: 'FTP'});
      expect(getApplication({type: 'netsuite'})).toEqual({id: 'netsuite', name: 'NetSuite'});
      expect(getApplication({type: 'salesforce'})).toEqual({id: 'salesforce', name: 'Salesforce'});
    });

    test('should return correct application details when rbdms connection is passed', () => {
      expect(getApplication({type: 'rdbms', rdbms: {type: 'mssql'}})).toEqual({id: 'mssql', name: 'Microsoft SQL'});
      expect(getApplication({type: 'rdbms', rdbms: {type: 'mysql'}})).toEqual({id: 'mysql', name: 'MySQL'});
      expect(getApplication({type: 'rdbms', rdbms: {type: 'oracle'}})).toEqual({id: 'oracle', name: 'Oracle DB (SQL)'});
    });
  });

  describe('getDependentResources function test', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(templateUtil.getDependentResources()).toEqual([]);
      expect(templateUtil.getDependentResources([])).toEqual([]);
      expect(templateUtil.getDependentResources(123)).toEqual([]);
      expect(templateUtil.getDependentResources(null)).toEqual([]);
      expect(templateUtil.getDependentResources({})).toEqual([]);
      expect(templateUtil.getDependentResources(new Date())).toEqual([]);
    });

    test('should return correct components lists formatted', () => {
      const expected = [{
        resourceType: 'exports',
        id: 'exportId',
      }, {
        resourceType: 'connections',
        id: 'connectionId',
      }, {
        resourceType: 'imports',
        id: 'importId',
      }, {
        resourceType: 'flows',
        id: 'flowId',
      }];

      expect(templateUtil.getDependentResources([{
        model: 'Export',
        _id: 'exportId',
      }, {
        model: 'Connection',
        _id: 'connectionId',
      }, {
        model: 'Import',
        _id: 'importId',
      }, {
        model: 'Flow',
        _id: 'flowId',
      }])).toEqual(expected);
    });
  });

  describe('getInstallSteps function test', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(templateUtil.getInstallSteps()).toEqual({connectionMap: {}, installSteps: []});
      expect(templateUtil.getInstallSteps([])).toEqual({connectionMap: {}, installSteps: []});
      expect(templateUtil.getInstallSteps(123)).toEqual({connectionMap: {}, installSteps: []});
      expect(templateUtil.getInstallSteps(null)).toEqual({connectionMap: {}, installSteps: []});
      expect(templateUtil.getInstallSteps({})).toEqual({connectionMap: {}, installSteps: []});
      expect(templateUtil.getInstallSteps(new Date())).toEqual({connectionMap: {}, installSteps: []});
    });

    test('should return correct install steps when preview data is passed', () => {
      const previewData = {
        objects: [
          {
            model: 'Integration',
            doc: {
              _id: '5fbfed8cd964e440789b5aca',
              lastModified: '2020-11-26T18:04:16.169Z',
              name: 'Tile permissions issue2',
              install: [

              ],
              _registeredConnectionIds: [
                '569f5e778a34de4718a56178',
              ],
              installSteps: [

              ],
              uninstallSteps: [

              ],
              flowGroupings: [

              ],
              createdAt: '2020-11-26T18:01:48.565Z',
            },
          },
          {
            model: 'Flow',
            doc: {
              _id: '5a816fd6a05a4b10ff6e1f64',
              lastModified: '2020-11-26T18:04:17.449Z',
              name: 'FTP edi to ftp edi',
              disabled: false,
              timezone: 'Asia/Calcutta',
              _integrationId: '5fbfed8cd964e440789b5aca',
              skipRetries: false,
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [

                    ],
                    lists: [

                    ],
                  },
                  type: 'import',
                  _importId: '5a816fd6a05a4b10ff6e1f63',
                },
              ],
              pageGenerators: [
                {
                  _exportId: '5a816fd5a05a4b10ff6e1f62',
                },
              ],
              createdAt: '2018-02-12T10:43:34.632Z',
              lastExecutedAt: '2020-11-03T02:25:16.798Z',
            },
          },
          {
            model: 'Export',
            doc: {
              _id: '5a816fd5a05a4b10ff6e1f62',
              createdAt: '2018-02-12T10:43:33.908Z',
              lastModified: '2018-02-12T10:43:33.908Z',
              _connectionId: '569f5e778a34de4718a56178',
              apiIdentifier: 'e2b2174975',
              asynchronous: true,
              parsers: [

              ],
              sampleData: 'ISA*00*2*00*3*ZZ*AMAZONZZ*VENDOR120731*1032*U*00400*000000112*0*P*3*3*>~\nGS*1*AMAZON*132546*20120716*0202*1*X*004010~\nST*830*0001~\nBFR*00*0987654*1*DL*A*20120708*20120930*20120714*1*1*1*MN~\nREF*A*12345~\nREF*B*98657~\nN1*DU*AmazonUS*15*1234567~\nN1*VN*asf*92*012345678~\nLIN*1*UP*012345678901*BP*B000123456~\nUIT*EA*QQ~\nFST*0.498*D*W*20120708~\nFST*0.498*D*W*20120708~\nLIN*1*UP*012345678901*BP*B000123456~\nUIT*EA*QQ~\nFST*0.498*D*W*20120708~\nFST*0.498*D*W*20120708~\nSE*18*1004~\nGE*1*1320~\nIEA*1*000001320~',
              ftp: {
                directoryPath: '/sravan',
              },
              file: {
                encoding: 'utf8',
                output: 'records',
                skipDelete: false,
                type: 'filedefinition',
                fileDefinition: {
                  _fileDefinitionId: '5a816fd5a05a4b10ff6e1f60',
                },
              },
              transform: {
                type: 'expression',
                expression: {
                  rules: [

                  ],
                  version: '1',
                },
                version: '1',
                rules: [

                ],
              },
              adaptorType: 'FTPExport',
            },
          },
          {
            model: 'Import',
            doc: {
              _id: '5a816fd6a05a4b10ff6e1f63',
              createdAt: '2018-02-12T10:43:34.257Z',
              lastModified: '2018-02-20T08:54:42.007Z',
              _connectionId: '569f5e778a34de4718a56178',
              distributed: false,
              apiIdentifier: 'i30de7018d',
              file: {
                skipAggregation: false,
                type: 'filedefinition',
                fileDefinition: {
                  _fileDefinitionId: '5a816fd5a05a4b10ff6e1f61',
                },
              },
              ftp: {
                directoryPath: '/sravan',
                fileName: 'file-{{timestamp}}.edi',
              },
              adaptorType: 'FTPImport',
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '569f5e778a34de4718a56178',
              createdAt: '2018-01-10T07:25:17.546Z',
              lastModified: '2020-10-14T07:40:57.188Z',
              type: 'ftp',
              name: 'FTP connection -419Vwn4MmJln rerer',
              debugDate: '2020-02-17T08:27:47.887Z',
              ftp: {
                type: 'sftp',
                hostURI: 'celigo.files.com',
                username: 'sravankumar.dandra@celigo.com',
                password: '******',
                port: 22,
                usePassiveMode: true,
              },
            },
          },
          {
            model: 'FileDefinition',
            doc: {
              _id: '5a816fd5a05a4b10ff6e1f60',
              lastModified: '2018-02-12T10:43:33.113Z',
              name: 'Amazon 830',
              description: 'Planning Schedule with Release Capability',
              version: '1',
              format: 'delimited',
              delimited: {
                rowSuffix: '~',
                rowDelimiter: '\n',
                colDelimiter: '*',
              },
              rules: [
                {
                  closeRule: {
                    elements: [
                      {
                        value: 'IEA',
                        name: 'IEA',
                      },
                    ],
                    skipRowSuffix: true,
                    maxOccurrence: 1,
                    required: true,
                  },
                  skipRowSuffix: true,
                  maxOccurrence: 1,
                  required: true,
                },
              ],
            },
          },
          {
            model: 'FileDefinition',
            doc: {
              _id: '5a816fd5a05a4b10ff6e1f61',
              lastModified: '2018-02-12T10:43:33.439Z',
              name: 'Amazon 830',
              description: 'Planning Schedule with Release Capability',
              version: '1',
              format: 'delimited',
              delimited: {
                rowSuffix: '$',
                rowDelimiter: '\n',
                colDelimiter: '*',
              },
              rules: [
                {
                  maxOccurrence: 2,
                  required: true,
                },
              ],
            },
          },
        ],
        stackRequired: false,
        _stackId: null,
      };
      const received = templateUtil.getInstallSteps(previewData);
      const expectedResult = {
        connectionMap: {
          '569f5e778a34de4718a56178': {
            _id: '569f5e778a34de4718a56178',
            createdAt: '2018-01-10T07:25:17.546Z',
            debugDate: '2020-02-17T08:27:47.887Z',
            ftp: {
              hostURI: 'celigo.files.com',
              password: '******',
              port: 22,
              type: 'sftp',
              usePassiveMode: true,
              username: 'sravankumar.dandra@celigo.com',
            },
            lastModified: '2020-10-14T07:40:57.188Z',
            name: 'FTP connection -419Vwn4MmJln rerer',
            type: 'ftp',
          },
        },
        installSteps: [
          {
            _connectionId: '569f5e778a34de4718a56178',
            completed: false,
            description: 'Please configure FTP connection',
            name: 'FTP connection -419Vwn4MmJln rerer',
            options: {
              connectionType: 'ftp',
            },
            type: 'Connection',
          },
        ],
      };

      expect(received).toEqual(expectedResult);
    });

    test('should return correct distributed steps incase of NS and SF ', () => {
      const previewData = {
        objects: [
          {
            model: 'Integration',
            doc: {
              _id: '5fbfed8cd964e440789b5aca',
              lastModified: '2020-11-26T18:04:16.169Z',
              name: 'Tile permissions issue2',
              install: [],
              _registeredConnectionIds: [
                '569f5e778a34de4718a56178',
              ],
              createdAt: '2020-11-26T18:01:48.565Z',
            },
          },
          {
            model: 'Flow',
            doc: {
              _id: '5a816fd6a05a4b10ff6e1f64',
              lastModified: '2020-11-26T18:04:17.449Z',
              name: 'NetSuite to Salelsforce flow',
              disabled: false,
              timezone: 'Asia/Calcutta',
              _integrationId: '5fbfed8cd964e440789b5aca',
              skipRetries: false,
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [

                    ],
                    lists: [

                    ],
                  },
                  type: 'import',
                  _importId: '5a816fd6a05a4b10ff6e1f63',
                },
              ],
              pageGenerators: [
                {
                  _exportId: '5a816fd5a05a4b10ff6e1f62',
                },
              ],
              createdAt: '2018-02-12T10:43:34.632Z',
              lastExecutedAt: '2020-11-03T02:25:16.798Z',
            },
          },
          {
            model: 'Export',
            doc: {
              _id: '5a816fd5a05a4b10ff6e1f62',
              createdAt: '2018-02-12T10:43:33.908Z',
              lastModified: '2018-02-12T10:43:33.908Z',
              _connectionId: '569f5e778a34de4718a56176',
              apiIdentifier: 'e2b2174975',
              asynchronous: true,
              type: 'distributed',
              adaptorType: 'SalesforceExport',
            },
          },
          {
            model: 'Import',
            doc: {
              _id: '5a816fd6a05a4b10ff6e1f63',
              createdAt: '2018-02-12T10:43:34.257Z',
              lastModified: '2018-02-20T08:54:42.007Z',
              _connectionId: '569f5e778a34de4718a56177',
              distributed: true,
              apiIdentifier: 'i30de7018d',
              adaptorType: 'NetSuiteImport',
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '569f5e778a34de4718a56176',
              createdAt: '2018-01-10T07:25:17.546Z',
              lastModified: '2020-10-14T07:40:57.188Z',
              type: 'salesforce',
              name: 'Salesforce connection',
              debugDate: '2020-02-17T08:27:47.887Z',
              salesforce: {
                type: 'sftp',
              },
            },
          },
          {
            model: 'Connection',
            doc: {
              _id: '569f5e778a34de4718a56177',
              createdAt: '2018-01-10T07:25:17.546Z',
              lastModified: '2020-10-14T07:40:57.188Z',
              type: 'netsuite',
              name: 'NetSuite Connection',
              debugDate: '2020-02-17T08:27:47.887Z',
              netsuite: {
                type: 'sftp',
              },
            },
          },
        ],
        stackRequired: false,
        _stackId: null,
      };
      const received = templateUtil.getInstallSteps(previewData);
      const expectedResult = {
        connectionMap: {
          '569f5e778a34de4718a56176': {
            _id: '569f5e778a34de4718a56176',
            createdAt: '2018-01-10T07:25:17.546Z',
            debugDate: '2020-02-17T08:27:47.887Z',
            lastModified: '2020-10-14T07:40:57.188Z',
            name: 'Salesforce connection',
            salesforce: {
              type: 'sftp',
            },
            type: 'salesforce',
          },
          '569f5e778a34de4718a56177': {
            _id: '569f5e778a34de4718a56177',
            createdAt: '2018-01-10T07:25:17.546Z',
            debugDate: '2020-02-17T08:27:47.887Z',
            lastModified: '2020-10-14T07:40:57.188Z',
            name: 'NetSuite Connection',
            netsuite: {
              type: 'sftp',
            },
            type: 'netsuite',
          },
        },
        installSteps: [
          {
            _connectionId: '569f5e778a34de4718a56176',
            completed: false,
            description: 'Please configure Salesforce connection',
            name: 'Salesforce connection',
            options: {
              connectionType: 'salesforce',
            },
            type: 'Connection',
          },
          {
            _connectionId: '569f5e778a34de4718a56177',
            completed: false,
            description: 'Please configure NetSuite connection',
            name: 'NetSuite Connection',
            options: {
              connectionType: 'netsuite',
            },
            type: 'Connection',
          },
          {
            application: 'netsuite',
            completed: false,
            description: 'Please install Integrator bundle in NetSuite account',
            imageURL: 'images/company-logos/netsuite.png',
            installURL: '/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038',
            name: 'Integrator Bundle',
            options: {},
            type: 'installPackage',
          },
          {
            application: 'salesforce',
            completed: false,
            description: 'Please install Integrator bundle in Salesforce account',
            imageURL: 'images/company-logos/salesforce.png',
            installURL: 'https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3m000000Y9kv',
            name: 'Integrator Adaptor Package',
            options: {},
            type: 'installPackage',
          },
        ],
      };

      expect(received).toEqual(expectedResult);
    });

    test('should return stack configuration step when previewData contains stack flag to true', () => {
      const previewData = {
        objects: [],
        stackRequired: true,
      };

      expect(templateUtil.getInstallSteps(previewData)).toEqual(
        {
          connectionMap: {

          },
          installSteps: [
            {
              completed: false,
              description: 'Please provide Stack details',
              imageURL: 'images/icons/icon/stacks.png',
              name: 'Configure Stack',
              options: {
                stackProvided: undefined,
              },
              type: 'Stack',
            },
          ],
        }
      );
    });
  });
});
