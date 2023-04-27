
import React from 'react';
import { screen } from '@testing-library/react';
import { Route, Router } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import { act } from 'react-dom/test-utils';
import {renderWithProviders, mutateStore} from '../../../../test/test-utils';
import actions from '../../../../actions';
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

describe('TabRedirectiion(App) UI tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  function initStore(children, mode) {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = [{
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
        installSteps: ['just some mock string'],
        uninstallSteps: ['just some mock string'],
        flowGroupings: [],
        children,
        mode,
        createdAt: '2021-01-06T08:50:31.935Z',
      }, {
        _id: 'integration_id_1',
        settings: {
          sections: [
            {
              title: 'Title 1',
              id: 'id_1',
              sections: [],
            },
          ],
          supportsMultiStore: true,
        },
      }, {
        _id: 'integration_id_2',
        settings: {
          sections: [
            {
              title: 'Title 1',
              id: 'id_1',
              sections: [],
            },
            {
              title: 'Title 2',
              id: 'id_2',
              sections: [],
            },
          ],
          supportsMultiStore: true,
        },
      }];
      draft.session.integrations = {
        integration_id_1: {
          isTileClick: true,
        },
        integration_id_2: {
          isTileClick: true,
        },
      };
    });

    return initialStore;
  }

  function renderFunction(initialStore, url, path) {
    const history = createMemoryHistory({initialEntries: [url]});

    renderWithProviders(<Router history={history} ><Route path={path}><TabRedirection>Children</TabRedirection></Route></Router>, {initialStore});
  }

  test('should test when no tabs are given from params', () => {
    const initialStore = initStore();

    renderFunction(initialStore, '/5ff579d745ceef7dcd797c15', '/:integrationId');
    expect(screen.getByText('Redirected to " /5ff579d745ceef7dcd797c15/flows')).toBeInTheDocument();
  });
  test('should test when no child is given from params', () => {
    const initialStore = initStore();

    renderFunction(initialStore, '/5ff579d745ceef7dcd797c15/users', '/:integrationId/:tab');
    expect(screen.getByText('Children')).toBeInTheDocument();
  });
  test('should redirect to required URL when mode of child is uninstall', () => {
    const initialStore = initStore([{value: '12345', mode: 'uninstall'}]);

    renderFunction(initialStore, '/5ff579d745ceef7dcd797c15/12345/profile', '/:integrationId/:childId/:tab');
    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/uninstall/child/12345')).toBeInTheDocument();
  });
  test('should redirect to required URL when mode of child is install', () => {
    const initialStore = initStore([{value: '12345', mode: 'install'}]);

    renderFunction(initialStore, '/5ff579d745ceef7dcd797c15/12345/profile', '/:integrationId/:childId/:tab');
    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/install/addNewStore')).toBeInTheDocument();
  });
  test('should redirect to required URL when mode of integration is install', () => {
    const initialStore = initStore(null, 'install');

    renderFunction(initialStore, '/5ff579d745ceef7dcd797c15/12345/profile', '/:integrationId/:childId/:tab');
    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/setup')).toBeInTheDocument();
  });
  test('should redirect to required URL when mode of integration is uninstall', () => {
    const initialStore = initStore(null, 'uninstall');

    renderFunction(initialStore, '/5ff579d745ceef7dcd797c15/profile', '/:integrationId/:tab');
    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/uninstall')).toBeInTheDocument();
  });
  test('should redirect to required URL when no childId is provided and search param has flowJobId', () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = [{
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
        mode: 'install',
        flowGroupings: [],
        createdAt: '2021-01-06T08:50:31.935Z',
        settings: {supportsMultiStore: true,
          sections: [
            {id: '1111111',
              label: '11',
              title: 'title1',
              sections: [{id: 'someID',
                title: 'somesectionId',
                flows: [
                  {
                    _id: '5ea16c600e2fab71928a6152',
                    lastModified: '2021-08-13T08:02:49.712Z',
                    name: ' Bulk insert with harcode and mulfield mapping settings',
                    disabled: true,
                    _integrationId: '5ff579d745ceef7dcd797c15',
                    skipRetries: false,
                    pageProcessors: [
                      {
                        responseMapping: {
                          fields: [],
                          lists: [],
                        },
                        type: 'import',
                        _importId: '5ea16cd30e2fab71928a6166',
                      },
                    ],
                    pageGenerators: [
                      {
                        _exportId: '5d00b9f0bcd64414811b2396',
                      },
                    ],
                    createdAt: '2020-04-23T10:22:24.290Z',
                    lastExecutedAt: '2020-04-23T11:08:41.093Z',
                    autoResolveMatchingTraceKeys: true,
                  },
                ],
              }]},
            {id: '2', label: '22', title: 'title2'}]},
      }];
      draft.data.resources.flows = [{
        _id: '5ea16c600e2fab71928a6152',
        lastModified: '2021-08-13T08:02:49.712Z',
        name: ' Bulk insert with harcode and mulfield mapping settings',
        disabled: true,
        _integrationId: '5ff579d745ceef7dcd797c15',
        skipRetries: false,
        pageProcessors: [
          {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: '5ea16cd30e2fab71928a6166',
          },
        ],
        pageGenerators: [
          {
            _exportId: '5d00b9f0bcd64414811b2396',
          },
        ],
        createdAt: '2020-04-23T10:22:24.290Z',
        lastExecutedAt: '2020-04-23T11:08:41.093Z',
        autoResolveMatchingTraceKeys: true,
      }];
    });

    const history = createMemoryHistory({initialEntries: ['/5ff579d745ceef7dcd797c15/profile']});

    history.location.search = {_flowJobId: '09876'};

    const {store} = renderWithProviders(<Router history={history} ><Route path="/:integrationId/:tab"><TabRedirection>Children</TabRedirection></Route></Router>, {initialStore});

    act(() => { store.dispatch(actions.job.receivedCollection({collection: [{_id: '09876', _flowId: '5ea16c600e2fab71928a6152', type: 'flow' }]})); });
    expect(screen.getByText('Redirected to " /integrationapps/AFE20refactoringforDBs/5ff579d745ceef7dcd797c15/child/1111111/profile')).toBeInTheDocument();
  });
  test('should redirect to the provided URL', () => {
    const initialStore = initStore();

    mutateStore(initialStore, draft => {
      draft.session.integrations['5ff579d745ceef7dcd797c15'] = {redirectTo: 'someURL'};
    });

    renderFunction(initialStore, '/5ff579d745ceef7dcd797c15/profile', '/:integrationId/:tab');
    expect(mockHistoryPush).toHaveBeenCalledWith('/5ff579d745ceef7dcd797c15/someURL');
  });
  test('should test default dispatch calls', () => {
    const initialStore = initStore([{value: '12345', mode: 'install'}], 'uninstall');

    renderFunction(initialStore, '/5ff579d745ceef7dcd797c15/profile', '/:integrationId/:tab');
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'MAPPING_METADATA_REQUEST',
        integrationId: '5ff579d745ceef7dcd797c15',
      });
    expect(mockDispatch).toHaveBeenCalledWith(
      {
        type: 'ADDON_LICENSES_METADATA',
        integrationId: '5ff579d745ceef7dcd797c15',
      });
  });

  test('should redirect to store URL when there is only one store available in tile', () => {
    const initialStore = initStore(null, 'settings');

    renderFunction(initialStore, '/integration_id_1', '/:integrationId');
    expect(mockHistoryPush).toBeCalledWith('/integrationapps/integrationApp/integration_id_1/child/id_1');
  });

  test('should redirect to store URL when there is only multiple stores available in tile', () => {
    const initialStore = initStore(null, 'settings');

    renderFunction(initialStore, '/integration_id_2', '/:integrationId');
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'INTEGRATION_CLEAR_CLICK',
      integrationId: 'integration_id_2',
    });
  });
});
