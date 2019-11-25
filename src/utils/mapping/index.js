import { adaptorTypeMap } from '../resource';
import mappingUtil from '.';
import NetsuiteMapping from './application/netsuite';
import getJSONPaths from '../jsonPaths';

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
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.SalesforceImport:
      case adaptorTypeMap.HTTPImport:
        return '/mapping';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.RDBMSImport:
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
      case adaptorTypeMap.HTTPImport:
        return 'Http Field';
      case adaptorTypeMap.WrapperImport:
        return 'Wrapper Field';
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.RDBMSImport:
      default:
    }
  },
  getMappingFromResource: (resourceObj, appType, getRawMappings, options) => {
    if (!resourceObj) {
      return;
    }

    /* TODO: With support for different application being adding up, 
      path for mapping to be updated below */
    let mappings = {};

    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        mappings =
          (resourceObj.netsuite_da && resourceObj.netsuite_da.mapping) || {};
        break;
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.SalesforceImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.S3Import:
        mappings = resourceObj.mapping || {};
        break;
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.RDBMSImport:
      default:
    }

    if (!mappings.fields) {
      mappings.fields = [];
    }

    if (!mappings.lists) {
      mappings.lists = [];
    }

    if (getRawMappings) return mappings;

    return mappingUtil.getMappingsForApp({
      mappings,
      appType,
      options,
    });
  },
  getMappingsForApp: ({ mappings, appType, options = {} }) => {
    let _mappings = mappings;

    if (options.integrationApp) {
      const { mappingMetadata, connectorExternalId } = options.integrationApp;

      _mappings = mappingUtil.generateFieldAndListMappingsforIA(
        mappings,
        mappingMetadata,
        connectorExternalId
      );
    }

    if (options.assistant) {
      const { requiredMappings } = options.assistant;

      _mappings = mappingUtil.generateFieldAndListMappingsforAssistant(
        mappings,
        requiredMappings
      );
    }

    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return NetsuiteMapping.getFieldsAndListMappings({
          mappings: _mappings,
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
      case adaptorTypeMap.SalesforceImport:
        return mappingUtil.getFieldsAndListMappings({ mappings: _mappings });
      default:
    }
  },
  generateMappingsForApp: ({
    mappings,
    generateFields,
    recordType,
    appType,
  }) => {
    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return NetsuiteMapping.generateMappingFieldsAndList({
          mappings,
          generateFields,
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
      case adaptorTypeMap.SalesforceImport:
      case adaptorTypeMap.RDBMSImport:
        return mappingUtil.generateMappingFieldsAndList({ mappings });

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
  getResponseMappingDefaultExtracts: resourceType => {
    const extractFields =
      resourceType === 'imports'
        ? ImportResponseMappingExtracts
        : LookupResponseMappingExtracts;

    return extractFields.map(m => ({
      id: m,
      name: m,
    }));
  },
  getFormattedGenerateData: (sampleData, application, { resource }) => {
    let formattedGenerateFields = [];

    if (sampleData) {
      if (application === adaptorTypeMap.SalesforceImport) {
        formattedGenerateFields = sampleData.map(d => ({
          id: d.value,
          name: d.label,
          type: d.type,
          options: d.picklistValues,
        }));
      } else if (application === adaptorTypeMap.NetSuiteDistributedImport) {
        formattedGenerateFields = sampleData.map(d => ({
          id: d.value,
          name: d.label,
          type: d.type,
        }));
      } else if (
        application === adaptorTypeMap.FTPImport ||
        resource.assistant
      ) {
        const formattedSampleData =
          sampleData &&
          (Array.isArray(sampleData) ? sampleData : getJSONPaths(sampleData));

        formattedGenerateFields =
          formattedSampleData &&
          formattedSampleData.map(sd => ({ ...sd, name: sd.id }));
      }
    }

    return formattedGenerateFields;
  },
  generateFieldAndListMappingsforAssistant: (mappings, requiredMappings) => {
    if (requiredMappings && Array.isArray(requiredMappings)) {
      requiredMappings.forEach(f => {
        let fld = f;
        let fldContainer;

        if (fld.indexOf('[*].') > 0) {
          fldContainer =
            mappings.lists &&
            mappings.lists.find(l => l.generate === fld.split('[*].')[0]);

          if (!fldContainer) {
            fldContainer = {
              fields: [],
              generate: fld.split('[*].')[0],
            };
            mappings.lists.push(fldContainer);
          }

          // eslint-disable-next-line prefer-destructuring
          fld = fld.split('[*].')[1];
        } else {
          fldContainer = mappings;
        }

        let field =
          fldContainer &&
          fldContainer.fields &&
          fldContainer.fields.find(l => l.generate === fld);

        if (!field) {
          field = {
            extract: '',
            generate: fld,
          };
          fldContainer.fields.push(field);
        }

        field.isRequired = true;
      });
    }

    return mappings;
  },
  generateFieldAndListMappingsforIA: (
    mappings,
    mappingMetadata,
    connectorExternalId
  ) => {
    const connectorMappingMetadata = mappingMetadata[connectorExternalId];

    connectorMappingMetadata.forEach(meta => {
      let mappingContainer;

      if (meta.generateList) {
        mappingContainer =
          mappings.lists &&
          mappings.lists.find(list => list.generate === meta.generateList);
      } else {
        mappingContainer = mappings;
      }

      meta.requiredGenerateFields.forEach(fieldId => {
        const field = mappingContainer.fields.find(
          field => field.generate === fieldId
        );

        if (field) field.isRequired = true;
      });
      meta.nonEditableGenerateFields.forEach(fieldId => {
        const field = mappingContainer.fields.find(
          field => field.generate === fieldId
        );

        if (field) field.isNotEditable = true;
      });
    });

    return mappings;
  },

  validateMappings: mappings => {
    const duplicateMappings = mappings
      .map(e => e.generate)
      .map((e, i, final) => final.indexOf(e) !== i && i)
      .filter(obj => mappings[obj])
      .map(e => mappings[e].generate);

    if (duplicateMappings.length) {
      return {
        isSuccess: false,
        errMessage: `You have duplicate mappings for the field(s): ${duplicateMappings.join(
          ','
        )}`,
      };
    }

    const mappingsWithoutExtract = mappings
      .filter(mapping => {
        if (!('hardCodedValue' in mapping || mapping.extract)) return true;

        return false;
      })
      .map(mapping => mapping.generate);

    if (mappingsWithoutExtract.length) {
      return {
        isSuccess: false,
        errMessage: `Extract Fields missing for field(s): ${mappingsWithoutExtract.join(
          ','
        )}`,
      };
    }

    const mappingsWithoutGenerate = mappings.filter(mapping => {
      if (!mapping.generate) return true;

      return false;
    });

    if (mappingsWithoutGenerate.length) {
      return {
        isSuccess: false,
        errMessage: 'Generate Fields missing for mapping(s)',
      };
    }

    return { isSuccess: true };
  },
};
