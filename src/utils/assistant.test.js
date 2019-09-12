/* global describe,  expect */
import each from 'jest-each';
import {
  getMatchingRoute,
  mergeHeaders,
  mergeQueryParameters,
  getExportVersionAndResource,
  getVersionDetails,
  getResourceDetails,
  getParamValue,
  generateValidReactFormFieldId,
  convertToReactFormFields,
  updateFormValues,
  PARAMETER_LOCATION,
} from './assistant';

describe('getMatchingRoute', () => {
  const testCases = [
    [
      {
        urlMatch: '/v1/connections',
        urlParts: [null],
      },
      [
        '/v1/connections',
        '/v1/connections/:_id',
        '/v1/integrations/:_integrationId/connections',
        '/v1/integrations',
        '/v1/integrations/:_id',
        '/v1/integrations/:_integrationId/exports',
      ],
      '/v1/connections',
    ],
    [
      {
        urlMatch: '/v1/connections',
        urlParts: ['some=thing&someThing=else'],
      },
      [
        '/v1/connections',
        '/v1/connections/:_id',
        '/v1/integrations/:_integrationId/connections',
        '/v1/integrations',
        '/v1/integrations/:_id',
        '/v1/integrations/:_integrationId/exports',
      ],
      '/v1/connections?some=thing&someThing=else',
    ],
    [
      {
        urlMatch: '/v1/connections/:_id',
        urlParts: ['someConnectionId', 'some=thing&someThing=else'],
      },
      [
        '/v1/connections',
        '/v1/connections/:_id',
        '/v1/integrations/:_integrationId/connections',
        '/v1/integrations',
        '/v1/integrations/:_id',
        '/v1/integrations/:_integrationId/exports',
      ],
      '/v1/connections/someConnectionId?some=thing&someThing=else',
    ],
    [
      {
        urlMatch: '/v1/integrations',
        urlParts: [null],
      },
      [
        '/v1/connections',
        '/v1/connections/:_id',
        '/v1/integrations/:_integrationId/connections',
        '/v1/integrations',
        '/v1/integrations/:_id',
        '/v1/integrations/:_integrationId/exports',
      ],
      '/v1/integrations',
    ],
    [
      {
        urlMatch: '/v1/integrations/:_integrationId/connections',
        urlParts: ['someIntegrationId', null],
      },
      [
        '/v1/connections',
        '/v1/connections/:_id',
        '/v1/integrations/:_integrationId/connections',
        '/v1/integrations',
        '/v1/integrations/:_id',
        '/v1/integrations/:_integrationId/exports',
      ],
      '/v1/integrations/someIntegrationId/connections',
    ],
    [
      {
        urlMatch: '/v1/integrations/:_id',
        urlParts: ['someIntegrationId', null],
      },
      [
        '/v1/connections',
        '/v1/connections/:_id',
        '/v1/integrations/:_integrationId/connections',
        '/v1/integrations',
        '/v1/integrations/:_id',
        '/v1/integrations/:_integrationId/exports',
      ],
      '/v1/integrations/someIntegrationId',
    ],
  ];

  each(testCases).test(
    'should return %o when routes = %o and url = %s',
    (expected, routes, url) => {
      expect(getMatchingRoute(routes, url)).toEqual(expected);
    }
  );
});

describe('mergeHeaders', () => {
  const testCases = [
    [{}, null, null],
    [{}, {}, {}],
    [{ a: 'b', c: 'd', e: 'f' }, { a: 'b', c: 'd' }, { e: 'f' }],
    [{ a: 'x', c: 'd', e: 'f' }, { a: 'b', c: 'd' }, { e: 'f', a: 'x' }],
  ];

  each(testCases).test(
    'should return %o when headers = %o and overwrites = %o',
    (expected, headers, overwrites) => {
      expect(mergeHeaders(headers, overwrites)).toEqual(expected);
    }
  );
});

