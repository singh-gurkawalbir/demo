/* global describe, test, expect, jest, beforeEach, afterEach */

import React from 'react';
import { MemoryRouter, Route} from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup } from '@testing-library/react';
import * as reactRedux from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import Signup from '.';
import { runServer } from '../../test/api/server';
import { getCreatedStore } from '../../store';

let initialStore;

function store(auth) {
  initialStore.getState().auth = auth;
}

async function initSignUp() {
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/signup'}]} >
      <Route>
        <Signup />
      </Route>
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('SignUp', () => {
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
    cleanup();
  });

  test('Should able to test the Signup ', async () => {
    store({});
    await initSignUp();
    const titleText = screen.getByText('Celigo Inc.');

    expect(titleText).toBeInTheDocument();
    const signinHeadingNode = screen.getByRole('heading', {name: 'Sign up'});

    expect(signinHeadingNode).toBeInTheDocument();
    const name = screen.getByPlaceholderText('Name*');
    const businessEmail = screen.getByPlaceholderText('Business email*');
    const company = screen.getByPlaceholderText('Company');
    const role = screen.getByPlaceholderText('Role');
    const phone = screen.getByPlaceholderText('Phone');

    expect(name).toBeInTheDocument();
    expect(businessEmail).toBeInTheDocument();
    expect(company).toBeInTheDocument();
    expect(role).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
  });

  test('Should able to test the  signin link', async () => {
    store({});
    await initSignUp();
    const signInLinkNode = screen.getByRole('link', {name: 'Sign in'});

    expect(signInLinkNode).toBeInTheDocument();
    await userEvent.click(signInLinkNode);
    expect(signInLinkNode.closest('a')).toHaveAttribute('href', '/signin');
  });
});
