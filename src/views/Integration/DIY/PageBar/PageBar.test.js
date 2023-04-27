import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import {renderWithProviders, mockGetRequestOnce} from '../../../../test/test-utils';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import PageBar from '.';
import { ConfirmDialogProvider } from '../../../../components/ConfirmDialog';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('PageBar2 UI tests', () => {
  runServer();
  beforeEach(() => {
    mockGetRequestOnce('/api/integrations/5ff579d745ceef7dcd797c15/tree/metadata?additionalFields=createdAt,_parentId', {
      childIntegrations: [
        {
          _id: '5ff579d745ceef7dcd797c16',
          mode: 'settings',
          _connectorId: 'connectorId',
          name: ' AFE 2.0 2',
          install: [],
          sandbox: false,
          installSteps: [],
          uninstallSteps: [],
          flowGroupings: [],
          createdAt: '2021-01-06T08:50:31.935Z',
          _parentId: '5ff579d745ceef7dcd797c15',
        },
        {
          _id: '5ff579d745ceef7dcd797c17',
          mode: 'uninstall',
          _connectorId: 'connectorId',
          name: ' AFE 2.0 3',
          install: [],
          sandbox: false,
          installSteps: [],
          uninstallSteps: [],
          flowGroupings: [],
          createdAt: '2021-01-06T08:50:31.935Z',
          _parentId: '5ff579d745ceef7dcd797c15',
        },
        {
          _id: 'uninstall_id',
          name: ' AFE 2.0 4',
          mode: 'uninstall',
          _connectorId: 'connectorId',
          createdAt: '2021-01-06T08:50:31.935Z',
          _parentId: '5ff579d745ceef7dcd797c15',
        },
      ]});

    mockGetRequestOnce('/api/integrations/5ff579d745ceef7dcd797c15', [
      {
        _id: '5ff579d745ceef7dcd797c15',
        mode: 'setttings',
        initChild: {function: true},
        description: 'description',
        lastModified: '2021-01-19T06:34:17.222Z',
        _connectorId: 'connectorId',
        name: " AFE 2.0 refactoring for DB's",
        install: [],
        sandbox: false,
        _registeredConnectionIds: [
          '5cd51efd3607fe7d8eda9c97',
          '5ff57a8345ceef7dcd797c21',
        ],
        installSteps: [{}, {}],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
      },
    ]);
    jest.resetAllMocks();
  });
  function renderFunction() {
    const {store} = renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15']}>
          <Route path="/:integrationId"><PageBar /></Route>
        </MemoryRouter>
      </ConfirmDialogProvider>);

    return store;
  }
  async function prefAndIntegInStore(store) {
    act(() => { store.dispatch(actions.user.preferences.request()); });
    act(() => { store.dispatch(actions.resource.requestCollection('integrations')); });
    act(() => { store.dispatch(actions.resource.requestCollection('tree/metadata', undefined, undefined, '5ff579d745ceef7dcd797c15')); });
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.['tree/metadata']).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.dateFormat).toBeDefined());
  }
  async function renderWithIntegrationsMode(mode) {
    mockGetRequestOnce('/api/integrations', [
      {
        _id: '5ff579d745ceef7dcd797c15',
        mode,
        initChild: {function: true},
        description: 'description',
        lastModified: '2021-01-19T06:34:17.222Z',
        _connectorId: 'connectorId',
        name: " AFE 2.0 refactoring for DB's",
        install: [],
        sandbox: false,
        _registeredConnectionIds: [
          '5cd51efd3607fe7d8eda9c97',
          '5ff57a8345ceef7dcd797c21',
        ],
        installSteps: [{}, {}],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
      },
      {
        _id: '5ff579d745ceef7dcd797c16',
        mode,
        initChild: {function: true},
        description: 'description',
        lastModified: '2021-01-19T06:34:17.222Z',
        _connectorId: 'connectorId',
        name: ' AFE 2.0 2',
        install: [],
        sandbox: false,
        _registeredConnectionIds: [
          '5cd51efd3607fe7d8eda9c97',
          '5ff57a8345ceef7dcd797c21',
        ],
        installSteps: [{}],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
        _parentId: '5ff579d745ceef7dcd797c15',
      },
      {
        _id: '5ff579d745ceef7dcd797c17',
        initChild: {function: true},
        mode,
        description: 'description',
        lastModified: '2021-01-19T06:34:17.222Z',
        _connectorId: 'connectorId',
        name: ' AFE 2.0 3',
        install: [{}],
        sandbox: false,
        _registeredConnectionIds: [
          '5cd51efd3607fe7d8eda9c97',
          '5ff57a8345ceef7dcd797c21',
        ],
        installSteps: [{}],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
        _parentId: '5ff579d745ceef7dcd797c15',
      },
      {
        _id: 'uninstall_id',
        name: ' AFE 2.0 4',
        mode: 'uninstall',
        _connectorId: 'connectorId',
        createdAt: '2021-01-06T08:50:31.935Z',
        _parentId: '5ff579d745ceef7dcd797c15',
      },
    ]);
    const {store} = renderWithProviders(
      <ConfirmDialogProvider>
        <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16']}>
          <Route path="/:integrationId/:childId"><PageBar /></Route>
        </MemoryRouter>
      </ConfirmDialogProvider>);

    await prefAndIntegInStore(store);
  }
  test('should test title as standalone', () => {
    renderWithProviders(<MemoryRouter><PageBar /></MemoryRouter>);
    expect(screen.getByText('Standalone flows')).toBeInTheDocument();
  });
  test('should test title with some integrationId', async () => {
    const store = renderFunction();
    const spyOnDispatch = jest.spyOn(store, 'dispatch');

    await prefAndIntegInStore(store);
    const name = screen.getByText('AFE 2.0 refactoring for DB\'s');

    await userEvent.click(name);
    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'changed');
    await input.blur();
    expect(spyOnDispatch).toHaveBeenCalledWith({asyncKey: undefined,
      context: undefined,
      id: '5ff579d745ceef7dcd797c15',
      options: undefined,
      parentContext: undefined,
      patch: [{op: 'replace', path: '/name', value: " AFE 2.0 refactoring for DB'schanged"}],
      resourceType: 'integrations',
      type: 'RESOURCE_STAGE_PATCH_AND_COMMIT'});
  });
  test('should test clonebutton', async () => {
    const store = renderFunction();

    await prefAndIntegInStore(store);

    const clonebutton = screen.getByRole('link', {name: 'Clone integration'});

    expect(clonebutton).toHaveAttribute('href', '/clone/integrations/5ff579d745ceef7dcd797c15/preview');
  });
  test('should test delete button', async () => {
    const store = renderFunction();

    await prefAndIntegInStore(store);
    const deletebutton = screen.getByRole('button', {name: 'Delete integration'});

    await userEvent.click(deletebutton);
    await waitFor(() => expect(screen.getByText('Confirm delete')).toBeInTheDocument());
  });
  test('should test add child option', async () => {
    const store = renderFunction();

    const spyOnDispatch = jest.spyOn(store, 'dispatch');

    mockGetRequestOnce('/api/integrations', [{
      _id: '5ff579d745ceef7dcd797c15',
      initChild: {function: true},
      description: 'description',
      lastModified: '2021-01-19T06:34:17.222Z',
      _connectorId: 'connectorId',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: [{}, {}],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }]);

    await prefAndIntegInStore(store);
    const add = screen.getByText('Add new child');

    await userEvent.click(add);
    expect(spyOnDispatch).toHaveBeenCalledWith({id: '5ff579d745ceef7dcd797c15', type: 'NTEGRATION_APPS_INSTALLER_INIT_CHILD'});
  });
  test('should test change child where mode is null', async () => {
    await renderWithIntegrationsMode(null);

    const select = screen.getByText('AFE 2.0 2');

    await userEvent.click(select);

    const options = screen.getAllByRole('option');

    await userEvent.click(options[1]);
    await waitFor(() => expect(screen.queryByText('Select child')).not.toBeInTheDocument());
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/child/5ff579d745ceef7dcd797c15/flows');
  });
  test('should test change child (mode install)', async () => {
    await renderWithIntegrationsMode('install');

    const select = screen.getByText('AFE 2.0 2');

    await userEvent.click(select);

    const options = screen.getAllByRole('option');

    await userEvent.click(options[3]);
    await waitFor(() => expect(screen.queryByText('Select child')).not.toBeInTheDocument());
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE203/5ff579d745ceef7dcd797c17/setup');
  });
  test('should test change child (mode uninstall)', async () => {
    await renderWithIntegrationsMode('uninstall');

    const select = screen.getByText('AFE 2.0 2');

    await userEvent.click(select);

    const options = screen.getAllByRole('option');

    await userEvent.click(options[4]);
    await waitFor(() => expect(screen.queryByText('Select child')).not.toBeInTheDocument());
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE204/uninstall_id/uninstall');
  });
});
