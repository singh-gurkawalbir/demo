
import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { initSettingsForm } from '.';
import { apiCallWithRetry } from '../index';

describe('initSettingsForm saga', () => {
  const resourceId = '1234';
  const resourceType = 'flows';

  test('should not make API call if no init hook present', () => {
    const resourceState = {
      settingsForm: { form: { fieldMap: { store: { name: 'store' } } } },
      settings: { store: 'test' },
    };
    const expectedMeta = {
      fieldMap: { store: { name: 'store', defaultValue: 'test' } },
    };

    expectSaga(initSettingsForm, { resourceType, resourceId })
      .provide([
        [select(selectors.getSectionMetadata, resourceType, resourceId, 'general'), resourceState],
      ])
      .not.call.fn(apiCallWithRetry)
      .put(actions.customSettings.formReceived(resourceId, expectedMeta))
      .run();
  });

  test('should not make api call when section metadata isn\'t present', () => {
    const error = { code: 422, message: 'unprocessable entity' };
    const resourceState = null;
    const sectionId = 'unknownSectionId';

    expectSaga(initSettingsForm, { resourceType, resourceId, sectionId})
      .provide([
        // mock for unknown sectionId
        [select(selectors.getSectionMetadata, resourceType, resourceId, sectionId), resourceState],
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .not.call.fn(apiCallWithRetry)
      .run();
  });

  describe('init hook settingsForm base path', () => {
    const resourceState = {
      settingsForm: {
        form: { fieldMap: { store: { name: 'store' } } },
        init: { function: 'main'},
      },
      settings: { store: 'test', currency: 'us' },
    };

    test('should call root level settingsForm initialization path when sectionId is not passed', () =>
      expectSaga(initSettingsForm, { resourceType, resourceId })
        .provide([
          [select(selectors.getSectionMetadata, resourceType, resourceId, 'general'), resourceState],
        ])
        .call.fn(apiCallWithRetry, {path: `/${resourceType}/${resourceId}/settingsForm/init`,
          opts: { method: 'POST' } })
        .run());
    test('should call root level settingsForm initialization path when `general` sectionId is passed', () =>
      expectSaga(initSettingsForm, { resourceType, resourceId, sectionId: 'general' })
        .provide([
          [select(selectors.getSectionMetadata, resourceType, resourceId, 'general'), resourceState],
        ])
        .call.fn(apiCallWithRetry, {path: `/${resourceType}/${resourceId}/settingsForm/init`,
          opts: { method: 'POST' } })
        .run());

    test('should not call settingsForm initialization when invalid sectionId is passed', () =>
      expectSaga(initSettingsForm, { resourceType, resourceId, sectionId: 'invalidId'})
        .provide([
          [select(selectors.getSectionMetadata, resourceType, resourceId, 'invalidId'), null],
        ])
        .not.call.fn(apiCallWithRetry)
        .run());

    test('should call correct flowGrouping form initialization path when valid sectionId is passed', () => {
      expectSaga(initSettingsForm, { resourceType, resourceId, sectionId: 'validId'})
        .provide([
          [select(selectors.getSectionMetadata, resourceType, resourceId, 'validId'), resourceState],
        ])
        .call.fn(apiCallWithRetry, {path: `/${resourceType}/${resourceId}/flowGroupings/validId/settingsForm/init`,
          opts: { method: 'POST' } })
        .run();
    });
  });
  test('should make API call when init hook present and update form metadata', () => {
    const resourceState = {
      settingsForm: {
        form: { fieldMap: { store: { name: 'store' } } },
        init: { function: 'main'},
      },
      settings: { store: 'test', currency: 'us' },
    };
    const initHookMeta = {
      fieldMap: { store: { name: 'store' }, currency: { name: 'currency' } },
    };
    const expectedMeta = {
      fieldMap: {
        store: { name: 'store', defaultValue: 'test' },
        currency: { name: 'currency', defaultValue: 'us' },
      },
    };

    expectSaga(initSettingsForm, { resourceType, resourceId })
      .provide([
        [select(selectors.getSectionMetadata, resourceType, resourceId, 'general'), resourceState],
        [matchers.call.fn(apiCallWithRetry), initHookMeta],
      ])
      .call.fn(apiCallWithRetry)
      .put(
        actions.customSettings.formReceived(
          resourceId,
          expectedMeta,
          resourceState.settingsForm.init._scriptId
        )
      )
      .run();
  });

  test('should throw error when API fails', () => {
    const error = { code: 422, message: 'unprocessable entity' };
    const resourceState = {
      settingsForm: {
        form: { fieldMap: { store: { name: 'store' } } },
        init: { function: 'main', _scriptId: '55' },
      },
      settings: { store: 'test', currency: 'us' },
    };

    expectSaga(initSettingsForm, { resourceType, resourceId })
      .provide([
        [select(selectors.getSectionMetadata, resourceType, resourceId, 'general'), resourceState],
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .put(actions.customSettings.formError(resourceId, [error.message]))
      .run();
  });

  test('should make API call when init hook present and update form meatdata with default value', () => {
    const resourceState = {
      settingsForm: {
        form: { fieldMap: { store: { name: 'store', defaultValue: 'defaultStore' } } },
        init: { function: 'main'},
      },
      settings: { store: '' },
    };
    const initHookMeta = {
      fieldMap: { store: { name: 'store', defaultValue: 'defaultStore' }, currency: { name: 'currency', defaultValue: 'defaultCurrency' } },
    };
    const expectedMeta = {
      fieldMap: {
        store: { name: 'store', defaultValue: '' },
        currency: { name: 'currency', defaultValue: 'defaultCurrency' },
      },
    };

    expectSaga(initSettingsForm, { resourceType, resourceId })
      .provide([
        [select(selectors.getSectionMetadata, resourceType, resourceId, 'general'), resourceState],
        [matchers.call.fn(apiCallWithRetry), initHookMeta],
      ])
      .call.fn(apiCallWithRetry)
      .put(
        actions.customSettings.formReceived(
          resourceId,
          expectedMeta,
          resourceState.settingsForm.init._scriptId
        )
      )
      .run();
  });

  test('should make API call when init hook present and without any resource settings', () => {
    const resourceState = {
      settingsForm: {
        form: { fieldMap: { store: { name: 'store', defaultValue: 'defaultStore' } } },
        init: { function: 'main'},
      },
    };
    const initHookMeta = {
      fieldMap: { store: { name: 'store', defaultValue: 'defaultStore' }, currency: { name: 'currency', defaultValue: 'defaultCurrency' } },
    };
    const expectedMeta = {
      fieldMap: {
        store: { name: 'store', defaultValue: 'defaultStore' },
        currency: { name: 'currency', defaultValue: 'defaultCurrency' },
      },
    };

    expectSaga(initSettingsForm, { resourceType, resourceId })
      .provide([
        [select(selectors.getSectionMetadata, resourceType, resourceId, 'general'), resourceState],
        [matchers.call.fn(apiCallWithRetry), initHookMeta],
      ])
      .call.fn(apiCallWithRetry)
      .put(
        actions.customSettings.formReceived(
          resourceId,
          expectedMeta,
          resourceState.settingsForm.init._scriptId
        )
      )
      .run();
  });
});
