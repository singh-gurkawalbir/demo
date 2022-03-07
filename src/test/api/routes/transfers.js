import { API } from '../utils';

export default API.get('/api/transfers', [
  {
    _id: '606d82660fb6ca7ae596f3b4',
    dismissed: true,
    status: 'unapproved',
    toTransfer: {
      iclients: [],
      asynchelpers: [],
      notifications: [],
      filedefinitions: [],
      stacks: [],
      licenses: [],
      connections: [],
      flows: [],
      exports: [],
      imports: [],
      integrations: [
        {
          _id: '606d81ba5763d34dd64e4d7f',
          name: 'TEST INTEGRATION TEST',
        },
      ],
    },
    transferErrors: [],
    lastModified: '2021-07-26T13:54:18.345Z',
    createdAt: '2021-04-07T09:59:02.059Z',
    transferToUser: {
      _id: '5dce7030918bf72896a38488',
      email: 'saikaivalya.hemadribhatla+15@celigo.com',
      name: 'qa test',
    },
  },
  {
    _id: '606d81ef5569f60cb77737fb',
    status: 'canceled',
    toTransfer: {
      iclients: [],
      asynchelpers: [],
      notifications: [],
      filedefinitions: [],
      licenses: [],
      stacks: [],
      connections: [],
      flows: [],
      imports: [],
      exports: [],
      integrations: [
        {
          _id: '606d81ba5763d34dd64e4d7f',
          name: 'TEST INTEGRATION TEST',
        },
      ],
    },
    transferErrors: [],
    lastModified: '2021-04-07T09:58:09.398Z',
    createdAt: '2021-04-07T09:57:03.425Z',
    transferToUser: {
      _id: '5dce7030918bf72896a38488',
      email: 'saikaivalya.hemadribhatla+15@celigo.com',
      name: 'qa test',
    },
  },
  {
    _id: '6013caf068dba8150cfdf78c',
    accepted: true,
    status: 'done',
    transferredAt: '2021-01-29T08:44:46.376Z',
    toTransfer: {
      asynchelpers: [],
      filedefinitions: [],
      iclients: [],
      licenses: [],
      notifications: [],
      flows: [
        {
          _id: '6013b6d145d76c19c8aa590c',
          _runNextFlowIds: [],
          _userId: '5ca5c855ec5c172792285f53',
          name: 'New flow',
          disabled: true,
          pageGenerators: [
            {
              _exportId: '6013b6cf7f5a995a563c6344',
            },
          ],
          pageProcessors: [
            {
              _importId: '6013b6f037c3e052c8815592',
            },
          ],
          _integrationId: '6013aebb45d76c19c8aa5729',
          _runNextExportIds: [],
        },
      ],
      connections: [
        {
          _id: '6013b3bc37c3e052c88154db',
          _userId: '5ca5c855ec5c172792285f53',
          type: 'rest',
          name: 'Zendesk New Integration Transfer',
        },
        {
          _id: '6013b69645d76c19c8aa58fe',
          _userId: '5ca5c855ec5c172792285f53',
          type: 'ftp',
          name: 'FTP NEW INTEGRATION TRANSFER',
        },
      ],
      imports: [
        {
          _id: '6013b6f037c3e052c8815592',
          adaptorType: 'FTPImport',
          _userId: '5ca5c855ec5c172792285f53',
          _connectionId: '6013b69645d76c19c8aa58fe',
          name: 'IMPORT',
        },
      ],
      exports: [
        {
          _id: '6013b6cf7f5a995a563c6344',
          adaptorType: 'RESTExport',
          _userId: '5ca5c855ec5c172792285f53',
          name: 'NEW EXPRT',
          _connectionId: '6013b3bc37c3e052c88154db',
        },
      ],
      integrations: [
        {
          _id: '6013aebb45d76c19c8aa5729',
          name: 'INTEGRATION TRANSFER INVITE',
        },
      ],
    },
    transferErrors: [],
    lastModified: '2021-01-29T08:44:46.389Z',
    createdAt: '2021-01-29T08:44:32.236Z',
    transferToUser: {
      _id: '5d1462515c0dfb2c2d9e12f2',
      email: 'saikaivalya.h@gmail.com-excluded',
      name: 'kaivalya hs',
    },
  },
  {
    _id: '6013c99445d76c19c8aa5ef0',
    dismissed: true,
    status: 'unapproved',
    toTransfer: {
      asynchelpers: [],
      filedefinitions: [],
      notifications: [],
      iclients: [],
      licenses: [],
      flows: [
        {
          _id: '6013b6d145d76c19c8aa590c',
          _runNextFlowIds: [],
          _userId: '5ca5c855ec5c172792285f53',
          name: 'New flow',
          disabled: true,
          pageGenerators: [
            {
              _exportId: '6013b6cf7f5a995a563c6344',
            },
          ],
          pageProcessors: [
            {
              _importId: '6013b6f037c3e052c8815592',
            },
          ],
          _integrationId: '6013aebb45d76c19c8aa5729',
          _runNextExportIds: [],
        },
      ],
      connections: [
        {
          _id: '6013b3bc37c3e052c88154db',
          _userId: '5ca5c855ec5c172792285f53',
          type: 'rest',
          name: 'Zendesk New Integration Transfer',
        },
        {
          _id: '6013b69645d76c19c8aa58fe',
          _userId: '5ca5c855ec5c172792285f53',
          type: 'ftp',
          name: 'FTP NEW INTEGRATION TRANSFER',
        },
      ],
      imports: [
        {
          _id: '6013b6f037c3e052c8815592',
          adaptorType: 'FTPImport',
          _userId: '5ca5c855ec5c172792285f53',
          _connectionId: '6013b69645d76c19c8aa58fe',
          name: 'IMPORT',
        },
      ],
      exports: [
        {
          _id: '6013b6cf7f5a995a563c6344',
          adaptorType: 'RESTExport',
          _userId: '5ca5c855ec5c172792285f53',
          name: 'NEW EXPRT',
          _connectionId: '6013b3bc37c3e052c88154db',
        },
      ],
      integrations: [
        {
          _id: '6013aebb45d76c19c8aa5729',
          name: 'INTEGRATION TRANSFER INVITE',
        },
      ],
    },
    transferErrors: [],
    lastModified: '2021-01-29T08:42:57.065Z',
    createdAt: '2021-01-29T08:38:44.703Z',
    transferToUser: {
      _id: '5d1462515c0dfb2c2d9e12f2',
      email: 'saikaivalya.h@gmail.com-excluded',
      name: 'kaivalya hs',
    },
  },
]);
