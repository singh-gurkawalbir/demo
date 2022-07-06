/* global describe, test, expect */
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, mockGetRequestOnce} from '../../../test/test-utils';
import { runServer } from '../../../test/api/server';
import actions from '../../../actions';
import LineGraphDrawer from '.';

describe('Linegraph UI Tests', () => {
  runServer();

  async function renderWithStore() {
    mockGetRequestOnce('/api/integrations', [{
      _id: '629f0dcfccb94d35de6f436b',
      lastModified: '2022-06-30T18:28:01.323Z',
      name: 'New',
      install: [],
      sandbox: false,
      _registeredConnectionIds: [],
      installSteps: [],
      uninstallSteps: [],
      flowGroupings: [
        {
          name: 'some group',
          _id: '62bdeb31a0f5f21448168826',
        },
        {
          name: 'some group2',
          _id: '62bdeb31a0f5f21448168827',
        },
      ],
      createdAt: '2022-06-07T08:35:27.408Z',
    },
    ]);

    const {store} = renderWithProviders(<LineGraphDrawer integrationId="629f0dcfccb94d35de6f436b" />);

    store.dispatch(actions.user.preferences.request('..'));
    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.environment).toBeDefined());

    return store;
  }
  test('should change the date range', async () => {
    const store = await renderWithStore();

    const dateRangebutton = screen.getByText('Last 30 days');

    userEvent.click(dateRangebutton);

    userEvent.click(screen.getByText('Last 15 days'));
    userEvent.click(screen.getByText('Apply'));
    expect(store?.getState()?.user?.preferences?.linegraphs).toBeDefined();
    expect(dateRangebutton).toHaveTextContent('Last 15 days');
  });
  test('should select a flow group', async () => {
    const store = await renderWithStore();

    store.dispatch(actions.user.preferences.request('..'));
    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.environment).toBeDefined());

    const dateRangebutton = screen.getByText('Last 30 days');

    userEvent.click(dateRangebutton);

    userEvent.click(screen.getByText('Last 15 days'));
    userEvent.click(screen.getByText('Apply'));
    expect(store?.getState()?.user?.preferences?.linegraphs).toBeDefined();

    userEvent.click(screen.getByText('Select flow group'));
    const somegroup2 = screen.getByText('some group2');

    userEvent.click(screen.getByText('some group2'));

    expect(somegroup2).toHaveAttribute('aria-selected', 'true');
  });
  test('should change the flow Checkbox', async () => {
    const store = await renderWithStore();

    store.dispatch(actions.user.preferences.request('..'));
    store.dispatch(actions.resource.requestCollection('integrations'));
    await waitFor(() => expect(store?.getState()?.data?.resources?.integrations).toBeDefined());
    await waitFor(() => expect(store?.getState()?.user?.preferences?.environment).toBeDefined());

    userEvent.click(screen.getByText('Integration-level'));
    const checkbox = screen.getByRole('checkbox');

    userEvent.click(checkbox);
    userEvent.click(screen.getByText('Apply'));
    expect(screen.getByText('No flows selected')).toBeInTheDocument();
  });
});
