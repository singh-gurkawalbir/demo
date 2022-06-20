import { API } from '../utils';

export default API.get('/api/flows', [
  {
    _id: '5ea16c600e2fab71928a6152',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: ' Bulk insert with harcode and mulfield mapping settings',
    disabled: false,
    _integrationId: '5e9bf6c9edd8fa3230149fbd',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '5ea16cd30e2fab71928a6166',
      },
    ],
    pageGenerators: [
      {
        _exportId: '5d00b9f0bcd64414811b2396',
      },
    ],
    createdAt: '2020-04-23T10:22:24.290Z',
    lastExecutedAt: '2020-04-23T11:08:41.093Z',
    autoResolveMatchingTraceKeys: true,

  },
  {
    _id: '5f0802e086bd7d4f42eadd0b',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: "'Permission Denied Error for QuickBooks Export 'JournalReport'",
    disabled: false,
    _integrationId: '5ff579d745ceef7dcd797c15',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '5e8098670f15e7611e7a6354',
      },
    ],
    pageGenerators: [
      {
        _exportId: '62a196ce1bf5be58603a5416',
        skipRetries: false,
      },
    ],
    createdAt: '2020-07-10T05:55:44.464Z',
    lastExecutedAt: '2020-07-20T10:30:22.111Z',
    autoResolveMatchingTraceKeys: true,
  },
  {
    _id: '606ec9a3ddb7577eb1af3cb4',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: "'Permission Denied Error for QuickBooks Export 'JournalReport' from postman",
    disabled: false,
    _integrationId: '5cc9bd00581ace2bec7754eb',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '5e8098670f15e7611e7a6354',
      },
    ],
    pageGenerators: [
      {
        _exportId: '5d77c582c7a0a1744b85cc78',
        skipRetries: false,
      },
    ],
    createdAt: '2021-04-08T09:15:15.328Z',
    autoResolveMatchingTraceKeys: true,
  },
  {
    _id: '5f1535beef4fb87bc5e5fb3e', // delta flow
    lastModified: '2021-04-16T07:29:37.830Z',
    name: '91. Orders - Magento to Stage - Single Order',
    disabled: false,
    _integrationId: '5cc9bd00581ace2bec7754eb',
    skipRetries: false,
    _exportId: '5c9b5d5646fc7429c2a405fa',
    _importId: '5c9b5d5646fc7429c2a40234',
    createdAt: '2020-07-20T06:12:14.256Z',
    lastExecutedAt: '2020-07-30T13:06:07.325Z',
  },
  {
    _id: '5ec6439006c2504f58943ec3',
    lastModified: '2021-08-13T08:02:49.712Z',
    name: '943 Return Authorization Flow - RHF0000790',
    disabled: false,
    _integrationId: '5cc9bd00581ace2bec7754eb',
    skipRetries: false,
    pageProcessors: [
      {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '5ec6460a06c2504f58943f1a',
      },
    ],
    pageGenerators: [
      {
        _exportId: '629f0db3ccb94d35de6f4367',
      },
    ],
    createdAt: '2020-05-21T09:02:08.944Z',
    wizardState: 'done',
    lastExecutedAt: '2020-05-21T11:05:38.927Z',
    autoResolveMatchingTraceKeys: true,
  }]);
