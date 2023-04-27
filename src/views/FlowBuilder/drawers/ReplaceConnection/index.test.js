
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReplaceConnectionDrawer from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initReplaceConnectionDrawer({
  props = {
    flowId: 'flow_id',
    integrationId: 'integration_id',
  },
} = {}) {
  const initialStore = reduxStore;

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/flowBuilder/flow_id/replaceConnection/connection_id'}]}
    >
      <Route
        path="/flowBuilder/flow_id"
      >
        <ReplaceConnectionDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

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

describe('ReplaceConnectionDrawer test cases', () => {
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
    mockHistoryGoBack.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initReplaceConnectionDrawer();
    const cancelButton = screen.getByRole('button', { name: 'Cancel'});

    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
    expect(mockHistoryGoBack).toBeCalled();
  });
});
