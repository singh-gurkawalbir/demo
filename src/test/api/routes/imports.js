import { API } from '../utils';

export default API.get('/api/imports',
  [
    {
      _id: '62190c3b78f2387da20ff6b6',
      createdAt: '2022-02-25T17:04:59.480Z',
      lastModified: '2022-06-12T06:54:25.628Z',
      name: 'Rest import',
      _connectionId: '5e7068331c056a75e6df19b2',
      apiIdentifier: 'ica1cc6072',
      ignoreExisting: false,
      ignoreMissing: false,
      oneToMany: false,
      sandbox: false,
      mapping: {
        fields: [
          {
            extract: 'id',
            generate: 'id',
          },
        ],
      },
      http: {
        relativeURI: [
          '/test/orders',
        ],
        method: [
          'DELETE',
        ],
        body: [],
        batchSize: 1,
        requestMediaType: 'json',
        successMediaType: 'json',
        errorMediaType: 'json',
        sendPostMappedData: true,
        formType: 'rest',
      },
      adaptorType: 'HTTPImport',
    },
  ]);
