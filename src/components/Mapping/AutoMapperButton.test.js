import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AutoMapperButton from './AutoMapperButton';
import actions from '../../actions';
import { runServer } from '../../test/api/server';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import customCloneDeep from '../../utils/customCloneDeep';

async function initAutoMapperButton({
  props = {
    disabled: false,
  },
  exportId = 'export_id',
  failMsg = 'just failed for no reason',
  status = 'received',
} = {}) {
  const initialStore = customCloneDeep(reduxStore);

  mutateStore(initialStore, draft => {
    draft.session.mapping = {
      mapping: {
        flowId: 'flow_id',
        status: 'mappingStatus',
        mappings: [],
        subRecordMappingId: props.subRecordMappingId,
        autoMapper: {
          status,
          failMsg,
          failSeverity: '',
        },
      },
    };
    draft.data.resources = {
      flows: [{
        _id: 'flow_id',
        pageGenerators: [{
          _exportId: exportId,
        }],
      }],
      exports: [{
        _id: 'export_id',
        adaptorType: 'HTTPExport',
      }],
    };
  });

  const ui = (
    <MemoryRouter>
      <AutoMapperButton {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('autoMapperButton component Test cases', () => {
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
  });
  test('should pass the initial render with default values', async () => {
    await initAutoMapperButton();
    const autoMapButton = screen.getByRole('button', {name: /Auto-map fields/i});

    expect(autoMapButton).toBeInTheDocument();
    expect(screen.queryByText(/just failed for no reason/i)).toBeInTheDocument();
    await userEvent.click(autoMapButton);
    expect(mockDispatchFn).toHaveBeenCalledTimes(2);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.autoMapper.request());
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.analytics.gainsight.trackEvent('AUTO_MAP_BUTTON_CLICKED'));
  });

  test('should pass the initial render where button is disabled', async () => {
    await initAutoMapperButton({
      status: 'requested',
    });
    const autoMapButton = screen.getByRole('button', {name: /Auto-map fields/i});

    expect(autoMapButton).toBeInTheDocument();
    expect(screen.queryByText(/just failed for no reason/i)).toBeInTheDocument();
    await expect(() => userEvent.click(autoMapButton)).rejects.toThrow();
    expect(mockDispatchFn).toHaveBeenCalledTimes(0);
  });

  test('should pass the initial render with custom values', async () => {
    await initAutoMapperButton({
      exportId: 'export_id_1',
      failMsg: null,
      status: 'requested',
    });
    expect(screen.queryByText(/Auto-map fields/i)).not.toBeInTheDocument();
  });
});
