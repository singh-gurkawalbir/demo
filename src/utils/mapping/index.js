import { uniqBy, isEmpty, isEqual, forEach, flattenDeep, uniq } from 'lodash';
import { adaptorTypeMap, isNetSuiteBatchExport, isFileAdaptor, isAS2Resource} from '../resource';
// eslint-disable-next-line import/no-self-import
import mappingUtil from '.';
import netsuiteMappingUtil from './application/netsuite';
import getJSONPaths, {
  getJSONPathArrayWithSpecialCharactersWrapped,
  pickFirstObject,
  getUnionObject,
} from '../jsonPaths';
import { getRecordTypeForAutoMapper } from '../assistant';
import { isJsonString, generateId } from '../string';
import {applicationsList} from '../../constants/applications';
import {generateCSVFields} from '../file';
import jsonUtils from '../json';
import { emptyList, emptyObject, FORM_SAVE_STATUS, MAPPING_SAVE_STATUS } from '../../constants';
import errorMessageStore from '../errorStore';
import customCloneDeep from '../customCloneDeep';

const isCsvOrXlsxResource = resource => {
  const { file } = resource;
  const resourceFileType = file?.type;

  if (isFileAdaptor(resource) && (resourceFileType === 'xlsx' || resourceFileType === 'csv')) { return true; }

  return false;
};

export const handlebarRegex = /(\{\{[\s]*.*?[\s]*\}\})/i;
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

export function formattedMultiFieldExpression(expression, functionValue, extractValue) {
  let expressionValue = '';

  if (expression) expressionValue = expression;

  if (extractValue) {
    const isGroupedField = extractValue.indexOf('*.') === 0;
    const extractFieldValue = isGroupedField ? extractValue.substring(2) : extractValue;

    expressionValue += `{{${isGroupedField ? '*.' : ''}${wrapTextForSpecialChars(extractFieldValue)}}}`;
  } else if (functionValue) {
    expressionValue += functionValue;
  }

  return expressionValue;
}

// #region Mapper2 utils
export const isMapper2HandlebarExpression = (extractValue, isHardCodedValue) => handlebarRegex.test(extractValue) || (extractValue && !isHardCodedValue && !extractValue?.startsWith('$'));

export const isCsvOrXlsxResourceForMapper2 = resource => {
  if (!resource) return false;

  const { file } = resource;
  const resourceFileType = file?.type;

  if ((isFileAdaptor(resource) || isAS2Resource(resource)) &&
  (resourceFileType === 'xlsx' || resourceFileType === 'csv')) { return true; }

  return false;
};
export const getDefaultExtractPath = isGroupedSampleData => isGroupedSampleData ? '$[*]' : '$';

export const RECORD_AS_INPUT_OPTIONS = [
  {
    label: 'Create destination record { } from source record { }',
    value: 'recTorec',
  },
  {
    label: 'Create destination rows [ ] from source record { }',
    value: 'recTorow',
  },
];

export const ROWS_AS_INPUT_OPTIONS = [
  {
    label: 'Create destination record { } from source rows [ ]',
    value: 'rowTorec',
  },
  {
    label: 'Create destination rows [ ] from source rows [ ]',
    value: 'rowTorow',
  },
];
export const PRIMITIVE_DATA_TYPES = ['string', 'number', 'boolean'];
export const ARRAY_DATA_TYPES = ['stringarray', 'numberarray', 'booleanarray', 'objectarray'];
export const MAPPING_DATA_TYPES = Object.freeze({
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  STRINGARRAY: 'stringarray',
  NUMBERARRAY: 'numberarray',
  BOOLEANARRAY: 'booleanarray',
  OBJECTARRAY: 'objectarray',
  OBJECT: 'object',
});
const WRONG_SOURCE_DATA_TYPES_LIST = {
  [MAPPING_DATA_TYPES.NUMBER]: new Set([
    MAPPING_DATA_TYPES.BOOLEAN,
    MAPPING_DATA_TYPES.BOOLEANARRAY,
    MAPPING_DATA_TYPES.NUMBERARRAY,
    MAPPING_DATA_TYPES.STRINGARRAY,
    MAPPING_DATA_TYPES.OBJECT,
    MAPPING_DATA_TYPES.OBJECTARRAY,
  ]),
  [MAPPING_DATA_TYPES.BOOLEAN]: new Set([
    MAPPING_DATA_TYPES.BOOLEANARRAY,
    MAPPING_DATA_TYPES.NUMBERARRAY,
    MAPPING_DATA_TYPES.STRINGARRAY,
    MAPPING_DATA_TYPES.OBJECT,
    MAPPING_DATA_TYPES.OBJECTARRAY,
  ]),
  [MAPPING_DATA_TYPES.NUMBERARRAY]: new Set([
    MAPPING_DATA_TYPES.BOOLEAN,
    MAPPING_DATA_TYPES.BOOLEANARRAY,
    MAPPING_DATA_TYPES.OBJECT,
    MAPPING_DATA_TYPES.OBJECTARRAY,
  ]),
  [MAPPING_DATA_TYPES.BOOLEANARRAY]: new Set([
    MAPPING_DATA_TYPES.OBJECT,
    MAPPING_DATA_TYPES.OBJECTARRAY,
  ]),
  [MAPPING_DATA_TYPES.OBJECT]: new Set([
    MAPPING_DATA_TYPES.STRING,
    MAPPING_DATA_TYPES.NUMBER,
    MAPPING_DATA_TYPES.BOOLEAN,
    MAPPING_DATA_TYPES.STRINGARRAY,
    MAPPING_DATA_TYPES.BOOLEANARRAY,
    MAPPING_DATA_TYPES.NUMBERARRAY,
    MAPPING_DATA_TYPES.OBJECTARRAY,
  ]),
  [MAPPING_DATA_TYPES.OBJECTARRAY]: new Set([
    MAPPING_DATA_TYPES.STRING,
    MAPPING_DATA_TYPES.NUMBER,
    MAPPING_DATA_TYPES.BOOLEAN,
    MAPPING_DATA_TYPES.STRINGARRAY,
    MAPPING_DATA_TYPES.BOOLEANARRAY,
    MAPPING_DATA_TYPES.NUMBERARRAY,
  ]),
};
export const DATA_TYPES_REPRESENTATION_LIST = {
  [MAPPING_DATA_TYPES.STRING]: 'string',
  [MAPPING_DATA_TYPES.NUMBER]: 'number',
  [MAPPING_DATA_TYPES.BOOLEAN]: 'boolean',
  [MAPPING_DATA_TYPES.OBJECT]: 'object',
  [MAPPING_DATA_TYPES.STRINGARRAY]: '[string]',
  [MAPPING_DATA_TYPES.NUMBERARRAY]: '[number]',
  [MAPPING_DATA_TYPES.BOOLEANARRAY]: '[boolean]',
  [MAPPING_DATA_TYPES.OBJECTARRAY]: '[object]',
};

export const DATA_TYPES_DROPDOWN_OPTIONS =
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

export const getUniqueExtractId = (extract, index) => {
  if (!extract) { return ''; }
  // currently only supporting root level duplicate extracts
  if (extract === '$' || extract === '$[*]') {
    return `${extract}|${index}`;
  }

  return extract;
};

export const getExtractFromUniqueId = extractId => {
  const pipeIndex = extractId?.indexOf('|');

  if (pipeIndex > 0) {
    return extractId.substring(0, pipeIndex);
  }

  return extractId;
};

// returns the matching extract config object
// from passed extracts helper array
export const findMatchingExtract = (helper, uniqueExtract) => {
  if (!helper || !uniqueExtract) return {};

  return helper.find(h => h.extract === uniqueExtract) || {};
};

// returns the array of all extracts value (non-unique so its readable for user) from helper array
export const getCombinedExtract = helper => {
  if (!helper || !helper.length) return [];

  return helper.reduce((combinedExtract, obj) => {
    if (obj.extract) {
      combinedExtract.push(getExtractFromUniqueId(obj.extract));
    }

    return combinedExtract;
  }, []);
};

// fetch source datatype from the extract helper array
export const getExtractDataType = helper => {
  if (!helper || !helper.length) return [];

  return helper.reduce((combinedSourceDataType, obj) => {
    if (obj.sourceDataType) {
      combinedSourceDataType.push(obj.sourceDataType);
    }

    return combinedSourceDataType;
  }, []);
};

// util for fetching the the correct datatype value of a selected node
export const getSelectedExtractDataTypes = ({
  extractsTree,
  selectedValue,
  selectedDataType = [],
  selectedExtractJsonPath}) => {
  if (!extractsTree || !extractsTree[0]) {
    return selectedDataType;
  }
  const extractsTreeNode = extractsTree[0];

  if (isEmpty(extractsTreeNode) || !extractsTreeNode.children?.length) return selectedDataType;

  if (selectedValue === '$') {
    selectedDataType.push(MAPPING_DATA_TYPES.OBJECT);
  } else if (selectedValue === '$[*]') {
    selectedDataType.push(MAPPING_DATA_TYPES.OBJECTARRAY);
  } else {
    const selectedValuePath = selectedExtractJsonPath || (selectedValue.replace(/(\$\.)|(\$\[\*\]\.)/g, ''));

    extractsTreeNode.children.forEach(node => {
      const {dataType, jsonPath} = node;

      if (selectedValuePath === jsonPath) {
        let dataTypeValue;

        switch (dataType) {
          case '[object]':
            dataTypeValue = MAPPING_DATA_TYPES.OBJECTARRAY;
            break;
          case '[boolean]':
            dataTypeValue = MAPPING_DATA_TYPES.BOOLEANARRAY;
            break;
          case '[number]':
            dataTypeValue = MAPPING_DATA_TYPES.NUMBERARRAY;
            break;
          case '[string]':
            dataTypeValue = MAPPING_DATA_TYPES.STRINGARRAY;
            break;
          default:
            dataTypeValue = dataType;
        }
        selectedDataType.push(dataTypeValue);
      }

      if (node.children) {
        getSelectedExtractDataTypes({extractsTree: [node], selectedValue, selectedDataType, selectedExtractJsonPath});
      }
    });
  }

  return selectedDataType;
};

