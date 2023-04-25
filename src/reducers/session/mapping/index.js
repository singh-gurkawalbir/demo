import { original, produce } from 'immer';
import { differenceWith, isEqual, isEmpty } from 'lodash';
import actionTypes from '../../../actions/types';
import customCloneDeep from '../../../utils/customCloneDeep';
import {
  isMappingEqual,
  compareV2Mappings,
  findNodeInTree,
  PRIMITIVE_DATA_TYPES,
  ARRAY_DATA_TYPES,
  getAllKeys,
  rebuildObjectArrayNode,
  getFirstActiveTab,
  insertSiblingsOnDestinationUpdate,
  hideOtherTabRows,
  MAPPING_DATA_TYPES,
  autoCreateDestinationStructure,
  isDropDragPositionSame,
  deleteNonRequiredMappings,
  updateChildrenJSONPath,
  getCombinedExtract,
  buildExtractsHelperFromExtract,
  getSelectedExtractDataTypes,
  isMapper2HandlebarExpression,
  findNodeInTreeWithParents,
  findNodeWithGivenParentsList,
  markPresentDestinations,
  constructDestinationTreeFromParentsList,
  findLastNodeWithMatchingParent} from '../../../utils/mapping';
import { generateId } from '../../../utils/string';

export const expandRow = (draft, key) => {
  if (!draft || !key) return;

  if (draft.mapping.expandedKeys) {
    draft.mapping.expandedKeys.push(key);

    return;
  }
  draft.mapping.expandedKeys = [key];
};

// this util will update parent reference props on children
// when data type is updated
export const updateChildrenProps = (children, parentNode, dataType) => {
  if (!children || !children.length) return children;
  const childrenCopy = customCloneDeep(children);

  const {key, extractsArrayHelper} = parentNode;
  const newParentExtract = extractsArrayHelper?.[0]?.extract;

  // only for object array data type, add parent reference fields
  if (dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
    return childrenCopy.map(c => ({
      ...c,
      parentExtract: newParentExtract,
      parentKey: key,
      isEmptyRow: false,
    }));
  }

  // remove parent row reference from children for other data types
  return childrenCopy.reduce((acc, c) => {
    if (c.isTabNode) return acc;

    const {
      parentExtract,
      parentKey,
      hidden,
      className,
      activeTab,
      isEmptyRow,
      ...rest} = c;

    // only keep first extract children
    if (c.parentExtract === newParentExtract) {
      acc.push(rest);
    }

    return acc;
  }, []);
};

// TODO will remove this function and add logic directly
/* eslint-disable no-param-reassign */
export const updateSourceDataType = (node, oldSourceDataType, newDataType) => {
  if (!node) return node;

  if (oldSourceDataType === newDataType) return node;
  if (node.extractsArrayHelper && node.extractsArrayHelper.length) {
    if (node.extractsArrayHelper[0].sourceDataType === newDataType) return node;
    node.extractsArrayHelper[0].sourceDataType = newDataType;
  } else {
    node.sourceDataType = newDataType;
  }

  return node;
};
/* eslint-enable no-param-reassign */

