/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('Transfers', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });

  test('should update preview response when we receive tranfer preview received event', () => {
    const response = {exports: [{_id: 'id1', name: 'exp1'}], flows: [{_id: 'id2', name: 'flow1'}, {_id: 'id3', name: 'flow3'}]};
    const requestReducer = reducer(
      undefined,
      actions.transfer.receivedPreview({response}));

    expect(requestReducer).toEqual({
      transfer: {response},
    });
  });
  test('should update preview error when we receive tranfer preview received event', () => {
    const error = 'error';
    const requestReducer = reducer(
      undefined,
      actions.transfer.receivedPreview({error}));

    expect(requestReducer).toEqual({
      transfer: {error},
    });
  });
  test('should clear preview when we receive clear preview event', () => {
    const response = {exports: [{_id: 'id1', name: 'exp1'}], flows: [{_id: 'id2', name: 'flow1'}, {_id: 'id3', name: 'flow3'}]};
    const requestReducer = reducer(
      undefined,
      actions.transfer.receivedPreview({response}));
    const requestReducer2 = reducer(
      requestReducer,
      actions.transfer.clearPreview());

    expect(requestReducer2).toEqual({
      transfer: undefined,
    });
  });
});
describe('Get transfer preview data', () => {
  test('should return null if state or transfer does not exists', () => {
    expect(selectors.getTransferPreviewData(undefined)).toEqual(null);
    expect(selectors.getTransferPreviewData({})).toEqual(null);
  });
  test('should return true if token status is loading', () => {
    const response = {exports: [{_id: 'id1', name: 'exp1'}], flows: [{_id: 'id2', name: 'flow1'}, {_id: 'id3', name: 'flow3'}]};
    const expectedResponse = [{_id: 'id1', name: 'exp1', type: 'exports'}, {_id: 'id2', name: 'flow1', type: 'flows'}, {_id: 'id3', name: 'flow3', type: 'flows'}];

    const state = reducer(
      undefined,
      actions.transfer.receivedPreview({response}));

    expect(selectors.getTransferPreviewData(state)).toEqual({response: expectedResponse});
  });
});
