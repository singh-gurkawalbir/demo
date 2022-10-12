/* global describe, test, expect, jest, beforeEach */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import {renderWithProviders} from '../../../../test/test-utils';
import {getCreatedStore} from '../../../../store';
import TabRedirection from '.';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Redirect: props => {
    const text = `Redirected to " ${props.to.pathname ? props.to.pathname : props.to}`;

    return (
      <>
        {text}
      </>
    );
  },
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('TabRedirection(DIY) UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  function initStore(mode) {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = [{
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
      installSteps: ['just some mock string'],
      uninstallSteps: ['just some mock string'],
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }];

    return initialStore;
  }
  function renderFunction(initialStore, pathname, routePath) {
    renderWithProviders(
      <MemoryRouter initialEntries={[{pathname}]}>
        <Route path={routePath}>
          <TabRedirection>Children</TabRedirection>
        </Route>
      </MemoryRouter>, {initialStore});
  }
  test('should test when only children is provided', () => {
    renderWithProviders(<MemoryRouter><TabRedirection>Children</TabRedirection></MemoryRouter>);
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  test('should test when IntegrationId is provided', async () => {
    const initialStore = initStore();

    renderFunction(
      initialStore,
      '/integrations/5fc5e0e66cfe5b44bb95de70/flowBuilder/60db46af9433830f8f0e0fe7/settings',
      '/integrations/:integrationId/flowBuilder',
    );
    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  test('should redirect when no template is provided from params but integration has templateID ', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = [
      {
        _id: '5ff579d745ceef7dcd797c15',
        _templateId: '6013fcd90f0ac62d08bb6dae',
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
        installSteps: ['just some mock string'],
        uninstallSteps: ['just some mock string'],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
      },
    ];
    initialStore.getState().data.resources.marketplacetemplates = [
      {
        _id: '6013fcd90f0ac62d08bb6dae',
        name: 'concur',
        lastModified: '2021-01-29T12:17:29.248Z',
        applications: [
          'concurexpense',
        ],
        free: false,
      },
    ];

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/profile',
      '/integrations/:integrationId/:childId/:tab',
    );

    expect(mockHistoryPush).toHaveBeenCalledWith('/templates/Concurexpense-Concurexpense/5ff579d745ceef7dcd797c15/profile');
  });
  test('should redirect to required page when child is not provided to integration (mode install)', async () => {
    const initialStore = initStore('install');

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/profile',
      '/integrations/:integrationId/:childId/:tab',
    );

    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/setup'));
  });
  test('should redirect to required page when child is not provided to integration (mode uninstall)', async () => {
    const initialStore = initStore('uninstall');

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/profile',
      '/integrations/:integrationId/:childId/:tab',
    );

    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/uninstall/child/5ff579d745ceef7dcd797c16'));
  });
  test('should redirect to required page when no tab is provided', async () => {
    const initialStore = initStore();

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16',
      '/integrations/:integrationId/:childId',
    );

    expect(screen.getByText('Redirected to " /integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/flows'));
  });

  test('should redirect to provided URL', async () => {
    const initialStore = initStore();

    initialStore.getState().session.integrations['5ff579d745ceef7dcd797c15'] = {redirectTo: 'someURL'};

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/profile',
      '/integrations/:integrationId/:childId/:tab',
    );

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/someURL');
  });
  test('should redirect to default child', async () => {
    const initialStore = initStore();

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/profile',
      '/integrations/:integrationId/:tab',
    );

    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/child/5ff579d745ceef7dcd797c15/profile')).toBeInTheDocument();
  });
  test('should redirect to home', async () => {
    const initialStore = initStore();

    initialStore.getState().session.integrations['5ff579d745ceef7dcd797c15'] = {redirectTo: '/home'};

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/profile',
      '/integrations/:integrationId/:childId/:tab',
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('/home');
  });
  test('should redirect to uninstall the child', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = [
      {
        _id: '5ff579d745ceef7dcd797c15',
        mode: 'install',
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
        installSteps: ['just some mock string'],
        uninstallSteps: ['2'],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
      },
      {
        _id: '5ff579d745ceef7dcd797c16',
        mode: 'uninstall',
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
        installSteps: [],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
        _parentId: '5ff579d745ceef7dcd797c15',
      },
    ];

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/profile',
      '/integrations/:integrationId/:childId/:tab',
    );

    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/uninstall/child/5ff579d745ceef7dcd797c16')).toBeInTheDocument();
  });
  test('should redirect to setup of child', async () => {
    const initialStore = getCreatedStore();

    initialStore.getState().data.resources.integrations = [
      {
        _id: '5ff579d745ceef7dcd797c15',
        mode: 'install',
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
        installSteps: ['just some mock string'],
        uninstallSteps: ['2'],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
      },
      {
        _id: '5ff579d745ceef7dcd797c16',
        mode: 'install',
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
        installSteps: [],
        uninstallSteps: [],
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
        _parentId: '5ff579d745ceef7dcd797c15',
      },
    ];

    initialStore.getState().session.resource = {parentChildMap: []};
    initialStore.getState().session.resource.parentChildMap['5ff579d745ceef7dcd797c15'] = '5ff579d745ceef7dcd797c16';

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/profile',
      '/integrations/:integrationId/:childId/:tab',
    );

    expect(mockHistoryPush).toHaveBeenCalledWith('/integrationapps/AFE202/5ff579d745ceef7dcd797c16/setup');
  });
  test('should test the dispatch calls', async () => {
    const initialStore = initStore();

    initialStore.getState().user.preferences = {
      environment: 'sandbox',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: 'h:mm:ss a',
      expand: 'Resources',
      scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
      showReactSneakPeekFromDate: '2019-11-05',
      showReactBetaFromDate: '2019-12-26',
      defaultAShareId: 'own',
    };

    renderFunction(
      initialStore,
      '/integrations/5ff579d745ceef7dcd797c15/5ff579d745ceef7dcd797c16/profile',
      '/integrations/:integrationId/:childId/:tab',
    );

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_PREFERENCES',
      preferences: { environment: 'production' },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADDON_LICENSES_METADATA',
      integrationId: '5ff579d745ceef7dcd797c15',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'MAPPING_METADATA_REQUEST',
      integrationId: '5ff579d745ceef7dcd797c15',
    });
  });
});
