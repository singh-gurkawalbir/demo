
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import IntegrationCeligoPageBar from '.';
import {mutateStore, renderWithProviders} from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

function initPagebar(props = {}) {
  const initialStore = getCreatedStore();
  const {history} = props;

  mutateStore(initialStore, draft => {
    draft.user = {
      preferences: {
        environment: 'production',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'h:mm:ss a',
        drawerOpened: true,
        expand: 'Resources',
        scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
        showReactSneakPeekFromDate: '2019-11-05',
        showReactBetaFromDate: '2019-12-26',
        defaultAShareId: 'own',
        dashboard: {
          view: 'list',
        },
      },
      profile: {
        _id: '62386a5fed961b5e22e992c7',
        name: 'Prashanth Kumar Nesa',
        email: 'prashanthkumar.nesa@celigo.com',
        role: 'engineering intern',
        company: 'celigo',
        phone: '7995045186',
        auth_type_google: {},
        timezone: 'Asia/Calcutta',
        developer: true,
        allowedToPublish: true,
        agreeTOSAndPP: true,
        createdAt: '2022-03-21T12:06:55.685Z',
        useErrMgtTwoDotZero: true,
        authTypeSSO: null,
        emailHash: '087e41a1843139c27bce730b99664a84',
      },
      notifications: {
        accounts: [],
        stacks: [],
        transfers: [],
      },
      org: {
        users: [],
        accounts: [
          {
            _id: 'own',
            accessLevel: 'owner',
            ownerUser: {
              licenses: [
                {
                  _id: '62386a5fed961b5e22e992c8',
                  created: '2022-03-21T12:06:55.696Z',
                  lastModified: '2022-03-21T12:06:55.707Z',
                  type: 'endpoint',
                  tier: 'free',
                  supportTier: 'essential',
                  sandbox: false,
                  endpoint: {
                    production: {
                      numEndpoints: 2,
                      numAddOnEndpoints: 0,
                      numFlows: 1,
                      numAddOnFlows: 0,
                      numTradingPartners: 0,
                      numAddOnTradingPartners: 0,
                      numAgents: 0,
                      numAddOnAgents: 0,
                    },
                    sandbox: {
                      numEndpoints: 0,
                      numAddOnEndpoints: 0,
                      numFlows: 0,
                      numAddOnFlows: 0,
                      numTradingPartners: 0,
                      numAddOnTradingPartners: 0,
                      numAgents: 0,
                      numAddOnAgents: 0,
                    },
                    apiManagement: false,
                  },
                  resumable: false,
                },
                {
                  _id: '6254397e22a35c0de1fc245e',
                  created: '2022-04-11T14:21:50.104Z',
                  lastModified: '2022-04-11T14:21:50.111Z',
                  expires: '2022-05-11T14:21:50.103Z',
                  type: 'integrationApp',
                  _connectorId: '6253b0cbcddb8a1ba550a048',
                  sandbox: false,
                },
                {
                  _id: '625e3e1b26f1473265febe40',
                  created: '2022-04-19T04:44:11.022Z',
                  lastModified: '2022-04-19T04:44:11.030Z',
                  expires: '2022-05-19T04:44:11.022Z',
                  type: 'integrationApp',
                  _connectorId: '6253b0cbcddb8a1ba550a048',
                  sandbox: false,
                },
              ],
            },
          },
        ],
      },
      debug: false,
    };
  });

  return renderWithProviders((<Router history={history}><IntegrationCeligoPageBar {...props} /></Router>), {initialStore});
}
jest.mock('../../../components/KeywordSearch', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/KeywordSearch'),
  default: () => (
    <>
      <div>SearchBar</div>
    </>
  ),
}));
jest.mock('../../../utils/resource', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utils/resource'),
  generateNewId: () => 'new-Z0NZtH92gIw',
}));
jest.mock('../../../components/icons/TilesViewIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/icons/TilesViewIcon'),
  default: () => (
    <>
      <div>TileButton</div>
    </>
  ),
}));
jest.mock('../../../components/icons/ListViewIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/icons/ListViewIcon'),
  default: () => (
    <>
      <div>ListButton</div>
    </>
  ),
}));
describe('Celigo Home Pagebar UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should display all the contents of the pagebar', () => {
    const history = createMemoryHistory();

    initPagebar({history});
    expect(screen.getByText(/My integrations/i)).toBeInTheDocument();
    expect(screen.getByText(/SearchBar/i)).toBeInTheDocument();               // SearchBar text comes from the mocked component//
  });
  test('should render the Create and Upload buttons', () => {
    const history = createMemoryHistory();

    initPagebar({history});
    expect(screen.getByRole('button', {name: 'Create'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Upload'})).toBeInTheDocument();
  });
  test('should render the create options when clicked on create button', () => {
    const history = createMemoryHistory();

    initPagebar({history});
    const createButton = screen.getByRole('button', {name: 'Create'});

    userEvent.click(createButton);
    const menuList = screen.getAllByRole('menuitem');

    expect(menuList).toHaveLength(3);
    expect(screen.getByText(/Sync data between apps/i)).toBeInTheDocument();
    expect(screen.getByText(/Store credentials to apps/i)).toBeInTheDocument();
    expect(screen.getByText(/Organize flows in a folder/i)).toBeInTheDocument();
    expect(screen.getByText(/Connection/i)).toBeInTheDocument();
    expect(screen.getByText('Integration')).toBeInTheDocument();
  });
  test('should render the upload integration option when clicked on upload button', () => {
    const history = createMemoryHistory();

    initPagebar({history});
    const Upload = screen.getByRole('button', {name: 'Upload'});

    userEvent.click(Upload);
    const menuList = screen.getAllByRole('menuitem');

    expect(menuList).toHaveLength(1);
    expect(screen.getByText('Integration')).toBeInTheDocument();
    expect(screen.getByText(/Upload an existing integration/i)).toBeInTheDocument();
  });
  test('should redirect to the respective component url when clicked on create flow option', async () => {
    const history = createMemoryHistory();

    initPagebar({history});
    const createButton = screen.getByRole('button', {name: 'Create'});

    userEvent.click(createButton);
    const FlowOption = screen.getAllByRole('menuitem')[0];

    userEvent.click(FlowOption);

    await waitFor(() => expect(history.location.pathname).toBe('/integrations/none/flowBuilder/new'));   // checking for redirection to new url //
  });
  test('should redirect to the respective component url when clicked on create integration option', async () => {
    const history = createMemoryHistory();

    initPagebar({history});
    const createButton = screen.getByRole('button', {name: 'Create'});

    userEvent.click(createButton);
    const integrationOption = screen.getAllByRole('menuitem')[2];

    userEvent.click(integrationOption);

    await waitFor(() => expect(history.location.pathname).toBe('//add/integrations/new-Z0NZtH92gIw'));   // checking for redirection to new url //
  });
  test('should redirect to the create connection drawer when clicked on create connection option', async () => {
    const history = createMemoryHistory();

    initPagebar({history});
    const createButton = screen.getByRole('button', {name: 'Create'});

    userEvent.click(createButton);
    const integrationOption = screen.getAllByRole('menuitem')[1];

    userEvent.click(integrationOption);

    await waitFor(() => expect(history.location.pathname).toBe('//add/connections/new-Z0NZtH92gIw'));   // checking for redirection to new url //
  });
  test('should make the respective dispatch calls for the listview and gridview iconbuttons', async () => {
    const history = createMemoryHistory();

    initPagebar({history});
    userEvent.click(screen.getByText('TileButton'));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.user.preferences.update({ dashboard: {view: 'tile'}})));
    userEvent.click(screen.getByText('ListButton'));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.user.preferences.update({ dashboard: {view: 'list'} })));
  });
});
