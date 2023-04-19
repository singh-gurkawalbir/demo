
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import RequestUpgradeButton from './RequestUpgradeButton';
import { mutateStore, renderWithProviders } from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';
import { getCreatedStore } from '../../../../../../../store';

let initialStore = getCreatedStore();

async function initChildUpgradeButton(props) {
  const ui = (
    <MemoryRouter>
      <RequestUpgradeButton {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('RequestUpgradeButton Unit tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
          initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should render Request Upgrade button', async () => {
    mutateStore(initialStore, draft => {
      draft.session.integrationApps.upgrade = {
        122: {
          status: 'hold',
        },
      };
    });
    const handleUpgrade = jest.fn();
    const handleUpgradeEdition = jest.fn();
    const props = {
      id: '122',
      className: 'button',
      license: {
        _id: '312as31',
        upgradeText: 'Request upgrade',
        upgradeRequested: false,
        nextPlan: 'standard',
        _changeEditionId: '1231312',
      },
      isLicenseExpired: false,
      istwoDotZeroFrameWork: true,
      handleUpgrade,
      handleUpgradeEdition,
      childIntegrationsCount: 0,
    };

    await initChildUpgradeButton(props);
    const upgrade = screen.getByRole('button', {
      name: /Request upgrade/i,
    });

    expect(upgrade).toBeInTheDocument();
    await userEvent.click(upgrade);
    expect(handleUpgrade).toBeCalled();
  });
  test('Should render disabled Request Upgrade Button in case upgrade text is empty', async () => {
    mutateStore(initialStore, draft => {
      draft.session.integrationApps.upgrade = {
        122: {
          status: 'hold',
        },
      };
    });
    const props = {
      id: '122',
      className: 'button',
      license: {
        upgradeText: '',
        upgradeRequested: false,
      },
      isLicenseExpired: false,
      istwoDotZeroFrameWork: true,
      handleUpgrade: jest.fn(),
      handleUpgradeEdition: jest.fn(),
      childIntegrationsCount: 0,
    };

    await initChildUpgradeButton(props);
    const upgrade = screen.getByRole('button', {
      name: /Request upgrade/i,
    });

    expect(upgrade).toBeInTheDocument();
    expect(upgrade).toBeDisabled();
  });
  test('Should call actions as required for error status', async () => {
    mutateStore(initialStore, draft => {
      draft.session.integrationApps.upgrade = {
        231: {
          status: 'error',
          errMessage: 'error in step 3',
        },
      };
    });
    const props = {
      id: '231',
      className: 'button',
      license: {
        upgradeText: '',
        upgradeRequested: false,
      },
      isLicenseExpired: false,
      istwoDotZeroFrameWork: true,
      handleUpgrade: jest.fn(),
      handleUpgradeEdition: jest.fn(),
      childIntegrationsCount: 0,
    };

    await initChildUpgradeButton(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('231', {
      status: 'hold',
    }));
  });
  test('Should call actions as required for done status', async () => {
    mutateStore(initialStore, draft => {
      draft.session.integrationApps.upgrade = {
        231: {
          status: 'done',
        },
      };
    });
    const props = {
      id: '231',
      className: 'button',
      license: {
        upgradeText: '',
        upgradeRequested: false,
        nextPlan: 'standard',
      },
      isLicenseExpired: false,
      istwoDotZeroFrameWork: true,
      handleUpgrade: jest.fn(),
      handleUpgradeEdition: jest.fn(),
      childIntegrationsCount: 0,
    };

    await initChildUpgradeButton(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.deleteStatus('231'));
    const success = screen.getByRole('alert');

    expect(success).toHaveTextContent('You’ve successfuly upgraded to a standard plan. Additional plansare available for request from the admin tab if you need it later on.');
  });
  test('Should call actions as required for showFinalMessage status is true', async () => {
    mutateStore(initialStore, draft => {
      draft.session.integrationApps.upgrade = {
        231: {
          status: 'done',
        },
        successMessageFlags: {
          showFinalMessage: true,
        },
      };
    });
    const props = {
      id: '231',
      className: 'button',
      license: {
        upgradeText: '',
        upgradeRequested: false,
        nextPlan: 'standard',
      },
      isLicenseExpired: false,
      istwoDotZeroFrameWork: true,
      handleUpgrade: jest.fn(),
      handleUpgradeEdition: jest.fn(),
      childIntegrationsCount: 0,
    };

    await initChildUpgradeButton(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('successMessageFlags', { showFinalMessage: false }));
  });
});
