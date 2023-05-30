
import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { getDataTypeDefaultValue, resourceConflictResolution, constructResourceFromFormValues, convertResourceFieldstoSampleData, getHTTPConnectorMetadata, updateFinalMetadataWithHttpFramework, getEndpointResourceFields, updateWebhookFinalMetadataWithHttpFramework } from './index';
import { createFormValuesPatchSet } from '../resourceForm';
import { selectors } from '../../reducers';
import getResourceFormAssets from '../../forms/formFactory/getResourceFromAssets';

jest.mock('../../forms/formFactory/getResourceFromAssets');

// fake the return value of getResourceFormAssets when createFormValuesPatchSet calls this fn
getResourceFormAssets.mockReturnValue({fieldMap: {field1: {fieldId: 'something'}}, preSave: null});

describe('resourceConflictResolution', () => {
  /*
    Some background to these test cases:

    master: this refers to the local unaltered copy of a record
    origin: this refers to the latest copy of that record from the server
    merged: this refers to local changes on top of master

    */

  const master = {
    a: '1',
    b: '2',
    lastModified: 12,
  };
  const alteredMerged = {
    a: '1',
    b: '3',
    lastModified: 12,
  };
  const unalteredOrigin = {
    a: '1',
    b: '2',
    lastModified: 14,
  };
  const alteredOrigin = {
    a: '0',
    b: '2',
    lastModified: 14,
  };

  test('should return no conflict when master and origin hasn`t changed', () => {
    const result = resourceConflictResolution({
      merged: alteredMerged,
      master,
      origin: master,
    });

    expect(result).toEqual({
      conflict: null,

      merged: alteredMerged,
    });
  });

  test('should return no conflict and return staged changes(TODO:ask Dave if correct), when master and origin has changed but their mutual values are identical', () => {
    const result = resourceConflictResolution({
      merged: alteredMerged,
      master,
      origin: unalteredOrigin,
    });

    expect(result).toEqual({
      conflict: null,

      merged: alteredMerged,
    });
  });

  test('should return no conflict and return origin when they are no staged changes', () => {
    const result = resourceConflictResolution({
      master,
      merged: master,
      origin: alteredOrigin,
    });

    expect(result).toEqual({
      conflict: null,

      merged: alteredOrigin,
    });
  });

  describe('when mutual properties of merged and origin has changed', () => {
    const master = {
      a: '1',
      b: '2',

      lastModified: 12,
    };
    const alteredMerged = {
      a: '1',
      b: '3',
      d: '7',
      lastModified: 12,
    };
    const alteredOrigin = {
      a: '2',
      b: '2',
      c: '4',
      lastModified: 14,
    };
    const unresolvableMerged = {
      a: '4',
      b: '3',
      lastModified: 12,
    };
    const unresolvableMergedWithDelete = {
      b: '3',
      lastModified: 12,
    };

    test('should return no conflict with merged incorporating staged changes over origin changes, when master and origin has changed', () => {
      const result = resourceConflictResolution({
        master,
        merged: alteredMerged,
        origin: alteredOrigin,
      });
      const resolvedMerged = {
        a: '2',
        b: '3',
        c: '4',
        d: '7',
        lastModified: 14,
      };

      // i apply automatic resolution when staged and master hasn't changed..then i incorporate origin changes

      expect(result).toEqual({
        conflict: null,

        merged: resolvedMerged,
      });
    });
    test('should return a conflict when master and origin has changes which are unresolvable', () => {
      const result = resourceConflictResolution({
        master,
        merged: unresolvableMerged,
        origin: alteredOrigin,
      });
      // in this case staged has changes....and i cannot apply any automatic resolution changes ..since i have staged some changes which are completely different
      const conflictPatches = [{ op: 'replace', path: '/a', value: '4' }];

      expect(result).toEqual({
        conflict: conflictPatches,
        merged: null,
      });
    });
    test('should return a conflict when master and origin has changes which are unresolvable and they are delete attempts', () => {
      const result = resourceConflictResolution({
        master,
        merged: unresolvableMergedWithDelete,
        origin: alteredOrigin,
      });
      const conflictPatches = [{ op: 'remove', path: '/a' }];

      expect(result).toEqual({
        conflict: conflictPatches,
        merged: null,
      });
    });
  });
});

