import { API } from '../utils';

export default API.get('/api/stacks',
  [
    {
      _id: '5fe9828f5d599c4149693676',
      name: 'admin stack',
      type: 'lambda',
      lastModified: '2020-12-28T07:00:31.692Z',
      createdAt: '2020-12-28T07:00:31.651Z',
      lambda: {
        accessKeyId: 'afegrasgra',
        secretAccessKey: '******',
        awsRegion: 'ap-southeast-1',
        functionName: 'test',
        language: 'Node.js',
      },
    },
    {
      _id: '5d1c455df2bd971a15f6c617',
      name: 'dropdown stack',
      type: 'server',
      lastModified: '2019-07-03T06:04:13.340Z',
      createdAt: '2019-07-03T06:04:13.292Z',
      server: {
        systemToken: '******',
        hostURI: 'https://staging.integrator.io',
        ipRanges: [],
      },
    },
    {
      _id: '5cf5ff98f732316ea2f7d5d2',
      name: 'regression test',
      type: 'server',
      lastModified: '2020-12-28T06:38:13.586Z',
      createdAt: '2019-06-04T05:20:25.028Z',
      server: {
        systemToken: '******',
        hostURI: 'https://integrator.io/stacks',
        ipRanges: [],
      },
    },
    {
      _id: '6052d1669fc38206d0a492f3',
      name: 'template stack',
      type: 'server',
      lastModified: '2021-03-18T04:04:54.816Z',
      createdAt: '2021-03-18T04:04:54.776Z',
      server: {
        systemToken: '******',
        hostURI: 'https://staging.integrator.io/integrations',
        ipRanges: [],
      },
    },
    {
      _id: '5cd2887e67d43871d97c4e1d',
      name: 'test stack',
      type: 'server',
      lastModified: '2019-05-08T07:42:54.604Z',
      createdAt: '2019-05-08T07:42:54.549Z',
      server: {
        systemToken: '******',
        hostURI: 'https://staging.integrator.io',
        ipRanges: [],
      },
    },
  ]);
