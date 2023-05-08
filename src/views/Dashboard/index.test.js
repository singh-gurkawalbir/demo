
import React from 'react';
import {screen} from '@testing-library/react';
import { MemoryRouter, Route, Router } from 'react-router-dom';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import {createMemoryHistory} from 'history';
import userEvent from '@testing-library/user-event';
import {mutateStore, renderWithProviders} from '../../test/test-utils';
import { getCreatedStore } from '../../store';
import Dashboard from '.';

function initDashboard() {
  const initialStore = getCreatedStore();

  mutateStore(initialStore, draft => {
    draft.user = {
      preferences: {
        environment: 'production',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: 'h:mm:ss a',
        drawerOpened: true,
        expand: 'Tools',
        scheduleShiftForFlowsCreatedAfter: '2018-06-06T00:00:00.000Z',
        showReactSneakPeekFromDate: '2019-11-05',
        showReactBetaFromDate: '2019-12-26',
        defaultAShareId: 'own',
        dashboard: {
          view: 'tile',
          tilesOrder: [
            '62be9cf14a6daf23ece8ed33',
            '62bedcdca0f5f21448171ea2',
            '6253af74cddb8a1ba550a010',
            '62beb29aa0f5f2144816f80c',
          ],
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
      debug: false,
    };
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/integrations/6253af74cddb8a1ba550a010/dashboard/runningFlows'}]} >
      <Route
        path="/integrations/:integrationId/dashboard/runningFlows"
            >
        <Dashboard />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../components/LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../components/LoadResources'),
  default: props =>
    (
      props.children
    )
  ,
}));
describe('Dashboard UI tests', () => {
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
  test('should render both running and completed flow tabs', () => {
    initDashboard();
    expect(screen.getByText(/Completed flows/i)).toBeInTheDocument();
    expect(screen.getByText('Running flows')).toBeInTheDocument();
  });
  test('should render empty DOM when "isUserInErrMgtTwoDotZero" is false', () => {
    const history = createMemoryHistory();

    history.push = jest.fn();
    const {utils} = renderWithProviders(<Router history={history}><Dashboard /></Router>);

    expect(history.push).toBeCalled();
    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should display different infotexts when clicked on InfoIcon button', async () => {
    initDashboard();
    const element = document.querySelector('[aria-haspopup="true"]');

    await userEvent.click(element);
    expect(screen.getByText('This dashboard offers a comprehensive view of all running and completed flows in each integration.')).toBeInTheDocument();
  });
});

