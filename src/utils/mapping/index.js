import deepClone from 'lodash/cloneDeep';
import { uniqBy } from 'lodash';
import { adaptorTypeMap } from '../resource';
import mappingUtil from '.';
import netsuiteMappingUtil from './application/netsuite';
import getJSONPaths, {
  getJSONPathArrayWithSpecialCharactersWrapped,
  pickFirstObject,
} from '../jsonPaths';
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
const checkExtractPathFoundInSampledata = (str, sampleData, wrapped) => {
  if (wrapped) {
    return (
      getJSONPathArrayWithSpecialCharactersWrapped(
        sampleData,
        null,
        true
      ).indexOf(str) > -1
    );
  }

  return (
    getJSONPathArrayWithSpecialCharactersWrapped(sampleData).indexOf(str) > -1
  );
};

/**
 * parentMapping = resource mapping object
 * returns subRecordMapping object
 *
 * this function takes resource mapping object and searches for subrecord.
 * subRecordMappingId could be either of format 'item[*].abc' or 'abc'.
 * Former specifies subrecord in 'mapping.lists' with generate 'abc'.
 * And later means subrecord in 'mapping.fields' with generate 'abc'
 */
const getSubRecordMapping = (parentMapping, subRecordMappingId) => {
  const { fields = [], lists = [] } = parentMapping || {};

  if (subRecordMappingId.indexOf('[*].') > 0) {
    const listName = subRecordMappingId.split('[*].')[0];
    const subListGenerateName = subRecordMappingId.split('[*].')[1];
    const list = lists.find(l => l.generate === listName);

    if (list) {
      const subList = list.fields.find(l => l.generate === subListGenerateName);

      return subList.subRecordMapping;
    }
  } else {
    const field = fields.find(l => l.generate === subRecordMappingId);

    return field.subRecordMapping;
  }
};

export function unwrapTextForSpecialChars(extract, flowSampleData) {
  let modifiedExtract = extract;

  if (!/\W/g.test(extract)) {
    // if it does not contain a non-word character
    return modifiedExtract;
  }

  if (!flowSampleData && /^\[.*\]$/.test(extract)) {
    // if extract starts with [ and ends with ]
    // find all ']' in the extract and replace it with '\]' excluding first '[' and last ']'
    return extract.replace(/^(\[)(.*)(\])$/, '$2').replace(/\\\]/g, ']');
  }

  if (
    flowSampleData &&
    checkExtractPathFoundInSampledata(extract, flowSampleData, true)
  ) {
    const index = getJSONPathArrayWithSpecialCharactersWrapped(
      flowSampleData,
      null,
      true
    ).indexOf(extract);

    modifiedExtract = getJSONPathArrayWithSpecialCharactersWrapped(
      flowSampleData
    )[index];
  } else if (!/\.|(\[\*\])/.test(extract)) {
    /**
     This extract is not found in sampledata. So UI doesnt know what a dot or sublist character represent.
    * */
    // So wrap the extract only if it doesnt have a dot or sublist character in it
    if (
      !(
        /^\[.*\]$/.test(extract) &&
        /\W/.test(extract.replace(/^\[|]$/g, '')) &&
        !/\./.test(extract.replace(/^\[|]$/g, ''))
      )
    ) {
      // if not already wrapped
      modifiedExtract = `[${extract.replace(/\]/g, '\\]')}]`;
    }
  }

  return modifiedExtract;
}

