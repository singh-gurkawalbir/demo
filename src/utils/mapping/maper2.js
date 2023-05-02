import { isEmpty, forEach } from 'lodash';
import { generateId } from '../string';
import customCloneDeep from '../customCloneDeep';
import { MAPPING_DATA_TYPES, TYPEOF_TO_DATA_TYPE } from '.';
import { getUnionObject, pickFirstObject } from '../jsonPaths';

// Currently it contains only few mapper2 util functions
// Further mapper2 util functions should be created here

// will return all the parent nodes of the given node which is to be searched
// if tree is like a->b->c then it will return [a, b, c]
// only goes inside children if generate value is set
export const findNodeInTreeWithParents = (data, prop, value) => {
  let node;
  let nodeSubArray;
  let nodeIndexInSubArray;
  let parentsList = [];

  // using lodash forEach here as it provides a way to exit from loop
  // unlike Array forEach function
  forEach(data, (item, i, arr) => {
    if (item[prop] === value) {
      node = item;
      nodeSubArray = arr;
      nodeIndexInSubArray = i;
      parentsList = [item];

      // if found exit from loop
      return false;
    }
    // trying to go deep if the children has some generate value set
    if (item.generate && item.children) {
      const returnToParent = findNodeInTreeWithParents(item.children, prop, value);

      node = returnToParent.node;
      nodeSubArray = returnToParent.nodeSubArray;
      nodeIndexInSubArray = returnToParent.nodeIndexInSubArray;

      if (returnToParent.node) parentsList = [item, ...returnToParent.parentsList];

      // if found exit from loop
      if (node) return false;
    }
  });

  return {node, nodeSubArray, nodeIndexInSubArray, parentsList};
};

// if data is a tree like a->b->c->d and parentsList is [a1, b1, c1]
// it will match generate and jsonPath till c and return node c
// if no match found it will return undefined
// if data is a tree a->b->c and parentsList is [a1, b1, d1] then undefined will be returned as sequence does not matched
export const findNodeWithGivenParentsList = (data, parentsList) => {
  let node;

  // using lodash forEach here as it provides a way to exit from loop
  // unlike Array forEach function
  forEach(data, item => {
    const parentsListNode = parentsList[0];

    if (item?.generate === parentsListNode?.generate && item?.dataType === parentsListNode?.dataType) {
      if (parentsList.length === 1) {
        node = item;

        return false;
      }
      if (item.children) {
        const returnToParent = findNodeWithGivenParentsList(item.children, parentsList.slice(1));

        node = returnToParent.node;

        if (node) return false;
      }
    }
  });

  return {node};
};

// here if data is a tree with structure a1->b1->c1->d->e and parentsList is [a2, b2, c2, d2, e2]
// it will match till generate and jsonPath matches hence return node c1 as the node and [d2, e2] as the remaining leftParentsList
export const findLastNodeWithMatchingParent = (data, parentsList) => {
  let node;
  let leftParentsList = [];

  // using lodash forEach here as it provides a way to exit from loop
  // unlike Array forEach function
  forEach(data, item => {
    const parentsListNode = parentsList[0];

    if (item?.generate && item?.jsonPath === parentsListNode?.jsonPath && item?.dataType === parentsListNode?.dataType) {
      // item found set the node and remaining parentsList as leftParentsList
      node = item;
      leftParentsList = parentsList.slice(1);

      // if children then explore
      if (item.children) {
        const returnToParent = findLastNodeWithMatchingParent(item.children, parentsList.slice(1));

        // node found inside hence set node and leftParentsList to new values
        if (returnToParent.node) {
          node = returnToParent.node;
          leftParentsList = returnToParent.leftParentsList;
        }
      }

      // node found hence break out of loop
      return false;
    }
  });

  return {node, leftParentsList};
};

// if parentsList is [a, b, c] then this will return a tree like a->b->c
// will add a empty row in the end of c if the dataType is object or objectarray
export const constructDestinationTreeFromParentsList = (parentsList = []) => {
  let node = {};

  if (isEmpty(parentsList)) return node;

  if (parentsList.length === 1) {
    node = customCloneDeep(parentsList[0]);

    node.key = generateId();
    if (node.dataType === MAPPING_DATA_TYPES.OBJECT || node.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
      node.children = [{
        key: generateId(),
        title: '',
        dataType: MAPPING_DATA_TYPES.STRING,
        isEmptyRow: true,
        parentKey: node.key,
      }];
    }

    return node;
  }

  node = customCloneDeep(parentsList[0]);
  node.key = generateId();
  const childNode = constructDestinationTreeFromParentsList(parentsList.slice(1));

  if (node.dataType === MAPPING_DATA_TYPES.OBJECT || node.dataType === MAPPING_DATA_TYPES.OBJECTARRAY) {
    childNode.parentKey = node.key;
    node.children = [childNode];
  }

  return node;
};

