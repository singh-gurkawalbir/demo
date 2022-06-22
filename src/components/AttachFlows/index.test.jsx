/* global describe, test, expect */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import actions from '../../actions';
import AttachFlows from './index';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

describe('sample test', () => {
  runServer();

  test('test for attach', async () => {
    const {store} = renderWithProviders(<MemoryRouter><AttachFlows integrationId="6248835cd68e2457e3b105ff" flowGroupingId="62a5b17bd92aff47b2eba399" /></MemoryRouter>);

    store.dispatch(actions.resource.requestCollection('connections'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    store.dispatch(actions.resource.requestCollection('flows'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.flows).toBeDefined());
    store.dispatch(actions.resource.requestCollection('exports'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());
    const Message = screen.getAllByRole('checkbox');

    fireEvent.click(Message[0]);
    const Message3 = screen.getByText('Select all flows');

    expect(Message3).toBeInTheDocument();
    const Message4 = screen.getByText('Attach');

    expect(Message4).toBeInTheDocument();
    fireEvent.click(Message4);
  });

  test('test for cancel', async () => {
    const {store} = renderWithProviders(<MemoryRouter><AttachFlows integrationId="6248835cd68e2457e3b105ff" flowGroupingId="62a5b17bd92aff47b2eba399" /></MemoryRouter>);

    store.dispatch(actions.resource.requestCollection('connections'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.connections).toBeDefined());
    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    store.dispatch(actions.resource.requestCollection('flows'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.flows).toBeDefined());
    store.dispatch(actions.resource.requestCollection('exports'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.exports).toBeDefined());
    const Message = screen.getAllByRole('checkbox');

    fireEvent.click(Message[0]);

    const Message3 = screen.getByText('Select all flows');

    expect(Message3).toBeInTheDocument();
    const Message9 = screen.getByText('test');

    expect(Message9).toBeInTheDocument();
    const Message4 = screen.getByText('Cancel');

    expect(Message4).toBeInTheDocument();
    fireEvent.click(Message4);
  });

  test('Testing for no flows', () => {
    renderWithProviders(<MemoryRouter><AttachFlows integrationId="6248835cd68e2457e3b105ff" flowGroupingId="62a5b17bd92aff47b2eba399" /></MemoryRouter>);
    const Message5 = screen.getByText('No flows found');

    expect(Message5).toBeInTheDocument();
  });
});
