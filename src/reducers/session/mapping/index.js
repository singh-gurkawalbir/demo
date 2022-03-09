import shortid from 'shortid';
import produce from 'immer';
import { differenceWith, isEqual, isEmpty } from 'lodash';
import deepClone from 'lodash/cloneDeep';
import { nanoid } from 'nanoid';
import actionTypes from '../../../actions/types';
import {isMappingEqual, findNodeInTree, PRIMITIVE_DATA_TYPES, ARRAY_DATA_TYPES} from '../../../utils/mapping';

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
    v2Mappings,
    v2Key,
    newDataType,
    isMonitorLevelAccess,
    dragDropInfo,
    version,
    expanded,
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
      case actionTypes.MAPPING.INIT_COMPLETE:
        draft.mapping = {
          mappings,
          lookups,
          v2TreeData,
          v2Mappings,
          flowId,
          importId,
          subRecordMappingId,
          status: 'received',
          isGroupedSampleData,
          isMonitorLevelAccess,
          version,
          mappingsCopy: deepClone(mappings),
          lookupsCopy: deepClone(lookups),
          v2MappingsCopy: deepClone(v2Mappings),
        };
        break;
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
        }
        break;
      case actionTypes.MAPPING.PREVIEW_FAILED:
        if (draft.mapping) {
          delete draft.mapping.preview.data;
          draft.mapping.preview.status = 'error';
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

        const oldFormat = draft.mapping.isGroupedOutput;

        draft.mapping.isGroupedOutput = outputFormat === 'rows';

        if (oldFormat === outputFormat) break;

        if (outputFormat === 'rows') {
          // top disabled row already exists
          if (draft.mapping.v2TreeData[0]?.generateDisabled) break;

          const newRowKey = nanoid();
          const node = {
            key: newRowKey,
            title: '',
            dataType: 'objectarray',
            generateDisabled: true,
            disabled: draft.mapping.isMonitorLevelAccess,
            children: deepClone(draft.mapping.v2TreeData),
          };

          draft.mapping.v2TreeData = [node];
          // todo ashu should expand this node
        } else {
          // top disabled row does not exist
          if (!draft.mapping.v2TreeData[0]?.generateDisabled) break;

          const children = draft.mapping.v2TreeData[0]?.children;

          draft.mapping.v2TreeData = deepClone(children);
        }

        break;
      }

      case actionTypes.MAPPING.V2.TOGGLE_ROWS:
        if (!draft.mapping) break;
        draft.mapping.expandAll = expanded;
        draft.mapping.toggleCount = (draft.mapping.toggleCount || 0) + 1;
        break;

      case actionTypes.MAPPING.V2.DELETE_ROW: {
        if (!draft.mapping) break;

        const {nodeSubArray, nodeIndexInSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (nodeIndexInSubArray >= 0) {
          nodeSubArray.splice(nodeIndexInSubArray, 1);

          // add empty row if all the mappings have been deleted
          if (isEmpty(draft.mapping.v2TreeData)) {
            const newRowKey = nanoid();

            draft.mapping.v2TreeData.push({
              key: newRowKey,
              title: '',
              dataType: 'string',
              disabled: draft.mapping.isMonitorLevelAccess,
            });
          }
        }

        // todo ashu delete from v2Mappings as well
        break;
      }

      case actionTypes.MAPPING.V2.ADD_ROW: {
        if (!draft.mapping) break;

        const {node, nodeSubArray, nodeIndexInSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (nodeIndexInSubArray >= 0) {
          const newRowKey = nanoid();

          nodeSubArray.splice(nodeIndexInSubArray + 1, 0, {
            key: newRowKey,
            title: '',
            parentKey: node.parentKey,
            parentExtract: node.parentExtract,
            dataType: 'string',
          });
        }

        // todo ashu add in v2Mappings as well
        break;
      }

      case actionTypes.MAPPING.V2.UPDATE_DATA_TYPE: {
        if (!draft.mapping) break;

        const {node} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (isEmpty(node)) break;

        node.dataType = newDataType;
        // node.expanded = true;

        const newRowKey = nanoid();

        if (newDataType === 'object' || newDataType === 'objectarray' || newDataType === 'arrayarray') {
          if (isEmpty(node.children)) {
            node.children = [{
              key: newRowKey,
              title: '',
              parentKey: node.key,
              parentExtract: node.extract,
              dataType: 'string',
            }];
          }
          break;
        }
        // now handle the primitive data types or which can not have children
        if (PRIMITIVE_DATA_TYPES.includes(newDataType) || ARRAY_DATA_TYPES.includes(newDataType)) {
          if (!isEmpty(node.children)) {
            delete node.children;
          }
        }

        // todo ashu update in v2Mappings as well
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

        // todo ashu add in v2Mappings as well
        break;
      }

      case actionTypes.MAPPING.V2.PATCH_FIELD: {
        if (!draft.mapping) break;
        const {node} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (node) {
          if (field === 'extract') {
            if (value.indexOf('"') === 0) {
              delete node.extract;
              node.hardCodedValue = value.replace(/(^")|("$)/g, '');
            } else {
              delete node.hardCodedValue;
              node.extract = value;
            }
          } else {
            node[field] = value;
          }
        }

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

  const { mappings = [], mappingsCopy = [], lookups = [], lookupsCopy = [] } = state.mapping;
  let isMappingsChanged = !isMappingEqual(mappings, mappingsCopy);

  if (!isMappingsChanged) {
    const lookupsDiff = differenceWith(lookupsCopy, lookups, isEqual);

    isMappingsChanged =
      lookupsCopy.length !== lookups.length || lookupsDiff.length;
  }

  return !!isMappingsChanged;
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
