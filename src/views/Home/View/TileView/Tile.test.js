
import React from 'react';
import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import Tile from './Tile';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';

const history = createMemoryHistory();

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initTile(props = {}) {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.user.preferences = {
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
        view: 'tile',
        tilesOrder: [
          '62bedcdca0f5f21448171ea2',
          '62be9cf14a6daf23ece8ed33',
          '62beb29aa0f5f2144816f80c',
          '6253af74cddb8a1ba550a010',
        ],
      },
    };
    draft.user.profile = {
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
      useErrMgtTwoDotZero: props.errmgt,
      authTypeSSO: null,
      emailHash: '087e41a1843139c27bce730b99664a84',
    };
    draft.user.org = {accounts: [{_id: 'own',
      accessLevel: 'owner',
      ownerUser: {licenses: [{
        _id: '5a6ec1bae9aaa11c9bc86106',
        created: '2018-01-29T06:39:54.268Z',
        lastModified: '2022-06-27T07:52:09.014Z',
        expires: '2022-05-05T00:00:00.000Z',
        type: 'connector',
        _connectorId: '5829bce6069ccb4460cdb34e',
        opts: {
          connectorEdition: 'premium',
          addonLicenses: [
            {
              type: 'store',
              licenses: [
                {
                  addOnEdition: 'premium',
                },
                {
                  addOnEdition: 'premium',
                },
              ],
            },
          ],
        },
        _integrationId: '62bedcdca0f5f21448171ea2',
        resumable: false,
      }]}}]};
  });

  return renderWithProviders(<Router history={history}><Tile {...props} /></Router>, {initialStore});
}

const demoTile = {
  _integrationId: '62bedcdca0f5f21448171ea2',
  numError: 0,
  offlineConnections: [],
  name: 'Clone - demoint',
  description: 'demo integration',
  lastModified: '2022-07-05T06:02:56.701Z',
  sandbox: false,
  numFlows: 0,
  _parentId: null,
  mode: 'install',
  supportsChild: false,
  iaV2: false,
  trialEndDate: '2018-07-25T11:15:51.209Z',
  _registeredConnectionIds: [
    '62bd43c87b94d20de64e9ab3',
    '5e3152806287420d5ce56573',
  ],
  key: '62bedcdca0f5f21448171ea2',
  status: 'is_pending_setup',
  tag: 'sample tag',
  flowsNameAndDescription: '',
  sortablePropType: 0,
  integration: {
    permissions: {
      accessLevel: 'owner',
      connections: {
        edit: true,
      },
    },
  },
  applications: [],
  pinned: false,
};

describe('Tile UI tests', () => {
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
    history.push = jest.fn();
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
  });
  test('should display the contents of the integration tile as passed in the props', () => {
    const props = {tile: demoTile,
      isDragInProgress: false,
      isTileDragged: false,
      errmgt: true,
    };

    initTile(props);
    expect(screen.getByText('Clone - demoint')).toBeInTheDocument();
    expect(screen.getByText('Continue setup', {exact: false})).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });
  test('should make the respective redirection when clicked on setup status on the tile', async () => {
    const props = {tile: demoTile,
      isDragInProgress: false,
      isTileDragged: false,
      errmgt: true,
    };

    initTile(props);
    await userEvent.click(screen.getByText('Continue setup', {exact: false}));
    await waitFor(() => expect(history.push).toBeCalledWith('/integrations/62bedcdca0f5f21448171ea2/setup'));
  });
  test('should make the respective dispatch call and redirection when setup status is other than pending', async () => {
    const props = {tile: {...demoTile, status: 'success'},
      isDragInProgress: false,
      isTileDragged: false,
      errmgt: false,
    };

    initTile(props);
    await userEvent.click(screen.getByText(/success/i, {exact: false}));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.patchFilter('jobs', { status: 'all'})));
    await waitFor(() => expect(history.push).toBeCalledWith('/integrations/62bedcdca0f5f21448171ea2/dashboard'));
  });

  test('should redirect to the correct url when clicked on permissions icon on the tile', async () => {
    const props = {tile: demoTile,
      isDragInProgress: false,
      isTileDragged: false,
      errmgt: false,
    };

    initTile(props);
    const userButton = screen.getByRole('button', {name: 'Continue setup >'});

    await userEvent.click(userButton);
    await waitFor(() => expect(history.push).toBeCalledWith('/integrations/62bedcdca0f5f21448171ea2/setup'));
  });
  test('should redirect to the integration connections when connection icon is clicked on the tile', async () => {
    const props = {tile: {...demoTile,
      offlineConnections: [
        '5e3152806287420d5ce56573',
      ],
      status: 'success'},
    isDragInProgress: false,
    isTileDragged: false,
    errmgt: true,
    };

    initTile(props);
    const buttonList = screen.getAllByRole('button');

    userEvent.hover(buttonList[1]);
    await waitFor(() => expect(screen.getByText(/Connection down/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/Success/i)).toBeInTheDocument());
    await userEvent.click(buttonList[1]);
    expect(history.push).toBeCalledWith('/integrations/62bedcdca0f5f21448171ea2/connections');
  });
  test('should display the license expiry message on the tile', () => {
    const props = {tile: {...demoTile, _connectorId: '5829bce6069ccb4460cdb34e'},
      isDragInProgress: false,
      isTileDragged: false,
      errmgt: true,
    };

    initTile(props);
    expect(screen.getByText('Your subscription expired on 05/05/2022. Contact sales to renew your subscription.')).toBeInTheDocument();
    expect(screen.getByText('Request to renew')).toBeInTheDocument();
  });
  test('should redirect to the integration contents when clikced on the tile title', async () => {
    const props = {tile: demoTile,
      isDragInProgress: false,
      isTileDragged: false,
      errmgt: true,
    };

    initTile(props);
    await userEvent.click(screen.getByText('Clone - demoint'));
    await waitFor(() => expect(history.push).toBeCalledWith('/integrations/62bedcdca0f5f21448171ea2/setup'));
  });
});