// this util takes in the existing helper array and new source field
// and adds/updates the helper array accordingly
export const buildExtractsHelperFromExtract = ({
  existingExtractsArray = [],
  sourceField,
  formKey,
  newExtractObj,
  extractsTree,
  selectedExtractJsonPath,
  oldSourceDataType}) => {
  if (!sourceField) return [];

  const splitExtracts = sourceField?.split(',') || [];
  const uniqueSplitExtracts = splitExtracts.map((e, i) => getUniqueExtractId(e, i));

  const toReturn = [];
  const removedSources = {};

  // copy the existing settings of removed source so if a new source is added at same index, we copy same settings
  existingExtractsArray.forEach(c => {
    if (!uniqueSplitExtracts.includes(c.extract)) {
      removedSources[c.extract] = c;
    }
  });

  splitExtracts.forEach((e, i) => {
    const uniqueExtract = getUniqueExtractId(e, i);
    const extractConfig = findMatchingExtract(existingExtractsArray, uniqueExtract);

    if (extractConfig.extract) {
      // found existing extract, use same config
      toReturn.push(uniqueExtract === formKey ? newExtractObj : extractConfig);
    } else if (removedSources[existingExtractsArray[i]?.extract]) {
      // add missing extracts in existingExtractsArray which are newly added by the user and copy settings if found at same index
      toReturn.push({...removedSources[existingExtractsArray[i].extract],
        extract: uniqueExtract,
        sourceDataType: getSelectedExtractDataTypes({extractsTree, selectedValue: e, selectedExtractJsonPath})[0] || MAPPING_DATA_TYPES.STRING});
    } else {
      // add extract
      toReturn.push(formKey ? newExtractObj : {
        extract: uniqueExtract,
        sourceDataType: oldSourceDataType || getSelectedExtractDataTypes({extractsTree, selectedValue: e, selectedExtractJsonPath})[0] || MAPPING_DATA_TYPES.STRING});
    }
  });

  return toReturn;
};

// for object array multiple extracts view,
// mark non active tabs children as hidden
export const hideOtherTabRows = (node, newTabExtract = '', hidden, useOriginalNode) => {
  // ToDo (Yaser): check if we can remove the deep clone completely
  const clonedNode = useOriginalNode ? node : customCloneDeep(node);

  if (!clonedNode || !clonedNode.children?.length) return clonedNode;

  clonedNode.children = clonedNode.children.map(c => {
    const clonedChild = {...c};

    // if parent is passing hidden as true, then all children should be hidden
    if (hidden) {
      clonedChild.hidden = true;
      clonedChild.className = 'hideRow';

      // update children hidden as well
      return hideOtherTabRows(clonedChild, newTabExtract, true);
    }

    // if parent is passing hidden as false explicitly, then all children should be shown
    if (hidden === false) {
      delete clonedChild.hidden;
      delete clonedChild.className;

      // update children as well
      return hideOtherTabRows(clonedChild, newTabExtract, false);
    }

    if (clonedChild.isTabNode) {
      delete clonedChild.hidden;
      delete clonedChild.className;

      return clonedChild;
    }

    // else if hidden is undefined, then check on the parent extract
    if ((clonedChild.parentExtract || '') !== newTabExtract) {
      clonedChild.hidden = true;
      clonedChild.className = 'hideRow';

      // update children hidden as well
      return hideOtherTabRows(clonedChild, newTabExtract, true);
    }
    delete clonedChild.hidden;
    delete clonedChild.className;

    // for child object-array nodes, retain the original tab index
    if (clonedChild.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      const extractIndex = clonedChild.activeTab || 0;
      const extractAtActiveIndex = clonedChild.extractsArrayHelper?.[extractIndex]?.extract;

      // update children and un-hide only first tab
      return hideOtherTabRows(clonedChild, extractAtActiveIndex);
    }

    // update children as well
    return hideOtherTabRows(clonedChild, newTabExtract, false);
  });

  return clonedNode;
};

// find the first extract from helper array
// which does not have copy source as yes
export const getFirstActiveTab = node => {
  if (!node || !node.extractsArrayHelper) return {};
  let activeTab;
  let activeExtract;

  forEach(node.extractsArrayHelper, (extractConfig, index) => {
    if (extractConfig.copySource !== 'yes') {
      activeTab = index;
      activeExtract = extractConfig.extract;

      // found first tab, exit from loop
      return false;
    }
  });

  return {activeTab, activeExtract};
};

const getNewNode = (defaultProps = {}) => {
  const { key, generate, jsonPath, dataType = MAPPING_DATA_TYPES.STRING, parentKey, parentExtract, children: defaultChildren } = defaultProps;
  const newKey = key || generateId();
  const needEmptyChildNode = [MAPPING_DATA_TYPES.OBJECTARRAY, MAPPING_DATA_TYPES.OBJECT].includes(defaultProps.dataType);
  const newChildNode = {
    key: generateId(),
    title: '',
    parentKey: newKey,
    parentExtract: '',
    dataType: MAPPING_DATA_TYPES.STRING,
    hidden: true,
    className: 'hideRow',
  };

  let childNodes = defaultChildren || [newChildNode]; // if the children are not passed, adds default empty child node

  if (childNodes.length > 1) {
    // Strips off any empty nodes present in the child nodes when there are multiple children
    childNodes = childNodes.filter(childNode => !childNode.isEmptyRow);
  }
  const node = {
    key: newKey,
    title: '',
    generate,
    jsonPath,
    dataType,
    ...(needEmptyChildNode ? { children: childNodes } : {}),
    parentKey,
    parentExtract,
    className: 'hideRow',
    hidden: true,
  };

  return node;
};

export const constructNodeWithEmptySource = node => {
  if (!node) return getNewNode();
  const { children, dataType, jsonPath, generate, parentKey, parentExtract } = node;
  const defaultProps = { generate, jsonPath, dataType, parentKey, parentExtract };
  const newKey = generateId();

  if (!children) {
    // node is a non object/objectarray type
    // so construct a new empty node with node props
    return getNewNode(defaultProps);
  }
  const {activeExtract = ''} = getFirstActiveTab(node);
  const firstExtractChildNodes = children.filter(child => (child.parentExtract || '') === activeExtract);
  const emptyChildren = firstExtractChildNodes.map(child => constructNodeWithEmptySource({...child, parentKey: newKey, parentExtract: ''}));

  // Incase of children, replace children with empty children
  return getNewNode({...defaultProps, children: emptyChildren, key: newKey });
};

// this util is for object array data type nodes when multiple extracts are given,
// to reconstruct the whole children array
export const rebuildObjectArrayNode = (node, extract = '', prevActiveExtract, extractsTree, selectedExtractJsonPath) => {
  if (isEmpty(node) || node.dataType !== MAPPING_DATA_TYPES.OBJECTARRAY) return node;

  let clonedNode = {...node};
  const { key: parentKey } = node;

  const previousFirstExtract = prevActiveExtract || getFirstActiveTab(clonedNode).activeExtract || '';
  const prevFirstExtractChildren = clonedNode.children?.filter(childNode => {
    if (!previousFirstExtract) {
      return true;
    }

    return (childNode.parentExtract || '') === previousFirstExtract;
  }) || [];

  clonedNode.extractsArrayHelper = buildExtractsHelperFromExtract({existingExtractsArray: clonedNode.extractsArrayHelper, sourceField: extract, extractsTree, selectedExtractJsonPath, oldSourceDataType: clonedNode.sourceDataType});
  const hasNoExtract = isEmpty(clonedNode.extractsArrayHelper);

  const {activeTab, activeExtract} = getFirstActiveTab(clonedNode);

  // set active tab
  clonedNode.activeTab = activeTab;

  if (!clonedNode.children) {
    clonedNode.children = [];
  }
  let anyExtractHasMappings = false;

  // no extracts now with at least 1 source children before
  if (hasNoExtract) {
    if (previousFirstExtract) {
      // we have children previously, move those mappings under empty parentExtract
      clonedNode.children = prevFirstExtractChildren.map(c => ({ ...c, parentExtract: ''}));
    }
  } else {
    // multiple extracts
    const foundExtractsUniqueId = [];

    // so all matched extract children are copied to new children list
    clonedNode.children = clonedNode.children.filter(child => {
      const {parentExtract} = child;

      if (child.isTabNode) {
        return true;
      }

      const extractConfig = findMatchingExtract(clonedNode.extractsArrayHelper, parentExtract);

      // only keep the children which have matching parentExtract and copy source setting as no
      if (extractConfig.extract && extractConfig.copySource !== 'yes') {
        foundExtractsUniqueId.push(parentExtract);

        return true;
      }

      return false;
    });

    if (!foundExtractsUniqueId.length && prevFirstExtractChildren.length && activeExtract) {
      // if all the extracts are new (and there is activeExtract present, meaning it has copy source as no), then map prev first active source's child mapping to current first active source's child
      // fetch first source's mapping of previous extract and map those mappings to current extract's first source
      clonedNode.children = prevFirstExtractChildren.map(c => ({ ...c, parentExtract: activeExtract}));
    }

    // we take previous child refs and construct new children with empty source
    // we map these children to those left over extracts
    const childNodesWithEmptySources = prevFirstExtractChildren.filter(c => !!c.generate).map(c =>
      // we only fetch nodes with generates filled. empty generate mappings are ignored
      constructNodeWithEmptySource(c)
    );

    // iterate this for all extracts and map children for the left over extracts
    clonedNode.extractsArrayHelper.forEach((extractConfig, i) => {
      const {extract, copySource} = extractConfig;

      if (!extract) return;
      if (copySource !== 'yes') { anyExtractHasMappings = true; }

      if (foundExtractsUniqueId.includes(extract) || copySource === 'yes') {
        return;
      }
      // we mapped for the first extract above with prevFirstExtractChildren, so ignore first extract
      if (!foundExtractsUniqueId.length && prevFirstExtractChildren.length && i === activeTab) return;

      let childrenForCurrentExtract = [getNewNode({ parentKey, parentExtract: extract, jsonPath: node.jsonPath })];

      if (childNodesWithEmptySources.length) {
        // if the child refs are present from prev extracts, map them with this extract
        childrenForCurrentExtract = childNodesWithEmptySources.map(c => ({ ...c, parentExtract: extract, key: generateId()}));
      }
      clonedNode.children = [...clonedNode.children, ...childrenForCurrentExtract];
    });
  }

  // update hidden prop and only show first active extract children
  clonedNode = hideOtherTabRows(clonedNode, activeExtract);

  if (hasNoExtract || clonedNode.extractsArrayHelper.length === 1 || !anyExtractHasMappings) {
    // remove tab node
    if (clonedNode.children[0]?.isTabNode) {
      clonedNode.children.shift();
    }
  } else if (clonedNode.extractsArrayHelper.length > 1 && !clonedNode.children[0]?.isTabNode) {
    // add tab node
    clonedNode.children.unshift({
      key: generateId(),
      parentKey,
      title: '',
      isTabNode: true,
    });
  }
  delete clonedNode.buildArrayHelper; // this will be rebuilt when saving to BE

  return clonedNode;
};

