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

const setMappingData = (
  flowId,
  recordMappings,
  mappings,
  deleted = [],
  isParentDeleted
) => {
  recordMappings.forEach(mapping => {
    const key = `${flowId}-${mapping.id}`;
    const mappingDeleted = deleted.includes(mapping.id) || isParentDeleted;

    if (mappingDeleted) {
      // eslint-disable-next-line no-param-reassign
      mapping.delete = true;
    }

    if (mappings[key]) {
      // eslint-disable-next-line no-param-reassign
      mapping.fieldMappings = mappings[key].mappings
        .filter(el => (!!el.extract || !!el.hardCodedValue) && !!el.generate)
        .map(
          ({ index, rowIdentifier, hardCodedValueTmp, visible, ...rest }) => ({
            ...rest,
          })
        );

      if (mappings[key].lookups && mappings[key].lookups.length) {
        // eslint-disable-next-line no-param-reassign
        mapping.lookups = mappings[key].lookups;
      }
    }

    if (mapping.children && mapping.children.length) {
      setMappingData(
        flowId,
        mapping.children,
        mappings,
        deleted,
        mappingDeleted
      );
    }
  });
};

const setVariationMappingData = (
  flowId,
  recordMappings,
  mappings,
  relationshipData = []
) => {
  recordMappings.forEach(mapping => {
    const relation =
      relationshipData && relationshipData.find(rel => rel.id === mapping.id);

    if (!relation) return;
    const variationTheme =
      relation.variation_themes &&
      relation.variation_themes.find(theme => theme.id === 'variation_theme');

    if (variationTheme) {
      variationTheme.variation_attributes.forEach(vm => {
        const key = `${flowId}-${mapping.id}-${vm}`;

        if (mappings[key]) {
          const stagedMappings = mappings[key].staged || mappings[key].mappings;

          if (!mapping.variation_themes.find(vt => vt.variation_theme === vm)) {
            mapping.variation_themes.push({
              id: 'variation_theme',
              variation_theme: vm,
              fieldMappings: [],
            });
          }

          const variationMapping = mapping.variation_themes.find(
            vt => vt.variation_theme === vm
          );

          // eslint-disable-next-line no-param-reassign
          variationMapping.fieldMappings = stagedMappings
            .filter(
              el => (!!el.extract || !!el.hardCodedValue) && !!el.generate
            )
            .map(
              ({
                index,
                rowIdentifier,
                hardCodedValueTmp,
                visible,
                ...rest
              }) => ({
                ...rest,
              })
            );
        }
      });
    }

    if (relation.children && relation.children.length) {
      const mappingKeys = Object.keys(mappings);

      relation.children.forEach(child => {
        const childExists = mapping.children.find(c => c.id === child.id);

        if (!childExists) {
          const mappingFound = mappingKeys.some(key =>
            key.startsWith(`${flowId}-${child.id}`)
          );

          if (mappingFound) {
            mapping.children.push({
              id: child.id,
              children: [],
              variation_themes: [],
            });
          }
        }
      });

      setVariationMappingData(
        flowId,
        mapping.children,
        mappings,
        relationshipData
      );
    }
  });
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
      const { subRecordMapping } = subList;

      if (!subRecordMapping.mapping) {
        subRecordMapping.mapping = {
          fields: [],
          lists: [],
        };
      }

      return subRecordMapping;
    }
  } else {
    const field = fields.find(l => l.generate === subRecordMappingId);
    const { subRecordMapping } = field;

    if (!subRecordMapping.mapping) {
      subRecordMapping.mapping = {
        fields: [],
        lists: [],
      };
    }

    return subRecordMapping;
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
  /**
   * given two json objects, does a deep comparision of the objects
   * This function is written specific to compare category mapping metadata
   * this ignores complex properties such as Date, Functions, prototypes, constructors
   *
   * @param {object} object
   * @param {object} otherObject
   * examples:
   * isEqual({},{}) = true;
   * isEqual({a:'a', b:1},{a:'a', b:1}) = true
   * isEqual({a:'a', b:1},{b:1, a:'a'}) = true
   * isEqual({a:[1,2,3,4]},{a:[2,3,4,1]}) = false
   * _.isEqual doesnt handle this case
   * isEqual(
   *  { extract: undefined, hardCodedValue: 'test', generate: 'test_generate' },
      { hardCodedValue: 'test', generate: 'test_generate' })
       => true,
   */
  isEqual(object, otherObject) {
    if (object === otherObject) {
      return true;
    }

    if (
      object === null ||
      object === undefined ||
      otherObject === null ||
      otherObject === undefined ||
      (['string', 'number'].includes(typeof object) &&
        ['string', 'number'].includes(typeof otherObject))
    ) {
      return object === otherObject;
    }

    if (
      Object.prototype.toString(object) !==
      Object.prototype.toString(otherObject)
    ) {
      return false;
    }

    if (Array.isArray(object)) {
      if (object.length !== otherObject.length) return false;

      return !object.some((el, index) => !this.isEqual(el, otherObject[index]));
    }

    const objectKeys = Object.keys(object);

    return Object.keys(otherObject).every(
      key => objectKeys.includes(key) || otherObject[key] === undefined
    )
      ? objectKeys.every(key => this.isEqual(object[key], otherObject[key]))
      : false;
  },
  setCategoryMappingData: (
    flowId,
    sessionMappedData = {},
    mappings = {},
    deleted,
    relationshipData
  ) => {
    const { basicMappings = {}, variationMappings = {} } = sessionMappedData;

    setMappingData(
      flowId,
      basicMappings.recordMappings || [],
      mappings,
      deleted
    );
    setVariationMappingData(
      flowId,
      variationMappings.recordMappings || [],
      mappings,
      relationshipData
    );
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
  addVariationMap: (
    draft = {},
    categoryId,
    childCategoryId,
    variation,
    isVariationAttributes
  ) => {
    const { response = [] } = draft;
    const mappingData = response.find(sec => sec.operation === 'mappingData');

    if (
      mappingData &&
      mappingData.data &&
      mappingData.data.mappingData &&
      mappingData.data.mappingData.variationMappings &&
      mappingData.data.mappingData.variationMappings.recordMappings
    ) {
      const { recordMappings } = mappingData.data.mappingData.variationMappings;
      const category = recordMappings.find(
        mapping => mapping.id === categoryId
      );
      let variationMapping;
      let subCategory;

      if (category) {
        if (categoryId === childCategoryId) {
          if (!isVariationAttributes) {
            variationMapping = category.variation_themes.find(
              vm => vm.variation_theme === variation
            );

            if (!variationMapping) {
              category.variation_themes.push({
                id: 'variation_theme',
                variation_theme: variation,
                fieldMappings: [],
              });
            }
          }
        }

        subCategory = category.children.find(
          child => child.id === childCategoryId
        );

        if (!subCategory) {
          category.children.forEach(child => {
            subCategory = child.children.find(c => c.id === childCategoryId);
          });
        }

        if (subCategory) {
          if (!isVariationAttributes) {
            variationMapping = subCategory.variation_themes.find(
              vm => vm.variation_theme === variation
            );

            if (!variationMapping) {
              subCategory.variation_themes.push({
                id: 'variation_theme',
                variation_theme: variation,
                fieldMappings: [],
              });
            }
          }
        }
      }
    }
  },
  addCategory: (draft, integrationId, flowId, data) => {
    const cKey = `${flowId}-${integrationId}`;
    const { category, childCategory, grandchildCategory } = data;
    const { response = [] } = draft[cKey];
    const generatesMetaData = response.find(
      sec => sec.operation === 'generatesMetaData'
    );
    const categoryRelationshipData =
      generatesMetaData &&
      generatesMetaData.data &&
      generatesMetaData.data.categoryRelationshipData;
    const mappingData = response.find(sec => sec.operation === 'mappingData');
    let childCategoryDetails;
    let grandchildCategoryDetails;
    const categoryDetails = categoryRelationshipData.find(
      rel => rel.id === category
    );

    if (childCategory && categoryDetails.children) {
      childCategoryDetails = categoryDetails.children.find(
        child => child.id === childCategory
      );
    }

    if (
      childCategoryDetails &&
      grandchildCategory &&
      childCategoryDetails.children
    ) {
      grandchildCategoryDetails = childCategoryDetails.children.find(
        child => child.id === grandchildCategory
      );
    }

    if (
      mappingData.data &&
      mappingData.data.mappingData &&
      mappingData.data.mappingData.basicMappings &&
      mappingData.data.mappingData.basicMappings.recordMappings
    ) {
      const { recordMappings } = mappingData.data.mappingData.basicMappings;

      if (!recordMappings.find(mapping => mapping.id === category)) {
        recordMappings.push({
          id: category,
          name: categoryDetails.name,
          children: [],
          fieldMappings: [],
        });
      }

      if (!childCategory) {
        return;
      }

      const { children = [] } = recordMappings.find(
        mapping => mapping.id === category
      );

      if (!children.find(child => child.id === childCategory)) {
        children.push({
          id: childCategory,
          name: childCategoryDetails.name,
          children: [],
          fieldMappings: [],
        });
      }

      if (!grandchildCategory) {
        return;
      }

      const grandChildren =
        children.find(child => child.id === childCategory).children || [];

      if (!grandChildren.find(child => child.id === grandchildCategory)) {
        grandChildren.push({
          id: grandchildCategory,
          name: grandchildCategoryDetails.name,
          children: [],
          fieldMappings: [],
        });
      }
    }
  },
  addVariation: (draft, cKey, data) => {
    const { categoryId, subCategoryId, isVariationAttributes } = data;
    const { response = [] } = draft[cKey];
    const mappingData = response.find(sec => sec.operation === 'mappingData');
    let categoryMappings;

    if (
      mappingData.data &&
      mappingData.data.mappingData &&
      mappingData.data.mappingData.variationMappings &&
      mappingData.data.mappingData.variationMappings.recordMappings
    ) {
      const { recordMappings } = mappingData.data.mappingData.variationMappings;

      categoryMappings = recordMappings.find(
        mapping => mapping.id === categoryId
      );

      if (!categoryMappings) {
        recordMappings.push({
          id: categoryId,
          children: [],
          [isVariationAttributes ? 'fieldMappings' : 'variation_themes']: [],
        });
        categoryMappings = recordMappings.find(
          mapping => mapping.id === categoryId
        );
      }

      if (!subCategoryId) {
        return;
      }

      const subCategoryMappings = categoryMappings.children.find(
        mapping => mapping.id === subCategoryId
      );

      if (!subCategoryMappings) {
        categoryMappings.children.push({
          id: subCategoryId,
          children: [],
          [isVariationAttributes ? 'fieldMappings' : 'variation_themes']: [],
        });
      }
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
  getApplicationName: (resource = {}, conn) => {
    if (resource.assistant) {
      const assistant = connectors.find(
        connector => connector.id === resource.assistant
      );

      if (assistant) return assistant.name;
    }

    const { adaptorType } = resource;

    switch (adaptorTypeMap[adaptorType]) {
      case adaptorTypeMap.RESTImport:
        return 'REST API';
      case adaptorTypeMap.NetSuiteDistributedImport:
        return 'NetSuite';
      case adaptorTypeMap.FTPImport:
        return 'FTP';
      case adaptorTypeMap.AS2Import:
        return 'AS2';
      case adaptorTypeMap.S3Import:
        return 'Amazon S3';
      case adaptorTypeMap.SalesforceImport:
        return 'Salesforce';
      case adaptorTypeMap.HTTPImport:
        return 'HTTP';
      case adaptorTypeMap.WrapperImport:
        return 'Wrapper';
      case adaptorTypeMap.MongodbImport:
        return 'MongoDB';
      case adaptorTypeMap.RDBMSImport: {
        let toReturn;

        if (conn) {
          if (conn.rdbms && conn.rdbms.type === 'mysql') {
            toReturn = 'MySQL';
          } else if (conn.rdbms && conn.rdbms.type === 'mssql') {
            toReturn = 'Microsoft SQL';
          } else {
            toReturn = 'PostgreSQL';
          }
        }

        return toReturn;
      }

      case adaptorTypeMap.DynamodbImport:
        return 'DynamoDB';
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
    const { lookups = [], mapping: subRecordMapping } =
      subRecordMappingObj || {};
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

    if (options.isCategoryMapping || options.isVariationMapping) {
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
    mappings = {},
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
    const generatedMapping = mappingUtil.shiftSubRecordLast({
      fields,
      lists,
    });

    return generatedMapping;
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

        if (mappingContainer) {
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
        }
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
  shiftSubRecordLast: ({ fields, lists }) => {
    const orderedLists = lists.map(l => {
      const _l = l;
      const itemsWithoutSubRecord = _l.fields.filter(f => !f.subRecordMapping);
      const itemsWithSubRecord = _l.fields.filter(f => f.subRecordMapping);

      _l.fields = [...itemsWithoutSubRecord, ...itemsWithSubRecord];

      return _l;
    });
    const fieldsWithoutSubRecord = fields.filter(f => !f.subRecordMapping);
    const fieldsWithSubRecord = fields.filter(f => f.subRecordMapping);

    return {
      fields: [...fieldsWithoutSubRecord, ...fieldsWithSubRecord],
      lists: orderedLists,
    };
  },
};
