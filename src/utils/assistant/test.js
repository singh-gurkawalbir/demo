/* global describe,test  expect */
import each from 'jest-each';
import recurly from './recurly';
import servicenow from './servicenow';
import restAssistantData from './restAssistantData';
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
  isMetaRequiredValuesMet,
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
        ignoreExisting: false,
        ignoreMissing: false,
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
          ignoreExisting: false,
          ignoreMissing: false,
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
    [
      {bodyParams: {},
        resource: 'contacts',
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
    [{bodyParams: {},
      resource: 'contacts',
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
    [{ bodyParams: {},
      operation: 'create_or_update_cont',
      pathParams: {},
      queryParams: {},
      resource: undefined,
      sampleData: undefined,
      version: undefined}, {
      name: 'Atera Latest1',

      distributed: false,
      apiIdentifier: '***',
      assistant: 'atera',
      assistantMetadata: {
        operation: 'create_or_update_cont',
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
      version: 'v2.13'}, recurly],
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
      version: 'v2.13'}, recurly],
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
      version: 'v2.13'}, recurly],
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
      version: 'v2.13'}, recurly],
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
      version: 'v2.13'}, recurly],
    [{'/assistant': 'servicenow', '/assistantMetadata': {lookups: {sys_id: {operation: 'get_contact'}}, operation: 'create_contact', resource: 'contact', version: 'latest'}, '/file': undefined, '/ignoreExisting': true, '/ignoreMissing': false, '/rest': {body: [null], headers: [], ignoreExisting: false, ignoreExtract: undefined, ignoreLookupName: 'sys_id', ignoreMissing: false, lookups: [{extract: 'result[0].sys_id', method: 'GET', name: 'sys_id', postBody: '', relativeURI: '/api/now/contact?sysparm_query=abc&sysparm_display_value=false&sysparm_exclude_reference_link=false&sysparm_fields=sys_id&sysparm_view=asdsa'}], method: ['POST'], relativeURI: ['/api/now/contact'], responseIdPath: [undefined], successPath: [undefined], successValues: [undefined]}}, {adaptorType: 'rest',
      assistant: 'servicenow',
      ignoreExisting: true,
      ignoreMissing: undefined,
      lookupQueryParams: {sysparm_query: 'abc', sysparm_display_value: 'false', sysparm_exclude_reference_link: 'false', sysparm_fields: 'sys_id', sysparm_view: 'asdsa'},
      lookupType: 'lookup',
      lookups: '',
      operation: 'create_contact',
      pathParams: {sys_id: ''},
      resource: 'contact',
      version: 'latest'}, servicenow],
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

describe('isMetaRequiredValuesMet', () => {
  test('should return true for invalidMeta', () => {
    expect(isMetaRequiredValuesMet({}, null)).toEqual(true);
  });
  test('should return true for for no fields having required meta', () => {
    expect(isMetaRequiredValuesMet({fields: [{id: 'something.a'}, {id: 'something.b'}]}, null)).toEqual(true);
  });
  test('should return false for for satisfied required fields', () => {
    expect(isMetaRequiredValuesMet({fields: [{id: 'something.a', required: true}, {id: 'something.b', required: true}]}, {something: {
      a: 'val1', b: 'val2',
    }})).toEqual(true);
  });

  test('should return true for for unsatisfied required fields', () => {
    expect(isMetaRequiredValuesMet({fields: [{id: 'something.a', required: true}, {id: 'something.b', required: true}]}, {something: {
      a: 'val1',
    }})).toEqual(false);
  });
});