describe('mergeQueryParameters', () => {
  const testCases = [
    [[], null, null],
    [[], [], []],
    [
      [
        { id: 'id3', someThing: 'else' },
        { id: 'id1' },
        { id: 'id2', some: 'thing' },
      ],
      [{ id: 'id1' }, { id: 'id2', some: 'thing' }],
      [{ id: 'id3', someThing: 'else' }],
    ],
    [
      [
        { id: 'id3', someThing: 'else' },
        { id: 'id1', something: 'something' },
        { id: 'id2', some: 'thing' },
      ],
      [{ id: 'id1' }, { id: 'id2', some: 'thing' }],
      [{ id: 'id3', someThing: 'else' }, { id: 'id1', something: 'something' }],
    ],
  ];

  each(testCases).test(
    'should return %o when queryParameters = %o and overwrites = %o',
    (expected, queryParameters, overwrites) => {
      expect(mergeQueryParameters(queryParameters, overwrites)).toEqual(
        expected
      );
    }
  );
});

const someAssistantData = {
  versions: [
    {
      version: 'v1',
      queryParameters: [{ id: 'v1qp1' }, { id: 'v1qp2' }],
      resources: [
        {
          id: 'r11',
          endpoints: [{ id: 'ep1' }, { url: 'something/:_someId' }],
        },
        {
          id: 'r12',
          headers: {
            r121: 'r121 value',
            a2: 'some thing',
          },
          endpoints: [
            { id: 'r12_ep1' },
            { url: 'r12_something/:_someId/someThingElse' },
          ],
        },
      ],
    },
    {
      version: 'v2',
      headers: {
        v21: 'v21 value',
        v22: 'v22 value',
      },
      resources: [
        {
          id: 'r21',
          endpoints: [{ id: 'ep1' }, { url: 'something/:_someId' }],
        },
        {
          id: 'r22',
          headers: {
            r121: 'r221 value',
            v22: 'some thing',
            a2: 'some thing else',
          },
          endpoints: [
            { id: 'r22_ep1' },
            { url: 'r22_something/:_someId/someThingElse' },
          ],
        },
      ],
    },
  ],
};

describe('getExportVersionAndResource', () => {
  const testCases = [
    [{}, undefined, undefined, undefined],
    [{}, undefined, undefined, {}],
    [{}, undefined, undefined, { versions: [] }],
    [{}, undefined, undefined, someAssistantData],
    [{ version: 'v1', resource: 'r11' }, 'v1', 'ep1', someAssistantData],
    [{ version: 'v2', resource: 'r21' }, undefined, 'ep1', someAssistantData],
    [{}, 'someVersion', 'ep1', someAssistantData],
    [
      { version: 'v1', resource: 'r11' },
      'v1',
      'something/:_someId',
      someAssistantData,
    ],
    [
      { version: 'v1', resource: 'r12' },
      undefined,
      'r12_ep1',
      someAssistantData,
    ],
    [
      { version: 'v2', resource: 'r21' },
      'v2',
      'something/:_someId',
      someAssistantData,
    ],
    [
      { version: 'v2', resource: 'r22' },
      undefined,
      'r22_ep1',
      someAssistantData,
    ],
    [
      { version: 'v2', resource: 'r22' },
      undefined,
      'r22_something/:_someId/someThingElse',
      someAssistantData,
    ],
  ];

  each(testCases).test(
    'should return %o when assistantVersion = %s, assistantOperation=%s and assistantData = %o',
    (expected, assistantVersion, assistantOperation, assistantData) => {
      expect(
        getExportVersionAndResource({
          assistantVersion,
          assistantOperation,
          assistantData,
        })
      ).toEqual(expected);
    }
  );
});

