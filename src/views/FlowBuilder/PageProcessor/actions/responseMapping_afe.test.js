
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import ResponseMapping from './responseMapping_afe';
import actions from '../../../../actions';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';

async function initResponseMapping({
  props = {},
} = {}) {
  const initialStore = reduxStore;

  const ui = (
    <MemoryRouter>
      <ResponseMapping.Component {...props} />
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

describe('ResponseMapping test cases', () => {
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
    const { utils } = await initResponseMapping();

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the initial render with props', async () => {
    const onClose = jest.fn();

    await initResponseMapping({
      props: {
        flowId: 'flow_id',
        resourceType: 'resource_type',
        resourceId: 'resource_id',
        onClose,
        open: true,
      },
    });

    expect(screen.queryByText('Redirected to //editor/responseMappings-resource_id')).toBeInTheDocument();
    expect(onClose).toBeCalled();
    expect(mockDispatchFn).toBeCalledWith(actions.editor.init('responseMappings-resource_id', 'responseMappings', {
      flowId: 'flow_id',
      resourceId: 'resource_id',
      resourceType: 'resource_type',
      stage: 'responseMappingExtract',
      data: {},
    }));
  });
});
