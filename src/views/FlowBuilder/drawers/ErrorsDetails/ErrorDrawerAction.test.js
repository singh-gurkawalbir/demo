/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ErrorDrawerAction from './ErrorDrawerAction';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initErrorDrawerAction({
  props = {
    flowId: 'flow_id',
  },
  retryStatus = 'inProgress',
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.errorManagement.retryData.retryStatus = {
    flow_id: {
      export_id: retryStatus,
    },
  };
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/errors/export_id/open'}]}
    >
      <Route path="/errors/:resourceId/:errorType">
        <ErrorDrawerAction {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('ErrorDrawerAction test cases', () => {
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
    await initErrorDrawerAction();
    expect(screen.queryByText(/Retrying errors.../i)).toBeInTheDocument();
  });

  test('should pass the initial render with completed status', async () => {
    await initErrorDrawerAction({
      retryStatus: 'completed',
    });
    expect(screen.queryByText(/Retrying complete/i)).toBeInTheDocument();
  });
});
