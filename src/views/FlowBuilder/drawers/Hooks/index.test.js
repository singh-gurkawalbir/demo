/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import HooksDrawer from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initHooksDrawer({
  props = {
    flowId: 'flow_id',
    integrationId: 'integration_id',
  },
} = {}) {
  const initialStore = reduxStore;

  const ui = (
    <MemoryRouter>
      <HooksDrawer {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('HooksDrawer test cases', () => {
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
    const { utils } = await initHooksDrawer();

    expect(utils.container).toBeEmptyDOMElement();
  });
});
