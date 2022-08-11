/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ScheduleDrawer from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initScheduleDrawer({
  props = {
    flowId: 'flow_id',
  },
  flowId = 'flow_id',
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    flows: [
      {
        _id: 'flow_id',
      },
    ],
  };

  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: `/flowBuilder/${flowId}/schedule`}]}
    >
      <Route
        path="/flowBuilder"
      >
        <ScheduleDrawer {...props} />
      </Route>
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('ScheduleDrawer test cases', () => {
  runServer();
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: reduxStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    await initScheduleDrawer();
    expect(screen.queryByText('Flow schedule')).toBeInTheDocument();
  });

  test('should pass the initial render with no props', async () => {
    await initScheduleDrawer({
      props: {},
    });
    expect(screen.queryByText('Flow schedule')).toBeInTheDocument();
  });
});
