/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import RunDashboardPanel from './RunDashboardPanel';
import { runServer } from '../../../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../../../test/test-utils';

async function initMarketplace({
  props = {
    flowId: 'flow_id_1',
  },
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    flows: [
      {
        _id: 'flow_id_1',
      },
      {
        _id: 'flow_id_2',
        _integrationId: 'integration_id_1',
      },
    ],
  };
  const ui = (
    <MemoryRouter>
      <RunDashboardPanel {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('RunDashboardPanel test cases', () => {
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
    const { utils } = await initMarketplace();

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });

  test('should pass the initial render with integration id', async () => {
    const { utils } = await initMarketplace();

    expect(utils.container.firstChild).toBeEmptyDOMElement();
  });
});
