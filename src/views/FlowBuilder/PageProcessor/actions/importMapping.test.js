/* global describe, test, expect, beforeEach, afterEach, jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import ImportMapping from './importMapping';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initImportMapping({
  props = {
    resource: {
      _id: 'id_1',
    },
  },
} = {}) {
  const initialStore = reduxStore;

  const ui = (
    <MemoryRouter>
      <ImportMapping.Component {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('ImportMapping test cases', () => {
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
    mockHistoryPush.mockClear();
  });

  test('should pass the initial render with default value', async () => {
    const { utils } = await initImportMapping();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with props', async () => {
    const onClose = jest.fn();

    const { utils } = await initImportMapping({
      props: {
        flowId: 'flow_id',
        resource: {
          _id: 'id_1',
        },
        onClose,
        open: true,
      },
    });

    expect(utils.container).toBeEmptyDOMElement();
    expect(onClose).toBeCalled();
    expect(mockHistoryPush).toBeCalledWith('//mapping/flow_id/id_1'); // since I don't have any history default it will be /
  });
});
