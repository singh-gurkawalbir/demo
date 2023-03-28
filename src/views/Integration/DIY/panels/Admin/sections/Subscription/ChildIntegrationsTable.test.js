
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ChildIntegrationsTable from './ChildIntegrationsTable';
import { mutateStore, renderWithProviders } from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';
import { getCreatedStore } from '../../../../../../../store';

let initialStore = {};

async function initChildIntegrationsTable(props) {
  //
  const ui = (
    <MemoryRouter>
      <ChildIntegrationsTable {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('ChildIntegrationsTable Unit tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
          initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should render column headers correctly', async () => {
    const props = {
      integrationId: '123',
      allChildIntegrations: [
        {
          _id: 'l1',
        },
        {
          _id: 'l2',
        },
      ],
    };

    await initChildIntegrationsTable(props);
    const columns = screen.getAllByRole('columnheader').map(ele => ele.textContent);

    expect(columns).toEqual([
      'Name',
      'Installed on',
      'Edition',
      'Status',
    ]);
  });
  test('Should call actions when parentStatus is done', async () => {
    const props = {
      integrationId: '61604a5a8364267b8a378084',
      allChildIntegrations: [
        {
          _id: 'l1',
          name: 'Child 1',
          createdAt: '2018-01-29T06:39:54.268Z',
        },
        {
          _id: 'l2',
          name: 'Child 2',
          createdAt: '2022-12-07T18:05:50.963Z',
        },
      ],
    };

    mutateStore(initialStore, draft => {
      draft.session.integrationApps.upgrade = {
        '61604a5a8364267b8a378084': {
          status: 'done',
        },
      };
      draft.data.resources.published = [
        {
          _id: '638ddc301752407a977abf09',
        },
        {
          _id: '6392c398644412599848bd41',
        },
      ];

      draft.user.org.accounts = [
        {
          accessLevel: 'administrator',
          _id: 'own',
          ownerUser: {
            licenses: [
              {
                _id: '6390d54d54158d2d033a00dc',
                created: '2018-01-29T06:39:54.268Z',
                lastModified: '2022-06-27T07:52:09.014Z',
                expires: '2023-05-05T00:00:00.000Z',
                type: 'integrationApp',
                _connectorId: '58777a2b1008fb325e6c0953',
                _integrationId: '61604a5a8364267b8a378084',
              },
              {
                _id: '6390d5fef89ea02cbbc2e54b',
                created: '2022-12-07T18:05:50.963Z',
                lastModified: '2022-12-16T06:33:00.700Z',
                type: 'integrationAppChild',
                _connectorId: '638ddc301752407a977abf09',
                _integrationId: 'l1',
                _editionId: '638ddc301752407a977abf0b',
                _parentId: '6390d54d54158d2d033a00dc',
                _changeEditionId: '312wd3234',
              },
              {
                _id: '639809bc9ddced3db24dd7ef',
                created: '2022-12-13T05:12:28.939Z',
                lastModified: '2022-12-15T07:09:57.622Z',
                expires: '2023-12-13T00:00:00.000Z',
                type: 'integrationAppChild',
                _connectorId: '6392c398644412599848bd41',
                _integrationId: 'l2',
                _parentId: '6390d54d54158d2d033a00dc',
                _editionId: '6392c398644412599848bd44',
                _changeEditionId: '21edaqwd321e',
              },
            ],
          },
        },
      ];
    });

    await initChildIntegrationsTable(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.addChildForUpgrade(['l1', 'l2']));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('successMessageFlags', {
      showMessage: true,
      showFinalMessage: true,
    }));
  });
});