function recursivelyBuildTreeFromV2Mappings({mappings = [], treeData, parentKey, parentExtract, disabled, hidden, isGroupedSampleData, parentJsonPath = '', requiredMappings = []}) {
  mappings.forEach(m => {
    const {dataType, mappings: objMappings, buildArrayHelper, extract: currNodeExtract, generate, sourceDataType} = m;
    const children = [];
    const currNodeKey = generateId();
    const jsonPath = `${parentJsonPath ? `${parentJsonPath}.` : ''}${generate || ''}`;

    const isRequired = requiredMappings.includes(jsonPath);

    const nodeToPush = {
      key: currNodeKey,
      title: '',
      parentKey,
      parentExtract,
      disabled,
      hidden,
      className: hidden && 'hideRow',
      jsonPath,
      isRequired,
      ...m,
    };

    treeData.push(nodeToPush);

    if (PRIMITIVE_DATA_TYPES.includes(dataType)) {
      nodeToPush.sourceDataType = sourceDataType || MAPPING_DATA_TYPES.STRING;

      // nothing to do
      return;
    }

    if (dataType === MAPPING_DATA_TYPES.OBJECT) {
      // suffix with . for object fields
      const isRequired = requiredMappings.some(r => r.startsWith(`${jsonPath}.`));

      nodeToPush.isRequired = isRequired;

      if (objMappings) {
        nodeToPush.children = children;

        recursivelyBuildTreeFromV2Mappings({
          mappings: objMappings,
          treeData: children,
          parentKey: currNodeKey,
          hidden,
          disabled,
          isGroupedSampleData,
          parentJsonPath: jsonPath,
          requiredMappings});
      } else if (currNodeExtract) { // if object mapping has extract, then it is copied from source as is with no children
        nodeToPush.sourceDataType = sourceDataType || MAPPING_DATA_TYPES.STRING;
        nodeToPush.copySource = 'yes';
      }

      return;
    }

    if (ARRAY_DATA_TYPES.includes(dataType)) {
      // suffix with [*] for object array fields
      const isRequired = requiredMappings.some(r => r.startsWith(`${jsonPath}[*]`));

      nodeToPush.isRequired = isRequired;

      // invalid mappings, nothing to do
      if (!buildArrayHelper) {
        return;
      }

      // to store individual source settings
      const extractsArrayHelper = [];

      nodeToPush.extractsArrayHelper = extractsArrayHelper;

      if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
        let anyExtractHasMappings = false;
        let extractIndexWithMappings = -1;

        buildArrayHelper.forEach((obj, index) => {
          const {extract = '', mappings} = obj;
          const newExtract = getUniqueExtractId(extract, index);

          const extractObj = {
            extract: newExtract,
            sourceDataType: obj.sourceDataType || MAPPING_DATA_TYPES.STRING,
            default: obj.default,
            conditional: obj.conditional,
            copySource: mappings ? 'no' : 'yes',
          };

          if (extract) {
            extractsArrayHelper.push(extractObj);
          }

          if (mappings) {
            anyExtractHasMappings = true;
            extractIndexWithMappings += 1;
          }

          recursivelyBuildTreeFromV2Mappings({
            mappings,
            treeData: children,
            parentKey: currNodeKey,
            parentExtract: newExtract,
            disabled,
            hidden: extractIndexWithMappings > 0 ? true : hidden, // since the first active source is already pushed, all other children should be hidden now, as we show the first source tab by default
            isGroupedSampleData,
            parentJsonPath: jsonPath ? `${jsonPath}[*]` : '',
            requiredMappings}
          );

          nodeToPush.children = children;
        });

        // only insert tab node if any extract has children mappings
        if (anyExtractHasMappings && buildArrayHelper.length > 1) {
          // found more than 1 extracts, insert a tab node if not already added
          if (!children?.[0]?.isTabNode) {
            children.unshift({
              key: generateId(),
              parentKey: currNodeKey,
              title: '',
              isTabNode: true,
              hidden,
              className: hidden && 'hideRow',
            });
          }
        }
        nodeToPush.activeTab = getFirstActiveTab(nodeToPush).activeTab;

        return;
      }

      // for primitive array types only extracts are supported, not 'mappings'
      buildArrayHelper.forEach((obj, index) => {
        const extractObj = {
          extract: getUniqueExtractId(obj.extract, index),
          sourceDataType: obj.sourceDataType || MAPPING_DATA_TYPES.STRING,
          default: obj.default,
          conditional: obj.conditional,
        };

        extractsArrayHelper.push(extractObj);
      });
    }
  });

  return treeData;
}

export const buildTreeFromV2Mappings = ({
  importResource,
  isGroupedSampleData,
  disabled,
  requiredMappings,
}) => {
  if (!importResource) {
    return;
  }

  const v2Mappings = importResource.mappings || [];

  // creating deep copy of mapping object to avoid alteration to resource mapping object
  const v2MappingsCopy = customCloneDeep(v2Mappings);

  const treeData = [];
  const emptyRowKey = generateId();

  // we need empty title to be passed here
  // for each node as the parent Tree is handling the titleRender for all
  // if empty title is not set here, then a dummy '---' title gets shown on each row hover
  let emptyMappingsTree = [{
    key: emptyRowKey,
    isEmptyRow: true,
    title: '',
    disabled,
    dataType: MAPPING_DATA_TYPES.STRING,
    sourceDataType: MAPPING_DATA_TYPES.STRING,
  }];

  // for csv and xlsx file types, the output is generated in rows format
  if (isCsvOrXlsxResourceForMapper2(importResource)) {
    emptyMappingsTree = [{
      key: emptyRowKey,
      title: '',
      dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
      generateDisabled: true,
      disabled,
      children: [
        {
          key: generateId(),
          title: '',
          dataType: MAPPING_DATA_TYPES.STRING,
          disabled,
          isEmptyRow: true,
          parentKey: emptyRowKey,
          sourceDataType: MAPPING_DATA_TYPES.STRING,
        },
      ],
    }];
  }

  if (isEmpty(v2MappingsCopy)) {
    return emptyMappingsTree;
  }

  const mappingsTreeData = recursivelyBuildTreeFromV2Mappings({mappings: v2MappingsCopy, treeData, disabled, isGroupedSampleData, requiredMappings});

  return mappingsTreeData;
};

export const isMappingWithoutExtract = (mapping, lookups) => {
  if (!mapping) return true;

  const {dataType, copySource, extract, extractsArrayHelper = []} = mapping;

  let missingExtract;

  if (ARRAY_DATA_TYPES.includes(dataType)) {
    if (!('hardCodedValue' in mapping || extractsArrayHelper.length)) {
      missingExtract = true;
    }
  } else if (dataType === MAPPING_DATA_TYPES.OBJECT) {
    // object data type can have empty extract if children are mapped
    // meaning copySource is no
    if (copySource === 'yes' && !extract) {
      missingExtract = true;
    }
  } else if (!('hardCodedValue' in mapping || extract)) {
    missingExtract = true;
  }

  if (missingExtract) {
    if (mapping.lookupName) {
      const lookup = lookups?.find(l => l.name === mapping.lookupName);

      // check if mapping has dynamic lookup
      if (!lookup || lookup.map) {
        return true;
      }
    } else {
      return true;
    }
  }

  return false;
};

export const hasV2MappingsInTreeData = (treeData = [], lookups) => {
  let hasMappings = false;

  for (let i = 0; i < treeData.length; i += 1) {
    const {generate, isRequired} = treeData[i];

    // if source is present
    if (!isMappingWithoutExtract(treeData[i], lookups)) {
      hasMappings = true;
      break;
    } else if (!isRequired && generate) {
      // if destination is present for non required fields, then it is an intended mapping.
      // for required fields, if no source is present, we consider that user has entered no mappings
      hasMappings = true;
      break;
    }

    if (treeData[i].children?.length) {
      hasMappings = hasV2MappingsInTreeData(treeData[i].children, lookups);
      if (hasMappings) break;
    }
  }

  return hasMappings;
};

