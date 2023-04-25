import util, {
  MAPPING_DATA_TYPES,
  getAllKeys,
  compareV2Mappings,
  findAllParentExtractsForNode,
  findNearestParentExtractForNode,
  getFinalSelectedExtracts,
  autoCreateDestinationStructure,
  deleteNonRequiredMappings,
  buildExtractsTree,
  getSelectedKeys,
  findNodeInTree,
  allowDrop,
  buildV2MappingsFromTree,
  buildTreeFromV2Mappings,
  isMappingWithoutExtract,
  hasV2MappingsInTreeData,
  rebuildObjectArrayNode,
  // insertSiblingsOnDestinationUpdate,
  findAllParentNodesForNode,
  findAllPossibleDestinationMatchingParentNodes,
  // getNewChildrenToAdd,
  findMatchingExtract,
  getCombinedExtract,
  buildExtractsHelperFromExtract,
  getFirstActiveTab,
  hideOtherTabRows,
  isCsvOrXlsxResourceForMapper2,
  getSelectedExtractDataTypes,
  applyRequiredFilter,
  applyMappedFilter,
  filterNode,
  parentHasAnyChildMatch,
  applySearchFilter,
  countMatches,
  findNodeInTreeWithParents,
  findNodeWithGivenParentsList,
  findLastNodeWithMatchingParent,
} from '.';
import {generateId} from '../string';

