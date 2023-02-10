import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import Signin from '.';

let initialStore;

jest.mock('./SignInForm', () => ({
  __esModule: true,
  ...jest.requireActual('./SignInForm'),
  default: () => (
    <div>SignInForm</div>
  ),
}));

jest.mock('../../LandingPages/Shopify/PageHeader', () => ({
  __esModule: true,
  ...jest.requireActual('../../LandingPages/Shopify/PageHeader'),
  default: () => (
    <div>Shopify Header</div>
  ),
}));

jest.mock('../../../components/UserSignInPage/UserSignInPageFooter', () => ({
  __esModule: true,
  ...jest.requireActual('../../../components/UserSignInPage/UserSignInPageFooter'),
  default: () => (
    <div>SignIn Footer</div>
  ),
}));

async function initSignIn() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/signin?application=shopify'}]} >
      <Route>
        <Signin />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('signin', () => {
  test('should render all required elements', async () => {
    await initSignIn();
    const signInWithGoogle = screen.getByRole('heading', {name: 'Sign in'});
    const SigninForm = screen.queryByText('SignInForm');
    const SigninFooter = screen.queryByText('SignIn Footer');
    const ShopifyHeader = screen.queryByText('Shopify Header');

    expect(SigninForm).toBeInTheDocument();
    expect(SigninFooter).toBeInTheDocument();
    expect(ShopifyHeader).toBeInTheDocument();
    expect(signInWithGoogle).toBeInTheDocument();
  });

  test('should not render SignUp content when ALLOW_SIGNUP is set to false', async () => {
    global.ALLOW_SIGNUP = 'false';
    await initSignIn();
    const title = screen.queryByText('SignIn Footer');

    expect(title).not.toBeInTheDocument();
  });
});
