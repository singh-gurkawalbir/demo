/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import actions from '../../../../actions';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';
import { ConfirmDialogProvider } from '../../../ConfirmDialog';
import RouterMenu from './RouterMenu';

let initialStore;
const mockHistoryGoBack = jest.fn();

async function initRouterMenu(editorId) {
  initialStore.getState().session.editors = {
    1: {
      flowId: '1',
      rule: {
        id: 'r1',
      },
    },
  };
  initialStore.getState().session.flowbuilder = {
    1: {
      _integrationId: '2',
    },
  };
  const ui = (
    <MemoryRouter>
      <ConfirmDialogProvider>
        <RouterMenu editorId={editorId} />
      </ConfirmDialogProvider>
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

describe('test suite for RouterGuide', () => {
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
    mockHistoryGoBack.mockClear();
  });

  test('Should render routerMenu button when open is false', async () => {
    await initRouterMenu('1');
    expect(screen.getByRole('button')).toHaveAttribute('data-test', 'routerMenu');
  });

  test('Checking functionality of opening and closing buttons', async () => {
    await initRouterMenu('1');
    const openMenu = screen.getByRole('button');

    expect(openMenu).toBeInTheDocument();

    // opening the menu
    userEvent.click(openMenu);

    const closePopper = screen.getByRole('tooltip', {
      name: /delete branching/i,
    });
    let deleteMenu = screen.getByRole('menuitem', {
      name: /delete branching/i,
    });

    expect(closePopper).toBeInTheDocument();
    expect(deleteMenu).toBeInTheDocument();

    // checking closePopper
    userEvent.click(closePopper);
    expect(closePopper).not.toBeInTheDocument();
    expect(deleteMenu).not.toBeInTheDocument();

    // opening the menu
    userEvent.click(openMenu);
    deleteMenu = screen.getByRole('menuitem', {
      name: /delete branching/i,
    });
    // opening deleteMenu dialog
    userEvent.click(deleteMenu);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/confirm delete/i)).toBeInTheDocument();
    const confirmDelete = screen.getByRole('button', {
      name: /delete/i,
    });
    let confirmCancel = screen.getByRole('button', {
      name: /cancel/i,
    });

    expect(confirmDelete).toBeEnabled();
    expect(confirmCancel).toBeEnabled();

    // checking confirmDelete
    userEvent.click(confirmDelete);
    expect(mockDispatchFn).toHaveBeenLastCalledWith(actions.flow.deleteRouter('1', 'r1'));
    expect(mockHistoryGoBack).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // opening the menu
    userEvent.click(openMenu);
    deleteMenu = screen.getByRole('menuitem', {
      name: /delete branching/i,
    });
    // opening deleteMenu dialog
    userEvent.click(deleteMenu);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    confirmCancel = screen.getByRole('button', {
      name: /cancel/i,
    });
    expect(confirmCancel).toBeEnabled();

    // checking confirmCancel
    userEvent.click(confirmCancel);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