describe('constructResourceFromFormValues saga', () => {
  test('should call createFormValuesPatchSet to get resource patchSet', () => {
    const resourceId = '123';
    const resourceType = 'imports';
    const formValues = [];

    expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    })
      .call.fn(createFormValuesPatchSet)
      .run();
  });

  test('should return combined document if resource has active patch set', () => {
    const resourceId = '123';
    const resourceType = 'imports';
    const formValues = [];
    const merged = {
      description: 'abc',
    };
    const patchSet = [
      {
        op: 'add',
        path: '/patchKey',
        value: 'patchValue',
      },
    ];

    const expectedOutput = {
      description: 'abc',
      patchKey: 'patchValue',
    };

    expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    })
      .provide([
        [select(selectors.resourceData, 'imports', resourceId), { merged }],
        [matchers.call.fn(createFormValuesPatchSet), {patchSet}],
      ])
      .returns(expectedOutput)
      .run();
  });

  test('should return empty object if invalid patchSet or resource is passed', () => {
    const resourceId = '123';
    const resourceType = 'imports';
    const formValues = [];
    const merged = {
      description: 'abc',
    };
    const patchSet = [
      {
        op: 'invalid',
        path: '/patchKey',
        value: 'patchValue',
      },
    ];

    expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    })
      .provide([
        [select(selectors.resourceData, 'imports', resourceId), { merged }],
        [matchers.call.fn(createFormValuesPatchSet), {patchSet}],
      ])
      .returns({})
      .run();
  });

  test('should return empty object if resource id is undefined', () => {
    const resourceType = 'imports';
    const formValues = [];

    expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceType,
    })
      .returns({})
      .run();
  });
});
describe('convertResourceFieldstoSampleData', () => {
  const input1 = [
    {
      id: 'address',
      dataType: 'object',
      resourceFields: [
        {
          id: 'address1',
          dataType: 'string',
        },
        {
          id: 'address2',
          dataType: 'number',
        },
        {
          id: 'address3',
          dataType: 'boolean',
        },
        {
          id: 'address4',
          dataType: 'stringarray',
        },
        {
          id: 'address5',
          dataType: 'numberarray',
        },
        {
          id: 'address5',
          dataType: 'booleanarray',
        },
        {
          id: 'address5',
          dataType: 'objectarray',
        },
        {
          id: 'address5',
          dataType: 'object',
        },
        {
          id: 'original_shipping_lines',
          dataType: 'objectarray',
          resourceFields: [
            {
              id: 'code',
              dataType: 'string',
            },
          ],
        },
        {
          id: 'shipping_lines_override',
        },
      ],
    },
  ];
  const output1 = {
    address: {
      address1: 'abc',
      address2: 123,
      address3: true,
      address4: ['a', 'b'],
      address5: {a: 'b'},
      original_shipping_lines: [
        {
          code: 'abc',
        },
      ],
      shipping_lines_override: 'abc',
    },
  };

  const input2 = [
    {
      id: 'customer',
      dataType: 'objectarray',
      resourceFields: [
        {
          id: 'id',
          dataType: 'number',
        },

        {
          id: 'note',
        },
        {
          id: 'addresses',
          dataType: 'objectarray',
          resourceFields: [
            {
              id: 'id',
              dataType: 'number',
            },
            {
              id: 'first_name',
            },
          ],
        },
        {
          id: 'admin_graphql_api_id',
          dataType: 'string',
        },
        {
          id: 'default_address',
          dataType: 'object',
          resourceFields: [
            {
              id: 'default',
              dataType: 'boolean',
            },
          ],
        },
      ]}];
  const output2 = {
    customer: [
      {
        addresses: [
          {
            first_name: 'abc',
            id: 123,
          },
        ],
        admin_graphql_api_id: 'abc',
        default_address: {
          default: true,
        },
        id: 123,
        note: 'abc',
      },
    ],
  };

  test('should return correct sample data for resource fields', () => {
    const sampleData = convertResourceFieldstoSampleData(input1);

    expect(sampleData).toEqual(output1);
  });
  test('should return correct sample data for resource fields contains object of arrays', () => {
    const sampleData = convertResourceFieldstoSampleData(input2);

    expect(sampleData).toEqual(output2);
  });
  test('should return empty when there are no resource fields', () => {
    const sampleData = convertResourceFieldstoSampleData();

    expect(sampleData).toBe('');
  });
});
describe('getHTTPConnectorMetadata', () => {
  const input1 = {
    baseURIs: [
      'https://{{{connection.settings.storeName}}}.myshopify.com/admin/api/:_version',
    ],
    versioning: {
      location: 'uri',
    },
    versions: [
      {
        _id: '62cffbf79b51830e4d641d6d',
        name: '2022-01',
      },
    ],
    apis: [],
    supportedBy: {
      export: {
        preConfiguredFields: [
          {
            path: 'paging',
            values: [
              {
                method: 'linkheader',
                lastPageStatusCode: 404,
                linkHeaderRelation: 'next',
              },
            ],
          },
          {
            path: 'requestMediaType',
            values: [
              'json',
            ],
          },
        ],
      },
      import: {
        preConfiguredFields: [
          {
            path: 'successMediaType',
            values: [
              'json',
            ],
          },
          {
            path: 'errorMediaType',
            values: [
              'json',
            ],
          },
          {
            path: 'requestMediaType',
            values: [
              'json',
            ],
          },
        ],
      },
      connection: {
        preConfiguredFields: [
          {
            path: 'http.ping.method',
            values: [
              'GET',
            ],
          },
          {
            path: 'settingsForm',
            values: [
              {
                fieldMap: {
                  storeName: {
                    id: 'storeName',
                    name: 'storeName',
                    type: 'text',
                    label: 'Store Name',
                    required: true,
                    helpText: 'Enter the unique portion of your Shopify store’s URL. For example, if your Shopify store URL is https://demo-store.myshopify.com, then provide <i>demo-store</i> for the store URL.',
                    validWhen: {
                      matchesRegEx: {
                        pattern: '^[\\S]+$',
                        message: 'Subdomain should not contain spaces.',
                      },
                    },
                  },
                },
                layout: {
                  fields: [
                    'storeName',
                    'version',
                  ],
                },
              },
            ],
          },
        ],
        fieldsUserMustSet: [
          {
            path: 'http.auth.type',
            values: [
              'basic',
              'oauth',
            ],
          },
        ],
      },
    },
    httpConnectorResources: [
      {
        _id: '62cffbf70c804009663faa2b',
        name: 'Customers : Customer',
        createdAt: '2022-07-14T11:20:24.000Z',
        lastModified: '2022-07-14T11:20:24.003Z',
        published: true,
        _httpConnectorId: '62cffbf79b51830e4d641d6c',
        _versionIds: [
          '62cffbf79b51830e4d641d6d',
          '62cffbf79b51830e4d641d6e',
          '62cffbf79b51830e4d641d6f',
        ],
        resourceFields: [
          {
            id: 'customer',
            dataType: 'objectarray',
            resourceFields: [
              {
                id: 'default_address',
                dataType: 'object',
                resourceFields: [
                  {
                    id: 'province_code',
                    dataType: 'string',
                  },
                ],
              },
            ],
          },
        ],
        supportedBy: {
          import: {
            preConfiguredFields: [
            ],
          },
        },
      },
    ],
    httpConnectorEndpoints: [
      {
        _id: '62cffbff0c804009663faa5c',
        name: 'Retrieves a list of customers',
        _httpConnectorResourceIds: [
          '62cffbf70c804009663faa2b',
        ],
        method: 'GET',
        relativeURI: '/customers.json',
        queryParameters: [
          {
            name: 'ids',
            description: 'A comma-separated list of customer ids',
            required: false,
          },
        ],
        supportedBy: {
          preConfiguredFields: [
            {
              path: 'delta',
              values: [
                {
                  defaults: {
                    updated_at_min: '{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
                },
              ],
            },
            {
              path: 'response',
              values: [
                {
                  resourcePath: 'customers',
                },
              ],
            },
          ],
          fieldsUserMustSet: [
            {
              path: 'type',
              values: [
                'delta',
                'test',
              ],
            },
          ],
          type: 'export',
          fieldsToUnset: [
            'body',
          ],
        },
      },
      {
        _id: '62cffbff0c804009663faa60',
        name: 'Searches for customers that match a supplied query',
        published: true,
        _httpConnectorResourceIds: [
          '62cffbf70c804009663faa2b',
        ],
        method: 'GET',
        relativeURI: '/customers/search.json',
        queryParameters: [
          {
            name: 'order',
            description: 'Field and direction to order results by(default: last_order_date DESC)',
            required: false,
          },
        ],
        supportedBy: {
          preConfiguredFields: [
            {
              path: 'response',
              values: [
                {
                  resourcePath: 'customers',
                },
              ],
            },
          ],
          type: 'export',
          fieldsToUnset: [
            'body',
          ],
        },
      },
      {
        _id: '62cffbff9b51830e4d641daf',
        name: 'Retrieves a single customer',
        _httpConnectorResourceIds: [
          '62cffbf70c804009663faa2b',
        ],
        method: 'GET',
        relativeURI: '/customers/:_customerId.json',
        pathParameters: [
          {
            name: 'customerId',
            label: 'Customer Id',
          },
        ],
        supportedBy: {
          preConfiguredFields: [
            {
              path: 'response',
              values: [
                {
                  resourcePath: 'customer',
                },
              ],
            },
          ],
          type: 'export',
          fieldsToUnset: [
            'paging',
            'body',
          ],
        },
      },
      {
        _id: '62cffbff0c804009663faa62',
        name: 'Retrieves a list of metafields that belong to a customer',
        _httpConnectorResourceIds: [
          '62cffbf70c804009663faa2b',
        ],
        method: 'GET',
        relativeURI: '/customers/:_customerId/metafields.json',
        pathParameters: [
          {
            name: 'customerId',
            label: 'Customer Id',
          },
        ],
        supportedBy: {
          preConfiguredFields: [
            {
              path: 'response',
              values: [
                {
                  resourcePath: 'metafields',
                },
              ],
            },
          ],
          type: 'export',
          fieldsToUnset: [
            'paging',
            'body',
          ],
        },
      },
      {
        _id: '62cffc149b51830e4d641e51',
        name: 'Creates a customer',
        _httpConnectorResourceIds: [
          '62cffbf70c804009663faa2b',
        ],
        method: 'POST',
        relativeURI: '/customers.json',
        supportedBy: {
          fieldsUserMustSet: [
            {
              path: 'ignoreExisting',
            },
            {
              path: 'mapping.fields.generate.customer.email',
            },
          ],
          type: 'import',
          pathParameterToIdentifyExisting: 'customerId',
          lookupToIdentifyExisting: {
            _httpConnectorEndpointId: '62cffbff0c804009663faa60',
            extract: 'customers[0].id',
          },
        },
      },
    ],
  };
  const output1 = {
    export: {
      addVersionToUrl: true,
      labels: {
        version: 'API version',
      },
      paging: {
        lastPageStatusCode: 404,
        linkHeaderRelation: 'next',
        method: 'linkheader',
      },
      requestMediaType: 'json',
      resources: [
        {
          _httpConnectorId: '62cffbf79b51830e4d641d6c',
          _id: '62cffbf70c804009663faa2b',
          _versionIds: [
            '62cffbf79b51830e4d641d6d',
            '62cffbf79b51830e4d641d6e',
            '62cffbf79b51830e4d641d6f',
          ],
          createdAt: '2022-07-14T11:20:24.000Z',
          endpoints: [
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              delta: {
                dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
                defaults: {
                  updated_at_min: '{{{lastExportDateTime}}}',
                },
              },
              doesNotSupportPaging: false,
              hidden: false,
              id: '62cffbff0c804009663faa5c',
              method: 'GET',
              name: 'Retrieves a list of customers',
              queryParameters: [
                {
                  description: 'A comma-separated list of customer ids',
                  fieldType: 'textarea',
                  id: 'ids',
                  name: 'ids',
                  required: false,
                },
              ],
              response: {
                resourcePath: 'customers',
              },
              supportedExportTypes: [
                'delta',
                'test',
              ],
              supportsAsyncHelper: false,
              url: '/customers.json',
            },
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              doesNotSupportPaging: false,
              hidden: false,
              id: '62cffbff0c804009663faa60',
              method: 'GET',
              name: 'Searches for customers that match a supplied query',
              queryParameters: [
                {
                  description: 'Field and direction to order results by(default: last_order_date DESC)',
                  fieldType: 'textarea',
                  id: 'order',
                  name: 'order',
                  required: false,
                },
              ],
              response: {
                resourcePath: 'customers',
              },
              supportsAsyncHelper: false,
              url: '/customers/search.json',
            },
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              doesNotSupportPaging: true,
              hidden: false,
              id: '62cffbff9b51830e4d641daf',
              method: 'GET',
              name: 'Retrieves a single customer',
              pathParameters: [
                {
                  fieldType: 'input',
                  id: 'customerId',
                  name: 'Customer Id',
                  required: true,
                },
              ],
              response: {
                resourcePath: 'customer',
              },
              supportsAsyncHelper: false,
              url: '/customers/:_customerId.json',
            },
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              doesNotSupportPaging: true,
              hidden: false,
              id: '62cffbff0c804009663faa62',
              method: 'GET',
              name: 'Retrieves a list of metafields that belong to a customer',
              pathParameters: [
                {
                  fieldType: 'input',
                  id: 'customerId',
                  name: 'Customer Id',
                  required: true,
                },
              ],
              response: {
                resourcePath: 'metafields',
              },
              supportsAsyncHelper: false,
              url: '/customers/:_customerId/metafields.json',
            },
          ],
          hidden: false,
          id: '62cffbf70c804009663faa2b',
          lastModified: '2022-07-14T11:20:24.003Z',
          name: 'Customers : Customer',
          published: true,
          resourceFields: [
            {
              dataType: 'objectarray',
              id: 'customer',
              resourceFields: [
                {
                  dataType: 'object',
                  id: 'default_address',
                  resourceFields: [
                    {
                      dataType: 'string',
                      id: 'province_code',
                    },
                  ],
                },
              ],
            },
          ],
          supportedBy: {
            import: {
              preConfiguredFields: [],
            },
          },
          versions: [
            {
              _id: '62cffbf79b51830e4d641d6d',
              version: '2022-01',
            },
          ],
        },
      ],
      versions: [
        {
          _id: '62cffbf79b51830e4d641d6d',
          version: '2022-01',
        },
      ],
    },
    import: {
      addVersionToUrl: true,
      errorMediaType: 'json',
      labels: {
        version: 'API version',
      },
      requestMediaType: 'json',
      resources: [
        {
          _httpConnectorId: '62cffbf79b51830e4d641d6c',
          _id: '62cffbf70c804009663faa2b',
          _versionIds: [
            '62cffbf79b51830e4d641d6d',
            '62cffbf79b51830e4d641d6e',
            '62cffbf79b51830e4d641d6f',
          ],
          createdAt: '2022-07-14T11:20:24.000Z',
          hidden: false,
          id: '62cffbf70c804009663faa2b',
          lastModified: '2022-07-14T11:20:24.003Z',
          name: 'Customers : Customer',
          operations: [
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              hidden: false,
              howToFindIdentifier: {
                lookup: {
                  extract: 'customers[0].id',
                  id: '62cffbff0c804009663faa60',
                  url: '/customers/search.json',
                },
              },
              id: '62cffc149b51830e4d641e51',
              ignoreExisting: true,
              method: 'POST',
              name: 'Creates a customer',
              parameters: [
                {
                  id: 'customerId',
                  in: 'path',
                  isIdentifier: true,
                  required: true,
                },
              ],
              requiredMappings: [
                'customer.email',
              ],
              supportIgnoreExisting: true,
              supportsAsyncHelper: false,
              url: '/customers.json',
            },
          ],
          published: true,
          resourceFields: [
            {
              dataType: 'objectarray',
              id: 'customer',
              resourceFields: [
                {
                  dataType: 'object',
                  id: 'default_address',
                  resourceFields: [
                    {
                      dataType: 'string',
                      id: 'province_code',
                    },
                  ],
                },
              ],
            },
          ],
          sampleData: {
            customer: [
              {
                default_address: {
                  province_code: 'abc',
                },
              },
            ],
          },
          supportedBy: {
            import: {
              preConfiguredFields: [],
            },
          },
          versions: [
            {
              _id: '62cffbf79b51830e4d641d6d',
              version: '2022-01',
            },
          ],
        },
      ],
      successMediaType: 'json',
      versions: [
        {
          _id: '62cffbf79b51830e4d641d6d',
          version: '2022-01',
        },
      ],
    },
  };
  const output2 = {
    export: {
      labels: {
        version: 'API version',
      },
      paging: {
        lastPageStatusCode: 404,
        linkHeaderRelation: 'next',
        method: 'linkheader',
      },
      requestMediaType: 'json',
      resources: [
        {
          _httpConnectorId: '62cffbf79b51830e4d641d6c',
          _id: '62cffbf70c804009663faa2b',
          _versionIds: [
            '62cffbf79b51830e4d641d6d',
            '62cffbf79b51830e4d641d6e',
            '62cffbf79b51830e4d641d6f',
          ],
          createdAt: '2022-07-14T11:20:24.000Z',
          endpoints: [
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              delta: {
                dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
                defaults: {
                  updated_at_min: '{{{lastExportDateTime}}}',
                },
              },
              doesNotSupportPaging: false,
              hidden: false,
              id: '62cffbff0c804009663faa5c',
              method: 'GET',
              name: 'Retrieves a list of customers',
              queryParameters: [
                {
                  description: 'A comma-separated list of customer ids',
                  fieldType: 'textarea',
                  id: 'ids',
                  name: 'ids',
                  required: false,
                },
              ],
              response: {
                resourcePath: 'customers',
              },
              supportsAsyncHelper: false,
              supportedExportTypes: [
                'delta',
                'test',
              ],
              url: '/customers.json',
            },
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              doesNotSupportPaging: false,
              hidden: false,
              supportsAsyncHelper: false,
              id: '62cffbff0c804009663faa60',
              method: 'GET',
              name: 'Searches for customers that match a supplied query',
              queryParameters: [
                {
                  description: 'Field and direction to order results by(default: last_order_date DESC)',
                  fieldType: 'textarea',
                  id: 'order',
                  name: 'order',
                  required: false,
                },
              ],
              response: {
                resourcePath: 'customers',
              },
              url: '/customers/search.json',
            },
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              doesNotSupportPaging: true,
              hidden: false,
              id: '62cffbff9b51830e4d641daf',
              method: 'GET',
              name: 'Retrieves a single customer',
              supportsAsyncHelper: false,
              pathParameters: [
                {
                  fieldType: 'input',
                  id: 'customerId',
                  name: 'Customer Id',
                  required: true,
                },
              ],
              response: {
                resourcePath: 'customer',
              },
              url: '/customers/:_customerId.json',
            },
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              doesNotSupportPaging: true,
              hidden: false,
              supportsAsyncHelper: false,
              id: '62cffbff0c804009663faa62',
              method: 'GET',
              name: 'Retrieves a list of metafields that belong to a customer',
              pathParameters: [
                {
                  fieldType: 'input',
                  id: 'customerId',
                  name: 'Customer Id',
                  required: true,
                },
              ],
              response: {
                resourcePath: 'metafields',
              },
              url: '/customers/:_customerId/metafields.json',
            },
          ],
          hidden: false,
          id: '62cffbf70c804009663faa2b',
          lastModified: '2022-07-14T11:20:24.003Z',
          name: 'Customers : Customer',
          published: true,
          resourceFields: [
            {
              dataType: 'objectarray',
              id: 'customer',
              resourceFields: [
                {
                  dataType: 'object',
                  id: 'default_address',
                  resourceFields: [
                    {
                      dataType: 'string',
                      id: 'province_code',
                    },
                  ],
                },
              ],
            },
          ],
          supportedBy: {
            import: {
              preConfiguredFields: [],
            },
          },
          versions: [
            {
              _id: '62cffbf79b51830e4d641d6d',
              version: '2022-01',
            },
          ],
        },
      ],
      versions: [
        {
          _id: '62cffbf79b51830e4d641d6d',
          version: '2022-01',
        },
      ],
    },
    import: {
      errorMediaType: 'json',
      labels: {
        version: 'API version',
      },
      requestMediaType: 'json',
      resources: [
        {
          _httpConnectorId: '62cffbf79b51830e4d641d6c',
          _id: '62cffbf70c804009663faa2b',
          _versionIds: [
            '62cffbf79b51830e4d641d6d',
            '62cffbf79b51830e4d641d6e',
            '62cffbf79b51830e4d641d6f',
          ],
          createdAt: '2022-07-14T11:20:24.000Z',
          hidden: false,
          id: '62cffbf70c804009663faa2b',
          lastModified: '2022-07-14T11:20:24.003Z',
          name: 'Customers : Customer',
          operations: [
            {
              _httpConnectorResourceIds: [
                '62cffbf70c804009663faa2b',
              ],
              hidden: false,
              supportsAsyncHelper: false,
              howToFindIdentifier: {
                lookup: {
                  extract: 'customers[0].id',
                  id: '62cffbff0c804009663faa60',
                  url: '/customers/search.json',
                },
              },
              id: '62cffc149b51830e4d641e51',
              ignoreExisting: true,
              method: 'POST',
              name: 'Creates a customer',
              parameters: [
                {
                  id: 'customerId',
                  in: 'path',
                  isIdentifier: true,
                  required: true,
                },
              ],
              requiredMappings: [
                'customer.email',
              ],
              supportIgnoreExisting: true,
              url: '/customers.json',
            },
          ],
          published: true,
          resourceFields: [
            {
              dataType: 'objectarray',
              id: 'customer',
              resourceFields: [
                {
                  dataType: 'object',
                  id: 'default_address',
                  resourceFields: [
                    {
                      dataType: 'string',
                      id: 'province_code',
                    },
                  ],
                },
              ],
            },
          ],
          sampleData: {
            customer: [
              {
                default_address: {
                  province_code: 'abc',
                },
              },
            ],
          },
          supportedBy: {
            import: {
              preConfiguredFields: [],
            },
          },
          versions: [
            {
              _id: '62cffbf79b51830e4d641d6d',
              version: '2022-01',
            },
          ],
        },
      ],
      successMediaType: 'json',
      versions: [
        {
          _id: '62cffbf79b51830e4d641d6d',
          version: '2022-01',
        },
      ],
    },
  };

  test('should return correct metadata', () => {
    const metaData = getHTTPConnectorMetadata(input1);

    expect(metaData).toEqual(output1);
  });
  test('should return correct metadata if version set on connection level', () => {
    const metaData = getHTTPConnectorMetadata(input1, '62cffbf79b51830e4d641d6d');

    expect(metaData).toEqual(output2);
  });
});

