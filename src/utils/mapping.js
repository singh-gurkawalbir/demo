import { adaptorTypeMap } from './resource';

export default {
  getDefaultDataType: value => {
    if (
      value.extractDateFormat ||
      value.extractDateTimezone ||
      value.generateDateFormat ||
      value.generateDateTimezone
    ) {
      return 'date';
    }

    return value.dataType;
  },

  getFieldMappingType: value => {
    if (value.lookupName) {
      return 'lookup';
    } else if ('hardCodedValue' in value) {
      return 'hardCoded';
    } else if (value.extract && value.extract.indexOf('{{') !== -1) {
      return 'multifield';
    }

    return 'standard';
  },

  getHardCodedActionValue: value => {
    if ('hardCodedValue' in value) {
      switch (value.hardCodedValue) {
        case '':
          return 'useEmptyString';
        case null:
          return 'useNull';
        default:
          return 'default';
      }
    }
  },
  getDefaultLookupActionValue: (value, lookup) => {
    if (value && value.lookupName && lookup && !lookup.allowFailures) {
      return 'disallowFailure';
    }

    if ('default' in lookup) {
      switch (lookup.default) {
        case '':
          return 'useEmptyString';
        case null:
          return 'useNull';
        default:
          return 'default';
      }
    }
  },
  getDefaultActionValue: value => {
    if ('default' in value) {
      switch (value.default) {
        case '':
          return 'useEmptyString';
        case null:
          return 'useNull';
        default:
          return 'default';
      }
    }
  },
  getDefaultExpression: value => {
    if (value.extract && value.extract.indexOf('{{') !== -1) {
      return value.extract;
    }
  },
  getMappingPath: application => {
    switch (application) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return '/netsuite_da/mapping';
      default:
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.FTPImport:
        return '/mapping';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.RDBMSImport:
      case adaptorTypeMap.SalesforceImport:
    }
  },
  getGenerateLabelForMapping: application => {
    switch (application) {
      case adaptorTypeMap.RESTImport:
        return 'REST API Field';
      case adaptorTypeMap.NetSuiteDistributedImport:
        return 'NetSuite Field';
      case adaptorTypeMap.FTPImport:
        return 'FTP Field';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.RDBMSImport:
      case adaptorTypeMap.SalesforceImport:
      default:
    }
  },
  getMappingFromResource: (resourceObj, appType) => {
    if (!resourceObj) {
      return;
    }

    /* TODO: With support for different application being adding up, 
      path for mapping to be updated below */
    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return resourceObj.netsuite_da && resourceObj.netsuite_da.mapping;
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.FTPImport:
        return resourceObj.mapping;
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.RDBMSImport:
      case adaptorTypeMap.SalesforceImport:
      default:
    }
  },
};
