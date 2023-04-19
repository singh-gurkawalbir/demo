
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { render } from '@testing-library/react';
import ErrorActions from '.';

const mockHistoryPush = jest.fn();

function initErrorActions(errorId) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/test/error/12345'}]}
    >
      <Route
        path="/:errorId"
        params={{errorId: '12345'}}
        >
        <ErrorActions errorId={errorId} />
      </Route>
    </MemoryRouter>
  );

  return render(ui);
}

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('testsuite for ErrorActions', () => {
  afterEach(() => {
    mockHistoryPush.mockClear();
  });
  test('should test the Error Actions drawer', async () => {
    initErrorActions('12345');
    const errorActionsButtonNode = document.querySelector('button[data-test="error-actions"]');

    expect(errorActionsButtonNode).toBeInTheDocument();
    await userEvent.click(errorActionsButtonNode);
    expect(mockHistoryPush).toHaveBeenCalledWith('/test/error/12345');
  });
});