describe('updateFinalMetadataWithHttpFramework', () => {
  const connector = {
    baseURIs: [
      'https://{{{connection.settings.storeName}}}.myshopify.com/admin/api/:_version',
    ],
    versioning: {
      location: 'uri',
    },
    versions: [
      {
        _id: '62cffbf79b51830e4d641d6d',
        name: '2022-01',
      },
    ],
    apis: [],
    supportedBy: {
      export: {
        preConfiguredFields: [
          {
            path: 'paging',
            values: [
              {
                method: 'linkheader',
                lastPageStatusCode: 404,
                linkHeaderRelation: 'next',
              },
            ],
          },
          {
            path: 'requestMediaType',
            values: [
              'json',
            ],
          },
        ],
      },
      import: {
        preConfiguredFields: [
          {
            path: 'successMediaType',
            values: [
              'json',
            ],
          },
          {
            path: 'errorMediaType',
            values: [
              'json',
            ],
          },
          {
            path: 'requestMediaType',
            values: [
              'json',
            ],
          },
        ],
      },
      connection: {
        preConfiguredFields: [
          {
            path: 'http.ping.method',
            values: [
              'GET',
            ],
          },
          {
            path: 'settingsForm',
            values: [
              {
                fieldMap: {
                  storeName: {
                    id: 'storeName',
                    name: 'storeName',
                    type: 'text',
                    label: 'Store Name',
                    required: true,
                    helpText: 'Enter the unique portion of your Shopify store’s URL. For example, if your Shopify store URL is https://demo-store.myshopify.com, then provide <i>demo-store</i> for the store URL.',
                    validWhen: {
                      matchesRegEx: {
                        pattern: '^[\\S]+$',
                        message: 'Subdomain should not contain spaces.',
                      },
                    },
                  },
                },
                layout: {
                  fields: [
                    'storeName',
                    'version',
                  ],
                },
              },
            ],
          },
        ],
        fieldsUserMustSet: [
          {
            path: 'http.auth.type',
            values: [
              'basic',
              'oauth',
            ],
          },
        ],
      },
    },
  };
  const inputFieldMetaData = {fieldMap: {
    'http.baseURI': {
      type: 'text',
      label: 'Base URI',
      required: true,
      fieldId: 'http.baseURI',
      id: 'http.baseURI',
      name: '/http/baseURI',
      defaultValue: 'https://{{{connection.settings.environmenttype}}}.com',
      helpKey: 'connection.http.baseURI',
    },
    'http.ping.method': {
      type: 'select',
      label: 'HTTP method',
      options: [
        {
          items: [
            {
              label: 'GET',
              value: 'GET',
            },
            {
              label: 'POST',
              value: 'POST',
            },
            {
              label: 'PUT',
              value: 'PUT',
            },
          ],
        },
      ],
      fieldId: 'http.ping.method',
      id: 'http.ping.method',
      name: '/http/ping/method',
      defaultValue: 'GET',
      helpKey: 'connection.http.ping.method',
    },
    'http.ping.relativeURI': {
      type: 'relativeuri',
      showLookup: false,
      showExtract: false,
      label: 'Relative URI',
      fieldId: 'http.ping.relativeURI',
      id: 'http.ping.relativeURI',
      name: '/http/ping/relativeURI',
      defaultValue: '/track/v1/details/1Z5338FF0107231059',
      helpKey: 'connection.http.ping.relativeURI',
    },
    'http.ping.body': {
      type: 'httprequestbody',
      label: 'HTTP request body',
      fieldId: 'http.ping.body',
      visibleWhenAll: [
        {
          field: 'http.ping.method',
          is: [
            'POST',
            'PUT',
          ],
        },
      ],
      id: 'http.ping.body',
      name: '/http/ping/body',
      defaultValue: '',
      helpKey: 'connection.http.ping.body',
    },
    settings: {
      type: 'settings',
      defaultValue: {
        accessLicenseNumber: 'DDB98B391CF2CD41',
        environmenttype: 'wwwcie.ups',
        password: 'huXHCDz92rx8#',
        subversion: 'v2108',
        username: 'celigolabsups',
      },
      fieldId: 'settings',
      id: 'settings',
      name: '/settings',
      helpKey: 'connection.settings',
    },
  }};
  const resource = {};
  const expectedOutput = {
    fieldMap: {
      'http.baseURI': {
        defaultValue: 'https://{{{connection.settings.environmenttype}}}.com',
        fieldId: 'http.baseURI',
        helpKey: 'connection.http.baseURI',
        id: 'http.baseURI',
        label: 'Base URI',
        name: '/http/baseURI',
        required: true,
        type: 'text',
      },
      'http.ping.body': {
        defaultValue: '',
        fieldId: 'http.ping.body',
        helpKey: 'connection.http.ping.body',
        id: 'http.ping.body',
        label: 'HTTP request body',
        name: '/http/ping/body',
        type: 'httprequestbody',
        visible: false,
        visibleWhenAll: [
          {
            field: 'http.ping.method',
            is: [
              'POST',
              'PUT',

            ],

          },

        ],

      },
      'http.ping.method': {
        defaultValue: 'GET',
        fieldId: 'http.ping.method',
        helpKey: 'connection.http.ping.method',
        id: 'http.ping.method',
        label: 'HTTP method',
        name: '/http/ping/method',
        options: [
          {
            items: [
              {
                label: 'GET',
                value: 'GET',

              },
              {
                label: 'POST',
                value: 'POST',

              },
              {
                label: 'PUT',
                value: 'PUT',

              },

            ],

          },

        ],
        type: 'select',
        visible: false,

      },
      'http.ping.relativeURI': {
        defaultValue: '/track/v1/details/1Z5338FF0107231059',
        fieldId: 'http.ping.relativeURI',
        helpKey: 'connection.http.ping.relativeURI',
        id: 'http.ping.relativeURI',
        label: 'Relative URI',
        name: '/http/ping/relativeURI',
        showExtract: false,
        showLookup: false,
        type: 'relativeuri',
        visible: false,
      },
      settings: {
        defaultValue: {
          accessLicenseNumber: 'DDB98B391CF2CD41',
          environmenttype: 'wwwcie.ups',
          password: 'huXHCDz92rx8#',
          subversion: 'v2108',
          username: 'celigolabsups',

        },
        fieldId: 'settings',
        helpKey: 'connection.settings',
        id: 'settings',
        name: '/settings',
        type: 'settings',

      },
      'settings.storeName': {
        defaultValue: undefined,
        fieldId: 'settings.storeName',
        helpText: 'Enter the unique portion of your Shopify store’s URL. For example, if your Shopify store URL is https://demo-store.myshopify.com, then provide <i>demo-store</i> for the store URL.',
        id: 'settings.storeName',
        label: 'Store Name',
        name: '/settings/storeName',
        required: false,
        visible: false,
        _conditionIdValuesMap: [],
        _conditionIds: [],
        type: 'text',
        validWhen: {
          matchesRegEx: {
            message: 'Subdomain should not contain spaces.',
            pattern: '^[\\S]+$',
          },
        },
      },
    },

  };

  test('should return modified field metadata to support new http framework', () => {
    const metaData = updateFinalMetadataWithHttpFramework(inputFieldMetaData, connector, resource);

    expect(metaData).toEqual(expectedOutput);
  });
  test('should not throw any exception for invalid arguments', () => {
    const metaData = updateFinalMetadataWithHttpFramework();

    expect(metaData).toBeUndefined();
  });
});

