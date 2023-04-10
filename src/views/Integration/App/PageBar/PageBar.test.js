import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { renderWithProviders, mockGetRequestOnce, mutateStore } from '../../../../test/test-utils';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import integrationAppUtil from '../../../../utils/integrationApps';
import { getCreatedStore } from '../../../../store';
import PageBar from '.';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const commonIntegration = [{
  _id: '5ff579d745ceef7dcd797c15',
  lastModified: '2021-01-19T06:34:17.222Z',
  _connectorId: 'connectorId',
  name: " AFE 2.0 refactoring for DB's",
  install: [],
  sandbox: false,
  _registeredConnectionIds: [
    '5cd51efd3607fe7d8eda9c97',
    '5ff57a8345ceef7dcd797c21',
  ],
  installSteps: [],
  uninstallSteps: [],
  flowGroupings: [],
  createdAt: '2021-01-06T08:50:31.935Z',
  settings: { supportsMultiStore: true, sections: [{ id: '1111111', label: '11', title: 'title1' }, { id: '2', label: '22', title: 'title2' }] },
}];

describe('PageBar UI testing', () => {
  runServer();
  beforeEach(() => {
    jest.resetAllMocks();
  });
  async function prepareStore(store) {
    act(() => { store.dispatch(actions.user.preferences.request()); });
    act(() => { store.dispatch(actions.resource.requestCollection('integrations')); });
    act(() => { store.dispatch(actions.user.profile.request()); });
    act(() => { store.dispatch(actions.user.org.accounts.requestCollection()); });
    await waitFor(() => expect(store?.getState()?.user?.org?.accounts[0]).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.dateFormat).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user.profile.useErrMgtTwoDotZero).toBeDefined());
  }
  async function initPagebar(errorCount) {
    mockGetRequestOnce('/api/integrations', [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      _connectorId: 'connectorId',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
      settings: {
        supportsMultiStore: true,
        sections: [{ id: 1111111, label: '11', title: 'title1', sections: [{ id: '123', label: '1234', title: 'childtitile', flows: [{ _id: '1111111' }, '2'] }] },
          { id: 2, label: '22', title: 'title2' }],
      },
    }]);
    mockGetRequestOnce('/api/profile', {
      _id: '5ca5c855ec5c172792285f53',
      name: 'Celigo 123',
      email: 'Celigo@celigo.com',
      role: 'io-qa intern',
      company: 'Amazon Central',
      phone: '',
      auth_type_google: {},
      timezone: 'Asia/Calcutta',
      developer: true,
      allowedToPublish: true,
      agreeTOSAndPP: true,
      createdAt: '2019-04-04T09:03:18.208Z',
      useErrMgtTwoDotZero: true,
      authTypeSSO: null,
      emailHash: '1c8eb6f416e72a5499283b56f2663fe1',
    });

    const initialStore = getCreatedStore();

    await prepareStore(initialStore);

    mutateStore(initialStore, draft => {
      draft.session.errorManagement.openErrors = {
        '5ff579d745ceef7dcd797c15': {
          status: 'received',
          data: {
            1111111: {
              numError: errorCount,
              _flowId: '1111111',
            },
            2: { numError: 0, _flowId: '1111111' },
          },
        },
      };
    });

    return renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15']}>
        <Route path="/:integrationId/"><PageBar /></Route>
      </MemoryRouter>, { initialStore });
  }

  test('should test when no integration Id is provided', () => {
    renderWithProviders(<MemoryRouter><PageBar /></MemoryRouter>);
    expect(screen.getByText('tag')).toBeInTheDocument();
  });
  test('should test clone integration button', async () => {
    jest.spyOn(integrationAppUtil, 'isCloningSupported').mockReturnValue(true);
    mockGetRequestOnce('/api/integrations', [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      _connectorId: 'connectorId',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }]);
    const { store } = renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15']}>
        <Route path="/:integrationId"><PageBar /></Route>
      </MemoryRouter>);

    await prepareStore(store);
    const clonebutton = screen.getByRole('link');

    expect(clonebutton).toHaveAttribute('href', '/clone/integrations/5ff579d745ceef7dcd797c15/preview');
  });
  test('should test the child change condition', async () => {
    mockGetRequestOnce('/api/integrations', commonIntegration);
    const { store } = renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/2/tab']}>
        <Route path="/:integrationId/:childId/:tab"><PageBar /></Route>
      </MemoryRouter>);

    await prepareStore(store);

    const select = screen.getByText('title2');

    await userEvent.click(select);

    const option = screen.getAllByRole('option');

    await userEvent.click(option[1]);
    await waitFor(() => expect(option[1]).not.toBeVisible());

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/child/1111111/tab');
  });
  test('should test when unknown child param is given', async () => {
    mockGetRequestOnce('/api/integrations', commonIntegration);
    const { store } = renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/title3/tab']}>
        <Route path="/:integrationId/:childId/:tab"><PageBar /></Route>
      </MemoryRouter>);

    await prepareStore(store);

    const select = screen.getByText('title3');

    await userEvent.click(select);

    const option = screen.getAllByRole('option');

    await userEvent.click(option[1]);
    await waitFor(() => expect(option[1]).not.toBeVisible());

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/child/1111111/tab');
  });
  test('should test selecting same option again', async () => {
    mockGetRequestOnce('/api/integrations', commonIntegration);
    const { store } = renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/2/tab']}>
        <Route path="/:integrationId/:childId/:tab"><PageBar /></Route>
      </MemoryRouter>);

    await prepareStore(store);

    const select = screen.getByText('title2');

    await userEvent.click(select);

    const option = screen.getAllByRole('option');

    await userEvent.click(option[0]);
    await waitFor(() => expect(option[2]).not.toBeVisible());

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/tab');
  });
  test('should test initial no child from params', async () => {
    mockGetRequestOnce('/api/integrations', commonIntegration);
    const { store } = renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/tab']}>
        <Route path="/:integrationId/:tab"><PageBar /></Route>
      </MemoryRouter>);

    await prepareStore(store);

    const select = screen.getByText('All undefineds');

    await userEvent.click(select);

    const option = screen.getAllByRole('option');

    await userEvent.click(option[1]);
    await waitFor(() => expect(option[1]).not.toBeVisible());

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/child/1111111/tab');
  });
  test('should test child with initial error greater than 9999', async () => {
    await initPagebar(10000);

    const select = screen.getByText('All undefineds');

    await userEvent.click(select);

    const option = screen.getAllByRole('option');

    expect(option[1].textContent).toBe(' title19999+');
  });
  test('should test child with initial error between 9999 and 0', async () => {
    await initPagebar(234);

    const select = screen.getByText('All undefineds');

    await userEvent.click(select);

    const option = screen.getAllByRole('option');

    expect(option[1].textContent).toBe(' title1234');
  });
  test('should test add new child button', async () => {
    mockGetRequestOnce('/api/integrations', [{
      _id: '5ff579d745ceef7dcd797c15',
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
      settings: { supportsMultiStore: true },
    }]);
    mockGetRequestOnce('/api/preferences', {
      environment: 'production',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      defaultAShareId: '618cc96475f94b333a55bbd3',
    });
    mockGetRequestOnce('/api/shared/ashares', [{
      _id: '618cc96475f94b333a55bbd3',
      dismissed: true,
      accessLevel: 'administrator',
      integrationAccessLevel: [],
      ownerUser: {
        _id: '5feda6fdae2e896a3f3c5cbf',
        licenses: [{
          expires: '2040-12-31T00:00:00.000Z',
          _integrationId: '5ff579d745ceef7dcd797c15',
        }],
        email: 'dhilip.s@celigo.com',
        name: 'Dhilip S',
        company: 'Dhilip',
        preferences: {
          environment: 'production',
          dateFormat: 'MM/DD/YYYY',
          timeFormat: 'h:mm:ss a',
          drawerOpened: true,
          defaultAShareId: 'own',
          scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
          showReactSneakPeekFromDate: '2019-11-05',
          showReactBetaFromDate: '2019-12-26',
          dashboard: {
            view: 'list',
            pinnedIntegrations: [
              '619f77445324e30fbb2a541c',
              '61f3e489aae2457e6ea838b6',
              '61f8ed0929a80b4b8134eb25',
              '61fa1ab7a6e61314fcdf8d86',
              '6203f8193ac01960c714e5ab',
              '60ee8aa598d5d30b37795033',
              '60f548a995933011558120f5',
              '61bb11b9c9995f173361c4e2',
            ],
          },
          expand: 'Resources',
          fbBottomDrawerHeight: 522,
        },
        allowedToPublish: true,
        timezone: 'Asia/Calcutta',
        useErrMgtTwoDotZero: true,
      },
    }]);

    const { store } = renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15']}>
        <Route path="/:integrationId"><PageBar /></Route>
      </MemoryRouter>);

    await prepareStore(store);

    const add = screen.getByText('Add');

    await userEvent.click(add);
    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/install/addNewStore');
  });

  test('should test the change in tag', async () => {
    mockGetRequestOnce('/api/integrations', commonIntegration);
    const { store } = renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15']}>
        <Route path="/:integrationId"><PageBar /></Route>
      </MemoryRouter>);

    await prepareStore(store);
    const tag = screen.getByText('tag');

    await userEvent.click(tag);
    const input = screen.getByRole('textbox');

    await userEvent.type(input, 'changed');
    await input.blur();

    expect(screen.getByText('tagchanged')).toBeInTheDocument();
  });
  test('should test dashboard tab', async () => {
    mockGetRequestOnce('/api/integrations', commonIntegration);
    const { store } = renderWithProviders(
      <MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15/dashborad']}>
        <Route path="/:integrationId/:dashboardTab"><PageBar /></Route>
      </MemoryRouter>);

    await prepareStore(store);

    const select = screen.getByText('All undefineds');

    await userEvent.click(select);

    const option = screen.getAllByRole('option');

    await userEvent.click(option[1]);
    await waitFor(() => expect(option[1]).not.toBeVisible());

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/child/1111111/dashboard');
  });
});
