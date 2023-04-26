
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ChildUpgradeButton from './ChildUpgradeButton';
import { mutateStore, renderWithProviders } from '../../../../../../../test/test-utils';
import actions from '../../../../../../../actions';
import { getCreatedStore } from '../../../../../../../store';

let initialStore = {};

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useRouteMatch: () => ({
    url: 'baseUrl',
  }),
}));

async function initChildUpgradeButton(props) {
  mutateStore(initialStore, draft => {
    draft.session.integrationApps.upgrade = {
      213: {
        inQueue: true,
      },
      122: {
        status: 'done',
      },
      253: {
        status: 'inProgress',
      },
      123: {
        inQueue: true,
        showWizard: true,
      },
      645: {
        inQueue: false,
        showWizard: true,
      },
      childList: ['123', '122'],
      878: {
        status: 'error',
        errMessage: 'some error',
      },
    };
  });
  const ui = (
    <MemoryRouter>
      <ChildUpgradeButton {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('ChildUpgradeButton Unit tests', () => {
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
    mockHistoryPush.mockClear();
  });

  test('Should render TitleHelp button', async () => {
    const props = {
      resource: {
        id: '122',
        changeEditionId: '32jn2na9',
      },
    };

    await initChildUpgradeButton(props);
    const upgrade = screen.getByRole('button', {
      name: /upgrade/i,
    });

    expect(upgrade).toBeInTheDocument();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.deleteStatus('122'));
    await userEvent.click(upgrade);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.settings.integrationAppV2.upgrade('122'));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('122', { inQueue: false }));
  });
  test('Should render Waiting in Queue button in casse inQueue is true', async () => {
    const props = {
      resource: {
        id: '213',
        changeEditionId: '32jn2na9',
      },
    };

    await initChildUpgradeButton(props);
    const queueButton = screen.getByRole('button', {
      name: /Waiting in queue.../i,
    });

    expect(queueButton).toBeInTheDocument();
  });
  test('Should render Upgrading button in casse status is inProgress', async () => {
    const props = {
      resource: {
        id: '253',
        changeEditionId: '32jn2na9',
      },
    };

    await initChildUpgradeButton(props);
    const queueButton = screen.getByRole('button', {
      name: /Upgrading.../i,
    });

    expect(queueButton).toBeInTheDocument();
  });
  test('Should call correct actions with each state', async () => {
    let props = {
      resource: {
        id: '123',
        changeEditionId: '32jn2na9',
      },
    };

    await initChildUpgradeButton(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('123', {
      showWizard: false,
      inQueue: false,
    }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('successMessageFlags', { showChildLeftMessageFlag: true }));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.settings.integrationAppV2.upgrade('123'));
    props = {
      resource: {
        id: '645',
        changeEditionId: '32jn2na9',
      },
    };

    await initChildUpgradeButton(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('645', {
      showWizard: false,
    }));
    expect(mockHistoryPush).toBeCalledWith('baseUrl/changeEditions/child/645');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.setStatus('successMessageFlags', { showChildLeftMessageFlag: true }));
  });
  test('Should render in case of error', async () => {
    const props = {
      resource: {
        id: '878',
        changeEditionId: '32jn2na9',
        name: 'Child IA',
      },
    };

    await initChildUpgradeButton(props);

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.integrationApp.upgrade.deleteStatus('878'));
    const errorMessage = screen.getByRole('alert');

    expect(errorMessage).toHaveTextContent('The upgrade for Child IA has failed. some error. Select the active upgrade button when you are ready to continue with your setup.');
  });
});
