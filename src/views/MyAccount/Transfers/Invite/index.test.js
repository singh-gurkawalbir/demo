import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Invite from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import actions from '../../../../actions';

async function initInvite({props = {}, transfer = {}} = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources = {
      integrations: [{
        _id: 'id_1',
        name: 'name 1',
        tag: 'tag 1',
      }],
    };
    draft.session.transfers = transfer;
  });
  const ui = (
    <MemoryRouter>
      <Invite {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

jest.mock('../../../../components/DynaForm/DynaSubmit', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../components/DynaForm/DynaSubmit'),
  default: props => {
    const handleSubmit = () => {
      props.onClick('mock value');
    };

    return (
      <>
        <button type="button" onClick={handleSubmit}>
          Test handleSubmit
        </button>
      </>
    );
  },
}));

describe('invite test cases', () => {
  runServer();
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
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    const setShowInviteView = jest.fn();

    await initInvite({
      props: {
        setShowInviteView,
      },
      transfer: {
        transfer: {
          error: undefined,
          response: {
            integrations: [{
              _id: 'id_1',
              name: 'name 1',
              tag: 'tag 1',
            }],
          },
        },
      },
    });

    const backToButton = screen.getByRole('button', { name: /Back to transfers/i});
    const transferButton = screen.getByRole('button', { name: /Initiate Transfer/i});
    const mockHandleButton = screen.getByRole('button', { name: /Test handleSubmit/i});

    expect(backToButton).toBeInTheDocument();
    expect(transferButton).toBeInTheDocument();
    expect(mockHandleButton).toBeInTheDocument();

    await userEvent.click(backToButton);
    expect(setShowInviteView).toHaveBeenCalledTimes(1);
    expect(setShowInviteView).toHaveBeenCalledWith(false);

    await userEvent.click(transferButton);
    expect(setShowInviteView).toHaveBeenCalledTimes(2);
    expect(setShowInviteView).toHaveBeenCalledWith(false);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.transfer.create({}));

    await userEvent.click(mockHandleButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.transfer.preview('mock value'));
  });

  test('should pass the initial render with error data', async () => {
    const setShowInviteView = jest.fn();

    await initInvite({
      props: {
        setShowInviteView,
      },
      transfer: {
        transfer: {
          error: {
            status: 400,
            message: '{"errors":[{"code":"invalid_email","message":"Email: dummyname@celigo.com@ef.com provided by you is invalid."}]}',
          },
          response: undefined,
        },
      },
    });

    const backToButton = screen.getByRole('button', { name: /Back to transfers/i});

    expect(backToButton).toBeInTheDocument();
    expect(screen.queryByText(/Email: dummyname@celigo.com@ef.com provided by you is invalid./i)).toBeInTheDocument();
  });
});
