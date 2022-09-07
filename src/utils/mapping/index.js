import deepClone from 'lodash/cloneDeep';
import { uniqBy, isEmpty, isEqual, forEach, flattenDeep } from 'lodash';
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
import { isJsonString, generateUniqueKey } from '../string';
import {applicationsList} from '../../constants/applications';
import {generateCSVFields} from '../file';
import { emptyList, emptyObject, FORM_SAVE_STATUS, MAPPING_SAVE_STATUS } from '../../constants';
import errorMessageStore from '../errorStore';

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

// #region Mapper2 utils
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

// for object array multiple extracts view,
// mark non active tabs children as hidden
export const hideOtherTabRows = (node, newTabExtract, hidden) => {
  const clonedNode = deepClone(node);

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
    if (clonedChild.parentExtract !== newTabExtract) {
      clonedChild.hidden = true;
      clonedChild.className = 'hideRow';

      // update children hidden as well
      return hideOtherTabRows(clonedChild, newTabExtract, true);
    }
    delete clonedChild.hidden;
    delete clonedChild.className;

    // for child object-array nodes, only make first tab visible
    if (clonedChild.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      const childParentExtract = clonedChild.combinedExtract?.split(',') || [];

      // update children and un-hide only first tab
      return hideOtherTabRows(clonedChild, getUniqueExtractId(childParentExtract[0], 0));
    }

    // update children as well
    return hideOtherTabRows(clonedChild, newTabExtract, false);
  });

  return clonedNode;
};

// this util is for object array data type nodes when multiple extracts are given,
// to reconstruct the whole children array
export const rebuildObjectArrayNode = (node, extract = '') => {
  const splitExtracts = extract.split(',');

  // if no extract, return
  if (isEmpty(node) || !splitExtracts || !splitExtracts.length) return node;

  if (node.dataType !== MAPPING_DATA_TYPES.OBJECTARRAY) return node;

  let clonedNode = {...node};

  // if the children was not linked before, then link it to first source
  clonedNode.children = clonedNode.children?.map(child => {
    const clonedChild = {...child};
    const {parentExtract} = clonedChild;

    if (clonedChild.isTabNode) {
      return child;
    }
    if (!parentExtract) {
      clonedChild.parentExtract = getUniqueExtractId(splitExtracts[0], 0);
    }

    return clonedChild;
  });

  // update hidden prop and only show first extract children
  clonedNode = hideOtherTabRows(clonedNode, getUniqueExtractId(splitExtracts[0], 0));

  // set active tab to 0th
  clonedNode.activeTab = 0;
  clonedNode.combinedExtract = extract;

  const {key: parentKey} = clonedNode;

  const foundExtractsUniqueId = [];

  if (!clonedNode.children) {
    clonedNode.children = [];
  }

  clonedNode.children = clonedNode.children.filter(child => {
    const {parentExtract} = child;

    if (child.isTabNode) {
      return true;
    }
    const uniqueExtract = getExtractFromUniqueId(parentExtract);

    const newIndex = splitExtracts.findIndex(s => uniqueExtract === s);

    // only keep the children which have matching parentExtract
    if (newIndex !== -1) {
      foundExtractsUniqueId.push(parentExtract);

      return true;
    }

    return false;
  });

  // find left over extracts so that new children rows can be pushed
  splitExtracts.forEach((e, i) => {
    if (!e) return;
    const extract = getUniqueExtractId(e, i);

    if (foundExtractsUniqueId.includes(extract)) {
      return;
    }

    const hidden = i > 0;
    const newRow = {
      key: generateUniqueKey(),
      title: '',
      parentKey,
      parentExtract: extract,
      dataType: MAPPING_DATA_TYPES.STRING,
      hidden, // hiding the new rows if those are not in 0th tab
      className: hidden && 'hideRow',
    };

    clonedNode.children.push(newRow);
  });

  if (splitExtracts.length === 1) {
    // remove tab node
    if (clonedNode.children[0]?.isTabNode) {
      clonedNode.children.shift();
    }
  } else if (splitExtracts.length > 1 && !clonedNode.children[0]?.isTabNode) {
    // add tab node
    clonedNode.children.unshift({
      key: generateUniqueKey(),
      parentKey,
      title: '',
      isTabNode: true,
    });
  }
  delete clonedNode.buildArrayHelper; // this will be rebuilt when saving to BE

  return clonedNode;
};

