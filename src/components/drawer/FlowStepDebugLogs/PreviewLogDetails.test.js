/* global describe, test, expect,beforeEach, afterEach, jest */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import PreviewLogDetails from './PreviewLogDetails';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';

const props = {
  flowId: 'random_mock_flowId',
  resourceId: 'random_resource_id_mock',
};

async function initPreviewLogDetails({props = {},
  logsStatus = 'recieved',
  error = {},
  activeLogKey = '',
}) {
  const initialStore = reduxStore;

  initialStore.getState().session.logs.flowStep = {
    random_resource_id_mock: {
      logsStatus,
      logsSummary: [{
        key: 'randomActiveLogKey',
        stage: 'import',
      }],
      loadMoreStatus: 'received',
      hasNewLogs: false,
      fetchStatus: 'completed',
      activeLogKey,
      logsDetails: {randomActiveLogKey: {
        status: logsStatus,
        request: {},
        response: {},
      }},
      nextPageURL: '/v1(api)/flows/:_flowId',
      error,
    },
  };
  const ui = (
    <MemoryRouter>
      <PreviewLogDetails {...props} />
    </MemoryRouter>
  );

  const { store, utils } = renderWithProviders(ui, { initialStore });

  return {
    store,
    utils,
  };
}

describe('PreviewLogDetails tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;
  let initialStore;

  beforeEach(() => {
    initialStore = cloneDeep(reduxStore);
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      const {logKey: key, resourceId, type} = action;

      switch (type) {
        case actionTypes.LOGS.FLOWSTEP.LOG.REQUEST:
          initialStore.getState().session.logs.flowStep[resourceId].logsDetails[key] = 'requested';
          break;
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  test('Should able to test the Preview Log is rendered initially with default values', async () => {
    await initPreviewLogDetails({props, activeLogKey: 'randomActiveLogKey'});
    expect(screen.queryByText(/HTTP request/i)).toBeInTheDocument();
    expect(screen.getByText(/Body/i)).toBeInTheDocument();
    expect(screen.getByText(/Headers/i)).toBeInTheDocument();
    expect(screen.getByText(/Other/i)).toBeInTheDocument();
    const httpResponse = screen.getByText(/HTTP response/i);

    expect(httpResponse).toBeInTheDocument();
    userEvent.click(httpResponse);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.logs.flowStep.requestLogDetails(props.flowId, props.resourceId, 'randomActiveLogKey'));
  });
  test('Should able to test the error snackbar when changeIdentifier is updated', async () => {
    await initPreviewLogDetails({props, error: {key: '200-POST', error: 'NoSuchKey'}, activeLogKey: 'randomActiveLogKey'});
    expect(screen.queryByText(/200-POST: NoSuchKey/i)).toBeInTheDocument();
  });
  test('Should able to test the Circular progressbar is shown when status = requested', async () => {
    await initPreviewLogDetails({props, logsStatus: 'requested', activeLogKey: 'randomActiveLogKey'});
    expect(screen.queryByText(/HTTP request/i)).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('Should able to test the Preview Without activeLogKey', async () => {
    await initPreviewLogDetails({props});
    expect(screen.queryByText(/HTTP request/i)).toBeInTheDocument();
  });
});
