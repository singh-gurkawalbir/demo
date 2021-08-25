/* global describe, test, expect */
import each from 'jest-each';
import reducer, { selectors } from '.';
import actions from '../../../actions';
import { COMM_STATES } from '../../comms/networkComms';

const flowId = 'flow123';
const lastExportDateTime = '2017-10-10T14:53:26+05:30';

describe('session.flows reducers', () => {
  const oldState = { 'new-1234': 'ab123' };

  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });
  let testCases = [
    ['should return state unaltered when flow id is undefined', undefined, lastExportDateTime],
    ['should return state unaltered when flow id is null', null, lastExportDateTime],
    ['should return state unaltered when flow id is empty', '', lastExportDateTime],
    ['should return state unaltered when last export date time response is undefined', undefined, undefined],
    ['should return state unaltered when last export date time response is null', null, null],
    ['should return state unaltered when last export date time response is empty', '', ''],
  ];

  each(testCases).test('%s', (name, flowId, lastExportDateTimeResponse) => {
    expect(reducer(oldState,
      actions.flow.receivedLastExportDateTime(flowId, lastExportDateTimeResponse))).toEqual(oldState);
  });

  test('should set lastExportDateTime data correctly.', () => {
    const oldState = { };
    const lastExportDateTimeResponse = {lastExportDateTime};
    const expectedState = {
      [flowId]: {lastExportDateTime: {data: lastExportDateTime, status: COMM_STATES.SUCCESS}},
    };
    const newState = reducer(oldState,
      actions.flow.receivedLastExportDateTime(flowId, lastExportDateTimeResponse)
    );

    expect(newState).toEqual(expectedState);
  });
  test('should set status property to error and data to undefined correctly when error response received', () => {
    const oldState = { };
    const expectedState = {
      [flowId]: {lastExportDateTime: {data: undefined, status: COMM_STATES.ERROR}},
    };
    const newState = reducer(oldState,
      actions.flow.receivedLastExportDateTime(flowId)
    );

    expect(newState).toEqual(expectedState);
  });
  testCases = [
    ['should return state unaltered when flow id is undefined', undefined, true],
    ['should return state unaltered when flow id is null', null, true],
    ['should return state unaltered when flow id is empty', '', true],
  ];
  each(testCases).test('%s', (name, flowId, onOffInProgress) => {
    expect(reducer(oldState,
      actions.flow.isOnOffActionInprogress(onOffInProgress, flowId))).toEqual(oldState);
  });

  test('should set onOffInProgress property correctly', () => {
    const oldState = { };
    let expectedState = {
      [flowId]: {onOffInProgress: true},
    };
    let newState = reducer(oldState,
      actions.flow.isOnOffActionInprogress(true, flowId)
    );

    expect(newState).toEqual(expectedState);
    expectedState = {
      [flowId]: {onOffInProgress: false},
    };
    newState = reducer(oldState,
      actions.flow.isOnOffActionInprogress(false, flowId)
    );

    expect(newState).toEqual(expectedState);
  });

  test('should set runStatus property correctly', () => {
    const oldState = { };
    let expectedState = {
      [flowId]: {runStatus: 'Started'},
    };
    let newState = reducer(oldState,
      actions.flow.runActionStatus('Started', flowId)
    );

    expect(newState).toEqual(expectedState);
    expectedState = {
      [flowId]: {runStatus: 'Done'},
    };
    newState = reducer(oldState,
      actions.flow.runActionStatus('Done', flowId)
    );

    expect(newState).toEqual(expectedState);
  });
});

describe('session.flows selectors', () => {
  describe('getLastExportDateTime', () => {
    test('should return null when state is undefined.', () => {
      expect(selectors.getLastExportDateTime(undefined, flowId)).toEqual(null);
    });

    test('should return correct object with status', () => {
      const oldState = { };
      const lastExportDateTimeResponse = {lastExportDateTime};
      const newState = reducer(oldState,
        actions.flow.receivedLastExportDateTime(flowId, lastExportDateTimeResponse)
      );
      const expected = {data: lastExportDateTime, status: COMM_STATES.SUCCESS };

      expect(selectors.getLastExportDateTime(newState, flowId)).toEqual(expected);
    });
    test('should return null when flowId is undefined.', () => {
      const oldState = { };
      const lastExportDateTimeResponse = {lastExportDateTime};
      const newState = reducer(oldState,
        actions.flow.receivedLastExportDateTime(flowId, lastExportDateTimeResponse)
      );

      expect(selectors.getLastExportDateTime(newState, undefined)).toEqual(null);
    });
    test('should return correct object when lastExportDateTime is null.', () => {
      const oldState = { };
      const lastExportDateTimeResponse = {lastExportDateTime: null};
      const newState = reducer(oldState,
        actions.flow.receivedLastExportDateTime(flowId, lastExportDateTimeResponse)
      );
      const expected = {data: null, status: COMM_STATES.SUCCESS};

      expect(selectors.getLastExportDateTime(newState, flowId)).toEqual(expected);
    });
  });
  describe('isOnOffInProgress', () => {
    const defaultObject = { onOffInProgress: false };

    test('should return defaultObject when state is undefined.', () => {
      expect(selectors.isOnOffInProgress(undefined, flowId)).toEqual(defaultObject);
    });

    test('should return correct isOnOffInProgress flag', () => {
      const oldState = { };

      let newState = reducer(oldState,
        actions.flow.isOnOffActionInprogress(true, flowId)
      );
      let expected = {onOffInProgress: true };

      expect(selectors.isOnOffInProgress(newState, flowId)).toEqual(expected);
      newState = reducer(oldState,
        actions.flow.isOnOffActionInprogress(false, flowId)
      );
      expected = {onOffInProgress: false };

      expect(selectors.isOnOffInProgress(newState, flowId)).toEqual(expected);
    });
  });
  describe('flowRunStatus', () => {
    const defaultObject = { runStatus: '' };

    test('should return defaultObject when state is undefined.', () => {
      expect(selectors.flowRunStatus(undefined, flowId)).toEqual(defaultObject);
    });

    test('should return correct runStatus flag', () => {
      const oldState = { };

      let newState = reducer(oldState,
        actions.flow.runActionStatus('Started', flowId)
      );
      let expected = {runStatus: 'Started' };

      expect(selectors.flowRunStatus(newState, flowId)).toEqual(expected);
      newState = reducer(oldState,
        actions.flow.runActionStatus('Done', flowId)
      );
      expected = {runStatus: 'Done' };

      expect(selectors.flowRunStatus(newState, flowId)).toEqual(expected);
    });
  });
});
