
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorDetailsTabs from './Tabs';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';

async function initErrorDetailsTabs({
  props = {},
  errorType = 'open',
} = {}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/${errorType}`}]}
    >
      <Route path="/:errorType">
        <ErrorDetailsTabs {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('ErrorDetailsTabs test cases', () => {
  runServer();

  test('should pass the initial render with default value', async () => {
    const onChange = jest.fn();

    await initErrorDetailsTabs({
      props: {
        onChange,
      },
    });
    const openErrors = screen.getByRole('tab', { name: /Open errors/i });
    const resolvedErrors = screen.getByRole('tab', { name: /Resolved errors/i });

    expect(openErrors).toBeInTheDocument();
    expect(resolvedErrors).toBeInTheDocument();

    await userEvent.click(resolvedErrors);
    expect(onChange).toBeCalledWith('resolved');
  });

  test('should pass the initial render with invalid error type', async () => {
    await initErrorDetailsTabs({
      errorType: 'invalid',
    });
    const openErrors = screen.getByRole('tab', { name: /Open errors/i });
    const resolvedErrors = screen.getByRole('tab', { name: /Resolved errors/i });

    expect(openErrors).toBeInTheDocument();
    expect(resolvedErrors).toBeInTheDocument();
  });
});
