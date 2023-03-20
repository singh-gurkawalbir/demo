
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import ReAuthModal from '.';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { runServer } from '../../../../../test/api/server';
import { getCreatedStore } from '../../../../../store';
import { ConfirmDialogProvider } from '../../../../../components/ConfirmDialog';

let initialStore;

async function initReAuthModal({mfaValues, onClose, isQRCode} = {}) {
  mutateStore(initialStore, draft => {
    draft.session.mfa = mfaValues;
  });
  const ui = (
    <ConfirmDialogProvider>
      <MemoryRouter>
        <ReAuthModal onClose={onClose} isQRCode={isQRCode} />
      </MemoryRouter>
    </ConfirmDialogProvider>
  );

  return renderWithProviders(ui, {initialStore});
}

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

describe('Testsuite for ReAuthModal', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });
  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should test ReAuthModal dialogbox and view the QR code', async () => {
    await initReAuthModal({
      mfaValues: {
        codes: {
          showQrCode: true,
        },
      },
      onClose: jest.fn(),
      isQRCode: true,
    });
    expect(screen.getByText(/view qr code/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your account password to view your qr code\./i)).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    const passwordTextboxNode = document.querySelector('input[name="password"]');

    expect(passwordTextboxNode).toBeInTheDocument();
    await userEvent.type(passwordTextboxNode, 'testpassword');
    const viewCodeButtonNode = screen.getByRole('button', {name: /view code/i});

    expect(viewCodeButtonNode).toBeInTheDocument();
    await userEvent.click(viewCodeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'MFA_REQUEST_SECRET_CODE',
      password: 'testpassword',
      isQRCode: true,
    });
  });
  test('should test ReAuthModal dialogbox and view the secret key', async () => {
    const onCloseButton = jest.fn();

    await initReAuthModal({
      mfaValues: {
        codes: {
          showSecretCode: true,
        },
      },
      onClose: onCloseButton,
      isQRCode: false,
    });
    expect(screen.getByText(/view secret key/i)).toBeInTheDocument();
    expect(screen.getByText(/enter your account password to view your secret key\./i)).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    const passwordTextboxNode = document.querySelector('input[name="password"]');

    expect(passwordTextboxNode).toBeInTheDocument();
    await userEvent.type(passwordTextboxNode, 'testpassword');
    const viewCodeButtonNode = screen.getByRole('button', {name: /view key/i});

    expect(viewCodeButtonNode).toBeInTheDocument();
    await userEvent.click(viewCodeButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({
      type: 'MFA_REQUEST_SECRET_CODE',
      password: 'testpassword',
      isQRCode: false,
    });
    expect(onCloseButton).toHaveBeenCalled();
  });
});
