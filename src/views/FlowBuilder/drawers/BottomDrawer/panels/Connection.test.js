/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ConnectionPanel from './Connection';
import { runServer } from '../../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../../test/test-utils';

async function initMarketplace({
  props = {
    flowId: 'flow_id_1',
  },
} = {}) {
  const initialStore = reduxStore;

  initialStore.getState().session.loadResources = {
    connections: 'received',
  };

  initialStore.getState().data.resources = {
    connections: [{
      name: 'connection 1',
      _id: 'connection_id_1',
    }],
    exports: [{
      _id: 'export_id_1',
      _connectionId: 'connection_id_1',
    }],
    imports: [{
      _id: 'import_id_1',
      _connectionId: 'connection_id_1',
    }],
    flows: [{
      _id: 'flow_id_1',
      pageGenerators: [{
        _exportId: 'export_id_1',
      }],
      pageProcessors: [{
        type: 'import',
        _importId: 'import_id_1',
      }],
    }],
  };

  const ui = (
    <MemoryRouter>
      <ConnectionPanel {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('ConnectionPanel test cases', () => {
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

  test('should pass the initial render with default value/pass the wrong id', async () => {
    await initMarketplace();
    expect(screen.queryByText(/Connection 1/i)).toBeInTheDocument();
  });
});