describe('getVersionDetails', () => {
  const testCases = [
    [{}, undefined, undefined],
    [{}, 'someVersion', undefined],
    [{}, 'someVersion', { versions: [] }],
    [{ version: 'v1' }, undefined, { versions: [{ version: 'v1' }] }],
    [{}, undefined, { versions: [{ version: 'v1' }, { version: 'v2' }] }],
    [
      { version: 'v1', headers: { h1: 'v1' } },
      undefined,
      { headers: { h1: 'v1' }, versions: [{ version: 'v1' }] },
    ],
    [
      { version: 'v1', headers: { h1: 'v1', h2: 'v2' } },
      undefined,
      {
        headers: { h1: 'v1' },
        versions: [{ version: 'v1', headers: { h2: 'v2' } }],
      },
    ],
    [
      { version: 'v1', headers: { h1: 'something', h2: 'v2' } },
      undefined,
      {
        headers: { h1: 'v1' },
        versions: [{ version: 'v1', headers: { h2: 'v2', h1: 'something' } }],
      },
    ],
    [
      {
        version: 'v1',
        headers: { h2: 'v2', h1: 'something' },
        paging: { some: 'thing' },
        successPath: 'successPath value',
        allowUndefinedResource: true,
        delta: { something: 'else' },
        successMediaType: 'successMediaType value',
        errorMediaType: 'errorMediaType value',
      },
      undefined,
      {
        paging: { some: 'thing' },
        successPath: 'successPath value',
        allowUndefinedResource: true,
        delta: { something: 'else' },
        successMediaType: 'successMediaType value',
        errorMediaType: 'errorMediaType value',
        versions: [{ version: 'v1', headers: { h2: 'v2', h1: 'something' } }],
      },
    ],
    [
      {
        version: 'v1',
        headers: { h2: 'v2', h1: 'something' },
        paging: { something: 'else' },
        successPath: 'successPath some value',
        allowUndefinedResource: false,
        delta: { something: 'else' },
        successMediaType: 'successMediaType value',
        errorMediaType: 'errorMediaType value',
      },
      undefined,
      {
        versions: [
          {
            version: 'v1',
            headers: { h2: 'v2', h1: 'something' },
            paging: { something: 'else' },
            successPath: 'successPath some value',
            allowUndefinedResource: false,
          },
        ],
        paging: { some: 'thing' },
        successPath: 'successPath value',
        allowUndefinedResource: true,
        delta: { something: 'else' },
        successMediaType: 'successMediaType value',
        errorMediaType: 'errorMediaType value',
      },
    ],
    [
      {
        version: 'v1',
        headers: { h2: 'v2', h1: 'something' },
        paging: { some: 'thing' },
        successPath: 'successPath value',
        allowUndefinedResource: true,
        delta: { something: 'something' },
        successMediaType: 'successMediaType some value',
        errorMediaType: 'errorMediaType some value',
      },
      undefined,
      {
        versions: [
          {
            version: 'v1',
            headers: { h2: 'v2', h1: 'something' },
            delta: { something: 'something' },
            successMediaType: 'successMediaType some value',
            errorMediaType: 'errorMediaType some value',
          },
        ],
        paging: { some: 'thing' },
        successPath: 'successPath value',
        allowUndefinedResource: true,
        delta: { something: 'else' },
        successMediaType: 'successMediaType value',
        errorMediaType: 'errorMediaType value',
      },
    ],
    [{}, undefined, someAssistantData],
    [
      someAssistantData.versions.find(v => v.version === 'v1'),
      'v1',
      someAssistantData,
    ],
    [
      someAssistantData.versions.find(v => v.version === 'v2'),
      'v2',
      someAssistantData,
    ],
    [
      {
        ...someAssistantData.versions.find(v => v.version === 'v1'),
        headers: {
          a1: 'a1 value',
          a2: 'a2 value',
        },
      },
      'v1',
      {
        ...someAssistantData,
        headers: {
          a1: 'a1 value',
          a2: 'a2 value',
        },
      },
    ],
    [
      {
        ...someAssistantData.versions.find(v => v.version === 'v2'),
        headers: {
          ...someAssistantData.versions.find(v => v.version === 'v2').headers,
          a1: 'a1 value',
          a2: 'a2 value',
        },
      },
      'v2',
      {
        ...someAssistantData,
        headers: {
          a1: 'a1 value',
          a2: 'a2 value',
        },
      },
    ],
    [
      {
        ...someAssistantData.versions.find(v => v.version === 'v1'),
        queryParameters: [
          ...someAssistantData.versions.find(v => v.version === 'v1')
            .queryParameters,
          { id: 'qp1' },
          { id: 'qp2' },
        ],
      },
      'v1',
      {
        ...someAssistantData,
        queryParameters: [{ id: 'qp1' }, { id: 'qp2' }],
      },
    ],
    [
      {
        ...someAssistantData.versions.find(v => v.version === 'v2'),
        queryParameters: [{ id: 'qp1' }, { id: 'qp2' }],
      },
      'v2',
      {
        ...someAssistantData,
        queryParameters: [{ id: 'qp1' }, { id: 'qp2' }],
      },
    ],
  ];

  each(testCases).test(
    'should return %o when version = %s and assistantData = %o',
    (expected, version, assistantData) => {
      expect(
        getVersionDetails({
          version,
          assistantData,
        })
      ).toEqual(expected);
    }
  );
});

