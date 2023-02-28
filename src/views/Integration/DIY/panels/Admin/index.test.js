
import React from 'react';
import {screen} from '@testing-library/react';
import {MemoryRouter, Route} from 'react-router-dom';
import AdminPanel from '.';
import {mutateStore, reduxStore, renderWithProviders} from '../../../../../test/test-utils';

async function initAdminPanel(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.user.profile = {
      _id: '62386a5fed961b5e22e992c7',
      name: 'demo user',
      email: 'demoUser@celigo.com',
      role: 'CEO',
      company: 'celigo',
      phone: '9876543210',
      auth_type_google: {},
      timezone: 'Asia/Calcutta',
      developer: true,
      allowedToPublish: true,
      agreeTOSAndPP: true,
      createdAt: '2022-03-21T12:06:55.685Z',
      useErrMgtTwoDotZero: true,
      authTypeSSO: null,
      emailHash: '087e41a1843139c27bce730b99664a84',
    };
    draft.user.preferences = {
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
    };
    draft.data.resources.integrations = [{
      _id: props.integrationId,
      lastModified: '2021-01-19T06:34:17.222Z',
      name: " AFE 2.0 refactoring for DB's",
      install: [],
      sandbox: false,
      settings: props.settings,
      initChild: {function: true},
      _connectorId: props.connId,
      _registeredConnectionIds: [
        '5cd51efd3607fe7d8eda9c97',
        '5ff57a8345ceef7dcd797c21',
      ],
      installSteps: props.steps,
      flowGroupings: [],
      createdAt: '2021-01-06T08:50:31.935Z',
    }];
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: `/integrations/5ff579d745ceef7dcd797c15/${props.child}/admin/readme`}]}>
      <Route path={`/integrations/5ff579d745ceef7dcd797c15/${props.child}/admin`}>
        <AdminPanel {...props} />
      </Route>
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('AdminPanel UI tests', () => {
  test('should pass the initial render', async () => {
    await initAdminPanel({integrationId: '5ff579d745ceef7dcd797c15', childId: '5ff579d745ceef7dcd797c15', connId: '5ff579d745ceef7dcd797b26'});
    expect(screen.getByText('API tokens')).toBeInTheDocument();
    expect(screen.getByText('Subscription')).toBeInTheDocument();
    expect(screen.getByText('Uninstall')).toBeInTheDocument();
  });
  test('should display different panels for standalone integrations', async () => {
    await initAdminPanel({integrationId: 'none', connId: '5ff579d745ceef7dcd797b26'});
    expect(screen.getByText('API tokens')).toBeInTheDocument();
    expect(screen.getByText('Subscription')).toBeInTheDocument();
    expect(screen.getByText('Uninstall')).toBeInTheDocument();
  });
  test('should display different panels for integrations that are not apps', async () => {
    await initAdminPanel({integrationId: '5ff579d745ceef7dcd797c15'});
    expect(screen.getByText('General')).toBeInTheDocument();
    const ReadmeButtons = screen.getAllByText('Readme');

    expect(ReadmeButtons).toHaveLength(2);
  });
});
