/* global describe,  expect */
import each from 'jest-each';
import {
  getMatchingRoute,
  mergeHeaders,
  mergeQueryParameters,
  getExportVersionAndResource,
  getVersionDetails,
  getResourceDetails,
  getExportOperationDetails,
  getParamValue,
  generateValidReactFormFieldId,
  convertToReactFormFields,
  updateFormValues,
  convertToExport,
  PARAMETER_LOCATION,
  DEFAULT_PROPS,
  routeToRegExp,
  extractParameters,
  convertFromExport,
  convertFromImport,
  convertToImport,
} from '.';

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
    [{}, undefined, null],
    [{}, null, null],
    [{}, {}, {}],
    [{ a: 'b', c: 'd', e: 'f' }, { a: 'b', c: 'd' }, { e: 'f' }],
    [{ a: 'x', c: 'd', e: 'f' }, { a: 'b', c: 'd' }, { e: 'f', a: 'x' }],
    [{ e: 'f' }, [{ a: 'b', c: 'd' }, {g: 'h'}], { e: 'f' }],
    [{ }, [{ a: 'b', c: 'd' }, {a: 'b', g: 'h'}], [{ e: 'f' }, {i: 'k'}]],
    [{ a: 'b', c: 'd' }, { a: 'b', c: 'd' }, [{ e: 'f' }, {i: 'k'}]],

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
    [[], undefined, null],
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
    [{ version: 'v1', resource: 'r11', operation: 'ep1' }, 'v1', 'ep1', someAssistantData],
    [{ version: 'v2', resource: 'r21', operation: 'ep1' }, undefined, 'ep1', someAssistantData],
    [{}, 'someVersion', 'ep1', someAssistantData],
    [
      { version: 'v1', resource: 'r11' },
      'v1',
      'something/:_someId',
      someAssistantData,
    ],
    [
      { version: 'v1', resource: 'r12', operation: 'r12_ep1' },
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
      { version: 'v2', resource: 'r22', operation: 'r22_ep1' },
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

describe('getResourceDetails', () => {
  const testCases = [
    [{}, undefined, undefined, undefined],
    [
      { id: 'r1' },
      undefined,
      'r1',
      { versions: [{ version: 'v1', resources: [{ id: 'r1' }] }] },
    ],
    [
      { id: 'r2', some: 'thing' },
      'v2',
      'r2',
      {
        versions: [
          { version: 'v1', resources: [{ id: 'r1' }, { id: 'r2' }] },
          {
            version: 'v2',
            resources: [{ id: 'r1' }, { id: 'r2', some: 'thing' }],
          },
        ],
      },
    ],
    [
      { id: 'r2', some: 'thing', paging: { some: 'thing', someThing: 'else' } },
      'v2',
      'r2',
      {
        paging: { some: 'thing', someThing: 'else' },
        versions: [
          { version: 'v1', resources: [{ id: 'r1' }, { id: 'r2' }] },
          {
            version: 'v2',
            resources: [{ id: 'r1' }, { id: 'r2', some: 'thing' }],
          },
        ],
      },
    ],
    [
      { id: 'r2', some: 'thing', paging: { abc: 'def', ghi: 'jkl' } },
      'v2',
      'r2',
      {
        paging: { some: 'thing', someThing: 'else' },
        versions: [
          { version: 'v1', resources: [{ id: 'r1' }, { id: 'r2' }] },
          {
            version: 'v2',
            paging: { abc: 'def', ghi: 'jkl' },
            resources: [{ id: 'r1' }, { id: 'r2', some: 'thing' }],
          },
        ],
      },
    ],
    [
      {
        id: 'r2',
        some: 'thing',
        doesNotSupportPaging: true,
        paging: { abc: 'def', ghi: 'jkl' },
      },
      'v2',
      'r2',
      {
        paging: { some: 'thing', someThing: 'else' },
        versions: [
          { version: 'v1', resources: [{ id: 'r1' }, { id: 'r2' }] },
          {
            version: 'v2',
            paging: { abc: 'def', ghi: 'jkl' },
            resources: [
              { id: 'r1' },
              { id: 'r2', some: 'thing', doesNotSupportPaging: true },
            ],
          },
        ],
      },
    ],
    [
      { id: 'r2', some: 'thing', paging: { xyz: 'abc' } },
      'v2',
      'r2',
      {
        paging: { some: 'thing', someThing: 'else' },
        versions: [
          { version: 'v1', resources: [{ id: 'r1' }, { id: 'r2' }] },
          {
            version: 'v2',
            paging: { abc: 'def', ghi: 'jkl' },
            resources: [
              { id: 'r1' },
              { id: 'r2', some: 'thing', paging: { xyz: 'abc' } },
            ],
          },
        ],
      },
    ],
    [
      {
        id: 'r1',
        something: 'else',
        headers: {
          h1: 'v1',
          h2: 'v2_version',
          h3: 'h3_resource',
          h4: 'something',
        },
        queryParameters: [
          {
            id: 'qp3',
            somethingElse: 'resource',
          },
          {
            id: 'qp4',
          },
          {
            id: 'qp2',
            something: 'version',
          },
          {
            id: 'qp1',
          },
        ],
      },
      undefined,
      'r1',
      {
        headers: { h1: 'v1', h2: 'v2', h3: 'v3' },
        queryParameters: [
          {
            id: 'qp1',
          },
          {
            id: 'qp2',
          },
          {
            id: 'qp3',
          },
        ],
        versions: [
          {
            version: 'v1',
            headers: { h2: 'v2_version', h3: 'v3_version' },
            queryParameters: [
              {
                id: 'qp2',
                something: 'version',
              },
              {
                id: 'qp3',
                something: 'version',
              },
            ],
            resources: [
              {
                id: 'r1',
                something: 'else',
                headers: { h3: 'h3_resource', h4: 'something' },
                queryParameters: [
                  {
                    id: 'qp3',
                    somethingElse: 'resource',
                  },
                  {
                    id: 'qp4',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  ];

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

describe('getExportOperationDetails', () => {
  const testCases = [
    [
      { headers: {}, pathParameters: [], queryParameters: [] },
      undefined,
      undefined,
      undefined,
      undefined,
    ],
    [
      {
        headers: {},
        pathParameters: [],
        queryParameters: [],
        id: 'op2',
        something: 'r2',
      },
      'v2',
      'r2',
      'op2',
      {
        export: {
          versions: [
            { version: 'v1' },
            {
              version: 'v2',
              resources: [
                {
                  id: 'r1',
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r1',
                    },
                    {
                      id: 'op2',
                      something: 'r1',
                    },
                  ],
                },
                {
                  id: 'r2',
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r2',
                    },
                    {
                      id: 'op2',
                      something: 'r2',
                    },
                  ],
                },
                {
                  id: 'r3',
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r3',
                    },
                    {
                      id: 'op2',
                      something: 'r3',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
    [
      {
        headers: {},
        pathParameters: [],
        queryParameters: [],
        id: 'op2',
        something: 'r2',
        doesNotSupportPaging: true,
      },
      'v2',
      'r2',
      'op2',
      {
        export: {
          versions: [
            { version: 'v1' },
            {
              version: 'v2',
              resources: [
                {
                  id: 'r1',
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r1',
                    },
                    {
                      id: 'op2',
                      something: 'r1',
                    },
                  ],
                },
                {
                  id: 'r2',
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r2',
                    },
                    {
                      id: 'op2',
                      something: 'r2',
                      doesNotSupportPaging: true,
                    },
                  ],
                },
                {
                  id: 'r3',
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r3',
                    },
                    {
                      id: 'op2',
                      something: 'r3',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
    [
      {
        headers: {},
        pathParameters: [],
        queryParameters: [],
        id: 'op2',
        something: 'r2',
        doesNotSupportPaging: true,
      },
      'v2',
      'r2',
      'op2',
      {
        export: {
          versions: [
            {
              version: 'v2',
              resources: [
                {
                  id: 'r2',
                  delta: { some: 'thing' },
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r2',
                    },
                    {
                      id: 'op2',
                      something: 'r2',
                      doesNotSupportPaging: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
    [
      {
        headers: {},
        pathParameters: [],
        queryParameters: [],
        id: 'op2',
        something: 'r2',
      },
      'v2',
      'r2',
      'op2',
      {
        export: {
          versions: [
            {
              version: 'v2',
              resources: [
                {
                  id: 'r2',
                  delta: { some: 'thing' },
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r2',
                    },
                    {
                      id: 'op2',
                      something: 'r2',
                      delta: { some: 'thing' },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
    [
      {
        id: 'op1',
        some: 'r1',
        allowUndefinedResource: true,
        headers: { h1: 'v1', h2: 'v2' },
        paging: { abc: 'def' },
        queryParameters: [{ id: 'qp1' }, { id: 'qp2' }],
        successMediaType: 'something',
        successPath: 'something else',
        pathParameters: [{ id: 'pp1' }],
      },
      'v1',
      'r1',
      'op1',
      {
        export: {
          versions: [
            {
              version: 'v1',
              resources: [
                {
                  id: 'r1',
                  allowUndefinedResource: true,
                  delta: { some: 'thing' },
                  headers: { h1: 'v1', h2: 'v2' },
                  paging: { abc: 'def' },
                  queryParameters: [{ id: 'qp1' }, { id: 'qp2' }],
                  successMediaType: 'something',
                  successPath: 'something else',
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r1',
                      pathParameters: [{ id: 'pp1' }],
                    },
                    {
                      id: 'op2',
                      something: 'r1',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
    [
      {
        id: 'op1',
        some: 'r1',
        allowUndefinedResource: false,
        headers: { h1: 'v1', h2: 'v22', h3: 'v3' },
        paging: { abc: 'def' },
        queryParameters: [{ id: 'qp1' }, { id: 'qp2' }],
        successMediaType: 'something',
        successPath: 'something',
        pathParameters: [{ id: 'pp1' }],
        supportedExportTypes: ['delta', 'test'],
        delta: { something: 'else' },
      },
      'v1',
      'r1',
      'op1',
      {
        export: {
          versions: [
            {
              version: 'v1',
              resources: [
                {
                  id: 'r1',
                  allowUndefinedResource: true,
                  delta: { some: 'thing' },
                  headers: { h1: 'v1', h2: 'v2' },
                  paging: { abc: 'def' },
                  queryParameters: [{ id: 'qp1' }, { id: 'qp2' }],
                  successMediaType: 'something',
                  successPath: 'something else',
                  endpoints: [
                    {
                      id: 'op1',
                      some: 'r1',
                      pathParameters: [{ id: 'pp1' }],
                      allowUndefinedResource: false,
                      delta: { something: 'else' },
                      supportedExportTypes: ['delta', 'test'],
                      headers: { h2: 'v22', h3: 'v3' },
                      successPath: 'something',
                    },
                    {
                      id: 'op2',
                      something: 'r1',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  ];

  each(testCases).test(
    'should return %o when version = %s, resource = %s, operation = %s and assistantData = %o',
    (expected, version, resource, operation, assistantData) => {
      expect(
        getExportOperationDetails({
          version,
          resource,
          operation,
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
        fieldDetailsMap: {},
        fieldMap: {},
        layout: { fields: [] },
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
        fieldMap: {
          f1: {
            id: 'f1',
            name: 'f1',
            type: 'textwithflowsuggestion',
            showLookup: false,
            required: true,
            readOnly: false,
            defaultValue: '',
          },
        },
        layout: {
          fields: ['f1'],
        },
        fieldDetailsMap: {
          f1: {
            id: 'f1',
            inputType: 'textwithflowsuggestion',
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
        fieldMap: {
          f1: {
            id: 'f1',
            name: 'f1',
            type: 'textwithflowsuggestion',
            showLookup: false,
            required: false,
            readOnly: false,
            defaultValue: 'abc',
          },
        },
        layout: {
          fields: ['f1'],
        },
        fieldDetailsMap: {
          f1: {
            id: 'f1',
            inputType: 'textwithflowsuggestion',
          },
        },
      },
      {
        paramMeta: { fields: [{ id: 'f1', defaultValue: 'abc' }] },
      },
    ],
    [
      {
        fieldMap: {
          f2: {
            id: 'f2',
            name: 'f2',
            type: 'textwithflowsuggestion',
            showLookup: false,
            required: true,
            readOnly: false,
            defaultValue: '',
          },
          f1: {
            id: 'f1',
            name: 'f1',
            type: 'textwithflowsuggestion',
            showLookup: false,
            required: false,
            readOnly: false,
            defaultValue: '',
          },
        },
        layout: {
          fields: ['f2'],
          type: 'collapse',
          containers: [
            {
              label: 'Optional',
              collapsed: true,
              fields: ['f1'],
            },
          ],
        },
        fieldDetailsMap: {
          f1: {
            id: 'f1',
            inputType: 'textwithflowsuggestion',
          },
          f2: {
            id: 'f2',
            inputType: 'textwithflowsuggestion',
          },
        },
      },
      {
        paramMeta: { fields: [{ id: 'f1' }, { id: 'f2', required: true }] },
      },
    ],
    [
      {
        fieldMap: {
          id_readOnly1: {
            id: 'id_readOnly1',
            name: 'id_readOnly1',
            readOnly: true,
            defaultDisabled: true,
            required: false,
            label: 'ReadOnly 1',
            type: 'textwithflowsuggestion',
            showLookup: false,
          },
          id_multiselect: {
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
            readOnly: false,
            type: 'multiselect',
            defaultValue: ['one', 'two'],
          },
          id_text: {
            id: 'id_text',
            label: 'Text',
            name: 'id_text',
            placeholder: 'some placeholder',
            required: true,
            readOnly: false,
            type: 'textwithflowsuggestion',
            showLookup: false,
            defaultValue: '',
          },
          id_readOnly2: {
            id: 'id_readOnly2',
            name: 'id_readOnly2',
            readOnly: true,
            defaultDisabled: true,
            required: false,
            label: 'ReadOnly 2',
            type: 'textwithflowsuggestion',
            showLookup: false,
          },
          id_checkbox: {
            id: 'id_checkbox',
            label: 'Checkbox',
            name: 'id_checkbox',
            required: false,
            readOnly: false,
            type: 'checkbox',
            helpText: 'some help text',
            defaultValue: '',
          },
          id_select: {
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
            readOnly: false,
            type: 'select',
            defaultValue: '',
          },
          id_textarea: {
            id: 'id_textarea',
            label: 'Text Area',
            name: 'id_textarea',
            required: false,
            readOnly: false,
            type: 'textarea',
            defaultValue: '',
          },
          id_input: {
            id: 'id_input',
            label: 'Input',
            name: 'id_input',
            required: false,
            readOnly: false,
            type: 'text',
            validWhen: {
              matchesRegEx: {
                message: 'Must be a number.',
                pattern: '^[\\d]+$',
              },
            },
            defaultValue: '',
          },
          'id_some/thing': {
            id: 'id_some/thing',
            name: 'id_some/thing',
            required: false,
            readOnly: false,
            type: 'textwithflowsuggestion',
            showLookup: false,
            defaultValue: '',
          },
        },
        layout: {
          fields: ['id_multiselect', 'id_text'],
          type: 'collapse',
          containers: [
            {
              label: 'Optional',
              collapsed: true,
              fields: [
                'id_readOnly1',
                'id_checkbox',
                'id_select',
                'id_readOnly2',
                'id_textarea',
                'id_input',
                'id_some/thing',
              ],
            },
          ],
        },
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
          id_readOnly1: {
            id: 'id_readOnly1',
            inputType: 'textwithflowsuggestion',
          },
          id_readOnly2: {
            id: 'id_readOnly2',
            inputType: 'textwithflowsuggestion',
          },
          id_select: {
            id: 'id_select',
            inputType: 'select',
          },
          id_text: {
            id: 'id_text',
            inputType: 'textwithflowsuggestion',
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
            inputType: 'textwithflowsuggestion',
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
              fieldType: 'textwithflowsuggestion',
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
    [
      {
        fieldMap: {
          id_readOnly1: {
            id: 'id_readOnly1',
            name: 'id_readOnly1',
            readOnly: true,
            defaultDisabled: true,
            required: false,
            label: 'ReadOnly 1',
            type: 'textwithflowsuggestion',
            showLookup: false,
          },
          id_multiselect: {
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
            readOnly: false,
            type: 'multiselect',
            defaultValue: [],
          },
          id_text: {
            id: 'id_text',
            label: 'Text',
            name: 'id_text',
            placeholder: 'some placeholder',
            required: true,
            readOnly: false,
            type: 'textwithflowsuggestion',
            showLookup: false,
            defaultValue: '',
          },
          id_readOnly2: {
            id: 'id_readOnly2',
            name: 'id_readOnly2',
            readOnly: true,
            defaultDisabled: true,
            required: false,
            label: 'ReadOnly 2',
            type: 'textwithflowsuggestion',
            showLookup: false,
          },
          id_checkbox: {
            id: 'id_checkbox',
            label: 'Checkbox',
            name: 'id_checkbox',
            required: false,
            readOnly: false,
            type: 'checkbox',
            helpText: 'some help text',
            defaultValue: '',
          },
          id_select: {
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
            readOnly: false,
            type: 'select',
            defaultValue: '',
          },
          id_textarea: {
            id: 'id_textarea',
            label: 'Text Area',
            name: 'id_textarea',
            required: false,
            readOnly: false,
            type: 'textarea',
            defaultValue: '',
          },
          id_input: {
            id: 'id_input',
            label: 'Input',
            name: 'id_input',
            required: false,
            readOnly: false,
            type: 'text',
            validWhen: {
              matchesRegEx: {
                message: 'Must be a number.',
                pattern: '^[\\d]+$',
              },
            },
            defaultValue: 121,
          },
          id_input2: {
            id: 'id_input2',
            label: 'Input2',
            name: 'id_input2',
            required: false,
            readOnly: false,
            type: 'textwithflowsuggestion',
            defaultValue: '123',
            showLookup: false,
          },
          'id_some/thing': {
            id: 'id_some/thing',
            name: 'id_some/thing',
            required: false,
            readOnly: false,
            type: 'textwithflowsuggestion',
            showLookup: false,
            defaultValue: 'something else',
          },
        },
        layout: {
          fields: ['id_multiselect', 'id_text'],
          type: 'collapse',
          containers: [
            {
              label: 'Optional',
              collapsed: true,
              fields: [
                'id_readOnly1',
                'id_checkbox',
                'id_select',
                'id_readOnly2',
                'id_textarea',
                'id_input',
                'id_input2',
                'id_some/thing',
              ],
            },
          ],
        },
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
          id_readOnly1: {
            id: 'id_readOnly1',
            inputType: 'textwithflowsuggestion',
          },
          id_readOnly2: {
            id: 'id_readOnly2',
            inputType: 'textwithflowsuggestion',
          },
          id_select: {
            id: 'id_select',
            inputType: 'select',
          },
          id_text: {
            id: 'id_text',
            inputType: 'textwithflowsuggestion',
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
          id_input2: {
            id: 'id_input2',
            inputType: 'textwithflowsuggestion',
          },
          'id_some/thing': {
            id: 'id_some.thing',
            inputType: 'textwithflowsuggestion',
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
              fieldType: 'textwithflowsuggestion',
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
            {
              id: 'id_input2',
              name: 'Input2',
              defaultValue: 123,
            },
            { id: 'id_some.thing', fieldType: 'something' },
          ],
          defaultValuesForDeltaExport: {
            'id_some.thing': 'something else',
          },
        },
        value: {},
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

const httpRecurlyData = {
  export: {
    labels: {
      version: 'API Version',
      resource: 'Resource',
      endpoint: 'Operation',
    },
    urlResolution: [
      'v2/accounts',
      'v2/accounts/:_account_code',
      'v2/accounts/:_account_code/balance',
      'v2/accounts/:_account_code/notes',
      'v2/accounts/:_account_code/adjustments',
    ],
    versions: [
      {
        version: 'v2.13',
        headers: {
          'X-Api-Version': '2.13',
        },
        paging: {
          method: 'linkheader',
          linkHeaderRelation: 'next',
        },
        resources: [
          {
            id: 'account',
            name: 'Account',
            endpoints: [
              {
                url: 'v2/accounts',
                id: 'list_accounts',
                name: 'List Accounts',
                response: {
                  resourcePath: 'accounts/account',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                oneMandatoryQueryParamFrom: [
                  'o1',
                  'per_page',
                ],
                queryParameters: [
                  {
                    id: 'state.status',
                    name: 'state.status',
                    description: 'The state of accounts to return.',
                    fieldType: 'multiselect',
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
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    required: false,
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'multiselect',
                    type: 'repeat',
                    indexed: true,
                    required: false,
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'per_page',
                    name: 'per_page',
                    description: 'Number of records to return per page, up to a maximum of 200.',
                    fieldType: 'input',
                    type: 'repeat',
                    indexed: true,
                    required: false,
                  },
                  {
                    id: 'r1',
                    name: 'R1',
                    description: 'Number of records to return per page, up to a maximum of 200.',
                    fieldType: 'input',
                    required: false,
                  },
                  {
                    id: 'r2',
                    name: 'R2',
                    description: 'Number of records to return per page, up to a maximum of 200.',
                    fieldType: 'input',
                    required: false,
                  },
                  {
                    id: 'o1',
                    name: 'O1',
                    description: 'Number of records to return per page, up to a maximum of 200.',
                    fieldType: 'input',
                    required: false,
                  },
                  {
                    id: 'o2',
                    name: 'O2',
                    description: 'Number of records to return per page, up to a maximum of 200.',
                    fieldType: 'input',
                    required: false,
                  },
                ],
              },
              {
                url: 'v2/accounts/:_account_code',
                name: 'Lookup Account',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    fieldType: 'string',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'account',
                },
                id: 'lookup_account',
              },
              {
                url: 'v2/accounts/:_account_code/balance',
                name: 'Lookup Account Balance',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    fieldType: 'string',
                    required: true,
                  },
                ],
                id: 'lookup_account_balance',
              },
              {
                url: 'v2/accounts/:_account_code/notes',
                id: 'list_account_notes',
                name: 'List Account Notes',
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    fieldType: 'string',
                    required: true,
                  },
                ],
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'per_page',
                    name: 'per_page',
                    description: 'Number of records to return per page, up to a maximum of 200.',
                    fieldType: 'integer',
                  },
                ],
              },
            ],
          },
          {
            id: 'adjustments',
            name: 'Adjustments',
            endpoints: [
              {
                url: 'v2/accounts/:_account_code/adjustments',
                name: "List Account's Adjustments",
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    fieldType: 'string',
                    required: true,
                  },
                ],
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'per_page',
                    name: 'per_page',
                    description: 'Number of records to return per page, up to a maximum of 200.',
                    fieldType: 'integer',
                  },
                ],
                id: "list_account's_adjustments",
              },
            ],
          },
        ],
      },
      {
        version: 'v2.18',
        headers: {
          'X-Api-Version': '2.18',
        },
        paging: {
          method: 'linkheader',
          linkHeaderRelation: 'next',
        },
        resources: [
          {
            id: 'account',
            name: 'ACCOUNTS',
            endpoints: [
              {
                url: 'v2/accounts',
                id: 'list_accounts',
                name: 'List Accounts',
                response: {
                  resourcePath: 'accounts/account',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of accounts to return.',
                    fieldType: 'select',
                    options: [
                      'active',
                      'closed',
                      'subscriber',
                      'non_subscriber',
                      'past_due',
                    ],
                  },
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/accounts/:_account_code',
                name: 'Lookup Account',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'account',
                },
                id: 'lookup_account',
              },
              {
                url: 'v2/accounts/:_account_code/balance',
                name: 'Lookup Account Balance',
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'account_balance',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                id: 'lookup_account_balance',
              },
              {
                url: 'v2/accounts/:_account_code/notes',
                id: 'list_account_notes',
                name: 'List Account Notes',
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'notes/note',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'string',
                    required: true,
                  },
                ],
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
            ],
          },
          {
            id: 'invoices',
            name: 'INVOICES',
            endpoints: [
              {
                url: 'v2/invoices',
                id: 'list_invoices',
                name: 'List Invoices',
                response: {
                  resourcePath: 'invoices/invoice',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of accounts to return.',
                    fieldType: 'select',
                    options: [
                      'active',
                      'closed',
                      'subscriber',
                      'non_subscriber',
                      'past_due',
                    ],
                  },
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/accounts/:_account_code/invoices',
                id: 'list_accounts',
                name: "List Account's Invoices",
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'invoices/invoice',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                queryParameters: [
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of accounts to return.',
                    fieldType: 'select',
                    options: [
                      'active',
                      'closed',
                      'subscriber',
                      'non_subscriber',
                      'past_due',
                    ],
                  },
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/invoices/:_invoice_number',
                name: 'Lookup Invoice',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    description: 'Invoice number',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'invoice',
                },
                id: 'lookup_invoice',
              },
            ],
          },
          {
            id: 'transactions',
            name: 'TRANSACTIONS',
            endpoints: [
              {
                url: 'v2/transactions',
                id: 'list_invoices',
                name: 'List Transactions',
                response: {
                  resourcePath: 'transactions/transaction',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
                },
                queryParameters: [
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of accounts to return.',
                    fieldType: 'select',
                    options: [
                      'active',
                      'closed',
                      'subscriber',
                      'non_subscriber',
                      'past_due',
                    ],
                  },
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'type',
                    name: 'type',
                    description: 'The type of transactions to return: authorization, refund, or purchase.',
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/accounts/:_account_code/transactions',
                id: 'list_accounts',
                doesNotSupportPaging: true,
                name: "List Account's Transactions",
                response: {
                  resourcePath: 'transactions/transaction',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                queryParameters: [
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of accounts to return.',
                    fieldType: 'select',
                    options: [
                      'active',
                      'closed',
                      'subscriber',
                      'non_subscriber',
                      'past_due',
                    ],
                  },
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'type',
                    name: 'type',
                    description: 'The type of transactions to return: authorization, refund, or purchase.',
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/transactions/:_uuid',
                name: 'Lookup Transaction',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    description: "Transaction's unique identifier.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'transaction',
                },
                id: 'lookup_transaction',
              },
            ],
          },
          {
            id: 'credit_payments',
            name: 'CREDIT PAYMENTS',
            endpoints: [
              {
                url: 'v2/credit_payments',
                id: 'list_invoices',
                name: 'List Credit Payments',
                response: {
                  resourcePath: 'credit_payments/credit_payment',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/accounts/:_account_code/credit_payments',
                id: 'list_accounts',
                name: 'List Credit Payments on Account',
                response: {
                  resourcePath: 'credit_payments/credit_payment',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/credit_payments/:_uuid',
                name: 'Lookup Credit Payment',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    description: 'The uuid for the credit payment.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'credit_payment',
                },
                id: 'lookup_credit_payment',
              },
            ],
          },
          {
            id: 'subscriptions',
            name: 'SUBSCRIPTIONS',
            endpoints: [
              {
                url: 'v2/subscriptions',
                id: 'list_invoices',
                name: 'List Subscriptions',
                response: {
                  resourcePath: 'subscriptions/subscription',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of accounts to return.',
                    fieldType: 'select',
                    options: [
                      'active',
                      'closed',
                      'subscriber',
                      'non_subscriber',
                      'past_due',
                    ],
                  },
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/accounts/:_account_code/subscriptions',
                id: 'list_accounts',
                name: "List Account's Subscriptions",
                response: {
                  resourcePath: 'subscriptions/subscription',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                queryParameters: [
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of accounts to return.',
                    fieldType: 'select',
                    options: [
                      'active',
                      'closed',
                      'subscriber',
                      'non_subscriber',
                      'past_due',
                    ],
                  },
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/subscriptions/:_uuid',
                name: 'Lookup Subscription',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    description: "Subscription's unique identifier.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'subscription',
                },
                id: 'lookup_subscription',
              },
            ],
          },
          {
            id: 'subscription_uuid',
            name: 'SUBSCRIPTION USAGE RECORDS',
            endpoints: [
              {
                url: 'v2/subscriptions/:_subscription_uuid/add_ons/:_add_on_code/usage',
                id: 'list_invoices',
                name: 'List Subscriptions',
                response: {
                  resourcePath: 'usages/usage',
                },
                pathParameters: [
                  {
                    id: 'subscription_uuid',
                    name: 'subscription_uuid',
                    description: "Subscription's unique identifier.",
                    fieldType: 'input',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    name: 'add_on_code',
                    description: 'The unique add-on code.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'billing_status',
                    name: 'billing_status',
                    description: 'all, unbilled, or billed. Defines whether or not to include usage records with a billed_at date.',
                    fieldType: 'input',
                  },
                  {
                    id: 'datetime_type',
                    name: 'datetime_type',
                    description: 'usage or recording. Whether you would like to filter on the usage_timestamp or the recording_timestamp.',
                  },
                  {
                    id: 'end_datetime',
                    name: 'end_datetime',
                    description: 'Show usage records less than this date.',
                    fieldType: 'input',
                  },
                  {
                    id: 'start_datetime',
                    name: 'start_datetime',
                    description: 'Show usage records greater than or equal to this date.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/subscriptions/:_subscription_uuid/add_ons/:_add_on_code/usage/:_usage_id',
                id: 'list_accounts',
                name: "List Account's Subscriptions",
                response: {
                  resourcePath: 'usage',
                },
                pathParameters: [
                  {
                    id: 'subscription_uuid',
                    name: 'subscription_uuid',
                    description: "Subscription's unique identifier.",
                    fieldType: 'input',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    name: 'add_on_code',
                    description: 'The unique add-on code.',
                    fieldType: 'input',
                    required: true,
                  },
                  {
                    id: 'usage_id',
                    name: 'usage_id',
                    description: 'Unique id for the usage record.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
              },
              {
                url: 'v2/subscriptions/:_uuid',
                name: 'Lookup Subscription',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    description: "Subscription's unique identifier.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'subscription',
                },
                id: 'lookup_subscription',
              },
            ],
          },
          {
            id: 'measured_units',
            name: 'MEASURED UNITS',
            endpoints: [
              {
                url: 'v2/measured_units',
                id: 'list_invoices',
                name: 'List Measured Units',
                response: {
                  resourcePath: 'measured_units/measured_unit',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
              },
              {
                url: 'v2/measured_units/:_measured_unit_id',
                name: 'Lookup Measured Unit',
                doesNotSupportPaging: true,
                pathParameters: [
                  {
                    id: 'measured_unit_id',
                    name: 'measured_unit_id',
                    description: 'Unique id of the measured unit on your site.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'measured_unit',
                },
                id: 'lookup_measured_unit',
              },
            ],
          },
          {
            id: 'export_dates',
            name: 'AUTOMATED EXPORTS',
            endpoints: [
              {
                url: 'v2/export_dates',
                id: 'list_invoices',
                name: 'List Export Dates',
                response: {
                  resourcePath: 'export_dates/export_date',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
              },
              {
                url: 'v2/export_dates/:_date/export_files',
                name: "List Date's Export Files",
                pathParameters: [
                  {
                    id: 'date',
                    name: 'date',
                    description: 'The date the export file was generated.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'export_files/export_file',
                },
                id: "list_date's_export_files",
              },
            ],
          },
          {
            id: 'coupons',
            name: 'COUPONS',
            endpoints: [
              {
                url: 'v2/coupons',
                id: 'list_coupons',
                name: 'List Coupons',
                response: {
                  resourcePath: 'coupons/coupon',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of accounts to return.',
                    fieldType: 'select',
                    options: [
                      'active',
                      'closed',
                      'subscriber',
                      'non_subscriber',
                      'past_due',
                    ],
                  },
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/coupons/:_coupon_code',
                name: 'Lookup Coupon',
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'coupon',
                },
                pathParameters: [
                  {
                    id: 'coupon_code',
                    name: 'coupon_code',
                    description: 'Unique code to identify and redeem the coupon.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                id: 'lookup_coupon',
              },
              {
                url: 'v2/coupons/:_coupon_code/unique_coupon_codes',
                name: 'List Unique Coupon Codes',
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'unique_coupon_codes/coupon',
                },
                pathParameters: [
                  {
                    id: 'coupon_code',
                    name: 'coupon_code',
                    description: 'Unique code to identify and redeem the coupon.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                id: 'list_unique_coupon_codes',
              },
            ],
          },
          {
            id: 'gift_cards',
            name: 'GIFT CARDS',
            endpoints: [
              {
                url: 'v2/gift_cards',
                id: 'list_gift_cards',
                name: 'List Gift Cards',
                response: {
                  resourcePath: 'gift_cards/gift_card',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'gifter_account_code',
                    name: 'gifter_account_code',
                    description: 'Filters the gift cards list to only those purchased by this account code.',
                    fieldType: 'input',
                  },
                  {
                    id: 'recipient_account_code',
                    name: 'recipient_account_code',
                    description: 'Filters the gift cards list to only those redeemed by this account code.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/gift_cards/:_id',
                name: 'Lookup Gift Card',
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'gift_card',
                },
                pathParameters: [
                  {
                    id: 'id',
                    name: 'Id',
                    description: 'The id of the gift card you want to look up.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                id: 'lookup_gift_card',
              },
            ],
          },
          {
            id: 'coupons_redemption',
            name: 'COUPON REDEMPTIONS',
            endpoints: [
              {
                url: 'v2/accounts/:_account_code/redemptions',
                id: 'list_coupons',
                name: "List Account's Coupon Redemptions",
                response: {
                  resourcePath: 'redemptions/redemption',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    description: 'The code of the account you want to look up.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/invoices/:_invoice_number/redemptions',
                name: "List Invoice's Coupon Redemptions",
                pathParameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    description: 'Invoice number',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                id: "list_invoice's_coupon_redemptions",
              },
              {
                url: 'v2/subscriptions/:_uuid/redemptions',
                name: "List Subscription's Coupon Redemption",
                pathParameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    description: "Subscription's unique identifier.",
                    fieldType: 'input',
                    required: true,
                  },
                ],
                id: "list_subscription's_coupon_redemption",
              },
            ],
          },
          {
            id: 'plans',
            name: 'PLANS',
            endpoints: [
              {
                url: 'v2/plans',
                id: 'list_coupons',
                name: 'List Plans',
                response: {
                  resourcePath: 'plans/plan',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: 'v2/plans/:_plan_code',
                name: 'Lookup Plan',
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'plan',
                },
                pathParameters: [
                  {
                    id: 'plan_code',
                    name: 'plan_code',
                    description: 'Unique code to identify the plan.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                id: 'lookup_plan',
              },
            ],
          },
          {
            id: 'plans_addon',
            name: 'PLAN ADD-ONS',
            endpoints: [
              {
                url: 'v2/plans/:_plan_code/add_ons',
                name: "List Plan's Add-Ons",
                pathParameters: [
                  {
                    id: 'plan_code',
                    name: 'plan_code',
                    description: 'Unique code to identify the plan.',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                response: {
                  resourcePath: 'add_ons/add_on',
                },
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ssZ',
                },
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
                id: "list_plan's_add-ons",
              },
              {
                url: 'v2/plans/:_plan_code/add_ons/:_add_on_code',
                name: 'Lookup Plan Add-On',
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'add_on',
                },
                pathParameters: [
                  {
                    id: 'plan_code',
                    name: 'plan_code',
                    description: 'Unique code to identify the plan.',
                    fieldType: 'input',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    name: 'add_on_code',
                    description: 'The unique add-on code',
                    fieldType: 'input',
                    required: true,
                  },
                ],
                id: 'lookup_plan_add-on',
              },
            ],
          },
          {
            id: 'billing_info',
            name: 'BILLING INFO',
            endpoints: [
              {
                url: 'v2/accounts/:_account_code/billing_info',
                name: "Lookup Account's Billing Info",
                response: {
                  resourcePath: 'billing_info',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'string',
                    required: true,
                  },
                ],
                id: "lookup_account's_billing_info",
              },
            ],
          },
          {
            id: 'shipping_address',
            name: 'SHIPPING ADDRESSES',
            endpoints: [
              {
                url: 'v2/accounts/:_account_code/shipping_addresses',
                name: "List Account's Shipping Address",
                response: {
                  resourcePath: 'shipping_addresses/shipping_address',
                },
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                ],
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'string',
                    required: true,
                  },
                ],
                id: "list_account's_shipping_address",
              },
            ],
          },
          {
            id: 'account_acquisition',
            name: 'ACCOUNT ACQUISITION',
            endpoints: [
              {
                url: 'v2/accounts/:_account_code/acquisition',
                name: 'Lookup Account Acquisition',
                doesNotSupportPaging: true,
                response: {
                  resourcePath: 'account_acquisition',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'string',
                    required: true,
                  },
                ],
                id: 'lookup_account_acquisition',
              },
            ],
          },
          {
            id: 'adjustments',
            name: 'ADJUSTMENTS',
            endpoints: [
              {
                url: 'v2/accounts/:_account_code/adjustments',
                name: "List Account's Adjustments",
                response: {
                  resourcePath: 'adjustments/adjustment',
                },
                pathParameters: [
                  {
                    id: 'account_code',
                    name: 'account_code',
                    description: "Account's unique code.",
                    fieldType: 'string',
                    required: true,
                  },
                ],
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    begin_time: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
                },
                queryParameters: [
                  {
                    id: 'sort',
                    name: 'sort',
                    description: 'The attribute that will be used to order records.',
                    fieldType: 'select',
                    options: [
                      'created_at',
                      'updated_at',
                    ],
                  },
                  {
                    id: 'order',
                    name: 'order',
                    description: 'The order in which products will be returned.',
                    fieldType: 'select',
                    options: [
                      'desc',
                      'asc',
                    ],
                  },
                  {
                    id: 'begin_time',
                    name: 'begin_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes greater than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'end_time',
                    name: 'end_time',
                    description: 'Operates on the attribute specified by the sort parameter. Filters records to only include those with datetimes less than or equal to the supplied datetime. Accepts an ISO 8601 date or date and time.',
                    fieldType: 'input',
                  },
                  {
                    id: 'state',
                    name: 'state',
                    description: 'The state of the adjustment to filter by. Allowed Values: [invoice, pending]',
                    fieldType: 'select',
                    options: [
                      'invoice',
                      'pending',
                    ],
                  },
                  {
                    id: 'type',
                    name: 'type',
                    description: 'The type of adjustment to filter by. Allowed values: [charge, credit]',
                    fieldType: 'select',
                    options: [
                      'credit',
                      'charge',
                    ],
                  },
                ],
                id: "list_account's_adjustments",
              },
            ],
          },
        ],
      },
    ],
  },
  import: {
    labels: {
      version: 'API Version',
      resource: 'API Name',
      operation: 'Operation',
    },
    urlResolution: [
      'v2/accounts',
      'v2/accounts/:_account_code',
      'v2/accounts/:_account_code/reopen',
      'v2/accounts/:_account_code/shipping_addresses',
      'v2/accounts/:_account_code/shipping_addresses/:shipping_address',
      'v2/accounts/:_account_code/acquisition',
      'v2/accounts/:_account_code/adjustments',
      'v2/accounts/:_account_code/billing_info',
      'v2/coupons',
      'v2/coupons/:_coupon_code',
      'v2/gift_cards',
      'v2/subscriptions',
      'v2/accounts/:_account_code/invoices',
      'v2/invoices/:_invoice_number/refund',
      'v2/invoices/:_invoice_number/transactions',
      'v2/plans',
      'v2/plans/:_plan_code',
      'v2/plans/:_plan_code/add_ons',
      'v2/measured_units',
      'v2/measured_units/:_measured_unit_id',
      'v2/subscriptions',
      'v2/subscriptions/:_uuid',
      'v2/subscriptions/:_uuid/notes',
      'v2/transactions',
      'v2/purchases',
    ],
    versions: [
      {
        version: 'v2.13',
        headers: {
          'X-Api-Version': '2.13',
        },
        resources: [
          {
            id: 'accounts',
            name: 'Accounts',
            sampleData: {
              shipping_address: [
                {
                  address1: '123 Main St.',
                  address2: 'Suite 101',
                  city: 'San Francisco',
                  company: 'Recurly Inc',
                  country: 'US',
                  email: 'verena@example.com',
                  first_name: 'Verena',
                  last_name: 'Example',
                  nickname: 'Work',
                  phone: '555-222-1212',
                  state: 'CA',
                  zip: '94105',
                },
                {
                  address1: '123 Fourth St.',
                  address2: 'Apt. 101',
                  city: 'San Francisco',
                  country: 'US',
                  email: 'verena@example.com',
                  first_name: 'Verena',
                  last_name: 'Example',
                  nickname: 'Home',
                  phone: '555-867-5309',
                  state: 'CA',
                  zip: '94105',
                },
              ],
              address: {
                address1: '123 Main St.',
                address2: '123 Main St123',
                city: 'San Francisco',
                country: 'US',
                state: 'CA',
                zip: '94105',
                phone: 1234,
              },
              account_acquisition: {
                cost_in_cents: '123 Main St.',
                currency: '123 Main St123',
                channel: 'San Francisco',
                subchannel: 'US',
                campaign: 'CA',
              },
              account_code: '1',
              tax_exempt: true,
              vat_number: true,
              preferred_locale: 'ES',
              accept_language: 'EN',
              entity_use_code: 'test',
              cc_emails: 'bob@example.com,susan@example.com',
              company_name: 'Recurly Inc',
              email: 'verena@example.com',
              first_name: 'Verena',
              last_name: 'Example',
              username: 'verena1234',
            },
            operations: [
              {
                name: 'Create Account',
                url: 'v2/accounts',
                method: 'POST',
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    isIdentifier: true,
                  },
                ],
                howToFindIdentifier: {
                  lookup: {
                    id: 'list_accounts',
                    extract: 'accounts[0].id',
                  },
                },
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                ],
                id: 'create_account',
              },
              {
                name: 'Update Account',
                url: 'v2/accounts/:_account_code',
                method: 'PUT',
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_account',
              },
              {
                name: 'Create or Update',
                url: [
                  'v2/accounts/:_account_code',
                  'v2/accounts',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                ],
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'create_or_update',
              },
              {
                name: 'Delete',
                url: 'v2/accounts/:_account_code',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'delete',
              },
            ],
          },
          {
            id: 'coupons',
            name: 'Coupons',
            sampleData: '<coupon><coupon_code>subscription_special</coupon_code><name>Special 10% off</name><discount_type>percent</discount_type><discount_percent>10</discount_percent><redeem_by_date>2017-12-31</redeem_by_date><max_redemptions>200</max_redemptions><applies_to_all_plans>false</applies_to_all_plans><plan_codes><plan_code>gold</plan_code><plan_code>platinum</plan_code></plan_codes><redemption_resource>subscription</redemption_resource></coupon>',
            operations: [
              {
                name: 'Create',
                url: 'v2/coupons',
                method: 'POST',
                parameters: [
                  {
                    id: 'coupon_code',
                    name: 'Coupon Code',
                    isIdentifier: true,
                  },
                ],
                supportIgnoreExisting: true,
                id: 'create',
              },
              {
                name: 'Update',
                url: 'v2/coupons/:_coupon_code',
                method: 'PUT',
                parameters: [
                  {
                    id: 'coupon_code',
                    name: 'Coupon Code',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreMissing: true,
                id: 'update',
              },
              {
                name: 'Create or Update',
                url: [
                  'v2/coupons/:_coupon_code',
                  'v2/coupons',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                parameters: [
                  {
                    id: 'coupon_code',
                    name: 'Coupon Code',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'create_or_update',
              },
              {
                name: 'Delete',
                url: 'v2/coupons/:_coupon_code',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'coupon_code',
                    name: 'Coupon Code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'delete',
              },
            ],
          },
        ],
      },
      {
        version: 'v2.18',
        headers: {
          'X-Api-Version': '2.18',
        },
        resources: [
          {
            id: 'accounts',
            name: 'Accounts',
            sampleData: {
              shipping_address: [
                {
                  address1: '123 Main St.',
                  address2: 'Suite 101',
                  city: 'San Francisco',
                  company: 'Recurly Inc',
                  country: 'US',
                  email: 'verena@example.com',
                  first_name: 'Verena',
                  last_name: 'Example',
                  nickname: 'Work',
                  phone: '555-222-1212',
                  state: 'CA',
                  zip: '94105',
                },
                {
                  address1: '123 Fourth St.',
                  address2: 'Apt. 101',
                  city: 'San Francisco',
                  country: 'US',
                  email: 'verena@example.com',
                  first_name: 'Verena',
                  last_name: 'Example',
                  nickname: 'Home',
                  phone: '555-867-5309',
                  state: 'CA',
                  zip: '94105',
                },
              ],
              address: {
                address1: '123 Main St.',
                address2: '123 Main St123',
                city: 'San Francisco',
                country: 'US',
                state: 'CA',
                zip: '94105',
                phone: 1234,
              },
              account_acquisition: {
                cost_in_cents: '123 Main St.',
                currency: '123 Main St123',
                channel: 'San Francisco',
                subchannel: 'US',
                campaign: 'CA',
              },
              account_code: '1',
              tax_exempt: true,
              vat_number: true,
              preferred_locale: 'ES',
              accept_language: 'EN',
              entity_use_code: 'test',
              cc_emails: 'bob@example.com,susan@example.com',
              company_name: 'Recurly Inc',
              email: 'verena@example.com',
              first_name: 'Verena',
              last_name: 'Example',
              username: 'verena1234',
            },
            operations: [
              {
                name: 'Create Account',
                url: 'v2/accounts',
                method: 'POST',
                parameters: [
                  {
                    id: 'account_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'account_code',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                ],
                id: 'create_account',
              },
              {
                name: 'Update Account',
                url: 'v2/accounts/:_account_code',
                method: 'PUT',
                requiredMappings: [
                  'company_name',
                ],
                parameters: [
                  {
                    id: 'account_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_account',
              },
              {
                name: 'Reopen Account',
                url: 'v2/accounts/:_account_code/reopen',
                method: 'PUT',
                parameters: [
                  {
                    id: 'account_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'reopen_account',
              },
              {
                name: 'Create or Update Account',
                url: [
                  'v2/accounts/:_account_code',
                  'v2/accounts',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'company_name',
                  'account_code',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                ],
                parameters: [
                  {
                    id: 'account_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'create_or_update_account',
              },
              {
                name: 'Delete',
                url: 'v2/accounts/:_account_code',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'account_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'delete',
              },
            ],
          },
          {
            id: 'plans',
            name: 'PLANS',
            sampleData: {
              add_ons: [],
              plan_code: 'platinum',
              name: 'Platinum plan',
              description: [],
              success_url: [],
              cancel_url: [],
              display_donation_amounts: 'false',
              display_quantity: 'false',
              display_phone_number: 'false',
              bypass_hosted_confirmation: 'false',
              unit_name: 'unit',
              payment_page_tos_link: [],
              plan_interval_length: '1',
              plan_interval_unit: 'months',
              trial_interval_length: '0',
              trial_interval_unit: 'days',
              total_billing_cycles: [],
              accounting_code: [],
              setup_fee_accounting_code: [],
              created_at: '2016-08-02T16:48:34Z',
              updated_at: '2016-08-02T16:48:34Z',
              revenue_schedule_type: 'at_range_end',
              setup_fee_revenue_schedule_type: 'at_range_start',
              tax_exempt: 'false',
              tax_code: [],
              trial_requires_billing_info: 'true',
              auto_renew: true,
              unit_amount_in_cents: {
                EUR: '45000',
                USD: '60000',
                INR: 'DYHYU',
              },
              setup_fee_in_cents: {
                EUR: '800',
                USD: '1000',
                INR: 'DYHYU',
              },
            },
            operations: [
              {
                id: 'create_paln',
                name: 'Create Plan',
                url: 'v2/plans',
                method: 'POST',
                parameters: [
                  {
                    id: 'plan_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'plan_code',
                  'name',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><plan>{{#each data}}<plan_code>{{plan_code}}</plan_code><name>{{name}}</name><plan_interval_length>{{plan_interval_length}}</plan_interval_length><plan_interval_unit>{{plan_interval_unit}}</plan_interval_unit><tax_exempt>{{tax_exempt}}</tax_exempt><auto_renew>{{auto_renew}}</auto_renew><unit_amount_in_cents><USD>{{unit_amount_in_cents.USD}}</USD><INR>{{unit_amount_in_cents.INR}}</INR></unit_amount_in_cents><setup_fee_in_cents><USD>{{setup_fee_in_cents.USD}}</USD><INR>{{setup_fee_in_cents.INR}}</INR></setup_fee_in_cents>{{/each}}</plan>',
                ],
              },
              {
                name: 'Update Plan',
                url: 'v2/plans/:_plan_code',
                method: 'PUT',
                parameters: [
                  {
                    id: 'plan_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'auto_renew',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<plan>\n{{#each data}}\n\t<plan_code>{{plan_code}}</plan_code>\n\t\t<name>{{name}}</name>\n\t\t<plan_interval_length>{{plan_interval_length}}</plan_interval_length>\n\t\t<plan_interval_unit>{{plan_interval_unit}}</plan_interval_unit>\n\t\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t\t<auto_renew>{{auto_renew}}</auto_renew>\n\t\t<unit_amount_in_cents>\n\t\t<USD>{{unit_amount_in_cents.USD}}</USD>\n\t\t<EUR>{{unit_amount_in_cents.EUR}}</EUR>\n\t\t</unit_amount_in_cents>\n\t<setup_fee_in_cents>\n\t\t<USD>{{setup_fee_in_cents.USD}}</USD>\n\t\t<EUR>{{setup_fee_in_cents.EUR}}</EUR>\n\t\t</setup_fee_in_cents>\n{{/each}}\n</plan>\n\n',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_plan',
              },
              {
                id: 'create_update_paln',
                name: 'Create or Update Plan',
                url: [
                  'v2/plans/:_plan_code',
                  'v2/plans',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                requiredMappings: [
                  'plan_code',
                  'name',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><plan>{{#each data}}<plan_code>{{plan_code}}</plan_code><name>{{name}}</name><plan_interval_length>{{plan_interval_length}}</plan_interval_length><plan_interval_unit>{{plan_interval_unit}}</plan_interval_unit><tax_exempt>{{tax_exempt}}</tax_exempt><auto_renew>{{auto_renew}}</auto_renew><unit_amount_in_cents><USD>{{unit_amount_in_cents.USD}}</USD><INR>{{unit_amount_in_cents.INR}}</INR></unit_amount_in_cents><setup_fee_in_cents><USD>{{setup_fee_in_cents.USD}}</USD><INR>{{setup_fee_in_cents.INR}}</INR></setup_fee_in_cents>{{/each}}</plan>',
                  '<?xml version="1.0" encoding="UTF-8"?>\n<plan>\n{{#each data}}\n\t<plan_code>{{plan_code}}</plan_code>\n\t\t<name>{{name}}</name>\n\t\t<plan_interval_length>{{plan_interval_length}}</plan_interval_length>\n\t\t<plan_interval_unit>{{plan_interval_unit}}</plan_interval_unit>\n\t\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t\t<auto_renew>{{auto_renew}}</auto_renew>\n\t\t<unit_amount_in_cents>\n\t\t<USD>{{unit_amount_in_cents.USD}}</USD>\n\t\t<EUR>{{unit_amount_in_cents.EUR}}</EUR>\n\t\t</unit_amount_in_cents>\n\t<setup_fee_in_cents>\n\t\t<USD>{{setup_fee_in_cents.USD}}</USD>\n\t\t<EUR>{{setup_fee_in_cents.EUR}}</EUR>\n\t\t</setup_fee_in_cents>\n{{/each}}\n</plan>\n\n',
                ],
                ignoreEmptyNodes: true,
                parameters: [
                  {
                    id: 'plan_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
              {
                name: 'Delete Plan',
                url: 'v2/plans/:_plan_code',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'plan_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'delete_plan',
              },
            ],
          },
          {
            id: 'measured_units',
            name: 'MEASURED UNITS',
            sampleData: {
              id: '12345678901234567890',
              name: 'Streaming Bandwidth',
              display_name: 'Gigabyte',
              description: 'Video steaming bandwidth measured in gigabytes',
            },
            operations: [
              {
                name: 'Create Measured Unit',
                url: 'v2/measured_units',
                method: 'POST',
                parameters: [
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'display_name',
                  'name',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><measured_unit>{{#each data}} <id>{{id}}</id> <name>{{name}}</name><display_name>{{display_name}}</display_name><description>{{description}}</description>{{/each}}</measured_unit>',
                ],
                id: 'create_measured_unit',
              },
              {
                name: 'Update Measured Unit',
                url: 'v2/measured_units/:_id',
                method: 'PUT',
                parameters: [
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'display_name',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><measured_unit>{{#each data}} <id>{{id}}</id> <name>{{name}}</name><display_name>{{display_name}}</display_name><description>{{description}}</description>{{/each}}</measured_unit>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_measured_unit',
              },
              {
                name: 'Create or Update Measured Unit',
                url: [
                  'v2/measured_units/:_id',
                  'v2/measured_units',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                requiredMappings: [
                  'display_name',
                  'name',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><measured_unit>{{#each data}} <id>{{id}}</id> <name>{{name}}</name><display_name>{{display_name}}</display_name><description>{{description}}</description>{{/each}}</measured_unit>',
                  '<?xml version="1.0" encoding="UTF-8"?><measured_unit>{{#each data}} <id>{{id}}</id> <name>{{name}}</name><display_name>{{display_name}}</display_name><description>{{description}}</description>{{/each}}</measured_unit>',
                ],
                ignoreEmptyNodes: true,
                parameters: [
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'create_or_update_measured_unit',
              },
              {
                name: 'Delete Measured Unit',
                url: 'v2/measured_units/:_id',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'delete_measured_unit',
              },
            ],
          },
          {
            id: 'subscription_usage_records',
            name: 'SUBSCRIPTION USAGE RECORDS',
            sampleData: {
              '@href': 'https://your-subdomain.recurly.com/v2/subscriptions/374ae5e848adcfd332fdd3469d89c888/add_ons/video_streaming/usage/450646065398417338',
              measured_unit: {
                '@href': 'https://your-subdomain.recurly.com/v2/measured_units/450622522661012652',
              },
              amount: '1',
              merchant_tag: 'Order ID: 4939853977878713',
              recording_timestamp: '2016-07-14T13:09:15+00:00',
              usage_timestamp: '2016-07-14T22:30:15+00:00',
              created_at: '2016-07-14T22:33:17+00:00',
              updated_at: '2016-07-14T22:33:17+00:00',
              billed_at: '2016-07-14T22:33:17+00:00',
              usage_type: 'price',
              unit_amount_in_cents: '45',
              usage_percentage: [],
            },
            operations: [
              {
                name: 'Log Usage',
                url: 'v2/subscriptions/:_subscription_uuid/add_ons/:_add_on_code/usage',
                method: 'POST',
                parameters: [
                  {
                    id: 'subscription_uuid',
                    name: 'subscription_uuid',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'amount',
                  'usage_timestamp',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?> <usage> {{#each data}} <amount>{{amount}}</amount><merchant_tag>{{merchant_tag}}</merchant_tag><recording_timestamp>{{recording_timestamp}}</recording_timestamp><usage_timestamp>{{usage_timestamp}}</usage_timestamp><created_at>{{created_at}}</created_at> <updated_at>{{updated_at}}<updated_at/><billed_at>{{billed_at}}<billed_at/><usage_type>{{usage_type}}</usage_type><unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents><usage_percentage>{{usage_percentage}}<usage_percentage/><measured_unit/>{{/each}}</usage>',
                ],
                id: 'log_usage',
              },
              {
                name: 'Update Usage Record',
                url: 'v2/subscriptions/:_subscription_uuid/add_ons/:_add_on_code/usage/:_id',
                method: 'PUT',
                parameters: [
                  {
                    id: 'subscription_uuid',
                    name: 'subscription_uuid',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    name: 'Addon code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'amount',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?> <usage> {{#each data}} <amount>{{amount}}</amount><merchant_tag>{{merchant_tag}}</merchant_tag><recording_timestamp>{{recording_timestamp}}</recording_timestamp><usage_timestamp>{{usage_timestamp}}</usage_timestamp><created_at>{{created_at}}</created_at> <updated_at>{{updated_at}}<updated_at/><billed_at>{{billed_at}}<billed_at/><usage_type>{{usage_type}}</usage_type><unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents><usage_percentage>{{usage_percentage}}<usage_percentage/><measured_unit/>{{/each}}</usage>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_usage_record',
              },
              {
                name: 'Create or Update Usage Record',
                url: [
                  'v2/subscriptions/:_subscription_uuid/add_ons/:_add_on_code/usage/:_id',
                  'v2/subscriptions/:_suscription_uuid/add_ons/:_add_on_code/usage',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'amount',
                  'usage_timestamp',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?> <usage> {{#each data}} <amount>{{amount}}</amount><merchant_tag>{{merchant_tag}}</merchant_tag><recording_timestamp>{{recording_timestamp}}</recording_timestamp><usage_timestamp>{{usage_timestamp}}</usage_timestamp><created_at>{{created_at}}</created_at> <updated_at>{{updated_at}}<updated_at/><billed_at>{{billed_at}}<billed_at/><usage_type>{{usage_type}}</usage_type><unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents><usage_percentage>{{usage_percentage}}<usage_percentage/><measured_unit/>{{/each}}</usage>',
                  '<?xml version="1.0" encoding="UTF-8"?> <usage> {{#each data}} <amount>{{amount}}</amount><merchant_tag>{{merchant_tag}}</merchant_tag><recording_timestamp>{{recording_timestamp}}</recording_timestamp><usage_timestamp>{{usage_timestamp}}</usage_timestamp><created_at>{{created_at}}</created_at> <updated_at>{{updated_at}}<updated_at/><billed_at>{{billed_at}}<billed_at/><usage_type>{{usage_type}}</usage_type><unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents><usage_percentage>{{usage_percentage}}<usage_percentage/><measured_unit/>{{/each}}</usage>',
                ],
                parameters: [
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'create_or_update_usage_record',
              },
              {
                name: 'Delete Usage Record',
                url: 'v2/subscriptions/:_subscription_uuid/add_ons/:_add_on_code/usage/:_id',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'delete_usage_record',
              },
            ],
          },
          {
            id: 'subscriptions',
            name: 'SUBSCRIPTIONS',
            operations: [
              {
                name: 'Preview Subscription',
                url: 'v2/subscriptions/preview',
                method: 'POST',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'USD',
                  collection_method: 'manual',
                  account: {
                    account_code: '1',
                    email: 'verena@example.com',
                    first_name: 'verena',
                    last_name: 'example',
                  },
                  shipping_address: {
                    nickname: 'Work',
                    first_name: 'Verena',
                    last_name: 'Example',
                    company: 'Recurly Inc',
                    phone: '555-222-1212',
                    email: 'verena@example.com',
                    address1: '123 Main St.',
                    address2: 'Suite 101',
                    city: 'Grand Rapids',
                    state: 'MI',
                    zip: '49506',
                    country: 'US',
                  },
                },
                parameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <subscription>\n{{#each data}}\n\t <plan_code>{{plan_code}}</plan_code> <currency>{{currency}}</currency> <collection_method>{{collection_method}}</collection_method>\n\t\t\t <account>\n\t\t <account_code>{{account_code}}</account_code>\n\t\t\t <email>{{email}}</email>\n\t\t\t <first_name>{{first_name}}</first_name>\n\t\t\t <last_name>{{last_name}}</last_name>\n\t\t\t </account>\n\t <shipping_address>\n\t\t\t <nickname>{{nickname}}</nickname>\n\t\t\t <first_name>{{first_name}}</first_name>\n\t\t\t <last_name>{{last_name}}</last_name>\n\t\t\t <company>{{company}}</company>\n\t\t\t <phone>{{phone}}</phone>\n\t\t\t <email>{{email}}</email>\n\t\t\t <address1>{{address1}}</address1>\n\t\t\t <address2>{{address2}}</address2>\n\t\t\t <city>{{city}}</city>\n\t\t\t <state>{{state}}</state>\n\t\t\t <zip>{{zip}}</zip>\n\t\t\t <country>{{country}}</country>\n\t\t </shipping_address>\n  </subscription>\n\n',
                ],
                id: 'preview_subscription',
              },
              {
                name: 'Create Subscription',
                url: 'v2/subscriptions',
                method: 'POST',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'EUR',
                  account: {
                    account_code: '1',
                    email: 'verena@example.com',
                    first_name: 'Verena',
                    last_name: 'Example',
                    billing_info: {
                      number: '4111-1111-1111-1111',
                      month: '12',
                      year: '2019',
                      address1: '123 Main St.',
                      city: 'San Francisco',
                      state: 'CA',
                      zip: '94105',
                      country: 'US',
                    },
                  },
                  shipping_address: {
                    nickname: 'Work',
                    first_name: 'Verena',
                    last_name: 'Example',
                    company: 'Recurly Inc',
                    phone: '555-222-1212',
                    email: 'verena@example.com',
                    address1: '123 Main St.',
                    address2: 'Suite 101',
                    city: 'San Francisco',
                    state: 'CA',
                    zip: '94105',
                    country: 'US',
                  },
                  coupon_code: 'subscription_special',
                  renewal_billing_cycles: '4',
                  auto_renew: 'true',
                  subscription_add_on: 'subscription_special',
                  unit_amount_in_cents: 'subscription_special',
                  quantity: 'subscription_special',
                  trial_ends_at: 'subscription_special',
                  starts_at: 'subscription_special',
                  total_billing_cycles: 'subscription_special',
                  first_renewal_date: 'subscription_special',
                  collection_method: 'subscription_special',
                  net_terms: 'subscription_special',
                  po_number: 'subscription_special',
                  bulk: 'subscription_special',
                  terms_and_conditions: 'subscription_special',
                  customer_notes: 'subscription_special',
                  vat_reverse_charge_notes: 'subscription_special',
                  bank_account_authorized_at: 'subscription_special',
                  revenue_schedule_type: 'subscription_special',
                  shipping_address_id: 'subscription_special',
                  gift_card: 'subscription_special',
                  redemption_code: 'subscription_special',
                  imported_trial: 'subscription_special',
                },
                parameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'plan_code',
                  'account',
                  'currency',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?> <subscription> {{#each data}} <plan_code>{{plan_code}}</plan_code><currency>{{currency}}</currency><account><account_code>{{account.account_code}}</account_code><email>{{account.email}}</email><first_name>{{account.first_name}}</first_name><last_name>{{account.last_name}}</last_name><billing_info><number>{{billing_info.number}}</number><month>{{billing_info.month}}</month><year>{{billing_info.year}}</year><address1>{{billing_info.address1}}</address1><city>{{billing_info.city}}</city><state>{{billing_info.state}}</state><zip>{{billing_info.zip}}</zip><country>{{billing_info.country}}</country></billing_info></account><shipping_address><nickname>{{shipping_address.nickname}}</nickname><first_name>{{shipping_address.first_name}}</first_name> <last_name>{{shipping_address.last_name}}</last_name><company>{{shipping_address.company}}</company> <phone>{{shipping_address.phone}}</phone><email>{{shipping_address.email}}</email> <address1>{{shipping_address.address1}}</address1><address2>{{shipping_address.address2}}</address2> <city>{{shipping_address.city}}</city><state>{{shipping_address.state}}</state><zip>{{shipping_address.zip}}</zip><country>{{shipping_address.country}}</country></shipping_address><coupon_code>{{coupon_code}}</coupon_code><renewal_billing_cycles>{{renewal_billing_cycles}}</renewal_billing_cycles><auto_renew>{{auto_renew}}</auto_renew>{{/each}}</subscription>',
                ],
                id: 'create_subscription',
              },
              {
                name: 'Create Subscription with Add-Ons',
                url: 'v2/subscriptions',
                method: 'POST',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'EUR',
                  subscription_add_ons: [
                    {
                      add_on_code: 'ipaddresses',
                      quantity: '2',
                      unit_amount_in_cents: '1000',
                    },
                    {
                      add_on_code: 'video_streaming',
                    },
                  ],
                  account: {
                    account_code: '1',
                  },
                },
                parameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'add_on_code',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xmlversion="1.0" encoding="UTF-8"?> <subscription> {{#each data}}  <plan_code>{{plan_code}}</plan_code> <currency>{{currency}}</currency> <subscription_add_ons> {{#each subscription_add_on}}   <subscription_add_on> <add_on_code>{{add_on_code}}</add_on_code><quantity>{{quantity}}</quantity><unit_amount_in_cents>{{unit_amount_in_cents }}</unit_amount_in_cents> </subscription_add_on>{{/each}} </subscription_add_ons><account><account_code>{{account.account_code}}</account_code></account>{{/each}}</subscription>',
                ],
                id: 'create_subscription_with_add-ons',
              },
              {
                name: 'Preview Subscription Change',
                url: 'v2/subscriptions/:_uuid/preview',
                method: 'POST',
                sampleData: {
                  unit_amount_in_cents: '100',
                  shipping_address: {
                    nickname: 'Work',
                    first_name: 'Verena',
                    last_name: 'Example',
                    company: 'Recurly Inc',
                    phone: '555-222-1212',
                    email: 'verena@example.com',
                    address1: '123 Main St.',
                    address2: 'Suite 101',
                    city: 'Grand Rapids',
                    state: 'MI',
                    zip: '49506',
                    country: 'US',
                  },
                },
                parameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xmlversion="1.0" encoding="UTF-8"?> <subscription> {{#each data}} <unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents><shipping_address><nickname>{{shipping_address.nickname}}</nickname><first_name>{{shipping_address.first_name}}</first_name> <last_name>{{shipping_address.last_name}}</last_name><company>{{shipping_address.company}}</company><phone>{{shipping_address.phone}}</phone><email>{{shipping_address.email}}</email><address1>{{shipping_address.address1}}</address1><address2>{{shipping_address.address2}}</address2><city>{{shipping_address.city}}</city><state>{{shipping_address.state}}</state><zip>{{shipping_address.zip}}</zip><country>{{shipping_address.country}}</country></shipping_address> {{/each}} </subscription>',
                ],
                id: 'preview_subscription_change',
              },
              {
                name: 'Create Subscription with Custom Fields',
                url: 'v2/subscriptions',
                method: 'POST',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'EUR',
                  account: {
                    account_code: '1',
                  },
                  custom_fields: [
                    {
                      name: 'device_id',
                      value: 'KIWTL-WER-ZXMRD',
                    },
                    {
                      name: 'purchase_date',
                      value: '2017-01-23',
                    },
                  ],
                },
                parameters: [
                  {
                    id: 'uuid',
                    name: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xmlversion="1.0" encoding="UTF-8"?> <subscription> {{#each data}} <plan_code>{{plan_code}}</plan_code><currency>{{currency}}</currency><account><account_code>{{account.account_code}}</account_code> </account><custom_fields> {{#each custom_fields}} <custom_field><name>{{name}}</name><value>{{value}}</value></custom_field>{{/each}}</custom_fields> {{/each}}</subscription>',
                ],
                id: 'create_subscription_with_custom_fields',
              },
              {
                name: 'Update Subscription',
                url: 'v2/subscriptions/:_uuid',
                method: 'PUT',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'EUR',
                  account: {
                    account_code: '1',
                    email: 'verena@example.com',
                    first_name: 'Verena',
                    last_name: 'Example',
                    billing_info: {
                      number: '4111-1111-1111-1111',
                      month: '12',
                      year: '2019',
                      address1: '123 Main St.',
                      city: 'San Francisco',
                      state: 'CA',
                      zip: '94105',
                      country: 'US',
                    },
                  },
                  shipping_address: {
                    nickname: 'Work',
                    first_name: 'Verena',
                    last_name: 'Example',
                    company: 'Recurly Inc',
                    phone: '555-222-1212',
                    email: 'verena@example.com',
                    address1: '123 Main St.',
                    address2: 'Suite 101',
                    city: 'San Francisco',
                    state: 'CA',
                    zip: '94105',
                    country: 'US',
                  },
                  coupon_code: 'subscription_special',
                  renewal_billing_cycles: '4',
                  auto_renew: 'true',
                },
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xmlversion="1.0" encoding="UTF-8"?> <subscription> {{#each data}} <plan_code>{{plan_code}}</plan_code><currency>{{currency}}</currency><account><account_code>{{account.account_code}}</account_code><email>{{account.email}}</email><first_name>{{account.first_name}}</first_name><last_name>{{account.last_name}}</last_name><billing_info><number>{{billing_info.number}}</number><month>{{billing_info.month}}</month><year>{{billing_info.year}}</year><address1>{{billing_info.address1}}</address1><city>{{billing_info.city}}</city><state>{{billing_info.state}}</state><zip>{{billing_info.zip}}</zip><country>{{billing_info.country}}</country></billing_info></account><shipping_address><nickname>{{shipping_address.nickname}}</nickname><first_name>{{shipping_address.first_name}}</first_name> <last_name>{{shipping_address.last_name}}</last_name><company>{{shipping_address.company}}</company> <phone>{{shipping_address.phone}}</phone><email>{{shipping_address.email}}</email> <address1>{{shipping_address.address1}}</address1><address2>{{shipping_address.address2}}</address2> <city>{{shipping_address.city}}</city><state>{{shipping_address.state}}</state><zip>{{shipping_address.zip}}</zip><country>{{shipping_address.country}}</country></shipping_address><coupon_code>{{coupon_code}}</coupon_code><renewal_billing_cycles>{{renewal_billing_cycles}}</renewal_billing_cycles><auto_renew>{{auto_renew}}</auto_renew>{{/each}}</subscription>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_subscription',
              },
              {
                name: 'Update Subscription with Add-Ons',
                url: 'v2/subscriptions/:_uuid',
                method: 'PUT',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'EUR',
                  subscription_add_ons: [
                    {
                      add_on_code: 'ipaddresses',
                      quantity: '2',
                      unit_amount_in_cents: '1000',
                    },
                    {
                      add_on_code: 'video_streaming',
                    },
                  ],
                  account: {
                    account_code: '1',
                  },
                },
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'add_on_code',
                ],
                body: [
                  '<?xmlversion="1.0" encoding="UTF-8"?> <subscription> {{#each data}}  <plan_code>{{plan_code}}</plan_code> <currency>{{currency}}</currency> <subscription_add_ons> {{#each subscription_add_on}}   <subscription_add_on> <add_on_code>{{add_on_code}}</add_on_code><quantity>{{quantity}}</quantity><unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents> </subscription_add_on>{{/each}} </subscription_add_ons><account><account_code>{{account.account_code}}</account_code></account>{{/each}}</subscription>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_subscription_with_add-ons',
              },
              {
                name: 'Update Subscription Notes',
                url: 'v2/subscriptions/:_uuid/notes',
                method: 'PUT',
                sampleData: {
                  terms_and_conditions: 'gold',
                  customer_notes: 'EUR',
                  vat_reverse_charge_notes: '1',
                  custom_fields: [
                    {
                      name: 'device_id',
                      value: 'KIWTL-WER-ZXMRD',
                    },
                    {
                      name: 'purchase_date',
                      value: '2017-01-23',
                    },
                  ],
                },
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xmlversion="1.0" encoding="UTF-8"?> <subscription> {{#each data}} <terms_and_conditions>{{terms_and_conditions}}</terms_and_conditions><customer_notes>{{customer_notes}}</customer_notes><vat_reverse_charge_notes>{{vat_reverse_charge_notes}}</vat_reverse_charge_notes><custom_fields> {{#each custom_fields}} <custom_field><name>{{name}}</name><value>{{value}}</value></custom_field>{{/each}}</custom_fields> {{/each}}</subscription>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_subscription_notes',
              },
              {
                name: 'Cancel Subscription',
                url: 'v2/subscriptions/:_uuid/cancel',
                method: 'PUT',
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n{{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'cancel_subscription',
              },
              {
                name: 'Reactivate Canceled Subscription',
                url: 'v2/subscriptions/:_uuid/reactivate',
                method: 'PUT',
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'reactivate_canceled_subscription',
              },
              {
                name: 'Pause Subscription',
                url: 'v2/subscriptions/:_uuid/pause',
                method: 'PUT',
                sampleData: {
                  remaining_pause_cycles: 'ty',
                },
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xmlversion="1.0" encoding="UTF-8"?> <subscription> {{#each data}} <remaining_pause_cycles>{{remaining_pause_cycles}}</remaining_pause_cycles> {{/each}} </subscription>',
                ],
                requiredMappings: [
                  'remaining_pause_cycles',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'pause_subscription',
              },
              {
                name: 'Resume Subscription',
                url: 'v2/subscriptions/:_uuid/resume',
                method: 'PUT',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'EUR',
                  account: {
                    account_code: '1',
                  },
                  custom_fields: [
                    {
                      name: 'device_id',
                      value: 'KIWTL-WER-ZXMRD',
                    },
                    {
                      name: 'purchase_date',
                      value: '2017-01-23',
                    },
                  ],
                },
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'resume_subscription',
              },
              {
                name: 'Update Subscription with Custom Fields',
                url: 'v2/subscriptions/:_uuid',
                method: 'PUT',
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xmlversion="1.0" encoding="UTF-8"?> <subscription> {{#each data}} <plan_code>{{plan_code}}</plan_code><currency>{{currency}}</currency><account><account_code>{{account.account_code}}</account_code> </account><custom_fields> {{#each custom_fields}} <custom_field><name>{{name}}</name><value>{{value}}</value></custom_field>{{/each}}</custom_fields> </subscription>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_subscription_with_custom_fields',
              },
            ],
          },
          {
            id: 'plan_addons',
            name: 'PLAN ADD-ONS',
            sampleData: {
              add_on_code: 'video_streaming',
              name: 'Video Streaming',
              default_quantity: '1',
              display_quantity_on_hosted_page: 'false',
              tax_code: 'fyi',
              unit_amount_in_cents: {
                USD: '50',
                EUR: '45',
              },
              accounting_code: 'fg',
              add_on_type: 'usage',
              optional: 'true',
              usage_type: 'price',
              usage_percentage: [],
              revenue_schedule_type: 'evenly',
              created_at: '2016-08-03T15:25:09Z',
              updated_at: '2016-08-03T15:25:09Z',
            },
            operations: [
              {
                name: 'Create Plan Add-On',
                url: 'v2/plans/:_plan_code/add_ons',
                method: 'POST',
                parameters: [
                  {
                    id: 'plan_code',
                    name: 'Plan Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'add_on_code',
                  'name',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><add_on>{{#each data}}<add_on_code>{{add_on_code}}</add_on_code><name>{{name}}</name><default_quantity>{{default_quantity}}</default_quantity>   <display_quantity_on_hosted_page>{{display_quantity_on_hosted_page}}</display_quantity_on_hosted_page>   <unit_amount_in_cents>     <USD>{{unit_amount_in_cents.USD}}</USD>     <EUR>{{unit_amount_in_cents.EUR}}</EUR>   </unit_amount_in_cents>   <add_on_type>{{add_on_type}}</add_on_type>   <optional>{{optional}}</optional>   <usage_type>{{usage_type}}</usage_type>   <revenue_schedule_type>{{revenue_schedule_type}}</revenue_schedule_type>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</add_on>',
                ],
                id: 'create_plan_add-on',
              },
              {
                name: 'Update Plan Add-On',
                url: 'v2/plans/:_plan_code/add_ons/:_add_on_code',
                method: 'PUT',
                parameters: [
                  {
                    id: 'plan_code',
                    name: 'Plan Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><add_on>{{#each data}}<add_on_code>{{add_on_code}}</add_on_code><name>{{name}}</name><default_quantity>{{default_quantity}}</default_quantity>   <display_quantity_on_hosted_page>{{display_quantity_on_hosted_page}}</display_quantity_on_hosted_page>   <unit_amount_in_cents>     <USD>{{unit_amount_in_cents.USD}}</USD>     <EUR>{{unit_amount_in_cents.EUR}}</EUR>   </unit_amount_in_cents>   <add_on_type>{{add_on_type}}</add_on_type>   <optional>{{optional}}</optional>   <usage_type>{{usage_type}}</usage_type>   <revenue_schedule_type>{{revenue_schedule_type}}</revenue_schedule_type>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</add_on>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_plan_add-on',
              },
              {
                name: 'Create or Update Plan Add-On',
                url: [
                  'v2/plans/:_plan_code/add_ons/:_add_on_code',
                  'v2/plans/:_plan_code/add_ons',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><add_on>{{#each data}}<add_on_code>{{add_on_code}}</add_on_code><name>{{name}}</name><default_quantity>{{default_quantity}}</default_quantity>   <display_quantity_on_hosted_page>{{display_quantity_on_hosted_page}}</display_quantity_on_hosted_page>   <unit_amount_in_cents>     <USD>{{unit_amount_in_cents.USD}}</USD>     <EUR>{{unit_amount_in_cents.EUR}}</EUR>   </unit_amount_in_cents>   <add_on_type>{{add_on_type}}</add_on_type>   <optional>{{optional}}</optional>   <usage_type>{{usage_type}}</usage_type>   <revenue_schedule_type>{{revenue_schedule_type}}</revenue_schedule_type>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</add_on>',
                  '<?xml version="1.0" encoding="UTF-8"?><add_on>{{#each data}}<add_on_code>{{add_on_code}}</add_on_code><name>{{name}}</name><default_quantity>{{default_quantity}}</default_quantity>   <display_quantity_on_hosted_page>{{display_quantity_on_hosted_page}}</display_quantity_on_hosted_page>   <unit_amount_in_cents>     <USD>{{unit_amount_in_cents.USD}}</USD>     <EUR>{{unit_amount_in_cents.EUR}}</EUR>   </unit_amount_in_cents>   <add_on_type>{{add_on_type}}</add_on_type>   <optional>{{optional}}</optional>   <usage_type>{{usage_type}}</usage_type>   <revenue_schedule_type>{{revenue_schedule_type}}</revenue_schedule_type>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</add_on>',
                ],
                requiredMappings: [
                  'add_on_code',
                  'name',
                ],
                ignoreEmptyNodes: true,
                parameters: [
                  {
                    id: 'plan_code',
                    name: 'Plan Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'create_or_update_plan_add-on',
              },
              {
                name: 'Delete Plan Add-On',
                url: 'v2/plans/:_plan_code/add_ons/:_add_on_code',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'plan_code',
                    name: 'Plan Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'add_on_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'delete_plan_add-on',
              },
            ],
          },
          {
            id: 'shipping_address',
            name: 'SHIPPING ADDRESSES',
            sampleData: {
              account: [],
              subscriptions: [],
              id: '2438622711411416831',
              nickname: 'Work',
              first_name: 'Verena',
              last_name: 'Example',
              company: 'Recurly Inc',
              email: 'verena@example.com',
              vat_number: [],
              address1: '123 Main St.',
              address2: 'Suite 101',
              city: 'San Francisco',
              state: 'CA',
              zip: '94105',
              country: 'US',
              phone: '555-222-1212',
              created_at: '2018-03-19T15:48:00Z',
              updated_at: '2018-03-19T15:48:00Z',
            },
            operations: [
              {
                name: 'Create Shipping Address',
                url: 'v2/accounts/:_account_code/shipping_addresses',
                method: 'POST',
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'first_name',
                  'last_name',
                  'address1',
                  'address2',
                  'city',
                  'state',
                  'zip',
                  'country',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><shipping_address>{{#each data}}        <id>{{id}}</id>   <nickname>{{nickname}}</nickname>   <first_name>{{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <company>{{company}}</company>   <email>{{email}}</email>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <phone>{{phone}}</phone>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</shipping_address>',
                ],
                id: 'create_shipping_address',
              },
              {
                name: 'Update Shipping Address',
                url: 'v2/accounts/:_account_code/shipping_addresses/:_id',
                method: 'PUT',
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><shipping_address>{{#each data}}        <id>{{id}}</id>   <nickname>{{nickname}}</nickname>   <first_name>{{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <company>{{company}}</company>   <email>{{email}}</email>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <phone>{{phone}}</phone>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</shipping_address>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'update_shipping_address',
              },
              {
                name: 'Create or Update Shipping Address',
                url: [
                  'v2/accounts/:_account_code/shipping_addresses/:_id',
                  'v2/accounts/:_account_code/shipping_addresses',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                requiredMappings: [
                  'first_name',
                  'last_name',
                  'address1',
                  'address2',
                  'city',
                  'state',
                  'zip',
                  'country',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><shipping_address>{{#each data}}        <id>{{id}}</id>   <nickname>{{nickname}}</nickname>   <first_name>{{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <company>{{company}}</company>   <email>{{email}}</email>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <phone>{{phone}}</phone>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</shipping_address>',
                  '<?xml version="1.0" encoding="UTF-8"?><shipping_address>{{#each data}}        <id>{{id}}</id>   <nickname>{{nickname}}</nickname>   <first_name>{{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <company>{{company}}</company>   <email>{{email}}</email>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <phone>{{phone}}</phone>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</shipping_address>',
                ],
                ignoreEmptyNodes: true,
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'create_or_update_shipping_address',
              },
              {
                name: 'Delete Shipping Address',
                url: 'v2/accounts/:_account_code/shipping_addresses/:_id',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'delete_shipping_address',
              },
            ],
          },
          {
            id: 'coupons_redemptions',
            name: 'COUPON REDEMPTIONS',
            sampleData: {
              coupon: [],
              account: [],
              uuid: '374a1c75374bd81493a3f7425db0a2b8',
              single_use: 'true',
              total_discounted_in_cents: 0,
              currency: 'USD',
              state: 'active',
              coupon_code: 'special',
              created_at: '2016-07-11T18:56:20Z',
              updated_at: '2016-07-11T18:56:20Z',
            },
            operations: [
              {
                name: 'Redeem Coupon on Account',
                url: 'v2/coupons/:_coupon_code/redeem',
                method: 'POST',
                parameters: [
                  {
                    id: 'coupon_code',
                    isIdentifier: true,
                    in: 'path',
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'account_code',
                  'currency',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><redemption>{{#each data}} <coupon>{{coupon}}<coupon/>   <account>{{account}}<account/>   <uuid>{{uuid}}</uuid>   <single_use>{{single_use}}</single_use>   <total_discounted_in_cents>{{total_discounted_in_cents}}</total_discounted_in_cents>   <currency>{{currency}}</currency>   <state>{{state}}</state>   <coupon_code>{{coupon_code}}</coupon_code>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</redemption>',
                ],
                id: 'redeem_coupon_on_account',
              },
              {
                name: 'Remove Coupon Redemption from Account',
                url: 'v2/coupons/:_coupon_code/redeem/:_id',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'coupon_code',
                    name: 'Coupon Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'remove_coupon_redemption_from_account',
              },
            ],
          },
          {
            id: 'gift_cards',
            name: 'GIFT CARDS',
            sampleData: {
              shipping_address: [
                {
                  address1: '123 Main St.',
                  address2: 'Suite 101',
                  city: 'San Francisco',
                  company: 'Recurly Inc',
                  country: 'US',
                  email: 'verena@example.com',
                  first_name: 'Verena',
                  last_name: 'Example',
                  nickname: 'Work',
                  phone: '555-222-1212',
                  state: 'CA',
                  zip: '94105',
                },
                {
                  address1: '123 Fourth St.',
                  address2: 'Apt. 101',
                  city: 'San Francisco',
                  country: 'US',
                  email: 'verena@example.com',
                  first_name: 'Verena',
                  last_name: 'Example',
                  nickname: 'Home',
                  phone: '555-867-5309',
                  state: 'CA',
                  zip: '94105',
                },
              ],
              address: {
                address1: '123 Main St.',
                address2: '123 Main St123',
                city: 'San Francisco',
                country: 'US',
                state: 'CA',
                zip: '94105',
                phone: 1234,
              },
              account_acquisition: {
                cost_in_cents: '123 Main St.',
                currency: '123 Main St123',
                channel: 'San Francisco',
                subchannel: 'US',
                campaign: 'CA',
              },
              account_code: '1',
              tax_exempt: true,
              vat_number: true,
              preferred_locale: 'ES',
              accept_language: 'EN',
              entity_use_code: 'test',
              cc_emails: 'bob@example.com,susan@example.com',
              company_name: 'Recurly Inc',
              email: 'verena@example.com',
              first_name: 'Verena',
              last_name: 'Example',
              username: 'verena1234',
            },
            operations: [
              {
                name: 'Preview Gift Card',
                url: 'v2/gift_cards/preview',
                method: 'POST',
                sampleData: {
                  product_code: 'gift_card',
                  unit_amount_in_cents: '2000',
                  currency: 'USD',
                  delivery: {
                    method: 'email',
                    email_address: 'john@example.com',
                    first_name: 'John',
                    last_name: 'Smith',
                    gifter_name: 'Sally',
                    personal_message: 'Hi John, Happy Birthday! I hope you have a great day! Love, Sally',
                  },
                  gifter_account: {
                    account_code: '1',
                    email: 'sally@example.com',
                    first_name: 'Sally',
                    last_name: 'Wilson',
                    billing_info: {
                      number: '4111-1111-1111-1111',
                      month: '1',
                      year: '2017',
                    },
                  },
                },
                parameters: [
                  {
                    id: 'id',
                    isIdentifier: true,
                    in: 'path',
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'product_code',
                  'currency',
                  'delivery',
                  'method',
                  'gifter_account',
                  'account_code',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <gift_card>\n {{#each data}}\n\t     <product_code>{{product_code}}</product_code>     <unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents>     <currency>{{currency}}</currency>     <delivery>          <method>{{delivery.method}}</method>          <email_address>{{delivery.email_address}}</email_address>          <first_name>{{delivery.first_name}}</first_name>          <last_name>{{delivery.last_name}}</last_name>          <gifter_name>{{delivery.gifter_name}}</gifter_name>          <personal_message>         {{delivery.personal_message}}</personal_message>     </delivery>     <gifter_account>         <account_code>{{gifter_account.account_code}}</account_code>         <email>{{gifter_account.email}}</email>         <first_name>{{gifter_account.first_name}}</first_name>         <last_name>{{gifter_account.last_name}}</last_name>         <billing_info>             <number>{{billing_info.number}}</number>             <month>{{billing_info.month}}</month>             <year>{{billing_info.year}}</year>         </billing_info>     </gifter_account> {{/each}}\n\t </gift_card>',
                ],
                id: 'preview_gift_card',
              },
              {
                name: 'Create Gift Card',
                url: 'v2/gift_cards',
                method: 'POST',
                sampleData: {
                  product_code: 'gift_card',
                  unit_amount_in_cents: '2000',
                  currency: 'USD',
                  delivery: {
                    method: 'email',
                    email_address: 'john@example.com',
                    first_name: 'John',
                    last_name: 'Smith',
                    gifter_name: 'Sally',
                    personal_message: 'Hi John, Happy Birthday! I hope you have a great day! Love, Sally',
                  },
                  gifter_account: {
                    account_code: '1',
                    email: 'sally@example.com',
                    first_name: 'Sally',
                    last_name: 'Wilson',
                    billing_info: {
                      number: '4111-1111-1111-1111',
                      month: '1',
                      year: '2017',
                    },
                  },
                },
                parameters: [
                  {
                    id: 'id',
                    isIdentifier: true,
                    in: 'path',
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'product_code',
                  'currency',
                  'delivery',
                  'method',
                  'gifter_account',
                  'account_code',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <gift_card>\n {{#each data}}\n\t     <product_code>{{product_code}}</product_code>     <unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents>     <currency>{{currency}}</currency>     <delivery>          <method>{{delivery.method}}</method>          <email_address>{{delivery.email_address}}</email_address>          <first_name>{{delivery.first_name}}</first_name>          <last_name>{{delivery.last_name}}</last_name>          <gifter_name>{{delivery.gifter_name}}</gifter_name>          <personal_message>         {{delivery.personal_message}}</personal_message>     </delivery>     <gifter_account>         <account_code>{{gifter_account.account_code}}</account_code>         <email>{{gifter_account.email}}</email>         <first_name>{{gifter_account.first_name}}</first_name>         <last_name>{{gifter_account.last_name}}</last_name>         <billing_info>             <number>{{billing_info.number}}</number>             <month>{{billing_info.month}}</month>             <year>{{billing_info.year}}</year>         </billing_info>     </gifter_account> {{/each}}\n\t </gift_card>',
                ],
                id: 'create_gift_card',
              },
              {
                name: 'Redeem Gift Card on Account',
                url: 'v2/gift_cards/:_redemption_code/redeem',
                method: 'POST',
                sampleData: {
                  account_code: '3345700',
                },
                parameters: [
                  {
                    id: 'redemption_code',
                    isIdentifier: true,
                    in: 'path',
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'recipient_account',
                  'account_code',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <recipient_account>\n{{#each data}}\n\t   <account_code>{{account_code}}</account_code>    {{/each}}\n\t </recipient_account>\n\n',
                ],
                id: 'redeem_gift_card_on_account',
              },
              {
                name: 'Preview Subscription with Gift Card Redemption',
                url: 'v2/subscriptions/preview',
                method: 'POST',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'EUR',
                  account: {
                    account_code: '1',
                    email: 'verena@example.com',
                    first_name: 'Verena',
                    last_name: 'Example',
                    billing_info: {
                      number: '4111-1111-1111-1111',
                      month: '12',
                      year: '2019',
                    },
                  },
                  coupon_code: 'subscription_special',
                  gift_card: {
                    redemption_code: 'JHD776JENN99E6DD',
                  },
                },
                parameters: [
                  {
                    id: 'redemption_code',
                    isIdentifier: true,
                    in: 'path',
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'redemption_code',
                  'gift_card',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <subscription>\n{{#each data}}\n\t   <plan_code>{{plan_code}}</plan_code>   <currency>{{currency}}</currency>   <account>     <account_code>{{account.account_code}}</account_code>     <email>{{account.email}}</email>     <first_name>{{account.first_name}}</first_name>     <last_name>{{account.last_name}}</last_name>     <billing_info>       <number>{{billing_info.number}}</number>       <month>{{billing_info.month}}</month>       <year>{{billing_info.year}}</year>     </billing_info>   </account>   <coupon_code>{{coupon_code}}</coupon_code>   <gift_card>     <redemption_code>{{gift_card.redemption_code}}</redemption_code>   </gift_card>\n  {{/each}}\n\t </subscription>\n\n',
                ],
                id: 'preview_subscription_with_gift_card_redemption',
              },
              {
                name: 'Create Subscription with Gift Card Redemption',
                url: 'v2/subscriptions',
                method: 'POST',
                sampleData: {
                  plan_code: 'gold',
                  currency: 'EUR',
                  account: {
                    account_code: '1',
                    email: 'verena@example.com',
                    first_name: 'Verena',
                    last_name: 'Example',
                    billing_info: {
                      number: '4111-1111-1111-1111',
                      month: '12',
                      year: '2019',
                    },
                  },
                  coupon_code: 'subscription_special',
                  gift_card: {
                    redemption_code: 'JHD776JENN99E6DD',
                  },
                },
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <subscription>\n{{#each data}}\n\t   <plan_code>{{plan_code}}</plan_code>   <currency>{{currency}}</currency>   <account>     <account_code>{{account.account_code}}</account_code>     <email>{{account.email}}</email>     <first_name>{{account.first_name}}</first_name>     <last_name>{{account.last_name}}</last_name>     <billing_info>       <number>{{billing_info.number}}</number>       <month>{{billing_info.month}}</month>       <year>{{billing_info.year}}</year>     </billing_info>   </account>   <coupon_code>{{coupon_code}}</coupon_code>   <gift_card>     <redemption_code>{{gift_card.redemption_code}}</redemption_code>   </gift_card>\n  {{/each}}\n\t </subscription>\n\n',
                ],
                requiredMappings: [
                  'redemption_code',
                  'gift_card',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                parameters: [
                  {
                    id: 'redemption_code',
                    isIdentifier: true,
                    in: 'path',
                    required: true,
                  },
                ],
                id: 'create_subscription_with_gift_card_redemption',
              },
            ],
          },
          {
            id: 'invoices',
            name: 'INVOICES',
            operations: [
              {
                name: 'Preview Invoice',
                url: 'v2/accounts/:_account_code/invoices',
                method: 'POST',
                sampleData: {
                  collection_method: 'manual',
                },
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <invoice>\n{{#each data}}\n\t   <collection_method>{{collection_method}}</collection_method> {{/each}}\n\t </invoice>',
                ],
                id: 'preview_invoice',
              },
              {
                name: 'Post Invoice: Invoice Pending Adjustments on Account',
                url: 'v2/accounts/:_account_code/invoices',
                method: 'POST',
                sampleData: {
                  collection_method: 'manual',
                },
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <invoice>\n{{#each data}}\n\t   <collection_method>{{collection_method}}</collection_method> {{/each}}\n\t </invoice>',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: 'post_invoice:_invoice_pending_adjustments_on_account',
              },
              {
                name: 'Refund/Void Line Items',
                url: 'v2/invoices/:_invoice_number/refund',
                method: 'POST',
                sampleData: {
                  line_items: [
                    {
                      uuid: '2bc33a7469dc1458f455634212acdcd6',
                      quantity: '1',
                      prorate: 'false',
                    },
                    {
                      uuid: '2bc33a746a89d867df47024fd6b261b6',
                      quantity: '1',
                      prorate: 'true',
                    },
                  ],
                  refund_method: 'credit_first',
                },
                parameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'uuid',
                  'quantity',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  ' <?xml version="1.0" encoding="UTF-8"?>\n <invoice>\n{{#each data}}\n\t <refund_method>{{refund_method}}</refund_method>\n\t\t <line_items>\n      {{#each line_items}}\n\t\t <adjustment>   <uuid>{{uuid}}</uuid>    <quantity>{{quantity}}</quantity>    <prorate>{{prorate}}</prorate>  </adjustment>    {{/each}}\n\t </line_items>\n\t </invoice>\n\n',
                ],
                id: 'refund/void_line_items',
              },
              {
                name: 'Refund/Void Open Amount',
                url: 'v2/invoices/:_invoice_number/refund',
                method: 'POST',
                sampleData: {
                  amount_in_cents: '1000',
                  refund_method: 'credit_first',
                },
                parameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <invoice>\n{{#each data}}\n\t <refund_method>{{refund_method}}</refund_method>\n\t\t  <amount_in_cents>{{amount_in_cents}}</amount_in_cents> </invoice>\n\n',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: 'refund/void_open_amount',
              },
              {
                name: 'Enter Offline Payment for Manual Invoice',
                url: 'v2/invoices/:_invoice_number/transactions',
                method: 'POST',
                sampleData: {
                  payment_method: 'check',
                  collected_at: '2018-03-19T10:33:16-06:00',
                  amount_in_cents: '50',
                  description: 'Paid with a check',
                },
                parameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'payment_method',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <transaction>\n{{#each data}}\n\t <payment_method>{{payment_method}}</payment_method>  <collected_at>{{collected_at}}</collected_at>  <amount_in_cents>{{amount_in_cents}}</amount_in_cents>  <description>{{description}}</description> </transaction>\n\n',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: 'enter_offline_payment_for_manual_invoice',
              },
              {
                name: 'Collect an Invoice',
                url: 'v2/invoices/:_invoice_number/collect',
                method: 'PUT',
                parameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'collect_an_invoice',
              },
              {
                name: 'Mark Invoice as Paid Successfully',
                url: 'v2/invoices/:_invoice_number/mark_successful',
                method: 'PUT',
                parameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: 'mark_invoice_as_paid_successfully',
              },
              {
                name: 'Mark Invoice as Failed Collection',
                url: 'v2/invoices/:_invoice_number/mark_failed',
                method: 'PUT',
                parameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'mark_invoice_as_failed_collection',
              },
              {
                name: 'Void a Credit Invoice',
                url: 'v2/invoices/:_invoice_number/void',
                method: 'PUT',
                parameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: 'void_a_credit_invoice',
              },
              {
                name: 'Edit Invoice',
                url: 'v2/invoices/:_invoice_number',
                method: 'PUT',
                sampleData: {
                  address: {
                    first_name: 'Verena',
                    last_name: 'Example',
                    name_on_account: 'Verena Example',
                    company: 'Verena Example LLC.',
                    address1: '123 Main St.',
                    city: 'San Francisco',
                    state: 'CA',
                    zip: '94105',
                    country: 'US',
                  },
                  po_number: '123 Main St.',
                  customer_notes: 'San Francisco',
                  terms_and_conditions: 'CA',
                  vat_reverse_charge_notes: '94105',
                  net_terms: '30',
                  gateway_code: 'abcde12345',
                },
                parameters: [
                  {
                    id: 'invoice_number',
                    name: 'invoice_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?> <invoice> {{#each data}} <net_terms>{{net_terms}}</net_terms>   <gateway_code>{{gateway_code}}</gateway_code><address><address1>{{address.address1}}</address1><first_name>{{address.first_name}}</first_name><last_name>{{address.last_name}}</last_name><name_on_account>{{address.name_on_account}}</name_on_account><company>{{address.company}}</company><city>{{address.city}}</city><state>{{address.state}}</state><zip>{{address.zip}}</zip><country>{{address.country}}</country> <terms_and_conditions>{{address.terms_and_conditions}}</terms_and_conditions><vat_reverse_charge_notes>{{address.vat_reverse_charge_notes}}</vat_reverse_charge_notes><po_number>{{address.po_number}}</po_number><customer_notes>{{address.customer_notes}}</customer_notes></address> {{/each}} </invoice>',
                ],
                id: 'edit_invoice',
              },
            ],
          },
          {
            id: 'adjustments',
            name: 'ADJUSTMENTS',
            sampleData: {
              shipping_address: [
                {
                  address1: '123 Main St.',
                  address2: 'Suite 101',
                  city: 'San Francisco',
                  company: 'Recurly Inc',
                  country: 'US',
                  email: 'verena@example.com',
                  first_name: 'Verena',
                  last_name: 'Example',
                  nickname: 'Work',
                  phone: '555-222-1212',
                  state: 'CA',
                  zip: '94105',
                },
                {
                  address1: '123 Fourth St.',
                  address2: 'Apt. 101',
                  city: 'San Francisco',
                  country: 'US',
                  email: 'verena@example.com',
                  first_name: 'Verena',
                  last_name: 'Example',
                  nickname: 'Home',
                  phone: '555-867-5309',
                  state: 'CA',
                  zip: '94105',
                },
              ],
              address: {
                address1: '123 Main St.',
                address2: '123 Main St123',
                city: 'San Francisco',
                country: 'US',
                state: 'CA',
                zip: '94105',
                phone: 1234,
              },
              account_acquisition: {
                cost_in_cents: '123 Main St.',
                currency: '123 Main St123',
                channel: 'San Francisco',
                subchannel: 'US',
                campaign: 'CA',
              },
              account_code: '1',
              tax_exempt: true,
              vat_number: true,
              preferred_locale: 'ES',
              accept_language: 'EN',
              entity_use_code: 'test',
              cc_emails: 'bob@example.com,susan@example.com',
              company_name: 'Recurly Inc',
              email: 'verena@example.com',
              first_name: 'Verena',
              last_name: 'Example',
              username: 'verena1234',
            },
            operations: [
              {
                name: 'Create Charge',
                url: 'v2/accounts/:_account_code/adjustments',
                method: 'POST',
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'currency',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><adjustment>{{#each data}} <uuid>{{uuid}}</uuid>   <state>{{state}}</state>   <description>{{description}}</description>   <accounting_code>{{accounting_code}}</accounting_code>   <product_code>{{product_code}}<product_code/>   <origin>{{origin}}</origin>   <unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents>   <quantity>{{quantity}}</quantity>   <discount_in_cents>{{discount_in_cents}}</discount_in_cents>   <tax_in_cents>{{tax_in_cents}}</tax_in_cents>   <total_in_cents>{{total_in_cents}}</total_in_cents>   <currency>{{currency}}</currency>   <proration_rate>{{proration_rate}}<proration_rate/>   <taxable>{{taxable}}</taxable>   <tax_exempt>{{tax_exempt}}</tax_exempt>   <tax_code>{{tax_code}}<tax_code/>   <start_date>{{start_date}}</start_date>   <end_date>{{end_date}}<end_date/>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   <revenue_schedule_type>{{revenue_schedule_type}}</revenue_schedule_type>   {{/each}}</adjustment>',
                ],
                id: 'create_charge',
              },
              {
                name: 'Create Credit',
                url: 'v2/accounts/:_account_code/adjustments',
                method: 'POST',
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'currency',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><adjustment>{{#each data}} <uuid>{{uuid}}</uuid>   <state>{{state}}</state>   <description>{{description}}</description>   <accounting_code>{{accounting_code}}</accounting_code>   <product_code>{{product_code}}<product_code/>   <origin>{{origin}}</origin>   <unit_amount_in_cents>{{unit_amount_in_cents}}</unit_amount_in_cents>   <quantity>{{quantity}}</quantity>   <discount_in_cents>{{discount_in_cents}}</discount_in_cents>   <tax_in_cents>{{tax_in_cents}}</tax_in_cents>   <total_in_cents>{{total_in_cents}}</total_in_cents>   <currency>{{currency}}</currency>   <proration_rate>{{proration_rate}}<proration_rate/>   <taxable>{{taxable}}</taxable>   <tax_exempt>{{tax_exempt}}</tax_exempt>   <tax_code>{{tax_code}}<tax_code/>   <start_date>{{start_date}}</start_date>   <end_date>{{end_date}}<end_date/>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   <revenue_schedule_type>{{revenue_schedule_type}}</revenue_schedule_type>   {{/each}}</adjustment>',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: 'create_credit',
              },
              {
                name: 'Delete Adjustment',
                url: 'v2/adjustments/:_uuid',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'uuid',
                    isIdentifier: true,
                    in: 'path',
                    required: true,
                  },
                ],
                id: 'delete_adjustment',
              },
            ],
          },
          {
            id: 'transactions',
            name: 'TRANSACTIONS',
            sampleData: {
              amount_in_cents: 'amount_in_cents',
              currency: 'currency',
              account: {
                account_code: 'account_code',
                billing_info: {
                  first_name: 'Verena',
                  last_name: 'Example',
                  address1: '123 Main St.',
                  city: 'San Francisco',
                  zip: '94105',
                  country: 'US',
                  number: '4111-1111-1111-1111',
                  verification_value: '123',
                  month: '11',
                  year: '2015',
                },
              },
            },
            operations: [
              {
                name: 'Create Transaction',
                url: 'v2/transactions',
                method: 'POST',
                parameters: [
                  {
                    id: 'uuid',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                requiredMappings: [
                  'currency',
                  'amount_in_cents',
                  'account',
                  'account_code',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><transaction>{{#each data}}   <amount_in_cents>{{amount_in_cents}}</amount_in_cents>   <currency>{{currency}}</currency>   <account>     <account_code>{{account_code}}</account_code>     <billing_info>       <first_name>{{billing_info.first_name}}</first_name>       <last_name>{{billing_info.last_name}}</last_name>       <address1>{{billing_info.address1}}</address1>       <city>{{billing_info.city}}</city>       <zip>{{billing_info.zip}}</zip>       <country>{{billing_info.country}}</country>       <number>{{billing_info.number}}</number>       <verification_value>{{billing_info.verification_value}}</verification_value>       <month>{{billing_info.month}}</month>       <year>{{billing_info.year}}</year>     </billing_info>   </account>   {{/each}}</transaction>',
                ],
                id: 'create_transaction',
              },
            ],
          },
          {
            id: 'account_acquisition',
            name: 'ACCOUNT ACQUISITION',
            sampleData: {
              account: [],
              cost_in_cents: '199',
              currency: 'USD',
              channel: 'blog',
              subchannel: 'Whitepaper Blog Post',
              campaign: 'mailchimp67a904de95.0914d8f4b4',
              created_at: '2016-08-12T19:45:14Z',
              updated_at: '2016-08-12T19:45:14Z',
            },
            operations: [
              {
                name: 'Create Account Acquisition',
                url: 'v2/accounts/:_account_code/acquisition',
                method: 'POST',
                parameters: [
                  {
                    id: 'account_code',
                    in: 'path',
                    name: 'account_code',
                    required: true,
                  },
                ],
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><account_acquisition>{{#each data}}   <cost_in_cents>{{cost_in_cents}}</cost_in_cents>   <currency>{{currency}}</currency>   <channel>{{channel}}</channel>   <subchannel>{{subchannel}}</subchannel>   <campaign>{{campaign}}</campaign>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</account_acquisition>',
                ],
                id: 'create_account_acquisition',
              },
              {
                name: 'Update Account Acquisition',
                url: 'v2/accounts/:_account_code/acquisition',
                method: 'PUT',
                parameters: [
                  {
                    id: 'account_code',
                    in: 'path',
                    name: 'account_code',
                    required: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?><account_acquisition>{{#each data}}   <cost_in_cents>{{cost_in_cents}}</cost_in_cents>   <currency>{{currency}}</currency>   <channel>{{channel}}</channel>   <subchannel>{{subchannel}}</subchannel>   <campaign>{{campaign}}</campaign>   <created_at>{{created_at}}</created_at>   <updated_at>{{updated_at}}</updated_at>   {{/each}}</account_acquisition>',
                ],
                ignoreEmptyNodes: true,
                id: 'update_account_acquisition',
              },
              {
                name: 'Clear Account Acquisition',
                url: 'v2/accounts/:_account_code/acquisition',
                method: 'DELETE',
                parameters: [
                  {
                    id: 'account_code',
                    in: 'path',
                    name: 'account_code',
                    required: true,
                  },
                ],
                id: 'clear_account_acquisition',
              },
            ],
          },
          {
            id: 'billing_info',
            name: 'BILLING INFO',
            operations: [
              {
                name: "Create Account's Billing Info (Token)",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'POST',
                sampleData: {
                  token_id: 'TOKEN_ID',
                },
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'token_id',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'token_id',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <billing_info>\n {{#each data}}\n\t    <token_id>{{token_id}}</token_id> {{/each}}\n\t </billing_info>',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: "create_account's_billing_info_(token)",
              },
              {
                name: "Create Account's Billing Info (Credit Card)",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'POST',
                sampleData: {
                  first_name: 'Verena',
                  last_name: 'Example',
                  address1: '123 Main St.',
                  address2: {
                    '@nil': 'nil',
                  },
                  city: 'San Francisco',
                  state: 'CA',
                  zip: '94105',
                  country: 'US',
                  number: '4111-1111-1111-1111',
                  verification_value: '123',
                  month: '11',
                  year: '2019',
                  ip_address: '127.0.0.1',
                },
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'first_name',
                  'last_name',
                  'number',
                  'month',
                  'year',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <billing_info>\n{{#each data}}\n\t   <first_name>{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <number>{{number}}</number>   <verification_value>{{verification_value}}</verification_value>   <month>{{month}}</month>   <year>{{year}}</year>   <ip_address>{{ip_address}}</ip_address>{{/each}}\n\t </billing_info>',
                ],
                id: "create_account's_billing_info_(credit_card)",
              },
              {
                name: "Create Account's Billing Info (Bank Account)",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'POST',
                sampleData: {
                  first_name: 'Verena',
                  last_name: 'Example',
                  address1: '123 Main St.',
                  address2: {
                    '@nil': 'nil',
                  },
                  city: 'San Francisco',
                  state: 'CA',
                  zip: '94105',
                  country: 'US',
                  account_number: 'd',
                  account_type: 'cdcv',
                  company: '94105',
                  phone: 'US',
                  vat_number: 'd',
                  routing_number: 'BA-0HS87238YB688345C',
                  ip_address: '127.0.0.1',
                },
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'account_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'name_on_account',
                  'routing_number',
                  'account_number',
                  'account_type',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <billing_info>\n{{#each data}}\n\t   <first_name>{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <routing_number>{{routing_number}}</routing_number>   <account_number>{{account_number}}</account_number>   <account_type>{{account_type}}</account_type><company>{{company}}</company><phone>{{phone}}</phone><vat_number>{{vat_number}}</vat_number> <ip_address>{{ip_address}}</ip_address>{{/each}}\n\t </billing_info>',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: "create_account's_billing_info_(bank_account)",
              },
              {
                name: "Create Account's Billing Info (External Token)",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'POST',
                sampleData: {
                  first_name: 'Verena',
                  last_name: 'Example',
                  address1: '123 Main St.',
                  address2: {
                    '@nil': 'nil',
                  },
                  city: 'San Francisco',
                  state: 'CA',
                  zip: '94105',
                  country: 'US',
                  paypal_billing_agreement_id: 'BA-0HS87238YB688345C',
                  ip_address: '127.0.0.1',
                },
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'first_name',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'first_name',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <billing_info>\n{{#each data}}\n\t   <first_name>{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <paypal_billing_agreement_id>{{paypal_billing_agreement_id}}</paypal_billing_agreement_id>   <ip_address>{{ip_address}}\n </ip_address>{{/each}}\n\t </billing_info>',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: "create_account's_billing_info_(external_token)",
              },
              {
                name: "Update Account's Billing Info (Token)",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'PUT',
                sampleData: {
                  token_id: 'TOKEN_ID',
                },
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <billing_info>\n {{#each data}}\n\t    <token_id>{{token_id}}</token_id> {{/each}}\n\t </billing_info>',
                ],
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'token_id',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'token_id',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: "update_account's_billing_info_(token)",
              },
              {
                name: "Update Account's Billing Info (Credit Card)",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'PUT',
                sampleData: {
                  first_name: 'Verena',
                  last_name: 'Example',
                  address1: '123 Main St.',
                  address2: {
                    '@nil': 'nil',
                  },
                  city: 'San Francisco',
                  state: 'CA',
                  zip: '94105',
                  country: 'US',
                  number: '4111-1111-1111-1111',
                  verification_value: '123',
                  month: '11',
                  year: '2019',
                  ip_address: '127.0.0.1',
                },
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <billing_info>\n{{#each data}}\n\t   <first_name>{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <number>{{number}}</number>   <verification_value>{{verification_value}}</verification_value>   <month>{{month}}</month>   <year>{{year}}</year>   <ip_address>{{ip_address}}</ip_address>{{/each}}\n\t </billing_info>',
                ],
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: "update_account's_billing_info_(credit_card)",
              },
              {
                name: "Update Account's Billing Info (Bank Account)",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'PUT',
                sampleData: {
                  first_name: 'Verena',
                  last_name: 'Example',
                  address1: '123 Main St.',
                  address2: {
                    '@nil': 'nil',
                  },
                  city: 'San Francisco',
                  state: 'CA',
                  zip: '94105',
                  country: 'US',
                  account_number: 'd',
                  account_type: 'cdcv',
                  routing_number: 'BA-0HS87238YB688345C',
                  ip_address: '127.0.0.1',
                },
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <billing_info>\n{{#each data}}\n\t   <first_name>{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <routing_number>{{routing_number}}</routing_number>   <account_number>{{account_number}}</account_number>   <account_type>{{account_type}}</account_type> <ip_address>{{ip_address}}</ip_address>{{/each}}\n\t </billing_info>',
                ],
                requiredMappings: [
                  'name_on_account',
                  'routing_number',
                  'account_number',
                  'account_type',
                ],
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'account_number',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: "update_account's_billing_info_(bank_account)",
              },
              {
                name: "Update Account's Billing Info (using external token)",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'PUT',
                sampleData: {
                  first_name: 'Verena',
                  last_name: 'Example',
                  address1: '123 Main St.',
                  address2: {
                    '@nil': 'nil',
                  },
                  city: 'San Francisco',
                  state: 'CA',
                  zip: '94105',
                  country: 'US',
                  paypal_billing_agreement_id: 'BA-0HS87238YB688345C',
                  ip_address: '127.0.0.1',
                },
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n <billing_info>\n{{#each data}}\n\t   <first_name>{first_name}}</first_name>   <last_name>{{last_name}}</last_name>   <address1>{{address1}}</address1>   <address2>{{address2}}</address2>   <city>{{city}}</city>   <state>{{state}}</state>   <zip>{{zip}}</zip>   <country>{{country}}</country>   <paypal_billing_agreement_id>{{paypal_billing_agreement_id}}</paypal_billing_agreement_id>   <ip_address>{{ip_address}}\n </ip_address>{{/each}}\n\t </billing_info>',
                ],
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    required: true,
                  },
                  {
                    id: 'first_name',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                requiredMappings: [
                  'first_name',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: "update_account's_billing_info_(using_external_token)",
              },
              {
                name: "Clear Account's Billing Info",
                url: 'v2/accounts/:_account_code/billing_info',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'account_code',
                    name: 'Account Code',
                    in: 'path',
                    isIdentifier: true,
                    required: true,
                  },
                ],
                id: "clear_account's_billing_info",
              },
            ],
          },
          {
            id: 'coupons',
            name: 'Coupons',
            sampleData: {
              redemptions: [],
              id: '2151093486799579392',
              coupon_code: 'special',
              name: 'Special 10% off',
              state: 'redeemable',
              description: [],
              discount_type: 'percent',
              discount_percent: '10',
              invoice_description: [],
              redeem_by_date: '2017-12-31T00:00:00Z',
              single_use: 'true',
              applies_for_months: [],
              max_redemptions: '200',
              applies_to_all_plans: 'false',
              created_at: '2016-07-11T18:50:17Z',
              updated_at: '2016-07-11T18:50:17Z',
              deleted_at: [],
              duration: 'single_use',
              temporal_unit: [],
              temporal_amount: [],
              applies_to_non_plan_charges: 'false',
              redemption_resource: 'account',
              max_redemptions_per_account: [],
              coupon_type: 'single_code',
              plan_codes: [
                'gold',
                'platinum',
              ],
            },
            operations: [
              {
                name: 'Create Coupon',
                url: 'v2/coupons',
                method: 'POST',
                parameters: [
                  {
                    id: 'coupon_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'coupon_code',
                  'name',
                  'discount_type',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n  <coupon>{{#each data}} <coupon_code>{{coupon_code}}</coupon_code>   <name>{{name}}</name>   <discount_type>{{discount_type}}</discount_type>     <discount_in_cents>     <USD>{{discount_in_cents.USD}}</USD>   </discount_in_cents>   <redeem_by_date>{{redeem_by_date}}</redeem_by_date>   <duration>{{duration}}</duration>   <temporal_unit>{{temporal_unit}}</temporal_unit>   <temporal_amount>temporal_amount</temporal_amount>   <max_redemptions>max_redemptions</max_redemptions>   <max_redemptions_per_account>{{max_redemptions_per_account}}</max_redemptions_per_account>   <applies_to_all_plans>{{applies_to_all_plans}}</applies_to_all_plans> {{each}} </coupon>',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: 'create_coupon',
              },
              {
                name: 'Generate Unique Codes',
                url: 'v2/coupons/:_coupon_code/generate',
                method: 'POST',
                parameters: [
                  {
                    id: 'coupon_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                requiredMappings: [
                  'number_of_unique_codes',
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n  <coupon>{{#each data}} <number_of_unique_codes>{{number_of_unique_codes}}</number_of_unique_codes> {{each}} </coupon>',
                ],
                supportIgnoreExisting: true,
                ignoreEmptyNodes: true,
                id: 'generate_unique_codes',
              },
              {
                name: 'Edit Coupon',
                url: 'v2/coupons/:_coupon_code',
                method: 'PUT',
                parameters: [
                  {
                    id: 'coupon_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n  <coupon>{{#each data}}   <name>{{name}}</name>   <description>{{description}}</description>   <invoice_description>{{invoice_description}}</invoice_description>   <redeem_by_date>{{redeem_by_date}}</redeem_by_date>   <max_redemptions>{{max_redemptions}}</max_redemptions>   <max_redemptions_per_account>{{max_redemptions_per_account}}</max_redemptions_per_account> {{each}} </coupon>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'edit_coupon',
              },
              {
                name: 'Restore Coupon',
                url: 'v2/coupons/:_coupon_code/restore',
                method: 'PUT',
                parameters: [
                  {
                    id: 'coupon_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n  <coupon>{{#each data}}   <name>{{name}}</name>   <description>{{description}}</description>   <invoice_description>{{invoice_description}}</invoice_description>   <redeem_by_date>{{redeem_by_date}}</redeem_by_date>   <max_redemptions>{{max_redemptions}}</max_redemptions>   <max_redemptions_per_account>{{max_redemptions_per_account}}</max_redemptions_per_account> {{each}} </coupon>',
                ],
                supportIgnoreMissing: true,
                ignoreEmptyNodes: true,
                id: 'restore_coupon',
              },
              {
                name: 'Create or Update Coupon',
                url: [
                  'v2/coupons/:_coupon_code',
                  'v2/coupons',
                ],
                method: [
                  'PUT',
                  'POST',
                ],
                requiredMappings: [
                  'coupon_code',
                  'name',
                  'discount_type',
                ],
                ignoreEmptyNodes: true,
                parameters: [
                  {
                    id: 'coupon_code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                body: [
                  '<?xml version="1.0" encoding="UTF-8"?>\n  <coupon>{{#each data}}   <name>{{name}}</name>   <description>{{description}}</description>   <invoice_description>{{invoice_description}}</invoice_description>   <redeem_by_date>{{redeem_by_date}}</redeem_by_date>   <max_redemptions>{{max_redemptions}}</max_redemptions>   <max_redemptions_per_account>{{max_redemptions_per_account}}</max_redemptions_per_account> {{each}} </coupon>',
                  '<?xml version="1.0" encoding="UTF-8"?>\n  <coupon>{{#each data}} <coupon_code>{{coupon_code}}</coupon_code>   <name>{{name}}</name>   <discount_type>{{discount_type}}</discount_type>     <discount_in_cents>     <USD>{{discount_in_cents.USD}}</USD>   </discount_in_cents>   <redeem_by_date>{{redeem_by_date}}</redeem_by_date>   <duration>{{duration}}</duration>   <temporal_unit>{{temporal_unit}}</temporal_unit>   <temporal_amount>temporal_amount</temporal_amount>   <max_redemptions>max_redemptions</max_redemptions>   <max_redemptions_per_account>{{max_redemptions_per_account}}</max_redemptions_per_account>   <applies_to_all_plans>{{applies_to_all_plans}}</applies_to_all_plans> {{each}} </coupon>',
                ],
                id: 'create_or_update_coupon',
              },
              {
                name: 'Expire Coupon',
                url: 'v2/coupons/:_coupon_code',
                method: 'DELETE',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'coupon_code',
                    name: 'Coupon Code',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
                id: 'expire_coupon',
              },
            ],
          },
        ],
      },
    ],
  },
};
const assistantData = {
  export: {
    versions: [
      {
        version: 'v1',
        resources: [
          {
            id: 'r1',
            endpoints: [
              {
                id: 'ep1',
                url: 'some/thing',
              },
              {
                url: 'some/unique/url',
              },
            ],
          },
          {
            id: 'r2',
            endpoints: [
              {
                id: 'ep1',
                url: 'some/thing',
              },
              {
                id: 'ep2',
                url: 'some/lists:_id/thing/:_action/some/other/:_action',
                pathParameters: [
                  {
                    id: 'id',
                    config: {
                      prefix: "(guid'",
                      suffix: "')",
                    },
                  },
                  {
                    id: 'action',
                  },
                ],
                paging: { pagingMethod: 'nextpageurl', nextPagePath: 'npp' },
              },
            ],
          },
        ],
      },
    ],
  },
};
const restAssistantData = {
  export: {
    labels: {
      version: 'API Version',
      resource: 'API Name',
      endpoint: 'Operation',
    },
    paging: {
      pagingMethod: 'pageargument',
      pageArgument: 'page',
    },
    urlResolution: [
      '/v3/customers',
      '/v3/customers/:_customerId',
    ],
    versions: [
      {
        version: 'v3',
        resources: [
          {
            id: 'customers',
            name: 'Customers',
            endpoints: [
              {
                url: '/v3/customers/:_customerId',
                name: 'Single customer based on ID',
                doesNotSupportPaging: true,
                resourcePath: '',
                pathParameters: [
                  {
                    id: 'customerId',
                    name: 'customer ID',
                    required: true,
                    fieldType: 'input',
                  },
                ],
              },
              {
                url: '/v3/customers',
                name: 'List of all customers',
                resourcePath: 'items',
                queryParameters: [
                  {
                    id: 'page',
                    name: 'Page',
                    description: '',
                    fieldType: 'input',
                  },
                  {
                    id: 'itemsInPage',
                    name: 'Items In Page',
                    description: '',
                    fieldType: 'input',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  import: {
    labels: {
      version: 'API Version',
    },
    urlResolution: [
      '/v3/contacts',
      '/v3/contacts/:_contactId',
      '/v3/contacts',
      '/v3/contacts/:_contactId',
    ],
    versions: [
      {
        version: 'v3',
        resources: [
          {
            id: 'contacts',
            name: 'Contacts',
            sampleData: {
              EndUserID: 8,
              CustomerID: 2,
              CustomerName: 'cust1',
              Firstname: null,
              Lastname: null,
              JobTitle: null,
              Email: 'cust1c@gmail.com',
              Phone: null,
              IsContactPerson: false,
              InIgnoreMode: false,
              CreatedOn: '2017-10-10T13:03:08Z',
              LastModified: '2017-10-10T13:03:08Z',
            },
            operations: [
              {
                id: 'create_contacts',
                url: '/v3/contacts',
                name: 'Create',
                method: 'POST',
                responseIdPath: '',
                successValues: [1, 2, 3, 4],
                supportIgnoreExisting: true,
                parameters: [
                  {
                    id: 'contactId',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
              {
                id: 'update_contacts',
                url: '/v3/contacts/:_contactId',
                name: 'Update',
                method: 'PUT',
                responseIdPath: '',
                supportIgnoreMissing: true,
                parameters: [
                  {
                    id: 'contactId',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
              {
                id: 'create_or_update_contacts',
                url: [
                  '/v3/contacts/:_contactId',
                  '/v3/contacts',
                ],
                name: 'Create or Update',
                method: [
                  'PUT',
                  'POST',
                ],
                responseIdPath: [
                  '',
                  '',
                ],
                parameters: [
                  {
                    id: 'contactId',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
              {
                id: 'delete_contacts',
                url: '/v3/contacts/:_contactId',
                name: 'Delete',
                method: 'DELETE',
                responseIdPath: '',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'contactId',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
            ],
          },
          {
            id: 'customers',
            name: 'Customers',
            sampleData: {
              CustomerID: 144,
              CustomerName: 'cust1',
              CreatedOn: '2017-10-09T10:57:39Z',
              LastModified: '2017-10-09T10:57:39Z',
              BusinessNumber: null,
              Domain: null,
              Address: null,
              City: null,
              State: null,
              Country: null,
              Phone: '9695965665',
              Fax: null,
              Notes: null,
              Logo: null,
              Links: null,
              Longitude: 0,
              Latitude: 0,
              ZipCodeStr: null,
            },
            operations: [
              {
                url: '/v3/customers',
                name: 'Create',
                method: 'POST',
                responseIdPath: '',
                supportIgnoreExisting: true,
                parameters: [
                  {
                    id: 'customerId',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
              {
                url: '/v3/customers/:_customerId',
                name: 'Update',
                method: 'PUT',
                responseIdPath: '',
                supportIgnoreMissing: true,
                parameters: [
                  {
                    id: 'customerId',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
              {
                url: [
                  '/v3/customers/:_customerId',
                  '/v3/customers',
                ],
                name: 'Create or Update',
                method: [
                  'PUT',
                  'POST',
                ],
                responseIdPath: [
                  '',
                  '',
                ],
                parameters: [
                  {
                    id: 'customerId',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
              {
                url: '/v3/customers/:_customerId',
                name: 'Delete',
                method: 'DELETE',
                responseIdPath: '',
                askForHowToGetIdentifier: true,
                parameters: [
                  {
                    id: 'customerId',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

describe('convertToExport', () => {
  const testCases = [
    [undefined, {}, undefined],
    [
      {
        '/assistant': 'someAssistant',
        '/assistantMetadata': {
          resource: 'r1',
          operation: 'ep1',
        },
        '/rest': {
          ...DEFAULT_PROPS.EXPORT.REST,
          method: 'GET',
          headers: [],
          relativeURI: 'some/thing',
          allowUndefinedResource: false,
        },
      },
      {
        adaptorType: 'rest',
        assistant: 'someAssistant',
        resource: 'r1',
        operation: 'ep1',
      },
      assistantData,
    ],
    [
      {
        '/assistant': 'someAssistant',
        '/assistantMetadata': {
          resource: 'r1',
          operationUrl: 'some/unique/url',
        },
        '/rest': {
          ...DEFAULT_PROPS.EXPORT.REST,
          method: 'GET',
          headers: [],
          relativeURI: 'some/unique/url',
          allowUndefinedResource: false,
        },
      },
      {
        adaptorType: 'rest',
        assistant: 'someAssistant',
        resource: 'r1',
        operation: 'some/unique/url',
        assistantData,
      },
      assistantData,
    ],
    [
      {
        '/assistant': 'someAssistant',
        '/assistantMetadata': {
          resource: 'r2',
          operation: 'ep2',
        },
        '/rest': {
          ...DEFAULT_PROPS.EXPORT.REST,
          method: 'GET',
          headers: [],
          relativeURI: "some/lists(guid'ABC')/thing/XYZ/some/other/XYZ",
          allowUndefinedResource: false,
          pagingMethod: 'nextpageurl',
          nextPagePath: 'npp',
        },
      },
      {
        adaptorType: 'rest',
        assistant: 'someAssistant',
        resource: 'r2',
        operation: 'ep2',
        pathParams: { id: 'ABC', action: 'XYZ' },
      },
      assistantData,
    ],
  ];

  each(testCases).test(
    'should return %o when assistantConfig =  %o and assistantData = %o',
    (expected, assistantConfig, assistantData) => {
      expect(convertToExport({ assistantConfig, assistantData })).toEqual(
        expected
      );
    }
  );
});
describe('routeToRegExp', () => {
  const testCases = [

    [/^\/v1\/connections(?:\?([\s\S]*))?$/, '/v1/connections'],
    [/^\/v1\/connections\/([^/?]+)(?:\?([\s\S]*))?$/, '/v1/connections/:_id'],
    [/^\/v1\/integrations\/([^/?]+)\/connections(?:\?([\s\S]*))?$/, '/v1/integrations/:_integrationId/connections'],
    [/^\/v1\/integrations(?:\?([\s\S]*))?$/, '/v1/integrations'],
    [/^\/v1\/integrations\/([^/?]+)(?:\?([\s\S]*))?$/, '/v1/integrations/:_id'],
    [/^\/v1\/integrations\/([^/?]+)\/exports(?:\?([\s\S]*))?$/, '/v1/integrations/:_integrationId/exports'],
  ];

  each(testCases).test(
    'should return %o when route = %o',
    (expected, route) => {
      expect(routeToRegExp(route)).toEqual(expected);
    }
  );
});

describe('extractParameters', () => {
  const testCases = [

    [[null], /^\/v1\/connections(?:\?([\s\S]*))?$/, '/v1/connections', '/v1/connections'],
    [[':_id', null], /^\/v1\/connections\/([^/?]+)(?:\?([\s\S]*))?$/, '/v1/connections/:_id', '/v1/connections/someConnectionId?some=thing&someThing=else'],
    [[':_integrationId', null], /^\/v1\/integrations\/([^/?]+)\/connections(?:\?([\s\S]*))?$/, '/v1/integrations/:_integrationId/connections', '/v1/integrations/someIntegrationId/connections'],
    [[null], /^\/v1\/integrations(?:\?([\s\S]*))?$/, '/v1/integrations', '/v1/integrations'],
    [[':_id', null], /^\/v1\/integrations\/([^/?]+)(?:\?([\s\S]*))?$/, '/v1/integrations/:_id', '/v1/integrations/someIntegrationId'],
    [[':_integrationId', null], /^\/v1\/integrations\/([^/?]+)\/exports(?:\?([\s\S]*))?$/, '/v1/integrations/:_integrationId/exports', '/v1/integrations/someIntegrationId/exports'],
    [[':_integrationId', null], /^\/v1\/integrations\/([^/?]+)\/exports(?:\?([\s\S]*))?$/, '/v1/integrations/:_integrationId/exports', '/v1/integrations/someIntegrationId/exports?some=:_thing&someThing=:_else'],

  ];

  each(testCases).test(
    'should return %o when route = %o',
    (expected, routeRegex, fragment, route) => {
      expect(extractParameters(routeRegex, fragment, route)).toEqual(expected);
    }
  );
});

describe('extractParameters', () => {
  const testCases = [

    [[null], /^\/v1\/connections(?:\?([\s\S]*))?$/, '/v1/connections', '/v1/connections'],
    [[':_id', null], /^\/v1\/connections\/([^/?]+)(?:\?([\s\S]*))?$/, '/v1/connections/:_id', '/v1/connections/someConnectionId?some=thing&someThing=else'],
    [[':_integrationId', null], /^\/v1\/integrations\/([^/?]+)\/connections(?:\?([\s\S]*))?$/, '/v1/integrations/:_integrationId/connections', '/v1/integrations/someIntegrationId/connections'],
    [[null], /^\/v1\/integrations(?:\?([\s\S]*))?$/, '/v1/integrations', '/v1/integrations'],
    [[':_id', null], /^\/v1\/integrations\/([^/?]+)(?:\?([\s\S]*))?$/, '/v1/integrations/:_id', '/v1/integrations/someIntegrationId'],
    [[':_integrationId', null], /^\/v1\/integrations\/([^/?]+)\/exports(?:\?([\s\S]*))?$/, '/v1/integrations/:_integrationId/exports', '/v1/integrations/someIntegrationId/exports'],
  ];

  each(testCases).test(
    'should return %o when route = %o',
    (expected, routeRegex, fragment, route) => {
      expect(extractParameters(routeRegex, fragment, route)).toEqual(expected);
    }
  );
});

describe('convertFromExport', () => {
  const testCases = [
    [{bodyParams: {}, exportType: undefined, operation: undefined, pathParams: {}, queryParams: {}, resource: undefined, version: undefined}, {}, undefined, ''],
    [
      {
        resource: 'r1',
        bodyParams: {},
        exportType: undefined,
        operation: 'ep1',

        operationDetails: {
          pathParameters: [],
          queryParameters: [],
          url: 'some/thing',
          headers: {},
          id: 'ep1',
        },
        pathParams: {},
        queryParams: {},

        version: 'v1',
      },
      {
        assistant: 'someAssistant',
        adaptorType: 'RESTExport',
        assistantMetadata: {
          resource: 'r1',
          operation: 'ep1',
          version: 'v1',
        },
        rest: {
          ...DEFAULT_PROPS.EXPORT.REST,
          method: 'GET',
          headers: [],
          relativeURI: 'some/thing',
          allowUndefinedResource: false,
        },
      },
      assistantData,
      'rest',
    ],
    [
      {
        bodyParams: {},
        exportType: undefined,
        pathParams: {},
        queryParams: {},

      },
      {
        assistant: 'someAssistant',
        adaptorType: 'RESTExport',
        assistantMetadata: {
          resource: 'r1',
          version: 'v1',
        },
        rest: {
          ...DEFAULT_PROPS.EXPORT.REST,
          method: 'GET',
          headers: [],
          relativeURI: 'some/thing',
          allowUndefinedResource: false,
        },
      },
      assistantData,
      'rest',
    ],
    [
      {
        bodyParams: {},
        exportType: undefined,
        operation: 'some/unique/url',
        operationDetails: {
          headers: {},
          pathParameters: [],
          queryParameters: [],
          url: 'some/unique/url',
        },
        pathParams: {},
        queryParams: {},
        resource: 'r1',
        version: 'v1',
      },
      {
        assistant: 'someAssistant',
        adaptorType: 'RESTExport',
        assistantMetadata: {
          resource: 'r1',
          operation: 'some/unique/url',
          version: 'v1',
        },
        rest: {
          ...DEFAULT_PROPS.EXPORT.REST,
          method: 'GET',
          headers: [],
          relativeURI: 'some/unique/url',
          allowUndefinedResource: false,
        },
      },
      assistantData,
      'rest',
    ],
    [
      {
        bodyParams: {},
        exportType: undefined,
        operation: 'ep2',
        operationDetails: {
          headers: {},
          id: 'ep2',
          paging: {
            nextPagePath: 'npp',
            pagingMethod: 'nextpageurl',
          },
          pathParameters: [
            {
              config: {
                prefix: "(guid'",
                suffix: "')",
              },
              id: 'id',
            },
            {
              id: 'action',
            },
          ],
          queryParameters: [],
          url: 'some/lists:_id/thing/:_action/some/other/:_action',
        },
        pathParams: {
          action: 'XYZ',
          id: 'ABC',
        },
        queryParams: {},
        resource: 'r2',
        version: 'v1',
      },
      {
        assistant: 'someAssistant',
        adaptorType: 'RESTExport',
        assistantMetadata: {
          resource: 'r2',
          operation: 'ep2',
          version: 'v1',
        },
        rest: {
          ...DEFAULT_PROPS.EXPORT.REST,
          method: 'GET',
          headers: [],
          relativeURI: "some/lists(guid'ABC')/thing/XYZ/some/other/XYZ",
          allowUndefinedResource: false,
          pagingMethod: 'nextpageurl',
          nextPagePath: 'npp',
        },
      },
      assistantData,
      'rest',
    ],
  ];

  each(testCases).test(
    'should return %o when exportDoc =  %o and assistantData = %o and adaptorType = %o',
    (expected, exportDoc, assistantData, adaptorType) => {
      expect(convertFromExport({ exportDoc, assistantData, adaptorType })).toEqual(
        expected
      );
    }
  );
});
describe('convertFromImport', () => {
  const testCases = [
    [{bodyParams: {}, pathParams: {}, queryParams: {}}, {}, undefined, ''],
    [{bodyParams: {}, pathParams: {}, queryParams: {}}, {}, restAssistantData, ''],
    [{bodyParams: {}, pathParams: {}, queryParams: {}}, {adaptorType: 'RESTImport',
      assistant: 'atera',
      name: 'Atera Latest',
      _connectionId: 'connId',
      _id: 'id'}, restAssistantData, 'rest'],

    [{bodyParams: {},
      resource: 'contacts',
      version: 'v3',
      lookupType: 'source',
      operation: 'create_or_update_contacts',
      operationDetails: {
        headers: {},
        howToFindIdentifier: {},
        id: 'create_or_update_contacts',
        method: [
          'PUT',
          'POST',
        ],
        name: 'Create or Update',
        parameters: [
          {
            id: 'contactId',
            in: 'path',
            isIdentifier: true,
            required: true,
          },
        ],
        pathParameters: [],
        queryParameters: [],
        responseIdPath: [
          '',
          '',
        ],
        sampleData: {
          CreatedOn: '2017-10-10T13:03:08Z',
          CustomerID: 2,
          CustomerName: 'cust1',
          Email: 'cust1c@gmail.com',
          EndUserID: 8,
          Firstname: null,
          InIgnoreMode: false,
          IsContactPerson: false,
          JobTitle: null,
          LastModified: '2017-10-10T13:03:08Z',
          Lastname: null,
          Phone: null,
        },
        url: [
          '/v3/contacts/:_contactId',
          '/v3/contacts',
        ],
      },
      pathParams: {
        contactId: 'id',
      },
      queryParams: {}}, {
      name: 'Atera Latest1',

      distributed: false,
      apiIdentifier: '***',
      assistant: 'atera',
      assistantMetadata: {
        resource: 'contacts',
        version: 'v3',
        operation: 'create_or_update_contacts',

      },

      http: {
        relativeURI: [
          '/v3/contacts/{{{id}}}',
          '/v3/contacts',
        ],
        method: [
          'PUT',
          'POST',
        ],
        body: [
          null,
          null,
        ],
        headers: [

        ],
        batchSize: 1,
        ignoreExtract: 'id',
        requestMediaType: 'json',
        successMediaType: 'json',
        errorMediaType: 'json',
        requestType: [
          'UPDATE',
          'CREATE',
        ],
        strictHandlebarEvaluation: true,
        sendPostMappedData: true,

      },
      rest: {
        relativeURI: [
          '/v3/contacts/{{{id}}}',
          '/v3/contacts',
        ],
        method: [
          'PUT',
          'POST',
        ],
        body: [
          null,
          null,
        ],
        headers: [

        ],
        ignoreExtract: 'id',
        requestType: [
          'UPDATE',
          'CREATE',
        ],
      },
      adaptorType: 'RESTImport',

    }, restAssistantData, 'rest'],

    [
      {bodyParams: {},
        resource: 'contacts',
        version: 'v3',
        lookupType: 'source',
        operation: 'delete_contacts',
        operationDetails: {
          askForHowToGetIdentifier: true,
          headers: {},
          howToFindIdentifier: {},
          id: 'delete_contacts',
          method: 'DELETE',
          name: 'Delete',
          parameters: [
            {
              id: 'contactId',
              in: 'path',
              isIdentifier: true,
              required: true,
            },
          ],
          pathParameters: [],
          queryParameters: [],
          responseIdPath: '',
          sampleData: {
            CreatedOn: '2017-10-10T13:03:08Z',
            CustomerID: 2,
            CustomerName: 'cust1',
            Email: 'cust1c@gmail.com',
            EndUserID: 8,
            Firstname: null,
            InIgnoreMode: false,
            IsContactPerson: false,
            JobTitle: null,
            LastModified: '2017-10-10T13:03:08Z',
            Lastname: null,
            Phone: null,
          },
          url: '/v3/contacts/:_contactId',
        },
        pathParams: {
          contactId: 'id',
        },
        queryParams: {}}, {
        name: 'Atera Latest1',

        distributed: false,
        apiIdentifier: '***',
        assistant: 'atera',
        assistantMetadata: {
          resource: 'contacts',
          version: 'v3',
          operation: 'delete_contacts',

        },

        http: {
          relativeURI: [
            '/v3/contacts/{{{id}}}',
          ],
          method: [
            'DELETE',
          ],

          batchSize: 1,
          ignoreExtract: 'id',
          requestMediaType: 'json',
          successMediaType: 'json',
          errorMediaType: 'json',

          strictHandlebarEvaluation: true,
          sendPostMappedData: true,
        },
        rest: {
          relativeURI: [
            '/v3/contacts/{{{id}}}',
          ],
          method: [
            'DELETE',
          ],

          ignoreExtract: 'id',

        },
        adaptorType: 'RESTImport',

      }, restAssistantData, 'rest'],

  ];

  each(testCases).test(
    'should return %o when importDoc =  %o and assistantData = %o and adaptorType = %o',
    (expected, importDoc, assistantData, adaptorType) => {
      expect(convertFromImport({ importDoc, assistantData, adaptorType })).toEqual(
        expected
      );
    }
  );
});

describe('convertToImport', () => {
  const testCases = [
    [undefined, {}, undefined],
    [{'/assistant': 'atera', '/assistantMetadata': {lookups: {}, operation: 'create_contacts', resource: 'contacts', version: 'v3'}, '/file': undefined, '/ignoreExisting': false, '/ignoreMissing': false, '/rest': {body: [null], headers: [], ignoreExisting: false, ignoreExtract: undefined, ignoreLookupName: undefined, ignoreMissing: false, lookups: [], method: ['POST'], relativeURI: ['/v3/contacts'], responseIdPath: [''], successPath: [undefined], successValues: [1, 2, 3, 4]}}, {
      adaptorType: 'rest',
      assistant: 'atera',
      ignoreExisting: false,
      ignoreMissing: undefined,
      lookupQueryParams: undefined,
      lookupType: '',
      lookups: [],
      operation: 'create_contacts',
      pathParams: {contactId: ''},
      resource: 'contacts',
      version: 'v3',
    }, restAssistantData],
    [{
      '/assistant': 'atera',
      '/assistantMetadata': {
        lookups: {},
        operation: 'create_or_update_contacts',
        resource: 'contacts',
        version: 'v3',
      },
      '/file': undefined,
      '/ignoreExisting': false,
      '/ignoreMissing': false,
      '/rest': {
        body: [
          null,
          null,
        ],
        headers: [],
        ignoreExisting: false,
        ignoreExtract: 'id',
        ignoreLookupName: undefined,
        ignoreMissing: false,
        lookups: [],
        method: [
          'PUT',
          'POST',
        ],
        relativeURI: [
          '/v3/contacts/{{{id}}}',
          '/v3/contacts',
        ],
        requestType: [
          'UPDATE',
          'CREATE',
        ],
        responseIdPath: [
          '',
          '',
        ],

      },
    }, {
      adaptorType: 'rest',
      assistant: 'atera',
      lookupType: 'source',
      lookups: {},
      operation: 'create_or_update_contacts',
      pathParams: {contactId: 'id'},
      resource: 'contacts',
      version: 'v3',
    }, restAssistantData],
    [{
      '/assistant': 'atera',
      '/assistantMetadata': {
        lookups: {},
        operationUrl: ':',
        resource: 'customers',
        version: 'v3',
      },
      '/ignoreExisting': false,
      '/ignoreMissing': false,
      '/rest': {
        body: [
          null,
        ],
        headers: [],
        ignoreExisting: false,
        ignoreExtract: undefined,
        ignoreLookupName: undefined,
        ignoreMissing: false,
        lookups: [],
        method: [
          undefined,
        ],
        relativeURI: [
          undefined,
        ],
        responseIdPath: [
          undefined,
        ],
        successPath: [
          undefined,
        ],
        successValues: [
          undefined,
        ],
      },
    }, {adaptorType: 'rest',
      assistant: 'atera',
      lookupType: 'source',
      lookups: '',
      operation: 'delete_customers',
      pathParams: {customerId: 'id1'},
      resource: 'customers',
      version: 'v3'}, restAssistantData],
    [{
      '/assistant': 'recurly',
      '/assistantMetadata': {
        lookups: {

        },
        operation: 'update_account',
        resource: 'accounts',
        version: 'v2.13',
      },

      '/http': {
        body: ['<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n'],
        errorMediaType: 'xml',
        headers: [
          {
            name: 'X-Api-Version',
            value: '2.13',
          },
        ],
        ignoreEmptyNodes: true,
        ignoreExisting: false,
        ignoreExtract: 'id',
        ignoreMissing: false,
        lookups: [

        ],
        method: [
          'PUT',
        ],
        relativeURI: [
          'v2/accounts/{{{data.0.id}}}',
        ],
        requestMediaType: 'xml',
        response: {
          resourceIdPath: undefined,
          successPath: undefined,
        },
        strictHandlebarEvaluation: false,
        successMediaType: 'xml',
      },
      '/ignoreExisting': false,
      '/ignoreMissing': true,
    }, {adaptorType: 'http',
      assistant: 'recurly',
      ignoreMissing: true,
      lookupQueryParams: undefined,
      lookupType: 'source',
      lookups: '',
      operation: 'update_account',
      pathParams: {account_code: 'id'},
      resource: 'accounts',
      version: 'v2.13'}, httpRecurlyData],
    [{
      '/assistant': 'recurly',
      '/assistantMetadata': {
        lookups: {

        },
        operation: 'create_or_update',
        resource: 'accounts',
        version: 'v2.13',
      },

      '/http': {
        body: ['<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n'],
        errorMediaType: 'xml',
        headers: [
          {
            name: 'X-Api-Version',
            value: '2.13',
          },
        ],
        ignoreExisting: false,
        ignoreExtract: 'idd',
        ignoreMissing: false,
        lookups: [

        ],
        method: [
          'PUT',
          'POST',
        ],
        relativeURI: [
          'v2/accounts/{{{data.0.idd}}}',
          'v2/accounts',
        ],
        requestType: [
          'UPDATE',
          'CREATE',
        ],
        requestMediaType: 'xml',
        response: {
          resourceIdPath: undefined,
          successPath: undefined,
        },
        strictHandlebarEvaluation: false,
        successMediaType: 'xml',
      },
      '/ignoreExisting': false,
      '/ignoreMissing': false,

    }, {adaptorType: 'http',
      assistant: 'recurly',
      lookupType: 'source',
      lookups: '',
      operation: 'create_or_update',
      pathParams: {account_code: 'idd'},
      resource: 'accounts',
      version: 'v2.13'}, httpRecurlyData],
    [{
      '/assistant': 'recurly',
      '/assistantMetadata': {
        lookups: {},
        operation: 'create_account',
        resource: 'accounts',
        version: 'v2.13',
      },

      '/http': {
        body: ['<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n'],
        errorMediaType: 'xml',
        headers: [
          {
            name: 'X-Api-Version',
            value: '2.13',
          },
        ],
        ignoreEmptyNodes: true,
        ignoreExisting: false,
        ignoreMissing: false,
        ignoreLookupName: 'account_code',
        lookups: [{id: 'lid',
          name: 'lp1' }, {
          extract: 'accounts[0].id',
          method: 'GET',
          name: 'account_code',
          postBody: '',
          relativeURI: 'undefined?state=active',
        }],
        method: [
          'POST',
        ],
        relativeURI: [
          'v2/accounts',
        ],
        requestMediaType: 'xml',
        response: {
          resourceIdPath: undefined,
          successPath: undefined,
        },
        strictHandlebarEvaluation: false,
        successMediaType: 'xml',
      },
      '/ignoreExisting': true,
      '/ignoreMissing': false,

    }, {adaptorType: 'http',
      assistant: 'recurly',
      lookupType: 'lookup',
      ignoreExisting: true,
      lookups: [{name: 'lp1', id: 'lid'}],
      lookupQueryParams: {
        state: 'active',
      },
      operation: 'create_account',
      pathParams: {account_code: 'idd'},
      resource: 'accounts',
      version: 'v2.13'}, httpRecurlyData],
    [{
      '/assistant': 'recurly',
      '/assistantMetadata': {
        lookups: {

        },
        operation: 'create_account',
        resource: 'accounts',
        version: 'v2.13',
      },

      '/http': {
        errorMediaType: 'xml',
        body: ['<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n'],

        headers: [{
          name: 'X-Api-Version',
          value: '2.13',
        },
        ],
        ignoreExisting: false,
        ignoreMissing: false,
        ignoreEmptyNodes: true,
        lookups: [

        ],
        method: [
          'POST',
        ],
        relativeURI: [
          'v2/accounts',
        ],
        requestMediaType: 'xml',
        response: {
          resourceIdPath: undefined,
          successPath: undefined,
        },
        strictHandlebarEvaluation: false,
        successMediaType: 'xml',
      },
      '/ignoreExisting': false,
      '/ignoreMissing': false,

    }, {adaptorType: 'http',
      assistant: 'recurly',
      lookupType: 'source',
      lookups: '',
      operation: 'POST:v2/accounts',
      pathParams: {account_code: 'idd'},
      resource: 'accounts',
      version: 'v2.13'}, httpRecurlyData],
    [{
      '/assistant': 'recurly',
      '/assistantMetadata': {
        lookups: {

        },
        operation: 'create_or_update',
        resource: 'accounts',
        version: 'v2.13',
      },

      '/http': {
        body: ['<?xml version="1.0" encoding="UTF-8"?>\n<account>\n{{#each data}}\n\t<account_code>{{account_code}}</account_code>\n\t<email>{{email}}</email>\n\t<first_name>{{first_name}}</first_name>\n\t<last_name>{{last_name}}</last_name>\n\t<username>{{username}}</username>\n\t<cc_emails>{{cc_emails}}</cc_emails>\n\t<company_name>{{company_name}}</company_name>\n\t<vat_number>{{vat_number}}</vat_number>\n\t<tax_exempt>{{tax_exempt}}</tax_exempt>\n\t<entity_use_code>{{entity_use_code}}</entity_use_code>\n\t<accept_language>{{accept_language}}</accept_language>\n\t<preferred_locale>{{preferred_locale}}</preferred_locale>\n\t<address>\n\t\t<address1>{{address.address1}}</address1>\n\t\t<address2>{{address.address2}}</address2>\n\t\t<city>{{address.city}}</city>\n\t\t<state>{{address.province}}</state>\n\t\t<zip>{{address.zip}}</zip>\n\t\t<country>{{address.country}}</country>\n\t\t<phone>{{address.phone}}</phone>\n\t</address>\n\t<account_acquisition>\n\t\t<cost_in_cents>{{account_acquisition.cost_in_cents}}</cost_in_cents>\n\t\t<currency>{{account_acquisition.currency}}</currency>\n\t\t<channel>{{account_acquisition.channel}}</channel>\n\t\t<subchannel>{{account_acquisition.subchannel}}</subchannel>\n\t\t<campaign>{{account_acquisition.campaign}}</campaign>\n\t</account_acquisition>\n\t<shipping_addresses>\n      {{#each shipping_address}}\n\t\t<shipping_address>\n\t\t\t<nickname>{{nickname}}</nickname>\n\t\t\t<first_name>{{first_name}}</first_name>\n\t\t\t<last_name>{{last_name}}</last_name>\n\t\t\t<company>{{company}}</company>\n\t\t\t<phone>{{phone}}</phone>\n\t\t\t<email>{{email}}</email>\n\t\t\t<address1>{{address1}}</address1>\n\t\t\t<address2>{{address2}}</address2>\n\t\t\t<city>{{city}}</city>\n\t\t\t<state>{{state}}</state>\n\t\t\t<zip>{{zip}}</zip>\n\t\t\t<country>{{country}}</country>\n\t\t</shipping_address>\n      {{/each}}\n\t</shipping_addresses>\n\t<billing_info>\n\t\t<first_name>{{billing_info.first_name}}</first_name>\n\t\t<last_name>{{billing_info.last_name}}</last_name>\n\t\t<company>{{billing_info.company}}</company>\n\t\t<address1>{{billing_info.address1}}</address1>\n\t\t<address2>{{billing_info.address2}}</address2>\n\t\t<city>{{billing_info.city}}</city>\n\t\t<state>{{billing_info.state}}</state>\n\t\t<zip>{{billing_info.zip}}</zip>\n\t\t<country>{{billing_info.country}}</country>\n\t\t<phone>{{billing_info.phone}}</phone>\n\t\t<vat_number>{{billing_info.vat_number}}</vat_number>\n\t\t<year type="integer">{{billing_info.year}}</year>\n\t\t<month type="integer">{{billing_info.month}}</month>\n\t</billing_info>\n{{/each}}\n</account>\n\n'],
        errorMediaType: 'xml',
        headers: [
          {
            name: 'X-Api-Version',
            value: '2.13',
          },
        ],
        ignoreExisting: false,
        ignoreExtract: 'idd',
        ignoreMissing: false,
        lookups: [

        ],
        method: [
          'PUT',
          'POST',
        ],
        relativeURI: [
          'v2/accounts/{{{data.0.idd}}}',
          'v2/accounts',
        ],
        requestType: [
          'UPDATE',
          'CREATE',
        ],
        requestMediaType: 'xml',
        response: {
          resourceIdPath: undefined,
          successPath: undefined,
        },
        strictHandlebarEvaluation: false,
        successMediaType: 'xml',
      },
      '/ignoreExisting': false,
      '/ignoreMissing': false,

    }, {adaptorType: 'http',
      assistant: 'recurly',
      lookupType: 'source',
      lookups: '',
      operation: 'PUT:POST:v2/accounts/:_account_code:v2/accounts',
      pathParams: {account_code: 'idd'},
      resource: 'accounts',
      version: 'v2.13'}, httpRecurlyData],
  ];

  each(testCases).test(
    'should return %o when assistantConfig =  %o and assistantData = %o',
    (expected, assistantConfig, assistantData) => {
      expect(convertToImport({ assistantConfig, assistantData })).toEqual(
        expected
      );
    }
  );
});