export function wrapTextForSpecialChars(extract, flowSampleData) {
  let modifiedExtract = extract;

  if (!/\W/g.test(extract) || handlebarRegex.test(extract)) {
    return modifiedExtract;
  }

  if (
    !flowSampleData &&
    extract.indexOf('[*].') === -1 &&
    extract.indexOf('.') === -1
  ) {
    return `[${extract.replace(/\]/g, '\\]')}]`;
  }

  if (
    flowSampleData &&
    checkExtractPathFoundInSampledata(extract, flowSampleData)
  ) {
    const index = getJSONPathArrayWithSpecialCharactersWrapped(
      flowSampleData
    ).indexOf(extract);

    modifiedExtract = getJSONPathArrayWithSpecialCharactersWrapped(
      flowSampleData,
      null,
      true
    )[index];
  } else if (!/\.|(\[\*\])/.test(extract)) {
    /**
     This extract is not found in sampledata. So UI doesnt know what a dot or sublist character represent.
    * */

    // So wrap the extract only if it doesnt have a dot or sublist character in it
    if (
      !(
        /^\[.*\]$/.test(extract) &&
        /\W/.test(extract.replace(/^\[|]$/g, '')) &&
        !/\./.test(extract.replace(/^\[|]$/g, ''))
      )
    ) {
      // if not already wrapped
      modifiedExtract = `[${extract.replace(/\]/g, '\\]')}]`;
    }
  }

  return modifiedExtract;
}

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
      case adaptorTypeMap.DynamodbImport:
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
      case adaptorTypeMap.DynamodbImport:
      case adaptorTypeMap.RDBMSImport:
      default:
    }
  },
  getSubRecordRecordTypeAndJsonPath: (resourceObj, subRecordMappingId) => {
    const rawMapping = mappingUtil.getMappingFromResource(resourceObj, true);
    const subRecordMappingObj = getSubRecordMapping(
      rawMapping,
      subRecordMappingId
    );
    const { recordType, jsonPath } = subRecordMappingObj || {};

    return {
      recordType,
      jsonPath,
    };
  },
  generateSubrecordMappingAndLookup: (
    resourceObj,
    subRecordMappingId,
    isGroupedSampleData,
    netsuiteRecordType,
    options = {}
  ) => {
    const rawMapping = mappingUtil.getMappingFromResource(resourceObj, true);
    const subRecordMappingObj = getSubRecordMapping(
      rawMapping,
      subRecordMappingId
    );
    const { lookups, mapping: subRecordMapping } = subRecordMappingObj || {};
    const formattedMappings = mappingUtil.getMappingsForApp({
      mappings: subRecordMapping,
      isGroupedSampleData,
      resource: resourceObj,
      netsuiteRecordType,
      options,
    });

    return {
      mappings: formattedMappings,
      lookups,
    };
  },
  /**
   * takes modified subrecord and lookup as input and adds them to original mapping and returns resource mapping object for patching
   */
  appendModifiedSubRecordToMapping: ({
    resource,
    subRecordMappingId,
    subRecordMapping,
    subRecordLookups,
  }) => {
    const mapping = mappingUtil.getMappingFromResource(resource, true);
    const subRecordParent = getSubRecordMapping(mapping, subRecordMappingId);

    subRecordParent.mapping = subRecordMapping;
    subRecordParent.lookups = subRecordLookups;

    return mapping;
  },
  getMappingFromResource: (
    resourceObj,
    getRawMappings,
    isGroupedSampleData,
    netsuiteRecordType,
    options = {}
  ) => {
    if (!resourceObj) {
      return;
    }

    /* TODO: With support for different application being adding up, 
      path for mapping to be updated below */
    let mappings = {};
    const { adaptorType } = resourceObj;

    switch (adaptorTypeMap[adaptorType]) {
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
      case adaptorTypeMap.DynamodbImport:
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
      isGroupedSampleData,
      resource: resourceObj,
      netsuiteRecordType,
      options,
    });
  },
  getMappingsForApp: ({
    mappings,
    resource = {},
    isGroupedSampleData,
    netsuiteRecordType,
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

    const { adaptorType } = resource;

    switch (adaptorTypeMap[adaptorType]) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return netsuiteMappingUtil.getFieldsAndListMappings({
          mappings: _mappings,
          recordType: netsuiteRecordType,
          isGroupedSampleData,
        });
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.DynamodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
        return mappingUtil.getFieldsAndListMappings({
          mappings: _mappings,
          isGroupedSampleData,
          useFirstRowSupported: true,
          resource,
        });
      case adaptorTypeMap.SalesforceImport:
        return mappingUtil.getFieldsAndListMappings({
          mappings: _mappings,
          useFirstRowSupported: false,
          resource,
        });
      default:
    }
  },
  generateMappingsForApp: ({
    mappings,
    generateFields,
    appType,
    isGroupedSampleData,
    resource,
    flowSampleData,
    netsuiteRecordType,
  }) => {
    switch (appType) {
      case adaptorTypeMap.NetSuiteDistributedImport:
        return netsuiteMappingUtil.generateMappingFieldsAndList({
          mappings,
          isGroupedSampleData,
          generateFields,
          flowSampleData,
          recordType: netsuiteRecordType,
        });
      case adaptorTypeMap.FTPImport:
      case adaptorTypeMap.HTTPImport:
      case adaptorTypeMap.RESTImport:
      case adaptorTypeMap.AS2Import:
      case adaptorTypeMap.S3Import:
      case adaptorTypeMap.XMLImport:
      case adaptorTypeMap.MongodbImport:
      case adaptorTypeMap.DynamodbImport:
      case adaptorTypeMap.WrapperImport:
      case adaptorTypeMap.RDBMSImport:
        return mappingUtil.generateMappingFieldsAndList({
          mappings,
          isGroupedSampleData,
          useFirstRowSupported: true,
          resource,
          flowSampleData,
        });
      case adaptorTypeMap.SalesforceImport:
        return mappingUtil.generateMappingFieldsAndList({
          mappings,
          isGroupedSampleData,
          useFirstRowSupported: false,
          resource,
          flowSampleData,
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
        _fm.extract = unwrapTextForSpecialChars(_fm.extract);
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

          tempFm.extract = unwrapTextForSpecialChars(tempFm.extract);
          toReturn.push(tempFm);
        });
      });
    // removing duplicate items if present
    const _toReturn = uniqBy(toReturn, item => item.generate);

    return _toReturn;
  },
  generateMappingFieldsAndList: ({
    mappings = [],
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

      if (
        mapping.extract &&
        mapping.extract.indexOf('*.') === 0 &&
        useFirstRowSupported &&
        !mapping.useFirstRow
      ) {
        mapping.extract = `*.${wrapTextForSpecialChars(
          mapping.extract.slice(2)
        )}`;
      } else {
        mapping.extract = wrapTextForSpecialChars(mapping.extract);
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
      .filter(e => !!e.generate)
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

    const mappingsWithoutGenerates = mappings.filter(mapping => {
      if (!mapping.generate) return true;

      return false;
    });

    if (mappingsWithoutGenerates.length)
      return {
        isSuccess: false,
        errMessage: `One or more generate fields missing`,
      };
    const mappingsWithoutExtract = mappings.filter(mapping => {
      if (!('hardCodedValue' in mapping || mapping.extract)) return true;

      return false;
    });
    const generatesWithoutExtract = [];

    mappingsWithoutExtract.forEach(mapping => {
      if (mapping.lookupName) {
        const lookup = lookups.find(l => l.name === mapping.lookupName);

        // check if mapping has dynamic lookup
        if (!lookup || lookup.map) {
          generatesWithoutExtract.push(mapping);
        }
      } else {
        generatesWithoutExtract.push(mapping);
      }
    });
    const missingExtractGenerateNames = generatesWithoutExtract.map(
      mapping => mapping.generate
    );

    if (missingExtractGenerateNames.length) {
      return {
        isSuccess: false,
        errMessage: `Extract Fields missing for field(s): ${missingExtractGenerateNames.join(
          ','
        )}`,
      };
    }

    return { isSuccess: true };
  },
  getExtractPaths: (fields, options = {}) => {
    const { jsonPath } = options;
    let extractPaths = getJSONPaths(pickFirstObject(fields));

    if (jsonPath)
      extractPaths = extractPaths
        .filter(f => f.id && f.id.indexOf(`${jsonPath}[*].`) === 0)
        .map(f => ({
          ...f,
          id: f.id.replace(`${jsonPath}[*].`, ''),
        }));

    return extractPaths;
  },
  isCsvOrXlsxResource,
};
