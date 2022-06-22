import { API } from '../utils';

export default API.get('/api/exports',
  [
    {
      _id: '6217d3c80f36bf7cbd9daa34',
      createdAt: '2022-02-24T18:51:52.432Z',
      lastModified: '2022-03-28T08:00:43.653Z',
      name: 'Netsuite export',
      _connectionId: '5ed8c613f1188372591a3236',
      apiIdentifier: 'e6daaa7c1a',
      asynchronous: true,
      pageSize: 3,
      hooks: {
        preSavePage: {
          _stackId: '6239fb1298cd5466f39f8f96',
          function: 'salesOrderExportPreSavePageHook',
        },
      },
      oneToMany: false,
      sandbox: false,
      rawData: '620399ede171026df1681c5a737922d6f2ef4af9986a7b7314df3a98',
      netsuite: {
        type: 'restlet',
        skipGrouping: false,
        statsOnly: false,
        restlet: {
          recordType: 'transaction',
          searchId: '788352',
          useSS2Restlets: false,
          batchSize: 50,
          hooks: {
            batchSize: 50,
          },
        },
        distributed: {
          disabled: false,
          forceReload: false,
        },
      },
      adaptorType: 'NetSuiteExport',
    },
  ]);
