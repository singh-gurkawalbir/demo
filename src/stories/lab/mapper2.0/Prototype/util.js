import shortid from 'shortid';

export const PRIMITIVE_DATA_TYPES = ['string', 'number', 'boolean'];
export const ARRAY_DATA_TYPES = ['stringarray', 'numberarray', 'booleanarray', 'objectarray', 'arrayarray'];

function iterate(mappings, treeData, parentKey) {
  mappings.forEach(m => {
    const {dataType, mappings: objMappings, extract, generate} = m;

    if (PRIMITIVE_DATA_TYPES.includes(dataType)) {
      treeData.push({
        key: shortid.generate(),
        parentKey,
        ...m,
      });

      return;
    }
    if (dataType === 'object') {
      if (objMappings) {
        const children = [];
        const key = shortid.generate();

        treeData.push({
          key,
          parentKey,
          generate,
          extract,
          dataType: 'object',
          children,
        });
        iterate(objMappings, children, key);
      } else if (extract) {
        treeData.push({
          key: shortid.generate(),
          parentKey,
          ...m,
        });
      }

      return;
    }
    if (ARRAY_DATA_TYPES.includes(dataType)) {
      // todo
    }
  });

  return treeData;
}

export function generateTreeFromMappings(input) {
  const treeData = [];

  if (!input) return treeData;
  const {type: mappings} = input;

  if (!mappings) return treeData;

  return iterate(mappings, treeData);
}

export function allowDrop({ dragNode, dropNode }) {
  const {parentKey: dragNodeParentKey} = dragNode;
  const {parentKey: dropNodeParentKey} = dropNode;

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

export const findNode = (data, key, callback) => {
  data.forEach((item, index, arr) => {
    if (item.key === key) {
      callback(item, index, arr);

      return;
    }
    if (item.children) {
      findNode(item.children, key, callback);
    }
  });
};
