import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen, cleanup, waitFor} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import AcceptTOSAndPP from '.';
import actions from '../../actions';
import { getCreatedStore } from '../../store';

let initialStore;

async function initAgreeTOSAndPP() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/agreeTOSAndPP'}]} >
      <Route>
        <AcceptTOSAndPP />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('AgreeTOSAndPP test cases', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn();
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
    cleanup();
  });
  test('Should render all the necessary elements in the dom', async () => {
    await initAgreeTOSAndPP();
    const heading = screen.getByRole('heading', {name: 'Review & agree to terms of use'});
    const checkbox = screen.getByRole('checkbox', {name: 'I agree to the Terms of Service / Service Subscription Agreement and Privacy Policy .'});
    const tosLink = screen.getByRole('link', {name: 'Terms of Service / Service Subscription Agreement'});
    const privacyPolicyLink = screen.getByRole('link', {name: 'Privacy Policy'});
    const continueButton = screen.getByRole('button', {name: 'Continue'});
    const signoutButton = screen.getByRole('button', {name: 'Sign out'});

    expect(heading).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
    expect(tosLink).toBeInTheDocument();
    expect(tosLink).toHaveAttribute('href', 'https://www.celigo.com/terms-of-service/');

    expect(privacyPolicyLink).toBeInTheDocument();
    expect(privacyPolicyLink).toHaveAttribute('href', 'https://www.celigo.com/privacy/');

    expect(checkbox).not.toBeChecked();
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
    expect(signoutButton).toBeInTheDocument();
  });
  test('Should show checkbox to be checked after clicking and continue button should be enabled', async () => {
    await initAgreeTOSAndPP();
    const button = screen.getByRole('checkbox', {
      name: /I agree to the Terms of Service \/ Service Subscription Agreement and Privacy Policy ./i,
    });

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await waitFor(() => expect(button).toBeChecked());
    const continueButton = screen.getByRole('button', {name: 'Continue'});

    expect(continueButton).not.toBeDisabled();
  });

  test('Should dispatch an action when continue is clicked', async () => {
    await initAgreeTOSAndPP();
    const button = screen.getByRole('checkbox', {
      name: /I agree to the Terms of Service \/ Service Subscription Agreement and Privacy Policy ./i,
    });

    await userEvent.click(button);
    await waitFor(() => expect(button).toBeChecked());
    const continueButton = screen.getByRole('button', {name: 'Continue'});

    await userEvent.click(continueButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.user.profile.update({ agreeTOSAndPP: true }));
  });
  test('Should logout user on signout click', async () => {
    await initAgreeTOSAndPP();
    const signoutButton = screen.getByRole('button', {name: 'Sign out'});

    await userEvent.click(signoutButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.auth.logout());
  });
});