const recursivelyBuildV2MappingsFromTree = ({v2TreeData, _mappingsToSave, lookups}) => {
  v2TreeData.forEach(mapping => {
    const {
      description,
      generate,
      dataType,
      extract,
      extractDateFormat,
      extractDateTimezone,
      generateDateFormat,
      generateDateTimezone,
      hardCodedValue,
      lookupName,
      default: mappingDefault,
      conditional = {},
      children,
      sourceDataType,
      extractsArrayHelper = [],
      isTabNode} = mapping;

    if (isTabNode) return;

    const newMapping = {
      description,
      generate,
      dataType,
      extract,
      sourceDataType: sourceDataType || MAPPING_DATA_TYPES.STRING,
      extractDateFormat,
      extractDateTimezone,
      generateDateFormat,
      generateDateTimezone,
      hardCodedValue,
      lookupName,
      default: mappingDefault,
      conditional: {
        when: conditional.when,
      },
      status: isMappingWithoutExtract(mapping, lookups) ? 'Draft' : 'Active',
    };

    if (PRIMITIVE_DATA_TYPES.includes(dataType)) {
      _mappingsToSave.push(newMapping);

      return;
    }
    if (dataType === MAPPING_DATA_TYPES.OBJECT) {
      // if extract is empty and children exists, then we add sub mappings
      // else if extract exists, then no sub mappings are needed as we copy from source as is
      if (!extract && children?.length) {
        delete newMapping.sourceDataType;

        newMapping.mappings = [];
        recursivelyBuildV2MappingsFromTree({v2TreeData: children, _mappingsToSave: newMapping.mappings, lookups});

        // if no valid children mappings are present, then parent is also marked as Draft
        const isAnyChildActive = newMapping.mappings.some(m => m.status === 'Active');

        if (!isAnyChildActive) {
          newMapping.status = 'Draft';
        }
      }
      _mappingsToSave.push(newMapping);

      return;
    }
    if (ARRAY_DATA_TYPES.includes(dataType)) {
      // these values are not available at parent level
      delete newMapping.sourceDataType;
      delete newMapping.default;
      if (newMapping.conditional.when === 'extract_not_empty') {
        delete newMapping.conditional;
      }

      if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
        const buildArrayHelper = [];

        newMapping.buildArrayHelper = buildArrayHelper;

        if (!extractsArrayHelper.length && children?.length) {
          // if no extracts are present, just save the sub mappings
          const subMappings = [];
          const newHelper = {
            mappings: subMappings,
          };

          recursivelyBuildV2MappingsFromTree({v2TreeData: children, _mappingsToSave: subMappings, lookups});

          buildArrayHelper.push(newHelper);
          _mappingsToSave.push(newMapping);

          return;
        }

        // no children exists, so only save extract
        if (!children?.length || (children.length === 1 && children[0].isTabNode)) {
          extractsArrayHelper.forEach(extractObj => {
            if (!extractObj.extract) return;

            buildArrayHelper.push({
              extract: getExtractFromUniqueId(extractObj.extract),
              sourceDataType: extractObj.sourceDataType || MAPPING_DATA_TYPES.STRING,
              default: extractObj.default,
              conditional: extractObj.conditional,
            });
          });
          _mappingsToSave.push(newMapping);

          return;
        }

        let isAnyActiveSourcePresent = false;

        // both extract and sub mappings exist
        extractsArrayHelper.forEach(extractObj => {
          if (!extractObj.extract) return;

          // find the children which matches the given extract index
          const matchingChildren = children.filter(c => {
            if (c.parentExtract === extractObj.extract) {
              return true;
            }

            return false;
          });

          const subMappings = [];
          const newHelper = {
            extract: getExtractFromUniqueId(extractObj.extract),
            sourceDataType: extractObj.sourceDataType || MAPPING_DATA_TYPES.STRING,
            default: extractObj.default,
            conditional: extractObj.conditional,
            mappings: subMappings,
          };

          recursivelyBuildV2MappingsFromTree({v2TreeData: matchingChildren, _mappingsToSave: subMappings, lookups});

          // if no valid children mappings are present, then parent is also marked as Draft
          const isAnyChildActive = newHelper.mappings.some(m => m.status === 'Active');

          if (isAnyChildActive) {
            isAnyActiveSourcePresent = true;
          }

          buildArrayHelper.push(newHelper);
        });

        // if no sources children are present, then parent is also marked as Draft
        if (!isAnyActiveSourcePresent) {
          newMapping.status = 'Draft';
        }
        _mappingsToSave.push(newMapping);

        return;
      }

      // primitive array types
      if (hardCodedValue !== undefined) {
        // no buildArrayHelper in this case
        _mappingsToSave.push(newMapping);

        return;
      }
      // no sub mappings are supported for primitive arrays
      if (extractsArrayHelper.length) {
        newMapping.buildArrayHelper = extractsArrayHelper.map(extractObj => {
          if (!extractObj.extract) return;

          return {
            extract: getExtractFromUniqueId(extractObj.extract),
            sourceDataType: extractObj.sourceDataType || MAPPING_DATA_TYPES.STRING,
            default: extractObj.default,
            conditional: extractObj.conditional,
          };
        });
        _mappingsToSave.push(newMapping);
      } else {
        // invalid mapping, save without buildArrayHelper
        _mappingsToSave.push(newMapping);
      }
    }
  });
};

export const buildV2MappingsFromTree = ({v2TreeData, lookups}) => {
  const _mappingsToSave = [];

  if (isEmpty(v2TreeData) || !hasV2MappingsInTreeData(v2TreeData, lookups)) {
    return _mappingsToSave;
  }

  recursivelyBuildV2MappingsFromTree({v2TreeData, _mappingsToSave, lookups});

  return _mappingsToSave;
};

// handles drag/drop logic for tree data
export function allowDrop({ dragNode, dropNode, dropPosition }) {
  if (!dragNode || !dropNode) return false;
  if (!dropNode.children && (dropPosition === 0)) return false;

  const {isTabNode: dragNodeIsTab, hidden: dragNodeIsHidden} = dragNode;
  const {isTabNode: dropNodeIsTab, hidden: dropNodeIsHidden} = dropNode;

  if (dragNodeIsHidden || dropNodeIsHidden) return false;

  if (dragNodeIsTab) return false;

  // can't drop above tab node
  if (dropNode?.children?.[0]?.isTabNode && dropPosition === 0) return false;

  // can drop just below tab node
  if (dropNodeIsTab && dropPosition === 1) return true;
  if (dropNodeIsTab) return false;

  return true;
}

// verify if drag position and drop position are same
export function isDropDragPositionSame({ dropPosition, dragNode, dropNode, dropSubArrIndex, dragNodeIndex, hasTabbedRow = false }) {
  const dragParentKey = dragNode.parentKey;
  const dropParentKey = dropNode.parentKey;

  if (dropPosition === 0) { // drag obj is inserted as the 0th child of a parent
    // when dropPosition is 0, dropNode points to parent node
    if (dragParentKey === dropNode.key) {
      // if child is already at 0th position, nothing to do
      if (dragNodeIndex === 0 || (hasTabbedRow && dragNodeIndex === 1)) {
        return true;
      }
    }
  } else if (dropPosition === -1) {
    if ((!dragParentKey && dropParentKey) || (dragParentKey && !dropParentKey)) {
      return false;
    }
    // when no parent keys present or parent keys matches, drag and drop nodes are of same level
    if ((dragParentKey === dropParentKey) && (dropSubArrIndex === dragNodeIndex)) return true;
  } else if (dropPosition === 1) { // drag obj inserted after drop node
    if ((!dragParentKey && dropParentKey) || (dragParentKey && !dropParentKey)) return false;

    // when no parent keys present or parent keys matches, drag and drop nodes are of same level
    if ((dragParentKey === dropParentKey) && (dropSubArrIndex + 1 === dragNodeIndex)) return true;
  }

  return false;
}

// given a tree data, some prop and its value
// this util finds the node with matching prop and returns
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

export const getNewChildrenToAdd = (parentNode, destinationNode) => {
  // the destination node is expected to be a child - so checks for parentKey and generate field
  if (!parentNode || !destinationNode || !destinationNode.parentKey || !destinationNode.generate) {
    return [];
  }

  // when there are extracts for the parentNodes, populate the destination in all the extracts where this node does not exist
  if (parentNode.extractsArrayHelper?.length) {
    const extractsToAddEmptyDestinationNode = [];

    parentNode.extractsArrayHelper.forEach(extractConfig => {
      const currentExtract = extractConfig.extract;
      const hasDestNode = parentNode.children?.some(childNode => {
        const { dataType, generate, parentExtract } = childNode;

        // checks for datatype, generate to check if the node exist for this extract
        return dataType === destinationNode.dataType && generate === destinationNode.generate && parentExtract === currentExtract;
      });

      if (!hasDestNode && extractConfig.copySource !== 'yes') {
        // make a list of extracts where the destination node does not exist
        extractsToAddEmptyDestinationNode.push(currentExtract);
      }
    });
    // fill the node under all the extracts that does not have
    const newChildren = extractsToAddEmptyDestinationNode.map(e => {
      const newChildNode = constructNodeWithEmptySource({...destinationNode, parentExtract: e, parentKey: parentNode.key});

      return newChildNode;
    });

    return newChildren;
  }

  const hasDestNode = parentNode.children?.some(childNode => {
    const { dataType, generate } = childNode;

    return dataType === destinationNode.dataType && generate === destinationNode.generate;
  });

  if (!hasDestNode && parentNode.copySource !== 'yes') {
    // Incase the parent has no extracts and does not contain this node, add the new node directly as a child
    return [constructNodeWithEmptySource({...destinationNode, parentKey: parentNode.key, parentExtract: ''})];
  }

  return [];
};

