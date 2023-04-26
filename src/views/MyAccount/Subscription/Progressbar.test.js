import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProgressBar from './Progressbar';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';

async function initProgressBar({ props = {
  usedCount: 12,
  totalCount: 123,
  env: 'production',
} } = {}) {
  const ui = (
    <MemoryRouter>
      <ProgressBar {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}
const mockReplacePush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockReplacePush,
  }),
}));

describe('progressBar test cases', () => {
  runServer();

  afterEach(() => {
    mockReplacePush.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initProgressBar();

    expect(screen.queryByText(/Using/i)).toBeInTheDocument();
    expect(screen.queryByText(/of/i)).toBeInTheDocument();
    expect(screen.queryByText(/List/i)).toBeInTheDocument();
  });

  test('should pass the initial render with default value duplicate', async () => {
    const setTitle = jest.fn();

    await initProgressBar(
      {
        props: {
          usedCount: 14,
          totalCount: 123,
          env: 'production',
          type: 'endpoints',
          setTitle,
        },
      });
    const listButton = screen.getByRole('button', { name: /List/i});

    expect(screen.queryByText(/Endpoint apps:/i)).toBeInTheDocument();
    expect(screen.queryByText(/14/i)).toBeInTheDocument();
    expect(screen.queryByText(/of/i)).toBeInTheDocument();
    expect(screen.queryByText(/123/i)).toBeInTheDocument();
    expect(listButton).toBeInTheDocument();

    await userEvent.click(listButton);
    expect(mockReplacePush).toHaveBeenCalledWith(buildDrawerUrl({
      path: drawerPaths.ACCOUNT.SUBSCRIPTION,
      baseUrl: '/',
      params: { env: 'production', type: 'endpoints' },
    }));
    expect(setTitle).toHaveBeenCalledWith('endpoints');
  });
});
