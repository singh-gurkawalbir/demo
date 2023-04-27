import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MFACodeGeneration from './MFACodeGeneration';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';
import { runServer } from '../../../../test/api/server';
import { getCreatedStore } from '../../../../store';

let initialStore;

async function initMFACodeGeneration({mfaValues} = {}) {
  mutateStore(initialStore, draft => {
    draft.session.mfa = mfaValues;
  });
  const ui = (
    <MemoryRouter>
      <MFACodeGeneration />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('react-qr-code', () => ({
  __esModule: true,
  ...jest.requireActual('react-qr-code'),
  default: () => <div>Testing QR Code</div>,
}));

describe('Testsuite for MFA Code Generation', () => {
  runServer();
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should verify the MFA Code Generation heading and view the QR code and click on close button of the modal dialog', async () => {
    await initMFACodeGeneration({mfaValues: {codes: {}}});
    expect(screen.getByText(/add integrator\.io/i)).toBeInTheDocument();
    expect(screen.getByText(/scan the qr code below with your verification app\. once your app reads the qr code, you'll get a 6-digit code\./i)).toBeInTheDocument();
    const viewQRCodeButtonNode = screen.getByRole('button', {name: /view qr code/i});

    expect(viewQRCodeButtonNode).toBeInTheDocument();
    await userEvent.click(viewQRCodeButtonNode);
    const onCloseButtonNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(onCloseButtonNode).toBeInTheDocument();
    await userEvent.click(onCloseButtonNode);
    expect(onCloseButtonNode).not.toBeInTheDocument();
  });
  test('should verify the MFA Code Generation generated QR code and click on view secret code and cancel the modal dialog', async () => {
    await initMFACodeGeneration({mfaValues: {codes: {
      secretCode: {
        secret: '12345',
        keyURI: 'test://url',
      },
      showQrCode: true,
    }}});
    expect(screen.getByText(/add integrator\.io/i)).toBeInTheDocument();
    expect(screen.getByText(/scan the qr code below with your verification app\. once your app reads the qr code, you'll get a 6-digit code\./i)).toBeInTheDocument();
    expect(screen.getByText(/Testing QR Code/i)).toBeInTheDocument();
    expect(screen.getByText(/can't scan your qr code\? authenticate with your account and secret key\./i)).toBeInTheDocument();
    const viewAccountAndSecretKeyButtonNode = screen.getByRole('button', {
      name: /view account & secret key/i,
    });

    expect(viewAccountAndSecretKeyButtonNode).toBeInTheDocument();
    await userEvent.click(viewAccountAndSecretKeyButtonNode);
    const onCloseButtonNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(onCloseButtonNode).toBeInTheDocument();
    await userEvent.click(onCloseButtonNode);
    expect(onCloseButtonNode).not.toBeInTheDocument();
  });
  test('should verify the MFA Code Generation generated QR code and click on view secret code and cancel the modal dialog duplicate', async () => {
    await initMFACodeGeneration({mfaValues: {codes: {
      secretCode: {
        secret: '12345',
        keyURI: 'test://url',
      },
      showQrCode: true,
    }}});
    expect(screen.getByText(/add integrator\.io/i)).toBeInTheDocument();
    expect(screen.getByText(/scan the qr code below with your verification app\. once your app reads the qr code, you'll get a 6-digit code\./i)).toBeInTheDocument();
    expect(screen.getByText(/Testing QR Code/i)).toBeInTheDocument();
    expect(screen.getByText(/can't scan your qr code\? authenticate with your account and secret key\./i)).toBeInTheDocument();
    const viewAccountAndSecretKeyButtonNode = screen.getByRole('button', {
      name: /view account & secret key/i,
    });

    expect(viewAccountAndSecretKeyButtonNode).toBeInTheDocument();
    await userEvent.click(viewAccountAndSecretKeyButtonNode);
    const onCloseButtonNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(onCloseButtonNode).toBeInTheDocument();
    await userEvent.click(onCloseButtonNode);
    expect(onCloseButtonNode).not.toBeInTheDocument();
  });
  test('should verify the MFA Code Generation generated QR code and click on view secret code and cancel the modal dialog duplicate1', async () => {
    await initMFACodeGeneration({mfaValues: {codes: {
      secretCode: {
        secret: '12345',
        keyURI: 'test://url',
      },
      showSecretCode: true,
    }}});
    expect(screen.getByText(/can't scan your qr code\? authenticate with your account and secret key\./i)).toBeInTheDocument();
    expect(screen.getByText(/account: celigo/i)).toBeInTheDocument();
    expect(screen.getByText(/secret key: 12345/i)).toBeInTheDocument();
  });
});