// recursively look for all parentNodes for a given node
// Ex: For a node with jsonPath - a[*].b[*].c.d, the parent nodes returned are in the order of [a,b,c]
export const findAllParentNodesForNode = (treeData, nodeKey, output = []) => {
  const {node} = findNodeInTree(treeData, 'key', nodeKey);

  if (!node || !node.parentKey) return output;

  findAllParentNodesForNode(treeData, node.parentKey, output);

  const {node: parentNode} = findNodeInTree(treeData, 'key', node.parentKey);

  output.push(parentNode);

  return output;
};

// Fetches all possible parent nodes that contain the same pattern of mapping as given in the order of matchingNodes
// Ex: For a node with jsonPath - a[*].b[*].c.d, this fn is called with fn([b,c], [a]) as 'a' is the first parentNode and b,c are the pattern nodes to reach node 'd'
export const findAllPossibleDestinationMatchingParentNodes = (matchingNodes = [], parentNodes = []) => {
  // when there are no more nodes to match or no leaf nodes to go through return the leaf nodes
  if (!matchingNodes.length || !parentNodes.length) return parentNodes;

  // always fetch the first node from matchingNodes and perform match
  const [currentNodeMatch] = matchingNodes;

  let nextLevelParentNodes = [];

  parentNodes.forEach(node => {
    // filters all children that matches the currentNodeMatch destination and adds that to the list
    const matchedChildren = node.children.filter(childNode => childNode.generate === currentNodeMatch.generate && childNode.dataType === currentNodeMatch.dataType);

    nextLevelParentNodes = [...nextLevelParentNodes, ...matchedChildren];
  });

  // recursively pass the above list with the next available node from matchingNodes to match
  return findAllPossibleDestinationMatchingParentNodes(matchingNodes.slice(1), nextLevelParentNodes);
};

export const isMappingRowTouched = (node, lookups) => {
  if (!node || isEmpty(node)) return false;

  const isEmptyRow = (!node.generate && node.dataType === MAPPING_DATA_TYPES.STRING && isMappingWithoutExtract(node, lookups));

  return !isEmptyRow;
};

/**
   * This util deals with destination node additions/updates inside an Object array node's children
   * It updates the children with accommodating the added/updated node with destination at all possible places
   * which matches destination structure with multiple extracts
   */
export const insertSiblingsOnDestinationUpdate = (treeData, newNode, lookups) => {
  // do nothing if the node itself is the top node
  if (!newNode.parentKey) return;

  // fetch all parent nodes from top to bottom
  const parentNodes = findAllParentNodesForNode(treeData, newNode.key);

  const objArrayParentNodeIndex = parentNodes.findIndex(node => node.dataType === MAPPING_DATA_TYPES.OBJECTARRAY);

  // if there is no object array parent, do nothing
  if (objArrayParentNodeIndex === -1) return treeData;
  // fetches the first parent from top which is Object array, as we need to process nodes which are children of an object array node
  const [topNode, ...restOfParentNodes] = parentNodes.slice(objArrayParentNodeIndex);

  const matchingLeafNodes = findAllPossibleDestinationMatchingParentNodes(restOfParentNodes, [topNode]);

  matchingLeafNodes.forEach(parentNode => {
    const newChildren = getNewChildrenToAdd(parentNode, newNode);
    let updatedChildren = [...parentNode.children || [], ...newChildren];

    if (parentNode.key === newNode.parentKey) {
      updatedChildren = updatedChildren.filter(childNode => {
        if (childNode.parentExtract === newNode.parentExtract) {
          // ignore any filtering for the same tab's children
          return true;
        }

        // for all other source tabs, filter out empty nodes
        return isMappingRowTouched(childNode);
      });
    } else {
      updatedChildren = updatedChildren.filter(childNode => isMappingRowTouched(childNode, lookups));
    }
    // eslint-disable-next-line no-param-reassign
    parentNode.children = updatedChildren;
  });
};

export const TYPEOF_TO_DATA_TYPE = {
  '[object String]': MAPPING_DATA_TYPES.STRING,
  '[object Number]': MAPPING_DATA_TYPES.NUMBER,
  '[object Boolean]': MAPPING_DATA_TYPES.BOOLEAN,
  '[object Null]': MAPPING_DATA_TYPES.STRING,
};

function recursivelyCreateDestinationStructure({dataObj, treeData, parentJsonPath = '', parentKey, parentExtract, requiredMappings}) {
  // iterate over all keys and construct the tree
  Object.keys(dataObj).forEach(propName => {
    const v = dataObj[propName];
    const type = Object.prototype.toString.apply(v);

    const jsonPath = `${parentJsonPath ? `${parentJsonPath}.` : ''}${propName}`;

    const key = generateId();

    const isRequired = requiredMappings.includes(jsonPath);

    const nodeToPush = {
      key,
      generate: propName,
      jsonPath,
      parentKey,
      parentExtract,
      title: '',
      dataType: TYPEOF_TO_DATA_TYPE[type],
      isRequired,
    };

    treeData.push(nodeToPush);

    // primitive type
    if (type !== '[object Array]' && type !== '[object Object]') {
      // nothing to do
      return;
    }

    if (type === '[object Object]') {
      // suffix with . for object fields
      const isRequired = requiredMappings.some(r => r.startsWith(`${jsonPath}.`));

      const children = [];

      nodeToPush.isRequired = isRequired;
      nodeToPush.dataType = MAPPING_DATA_TYPES.OBJECT;
      nodeToPush.children = children;

      recursivelyCreateDestinationStructure({dataObj: v, treeData: children, parentJsonPath: jsonPath, parentKey: key, requiredMappings});
      // push empty row
      if (isEmpty(nodeToPush.children)) {
        nodeToPush.children.push({
          key: generateId(),
          title: '',
          dataType: MAPPING_DATA_TYPES.STRING,
          isEmptyRow: true,
          parentKey: nodeToPush.key,
        });
      }

      return;
    }

    if (type === '[object Array]') {
      // suffix with [*] for object array fields
      const isRequired = requiredMappings.some(r => r.startsWith(`${jsonPath}[*]`));

      // if empty array, consider it as object array
      if (isEmpty(v)) {
        nodeToPush.isRequired = isRequired;
        nodeToPush.dataType = MAPPING_DATA_TYPES.OBJECTARRAY;
        nodeToPush.children = [{
          key: generateId(),
          title: '',
          dataType: MAPPING_DATA_TYPES.STRING,
          isEmptyRow: true,
          parentKey: nodeToPush.key,
        }];

        return;
      }

      if (Object.prototype.toString.apply(v[0]) === '[object Object]' && !isEmpty(v[0])) {
        const children = [];

        nodeToPush.isRequired = isRequired;
        nodeToPush.dataType = MAPPING_DATA_TYPES.OBJECTARRAY;
        nodeToPush.children = children;

        recursivelyCreateDestinationStructure({dataObj: getUnionObject(v), treeData: children, parentJsonPath: jsonPath ? `${jsonPath}[*]` : '', parentKey: key, requiredMappings});

        // push empty row
        if (isEmpty(nodeToPush.children)) {
          nodeToPush.children.push({
            key: generateId(),
            title: '',
            dataType: MAPPING_DATA_TYPES.STRING,
            isEmptyRow: true,
            parentKey: nodeToPush.key,
          });
        }

        return;
      }

      // primitive array
      const valueType = Object.prototype.toString.apply(v[0]);

      nodeToPush.dataType = `${TYPEOF_TO_DATA_TYPE[valueType]}array`;
    }
  });
}

export const autoCreateDestinationStructure = (importSampleData, requiredMappings = [], isCSVOrXLSX) => {
  let treeData = [];

  if (!importSampleData) return treeData;
  const parentKey = generateId();

  if (isCSVOrXLSX) {
    treeData = [{
      key: parentKey,
      title: '',
      dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
      generateDisabled: true,
      children: [],
    }];
  }

  const dataObj = pickFirstObject(importSampleData);

  recursivelyCreateDestinationStructure({
    dataObj,
    treeData: isCSVOrXLSX ? treeData[0].children : treeData,
    requiredMappings,
    parentKey: isCSVOrXLSX ? parentKey : undefined,
  });

  return treeData;
};

export const deleteNonRequiredMappings = (treeData = []) => treeData.reduce((acc, m) => {
  const clonedMapping = {...m};

  if (clonedMapping.children?.length) {
    clonedMapping.children = deleteNonRequiredMappings(clonedMapping.children);
  }
  if (clonedMapping.isRequired || clonedMapping.children?.length) {
    acc.push(clonedMapping);
  }

  return acc;
}, []);

function recursivelyBuildExtractsTree({dataObj, treeData, parentKey, parentJsonPath = ''}) {
  // iterate over all keys and construct the tree
  Object.keys(dataObj).forEach(propName => {
    const v = dataObj[propName];
    const type = Object.prototype.toString.apply(v);
    const key = generateId();
    const jsonPath = `${parentJsonPath ? `${parentJsonPath}.` : ''}${propName}`;

    const nodeToPush = {
      key,
      parentKey,
      title: '',
      jsonPath,
      propName,
      dataType: TYPEOF_TO_DATA_TYPE[type],
    };

    treeData.push(nodeToPush);

    // primitive type
    if (type !== '[object Array]' && type !== '[object Object]') {
      // nothing to do
      return;
    }

    if (type === '[object Object]') {
      const children = [];

      nodeToPush.dataType = MAPPING_DATA_TYPES.OBJECT;
      nodeToPush.children = children;

      recursivelyBuildExtractsTree({dataObj: v, treeData: children, parentKey: key, parentJsonPath: jsonPath});

      return;
    }

    if (type === '[object Array]') {
      // if empty array, consider it as object array
      if (isEmpty(v)) {
        nodeToPush.jsonPath = `${jsonPath}[*]`;
        nodeToPush.dataType = '[object]';

        return;
      }

      if (Object.prototype.toString.apply(v[0]) === '[object Object]' && !isEmpty(v[0])) {
        const children = [];

        nodeToPush.jsonPath = `${jsonPath}[*]`;
        nodeToPush.dataType = '[object]';
        nodeToPush.children = children;

        recursivelyBuildExtractsTree({dataObj: getUnionObject(v), treeData: children, parentKey: key, parentJsonPath: `${jsonPath}[*]`});

        return;
      }

      // primitive array
      const valueType = Object.prototype.toString.apply(v[0]);

      nodeToPush.dataType = `[${TYPEOF_TO_DATA_TYPE[valueType]}]`;
    }
  });
}

