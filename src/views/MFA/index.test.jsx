import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../test/test-utils';
import MfaVerify from '.';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

function store(auth, mfa) {
  mutateStore(initialStore, draft => {
    draft.auth = auth;
    draft.session.mfa.sessionInfo = mfa;
  });
}

async function initMFAVerify() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/mfa/verify'}]} >
      <Route>
        <MfaVerify />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('MFAVerify', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        case 'AUTH_VALIDATE_SESSION':
          initialStore.dispatch(action);
          break;
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('Should able to test loader', async () => {
    store();
    await initMFAVerify();
    const loader = screen.getByRole('progressbar', {name: ''});

    expect(loader).toBeInTheDocument();
  });
  test('Should able to test MFA without passcode', async () => {
    store({
      initialized: true,
      commStatus: 'success',
      authenticated: true,
      authTimestamp: 1661250286856,
      defaultAccountSet: true,
      mfaRequired: true,
      isMFASetupIncomplete: true,
    }, {data: {
      authenticated: true,
      mfaRequired: true,
      mfaSetupRequired: false,
      mfaVerified: false,
    },
    status: 'received'}
    );
    await initMFAVerify();
    mutateStore(initialStore, draft => {
      draft.session.mfa.sessionInfo = {data: {
        authenticated: true,
        mfaRequired: true,
        mfaSetupRequired: false,
        mfaVerified: false,
      },
      status: 'received'};
    });
    await waitFor(() => expect(screen.getByRole('heading', {name: 'Authenticate with one-time passcode'})).toBeInTheDocument());

    expect(screen.getByText(/You are signing in from a new device. Enter your passcode to verify your account./i)).toBeInTheDocument();
    const oneTimePassword = screen.getByPlaceholderText('One-time passcode*');

    expect(oneTimePassword).toBeInTheDocument();
    await userEvent.type(oneTimePassword, '123456');
    const trustedDeviceNode = screen.getByRole('checkbox', {name: 'Trust this device'});

    expect(trustedDeviceNode).not.toBeChecked();
    await userEvent.click(trustedDeviceNode);
    await waitFor(() => expect(trustedDeviceNode).toBeChecked());
    const submitButtonNode = screen.getByRole('button', {name: 'Submit'});

    expect(submitButtonNode).toBeInTheDocument();
    await userEvent.click(submitButtonNode);

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.mfaVerify.request({ code: '123456', trustDevice: true }));
  });
  test('Should able to test MFA without passcode duplicate', async () => {
    store({
      initialized: true,
      commStatus: 'success',
      authenticated: true,
      authTimestamp: 1661250286856,
      defaultAccountSet: true,
      mfaRequired: true,
      isMFASetupIncomplete: true,
    }, {data: {
      authenticated: true,
      mfaRequired: true,
      mfaSetupRequired: false,
      mfaVerified: false,
    },
    status: 'received'}
    );
    await initMFAVerify();
    mutateStore(initialStore, draft => {
      draft.session.mfa.sessionInfo = {data: {
        authenticated: true,
        mfaRequired: true,
        mfaSetupRequired: false,
        mfaVerified: false,
      },
      status: 'received'};
    });

    await waitFor(() => expect(screen.getByRole('heading', {name: 'Authenticate with one-time passcode'})).toBeInTheDocument());

    expect(screen.getByText(/You are signing in from a new device. Enter your passcode to verify your account./i)).toBeInTheDocument();
    const oneTimePassword = screen.getByPlaceholderText('One-time passcode*');

    expect(oneTimePassword).toBeInTheDocument();
    await userEvent.type(oneTimePassword, ' ');
    const submitButtonNode = screen.getByRole('button', {name: 'Submit'});

    expect(submitButtonNode).toBeInTheDocument();
    await userEvent.click(submitButtonNode);
    const warningMessageNode = screen.getByText(/One time passcode is required/i);

    expect(warningMessageNode).toBeInTheDocument();
  });
  test('Should able to test MFA with an invalid passcode', async () => {
    store({
      initialized: true,
      commStatus: 'success',
      authenticated: true,
      authTimestamp: 1661250286856,
      defaultAccountSet: true,
      mfaRequired: true,
      isMFASetupIncomplete: true,
    }, {data: {
      authenticated: true,
      mfaRequired: true,
      mfaSetupRequired: false,
      mfaVerified: false,
    },
    status: 'received'}
    );
    await initMFAVerify();
    mutateStore(initialStore, draft => {
      draft.session.mfa.sessionInfo = {data: {
        authenticated: true,
        mfaRequired: true,
        mfaSetupRequired: false,
        mfaVerified: false,
      },
      status: 'received'};
    });
    const headingNode = await waitFor(() => screen.getByRole('heading', {name: 'Authenticate with one-time passcode'}));

    expect(headingNode).toBeInTheDocument();
    const mfaSigninText = screen.getByText(/You are signing in from a new device. Enter your passcode to verify your account./i);

    expect(mfaSigninText).toBeInTheDocument();
    const oneTimePassword = screen.getByPlaceholderText('One-time passcode*');

    expect(oneTimePassword).toBeInTheDocument();
    await userEvent.type(oneTimePassword, '123');
    const submitButtonNode = screen.getByRole('button', {name: 'Submit'});

    expect(submitButtonNode).toBeInTheDocument();
    await userEvent.click(submitButtonNode);
    const warningMessageNode = screen.getByText(/Invalid one time passcode/i);

    expect(warningMessageNode).toBeInTheDocument();
  });
  test('should redirect to home page when MFA is resolved', async () => {
    store({
      initialized: true,
      commStatus: 'success',
      authenticated: true,
      authTimestamp: 1661250286856,
      defaultAccountSet: true,
      mfaRequired: true,
      isMFASetupIncomplete: true,
    }, {data: {
      authenticated: true,
      mfaRequired: true,
      mfaSetupRequired: false,
      mfaVerified: true,
    },
    status: 'received'}
    );
    await initMFAVerify();

    expect(mockHistoryPush).toHaveBeenCalledWith('/');
  });
});
