
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ScheduleDrawer from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

function initScheduleDrawer({
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

  const { store, utils } = renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('ScheduleDrawer test cases', () => {
  runServer();
  test('should pass the initial render with default value', () => {
    initScheduleDrawer();
    expect(screen.queryByText('Flow schedule')).toBeInTheDocument();
  });

  test('should pass the initial render with no props', () => {
    initScheduleDrawer({
      props: {},
    });
    expect(screen.queryByText('Flow schedule')).toBeInTheDocument();
  });
});
