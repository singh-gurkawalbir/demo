import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import RequestUrlPanel from './requestUrlPanel';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import { getCreatedStore } from '../../../store';

let initialStore;

async function initRequestUrlPanel({props} = {}) {
  mutateStore(initialStore, draft => {
    draft.session.resourceFormSampleData[props.resourceId] = {
      preview: {
        status: 'received',
        data: [{id: '12345', name: 'Test name'}],
        recordSize: 10,
      },
    };
    draft.data.resources.exports = [
      {_id: '12345',
        name: 'Test name',
        _integrationId: '78965',
        _connectionId: '965432',
        adaptorType: 'RESTExport',
      },
    ];
    draft.data.resources.flows = [
      {_id: '98765', name: 'Test name', pageProcessors: [{_importId: '23456'}], pageGenerators: [{_exportId: '12345'}], _integrationId: '78965'},
    ];
    draft.data.resources.integrations = [
      {
        _id: '78965',
        name: 'Test Integration Name',
        _registeredConnectionIds: [
          '965432',
          '631097',
        ],
      },
    ];
    draft.data.resources.connections = [
      {
        _id: '965432',
        name: 'Test Connection',
        assistant: '3plcentral',
        type: 'http',
        http: {
          baseURI: 'https://test.com/',
          formType: 'assistant',
        },
      },
    ];
  });
  const ui = (
    <MemoryRouter>
      <RequestUrlPanel {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('testsuite for Request Url Panel', () => {
  runServer();
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the url rendered', async () => {
    const props = {
      resourceId: '12345',
      resourceType: 'exports',
      previewStageDataList: {
        request: {
          data: [
            {
              headers: {
                accept: 'application/json',
              },
              url: 'https://test.com/testing',
              method: 'GET',
            },
          ],
          status: 'received',
        },
        raw: {
          data: [
            {
              headers: {
                'content-type': 'application/json',
              },
              body: '{"id":922, "name": "Test name"}',
              url: 'https://test.com/testing',
              statusCode: 200,
            },
          ],
          status: 'received',
        },
        preview: {
          data: [
            {id: 922, name: 'Test name'},
          ],
          status: 'received',
        },
      },
    };

    await initRequestUrlPanel({props});
    expect(screen.getByText(/Request URL/i)).toBeInTheDocument();
    expect(screen.getByText('https://test.com/testing')).toBeInTheDocument();
  });
  test('should test the empty request url panel', async () => {
    const props = {
      previewStageDataList: {
      },
      showEmptyPanel: true,
    };

    mutateStore(initialStore, draft => {
      draft.data.resources = {};
    });

    const { utils } = await initRequestUrlPanel({props});

    expect(utils.container).toBeEmptyDOMElement();
  });
});

