/* global describe, test, expect, jest, beforeEach, afterEach */
import {
  getResourceSubType,
  getResourceSubTypeFromAdaptorType,
  getWebhookUrl,
  isNewId,
  isScriptIdUsedInResource,
  isFileDefinitionIdUsedInResource,
  isValidResourceReference,
  salesforceExportSelectOptions,
  isFileAdaptor,
  isRealTimeOrDistributedResource,
  resourceCategory,
  isBlobTypeResource,
  isAS2Resource,
  isRestCsvMediaTypeExport,
  isFlowResource,
  getDomain,
  getDomainUrl,
  getApiUrl,
  getHelpUrlForConnector,
  getHelpUrl,
  getNetSuiteSubrecordLabel,
  getNetSuiteSubrecordImportsFromMappings,
  getNetSuiteSubrecordImports,
  updateMappingsBasedOnNetSuiteSubrecords,
  isOauth,
  getConnectionType,
  isTradingPartnerSupported,
  isNetSuiteBatchExport,
  isQueryBuilderSupported,
  getUserAccessLevelOnConnection,
} from './resource';

describe('resource util tests', () => {
  describe('tests for util getResourceSubType', () => {
    test('should return empty object for empty resource', () => {
      const resource = undefined;
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({});
    });

    test('should return subtype for dataloader exports', () => {
      const resource = {
        type: 'simple',
        adaptorType: 'SimpleExport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'simple',
        resourceType: 'exports',
      });
    });

    test('should return subtype for salesforce export', () => {
      const resource = {
        type: 'distributed',
        adaptorType: 'SalesforceExport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'salesforce',
        resourceType: 'exports',
      });
    });

    test('should return subtype for netsuite export', () => {
      const resource = {
        adaptorType: 'NetSuiteExport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'netsuite',
        resourceType: 'exports',
      });
    });

    test('should return subtype for http export', () => {
      const resource = {
        adaptorType: 'HTTPExport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'http',
        resourceType: 'exports',
      });
    });

    test('should return subtype for rest export', () => {
      const resource = {
        adaptorType: 'RESTExport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'rest',
        resourceType: 'exports',
      });
    });

    test('should include assistant in output object', () => {
      const resource = {
        assistant: 'freshdesk',
        adaptorType: 'RESTExport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        assistant: 'freshdesk',
        type: 'rest',
        resourceType: 'exports',
      });
    });

    test('should return subtype for salesforce import', () => {
      const resource = {
        type: 'distributed',
        adaptorType: 'SalesforceImport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'salesforce',
        resourceType: 'imports',
      });
    });

    test('should return subtype for netsuite import', () => {
      const resource = {
        adaptorType: 'NetSuiteImport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'netsuite',
        resourceType: 'imports',
      });
    });

    test('should return subtype for http import', () => {
      const resource = {
        adaptorType: 'HTTPImport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'http',
        resourceType: 'imports',
      });
    });

    test('should return subtype for rest import', () => {
      const resource = {
        adaptorType: 'RESTImport',
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'rest',
        resourceType: 'imports',
      });
    });

    test('should return subtype for offline connections', () => {
      const resource = {
        type: 'salesforce',
        offline: true,
      };
      const subtype = getResourceSubType(resource);

      expect(subtype).toEqual({
        type: 'salesforce',
        resourceType: 'connections',
        offline: true,
      });
    });
  });

  describe('tests for util getResourceSubTypeFromAdaptorType', () => {
    test('should return resourceType for connections', () => {
      expect(getResourceSubTypeFromAdaptorType(undefined)).toEqual({
        resourceType: 'connections',
      });
    });

    test('should return resourceType for exports', () => {
      expect(getResourceSubTypeFromAdaptorType('XMLExport')).toEqual({
        resourceType: 'exports',
        type: 'xml',
      });

      expect(getResourceSubTypeFromAdaptorType('FTPExport')).toEqual({
        resourceType: 'exports',
        type: 'ftp',
      });

      expect(getResourceSubTypeFromAdaptorType('HTTPExport')).toEqual({
        resourceType: 'exports',
        type: 'http',
      });

      expect(getResourceSubTypeFromAdaptorType('RESTExport')).toEqual({
        resourceType: 'exports',
        type: 'rest',
      });

      expect(getResourceSubTypeFromAdaptorType('S3Export')).toEqual({
        resourceType: 'exports',
        type: 's3',
      });

      expect(getResourceSubTypeFromAdaptorType('RDBMSExport')).toEqual({
        resourceType: 'exports',
        type: 'rdbms',
      });

      expect(getResourceSubTypeFromAdaptorType('MongodbExport')).toEqual({
        resourceType: 'exports',
        type: 'mongodb',
      });

      expect(getResourceSubTypeFromAdaptorType('WrapperExport')).toEqual({
        resourceType: 'exports',
        type: 'wrapper',
      });

      expect(getResourceSubTypeFromAdaptorType('AS2Export')).toEqual({
        resourceType: 'exports',
        type: 'as2',
      });

      expect(getResourceSubTypeFromAdaptorType('WebhookExport')).toEqual({
        resourceType: 'exports',
        type: 'webhook',
      });

      expect(getResourceSubTypeFromAdaptorType('DynamodbExport')).toEqual({
        resourceType: 'exports',
        type: 'dynamodb',
      });
    });

    test('should return resourceType for imports', () => {
      expect(getResourceSubTypeFromAdaptorType('XMLImport')).toEqual({
        resourceType: 'imports',
        type: 'xml',
      });

      expect(getResourceSubTypeFromAdaptorType('FTPImport')).toEqual({
        resourceType: 'imports',
        type: 'ftp',
      });

      expect(getResourceSubTypeFromAdaptorType('HTTPImport')).toEqual({
        resourceType: 'imports',
        type: 'http',
      });

      expect(getResourceSubTypeFromAdaptorType('RESTImport')).toEqual({
        resourceType: 'imports',
        type: 'rest',
      });

      expect(getResourceSubTypeFromAdaptorType('S3Import')).toEqual({
        resourceType: 'imports',
        type: 's3',
      });

      expect(getResourceSubTypeFromAdaptorType('RDBMSImport')).toEqual({
        resourceType: 'imports',
        type: 'rdbms',
      });

      expect(getResourceSubTypeFromAdaptorType('MongodbImport')).toEqual({
        resourceType: 'imports',
        type: 'mongodb',
      });

      expect(getResourceSubTypeFromAdaptorType('WrapperImport')).toEqual({
        resourceType: 'imports',
        type: 'wrapper',
      });

      expect(getResourceSubTypeFromAdaptorType('AS2Import')).toEqual({
        resourceType: 'imports',
        type: 'as2',
      });

      expect(getResourceSubTypeFromAdaptorType('DynamodbImport')).toEqual({
        resourceType: 'imports',
        type: 'dynamodb',
      });
    });
  });

  describe('tests for functions isNewId', () => {
    test('should return undefined for undefined id value', () => {
      expect(isNewId(undefined)).toEqual(undefined);
    });

    test('should return true for newId value', () => {
      expect(isNewId('new12342')).toEqual(true);
    });

    test('should return false for id value', () => {
      expect(isNewId('5f688b789daecd32740e2d5a')).toEqual(false);
    });
  });
  describe('tests for util getWebhookUrl', () => {
    test('should return empty string for empty arguments', () => {
      expect(getWebhookUrl()).toEqual('');
    });

    test('should return correct webhook url with resource id', () => {
      expect(getWebhookUrl({
        webHookProvider: 'aha',
      }, '123')).toEqual(
        'https://api.localhost/v1/exports/123/data'
      );
    });

    test('should return webhook url with resource id and token', () => {
      expect(getWebhookUrl({
        webHookProvider: 'aha',
        webHookToken: 'abcd',
      }, '123')).toEqual(
        'https://api.localhost/v1/exports/123/abcd/data'
      );
    });
    test('should not include token in webhook url if verify is of token type', () => {
      expect(getWebhookUrl({
        webHookProvider: 'aha',
        webHookToken: 'abcd',
        webHookVerify: 'token'}, '123')).toEqual(
        'https://api.localhost/v1/exports/123/data'
      );
    });
  });

  describe('tests for util getDomain, getDomainUrl, getApiUrl', () => {
    let windowSpy;

    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    test('should return correct urls for localhost (process.env.API_ENDPOINT not set)', () => {
      process.env.API_ENDPOINT = '';
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'localhost.io',
            host: 'localhost.io:4000',
          },
        },
      }));

      expect(getDomain()).toEqual('localhost.io');
      expect(getDomainUrl()).toEqual('http://localhost.io:4000');
      expect(getApiUrl()).toEqual('http://api.localhost.io:4000');
    });

    test('should return correct urls for localhost (process.env.API_ENDPOINT set)', () => {
      process.env.API_ENDPOINT = 'https://something';
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'localhost.io',
            host: 'localhost.io:4000',
          },
        },
      }));

      expect(getDomain()).toEqual('localhost.io');
      expect(getDomainUrl()).toEqual('http://localhost.io:4000');
      expect(getApiUrl()).toEqual('https://api.something');
      process.env.API_ENDPOINT = '';
    });

    test('should return correct urls for staging integrator (process.env.API_ENDPOINT not set)', () => {
      process.env.API_ENDPOINT = '';
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.staging.integrator.io',
          },
        },
      }));

      expect(getDomain()).toEqual('staging.integrator.io');
      expect(getDomainUrl()).toEqual('https://staging.integrator.io');
      expect(getApiUrl()).toEqual('https://api.staging.integrator.io');
    });

    test('should return correct urls for staging integrator (process.env.API_ENDPOINT set)', () => {
      process.env.API_ENDPOINT = 'https://something';
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.staging.integrator.io',
          },
        },
      }));

      expect(getDomain()).toEqual('staging.integrator.io');
      expect(getDomainUrl()).toEqual('https://staging.integrator.io');
      expect(getApiUrl()).toEqual('https://api.staging.integrator.io');
      process.env.API_ENDPOINT = '';
    });

    test('should return correct urls for integrator', () => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.integrator.io',
          },
        },
      }));

      expect(getDomain()).toEqual('integrator.io');
      expect(getDomainUrl()).toEqual('https://integrator.io');
      expect(getApiUrl()).toEqual('https://api.integrator.io');
    });
  });
  describe('tests for util isScriptIdUsedInResource', () => {
    test('should return false for empty resource and empty script id', () => {
      expect(isScriptIdUsedInResource(undefined, undefined)).toEqual(false);
    });

    test('should return false for empty resource and script id', () => {
      expect(isScriptIdUsedInResource(undefined, '123')).toEqual(false);
    });

    test('should return false for resource and empty script id', () => {
      expect(isScriptIdUsedInResource({}, undefined)).toEqual(false);
    });

    test('should return true for resource and script id', () => {
      expect(isScriptIdUsedInResource({
        hooks: {
          preMap: {
            _scriptId: '1234',
            function: 'test',
          },
          postMap: {
            _scriptId: '9876',
            function: 'test',
          },
          postSubmit: {
            _scriptId: '5432',
            function: 'test',
          },
        },
      }, '5432')).toEqual(true);
    });

    test('should return false for resource and script id', () => {
      expect(isScriptIdUsedInResource({
        hooks: {
          preMap: {
            _scriptId: '1234',
            function: 'test',
          },
          postMap: {
            _scriptId: '9876',
            function: 'test',
          },
          postSubmit: {
            _scriptId: '5432',
            function: 'test',
          },
        },
      }, '5432123')).toEqual(false);
    });
  });

  describe('tests for util isFileDefinitionIdUsedInResource', () => {
    test('should return false for undefined resource and definition', () => {
      expect(isFileDefinitionIdUsedInResource(undefined, undefined)).toEqual(false);
    });

    test('should return false for undefined resource', () => {
      expect(isFileDefinitionIdUsedInResource(undefined, '1234')).toEqual(false);
    });

    test('should return false for undefined filedefinition id', () => {
      expect(isFileDefinitionIdUsedInResource({}, undefined)).toEqual(false);
    });

    test('should return true for valid resource and filedefinition id', () => {
      expect(isFileDefinitionIdUsedInResource({
        file: {
          fileDefinition: {
            _fileDefinitionId: '1234',
          },
        },
      }, '1234')).toEqual(true);
    });

    test('should return false for if filedefinition id not used', () => {
      expect(isFileDefinitionIdUsedInResource({
        file: {
          fileDefinition: {
            _fileDefinitionId: '1234',
          },
        },
      }, '12345')).toEqual(false);
    });
  });

  describe('tests for util isValidResourceReference', () => {
    test('should return undefined for undefined inputs', () => {
      expect(isValidResourceReference()).toEqual(undefined);
    });

    test('should return true for exports with valid inputs', () => {
      expect(isValidResourceReference(null, '123', 'exports', '123')).toEqual(true);
    });

    test('should return true for imports with valid inputs', () => {
      expect(isValidResourceReference(null, '123', 'imports', '123')).toEqual(true);
    });

    test('should return false for exports with invalid inputs', () => {
      expect(isValidResourceReference(null, '1234', 'imports', '123')).toEqual(false);
    });

    test('should return true for scripts with valid inputs', () => {
      expect(isValidResourceReference(
        {
          hooks: {
            preMap: {
              _scriptId: '1234',
              function: 'test',
            },
            postMap: {
              _scriptId: '9876',
              function: 'test',
            },
            postSubmit: {
              _scriptId: '5432',
              function: 'test',
            },
          },
        },
        null, 'scripts', '1234')).toEqual(true);
    });

    test('should return true for filedefinitions with valid inputs', () => {
      expect(isValidResourceReference(
        {
          file: {
            fileDefinition: {
              _fileDefinitionId: '1234',
            },
          },
        },
        null, 'filedefinitions', '1234')).toEqual(true);
    });
  });

  describe('tests for util salesforceExportSelectOptions', () => {
    test('should return undefined for undefined input args', () => {
      expect(salesforceExportSelectOptions()).toEqual(undefined);
    });

    test('should return date & datetime fields for option deltaExportDateFields', () => {
      expect(salesforceExportSelectOptions([
        {
          label: 'Created Date',
          value: 'createddate',
          type: 'datetime',
        },
        {
          label: 'Start Date',
          value: 'startdate',
          type: 'date',
        },
        {
          label: 'Id',
          value: 'id',
          type: 'string',
        },
      ], 'deltaExportDateFields')).toEqual([
        {
          label: 'Created Date',
          value: 'createddate',
        },
        {
          label: 'Start Date',
          value: 'startdate',
        },
      ]);
    });

    test('should return boolean fields for option onceExportBooleanFields', () => {
      expect(salesforceExportSelectOptions([
        {
          label: 'Is Exported',
          value: 'isexported',
          type: 'boolean',
          updateable: true,
        },
        {
          label: 'Is Closed',
          value: 'isclosed',
          type: 'boolean',
          updateable: true,
        },
        {
          label: 'Is Deleted',
          value: 'isdeleted',
          type: 'boolean',
          updateable: false,
        },
        {
          label: 'Id',
          value: 'id',
          type: 'string',
        },
      ], 'onceExportBooleanFields')).toEqual([
        {
          label: 'Is Exported',
          value: 'isexported',
        },
        {
          label: 'Is Closed',
          value: 'isclosed',
        },
      ]);
    });

    test('should return externalid fields for option externalIdFields', () => {
      expect(salesforceExportSelectOptions([
        {
          label: 'NS Id',
          value: 'nsid',
          type: 'string',
          externalId: true,
        },
        {
          label: 'Accumatica Id',
          value: 'accumaticaid',
          type: 'string',
          externalId: true,
        },
        {
          label: 'Is Deleted',
          value: 'isdeleted',
          type: 'boolean',
          updateable: false,
        },
        {
          label: 'Id',
          value: 'id',
          type: 'string',
          name: 'Id',
        },
      ], 'externalIdFields')).toEqual([
        {
          label: 'NS Id',
          value: 'nsid',
        },
        {
          label: 'Accumatica Id',
          value: 'accumaticaid',
        },
        {
          label: 'Id',
          value: 'id',
        },
      ]);
    });

    test('should return referenced fields for option referenceFields', () => {
      expect(salesforceExportSelectOptions([
        {
          label: 'Account Id',
          value: 'accountid',
          type: 'string',
          referenceTo: 'Account',
        },
        {
          label: 'Created By',
          value: 'createdby',
          type: 'string',
          referenceTo: 'User',
        },
        {
          label: 'Id',
          value: 'id',
          type: 'string',
          name: 'Id',
        },
      ], 'referenceFields')).toEqual([
        {
          label: 'Account Id',
          value: 'accountid',
        },
        {
          label: 'Created By',
          value: 'createdby',
        },
      ]);
    });

    test('should return all fields for unknown option', () => {
      expect(salesforceExportSelectOptions([
        {
          label: 'Account Id',
          value: 'accountid',
          type: 'string',
          referenceTo: 'Account',
        },
        {
          label: 'Created By',
          value: 'createdby',
          type: 'string',
          referenceTo: 'User',
        },
        {
          label: 'Id',
          value: 'id',
          type: 'string',
          name: 'Id',
        },
      ], 'testtt')).toEqual([
        {
          label: 'Account Id',
          value: 'accountid',
        },
        {
          label: 'Created By',
          value: 'createdby',
        },
        {
          label: 'Id',
          value: 'id',
        },
      ]);
    });
  });

  describe('tests for util isFileAdaptor', () => {
    test('should return false for undefined resource', () => {
      expect(isFileAdaptor()).toEqual(false);
    });

    test('should return true for valid file resources', () => {
      expect(isFileAdaptor({
        type: 'simple',
      })).toEqual(true);

      expect(isFileAdaptor({
        adaptorType: 'S3Export',
      })).toEqual(true);

      expect(isFileAdaptor({
        adaptorType: 'S3Import',
      })).toEqual(true);

      expect(isFileAdaptor({
        adaptorType: 'FTPExport',
      })).toEqual(true);

      expect(isFileAdaptor({
        adaptorType: 'FTPImport',
      })).toEqual(true);
      expect(isFileAdaptor({
        adaptorType: 'HTTPExport',
        http: {
          type: 'file',
        },
      })).toEqual(true);
      expect(isFileAdaptor({
        adaptorType: 'HTTPImport',
        http: {
          type: 'file',
        },
      })).toEqual(true);
    });

    test('should return false for valid file resources', () => {
      expect(isFileAdaptor({
        adaptorType: 'SalesforceExport',
      })).toEqual(false);

      expect(isFileAdaptor({
        adaptorType: 'NetSuiteImport',
      })).toEqual(false);

      expect(isFileAdaptor({
        adaptorType: 'HTTPExport',
      })).toEqual(false);

      expect(isFileAdaptor({
        adaptorType: 'RestImport',
      })).toEqual(false);
    });
  });

  describe('tests for util isRealTimeOrDistributedResource', () => {
    test('should return false for undefined input', () => {
      expect(isRealTimeOrDistributedResource()).toEqual(false);
    });

    test('should return true for valid realtime resources', () => {
      expect(isRealTimeOrDistributedResource({
        adaptorType: 'AS2Export',
      }, 'exports')).toEqual(true);

      expect(isRealTimeOrDistributedResource({
        type: 'distributed',
      }, 'exports')).toEqual(true);

      expect(isRealTimeOrDistributedResource({
        type: 'webhook',
      }, 'exports')).toEqual(true);

      expect(isRealTimeOrDistributedResource({
        adaptorType: 'SalesforceImport',
      }, 'imports')).toEqual(true);

      expect(isRealTimeOrDistributedResource({
        adaptorType: 'NetSuiteImport',
      }, 'imports')).toEqual(true);
    });

    test('should return false for not realtime resources', () => {
      expect(isRealTimeOrDistributedResource({
        adaptorType: 'AS2Import',
      }, 'imports')).toEqual(false);

      expect(isRealTimeOrDistributedResource({
        adaptorType: 'HTTPExport',
      }, 'exports')).toEqual(false);

      expect(isRealTimeOrDistributedResource({
        adaptorType: 'RestExport',
      }, 'exports')).toEqual(false);
    });
  });

  describe('tests for util resourceCategory', () => {
    test('should return export for undefined props', () => {
      expect(resourceCategory()).toEqual('export');
    });

    test('should return category as dataloader for dataloader exp', () => {
      expect(resourceCategory({
        adaptorType: 'SimpleExport',
      })).toEqual('dataLoader');
    });

    test('should return category as listener for realtime exports', () => {
      expect(resourceCategory({
        type: 'distributed',
      })).toEqual('listener');

      expect(resourceCategory({
        adaptorType: 'AS2Export',
      })).toEqual('listener');

      expect(resourceCategory({
        type: 'webhook',
      })).toEqual('listener');
    });

    test('should return category as transfer for blob resources', () => {
      expect(resourceCategory({
        type: 'blob',
        adaptorType: 'SalesforceExport',
      })).toEqual('exportTransfer');

      expect(resourceCategory({
        type: 'blob',
        adaptorType: 'NetSuiteExport',
      })).toEqual('exportTransfer');

      expect(resourceCategory({
        type: 'blob',
        adaptorType: 'HTTPExport',
      })).toEqual('exportTransfer');

      expect(resourceCategory({
        type: 'blob',
        adaptorType: 'RESTExport',
      })).toEqual('exportTransfer');

      expect(resourceCategory({
        adaptorType: 'FTPExport',
      })).toEqual('exportTransfer');

      expect(resourceCategory({
        type: 'blob',
        adaptorType: 'S3Export',
      })).toEqual('exportTransfer');

      expect(resourceCategory({
        blob: true,
        adaptorType: 'SalesforceImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        blob: true,
        adaptorType: 'NetSuiteImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        blob: true,
        adaptorType: 'HTTPImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        blob: true,
        adaptorType: 'RESTImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        adaptorType: 'FTPImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        blob: true,
        adaptorType: 'S3Import',
      })).toEqual('importTransfer');
    });
  });

  describe('tests for util isBlobTypeResource', () => {
    test('should return undefined for undefined resource', () => {
      expect(isBlobTypeResource()).toEqual(undefined);
    });

    test('should return true for blob exports', () => {
      expect(isBlobTypeResource({
        type: 'blob',
      })).toEqual(true);
    });

    test('should return true for blob imports', () => {
      expect(isBlobTypeResource({
        blob: true,
      })).toEqual(true);
    });

    test('should return false for blob imports', () => {
      expect(isBlobTypeResource({
        type: 'distributed',
        blob: false,
      })).toEqual(false);
    });
  });

  describe('tests for util isAS2Resource', () => {
    test('should return false for undefined resource', () => {
      expect(isAS2Resource()).toEqual(false);
    });

    test('should return true for as2 exports', () => {
      expect(isAS2Resource({
        adaptorType: 'AS2Export',
      })).toEqual(true);
    });

    test('should return true for as2 imports', () => {
      expect(isAS2Resource({
        adaptorType: 'AS2Import',
      })).toEqual(true);
    });

    test('should return false for non-as2 imports', () => {
      expect(isAS2Resource({
        adaptorType: 'RESTImport',
      })).toEqual(false);

      expect(isAS2Resource({
        adaptorType: 'HTTPImport',
      })).toEqual(false);
    });
  });

  describe('tests for util isRestCsvMediaTypeExport', () => {
    test('should return false for undefined resource', () => {
      expect(isRestCsvMediaTypeExport()).toEqual(false);
    });

    test('should return true for rest exports', () => {
      expect(isRestCsvMediaTypeExport({
        adaptorType: 'RESTExport',
      }, {
        rest: {
          mediaType: 'csv',
        },
      })).toEqual(true);
    });

    test('should return true for rest imports', () => {
      expect(isRestCsvMediaTypeExport({
        adaptorType: 'RESTImport',
      }, {
        rest: {
          mediaType: 'csv',
        },
      })).toEqual(true);
    });

    test('should return false for non-rest resources', () => {
      expect(isRestCsvMediaTypeExport({
        adaptorType: 'HTTPExport',
      }, {
        rest: {
          mediaType: 'csv',
        },
      })).toEqual(false);
      expect(isRestCsvMediaTypeExport({
        adaptorType: 'HTTPImport',
      }, {
        rest: {
          mediaType: 'csv',
        },
      })).toEqual(false);
    });

    test('should return false for mediatype not equal to csv', () => {
      expect(isRestCsvMediaTypeExport({
        adaptorType: 'RESTExport',
      }, {
        rest: {
          mediaType: 'json',
        },
      })).toEqual(false);
      expect(isRestCsvMediaTypeExport({
        adaptorType: 'RESTImport',
      }, {
        rest: {
          mediaType: 'json',
        },
      })).toEqual(false);
    });
  });

  describe('tests for util isFlowResource', () => {
    test('should return false for undefined props', () => {
      expect(isFlowResource()).toEqual(false);
    });

    test('should return true if resource is linked to flow', () => {
      expect(isFlowResource({
        pageGenerators: [{
          _exportId: '1234',
        }, {
          _exportId: '1235',
        }],
        pageProcessors: [{
          _exportId: '9876',
        }, {
          _importId: '9875',
        }],
      }, '1234', 'exports')).toEqual(true);

      expect(isFlowResource({
        pageGenerators: [{
          _exportId: '1234',
        }, {
          _exportId: '1235',
        }],
        pageProcessors: [{
          _exportId: '9876',
        }, {
          _importId: '9875',
        }],
      }, '9876', 'exports')).toEqual(true);

      expect(isFlowResource({
        pageGenerators: [{
          _exportId: '1234',
        }, {
          _exportId: '1235',
        }],
        pageProcessors: [{
          _exportId: '9876',
        }, {
          _importId: '9875',
        }],
      }, '9875', 'imports')).toEqual(true);
    });

    test('should return false if resource is not linked to flow', () => {
      expect(isFlowResource({
        pageGenerators: [{
          _exportId: '1234',
        }, {
          _exportId: '1235',
        }],
        pageProcessors: [{
          _exportId: '9876',
        }, {
          _importId: '9875',
        }],
      }, '5432', 'exports')).toEqual(false);
    });
  });

  describe('tests for util getHelpUrlForConnector for integrator, staging integrator', () => {
    let windowSpy;

    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    test('should return connector help urls for staging integrator', () => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.staging.integrator.io',
          },
        },
      }));

      expect(getHelpUrlForConnector('5656f5e3bebf89c03f5dd77e')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203963787'
      );

      expect(getHelpUrlForConnector('5666865f67c1650309224904')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203958808'
      );

      expect(getHelpUrlForConnector('58ee6029319bd30cc2fee160')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/sections/115000327151'
      );

      expect(getHelpUrlForConnector('suitescript-salesforce-netsuite')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203964847'
      );

      expect(getHelpUrlForConnector('suitescript-svb-netsuite')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203958788'
      );
    });

    test('should return connector help urls for integrator', () => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.integrator.io',
          },
        },
      }));

      expect(getHelpUrlForConnector('54fa0b38a7044f9252000036')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203963787'
      );

      expect(getHelpUrlForConnector('5728756afee45a8d11e79cb7')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203958668'
      );

      expect(getHelpUrlForConnector('592e8679c95560380ff1325c')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/sections/115000327151'
      );

      expect(getHelpUrlForConnector('suitescript-salesforce-netsuite')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203964847'
      );

      expect(getHelpUrlForConnector('suitescript-svb-netsuite')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203958788'
      );
    });

    test('should return connector help urls for eu integrator', () => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.eu.integrator.io',
          },
        },
      }));

      expect(getHelpUrlForConnector('5e8d6f912387e356b6769bc5')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/115000816227'
      );

      expect(getHelpUrlForConnector('5e8d6ca02387e356b6769bb8')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203963787'
      );

      expect(getHelpUrlForConnector('5e7d921e2387e356b67669ce')).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/360001649831'
      );
    });

    test('should return connector help urls for localhost', () => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.localhost.io',
          },
        },
      }));

      expect(getHelpUrlForConnector('1234', [
        {
          _id: '1234',
          name: 'Shopify - NetSuite Connector',
        },
      ])).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203963787'
      );

      expect(getHelpUrlForConnector('1234', [
        {
          _id: '1234',
          name: 'Salesforce - NetSuite Connector (IO)',
        },
      ])).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/360001649831'
      );

      expect(getHelpUrlForConnector('1234', [
        {
          _id: '1234',
          name: 'Cash Application Manager for NetSuite',
        },
      ])).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203958648'
      );
    });
  });

  describe('tests for util getHelpUrl', () => {
    let windowSpy;

    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
    });

    afterEach(() => {
      windowSpy.mockRestore();
    });

    test('should return connector help urls for integrator', () => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.integrator.io',
          },
        },
        location: {
          href: 'https://integrator.io/integrationapps/ADPNetSuite/5e09c64142748f7b5a3380a3',
        },
      }));

      expect(getHelpUrl([{
        _id: '5e09c64142748f7b5a3380a3',
        _connectorId: '54fa0b38a7044f9252000036',
      },
      ])).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203963787'
      );
    });

    test('should return connector help urls for staging integrator', () => {
      windowSpy.mockImplementation(() => ({
        document: {
          location: {
            hostname: 'www.staging.integrator.io',
          },
        },
        location: {
          href: 'https://staging.integrator.io/integrationapps/SalesforceNetSuiteIO/5e09c64142748f7b5a3380a3',
        },
      }));

      expect(getHelpUrl([{
        _id: '5e09c64142748f7b5a3380a3',
        _connectorId: '5656f5e3bebf89c03f5dd77e',
      },
      ])).toEqual(
        'https://integrator.io/zendesk/sso?return_to=https://docs.celigo.com/hc/en-us/categories/203963787'
      );
    });
  });

  describe('tests for util getNetSuiteSubrecordLabel', () => {
    test('should return empty string for undefined props', () => {
      expect(getNetSuiteSubrecordLabel()).toEqual('');
    });
    test('should return subrecord label for inventorydetail', () => {
      expect(getNetSuiteSubrecordLabel(
        'item[*]._celigo_inventory_details',
        'inventorydetail')).toEqual(
        'Items : Inventory Details'
      );
    });

    test('should return subrecord label for componentinventorydetail', () => {
      expect(getNetSuiteSubrecordLabel(
        'component[*]._celigo_comp_inventory_details',
        'componentinventorydetail')).toEqual(
        'Components : Inventory Details'
      );
    });

    test('should return subrecord label for landedcost', () => {
      expect(getNetSuiteSubrecordLabel(
        'inventory[*].landedcost',
        'landedcost')).toEqual(
        'Adjustments : Landed Cost'
      );
    });
  });

  describe('tests for util getNetSuiteSubrecordImportsFromMappings, getNetSuiteSubrecordImports', () => {
    test('should return empty array if input is undefined', () => {
      expect(getNetSuiteSubrecordImportsFromMappings()).toEqual([]);
    });
    test('should return subrecord from mapping if subrecord exists in list', () => {
      const mapping = {
        lists: [
          {
            generate: 'item',
            fields: [
              {
                generate: 'celigo_inventorydetail',
                subRecordMapping: {
                  recordType: 'inventorydetail',
                  jsonPath: '$',
                  mapping: {
                    fields: [
                      {
                        generate: 'tolocation',
                        extract: 'location',
                        internalId: false,
                        useAsAnInitializeValue: false,
                      },
                      {
                        generate: 'itemdescription',
                        extract: 'description',
                        internalId: false,
                      },
                    ],
                  },
                  lookups: [

                  ],
                },
              },
            ],
          },
        ],
      };

      const expected = [
        {
          fieldId: 'item[*].celigo_inventorydetail',
          jsonPath: '$',
          name: 'Items : Inventory Details',
          recordType: 'inventorydetail',
        },
      ];

      expect(getNetSuiteSubrecordImportsFromMappings(mapping)).toEqual(expected);

      const importDoc = {
        netsuite_da: {
          mapping,
        },
      };

      expect(getNetSuiteSubrecordImports(importDoc)).toEqual(expected);
    });

    test('should return subrecord from mapping if subrecord exists in parent record', () => {
      const mapping = {
        fields: [
          {
            generate: 'celigo_inventorydetail',
            subRecordMapping: {
              recordType: 'inventorydetail',
              jsonPath: '$',
              mapping: {
                fields: [
                  {
                    generate: 'itemdescription',
                    extract: 'description',
                    internalId: false,
                  },
                ],
                lists: [],
              },
              lookups: [],
            },
          },
        ],
        lists: [
          {
            generate: 'item',
            fields: [],
          },
        ],
      };
      const expected = [
        {
          fieldId: 'celigo_inventorydetail',
          jsonPath: '$',
          name: 'Inventory Details',
          recordType: 'inventorydetail',
        },
      ];

      expect(getNetSuiteSubrecordImportsFromMappings(mapping)).toEqual(expected);

      const importDoc = {
        netsuite_da: {
          mapping,
        },
      };

      expect(getNetSuiteSubrecordImports(importDoc)).toEqual(expected);
    });
  });

  describe('tests for util updateMappingsBasedOnNetSuiteSubrecords', () => {
    test('should return undefined for empty props', () => {
      expect(updateMappingsBasedOnNetSuiteSubrecords()).toEqual(undefined);
    });

    test('should update mapping based on line level subrecord', () => {
      const mapping = {};

      const subrecord = [
        {
          fieldId: 'item[*].celigo_inventorydetail',
          jsonPath: '$',
          recordType: 'inventorydetail',
        },
      ];

      expect(updateMappingsBasedOnNetSuiteSubrecords(mapping, subrecord)).toEqual(
        {
          fields: [

          ],
          lists: [
            {
              fields: [
                {
                  generate: 'celigo_inventorydetail',
                  subRecordMapping: {
                    jsonPath: '$',
                    recordType: 'inventorydetail',
                  },
                },
              ],
              generate: 'item',
            },
          ],
        }
      );
    });

    test('should update mapping based on body level subrecord', () => {
      const mapping = {};

      const subrecord = [
        {
          fieldId: 'celigo_inventorydetail',
          jsonPath: '$',
          recordType: 'inventorydetail',
        },
      ];

      expect(updateMappingsBasedOnNetSuiteSubrecords(mapping, subrecord)).toEqual(
        {
          fields: [
            {
              generate: 'celigo_inventorydetail',
              subRecordMapping: {
                recordType: 'inventorydetail',
                jsonPath: '$',
              },
            },
          ],
          lists: [],
        }
      );
    });

    test('should update mapping based on both body level and line level subrecord', () => {
      const mapping = {};

      const subrecord = [
        {
          fieldId: 'item[*].celigo_inventorydetail',
          jsonPath: '$',
          recordType: 'inventorydetail',
        },
        {
          fieldId: 'celigo_inventorydetail',
          jsonPath: '$',
          recordType: 'inventorydetail',
        },
      ];

      expect(updateMappingsBasedOnNetSuiteSubrecords(mapping, subrecord)).toEqual(
        {
          fields: [
            {
              generate: 'celigo_inventorydetail',
              subRecordMapping: {
                recordType: 'inventorydetail',
                jsonPath: '$',
              },
            },
          ],
          lists: [
            {
              generate: 'item',
              fields: [
                {
                  generate: 'celigo_inventorydetail',
                  subRecordMapping: {
                    recordType: 'inventorydetail',
                    jsonPath: '$',
                  },
                },
              ],
            },
          ],
        }
      );
    });

    test('should update mapping based on subrecord for already existing mapping', () => {
      const mapping = {
        fields: [
          {
            generate: 'acctname',
            extract: 'name',
          },
          {
            generate: 'accttype',
            hardCodedValue: 'Equity',
          },
          {
            generate: 'subsidiary',
            hardCodedValue: '1',
          },
        ],
        lists: [
          {
            fields: [
              {
                extract: 'item[*].quantity',
                generate: 'Quantity',
              },
              {
                extract: 'item[*].price',
                generate: 'TotalPrice',
              },
            ],
            generate: 'items',
          }],
      };

      const subrecord = [
        {
          fieldId: 'item[*].celigo_inventorydetail',
          jsonPath: '$',
          recordType: 'inventorydetail',
        },
        {
          fieldId: 'celigo_inventorydetail',
          jsonPath: '$',
          recordType: 'inventorydetail',
        },
      ];

      expect(updateMappingsBasedOnNetSuiteSubrecords(mapping, subrecord)).toEqual(
        {
          fields: [
            {
              generate: 'acctname',
              extract: 'name',
            },
            {
              generate: 'accttype',
              hardCodedValue: 'Equity',
            },
            {
              generate: 'subsidiary',
              hardCodedValue: '1',
            },
            {
              generate: 'celigo_inventorydetail',
              subRecordMapping: {
                recordType: 'inventorydetail',
                jsonPath: '$',
              },
            },
          ],
          lists: [
            {
              fields: [
                {
                  extract: 'item[*].quantity',
                  generate: 'Quantity',
                },
                {
                  extract: 'item[*].price',
                  generate: 'TotalPrice',
                },
              ],
              generate: 'items',
            },
            {
              generate: 'item',
              fields: [
                {
                  generate: 'celigo_inventorydetail',
                  subRecordMapping: {
                    recordType: 'inventorydetail',
                    jsonPath: '$',
                  },
                },
              ],
            },
          ],
        }
      );
    });
  });

  describe('tests for util isOauth', () => {
    test('should return false if conn doc is undefined', () => {
      expect(isOauth()).toEqual(false);
    });

    test('should return true for oauth conns', () => {
      expect(isOauth(
        {
          rest:
          {
            authType: 'oauth',
          },
        }
      )).toEqual(true);

      expect(isOauth(
        {
          http:
          {
            auth: {
              type: 'oauth',
            },
          },
        }
      )).toEqual(true);

      expect(isOauth(
        {
          salesforce:
          {
            oauth2FlowType: 'refreshToken',
          },
        }
      )).toEqual(true);

      expect(isOauth(
        {
          netsuite:
          {
            authType: 'token-auto',
          },
        }
      )).toEqual(true);
    });

    test('should return false for non-oauth conns', () => {
      expect(isOauth(
        {
          rest:
          {
            authType: 'cookie',
          },
        }
      )).toEqual(false);

      expect(isOauth(
        {
          http:
          {
            auth: {
              type: 'cookie',
            },
          },
        }
      )).toEqual(false);

      expect(isOauth(
        {
          netsuite:
          {
            authType: 'basic',
          },
        }
      )).toEqual(false);

      expect(isOauth(
        {
          type: 'rdbms',
        }
      )).toEqual(false);
    });
  });

  describe('tests for util getConnectionType', () => {
    test('should return undefined for undefined ip', () => {
      expect(getConnectionType()).toEqual(undefined);
    });

    test('should return correct type for oauth conns', () => {
      expect(getConnectionType({
        assistant: 'shopify',
        type: 'http',
        http: {
          auth: {
            type: 'oauth',
          },
        },
      })).toEqual('shopify-oauth');

      expect(getConnectionType({
        assistant: 'acumatica',
        type: 'http',
        http: {
          auth: {
            type: 'oauth',
          },
        },
      })).toEqual('acumatica-oauth');

      expect(getConnectionType({
        type: 'netsuite',
        netsuite: {
          authType: 'token-auto',
        },
      })).toEqual('netsuite-oauth');
    });

    test('should return correct type for all conns', () => {
      expect(getConnectionType({
        assistant: 'shopify',
        type: 'http',
        http: {
          auth: {
            type: 'cookie',
          },
        },
      })).toEqual('shopify');

      expect(getConnectionType({
        assistant: 'acumatica',
        type: 'http',
        http: {
          auth: {
            type: 'cookie',
          },
        },
      })).toEqual('acumatica');

      expect(getConnectionType({
        type: 'netsuite',
        netsuite: {
          authType: 'basic',
        },
      })).toEqual('netsuite');

      expect(getConnectionType({
        type: 'salesforce',
      })).toEqual('salesforce');

      expect(getConnectionType({
        type: 'rdbms',
      })).toEqual('rdbms');

      expect(getConnectionType({
        type: 'rest',
        assistant: 'zendesk',
      })).toEqual('zendesk');

      expect(getConnectionType({
        type: 'http',
        assistant: 'paypal',
      })).toEqual('paypal');
    });
  });

  describe('tests for util isTradingPartnerSupported', () => {
    test('should return false  if no parameters are passed', () => {
      expect(isTradingPartnerSupported()).toEqual(false);
    });

    test('should return true if trading partner licenses are present', () => {
      expect(isTradingPartnerSupported({
        environment: 'production',
        licenseActionDetails: {
          type: 'endpoint',
          totalNumberofProductionTradingPartners: 5,
        },
        accessLevel: 'manage',
      })).toEqual(true);

      expect(isTradingPartnerSupported({
        environment: 'production',
        licenseActionDetails: {
          type: 'endpoint',
          totalNumberofProductionTradingPartners: 5,
        },
        accessLevel: 'owner',
      })).toEqual(true);

      expect(isTradingPartnerSupported({
        environment: 'sandbox',
        licenseActionDetails: {
          type: 'endpoint',
          totalNumberofSandboxTradingPartners: 5,
        },
        accessLevel: 'owner',
      })).toEqual(true);

      expect(isTradingPartnerSupported({
        environment: 'sandbox',
        licenseActionDetails: {
          type: 'endpoint',
          totalNumberofSandboxTradingPartners: 5,
        },
        accessLevel: 'manage',
      })).toEqual(true);
    });

    test('should return false if trading partner licenses are not present or unaccessible', () => {
      expect(isTradingPartnerSupported({
        environment: 'production',
        licenseActionDetails: {
          type: 'endpoint',
          totalNumberofProductionTradingPartners: 5,
        },
        accessLevel: 'monitor',
      })).toEqual(false);

      expect(isTradingPartnerSupported({
        environment: 'production',
        licenseActionDetails: {
          type: 'endpoint',
          totalNumberofProductionTradingPartners: 0,
        },
        accessLevel: 'owner',
      })).toEqual(false);

      expect(isTradingPartnerSupported({
        environment: 'sandbox',
        licenseActionDetails: {
          type: 'endpoint',
          totalNumberofSandboxTradingPartners: 5,
        },
        accessLevel: 'monitor',
      })).toEqual(false);

      expect(isTradingPartnerSupported({
        environment: 'sandbox',
        licenseActionDetails: {
          type: 'endpoint',
          totalNumberofSandboxTradingPartners: 0,
        },
        accessLevel: 'manage',
      })).toEqual(false);
    });
  });

  describe('tests for util isNetSuiteBatchExport', () => {
    test('should return false if no parameters are passed', () => {
      expect(isNetSuiteBatchExport()).toEqual(false);
    });

    test('should return true for ns batch exp docs', () => {
      expect(isNetSuiteBatchExport({
        netsuite: {
          type: 'search',
        },
      })).toEqual(true);

      expect(isNetSuiteBatchExport({
        netsuite: {
          restlet: {
            searchId: '1234',
          },
        },
      })).toEqual(true);
    });

    test('should return false for ns realtime exp docs', () => {
      expect(isNetSuiteBatchExport({
        netsuite: {
          type: 'distributed',
        },
      })).toEqual(false);
    });
  });

  describe('tests for util isQueryBuilderSupported', () => {
    test('should return false  if no parameters are passed', () => {
      expect(isQueryBuilderSupported()).toEqual(false);
    });

    test('should return true for query builder supported db imps', () => {
      expect(isQueryBuilderSupported({
        adaptorType: 'MongoDbImport',
      })).toEqual(true);

      expect(isQueryBuilderSupported({
        adaptorType: 'DynamodbImport',
      })).toEqual(true);

      expect(isQueryBuilderSupported({
        adaptorType: 'RDBMSImport',
        rdbms: {
          queryType: ['INSERT'],
        },
      })).toEqual(true);

      expect(isQueryBuilderSupported({
        adaptorType: 'RDBMSImport',
        rdbms: {
          queryType: ['UPDATE'],
        },
      })).toEqual(true);
    });

    test('should return false if query builder not supported', () => {
      expect(isQueryBuilderSupported({
        adaptorType: 'SalesforceImport',
      })).toEqual(false);

      expect(isQueryBuilderSupported({
        adaptorType: 'NetSuiteImport',
      })).toEqual(false);

      expect(isQueryBuilderSupported({
        adaptorType: 'RDBMSImport',
        rdbms: {
          queryType: ['INSERT', 'MERGE'],
        },
      })).toEqual(false);

      expect(isQueryBuilderSupported({
        adaptorType: 'RDBMSImport',
        rdbms: {
          queryType: ['UPDATE', 'BULK INSERT'],
        },
      })).toEqual(false);
    });
  });

  describe('tests for util getUserAccessLevelOnConnection', () => {
    test('should return undefined  if no parameters are passed', () => {
      expect(getUserAccessLevelOnConnection()).toEqual(undefined);
    });

    test('should return same accessLevel if not of type tile', () => {
      expect(getUserAccessLevelOnConnection({
        accessLevel: 'manage',
      })).toEqual('manage');

      expect(getUserAccessLevelOnConnection({
        accessLevel: 'monitor',
      })).toEqual('monitor');

      expect(getUserAccessLevelOnConnection({
        accessLevel: 'owner',
      })).toEqual('owner');
    });

    test('should return accessLevel on tile with registered connection', () => {
      expect(getUserAccessLevelOnConnection({
        accessLevel: 'tile',
        integrations:
          {
            3: {
              accessLevel: 'monitor',
            },
          },
      }, [
        {
          _registeredConnectionIds: ['111', '222'],
          _id: '1',
        },
        {
          _registeredConnectionIds: ['333', '444'],
          _id: '2',
        },
        {
          _registeredConnectionIds: ['555'],
          _id: '3',
        },
      ], '555')).toEqual('monitor');
    });

    test('should return highest access if multiple tiles are registered', () => {
      expect(getUserAccessLevelOnConnection({
        accessLevel: 'tile',
        integrations:
          {
            1: {
              accessLevel: 'monitor',
            },
            2: {
              accessLevel: 'manage',
            },
          },
      }, [
        {
          _registeredConnectionIds: ['111', '222'],
          _id: '1',
        },
        {
          _registeredConnectionIds: ['333', '444', '111'],
          _id: '2',
        },
        {
          _registeredConnectionIds: ['555'],
          _id: '3',
        },
      ], '111')).toEqual('manage');
    });

    test('should return undefined if no tile is registered or accessible', () => {
      expect(getUserAccessLevelOnConnection({
        accessLevel: 'tile',
        integrations:
          {
            1: {
              accessLevel: 'monitor',
            },
            2: {
              accessLevel: 'manage',
            },
          },
      }, [
        {
          _registeredConnectionIds: ['111', '222'],
          _id: '1',
        },
        {
          _registeredConnectionIds: ['333', '444', '111'],
          _id: '2',
        },
        {
          _registeredConnectionIds: ['555'],
          _id: '3',
        },
      ], '666')).toEqual(undefined);

      expect(getUserAccessLevelOnConnection({
        accessLevel: 'tile',
        integrations:
          {
            1: {
              accessLevel: 'monitor',
            },
            2: {
              accessLevel: 'manage',
            },
          },
      }, [
        {
          _registeredConnectionIds: ['111', '222'],
          _id: '1',
        },
        {
          _registeredConnectionIds: ['333', '444', '111'],
          _id: '2',
        },
        {
          _registeredConnectionIds: ['555'],
          _id: '3',
        },
      ], '555')).toEqual(undefined);
    });
  });
});

