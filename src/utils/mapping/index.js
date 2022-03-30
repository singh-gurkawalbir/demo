import deepClone from 'lodash/cloneDeep';
import { uniqBy, isEmpty, isEqual, forEach, flattenDeep, omit } from 'lodash';
import { nanoid } from 'nanoid';
import { adaptorTypeMap, isNetSuiteBatchExport, isFileAdaptor} from '../resource';
// eslint-disable-next-line import/no-self-import
import mappingUtil from '.';
import netsuiteMappingUtil from './application/netsuite';
import getJSONPaths, {
  getJSONPathArrayWithSpecialCharactersWrapped,
  pickFirstObject,
  getUnionObject,
} from '../jsonPaths';
import { getRecordTypeForAutoMapper } from '../assistant';
import { isJsonString } from '../string';
import {applicationsList} from '../../constants/applications';
import {generateCSVFields} from '../file';
import { emptyList, emptyObject, FORM_SAVE_STATUS, MAPPING_SAVE_STATUS } from '../constants';
import { TreeTitle } from '../../components/AFE/Editor/panels/Mappings/Mapper2/Source/ExtractsTree';
import TabRow from '../../components/AFE/Editor/panels/Mappings/Mapper2/TabbedRow';

const isCsvOrXlsxResource = resource => {
  const { file } = resource;
  const resourceFileType = file?.type;

  if (isFileAdaptor(resource) && (resourceFileType === 'xlsx' || resourceFileType === 'csv')) { return true; }

  return false;
};

