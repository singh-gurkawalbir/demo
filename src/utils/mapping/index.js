import { adaptorTypeMap } from '../resource';
import generateList from './sampleGenerateData';
import salesforceGenerateList from './sampleSFGenerateData';
import MappingUtil from '.';
import NetsuiteMapping from './application/netsuite';

const LookupResponseMappingExtracts = [
  'data',
  'errors',
  'ignored',
  'statusCode',
];
const ImportResponseMappingExtracts = ['id', 'errors', 'ignored', 'statusCode'];

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
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.FTPImport:
        return '/mapping';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
      case adaptorTypeMap.SalesforceImport:
      default:
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
      case adaptorTypeMap.AS2Import:
        return 'AS2 Field';
      case adaptorTypeMap.S3Import:
        return 'Import Field (Amazon S3)';
      case adaptorTypeMap.SalesforceImport:
        return 'Salesforce Field';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
      default:
    }
  },
  getMappingFromResource: (resourceObj, appType) => {
    if (!resourceObj) {
      return;
    }

    /* TODO: With support for different application being adding up, 
      path for mapping to be updated below */
    let mappings = {};

    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        mappings = resourceObj.netsuite_da && resourceObj.netsuite_da.mapping;
        break;
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.SalesforceImport:
      case adaptorTypeMap.S3Import:
        mappings = resourceObj.mapping;
        break;
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
      default:
    }

    return MappingUtil.getMappingsForApp({
      mappings,
      appType,
    });
  },
  getMappingsForApp: ({ mappings, appType }) => {
    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return NetsuiteMapping.getFieldsAndListMappings({ mappings });
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
      case adaptorTypeMap.SalesforceImport:
        return MappingUtil.getFieldsAndListMappings({ mappings });
      default:
    }
  },
  generateMappingsForApp: ({ mappings, generateList, recordType, appType }) => {
    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return NetsuiteMapping.generateMappingFieldsAndList({
          mappings,
          generateList,
          recordType,
        });
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
        return MappingUtil.generateMappingFieldsAndList({ mappings });
      case adaptorTypeMap.SalesforceImport:
      default:
    }
  },
  getFieldsAndListMappings: ({ mappings = {} }) => {
    let tempFm;
    const toReturn = [];

    mappings.fields &&
      mappings.fields.forEach(fm => {
        toReturn.push(fm);
      });
    mappings.lists &&
      mappings.lists.forEach(lm => {
        lm.fields.forEach(fm => {
          tempFm = { ...fm };
          tempFm.generate = [lm.generate, tempFm.generate].join('[*].');
          toReturn.push(tempFm);
        });
      });

    return toReturn;
  },
  generateMappingFieldsAndList: ({ mappings = {} }) => {
    let generateParts;
    const lists = [];
    const fields = [];
    let generateListPath;

    mappings.forEach(mappingTmp => {
      const mapping = { ...mappingTmp };

      if (!mapping.generate) {
        return true;
      }

      generateParts = mapping.generate ? mapping.generate.split('[*].') : null;
      let list;

      if (generateParts && generateParts.length > 1) {
        mapping.generate = generateParts.pop();
        generateListPath = generateParts.join('.');

        list = lists.find(l => l.generate === generateListPath);

        if (!list) {
          list = {
            generate: generateListPath,
            fields: [],
          };
          lists.push(list);

          // if (existingListsData[generateListPath]) {
          //   list.jsonPath = existingListsData[generateListPath].jsonPath;
          // }
        }
      }

      list ? list.fields.push(mapping) : fields.push(mapping);
    });
    const formattedMapping = {
      fields,
      lists,
    };

    return formattedMapping;
  },
  getSampleGenerateFields: () => generateList,
  getSFSampleGenerateFields: () => salesforceGenerateList,
  getResponseMappingDefaultExtracts: resourceType => {
    const extractList =
      resourceType === 'imports'
        ? ImportResponseMappingExtracts
        : LookupResponseMappingExtracts;

    return extractList.map(m => ({
      id: m,
      name: m,
    }));
  },
};