describe('getEndpointResourceFields', () => {
  const resourceFields = {
    address: {
      address1: 'address1',
      address2: 'address2',
      original_shipping_lines: [
        {
          code: 'code',
        },
      ],
      shipping_lines_override: 'shipping_lines_override',
    },
  };

  test('should not set path when path is not available in resourceFields and type is inclusion', () => {
    const endpointResourceFields = [{type: 'inclusion', fields: ['address.original_shipping_lines[*].code', 'address.a1', 'address1.a2']}];

    const sampleData = getEndpointResourceFields(endpointResourceFields, resourceFields);
    const expected = {address: {
      original_shipping_lines: [{code: 'code'}],
    }};

    expect(sampleData).toEqual(expected);
  });
  test('should return correct endpoint sample data for resource fields when type is inclusion', () => {
    const endpointResourceFields = [{type: 'inclusion', fields: ['address.shipping_lines_override']}];

    const sampleData = getEndpointResourceFields(endpointResourceFields, resourceFields);
    const expected = {address: {
      shipping_lines_override: 'shipping_lines_override',
    }};

    expect(sampleData).toEqual(expected);
  });
  test('should return correct endpoint sample data for array of objects fields when type is inclusion', () => {
    const tempResourceFields = {
      address: [{
        address1: 'address1',
        address2: 'address2',
        original_shipping_lines: [
          {
            code: 'code',
          },
        ],
        shipping_lines_override: 'shipping_lines_override',
      }],
    };
    const endpointResourceFields = [{type: 'inclusion', fields: ['address[*].shipping_lines_override', 'address[*].shipping_lines', 'address[*].shipping_goods']}];

    const sampleData = getEndpointResourceFields(endpointResourceFields, tempResourceFields);
    const expected = {address: [{
      shipping_lines_override: 'shipping_lines_override',
    }]};

    expect(sampleData).toEqual(expected);
  });
  test('should return correct endpoint sample data for resource fields when type is exclusion', () => {
    const endpointResourceFields = [{type: 'exclusion', fields: ['address.shipping_lines_override']}];

    const sampleData = getEndpointResourceFields(endpointResourceFields, resourceFields);
    const expected = {
      address: {
        address1: 'address1',
        address2: 'address2',
        original_shipping_lines: [
          {
            code: 'code',
          },
        ] },
    };

    expect(sampleData).toEqual(expected);
  });

  test('should return correct endpoint sample data for array of objects fields when type is exclusion', () => {
    const endpointResourceFields = [{type: 'exclusion', fields: ['address.shipping_lines_override', 'address.original_shipping_lines[*].code']}];
    const input = {
      address: {
        address1: 'address1',
        address2: 'address2',
        original_shipping_lines: [
          {
            code: 'code',
            name: 'name1',
          },
          {
            name: 'Raj3',
          },
        ],
        shipping_lines_override: 'shipping_lines_override',
      },
    };

    const sampleData = getEndpointResourceFields(endpointResourceFields, input);
    const expected = {
      address: {
        address1: 'address1',
        address2: 'address2',
        original_shipping_lines: [
          {
            name: 'name1',
          },
          {
            name: 'Raj3',
          },
        ] },
    };

    expect(sampleData).toEqual(expected);
  });
  test('should not throw any exception for invalid arguments', () => {
    const sampleData = getEndpointResourceFields();

    expect(sampleData).toBeUndefined();
  });
  test('should return resourceFields directly if endpoint resource fields are empty', () => {
    const sampleData = getEndpointResourceFields('', resourceFields);

    expect(sampleData).toEqual(resourceFields);
  });
});

