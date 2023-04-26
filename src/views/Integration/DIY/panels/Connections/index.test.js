import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';
import * as utils from '../../../../../utils/resource';
import ConnectionsPanel from '.';

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../../../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../../components/LoadResources'),
  default: props => <div>{props.children}</div>,
}));

describe('ConnectionsPanel(DIY) UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(utils, 'generateNewId').mockReturnValue('somegeneratedID');
  });
  function initStoreAndRender(_connectorId, childId) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile = { timezone: 'Asia/Calcutta' };

      draft.data.resources.integrations = [{
        _id: '5ff579d745ceef7dcd797c15',
        _connectorId,
        lastModified: '2021-01-19T06:34:17.222Z',
        name: " AFE 2.0 refactoring for DB's",
        install: [],
        sandbox: false,
        _registeredConnectionIds: [
          '5ee0b67a3c11e4201f43102d',
        ],
        installSteps: [],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
      },
      {
        _id: '5ff579d745ceef7dcd797c16',
        _parentId: '5ff579d745ceef7dcd797c15',
        lastModified: '2021-01-19T06:34:17.222Z',
        name: "Children of AFE 2.0 refactoring for DB's",
        install: [],
        sandbox: false,
        _registeredConnectionIds: [],
        installSteps: [],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
      },
      ];
      draft.user.preferences = {defaultAShareId: 'own'};
      draft.data.resources.connections = [
        {
          _id: '5ee0b67a3c11e4201f43102d',
          createdAt: '2020-06-10T10:31:22.431Z',
          lastModified: '2020-07-08T04:32:09.756Z',
          type: 'rest',
          name: 'Acumatica Agent HTTP',
          assistant: 'acumatica',
          offline: true,
          sandbox: false,
          _agentId: '5ed8c824f1188372591a32c4',
          isHTTP: true,
        },
      ];
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['someinitalURL']}>
        <ConnectionsPanel integrationId="5ff579d745ceef7dcd797c15" childId={childId} />
      </MemoryRouter>, {initialStore});
  }
  test('should click on Create connection', async () => {
    initStoreAndRender('some_connectorId', '5ff579d745ceef7dcd797c15');
    await userEvent.click(screen.getByText('Create connection'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          {
            op: 'add',
            path: '/_integrationId',
            value: '5ff579d745ceef7dcd797c15',
          },
          { op: 'add', path: '/_connectorId', value: 'some_connectorId' },
          { op: 'add', path: '/newIA', value: true },
          { op: 'add', path: '/applications', value: [] },
        ],
        id: 'somegeneratedID',
      }
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('someinitalURL/add/connections/somegeneratedID');
  });
  test('should test registered connections buton', async () => {
    initStoreAndRender(null, '5ff579d745ceef7dcd797c15');

    await userEvent.click(screen.getByText('Register connections'));
    await userEvent.click(screen.getByText('Register'));
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Create connection'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          {
            op: 'add',
            path: '/_integrationId',
            value: '5ff579d745ceef7dcd797c15',
          },
          { op: 'add', path: '/applications', value: ['acumatica']},
        ],
        id: 'somegeneratedID',
      }
    );
  });
  test('should test when no child is passed', async () => {
    initStoreAndRender(null, null);
    await userEvent.click(screen.getByText('Register connections'));
    await userEvent.click(screen.getByText('Register'));
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Create connection'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'RESOURCE_STAGE_PATCH',
        patch: [
          {
            op: 'add',
            path: '/_integrationId',
            value: '5ff579d745ceef7dcd797c15',
          },
        ],
        id: 'somegeneratedID',
      }
    );
  });
  test('should test table', () => {
    initStoreAndRender(null, null);
    expect(screen.getAllByRole('row')[0].textContent).toBe('NameStatusTypeAPILast updatedQueue sizeActions');
    expect(screen.getAllByRole('row')[1].textContent).toBe('Acumatica Agent HTTPOffline07/08/2020 10:02:09 am0');
  });
  test('should test use effects dispatch call', () => {
    initStoreAndRender();
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'PATCH_FILTER',
        name: '5ff579d745ceef7dcd797c15+connections',
        filter: { sort: { order: 'asc', orderBy: 'name' } },
      }
    );
  });
  test('should test for standalone case', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.resource.somegeneratedID = 'newResourceId';

      draft.user.preferences = {defaultAShareId: 'own'};
    });

    renderWithProviders(
      <MemoryRouter initialEntries={['someinitalURL']}>
        <ConnectionsPanel integrationId="5ff579d745ceef7dcd797c15" />
      </MemoryRouter>, {initialStore});
    await userEvent.click(screen.getByText('Create connection'));
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'REGISTER_REQUEST',
        connectionIds: ['newResourceId'],
        integrationId: '5ff579d745ceef7dcd797c15',
      }
    );
  });
  test('should test table duplicate', () => {
    initStoreAndRender(null, '5ff579d745ceef7dcd797c15');
    expect(screen.getAllByRole('row')[0].textContent).toBe('NameStatusTypeAPILast updatedQueue sizeActions');
    expect(screen.getAllByRole('row')[1].textContent).toBe('Acumatica Agent HTTPOffline07/08/2020 10:02:09 am0');
  });
});
