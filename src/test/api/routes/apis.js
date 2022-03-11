import { API } from '../utils';

export default API.get('/api/apis',
  [
    {
      _id: '5fe302e6670e9579be63eab0',
      createdAt: '2020-12-23T08:42:14.939Z',
      lastModified: '2020-12-28T09:28:47.577Z',
      name: 'admin role',
      _scriptId: '5fe302d9670e9579be63eaac',
      function: 'preSavePageFunction',
    },
    {
      _id: '5fe304af29c1277f364ac0d7',
      createdAt: '2020-12-23T08:49:51.357Z',
      lastModified: '2020-12-23T08:49:51.370Z',
      name: 'owner',
      _scriptId: '5fe304a329c1277f364ac0ce',
      function: 'preSavePageFunction',
    },
  ],
);