// this util generates the tree structure for the sample data fields
export const buildExtractsTree = sampleData => {
  const treeData = [];
  const children = [];

  if (!sampleData) return treeData;

  const dataObj = pickFirstObject(sampleData);

  if (!dataObj) return treeData;

  const key = generateId();

  // add first default $ path
  treeData.push({
    key,
    title: '',
    dataType: Array.isArray(sampleData) ? '[object]' : 'object',
    propName: '$',
    children,
  });

  recursivelyBuildExtractsTree({
    dataObj,
    treeData: children,
    parentKey: key,
  });

  return treeData;
};

export const getSelectedKeys = (extractsTreeNode, selectedValues = [], selectedKeys = []) => {
  if (isEmpty(extractsTreeNode) || !extractsTreeNode.children?.length) return selectedKeys;

  extractsTreeNode.children.forEach(node => {
    const {key, jsonPath} = node;

    // if jsonPath matches the selected value, then add its key
    const selected = selectedValues.includes(jsonPath);

    if (selected) {
      selectedKeys.push(key);
    }

    if (node.children) {
      getSelectedKeys(node, selectedValues, selectedKeys);
    }
  });

  return selectedKeys;
};

// for the given selectedValue and type it will match node in the given tree and add its key to selectedKeys
export const getSelectedKeyInDestinationDropdown = (treeData, selectedValue, type) => {
  const selectedKeys = [];

  if (isEmpty(treeData) || !treeData.children?.length) return selectedKeys;

  treeData.children.forEach(node => {
    const {key, generate, dataType} = node;

    if (generate === selectedValue && dataType === type) {
      selectedKeys.push(key);
    }
  });

  return selectedKeys;
};

// recursively look for all parentExtracts for a given node
export const findAllParentExtractsForNode = (treeData, output = [], nodeKey) => {
  const {node} = findNodeInTree(treeData, 'key', nodeKey);

  if (!node || !node.parentKey) return output;

  // get the grand parents first
  // this sequence is required by BE
  findAllParentExtractsForNode(treeData, output, node.parentKey);

  if (node.parentExtract) {
    output.push(getExtractFromUniqueId(node.parentExtract));
  }

  return output;
};

// recursively look for nearest parentExtract for a given node
export const findNearestParentExtractForNode = (treeData, nodeKey) => {
  const {node} = findNodeInTree(treeData, 'key', nodeKey);

  if (!node || !node.parentKey) return '';

  if (node.parentExtract) return node.parentExtract;

  return findNearestParentExtractForNode(treeData, node.parentKey);
};

const getCursorPositionWord = (value, cursorPosition) => {
  const wordAfterPosition = value.substring(cursorPosition).match(/^[^,]+/);
  const wordBeforePosition = value.substring(0, cursorPosition).match(/[^,]+$/);

  if (!wordBeforePosition && !wordAfterPosition) return '';

  return (wordBeforePosition || '') + (wordAfterPosition || '');
};

// this util handles the comma separated values use-case
// and returns the final input after user selects a node
export const getFinalSelectedExtracts = (node, inputValue = '', isArrayType, isGroupedSampleData, nodeKey, treeData, cursorPosition) => {
  const prefix = getDefaultExtractPath(isGroupedSampleData);
  const {jsonPath = ''} = node || {};
  let fullJsonPath = jsonPath ? `${prefix}.${jsonPath}` : prefix;

  // for child rows with parent extract
  // the children json path should not include [*] in the parent path
  const parentExtract = findNearestParentExtractForNode(treeData, nodeKey);

  if (parentExtract) {
    const splitParentExtract = parentExtract.split('.') || [];
    const splitFullJsonPath = fullJsonPath.split('.') || [];

    splitParentExtract.forEach((e, i) => {
      const uniqueExt = getExtractFromUniqueId(e);

      // match the parent path on curr index with the current node json path
      // and remove [*] from child path
      if (uniqueExt.includes('[*]')) {
        if (splitFullJsonPath[i] === uniqueExt) {
          splitFullJsonPath[i] = splitFullJsonPath[i].replace('[*]', '');
        }
      } else if (splitFullJsonPath[i] === `${uniqueExt}[*]`) {
        splitFullJsonPath[i] = splitFullJsonPath[i].replace('[*]', '');
      }
    });

    fullJsonPath = splitFullJsonPath.join('.');
  }

  let newValue = fullJsonPath;

  // handle comma separated scenario for array data types
  if (isArrayType) {
    const splitInput = inputValue.split(',');
    const valuesLen = splitInput.length;

    const lastChar = inputValue.charAt(inputValue.length - 1);

    // if user has typed comma before selecting new value, we append the new value
    // else replace the last value after comma
    if (lastChar === ',') {
      newValue = inputValue + fullJsonPath;
    } else {
      // handle edge case when user don't click on last position
      if (!cursorPosition) {
        splitInput[valuesLen - 1] = fullJsonPath;
        newValue = splitInput.join(',');

        return newValue;
      }
      const word = getCursorPositionWord(inputValue, cursorPosition);
      const updatedValue = inputValue.replace(word, fullJsonPath);

      newValue = updatedValue;
    }
  }

  return newValue;
};

const recursivelyCompareV2Mappings = (_mappingObj1 = {}, _mappingObj2 = {}) => {
  if ((!isEmpty(_mappingObj1.children) && isEmpty(_mappingObj2.children)) || (isEmpty(_mappingObj1.children) && !isEmpty(_mappingObj2.children))) return false;

  // below fields are for tree view only
  // not actual BE fields, hence destructuring these before comparing
  const {
    key: key1,
    parentKey: pKey1,
    title: t1,
    disabled: d1,
    parentExtract: p1,
    mappings: m1,
    buildArrayHelper: b1,
    children: c1,
    isRequired: req1,
    hidden: h1,
    className: cl1,
    copySource: cs1,
    activeTab: ta1,
    isEmptyRow: i1,
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
    isRequired: req2,
    hidden: h2,
    className: cl2,
    copySource: cs2,
    activeTab: ta2,
    isEmptyRow: i2,
    ...mappingObj2
  } = _mappingObj2;

  const isEqualObj = isEqual(mappingObj1, mappingObj2);

  if (!isEqualObj) return false;

  if (!_mappingObj1.children && !_mappingObj2.children) return true;
  if (_mappingObj1.children.length !== _mappingObj2.children.length) return false;

  // both have children so need to compare children now
  let isChildrenEqual = true;

  for (let i = 0; i < _mappingObj1.children.length; i += 1) {
    isChildrenEqual = recursivelyCompareV2Mappings(_mappingObj1.children[i], _mappingObj2.children[i]);
    if (!isChildrenEqual) {
      break;
    }
  }

  return isChildrenEqual;
};

// handles the dirty check to enable/disable save button
export const compareV2Mappings = (tree1 = [], tree2 = []) => {
  let isV2MappingsChanged = tree1.length !== tree2.length;

  if (isV2MappingsChanged) return true;

  // change of order of mappings is treated as Mapping change
  for (let i = 0; i < tree1.length; i += 1) {
    isV2MappingsChanged = !recursivelyCompareV2Mappings(tree1[i], tree2[i]);
    if (isV2MappingsChanged) break;
  }

  return isV2MappingsChanged;
};

const validateSourceDataType = mapping => {
  const {
    jsonPath = '',
    dataType,
    sourceDataType = MAPPING_DATA_TYPES.STRING,
    extractsArrayHelper = [],
    extract,
  } = mapping;
  const errorArr = [];
  const incorrectSourceDataTypes = WRONG_SOURCE_DATA_TYPES_LIST[dataType];

  switch (dataType) {
    case MAPPING_DATA_TYPES.NUMBER:
    case MAPPING_DATA_TYPES.BOOLEAN:
      if (incorrectSourceDataTypes.has(sourceDataType)) {
        errorArr.push({
          jsonPath,
          dataType: DATA_TYPES_REPRESENTATION_LIST[dataType],
          sourceDataType: DATA_TYPES_REPRESENTATION_LIST[sourceDataType],
        });
      }
      break;
    case MAPPING_DATA_TYPES.NUMBERARRAY:
    case MAPPING_DATA_TYPES.BOOLEANARRAY:
    case MAPPING_DATA_TYPES.OBJECTARRAY:
      extractsArrayHelper.forEach(({
        sourceDataType = MAPPING_DATA_TYPES.STRING,
      }) => {
        if (incorrectSourceDataTypes.has(sourceDataType)) {
          errorArr.push({
            jsonPath,
            dataType: DATA_TYPES_REPRESENTATION_LIST[dataType],
            sourceDataType: DATA_TYPES_REPRESENTATION_LIST[sourceDataType],
          });
        }
      });
      break;
    case MAPPING_DATA_TYPES.OBJECT:
      if (extract && incorrectSourceDataTypes.has(sourceDataType)) {
        errorArr.push({
          jsonPath,
          dataType: DATA_TYPES_REPRESENTATION_LIST[dataType],
          sourceDataType: DATA_TYPES_REPRESENTATION_LIST[sourceDataType],
        });
      }
      break;
    default:
      break;
  }

  return errorArr;
};

