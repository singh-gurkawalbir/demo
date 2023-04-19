
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import MobileCodeVerification from './MobileCodeVerification';
import { renderWithProviders } from '../../../../test/test-utils';
import { runServer } from '../../../../test/api/server';
import { getCreatedStore } from '../../../../store';

let initialStore;

async function initMobileCodeVerification({className = ''} = {}) {
  const ui = (
    <MemoryRouter>
      <MobileCodeVerification className={className} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for MobileCodeVerification', () => {
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
  test('Should test the verify button after entering the code and click on save button', async () => {
    await initMobileCodeVerification();
    expect(screen.getByText(/verify mobile device/i)).toBeInTheDocument();
    expect(screen.getByText(/enter the 6-digit code from your app and click the button below\./i)).toBeInTheDocument();
    const codeTextNode = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('name') === 'mobileCode');

    expect(codeTextNode).toBeInTheDocument();
    await userEvent.type(codeTextNode, 'abcde');
    expect(screen.getByText(/Numbers only/i)).toBeInTheDocument();
    await userEvent.clear(codeTextNode);
    expect(screen.getByText(/A value must be provided. Numbers only/i)).toBeInTheDocument();
    await userEvent.type(codeTextNode, '123456');
    const verifyButtonNode = screen.getByRole('button', { name: 'Verify'});

    expect(verifyButtonNode).toBeInTheDocument();
    await userEvent.click(verifyButtonNode);
    expect(mockDispatchFn).toHaveBeenCalledWith({ type: 'MFA_MOBILE_CODE_VERIFY', code: '123456' });
  });
});
