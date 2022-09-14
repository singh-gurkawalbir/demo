/* global describe, test, expect, afterEach, jest, beforeEach */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UsersList from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';
import actions from '../../../actions';

describe('Users List Test Cases', () => {
  runServer();
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => { jest.clearAllTimers(); cleanup; });
  test('Test cases for the UsersList', async () => {
    const {store} = renderWithProviders(
      <MemoryRouter>
        <UsersList integrationId="5ffad3d1f08d35214ed200f7" />
      </MemoryRouter>
    );

    store.dispatch(actions.resource.requestCollection('connections'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    store.dispatch(actions.resource.requestCollection('notifications'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.notifications).toBeDefined());
    const nameText = screen.getByText('Name');

    expect(nameText).toBeInTheDocument();
    const emailText = screen.getByText('Email');

    expect(emailText).toBeInTheDocument();
    const accessLevelText = screen.getByText('Access level');

    expect(accessLevelText).toBeInTheDocument();
    const statusText = screen.getByText('Status');

    expect(statusText).toBeInTheDocument();
  });
});
