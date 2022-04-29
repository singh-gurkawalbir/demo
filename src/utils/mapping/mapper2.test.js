/* global describe, test,  expect */
import util, {
  MAPPING_DATA_TYPES,
  getAllKeys,
  compareV2Mappings,
  getFinalSelectedExtracts,
  filterExtractsNode,
} from '.';

describe('v2 mapping utils', () => {
  test('getV2DefaultActionValue util', () => {
    const testCases = [
      {input: {default: ''}, output: 'useEmptyString'},
      {input: {default: null}, output: 'useNull'},
      {input: {default: 'null'}, output: 'default'},
      {input: {default: 'test'}, output: 'default'},
      {input: {conditional: {when: 'extract_not_empty'}, default: null}, output: 'discardIfEmpty'},
      {input: {}, output: undefined},
    ];

    testCases.forEach(({input, output}) => {
      expect(util.getV2DefaultActionValue(input)).toEqual(output);
    });
  });
  test('getV2DefaultLookupActionValue util', () => {
    const testCases = [
      {input: {allowFailures: false}, output: 'disallowFailure'},
      {input: {allowFailures: false, default: ''}, output: 'disallowFailure'},
      {input: {allowFailures: true, useDefaultOnMultipleMatches: true}, output: 'useDefaultOnMultipleMatches'},
      {input: {allowFailures: true, default: 'asd'}, output: 'default'},
      {input: {allowFailures: true, default: ''}, output: 'useEmptyString'},
      {input: {allowFailures: true, default: null}, output: 'useNull'},
      {input: {allowFailures: true, default: 'null'}, output: 'default'},
      {node: {conditional: {when: 'extract_not_empty'}}, input: {allowFailures: false, default: 'null'}, output: 'discardIfEmpty'},
    ];

    testCases.forEach(({node, input, output}) => {
      expect(util.getV2DefaultLookupActionValue(node, input)).toEqual(output);
    });
  });

  describe('hideOtherTabRows util', () => {});
  describe('rebuildObjectArrayNode util', () => {});
  describe('buildTreeFromV2Mappings util', () => {});
  describe('hasV2MappingsInTreeData util', () => {});
  describe('buildV2MappingsFromTree util', () => {});
  describe('allowDrop util', () => {});
  describe('findNodeInTree util', () => {});
  describe('buildExtractsTree util', () => {});
  describe('filterExtractsNode util', () => {
    test('should not throw exception for invalid args', () => {
      expect(filterExtractsNode()).toEqual(false);
    });
    test('should return false if node is already selected', () => {
      expect(filterExtractsNode({selected: true, jsonPath: 'lname'}, '', 'lname')).toEqual(false);
    });
    test('should return false if extract value and new input value is ame', () => {
      expect(filterExtractsNode({jsonPath: 'lname'}, 'lname', 'lname')).toEqual(false);
    });
    test('should return false if no match is found', () => {
      expect(filterExtractsNode({jsonPath: 'lname'}, '', '$.firstname')).toEqual(false);
      expect(filterExtractsNode({jsonPath: 'object.name'}, '', 'firstname')).toEqual(false);
      expect(filterExtractsNode({jsonPath: 'sports'}, '', 'name,$.lname,$[*].age')).toEqual(false);
    });
    test('should return true if any match is found in multiple input values', () => {
      expect(filterExtractsNode({jsonPath: 'age'}, '', 'name,$.lname,$[*].age')).toEqual(true);
      expect(filterExtractsNode({jsonPath: 'firstname'}, '', 'name,$.lname,$[*].age')).toEqual(true);
      expect(filterExtractsNode({jsonPath: 'object.LNAME'}, '', 'name,$.lname,$[*].age')).toEqual(true);
    });
    test('should return false for child node if input value ends with [*]', () => {
      expect(filterExtractsNode({jsonPath: 'siblings[*].lname'}, '', '$.siblings[*]')).toEqual(false);
    });
    test('should return true for parent node if input value ends with [*]', () => {
      expect(filterExtractsNode({jsonPath: 'siblings[*]'}, '', '$.siblings[*]')).toEqual(true);
    });
  });
  describe('getFinalSelectedExtracts util', () => {
    test('should not throw exception for invalid args', () => {
      expect(getFinalSelectedExtracts()).toEqual('$');
    });
    test('should correctly return the json path for non array data type node', () => {
      expect(getFinalSelectedExtracts({jsonPath: 'children.lname'}, '$.fname')).toEqual('$.children.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, 'test')).toEqual('$.siblings[*]');
      expect(getFinalSelectedExtracts({jsonPath: ''}, '', false, true)).toEqual('$[*]');
    });
    test('should correctly return the json path for array data type node', () => {
      expect(getFinalSelectedExtracts({jsonPath: 'lname'}, '', true)).toEqual('$.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'children.lname'}, '$.fname', true)).toEqual('$.children.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, '$.fname,$.lname', true)).toEqual('$.fname,$.siblings[*]');
      expect(getFinalSelectedExtracts({jsonPath: 'lname'}, '$.fname,', true, true)).toEqual('$.fname,$[*].lname');
    });
  });
  describe('compareV2Mappings util', () => {
    test('should return false if both mappings are empty', () => {
      expect(compareV2Mappings()).toEqual(false);
      expect(compareV2Mappings([], [])).toEqual(false);
    });
    test('should return true if one mapping length is diff than other', () => {
      expect(compareV2Mappings([{key: 'key1'}], [])).toEqual(true);
      expect(compareV2Mappings([], [{key: 'key1'}])).toEqual(true);
    });
    test('should return true if any fields got changed', () => {
      const origData = [
        {
          key: 'key1',
          extract: '$.fname',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
      ];
      const newData = [
        {
          key: 'key1',
          extract: '$.fname',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.NUMBER,
        },
      ];

      expect(compareV2Mappings(newData, origData)).toEqual(true);
    });
    test('should return true if any children fields got changed', () => {
      const origData = [
        {
          key: 'key1',
          combinedExtract: '$.fname[*]',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          children: [
            {
              key: 'c1',
              extract: '$.child1',
              generate: 'child1',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
          ],
        },
      ];
      const newData = [
        {
          key: 'key1',
          combinedExtract: '$.fname[*]',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          children: [
            {
              key: 'c1',
              extract: '$.child1',
              generate: 'child1',
              dataType: MAPPING_DATA_TYPES.STRING,
              lookupName: 'l1',
            },
          ],
        },
      ];

      expect(compareV2Mappings(newData, origData)).toEqual(true);
    });
    test('should return true if children were removed', () => {
      const origData = [
        {
          key: 'key1',
          combinedExtract: '$.fname[*]',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          children: [
            {
              key: 'c1',
              extract: '$.child1',
              generate: 'child1',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
          ],
        },
      ];
      const newData = [
        {
          key: 'key1',
          combinedExtract: '$.fname[*]',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          copySource: 'yes',
        },
      ];

      expect(compareV2Mappings(newData, origData)).toEqual(true);
    });
    test('should return false if no crucial data changed', () => {
      const origData = [
        {
          key: 'key1',
          combinedExtract: '$.fname[*]',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          children: [
            {
              key: 'c1',
              extract: '$.child1',
              generate: 'child1',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
          ],
        },
      ];
      const newData = [
        {
          key: 'key1',
          combinedExtract: '$.fname[*]',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          activeTab: 0,
          children: [
            {
              key: 'c1',
              extract: '$.child1',
              generate: 'child1',
              dataType: MAPPING_DATA_TYPES.STRING,
              hidden: true,
            },
          ],
        },
      ];

      expect(compareV2Mappings(newData, origData)).toEqual(false);
    });
  });
  describe('getAllKeys util', () => {
    test('should return empty array if no data is passed', () => {
      expect(getAllKeys()).toEqual([]);
      expect(getAllKeys(null)).toEqual([]);
      expect(getAllKeys([])).toEqual([]);
    });
    test('should return all keys in flat array', () => {
      const data = [{
        key: 'key1',
        extract: '$.fname',
        generate: 'fname',
        dataType: MAPPING_DATA_TYPES.STRING,
      },
      {
        key: 'key2',
        generate: 'siblings',
        dataType: MAPPING_DATA_TYPES.OBJECT,
        children: [
          {
            key: 'c1',
            extract: '$.child1[*]',
            generate: 'child1',
            dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
            children: [
              {
                key: 'c1-1',
                extract: '$.child1-1',
                generate: 'child1-1',
                dataType: MAPPING_DATA_TYPES.STRING,
              },
            ],
          },
        ],
      }];

      expect(getAllKeys(data)).toEqual(['key1', 'c1-1', 'c1', 'key2']);
    });
  });
});

