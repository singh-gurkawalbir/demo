import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotFound from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initNotFound() {
  const ui = (
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

describe('notFound test cases', () => {
  runServer();

  test('should pass the initial render with redirectTo', async () => {
    await initNotFound();
    const goBackButton = screen.getByRole('button', {name: /Go back and prosper!/i});

    const submitTicket = screen.getByRole('link', {name: /submit a ticket/i});
    const helpCenter = screen.getByRole('link', {name: /check our Help Center/i});

    expect(screen.queryByText(/404/i)).toBeInTheDocument();
    expect(screen.queryByText(/This is not the page that you're looking for.../i)).toBeInTheDocument();
    expect(screen.queryByText(/We can't find the page you're looking for. But don't worry! You can either return/i)).toBeInTheDocument();
    expect(screen.queryByText(/to the previous page,/i)).toBeInTheDocument();

    expect(submitTicket).toBeInTheDocument();
    expect(submitTicket).toHaveAttribute('href');

    expect(helpCenter).toBeInTheDocument();
    expect(submitTicket).toHaveAttribute('href');

    expect(goBackButton).toBeInTheDocument();

    await userEvent.click(goBackButton);
    expect(mockHistoryGoBack).toHaveBeenCalled();
  });
});
