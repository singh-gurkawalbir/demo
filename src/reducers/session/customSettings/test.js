/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('customSettings reducers', () => {
  const resourceType = 'imports';
  const resourceId = '123';

  test('should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const oldState = { key: { keyword: 'findme' } };
    const newState = reducer(oldState, unknownAction);

    expect(newState).toEqual(oldState);
  });

  describe('FORM_REQUEST action', () => {
    test('should replace the state with status = request', () => {
      const expectedState = { 123: { status: 'request' } };
      const newState = reducer(
        undefined,
        actions.customSettings.formRequest(resourceType, resourceId)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('FORM_RECEIVED action', () => {
    test('should return empty state if not exists', () => {
      const expectedState = { 123: {} };
      const newState = reducer(
        undefined,
        actions.customSettings.formReceived(resourceId, '')
      );

      expect(newState).toEqual(expectedState);
    });

    test('should update state with status and form meta', () => {
      const expectedState = {
        123: {
          meta: { fieldMap: { store: { name: 'store' } } },
          status: 'received',
          scriptId: undefined,
        },
      };
      const state = reducer(
        undefined,
        actions.customSettings.formRequest(resourceType, resourceId)
      );
      const newState = reducer(
        state,
        actions.customSettings.formReceived(resourceId, {
          fieldMap: { store: { name: 'store' } },
        })
      );

      expect(newState).toMatchObject(expectedState);
    });
  });

  describe('FORM_ERROR action', () => {
    test('should replace the state with status = error', () => {
      const expectedState = { 123: { status: 'error', error: 'Dummy error' } };
      const newState = reducer(
        undefined,
        actions.customSettings.formError(resourceId, 'Dummy error')
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('FORM_CLEAR action', () => {
    test('should delete the resource reference from the state', () => {
      const state = { 123: { status: 'request' }, 456: { status: 'request' } };
      const expectedState = { 456: { status: 'request' } };
      const newState = reducer(
        state,
        actions.customSettings.formClear(resourceId)
      );

      expect(newState).toEqual(expectedState);
    });
  });

  describe('RESOURCE.UPDATED action', () => {
    test('should not modify state if correct patches not applied', () => {
      const state = { 123: { status: 'request' }, 456: { status: 'request' } };
      const somePatch = [{ path: '/somePath', value: 'someValue' }];
      const newState = reducer(
        state,
        actions.resource.updated(resourceType, resourceId, [], somePatch)
      );

      expect(newState).toEqual(state);
    });

    test('should delete resource reference if form patches applied', () => {
      const state = { 123: { status: 'request' }, 456: { status: 'request' } };
      const somePatch = [{ path: '/settingsForm', value: 'someValue' }];
      const expectedState = { 456: { status: 'request' } };
      const newState = reducer(
        state,
        actions.resource.updated(resourceType, resourceId, [], somePatch)
      );

      expect(newState).toEqual(expectedState);
    });

    test('should delete all resource references if script patches applied', () => {
      const state = {
        123: { status: 'received', scriptId: '888' },
        456: { status: 'received', scriptId: '999' },
        789: { status: 'received', scriptId: '888' },
      };
      const somePatch = [{ path: '/content', value: 'someValue' }];
      const expectedState = { 456: { status: 'received', scriptId: '999' } };
      const newState = reducer(
        state,
        actions.resource.updated('scripts', '888', [], somePatch)
      );

      expect(newState).toEqual(expectedState);
    });
  });
});

describe('customSettings selectors', () => {
  const resourceType = 'imports';
  const resourceId = '123';

  describe('customSettingsForm', () => {
    test('should return undefined when no match found.', () => {
      expect(selectors.customSettingsForm(undefined, 'dummy')).toEqual(
        undefined
      );
      expect(selectors.customSettingsForm({}, 'dummy')).toEqual(undefined);
    });

    test('should return correct state when match is found.', () => {
      const expectedState = { status: 'request' };
      const state = reducer(
        undefined,
        actions.customSettings.formRequest(resourceType, resourceId)
      );

      expect(selectors.customSettingsForm(state, '123')).toEqual(expectedState);
    });
  });
});
