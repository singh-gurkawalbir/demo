/* global describe, test, expect */
import reducer, {selectors } from '.';
import actions from '../../../../actions';
import { COMM_STATES } from '../../../comms/networkComms';

const initialState = {
  '3-4': {initComplete: true},
};
const initialStateWithInitComplete = {
  '3-4': {initComplete: true},
  '1-2': {initComplete: true},
};
const ssLinkedConnectionId = '1';
const integrationId = '2';

describe('reducer test cases', () => {
  test('should initialize successfully when initComplete action is dispatched ', () => {
    const state = reducer(initialState,
      actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));

    expect(state).toEqual({
      '3-4': {initComplete: true},
      '1-2': {initComplete: true}});
  });

  test('should clear the corresponding form state when initClear action is dispatched ', () => {
    const state = reducer(initialState,
      actions.suiteScript.iaForm.initClear(ssLinkedConnectionId, integrationId));

    expect(state).toEqual({
      '3-4': {initComplete: true},
    });
  });
  test('should set the status to saving when submit action is dispatched ', () => {
    const values = {a: '1', b: '2'};
    const state = reducer(initialStateWithInitComplete,
      actions.suiteScript.iaForm.submit(
        ssLinkedConnectionId, integrationId, 'someSectionId', values));

    expect(state).toEqual({
      '3-4': {initComplete: true},
      '1-2': {initComplete: true, status: COMM_STATES.LOADING}});
  });
  test('should set the status to success when submitComplete action is dispatched ', () => {
    const state = reducer(initialStateWithInitComplete,
      actions.suiteScript.iaForm.submitComplete(ssLinkedConnectionId, integrationId));

    expect(state).toEqual({
      '3-4': {initComplete: true},
      '1-2': {initComplete: true, status: COMM_STATES.SUCCESS}});
  });
  test('should set the status to success when submitFailed action is dispatched ', () => {
    const state = reducer(
      initialStateWithInitComplete,
      actions.suiteScript.iaForm.submitFailed(
        ssLinkedConnectionId, integrationId));

    expect(state).toEqual({
      '3-4': {initComplete: true},
      '1-2': {initComplete: true, status: COMM_STATES.ERROR}});
  });

  describe('workflow', () => {
    test('save process of suiteScript form should indicate states correctly ', () => {
      let state = reducer(initialStateWithInitComplete,
        actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormState(state, {
        ssLinkedConnectionId, integrationId}))
        .toEqual({ initComplete: true});
      state = reducer(state,
        actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormState(state, {
        ssLinkedConnectionId, integrationId}))
        .toEqual({ initComplete: true, status: COMM_STATES.LOADING});

      state = reducer(state,
        actions.suiteScript.iaForm.submitComplete(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormState(state, {
        ssLinkedConnectionId, integrationId}))
        .toEqual({ initComplete: true, status: COMM_STATES.SUCCESS});
    });
    test('save process failing of a suiteScript form should indicate states correctly', () => {
      let state = reducer(initialStateWithInitComplete,
        actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormState(state, {
        ssLinkedConnectionId, integrationId}))
        .toEqual({ initComplete: true});
      state = reducer(state,
        actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormState(state, {
        ssLinkedConnectionId, integrationId}))
        .toEqual({ initComplete: true, status: COMM_STATES.LOADING});

      state = reducer(state,
        actions.suiteScript.iaForm.submitFailed(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormState(state, {
        ssLinkedConnectionId, integrationId}))
        .toEqual({ initComplete: true, status: COMM_STATES.ERROR});
    });
  });
});

describe('selectors', () => {
  const badInputs = [
    // ssLinkedConnectionId, integrationId
    ['a', null],
    ['', null],
    [undefined, null],
  ];

  describe('suiteScriptIAFormState', () => {
    test('should pick up an initComplete state correctly', () => {
      const initCompleteState = reducer(initialState,
        actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormState(initCompleteState, {
        ssLinkedConnectionId, integrationId})).toEqual(
        {initComplete: true});
    });
    test('should return {} since it cant find the associate form state', () => {
      const initCompleteState = reducer(initialState,
        actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormState(initCompleteState, {
        ssLinkedConnectionId: 'someId', integrationId: 'someOtherId'})).toEqual({});
    });

    test.each(
      badInputs
    )('should return {} for bad selectors inputs ssLinkedConnectionId %s and  integrationIdInput %s',
      (ssLinkedConnectionIdInput, integrationIdInput) => {
        const initCompleteState = reducer(initialState,
          actions.suiteScript.iaForm.initComplete(ssLinkedConnectionId, integrationId));

        expect(selectors.suiteScriptIAFormState(initCompleteState, {
          ssLinkedConnectionId: ssLinkedConnectionIdInput, integrationId: integrationIdInput}))
          .toEqual({});
      });
  });

  describe('suiteScriptIAFormSaving', () => {
    test('should indicate from is loading when form status is in saving', () => {
      const submitingState = reducer(initialState,
        actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormSaving(submitingState, {
        ssLinkedConnectionId, integrationId})).toEqual(true);
    });
    test('should indicate from is not loading when form has completed save', () => {
      const submitingState = reducer(initialState,
        actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId));
      const submitCompleteState = reducer(submitingState,
        actions.suiteScript.iaForm.submitComplete(ssLinkedConnectionId, integrationId));

      expect(selectors.suiteScriptIAFormSaving(submitCompleteState, {
        ssLinkedConnectionId, integrationId})).toEqual(false);
    });

    test.each(
      badInputs
    )('should return false for bad selectors inputs ssLinkedConnectionId %s and  integrationIdInput %s',
      (ssLinkedConnectionIdInput, integrationIdInput) => {
        const initCompleteState = reducer(initialState,
          actions.suiteScript.iaForm.submit(ssLinkedConnectionId, integrationId));

        expect(selectors.suiteScriptIAFormSaving(initCompleteState, {
          ssLinkedConnectionId: ssLinkedConnectionIdInput, integrationId: integrationIdInput}))
          .toEqual(false);
      });
  });
});
