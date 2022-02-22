import { nanoid } from 'nanoid';
import TabRow from './TabbedRow';

export const PRIMITIVE_DATA_TYPES = ['string', 'number', 'boolean'];
export const ARRAY_DATA_TYPES = ['stringarray', 'numberarray', 'booleanarray', 'objectarray', 'arrayarray'];
export const DATA_TYPES =
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

function iterate(mappings, treeData, parentKey, parentExtract) {
  mappings.forEach(m => {
    const {dataType, mappings: objMappings, buildArrayHelper, extract: currNodeExtract} = m;
    const children = [];
    const currNodeKey = nanoid();

    const nodeToPush = {
      key: currNodeKey,
      parentKey,
      parentExtract,
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

        iterate(objMappings, children, currNodeKey, currNodeExtract);
      }

      return;
    }
    if (ARRAY_DATA_TYPES.includes(dataType)) {
      // invalid mappings, nothing to do
      if (!buildArrayHelper) {
        return;
      }
      if (dataType === 'objectarray' || dataType === 'arrayarray') {
        let sourceExtract;
        let multipleSources = false;

        buildArrayHelper.forEach(obj => {
          const {extract, mappings} = obj;

          sourceExtract = extract ? `${sourceExtract ? `${sourceExtract};` : ''}${extract}` : sourceExtract;

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
          } else {
            multipleSources = true;
          }

          nodeToPush.children = children;

          iterate(mappings, children, currNodeKey, extract);
        });
        nodeToPush.combinedExtract = sourceExtract;

        return;
      }

      // for primitive array types
      let extract;

      buildArrayHelper.forEach(obj => {
        extract = `${extract ? `${extract};` : ''}${obj.extract}`;
      });

      nodeToPush.combinedExtract = extract;
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

export const sampleData = {
  fName: 'John',
  lName: 'Doe',
  age: 20,
  married: true,
  hobbies: ['yoga', 'sports'],
  daysBusy: [1, 4],
  father: {
    firstName: 'Dad',
  },
  mother: {
    fName: 'Mom',
    lName: 'Doe',
  },
  siblings: [
    {
      fName: 'Bro',
      lName: '1',
    },
    {
      fName: 'Bro',
      lName: '2',
      age: 34,
    },
  ],
};
