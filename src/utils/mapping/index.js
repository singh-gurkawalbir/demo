import deepClone from 'lodash/cloneDeep';
import { adaptorTypeMap } from '../resource';
import mappingUtil from '.';
import netsuiteMappingUtil from './application/netsuite';
import getJSONPaths from '../jsonPaths';
import { isJsonString } from '../../utils/string';
import connectors from '../../constants/applications';

const isCsvOrXlsxResource = resource => {
  const { adaptorType: resourceAdapterType, file } = resource;
  const resourceFileType = file && file.type;

  if (
    (adaptorTypeMap[resourceAdapterType] === adaptorTypeMap.FTPImport ||
      adaptorTypeMap[resourceAdapterType] === adaptorTypeMap.S3Import) &&
    (resourceFileType === 'xlsx' || resourceFileType === 'csv')
  )
    return true;

  return false;
};

const handlebarRegex = /(\{\{[\s]*.*?[\s]*\}\})/i;

export const LookupResponseMappingExtracts = [
  'data',
  'errors',
  'ignored',
  'statusCode',
];
export const ImportResponseMappingExtracts = [
  'id',
  'errors',
  'ignored',
  'statusCode',
];

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

    if (lookup && lookup.useDefaultOnMultipleMatches) {
      return 'useDefaultOnMultipleMatches';
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
    } else if (value.extract) {
      return `{{${value.extract}}}`;
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
  getGenerateLabelForMapping: (application, resource = {}) => {
    if (resource.assistant) {
      const assistant = connectors.find(
        connector => connector.id === resource.assistant
      );

      if (assistant) return `${assistant.name} Field`;
    }

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
  getMappingFromResource: (
    resourceObj,
    appType,
    getRawMappings,
    isGroupedSampleData,
    options = {}
  ) => {
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

    if (options.isCategoryMapping) {
      ({ mappings } = options);
    }

    // creating deep copy of mapping object to avoid alteration to resource mapping object
    const mappingCopy = deepClone(mappings);

    if (!mappingCopy.fields) {
      mappingCopy.fields = [];
    }

    if (!mappingCopy.lists) {
      mappingCopy.lists = [];
    }

    if (getRawMappings) return mappingCopy;

    return mappingUtil.getMappingsForApp({
      mappings: mappingCopy,
      appType,
      isGroupedSampleData,
      resource: resourceObj,
      options,
    });
  },
  getMappingsForApp: ({
    mappings,
    appType,
    resource,
    isGroupedSampleData,
    options = {},
  }) => {
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
        return netsuiteMappingUtil.getFieldsAndListMappings({
          mappings: _mappings,
        });
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
        return mappingUtil.getFieldsAndListMappings({
          mappings: _mappings,
          isGroupedSampleData,
          useFirstRowSupported: true,
          resource,
          appType,
        });
      case adaptorTypeMap.SalesforceImport:
        return mappingUtil.getFieldsAndListMappings({
          mappings: _mappings,
          useFirstRowSupported: false,
          resource,
          appType,
        });
      default:
    }
  },
  generateMappingsForApp: ({
    mappings,
    generateFields,
    recordType,
    appType,
    isGroupedSampleData,
    resource,
  }) => {
    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return netsuiteMappingUtil.generateMappingFieldsAndList({
          mappings,
          generateFields,
          recordType,
        });
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
        return mappingUtil.generateMappingFieldsAndList({
          mappings,
          isGroupedSampleData,
          useFirstRowSupported: true,
          resource,
        });
      case adaptorTypeMap.SalesforceImport:
        return mappingUtil.generateMappingFieldsAndList({
          mappings,
          isGroupedSampleData,
          useFirstRowSupported: false,
          resource,
        });

      default:
    }
  },
  getFieldsAndListMappings: ({
    mappings = {},
    isGroupedSampleData,
    useFirstRowSupported = false,
    resource = {},
  }) => {
    let tempFm;
    const toReturn = [];

    mappings.fields &&
      mappings.fields.forEach(fm => {
        const _fm = { ...fm };

        if (isGroupedSampleData && isCsvOrXlsxResource(resource))
          _fm.useFirstRow = true;
        toReturn.push(_fm);
      });
    mappings.lists &&
      mappings.lists.forEach(lm => {
        lm.fields.forEach(fm => {
          tempFm = { ...fm };
          tempFm.generate = lm.generate
            ? [lm.generate, tempFm.generate].join('[*].')
            : tempFm.generate;

          if (useFirstRowSupported && isGroupedSampleData) {
            if (tempFm.extract && tempFm.extract.indexOf('*.') === 0) {
              tempFm.extract = tempFm.extract.substr('*.'.length);
            } else {
              tempFm.useFirstRow = true;
            }

            if (isCsvOrXlsxResource(resource)) {
              tempFm.generate = fm.generate;
            }
          }

          toReturn.push(tempFm);
        });
      });

    return toReturn;
  },
  generateMappingFieldsAndList: ({
    mappings = {},
    isGroupedSampleData,
    useFirstRowSupported = false,
    resource = {},
  }) => {
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
        }

        if (
          useFirstRowSupported &&
          isGroupedSampleData &&
          !mapping.useFirstRow &&
          mapping.extract &&
          mapping.extract.indexOf('[*].') === -1 &&
          !handlebarRegex.test(mapping.extract)
        ) {
          mapping.extract = `*.${mapping.extract}`;
        }

        delete mapping.useFirstRow;

        // if (existingListsData[generateListPath]) {
        //   list.jsonPath = existingListsData[generateListPath].jsonPath;
        // }
      } else if (isCsvOrXlsxResource(resource) && isGroupedSampleData) {
        if (
          !mapping.useFirstRow &&
          mapping.extract &&
          mapping.extract.indexOf('[*].') === -1 &&
          !handlebarRegex.test(mapping.extract)
        ) {
          mapping.extract = `*.${mapping.extract}`;
        }

        if (!mapping.useFirstRow) {
          const listWithEmptyGenerate = lists.find(l => l.generate === '');

          if (!listWithEmptyGenerate) {
            list = {
              generate: '',
              fields: [],
            };
            lists.push(list);
          } else {
            list = listWithEmptyGenerate;
          }
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
  getFormattedGenerateData: (sampleData, application) => {
    let formattedGenerateFields = [];

    if (sampleData) {
      if (application === adaptorTypeMap.SalesforceImport) {
        formattedGenerateFields = sampleData.map(d => ({
          id: d.value,
          name: d.label,
          type: d.type,
          options: d.picklistValues,
          childSObject: d.childSObject,
          relationshipName: d.relationshipName,
        }));
      } else if (application === adaptorTypeMap.NetSuiteDistributedImport) {
        formattedGenerateFields = sampleData.map(d => ({
          id: d.value,
          name: d.label,
          type: d.type,
          sublist: d.sublist,
        }));
      } else {
        let formattedSampleData = [];

        if (typeof sampleData === 'string' && isJsonString(sampleData)) {
          formattedSampleData = getJSONPaths(JSON.parse(sampleData));
        } else if (typeof sampleData === 'object') {
          formattedSampleData = Array.isArray(sampleData)
            ? sampleData
            : getJSONPaths(sampleData);
        }

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

    connectorMappingMetadata &&
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
        meta.nonEditableGenerateFields &&
          Array.isArray(meta.nonEditableGenerateFields) &&
          meta.nonEditableGenerateFields.forEach(fieldId => {
            const field = mappingContainer.fields.find(
              field => field.generate === fieldId
            );

            if (field) field.isNotEditable = true;
          });
      });

    return mappings;
  },

  validateMappings: (mappings, lookups) => {
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

    const mappingsWithoutExtract = mappings.filter(mapping => {
      if (!('hardCodedValue' in mapping || mapping.extract)) return true;

      return false;
    });
    const missingGenerates = [];

    mappingsWithoutExtract.forEach(mapping => {
      if (mapping.lookupName) {
        const lookup = lookups.find(l => l.name === mapping.lookupName);

        // check if mapping has dynamic lookup
        if (!lookup || lookup.map) {
          missingGenerates.push(mapping);
        }
      } else {
        missingGenerates.push(mapping);
      }
    });
    const missingGeneratesNames = missingGenerates.map(
      mapping => mapping.generate
    );

    if (missingGeneratesNames.length) {
      return {
        isSuccess: false,
        errMessage: `Extract Fields missing for field(s): ${missingGeneratesNames.join(
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
