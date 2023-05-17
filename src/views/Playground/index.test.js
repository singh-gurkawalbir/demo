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

describe('editors test cases', () => {
  runServer();
  test('should pass the initial render with default values/ integration test', async () => {
    waitFor(() => {
      mockGetRequestOnce('/api/integrations', () => {});
      mockGetRequestOnce('/api/flows', () => {});
      mockGetRequestOnce('/api/imports', () => {});
      mockGetRequestOnce('/api/exports', () => {});
      mockGetRequestOnce('/api/processors', () => {});
    });

    await initTransferList({});
    await waitFor(() => expect(screen.getByRole('heading', {name: 'Developer playground'})).toBeInTheDocument());
    expect(screen.getByRole('heading', {name: 'Editor examples'})).toBeInTheDocument();
    waitFor(async () => {
      const csvParser = screen.queryByText('CSV parser helper');

      expect(csvParser).toBeInTheDocument();
      await userEvent.click(csvParser);
    });
    let simpleCSVParser;

    waitFor(async () => {
      simpleCSVParser = screen.queryByText('Simple CSV');

      expect(simpleCSVParser).toBeInTheDocument();
      expect(screen.queryByText(/CSV parser options/i)).not.toBeInTheDocument();
      await userEvent.click(simpleCSVParser);
      expect(screen.queryByText(/CSV parser options/i)).toBeInTheDocument();
    });

    waitFor(async () => {
      const fullScreenButton = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('title') === 'Fullscreen mode');

      expect(fullScreenButton).toBeInTheDocument();
      await userEvent.click(fullScreenButton);
    });

    waitFor(async () => {
      const closeButton = screen.getAllByRole('button').find(eachButton => eachButton.getAttribute('data-test') === 'closeRightDrawer');

      expect(closeButton).toBeInTheDocument();
      await userEvent.click(closeButton);
      expect(screen.queryByText(/CSV parser options/i)).not.toBeInTheDocument();

      await userEvent.click(simpleCSVParser);
      expect(screen.queryByText(/CSV parser options/i)).toBeInTheDocument();
      const cancelButton = screen.getByRole('button', {name: 'Cancel'});

      expect(cancelButton).toBeInTheDocument();
      await userEvent.click(cancelButton);

      expect(screen.queryByText(/CSV parser options/i)).not.toBeInTheDocument();
    });
  });
});
