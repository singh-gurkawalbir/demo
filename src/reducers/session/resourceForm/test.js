/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';
import { fieldsTouchedForMeta } from '../../../forms/utils';

describe('session.resource form reducers', () => {
  const resourceType = 'connections';
  const resourceId = 'res1';
  const isNew = false;
  const skipCommit = false;
  const flowId = 'flow1';
  const integrationId = 'int1';
  const initData = [{id: 'FIELD1', value: 'test'}];
  const key = `${resourceType}-${resourceId}`;
  const oldState = { 'new-1234': 'ab123' };
  const bundleUrl = 'https://*******.app.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=*****&domain=PRODUCTION&config=F&id=***';
  const bundleVersion = '1.0';
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
      const state = reducer(undefined, actions.resourceForm.init(
        resourceType,
        resourceId,
        isNew,
        skipCommit,
        flowId,
        initData,
        integrationId
      ));

      const expected = {[key]: {initComplete: false, initData}};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.INIT_COMPLETE action', () => {
    test('should store the completed form data', () => {
      const oldState = { [key]: {} };

      const state = reducer(oldState, actions.resourceForm.initComplete(
        resourceType,
        resourceId,
        fieldMeta,
        isNew,
        skipCommit,
        flowId
      ));

      const expected = {...oldState,
        [key]: { initData: state[key] && state[key].initData
          ? fieldsTouchedForMeta(
            fieldMeta,
            state[key] && state[key].initData
          )
          : null,
        isNew,
        skipCommit,
        initComplete: true,
        fieldMeta,
        flowId,
        showValidationBeforeTouched: false }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.INIT_FAILED action', () => {
    test('should store the failed form data', () => {
      const oldState = { [key]: {initData} };

      const state = reducer(oldState, actions.resourceForm.initFailed(resourceType, resourceId));

      const expected = {...oldState,
        [key]: { initData,
          initFailed: true,
        }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.CLEAR_INIT_DATA action', () => {
    test('should be able to clear init data', () => {
      const exportsKey = `exports-${resourceId}`;

      const oldState = { [exportsKey]: {} };

      const state = reducer(oldState, actions.resourceForm.clearInitData(resourceType, resourceId));

      const expected = {...oldState, [key]: { }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.SUBMIT action', () => {
    test('should store the submitted form data', () => {
      const exportsKey = `exports-${resourceId}`;
      const oldState = { [exportsKey]: {}, [key]: {} };

      const state = reducer(oldState, actions.resourceForm.submit(
        'exports',
        resourceId,
        null,
        null,
        true,
        false,
        flowId
      ));

      const expected = { ...oldState,
        [exportsKey]: {
          submitAborted: false,
          submitComplete: false,
          submitFailed: false,
          formValues: undefined,
          skipClose: true }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.SHOW_BUNDLE_INSTALL_NOTIFICATION action', () => {
    test('should store the bundle install notification data', () => {
      const exportsKey = `exports-${resourceId}`;

      const oldState = { [exportsKey]: {} };

      const state = reducer(oldState, actions.resourceForm.showBundleInstallNotification(bundleVersion, bundleUrl, 'exports', resourceId));

      const expected = {...oldState,
        [exportsKey]: {
          bundleVersion,
          bundleUrl,
          showBundleInstallNotification: true }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.HIDE_BUNDLE_INSTALL_NOTIFICATION action', () => {
    test('should hide bundle install notification data', () => {
      const exportsKey = `exports-${resourceId}`;

      const oldState = { [exportsKey]: {} };

      const state = reducer(oldState, actions.resourceForm.hideBundleInstallNotification('exports', resourceId));

      const expected = {...oldState,
        [exportsKey]: {
          showBundleInstallNotification: false }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.SUBMIT_COMPLETE action', () => {
    test('should be able to store complete form data', () => {
      const oldState = { [key]: {} };

      const state = reducer(oldState, actions.resourceForm.submitComplete(resourceType, resourceId, formValues));

      const expected = {...oldState,
        [key]: {
          submitComplete: true,
          formValues }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.SUBMIT_FAILED action', () => {
    test('should be able to store failed form data', () => {
      const oldState = { [key]: {} };

      const state = reducer(oldState, actions.resourceForm.submitFailed(resourceType, resourceId));

      const expected = {...oldState,
        [key]: {
          submitFailed: true,
        }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.SUBMIT_ABORTED action', () => {
    test('should be able to store aborted form data', () => {
      const oldState = { [key]: {} };

      const state = reducer(oldState, actions.resourceForm.submitAborted(resourceType, resourceId));

      const expected = {...oldState,
        [key]: {
          submitAborted: true,
        }};

      expect(state).toEqual(expected);
    });
  });
  describe('RESOURCE_FORM.CLEAR action', () => {
    test('should be able to clear form data', () => {
      const oldState = reducer(undefined, actions.resourceForm.submitAborted(resourceType, resourceId));
      const state = reducer(oldState, actions.resourceForm.clear(resourceType, resourceId));

      const expected = {...oldState,
        [key]: {
        }};

      expect(state).toEqual(expected);
    });
  });
  describe('resourceFormState selector', () => {
    test('should return empty object when state is undefined', () => {
      expect(selectors.resourceFormState(undefined)).toEqual({});
    });
    test('should return valid form state', () => {
      const state = reducer(undefined, actions.resourceForm.submitAborted(resourceType, resourceId));

      expect(selectors.resourceFormState(state, resourceType, resourceId)).toEqual({submitAborted: true});
    });
  });
  describe('resourceFormSaveProcessTerminated selector', () => {
    test('should return false when state is undefined', () => {
      expect(selectors.resourceFormSaveProcessTerminated(undefined)).toEqual(false);
    });
    test('should return valid form state', () => {
      const stateAborted = reducer(undefined, actions.resourceForm.submitAborted(resourceType, resourceId));
      const stateFailed = reducer(undefined, actions.resourceForm.submitFailed(resourceType, resourceId));

      const stateCompleted = reducer(undefined, actions.resourceForm.submitComplete(resourceType, resourceId));
      const stateCleared = reducer(undefined, actions.resourceForm.clear(resourceType, resourceId));

      expect(selectors.resourceFormSaveProcessTerminated(stateAborted, resourceType, resourceId)).toEqual(true);
      expect(selectors.resourceFormSaveProcessTerminated(stateFailed, resourceType, resourceId)).toEqual(true);
      expect(selectors.resourceFormSaveProcessTerminated(stateCompleted, resourceType, resourceId)).toEqual(true);
      expect(selectors.resourceFormSaveProcessTerminated(stateCleared, resourceType, resourceId)).toEqual(false);
    });
  });
});