// this util will delete values in the jsonPathsSet if the value is present in v2TreeData
const recursivelyValidateV2MappingsForRequiredfields = (v2TreeData, jsonPathsSet) => {
  if (isEmpty(v2TreeData)) return;

  forEach(v2TreeData, mapping => {
    const {
      generate,
      generateDisabled,
      jsonPath = '',
      dataType = '',
      isTabNode,
    } = mapping;

    if (isTabNode) return;
    if (generateDisabled || generate) {
      if (jsonPath && dataType) jsonPathsSet.delete(`${jsonPath}+${dataType}`);

      if (mapping.children) recursivelyValidateV2MappingsForRequiredfields(mapping.children, jsonPathsSet);
    }
  });
};

const recursivelyValidateV2Mappings = ({
  v2TreeData,
  lookups,
  isGroupedSampleData,
  dupMap = {},
  duplicateMappings = [],
  mappingsWithoutGenerates = [],
  missingExtractGenerateNames = [],
  expressionNotSupported = [],
  onlyJsonPathSupported = [],
  wrongHandlebarExp = [],
  dataTypeValidationErrors = [],
}) => {
  v2TreeData.forEach(mapping => {
    const {
      dataType,
      extract,
      extractsArrayHelper,
      hardCodedValue,
      isRequired,
      parentKey,
      parentExtract,
      generate,
      generateDisabled,
      jsonPath,
      isTabNode,
    } = mapping;

    if (isTabNode) return;
    const missingSource = isMappingWithoutExtract(mapping, lookups);

    if (generate) {
      const dupKey = parentKey ? `${parentKey}-${parentExtract}-${generate}` : generate;

      // dupMap stores a list of mappings with generate
      // if it already has an entry for same generate, then its a duplicate mapping
      if (dupMap[dupKey]) {
        duplicateMappings.push(jsonPath || generate);
      } else {
        // eslint-disable-next-line no-param-reassign
        dupMap[dupKey] = jsonPath || generate;
      }
    } else if (!missingSource && !generateDisabled) {
      mappingsWithoutGenerates.push(mapping);
    }

    // check for missing extracts only if its a required mapping
    if (isRequired && missingSource) {
      missingExtractGenerateNames.push(mapping.jsonPath || mapping.generate);
    }

    if (hardCodedValue && (dataType === MAPPING_DATA_TYPES.OBJECT || dataType === MAPPING_DATA_TYPES.OBJECTARRAY)) {
      // hard-coded not supported
      onlyJsonPathSupported.push(mapping.jsonPath || mapping.generate);
    }

    if (ARRAY_DATA_TYPES.includes(dataType) || dataType === MAPPING_DATA_TYPES.OBJECT) {
      // handlebars not supported
      const splitExtracts = extract?.split(',') || getCombinedExtract(extractsArrayHelper) || [];
      const invalidSource = splitExtracts.filter(e => {
        if (isMapper2HandlebarExpression(e, hardCodedValue)) return true;

        return false;
      });

      if (invalidSource.length) {
        if (dataType === MAPPING_DATA_TYPES.OBJECT || dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
          onlyJsonPathSupported.push(mapping.jsonPath || mapping.generate);
        } else {
          expressionNotSupported.push(mapping.jsonPath || mapping.generate);
        }
      }
    }

    // HandleBar Expressions are allowed in case of string, number or boolean data type only
    if (PRIMITIVE_DATA_TYPES.includes(dataType)) {
      // wrong rows or record based handlebars not supported
      const extractString = extract || '';

      const rowOrRecordRegEx = isGroupedSampleData
        ? /(\{\{((.*?\s+record)|(\s*record))\..*\}\})/i
        : /(\{\{((.*?\s+rows)|(\s*rows))\..*\}\})/i;

      if (rowOrRecordRegEx.test(extractString)) {
        wrongHandlebarExp.push(mapping.jsonPath || mapping.generate);
      }
    }

    // Validate when both destination and source are present
    if (
      !mapping.generateDisabled &&
      dataType in WRONG_SOURCE_DATA_TYPES_LIST &&
      generate &&
      !missingSource
    ) {
      const errors = validateSourceDataType(mapping);

      dataTypeValidationErrors.push(...errors);
    }

    if (mapping.children?.length) {
      recursivelyValidateV2Mappings({
        v2TreeData: mapping.children,
        lookups,
        isGroupedSampleData,
        dupMap,
        duplicateMappings,
        mappingsWithoutGenerates,
        missingExtractGenerateNames,
        expressionNotSupported,
        onlyJsonPathSupported,
        wrongHandlebarExp,
        dataTypeValidationErrors,
      });
    }
  });
};

const validateV2Mappings = (v2TreeData, lookups, isGroupedSampleData, requiredMappingsJsonPaths) => {
  const duplicateMappings = [];
  const mappingsWithoutGenerates = [];
  const missingExtractGenerateNames = [];
  const expressionNotSupported = [];
  const onlyJsonPathSupported = [];
  const wrongHandlebarExp = [];
  const dataTypeValidationErrors = [];

  recursivelyValidateV2Mappings({
    v2TreeData,
    lookups,
    isGroupedSampleData,
    duplicateMappings,
    mappingsWithoutGenerates,
    missingExtractGenerateNames,
    expressionNotSupported,
    onlyJsonPathSupported,
    wrongHandlebarExp,
    dataTypeValidationErrors,
  });

  if (duplicateMappings.length) {
    return {
      isSuccess: false,
      errMessage: errorMessageStore('MAPPER2_DUP_GENERATE', {fields: duplicateMappings.join(',')}),
    };
  }

  if (mappingsWithoutGenerates.length) {
    return {
      isSuccess: false,
      errMessage: errorMessageStore('MAPPER2_MISSING_GENERATE'),
    };
  }

  if (missingExtractGenerateNames.length) {
    return {
      isSuccess: false,
      errMessage: errorMessageStore('MAPPER2_MISSING_EXTRACT', {fields: missingExtractGenerateNames.join(',')}),
    };
  }

  if (expressionNotSupported.length) {
    return {
      isSuccess: false,
      errMessage: errorMessageStore('MAPPER2_EXPRESSION_NOT_SUPPORTED', {fields: expressionNotSupported.join(',')}),
    };
  }

  if (onlyJsonPathSupported.length) {
    return {
      isSuccess: false,
      errMessage: errorMessageStore('MAPPER2_ONLY_JSON_PATH_SUPPORT', {fields: onlyJsonPathSupported.join(',')}),
    };
  }

  if (wrongHandlebarExp.length) {
    const errMessage = isGroupedSampleData
      ? errorMessageStore('MAPPER2_WRONG_HANDLEBAR_FOR_ROWS')
      : errorMessageStore('MAPPER2_WRONG_HANDLEBAR_FOR_RECORD');

    return {
      isSuccess: false,
      errMessage,
    };
  }

  if (dataTypeValidationErrors.length) {
    const errMessageList = dataTypeValidationErrors.map(item => errorMessageStore('MAPPER2_WRONG_SOURCE_DATA_TYPE', item));

    return {
      isSuccess: false,
      errMessage: errMessageList.join('\n'),
    };
  }

  if (requiredMappingsJsonPaths?.length) {
    const jsonPathsSet = new Set(requiredMappingsJsonPaths);

    recursivelyValidateV2MappingsForRequiredfields(v2TreeData, jsonPathsSet);

    if (jsonPathsSet.size !== 0) {
      return {
        isSuccess: false,
        errMessage: errorMessageStore('MAPPER2_MISSING_REQUIRED_FIELDS'),
      };
    }
  }

  return { isSuccess: true };
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

// if the parent jsonPath has updated,
// we need to update all its children jsonPaths as well
export const updateChildrenJSONPath = parentNode => {
  if (!parentNode) return parentNode;

  const {jsonPath: parentJsonPath, dataType: parentDataType, children} = parentNode;

  if (isEmpty(children) || !parentJsonPath) return parentNode;

  children.forEach(child => {
    if (!child.generate || child.isTabNode) return;
    // eslint-disable-next-line no-param-reassign
    child.jsonPath = parentDataType === MAPPING_DATA_TYPES.OBJECTARRAY ? `${parentJsonPath}[*].${child.generate}` : `${parentJsonPath}.${child.generate}`;

    if (child.children?.length) {
      // eslint-disable-next-line no-param-reassign
      child = updateChildrenJSONPath(child);
    }
  });

  return parentNode;
};

export const applyRequiredFilter = nodes => {
  if (isEmpty(nodes)) return nodes;

  return nodes.filter(node => {
    if (node.isTabNode) return true;

    if (node.isRequired) {
      // if the required node contains children, do recursive call to filter all its required children
      // eslint-disable-next-line no-param-reassign
      if (!isEmpty(node.children)) node.children = applyRequiredFilter(node.children);

      return true;
    }

    return false;
  });
};

/* eslint-disable no-param-reassign */
export const applyMappedFilter = (v2TreeData, lookups, isReqApplied = false) => {
  if (isEmpty(v2TreeData)) return v2TreeData;

  return v2TreeData.filter(mapping => {
    const {
      dataType,
      extract,
      extractsArrayHelper = [],
      isTabNode,
      isRequired,
    } = mapping;

    if (isTabNode) return true;

    const canAddToTree = !isMappingWithoutExtract(mapping, lookups) || (isReqApplied && isRequired);

    // Any data type except object and object arrays
    if (![MAPPING_DATA_TYPES.OBJECTARRAY, MAPPING_DATA_TYPES.OBJECT].includes(dataType)) return canAddToTree;
    if (dataType === MAPPING_DATA_TYPES.OBJECT) {
      // if extract exists, then generate is copied from source as is
      if (extract) return canAddToTree;
      // if extract is empty and children exists, then make a recursive call to check the children
      if (mapping.children?.length) {
        mapping.children = applyMappedFilter(mapping.children, lookups, isReqApplied);

        // if all children are filtered out, then remove the parent as well
        return !!mapping.children?.length;
      }
    } else if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      // if children exist
      if (mapping.children?.length) {
        // make a recursive call to filter the children
        mapping.children = applyMappedFilter(mapping.children, lookups, isReqApplied);

        mapping.extractsWithoutMappings = [];
        let isActiveTabDisabled = false;

        extractsArrayHelper.forEach((extractItem, index) => {
          const canDisable = !mapping.children.some(child => !child.isTabNode && (child.parentExtract === extractItem.extract));

          if (canDisable) {
            mapping.extractsWithoutMappings.push(extractItem.extract);
            if (mapping.activeTab === index) isActiveTabDisabled = true;
          }
        });

        // if Active tab is disabled, change the Active tab
        if (isActiveTabDisabled) {
          // finding the new non-empty tab index
          const newIndex = extractsArrayHelper.findIndex(item => !mapping.extractsWithoutMappings.includes(item.extract));

          if (newIndex > -1) {
            // Passing the useOriginalNode argument as true so as to avoid deep cloning of the node
            // as deep cloning is not updating the data properly because the mapping argument cannot be modified inside the filter method
            hideOtherTabRows(mapping, extractsArrayHelper[newIndex].extract, undefined, true);
            mapping.activeTab = newIndex;
          }
        }

        // if all children are filtered out, then remove the parent as well
        return mapping.children.some(child => !child.isTabNode);
      }

      // if no children and no extract exist, remove the field
      if (!extractsArrayHelper.length) return false;

      // if no children exist but extract, then generate is copied from source as-is
      return true;
    }

    return false;
  });
};
/* eslint-enable */

