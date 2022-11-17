/* global describe, test, expect, jest */
import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { resourceConflictResolution, constructResourceFromFormValues, convertResourceFieldstoSampleData, getHTTPConnectorMetadata, updateFinalMetadataWithHttpFramework, getEndpointResourceFields } from './index';
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

    return expectSaga(constructResourceFromFormValues, {
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

    return expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    })
      .provide([
        [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
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

    return expectSaga(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    })
      .provide([
        [select(selectors.resourceData, 'imports', resourceId, 'value'), { merged }],
        [matchers.call.fn(createFormValuesPatchSet), {patchSet}],
      ])
      .returns({})
      .run();
  });

  test('should return empty object if resource id is undefined', () => {
    const resourceType = 'imports';
    const formValues = [];

    return expectSaga(constructResourceFromFormValues, {
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
            first_name: 'first_name',
            id: 'id',
          },
        ],
        admin_graphql_api_id: 'admin_graphql_api_id',
        default_address: {
          default: 'default',
        },
        id: 'id',
        note: 'note',
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

    expect(sampleData).toEqual('');
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
      labels: {
        version: 'API version',
      },
      paging: {
        lastPageStatusCode: 404,
        linkHeaderRelation: 'next',
        method: 'linkheader',
      },
      requestMediaType: 'json',
      versions: [
        {
          _id: '62cffbf79b51830e4d641d6d',
          resources: [
            {
              endpoints: [
                {
                  delta: {
                    dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
                    defaults: {
                      updated_at_min: '{{{lastExportDateTime}}}',
                    },
                  },
                  doesNotSupportPaging: false,
                  id: '62cffbff0c804009663faa5c',
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
                  url: '/2022-01/customers.json',
                },
                {
                  doesNotSupportPaging: false,
                  id: '62cffbff0c804009663faa60',
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
                  url: '/2022-01/customers/search.json',
                },
                {
                  doesNotSupportPaging: true,
                  id: '62cffbff9b51830e4d641daf',
                  name: 'Retrieves a single customer',
                  pathParameters: [
                    {
                      fieldType: 'input',
                      id: 'customerId',
                      name: 'customerId',
                      required: true,
                    },
                  ],
                  response: {
                    resourcePath: 'customer',
                  },
                  url: '/2022-01/customers/:_customerId.json',
                },
                {
                  doesNotSupportPaging: true,
                  id: '62cffbff0c804009663faa62',
                  name: 'Retrieves a list of metafields that belong to a customer',
                  pathParameters: [
                    {
                      fieldType: 'input',
                      id: 'customerId',
                      name: 'customerId',
                      required: true,
                    },
                  ],
                  response: {
                    resourcePath: 'metafields',
                  },
                  url: '/2022-01/customers/:_customerId/metafields.json',
                },
              ],
              id: '62cffbf70c804009663faa2b',
              name: 'Customers : Customer',
            },
          ],
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
      successMediaType: 'json',
      versions: [
        {
          _id: '62cffbf79b51830e4d641d6d',
          resources: [
            {
              id: '62cffbf70c804009663faa2b',
              name: 'Customers : Customer',
              operations: [
                {
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
                  url: '/2022-01/customers.json',
                },
              ],
              sampleData: {
                customer: [
                  {
                    default_address: {
                      province_code: 'province_code',
                    },
                  },
                ],
              },
            },
          ],
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
      versions: [
        {
          _id: '62cffbf79b51830e4d641d6d',
          resources: [
            {
              endpoints: [
                {
                  delta: {
                    dateFormat: 'YYYY-MM-DDTHH:mm:ss[Z]',
                    defaults: {
                      updated_at_min: '{{{lastExportDateTime}}}',
                    },
                  },
                  doesNotSupportPaging: false,
                  id: '62cffbff0c804009663faa5c',
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
                  url: '/customers.json',
                },
                {
                  doesNotSupportPaging: false,
                  id: '62cffbff0c804009663faa60',
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
                  doesNotSupportPaging: true,
                  id: '62cffbff9b51830e4d641daf',
                  name: 'Retrieves a single customer',
                  pathParameters: [
                    {
                      fieldType: 'input',
                      id: 'customerId',
                      name: 'customerId',
                      required: true,
                    },
                  ],
                  response: {
                    resourcePath: 'customer',
                  },
                  url: '/customers/:_customerId.json',
                },
                {
                  doesNotSupportPaging: true,
                  id: '62cffbff0c804009663faa62',
                  name: 'Retrieves a list of metafields that belong to a customer',
                  pathParameters: [
                    {
                      fieldType: 'input',
                      id: 'customerId',
                      name: 'customerId',
                      required: true,
                    },
                  ],
                  response: {
                    resourcePath: 'metafields',
                  },
                  url: '/customers/:_customerId/metafields.json',
                },
              ],
              id: '62cffbf70c804009663faa2b',
              name: 'Customers : Customer',
            },
          ],
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
      successMediaType: 'json',
      versions: [
        {
          _id: '62cffbf79b51830e4d641d6d',
          resources: [
            {
              id: '62cffbf70c804009663faa2b',
              name: 'Customers : Customer',
              operations: [
                {
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
              sampleData: {
                customer: [
                  {
                    default_address: {
                      province_code: 'province_code',
                    },
                  },
                ],
              },
            },
          ],
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
    const metaData = getHTTPConnectorMetadata(input1, '2022-01');

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
  const expctedOutput = {
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
      'http.unencrypted.version': {
        fieldId: 'http.unencrypted.version',
        id: 'http.unencrypted.version',
        label: 'API version',
        name: '/http/unencrypted/version',
        options: [
          {
            items: [
              {
                label: '2022-01',
                value: '2022-01',

              },

            ],

          },

        ],
        type: 'select',
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
        required: true,
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

    expect(metaData).toEqual(expctedOutput);
  });
  test('should not throw any exception for invalid arguments', () => {
    const metaData = updateFinalMetadataWithHttpFramework();

    expect(metaData).toEqual(undefined);
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

  test('should return correct endpoint sample data for resource fields when type is inclusion', () => {
    const endpointResourceFields = [{type: 'inclusion', fields: ['address.shipping_lines_override']}];

    const sampleData = getEndpointResourceFields(endpointResourceFields, resourceFields);
    const expected = {address: {
      shipping_lines_override: 'default',
    }};

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
  test('should not throw any exception for invalid arguments', () => {
    const sampleData = getEndpointResourceFields();

    expect(sampleData).toEqual(undefined);
  });
  test('should return resourceFields directly if endpoint resource fields are empty', () => {
    const sampleData = getEndpointResourceFields('', resourceFields);

    expect(sampleData).toEqual(resourceFields);
  });
});

