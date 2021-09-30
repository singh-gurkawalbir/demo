/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../../actions';

const DEFAULT_STATE = {};

const flowId = 'flow-1234';
const ssLinkedConnectionId = 'ss-1234';
const integrationId = 'int-1234';
const data = [{id: 'd', type: 'string'}, {id: 'a[*].b', type: 'string'}];
const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
const expectedRequestState = {[id]: {status: 'requested'}};
const expectedReceivedState = {[id]: {status: 'received', data}};
const expectedReceivedErrorState = {[id]: {status: 'error'}};

describe('SuiteScript import sample data reducer ', () => {
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
  describe('SUITESCRIPT.IMPORT_SAMPLEDATA.REQUEST action', () => {
    test('should set status as requested', () => {
      const state = reducer(undefined, actions.suiteScript.importSampleData.request(
        {
          ssLinkedConnectionId,
          integrationId,
          flowId,
        }
      ));

      expect(state).toEqual(expectedRequestState);
    });
  });
  describe('SUITESCRIPT.IMPORT_SAMPLEDATA.RECEIVED action', () => {
    test('should set status as received and data to updated with previewData', () => {
      const state = reducer(undefined, actions.suiteScript.importSampleData.received({ ssLinkedConnectionId, integrationId, flowId, data}));

      expect(state).toEqual(expectedReceivedState);
    });
  });
  describe('SUITESCRIPT.IMPORT_SAMPLEDATA.RECEIVED_ERROR action', () => {
    test('should set status as error', () => {
      const state = reducer(undefined, actions.suiteScript.importSampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId}));

      expect(state).toEqual(expectedReceivedErrorState);
    });
  });
});

describe('suiteScriptImportSampleDataContext selector', () => {
  test('should return default state when state is undefined', () => {
    expect(selectors.suiteScriptImportSampleDataContext(undefined, {})).toEqual(DEFAULT_STATE);
  });
  test('should return valid form state', () => {
    const requestedState = reducer(undefined, actions.suiteScript.importSampleData.request(
      {
        ssLinkedConnectionId,
        integrationId,
        flowId,
      }
    ));
    const receivedState = reducer(undefined, actions.suiteScript.importSampleData.received({ ssLinkedConnectionId, integrationId, flowId, data}));
    const receivedErrorState = reducer(undefined, actions.suiteScript.importSampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId}));

    expect(selectors.suiteScriptImportSampleDataContext(requestedState, {ssLinkedConnectionId, integrationId, flowId})).toEqual(expectedRequestState[id]);
    expect(selectors.suiteScriptImportSampleDataContext(receivedState, {ssLinkedConnectionId, integrationId, flowId})).toEqual(expectedReceivedState[id]);
    expect(selectors.suiteScriptImportSampleDataContext(receivedErrorState, {ssLinkedConnectionId, integrationId, flowId})).toEqual(expectedReceivedErrorState[id]);
  });
});
