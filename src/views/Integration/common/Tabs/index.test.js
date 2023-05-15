
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import IntegrationTabs from '.';
import { getCreatedStore } from '../../../../store';
import { runServer } from '../../../../test/api/server';

let mockMatch;

const mockHistoryPush = jest.fn(path => {
  const pathArray = path.split('/');

  mockMatch.url = path;
  mockMatch.params.tab = pathArray[pathArray.length - 1];
});

const tabs = [
  {
    path: 'flows',
    label: 'Flows',
    Panel: () => (<div>Flows Panel</div>),
    Icon: () => (<div>Flows Icon</div>),
  },
  {
    path: 'dashboard',
    label: 'Dashboard',
    Panel: () => (<div>Dashboard Panel</div>),
    Icon: () => (<div>Dashboard Icon</div>),
  },
  {
    path: 'connections',
    label: 'Connections',
    Panel: () => (<div>Connections Panel</div>),
    Icon: () => (<div>Connections Icon</div>),
  },
];

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useRouteMatch: () => mockMatch,
}));

async function initIntegrationTabs(props = {}, {initialStore, renderFun} = {}) {
  const ui = (
    <MemoryRouter>
      <IntegrationTabs {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore, renderFun});
}

describe('test suite for IntegrationTabs', () => {
  runServer();

  beforeEach(() => {
    mockMatch = {
      isExact: true,
      url: '/integrations/none/flows',
      path: '/integrations/:integrationId([a-f\\d]{24}|none)/:tab',
      params: {
        integrationId: 'none',
        tab: 'flows',
      },
    };
  });

  test('should be able to render the list of available tabs and default panel', async () => {
    await initIntegrationTabs({tabs});
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByText('Flows Icon')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Icon')).toBeInTheDocument();
    expect(screen.getByText('Connections Icon')).toBeInTheDocument();
    expect(screen.getByText('Flows Panel')).toBeInTheDocument();
  });

  test('should be able to render the panel corresponding to a tab change', async () => {
    const { utils } = await initIntegrationTabs({tabs});

    expect(screen.getByText('Flows Panel')).toBeInTheDocument();
    const connectionTab = screen.getByText('Connections Icon');

    await userEvent.click(connectionTab);
    expect(mockHistoryPush).toHaveBeenLastCalledWith('/integrations/none/connections');
    await initIntegrationTabs({tabs}, {renderFun: utils.rerender});
    await waitFor(() => expect(screen.queryByText('Flows Panel')).not.toBeInTheDocument());
    expect(screen.getByText('Connections Panel')).toBeInTheDocument();
  });

  test('should render dashboard panel whenever dashboard tab is set', async () => {
    mockMatch.params.dashboardTab = 'dashboard';
    mockMatch.params.tab = 'connections';
    await initIntegrationTabs({tabs});
    expect(screen.queryByText('Connections Panel')).not.toBeInTheDocument();
    expect(screen.getByText('Dashboard Panel')).toBeInTheDocument();
  });

  test('running flows panel should not be accessible external to dashboard panel for users in EM2.0', async () => {
    mockMatch.path = '/integrations/:integrationId([a-f\\d]{24}|none)/:tab/:subTab';
    mockMatch.params.subTab = 'runningFlows';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile.useErrMgtTwoDotZero = true;
    });

    const { utils } = await initIntegrationTabs({tabs}, {initialStore});
    const connectionTab = screen.getByRole('tab', {name: /connections/i});

    await userEvent.click(connectionTab);
    await initIntegrationTabs({tabs}, {initialStore, renderFun: utils.rerender});
    await waitFor(() => expect(screen.getByRole('tab', {name: /Connections/})).toBeInTheDocument());
  });

  test('completed flows panel should not be accessible external to dashboard panel for users in EM2.0', async () => {
    mockMatch.path = '/integrations/:integrationId([a-f\\d]{24}|none)/:tab/:subTab';
    mockMatch.params.subTab = 'completedFlows';
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile.useErrMgtTwoDotZero = true;
    });

    const { utils } = await initIntegrationTabs({tabs}, {initialStore});
    const connectionTab = screen.getByRole('tab', {name: /connections/i});

    await userEvent.click(connectionTab);
    await initIntegrationTabs({tabs}, {initialStore, renderFun: utils.rerender});
    await waitFor(() => expect(screen.getByRole('tab', {name: /Connections/})).toBeInTheDocument());
  });
});