// updates specific to data type change
export const updateDestinationDataType = (draft, node, oldDataType, newDataType) => {
  if (!node) return node;

  const newNode = customCloneDeep(node);
  const newRowKey = generateId();

  // data type not changed, nothing to do
  if (oldDataType === newDataType) return node;

  newNode.dataType = newDataType;

  if (newDataType === MAPPING_DATA_TYPES.OBJECT || newDataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
    expandRow(draft, newNode.key);

    const oldSourceDataType = PRIMITIVE_DATA_TYPES.includes(oldDataType) ? newNode.sourceDataType : undefined;

    newNode.extractsArrayHelper = newNode.extractsArrayHelper || buildExtractsHelperFromExtract({sourceField: newNode.extract, extractsTree: draft.mapping.extractsTree, oldSourceDataType});

    delete newNode.hardCodedValue;
    delete newNode.lookupName;

    if (newDataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      newNode.children = updateChildrenProps(newNode.children, newNode, MAPPING_DATA_TYPES.OBJECTARRAY);

      delete newNode.extract;
      delete newNode.mappings;
      delete newNode.copySource;
      delete newNode.default;
      delete newNode.sourceDataType;
    } else {
      newNode.copySource = newNode.extractsArrayHelper?.[0]?.copySource;
      newNode.extract = newNode.copySource === 'yes' ? newNode.extractsArrayHelper?.[0]?.extract : undefined;
      // extractsArrayHelper is used only for array data types to store each source config
      delete newNode.extractsArrayHelper;
      // delete existing children if new data type is object
      delete newNode.children;
      delete newNode.buildArrayHelper;
      delete newNode.activeTab;
    }

    newNode.children = updateChildrenJSONPath(newNode)?.children;

    const parentExtract = newNode.extractsArrayHelper?.[0]?.extract;

    if (isEmpty(newNode.children) && (newDataType === MAPPING_DATA_TYPES.OBJECTARRAY || newNode.copySource !== 'yes')) {
      newNode.children = [{
        key: newRowKey,
        title: '',
        parentKey: newNode.key,
        parentExtract,
        dataType: MAPPING_DATA_TYPES.STRING,
      }];
    }

    return newNode;
  }
  // now handle other primitive arrays which can not have children
  if (ARRAY_DATA_TYPES.includes(newDataType)) {
    delete newNode.children;

    const oldSourceDataType = PRIMITIVE_DATA_TYPES.includes(oldDataType) ? newNode.sourceDataType : undefined;

    newNode.extractsArrayHelper = newNode.extractsArrayHelper || buildExtractsHelperFromExtract({sourceField: newNode.extract, extractsTree: draft.mapping.extractsTree, oldSourceDataType});
    // if array helper does not exist (eg when extract is empty)
    // then we keep the old sourceDataType for reference
    if (newNode.extractsArrayHelper?.length) {
      delete newNode.sourceDataType;
    }
    delete newNode.extract;

    return newNode;
  }
  // handle the primitive data types
  if (PRIMITIVE_DATA_TYPES.includes(newDataType)) {
    delete newNode.children;
    newNode.extract = newNode.extract || getCombinedExtract(newNode.extractsArrayHelper).join(',');
    if (ARRAY_DATA_TYPES.includes(oldDataType)) {
      newNode.sourceDataType = newNode.extractsArrayHelper?.length ? newNode.extractsArrayHelper[0].sourceDataType : MAPPING_DATA_TYPES.STRING;
    }
    delete newNode.extractsArrayHelper;
  }

  return newNode;
};

const recursivelySearchExtracts = (currNode, inputValues, skipFilter) => {
  let anyChildMatchFound = false;

  const clonedNode = {...currNode};

  clonedNode.children = currNode.children.map(childNode => {
    let clonedChild = {...childNode};

    if (childNode.children) {
      clonedChild = recursivelySearchExtracts(childNode, inputValues, skipFilter);
    }

    const {jsonPath = ''} = clonedChild;
    let matchFound = false;

    // if typed input is empty, or skipFilter is true
    // then do not hide any node
    if (!inputValues.length || skipFilter) {
      delete clonedChild.hidden;
      delete clonedChild.className;

      return clonedChild;
    }

    inputValues.forEach(i => {
      if (i && jsonPath && jsonPath.toUpperCase().indexOf(i) > -1) {
        matchFound = true;
      }
    });

    if (!matchFound) {
    // if no match found, hide the node only if all its children were also not matched
    // else do not hide this parent node (if any child match was found)
      if (!clonedChild.childMatchFound) {
        clonedChild.hidden = true;
        clonedChild.className = 'hideRow';
      } else {
        // match is found so do not hide
        anyChildMatchFound = true;
        delete clonedChild.hidden;
        delete clonedChild.className;
      }
    } else {
      // match is found so do not hide
      anyChildMatchFound = true;
      delete clonedChild.hidden;
      delete clonedChild.className;
    }

    return clonedChild;
  });

  // if any children was matched, then set a flag on parent node to indicate some child was matched
  if (anyChildMatchFound) {
    // don't hide parent
    clonedNode.childMatchFound = true;
  } else {
    delete clonedNode.childMatchFound;
  }

  return clonedNode;
};

const wrapUpInList = (value, isGroupedSampleData, skipNodeWrap) => {
  if (!value) return [];

  const copyValue = customCloneDeep(value);

  if (skipNodeWrap) {
    return [copyValue];
  }

  if (isGroupedSampleData) {
    return [{
      key: generateId(),
      title: '',
      dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
      children: copyValue,
    }];
  }

  return [{
    key: generateId(),
    title: '',
    dataType: MAPPING_DATA_TYPES.OBJECT,
    children: copyValue,
  }];
};