jest.mock('../string');

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

  describe('isCsvOrXlsxResourceForMapper2 util', () => {
    test('should not throw exception for invalid args', () => {
      expect(isCsvOrXlsxResourceForMapper2()).toBe(false);
      expect(isCsvOrXlsxResourceForMapper2({})).toBe(false);
      expect(isCsvOrXlsxResourceForMapper2(null)).toBe(false);
    });
    test('should correctly return the expected outcome', () => {
      expect(isCsvOrXlsxResourceForMapper2({_id: 'id1', adaptorType: 'RDBMSImport'})).toBe(false);
      expect(isCsvOrXlsxResourceForMapper2({_id: 'id1', adaptorType: 'NetSuiteImport'})).toBe(false);
      expect(isCsvOrXlsxResourceForMapper2({_id: 'id1', adaptorType: 'FTPImport', file: {type: 'xml'}})).toBe(false);
      expect(isCsvOrXlsxResourceForMapper2({_id: 'id1', adaptorType: 'AS2Import', file: {type: 'filedefinition'}})).toBe(false);
      expect(isCsvOrXlsxResourceForMapper2({_id: 'id1', adaptorType: 'FTPImport', file: {type: 'csv'}})).toBe(true);
      expect(isCsvOrXlsxResourceForMapper2({_id: 'id1', adaptorType: 'S3Import', file: {type: 'xlsx'}})).toBe(true);
      expect(isCsvOrXlsxResourceForMapper2({_id: 'id1', adaptorType: 'AS2Import', file: {type: 'csv'}})).toBe(true);
    });
  });

  describe('findMatchingExtract util', () => {
    test('should not throw exception for invalid args', () => {
      expect(findMatchingExtract()).toEqual({});
      expect(findMatchingExtract([])).toEqual({});
      expect(findMatchingExtract(null)).toEqual({});
    });
    test('should return empty object if no matching extract is found', () => {
      const helper = [{extract: '$|0', sourceDataType: 'object'}];

      expect(findMatchingExtract(helper, '$')).toEqual({});
    });
    test('should correctly return the matching object', () => {
      const helper = [{extract: '$|0', sourceDataType: 'object'}, {extract: '$|1', sourceDataType: 'string'}];

      expect(findMatchingExtract(helper, '$|1')).toEqual({extract: '$|1', sourceDataType: 'string'});
    });
  });

  describe('getCombinedExtract util', () => {
    test('should not throw exception for invalid args', () => {
      expect(getCombinedExtract()).toEqual([]);
      expect(getCombinedExtract([])).toEqual([]);
      expect(getCombinedExtract(null)).toEqual([]);
    });
    test('should correctly return combined extracts from passed helper', () => {
      const helper = [{extract: '$|0', sourceDataType: 'object'}, {extract: '$|1', sourceDataType: 'string'}, {extract: '$.items[*]', sourceDataType: 'string'}];

      expect(getCombinedExtract(helper)).toEqual(['$', '$', '$.items[*]']);
    });
  });

  describe('buildExtractsHelperFromExtract util', () => {
    test('should not throw exception for invalid args', () => {
      expect(buildExtractsHelperFromExtract({})).toEqual([]);
      expect(buildExtractsHelperFromExtract({existingExtractsArray: []})).toEqual([]);
    });
    test('should not modify the helper array if no new source is added and formKey is not passed', () => {
      const existingExtractsArray = [{extract: '$|0', sourceDataType: 'object'}, {extract: '$|1', sourceDataType: 'string', copySource: 'yes'}, {extract: '$.items[*]', sourceDataType: 'string'}];
      const sourceField = '$,$,$.items[*]';

      expect(buildExtractsHelperFromExtract({existingExtractsArray, sourceField})).toEqual(existingExtractsArray);
    });
    test('should modify the helper array and use new extract config if source is already present and formKey is passed', () => {
      const existingExtractsArray = [{extract: '$|0', sourceDataType: 'object'}, {extract: '$|1', sourceDataType: 'string'}, {extract: '$.items[*]', sourceDataType: 'string'}];
      const sourceField = '$,$,$.items[*]';
      const formKey = '$|1';
      const newExtractObj = {extract: '$|1', sourceDataType: 'object', copySource: 'yes'};

      expect(buildExtractsHelperFromExtract({existingExtractsArray, sourceField, formKey, newExtractObj})).toEqual([{extract: '$|0', sourceDataType: 'object'}, {extract: '$|1', sourceDataType: 'object', copySource: 'yes'}, {extract: '$.items[*]', sourceDataType: 'string'}]);
    });
    test('should modify the helper array and remove the sources not passed', () => {
      const existingExtractsArray = [{extract: '$|0', sourceDataType: 'object'}, {extract: '$|1', sourceDataType: 'string'}, {extract: '$.items[*]', sourceDataType: 'string'}];
      const sourceField = '$,$.items[*]';

      expect(buildExtractsHelperFromExtract({existingExtractsArray, sourceField})).toEqual([{extract: '$|0', sourceDataType: 'object'}, {extract: '$.items[*]', sourceDataType: 'string'}]);
    });
    test('should copy the existing settings if a new source is added at same index', () => {
      const existingExtractsArray = [{extract: '$|0', sourceDataType: 'object', copySource: 'yes'}, {extract: '$|1', sourceDataType: 'string'}, {extract: '$.items[*]', sourceDataType: 'string'}];
      const sourceField = '$.new,$,$.items[*]';

      expect(buildExtractsHelperFromExtract({existingExtractsArray, sourceField})).toEqual([{extract: '$.new', sourceDataType: 'string', copySource: 'yes'}, {extract: '$|1', sourceDataType: 'string'}, {extract: '$.items[*]', sourceDataType: 'string'}]);
    });
    test('should add the new source in the helper array at a new index', () => {
      const existingExtractsArray = [{extract: '$.abc', sourceDataType: 'object', copySource: 'yes'}, {extract: '$.items[*]', sourceDataType: 'string'}];
      const sourceField = '$.new,$.abc,$.items[*]';

      expect(buildExtractsHelperFromExtract({existingExtractsArray, sourceField})).toEqual([{extract: '$.new', sourceDataType: 'string'}, {extract: '$.abc', sourceDataType: 'object', copySource: 'yes'}, {extract: '$.items[*]', sourceDataType: 'string'}]);
    });
  });

  describe('getFirstActiveTab util', () => {
    test('should not throw exception for invalid args', () => {
      expect(getFirstActiveTab()).toEqual({});
      expect(getFirstActiveTab({})).toEqual({});
      expect(getFirstActiveTab(null)).toEqual({});
    });
    test('should return empty object if all extracts have copy source as yes', () => {
      const node = { extractsArrayHelper: [{extract: '$.a', copySource: 'yes'}, {extract: '$.b', copySource: 'yes'}]};

      expect(getFirstActiveTab(node)).toEqual({});
    });
    test('should return 0th index if first copy source is no at 0th index', () => {
      const node = { extractsArrayHelper: [{extract: '$.a', copySource: 'no'}, {extract: '$.b', copySource: 'yes'}]};

      expect(getFirstActiveTab(node)).toEqual({activeTab: 0, activeExtract: '$.a'});
    });
    test('should return 2nd index if first copy source is no at 2nd index', () => {
      const node = { extractsArrayHelper: [{extract: '$.a', copySource: 'yes'}, {extract: '$.b', copySource: 'yes'}, {extract: '$.c'}]};

      expect(getFirstActiveTab(node)).toEqual({activeTab: 2, activeExtract: '$.c'});
    });
  });

  describe('hideOtherTabRows util', () => {
    test('should not throw exception for invalid args', () => {
      expect(hideOtherTabRows()).toBeUndefined();
      expect(hideOtherTabRows({})).toEqual({});
      expect(hideOtherTabRows(null)).toBeNull();
    });
    test('should return node if no children are present', () => {
      expect(hideOtherTabRows({key: 'k1', generate: 'g1'})).toEqual({key: 'k1', generate: 'g1'});
      expect(hideOtherTabRows({key: 'k1', generate: 'g1', children: []})).toEqual({key: 'k1', generate: 'g1', children: []});
    });
    test('should correctly update the node with children hidden props if it has one level deep children', () => {
      const node = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '3SC9pqVz-S2n-PQyVDhsS',
        title: '',
        activeTab: 0,
        children: [
          {
            isTabNode: true,
            key: 't1',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            dataType: 'string',
            extract: '$.children.fname',
            generate: 'child1',
            key: 'c1',
            parentExtract: '$.children[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            extract: '$.siblings.fname',
            generate: 'child1',
            hidden: true,
            key: 'c2',
            parentExtract: '$.siblings[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      const newTabExtract = '$.siblings[*]';
      const newNode = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '3SC9pqVz-S2n-PQyVDhsS',
        title: '',
        activeTab: 0,
        children: [
          {
            isTabNode: true,
            key: 't1',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            dataType: 'string',
            extract: '$.children.fname',
            generate: 'child1',
            key: 'c1',
            parentExtract: '$.children[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
            className: 'hideRow',
            hidden: true,
          },
          {
            dataType: 'string',
            extract: '$.siblings.fname',
            generate: 'child1',
            key: 'c2',
            parentExtract: '$.siblings[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      expect(hideOtherTabRows(node, newTabExtract)).toEqual(newNode);
    });
    test('should correctly update the node with children hidden props if it has two level deep children and new extract is at 0th index', () => {
      const node = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: 'Zl1hv7Mhjejx9aFNASGFB',
        title: '',
        activeTab: 1,
        children: [
          {
            isTabNode: true,
            key: 'gpVKJSN0mT53a_hkORCBI',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            disabled: false,
            extract: '$.children.fname',
            generate: 'child1',
            hidden: true,
            key: 'WMEcB80mZDoLRdo9FQc2z',
            parentExtract: '$.children[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            dataType: 'string',
            disabled: false,
            extract: '$.siblings.fname',
            generate: 'child1',
            key: 'ZiKWE-uxIhM2E0OH3mWLx',
            parentExtract: '$.siblings[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            extractsArrayHelper: [{extract: '$.siblings[*].children[*]'}, {extract: '$.siblings[*]'}],
            dataType: 'objectarray',
            disabled: false,
            generate: 'child2',
            key: 'Ej0Ek_nw6BOxreTjsJHNH',
            parentExtract: '$.siblings[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
            activeTab: 0,
            children: [
              {
                isTabNode: true,
                key: 'EJHKgKkvTL3-OkhKGRAYH',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
              },
              {
                dataType: 'string',
                disabled: false,
                extract: '$.siblings.children.name',
                generate: 'child2-1',
                key: 'ZZEHmsfLu3VFysqfns_fF',
                parentExtract: '$.siblings[*].children[*]',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
              },
              {
                dataType: 'string',
                disabled: false,
                extract: '$.siblings.name',
                generate: 'child2-1',
                key: 'ZMNQYt611aYlkXm4trGBA',
                parentExtract: '$.siblings[*]',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
              },
            ],
          },
        ],
      };

      const newTabExtract = '$.children[*]';
      const newNode = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: 'Zl1hv7Mhjejx9aFNASGFB',
        title: '',
        activeTab: 1,
        children: [
          {
            isTabNode: true,
            key: 'gpVKJSN0mT53a_hkORCBI',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            dataType: 'string',
            disabled: false,
            extract: '$.children.fname',
            generate: 'child1',
            key: 'WMEcB80mZDoLRdo9FQc2z',
            parentExtract: '$.children[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            dataType: 'string',
            disabled: false,
            extract: '$.siblings.fname',
            generate: 'child1',
            key: 'ZiKWE-uxIhM2E0OH3mWLx',
            parentExtract: '$.siblings[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
            className: 'hideRow',
            hidden: true,
          },
          {
            extractsArrayHelper: [{extract: '$.siblings[*].children[*]'}, {extract: '$.siblings[*]'}],
            dataType: 'objectarray',
            disabled: false,
            generate: 'child2',
            key: 'Ej0Ek_nw6BOxreTjsJHNH',
            parentExtract: '$.siblings[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
            className: 'hideRow',
            hidden: true,
            activeTab: 0,
            children: [
              {
                isTabNode: true,
                key: 'EJHKgKkvTL3-OkhKGRAYH',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
                className: 'hideRow',
                hidden: true,
              },
              {
                dataType: 'string',
                disabled: false,
                extract: '$.siblings.children.name',
                generate: 'child2-1',
                key: 'ZZEHmsfLu3VFysqfns_fF',
                parentExtract: '$.siblings[*].children[*]',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
                className: 'hideRow',
                hidden: true,
              },
              {
                dataType: 'string',
                disabled: false,
                extract: '$.siblings.name',
                generate: 'child2-1',
                key: 'ZMNQYt611aYlkXm4trGBA',
                parentExtract: '$.siblings[*]',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
                className: 'hideRow',
                hidden: true,
              },
            ],
          },
        ],
      };

      expect(hideOtherTabRows(node, newTabExtract)).toEqual(newNode);
    });
    test('should correctly update the node with children hidden props if it has two level deep children and new extract is at 1th index', () => {
      const node = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: 'Zl1hv7Mhjejx9aFNASGFB',
        title: '',
        activeTab: 1,
        children: [
          {
            isTabNode: true,
            key: 'gpVKJSN0mT53a_hkORCBI',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            dataType: 'string',
            disabled: false,
            extract: '$.children.fname',
            generate: 'child1',
            key: 'WMEcB80mZDoLRdo9FQc2z',
            parentExtract: '$.children[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            dataType: 'string',
            disabled: false,
            extract: '$.siblings.fname',
            generate: 'child1',
            key: 'ZiKWE-uxIhM2E0OH3mWLx',
            parentExtract: '$.siblings[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
            className: 'hideRow',
            hidden: true,
          },
          {
            extractsArrayHelper: [{extract: '$.siblings[*].children[*]'}, {extract: '$.siblings[*]'}],
            dataType: 'objectarray',
            disabled: false,
            generate: 'child2',
            key: 'Ej0Ek_nw6BOxreTjsJHNH',
            parentExtract: '$.siblings[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
            className: 'hideRow',
            hidden: true,
            children: [
              {
                isTabNode: true,
                key: 'EJHKgKkvTL3-OkhKGRAYH',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
                className: 'hideRow',
                hidden: true,
              },
              {
                dataType: 'string',
                disabled: false,
                extract: '$.siblings.children.name',
                generate: 'child2-1',
                key: 'ZZEHmsfLu3VFysqfns_fF',
                parentExtract: '$.siblings[*].children[*]',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
                className: 'hideRow',
                hidden: true,
              },
              {
                dataType: 'string',
                disabled: false,
                extract: '$.siblings.name',
                generate: 'child2-1',
                key: 'ZMNQYt611aYlkXm4trGBA',
                parentExtract: '$.siblings[*]',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
                className: 'hideRow',
                hidden: true,
              },
            ],
          },
        ],
      };

      const newTabExtract = '$.siblings[*]';
      const newNode = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: 'Zl1hv7Mhjejx9aFNASGFB',
        title: '',
        activeTab: 1,
        children: [
          {
            isTabNode: true,
            key: 'gpVKJSN0mT53a_hkORCBI',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            disabled: false,
            extract: '$.children.fname',
            generate: 'child1',
            hidden: true,
            key: 'WMEcB80mZDoLRdo9FQc2z',
            parentExtract: '$.children[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            dataType: 'string',
            disabled: false,
            extract: '$.siblings.fname',
            generate: 'child1',
            key: 'ZiKWE-uxIhM2E0OH3mWLx',
            parentExtract: '$.siblings[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
          },
          {
            extractsArrayHelper: [{extract: '$.siblings[*].children[*]'}, {extract: '$.siblings[*]'}],
            dataType: 'objectarray',
            disabled: false,
            generate: 'child2',
            key: 'Ej0Ek_nw6BOxreTjsJHNH',
            parentExtract: '$.siblings[*]',
            parentKey: 'Zl1hv7Mhjejx9aFNASGFB',
            title: '',
            children: [
              {
                isTabNode: true,
                key: 'EJHKgKkvTL3-OkhKGRAYH',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
              },
              {
                dataType: 'string',
                disabled: false,
                extract: '$.siblings.children.name',
                generate: 'child2-1',
                key: 'ZZEHmsfLu3VFysqfns_fF',
                parentExtract: '$.siblings[*].children[*]',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
              },
              {
                dataType: 'string',
                disabled: false,
                extract: '$.siblings.name',
                generate: 'child2-1',
                key: 'ZMNQYt611aYlkXm4trGBA',
                parentExtract: '$.siblings[*]',
                parentKey: 'Ej0Ek_nw6BOxreTjsJHNH',
                title: '',
                hidden: true,
                className: 'hideRow',
              },
            ],
          },
        ],
      };

      expect(hideOtherTabRows(node, newTabExtract)).toEqual(newNode);
    });
  });

  describe('getSelectedExtractDataTypes util', () => {
    test('should not throw exception for invalid args', () => {
      expect(getSelectedExtractDataTypes({})).toEqual([]);
    });
    test('should return correct data type depending on the input provided', () => {
      const extractsTree = [
        {
          key: 'ayQRLXyyH0Z7kh7rhKIUD',
          title: '',
          dataType: '[object]',
          propName: '$',
          children: [
            {
              key: 'Yyh6ZHqzCW7sujMGJ8MqG',
              parentKey: 'ayQRLXyyH0Z7kh7rhKIUD',
              title: '',
              jsonPath: 'isFlagShip',
              propName: 'isFlagShip',
              dataType: 'boolean',
            },
            {
              key: 'ilILG9diOQBMRBMaNyPKN',
              parentKey: 'ayQRLXyyH0Z7kh7rhKIUD',
              title: '',
              jsonPath: 'sku',
              propName: 'sku',
              dataType: 'string',
            },
            {
              key: '5khsdQYcGjwDHGQNPbOnM',
              parentKey: 'ayQRLXyyH0Z7kh7rhKIUD',
              title: '',
              jsonPath: 'vendor',
              propName: 'vendor',
              dataType: 'string',
            },
          ],
        },
      ];

      expect(getSelectedExtractDataTypes({extractsTree, selectedValue: '$[*].isFlagShip'})).toEqual(['boolean']);
    });
    test('should return empty array if the json path is not available', () => {
      const extractsTree = [
        {
          key: 'ayQRLXyyH0Z7kh7rhKIUD',
          title: '',
          dataType: '[object]',
          propName: '$',
          children: [
            {
              key: 'Yyh6ZHqzCW7sujMGJ8MqG',
              parentKey: 'ayQRLXyyH0Z7kh7rhKIUD',
              title: '',
              jsonPath: 'isFlagShip',
              propName: 'isFlagShip',
              dataType: 'boolean',
            },
          ],
        },
      ];

      expect(getSelectedExtractDataTypes({extractsTree, selectedValue: '$[*].isflagShip'})).toEqual([]);
    });
    test('should return object if the json path is $', () => {
      const extractsTree = [
        {
          key: 'ayQRLXyyH0Z7kh7rhKIUD',
          title: '',
          dataType: '[object]',
          propName: '$',
          children: [
            {
              key: 'Yyh6ZHqzCW7sujMGJ8MqG',
              parentKey: 'ayQRLXyyH0Z7kh7rhKIUD',
              title: '',
              jsonPath: 'isFlagShip',
              propName: 'isFlagShip',
              dataType: 'boolean',
            },
          ],
        },
      ];

      expect(getSelectedExtractDataTypes({extractsTree, selectedValue: '$'})).toEqual(['object']);
    });
    test('should return objectArray if the json path is $[*]', () => {
      const extractsTree = [
        {
          key: 'ayQRLXyyH0Z7kh7rhKIUD',
          title: '',
          dataType: '[object]',
          propName: '$',
          children: [
            {
              key: 'Yyh6ZHqzCW7sujMGJ8MqG',
              parentKey: 'ayQRLXyyH0Z7kh7rhKIUD',
              title: '',
              jsonPath: 'isFlagShip',
              propName: 'isFlagShip',
              dataType: 'boolean',
            },
          ],
        },
      ];

      expect(getSelectedExtractDataTypes({extractsTree, selectedValue: '$[*]'})).toEqual(['objectarray']);
    });
  });

  describe('rebuildObjectArrayNode util', () => {
    test('should not throw exception for invalid args', () => {
      expect(rebuildObjectArrayNode()).toBeUndefined();
      expect(rebuildObjectArrayNode({})).toEqual({});
      expect(rebuildObjectArrayNode(null)).toBeNull();
    });
    test('should do nothing if node is invalid or does not contain children', () => {
      expect(rebuildObjectArrayNode({key: 'k1', dataType: 'objectarray'})).toEqual({
        key: 'k1',
        dataType: 'objectarray',
        children: [],
        extractsArrayHelper: [],
      });
      expect(rebuildObjectArrayNode({key: 'k1', dataType: 'string'})).toEqual({key: 'k1', dataType: 'string'});
    });
    test('should correctly update the node if prev source was 1 and now 2 sources are added', () => {
      generateId.mockReturnValue('new_key');

      const node = {
        activeTab: 0,
        extractsArrayHelper: [{extract: '$.children[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '3SC9pqVz-S2n-PQyVDhsS',
        title: '',
        children: [
          {
            className: false,
            dataType: 'string',
            extract: '$.children.fname',
            generate: 'child1',
            hidden: false,
            key: 'RexNIhiRl5WKfO5wjXpZO',
            parentExtract: '$.children[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      const extract = '$.children[*],$.siblings[*]';
      const newNode = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]', sourceDataType: 'string'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '3SC9pqVz-S2n-PQyVDhsS',
        title: '',
        activeTab: 0,
        children: [
          {
            isTabNode: true,
            key: 'new_key',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            dataType: 'string',
            extract: '$.children.fname',
            generate: 'child1',
            key: 'RexNIhiRl5WKfO5wjXpZO',
            parentExtract: '$.children[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            hidden: true,
            key: 'new_key',
            jsonPath: undefined,
            parentExtract: '$.siblings[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
            generate: 'child1',
          },
        ],
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update the node if prev sources were 2 and a third source is added in between', () => {
      generateId.mockReturnValue('new_key');

      const node = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '3SC9pqVz-S2n-PQyVDhsS',
        title: '',
        activeTab: 0,
        children: [
          {
            isTabNode: true,
            key: 't1',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            dataType: 'string',
            extract: '$.children.fname',
            generate: 'child1',
            key: 'c1',
            parentExtract: '$.children[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            extract: '$.siblings.fname',
            generate: 'child1',
            hidden: true,
            key: 'c2',
            parentExtract: '$.siblings[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      const extract = '$.children[*],$.test[*].nested[*],$.siblings[*]';
      const newNode = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.test[*].nested[*]', sourceDataType: 'string'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '3SC9pqVz-S2n-PQyVDhsS',
        title: '',
        activeTab: 0,
        children: [
          {
            isTabNode: true,
            key: 't1',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            dataType: 'string',
            extract: '$.children.fname',
            generate: 'child1',
            key: 'c1',
            parentExtract: '$.children[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            extract: '$.siblings.fname',
            generate: 'child1',
            hidden: true,
            key: 'c2',
            parentExtract: '$.siblings[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            generate: 'child1',
            hidden: true,
            key: 'new_key',
            jsonPath: undefined,
            parentExtract: '$.test[*].nested[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update the node if prev sources were 2 and first source is removed', () => {
      generateId.mockReturnValue('new_key');

      const node = {
        extractsArrayHelper: [{extract: '$.children[*]'}, {extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '3SC9pqVz-S2n-PQyVDhsS',
        title: '',
        activeTab: 0,
        children: [
          {
            isTabNode: true,
            key: 't1',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            dataType: 'string',
            extract: '$.children.fname',
            generate: 'child1',
            key: 'c1',
            parentExtract: '$.children[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            extract: '$.siblings.fname',
            generate: 'child1',
            hidden: true,
            key: 'c2',
            parentExtract: '$.siblings[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      const extract = '$.siblings[*]';
      const newNode = {
        extractsArrayHelper: [{extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '3SC9pqVz-S2n-PQyVDhsS',
        title: '',
        activeTab: 0,
        children: [
          {
            dataType: 'string',
            extract: '$.siblings.fname',
            generate: 'child1',
            key: 'c2',
            parentExtract: '$.siblings[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update the node if prev source was empty and now 2 same root sources are added', () => {
      generateId.mockReturnValue('new_key');

      const node = {
        extractsArrayHelper: [],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: 'vlVDP3cjaN2cGmcSW1RCq',
        title: '',
        children: [
          {
            dataType: 'string',
            key: '4UB7OJokF5bGpvc8osHYT',
            parentKey: 'vlVDP3cjaN2cGmcSW1RCq',
            title: '',
          },
        ],
      };

      const extract = '$,$';
      const newNode = {
        extractsArrayHelper: [{extract: '$|0', sourceDataType: 'string'}, {extract: '$|1', sourceDataType: 'string'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: 'vlVDP3cjaN2cGmcSW1RCq',
        title: '',
        activeTab: 0,
        children: [
          {
            isTabNode: true,
            key: 'new_key',
            parentKey: 'vlVDP3cjaN2cGmcSW1RCq',
            title: '',
          },
          {
            dataType: 'string',
            key: '4UB7OJokF5bGpvc8osHYT',
            parentExtract: '$|0',
            parentKey: 'vlVDP3cjaN2cGmcSW1RCq',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            hidden: true,
            key: 'new_key',
            generate: undefined,
            jsonPath: undefined,
            parentExtract: '$|1',
            parentKey: 'vlVDP3cjaN2cGmcSW1RCq',
            title: '',
          },
        ],
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update the node children and link to first source if they were not linked already', () => {
      generateId.mockReturnValue('new_key');
      const node = {
        extractsArrayHelper: [],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: 'vlVDP3cjaN2cGmcSW1RCq',
        title: '',
        children: [
          {
            key: 'yFngPGWR0HW6a6JQ1pvkj',
            title: '',
            parentKey: 'vlVDP3cjaN2cGmcSW1RCq',
            parentExtract: '',
            dataType: 'string',
            generate: 'id',
            jsonPath: 'family_tree[*].id',
            extract: '$.id',
          },
        ],
        jsonPath: 'family_tree',
      };

      const extract = '$';

      const newNode = {
        extractsArrayHelper: [{extract: '$|0', sourceDataType: 'string'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: 'vlVDP3cjaN2cGmcSW1RCq',
        title: '',
        children: [
          {
            key: 'yFngPGWR0HW6a6JQ1pvkj',
            title: '',
            parentKey: 'vlVDP3cjaN2cGmcSW1RCq',
            parentExtract: '$|0',
            dataType: 'string',
            generate: 'id',
            jsonPath: 'family_tree[*].id',
            extract: '$.id',
          },
        ],
        jsonPath: 'family_tree',
        activeTab: 0,
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update the node with empty generates with child nodes for the new source incase the first source has an object mapping', () => {
      generateId.mockReturnValue('new_key');

      const node = {
        extractsArrayHelper: [{extract: '$[*].feeds[*]'}],
        dataType: 'objectarray',
        disabled: false,
        key: 'LQL4eGSdYcfXiKm478tPQ',
        children: [
          {
            key: '8UXchy6vBsJiIXtStB0Dd',
            title: '',
            parentKey: 'LQL4eGSdYcfXiKm478tPQ',
            parentExtract: '$[*].feeds[*]',
            dataType: 'object',
            children: [
              {
                key: 'Y66DS3Xpwh3GNqOjJJ84w',
                title: '',
                parentKey: '8UXchy6vBsJiIXtStB0Dd',
                parentExtract: '',
                dataType: 'string',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1.d1',
                extract: 'e1',
              },
            ],
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
          },
        ],
        generate: 'family_tree',
        jsonPath: 'family_tree',
        activeTab: 0,
      };

      const extract = '$[*].feeds[*],$.test[*]';

      const newNode = {
        extractsArrayHelper: [{extract: '$[*].feeds[*]'}, {extract: '$.test[*]', sourceDataType: 'string'}],
        dataType: 'objectarray',
        disabled: false,
        key: 'LQL4eGSdYcfXiKm478tPQ',
        children: [
          {
            key: 'new_key',
            parentKey: 'LQL4eGSdYcfXiKm478tPQ',
            title: '',
            isTabNode: true,
          },
          {
            key: '8UXchy6vBsJiIXtStB0Dd',
            title: '',
            parentKey: 'LQL4eGSdYcfXiKm478tPQ',
            parentExtract: '$[*].feeds[*]',
            dataType: 'object',
            children: [
              {
                key: 'Y66DS3Xpwh3GNqOjJJ84w',
                title: '',
                parentKey: '8UXchy6vBsJiIXtStB0Dd',
                parentExtract: '',
                dataType: 'string',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1.d1',
                extract: 'e1',
              },
            ],
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
          },
          {
            key: 'new_key',
            title: '',
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
            dataType: 'object',
            children: [
              {
                key: 'new_key',
                title: '',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1.d1',
                dataType: 'string',
                parentKey: 'new_key',
                parentExtract: '',
                hidden: true,
                className: 'hideRow',
              },
            ],
            parentKey: 'LQL4eGSdYcfXiKm478tPQ',
            parentExtract: '$.test[*]',
            hidden: true,
            className: 'hideRow',
          },
        ],
        generate: 'family_tree',
        jsonPath: 'family_tree',
        activeTab: 0,
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update the node with empty generates with child nodes incase of Object array mapping for the first source', () => {
      generateId.mockReturnValue('new_key');

      const node = {
        extractsArrayHelper: [{extract: '$[*].feeds[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '21xmtiTyd7LezDTLMGobu',
        title: '',
        children: [
          {
            key: 'aZzxJ0WB6HZts74cbfgQx',
            title: '',
            parentKey: '21xmtiTyd7LezDTLMGobu',
            parentExtract: '$[*].feeds[*]',
            dataType: 'objectarray',
            children: [
              {
                key: 'S7nTwK7VyorrJdOtmVMCC',
                title: '',
                parentKey: 'aZzxJ0WB6HZts74cbfgQx',
                parentExtract: 'pe1',
                dataType: 'string',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1[*].d1',
                extract: 'e1',
              },
            ],
            extract: 'pe1',
            extractsArrayHelper: [{extract: 'pe1'}],
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
            activeTab: 0,
          },
        ],
        jsonPath: 'family_tree',
        activeTab: 0,
      };

      const extract = '$[*].feeds[*],$.test[*]';

      const newNode = {
        extractsArrayHelper: [{extract: '$[*].feeds[*]'}, {extract: '$.test[*]', sourceDataType: 'string'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '21xmtiTyd7LezDTLMGobu',
        title: '',
        children: [
          {
            key: 'new_key',
            parentKey: '21xmtiTyd7LezDTLMGobu',
            title: '',
            isTabNode: true,
          },
          {
            key: 'aZzxJ0WB6HZts74cbfgQx',
            title: '',
            parentKey: '21xmtiTyd7LezDTLMGobu',
            parentExtract: '$[*].feeds[*]',
            dataType: 'objectarray',
            children: [
              {
                key: 'S7nTwK7VyorrJdOtmVMCC',
                title: '',
                parentKey: 'aZzxJ0WB6HZts74cbfgQx',
                parentExtract: 'pe1',
                dataType: 'string',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1[*].d1',
                extract: 'e1',
              },
            ],
            extract: 'pe1',
            extractsArrayHelper: [{extract: 'pe1'}],
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
            activeTab: 0,
          },
          {
            key: 'new_key',
            title: '',
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
            dataType: 'objectarray',
            children: [
              {
                key: 'new_key',
                title: '',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1[*].d1',
                dataType: 'string',
                parentKey: 'new_key',
                parentExtract: '',
                className: 'hideRow',
                hidden: true,
              },
            ],
            parentKey: '21xmtiTyd7LezDTLMGobu',
            parentExtract: '$.test[*]',
            className: 'hideRow',
            hidden: true,
          },
        ],
        jsonPath: 'family_tree',
        activeTab: 0,
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update node with object array mapped child nodes of first source when child has multiple sources incase of object array mapping for the first source', () => {
      generateId.mockReturnValue('new_key');

      const node = {
        extractsArrayHelper: [{extract: '$[*].feeds[*]'}],
        dataType: 'objectarray',
        disabled: false,
        generate: 'family_tree',
        key: '21xmtiTyd7LezDTLMGobu',
        title: '',
        children: [
          {
            key: 'aZzxJ0WB6HZts74cbfgQx',
            title: '',
            parentKey: '21xmtiTyd7LezDTLMGobu',
            parentExtract: '$[*].feeds[*]',
            dataType: 'objectarray',
            children: [
              {
                key: 'yTXmXKeo6d2dodgi-XDLh',
                parentKey: 'aZzxJ0WB6HZts74cbfgQx',
                title: '',
                isTabNode: true,
              },
              {
                key: 'S7nTwK7VyorrJdOtmVMCC',
                title: '',
                parentKey: 'aZzxJ0WB6HZts74cbfgQx',
                parentExtract: 'pe1',
                dataType: 'string',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1[*].d1',
                extract: 'e1',
              },
              {
                key: 'NTAuBPI3iKoomufe2SLA-',
                title: '',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1[*].d1',
                dataType: 'string',
                parentKey: 'aZzxJ0WB6HZts74cbfgQx',
                parentExtract: 'pe2',
                className: 'hideRow',
                hidden: true,
              },
            ],
            extractsArrayHelper: [{extract: 'pe1'}, {extract: 'pe2'}],
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
            activeTab: 0,
          },
        ],
        jsonPath: 'family_tree',
        activeTab: 0,
      };

      const extract = '$[*].feeds[*],$.test[*]';

      const newNode = {
        extractsArrayHelper: [{extract: '$[*].feeds[*]'}, {extract: '$.test[*]', sourceDataType: 'string'}],
        dataType: 'objectarray',
        disabled: false,
        key: '21xmtiTyd7LezDTLMGobu',
        title: '',
        children: [
          {
            key: 'new_key',
            parentKey: '21xmtiTyd7LezDTLMGobu',
            title: '',
            isTabNode: true,
          },
          {
            key: 'aZzxJ0WB6HZts74cbfgQx',
            title: '',
            parentKey: '21xmtiTyd7LezDTLMGobu',
            parentExtract: '$[*].feeds[*]',
            children: [
              {
                key: 'yTXmXKeo6d2dodgi-XDLh',
                parentKey: 'aZzxJ0WB6HZts74cbfgQx',
                title: '',
                isTabNode: true,
              },
              {
                key: 'S7nTwK7VyorrJdOtmVMCC',
                title: '',
                parentKey: 'aZzxJ0WB6HZts74cbfgQx',
                parentExtract: 'pe1',
                dataType: 'string',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1[*].d1',
                extract: 'e1',
              },
              {
                key: 'NTAuBPI3iKoomufe2SLA-',
                title: '',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1[*].d1',
                dataType: 'string',
                parentKey: 'aZzxJ0WB6HZts74cbfgQx',
                parentExtract: 'pe2',
                className: 'hideRow',
                hidden: true,
              },
            ],
            dataType: 'objectarray',
            extractsArrayHelper: [{extract: 'pe1'}, {extract: 'pe2'}],
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
            activeTab: 0,
          },
          {
            key: 'new_key',
            title: '',
            generate: 'map1',
            jsonPath: 'family_tree[*].map1',
            dataType: 'objectarray',
            children: [
              {
                key: 'new_key',
                title: '',
                generate: 'd1',
                jsonPath: 'family_tree[*].map1[*].d1',
                dataType: 'string',
                parentKey: 'new_key',
                parentExtract: '',
                hidden: true,
                className: 'hideRow',
              },
            ],
            parentKey: '21xmtiTyd7LezDTLMGobu',
            parentExtract: '$.test[*]',
            hidden: true,
            className: 'hideRow',
          },
        ],
        generate: 'family_tree',
        jsonPath: 'family_tree',
        activeTab: 0,
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
  });

  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('insertSiblingsOnDestinationUpdate util', () => {
  // });

  describe('findAllParentNodesForNode util', () => {
    test('should return empty array incase of invalid node', () => {
      expect(findAllParentNodesForNode()).toEqual([]);
      expect(findAllParentNodesForNode(undefined, 'key')).toEqual([]);
    });
    test('should return empty array if the node has no parent', () => {
      const v2TreeData = [{
        key: 'key1',
        title: '',
        extract: '$.fname',
        generate: 'fname',
        dataType: MAPPING_DATA_TYPES.STRING,
      }];

      expect(findAllParentNodesForNode(v2TreeData, 'key1')).toEqual([]);
    });
    test('should return all the parent nodes where treeData has only object array nodes in the parent levels', () => {
      const v2TreeData = [
        {
          key: 'key1',
          title: '',
          generate: 'mothers_side',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          children: [
            {
              key: 'c1',
              title: '',
              generate: 'child1',
              parentKey: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              children: [
                {
                  key: 'c2',
                  title: '',
                  generate: 'child2',
                  parentKey: 'c1',
                  dataType: MAPPING_DATA_TYPES.OBJECT,
                  children: [{
                    key: 'c3',
                    title: '',
                    extract: '$.child3',
                    generate: 'child3',
                    parentKey: 'c2',
                    dataType: MAPPING_DATA_TYPES.STRING,
                  }],
                },
              ],
            },
          ],
        },
      ];

      const expected = [v2TreeData[0], v2TreeData[0].children[0], v2TreeData[0].children[0].children[0]];

      expect(findAllParentNodesForNode(v2TreeData, 'c3')).toEqual(expected);
    });
    test('should return all the parent nodes where treeData has both object and object array nodes in the parent levels', () => {
      const v2TreeData = [
        {
          key: 'key1',
          title: '',
          generate: 'mothers_side',
          extractsArrayHelper: [{ extract: 'e1' }],
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          children: [
            {
              key: 'c1',
              title: '',
              generate: 'child1',
              parentExtract: 'e1',
              parentKey: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              children: [
                {
                  key: 'c2',
                  title: '',
                  generate: 'child2',
                  extractsArrayHelper: [{ extract: 'ce1' }],
                  parentKey: 'c1',
                  dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
                  children: [{
                    key: 'c3',
                    title: '',
                    extract: '$.child3',
                    generate: 'child3',
                    parentExtract: 'ce1',
                    parentKey: 'c2',
                    dataType: MAPPING_DATA_TYPES.STRING,
                  }],
                },
                {
                  key: 'c4',
                  title: '',
                  generate: 'child4',
                  extract: 'ce2',
                  parentKey: 'c1',
                },
              ],
            },
          ],
        },
      ];

      const expected = [v2TreeData[0], v2TreeData[0].children[0], v2TreeData[0].children[0].children[0]];

      expect(findAllParentNodesForNode(v2TreeData, 'c3')).toEqual(expected);
    });
  });

  describe('findAllPossibleDestinationMatchingParentNodes util', () => {
    test('should return empty array incase of invalid params', () => {
      expect(findAllPossibleDestinationMatchingParentNodes()).toEqual([]);
    });
    test('should return passed parent nodes if there are no matching nodes to match for', () => {
      const v2TreeData = [{
        key: 'key1',
        title: '',
        extract: '$.fname',
        generate: 'fname',
        dataType: MAPPING_DATA_TYPES.STRING,
      }];

      expect(findAllPossibleDestinationMatchingParentNodes([], v2TreeData)).toBe(v2TreeData);
    });
    test('should return empty array incase of partial match as this util need to return child nodes only after complete match of matchingNodes', () => {
      const v2TreeData = [
        {
          key: 'key1',
          title: '',
          generate: 'mothers_side',
          extractsArrayHelper: [{ extract: 'e1' }],
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          children: [
            {
              key: 'c1',
              title: '',
              generate: 'child1',
              parentExtract: 'e1',
              parentKey: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              children: [
                {
                  key: 'c2',
                  title: '',
                  generate: 'child2',
                  extractsArrayHelper: [{ extract: 'ce1' }],
                  parentKey: 'c1',
                  dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
                  children: [{
                    key: 'c3',
                    title: '',
                    extract: '$.child3',
                    generate: 'child3',
                    parentExtract: 'ce1',
                    parentKey: 'c2',
                    dataType: MAPPING_DATA_TYPES.STRING,
                  }],
                },
                {
                  key: 'c4',
                  title: '',
                  generate: 'child4',
                  extract: 'ce2',
                  parentKey: 'c1',
                },
              ],
            },
          ],
        },
      ];
      const parentNodes = [v2TreeData[0]];
      const unmatchedNode = {
        key: 'c2',
        title: '',
        generate: 'unmatched_generate',
        extractsArrayHelper: [{ extract: 'ce1' }],
        parentKey: 'c1',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
        children: [{
          key: 'c3',
          title: '',
          extract: '$.child3',
          generate: 'child3',
          parentExtract: 'ce1',
          parentKey: 'c2',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      };
      const matchingNodes = [v2TreeData[0].children[0], unmatchedNode];

      expect(findAllPossibleDestinationMatchingParentNodes(matchingNodes, parentNodes)).toEqual([]);
    });

    test('should return the target parent nodes after complete match of matchingNodes', () => {
      const v2TreeData = [
        {
          key: 'key1',
          title: '',
          generate: 'mothers_side',
          extractsArrayHelper: [{ extract: 'e1' }],
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          children: [
            {
              key: 'c1',
              title: '',
              generate: 'child1',
              parentExtract: 'e1',
              parentKey: 'key1',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              children: [
                {
                  key: 'c2',
                  title: '',
                  generate: 'child2',
                  extractsArrayHelper: [{ extract: 'ce1' }],
                  parentKey: 'c1',
                  dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
                  children: [{
                    key: 'c3',
                    title: '',
                    extract: '$.child3',
                    generate: 'child3',
                    parentExtract: 'ce1',
                    parentKey: 'c2',
                    dataType: MAPPING_DATA_TYPES.STRING,
                  }],
                },
                {
                  key: 'c4',
                  title: '',
                  generate: 'child4',
                  extract: 'ce2',
                  parentKey: 'c1',
                },
              ],
            },
          ],
        },
      ];
      const parentNodes = [v2TreeData[0]];
      const matchingNodes = [v2TreeData[0].children[0], v2TreeData[0].children[0].children[0]];

      expect(findAllPossibleDestinationMatchingParentNodes(matchingNodes, parentNodes)).toEqual([v2TreeData[0].children[0].children[0]]);
    });
  });

  describe('buildTreeFromV2Mappings util', () => {
    test('should not throw exception for invalid args', () => {
      generateId.mockReturnValue('new_key');

      const defaultTree = [{
        key: 'new_key',
        isEmptyRow: true,
        title: '',
        dataType: MAPPING_DATA_TYPES.STRING,
        sourceDataType: MAPPING_DATA_TYPES.STRING,
      }];

      expect(buildTreeFromV2Mappings({})).toEqual();
      expect(buildTreeFromV2Mappings({importResource: {mappings: []}})).toEqual(defaultTree);
    });
    test('should correctly generate the tree structure based on resource mappings if record based mappings', () => {
      generateId.mockReturnValue('new_key');
      const requiredMappings = ['my_full_name', 'family_tree_from_mom_perspective.children[*].grandchildren[*].first_name', 'my_mothers_name.last_name', 'two_of_my_fav_names[*].my_first_name'];

      const importResource = {
        mappings: [
          {
            generate: 'my_first_name',
            dataType: 'string',
            extract: '$.fName',
          },
          {
            generate: 'my_full_name',
            dataType: 'string',
            extract: '{{record.fName}} {{record.lName}}',
          },
          {
            generate: 'my_mothers_name',
            dataType: 'object',
            mappings: [
              {
                generate: 'first_name',
                dataType: 'string',
                // extract: '$.mother.fName',
                hardCodedValue: 'some mothers name',
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
                ],
              },
              {
                mappings: [
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
            generate: 'all_the_children',
            dataType: 'objectarray',
            buildArrayHelper: [
              {
                extract: '$.siblings[*].children[*]',
                mappings: [
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
                ],
              },
            ],
          },
          {
            generate: 'images',
            dataType: 'objectarray',
            buildArrayHelper: [
              {
                extract: '$',
                mappings: [
                  {
                    generate: 'test1',
                    dataType: 'string',
                    hardCodedValue: 'first_source',
                  },
                ],
              },
              {
                extract: '$',
                mappings: [
                  {
                    generate: 'test2',
                    dataType: 'object',
                    mappings: [
                      {
                        generate: 'map',
                        dataType: 'string',
                        hardCodedValue: 'second_source',
                      },
                    ],
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
                generate: 'children',
                dataType: 'objectarray',
                buildArrayHelper: [
                  {
                    extract: '$.siblings[*]',
                    mappings: [
                      {
                        generate: 'last_name',
                        dataType: 'string',
                        extract: '$.siblings.lName',
                      },
                      {
                        description: 'grand children mappings',
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
          {
            generate: 'items',
            dataType: 'objectarray',
            buildArrayHelper: [{
              extract: '$.items[*]',
            }],
          },
          {
            generate: 'test',
            dataType: 'objectarray',
            buildArrayHelper: [
              {
                extract: '$.children[*]',
                mappings: [
                  {
                    extract: 'a',
                    generate: 'a',
                    dataType: 'string',
                  },
                ],
              },
              {
                extract: '$.mother',
                mappings: [
                  {
                    extract: 'b',
                    generate: 'b',
                    dataType: 'string',
                  },
                ],
              },
              {
                extract: '$.father',
                mappings: [
                  {
                    extract: 'c',
                    generate: 'c',
                    dataType: 'string',
                  },
                ],
              },
            ],
          },
          {
            generate: 'test12',
            dataType: 'objectarray',
            buildArrayHelper: [
              {
                extract: '$.abc',
                mappings: [
                  {
                    extract: '1',
                    generate: '1',
                    dataType: 'string',
                    default: '',
                  },
                ],
              },
              {
                extract: '$.test',
                mappings: [
                  {
                    generate: '2',
                    dataType: 'objectarray',
                    buildArrayHelper: [
                      {
                        extract: '$',
                        mappings: [
                          {
                            extract: 'a',
                            generate: 'a',
                            dataType: 'string',
                          },
                        ],
                      },
                      {
                        extract: '$',
                        mappings: [
                          {
                            extract: 'b',
                            generate: 'b',
                            dataType: 'string',
                          },
                        ],
                      },
                      {
                        extract: '$',
                        mappings: [
                          {
                            extract: 'c',
                            generate: 'c',
                            dataType: 'string',
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
      };

      const v2TreeData = [{
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_first_name',
        jsonPath: 'my_first_name',
        dataType: 'string',
        extract: '$.fName',
        sourceDataType: 'string',
        isRequired: false,
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_full_name',
        jsonPath: 'my_full_name',
        dataType: 'string',
        extract: '{{record.fName}} {{record.lName}}',
        sourceDataType: 'string',
        isRequired: true,
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_mothers_name',
        jsonPath: 'my_mothers_name',
        dataType: 'object',
        isRequired: true,
        mappings: [{
          generate: 'first_name',
          dataType: 'string',
          hardCodedValue: 'some mothers name',
        }, {
          generate: 'last_name',
          dataType: 'string',
          extract: '$.mother.lName',
        }],
        children: [{
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          disabled: false,
          generate: 'first_name',
          jsonPath: 'my_mothers_name.first_name',
          dataType: 'string',
          hardCodedValue: 'some mothers name',
          sourceDataType: 'string',
          isRequired: false,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          disabled: false,
          generate: 'last_name',
          jsonPath: 'my_mothers_name.last_name',
          dataType: 'string',
          extract: '$.mother.lName',
          sourceDataType: 'string',
          isRequired: true,
        }],
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_many_first_names',
        jsonPath: 'my_many_first_names',
        dataType: 'stringarray',
        isRequired: false,
        buildArrayHelper: [{
          extract: '$.fname',
        }, {
          extract: '$.altFirstName',
        }, {
          extract: '$.additionalFirstNames',
        }],
        extractsArrayHelper: [{
          extract: '$.fname', sourceDataType: 'string'}, {extract: '$.altFirstName', sourceDataType: 'string'}, {extract: '$.additionalFirstNames', sourceDataType: 'string'}],
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'two_of_my_fav_names',
        jsonPath: 'two_of_my_fav_names',
        dataType: 'objectarray',
        isRequired: true,
        buildArrayHelper: [{
          mappings: [{
            generate: 'my_first_name',
            dataType: 'string',
            extract: '$.fName',
          }],
        }, {
          mappings: [{
            generate: 'my_last_name',
            dataType: 'string',
            extract: '$.lName',
          }],
        }],
        children: [{
          key: 'new_key',
          parentKey: 'new_key',
          title: '',
          isTabNode: true,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '',
          disabled: false,
          generate: 'my_first_name',
          jsonPath: 'two_of_my_fav_names[*].my_first_name',
          dataType: 'string',
          extract: '$.fName',
          sourceDataType: 'string',
          isRequired: true,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '',
          disabled: false,
          hidden: true,
          className: 'hideRow',
          generate: 'my_last_name',
          jsonPath: 'two_of_my_fav_names[*].my_last_name',
          dataType: 'string',
          extract: '$.lName',
          sourceDataType: 'string',
          isRequired: false,
        }],
        extractsArrayHelper: [],
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'all_the_children',
        dataType: 'objectarray',
        jsonPath: 'all_the_children',
        isRequired: false,
        buildArrayHelper: [{
          extract: '$.siblings[*].children[*]',
          mappings: [{
            generate: 'full_name',
            dataType: 'string',
            extract: '{{record.siblings.children.fName}} {{record.siblings.lName}}',
          }],
        }, {
          extract: '$.children[*]',
          mappings: [{
            generate: 'my_child_first_name',
            dataType: 'string',
            extract: '$.children.firstName',
          }],
        }],
        children: [{
          key: 'new_key',
          parentKey: 'new_key',
          title: '',
          isTabNode: true,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$.siblings[*].children[*]',
          disabled: false,
          generate: 'full_name',
          jsonPath: 'all_the_children[*].full_name',
          dataType: 'string',
          extract: '{{record.siblings.children.fName}} {{record.siblings.lName}}',
          sourceDataType: 'string',
          isRequired: false,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$.children[*]',
          disabled: false,
          hidden: true,
          className: 'hideRow',
          generate: 'my_child_first_name',
          jsonPath: 'all_the_children[*].my_child_first_name',
          dataType: 'string',
          extract: '$.children.firstName',
          sourceDataType: 'string',
          isRequired: false,
        }],
        extractsArrayHelper: [{extract: '$.siblings[*].children[*]', sourceDataType: 'string', copySource: 'no'}, {extract: '$.children[*]', sourceDataType: 'string', copySource: 'no'}],
        activeTab: 0,
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'images',
        dataType: 'objectarray',
        jsonPath: 'images',
        isRequired: false,
        buildArrayHelper: [
          {
            extract: '$',
            mappings: [
              {
                generate: 'test1',
                dataType: 'string',
                hardCodedValue: 'first_source',
              },
            ],
          },
          {
            extract: '$',
            mappings: [
              {
                generate: 'test2',
                dataType: 'object',
                mappings: [
                  {
                    generate: 'map',
                    dataType: 'string',
                    hardCodedValue: 'second_source',
                  },
                ],
              },
            ],
          },
        ],
        children: [{
          key: 'new_key',
          parentKey: 'new_key',
          title: '',
          isTabNode: true,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$|0',
          disabled: false,
          jsonPath: 'images[*].test1',
          generate: 'test1',
          dataType: 'string',
          hardCodedValue: 'first_source',
          sourceDataType: 'string',
          isRequired: false,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$|1',
          disabled: false,
          hidden: true,
          className: 'hideRow',
          generate: 'test2',
          jsonPath: 'images[*].test2',
          dataType: 'object',
          isRequired: false,
          mappings: [
            {
              generate: 'map',
              dataType: 'string',
              hardCodedValue: 'second_source',
            },
          ],
          children: [{
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            disabled: false,
            generate: 'map',
            jsonPath: 'images[*].test2.map',
            dataType: 'string',
            hardCodedValue: 'second_source',
            hidden: true,
            className: 'hideRow',
            sourceDataType: 'string',
            isRequired: false,
          }],
        }],
        extractsArrayHelper: [{extract: '$|0', sourceDataType: 'string', copySource: 'no'}, {extract: '$|1', sourceDataType: 'string', copySource: 'no'}],
        activeTab: 0,
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'family_tree_from_mom_perspective',
        jsonPath: 'family_tree_from_mom_perspective',
        dataType: 'object',
        isRequired: true,
        mappings: [{
          generate: 'children',
          dataType: 'objectarray',
          buildArrayHelper: [{
            extract: '$.siblings[*]',
            mappings: [{
              generate: 'last_name',
              dataType: 'string',
              extract: '$.siblings.lName',
            }, {
              description: 'grand children mappings',
              generate: 'grandchildren',
              dataType: 'objectarray',
              buildArrayHelper: [{
                extract: '$.siblings.children[*]',
                mappings: [{
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.siblings.children.fName',
                }],
              }],
            }],
          }, {
            mappings: [{
              generate: 'first_name',
              dataType: 'string',
              extract: '$.fName',
            }, {
              generate: 'grandchildren',
              dataType: 'objectarray',
              buildArrayHelper: [{
                extract: '$.children[*]',
                mappings: [{
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.children.firstName',
                }, {
                  generate: 'last_name',
                  dataType: 'string',
                  extract: '$.lName',
                }],
              }],
            }],
          }],
        }],
        children: [{
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          disabled: false,
          generate: 'children',
          jsonPath: 'family_tree_from_mom_perspective.children',
          dataType: 'objectarray',
          isRequired: true,
          buildArrayHelper: [{
            extract: '$.siblings[*]',
            mappings: [{
              generate: 'last_name',
              dataType: 'string',
              extract: '$.siblings.lName',
            }, {
              description: 'grand children mappings',
              generate: 'grandchildren',
              dataType: 'objectarray',
              buildArrayHelper: [{
                extract: '$.siblings.children[*]',
                mappings: [{
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.siblings.children.fName',
                }],
              }],
            }],
          }, {
            mappings: [{
              generate: 'first_name',
              dataType: 'string',
              extract: '$.fName',
            }, {
              generate: 'grandchildren',
              dataType: 'objectarray',
              buildArrayHelper: [{
                extract: '$.children[*]',
                mappings: [{
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.children.firstName',
                }, {
                  generate: 'last_name',
                  dataType: 'string',
                  extract: '$.lName',
                }],
              }],
            }],
          }],
          children: [{
            key: 'new_key',
            parentKey: 'new_key',
            title: '',
            isTabNode: true,
          }, {
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            parentExtract: '$.siblings[*]',
            disabled: false,
            generate: 'last_name',
            jsonPath: 'family_tree_from_mom_perspective.children[*].last_name',
            dataType: 'string',
            extract: '$.siblings.lName',
            sourceDataType: 'string',
            isRequired: false,
          }, {
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            parentExtract: '$.siblings[*]',
            disabled: false,
            description: 'grand children mappings',
            generate: 'grandchildren',
            jsonPath: 'family_tree_from_mom_perspective.children[*].grandchildren',
            dataType: 'objectarray',
            isRequired: true,
            buildArrayHelper: [{
              extract: '$.siblings.children[*]',
              mappings: [{
                generate: 'first_name',
                dataType: 'string',
                extract: '$.siblings.children.fName',
              }],
            }],
            children: [{
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
              parentExtract: '$.siblings.children[*]',
              disabled: false,
              generate: 'first_name',
              jsonPath: 'family_tree_from_mom_perspective.children[*].grandchildren[*].first_name',
              dataType: 'string',
              extract: '$.siblings.children.fName',
              sourceDataType: 'string',
              isRequired: true,
            }],
            extractsArrayHelper: [{extract: '$.siblings.children[*]', sourceDataType: 'string', copySource: 'no'}],
            activeTab: 0,
          }, {
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            parentExtract: '',
            disabled: false,
            hidden: true,
            className: 'hideRow',
            generate: 'first_name',
            jsonPath: 'family_tree_from_mom_perspective.children[*].first_name',
            dataType: 'string',
            extract: '$.fName',
            sourceDataType: 'string',
            isRequired: false,
          }, {
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            parentExtract: '',
            disabled: false,
            hidden: true,
            className: 'hideRow',
            generate: 'grandchildren',
            jsonPath: 'family_tree_from_mom_perspective.children[*].grandchildren',
            dataType: 'objectarray',
            isRequired: true,
            buildArrayHelper: [{
              extract: '$.children[*]',
              mappings: [{
                generate: 'first_name',
                dataType: 'string',
                extract: '$.children.firstName',
              }, {
                generate: 'last_name',
                dataType: 'string',
                extract: '$.lName',
              }],
            }],
            children: [{
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
              parentExtract: '$.children[*]',
              disabled: false,
              hidden: true,
              className: 'hideRow',
              generate: 'first_name',
              jsonPath: 'family_tree_from_mom_perspective.children[*].grandchildren[*].first_name',
              dataType: 'string',
              extract: '$.children.firstName',
              sourceDataType: 'string',
              isRequired: true,
            }, {
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
              parentExtract: '$.children[*]',
              disabled: false,
              hidden: true,
              className: 'hideRow',
              generate: 'last_name',
              jsonPath: 'family_tree_from_mom_perspective.children[*].grandchildren[*].last_name',
              dataType: 'string',
              extract: '$.lName',
              sourceDataType: 'string',
              isRequired: false,
            }],
            extractsArrayHelper: [{extract: '$.children[*]', sourceDataType: 'string', copySource: 'no'}],
            activeTab: 0,
          }],
          extractsArrayHelper: [{extract: '$.siblings[*]', sourceDataType: 'string', copySource: 'no'}],
          activeTab: 0,
        }],
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'items',
        jsonPath: 'items',
        dataType: 'objectarray',
        isRequired: false,
        buildArrayHelper: [{
          extract: '$.items[*]',
        }],
        children: [],
        extractsArrayHelper: [{extract: '$.items[*]', sourceDataType: 'string', copySource: 'yes'}],
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'test',
        jsonPath: 'test',
        dataType: 'objectarray',
        isRequired: false,
        buildArrayHelper: [
          {
            extract: '$.children[*]',
            mappings: [
              {
                extract: 'a',
                generate: 'a',
                dataType: 'string',
              },
            ],
          },
          {
            extract: '$.mother',
            mappings: [
              {
                extract: 'b',
                generate: 'b',
                dataType: 'string',
              },
            ],
          },
          {
            extract: '$.father',
            mappings: [
              {
                extract: 'c',
                generate: 'c',
                dataType: 'string',
              },
            ],
          },
        ],
        children: [{
          key: 'new_key',
          parentKey: 'new_key',
          title: '',
          isTabNode: true,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$.children[*]',
          disabled: false,
          generate: 'a',
          jsonPath: 'test[*].a',
          dataType: 'string',
          extract: 'a',
          sourceDataType: 'string',
          isRequired: false,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$.mother',
          disabled: false,
          hidden: true,
          className: 'hideRow',
          generate: 'b',
          jsonPath: 'test[*].b',
          dataType: 'string',
          extract: 'b',
          sourceDataType: 'string',
          isRequired: false,
        },
        {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$.father',
          disabled: false,
          hidden: true,
          className: 'hideRow',
          generate: 'c',
          jsonPath: 'test[*].c',
          dataType: 'string',
          extract: 'c',
          sourceDataType: 'string',
          isRequired: false,
        }],
        extractsArrayHelper: [{extract: '$.children[*]', sourceDataType: 'string', copySource: 'no'}, {extract: '$.mother', sourceDataType: 'string', copySource: 'no'}, {extract: '$.father', sourceDataType: 'string', copySource: 'no'}],
        activeTab: 0,
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'test12',
        jsonPath: 'test12',
        dataType: 'objectarray',
        isRequired: false,
        extractsArrayHelper: [{extract: '$.abc', sourceDataType: 'string', copySource: 'no'}, {extract: '$.test', sourceDataType: 'string', copySource: 'no'}],
        activeTab: 0,
        buildArrayHelper: [
          {
            extract: '$.abc',
            mappings: [
              {
                extract: '1',
                generate: '1',
                dataType: 'string',
                default: '',
              },
            ],
          },
          {
            extract: '$.test',
            mappings: [
              {
                generate: '2',
                dataType: 'objectarray',
                buildArrayHelper: [
                  {
                    extract: '$',
                    mappings: [
                      {
                        extract: 'a',
                        generate: 'a',
                        dataType: 'string',
                      },
                    ],
                  },
                  {
                    extract: '$',
                    mappings: [
                      {
                        extract: 'b',
                        generate: 'b',
                        dataType: 'string',
                      },
                    ],
                  },
                  {
                    extract: '$',
                    mappings: [
                      {
                        extract: 'c',
                        generate: 'c',
                        dataType: 'string',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        children: [
          {
            isTabNode: true,
            key: 'new_key',
            parentKey: 'new_key',
            title: '',
          },
          {
            dataType: 'string',
            default: '',
            extract: '1',
            generate: '1',
            jsonPath: 'test12[*].1',
            key: 'new_key',
            parentExtract: '$.abc',
            parentKey: 'new_key',
            title: '',
            disabled: false,
            sourceDataType: 'string',
            isRequired: false,
          },
          {
            className: 'hideRow',
            extractsArrayHelper: [{extract: '$|0', sourceDataType: 'string', copySource: 'no'}, {extract: '$|1', sourceDataType: 'string', copySource: 'no'}, {extract: '$|2', sourceDataType: 'string', copySource: 'no'}],
            activeTab: 0,
            dataType: 'objectarray',
            disabled: false,
            generate: '2',
            jsonPath: 'test12[*].2',
            hidden: true,
            key: 'new_key',
            parentExtract: '$.test',
            parentKey: 'new_key',
            title: '',
            isRequired: false,
            buildArrayHelper: [
              {
                extract: '$',
                mappings: [
                  {
                    extract: 'a',
                    generate: 'a',
                    dataType: 'string',
                  },
                ],
              },
              {
                extract: '$',
                mappings: [
                  {
                    extract: 'b',
                    generate: 'b',
                    dataType: 'string',
                  },
                ],
              },
              {
                extract: '$',
                mappings: [
                  {
                    extract: 'c',
                    generate: 'c',
                    dataType: 'string',
                  },
                ],
              },
            ],
            children: [
              {
                className: 'hideRow',
                hidden: true,
                isTabNode: true,
                key: 'new_key',
                parentKey: 'new_key',
                title: '',
              },
              {
                className: 'hideRow',
                dataType: 'string',
                disabled: false,
                extract: 'a',
                generate: 'a',
                jsonPath: 'test12[*].2[*].a',
                hidden: true,
                key: 'new_key',
                parentExtract: '$|0',
                parentKey: 'new_key',
                title: '',
                sourceDataType: 'string',
                isRequired: false,
              },
              {
                className: 'hideRow',
                dataType: 'string',
                disabled: false,
                extract: 'b',
                generate: 'b',
                jsonPath: 'test12[*].2[*].b',
                hidden: true,
                key: 'new_key',
                parentExtract: '$|1',
                parentKey: 'new_key',
                title: '',
                sourceDataType: 'string',
                isRequired: false,
              },
              {
                className: 'hideRow',
                dataType: 'string',
                disabled: false,
                extract: 'c',
                generate: 'c',
                jsonPath: 'test12[*].2[*].c',
                hidden: true,
                key: 'new_key',
                parentExtract: '$|2',
                parentKey: 'new_key',
                title: '',
                sourceDataType: 'string',
                isRequired: false,
              },
            ],
          },
        ],
      },
      ];

      expect(buildTreeFromV2Mappings({importResource, isGroupedSampleData: false, disabled: false, requiredMappings})).toEqual(v2TreeData);
    });
    test('should correctly generate the tree structure based on resource mappings if row based mappings', () => {
      generateId.mockReturnValue('new_key');

      const importResource = {
        mappings: [
          {
            dataType: 'objectarray',
            buildArrayHelper: [
              {
                extract: '$[*]',
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
                    generate: 'child_first_name',
                    dataType: 'string',
                    extract: '$.childFName',
                  },
                ],
              },
            ],
          },
        ],
      };

      const v2TreeData = [{
        buildArrayHelper: [{
          extract: '$[*]',
          mappings: [{
            dataType: 'string',
            extract: '$.fName',
            generate: 'first_name',
          }, {
            dataType: 'string',
            extract: '$.lName',
            generate: 'last_name',
          }, {
            dataType: 'string',
            extract: '$.childFName',
            generate: 'child_first_name',
          }],
        }],
        children: [{
          dataType: 'string',
          disabled: true,
          extract: '$.fName',
          generate: 'first_name',
          jsonPath: 'first_name',
          key: 'new_key',
          parentExtract: '$[*]|0',
          parentKey: 'new_key',
          title: '',
          sourceDataType: 'string',
          isRequired: false,
        }, {
          dataType: 'string',
          disabled: true,
          extract: '$.lName',
          generate: 'last_name',
          jsonPath: 'last_name',
          key: 'new_key',
          parentExtract: '$[*]|0',
          parentKey: 'new_key',
          title: '',
          sourceDataType: 'string',
          isRequired: false,
        }, {
          dataType: 'string',
          disabled: true,
          extract: '$.childFName',
          generate: 'child_first_name',
          jsonPath: 'child_first_name',
          key: 'new_key',
          parentExtract: '$[*]|0',
          parentKey: 'new_key',
          title: '',
          sourceDataType: 'string',
          isRequired: false,
        }],
        isRequired: false,
        extractsArrayHelper: [{extract: '$[*]|0', sourceDataType: 'string', copySource: 'no'}],
        activeTab: 0,
        dataType: 'objectarray',
        jsonPath: '',
        disabled: true,
        key: 'new_key',
        title: '',
      }];

      expect(buildTreeFromV2Mappings({importResource, isGroupedSampleData: true, disabled: true})).toEqual(v2TreeData);
    });
    test('should correctly generate default tree structure for csv/xlsx resource with no existing mappings', () => {
      generateId.mockReturnValue('new_key');

      const importResource = {
        _id: 'id1',
        adaptorType: 'FTPImport',
        file: {type: 'csv'},
      };

      const v2TreeData = [{
        key: 'new_key',
        title: '',
        dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
        generateDisabled: true,
        disabled: false,
        children: [
          {
            key: 'new_key',
            parentKey: 'new_key',
            title: '',
            dataType: MAPPING_DATA_TYPES.STRING,
            disabled: false,
            isEmptyRow: true,
            sourceDataType: 'string',
          },
        ],
      }];

      expect(buildTreeFromV2Mappings({importResource, isGroupedSampleData: false, disabled: false})).toEqual(v2TreeData);
    });
  });

  describe('isMappingWithoutExtract util', () => {
    test('should not throw exception for invalid args', () => {
      expect(isMappingWithoutExtract()).toBe(true);
      expect(isMappingWithoutExtract({})).toBe(true);
      expect(isMappingWithoutExtract(null)).toBe(true);
    });
    test('should return true if primitive data type has no extract', () => {
      const mapping = {
        dataType: 'number',
        generate: 'test',
      };

      expect(isMappingWithoutExtract(mapping)).toBe(true);
    });
    test('should return false if primitive data type has no extract but has hard coded value', () => {
      const mapping = {
        dataType: 'number',
        generate: 'test',
        hardCodedValue: 'abc',
      };

      expect(isMappingWithoutExtract(mapping)).toBe(false);
    });
    test('should return false if primitive data type has no extract but has dynamic lookup', () => {
      const mapping = {
        dataType: 'number',
        generate: 'test',
        lookupName: 'new-lookup',
      };
      const lookups = [{name: 'new-lookup'}];

      expect(isMappingWithoutExtract(mapping, lookups)).toBe(false);
    });
    test('should return true if array data type has no extract', () => {
      const mapping = {
        dataType: 'stringarray',
        generate: 'test',
        extractsArrayHelper: [],
      };

      expect(isMappingWithoutExtract(mapping)).toBe(true);
    });
    test('should return true if object data type has no extract with copy source as yes', () => {
      const mapping = {
        dataType: 'object',
        generate: 'test',
        copySource: 'yes',
        children: [],
      };

      expect(isMappingWithoutExtract(mapping)).toBe(true);
    });
    test('should return false if object data type has no extract with copy source as no', () => {
      const mapping = {
        dataType: 'object',
        generate: 'test',
        children: [],
      };

      expect(isMappingWithoutExtract(mapping)).toBe(false);
    });
  });

  describe('hasV2MappingsInTreeData util', () => {
    test('should not throw exception for invalid args', () => {
      expect(hasV2MappingsInTreeData()).toBe(false);
      expect(hasV2MappingsInTreeData([], [])).toBe(false);
    });
    test('should return true if no required mappings exist and any extract is present', () => {
      const mappings1 = [{key: 'key1', extract: '$.test'}];
      const mappings2 = [{key: 'key1', generateDisabled: true, extract: '$.test', children: [{key: 'c1', isEmptyRow: true}]}];

      expect(hasV2MappingsInTreeData(mappings1)).toBe(true);
      expect(hasV2MappingsInTreeData(mappings2)).toBe(true);
      expect(hasV2MappingsInTreeData([{key: 'key1', extract: 'e1', generate: 'g1', dataType: 'string'}])).toBe(true);
    });
    test('should return true if no required mappings exist and any generate is present', () => {
      const mappings1 = [{key: 'key1', generate: 'test'}];
      const mappings2 = [{key: 'key1', children: [{key: 'c1', generate: 'test'}]}];

      expect(hasV2MappingsInTreeData(mappings1)).toBe(true);
      expect(hasV2MappingsInTreeData(mappings2)).toBe(true);
    });
    test('should return true if required mappings exist and any extra generate is present', () => {
      const mappings1 = [{key: 'key1', isRequired: true, generate: 'test'}, {key: 'key2', generate: 'address'}];
      const mappings2 = [{key: 'key1', isRequired: true, generate: 'test', children: [{key: 'c1', generate: 'address'}]}];

      expect(hasV2MappingsInTreeData(mappings1)).toBe(true);
      expect(hasV2MappingsInTreeData(mappings2)).toBe(true);
    });
    test('should return true if required mappings exist and extract is present in those', () => {
      const mappings = [{key: 'key1', isRequired: true, generate: 'test', extract: '$.abc'}];

      expect(hasV2MappingsInTreeData(mappings)).toBe(true);
    });
    test('should return false if no valid mappings exist', () => {
      const mappings1 = [{key: 'key1'}];
      const mappings2 = [{key: 'key1', isRequired: true, generate: 'test'}];
      const mappings3 = [{key: 'key1', isRequired: true, generate: 'test', children: [{key: 'c1', isEmptyRow: true}]}];

      expect(hasV2MappingsInTreeData(mappings1)).toBe(false);
      expect(hasV2MappingsInTreeData(mappings2)).toBe(false);
      expect(hasV2MappingsInTreeData(mappings3)).toBe(false);
      expect(hasV2MappingsInTreeData([{key: 'key1', isEmptyRow: true}])).toBe(false);
      expect(hasV2MappingsInTreeData([{key: 'key1', generateDisabled: true, children: [{key: 'c1', isEmptyRow: true}]}])).toBe(false);
    });
  });
  describe('buildV2MappingsFromTree util', () => {
    test('should not throw exception for invalid args', () => {
      expect(buildV2MappingsFromTree({})).toEqual([]);
      expect(buildV2MappingsFromTree({v2TreeData: []})).toEqual([]);
    });
    test('should correctly return the v2 mappings structure based on passed tree data for record based output', () => {
      const v2TreeData = [{
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'dummy_generate',
        dataType: 'string',
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'arraynames',
        dataType: 'stringarray',
        hardCodedValue: null,
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_first_name',
        dataType: 'string',
        hardCodedValue: 'hard coded value',
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_full_name',
        dataType: 'string',
        extract: '{{record.fName}} {{record.lName}}',
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        dataType: 'object',
        children: [{
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          disabled: false,
          dataType: 'string',
        }],
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_mothers_name',
        dataType: 'object',
        mappings: [{
          generate: 'first_name',
          dataType: 'string',
          extract: '$.mother.fName',
        }, {
          generate: 'last_name',
          dataType: 'string',
          extract: '$.mother.lName',
        }],
        children: [{
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          disabled: false,
          generate: 'first_name',
          dataType: 'string',
          hardCodedValue: 'some mother name',
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          disabled: false,
          generate: 'last_name',
          dataType: 'string',
          extract: '$.mother.lName',
        }],
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_many_first_names',
        dataType: 'stringarray',
        buildArrayHelper: [{
          extract: '$.fname',
        }, {
          extract: '$.altFirstName',
        }, {
          extract: '$.additionalFirstNames',
        }],
        extractsArrayHelper: [{extract: '$.fname'}, {extract: '$.altFirstName'}, {extract: '$.additionalFirstNames'}],
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'two_of_my_fav_names',
        dataType: 'objectarray',
        buildArrayHelper: [{
          mappings: [{
            generate: 'my_first_name',
            dataType: 'string',
            extract: '$.fName',
          }],
        }, {
          mappings: [{
            generate: 'my_last_name',
            dataType: 'string',
            extract: '$.lName',
          }],
        }],
        children: [{
          key: 'new_key',
          parentKey: 'new_key',
          title: '',
          isTabNode: true,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$|0',
          disabled: false,
          generate: 'my_first_name',
          dataType: 'string',
          extract: '$.fName',
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$|1',
          disabled: false,
          hidden: true,
          className: 'hideRow',
          generate: 'my_last_name',
          dataType: 'string',
          extract: '$.lName',
        }],
        extractsArrayHelper: [{extract: '$|0'}, {extract: '$|1'}],
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'all_the_children',
        dataType: 'objectarray',
        buildArrayHelper: [{
          extract: '$.siblings[*].children[*]',
          mappings: [{
            generate: 'full_name',
            dataType: 'string',
            extract: '{{record.siblings.children.fName}} {{record.siblings.lName}}',
          }],
        }, {
          extract: '$.children[*]',
          mappings: [{
            generate: 'my_child_first_name',
            dataType: 'string',
            extract: '$.children.firstName',
          }],
        }],
        children: [{
          key: 'new_key',
          parentKey: 'new_key',
          title: '',
          isTabNode: true,
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$.siblings[*].children[*]',
          disabled: false,
          generate: 'full_name',
          dataType: 'string',
          extract: '{{record.siblings.children.fName}} {{record.siblings.lName}}',
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$.children[*]',
          disabled: false,
          hidden: true,
          className: 'hideRow',
          generate: 'my_child_first_name',
          dataType: 'string',
          extract: '$.children.firstName',
        }],
        extractsArrayHelper: [{extract: '$.siblings[*].children[*]'}, {extract: '$.children[*]'}],
      }, {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'family_tree_from_mom_perspective',
        dataType: 'object',
        mappings: [{
          generate: 'children',
          dataType: 'objectarray',
          buildArrayHelper: [{
            extract: '$.siblings[*]',
            mappings: [{
              generate: 'last_name',
              dataType: 'string',
              extract: '$.siblings.lName',
            }, {
              generate: 'grandchildren',
              dataType: 'objectarray',
              buildArrayHelper: [{
                extract: '$.siblings.children[*]',
                mappings: [{
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.siblings.children.fName',
                }],
              }],
            }],
          }, {
            mappings: [{
              generate: 'first_name',
              dataType: 'string',
              extract: '$.fName',
            }, {
              generate: 'grandchildren',
              dataType: 'objectarray',
              buildArrayHelper: [{
                extract: '$.children[*]',
                mappings: [{
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.children.firstName',
                }, {
                  generate: 'last_name',
                  dataType: 'string',
                  extract: '$.lName',
                }],
              }],
            }],
          }],
        }],
        children: [{
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          disabled: false,
          generate: 'children',
          dataType: 'objectarray',
          buildArrayHelper: [{
            extract: '$.siblings[*]',
            mappings: [{
              generate: 'last_name',
              dataType: 'string',
              extract: '$.siblings.lName',
            }, {
              generate: 'grandchildren',
              dataType: 'objectarray',
              buildArrayHelper: [{
                extract: '$.siblings.children[*]',
                mappings: [{
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.siblings.children.fName',
                }],
              }],
            }],
          }, {
            mappings: [{
              generate: 'first_name',
              dataType: 'string',
              extract: '$.fName',
            }, {
              generate: 'grandchildren',
              dataType: 'objectarray',
              buildArrayHelper: [{
                extract: '$.children[*]',
                mappings: [{
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.children.firstName',
                }, {
                  generate: 'last_name',
                  dataType: 'string',
                  extract: '$.lName',
                }],
              }],
            }],
          }],
          children: [{
            key: 'new_key',
            parentKey: 'new_key',
            title: '',
            isTabNode: true,
          }, {
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            parentExtract: '$.siblings[*]',
            disabled: false,
            generate: 'last_name',
            dataType: 'string',
            extract: '$.siblings.lName',
          }, {
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            parentExtract: '$.siblings[*]',
            disabled: false,
            generate: 'grandchildren',
            dataType: 'objectarray',
            buildArrayHelper: [{
              extract: '$.siblings.children[*]',
              mappings: [{
                generate: 'first_name',
                dataType: 'string',
                extract: '$.siblings.children.fName',
              }],
            }],
            children: [{
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
              parentExtract: '$.siblings.children[*]',
              disabled: false,
              generate: 'first_name',
              dataType: 'string',
              hardCodedValue: 'new hard coded',
              conditional: {when: 'extract_not_empty'},
            }],
            extractsArrayHelper: [{extract: '$.siblings.children[*]'}],
          }, {
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            parentExtract: '$|1',
            disabled: false,
            hidden: true,
            className: 'hideRow',
            generate: 'first_name',
            dataType: 'string',
            extract: '$.fName',
          }, {
            key: 'new_key',
            title: '',
            parentKey: 'new_key',
            parentExtract: '$|1',
            disabled: false,
            hidden: true,
            className: 'hideRow',
            generate: 'grandchildren',
            dataType: 'objectarray',
            description: 'grand children mappings',
            buildArrayHelper: [{
              extract: '$.children[*]',
              mappings: [{
                generate: 'first_name',
                dataType: 'string',
                extract: '$.children.firstName',
              }, {
                generate: 'last_name',
                dataType: 'string',
                extract: '$.lName',
              }],
            }],
            children: [{
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
              parentExtract: '$.children[*]',
              disabled: false,
              hidden: true,
              className: 'hideRow',
              generate: 'first_name',
              dataType: 'string',
              lookupName: 'lookup1',
            }, {
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
              parentExtract: '$.children[*]',
              disabled: false,
              hidden: true,
              className: 'hideRow',
              generate: 'last_name',
              dataType: 'string',
              extract: '$.lName',
            }],
            extractsArrayHelper: [{extract: '$.children[*]'}],
          }],
          extractsArrayHelper: [{extract: '$.siblings[*]'}, {extract: '$|1'}],
        }],
      }];

      const mappingsToSave = [
        {
          conditional: {when: undefined},
          generate: 'dummy_generate',
          dataType: 'string',
          status: 'Draft',
          sourceDataType: 'string',
        },
        {
          conditional: {when: undefined},
          generate: 'arraynames',
          dataType: 'stringarray',
          hardCodedValue: null,
          status: 'Active',
        },
        {
          conditional: {when: undefined},
          generate: 'my_first_name',
          dataType: 'string',
          hardCodedValue: 'hard coded value',
          status: 'Active',
          sourceDataType: 'string',
        },
        {
          conditional: {when: undefined},
          generate: 'my_full_name',
          dataType: 'string',
          extract: '{{record.fName}} {{record.lName}}',
          status: 'Active',
          sourceDataType: 'string',
        },
        {
          conditional: {when: undefined},
          dataType: 'object',
          status: 'Draft',
          mappings: [
            {
              conditional: {when: undefined},
              dataType: 'string',
              status: 'Draft',
              sourceDataType: 'string',
            },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'my_mothers_name',
          dataType: 'object',
          status: 'Active',
          mappings: [
            {
              conditional: {when: undefined},
              generate: 'first_name',
              dataType: 'string',
              hardCodedValue: 'some mother name',
              status: 'Active',
              sourceDataType: 'string',
            },
            {
              conditional: {when: undefined},
              generate: 'last_name',
              dataType: 'string',
              extract: '$.mother.lName',
              status: 'Active',
              sourceDataType: 'string',
            },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'my_many_first_names',
          dataType: 'stringarray',
          status: 'Active',
          buildArrayHelper: [
            { extract: '$.fname', sourceDataType: 'string' },
            { extract: '$.altFirstName', sourceDataType: 'string' },
            { extract: '$.additionalFirstNames', sourceDataType: 'string' },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'two_of_my_fav_names',
          dataType: 'objectarray',
          status: 'Active',
          buildArrayHelper: [
            {
              extract: '$',
              sourceDataType: 'string',
              mappings: [
                {
                  conditional: {when: undefined},
                  generate: 'my_first_name',
                  dataType: 'string',
                  extract: '$.fName',
                  status: 'Active',
                  sourceDataType: 'string',
                },
              ],
            },
            {
              extract: '$',
              sourceDataType: 'string',
              mappings: [
                {
                  conditional: {when: undefined},
                  generate: 'my_last_name',
                  dataType: 'string',
                  extract: '$.lName',
                  status: 'Active',
                  sourceDataType: 'string',
                },
              ],
            },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'all_the_children',
          dataType: 'objectarray',
          status: 'Active',
          buildArrayHelper: [
            {
              extract: '$.siblings[*].children[*]',
              sourceDataType: 'string',
              mappings: [
                {
                  conditional: {when: undefined},
                  generate: 'full_name',
                  dataType: 'string',
                  extract: '{{record.siblings.children.fName}} {{record.siblings.lName}}',
                  status: 'Active',
                  sourceDataType: 'string',
                },
              ],
            },
            {
              extract: '$.children[*]',
              sourceDataType: 'string',
              mappings: [
                {
                  conditional: {when: undefined},
                  generate: 'my_child_first_name',
                  dataType: 'string',
                  extract: '$.children.firstName',
                  status: 'Active',
                  sourceDataType: 'string',
                },
              ],
            },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'family_tree_from_mom_perspective',
          dataType: 'object',
          status: 'Active',
          mappings: [
            {
              conditional: {when: undefined},
              generate: 'children',
              dataType: 'objectarray',
              status: 'Active',
              buildArrayHelper: [
                {
                  extract: '$.siblings[*]',
                  sourceDataType: 'string',
                  mappings: [
                    {
                      conditional: {when: undefined},
                      generate: 'last_name',
                      dataType: 'string',
                      extract: '$.siblings.lName',
                      status: 'Active',
                      sourceDataType: 'string',
                    },
                    {
                      conditional: {when: undefined},
                      generate: 'grandchildren',
                      dataType: 'objectarray',
                      status: 'Active',
                      buildArrayHelper: [
                        {
                          extract: '$.siblings.children[*]',
                          sourceDataType: 'string',
                          mappings: [
                            {
                              conditional: {when: 'extract_not_empty'},
                              generate: 'first_name',
                              dataType: 'string',
                              hardCodedValue: 'new hard coded',
                              status: 'Active',
                              sourceDataType: 'string',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  extract: '$',
                  sourceDataType: 'string',
                  mappings: [
                    {
                      conditional: {when: undefined},
                      generate: 'first_name',
                      dataType: 'string',
                      extract: '$.fName',
                      status: 'Active',
                      sourceDataType: 'string',
                    },
                    {
                      conditional: {when: undefined},
                      generate: 'grandchildren',
                      dataType: 'objectarray',
                      description: 'grand children mappings',
                      status: 'Active',
                      buildArrayHelper: [
                        {
                          extract: '$.children[*]',
                          sourceDataType: 'string',
                          mappings: [
                            {
                              conditional: {when: undefined},
                              generate: 'first_name',
                              dataType: 'string',
                              lookupName: 'lookup1',
                              status: 'Active',
                              sourceDataType: 'string',
                            },
                            {
                              conditional: {when: undefined},
                              generate: 'last_name',
                              dataType: 'string',
                              extract: '$.lName',
                              status: 'Active',
                              sourceDataType: 'string',
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
      ];

      expect(buildV2MappingsFromTree({v2TreeData, lookups: [{name: 'lookup1'}]})).toEqual(mappingsToSave);
    });
    test('should correctly return the v2 mappings structure based on passed tree data for row based output', () => {
      const v2TreeData = [{
        buildArrayHelper: [{
          extract: '$[*]',
          mappings: [{
            dataType: 'string',
            extract: '$.fName',
            generate: 'first_name',
          }, {
            dataType: 'string',
            extract: '$.lName',
            generate: 'last_name',
          }, {
            dataType: 'string',
            extract: '$.childFName',
            generate: 'child_first_name',
          }],
        }],
        children: [{
          dataType: 'string',
          disabled: true,
          extract: '$.fName',
          generate: 'first_name',
          key: 'new_key',
          parentExtract: '$[*]|0',
          parentKey: 'new_key',
          title: '',
        }, {
          dataType: 'string',
          disabled: true,
          hardCodedValue: 'last name',
          generate: 'last_name',
          key: 'new_key',
          parentExtract: '$[*]|0',
          parentKey: 'new_key',
          title: '',
        }, {
          dataType: 'string',
          disabled: true,
          extract: '$.childFName',
          generate: 'child_first_name',
          key: 'new_key',
          parentExtract: '$[*]|0',
          parentKey: 'new_key',
          title: '',
        },
        {
          dataType: 'string',
          disabled: true,
          key: 'new_key',
          parentExtract: '$[*]|0',
          parentKey: 'new_key',
          title: '',
        }],
        extractsArrayHelper: [{extract: '$[*]|0'}],
        dataType: 'objectarray',
        disabled: true,
        key: 'new_key',
        title: '',
        generateDisabled: true,
        description: 'root mappings',
      }];

      const mappingsToSave = [
        {
          dataType: 'objectarray',
          conditional: {when: undefined},
          description: 'root mappings',
          status: 'Active',
          buildArrayHelper: [
            {
              extract: '$[*]',
              sourceDataType: 'string',
              mappings: [
                {
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.fName',
                  conditional: {when: undefined},
                  status: 'Active',
                  sourceDataType: 'string',
                },
                {
                  generate: 'last_name',
                  dataType: 'string',
                  conditional: {when: undefined},
                  hardCodedValue: 'last name',
                  status: 'Active',
                  sourceDataType: 'string',
                },
                {
                  generate: 'child_first_name',
                  dataType: 'string',
                  extract: '$.childFName',
                  conditional: {when: undefined},
                  status: 'Active',
                  sourceDataType: 'string',
                },
                {
                  dataType: 'string',
                  conditional: {when: undefined},
                  status: 'Draft',
                  sourceDataType: 'string',
                },
              ],
            },
          ],
        },
      ];

      expect(buildV2MappingsFromTree({v2TreeData})).toEqual(mappingsToSave);
    });
    test('should save empty v2 mappings to BE if only empty rows are present in tree', () => {
      const v2TreeData = [{
        dataType: 'string',
        key: 'new_key',
        title: '',
      }];

      expect(buildV2MappingsFromTree({v2TreeData})).toEqual([]);
    });
  });
  describe('allowDrop util', () => {
    test('should not throw exception for invalid args', () => {
      expect(allowDrop({})).toBe(false);
    });
    test('should return false if either node is hidden', () => {
      const dragNode = {
        hidden: true,
      };
      const dropNode = {
        hidden: true,
      };

      expect(allowDrop({dragNode})).toBe(false);
      expect(allowDrop({dropNode})).toBe(false);
      expect(allowDrop({dragNode, dropNode})).toBe(false);
    });
    test('should return false if drag node is tab node', () => {
      const dragNode = {
        isTabNode: true,
      };
      const dropNode = {
        extract: '$.fname',
      };

      expect(allowDrop({dragNode, dropNode})).toBe(false);
    });
    test('should return false if drop node has a tab child and drop position is 0', () => {
      const dragNode = {
        extract: '$.fname',
        generate: 'fname',
      };
      const dropNode = {
        generate: 'fname',
        children: [
          {
            isTabNode: true,
          },
        ],
      };

      expect(allowDrop({dragNode, dropNode, dropPosition: 0})).toBe(false);
    });
    test('should return true if drag node is a child to drop node and drop position is 0', () => {
      const dragNode = {
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
        parentKey: 'key1',
      };
      const dropNode = {
        key: 'key1',
        generate: 'fname',
        children: [
          {
            key: 'c1',
            extract: '$.fname',
            generate: 'fname',
            parentKey: 'key1',
          },
        ],
      };

      expect(allowDrop({dragNode, dropNode, dropPosition: 0})).toBe(true);
    });
    test('should return true if nodes are not at the same hierarchical level', () => {
      const dragNode = {
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
        parentKey: 'key1',
      };
      const dropNode = {
        key: 'key1',
        generate: 'fname',
        children: [
          {
            key: 'c1',
            extract: '$.fname',
            generate: 'fname',
            parentKey: 'key1',
          },
          {
            key: 'c2',
            extract: '$.lname',
            generate: 'lname',
            parentKey: 'key1',
          },
        ],
      };

      expect(allowDrop({dragNode, dropNode, dropPosition: 2})).toBe(true);
      expect(allowDrop({dragNode: {
        key: 'c2',
        extract: '$.lname',
        generate: 'lname',
        parentKey: 'key1',
      },
      dropNode,
      dropPosition: 2})).toBe(true);
    });
    test('should return true if drop node is tab and drop position is 1', () => {
      const dragNode = {
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
        parentKey: 'key1',
      };
      const dropNode = {
        key: 't1',
        isTabNode: true,
        parentKey: 'key1',
      };

      expect(allowDrop({dragNode, dropNode, dropPosition: 1})).toBe(true);
    });
    test('should return false if drop node is tab and drop position is not 1', () => {
      const dragNode = {
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
        parentKey: 'key1',
      };
      const dropNode = {
        key: 't1',
        isTabNode: true,
        parentKey: 'key1',
      };

      expect(allowDrop({dragNode, dropNode, dropPosition: 2})).toBe(false);
    });
    test('should return false if drop node does not have a child and drop position is 0', () => {
      const dragNode = {
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
      };
      const dropNode = {
        key: 'c2',
        extract: '$.lname',
        generate: 'lname',
      };

      expect(allowDrop({dragNode, dropNode, dropPosition: 0})).toBe(false);
    });
    test('should return true for other cases', () => {
      const dragNode = {
        key: 'c1',
        extract: '$.fname',
        generate: 'fname',
        parentKey: 'key1',
      };
      const dropNode = {
        key: 'c2',
        extract: '$.lname',
        generate: 'lname',
        parentKey: 'key1',
      };

      expect(allowDrop({dragNode, dropNode, dropPosition: 1})).toBe(true);
    });
  });
  describe('findNodeInTree util', () => {
    test('should not throw exception for invalid args', () => {
      expect(findNodeInTree()).toEqual({});
      expect(findNodeInTree(null)).toEqual({});
    });
    test('should correctly return the node with its sub location in the array', () => {
      const treeData = [
        {
          key: 'key1',
          title: '',
          extract: '$.fname',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
        {
          key: 'key2',
          title: '',
          generate: 'mothers_side',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          children: [
            {
              key: 'c1',
              title: '',
              extract: '$.child1',
              generate: 'child1',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
            {
              key: 'c2',
              title: '',
              extract: '$.child2',
              generate: 'child2',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING },
            {
              key: 'c3',
              title: '',
              extract: '$.child3',
              generate: 'child3',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
          ],
        },
        {
          key: 'key3',
          title: '',
          extract: '$.lname',
          generate: 'lname',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
      ];

      expect(findNodeInTree(treeData, 'key', 'key3')).toEqual({
        node: {
          key: 'key3',
          title: '',
          extract: '$.lname',
          generate: 'lname',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
        nodeSubArray: treeData,
        nodeIndexInSubArray: 2,
      });
      expect(findNodeInTree(treeData, 'key', 'c3')).toEqual({
        node: {
          key: 'c3',
          title: '',
          extract: '$.child3',
          generate: 'child3',
          parentKey: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
        nodeSubArray: treeData[1].children,
        nodeIndexInSubArray: 2,
      });
      expect(findNodeInTree(treeData, 'key', 'dummy')).toEqual({});
    });
  });
  describe('autoCreateDestinationStructure util', () => {
    test('should correctly return tree data for non csv/xlsx resource with required mappings', () => {
      generateId.mockReturnValue('new_key');
      const importSampleData = {
        id: '123',
        rowNumber: 3,
        files: [],
        custom: {},
        customerId: {value: 'abcd'},
        details: [{description: 'desc', orderType: {value: 'SO'}}],
      };
      const requiredMappings = ['id', 'details[*].orderType.value', 'customerId.value'];

      const treeData = [
        {
          dataType: 'string',
          generate: 'id',
          isRequired: true,
          jsonPath: 'id',
          key: 'new_key',
          title: '',
        },
        {
          dataType: 'number',
          generate: 'rowNumber',
          isRequired: false,
          jsonPath: 'rowNumber',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              isEmptyRow: true,
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'objectarray',
          generate: 'files',
          isRequired: false,
          jsonPath: 'files',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              isEmptyRow: true,
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'object',
          generate: 'custom',
          isRequired: false,
          jsonPath: 'custom',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              generate: 'value',
              isRequired: true,
              jsonPath: 'customerId.value',
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'object',
          generate: 'customerId',
          isRequired: true,
          jsonPath: 'customerId',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              generate: 'description',
              isRequired: false,
              jsonPath: 'details[*].description',
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
            {
              children: [
                {
                  dataType: 'string',
                  generate: 'value',
                  isRequired: true,
                  jsonPath: 'details[*].orderType.value',
                  key: 'new_key',
                  parentKey: 'new_key',
                  title: '',
                },
              ],
              dataType: 'object',
              generate: 'orderType',
              isRequired: true,
              jsonPath: 'details[*].orderType',
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'objectarray',
          generate: 'details',
          isRequired: true,
          jsonPath: 'details',
          key: 'new_key',
          title: '',
        },
      ];

      expect(autoCreateDestinationStructure(importSampleData, requiredMappings)).toEqual(treeData);
    });
    test('should correctly return tree data for csv/xlsx resource', () => {
      generateId.mockReturnValue('new_key');
      const importSampleData = {
        id: '123',
        rowNumber: 3,
        code: null};

      const treeData = [
        {
          children: [
            {
              dataType: 'string',
              generate: 'id',
              isRequired: false,
              jsonPath: 'id',
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
            },
            {
              dataType: 'number',
              generate: 'rowNumber',
              isRequired: false,
              jsonPath: 'rowNumber',
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
            },
            {
              dataType: 'string',
              generate: 'code',
              isRequired: false,
              jsonPath: 'code',
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
            },
          ],
          dataType: 'objectarray',
          generateDisabled: true,
          key: 'new_key',
          title: '',
        },
      ];

      expect(autoCreateDestinationStructure(importSampleData, [], true)).toEqual(treeData);
    });
  });
  describe('deleteNonRequiredMappings util', () => {
    test('should correctly delete all mappings if no required mappings exist', () => {
      const treeData = [
        {
          dataType: 'string',
          generate: 'id',
          isRequired: false,
          jsonPath: 'id',
          key: 'new_key',
          title: '',
        },
        {
          dataType: 'number',
          generate: 'rowNumber',
          isRequired: false,
          jsonPath: 'rowNumber',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              isEmptyRow: true,
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'objectarray',
          generate: 'files',
          isRequired: false,
          jsonPath: 'files[*]',
          key: 'new_key',
          title: '',
        },
      ];

      expect(deleteNonRequiredMappings(treeData)).toEqual([]);
    });
    test('should correctly delete only non-required mappings if required mappings also exist', () => {
      const treeData = [
        {
          dataType: 'string',
          generate: 'id',
          isRequired: true,
          jsonPath: 'id',
          key: 'new_key',
          title: '',
        },
        {
          dataType: 'number',
          generate: 'rowNumber',
          isRequired: false,
          jsonPath: 'rowNumber',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              isEmptyRow: true,
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'objectarray',
          generate: 'files',
          isRequired: false,
          jsonPath: 'files[*]',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              isEmptyRow: true,
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'object',
          generate: 'custom',
          isRequired: false,
          jsonPath: 'custom',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              generate: 'value',
              isRequired: true,
              jsonPath: 'customerId.value',
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'object',
          generate: 'customerId',
          isRequired: true,
          jsonPath: 'customerId',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              generate: 'description',
              isRequired: false,
              jsonPath: 'details[*].description',
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
            {
              children: [
                {
                  dataType: 'string',
                  generate: 'value',
                  isRequired: true,
                  jsonPath: 'details[*].orderType.value',
                  key: 'new_key',
                  parentKey: 'new_key',
                  title: '',
                },
              ],
              dataType: 'object',
              generate: 'orderType',
              isRequired: true,
              jsonPath: 'details[*].orderType',
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'objectarray',
          generate: 'details',
          isRequired: true,
          jsonPath: 'details[*]',
          key: 'new_key',
          title: '',
        },
      ];

      const newTreeData = [
        {
          dataType: 'string',
          generate: 'id',
          isRequired: true,
          jsonPath: 'id',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              dataType: 'string',
              generate: 'value',
              isRequired: true,
              jsonPath: 'customerId.value',
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'object',
          generate: 'customerId',
          isRequired: true,
          jsonPath: 'customerId',
          key: 'new_key',
          title: '',
        },
        {
          children: [
            {
              children: [
                {
                  dataType: 'string',
                  generate: 'value',
                  isRequired: true,
                  jsonPath: 'details[*].orderType.value',
                  key: 'new_key',
                  parentKey: 'new_key',
                  title: '',
                },
              ],
              dataType: 'object',
              generate: 'orderType',
              isRequired: true,
              jsonPath: 'details[*].orderType',
              key: 'new_key',
              parentKey: 'new_key',
              title: '',
            },
          ],
          dataType: 'objectarray',
          generate: 'details',
          isRequired: true,
          jsonPath: 'details[*]',
          key: 'new_key',
          title: '',
        },
      ];

      expect(deleteNonRequiredMappings(treeData)).toEqual(newTreeData);
    });
  });
  describe('buildExtractsTree util', () => {
    test('should not throw exception for invalid args', () => {
      expect(buildExtractsTree()).toEqual([]);
      expect(buildExtractsTree(null, null)).toEqual([]);
      expect(buildExtractsTree('invalid string data')).toEqual([]);
    });
    test('should correctly return the tree structure based on passed non-array sample data', () => {
      generateId.mockReturnValue('new_key');

      const sampleData = {
        fName: 'scott',
        lName: 'henderson',
        altFirstName: 'scooter',
        additionalFirstNames: ['scoots', 'mchendrix'],
        addresses: [],
        children: [
          {
            firstName: 'abby',
          },
          {
            firstName: 'paige',
          },
        ],
        mother: {
          fName: 'mary',
          lName: 'henderson',
        },
        father: {
          fName: 'herb',
          lName: 'henderson',
        },
        siblings: [
          {
            fName: 'james',
            lName: 'henderson',
            children: [
              {
                fName: 'patrick',
              },
              {
                fName: 'asher',
              },
              {
                fName: 'cade',
              },
              {
                fName: 'lee',
              },
            ],
          },
          {
            fName: 'erin',
            lName: 'tuohy',
            children: [
              {
                fName: 'jake',
              },
            ],
          },
        ],
      };
      const treeData = [
        {
          dataType: 'object',
          key: 'new_key',
          propName: '$',
          title: '',
          children: [
            {
              dataType: 'string',
              jsonPath: 'fName',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'fName',
              title: '',
            },
            {
              dataType: 'string',
              jsonPath: 'lName',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'lName',
              title: '',
            },
            {
              dataType: 'string',
              jsonPath: 'altFirstName',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'altFirstName',
              title: '',
            },
            {
              dataType: '[string]',
              jsonPath: 'additionalFirstNames',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'additionalFirstNames',
              title: '',
            },
            {
              dataType: '[object]',
              jsonPath: 'addresses[*]',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'addresses',
              title: '',
            },
            {
              children: [
                {
                  dataType: 'string',
                  jsonPath: 'children[*].firstName',
                  key: 'new_key',
                  parentKey: 'new_key',
                  propName: 'firstName',
                  title: '',
                },
              ],
              dataType: '[object]',
              jsonPath: 'children[*]',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'children',
              title: '',
            },
            {
              children: [
                {
                  dataType: 'string',
                  jsonPath: 'mother.fName',
                  key: 'new_key',
                  parentKey: 'new_key',
                  propName: 'fName',
                  title: '',
                },
                {
                  dataType: 'string',
                  jsonPath: 'mother.lName',
                  key: 'new_key',
                  parentKey: 'new_key',
                  propName: 'lName',
                  title: '',
                },
              ],
              dataType: 'object',
              jsonPath: 'mother',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'mother',
              title: '',
            },
            {
              children: [
                {
                  dataType: 'string',
                  jsonPath: 'father.fName',
                  key: 'new_key',
                  parentKey: 'new_key',
                  propName: 'fName',
                  title: '',
                },
                {
                  dataType: 'string',
                  jsonPath: 'father.lName',
                  key: 'new_key',
                  parentKey: 'new_key',
                  propName: 'lName',
                  title: '',
                },
              ],
              dataType: 'object',
              jsonPath: 'father',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'father',
              title: '',
            },
            {
              children: [
                {
                  dataType: 'string',
                  jsonPath: 'siblings[*].fName',
                  key: 'new_key',
                  parentKey: 'new_key',
                  propName: 'fName',
                  title: '',
                },
                {
                  dataType: 'string',
                  jsonPath: 'siblings[*].lName',
                  key: 'new_key',
                  parentKey: 'new_key',
                  propName: 'lName',
                  title: '',
                },
                {
                  children: [
                    {
                      dataType: 'string',
                      jsonPath: 'siblings[*].children[*].fName',
                      key: 'new_key',
                      parentKey: 'new_key',
                      propName: 'fName',
                      title: '',
                    },
                  ],
                  dataType: '[object]',
                  jsonPath: 'siblings[*].children[*]',
                  key: 'new_key',
                  parentKey: 'new_key',
                  propName: 'children',
                  title: '',
                },
              ],
              dataType: '[object]',
              jsonPath: 'siblings[*]',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'siblings',
              title: '',
            },
          ],
        },
      ];

      expect(buildExtractsTree(sampleData)).toEqual(treeData);
    });
    test('should correctly return the tree structure based on passed sample data', () => {
      generateId.mockReturnValue('new_key');

      const sampleData = [
        {
          fName: 'scott',
          lName: 'henderson',
          motherFName: 'mary',
          motherLName: 'henderson',
          childFName: 'abby',
        },
        {
          fName: 'scott',
          lName: 'henderson',
          motherFName: 'mary',
          motherLName: 'henderson',
          childFName: 'paige',
          addresses: [],
        },
        {
          fName: 'scott',
          lName: 'henderson',
          motherFName: 'mary',
          motherLName: 'henderson',
          childFName: 'ellie',
        },
      ];

      const treeData = [
        {
          dataType: '[object]',
          key: 'new_key',
          propName: '$',
          title: '',
          children: [
            {
              dataType: 'string',
              jsonPath: 'fName',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'fName',
              title: '',
            },
            {
              dataType: 'string',
              jsonPath: 'lName',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'lName',
              title: '',
            },
            {
              dataType: 'string',
              jsonPath: 'motherFName',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'motherFName',
              title: '',
            },
            {
              dataType: 'string',
              jsonPath: 'motherLName',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'motherLName',
              title: '',
            },
            {
              dataType: 'string',
              jsonPath: 'childFName',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'childFName',
              title: '',
            },
            {
              dataType: '[object]',
              jsonPath: 'addresses[*]',
              key: 'new_key',
              parentKey: 'new_key',
              propName: 'addresses',
              title: '',
            },
          ],
        },
      ];

      expect(buildExtractsTree(sampleData)).toEqual(treeData);
    });
  });
  describe('getSelectedKeys util', () => {
    test('should not throw exception for invalid args', () => {
      expect(getSelectedKeys()).toEqual([]);
      expect(getSelectedKeys(null, null, null)).toBeNull();
    });
    test('should correctly return the selected keys based on selected values', () => {
      const extractsTreeNode = {
        dataType: '[object]',
        key: 'key1',
        propName: '$',
        children: [
          {
            dataType: 'string',
            jsonPath: 'fName',
            key: 'c1',
            parentKey: 'key1',
            propName: 'fName',
          },
          {
            dataType: 'string',
            jsonPath: 'lName',
            key: 'c2',
            parentKey: 'key1',
            propName: 'lName',
          },
          {
            dataType: 'string',
            jsonPath: 'motherFName',
            key: 'c3',
            parentKey: 'key1',
            propName: 'motherFName',
          },
          {
            dataType: 'string',
            jsonPath: 'motherLName',
            key: 'c4',
            parentKey: 'key1',
            propName: 'motherLName',
          },
          {
            dataType: 'string',
            jsonPath: 'childFName',
            key: 'c5',
            parentKey: 'key1',
            propName: 'childFName',
            children: [{
              dataType: 'string',
              jsonPath: 'finalChild',
              key: 'c5-1',
              parentKey: 'c5',
              propName: 'finalChild',
            }],
          },
        ],
      };

      expect(getSelectedKeys(extractsTreeNode, ['motherFName', 'finalChild'])).toEqual(['c3', 'c5-1']);
    });
  });
  describe('findAllParentExtractsForNode util', () => {
    const treeData = [
      {
        key: 'k1',
        extract: '$.name',
        dataType: 'string',
      },
      {
        key: 'k2',
        extractsArrayHelper: [{extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        children: [{
          key: 'c1',
          extractsArrayHelper: [{extract: '$.siblings.children[*]'}],
          parentKey: 'k2',
          parentExtract: '$.siblings[*]',
          dataType: 'objectarray',
          children: [{
            key: 'c2',
            extract: '$.siblings.children.qty',
            parentExtract: '$.siblings.children[*]',
            parentKey: 'c1',
            dataType: 'string',
          }],
        }],
      },
      {
        key: 'k3',
        extractsArrayHelper: [{extract: '$.items[*]'}],
        dataType: 'objectarray',
        children: [{
          key: 'k3-c1',
          parentKey: 'k3',
          parentExtract: '$.items[*]',
          dataType: 'object',
          children: [{
            key: 'k3-c2',
            extract: '$.items.qty',
            parentKey: 'k3-c1',
            dataType: 'string',
          }],
        }],
      },
      {
        key: 'k4',
        extractsArrayHelper: [{extract: '$[*]|0'}],
        dataType: 'objectarray',
        children: [{
          key: 'k4-c1',
          parentKey: 'k4',
          parentExtract: '$[*]|0',
          dataType: 'object',
          children: [{
            key: 'k4-c2',
            extract: '$.qty',
            parentKey: 'k4-c1',
            dataType: 'string',
          }],
        }],
      },
    ];

    test('should not throw exception for invalid args', () => {
      expect(findAllParentExtractsForNode()).toEqual([]);
      expect(findAllParentExtractsForNode(null, null, null)).toBeNull();
    });
    test('should correctly return parent extracts for give node', () => {
      expect(findAllParentExtractsForNode(treeData, [], 'k1')).toEqual([]);
      expect(findAllParentExtractsForNode(treeData, [], 'c2')).toEqual(['$.siblings[*]', '$.siblings.children[*]']);
      expect(findAllParentExtractsForNode(treeData, [], 'k3-c2')).toEqual(['$.items[*]']);
      expect(findAllParentExtractsForNode(treeData, [], 'k4-c2')).toEqual(['$[*]']);
    });
  });
  describe('findNearestParentExtractForNode util', () => {
    const v2TreeData = [
      {
        key: 'k1',
        extract: '$.name',
        dataType: 'string',
      },
      {
        key: 'k2',
        extractsArrayHelper: [{extract: '$.siblings[*]'}],
        dataType: 'objectarray',
        children: [{
          key: 'c1',
          extractsArrayHelper: [{extract: '$.siblings.children[*]'}],
          parentKey: 'k2',
          parentExtract: '$.siblings[*]',
          dataType: 'objectarray',
          children: [{
            key: 'c2',
            extract: '$.siblings.children.qty',
            parentExtract: '$.siblings.children[*]',
            parentKey: 'c1',
            dataType: 'string',
          }],
        }],
      },
      {
        key: 'k3',
        extractsArrayHelper: [{extract: '$.items[*]'}],
        dataType: 'objectarray',
        children: [{
          key: 'k3-c1',
          parentKey: 'k3',
          parentExtract: '$.items[*]',
          dataType: 'object',
          children: [{
            key: 'k3-c2',
            extract: '$.items.qty',
            parentKey: 'k3-c1',
            dataType: 'string',
          }],
        }],
      },
    ];

    test('should not throw exception for invalid args', () => {
      expect(findNearestParentExtractForNode()).toBe('');
      expect(findNearestParentExtractForNode(null, null)).toBe('');
    });
    test('should correctly return parent extracts for give node', () => {
      expect(findNearestParentExtractForNode(v2TreeData, 'k1')).toBe('');
      expect(findNearestParentExtractForNode(v2TreeData, 'c2')).toBe('$.siblings.children[*]');
      expect(findNearestParentExtractForNode(v2TreeData, 'k3-c2')).toBe('$.items[*]');
    });
  });
  describe('getFinalSelectedExtracts util', () => {
    test('should not throw exception for invalid args', () => {
      expect(getFinalSelectedExtracts()).toBe('$');
    });
    test('should correctly return the json path for non array data type node', () => {
      expect(getFinalSelectedExtracts({jsonPath: 'children.lname'}, '$.fname')).toBe('$.children.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, 'test')).toBe('$.siblings[*]');
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, 'test', false, true)).toBe('$[*].siblings[*]');
      expect(getFinalSelectedExtracts({jsonPath: ''}, '', false, true)).toBe('$[*]');
    });
    test('should correctly return the json path for array data type node', () => {
      expect(getFinalSelectedExtracts({jsonPath: 'lname'}, '', true)).toBe('$.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'children.lname'}, '$.fname', true)).toBe('$.children.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, '$.fname,$.lname', true)).toBe('$.fname,$.siblings[*]');
      expect(getFinalSelectedExtracts({jsonPath: 'lname'}, '$.fname,', true, true)).toBe('$.fname,$[*].lname');
      expect(getFinalSelectedExtracts({jsonPath: 'children.lname'}, '$.fname', true, undefined, undefined, undefined, '$.fname'.length - 1)).toBe('$.children.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, '$.fname,$.lname', true, undefined, undefined, undefined, '$.fname,$.lname'.length - 1)).toBe('$.fname,$.siblings[*]');
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, '$.fname,$.lname', true, undefined, undefined, undefined, 1)).toBe('$.siblings[*],$.lname');
    });
    test('should correctly return the json path if parent key and parent extract are present', () => {
      const treeData = [{
        key: 'key1',
        extractsArrayHelper: [{extract: '$.items[*]'}],
        dataType: 'objectarray',
        children: [{
          key: 'c1',
          parentKey: 'key1',
          parentExtract: '$.items[*]',
          dataType: 'object',
          children: [
            {
              key: 'c2',
              parentKey: 'c1',
              dataType: 'string',
            },
          ],
        }],
      },
      {
        key: 'key2',
        dataType: 'string',
      }];

      expect(getFinalSelectedExtracts({jsonPath: 'items[*].inv_detail.name'}, '', true, false, 'c2', treeData)).toBe('$.items.inv_detail.name');
      expect(getFinalSelectedExtracts({jsonPath: 'items[*].name'}, '', true, false, 'key2', treeData)).toBe('$.items[*].name');
    });
  });
  describe('compareV2Mappings util', () => {
    test('should return false if both mappings are empty', () => {
      expect(compareV2Mappings()).toBe(false);
      expect(compareV2Mappings([], [])).toBe(false);
    });
    test('should return true if one mapping length is diff than other', () => {
      expect(compareV2Mappings([{key: 'key1'}], [])).toBe(true);
      expect(compareV2Mappings([], [{key: 'key1'}])).toBe(true);
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

      expect(compareV2Mappings(newData, origData)).toBe(true);
    });
    test('should return true if any children fields got changed', () => {
      const origData = [
        {
          key: 'key1',
          extractsArrayHelper: [{extract: '$.fname[*]'}],
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
          extractsArrayHelper: [{extract: '$.fname[*]'}],
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

      expect(compareV2Mappings(newData, origData)).toBe(true);
    });
    test('should return true if all children were removed', () => {
      const origData = [
        {
          key: 'key1',
          extractsArrayHelper: [{extract: '$.fname[*]'}],
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
          extractsArrayHelper: [{extract: '$.fname[*]'}],
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          copySource: 'yes',
        },
      ];

      expect(compareV2Mappings(newData, origData)).toBe(true);
    });
    test('should return true if some children were removed', () => {
      const origData = [
        {
          key: 'key1',
          extractsArrayHelper: [{extract: '$.fname[*]'}],
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          children: [
            {
              key: 'c1',
              extract: '$.child1',
              generate: 'child1',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
            {
              key: 'c2',
              extract: '$.child2',
              generate: 'child2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
          ],
        },
      ];
      const newData = [
        {
          key: 'key1',
          extractsArrayHelper: [{extract: '$.fname[*]'}],
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

      expect(compareV2Mappings(newData, origData)).toBe(true);
    });
    test('should return false if no crucial data changed', () => {
      const origData = [
        {
          key: 'key1',
          extractsArrayHelper: [{extract: '$.fname[*]'}],
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
          extractsArrayHelper: [{extract: '$.fname[*]'}],
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

      expect(compareV2Mappings(newData, origData)).toBe(false);
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
  describe('applyRequiredFilter util', () => {
    test('should not throw exception for invalid args', () => {
      expect(applyRequiredFilter()).toBeUndefined();
      expect(applyRequiredFilter({})).toEqual({});
      expect(applyRequiredFilter(null)).toBeNull();
      expect(applyRequiredFilter([])).toEqual([]);
    });
    test('should return only Required fields', () => {
      const v2TreeData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'id',
          extract: 'id',
          isRequired: true,
        },
        {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.NUMBER,
          generate: 'age',
          extract: 'age',
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'parent1',
          isRequired: true,
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: 'child1',
              isRequired: true,
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
              extract: 'child2',
              isRequired: false,
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent2',
          extract: 'parent2',
          isRequired: true,
          children: [
            {
              key: 'c3',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child3',
              extract: 'child3',
              isRequired: true,
              parentKey: 'key4',
            },
            {
              key: 'c4',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child4',
              extract: 'child4',
              isRequired: false,
              parentKey: 'key4',
            },
          ],
        },
      ];
      const expectedData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'id',
          extract: 'id',
          isRequired: true,
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'parent1',
          isRequired: true,
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: 'child1',
              isRequired: true,
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent2',
          extract: 'parent2',
          isRequired: true,
          children: [
            {
              key: 'c3',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child3',
              extract: 'child3',
              isRequired: true,
              parentKey: 'key4',
            },
          ],
        },
      ];

      expect(applyRequiredFilter(v2TreeData)).toEqual(expectedData);
    });
  });
  describe('applyMappedFilter util', () => {
    test('should not throw exception for invalid args', () => {
      expect(applyMappedFilter()).toBeUndefined();
      expect(applyMappedFilter({})).toEqual({});
      expect(applyMappedFilter(null)).toBeNull();
      expect(applyMappedFilter([])).toEqual([]);
    });
    test('should return only Mapped fields', () => {
      const v2TreeData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'id',
          extract: 'id',
        },
        {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'fname',
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'parent1',
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: 'child1',
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent2',
          children: [
            {
              key: 'c3',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child3',
              extract: 'child3',
              parentKey: 'key4',
            },
            {
              key: 'c4',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child4',
              parentKey: 'key4',
            },
          ],
        },
        {
          key: 'key5',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent3',
          activeTab: 1,
          extractsArrayHelper: [
            {
              extract: 'tab1',
            },
            {
              extract: 'tab2',
            },
          ],
          children: [
            {
              key: 'c0',
              isTabNode: true,
              parentKey: 'key5',
            },
            {
              key: 'c5',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child5',
              extract: 'tab1.child5',
              parentKey: 'key5',
              parentExtract: 'tab1',
            },
            {
              key: 'c6',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child6',
              parentKey: 'key5',
              parentExtract: 'tab2',
              className: 'hideRow',
              hidden: true,
            },
          ],
        },
      ];
      const expectedData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'id',
          extract: 'id',
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'parent1',
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: 'child1',
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent2',
          extractsWithoutMappings: [],
          children: [
            {
              key: 'c3',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child3',
              extract: 'child3',
              parentKey: 'key4',
            },
          ],
        },
        {
          key: 'key5',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent3',
          activeTab: 0,
          extractsWithoutMappings: ['tab2'],
          extractsArrayHelper: [
            {
              extract: 'tab1',
            },
            {
              extract: 'tab2',
            },
          ],
          children: [
            {
              key: 'c0',
              isTabNode: true,
              parentKey: 'key5',
            },
            {
              key: 'c5',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child5',
              extract: 'tab1.child5',
              parentKey: 'key5',
              parentExtract: 'tab1',
            },
          ],
        },
      ];

      expect(applyMappedFilter(v2TreeData)).toEqual(expectedData);
    });
    test('should return both Required and Mapped fields', () => {
      const v2TreeData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'id',
          isRequired: true,
        },
        {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'fname',
          extract: 'fname',
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'parent1',
          isRequired: true,
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              isRequired: true,
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
              extract: 'child2',
            },
            {
              key: 'c3',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child3',
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent2',
          isRequired: true,
          children: [
            {
              key: 'c4',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child4',
              extract: 'child4',
              parentKey: 'key4',
              isRequired: true,
            },
            {
              key: 'c5',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child5',
              parentKey: 'key4',
            },
          ],
        },
        {
          key: 'key5',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent3',
          activeTab: 1,
          extractsArrayHelper: [
            {
              extract: 'tab1',
            },
            {
              extract: 'tab2',
            },
          ],
          children: [
            {
              key: 'c0',
              isTabNode: true,
              parentKey: 'key5',
            },
            {
              key: 'c6',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child6',
              extract: 'tab1.child6',
              parentKey: 'key5',
              parentExtract: 'tab1',
            },
            {
              key: 'c7',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child7',
              parentKey: 'key5',
              parentExtract: 'tab2',
              className: 'hideRow',
              hidden: true,
            },
          ],
        },
      ];
      const expectedData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'id',
          isRequired: true,
        },
        {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'fname',
          extract: 'fname',
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'parent1',
          isRequired: true,
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              isRequired: true,
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
              extract: 'child2',
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent2',
          isRequired: true,
          extractsWithoutMappings: [],
          children: [
            {
              key: 'c4',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child4',
              extract: 'child4',
              parentKey: 'key4',
              isRequired: true,
            },
          ],
        },
        {
          key: 'key5',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent3',
          activeTab: 0,
          extractsWithoutMappings: ['tab2'],
          extractsArrayHelper: [
            {
              extract: 'tab1',
            },
            {
              extract: 'tab2',
            },
          ],
          children: [
            {
              key: 'c0',
              isTabNode: true,
              parentKey: 'key5',
            },
            {
              key: 'c6',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child6',
              extract: 'tab1.child6',
              parentKey: 'key5',
              parentExtract: 'tab1',
            },
          ],
        },
      ];

      expect(applyMappedFilter(v2TreeData, [], true)).toEqual(expectedData);
    });
  });
  describe('filterNode util', () => {
    test('should not throw exception for invalid args', () => {
      expect(filterNode()).toBe(false);
      expect(filterNode({})).toBe(false);
      expect(filterNode(null)).toBe(false);
    });
    test('should return false if generate is not matched', () => {
      const node = {
        key: 'key1',
        dataType: MAPPING_DATA_TYPES.STRING,
        generate: 'abc',
      };

      expect(filterNode(node, 'ABCdef')).toBe(false);
    });
    test('should return true if generate is matched', () => {
      const node = {
        key: 'key1',
        dataType: MAPPING_DATA_TYPES.STRING,
        generate: 'abc',
      };

      expect(filterNode(node, 'ABC')).toBe(true);
    });
  });
  describe('parentHasAnyChildMatch util', () => {
    const v2TreeData = [
      {
        key: 'key1',
        dataType: MAPPING_DATA_TYPES.STRING,
        generate: 'child1',
      },
      {
        key: 'key2',
        dataType: MAPPING_DATA_TYPES.OBJECT,
        generate: 'child2',
        children: [
          {
            key: 'key3',
            dataType: MAPPING_DATA_TYPES.STRING,
            generate: 'child3',
          },
        ],
      },
    ];

    test('should not throw exception for invalid args', () => {
      expect(parentHasAnyChildMatch()).toBe(false);
      expect(parentHasAnyChildMatch([])).toBe(false);
    });
    test('should return false if no children are matched', () => {
      expect(parentHasAnyChildMatch(v2TreeData, 'test')).toBe(false);
    });
    test('should return true if any child matched', () => {
      expect(parentHasAnyChildMatch(v2TreeData, 'child3')).toBe(true);
    });
  });
  describe('applySearchFilter util', () => {
    test('should not throw exception for invalid args', () => {
      expect(applySearchFilter()).toEqual([]);
      expect(applySearchFilter([])).toEqual([]);
      expect(applySearchFilter([{}], [])).toEqual([{}]);
    });
    test('should return only matching search rows', () => {
      const v2TreeData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'test',
          extract: 'id',
        },
        {
          key: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'fname',
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'test',
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: 'child1',
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent2',
          children: [
            {
              key: 'c3',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child3',
              extract: 'child3',
              parentKey: 'key4',
            },
            {
              key: 'c4',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              generate: 'child4',
              parentKey: 'key4',
              children: [
                {
                  key: 'c5',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'test',
                  extract: 'child5',
                  parentKey: 'c4',
                },
              ],
            },
          ],
        },
        {
          key: 'key5',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent3',
          activeTab: 1,
          extractsArrayHelper: [
            {
              extract: 'tab1',
            },
            {
              extract: 'tab2',
            },
          ],
          children: [
            {
              key: 'c0',
              isTabNode: true,
              parentKey: 'key5',
            },
            {
              key: 'c6',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'test',
              extract: 'tab1.child6',
              parentKey: 'key5',
              parentExtract: 'tab1',
            },
            {
              key: 'c7',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child7',
              parentKey: 'key5',
              parentExtract: 'tab2',
              className: 'hideRow',
              hidden: true,
            },
          ],
        },
        {
          key: 'key6',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
      ];
      const expectedData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'test',
          extract: 'id',
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'test',
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: 'child1',
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child2',
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          extractsWithoutMappings: [],
          generate: 'parent2',
          children: [
            {
              key: 'c4',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              generate: 'child4',
              parentKey: 'key4',
              children: [
                {
                  key: 'c5',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'test',
                  extract: 'child5',
                  parentKey: 'c4',
                },
              ],
            },
          ],
        },
        {
          key: 'key5',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent3',
          activeTab: 0,
          extractsArrayHelper: [
            {
              extract: 'tab1',
            },
            {
              extract: 'tab2',
            },
          ],
          extractsWithoutMappings: ['tab2'],
          children: [
            {
              key: 'c0',
              isTabNode: true,
              parentKey: 'key5',
            },
            {
              key: 'c6',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'test',
              extract: 'tab1.child6',
              parentKey: 'key5',
              parentExtract: 'tab1',
            },
          ],
        },
      ];

      expect(applySearchFilter(v2TreeData, undefined, 'test')).toEqual(expectedData);
    });
  });
  describe('countMatches util', () => {
    test('should not throw exception for invalid args', () => {
      expect(countMatches()).toBe(0);
      expect(countMatches([])).toBe(0);
    });
    test('should return the correct matches count', () => {
      const v2TreeData = [
        {
          key: 'key1',
          dataType: MAPPING_DATA_TYPES.STRING,
          generate: 'test',
          extract: 'id',
        },
        {
          key: 'key3',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          generate: 'test',
          children: [
            {
              key: 'c1',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'child1',
              extract: 'child1',
            },
            {
              key: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'test',
            },
          ],
        },
        {
          key: 'key4',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          extractsWithoutMappings: [],
          generate: 'parent2',
          children: [
            {
              key: 'c4',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              generate: 'child4',
              parentKey: 'key4',
              children: [
                {
                  key: 'c5',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  generate: 'test',
                  extract: 'child5',
                  parentKey: 'c4',
                },
              ],
            },
          ],
        },
        {
          key: 'key5',
          dataType: MAPPING_DATA_TYPES.OBJECTARRAY,
          generate: 'parent3',
          activeTab: 0,
          extractsArrayHelper: [
            {
              extract: 'tab1',
            },
            {
              extract: 'tab2',
            },
          ],
          extractsWithoutMappings: ['tab2'],
          children: [
            {
              key: 'c0',
              isTabNode: true,
              parentKey: 'key5',
            },
            {
              key: 'c6',
              dataType: MAPPING_DATA_TYPES.STRING,
              generate: 'test',
              extract: 'tab1.child6',
              parentKey: 'key5',
              parentExtract: 'tab1',
            },
          ],
        },
      ];

      expect(countMatches(v2TreeData, 'test')).toBe(5);
    });
  });
  describe('findNodeInTreeWithParents util', () => {
    test('should not throw exception for invalid args', () => {
      expect(findNodeInTreeWithParents()).toEqual({
        node: undefined,
        nodeIndexInSubArray: undefined,
        nodeSubArray: undefined,
        parentsList: [],
      });
      expect(findNodeInTreeWithParents(null)).toEqual({
        node: undefined,
        nodeIndexInSubArray: undefined,
        nodeSubArray: undefined,
        parentsList: [],
      });
    });
    test('should correctly return the node with its sub location in the array and its parents list', () => {
      const treeData = [
        {
          key: 'key1',
          title: '',
          extract: '$.fname',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
        {
          key: 'key2',
          title: '',
          generate: 'mothers_side',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          children: [
            {
              key: 'c1',
              title: '',
              extract: '$.child1',
              generate: 'child1',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
            {
              key: 'c2',
              title: '',
              extract: '$.child2',
              generate: 'child2',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING },
            {
              key: 'c3',
              title: '',
              extract: '$.child3',
              generate: 'child3',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
          ],
        },
        {
          key: 'key3',
          title: '',
          extract: '$.lname',
          generate: 'lname',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
      ];

      expect(findNodeInTreeWithParents(treeData, 'key', 'key3')).toEqual({
        node: {
          key: 'key3',
          title: '',
          extract: '$.lname',
          generate: 'lname',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
        nodeSubArray: treeData,
        nodeIndexInSubArray: 2,
        parentsList: [{
          key: 'key3',
          title: '',
          extract: '$.lname',
          generate: 'lname',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      });
      expect(findNodeInTreeWithParents(treeData, 'key', 'c3')).toEqual({
        node: {
          key: 'c3',
          title: '',
          extract: '$.child3',
          generate: 'child3',
          parentKey: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
        },
        nodeSubArray: treeData[1].children,
        nodeIndexInSubArray: 2,
        parentsList: [{
          key: 'key2',
          title: '',
          generate: 'mothers_side',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          children: [
            {
              key: 'c1',
              title: '',
              extract: '$.child1',
              generate: 'child1',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
            {
              key: 'c2',
              title: '',
              extract: '$.child2',
              generate: 'child2',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING },
            {
              key: 'c3',
              title: '',
              extract: '$.child3',
              generate: 'child3',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
            },
          ],
        },
        {
          key: 'c3',
          title: '',
          extract: '$.child3',
          generate: 'child3',
          parentKey: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
        }],
      });
      expect(findNodeInTreeWithParents(treeData, 'key', 'dummy')).toEqual({
        node: undefined,
        nodeIndexInSubArray: undefined,
        nodeSubArray: undefined,
        parentsList: [],
      });
    });
  });
  describe('findNodeWithGivenParentsList util', () => {
    test('should not throw exception for invalid args', () => {
      expect(findNodeWithGivenParentsList()).toEqual({
        node: undefined,
      });
      expect(findNodeWithGivenParentsList(null)).toEqual({
        node: undefined,
      });
    });
    test('should correctly return the node from the tree for the given parentList', () => {
      const treeData = [
        {
          key: 'key1',
          title: '',
          extract: '$.fname',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.STRING,
          jsonPath: 'fname',
        },
        {
          key: 'key2',
          title: '',
          generate: 'mothers_side',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          jsonPath: 'mothers_side',
          children: [
            {
              key: 'c1',
              title: '',
              extract: '$.child1',
              generate: 'child1',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child1',
            },
            {
              key: 'c2',
              title: '',
              extract: '$.child2',
              generate: 'child2',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child2',
            },
            {
              key: 'c3',
              title: '',
              extract: '$.child3',
              generate: 'child3',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child3',
            },
          ],
        },
        {
          key: 'key3',
          title: '',
          extract: '$.lname',
          generate: 'lname',
          dataType: MAPPING_DATA_TYPES.STRING,
          jsonPath: 'lname',
        },
      ];

      let parentsList = [{
        id: 'p1',
        title: '',
        generate: 'lname',
        dataType: MAPPING_DATA_TYPES.STRING,
      }];

      expect(findNodeWithGivenParentsList(treeData, parentsList)).toEqual({
        node: {
          key: 'key3',
          title: '',
          extract: '$.lname',
          generate: 'lname',
          dataType: MAPPING_DATA_TYPES.STRING,
          jsonPath: 'lname',
        },
      });

      parentsList = [{
        id: 'p1',
        title: '',
        generate: 'mothers_side',
        dataType: MAPPING_DATA_TYPES.OBJECT,
      },
      {
        id: 'p2',
        title: '',
        generate: 'child2',
        dataType: MAPPING_DATA_TYPES.STRING,
      }];
      expect(findNodeWithGivenParentsList(treeData, parentsList)).toEqual({
        node: {
          key: 'c2',
          title: '',
          extract: '$.child2',
          generate: 'child2',
          parentKey: 'key2',
          dataType: MAPPING_DATA_TYPES.STRING,
          jsonPath: 'mothers_side.child2',
        },
      });

      parentsList = [{
        id: 'p1',
        title: '',
        generate: 'mothers_side',
        dataType: MAPPING_DATA_TYPES.OBJECT,
      }];
      expect(findNodeWithGivenParentsList(treeData, parentsList)).toEqual({
        node: {
          key: 'key2',
          title: '',
          generate: 'mothers_side',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          jsonPath: 'mothers_side',
          children: [
            {
              key: 'c1',
              title: '',
              extract: '$.child1',
              generate: 'child1',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child1',
            },
            {
              key: 'c2',
              title: '',
              extract: '$.child2',
              generate: 'child2',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child2',
            },
            {
              key: 'c3',
              title: '',
              extract: '$.child3',
              generate: 'child3',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child3',
            },
          ],
        },
      });

      parentsList = [{
        id: 'p1',
        title: '',
        generate: 'mothers_side',
        dataType: MAPPING_DATA_TYPES.OBJECT,
      },
      {
        id: 'p2',
        title: '',
        generate: 'child4',
        dataType: MAPPING_DATA_TYPES.STRING,
      }];
      expect(findNodeWithGivenParentsList(treeData, parentsList)).toEqual({
        node: undefined,
      });
    });
  });
  describe('findLastNodeWithMatchingParent util', () => {
    test('should not throw exception for invalid args', () => {
      expect(findLastNodeWithMatchingParent()).toEqual({
        node: undefined,
        leftParentsList: [],
      });
      expect(findLastNodeWithMatchingParent(null, [])).toEqual({
        node: undefined,
        leftParentsList: [],
      });
    });
    test('should correctly return the node from tree and remaining parentsList', () => {
      const treeData = [
        {
          key: 'key1',
          title: '',
          extract: '$.fname',
          generate: 'fname',
          dataType: MAPPING_DATA_TYPES.STRING,
          jsonPath: 'fname',
        },
        {
          key: 'key2',
          title: '',
          generate: 'mothers_side',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          jsonPath: 'mothers_side',
          children: [
            {
              key: 'c1',
              title: '',
              extract: '$.child1',
              generate: 'child1',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child1',
            },
            {
              key: 'c2',
              title: '',
              extract: '$.child2',
              generate: 'child2',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.OBJECT,
              jsonPath: 'mothers_side.child2',
              children: [
                {
                  key: 'g1',
                  title: '',
                  extract: '$.grandchild1',
                  generate: 'grandchild1',
                  parentKey: 'c2',
                  dataType: MAPPING_DATA_TYPES.STRING,
                  jsonPath: 'mothers_side.child2.grandchild1',
                },
              ],
            },
            {
              key: 'c3',
              title: '',
              extract: '$.child3',
              generate: 'child3',
              parentKey: 'key2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child3',
            },
          ],
        },
        {
          key: 'key3',
          title: '',
          extract: '$.lname',
          generate: 'lname',
          dataType: MAPPING_DATA_TYPES.STRING,
          jsonPath: 'lname',
        },
      ];

      let parentsList = [{
        id: 'p1',
        title: '',
        generate: 'mothers_side',
        dataType: MAPPING_DATA_TYPES.OBJECT,
        jsonPath: 'mothers_side',
      },
      {
        id: 'p2',
        title: '',
        generate: 'child2',
        dataType: MAPPING_DATA_TYPES.OBJECT,
        jsonPath: 'mothers_side.child2',
      },
      {
        id: 'p3',
        title: '',
        generate: 'grandchild2',
        dataType: MAPPING_DATA_TYPES.STRING,
        jsonPath: 'mothers_side.child2.grandchild2',
      }];

      expect(findLastNodeWithMatchingParent(treeData, parentsList)).toEqual({
        node: {
          key: 'c2',
          title: '',
          extract: '$.child2',
          generate: 'child2',
          parentKey: 'key2',
          dataType: MAPPING_DATA_TYPES.OBJECT,
          jsonPath: 'mothers_side.child2',
          children: [
            {
              key: 'g1',
              title: '',
              extract: '$.grandchild1',
              generate: 'grandchild1',
              parentKey: 'c2',
              dataType: MAPPING_DATA_TYPES.STRING,
              jsonPath: 'mothers_side.child2.grandchild1',
            },
          ],
        },
        leftParentsList: [{
          id: 'p3',
          title: '',
          generate: 'grandchild2',
          dataType: MAPPING_DATA_TYPES.STRING,
          jsonPath: 'mothers_side.child2.grandchild2',
        }],
      });

      parentsList = [{
        id: 'p1',
        title: '',
        generate: 'fathers_side',
        dataType: MAPPING_DATA_TYPES.OBJECT,
        jsonPath: 'fathers_side',
      }];
      expect(findLastNodeWithMatchingParent(treeData, parentsList)).toEqual({
        node: undefined,
        leftParentsList: [],
      }
      );
    });
  });
});

