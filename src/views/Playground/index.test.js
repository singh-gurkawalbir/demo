/* global describe, test, expect */
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Editors from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders, mockGetRequestOnce } from '../../test/test-utils';

async function initTransferList() {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/playground'}]}
    >
      <Route
        path="/playground"
      >
        <Editors />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('Editors test cases', () => {
  runServer();
  test('should pass the initial render with default values/ integration test', async () => {
    mockGetRequestOnce('/api/integrations', []);
    mockGetRequestOnce('/api/flows', []);
    mockGetRequestOnce('/api/imports', []);
    mockGetRequestOnce('/api/exports', []);
    mockGetRequestOnce('/api/processors', {});

    await waitFor(() => initTransferList({}), {
      timeout: 200,
    }); // setting it as 200 as retry default is set to 200

    expect(await screen.getByRole('heading', {name: 'Developer playground'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Editor examples'})).toBeInTheDocument();
    const csvParser = screen.queryByText('CSV parser helper');

    expect(csvParser).toBeInTheDocument();
    userEvent.click(csvParser);

    const simpleCSVParser = screen.queryByText('Simple CSV');

    expect(simpleCSVParser).toBeInTheDocument();
    expect(screen.queryByText(/CSV parser options/i)).not.toBeInTheDocument();
    userEvent.click(simpleCSVParser);
    expect(screen.queryByText(/CSV parser options/i)).toBeInTheDocument();

    const fullScreenButton = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('title') === 'Fullscreen mode');

    expect(fullScreenButton).toBeInTheDocument();
    userEvent.click(fullScreenButton);

    const closeButton = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'closeRightDrawer');

    expect(closeButton).toBeInTheDocument();
    userEvent.click(closeButton);
    expect(screen.queryByText(/CSV parser options/i)).not.toBeInTheDocument();

    userEvent.click(simpleCSVParser);
    expect(screen.queryByText(/CSV parser options/i)).toBeInTheDocument();
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});

    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);

    expect(screen.queryByText(/CSV parser options/i)).not.toBeInTheDocument();
  });
});
