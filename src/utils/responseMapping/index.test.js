/* global describe, test,  expect */
import responseMappingUtil from '.';

describe('response mapping utils', () => {
  test('getResponseMappingExtracts util', () => {
    const testCases = [
      {
        input: {
          resourceType: 'imports',
          adaptorType: 'HTTPImport',
        },
        result: [
          'id',
          'errors',
          'ignored',
          'statusCode',
          'headers',
        ],
      },
      {
        input: {
          resourceType: 'imports',
          adaptorType: 'NetsuiteImport',
        },
        result: [
          'id',
          'errors',
          'ignored',
          'statusCode',
        ],
      },
      {
        input: {
          resourceType: 'exports',
        },
        result: [
          'data',
          'errors',
          'ignored',
          'statusCode',
        ],
      },
    ];

    testCases.forEach(({input, result}) => {
      const {resourceType, adaptorType} = input;

      expect(responseMappingUtil.getResponseMappingExtracts(resourceType, adaptorType)).toEqual(result);
    });
  });

  test('getResponseMappingDefaultExtracts util', () => {
    const testCases = [
      {
        input: {
          resourceType: 'imports',
          adaptorType: 'HTTPImport',
        },
        result: [
          {id: 'id', name: 'id'},
          {id: 'errors', name: 'errors'},
          {id: 'ignored', name: 'ignored'},
          {id: 'statusCode', name: 'statusCode'},
          {id: 'headers', name: 'headers'},
        ],
      },
      {
        input: {
          resourceType: 'imports',
          adaptorType: 'NetsuiteImport',
        },
        result: [
          {id: 'id', name: 'id'},
          {id: 'errors', name: 'errors'},
          {id: 'ignored', name: 'ignored'},
          {id: 'statusCode', name: 'statusCode'},
        ],
      },
      {
        input: {
          resourceType: 'exports',
        },
        result: [
          {id: 'data', name: 'data'},
          {id: 'errors', name: 'errors'},
          {id: 'ignored', name: 'ignored'},
          {id: 'statusCode', name: 'statusCode'},
        ],
      },
    ];

    testCases.forEach(({input, result}) => {
      const {resourceType, adaptorType} = input;

      expect(responseMappingUtil.getResponseMappingDefaultExtracts(resourceType, adaptorType)).toEqual(result);
    });
  });
  test('getFieldsAndListMappings util', () => {
    const testCases = [
      {
        mapping: {
          fields: [
            {generate: 'fg1', extract: 'e1'},
          ],
          lists: [
            {
              generate: 'lg1',
              fields: [
                {generate: 'lfg1', extract: 'lge1'},
                {generate: 'lfg2', extract: 'lge2'},
              ],
            },
          ],
        },
        result: [
          {generate: 'fg1', extract: 'e1'},
          {generate: 'lg1[*].lfg1', extract: 'lge1'},
          {generate: 'lg1[*].lfg2', extract: 'lge2'},
        ],
      },
      {
        mapping: {
          lists: [
            {
              generate: 'lg1',
              fields: [
                {generate: 'lfg1', extract: 'lge1'},
                {generate: 'lfg2', extract: 'lge2'},
              ],
            },
          ],
        },
        result: [
          {generate: 'lg1[*].lfg1', extract: 'lge1'},
          {generate: 'lg1[*].lfg2', extract: 'lge2'},
        ],
      },
      {
        mapping: {
          fields: [
            {generate: 'fg1', extract: 'e1'},
            {generate: 'fg2', extract: 'e2'},
          ],
        },
        result: [
          {generate: 'fg1', extract: 'e1'},
          {generate: 'fg2', extract: 'e2'},
        ],
      },

    ];

    testCases.forEach(({mapping, result}) => {
      expect(responseMappingUtil.getFieldsAndListMappings(mapping)).toEqual(result);
    });
  });

  test('generateMappingFieldsAndList util', () => {
    const testCases = [
      {
        flatMapping: [
          {generate: 'fg1', extract: 'e1'},
          {generate: 'fg2', extract: 'e2'},
          {generate: 'lg1[*].lfg1', extract: 'lge1'},
          {generate: 'lg1[*].lfg2', extract: 'lge2'},
          {generate: 'lg2[*].lfg21', extract: 'lge21'},
        ],
        result: {
          fields: [
            {generate: 'fg1', extract: 'e1'},
            {generate: 'fg2', extract: 'e2'},
          ],
          lists: [
            {
              generate: 'lg1',
              fields: [
                {generate: 'lfg1', extract: 'lge1'},
                {generate: 'lfg2', extract: 'lge2'},
              ],
            },
            {
              generate: 'lg2',
              fields: [
                {generate: 'lfg21', extract: 'lge21'},
              ],
            },
          ],
        },
      },
      {
        flatMapping: [
          {generate: 'fg1', extract: 'e1'},
          {generate: 'fg2', extract: 'e2'},
        ],
        result: {
          fields: [
            {generate: 'fg1', extract: 'e1'},
            {generate: 'fg2', extract: 'e2'},
          ],
          lists: [],
        },
      },
      {
        flatMapping: [

          {generate: 'lg1[*].lfg1', extract: 'lge1'},
          {generate: 'lg1[*].lfg2', extract: 'lge2'},
          {generate: 'lg2[*].lfg21', extract: 'lge21'},

        ],
        result: {
          fields: [],
          lists: [
            {
              generate: 'lg1',
              fields: [
                {generate: 'lfg1', extract: 'lge1'},
                {generate: 'lfg2', extract: 'lge2'},
              ],
            },
            {
              generate: 'lg2',
              fields: [
                {generate: 'lfg21', extract: 'lge21'},
              ],
            },
          ],
        },
      },
      {
        flatMapping: [
          {generate: 'fg1', extract: 'e1'},
          {generate: '', extract: 'e2'},
          {generate: 'lg1[*].lfg1', extract: 'lge1'},
          {generate: '', extract: 'lge2'},
          {generate: 'abc'},
        ],
        result: {
          fields: [
            {generate: 'fg1', extract: 'e1'},
            {generate: 'abc'},
          ],
          lists: [
            {
              generate: 'lg1',
              fields: [
                {generate: 'lfg1', extract: 'lge1'},
              ],
            },
          ],
        },
      },
    ];

    testCases.forEach(({flatMapping, result}) => {
      expect(responseMappingUtil.generateMappingFieldsAndList(flatMapping)).toEqual(result);
    });
  });
});
