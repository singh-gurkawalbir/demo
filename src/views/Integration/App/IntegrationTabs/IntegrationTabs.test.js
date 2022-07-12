/* global describe, test, expect */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import {mockGetRequestOnce, renderWithProviders} from '../../../../test/test-utils';
import { runServer } from '../../../../test/api/server';
import actions from '../../../../actions/index';
import IntegrationTabsComponent from '.';

describe('erver', () => {
  runServer();
  test('should test various tabs', async () => {
    const {store} = renderWithProviders(<MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15']}> <Route path="/:integrationId"><IntegrationTabsComponent /></Route></MemoryRouter>);

    store.dispatch(actions.resource.requestCollection('integrations'));
    store.dispatch(actions.user.preferences.request());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.defaultAShareId).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    screen.debug(null, Infinity);
    expect(screen.getByText('Flows')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Connections')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Audit log')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getAllByText('Settings').length).toBe(2);
  });
  test('should test  monitor level tab', async () => {
    mockGetRequestOnce('/api/profile', {
      _id: '5ca5c855ec5c172792285f53',
      name: 'Celigo 123',
      email: 'Celigo@celigo.com',
      role: 'io-qa intern',
      company: 'Amazon Central',
      phone: '',
      auth_type_google: {},
      timezone: 'Asia/Calcutta',
      developer: true,
      allowedToPublish: true,
      agreeTOSAndPP: true,
      createdAt: '2019-04-04T09:03:18.208Z',
      useErrMgtTwoDotZero: true,
      authTypeSSO: null,
      emailHash: '1c8eb6f416e72a5499283b56f2663fe1'});

    const {store} = renderWithProviders(<MemoryRouter initialEntries={['/5ff579d745ceef7dcd797c15']}> <Route path="/:integrationId"><IntegrationTabsComponent /></Route></MemoryRouter>);

    store.dispatch(actions.resource.requestCollection('integrations'));
    store.dispatch(actions.user.preferences.request());
    store.dispatch(actions.user.profile.request());
    store.dispatch(actions.user.org.accounts.requestCollection());
    await waitFor(() => expect(store?.getState()?.user?.org?.accounts.length).toBeGreaterThan[1]);
    await waitFor(() => expect(store?.getState()?.user?.preferences?.defaultAShareId).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.profile?.name).toBeDefined());
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });
});