const emptyObj = {};
const emptyArr = [];

export default (state = {}, action) => {
  const {
    type,
    key,
    field,
    searchKey,
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
    filter,
    requiredMappings,
    extractsTree,
    v2Key,
    isSource,
    newDataType,
    isMonitorLevelAccess,
    dragDropInfo,
    version,
    expanded,
    expandedKeys,
    errors,
    newTabValue,
    newTabExtractId,
    importSampleData,
    uploadedData,
    isCSVOrXLSX,
    inputValue,
    propValue,
    isSettingsPatch,
    selectedExtractJsonPath,
    destinationTree,
    requiredMappingsJsonPaths,
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
          expandedKeys: getAllKeys(v2TreeData),
          flowId,
          importId,
          subRecordMappingId,
          status: 'received',
          isGroupedSampleData,
          isMonitorLevelAccess,
          version,
          requiredMappings,
          extractsTree,
          importSampleData,
          isGroupedOutput,
          mappingsCopy: customCloneDeep(mappings),
          lookupsCopy: customCloneDeep(lookups),
          v2TreeDataCopy: customCloneDeep(v2TreeData),
          destinationTree: customCloneDeep(destinationTree),
          requiredMappingsJsonPaths: customCloneDeep(requiredMappingsJsonPaths),
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
          const newKey = generateId();
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
          draft.mapping.mappingsCopy = customCloneDeep(draft.mapping.mappings);
          draft.mapping.lookupsCopy = customCloneDeep(draft.mapping.lookups);
          draft.mapping.v2TreeDataCopy = customCloneDeep(draft.mapping.v2TreeData);
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

          const newRowKey = generateId();

          const node = {
            key: newRowKey,
            title: '',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            generateDisabled: true,
            disabled: draft.mapping.isMonitorLevelAccess,
          };

          node.children = updateChildrenProps(draft.mapping.v2TreeData, node, MAPPING_DATA_TYPES.OBJECTARRAY);

          draft.mapping.v2TreeData = [node];
          expandRow(draft, newRowKey);
        } else {
          // top disabled row does not exist
          if (!draft.mapping.v2TreeData[0]?.generateDisabled) break;

          draft.mapping.v2TreeData = updateChildrenProps(draft.mapping.v2TreeData[0].children,
            {
              extractsArrayHelper: draft.mapping.v2TreeData[0].extractsArrayHelper, // pass old node extractsArrayHelper to pick first extract
            },
            MAPPING_DATA_TYPES.OBJECT);

          // add empty row if no children were found
          if (isEmpty(draft.mapping.v2TreeData)) {
            const emptyRowKey = generateId();

            draft.mapping.v2TreeData = [{
              key: emptyRowKey,
              title: '',
              dataType: MAPPING_DATA_TYPES.STRING,
              disabled: draft.mapping.isMonitorLevelAccess,
              isEmptyRow: true,
            }];
          }
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
        if (!draft.mapping) break;
        draft.mapping.expandedKeys = expandedKeys;
        break;

      case actionTypes.MAPPING.V2.DELETE_ROW: {
        if (!draft.mapping) break;

        const {node, nodeSubArray, nodeIndexInSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (nodeIndexInSubArray >= 0) {
          nodeSubArray.splice(nodeIndexInSubArray, 1);
          const matchingChildren = nodeSubArray?.filter(c => c.parentExtract === node.parentExtract);

          // add empty row if all the mappings have been deleted
          if (isEmpty(nodeSubArray) || isEmpty(matchingChildren)) {
            const emptyRowKey = generateId();

            nodeSubArray.push({
              key: emptyRowKey,
              title: '',
              dataType: MAPPING_DATA_TYPES.STRING,
              disabled: draft.mapping.isMonitorLevelAccess,
              isEmptyRow: true,
              parentExtract: node.parentExtract,
              parentKey: node.parentKey,
            });
          }
        }

        break;
      }

      case actionTypes.MAPPING.V2.ADD_ROW: {
        if (!draft.mapping) break;

        const {node, nodeSubArray, nodeIndexInSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (nodeIndexInSubArray >= 0) {
          const newRowKey = generateId();

          nodeSubArray.splice(nodeIndexInSubArray + 1, 0, {
            key: newRowKey,
            title: '',
            parentKey: node.parentKey,
            parentExtract: node.parentExtract,
            dataType: MAPPING_DATA_TYPES.STRING,
            sourceDataType: MAPPING_DATA_TYPES.STRING,
          });
          // adding the newKey to state so that new row can be focused
          draft.mapping.newRowKey = newRowKey;

          // adding new row should remove any search in progress
          delete draft.mapping.searchKey;
        }

        break;
      }

      case actionTypes.MAPPING.V2.UPDATE_DATA_TYPE: {
        if (!draft.mapping) break;

        const {node, nodeIndexInSubArray, nodeSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (isEmpty(node)) break;
        if (isSource) {
          nodeSubArray[nodeIndexInSubArray] = updateSourceDataType(node, node.sourceDataType, newDataType);
        } else {
          nodeSubArray[nodeIndexInSubArray] = updateDestinationDataType(draft, node, node.dataType, newDataType);
        }
        delete nodeSubArray[nodeIndexInSubArray].isEmptyRow;
        break;
      }

      case actionTypes.MAPPING.V2.DRAG_DROP: {
        if (!draft.mapping) break;

        const {node: dropNode = {}, dragNode = {}} = dragDropInfo;
        const dropKey = dropNode.key;
        const dragKey = dragNode.key;
        const dragParentKey = dragNode.parentKey;
        const dropPos = dropNode.pos?.split('-') || [];
        const dragPos = dragNode.pos?.split('-') || [];
        const dragNodeIndex = Number(dragPos[dragPos.length - 1]);
        const dropNodeIndex = Number(dropPos[dropPos.length - 1]);
        const dropPosition = dragDropInfo.dropPosition - dropNodeIndex;

        const {v2TreeData} = draft.mapping;

        // Find dragObject
        const {node: tempDragObj, nodeSubArray: dragSubArr, nodeIndexInSubArray: dragSubArrIndex} = findNodeInTree(v2TreeData, 'key', dragKey);
        let dragObj = tempDragObj;
        const dragParentExtract = dragObj.parentExtract;

        // find drop position
        const {nodeSubArray: dropSubArr, nodeIndexInSubArray: dropSubArrIndex } = findNodeInTree(v2TreeData, 'key', dropKey);

        // find dragObject parentNode
        if (dragParentKey) {
          const {node: dragParentNode} = findNodeInTree(v2TreeData, 'key', dragParentKey);

          if (dragParentNode && dragParentNode?.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
            if (draft.mapping.isGroupedOutput && draft.mapping.v2TreeData[0]?.key === dragParentKey) {
              // do not show notification
            } else {
              // show notification
              draft.mapping.showNotificationFlag = true;
            }
          }
        }

        // drag obj is inserted as the 0th child of a parent
        if (dropPosition === 0) {
          // It is the parent node which is also the drop node.
          const {children = [], key: parentKey, extractsArrayHelper, dataType: parentDataType, jsonPath: parentJsonPath } = dropSubArr[dropNodeIndex];
          const hasTabbedRow = children[0]?.isTabNode;

          if (isDropDragPositionSame({ dropPosition, dragNode, dropNode, dropSubArrIndex, dragNodeIndex, hasTabbedRow })) return;

          // remove dragged node from its curr pos
          dragSubArr.splice(dragSubArrIndex, 1);

          dragObj.parentKey = parentKey;
          dragObj.jsonPath = parentDataType === MAPPING_DATA_TYPES.OBJECTARRAY ? `${parentJsonPath}[*].${dragObj.generate}` : `${parentJsonPath}.${dragObj.generate}`;
          dragObj = updateChildrenJSONPath(dragObj);
          // only array fields have extractsArrayHelper property, hence here it is for object arrays only
          if (extractsArrayHelper?.length) {
            dragObj.parentExtract = extractsArrayHelper[0]?.extract;
          }

          // retain the tabbed row and add dragged node to new pos
          if (hasTabbedRow) {
            children.splice(1, 0, dragObj);
          } else {
            children.unshift(dragObj);
          }
        } else if (dropPosition === -1) { // drag obj inserted before drop node
          if (isDropDragPositionSame({ dropPosition, dragNode, dropNode, dropSubArrIndex, dragNodeIndex })) return;

          // remove dragged node from its curr pos
          dragSubArr.splice(dragSubArrIndex, 1);

          // after the dragged node was removed, find the drop node index again as it could have been changed
          const {nodeIndexInSubArray} = findNodeInTree(v2TreeData, 'key', dropKey);

          const { parentKey, parentExtract } = dropSubArr[nodeIndexInSubArray];

          dragObj.parentKey = parentKey;
          dragObj.parentExtract = parentExtract;
          dragObj.jsonPath = dragObj.generate;
          dragObj = updateChildrenJSONPath(dragObj);

          // add dragged node to new pos
          dropSubArr.splice(nodeIndexInSubArray, 0, dragObj);
        } else if (dropPosition === 1) { // drag obj inserted after drop node
          if (isDropDragPositionSame({ dropPosition, dragNode, dropNode, dropSubArrIndex, dragNodeIndex })) return;

          // remove dragged node from its curr pos
          dragSubArr.splice(dragSubArrIndex, 1);

          // after the dragged node was removed, find the drop node index again as it could have been changed
          const {nodeIndexInSubArray} = findNodeInTree(v2TreeData, 'key', dropKey);

          const { parentKey, parentExtract, isTabNode } = dropSubArr[nodeIndexInSubArray];

          dragObj.parentKey = parentKey;

          // when there is a parentKey, drop is happening at a child level
          if (parentKey) {
            // finding the parent node
            const { node: { extractsArrayHelper, dataType: parentDataType, jsonPath: parentJsonPath } } = findNodeInTree(v2TreeData, 'key', parentKey);

            dragObj.parentExtract = isTabNode ? extractsArrayHelper?.[0]?.extract : parentExtract;

            // jsonPath is decided based on the parent's jsonPath as the drop is happening at child level
            dragObj.jsonPath = parentDataType === MAPPING_DATA_TYPES.OBJECTARRAY ? `${parentJsonPath}[*].${dragObj.generate}` : `${parentJsonPath}.${dragObj.generate}`;
          } else { // when there is no parentKey, the drop is happening at the root level
            dragObj.parentExtract = parentExtract;
            dragObj.jsonPath = dragObj.generate;
          }

          dragObj = updateChildrenJSONPath(dragObj);

          // add dragged node to new pos
          dropSubArr.splice(nodeIndexInSubArray + 1, 0, dragObj);
        }

        // add a new empty child node when the parent is left with no children
        // sometimes child array wouldn't be empty (in case of tabbed object arrays), in that case, checking the parentExtract
        if (dragParentKey && (isEmpty(dragSubArr) || !dragSubArr.some(item => (item.parentExtract || '') === (dragParentExtract || '')))) {
          const newChild = {
            key: generateId(),
            title: '',
            parentKey: dragParentKey,
            dataType: MAPPING_DATA_TYPES.STRING,
            isEmptyRow: true,
          };

          if (dragParentExtract) newChild.parentExtract = dragParentExtract;
          dragSubArr.push(newChild);
        }

        // when the node is dropped into tabbed object array, copy the fields to other tabs as well
        if (dragObj.generate?.length > 0) {
          insertSiblingsOnDestinationUpdate(draft.mapping.v2TreeData, dragObj);
        }
        break;
      }

      case actionTypes.MAPPING.V2.PATCH_FIELD: {
        if (!draft.mapping) break;
        const {node, nodeSubArray, nodeIndexInSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (node) {
          if (field === 'extract') {
            let isHardCoded = false;

            if (value.indexOf('"') === 0) {
              delete node.extract;
              delete node.extractsArrayHelper;
              delete node.default;
              node.hardCodedValue = value.replace(/(^")|("$)/g, '');
              isHardCoded = true;
            } else {
              delete node.hardCodedValue;
              if (ARRAY_DATA_TYPES.includes(node.dataType)) {
                if (!value && node.dataType === MAPPING_DATA_TYPES.OBJECT) {
                  delete node.extractsArrayHelper;
                  // delete all children if extract is empty
                  const newRowKey = generateId();

                  node.children = [{
                    key: newRowKey,
                    title: '',
                    parentKey: node.key,
                    dataType: MAPPING_DATA_TYPES.STRING,
                    isEmptyRow: true,
                  }];
                } else if (node.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
                  // handle tab view
                  nodeSubArray[nodeIndexInSubArray] = rebuildObjectArrayNode(node, value, undefined, draft.mapping.extractsTree, selectedExtractJsonPath);
                }

                // array data types do not have direct 'extract' prop
                if (nodeSubArray[nodeIndexInSubArray]) {
                  delete nodeSubArray[nodeIndexInSubArray].extract;
                  delete nodeSubArray[nodeIndexInSubArray].hardCodedValue;
                  // object array is already handled in rebuildObjectArrayNode
                  if (node.dataType !== MAPPING_DATA_TYPES.OBJECTARRAY) {
                    nodeSubArray[nodeIndexInSubArray].extractsArrayHelper = buildExtractsHelperFromExtract({existingExtractsArray: nodeSubArray[nodeIndexInSubArray].extractsArrayHelper, sourceField: value, extractsTree: draft.mapping.extractsTree, selectedExtractJsonPath, oldSourceDataType: nodeSubArray[nodeIndexInSubArray].sourceDataType});
                  }
                  if (nodeSubArray[nodeIndexInSubArray].extractsArrayHelper?.length) {
                    delete nodeSubArray[nodeIndexInSubArray].sourceDataType;
                  }
                }
              } else if (node.dataType !== MAPPING_DATA_TYPES.OBJECT || node.copySource === 'yes') {
                node.extract = value;
                node.sourceDataType = isSettingsPatch ? node.sourceDataType : getSelectedExtractDataTypes({extractsTree: draft.mapping.extractsTree, selectedValue: value, selectedExtractJsonPath})[0] || MAPPING_DATA_TYPES.STRING;
              }
            }

            if (isHardCoded || isMapper2HandlebarExpression(value, isHardCoded)) {
              node.sourceDataType = MAPPING_DATA_TYPES.STRING;
            }
          } else if (node.isRequired) {
            // do nothing as no changes can be made to 'generate' of a required mapping
          } else {
            node[field] = value;
            node.jsonPath = value;

            const {node: parentNode} = findNodeInTree(draft.mapping.v2TreeData, 'key', node.parentKey);

            if (parentNode && parentNode.jsonPath) {
              node.jsonPath = parentNode.dataType === MAPPING_DATA_TYPES.OBJECTARRAY ? `${parentNode.jsonPath}[*].${value}` : `${parentNode.jsonPath}.${value}`;
            }
            node.children = updateChildrenJSONPath(node)?.children;
          }

          delete node.isEmptyRow;

          if (field === 'generate' && value.length) {
            // updates tree data with new nodes added at eligible parent nodes for object array
            insertSiblingsOnDestinationUpdate(draft.mapping.v2TreeData, node, draft.mapping.lookups);
          }
        }

        break;
      }

      case actionTypes.MAPPING.V2.PATCH_SETTINGS: {
        if (!draft.mapping) break;
        const {node, nodeIndexInSubArray, nodeSubArray} = findNodeInTree(draft.mapping.v2TreeData, 'key', v2Key);

        if (node) {
          const oldDataType = node.dataType;
          const newDataType = value.dataType;
          const {activeExtract: prevActiveExtract} = getFirstActiveTab(node);

          Object.assign(node, value);

          // removing lookups
          if (!value.lookupName) {
            delete node.lookupName;
          }
          if (!value.conditional?.when && node?.conditional?.when) {
            delete node.conditional.when;
          }
          if (value?.conditional?.when === 'extract_not_empty') {
            delete node.default;
          }
          let isHardCoded = false;

          if ('hardCodedValue' in value) {
            delete node.extract;
            delete node.extractsArrayHelper;
            delete node.default;
            isHardCoded = true;
          } else {
            delete node.hardCodedValue;
          }

          // handle if data type changed
          if (oldDataType !== newDataType) {
            nodeSubArray[nodeIndexInSubArray] = updateDestinationDataType(draft, node, oldDataType, newDataType);
            if (newDataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
              // Handles updates of mapper node incase the  data type is changed to Object array with source field settings
              nodeSubArray[nodeIndexInSubArray] = rebuildObjectArrayNode(nodeSubArray[nodeIndexInSubArray], node.extract);
            }
          } else if (newDataType === MAPPING_DATA_TYPES.OBJECT) {
            delete node.extractsArrayHelper;

            if (value.copySource === 'yes') {
              // delete child rows if object is to be copied as is
              delete node.children;
            } else {
              // copySource is no
              // expand parent node
              expandRow(draft, node.key);

              delete node.extract;

              if (isEmpty(node.children)) {
                node.children = [{
                  key: generateId(),
                  title: '',
                  parentKey: node.key,
                  dataType: MAPPING_DATA_TYPES.STRING,
                  isEmptyRow: true,
                }];
              }
            }
          } else if (newDataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
            nodeSubArray[nodeIndexInSubArray] = rebuildObjectArrayNode(node, node.extract, prevActiveExtract);
            delete nodeSubArray[nodeIndexInSubArray].extract;
            delete nodeSubArray[nodeIndexInSubArray].hardCodedValue;
            if (!value.conditional?.when && nodeSubArray[nodeIndexInSubArray]?.conditional?.when) {
              delete nodeSubArray[nodeIndexInSubArray].conditional.when;
            }
          }

          if (isHardCoded || isMapper2HandlebarExpression(node.extract, isHardCoded)) {
            node.sourceDataType = MAPPING_DATA_TYPES.STRING;
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

        if (isEmpty(node)) break;

        nodeSubArray[nodeIndexInSubArray] = hideOtherTabRows(original(node), newTabExtractId);
        nodeSubArray[nodeIndexInSubArray].activeTab = newTabValue;

        break;
      }

      case actionTypes.MAPPING.V2.PATCH_EXTRACTS_FILTER: {
        if (!draft.mapping) break;
        const {extractsTree} = draft.mapping;

        if (!extractsTree || !extractsTree.length || !extractsTree[0].children) break;
        let inputValues = inputValue === '' ? [] : inputValue.split(',');

        // replace '$.' and '$[*].' for better searching,
        // as we are not storing these prefixes in each node jsonPath as well
        inputValues = inputValues.map(i => i.replace(/(\$\.)|(\$\[\*\]\.)/g, '').toUpperCase());

        // pass the first index of tree as the tree length is always 1 because the parent is either $ or $[*]
        // also, skipFilter if last char of input is , or input and selected values are same
        draft.mapping.extractsTree[0] = recursivelySearchExtracts(extractsTree[0], inputValues, inputValue.slice(-1) === ',' || inputValue === propValue);

        break;
      }

      case actionTypes.MAPPING.V2.PATCH_DESTINATION_FILTER: {
        if (!draft.mapping) break;
        const { finalDestinationTree } = draft.mapping;

        if (!finalDestinationTree || !finalDestinationTree.length || !finalDestinationTree[0].children) break;

        const inputValues = [inputValue.toUpperCase()];

        draft.mapping.finalDestinationTree[0] = recursivelySearchExtracts(finalDestinationTree[0], inputValues, inputValue === propValue);

        break;
      }

      case actionTypes.MAPPING.V2.DELETE_ALL:
        if (!draft.mapping) break;

        draft.mapping.v2TreeData = deleteNonRequiredMappings(draft.mapping.v2TreeData);
        if (isEmpty(draft.mapping.v2TreeData)) {
          const key = generateId();

          if (isCSVOrXLSX) {
            draft.mapping.v2TreeData = [{
              key,
              title: '',
              dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
              generateDisabled: true,
              disabled: draft.mapping.isMonitorLevelAccess,
              children: [
                {
                  key: generateId(),
                  title: '',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  disabled: draft.mapping.isMonitorLevelAccess,
                  isEmptyRow: true,
                  parentKey: key,
                },
              ],
            }];
          } else {
            draft.mapping.v2TreeData = [{
              key,
              title: '',
              dataType: MAPPING_DATA_TYPES.STRING,
              disabled: draft.mapping.isMonitorLevelAccess,
              isEmptyRow: true,
            }];
          }
        }
        delete draft.mapping.filter;

        break;

      case actionTypes.MAPPING.V2.AUTO_CREATE_STRUCTURE:
        if (!draft.mapping) break;
        draft.mapping.v2TreeData = [];
        draft.mapping.v2TreeData = autoCreateDestinationStructure(uploadedData, draft.mapping.requiredMappings, isCSVOrXLSX);

        if (draft.mapping.v2TreeData.length === 1 &&
          draft.mapping.v2TreeData[0].dataType === MAPPING_DATA_TYPES.OBJECTARRAY &&
          !draft.mapping.v2TreeData[0].generate &&
          draft.mapping.v2TreeData[0].generateDisabled) {
          draft.mapping.isGroupedOutput = true;
        } else {
          draft.mapping.isGroupedOutput = false;
        }

        draft.mapping.autoCreated = true;
        delete draft.mapping.filter;
        break;

      case actionTypes.MAPPING.V2.TOGGLE_AUTO_CREATE_FLAG:
        if (!draft.mapping) break;
        draft.mapping.autoCreated = !draft.mapping.autoCreated;
        break;

      case actionTypes.MAPPING.V2.SEARCH_TREE: {
        if (!draft.mapping) break;
        draft.mapping.searchKey = searchKey;
        delete draft.mapping.filter;
        break;
      }

      case actionTypes.MAPPING.V2.UPDATE_FILTER: {
        if (!draft.mapping) break;
        if (filter?.length) {
          draft.mapping.filter = filter;
          delete draft.mapping.searchKey;
        } else {
          draft.mapping.filter = [];
        }

        break;
      }

      case actionTypes.MAPPING.V2.DELETE_NEW_ROW_KEY: {
        if (!draft.mapping) break;

        delete draft.mapping.newRowKey;
        break;
      }

      case actionTypes.MAPPING.V2.FINAL_DESTINATION_TREE: {
        if (!draft.mapping.destinationTree) break;
        const treeData = draft.mapping.isGroupedOutput ? draft.mapping.v2TreeData[0].children : draft.mapping.v2TreeData;

        const {node = {}, parentsList = []} = findNodeInTreeWithParents(treeData, 'key', v2Key);
        let treeToBeRendered = [];

        if (node) {
          if (!parentsList.length) treeToBeRendered = [];
          if (parentsList.length === 1) treeToBeRendered = wrapUpInList(draft.mapping.destinationTree, draft.mapping.isGroupedOutput, false);
          if (parentsList.length > 1) {
            const {node: destinationNode} = findNodeWithGivenParentsList(draft.mapping.destinationTree, parentsList.slice(0, -1));

            treeToBeRendered = wrapUpInList(destinationNode, draft.mapping.isGroupedOutput, true);
          }
        }

        draft.mapping.finalDestinationTree = markPresentDestinations(treeData, treeToBeRendered);

        break;
      }

      case actionTypes.MAPPING.V2.ADD_SELECTED_DESTINATION: {
        if (!draft.mapping.destinationTree) break;
        const treeData = draft.mapping.isGroupedOutput ? draft.mapping.v2TreeData[0].children : draft.mapping.v2TreeData;

        const {parentsList = []} = findNodeInTreeWithParents(draft.mapping.destinationTree, 'key', v2Key);
        const {node = {}, leftParentsList = []} = findLastNodeWithMatchingParent(treeData, parentsList);

        if (!isEmpty(node)) {
          const newNode = constructDestinationTreeFromParentsList(leftParentsList);

          node.children.push(newNode);
          newNode.parentKey = node.key;
          insertSiblingsOnDestinationUpdate(draft.mapping.v2TreeData, newNode, draft.mapping.lookups);
        } else {
          const newNode = constructDestinationTreeFromParentsList(parentsList);

          if (draft.mapping.isGroupedOutput) {
            const node = draft.mapping.v2TreeData[0];

            node.children.push(newNode);
            newNode.parentKey = node.key;
          } else {
            draft.mapping.v2TreeData.push(newNode);
          }
        }
        break;
      }
      case actionTypes.MAPPING.V2.TOGGLE_NOTIFICATION_FLAG: {
        delete draft.mapping.showNotificationFlag;
        break;
      }
      default:
    }
  });
};

export const selectors = {};

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

selectors.v2MappingsExtractsTree = state => {
  if (!state || !state.mapping) {
    return emptyArr;
  }

  return state.mapping.extractsTree || emptyArr;
};

selectors.v2MappingsDestinationTree = state => {
  if (!state || !state.mapping) {
    return emptyArr;
  }

  return state.mapping.finalDestinationTree || emptyArr;
};

selectors.searchKey = state => {
  if (!state || !state.mapping) {
    return;
  }

  return state.mapping.searchKey;
};

selectors.newRowKey = state => {
  if (!state || !state.mapping) {
    return;
  }

  return state.mapping.newRowKey;
};

selectors.mapper2Filter = state => state?.mapping?.filter || emptyArr;

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

selectors.v2MappingChanged = state => {
  if (!state || !state.mapping) {
    return false;
  }

  const { v2TreeData = [], v2TreeDataCopy = [] } = state.mapping;
  const isV2MappingsChanged = compareV2Mappings(v2TreeData, v2TreeDataCopy);

  return !!isV2MappingsChanged;
};

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

selectors.mappingImportSampleData = state => {
  if (!state || !state.mapping) {
    return;
  }

  return state.mapping.importSampleData;
};
