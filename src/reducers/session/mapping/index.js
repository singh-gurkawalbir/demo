import shortid from 'shortid';
import { original, produce } from 'immer';
import { differenceWith, isEqual, isEmpty } from 'lodash';
import deepClone from 'lodash/cloneDeep';
import actionTypes from '../../../actions/types';
import {
  isMappingEqual,
  compareV2Mappings,
  findNodeInTree,
  PRIMITIVE_DATA_TYPES,
  ARRAY_DATA_TYPES,
  getAllKeys,
  rebuildObjectArrayNode,
  hideOtherTabRows,
  MAPPING_DATA_TYPES,
  getDefaultExtractPath,
  getUniqueExtractId} from '../../../utils/mapping';
import { generateUniqueKey } from '../../../utils/string';

// this util will update parent reference props on children
// when data type is updated
const updateChildrenProps = (children, parentNode) => {
  if (!children || !children.length) return children;
  const childrenCopy = deepClone(children);

  const {key, dataType, combinedExtract} = parentNode;

  // only for object array data type, add parent reference fields
  if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
    return childrenCopy.map(c => ({
      ...c,
      parentExtract: getUniqueExtractId(combinedExtract, 0), // for now combinedExtract will always contain 1 extract
      parentKey: key,
    }));
  }

  // remove parent row reference from children for other data types
  return childrenCopy.reduce((acc, c) => {
    if (c.isTabNode) return acc;
    const {parentExtract, parentKey,
      ...rest} = c;

    acc.push(rest);

    return acc;
  }, []);
};

const updateDataType = (draft, node, oldDataType, newDataType) => {
  const newNode = deepClone(node);
  const newRowKey = generateUniqueKey();

  if (oldDataType !== newDataType) {
    // always delete children if data type is changed
    delete newNode.children;
  }

  if (newDataType === MAPPING_DATA_TYPES.OBJECT || newDataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
    draft.mapping.expandedKeys.push(newNode.key);
    newNode.combinedExtract = newNode.combinedExtract || newNode.extract || getDefaultExtractPath(draft.mapping.isGroupedSampleData);

    delete newNode.extract;
    delete newNode.hardCodedValue;
    delete newNode.lookupName;
    delete newNode.default;

    const parentExtract = getUniqueExtractId(newNode.combinedExtract?.split(',')?.[0], 0);

    if (isEmpty(newNode.children)) {
      newNode.children = [{
        key: newRowKey,
        title: '',
        parentKey: newNode.key,
        parentExtract,
        dataType: MAPPING_DATA_TYPES.STRING,
      }];
    }

    if (newDataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      // if (!newNode.tabMap) {
      //   newNode.tabMap = {
      //     0: getUniqueExtractId(parentExtract, 0),
      //   };
      // }
    } else {
      // combinedExtract is used only for array data types to store comma separated values
      delete newNode.combinedExtract;
      // delete newNode.tabMap;
    }

    return newNode;
  }
  // now handle the primitive data types or which can not have children
  if (PRIMITIVE_DATA_TYPES.includes(newDataType) || ARRAY_DATA_TYPES.includes(newDataType)) {
    delete newNode.children;
  }

  return newNode;
};

const emptyObj = {};
const emptyArr = [];

