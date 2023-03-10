
import React from 'react';
import { screen } from '@testing-library/react';
import Mapper2Guide from './Mapper2Guide';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();

function initMapper2Guide() {
  const mustateState = draft => {
    draft.session.mapping = {
      mapping: {
        mappings: [
          {
            extract: 'Company',
            generate: 'organization.name',
            dataType: 'string',
            key: 'rL4uySoXKq',
          },
        ],
        lookups: [],
        v2TreeData: [
          {
            key: 'bZ9gb28YlSBPNrYc4rUsq',
            isEmptyRow: true,
            title: '',
            disabled: false,
            dataType: 'string',
            sourceDataType: 'string',
          },
        ],
        expandedKeys: [
          'bZ9gb28YlSBPNrYc4rUsq',
        ],
        flowId: '63a54e63d9e20c15d94da0f1',
        importId: '632950280dbc53086e899759',
        status: 'received',
        isGroupedSampleData: false,
        isMonitorLevelAccess: false,
        version: 1,
        requiredMappings: [],
        extractsTree: [
          {
            key: 'lCOPGJ9AtYT7Z8TdtbN8O',
            title: '',
            dataType: 'object',
            propName: '$',
            children: [
              {
                key: 'oB_iFBNu6XxhoN4LXEDD4',
                parentKey: 'lCOPGJ9AtYT7Z8TdtbN8O',
                title: '',
                jsonPath: 'thirdpartyacct',
                propName: 'thirdpartyacct',
                dataType: 'string',
              },
              {
                key: 'D2JXQWcx3oRLKzXBqLbBT',
                parentKey: 'lCOPGJ9AtYT7Z8TdtbN8O',
                title: '',
                jsonPath: 'thirdpartycarrier',
                propName: 'thirdpartycarrier',
                dataType: 'object',
                children: [
                  {
                    key: 'GcjbbmwkyGxF37T_3dJSi',
                    parentKey: 'D2JXQWcx3oRLKzXBqLbBT',
                    title: '',
                    jsonPath: 'thirdpartycarrier.internalid',
                    propName: 'internalid',
                    dataType: 'string',
                  }],
              },
            ],
          }],
      }};
    draft.data.resources = {
      integrations: [
        {
          _id: '6328acba3eea0d15ecfa73d1',
          lastModified: '2022-11-17T07:40:04.266Z',
          name: '1_Testing_DND',
          install: [],
          _registeredConnectionIds: [
            '63232f66514d5b0bf7b3ab67',
            '631a19044ceac669f82fb7d5',
            '631a19154ceac669f82fb7df',
            '6322ff72b5c15b058122871e',
            '631a18e9abf51e7a86c80f16',
            '63218ef327cca414396af399',
            '62fb3e595ebfa623b56565c3',
          ],
          aliases: [
            {
              alias: 'op',
              _connectionId: '631a18e9abf51e7a86c80f16',
            },
            {
              alias: 'ss',
              _exportId: '63715ef35772f25f7e6a9bc4',
            },
            {
              alias: 'lpp',
              _connectionId: '63232f66514d5b0bf7b3ab67',
            },
            {
              alias: 'ooo',
              _connectionId: '6322ff72b5c15b058122871e',
            },
            {
              alias: 'aliasid',
              _connectionId: '631a18e9abf51e7a86c80f16',
            },
          ],
          installSteps: [],
          uninstallSteps: [],
          changeEditionSteps: [],
          flowGroupings: [],
          createdAt: '2022-09-19T17:54:02.115Z',
        },
      ],
      'transfers/invited': [],
      imports: [
        {
          _id: '632950280dbc53086e899759',
          createdAt: '2022-09-20T05:31:20.542Z',
          lastModified: '2022-09-20T05:31:20.618Z',
          name: 'Test ZD Import',
          _connectionId: '62fb430f5fb285335fc1bed6',
          apiIdentifier: 'i40d0edd33',
          ignoreExisting: false,
          ignoreMissing: false,
          oneToMany: false,
          mapping: {
            fields: [
              {
                extract: 'Company',
                generate: 'organization.name',
                dataType: 'string',
              },
            ],
          },
          http: {
            relativeURI: [
              '/organizations',
            ],
            method: [
              'POST',
            ],
            body: [
              '{\n    "organization": {\n      "name": "{{timestamp format "Asia/Calcutta"}} {{record.organization.name}}"\n    }\n}',
            ],
            headers: [
              {
                name: 'mediaType',
                value: '{{connection.http.mediaType}}',
              },
            ],
            batchSize: 1,
            sendPostMappedData: true,
            formType: 'http',
          },
          filter: {
            type: 'expression',
            expression: {
              rules: [],
              version: '1',
            },
            version: '1',
            rules: [],
          },
          adaptorType: 'HTTPImport',
        },
      ],
    };
  };

  mutateStore(initialStore, mustateState);

  return renderWithProviders(<Mapper2Guide />, {initialStore});
}

describe('Mapper2Guide UI tests', () => {
  test('Should able to test the Mapper2Guide Link', () => {
    initMapper2Guide();

    expect(screen.getByRole('link', {name: 'Learn about Mapper 2.0'})).toBeInTheDocument();
  });
});
