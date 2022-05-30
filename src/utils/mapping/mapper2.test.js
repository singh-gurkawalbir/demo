/* global describe, test, expect, jest */
import util, {
  MAPPING_DATA_TYPES,
  getAllKeys,
  compareV2Mappings,
  getFinalSelectedExtracts,
  filterExtractsNode,
  buildExtractsTree,
  findNodeInTree,
  allowDrop,
  buildV2MappingsFromTree,
  buildTreeFromV2Mappings,
  hasV2MappingsInTreeData,
  rebuildObjectArrayNode,
  hideOtherTabRows,
} from '.';
import {generateUniqueKey} from '../string';

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
        combinedExtract: '$.children[*],$.siblings[*]',
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
        combinedExtract: '$.children[*],$.siblings[*]',
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
        combinedExtract: '$.children[*],$.siblings[*]',
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
            combinedExtract: '$.siblings[*].children[*],$.siblings[*]',
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
              },
            ],
          },
        ],
      };

      const newTabExtract = '$.children[*]';
      const newNode = {
        combinedExtract: '$.children[*],$.siblings[*]',
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
            combinedExtract: '$.siblings[*].children[*],$.siblings[*]',
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

      expect(hideOtherTabRows(node, newTabExtract)).toEqual(newNode);
    });
    test('should correctly update the node with children hidden props if it has two level deep children and new extract is at 1th index', () => {
      const node = {
        combinedExtract: '$.children[*],$.siblings[*]',
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
            combinedExtract: '$.siblings[*].children[*],$.siblings[*]',
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
        combinedExtract: '$.children[*],$.siblings[*]',
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
            combinedExtract: '$.siblings[*].children[*],$.siblings[*]',
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
              },
            ],
          },
        ],
      };

      expect(hideOtherTabRows(node, newTabExtract)).toEqual(newNode);
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
        activeTab: 0,
        combinedExtract: '',
        children: [],
      });
      expect(rebuildObjectArrayNode({key: 'k1', dataType: 'string'})).toEqual({key: 'k1', dataType: 'string'});
    });
    test('should correctly update the node if prev source was 1 and now 2 sources are added', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const node = {
        activeTab: 0,
        combinedExtract: '$.children[*]',
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
        combinedExtract: '$.children[*],$.siblings[*]',
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
            parentExtract: '$.siblings[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update the node if prev sources were 2 and a third source is added in between', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const node = {
        combinedExtract: '$.children[*],$.siblings[*]',
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
        combinedExtract: '$.children[*],$.test[*].nested[*],$.siblings[*]',
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
            hidden: true,
            key: 'new_key',
            parentExtract: '$.test[*].nested[*]',
            parentKey: '3SC9pqVz-S2n-PQyVDhsS',
            title: '',
          },
        ],
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
    test('should correctly update the node if prev sources were 2 and first source is removed', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const node = {
        combinedExtract: '$.children[*],$.siblings[*]',
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
        combinedExtract: '$.siblings[*]',
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
      generateUniqueKey.mockReturnValue('new_key');

      const node = {
        combinedExtract: '',
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
        combinedExtract: '$,$',
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
            className: false,
            dataType: 'string',
            hidden: false,
            key: 'new_key',
            parentExtract: '$|0',
            parentKey: 'vlVDP3cjaN2cGmcSW1RCq',
            title: '',
          },
          {
            className: 'hideRow',
            dataType: 'string',
            hidden: true,
            key: 'new_key',
            parentExtract: '$|1',
            parentKey: 'vlVDP3cjaN2cGmcSW1RCq',
            title: '',
          },
        ],
      };

      expect(rebuildObjectArrayNode(node, extract)).toEqual(newNode);
    });
  });
  describe('buildTreeFromV2Mappings util', () => {
    test('should not throw exception for invalid args', () => {
      generateUniqueKey.mockReturnValue('new_key');

      const defaultTree = [{
        key: 'new_key',
        isEmptyRow: true,
        title: '',
        dataType: MAPPING_DATA_TYPES.STRING,
      }];

      expect(buildTreeFromV2Mappings({})).toEqual();
      expect(buildTreeFromV2Mappings({importResource: {mappings: []}})).toEqual(defaultTree);
    });
    test('should correctly generate the tree structure based on resource mappings if record based mappings', () => {
      generateUniqueKey.mockReturnValue('new_key');

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
        ],
      };

      const v2TreeData = [{
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'my_first_name',
        dataType: 'string',
        extract: '$.fName',
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
        generate: 'my_mothers_name',
        dataType: 'object',
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
          dataType: 'string',
          hardCodedValue: 'some mothers name',
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
        combinedExtract: '$.fname,$.altFirstName,$.additionalFirstNames',
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
        combinedExtract: '$,$',
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
        combinedExtract: '$.siblings[*].children[*],$.children[*]',
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
            children: [{
              key: 'new_key',
              title: '',
              parentKey: 'new_key',
              parentExtract: '$.siblings.children[*]',
              disabled: false,
              generate: 'first_name',
              dataType: 'string',
              extract: '$.siblings.children.fName',
            }],
            combinedExtract: '$.siblings.children[*]',
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
              extract: '$.children.firstName',
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
            combinedExtract: '$.children[*]',
          }],
          combinedExtract: '$.siblings[*],$',
        }],
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
        generate: 'items',
        dataType: 'objectarray',
        buildArrayHelper: [{
          extract: '$.items[*]',
        }],
        copySource: 'yes',
        combinedExtract: '$.items[*]',
      },
      {
        key: 'new_key',
        title: '',
        disabled: false,
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
          dataType: 'string',
          extract: 'a',
        }, {
          key: 'new_key',
          title: '',
          parentKey: 'new_key',
          parentExtract: '$.mother',
          disabled: false,
          hidden: true,
          className: 'hideRow',
          generate: 'b',
          dataType: 'string',
          extract: 'b',
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
          dataType: 'string',
          extract: 'c',
        }],
        combinedExtract: '$.children[*],$.mother,$.father',
      },
      ];

      expect(buildTreeFromV2Mappings({importResource, isGroupedSampleData: false, disabled: false})).toEqual(v2TreeData);
    });
    test('should correctly generate the tree structure based on resource mappings if row based mappings', () => {
      generateUniqueKey.mockReturnValue('new_key');

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
          key: 'new_key',
          parentExtract: '$[*]|0',
          parentKey: 'new_key',
          title: '',
        }, {
          dataType: 'string',
          disabled: true,
          extract: '$.lName',
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
        }],
        combinedExtract: '$[*]',
        dataType: 'objectarray',
        disabled: true,
        key: 'new_key',
        title: '',
      }];

      expect(buildTreeFromV2Mappings({importResource, isGroupedSampleData: true, disabled: true})).toEqual(v2TreeData);
    });
  });
  describe('hasV2MappingsInTreeData util', () => {
    test('should not throw exception for invalid args', () => {
      expect(hasV2MappingsInTreeData()).toEqual(false);
      expect(hasV2MappingsInTreeData(null)).toEqual(false);
      expect(hasV2MappingsInTreeData([])).toEqual(false);
    });
    test('should return false if only one default row exists', () => {
      expect(hasV2MappingsInTreeData([{key: 'key1', isEmptyRow: true}])).toEqual(false);
    });
    test('should return false if only one default row exists in rows output mode', () => {
      expect(hasV2MappingsInTreeData([{key: 'key1', generateDisabled: true, children: [{key: 'c1', isEmptyRow: true}]}])).toEqual(false);
    });
    test('should return true if tree data exists', () => {
      expect(hasV2MappingsInTreeData([{key: 'key1', extract: 'e1', generate: 'g1', dataType: 'string'}])).toEqual(true);
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
        combinedExtract: '$.fname,$.altFirstName,$.additionalFirstNames',
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
        combinedExtract: '$,$',
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
        combinedExtract: '$.siblings[*].children[*],$.children[*]',
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
            combinedExtract: '$.siblings.children[*]',
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
            combinedExtract: '$.children[*]',
          }],
          combinedExtract: '$.siblings[*],$',
        }],
      }];

      const mappingsToSave = [
        {
          conditional: {when: undefined},
          generate: 'my_first_name',
          dataType: 'string',
          hardCodedValue: 'hard coded value',
        },
        {
          conditional: {when: undefined},
          generate: 'my_full_name',
          dataType: 'string',
          extract: '{{record.fName}} {{record.lName}}',
        },
        {
          conditional: {when: undefined},
          generate: 'my_mothers_name',
          dataType: 'object',
          mappings: [
            {
              conditional: {when: undefined},
              generate: 'first_name',
              dataType: 'string',
              hardCodedValue: 'some mother name',
            },
            {
              conditional: {when: undefined},
              generate: 'last_name',
              dataType: 'string',
              extract: '$.mother.lName',
            },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'my_many_first_names',
          dataType: 'stringarray',
          buildArrayHelper: [
            { extract: '$.fname' },
            { extract: '$.altFirstName'},
            { extract: '$.additionalFirstNames' },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'two_of_my_fav_names',
          dataType: 'objectarray',
          buildArrayHelper: [
            {
              extract: '$',
              mappings: [
                {
                  conditional: {when: undefined},
                  generate: 'my_first_name',
                  dataType: 'string',
                  extract: '$.fName',
                },
              ],
            },
            {
              extract: '$',
              mappings: [
                {
                  conditional: {when: undefined},
                  generate: 'my_last_name',
                  dataType: 'string',
                  extract: '$.lName',
                },
              ],
            },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'all_the_children',
          dataType: 'objectarray',
          buildArrayHelper: [
            {
              extract: '$.siblings[*].children[*]',
              mappings: [
                {
                  conditional: {when: undefined},
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
                  conditional: {when: undefined},
                  generate: 'my_child_first_name',
                  dataType: 'string',
                  extract: '$.children.firstName',
                },
              ],
            },
          ],
        },
        {
          conditional: {when: undefined},
          generate: 'family_tree_from_mom_perspective',
          dataType: 'object',
          mappings: [
            {
              conditional: {when: undefined},
              generate: 'children',
              dataType: 'objectarray',
              buildArrayHelper: [
                {
                  extract: '$.siblings[*]',
                  mappings: [
                    {
                      conditional: {when: undefined},
                      generate: 'last_name',
                      dataType: 'string',
                      extract: '$.siblings.lName',
                    },
                    {
                      conditional: {when: undefined},
                      generate: 'grandchildren',
                      dataType: 'objectarray',
                      buildArrayHelper: [
                        {
                          extract: '$.siblings.children[*]',
                          mappings: [
                            {
                              conditional: {when: 'extract_not_empty'},
                              generate: 'first_name',
                              dataType: 'string',
                              hardCodedValue: 'new hard coded',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  extract: '$',
                  mappings: [
                    {
                      conditional: {when: undefined},
                      generate: 'first_name',
                      dataType: 'string',
                      extract: '$.fName',
                    },
                    {
                      conditional: {when: undefined},
                      generate: 'grandchildren',
                      dataType: 'objectarray',
                      description: 'grand children mappings',
                      buildArrayHelper: [
                        {
                          extract: '$.children[*]',
                          mappings: [
                            {
                              conditional: {when: undefined},
                              generate: 'first_name',
                              dataType: 'string',
                              lookupName: 'lookup1',
                            },
                            {
                              conditional: {when: undefined},
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
      ];

      expect(buildV2MappingsFromTree({v2TreeData})).toEqual(mappingsToSave);
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
        }],
        combinedExtract: '$[*]',
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
          buildArrayHelper: [
            {
              extract: '$[*]',
              mappings: [
                {
                  generate: 'first_name',
                  dataType: 'string',
                  extract: '$.fName',
                  conditional: {when: undefined},
                },
                {
                  generate: 'last_name',
                  dataType: 'string',
                  conditional: {when: undefined},
                  hardCodedValue: 'last name',
                },
                {
                  generate: 'child_first_name',
                  dataType: 'string',
                  extract: '$.childFName',
                  conditional: {when: undefined},
                },
              ],
            },
          ],
        },
      ];

      expect(buildV2MappingsFromTree({v2TreeData})).toEqual(mappingsToSave);
    });
  });
  describe('allowDrop util', () => {
    test('should not throw exception for invalid args', () => {
      expect(allowDrop({})).toEqual(false);
    });
    test('should return false if either node is hidden', () => {
      const dragNode = {
        hidden: true,
      };
      const dropNode = {
        hidden: true,
      };

      expect(allowDrop({dragNode})).toEqual(false);
      expect(allowDrop({dropNode})).toEqual(false);
      expect(allowDrop({dragNode, dropNode})).toEqual(false);
    });
    test('should return false if drag node is tab node', () => {
      const dragNode = {
        isTabNode: true,
      };
      const dropNode = {
        extract: '$.fname',
      };

      expect(allowDrop({dragNode, dropNode})).toEqual(false);
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

      expect(allowDrop({dragNode, dropNode, dropPosition: 0})).toEqual(false);
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

      expect(allowDrop({dragNode, dropNode, dropPosition: 0})).toEqual(true);
    });
    test('should return false if nodes are not at the same hierarchal level', () => {
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

      expect(allowDrop({dragNode, dropNode, dropPosition: 2})).toEqual(false);
      expect(allowDrop({dragNode: {
        key: 'c2',
        extract: '$.lname',
        generate: 'lname',
        parentKey: 'key1',
      },
      dropNode,
      dropPosition: 2})).toEqual(false);
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

      expect(allowDrop({dragNode, dropNode, dropPosition: 1})).toEqual(true);
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

      expect(allowDrop({dragNode, dropNode, dropPosition: 2})).toEqual(false);
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

      expect(allowDrop({dragNode, dropNode, dropPosition: 1})).toEqual(true);
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
  describe('buildExtractsTree util', () => {
    test('should not throw exception for invalid args', () => {
      expect(buildExtractsTree()).toEqual([]);
      expect(buildExtractsTree(null, null)).toEqual([]);
    });
    test('should correctly return the tree structure based on passed non-array sample data', () => {
      generateUniqueKey.mockReturnValue('new_key');

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

      expect(buildExtractsTree(sampleData)).toEqual({treeData, selectedKeys: []});
    });
    test('should correctly return the tree structure based on passed sample data', () => {
      generateUniqueKey.mockReturnValue('new_key');

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

      const selectedValues = ['motherFName'];

      expect(buildExtractsTree(sampleData, selectedValues)).toEqual({treeData, selectedKeys: ['new_key']});
    });
  });
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
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, 'test', false, true)).toEqual('$[*].siblings[*]');
      expect(getFinalSelectedExtracts({jsonPath: ''}, '', false, true)).toEqual('$[*]');
    });
    test('should correctly return the json path for array data type node', () => {
      expect(getFinalSelectedExtracts({jsonPath: 'lname'}, '', true)).toEqual('$.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'children.lname'}, '$.fname', true)).toEqual('$.children.lname');
      expect(getFinalSelectedExtracts({jsonPath: 'siblings[*]'}, '$.fname,$.lname', true)).toEqual('$.fname,$.siblings[*]');
      expect(getFinalSelectedExtracts({jsonPath: 'lname'}, '$.fname,', true, true)).toEqual('$.fname,$[*].lname');
    });
    test('should correctly return the json path if parent key and parent extract are present', () => {
      const treeData = [{
        key: 'key1',
        combinedExtract: '$.items[*]',
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

      expect(getFinalSelectedExtracts({jsonPath: 'items[*].inv_detail.name'}, '', true, false, 'c2', treeData)).toEqual('$.items.inv_detail.name');
      expect(getFinalSelectedExtracts({jsonPath: 'items[*].name'}, '', true, false, 'key2', treeData)).toEqual('$.items[*].name');
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
    test('should return true if all children were removed', () => {
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
    test('should return true if some children were removed', () => {
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

