
import React from 'react';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import BottomDrawer from '.';
import { getCreatedStore } from '../../../../store';

jest.mock('../../../../components/JobDashboard/RunDashboardV2', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/JobDashboard/RunDashboardV2'),
  default: () => (<div>Run Dashboard V2</div>),
}));
jest.mock('./panels/Dashboard/RunDashboardPanel', () => ({
  __esModule: true,
  ...jest.requireActual('./panels/Dashboard/RunDashboardPanel'),
  default: () => (<div>Run Dashboard Panel</div>),
}));
jest.mock('./panels/Connection', () => ({
  __esModule: true,
  ...jest.requireActual('./panels/Connection'),
  default: () => (<div>Connection Panel</div>),
}));
jest.mock('../../../../components/JobDashboard/RunHistory', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/JobDashboard/RunHistory'),
  default: () => (<div>Run History Panel</div>),
}));
jest.mock('./panels/Audit', () => ({
  __esModule: true,
  ...jest.requireActual('./panels/Audit'),
  default: () => (<div>Audit Panel</div>),
}));
jest.mock('./panels/Script', () => ({
  __esModule: true,
  ...jest.requireActual('./panels/Script'),
  default: () => (<div>Script Panel</div>),
}));
jest.mock('./panels/Dashboard/RunDashboardActions', () => ({
  __esModule: true,
  ...jest.requireActual('./panels/Dashboard/RunDashboardActions'),
  default: () => (<div>Run Dashboard Actions</div>),
}));
jest.mock('../../../ScriptLogs', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ScriptLogs'),
  default: () => (<div>Script Logs Panel</div>),
}));
jest.mock('../../../ConnectionLogs', () => ({
  __esModule: true,
  ...jest.requireActual('../../../ConnectionLogs'),
  default: () => (<div>Connection Logs Panel</div>),
}));

async function initBottomDrawer(props = {}, initialStore) {
  const ui = (
    <MemoryRouter>
      <BottomDrawer {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('test suite for BottomDrawer', () => {
  test('should pass initial rendering', async () => {
    await initBottomDrawer();
    const tabList = screen.getByRole('tablist');
    const { getByRole, getAllByRole } = within(tabList);

    expect(getAllByRole('tab')).toHaveLength(3);
    expect(getByRole('tab', {name: 'Dashboard'})).toBeInTheDocument();
    expect(getByRole('tab', {name: 'Connections'})).toBeInTheDocument();
    expect(getByRole('tab', {name: 'Audit log'})).toBeInTheDocument();

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Run Dashboard Panel');

    const increaseButton = document.querySelector('[data-test="increaseFlowBuilderBottomDrawer"]');
    const decreaseButton = document.querySelector('[data-test="decreaseFlowBuilderBottomDrawer"]');

    expect(increaseButton).toBeInTheDocument();
    expect(decreaseButton).toBeInTheDocument();

    expect(screen.queryByText('Run Dashboard Actions')).not.toBeInTheDocument();
  });

  test('should show Run Dashboard Action buttons only for users in EM2.0', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile.useErrMgtTwoDotZero = true;
    });

    await initBottomDrawer({}, initialStore);
    expect(screen.getByText('Run Dashboard Actions')).toBeInTheDocument();
  });

  test('The corresponding panel should show on changing tabs', async () => {
    await initBottomDrawer();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Run Dashboard Panel');
    const connectionsTab = screen.getByRole('tab', {name: 'Connections'});

    await userEvent.click(connectionsTab);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Connection Panel');
  });

  test('should be able to increase or decrease the height of bottom drawer', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user = {
        preferences: {
          defaultAShareId: '123abc',
          accounts: {
            '123abc': {
              fbBottomDrawerHeight: 200,
            },
          },
        },
        org: {
          accounts: [
            {
              _id: '123abc',
            },
          ],
        },
      };
    });

    await initBottomDrawer({}, initialStore);
    const increaseButton = document.querySelector('[data-test="increaseFlowBuilderBottomDrawer"]');

    await userEvent.click(increaseButton);
    let increasedHeight;

    mutateStore(initialStore, draft => {
      increasedHeight = draft.user.preferences.accounts['123abc'].fbBottomDrawerHeight;
    });

    expect(increasedHeight).toBeGreaterThan(200);

    const decreaseButton = document.querySelector('[data-test="decreaseFlowBuilderBottomDrawer"]');

    await userEvent.click(decreaseButton);

    let decreasedHeight;

    mutateStore(initialStore, draft => {
      decreasedHeight = draft.user.preferences.accounts['123abc'].fbBottomDrawerHeight;
    });

    expect(decreasedHeight).toBeLessThan(increasedHeight);
  });

  test('Run Dashboard Actions panel should be displayed only for EM2.0 users', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile.useErrMgtTwoDotZero = true;
    });
    await initBottomDrawer({}, initialStore);
    expect(screen.getByText('Run Dashboard Actions')).toBeInTheDocument();
  });

  test('dashboard label should be "Run console" for users in EM2.0', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile.useErrMgtTwoDotZero = true;
    });

    await initBottomDrawer({}, initialStore);
    expect(screen.getByText('Run console')).toBeInTheDocument();
  });

  test('Dashboard panel should be different for users in EM2.0', async () => {
    const { utils } = await initBottomDrawer();

    expect(screen.queryByText('Run Dashboard V2')).not.toBeInTheDocument();
    expect(screen.getByText('Run Dashboard Panel')).toBeInTheDocument();
    utils.unmount();

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.profile.useErrMgtTwoDotZero = true;
    });

    await initBottomDrawer({}, initialStore);
    expect(screen.queryByText('Run Dashboard Panel')).not.toBeInTheDocument();
    expect(screen.getByText('Run Dashboard V2')).toBeInTheDocument();
  });

  test('should be able to render scripts tab', async () => {
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.flows = [{
        _id: '123flow',
        pageGenerators: [{ _exportId: '123exp'}],
      }];
      draft.data.resources.exports = [{
        _id: '123exp',
        filter: {
          type: 'script',
          script: { _scriptId: '123script' },
        },
      }];
      draft.data.resources.scripts = [{
        _id: '123script',
        _sourceId: '123flow',
      }];
    });

    await initBottomDrawer({flowId: '123flow'}, initialStore);
    const scriptTab = screen.getByRole('tab', {name: 'Scripts'});

    expect(scriptTab).toBeInTheDocument();
    await userEvent.click(scriptTab);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Script Panel');
  });
});