// to create the set of jsonPath+dataType from the given tree
// add these values to the set passed as jsonPathSet
const getJsonPathSet = (data, jsonPathSet) => {
  if (isEmpty(data)) return new Set();

  forEach(data, item => {
    if (item?.generate && item.dataType) {
      jsonPathSet.add(`${item.jsonPath}+${item.dataType}`);
      if (item?.children) getJsonPathSet(item.children, jsonPathSet);
    }
  });
};

export const getRequiredMappingsJsonPaths = (data, jsonPathList = []) => {
  if (isEmpty(data)) return jsonPathList;

  forEach(data, item => {
    if (item?.generate && item.dataType && item?.isRequired) {
      jsonPathList.push(`${item.jsonPath}+${item.dataType}`);
      if (item?.children) getRequiredMappingsJsonPaths(item.children, jsonPathList);
    }
  });
};

// will check each node jsonPath+dataType value in the given set
// if present then mark it disabled=true
const markDestinationTree = (data, jsonPathSet) => {
  if (!jsonPathSet) return data;

  const clonedChildren = data.map(item => {
    const clonedNode = {...item};

    if (item?.generate && jsonPathSet.has(`${item.jsonPath}+${item.dataType}`)) {
      clonedNode.disabled = true;

      if (item?.children) {
        clonedNode.children = markDestinationTree(item.children, jsonPathSet);
      }
    }

    return clonedNode;
  });

  return clonedChildren;
};

// will mark all destinations of destinationTree already present in treeData
export const markPresentDestinations = (treeData, destinationTree) => {
  if (!destinationTree || isEmpty(treeData) || !destinationTree[0]?.children) return destinationTree;
  const jsonPathSet = new Set();

  // create a set of jsonPaths+dataType
  getJsonPathSet(treeData, jsonPathSet);

  const markedDestinationTree = {...destinationTree[0], children: markDestinationTree(destinationTree[0].children, jsonPathSet)};

  return [markedDestinationTree];
};

function recursivelyCreateBaseDestinationTree({dataObj, treeData, parentJsonPath = '', parentKey, requiredMappings}) {
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

      recursivelyCreateBaseDestinationTree({dataObj: v, treeData: children, parentJsonPath: jsonPath, parentKey: key, requiredMappings});

      return;
    }

    if (type === '[object Array]') {
      // suffix with [*] for object array fields
      const isRequired = requiredMappings.some(r => r.startsWith(`${jsonPath}[*]`));

      // if empty array, consider it as object array
      if (isEmpty(v)) {
        nodeToPush.isRequired = isRequired;
        nodeToPush.dataType = MAPPING_DATA_TYPES.OBJECTARRAY;
        nodeToPush.children = [];

        return;
      }

      if (Object.prototype.toString.apply(v[0]) === '[object Object]' && !isEmpty(v[0])) {
        const children = [];

        nodeToPush.isRequired = isRequired;
        nodeToPush.dataType = MAPPING_DATA_TYPES.OBJECTARRAY;
        nodeToPush.children = children;

        recursivelyCreateBaseDestinationTree({dataObj: getUnionObject(v), treeData: children, parentJsonPath: jsonPath ? `${jsonPath}[*]` : '', parentKey: key, requiredMappings});

        return;
      }

      // primitive array
      const valueType = Object.prototype.toString.apply(v[0]);

      nodeToPush.dataType = `${TYPEOF_TO_DATA_TYPE[valueType]}array`;
    }
  });
}

export const makeBaseDestinationTree = (importSampleData, requiredMappings = []) => {
  const treeData = [];

  if (!importSampleData) return treeData;

  const dataObj = pickFirstObject(importSampleData);

  recursivelyCreateBaseDestinationTree({
    dataObj,
    treeData,
    requiredMappings,
    parentKey: undefined,
  });

  return treeData;
};