function recursivelyBuildTreeFromV2Mappings({mappings, treeData, parentKey, parentExtract, disabled, hidden, isGroupedSampleData, parentJsonPath = ''}) {
  mappings.forEach(m => {
    const {dataType, mappings: objMappings, buildArrayHelper, extract: currNodeExtract, generate} = m;
    const children = [];
    const currNodeKey = generateUniqueKey();
    const jsonPath = `${parentJsonPath ? `${parentJsonPath}.` : ''}${generate || ''}`;

    const nodeToPush = {
      key: currNodeKey,
      title: '',
      parentKey,
      parentExtract,
      disabled,
      hidden,
      className: hidden && 'hideRow',
      jsonPath,
      ...m,
    };

    treeData.push(nodeToPush);

    if (PRIMITIVE_DATA_TYPES.includes(dataType)) {
      // nothing to do
      return;
    }

    if (dataType === MAPPING_DATA_TYPES.OBJECT) {
      if (objMappings) {
        nodeToPush.children = children;

        recursivelyBuildTreeFromV2Mappings({
          mappings: objMappings,
          treeData: children,
          parentKey: currNodeKey,
          disabled,
          isGroupedSampleData,
          parentJsonPath: jsonPath});
      } else if (currNodeExtract) { // if object mapping has extract, then it is copied from source as is with no children
        nodeToPush.copySource = 'yes';
      }

      return;
    }

    if (ARRAY_DATA_TYPES.includes(dataType)) {
      // invalid mappings, nothing to do
      if (!buildArrayHelper) {
        return;
      }

      let combinedExtract;

      if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
        buildArrayHelper.forEach((obj, index) => {
          const {extract = '', mappings} = obj;

          combinedExtract = `${combinedExtract ? `${combinedExtract}${extract ? ',' : ''}` : ''}${extract}`;

          if (!mappings) {
            nodeToPush.copySource = 'yes';

            return;
          }

          const newExtract = getUniqueExtractId(extract, index);
          let isHidden = hidden;

          if (index > 0) {
            // since the first source is already pushed, all other children should
            // be hidden now, as we show the first source tab by default
            isHidden = true;

            // found more than 1 extracts, insert a tab node if not already added
            if (!children?.[0]?.isTabNode) {
              children.unshift({
                key: generateUniqueKey(),
                parentKey: currNodeKey,
                title: '',
                isTabNode: true,
                hidden,
                className: hidden && 'hideRow',
              });
            }
          }

          recursivelyBuildTreeFromV2Mappings({
            mappings,
            treeData: children,
            parentKey: currNodeKey,
            parentExtract: newExtract,
            disabled,
            hidden: isHidden,
            isGroupedSampleData,
            parentJsonPath: jsonPath ? `${jsonPath}[*]` : ''}
          );

          nodeToPush.children = children;
        });

        nodeToPush.combinedExtract = combinedExtract;

        return;
      }

      // for primitive array types only extracts are supported, not 'mappings'
      buildArrayHelper.forEach(obj => {
        combinedExtract = `${combinedExtract ? `${combinedExtract},` : ''}${obj.extract}`;
      });

      nodeToPush.combinedExtract = combinedExtract;
    }
  });

  return treeData;
}

export const buildTreeFromV2Mappings = ({
  importResource,
  isGroupedSampleData,
  disabled,
}) => {
  if (!importResource) {
    return;
  }

  const v2Mappings = importResource.mappings || [];

  // creating deep copy of mapping object to avoid alteration to resource mapping object
  const v2MappingsCopy = deepClone(v2Mappings);

  const treeData = [];
  const emptyRowKey = generateUniqueKey();

  // we need empty title to be passed here
  // for each node as the parent Tree is handling the titleRender for all
  // if empty title is not set here, then a dummy '---' title gets shown on each row hover
  let emptyMappingsTree = [{
    key: emptyRowKey,
    isEmptyRow: true,
    title: '',
    disabled,
    dataType: MAPPING_DATA_TYPES.STRING,
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
          key: generateUniqueKey(),
          title: '',
          dataType: MAPPING_DATA_TYPES.STRING,
          disabled,
          isEmptyRow: true,
        },
      ],
    }];
  }

  if (isEmpty(v2MappingsCopy)) {
    return emptyMappingsTree;
  }

  const mappingsTreeData = recursivelyBuildTreeFromV2Mappings({mappings: v2MappingsCopy, treeData, disabled, isGroupedSampleData});

  return mappingsTreeData;
};

