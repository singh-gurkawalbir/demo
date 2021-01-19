/* global describe, test, expect, fail, jest */
import getResourceFormAssets from '.';
import mockExportAssist from '../../definitions/exports/custom/http/assistant';
import mockImportAssist from '../../definitions/imports/custom/http/assistant';

const dummyData = {fieldMap: {someProp: 'someValue'}, layout: {}, init: {}, preSave: {}, actions: {}};

jest.mock('../../definitions/exports/custom/http/assistant');

jest.mock('../../definitions/imports/custom/http/assistant');

describe('getResourceFromAssets load correct suitescript forms', () => {
  const ssLinkedConnectionId = 'id1';

  const assistantData = {};

  const connection = {};

  test('should not load a form and throw an error for non-valid schema', () => {
    const resource = {id: 'something1'};

    try {
      getResourceFormAssets({
        resourceType: 'connections', resource, isNew: false, assistantData, connection, ssLinkedConnectionId,
      });

      fail('should fail');
    // eslint-disable-next-line no-empty
    } catch (e) {}
  });

  describe('connections', () => {
    const inputs = [
      // test a few connections to see it work
      ['ftp', {id: 'something1',
        type: 'ftp',
      }, 'ftp.useSFTP'],
      ['salesforce', {id: 'something1',
        type: 'salesforce',
      }, 'salesforce.username'],
    ];

    test.each(inputs)('should load a %s', (name, resource, expectedField) => {
      const result = getResourceFormAssets({
        resourceType: 'connections', resource, isNew: false, assistantData, connection, ssLinkedConnectionId,
      });

      expect(result?.fieldMeta?.fieldMap?.[expectedField]).toBeTruthy();
      expect(result).toMatchSnapshot();
    });
  });
  describe('exports', () => {
    describe('netsuite', () => {
      const inputs = [
        // test a few connections to see it work
        ['realtime', {id: 'something1',
          export: { netsuite: {type: 'realtime'}},
        }, 'export.netsuite.realtime.exportType'],
        ['restlet', {id: 'something1',
          export: { netsuite: {type: 'restlet'}},
        }, 'export.netsuite.restlet.recordType'],
      ];

      test.each(inputs)('should load a %s', (name, resource, expectedField) => {
        const result = getResourceFormAssets({
          resourceType: 'exports', resource, isNew: false, assistantData, connection, ssLinkedConnectionId,
        });

        expect(result?.fieldMeta?.fieldMap?.[expectedField]).toBeTruthy();
        expect(result).toMatchSnapshot();
      });
    });
    describe('salesforce', () => {
      const inputs = [
        ['realtime', {id: 'something1',
          export: { type: 'salesforce',
            salesforce: { type: 'sobject'},
          },
        }, 'export.salesforce.sObjectType'],
        ['scheduled', {id: 'something1',
          export: { type: 'salesforce',
            salesforce: { type: 'someother'},
          },
        }, 'export.salesforce.soqlErrorMessageField.id'],
      ];

      test.each(inputs)('should load a %s', (name, resource, expectedField) => {
        const result = getResourceFormAssets({
          resourceType: 'exports', resource, isNew: false, assistantData, connection, ssLinkedConnectionId,
        });

        expect(result?.fieldMeta?.fieldMap?.[expectedField]).toBeTruthy();
        expect(result).toMatchSnapshot();
      });
    });
    describe('other exports', () => {
      const inputs = [
        // test a few exports to see it work
        ['fileCabinet', {id: 'something1',
          export: { type: 'fileCabinet'},
        }, 'export.fileCabinet.folderHierarchy'],
        ['newegg', {id: 'something1',
          export: {type: 'newegg'},
        }, 'export.newegg.methodConfig'],
      ];

      test.each(inputs)('should load a %s', (name, resource, expectedField) => {
        const result = getResourceFormAssets({
          resourceType: 'exports', resource, isNew: false, assistantData, connection, ssLinkedConnectionId,
        });

        expect(result?.fieldMeta?.fieldMap?.[expectedField]).toBeTruthy();
        expect(result).toMatchSnapshot();
      });
    });
  });
  describe('imports', () => {
    const inputs = [
      // test a few imports to see it work
      ['ftp', {id: 'something1',
        import: { type: 'ftp' },
      }, 'import.ftp.directoryPath'],
      ['salesforce', {id: 'something1',
        import: { type: 'salesforce'},
      }, 'import.salesforce.sObjectType'],
    ];

    test.each(inputs)('should load a %s', (name, resource, expectedField) => {
      const result = getResourceFormAssets({
        resourceType: 'imports', resource, isNew: false, assistantData, connection, ssLinkedConnectionId,
      });

      expect(result?.fieldMeta?.fieldMap?.[expectedField]).toBeTruthy();
      expect(result).toMatchSnapshot();
    });
  });
});
describe('getResourceFromAssets load correct form', () => {
  describe('other resource types', () => {
    test.each([
      ['iClients', 'amazonmws.accessKeyId'],
      ['scripts', 'insertFunction'],
      ['agents', 'description'],
      ['connectors', 'installerFunction'],
      ['templates', 'websiteURL'],
      ['stacks', 'lambda.accessKeyId'],
      ['pageProcessor', 'existingExport'],
      ['asyncHelpers', 'http.submit.transform'],
      ['pageGenerator', 'existingExport'],
      ['accesstokens', '_connectionIds'],
      ['connectorLicenses', 'email'],
      ['integrations', 'name'],
      ['apis', 'enableShipworksAuthentication'],
    ])('resouceType %s', (resourceType, expectedFieldId) => {
      const result = getResourceFormAssets({resourceType,
        resource: {},
        isNew: false,
        assistantData: {},
        connection: {} });

      expect(result?.fieldMeta?.fieldMap?.[expectedFieldId]).toBeTruthy();

      expect(result).toMatchSnapshot();
    });
  });
  describe('connections', () => {
    const resourceType = 'connections';
    const assistantData = {};

    const connection = {};

    test('should load a new connection form', () => {
      // resource is the connection
      const resource = {};

      const result = getResourceFormAssets({resourceType, resource, isNew: true, assistantData, connection });

      // should have field named application in a new export..the only unique field for new export
      expect(result?.fieldMeta?.fieldMap?.application?.label).toEqual('Application');
      expect(result).toMatchSnapshot();
    });
    test('should not load a form and throw an error for non-valid schema', () => {
      const resource = {id: 'something1'};

      try {
        getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });
        fail('should fail ');
      // eslint-disable-next-line no-empty
      } catch (e) {}
    });

    describe('assistants', () => {
      const inputs = [
      // rest assistant
        ['rest assistant certify', {id: 'something1', type: 'rest', assistant: 'certify' }, 'http.encrypted.apiSecret'],
        // go into rest folder
        ['http assistant googledrive', {id: 'something1', type: 'http', assistant: 'googledrive' }, 'http._iClientId'],

        ['http assistant adp', {id: 'something1', type: 'http', assistant: 'adp' }, 'http.clientCertificates.passphrase'],

      ];

      test.each(inputs)('should load a %s connection form', (name, resource, fieldId) => {
        const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

        expect(result?.fieldMeta?.fieldMap?.[fieldId]).toBeTruthy();
        expect(result).toMatchSnapshot();
      });
    });
    describe('rdbms', () => {
      describe('within rdbms schema', () => {
        const inputs = [
          ['mysql', {id: 'something1', type: 'rdbms', rdbms: { type: 'mysql'} }, 'rdbms.port'],
          ['mssql', {id: 'something1', type: 'rdbms', rdbms: { type: 'mssql'} }, 'rdbms.version'],
          ['oracle', {id: 'something1', type: 'rdbms', rdbms: { type: 'oracle'} }, 'rdbms.serverType'],
          ['postgresql', {id: 'something1', type: 'rdbms', rdbms: { type: 'postgresql'} }, 'rdbms.ssl.passphrase'],
          ['snowflake', {id: 'something1', type: 'rdbms', rdbms: { type: 'snowflake'} }, 'rdbms.host'],
        ];

        test.each(inputs)('should load a %s connection form', (name, resource, fieldId) => {
          const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

          expect(result?.fieldMeta?.fieldMap?.[fieldId]).toBeTruthy();
          expect(result).toMatchSnapshot();
        });
      });
      describe('type rdbms', () => {
        const inputs = [
          ['mysql', {id: 'something1', type: 'mysql' }, 'rdbms.port'],
          ['mssql', {id: 'something1', type: 'mssql' }, 'rdbms.version'],
          ['oracle', {id: 'something1', type: 'oracle' }, 'rdbms.serverType'],
          ['postgresql', {id: 'something1', type: 'postgresql' }, 'rdbms.ssl.passphrase'],
          ['snowflake', {id: 'something1', type: 'snowflake' }, 'rdbms.host'],
        ];

        test.each(inputs)('should load a %s connection form', (name, resource, fieldId) => {
          const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

          expect(result?.fieldMeta?.fieldMap?.[fieldId]).toBeTruthy();
          expect(result).toMatchSnapshot();
        });
      });
    });
    describe('other connections', () => {
      const inputs = [

        ['ftp', {id: 'something1', type: 'ftp' }, 'ftp.hostURI'],
        ['s3', {id: 'something1', type: 's3' }, 's3.secretAccessKey'],
        ['as2', {id: 'something1', type: 'as2' }, 'as2.userStationInfo.mdn.mdnSigning'],
        ['netsuite', {id: 'something1', type: 'netsuite' }, 'netsuite.environment'],
        ['netSuiteDistributedAdaptor', {id: 'something1', type: 'netSuiteDistributedAdaptor' }, 'netSuiteDistributedAdaptor.accountId'],
        ['salesforce', {id: 'something1', type: 'salesforce' }, 'salesforce.sandbox'],
        ['wrapper', {id: 'something1', type: 'wrapper' }, 'wrapper.pingFunction'],
        ['mongodb', {id: 'something1', type: 'mongodb' }, 'mongodb.database'],
        ['dynamodb', {id: 'something1', type: 'dynamodb' }, 'dynamodb.aws.secretAccessKey'],

      ];

      test.each(inputs)('should load a %s connection form', (name, resource, fieldId) => {
        const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

        expect(result?.fieldMeta?.fieldMap?.[fieldId]).toBeTruthy();
        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('exports', () => {
    const resourceType = 'exports';
    const assistantData = {};

    test('should load a new export form', () => {
      const resource = {id: 'something1'};
      const connection = {id: 'something2'};

      const result = getResourceFormAssets({resourceType, resource, isNew: true, assistantData, connection });

      // should have field named application in a new export..the only unique field for new export
      expect(result?.fieldMeta?.fieldMap?.application?.label).toEqual('Application');
      expect(result).toMatchSnapshot();
    });
    // change this negative test case to throw an error
    test('should not load a form and throw an error for non-valid schema', () => {
      const resource = {id: 'something1'};
      const connection = {id: 'something2'};

      try {
        getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });
        fail('should fail ');
      // eslint-disable-next-line no-empty
      } catch (e) {}
    });

    const inputs = [
      ['salesforce', {id: 'something1', adaptorType: 'SalesforceExport' }, {}, 'salesforce.soql'],
      ['financialforce', {id: 'something1', assistant: 'financialforce'}, {}, 'salesforce.soql'],
      ['snowflake', {id: 'something1', adaptorType: 'RDBMSExport'}, {id: 'something2', rdbms: {type: 'snowflake'}}, 'rdbms.query'],
      ['sql', {id: 'something1', adaptorType: 'RDBMSExport'}, {id: 'something2', rdbms: {type: 'mssql'}}, 'rdbms.query'],
    ];

    test.each(inputs)('should load a %s export form', (name, resource, connection, fieldId) => {
      const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

      expect(result?.fieldMeta?.fieldMap?.[fieldId]).toBeTruthy();
      expect(result).toMatchSnapshot();
    });

    test('should load assistant data', () => {
      mockExportAssist.mockReturnValueOnce(dummyData);

      const resource = {_id: 'id2',
        assistant: 'someAssistant',
      };
      const connection = {id: 'something2'};

      const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

      expect(mockExportAssist).toHaveBeenCalledWith('id2', resource, assistantData);
      // expect(exportAssistant).toHaveBeenCalled();
      expect(result?.fieldMeta?.fieldMap?.someProp).toEqual('someValue');
    });

    test('should load a csv rest export form', () => {
      const resource = {id: 'something1', adaptorType: 'RESTExport'};
      const connection = {rest: {mediaType: 'csv'}};

      const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

      expect(result?.fieldMeta?.fieldMap?.['file.csv']?.label).toEqual('CSV parser helper');
      expect(result).toMatchSnapshot();
    });
    test('should load a json rest export form', () => {
      const resource = {id: 'something1', adaptorType: 'RESTExport'};
      const connection = {rest: {mediaType: 'json'}};

      const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

      expect(result?.fieldMeta?.fieldMap?.['delta.lagOffset']?.fieldId).toEqual('delta.lagOffset');
      expect(result).toMatchSnapshot();
    });
    describe('all regular export driven forms', () => {
      const adaptorInputs = [
        ['netsuite', {id: 'something1', adaptorType: 'NetSuiteExport'}, 'netsuite.execution.type'],
        ['dynamo', {id: 'something1', adaptorType: 'DynamodbExport'}, 'dynamodb.region'],
        ['as2', {id: 'something1', adaptorType: 'AS2Export'}, 'edix12.format'],
        ['ftp', {id: 'something1', adaptorType: 'FTPExport'}, 'outputMode'],
        ['http', {id: 'something1', adaptorType: 'HTTPExport'}, 'http.method'],
        ['mongo', {id: 'something1', adaptorType: 'MongodbExport'}, 'mongodb.collection'],
        ['s3', {id: 'something1', adaptorType: 'S3Export'}, 's3.region'],
        ['salesforce', {id: 'something1', adaptorType: 'SalesforceExport'}, 'salesforce.executionType'],
        ['webhook', {id: 'something1', adaptorType: 'WebhookExport'}, 'webhook.verify'],
        ['wrapper', {id: 'something1', adaptorType: 'WrapperExport'}, 'wrapper.function'],
      ];

      test.each(adaptorInputs)('should load a %s export form', (name, resource, fieldId) => {
        const connection = {};

        const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

        // should have field named application in a new export..the only unique field for new export
        expect(result?.fieldMeta?.fieldMap?.[fieldId]).toBeTruthy();
        expect(result).toMatchSnapshot();
      });

      const inputs = [
        ['simple', {id: 'something', type: 'simple'}, 'file.csv'],
        // is a single field form
        ['distributed', {id: 'something', type: 'distributed'}, 'distributed.bearerToken'],
        ['once', {id: 'something', type: 'once'}, 'once.booleanField'],
        ['delta', {id: 'something', type: 'delta'}, 'delta.dateFormat'],
      ];

      test.each(inputs)('should load a %s export form', (name, resource, fieldId) => {
        const connection = {};

        const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

        // should have field named application in a new export..the only unique field for new export
        expect(result?.fieldMeta?.fieldMap?.[fieldId]).toBeTruthy();
        expect(result).toMatchSnapshot();
      });
    });
  });

  describe('imports', () => {
    const resourceType = 'imports';
    const assistantData = {};

    test('should load a new export form', () => {
      const resource = {id: 'something1'};
      const connection = {id: 'something2'};

      const result = getResourceFormAssets({resourceType, resource, isNew: true, assistantData, connection });

      // should have field named application in a new export..the only unique field for new export
      expect(result?.fieldMeta?.fieldMap?.application?.label).toEqual('Application');
      expect(result).toMatchSnapshot();
    });
    // change this negative test case to throw an error
    test('should not load a form and throw an error for non-valid schema', () => {
      const resource = {id: 'something1'};
      const connection = {id: 'something2'};

      try {
        getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });
        fail('should fail ');
      // eslint-disable-next-line no-empty
      } catch (e) {}
    });

    test('should load assistant data', () => {
      mockImportAssist.mockReturnValueOnce(dummyData);

      const resource = {_id: 'id1',
        assistant: 'someAssistant',
      };
      const connection = {id: 'something2'};

      const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

      expect(mockImportAssist).toHaveBeenCalledWith('id1', resource, assistantData);
      // expect(exportAssistant).toHaveBeenCalled();
      expect(result?.fieldMeta?.fieldMap?.someProp).toEqual('someValue');
    });

    const inputs = [
      ['netsuite distributed', {id: 'something1', adaptorType: 'NetSuiteDistributedImport'}, {}, 'netsuite_da.recordType'],
      ['netsuite', {id: 'something1', adaptorType: 'NetSuiteImport'}, {}, 'netsuite_da.recordType'],
      ['salesforce', {id: 'something1', adaptorType: 'SalesforceImport' }, {}, 'salesforce.attachment.contentType'],
      ['financialforce', {id: 'something1', assistant: 'financialforce'}, {}, 'salesforce.attachment.contentType'],
      ['snowflake', {id: 'something1', adaptorType: 'RDBMSImport'}, {id: 'something2', rdbms: {type: 'snowflake'}}, 'rdbms.bulkInsert.batchSize'],
      ['sql', {id: 'something1', adaptorType: 'RDBMSImport'}, {id: 'something2', rdbms: {type: 'mssql'}}, 'rdbms.query'],
    ];

    test.each(inputs)('should load %s form', (formName, resource, connection, expectedField) => {
      const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

      // should have this field in the metadata
      expect(result.fieldMeta.fieldMap?.[expectedField]).toBeTruthy();
      expect(result).toMatchSnapshot();
    });
    describe('all regular import driven forms', () => {
      const adaptorInputs = [
        ['ftp', {id: 'something1', adaptorType: 'FTPImport'}, 'ftp.useTempFile'],
        ['http', {id: 'something1', adaptorType: 'HTTPImport'}, 'dataMappings'],
        ['rest', {id: 'something1', adaptorType: 'RESTImport'}, 'rest.method'],
        ['mongodb', {id: 'something1', adaptorType: 'MongodbImport'}, 'mongodb.ignoreExtract'],
        ['s3', {id: 'something1', adaptorType: 'S3Import'}, 's3.backupBucket'],
        ['wrapper', {id: 'something1', adaptorType: 'WrapperImport'}, 'wrapper.function'],
        ['as2', {id: 'something1', adaptorType: 'AS2Import'}, 'as2.fileNameTemplate'],
        ['dynamodb', {id: 'something1', adaptorType: 'DynamodbImport'}, 'dynamodb.sortKey'],
      ];

      test.each(adaptorInputs)('should load a %s export form', (name, resource, fieldId) => {
        const connection = {};

        const result = getResourceFormAssets({resourceType, resource, isNew: false, assistantData, connection });

        // should have this field in the metadata
        expect(result?.fieldMeta?.fieldMap?.[fieldId]).toBeTruthy();
        expect(result).toMatchSnapshot();
      });
    });
  });
});
