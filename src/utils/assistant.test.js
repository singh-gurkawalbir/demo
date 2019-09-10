/* global describe,  expect */
import each from 'jest-each';
import {
  getMatchingRoute,
  mergeHeaders,
  mergeQueryParameters,
  getExportVersionAndResource,
  getVersionDetails,
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