describe('getResourceDetails TODO', () => {
  const testCases = [[{}, undefined, undefined, undefined]];

  each(testCases).test(
    'should return %o when version = %s, resource = %s and assistantData = %o',
    (expected, version, resource, assistantData) => {
      expect(
        getResourceDetails({
          version,
          resource,
          assistantData,
        })
      ).toEqual(expected);
    }
  );
});

describe('getParamValue', () => {
  const testCases = [
    [undefined, undefined, undefined],
    [undefined, {}, {}],
    [undefined, { id: 'abc' }, { def: 'xyz' }],
    ['def', { id: 'abc' }, { abc: 'def' }],
    ['def', { id: 'abc', inputType: 'multiselect' }, { abc: 'def' }],
    [
      ['def'],
      {
        id: 'abc',
        inputType: 'multiselect',
        paramLocation: PARAMETER_LOCATION.QUERY,
      },
      { abc: 'def' },
    ],
    [
      ['def'],
      {
        id: 'abc',
        inputType: 'multiselect',
        paramLocation: PARAMETER_LOCATION.QUERY,
      },
      { abc: ['def'] },
    ],
    [
      'def',
      {
        id: 'abc',
        inputType: 'select',
        paramLocation: PARAMETER_LOCATION.BODY,
      },
      { abc: 'def' },
    ],
    [
      'def',
      {
        id: 'abc',
        inputType: 'select',
        paramLocation: PARAMETER_LOCATION.BODY,
      },
      { abc: ['def'] },
    ],
    [
      'something',
      {
        id: 'searchCriteria[filter_groups][0][filters][0][field]',
        paramLocation: PARAMETER_LOCATION.QUERY,
      },
      {
        abc: 'def',
        'searchCriteria[filter_groups][0][filters][0][field]': 'something',
      },
    ],
    [
      'something',
      {
        id: 'searchCriteria[filter_groups]',
        paramLocation: PARAMETER_LOCATION.QUERY,
      },
      {
        abc: 'def',
        'searchCriteria[filter_groups]': 'something',
        searchCriteria: { filter_groups: 'something else' },
      },
    ],
    [
      'something else',
      {
        id: 'searchCriteria[filter_groups]',
        paramLocation: PARAMETER_LOCATION.QUERY,
      },
      {
        abc: 'def',
        searchCriteria: { '[filter_groups]': 'something else' },
      },
    ],
    [
      'some thing',
      {
        id: 'a.b',
        paramLocation: PARAMETER_LOCATION.BODY,
      },
      {
        a: {
          b: 'some thing',
          c: {
            d: {
              e: 'something else',
            },
          },
        },
      },
    ],
    [
      'something else',
      {
        id: 'a.c.d.e',
        paramLocation: PARAMETER_LOCATION.BODY,
      },
      {
        a: {
          b: 'some thing',
          c: {
            d: {
              e: 'something else',
            },
          },
        },
      },
    ],
    [
      undefined,
      {
        id: 'a.c.d.e',
        paramLocation: PARAMETER_LOCATION.BODY,
      },
      {},
    ],
  ];

  each(testCases).test(
    'should return %o when fieldMeta = %o and values = %o',
    (expected, fieldMeta, values) => {
      expect(
        getParamValue({
          fieldMeta,
          values,
        })
      ).toEqual(expected);
    }
  );
});

describe('generateValidReactFormFieldId', () => {
  const testCases = [
    ['something', 'something'],
    ['some/thing', 'some.thing'],
    ['some*_*thing', 'some[thing'],
    ['something*__*', 'something]'],
    ['so/me*_*thing*__*', 'so.me[thing]'],
  ];

  each(testCases).test(
    'should return %s for fieldId = %s ',
    (expected, fieldId) => {
      expect(generateValidReactFormFieldId(fieldId)).toEqual(expected);
    }
  );
});

