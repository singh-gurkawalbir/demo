
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import OutputFilterLauncher from './outputFilter_afe';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initOutputFilterLauncher({
  props = {},
} = {}) {
  const initialStore = reduxStore;

  const ui = (
    <MemoryRouter>
      <OutputFilterLauncher.Component {...props} />
    </MemoryRouter>
  );

  const { store, utils } = await renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  Redirect: jest.fn(({ to }) => `Redirected to ${to}`),
}));

describe('OutputFilterLauncher test cases', () => {
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
    const { utils } = await initOutputFilterLauncher();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with props', async () => {
    const onClose = jest.fn();

    await initOutputFilterLauncher({
      props: {
        flowId: 'flow_id',
        resourceType: 'resource_type',
        resourceId: 'resource_id',
        onClose,
        open: true,
      },
    });

    expect(screen.queryByText('Redirected to //editor/oFilter-resource_id')).toBeInTheDocument();
    expect(onClose).toBeCalled();
    expect(mockDispatchFn).toBeCalledWith(actions.editor.init('oFilter-resource_id', 'outputFilter', {
      flowId: 'flow_id',
      resourceId: 'resource_id',
      resourceType: 'resource_type',
      stage: 'outputFilter',
    }));
  });
});
