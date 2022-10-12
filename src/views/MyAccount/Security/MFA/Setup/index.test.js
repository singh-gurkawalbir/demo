/* global describe, test, expect, beforeEach, jest, afterEach */
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import MFASetup from '.';
import { renderWithProviders } from '../../../../../test/test-utils';
import { runServer } from '../../../../../test/api/server';
import { getCreatedStore } from '../../../../../store';

let initialStore;

const mockHistoryBlock = jest.fn();

async function initMFASetup() {
  const ui = (
    <MemoryRouter>
      <MFASetup />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}
jest.mock('../MobileCodeVerification', () => ({
  __esModule: true,
  ...jest.requireActual('../MobileCodeVerification'),
  default: () => <div>Testing Mobile Code Verification</div>,
}));

jest.mock('../MFACodeGeneration', () => ({
  __esModule: true,
  ...jest.requireActual('../MFACodeGeneration'),
  default: () => <div>Testing Mobile Code Generation</div>,
}));

jest.mock('../ConnectDevice', () => ({
  __esModule: true,
  ...jest.requireActual('../ConnectDevice'),
  default: () => <div>Testing Connected Device</div>,
}));

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    block: mockHistoryBlock,
  }),
}));
describe('Testsuite for MFA setup', () => {
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
  test('should test the setup page', async () => {
    await initMFASetup();
    expect(screen.getByText(/get verification app/i)).toBeInTheDocument();
    expect(screen.getByText(/install any authenticator app that supports totp protocol or time-based one time password\./i)).toBeInTheDocument();
    expect(screen.getByText(/testing mobile code generation/i)).toBeInTheDocument();
    expect(screen.getByText(/testing mobile code verification/i)).toBeInTheDocument();
    expect(screen.getByText(/testing connected device/i)).toBeInTheDocument();
  });
});