describe('updateWebhookFinalMetadataWithHttpFramework', () => {
  const connector = {
    baseURIs: [
      'https://{{{connection.settings.storeName}}}.myshopify.com/admin/api/:_version',
    ],
    versioning: {
      location: 'uri',
    },
    versions: [
      {
        _id: '62cffbf79b51830e4d641d6d',
        name: '2022-01',
      },
    ],
    apis: [],
    supportedBy: {
      export: {
        preConfiguredFields: [
          {
            path: 'paging',
            values: [
              {
                method: 'linkheader',
                lastPageStatusCode: 404,
                linkHeaderRelation: 'next',
              },
            ],
          },
          {
            path: 'requestMediaType',
            values: [
              'json',
            ],
          },
        ],
      },
      import: {
        preConfiguredFields: [
          {
            path: 'successMediaType',
            values: [
              'json',
            ],
          },
          {
            path: 'errorMediaType',
            values: [
              'json',
            ],
          },
          {
            path: 'requestMediaType',
            values: [
              'json',
            ],
          },
        ],
      },
      connection: {
        preConfiguredFields: [
          {
            path: 'webhook.verify',
            values: [
              'hmac',
            ],
          },
          {
            path: 'webhook.algorithm',
            values: [
              'sha256',
            ],
          },
          {
            path: 'webhook.encoding',
            values: [
              'base64',
            ],
          },
          {
            path: 'webhook.header',
            values: [
              'X-Shopify-Hmac-SHA256',
            ],
          },
        ],
        fieldsUserMustSet: [
          {
            path: 'webhooks.key',
          },
        ],
      },
    },
  };
  const inputFieldMetaData = {fieldMap: {
    'webhook.verify': {
      resourceType: 'exports',
      isLoggable: true,
      type: 'selectforsetfields',
      label: 'Verification type',
      required: true,
      setFieldIds: [
        'webhook.url',
      ],
      options: [
        {
          items: [
            {
              label: 'Basic',
              value: 'basic',
            },
            {
              label: 'HMAC',
              value: 'hmac',
            },
            {
              label: 'Secret URL',
              value: 'secret_url',
            },
            {
              label: 'Token',
              value: 'token',
            },
          ],
        },
      ],
      visible: true,
      fieldId: 'webhook.verify',
      id: 'webhook.verify',
      name: '/webhook/verify',
      defaultValue: '',
      helpKey: 'export.webhook.verify',
    },
    'webhook.algorithm': {
      resourceType: 'exports',
      isLoggable: true,
      type: 'selectforsetfields',
      label: 'Algorithm',
      setFieldIds: [
        'webhook.url',
      ],
      options: [
        {
          items: [
            {
              label: 'SHA-1',
              value: 'sha1',
            },
            {
              label: 'SHA-256',
              value: 'sha256',
            },
            {
              label: 'SHA-384',
              value: 'sha384',
            },
            {
              label: 'SHA-512',
              value: 'sha512',
            },
          ],
        },
      ],
      visibleWhen: [
        {
          field: 'webhook.verify',
          is: [
            'hmac',
          ],
        },
      ],
      required: true,
      fieldId: 'webhook.algorithm',
      id: 'webhook.algorithm',
      name: '/webhook/algorithm',
      defaultValue: '',
      helpKey: 'export.webhook.algorithm',
    },
    'webhook.encoding': {
      resourceType: 'exports',
      isLoggable: true,
      type: 'selectforsetfields',
      label: 'Encoding',
      required: true,
      setFieldIds: [
        'webhook.url',
      ],
      options: [
        {
          items: [
            {
              label: 'Base64',
              value: 'base64',
            },
            {
              label: 'Hexadecimal',
              value: 'hex',
            },
          ],
        },
      ],
      visibleWhen: [
        {
          field: 'webhook.verify',
          is: [
            'hmac',
          ],
        },
      ],
      fieldId: 'webhook.encoding',
      id: 'webhook.encoding',
      name: '/webhook/encoding',
      defaultValue: '',
      helpKey: 'export.webhook.encoding',
    },
    'webhook.key': {
      resourceType: 'exports',
      type: 'textforsetfields',
      label: 'Key (secret)',
      inputType: 'password',
      setFieldIds: [
        'webhook.url',
      ],
      visible: true,
      visibleWhen: [
        {
          field: 'webhook.verify',
          is: [
            'hmac',
          ],
        },
      ],
      required: true,
      fieldId: 'webhook.key',
      id: 'webhook.key',
      name: '/webhook/key',
      defaultValue: '',
      helpKey: 'export.webhook.key',
    },
    'webhook.token': {
      type: 'webhooktokengenerator',
      label: 'Custom URL token',
      buttonLabel: 'Generate new token',
      required: true,
      provider: 'custom',
      setFieldIds: [
        'webhook.url',
      ],
      visible: true,
      visibleWhen: [
        {
          field: 'webhook.verify',
          is: [
            'secret_url',
          ],
        },
      ],
      fieldId: 'webhook.token',
      refreshOptionsOnChangesTo: [
        'webhook.provider',
      ],
      id: 'webhook.token',
      name: '/webhook/token',
      defaultValue: '',
      helpKey: 'export.webhook.token',
    },
    'webhook.generateToken': {
      type: 'webhooktokengenerator',
      label: 'Token',
      provider: 'custom',
      buttonLabel: 'Generate new token',
      setFieldIds: [
        'webhook.url',
      ],
      helpKey: 'export.webhook.token',
      visibleWhen: [
        {
          field: 'webhook.verify',
          is: [
            'token',
          ],
        },
      ],
      fieldId: 'webhook.generateToken',
      id: 'webhook.generateToken',
      name: '/webhook/generateToken',
    },
    'webhook.successBody': {
      label: 'Override HTTP response body for success responses',
      type: 'uri',
      stage: 'responseMappingExtract',
      showLookup: false,
      refreshOptionsOnChangesTo: [
        'webhook.successMediaType',
      ],
    },

  }};
  const resource = {};
  const expctedOutput = {
    fieldMap: {

      'webhook.algorithm': {
        defaultValue: '',
        fieldId: 'webhook.algorithm',
        helpKey: 'export.webhook.algorithm',
        id: 'webhook.algorithm',
        isLoggable: true,
        label: 'Algorithm',
        name: '/webhook/algorithm',
        options: [
          {
            items: [
              {
                label: 'SHA-1',
                value: 'sha1',

              },
              {
                label: 'SHA-256',
                value: 'sha256',

              },
              {
                label: 'SHA-384',
                value: 'sha384',

              },
              {
                label: 'SHA-512',
                value: 'sha512',

              },

            ],

          },

        ],
        required: true,
        resourceType: 'exports',
        setFieldIds: [
          'webhook.url',

        ],
        type: 'selectforsetfields',
        visibleWhen: [
          {
            field: 'webhook.verify',
            is: [
              'hmac',

            ],

          },

        ],

      },
      'webhook.encoding': {
        defaultValue: '',
        fieldId: 'webhook.encoding',
        helpKey: 'export.webhook.encoding',
        id: 'webhook.encoding',
        isLoggable: true,
        label: 'Encoding',
        name: '/webhook/encoding',
        options: [
          {
            items: [
              {
                label: 'Base64',
                value: 'base64',

              },
              {
                label: 'Hexadecimal',
                value: 'hex',

              },

            ],

          },

        ],
        required: true,
        resourceType: 'exports',
        setFieldIds: [
          'webhook.url',

        ],
        type: 'selectforsetfields',
        visibleWhen: [
          {
            field: 'webhook.verify',
            is: [
              'hmac',

            ],

          },

        ],

      },
      'webhook.generateToken': {
        buttonLabel: 'Generate new token',
        fieldId: 'webhook.generateToken',
        helpKey: 'export.webhook.token',
        id: 'webhook.generateToken',
        label: 'Token',
        name: '/webhook/generateToken',
        provider: 'custom',
        setFieldIds: [
          'webhook.url',

        ],
        type: 'webhooktokengenerator',
        visibleWhen: [
          {
            field: 'webhook.verify',
            is: [
              'token',

            ],

          },

        ],

      },
      'webhook.key': {
        defaultValue: '',
        fieldId: 'webhook.key',
        helpKey: 'export.webhook.key',
        id: 'webhook.key',
        inputType: 'password',
        label: 'Key (secret)',
        name: '/webhook/key',
        required: true,
        resourceType: 'exports',
        setFieldIds: [
          'webhook.url',

        ],
        type: 'textforsetfields',
        visible: true,
        visibleWhen: [
          {
            field: 'webhook.verify',
            is: [
              'hmac',

            ],

          },

        ],

      },
      'webhook.successBody': {
        label: 'Override HTTP response body for success responses',
        refreshOptionsOnChangesTo: [
          'webhook.successMediaType',

        ],
        showLookup: false,
        stage: 'responseMappingExtract',
        type: 'uri',

      },
      'webhook.token': {
        buttonLabel: 'Generate new token',
        defaultValue: '',
        fieldId: 'webhook.token',
        helpKey: 'export.webhook.token',
        id: 'webhook.token',
        label: 'Custom URL token',
        name: '/webhook/token',
        provider: 'custom',
        refreshOptionsOnChangesTo: [
          'webhook.provider',

        ],
        required: true,
        setFieldIds: [
          'webhook.url',

        ],
        type: 'webhooktokengenerator',
        visible: true,
        visibleWhen: [
          {
            field: 'webhook.verify',
            is: [
              'secret_url',

            ],

          },

        ],

      },
      'webhook.verify': {
        defaultValue: '',
        fieldId: 'webhook.verify',
        helpKey: 'export.webhook.verify',
        id: 'webhook.verify',
        isLoggable: true,
        label: 'Verification type',
        name: '/webhook/verify',
        options: [
          {
            items: [
              {
                label: 'Basic',
                value: 'basic',

              },
              {
                label: 'HMAC',
                value: 'hmac',

              },
              {
                label: 'Secret URL',
                value: 'secret_url',

              },
              {
                label: 'Token',
                value: 'token',

              },

            ],

          },

        ],
        required: true,
        resourceType: 'exports',
        setFieldIds: [
          'webhook.url',

        ],
        type: 'selectforsetfields',
        visible: true,

      },

    },

  };

  test('should return modified webhook field metadata to support new http framework', () => {
    const metaData = updateWebhookFinalMetadataWithHttpFramework(inputFieldMetaData, connector, resource);

    expect(metaData).toEqual(expctedOutput);
  });
  test('should not throw any exception for invalid arguments', () => {
    const metaData = updateWebhookFinalMetadataWithHttpFramework();

    expect(metaData).toBeUndefined();
  });
});
describe('getDataTypeDefaultValue', () => {
  test('should verify all default values for given datatype', () => {
    expect(getDataTypeDefaultValue('string')).toBe('abc');
    expect(getDataTypeDefaultValue('number')).toBe(123);

    expect(getDataTypeDefaultValue('boolean')).toBe(true);

    expect(getDataTypeDefaultValue('stringarray')).toEqual(['a', 'b']);

    expect(getDataTypeDefaultValue('numberarray')).toEqual([1, 2]);

    expect(getDataTypeDefaultValue('booleanarray')).toEqual([true, false]);

    expect(getDataTypeDefaultValue('objectarray')).toEqual([{a: 'b'}, {c: 'd'}]);
    expect(getDataTypeDefaultValue('object')).toEqual({a: 'b'});
    expect(getDataTypeDefaultValue()).toBe('abc');
    expect(getDataTypeDefaultValue('unknown')).toBe('abc');
  });
});
