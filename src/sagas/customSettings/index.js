import produce from 'immer';
import shortid from 'shortid';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';

export function* initSettingsForm({ resourceType, resourceId }) {
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!resource) return; // nothing to do.

  const hasInitHook =
    resource.settingsForm &&
    resource.settingsForm.init &&
    resource.settingsForm.init.function;
  let metadata = resource.settingsForm && resource.settingsForm.form;

  if (hasInitHook) {
    // If so, make an API call to initialize the form,
    // and dispatch an action to record a pending initialization status.
    yield put(
      actions.customSettings.updateForm(
        resourceId,
        'pending',
        shortid.generate(),
        {}
      )
    );

    const path = `/${resourceType}/${resourceId}/settingsForm/init`;

    try {
      metadata = yield call(apiCallWithRetry, {
        path,
        opts: { method: 'POST' },
      });
    } catch (error) {
      // REVIEW:
      return undefined;
    }
  }

  // inject the current setting values (found in resource.settings)
  // into the respective field’s defaultValue prop.
  let newFieldMeta = metadata;

  if (resource.settings && metadata) {
    newFieldMeta = produce(metadata, draft => {
      Object.keys(draft.fieldMap).forEach(key => {
        const field = draft.fieldMap[key];

        field.defaultValue = resource.settings[field.name] || '';
      });
    });
  }

  // Dispatch an action to record the initialized form metadata and also a “complete” status.
  yield put(
    actions.customSettings.updateForm(
      resourceId,
      'complete',
      shortid.generate(),
      newFieldMeta
    )
  );
}

export const customSettingsSagas = [
  takeEvery(actionTypes.CUSTOM_SETTINGS.INIT, initSettingsForm),
];
