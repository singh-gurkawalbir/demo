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
} from './';

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
  let testCases = [
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
          },
          f1: {
            id: 'f1',
            name: 'f1',
            type: 'textwithflowsuggestion',
            showLookup: false,
            required: false,
            readOnly: false,
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
          },
          id_readOnly2: {
            id: 'id_readOnly2',
            name: 'id_readOnly2',
            readOnly: true,
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
          },
          id_textarea: {
            id: 'id_textarea',
            label: 'Text Area',
            name: 'id_textarea',
            required: false,
            readOnly: false,
            type: 'textarea',
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
            // defaultValue: 121,
          },
          'id_some/thing': {
            id: 'id_some/thing',
            name: 'id_some/thing',
            required: false,
            readOnly: false,
            type: 'textwithflowsuggestion',
            showLookup: false,
            // defaultValue: 'something else',
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
          },
          id_readOnly2: {
            id: 'id_readOnly2',
            name: 'id_readOnly2',
            readOnly: true,
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
          },
          id_textarea: {
            id: 'id_textarea',
            label: 'Text Area',
            name: 'id_textarea',
            required: false,
            readOnly: false,
            type: 'textarea',
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
        value: {},
      },
    ],
  ];

  testCases = [testCases[testCases.length - 1]];

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
