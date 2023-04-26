
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StackSystemToken from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';
import actions from '../../actions';

async function initStackSystemToken({
  props = {},
} = {}) {
  const ui = (
    <MemoryRouter>
      <StackSystemToken {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('stackSystemToken test cases', () => {
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
  });
  test('should pass the initial render with default values', async () => {
    await initStackSystemToken({});
    expect(screen.queryByText(/Show token/i)).toBeInTheDocument();

    const buttonRef = screen.getByRole('button');

    await userEvent.click(buttonRef);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.stack.displayToken()); // id will be undefined
  });
});