describe('convertToReactFormFields', () => {
  const testCases = [
    [
      {
        fields: [],
        fieldDetailsMap: {},
      },
      {
        paramMeta: {
          defaultValuesForDeltaExport: {},
          paramLocation: PARAMETER_LOCATION.QUERY,
        },
        value: {},
      },
    ],
    [
      {
        fields: [
          {
            id: 'f1',
            name: 'f1',
            type: 'text',
            required: true,
          },
        ],
        fieldDetailsMap: {
          f1: {
            id: 'f1',
            inputType: 'text',
          },
        },
      },
      {
        paramMeta: {
          fields: [{ id: 'f1', required: true }],
        },
      },
    ],
    [
      {
        fields: [
          {
            id: 'f1',
            name: 'f1',
            type: 'text',
            required: false,
          },
        ],
        fieldDetailsMap: {
          f1: {
            id: 'f1',
            inputType: 'text',
          },
        },
      },
      {
        paramMeta: { fields: [{ id: 'f1' }] },
      },
    ],
    [
      {
        fields: [
          {
            id: 'f2',
            name: 'f2',
            type: 'text',
            required: true,
          },
        ],
        fieldSets: [
          {
            header: 'Optional',
            collapsed: true,
            fields: [
              {
                id: 'f1',
                name: 'f1',
                type: 'text',
                required: false,
              },
            ],
          },
        ],
        fieldDetailsMap: {
          f1: {
            id: 'f1',
            inputType: 'text',
          },
          f2: {
            id: 'f2',
            inputType: 'text',
          },
        },
      },
      {
        paramMeta: { fields: [{ id: 'f1' }, { id: 'f2', required: true }] },
      },
    ],
    [
      {
        fields: [
          {
            id: 'id_multiselect',
            label: 'MultiSelect',
            name: 'id_multiselect',
            options: [
              {
                items: [
                  {
                    label: 'active',
                    value: 'active',
                  },
                  {
                    label: 'closed',
                    value: 'closed',
                  },
                  {
                    label: 'subscriber',
                    value: 'subscriber',
                  },
                  {
                    label: 'non_subscriber',
                    value: 'non_subscriber',
                  },
                  {
                    label: 'past_due',
                    value: 'past_due',
                  },
                ],
              },
            ],
            required: true,
            type: 'multiselect',
            defaultValue: ['one', 'two'],
          },
          {
            id: 'id_text',
            label: 'Text',
            name: 'id_text',
            placeholder: 'some placeholder',
            required: true,
            type: 'text',
          },
        ],
        fieldSets: [
          {
            collapsed: true,
            header: 'Optional',
            fields: [
              {
                id: 'id_checkbox',
                label: 'Checkbox',
                name: 'id_checkbox',
                required: false,
                type: 'checkbox',
                helpText: 'some help text',
              },
              {
                id: 'id_select',
                label: 'Select',
                name: 'id_select',
                options: [
                  {
                    items: [
                      {
                        label: 'desc',
                        value: 'desc',
                      },
                      {
                        label: 'asc',
                        value: 'asc',
                      },
                    ],
                  },
                ],
                required: false,
                type: 'select',
              },
              {
                id: 'id_textarea',
                label: 'Text Area',
                name: 'id_textarea',
                required: false,
                type: 'textarea',
              },
              {
                id: 'id_input',
                label: 'Input',
                name: 'id_input',
                required: false,
                type: 'text',
                validWhen: {
                  matchesRegEx: {
                    message: 'Must be a number.',
                    pattern: '^[\\d]+$',
                  },
                },
                defaultValue: 121,
              },
              {
                id: 'id_some/thing',
                name: 'id_some/thing',
                required: false,
                type: 'text',
                defaultValue: 'something else',
              },
            ],
          },
        ],
        fieldDetailsMap: {
          id_checkbox: {
            id: 'id_checkbox',
            inputType: 'checkbox',
          },
          id_multiselect: {
            id: 'id_multiselect',
            inputType: 'multiselect',
            type: 'repeat',
            indexed: true,
          },
          id_select: {
            id: 'id_select',
            inputType: 'select',
          },
          id_text: {
            id: 'id_text',
            inputType: 'text',
          },
          id_textarea: {
            id: 'id_textarea',
            inputType: 'textarea',
            type: 'something',
          },
          id_input: {
            id: 'id_input',
            inputType: 'text',
            type: 'integer',
          },
          'id_some/thing': {
            id: 'id_some.thing',
            inputType: 'text',
          },
        },
      },
      {
        paramMeta: {
          paramLocation: PARAMETER_LOCATION.QUERY,
          fields: [
            { id: 'id_readOnly1', readOnly: true, name: 'ReadOnly 1' },
            {
              id: 'id_checkbox',
              fieldType: 'checkbox',
              name: 'Checkbox',
              description: 'some help text',
            },
            {
              id: 'id_multiselect',
              fieldType: 'multiselect',
              name: 'MultiSelect',
              type: 'repeat',
              indexed: true,
              required: true,
              options: [
                'active',
                'closed',
                'subscriber',
                'non_subscriber',
                'past_due',
              ],
            },
            {
              id: 'id_select',
              fieldType: 'select',
              name: 'Select',
              options: ['desc', 'asc'],
            },
            {
              id: 'id_text',
              fieldType: 'text',
              required: true,
              name: 'Text',
              placeholder: 'some placeholder',
            },
            { id: 'id_readOnly2', readOnly: true, name: 'ReadOnly 2' },
            {
              id: 'id_textarea',
              fieldType: 'textarea',
              name: 'Text Area',
              type: 'something',
            },
            {
              id: 'id_input',
              fieldType: 'integer',
              name: 'Input',
              defaultValue: 121,
            },
            { id: 'id_some.thing', fieldType: 'something' },
          ],
          defaultValuesForDeltaExport: {
            'id_some.thing': 'something else',
          },
        },
        value: {
          'id_multiselect.1': 'one',
          'id_multiselect.2': 'two',
          'id_multiselect.something': 'ten',
        },
      },
    ],
  ];

  each(testCases).test(
    'should return %o when passed  %o ',
    (expected, input) => {
      expect(convertToReactFormFields(input)).toEqual(expected);
    }
  );
});

