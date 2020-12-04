/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';
import {FORM_SAVE_STATUS} from '../../../../utils/constants';
import { suiteScriptResourceKey } from '../../../../utils/suiteScript';

describe('session.suiteScript.resourceForm form reducers', () => {
  const resourceType = 'connections';
  const ssLinkedConnectionId = 'ssConnId';
  const resourceId = 'res1';
  const isNew = false;
  const skipCommit = false;
  const flowId = 'flow1';
  const integrationId = 'int1';
  const initData = [{id: 'FIELD1', value: 'test'}];
  const key = suiteScriptResourceKey({
    ssLinkedConnectionId,
    resourceType,
    resourceId,
  });
  const exportsKey = suiteScriptResourceKey({
    ssLinkedConnectionId,
    resourceType: 'exports',
    resourceId,
  });

  const oldState = { 'new-1234': 'ab123' };
  const formValues = {
    '/type': 'http',
    '/assistant': 'googleshopping',
    '/http/auth/type': 'oauth'};
  const fieldMeta = {
    fieldMap: {
      field1: {
        id: 'FIELD1',
        type: 'text',
        name: 'field1',
        defaultValue: 'test',
        label: 'field1',
      },

      validField: {
        id: 'FIELD2',
        type: 'text',
        name: 'field2',
        defaultValue: '123',
        label: 'field2',
      },
    },

    layout: { fields: ['field1', 'validField'] },
  };

  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe('RESOURCE_FORM.INIT action', () => {
    test('should store the initial resource form data', () => {
      const state = reducer(undefined, actions.suiteScript.resourceForm.init(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
        isNew,
        skipCommit,
        flowId,
        initData,
      ));

      const expected = {[key]: {initComplete: false, initData}};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.INIT action', () => {
    test('should store the failed form data', () => {
      let state = reducer(undefined, actions.suiteScript.resourceForm.init(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
        isNew,
        skipCommit,
        flowId,
        initData,
      ));

      state = reducer(state, actions.suiteScript.resourceForm.initFailed(ssLinkedConnectionId, resourceType, resourceId));

      const expected = {
        [key]: {
          initComplete: false,
          initFailed: true,
        }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.INIT_COMPLETE action', () => {
    test('should store the completed form data', () => {
      const oldState = { [key]: {} };

      const state = reducer(oldState, actions.suiteScript.resourceForm.initComplete(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
        fieldMeta,
        isNew,
        skipCommit,
        flowId
      ));

      const expected = {
        [key]: { initData: null,
          isNew,
          skipCommit,
          initComplete: true,
          fieldMeta,
          flowId }};

      expect(state).toEqual(expected);
    });
  });

  describe('RESOURCE_FORM.SUBMIT action', () => {
    test('should store the submitted form data', () => {
      const oldState = { [exportsKey]: {}, [key]: {} };

      const state = reducer(oldState, actions.suiteScript.resourceForm.submit(ssLinkedConnectionId,
        integrationId,
        'exports',
        resourceId
      ));

      const expected = {
        [exportsKey]: {
          formSaveStatus: 'loading',
          formValues: undefined,
          skipClose: false}};

      expect(state[exportsKey]).toEqual(expected[exportsKey]);
    });
  });
  describe('RESOURCE_FORM.SUBMIT_COMPLETE action', () => {
    test('should be able to store complete form data', () => {
      const oldState = { [key]: {} };

      const state = reducer(oldState, actions.suiteScript.resourceForm.submitComplete(ssLinkedConnectionId,
        integrationId,
        resourceType,
        resourceId,
        formValues));

      const expected = {
        [key]: {
          formSaveStatus: FORM_SAVE_STATUS.COMPLETE,
          formValues }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.SUBMIT_FAILED action', () => {
    test('should be able to store failed form data', () => {
      const oldState = { [key]: {} };

      const state = reducer(oldState, actions.suiteScript.resourceForm.submitFailed(ssLinkedConnectionId,
        integrationId,
        resourceType,
        resourceId));

      const expected = {
        [key]: {
          formSaveStatus: FORM_SAVE_STATUS.FAILED,
        }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.SUBMIT_ABORTED action', () => {
    test('should be able to store aborted form data', () => {
      const oldState = { [key]: {} };

      const state = reducer(oldState, actions.suiteScript.resourceForm.submitAborted(ssLinkedConnectionId,
        integrationId,
        resourceType,
        resourceId));

      const expected = {
        [key]: {
          formSaveStatus: FORM_SAVE_STATUS.ABORTED,
        }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.CLEAR action', () => {
    test('should be able to clear form data', () => {
      const oldState = reducer(undefined, actions.suiteScript.resourceForm.submitAborted(ssLinkedConnectionId,
        integrationId,
        resourceType,
        resourceId));
      const state = reducer(oldState, actions.suiteScript.resourceForm.clear(ssLinkedConnectionId,
        resourceType,
        resourceId));

      expect(state[key]).toEqual({});
    });
  });
  describe('suiteScriptResourceFormState selector', () => {
    test('should return empty object when state is undefined', () => {
      expect(selectors.suiteScriptResourceFormState(undefined, {})).toEqual({});
    });
    test('should return valid form state', () => {
      const state = reducer(undefined, actions.suiteScript.resourceForm.submitAborted(ssLinkedConnectionId,
        integrationId,
        resourceType,
        resourceId));

      expect(selectors.suiteScriptResourceFormState(state, {ssLinkedConnectionId, resourceType, resourceId})).toEqual({formSaveStatus: 'aborted'});
    });
  });
  describe('suiteScriptResourceFormSaveProcessTerminated selector', () => {
    test('should return false when state is undefined', () => {
      expect(selectors.suiteScriptResourceFormSaveProcessTerminated(undefined, {})).toEqual(false);
    });
    test('should return valid form state', () => {
      const stateAborted = reducer(undefined, actions.suiteScript.resourceForm.submitAborted(ssLinkedConnectionId,
        integrationId,
        resourceType,
        resourceId));
      const stateFailed = reducer(undefined, actions.suiteScript.resourceForm.submitFailed(ssLinkedConnectionId,
        integrationId,
        resourceType,
        resourceId));

      const stateCompleted = reducer(undefined, actions.suiteScript.resourceForm.submitComplete(ssLinkedConnectionId,
        integrationId,
        resourceType,
        resourceId));
      const stateCleared = reducer(undefined, actions.suiteScript.resourceForm.clear(ssLinkedConnectionId,
        resourceType,
        resourceId));

      expect(selectors.suiteScriptResourceFormSaveProcessTerminated(stateAborted, {ssLinkedConnectionId, resourceType, resourceId})).toEqual(true);
      expect(selectors.suiteScriptResourceFormSaveProcessTerminated(stateFailed, {ssLinkedConnectionId, resourceType, resourceId})).toEqual(true);
      expect(selectors.suiteScriptResourceFormSaveProcessTerminated(stateCompleted, {ssLinkedConnectionId, resourceType, resourceId})).toEqual(true);
      expect(selectors.suiteScriptResourceFormSaveProcessTerminated(stateCleared, {ssLinkedConnectionId, resourceType, resourceId})).toEqual(false);
    });
  });
});