const isMappingWithoutExtract = (mapping, lookups) => {
  const {dataType, copySource, extract, combinedExtract} = mapping;

  let missingExtract;

  if (ARRAY_DATA_TYPES.includes(dataType)) {
    if (copySource === 'yes' && !combinedExtract) {
      missingExtract = true;
    }

    if (!('hardCodedValue' in mapping || combinedExtract)) {
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
      generateDisabled,
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
      combinedExtract,
      isTabNode} = mapping;

    if (isTabNode || (!generateDisabled && !generate)) return;

    const newMapping = {
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
      const splitExtracts = combinedExtract?.split(',') || [];

      if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
        const buildArrayHelper = [];

        newMapping.buildArrayHelper = buildArrayHelper;

        if (!splitExtracts.length && children?.length) {
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
          splitExtracts.forEach(extract => {
            if (!extract) return;
            buildArrayHelper.push({
              extract,
            });
          });
          _mappingsToSave.push(newMapping);

          return;
        }

        // both extract and sub mappings exist
        splitExtracts.forEach((extract, index) => {
          if (!extract) return;
          // find the children which matches the given extract index
          const matchingChildren = children.filter(c => {
            if (c.parentExtract === getUniqueExtractId(extract, index)) {
              return true;
            }

            return false;
          });

          const subMappings = [];
          const newHelper = {
            extract,
            mappings: subMappings,
            status: 'Active',
          };

          recursivelyBuildV2MappingsFromTree({v2TreeData: matchingChildren, _mappingsToSave: subMappings, lookups});

          // if no valid children mappings are present, then parent is also marked as Draft
          const isAnyChildActive = newHelper.mappings.some(m => m.status === 'Active');

          if (!isAnyChildActive) {
            newHelper.status = 'Draft';
          }
          buildArrayHelper.push(newHelper);
        });

        // if no sources children are present, then parent is also marked as Draft
        const isAnySourceActive = newMapping.buildArrayHelper.some(m => m.status === 'Active');

        if (!isAnySourceActive) {
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
      if (splitExtracts.length) {
        newMapping.buildArrayHelper = splitExtracts.map(extract => {
          if (!extract) return;

          return {
            extract,
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

  if (isEmpty(v2TreeData)) {
    return _mappingsToSave;
  }

  recursivelyBuildV2MappingsFromTree({v2TreeData, _mappingsToSave, lookups});

  return _mappingsToSave;
};

// handles drag/drop logic for tree data
export function allowDrop({ dragNode, dropNode, dropPosition }) {
  if (!dropNode.children) {
    if (dropPosition === 0) return false;
  }

  if (!dragNode || !dropNode) return false;

  const {isTabNode: dragNodeIsTab, hidden: dragNodeIsHidden} = dragNode;
  const {hidden: dropNodeIsHidden} = dropNode;

  if (dragNodeIsHidden || dropNodeIsHidden) return false;

  if (dragNodeIsTab) return false;

  // can't drop above tab node
  if (dropNode?.children?.[0]?.isTabNode && dropPosition === 0) return false;

  return true;
}

// verify if drag position and drop position are same
export function verifyIfSameLevel(dropPosition, dragNode, dropNode, dropSubArrIndex, dragNodeIndex, hasTabbedRow = false) {
  const dragParentKey = dragNode.parentKey;
  const dropParentKey = dropNode.parentKey;

  if (dropPosition === 1) { // drag obj inserted after drop node
    if ((!dragParentKey && dropParentKey) || (dragParentKey && !dropParentKey)) return false;

    // when no parent keys present or parent keys matches, drag and drop nodes are of same level
    if ((dragParentKey === dropParentKey) && (dropSubArrIndex + 1 === dragNodeIndex)) return true;
  }
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
    } if (dragParentKey === dropParentKey) {
      // when no parent keys present or parent keys matches, drag and drop nodes are of same level
      if (dropSubArrIndex === dragNodeIndex) {
        return true;
      }
    }
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

// to search the generate of the field mapping
export const filterNode = (node, searchKey) => {
  if (!searchKey) return false;
  if (node?.generate?.toUpperCase().indexOf(searchKey.toUpperCase()) > -1) {
    return true;
  }

  return false;
};

// to search the key value of a field mapping
export const filterKey = (node, searchKey) => {
  if (!searchKey) return false;
  if (node?.key === searchKey) {
    return true;
  }

  return false;
};

export const searchTree = (mappings, key, filterFunc, items) => {
  if (!mappings || !key || !filterFunc) return;

  // for storing first index where search is found
  let firstIndex = -1;

  // looping through all the children fields of the node
  mappings.forEach((node, index) => {
    if (node.isTabNode) return;

    if (filterFunc(node, key)) {
      items.filteredKeys.push(node.key);
      // updating when found for first time
      if (firstIndex === -1) firstIndex = index;
    }

    // eslint-disable-next-line no-param-reassign
    items.firstIndex = -1;    // before sending it to searchTree set items.firstIndex to -1

    // calling required function according to the mappings dataType
    if (node.dataType === MAPPING_DATA_TYPES.OBJECT) {
      searchTree(node.children, key, filterFunc, items);

      // if children mappings contained a search then adding the node to expandKeys list
      if (items.firstIndex !== -1) {
        items.expandedKeys.push(node.key);
      }
    } else if (node.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      searchTree(node.children, key, filterFunc, items);

      // if match found in the mappings then setting tabChange list to contain the current tabChange object
      if (items.firstIndex !== -1) {
        const childNode = node.children[items.firstIndex];

        // checking if tabs are present or not
        if (node.children[0].isTabNode) {
          // to get the correct tabValue from the combinedExtract
          let tabValue;
          const pipeIndex = childNode.parentExtract.indexOf('|');

          if (pipeIndex > 0) {
            tabValue = parseInt(childNode.parentExtract.substring(pipeIndex + 1), 10);
          } else {
            tabValue = node.combinedExtract.split(',').indexOf(childNode.parentExtract);
          }

          items.tabChange.push(
            {
              key: node.key,
              tabValue,
              parentExtract: childNode.parentExtract,
            }
          );
        }
        items.expandedKeys.push(node.key);
      }
    }

    // setting firstIndex if no matches found before and match is found inside the mapping
    if (items.firstIndex !== -1 && firstIndex === -1) firstIndex = index;
  });

  // eslint-disable-next-line no-param-reassign
  items.firstIndex = firstIndex;    // setting the firstIndex before returning
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

    const key = generateUniqueKey();

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
          key: generateUniqueKey(),
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
          key: generateUniqueKey(),
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
            key: generateUniqueKey(),
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

  if (isCSVOrXLSX) {
    treeData = [{
      key: generateUniqueKey(),
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
    const key = generateUniqueKey();
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

  const key = generateUniqueKey();

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

// this util handles the comma separated values use-case
// and returns the final input after user selects a node
export const getFinalSelectedExtracts = (node, inputValue = '', isArrayType, isGroupedSampleData, nodeKey, treeData) => {
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
      splitInput[valuesLen - 1] = fullJsonPath;
      newValue = splitInput.join(',');
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

const recursivelyValidateV2Mappings = ({
  v2TreeData,
  lookups,
  dupMap = {},
  duplicateMappings = [],
  mappingsWithoutGenerates = [],
  missingExtractGenerateNames = [],
  expressionNotSupported = [],
  onlyJsonPathSupported = [],
}) => {
  v2TreeData.forEach(mapping => {
    const {
      dataType,
      extract,
      combinedExtract,
      hardCodedValue,
      isRequired,
      parentKey,
      parentExtract,
      generate,
      generateDisabled,
      jsonPath,
      isTabNode} = mapping;

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
      const splitExtracts = (extract || combinedExtract)?.split(',') || [];
      const invalidSource = splitExtracts.filter(e => {
        if (handlebarRegex.test(e)) return true;

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

    if (mapping.children?.length) {
      recursivelyValidateV2Mappings({
        v2TreeData: mapping.children,
        lookups,
        dupMap,
        duplicateMappings,
        mappingsWithoutGenerates,
        missingExtractGenerateNames,
        expressionNotSupported,
        onlyJsonPathSupported});
    }
  });
};

const validateV2Mappings = (v2TreeData, lookups) => {
  const duplicateMappings = [];
  const mappingsWithoutGenerates = [];
  const missingExtractGenerateNames = [];
  const expressionNotSupported = [];
  const onlyJsonPathSupported = [];

  recursivelyValidateV2Mappings({
    v2TreeData,
    lookups,
    duplicateMappings,
    mappingsWithoutGenerates,
    missingExtractGenerateNames,
    expressionNotSupported,
    onlyJsonPathSupported});

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

  validateMappings: (mappings, lookups, v2TreeData) => {
    // validate only v2 mappings if exist
    if (hasV2MappingsInTreeData(v2TreeData, lookups)) {
      return validateV2Mappings(v2TreeData, lookups);
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
    if (value.extract?.indexOf('{{') !== -1) {
      return value.extract;
    }
  },
  // #endregion
};

