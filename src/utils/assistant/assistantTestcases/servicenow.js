export default {
  export: {
    labels: {
      version: 'API Version',
      resource: 'API Name',
      endpoint: 'Operation',
    },
    successPath: 'result',
    successValues: 'true',
    urlResolution: [],
    paging: {
      pagingMethod: 'skipargument',
      skipArgument: 'sysparm_offset',
    },
    versions: [
      {
        version: 'latest',
        resources: [
          {
            id: 'contact',
            name: 'Contact',
            endpoints: [
              {
                id: 'get_contact',
                url: '/api/now/contact',
                name: 'Query contact by search query',
                resourcePath: 'result',
                supportedExportTypes: [
                  'delta',
                  'test',
                ],
                delta: {
                  defaults: {
                    sysparm_query: 'sys_updated_on>{{{lastExportDateTime}}}',
                  },
                  dateFormat: 'YYYY-MM-DD HH:mm:ss',
                },
                response: {
                  resourcePath: 'contacts',
                },
                queryParameters: [
                  {
                    id: 'sysparm_query',
                    name: 'sysparm_query',
                    description: 'An encoded query string used to filter the results',
                    fieldType: 'textarea',
                  },
                  {
                    id: 'sysparm_display_value',
                    name: 'sysparm_display_value',
                    description: 'Return the display value (true), actual value (false), or both (all) for reference fields (default: false)',
                    fieldType: 'select',
                    options: [
                      'false',
                      'true',
                      'all',
                    ],
                    defaultValue: 'false',
                  },
                  {
                    id: 'sysparm_exclude_reference_link',
                    name: 'sysparm_exclude_reference_link',
                    description: 'True to exclude Table API links for reference fields (default: false)',
                    fieldType: 'select',
                    options: [
                      'false',
                      'true',
                    ],
                    defaultValue: 'false',
                  },
                  {
                    id: 'sysparm_fields',
                    name: 'sysparm_fields',
                    description: 'A comma-separated list of fields to return in the response',
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
      resource: 'API Name',
      operation: 'Operation',
    },
    urlResolution: [],
    versions: [
      {
        version: 'latest',
        resources: [
          {
            id: 'contact',
            name: 'Contact',
            operations: [
              {
                id: 'create_contact',
                name: 'create contact',
                url: '/api/now/contact',
                method: 'POST',
                requiredMappings: [
                  'first_name',
                  'last_name',
                  'email',
                ],

                sampleData: {
                  calendar_integration: '1',
                  country: 'q',
                  user_password: 'q',
                  last_login_time: 'q',
                  source: 'q',
                },
                supportIgnoreExisting: true,
                parameters: [
                  {
                    id: 'sys_id',
                    in: 'path',
                    required: true,
                    isIdentifier: true,
                  },
                  {
                    id: 'customerid',
                    name: 'Customer ID',
                    in: 'path',
                    description: 'Unique Customer ID.',
                    required: true,
                  },
                ],
                howToFindIdentifier: {
                  lookup: {
                    url: '/api/now/contact',
                    parameterValues: {
                      sysparm_fields: 'sys_id',
                    },
                    id: 'get_contact',
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
