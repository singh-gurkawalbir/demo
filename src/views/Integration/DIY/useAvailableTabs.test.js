
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import IntegrationTabsComponent from './IntegrationTabs';
import { getCreatedStore } from '../../../store';

let mockMatch = {
  path: '/integrations/:integrationId([a-f\\d]{24}|none)/:tab',
  url: '/integrations/123integ/flows',
  params: {
    integrationId: '123integ',
    tab: 'flows',
  },
};

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => mockMatch,
}));

async function initUseAvailableTabs(initialStore) {
  const ui = (
    <MemoryRouter>
      <IntegrationTabsComponent />
    </MemoryRouter>
  );

  renderWithProviders(ui, {initialStore});
}

describe('test suite for useAvailableTabs hook', () => {
  const commonTabs = [
    'Flows',
    'Dashboard',
    'Connections',
    'Notifications',
    'Audit log',
    'Users',
  ];

  beforeEach(() => {
    mockMatch = {
      path: '/integrations/:integrationId([a-f\\d]{24}|none)/:tab',
      url: '/integrations/123integ/flows',
      params: {
        integrationId: '123integ',
        tab: 'flows',
      },
    };
  });

  test('should render the initial set of tabs', async () => {
    await initUseAvailableTabs();
    [
      ...commonTabs,
      'Admin',
      'Aliases',
      'Revisions',
    ].forEach(tabName => {
      expect(screen.getByRole('tab', {name: tabName})).toBeInTheDocument();
    });

    ['Settings', 'Analytics'].forEach(tabName => {
      expect(screen.queryByRole('tab', {name: tabName})).not.toBeInTheDocument();
    });
  });

  test('should render analytics tab only for users in EM2.0', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile.useErrMgtTwoDotZero = true;
    });

    await initUseAvailableTabs(initialStore);
    [
      ...commonTabs,
      'Analytics',
      'Admin',
      'Aliases',
      'Revisions',
    ].forEach(tabName => {
      expect(screen.getByRole('tab', {name: tabName})).toBeInTheDocument();
    });

    ['Settings'].forEach(tabName => {
      expect(screen.queryByRole('tab', {name: tabName})).not.toBeInTheDocument();
    });
  });

  test('should not render Settings, Admin, Aliases or Revisions tab for standalone integration', async () => {
    const initialStore = getCreatedStore();

    mockMatch.params.integrationId = 'none';
    mockMatch.url = '/integrations/none/flows';
    mutateStore(initialStore, draft => {
      draft.user.profile.useErrMgtTwoDotZero = true;
    });
    await initUseAvailableTabs(initialStore);
    [
      ...commonTabs,
      'Analytics',
    ].forEach(tabName => {
      expect(screen.getByRole('tab', {name: tabName})).toBeInTheDocument();
    });

    ['Settings', 'Admin', 'Aliases', 'Revisions'].forEach(tabName => {
      expect(screen.queryByRole('tab', {name: tabName})).not.toBeInTheDocument();
    });
  });

  test('should not render Aliases or Revisions tab for integration app', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = [{
        _id: mockMatch.params.integrationId,
        _connectorId: '123connector',
      }];
    });

    await initUseAvailableTabs(initialStore);
    [
      ...commonTabs,
      'Admin',
    ].forEach(tabName => {
      expect(screen.getByRole('tab', {name: tabName})).toBeInTheDocument();
    });

    ['Settings', 'Analytics', 'Aliases', 'Revisions'].forEach(tabName => {
      expect(screen.queryByRole('tab', {name: tabName})).not.toBeInTheDocument();
    });
  });

  test('should render settings form when integration has settings form or it is editable', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.integrations = [{
        _id: mockMatch.params.integrationId,
        settingsForm: { init: jest.fn() },
      }];
      draft.user.profile = {
        developer: true,
        useErrMgtTwoDotZero: true,
      };
    });

    await initUseAvailableTabs(initialStore);
    [
      ...commonTabs,
      'Settings',
      'Analytics',
      'Admin',
      'Aliases',
      'Revisions',
    ].forEach(tabName => {
      expect(screen.getByRole('tab', {name: tabName})).toBeInTheDocument();
    });
  });
});
