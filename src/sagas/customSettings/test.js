/* global describe, test */

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
  const resourceType = 'imports';

  test('should not make API call if no init hook present', () => {
    const resourceState = {
      settingsForm: { form: { fieldMap: { store: { name: 'store' } } } },
      settings: { store: 'test' },
    };
    const expectedMeta = {
      fieldMap: { store: { name: 'store', defaultValue: 'test' } },
    };

    return expectSaga(initSettingsForm, { resourceType, resourceId })
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

    return expectSaga(initSettingsForm, { resourceType, resourceId, sectionId})
      .provide([
        // mock for unknown sectionId
        [select(selectors.getSectionMetadata, resourceType, resourceId, sectionId), resourceState],
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .not.call.fn(apiCallWithRetry)
      .run();
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

    return expectSaga(initSettingsForm, { resourceType, resourceId })
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

    return expectSaga(initSettingsForm, { resourceType, resourceId })
      .provide([
        [select(selectors.getSectionMetadata, resourceType, resourceId, 'general'), resourceState],
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .put(actions.customSettings.formError(resourceId, [error.message]))
      .run();
  });
});