export default (state = {}, action) => {
  const {
    type,
    key,
    field,
    shiftIndex,
    value,
    mappings,
    lookups,
    flowId,
    importId,
    subRecordMappingId,
    oldValue,
    newValue,
    isConditionalLookup,
    isGroupedSampleData,
    failMsg,
    failSeverity,
    outputFormat,
    newVersion,
    v2TreeData,
    v2Key,
    newDataType,
    isMonitorLevelAccess,
    dragDropInfo,
    version,
    expanded,
    expandedKeys,
    errors,
    newTabValue,
    newTabExtractId,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.MAPPING.INIT:
        if (!draft.mapping) {
          draft.mapping = {
            status: 'requested',
          };
        } else {
          draft.mapping.status = 'requested';
        }
        break;
      case actionTypes.MAPPING.INIT_COMPLETE: {
        const isGroupedOutput = !!(v2TreeData?.length === 1 && v2TreeData[0].dataType === MAPPING_DATA_TYPES.OBJECTARRAY && !v2TreeData[0].generate);

        if (isGroupedOutput) {
          v2TreeData[0].generateDisabled = true;
        }

        draft.mapping = {
          mappings,
          lookups,
          v2TreeData,
          expandedKeys: [],
          flowId,
          importId,
          subRecordMappingId,
          status: 'received',
          isGroupedSampleData,
          isMonitorLevelAccess,
          version,
          isGroupedOutput,
          mappingsCopy: deepClone(mappings),
          lookupsCopy: deepClone(lookups),
          v2TreeDataCopy: deepClone(v2TreeData),
        };
        break;
      }

      case actionTypes.MAPPING.INIT_FAILED:
        draft.mapping = {
          status: 'error',
        };
        break;
      case actionTypes.MAPPING.UPDATE_LAST_TOUCHED_FIELD:
        draft.mapping.lastModifiedRowKey = key || 'new';
        break;
      case actionTypes.MAPPING.DELETE: {
        const mappingToDelete = draft.mapping.mappings.find(m => m.key === key);

        if (mappingToDelete.lookupName) {
          // delete lookup
          draft.mapping.lookups = draft.mapping.lookups.filter(l => l.name !== mappingToDelete.lookupName);
        }
        draft.mapping.mappings = draft.mapping.mappings.filter(m => m.key !== key);
        if (draft.mapping.lastModifiedRowKey === key) { delete draft.mapping.lastModifiedRowKey; }
        if (draft?.mapping?.autoMapper) {
          delete draft.mapping.autoMapper.startKey;
        }
        break;
      }

      case actionTypes.MAPPING.PATCH_FIELD: {
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          // in case parent mapping is displayed with subrecord mapping in future, this condition is to be modified to support that. Include isSubrecordMapping
          if (field === 'generate' && (draft.mapping.mappings[index].isRequired)) {
            return;
          }

          const mapping = draft.mapping.mappings[index];

          if (field === 'extract') {
            if (value.indexOf('"') === 0) {
              delete mapping.extract;
              mapping.hardCodedValue = value.replace(/(^")|("$)/g, '');
            } else {
              delete mapping.hardCodedValue;
              mapping.extract = value;
            }
          } else {
            mapping[field] = value;

            if (
              !draft.mapping.isCsvOrXlsxResource &&
              value.indexOf('[*].') === -1
            ) {
              if ('isKey' in mapping) {
                delete mapping.isKey;
              }

              if ('useFirstRow' in mapping) {
                delete mapping.useFirstRow;
              }
            }
          }

          draft.mapping.mappings[index] = mapping;
          draft.mapping.lastModifiedRowKey = mapping.key;
        } else if (value) {
          const newKey = shortid.generate();
          const newRow = {
            key: newKey,
          };

          if (field === 'extract' && value.indexOf('"') === 0) {
            newRow.hardCodedValue = value.replace(/(^")|("$)/g, '');
          } else {
            newRow[field] = value;
          }
          draft.mapping.mappings.push(newRow);
          draft.mapping.lastModifiedRowKey = newKey;
        }
        if (draft?.mapping?.autoMapper) {
          delete draft.mapping.autoMapper.startKey;
        }
        break;
      }

      case actionTypes.MAPPING.PATCH_INCOMPLETE_GENERATES:
        if (!draft.mapping) {
          break;
        }
        if (draft.mapping.incompleteGenerates) {
          const incompleteGeneObj = draft.mapping.incompleteGenerates.find(
            gen => gen.key === key
          );

          if (incompleteGeneObj) {
            incompleteGeneObj.value = value;
          } else {
            draft.mapping.incompleteGenerates.push({ key, value });
          }
        } else {
          draft.mapping.incompleteGenerates = [{ key, value }];
        }

        break;

      case actionTypes.MAPPING.PATCH_SETTINGS: {
        const index = draft.mapping.mappings.findIndex(m => m.key === key);

        if (draft.mapping.mappings[index]) {
          const mapping = draft.mapping.mappings[index];

          Object.assign(mapping, value);

          // removing lookups
          if (!value.lookupName) {
            delete mapping.lookupName;
          }
          if (!value.conditional?.when && mapping?.conditional?.when) {
            delete mapping.conditional.when;
          }
          if (!value.conditional?.lookupName && mapping?.conditional?.lookupName) {
            delete mapping.conditional.lookupName;
          }

          if ('hardCodedValue' in value) {
            delete mapping.extract;
          } else {
            delete mapping.hardCodedValue;
          }
          draft.mapping.mappings[index] = mapping;
          draft.mapping.lastModifiedRowKey = key;
        }
        if (draft?.mapping?.autoMapper) {
          delete draft.mapping.autoMapper.startKey;
        }
        break;
      }

      case actionTypes.MAPPING.SAVE:
        if (draft.mapping) {
          draft.mapping.saveStatus = 'requested';
        }
        if (draft?.mapping?.autoMapper) {
          delete draft.mapping.autoMapper.startKey;
        }
        break;
      case actionTypes.MAPPING.SAVE_COMPLETE:
        if (draft.mapping) {
          draft.mapping.saveStatus = 'completed';
          draft.mapping.validationErrMsg = undefined;
          draft.mapping.mappingsCopy = deepClone(draft.mapping.mappings);
          draft.mapping.lookupsCopy = deepClone(draft.mapping.lookups);
          draft.mapping.v2TreeDataCopy = deepClone(draft.mapping.v2TreeData);
        }
        break;
      case actionTypes.MAPPING.SAVE_FAILED:
        if (draft.mapping) {
          draft.mapping.saveStatus = 'failed';
          draft.mapping.validationErrMsg = undefined;
        }
        break;
      case actionTypes.MAPPING.PREVIEW_REQUESTED:
        if (draft.mapping) {
          if (draft.mapping.preview) {
            draft.mapping.preview.status = 'requested';
          } else {
            draft.mapping.preview = { status: 'requested' };
          }
        }
        break;
      case actionTypes.MAPPING.PREVIEW_RECEIVED:
        if (draft.mapping) {
          draft.mapping.preview.data = value;
          draft.mapping.preview.status = 'received';
          delete draft.mapping.preview.errors;
        }
        break;
      case actionTypes.MAPPING.PREVIEW_FAILED:
        if (draft.mapping) {
          delete draft.mapping.preview.data;
          draft.mapping.preview.status = 'error';
          draft.mapping.preview.errors = errors;
        }
        break;
      case actionTypes.MAPPING.SET_NS_ASSISTANT_FORM_LOADED:
        if (draft.mapping) { draft.mapping.isNSAssistantFormLoaded = value; }
        break;
      case actionTypes.MAPPING.UPDATE_LIST:
        if (draft.mapping) {
          draft.mapping.mappings = mappings;
        }
        break;
      case actionTypes.MAPPING.CLEAR:
        delete draft.mapping;
        break;
      case actionTypes.MAPPING.SHIFT_ORDER: {
        const itemIndex = draft.mapping.mappings.findIndex(m => m.key === key);
        const [removed] = draft.mapping.mappings.splice(itemIndex, 1);

        draft.mapping.mappings.splice(shiftIndex, 0, removed);
        if (draft?.mapping?.autoMapper) {
          delete draft.mapping.autoMapper.startKey;
        }
        break;
      }
      case actionTypes.MAPPING.ADD_LOOKUP:
        draft.mapping.lookups.push({...value, isConditionalLookup});
        break;
      case actionTypes.MAPPING.UPDATE_LOOKUP:
        if (isConditionalLookup) {
          // case where user updates lookup name. The same is to be updated in all mapping items using it
          if (oldValue && oldValue.name !== newValue.name) {
            for (let i = 0; i < draft.mapping.mappings.length; i += 1) {
              if (draft.mapping.mappings[i]?.conditional?.lookupName === oldValue?.name) {
                draft.mapping.mappings[i].conditional.lookupName = newValue.name;
              }
            }
          }
        }
        if (oldValue?.name) {
          draft.mapping.lookups = draft.mapping.lookups.filter(l => l.name !== oldValue.name);
        }
        if (newValue) {
          draft.mapping.lookups.push({...newValue, isConditionalLookup});
        }
        break;
      case actionTypes.MAPPING.SET_VALIDATION_MSG:
        if (draft.mapping) {
          draft.mapping.validationErrMsg = value;
        }
        break;
      case actionTypes.MAPPING.AUTO_MAPPER.REQUEST:
        if (draft.mapping) {
          if (!draft.mapping.autoMapper) {
            draft.mapping.autoMapper = {};
          } else {
            delete draft.mapping.autoMapper.failMsg;
            delete draft.mapping.autoMapper.failSeverity;
          }
          draft.mapping.autoMapper.status = 'requested';
        }
        break;
      case actionTypes.MAPPING.AUTO_MAPPER.RECEIVED:
        if (draft?.mapping?.autoMapper) {
          draft.mapping.autoMapper.status = 'received';
          draft.mapping.autoMapper.startKey = value[0].key;
          // adding suggested list to mapping list
          draft.mapping.mappings.push(...value);
        }
        break;
      case actionTypes.MAPPING.AUTO_MAPPER.FAILED:
        if (draft?.mapping?.autoMapper) {
          draft.mapping.autoMapper.status = 'error';
          draft.mapping.autoMapper.failMsg = failMsg;
          draft.mapping.autoMapper.failSeverity = failSeverity;
        }
        break;

      case actionTypes.MAPPING.TOGGLE_VERSION:
        if (!draft.mapping) break;
        draft.mapping.version = newVersion;
        break;

      case actionTypes.MAPPING.V2.TOGGLE_OUTPUT: {
        if (!draft.mapping) break;

        const oldFormat = draft.mapping.isGroupedOutput ? 'rows' : 'record';

        draft.mapping.isGroupedOutput = outputFormat === 'rows';

        if (oldFormat === outputFormat) break;

        if (outputFormat === 'rows') {
          // top disabled row already exists
          if (draft.mapping.v2TreeData[0]?.generateDisabled) break;

          const defaultExtract = getDefaultExtractPath(draft.mapping.isGroupedSampleData);

          const newRowKey = generateUniqueKey();

          const node = {
            key: newRowKey,
            title: '',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generateDisabled: true,
            disabled: draft.mapping.isMonitorLevelAccess,
            combinedExtract: defaultExtract,
            // tabMap: {
            //   0: getUniqueExtractId(defaultExtract, 0),
            // },
          };

          node.children = updateChildrenProps(draft.mapping.v2TreeData, node);

          draft.mapping.v2TreeData = [node];
          draft.mapping.expandedKeys.push(newRowKey);
        } else {
          // top disabled row does not exist
          if (!draft.mapping.v2TreeData[0]?.generateDisabled) break;

          draft.mapping.v2TreeData = updateChildrenProps(draft.mapping.v2TreeData[0]?.children, {});
        }

        break;
      }

      case actionTypes.MAPPING.V2.TOGGLE_ROWS:
        if (!draft.mapping) break;
        if (!expanded) {
          draft.mapping.expandedKeys = [];
        } else {
          draft.mapping.expandedKeys = getAllKeys(draft.mapping.v2TreeData);
        }
        break;

      case actionTypes.MAPPING.V2.UPDATE_EXPANDED_KEYS:
        draft.mapping.expandedKeys = expandedKeys;
        break;

      case actionTypes.MAPPING.V2.DELETE_ROW: {
        if (!draft.mapping) break;

        const {nodeSubArray, nodeIndexInSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (nodeIndexInSubArray >= 0) {
          nodeSubArray.splice(nodeIndexInSubArray, 1);

          // add empty row if all the mappings have been deleted
          if (isEmpty(draft.mapping.v2TreeData)) {
            const emptyRowKey = generateUniqueKey();

            draft.mapping.v2TreeData.push({
              key: emptyRowKey,
              title: '',
              dataType: MAPPING_DATA_TYPES.STRING,
              disabled: draft.mapping.isMonitorLevelAccess,
              isEmptyRow: true,
            });
          }
        }

        break;
      }

      case actionTypes.MAPPING.V2.ADD_ROW: {
        if (!draft.mapping) break;

        const {node, nodeSubArray, nodeIndexInSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (nodeIndexInSubArray >= 0) {
          const newRowKey = generateUniqueKey();

          nodeSubArray.splice(nodeIndexInSubArray + 1, 0, {
            key: newRowKey,
            title: '',
            parentKey: node.parentKey,
            parentExtract: node.parentExtract,
            dataType: MAPPING_DATA_TYPES.STRING,
          });
        }

        break;
      }

      case actionTypes.MAPPING.V2.UPDATE_DATA_TYPE: {
        if (!draft.mapping) break;

        const {node, nodeIndexInSubArray, nodeSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (isEmpty(node)) break;

        nodeSubArray[nodeIndexInSubArray] = updateDataType(draft, node, node.dataType, newDataType);
        nodeSubArray[nodeIndexInSubArray].dataType = newDataType;

        break;
      }

      case actionTypes.MAPPING.V2.DRAG_DROP: {
        if (!draft.mapping) break;

        const {node: dropNode, dragNode} = dragDropInfo;
        const dropKey = dropNode.key;
        const dragKey = dragNode.key;
        const dragParentKey = dragNode.parentKey;
        const dropPos = dropNode.pos.split('-');
        const dragPos = dragNode.pos.split('-');
        const dragNodeIndex = Number(dragPos[dragPos.length - 1]);
        const dropNodeIndex = Number(dropPos[dropPos.length - 1]);
        const dropPosition = dragDropInfo.dropPosition - dropNodeIndex;

        const {v2TreeData} = draft.mapping;

        // Find dragObject and remove from current position
        const {node: dragObj, nodeSubArray: dragSubArr, nodeIndexInSubArray: dragSubArrIndex} = findNodeInTree(v2TreeData, 'key', dragKey);

        // if dropping at same level, nothing to do
        if (dragDropInfo.dropPosition === dragSubArrIndex) break;

        dragSubArr.splice(dragSubArrIndex, 1);

        // find drop position
        const {nodeSubArray: dropSubArr, nodeIndexInSubArray: dropSubArrIndex } = findNodeInTree(v2TreeData, 'key', dropKey);

        // child node is being dragged and dropped at top (0th index) of the children list
        if (dropPosition === 0 && dragParentKey === dropKey) {
          const hasTabbedRow = dropNode.multipleSources;

          // if child is already at 0th position, nothing to do
          if (dragNodeIndex === 0 || (hasTabbedRow && dragNodeIndex === 1)) return;
          const {children = []} = dropSubArr[dropNodeIndex];

          // retain the tabbed row
          if (hasTabbedRow) {
            children.splice(1, 0, dragObj);
          } else {
            children.unshift(dragObj);
          }
        } else if (dropPosition === -1) { // drag obj inserted before drop node
          if (dropSubArrIndex === dragNodeIndex) return;

          dropSubArr.splice(dropSubArrIndex, 0, dragObj);
        } else { // drag obj inserted after drop node
          if (dropSubArrIndex + 1 === dragNodeIndex) return;

          dropSubArr.splice(dropSubArrIndex + 1, 0, dragObj);
        }

        break;
      }

      case actionTypes.MAPPING.V2.PATCH_FIELD: {
        if (!draft.mapping) break;
        const {node, nodeSubArray, nodeIndexInSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (node) {
          if (field === 'extract') {
            if (value.indexOf('"') === 0) {
              delete node.extract;
              node.hardCodedValue = value.replace(/(^")|("$)/g, '');
            } else {
              delete node.hardCodedValue;
              if (ARRAY_DATA_TYPES.includes(node.dataType)) {
                if (node.copySource === 'yes') {
                  node.children = [];
                } else if (!value && (node.dataType === MAPPING_DATA_TYPES.OBJECT || node.dataType === MAPPING_DATA_TYPES.OBJECTARRAY)) {
                  // delete all children if extract is empty
                  const newRowKey = generateUniqueKey();

                  node.children = [{
                    key: newRowKey,
                    title: '',
                    parentKey: node.key,
                    dataType: MAPPING_DATA_TYPES.STRING,
                  }];
                } else if (value && node.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
                  // handle tab view
                  nodeSubArray[nodeIndexInSubArray] = rebuildObjectArrayNode(original(node), value);
                }

                // array data types do not have direct 'extract' prop
                if (nodeSubArray[nodeIndexInSubArray]) {
                  delete nodeSubArray[nodeIndexInSubArray].extract;
                  delete nodeSubArray[nodeIndexInSubArray].hardCodedValue;
                  nodeSubArray[nodeIndexInSubArray].combinedExtract = value;
                }
              } else {
                node.extract = value;
              }
            }
          } else if (node.isRequired) {
            // do nothing as no changes can be made to 'generate' of a required mapping
          } else {
            node[field] = value;
          }

          delete node.isEmptyRow;
        }

        break;
      }

      case actionTypes.MAPPING.V2.PATCH_SETTINGS: {
        if (!draft.mapping) break;
        const {node, nodeIndexInSubArray, nodeSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (node) {
          const oldDataType = node.dataType;

          Object.assign(node, value);

          // removing lookups
          if (!value.lookupName) {
            delete node.lookupName;
          }
          if (!value.conditional?.when && node?.conditional?.when) {
            delete node.conditional.when;
          }

          if ('hardCodedValue' in value) {
            delete node.extract;
          } else {
            delete node.hardCodedValue;
          }

          if (value.dataType === MAPPING_DATA_TYPES.OBJECT || value.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
            if (value.copySource === 'yes') {
              // delete child rows if object is to be copied as is
              node.children = [];
            } else if (value.copySource === 'no') {
              nodeSubArray[nodeIndexInSubArray] = updateDataType(draft, node, oldDataType, value.dataType);
            }
          } else if (ARRAY_DATA_TYPES.includes(value.dataType)) {
            delete node.extract;
            node.combinedExtract = value.extract;
            node.children = [];
          } else {
            node.children = [];
          }
        }

        break;
      }

      case actionTypes.MAPPING.V2.ACTIVE_KEY: {
        if (!draft.mapping) break;
        draft.mapping.v2ActiveKey = v2Key;
        break;
      }

      case actionTypes.MAPPING.V2.CHANGE_ARRAY_TAB: {
        if (!draft.mapping) break;
        const {node, nodeIndexInSubArray, nodeSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        nodeSubArray[nodeIndexInSubArray] = hideOtherTabRows(original(node), newTabExtractId);
        nodeSubArray[nodeIndexInSubArray].activeTab = newTabValue;

        break;
      }

      default:
    }
  });
};

export const selectors = {};

// #region PUBLIC SELECTORS
selectors.mapping = state => {
  if (!state || !state.mapping) {
    return emptyObj;
  }

  return state.mapping;
};

selectors.v2MappingsTreeData = state => {
  if (!state || !state.mapping) {
    return emptyArr;
  }

  return state.mapping.v2TreeData || emptyArr;
};

// #region PUBLIC SELECTORS
selectors.mappingChanged = state => {
  if (!state || !state.mapping) {
    return false;
  }

  const { mappings = [], mappingsCopy = [], lookups = [], lookupsCopy = [],
    v2TreeData = [], v2TreeDataCopy = [] } = state.mapping;
  let isMappingsChanged = !isMappingEqual(mappings, mappingsCopy);

  if (!isMappingsChanged) {
    const lookupsDiff = differenceWith(lookupsCopy, lookups, isEqual);

    isMappingsChanged =
      lookupsCopy.length !== lookups.length || lookupsDiff.length;
  }

  let isCombinedMappingsChanged = isMappingsChanged;

  // check for v2 mappings
  if (!isCombinedMappingsChanged) {
    isCombinedMappingsChanged = compareV2Mappings(v2TreeData, v2TreeDataCopy);
  }

  return !!isCombinedMappingsChanged;
};

// #region PUBLIC SELECTORS
selectors.mappingSaveStatus = state => {
  if (!state || !state.mapping) {
    return emptyObj;
  }

  const { saveStatus } = state.mapping;

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
  };
};
selectors.autoMapper = state => {
  if (!state || !state?.mapping?.autoMapper) {
    return emptyObj;
  }

  return state.mapping.autoMapper;
};

selectors.mappingVersion = state => {
  if (!state || !state.mapping) {
    return;
  }

  return state.mapping.version;
};

selectors.v2MappingExpandedKeys = state => {
  if (!state || !state.mapping) {
    return emptyArr;
  }

  return state.mapping.expandedKeys || emptyArr;
};

selectors.v2ActiveKey = state => {
  if (!state || !state.mapping) {
    return;
  }

  return state.mapping.v2ActiveKey;
};
