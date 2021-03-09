export default {
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