// to search the generate of the field mapping
export const filterNode = (node, searchKey) => {
  if (!searchKey) return false;
  if (node?.generate?.toUpperCase().indexOf(searchKey.toUpperCase()) > -1) {
    return true;
  }

  return false;
};

// check if any children is matching the searchKey
export const parentHasAnyChildMatch = (v2TreeData = [], searchKey, lookups) => {
  let matched = false;

  forEach(v2TreeData, mapping => {
    if (mapping.isTabNode) return;
    const canAddToTree = filterNode(mapping, searchKey) || !isMappingRowTouched(mapping, lookups);

    if (canAddToTree) {
      matched = true;

      return false;
    }

    if (mapping.children?.length) {
      matched = parentHasAnyChildMatch(mapping.children, searchKey, lookups);
      if (matched) return false;
    }
  });

  return matched;
};

/* eslint-disable no-param-reassign */
export const applySearchFilter = (v2TreeData = [], lookups, searchKey, expandedKeys = []) => {
  if (isEmpty(v2TreeData) || !searchKey) return v2TreeData;

  return v2TreeData.filter(mapping => {
    const {
      dataType,
      extractsArrayHelper = [],
      isTabNode,
    } = mapping;

    if (isTabNode) return true;

    const parentMatched = filterNode(mapping, searchKey);

    if (parentMatched) {
      if (mapping.children?.length) {
        // if parentMatched, then all children should be shown but parent
        // only needs to be expanded if any child is a match
        if (parentHasAnyChildMatch(mapping.children, searchKey, lookups)) {
          expandedKeys.push(mapping.key);
        }
      }

      return true;
    }

    if (dataType === MAPPING_DATA_TYPES.OBJECT) {
      // make a recursive call to check the children
      mapping.children = applySearchFilter(mapping.children, lookups, searchKey, expandedKeys);
      const someChildrenMatch = !!mapping.children?.length;

      // if any child matched, then only parent should be expanded
      if (someChildrenMatch) {
        expandedKeys.push(mapping.key);
      }

      // if all children are filtered out, then remove the parent as well
      return someChildrenMatch;
    }

    if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      // make a recursive call to check the children
      mapping.children = applySearchFilter(mapping.children, lookups, searchKey, expandedKeys);
      const someChildrenMatch = mapping.children?.some(child => !child.isTabNode);

      // if any child matched, then only parent should be expanded
      if (someChildrenMatch) {
        expandedKeys.push(mapping.key);
      }

      mapping.extractsWithoutMappings = [];
      let isActiveTabDisabled = false;

      extractsArrayHelper.forEach((extractItem, index) => {
        const noChildren = !mapping.children?.some(child => !child.isTabNode && (child.parentExtract === extractItem.extract));

        if (noChildren) {
          mapping.extractsWithoutMappings.push(extractItem.extract);
          if (mapping.activeTab === index) isActiveTabDisabled = true;
        }
      });

      // if Active tab is disabled, change the Active tab
      if (isActiveTabDisabled) {
        // finding the new non-empty tab index
        const newIndex = extractsArrayHelper.findIndex(item => !mapping.extractsWithoutMappings.includes(item.extract));

        if (newIndex > -1) {
          // Passing the useOriginalNode argument as true so as to avoid deep cloning of the node
          // as deep cloning is not updating the data properly because the mapping argument cannot be modified inside the filter method
          hideOtherTabRows(mapping, extractsArrayHelper[newIndex].extract, undefined, true);
          mapping.activeTab = newIndex;
        }
      }

      // if all children are filtered out, then remove the parent as well
      return someChildrenMatch;
    }

    return false;
  });
};
/* eslint-enable */

// find the total match count based on filterNode func
export const countMatches = (v2TreeData = [], searchKey) => {
  let count = 0;

  v2TreeData.forEach(mapping => {
    if (filterNode(mapping, searchKey)) {
      count += 1;
    }
    if (mapping.children?.length) {
      count += countMatches(mapping.children, searchKey);
    }
  });

  return count;
};

// #endregion

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
    if (resource.assistant || conn?.assistant || conn?.http?._httpConnectorId) {
      const connectors = applicationsList();
      const assistant = connectors.find(
        connector => (connector.id === resource.assistant || connector.id === conn?.assistant || (connector?._httpConnectorId && (connector._httpConnectorId === conn?.http?._httpConnectorId)))
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
      case adaptorTypeMap.VANImport:
        return 'VAN';
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
          } else if (conn.rdbms?.type === 'redshift') {
            toReturn = 'Amazon Redshift';
          } else {
            toReturn = 'Snowflake';
          }
        }

        return toReturn;
      }
      case adaptorTypeMap.JDBCExport: {
        let toReturn;

        if (conn) {
          if (conn.jdbc?.type === 'netsuitejdbc') {
            toReturn = 'NetSuite JDBC';
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
    const mappingCopy = customCloneDeep(mappings);

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
      case adaptorTypeMap.VANImport:
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

  validateMappings: (mappings, lookups, v2TreeData, isGroupedSampleData, requiredMappingsJsonPaths = []) => {
    // validate only v2 mappings if exist
    if (hasV2MappingsInTreeData(v2TreeData, lookups)) {
      return validateV2Mappings(v2TreeData, lookups, isGroupedSampleData, requiredMappingsJsonPaths);
    }

    const duplicateMappings = mappings
      .filter(e => !!e.generate)
      .map(e => e.generate)
      .map((e, i, final) => final.indexOf(e) !== i && i)
      .filter(obj => mappings[obj])
      .map(e => mappings[e].generate);

    if (duplicateMappings.length) {
      return {
        isSuccess: false,
        errMessage: errorMessageStore('MAPPER1_DUP_GENERATE', {fields: duplicateMappings.join(',')}),
      };
    }

    const mappingsWithoutGenerates = mappings.filter(mapping => {
      if (!mapping.generate) return true;

      return false;
    });

    if (mappingsWithoutGenerates.length) {
      return {
        isSuccess: false,
        errMessage: errorMessageStore('MAPPER1_MISSING_GENERATE'),
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
        errMessage: errorMessageStore('MAPPER1_MISSING_EXTRACT', {fields: missingExtractGenerateNames.join(',')}),
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
  getV2FieldMappingType: value => {
    if (value.lookupName) {
      return 'lookup';
    }
    if ('hardCodedValue' in value) {
      return 'hardCoded';
    }
    if (isMapper2HandlebarExpression(value.extract, value.hardCodedValue)) {
      return 'multifield';
    }

    return 'standard';
  },
  getV2DefaultActionValue: value => {
    if (value.conditional?.when === 'extract_not_empty') {
      return 'discardIfEmpty';
    }
    if ('default' in value && value.default !== undefined) {
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
  getV2DefaultLookupActionValue: (value = {}, lookup = {}) => {
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
  getV2DefaultExpression: value => {
    if (isMapper2HandlebarExpression(value.extract, value.hardCodedValue)) {
      return value.extract;
    }
  },
  /**
   * Merges multiple sources mapping to same destination with a comma separated value
   * Ex: staticMap = { s1 : d1, s2 : d1, s3 : d1, s4 : d2, s5 : d2, s6 : d3 }
   * Output: { 's1,s2,s3': d1, 's4,s5': d2, s6: d3 }
   */
  getV2DefaultStaticMapValue: (staticMap = {}) => {
    const uniqueSources = uniq(Object.values(staticMap));

    return uniqueSources.reduce((res, src) => {
      const key = jsonUtils.getObjectKeysFromValue(staticMap, src) || '';

      return {...res, [key.join(',')]: src};
    }, {});
  },
  // #endregion
};

