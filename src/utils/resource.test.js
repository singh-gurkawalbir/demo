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
  getNetSuiteSubrecordLabel,
  getNetSuiteSubrecordImportsFromMappings,
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

    test('should return correct urls for staging integrator', () => {
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

    test('should return false for valid resource and filedefinition id', () => {
      expect(isFileDefinitionIdUsedInResource({
        file: {
          fileDefinition: {
            _fileDefinitionId: '1234',
          },
        },
      }, '12345')).toEqual(false);
    });

    test('should return false for valid resource and filedefinition id 2', () => {
      expect(isFileDefinitionIdUsedInResource({
        file: {
          fileDefinition: {
            _fileDefinitionId: '12345',
          },
        },
      }, '1234')).toEqual(false);
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
        blobKeyPath: 'key',
        adaptorType: 'SalesforceImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        blobKeyPath: 'key',
        adaptorType: 'NetSuiteImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        blobKeyPath: 'key',
        adaptorType: 'HTTPImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        blobKeyPath: 'key',
        adaptorType: 'RESTImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        adaptorType: 'FTPImport',
      })).toEqual('importTransfer');

      expect(resourceCategory({
        blobKeyPath: 'key',
        adaptorType: 'S3Import',
      })).toEqual('importTransfer');
    });
  });

  describe('tests for util isBlobTypeResource', () => {
    test('should return false for undefined resource', () => {
      expect(isBlobTypeResource()).toEqual(false);
    });

    test('should return true for blob exports', () => {
      expect(isBlobTypeResource({
        type: 'blob',
      })).toEqual(true);
    });

    test('should return true for blob imports', () => {
      expect(isBlobTypeResource({
        blobKeyPath: 'key',
      })).toEqual(true);
    });

    test('should return false for blob imports', () => {
      expect(isBlobTypeResource({
        type: 'distributed',
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

      expect(getNetSuiteSubrecordImportsFromMappings(mapping)).toEqual(
        [
          {
            fieldId: 'celigo_inventorydetail',
            jsonPath: '$',
            name: 'Inventory Details',
            recordType: 'inventorydetail',
          },
        ]
      );
    });
  });
});

