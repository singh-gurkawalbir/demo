/* global describe, test,expect, afterEach, beforeEach jest */
import React from 'react';
import * as reactRedux from 'react-redux';
import { waitFor } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import useHandleResourceFormFlowSampleData from './useHandleResourceFormFlowSampleData';
import actions from '../../../../actions';
import {
  LOOKUP_FLOW_DATA_STAGE,
  IMPORT_FLOW_DATA_STAGE,
} from '../../../../utils/flowData';

const mockHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    replace: mockHistoryReplace,
  }),
}));
async function inituseHandleResourceFormFlowSampleData(resourceType = 'imports', resourceId = '_id') {
  const DummyComponent = () => {
    useHandleResourceFormFlowSampleData('formKey');

    return <></>;
  };

  const initialStore = reduxStore;

  initialStore.getState().session.form = {
    formKey: { parentContext: {initComplete: true, skipCommit: false, resourceType, flowId: '_flowId', resourceId}},
  };
  initialStore.getState().data.resources = {
    exports: [
      {
        _id: '_id',
        isLookup: true,
      },
      {
        _id: '_id2',
        isLookup: false,
      },
    ],
  };

  await renderWithProviders(<DummyComponent />, {initialStore});
}
describe('useHandleResourceFormFlowSampleData tests', () => {
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
  test('Should able to test the custom hook with imports', async () => {
    await inituseHandleResourceFormFlowSampleData();
    await waitFor(() => expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.flowData.requestSampleData(
      '_flowId', '_id', 'imports', IMPORT_FLOW_DATA_STAGE, undefined, 'formKey')));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.flowData.resetStages('_flowId', '_id', [
      'processedFlowInput', 'inputFilter', 'preMap', 'importMappingExtract', 'importMapping', 'postMap', 'postMapOutput'])));
  });
  test('Should able to test the custom hook with normal standalone exports', async () => {
    await inituseHandleResourceFormFlowSampleData('exports', '_id2');
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.flowData.resetStages('_flowId', '_id2', [])));
  });
  test('Should able to test the custom hook with lookup exports', async () => {
    await inituseHandleResourceFormFlowSampleData('exports');
    await waitFor(() => expect(mockDispatchFn).toHaveBeenNthCalledWith(1, actions.flowData.requestSampleData(
      '_flowId', '_id', 'exports', LOOKUP_FLOW_DATA_STAGE, undefined, 'formKey')));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenNthCalledWith(2, actions.flowData.resetStages('_flowId', '_id', ['processedFlowInput', 'inputFilter'])));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenNthCalledWith(3, actions.flowData.resetStages('_flowId', '_id', ['responseMapping', 'responseMappingExtract', 'preSavePage', 'transform', 'raw'])));
  });
});
