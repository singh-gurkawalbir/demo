/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../../actions';

const DEFAULT_STATE = {};

const flowId = 'flow-1234';
const ssLinkedConnectionId = 'ss-1234';
const integrationId = 'int-1234';
const error = 'some error';
const previewData = [{id: 'd', type: 'string'}, {id: 'a[*].b', type: 'string'}];
const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
const expectedRequestState = {[id]: {status: 'requested'}};
const expectedReceivedState = {[id]: {status: 'received', data: previewData}};
const expectedReceivedErrorState = {[id]: {status: 'error', data: error}};

describe('SuiteScript flow sample data reducer ', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = DEFAULT_STATE;
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });

  test('should return default state if the state is undefined', () => {
    const prevState = undefined;
    const currState = reducer(prevState, { type: 'RANDOM_ACTION'});

    expect(currState).toEqual(DEFAULT_STATE);
  });
  describe('SUITESCRIPT.SAMPLEDATA.REQUEST action', () => {
    test('should set status as requested', () => {
      const state = reducer(undefined, actions.suiteScript.sampleData.request(
        {
          ssLinkedConnectionId,
          integrationId,
          flowId,
        }
      ));

      expect(state).toEqual(expectedRequestState);
    });
  });
  describe('SUITESCRIPT.SAMPLEDATA.RECEIVED action', () => {
    test('should set status as received and data to updated with previewData', () => {
      const state = reducer(undefined, actions.suiteScript.sampleData.received({ ssLinkedConnectionId, integrationId, flowId, previewData}));

      expect(state).toEqual(expectedReceivedState);
    });
  });
  describe('SUITESCRIPT.SAMPLEDATA.RECEIVED_ERROR action', () => {
    test('should set status as error', () => {
      const state = reducer(undefined, actions.suiteScript.sampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId, error}));

      expect(state).toEqual(expectedReceivedErrorState);
    });
  });
  describe('SUITESCRIPT.SAMPLEDATA.RESET action', () => {
    test('should reset the entire state', () => {
      const prevState = reducer(undefined, actions.suiteScript.sampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId, error}));
      const state = reducer(prevState, actions.suiteScript.sampleData.reset({ ssLinkedConnectionId, integrationId, flowId}));

      expect(state).toEqual(DEFAULT_STATE);
    });
  });
  describe('suiteScriptFlowSampleDataContext selector', () => {
    test('should return default state when state is undefined', () => {
      expect(selectors.suiteScriptFlowSampleDataContext(undefined, {})).toEqual(DEFAULT_STATE);
    });
    test('should return valid form state', () => {
      const requestedState = reducer(undefined, actions.suiteScript.sampleData.request(
        {
          ssLinkedConnectionId,
          integrationId,
          flowId,
        }
      ));
      const receivedState = reducer(undefined, actions.suiteScript.sampleData.received({ ssLinkedConnectionId, integrationId, flowId, previewData}));
      const receivedErrorState = reducer(undefined, actions.suiteScript.sampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId, error}));
      const receivedResetState = reducer(receivedErrorState, actions.suiteScript.sampleData.reset({ ssLinkedConnectionId, integrationId, flowId}));

      expect(selectors.suiteScriptFlowSampleDataContext(requestedState, {ssLinkedConnectionId, integrationId, flowId})).toEqual(expectedRequestState[id]);
      expect(selectors.suiteScriptFlowSampleDataContext(receivedState, {ssLinkedConnectionId, integrationId, flowId})).toEqual(expectedReceivedState[id]);
      expect(selectors.suiteScriptFlowSampleDataContext(receivedErrorState, {ssLinkedConnectionId, integrationId, flowId})).toEqual(expectedReceivedErrorState[id]);
      expect(selectors.suiteScriptFlowSampleDataContext(receivedResetState, {ssLinkedConnectionId, integrationId, flowId})).toEqual(DEFAULT_STATE);
    });
  });
});
