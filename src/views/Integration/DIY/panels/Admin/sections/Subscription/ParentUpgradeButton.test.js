
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParentUpgradeButton from './ParentUpgradeButton';
import { mutateStore, renderWithProviders } from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';
import { getCreatedStore } from '../../../../../../../store';

let initialStore = {};

async function initParentUpgradeButton(props) {
  mutateStore(initialStore, draft => {
    draft.session.integrationApps.upgrade = {
      122: {
        status: 'hold',
        showWizard: true,
      },
      253: {
        status: 'inProgress',
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <ParentUpgradeButton {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('ParentUpgradeButton Unit tests', () => {
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

  test('Should render button and call actions as required', async () => {
    const onClick = jest.fn();
    const props = {
      id: '122',
      className: 'button',
      onClick,
      nextPlan: 'standard',
      changeEditionId: '321r41',
      accessLevel: 'admin',
    };

    await initParentUpgradeButton(props);
    const upgrade = screen.getByRole('button', {
      name: /upgrade/i,
    });

    expect(upgrade).toBeInTheDocument();
    await userEvent.click(upgrade);
    expect(onClick).toBeCalled();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('122', { showWizard: false }));
  });
  test('Should render Upgrading button in casse status is inProgress', async () => {
    const props = {
      id: '253',
      className: 'button',
      nextPlan: 'standard',
      changeEditionId: '321r41',
      accessLevel: 'admin',
    };

    await initParentUpgradeButton(props);
    const queueButton = screen.getByRole('button', {
      name: /Upgrading.../i,
    });

    expect(queueButton).toBeInTheDocument();
  });
});
