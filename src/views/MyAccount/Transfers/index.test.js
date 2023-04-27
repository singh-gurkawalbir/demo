import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Transfers from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initTransfers() {
  const ui = (
    <MemoryRouter>
      <Transfers />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('transfers test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initTransfers();

    const transferButton = screen.getByRole('button', { name: /Create transfer/i});

    expect(screen.queryByText(/Transfers/i)).toBeInTheDocument();
    expect(screen.queryByText(/Back to transfers/i)).not.toBeInTheDocument();
    expect(transferButton).toBeInTheDocument();

    await userEvent.click(transferButton);

    expect(screen.queryByText(/Back to transfers/i)).toBeInTheDocument();
  });
});