const handlebarRegex = /(\{\{[\s]*.*?[\s]*\}\})/i;
export const checkExtractPathFoundInSampledata = (str, sampleData, wrapped) => {
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
const isMappingObjEqual = (_mappingObj1, _mappingObj2) => {
  const {
    rowIdentifier: r1,
    key: key1,
    isNotEditable: e1,
    isRequired: req1,
    ...mappingObj1
  } = _mappingObj1;
  const {
    rowIdentifier: r2,
    key: key2,
    isNotEditable: e2,
    isRequired: req2,
    ...mappingObj2
  } = _mappingObj2;

  return isEqual(mappingObj1, mappingObj2);
};
export const isMappingEqual = (mapping1, mapping2) => {
  let isMappingsChanged = mapping1.length !== mapping2.length;

  // change of order of mappings is treated as Mapping change
  for (let i = 0; i < mapping1.length && !isMappingsChanged; i += 1) {
    isMappingsChanged = !isMappingObjEqual(mapping1[i], mapping2[i]);
  }

  return !isMappingsChanged;
};
const setMappingData = (
  flowId,
  recordMappings,
  mappings,
  deleted = [],
  isParentDeleted,
  deleteChildlessParent,
  depth = 0
) => {
  recordMappings.forEach(category => {
    const key = `${flowId}-${category.id}-${depth}`;
    let allChildrenDeleted = false;

    if (category.children?.length) {
      allChildrenDeleted = category.children.every(child =>
        deleted[depth + 1]?.includes(child.id)
      );
    }

    const mappingDeleted =
      deleted[depth]?.includes(category.id) ||
      isParentDeleted ||
      (deleteChildlessParent && allChildrenDeleted);

    if (mappingDeleted) {
      // eslint-disable-next-line no-param-reassign
      category.delete = true;
    }

    if (mappings[key]) {
      // eslint-disable-next-line no-param-reassign
      category.fieldMappings = (mappings[key].mappings || [])
        .filter(el => (!!el.extract || !!el.hardCodedValue) && !!el.generate)
        .map(
          ({ index, rowIdentifier, hardCodedValueTmp, key, name, description, showListOption, filterType, visible, ...rest }) => ({
            ...rest,
          })
        );

      if (mappings[key].lookups?.length) {
        const allLookups = [...mappings[key]?.lookups || []];

        if (category.children?.length) {
          category.children.forEach(child => {
            const validLookups = mappings[`${flowId}-${child.id}-${depth + 1}`]?.mappings?.map(mapping => mapping.lookupName).filter(Boolean);

            if (mappings[`${flowId}-${child.id}-${depth + 1}`]?.lookups?.length && validLookups.length) {
              mappings[`${flowId}-${child.id}-${depth + 1}`].lookups.forEach(lookup => {
                if (validLookups.includes(lookup.name)) {
                  const lookupIndex = allLookups.findIndex(l => l.name === lookup.name);

                  if (lookupIndex === -1) {
                    allLookups.push(lookup);
                  } else {
                    allLookups[lookupIndex] = lookup;
                  }
                }
              });
            }
          });
        }
        // eslint-disable-next-line no-param-reassign
        category.lookups = allLookups;
      }
    }

    if (category.children?.length) {
      setMappingData(
        flowId,
        category.children,
        mappings,
        deleted,
        mappingDeleted,
        deleteChildlessParent,
        depth + 1
      );
    }
  });
};

const setVariationMappingData = (
  flowId,
  recordMappings,
  mappings,
  relationshipData = [],
  options = { depth: 0 }
) => {
  recordMappings.forEach(mapping => {
    const relation =
      relationshipData?.find(
        rel => rel.id === mapping.id && rel.depth === (options.depth || 0)
      );

    if (!relation) return;

    if (
      relation.variation_attributes?.length
    ) {
      const key = `${flowId}-${mapping.id}-${options.depth}-variationAttributes`;

      if (mappings[key]) {
        // eslint-disable-next-line no-param-reassign
        mapping.fieldMappings = (mappings[key].mappings || [])
          .filter(el => (!!el.extract || !!el.hardCodedValue) && !!el.generate)
          .map(
            ({
              index,
              rowIdentifier,
              description,
              name,
              key,
              filterType,
              showListOption,
              hardCodedValueTmp,
              visible,
              ...rest
            }) => ({
              ...rest,
            })
          );

        if (mappings[key].lookups?.length) {
          // eslint-disable-next-line no-param-reassign
          mapping.lookups = mappings[key].lookups;
        }
      }
    } else {
      const variationTheme =
        relation.variation_themes?.find(theme => theme.id === 'variation_theme');

      if (variationTheme) {
        variationTheme.variation_attributes.forEach(vm => {
          const key = `${flowId}-${mapping.id}-${options.depth}-${vm}`;

          if (mappings[key]) {
            const stagedMappings =
              mappings[key].staged || mappings[key].mappings || emptyList;

            if (
              !mapping.variation_themes.find(vt => vt.variation_theme === vm)
            ) {
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
    }

    if (relation.children?.length) {
      const mappingKeys = Object.keys(mappings);

      relation.children.forEach(child => {
        const childExists = mapping.children.find(c => c.id === child.id);
        const isVariationAttributes =
          !!child.variation_attributes?.length;

        if (!childExists) {
          const mappingFound = mappingKeys.some(key =>
            isVariationAttributes
              ? key === `${flowId}-${child.id}-${options.depth}-variationAttributes`
              : key.startsWith(`${flowId}-${child.id}`)
          );

          if (mappingFound) {
            mapping.children.push({
              id: child.id,
              children: [],
              [isVariationAttributes
                ? 'fieldMappings'
                : 'variation_themes']: [],
            });
          }
        }
      });

      setVariationMappingData(
        flowId,
        mapping.children,
        mappings,
        relationshipData,
        { ...options, depth: options.depth ? options.depth + 1 : 1 }
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
      const subList = list.fields.find(l => l.generate === subListGenerateName) || {};
      const { subRecordMapping = {} } = subList;

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

  if (!flowSampleData && /^\[.*\]$/.test(extract) && !/^\[".*"\]$/.test(extract)) {
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
    // So wnwrap the extract only if it doesnt have a dot or sublist character in it
    if (
      /^\[.*\]$/.test(extract) && // If extract is wrapped in square braces i,e starts with [ and ends with ]
      !/^\[".*"\]$/.test(extract) && // do not unwrap if extract is wrapped in double Quotes, as it will be interpreted as hardcodedValue ex: ["Receipt"]
      /\W/.test(extract.replace(/^\[|]$/g, '')) && // and the wrapped content contains special character
      !/\./.test(extract.replace(/^\[|]$/g, '')) // and none of the special characters is a dot
    ) {
      // remove the enclosing brances
      modifiedExtract = extract.replace(/^\[|]$/g, '').replace(/\\\]/g, ']');
    }
  }

  return modifiedExtract;
}

/*
 * sample csv content
 * "a,b,c
 * 1,2,3
 * 4,5,6"
 * Extracts headers from the above csv content [a,b,c]
 * Returns  {'a':'a', 'b':'b': 'c':'c'}
 */
export function extractMappingFieldsFromCsv(data = '', options = {}) {
  if (typeof data !== 'string') return;
  const fields = generateCSVFields(data, options);

  return fields.reduce((extractFieldObj, field) => {
    const [value] = field;

    // eslint-disable-next-line no-param-reassign
    extractFieldObj[value] = value;

    return extractFieldObj;
  }, {});
}

export function wrapTextForSpecialChars(extract, flowSampleData) {
  let modifiedExtract = extract;

  if (!/\W/g.test(extract) || handlebarRegex.test(extract)) {
    return modifiedExtract;
  }

  const isExtractAlreadyWrappedByUser = /^\[.*\]$/.test(extract) && // If extract is wrapped in square braces i,e starts with [ and ends with ]
  /\W/.test(extract.replace(/^\[|]$/g, '')) && // and the wrapped content contains special character
  !/\./.test(extract.replace(/^\[|]$/g, '')); // and none of the special characters is a dot

  if (
    !flowSampleData &&
    !isExtractAlreadyWrappedByUser &&
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
  removeChildLookups: sessionMappings => {
    if (!Array.isArray(sessionMappings?.basicMappings?.recordMappings)) {
      return;
    }
    sessionMappings.basicMappings.recordMappings.forEach(category => {
      if (category?.children?.length) {
        category.children.forEach(childCategory => {
          // eslint-disable-next-line no-param-reassign
          delete childCategory.lookups;
        });
      }
    });
  },
  setCategoryMappingData: (
    flowId,
    sessionMappedData = {},
    mappings = {},
    deleted,
    relationshipData,
    deleteChildlessParent
  ) => {
    const { basicMappings = {}, variationMappings = {} } = sessionMappedData || {};

    setMappingData(
      flowId,
      basicMappings.recordMappings || [],
      mappings,
      deleted,
      false,
      deleteChildlessParent
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
    }
    if ('hardCodedValue' in value) {
      return 'hardCoded';
    }
    if (value.extract && value.extract.indexOf('{{') !== -1) {
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
  getDefaultLookupActionValue: (lookup = {}) => {
    if (!lookup.allowFailures) {
      return 'disallowFailure';
    }

    if (lookup.useDefaultOnMultipleMatches) {
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
    if (value.extract?.indexOf('{{') !== -1) {
      return value.extract;
    }
    if (value.extract) {
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
      mappingData?.data?.mappingData?.variationMappings?.recordMappings
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
      generatesMetaData?.data?.categoryRelationshipData;
    const mappingData = response.find(sec => sec.operation === 'mappingData');
    let childCategoryDetails;
    let grandchildCategoryDetails;
    const categoryDetails = categoryRelationshipData.find(
      rel => rel.id === category
    );

    if (categoryDetails?.children) {
      childCategoryDetails = categoryDetails.children.find(
        child => child.id === childCategory
      );
    }

    if (
      grandchildCategory &&
      childCategoryDetails?.children
    ) {
      grandchildCategoryDetails = childCategoryDetails.children.find(
        child => child.id === grandchildCategory
      );
    }

    if (
      mappingData.data?.mappingData?.basicMappings?.recordMappings
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
          name: childCategoryDetails?.name,
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
          name: grandchildCategoryDetails?.name,
          children: [],
          fieldMappings: [],
        });
      }
    }
  },
  addVariation: (draft, cKey, data) => {
    const { categoryId, subCategoryId, isVariationAttributes } = data || emptyObject;
    const { response = [] } = draft[cKey] || emptyObject;
    const mappingData = response.find(sec => sec.operation === 'mappingData');
    let categoryMappings;

    if (mappingData?.data?.mappingData?.variationMappings?.recordMappings) {
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
  getApplicationName: (resource, conn) => {
    if (!resource) { return ''; }
    if (resource.assistant || conn?.assistant) {
      const connectors = applicationsList();
      const assistant = connectors.find(
        connector => (connector.id === resource.assistant || connector.id === conn?.assistant)
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
        if (resource?.http?.formType === 'rest') {
          return 'REST API';
        }

        return 'HTTP';
      case adaptorTypeMap.WrapperImport:
        return 'Wrapper';
      case adaptorTypeMap.MongodbImport:
        return 'MongoDB';
      case adaptorTypeMap.RDBMSImport: {
        let toReturn;

        if (conn) {
          if (conn.rdbms?.type === 'mysql') {
            toReturn = 'MySQL';
          } else if (conn.rdbms?.type === 'mssql') {
            toReturn = 'Microsoft SQL';
          } else if (conn.rdbms?.type === 'oracle') {
            toReturn = 'Oracle DB (SQL)';
          } else if (conn.rdbms?.type === 'postgresql') {
            toReturn = 'PostgreSQL';
          } else if (conn.rdbms?.type === 'bigquery') {
            toReturn = 'Google BigQuery';
          } else {
            toReturn = 'Snowflake';
          }
        }

        return toReturn;
      }

      case adaptorTypeMap.DynamodbImport:
        return 'DynamoDB';
      case adaptorTypeMap.WebhookExport:
        return 'Webhook';
      case adaptorTypeMap.SimpleExport:
        return 'File';
      default:
    }
  },
  getSubRecordRecordTypeAndJsonPath: (importResource, subRecordMappingId) => {
    const rawMapping = mappingUtil.getMappingFromResource({
      importResource,
      isFieldMapping: true,
    });
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
    importResource,
    subRecordMappingId,
    isGroupedSampleData,
    netsuiteRecordType,
    options = {}
  ) => {
    const rawMapping = mappingUtil.getMappingFromResource({
      importResource,
      isFieldMapping: true,
    });
    const subRecordMappingObj = getSubRecordMapping(
      rawMapping,
      subRecordMappingId
    );
    const { lookups = [], mapping: subRecordMapping } =
      subRecordMappingObj || {};
    const formattedMappings = mappingUtil.getMappingsForApp({
      mappings: subRecordMapping,
      isGroupedSampleData,
      resource: importResource,
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
    const mapping = mappingUtil.getMappingFromResource({
      importResource: resource,
      isFieldMapping: true,
    });
    const subRecordParent = getSubRecordMapping(mapping, subRecordMappingId);

    subRecordParent.mapping = subRecordMapping;
    subRecordParent.lookups = subRecordLookups;

    return mapping;
  },
  getMappingFromResource: ({
    importResource,
    isFieldMapping = false,
    isGroupedSampleData,
    isPreviewSuccess,
    netsuiteRecordType,
    options = {},
    exportResource,
  }

  ) => {
    if (!importResource) {
      return;
    }

    /* TODO: With support for different application being adding up,
      path for mapping to be updated below */
    let mappings = {};

    if (importResource.adaptorType === 'NetSuiteDistributedImport') {
      mappings = importResource.netsuite_da?.mapping || {};
    } else {
      mappings = importResource.mapping || {};
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

    if (isFieldMapping) return mappingCopy;

    return mappingUtil.getMappingsForApp({
      mappings: mappingCopy,
      isGroupedSampleData,
      isPreviewSuccess,
      resource: importResource,
      netsuiteRecordType,
      exportResource,
      options,
    });
  },
  getMappingsForApp: ({
    mappings = {},
    resource = {},
    isGroupedSampleData,
    isPreviewSuccess,
    netsuiteRecordType,
    exportResource,
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
          isPreviewSuccess,
          exportResource,
          resource,
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
          isPreviewSuccess,
          useFirstRowSupported: true,
          exportResource,
          resource,
        });
      case adaptorTypeMap.SalesforceImport:
        return mappingUtil.getFieldsAndListMappings({
          mappings: _mappings,
          exportResource,
          useFirstRowSupported: false,
          resource,
        });
      default:
    }
  },
  generateFieldsAndListMappingForApp: ({
    mappings,
    generateFields,
    isGroupedSampleData,
    isPreviewSuccess,
    importResource,
    netsuiteRecordType,
    exportResource,
  }) => {
    if (['NetSuiteImport', 'NetSuiteDistributedImport'].includes(importResource.adaptorType)) {
      return netsuiteMappingUtil.generateMappingFieldsAndList({
        mappings,
        isGroupedSampleData,
        generateFields,
        recordType: netsuiteRecordType,
        importResource,
      });
    }

    return mappingUtil.generateMappingFieldsAndList({
      mappings,
      isGroupedSampleData,
      isPreviewSuccess,
      useFirstRowSupported: importResource.adaptorType !== 'SalesforceImport',
      importResource,
      exportResource,
    });
  },
  getFieldsAndListMappings: ({
    mappings = {},
    isGroupedSampleData,
    isPreviewSuccess,
    useFirstRowSupported = false,
    resource = {},
    exportResource,
  }) => {
    let tempFm;
    const toReturn = [];

      mappings.fields?.forEach(fm => {
        const _fm = { ...fm };

        if (isCsvOrXlsxResource(resource) && isNetSuiteBatchExport(exportResource)) {
          if (isGroupedSampleData) {
            _fm.useFirstRow = true;
          } else if (!isPreviewSuccess) {
            // If no sample data found, and extract starts with *. example *.abc, then assume export is grouped data.
            if (handlebarRegex.test(_fm.extract)) {
              if (_fm.extract?.indexOf('*.') !== -1 || _fm.extract?.indexOf('[*].') !== -1) {
                _fm.useIterativeRow = true;
              }
            } else if (/^\*\./.test(_fm?.extract)) {
              _fm.useIterativeRow = true;
            }
          }
        }

        _fm.extract = unwrapTextForSpecialChars(_fm.extract);
        toReturn.push(_fm);
      });
      mappings.lists?.forEach(lm => {
        lm.fields.forEach(fm => {
          tempFm = { ...fm };
          tempFm.generate = lm.generate
            ? [lm.generate, tempFm.generate].join('[*].')
            : tempFm.generate;

          if (useFirstRowSupported && isGroupedSampleData) {
            if (tempFm.extract?.indexOf('*.') !== 0) {
              tempFm.useFirstRow = true;
            }
          }

          // If no sample data found, and extract starts with *. example *.abc, then assume export is grouped data.
          if (!isPreviewSuccess && /^\*\./.test(tempFm?.extract)) {
            tempFm.useIterativeRow = true;
          }

          // adding support for multi-field list mappings for csv/NS only for now to reduce regression
          if (!isPreviewSuccess && isCsvOrXlsxResource(resource) && isNetSuiteBatchExport(exportResource)) {
            if (handlebarRegex.test(tempFm.extract)) {
              if (tempFm.extract?.indexOf('*.') !== -1 || tempFm.extract?.indexOf('[*].') !== -1) {
                tempFm.useIterativeRow = true;
              }
            }
          }

          // remove *. if present after setting useFirstRow
          if (tempFm.extract?.indexOf('*.') === 0) { tempFm.extract = tempFm.extract.substr('*.'.length); }

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
    isPreviewSuccess,
    useFirstRowSupported = false,
    importResource = {},
    exportResource = {},
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

      if (generateParts?.length > 1) {
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
          ((useFirstRowSupported && isGroupedSampleData) || mapping.useIterativeRow) &&
          !mapping.useFirstRow &&
          mapping.extract?.indexOf('[*].') === -1 &&
          !handlebarRegex.test(mapping.extract)
        ) {
          mapping.extract = `*.${mapping.extract}`;
        }

        delete mapping.useFirstRow;
      } else if (isCsvOrXlsxResource(importResource) && isNetSuiteBatchExport(exportResource)) {
        let isListMapping = false;
        const listWithEmptyGenerate = lists.find(l => l.generate === '');

        // for multi-field mappings, there is no concept of useFirstRow
        if ((!isPreviewSuccess || isGroupedSampleData || mapping.useIterativeRow) && handlebarRegex.test(mapping.extract)) {
          if (mapping.extract?.indexOf('*.') !== -1 || mapping.extract?.indexOf('[*].') !== -1) {
            isListMapping = true;
          }
        }

        if (isGroupedSampleData || mapping.useIterativeRow) {
          if (
            !mapping.useFirstRow &&
            mapping.extract?.indexOf('[*].') === -1 &&
            !handlebarRegex.test(mapping.extract)
          ) {
            mapping.extract = `*.${mapping.extract}`;
          }

          // for csv/xl imports the mapping order matters
          // so we maintain the order after a list with empty generate is found
          if ((!handlebarRegex.test(mapping.extract) && !mapping.useFirstRow) || listWithEmptyGenerate?.fields?.length) {
            isListMapping = true;
          }
        }

        if (isListMapping) {
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
        mapping.extract?.indexOf('*.') === 0 &&
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
        const attachdetachFields = [{id: 'celigo_nlobjAttachToId', name: 'Attach To Internal ID'},
          {id: 'celigo_nlobjAttachedType', name: 'Attached Record Type'},
          {id: 'celigo_nlobjAttachedId', name: 'Attached Internal ID'},
          {id: 'celigo_nlobjDetachFromId', name: 'Detach From Internal ID'},
          {id: 'celigo_nlobjDetachedType', name: 'Detached Record Type'},
          {id: 'celigo_nlobjDetachedId', name: 'Detached Internal ID'},
          {id: 'celigo_nlobjAttachDetachAttributesRole', name: 'Attribute Role'},
          {id: 'celigo_nlobjAttachDetachAttributesField', name: 'Attribute Field'}];

        formattedGenerateFields = formattedGenerateFields.concat(attachdetachFields);
      } else {
        let formattedSampleData = [];

        if (typeof sampleData === 'string' && isJsonString(sampleData)) {
          formattedSampleData = getJSONPaths(JSON.parse(sampleData));
        } else if (typeof sampleData === 'object') {
          formattedSampleData = getJSONPaths(sampleData);
        }

        formattedGenerateFields =
          formattedSampleData?.map(sd => ({ ...sd, name: sd.id }));
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
            mappings.lists?.find(l => l.generate === fld.split('[*].')[0]);

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
          fldContainer?.fields?.find(l => l.generate === fld);

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

      connectorMappingMetadata?.forEach(meta => {
        let mappingContainer;

        if (meta.generateList) {
          mappingContainer =
            mappings.lists?.find(list => list.generate === meta.generateList);
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

    if (mappingsWithoutGenerates.length) {
      return {
        isSuccess: false,
        errMessage: 'One or more generate fields missing',
      };
    }
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
    const extractPaths = getJSONPaths(pickFirstObject(fields));

    if (!jsonPath || jsonPath === '$') {
      return extractPaths;
    }

    return extractPaths
      .filter(f => f.id?.indexOf(`${jsonPath}[*].`) === 0)
      .map(f => ({
        ...f,
        id: f.id.replace(`${jsonPath}[*].`, ''),
      }));
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
  autoMapperRecordTypeForAssistant: resource => {
    const relativeUri = resource?.rest?.relativeURI || resource?.http?.relativeURI;
    const firstRelativeUri = Array.isArray(relativeUri) ? relativeUri[0] : relativeUri;

    if (firstRelativeUri) {
      return getRecordTypeForAutoMapper(firstRelativeUri);
    }

    return '';
  },
  getFormStatusFromMappingSaveStatus: saveStatus => {
    switch (saveStatus) {
      case MAPPING_SAVE_STATUS.COMPLETED: return FORM_SAVE_STATUS.COMPLETE;
      case MAPPING_SAVE_STATUS.REQUESTED: return FORM_SAVE_STATUS.LOADING;
      default: return FORM_SAVE_STATUS.FAILED;
    }
  },

  // #region default Mapper2 utils
  getV2DefaultActionValue: value => {
    if (value.conditional?.when === 'extract_not_empty') {
      return 'discardIfEmpty';
    }
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
  getV2DefaultLookupActionValue: (value, lookup = {}) => {
    if (value.conditional?.when === 'extract_not_empty') {
      return 'discardIfEmpty';
    }
    if (!lookup.allowFailures) {
      return 'disallowFailure';
    }

    if (lookup.useDefaultOnMultipleMatches) {
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
  // #endregion
};

// #region Mapper2 utils
export const RECORD_AS_INPUT_OPTIONS = [
  {
    label: 'Record to record - { } to { }',
    value: 'recrec',
  },
  {
    label: 'Record to rows - { } to [ ]',
    value: 'recrow',
  },
];

export const ROWS_AS_INPUT_OPTIONS = [
  {
    label: 'Rows to record - [ ] to { }',
    value: 'rowrec',
  },
  {
    label: 'Rows to rows - [ ] to [ ]',
    value: 'rowrow',
  },
];

export const PRIMITIVE_DATA_TYPES = ['string', 'number', 'boolean'];
export const ARRAY_DATA_TYPES = ['stringarray', 'numberarray', 'booleanarray', 'objectarray'];
export const DATA_TYPES_OPTIONS =
[
  {
    id: 'string',
    label: 'string',
  },
  {
    id: 'number',
    label: 'number',
  },
  {
    id: 'boolean',
    label: 'boolean',
  },
  {
    id: 'object',
    label: 'object',
  },
  {
    id: 'stringarray',
    label: '[string]',
  },
  {
    id: 'numberarray',
    label: '[number]',
  },
  {
    id: 'booleanarray',
    label: '[boolean]',
  },
  {
    id: 'objectarray',
    label: '[object]',
  },
];

export const getInputOutputFormat = (isGroupedSampleData, isGroupedOutput) => {
  if (isGroupedSampleData) {
    if (isGroupedOutput) {
      return ROWS_AS_INPUT_OPTIONS[1].label;
    }

    return ROWS_AS_INPUT_OPTIONS[0].label;
  } if (isGroupedOutput) {
    return RECORD_AS_INPUT_OPTIONS[1].label;
  }

  return RECORD_AS_INPUT_OPTIONS[0].label;
};

// this util is for objectarray data type nodes when multiple extracts are given
// to reconstruct the whole children and buildArrayHelper
export const rebuildNode = (node, extract) => {
  const clonedNode = deepClone(node);
  const {key: parentKey, buildArrayHelper = [], multipleSources} = clonedNode;
  const splitExtract = extract.split(',');

  // if no extract, return
  if (!splitExtract || !splitExtract.length) return clonedNode;

  // for each extract, keep the buildArrayHelper if exists, else add new
  splitExtract.forEach((extract, index) => {
    if (index > 0 && !multipleSources) {
      clonedNode.multipleSources = true;
    }

    if ((buildArrayHelper[index]?.extract || '$') === extract) {
      // do nothing, already match
      return;
    }

    buildArrayHelper[index] = {
      extract,
      mappings: [{
        key: nanoid(), // todo ashu may not need this key
        dataType: 'string',
      }],
    };
  });

  // remove remaining array helper
  buildArrayHelper.splice(splitExtract.length);

  const foundExtracts = [];

  // filter the children array and only keep the ones which
  // have the parentExtract same as one of the given extracts
  clonedNode.children = clonedNode.children.filter(child => {
    const {parentExtract = '$'} = child;

    if (child.isTabNode) return true;

    if (splitExtract.includes(parentExtract || '$')) {
      foundExtracts.push(parentExtract || '$');

      return true;
    }

    return false;
  });

  // find left over extracts so that new children rows can be pushed
  const leftExtracts = splitExtract.filter(s => {
    if (foundExtracts.includes(s)) return false;

    return true;
  });

  // for all left over extracts, which are added new
  // add new rows
  if (leftExtracts.length) {
    leftExtracts.forEach(e => {
      const newRow = {
        key: nanoid(),
        title: '',
        parentKey,
        parentExtract: e,
        dataType: 'string',
      };

      clonedNode.children.push(newRow);
    });
  }

  if (buildArrayHelper.length === 1) {
    // remove tab node
    if (clonedNode.children?.[0]?.isTabNode) {
      clonedNode.children.shift();
    }
  } else if (buildArrayHelper.length > 1 && !clonedNode.children?.[0]?.isTabNode) {
    // add tab node
    clonedNode.children.unshift({
      key: nanoid(),
      parentKey,
      title: TabRow,
      isTabNode: true,
    });
  }

  return clonedNode;
};

function iterateForParentTree(mappings, treeData, parentKey, parentExtract, disabled, hidden) {
  mappings.forEach(m => {
    const {dataType, mappings: objMappings, buildArrayHelper, extract: currNodeExtract} = m;
    const children = [];
    const currNodeKey = nanoid();

    // add same key in the mappings schema as well
    // eslint-disable-next-line no-param-reassign
    m.key = currNodeKey;

    const nodeToPush = {
      key: currNodeKey,
      title: '',
      parentKey,
      parentExtract,
      disabled,
      hidden,
      className: hidden && 'hideRow',
      ...m,
    };

    treeData.push(nodeToPush);

    if (PRIMITIVE_DATA_TYPES.includes(dataType)) {
      // nothing to do
      return;
    }
    if (dataType === 'object') {
      if (objMappings) {
        nodeToPush.children = children;

        iterateForParentTree(objMappings, children, currNodeKey, currNodeExtract, disabled);
      }

      return;
    }
    if (ARRAY_DATA_TYPES.includes(dataType)) {
      // invalid mappings, nothing to do
      if (!buildArrayHelper) {
        return;
      }
      if (dataType === 'objectarray') {
        let sourceExtract;
        let multipleSources = false;

        buildArrayHelper.forEach(obj => {
          const {extract = '$', mappings} = obj;

          //  sourceExtract = extract ? `${sourceExtract ? `${sourceExtract},` : ''}${extract}` : sourceExtract;
          sourceExtract = `${sourceExtract ? `${sourceExtract},` : ''}${extract}`;

          if (!mappings) {
            return;
          }

          if (multipleSources && !nodeToPush.multipleSources) {
            nodeToPush.multipleSources = true;

            children.unshift({
              key: nanoid(),
              parentKey: currNodeKey,
              title: TabRow,
              isTabNode: true,
            });
            // since the first source is already pushed, all other children should
            // be hidden now, as we show the first source tab by default
            iterateForParentTree(mappings, children, currNodeKey, extract, disabled, true);
          } else {
            multipleSources = true;
            iterateForParentTree(mappings, children, currNodeKey, extract, disabled, hidden);
          }

          nodeToPush.children = children;

          // iterateForParentTree(mappings, children, currNodeKey, extract, disabled);
        });
        nodeToPush.combinedExtract = sourceExtract;

        return;
      }

      // for primitive array types
      let extract;

      buildArrayHelper.forEach(obj => {
        extract = `${extract ? `${extract},` : ''}${obj.extract}`;
      });

      nodeToPush.combinedExtract = extract;
    }
  });

  return treeData;
}

export function generateTreeFromV2Mappings(mappings, disabled) {
  const treeData = [];
  const emptyRowKey = nanoid();

  // we need empty title to be passed here
  // for each node as the parent Tree is handling the titleRender for all
  // if empty title is not set here, then a dummy '---' title gets shown on each row hover
  const emptyMappingsTree = [{
    key: emptyRowKey,
    isEmptyRow: true,
    title: '',
    disabled,
    dataType: 'string',
  }];

  if (isEmpty(mappings)) {
    mappings.push({
      key: emptyRowKey,
      dataType: 'string',
    });

    return emptyMappingsTree;
  }

  return iterateForParentTree(mappings, treeData, '', '', disabled);
}

// eslint-disable-next-line camelcase
const mappings_record_to_record = {
  mappings: [
    {
      generate: 'my_first_name',
      dataType: 'string',
      extract: '$.fName',
    },
    {
      generate: 'my_last_name',
      dataType: 'string',
      // extract: '$.lName',
      hardCodedValue: 'henderson',
    },
    // expressions continue to use handlebars, NOT jsonpath
    {
      generate: 'my_full_name',
      dataType: 'string',
      extract: '{{record.fName}} {{record.lName}}',
    },
    // mapping settings is supported via handlebars only
    {
      generate: 'my_custom_setting',
      dataType: 'string',
      extract: '{{settings.flow.XYZ}}',
    },
    {
      generate: 'my_mothers_name',
      dataType: 'object',
      mappings: [
        {
          generate: 'first_name',
          dataType: 'string',
          extract: '$.mother.fName',
        },
        {
          generate: 'last_name',
          dataType: 'string',
          extract: '$.mother.lName',
        },
      ],
    },
    {
      generate: 'my_many_first_names',
      dataType: 'stringarray',
      buildArrayHelper: [
        { extract: '$.fname' },
        { extract: '$.altFirstName'},
        { extract: '$.additionalFirstNames' },
      ],
    },
    {
      generate: 'two_of_my_fav_names',
      dataType: 'objectarray',
      buildArrayHelper: [
        {
          mappings: [
            {
              generate: 'my_first_name',
              dataType: 'string',
              extract: '$.fName',
            },
            {
              generate: 'my_last_name',
              dataType: 'string',
              extract: '$.lName',
            },
          ],
        },
        {
          mappings: [
            {
              generate: 'my_first_name',
              dataType: 'string',
              extract: '$.altFirstName',
            },
            {
              generate: 'my_last_name',
              dataType: 'string',
              extract: '$.lName',
            },
          ],
        },
      ],
    },
    {
      generate: 'my_siblings',
      dataType: 'objectarray',
      buildArrayHelper: [
        {
          extract: '$.siblings[*]',
          mappings: [
            {
              generate: 'sibling_first_name',
              dataType: 'string',
              extract: '$.siblings.fName',
            },
            {
              generate: 'sibling_last_name',
              dataType: 'string',
              extract: '$.siblings.lName',
            },
          ],
        },
      ],
    },
    {
      generate: 'all_the_children',
      dataType: 'objectarray',
      buildArrayHelper: [
        {
          extract: '$.siblings[*].children[*]',
          mappings: [
            {
              generate: 'first_name',
              dataType: 'string',
              extract: '$.siblings.children.fName',
            },
            {
              generate: 'last_name',
              dataType: 'string',
              extract: '$.siblings.lName',
            },
            {
              generate: 'full_name',
              dataType: 'string',
              extract: '{{record.siblings.children.fName}} {{record.siblings.lName}}',
            },
          ],
        },
        {
          extract: '$.children[*]',
          mappings: [
            {
              generate: 'my_child_first_name',
              dataType: 'string',
              extract: '$.children.firstName',
            },
            {
              generate: 'my_child_last_name',
              dataType: 'string',
              extract: '$.lName',
            },
            {
              generate: 'full_name',
              dataType: 'string',
              extract: '{{record.children.firstName}} {{record.lName}}',
            },
          ],
        },
      ],
    },
    {
      generate: 'family_tree_from_mom_perspective',
      dataType: 'object',
      mappings: [
        {
          generate: 'first_name',
          dataType: 'string',
          extract: '$.mother.fName',
        },
        {
          generate: 'last_name',
          dataType: 'string',
          extract: '$.mother.lName',
        },
        {
          generate: 'children',
          dataType: 'objectarray',
          buildArrayHelper: [
            {
              extract: '$.siblings[*]',
              mappings: [
                {
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.siblings.fName',
                },
                {
                  generate: 'last_name',
                  dataType: 'string',
                  extract: '$.siblings.lName',
                },
                {
                  generate: 'grandchildren',
                  dataType: 'objectarray',
                  buildArrayHelper: [
                    {
                      extract: '$.siblings.children[*]',
                      mappings: [
                        {
                          generate: 'first_name',
                          dataType: 'string',
                          extract: '$.siblings.children.fName',
                        },
                        {
                          generate: 'last_name',
                          dataType: 'string',
                          extract: '$.siblings.lName',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              mappings: [
                {
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.fName',
                },
                {
                  generate: 'last_name',
                  dataType: 'string',
                  extract: '$.lName',
                },
                {
                  generate: 'grandchildren',
                  dataType: 'objectarray',
                  buildArrayHelper: [
                    {
                      extract: '$.children[*]',
                      mappings: [
                        {
                          generate: 'first_name',
                          dataType: 'string',
                          extract: '$.children.firstName',
                        },
                        {
                          generate: 'last_name',
                          dataType: 'string',
                          extract: '$.lName',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // {
    //   generate: 'my_nephews_and_nieces_but_maintain_arrays_of_siblings',
    //   dataType: 'arrayarray',
    //   buildArrayHelper: [
    //     {
    //       extract: '$.siblings[*]',
    //       mappings: [
    //         {
    //           dataType: 'objectarray',
    //           buildArrayHelper: [
    //             {
    //               extract: '$.siblings.children[*]',
    //               mappings: [
    //                 {
    //                   generate: 'first_name',
    //                   dataType: 'string',
    //                   extract: '$.siblings.children.firstName',
    //                 },
    //                 {
    //                   generate: 'last_name',
    //                   dataType: 'string',
    //                   extract: '$.siblings.lName',
    //                 },
    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
};

export const buildTreeFromResourceV2Mappings = ({
  importResource,
  // isFieldMapping = false,
  // isGroupedSampleData,
  // isPreviewSuccess,
  // options = {},
  // exportResource,
  disabled,
}) => {
  if (!importResource) {
    return;
  }

  const v2Mappings = importResource.mappings || mappings_record_to_record.mappings || [];

  // creating deep copy of mapping object to avoid alteration to resource mapping object
  const v2MappingsCopy = deepClone(v2Mappings);

  // if (isFieldMapping) return v2MappingsCopy;

  // todo ashu handle isRequiredMapping for assistants

  const mappingsTreeData = generateTreeFromV2Mappings(v2MappingsCopy, disabled);

  return {mappingsTreeData, v2Mappings: v2MappingsCopy};
};

const KEYS_SPECIFIC_TO_UI_TREE = [
  'key',
  'title',
  'parentKey',
  'parentExtract',
  'combinedExtract',
  'className',
  'hidden',
  'disabled',
  'copySource',
  'children',
];

export const generateV2MappingsFromTree = ({v2TreeData = []}) => {
  // console.log('v2TreeData', v2TreeData);

  const _mappingsV2 = v2TreeData.map(node => {
    let _node = deepClone(node);

    const {dataType, isTabNode} = _node;

    if (isTabNode) return;

    if (PRIMITIVE_DATA_TYPES.includes(dataType)) {
      // remove tree specific keys
      _node = omit(_node, KEYS_SPECIFIC_TO_UI_TREE);

      return _node;
    }
    if (dataType === 'object') {
      const {children} = _node;
      const _mappings = generateV2MappingsFromTree({v2TreeData: children});

      // remove tree specific keys
      _node = omit(_node, KEYS_SPECIFIC_TO_UI_TREE);
      _node.mappings = _mappings;
      delete _node.buildArrayHelper;

      return _node;
    }
    // if (ARRAY_DATA_TYPES.includes(dataType)) {
    //   const {children, combinedExtract} = _node;
    //   const splitExtracts = combinedExtract?.split(',') || [];

    //   if (dataType === 'objectarray') {
    //     const buildArrayHelper = [];

    //     splitExtracts.forEach((extract, index) => {
    //       const subMappings = [];

    //       buildArrayHelper[index] = {
    //         extract,
    //         mappings: subMappings,
    //       };

    //       children.forEach(c => {
    //         if (c.isTabNode) return;
    //         if (c.parentExtract === extract) {
    //           subMappings.push();
    //         }
    //       });
    //       _node.buildArrayHelper = buildArrayHelper;
    //     });

    //     // remove tree specific keys
    //     _node = omit(_node, KEYS_SPECIFIC_TO_UI_TREE);
    //     delete _node.mappings;

    //     return _node;
    //   }
    //   // primitive array types

    //   if (splitExtracts.length) {
    //     _node.buildArrayHelper = splitExtracts.map(extract => ({
    //       extract,
    //     }));
    //   } else {
    //     delete _node.buildArrayHelper;
    //   }
    //   // remove tree specific keys
    //   _node = omit(_node, KEYS_SPECIFIC_TO_UI_TREE);
    //   delete _node.mappings;

    //   return _node;
    // }

    return _node;
  });

  // console.log('_mappingsV2', _mappingsV2);

  return _mappingsV2;
};

export function allowDrop({ dragNode, dropNode, dropPosition }) {
  const {parentKey: dragNodeParentKey, isTabNode: dragNodeIsTab} = dragNode;
  const {key: dropNodeKey, parentKey: dropNodeParentKey, isTabNode: dropNodeIsTab} = dropNode;

  if (dragNodeIsTab || dropNodeIsTab) return false;

  // dropping a child node at the 0th position in the children list
  if (dropPosition === 0 && dragNodeParentKey === dropNodeKey) return true;

  // nodes can only be dropped at same level
  if ((dragNodeParentKey && !dropNodeParentKey) ||
    (!dragNodeParentKey && dropNodeParentKey)) {
    return false;
  }

  if (dragNodeParentKey && dropNodeParentKey && dragNodeParentKey !== dropNodeParentKey) {
    return false;
  }

  return true;
}

export const findNodeInTree = (data, prop, value) => {
  let node;
  let nodeSubArray;
  let nodeIndexInSubArray;

  // using lodash forEach here as it provides a way to exit from loop
  // unlike Array forEach function
  forEach(data, (item, i, arr) => {
    if (item[prop] === value) {
      node = item;
      nodeSubArray = arr;
      nodeIndexInSubArray = i;

      // if found exit from loop
      return false;
    }
    if (item.children) {
      const returnToParent = findNodeInTree(item.children, prop, value);

      node = returnToParent.node;
      nodeSubArray = returnToParent.nodeSubArray;
      nodeIndexInSubArray = returnToParent.nodeIndexInSubArray;

      // if found exit from loop
      if (node) return false;
    }
  });

  return {node, nodeSubArray, nodeIndexInSubArray};
};

export const TYPEOF_TO_DATA_TYPE = {
  '[object String]': 'string',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Null]': 'string',
};

function iterateForExtracts(dataIn, treeData, parentKey, parentFieldName = '', propValues, selectedKeys) {
  // iterate over all keys and construct the tree
  Object.keys(dataIn).forEach(property => {
    if (property in dataIn) {
      const v = dataIn[property];
      const type = Object.prototype.toString.apply(v);
      const key = nanoid();
      const jsonPath = `${parentFieldName ? `${parentFieldName}.` : ''}${property}`;

      // if the value is already selected, then mark the node selected to highlight it
      const selected = propValues.includes(jsonPath);

      if (selected) {
        selectedKeys.push(key);
      }

      if (type !== '[object Array]' && type !== '[object Object]') {
        treeData.push({
          key,
          parentKey,
          title: TreeTitle,
          jsonPath,
          fieldName: property,
          dataType: TYPEOF_TO_DATA_TYPE[type],
        });

        return;
      }

      if (type === '[object Object]') {
        const children = [];

        treeData.push({
          key,
          parentKey,
          title: TreeTitle,
          jsonPath,
          fieldName: property,
          dataType: 'object',
          children,
        });

        iterateForExtracts(v, children, key, jsonPath, propValues, selectedKeys);

        return;
      }

      if (type === '[object Array]') {
        if (Object.prototype.toString.apply(v[0]) === '[object Object]' && !isEmpty(v[0])) {
          const children = [];

          treeData.push({
            key,
            parentKey,
            title: TreeTitle,
            jsonPath: `${jsonPath}[*]`,
            fieldName: property,
            dataType: '[object]',
            children,
          });
          const selected = propValues.includes(`${jsonPath}[*]`);

          if (selected) selectedKeys.push(key);

          iterateForExtracts(getUnionObject(v), children, key, `${jsonPath}[*]`, propValues, selectedKeys);

          return;
        }

        // primitive array
        const valueType = Object.prototype.toString.apply(v[0]);

        treeData.push({
          key,
          parentKey,
          title: TreeTitle,
          jsonPath,
          fieldName: property,
          dataType: `[${TYPEOF_TO_DATA_TYPE[valueType]}]`,
        });
      }
    }
  });
}

export const constructExtractsTree = (dataIn, propValues) => {
  const treeData = [];
  const children = [];

  if (!dataIn) return treeData;

  const dataObj = pickFirstObject(dataIn);

  const key = nanoid();

  // add first default $ path
  treeData.push({
    key,
    title: TreeTitle,
    dataType: Array.isArray(dataIn) ? '[object]' : 'object',
    fieldName: '$',
    children,
  });
  const selectedKeys = [];

  iterateForExtracts(dataObj, children, key, '', propValues, selectedKeys);
  // console.log('treeData', treeData);

  return {treeData, selectedKeys};
};

// this util takes care of filtering the tree when some input
// is typed into the search
export const filterExtractsNode = (node, propValue, inputValue) => {
  // if node is already selected, do not mark it as filtered
  if (node.selected) return false;

  // if no change has been made in input, then no need to filter
  // this should work because propValue should get updated once you update the extract field
  if (propValue === inputValue) return false;

  const searchKey = node.jsonPath || '';
  const splitInput = inputValue.split(',');

  const newT = splitInput.filter(i => {
    const inp = i.replace('$.', '');

    // if inp ends with [*], then look for exact match
    // so that we only highlight the parent row for such cases
    if (inp.endsWith('[*]')) {
      if (searchKey.toUpperCase() === inp.toUpperCase()) return true;

      return false;
    }

    if (inp && searchKey && searchKey.toUpperCase().indexOf(inp.toUpperCase()) > -1) {
      return true;
    }

    return false;
  });

  if (isEmpty(newT)) return false;

  return true;
};

// this util handles the comma separated values use-case
// and returns the final input after user selects a node
export const getFinalSelectedExtracts = (node, inputValue, isArrayType, isGroupedSampleData) => {
  const prefix = isGroupedSampleData ? '$[*]' : '$';
  const {jsonPath = ''} = node;
  const fullJsonPath = jsonPath ? `${prefix}.${jsonPath}` : prefix;
  let newValue = fullJsonPath;

  const splitByComma = inputValue.split(',');
  const valuesLen = splitByComma.length;

  // handle comma separated scenario for array data types
  if (isArrayType) {
    const lastChar = inputValue.charAt(inputValue.length - 1);

    // if user has typed comma before selecting new value, we append the new value
    // else replace the last value after comma
    if (lastChar === ',') {
      newValue = inputValue + fullJsonPath;
    } else {
      splitByComma[valuesLen - 1] = fullJsonPath;
      newValue = splitByComma.join(',');
    }
  }

  return newValue;
};

const isV2MappingObjEqual = (_mappingObj1 = {}, _mappingObj2 = {}) => {
  if ((!isEmpty(_mappingObj1.children) && isEmpty(_mappingObj2.children)) || (isEmpty(_mappingObj1.children) && !isEmpty(_mappingObj2.children))) return false;

  const {
    key: key1,
    parentKey: pKey1,
    title: t1,
    disabled: d1,
    parentExtract: p1,
    mappings: m1,
    buildArrayHelper: b1,
    children: c1,
    isNotEditable: e1,
    isRequired: req1,
    hidden: h1,
    className: cl1,
    copySource: cs1,
    ...mappingObj1
  } = _mappingObj1;
  const {
    key: key2,
    parentKey: pKey2,
    title: t2,
    disabled: d2,
    parentExtract: p2,
    mappings: m2,
    buildArrayHelper: b2,
    children: c2,
    isNotEditable: e2,
    isRequired: req2,
    hidden: h2,
    className: cl2,
    copySource: cs2,
    ...mappingObj2
  } = _mappingObj2;

  const isEqualObj = isEqual(mappingObj1, mappingObj2);

  if (!isEqualObj) return false;

  if (!_mappingObj1.children && !_mappingObj2.children) return isEqualObj;

  // both have children so need to compare children now
  let isChildrenEqual = true;

  for (let i = 0; i < _mappingObj1.children.length; i += 1) {
    isChildrenEqual = isV2MappingObjEqual(_mappingObj1.children[i], _mappingObj2.children[i]);
    if (!isChildrenEqual) {
      break;
    }
  }

  return isChildrenEqual;
};

export const isV2MappingsChanged = (tree1, tree2) => {
  let isV2MappingsChanged = tree1.length !== tree2.length;

  if (isV2MappingsChanged) return true;

  // change of order of mappings is treated as Mapping change
  for (let i = 0; i < tree1.length; i += 1) {
    isV2MappingsChanged = !isV2MappingObjEqual(tree1[i], tree2[i]);
    if (isV2MappingsChanged) break;
  }

  return isV2MappingsChanged;
};

// this util returns ALL the keys of the tree data in a flat array format
export const getAllKeys = data => {
  if (!data) return emptyList;
  const nestedKeys = data.map(node => {
    let childKeys = [];

    if (node.children) {
      childKeys = getAllKeys(node.children);
    }

    return [childKeys, node.key];
  });

  return flattenDeep(nestedKeys);
};

export const hideOtherTabRows = (node, newTabExtract, hidden) => {
  if (!node.children?.length) return;

  node.children.forEach(c => {
    if (c.isTabNode) return;
    if (hidden || c.parentExtract !== newTabExtract) {
      // eslint-disable-next-line no-param-reassign
      c.hidden = true;
      // eslint-disable-next-line no-param-reassign
      c.className = 'hideRow';

      // update children hidden as well
      hideOtherTabRows(c, c.combinedExtract || '$', true);
    } else {
      // eslint-disable-next-line no-param-reassign
      delete c.hidden;
      // eslint-disable-next-line no-param-reassign
      delete c.className;

      // update children as well
      hideOtherTabRows(c, c.combinedExtract || '$', false);
    }
  });
};

// #endregion