describe('updateFormValues', () => {
  const testCases = [
    [
      {
        'some.thing': 'some value',
        repeat: [1, 3, 6],
        'repeat_indexed.1': 2,
        'repeat_indexed.2': 4,
        'repeat_indexed.3': 6,
        csv_array: 'a,b,c',
        csv_string: 'test',
        array_string: ['x', 'y', 'z'],
        array_array: ['d', 1],
        integer_string: 234,
        integer_number: 100,
        integer_float: 2,
        boolean: false,
      },
      {
        formValues: {
          'some/thing': 'some value',
          repeat: [1, 3, 6],
          repeat_indexed: [2, 4, 6],
          csv_array: ['a', 'b', 'c'],
          csv_string: 'test',
          array_string: 'x,y,z',
          array_array: ['d', 1],
          integer_string: '234',
          integer_number: 100,
          integer_string_invalid: 'something',
          integer_float: '2.34',
          boolean: false,
        },
        fieldDetailsMap: {
          'some/thing': { id: 'some.thing' },
          repeat: { id: 'repeat', type: 'repeat' },
          repeat_indexed: {
            id: 'repeat_indexed',
            type: 'repeat',
            indexed: true,
          },
          csv_array: { id: 'csv_array', type: 'csv' },
          csv_string: { id: 'csv_string', type: 'csv' },
          array_string: { id: 'array_string', type: 'array' },
          array_array: { id: 'array_array', type: 'array' },
          integer_string: { id: 'integer_string', type: 'integer' },
          integer_string_invalid: {
            id: 'integer_string_invalid',
            type: 'integer',
          },
          integer_number: { id: 'integer_number', type: 'integer' },
          integer_float: { id: 'integer_float', type: 'integer' },
          boolean: { id: 'boolean' },
        },
        paramLocation: PARAMETER_LOCATION.QUERY,
      },
    ],
    [
      {
        some: { thing: { else: 'some value', else2: 'some other value' } },
        xyz: 'abc',
      },
      {
        formValues: {
          'some/thing/else': 'some value',
          'some/thing/else2': 'some other value',
          xyz: 'abc',
        },
        fieldDetailsMap: {
          'some/thing/else': { id: 'some.thing.else' },
          'some/thing/else2': { id: 'some.thing.else2' },
          xyz: { id: 'xyz' },
        },
        paramLocation: PARAMETER_LOCATION.BODY,
      },
    ],
  ];

  each(testCases).test(
    'should return %o when passed  %o ',
    (expected, input) => {
      expect(updateFormValues(input)).toEqual(expected);
    }
  );
});
