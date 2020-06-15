import produce from 'immer';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';
import inferErrorMessage from '../../utils/inferErrorMessage';

export function* initSettingsForm({ resourceType, resourceId }) {
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!resource) return; // nothing to do.
  let initScriptId; let
    initFunc;
  if (resource.settingsForm &&
    resource.settingsForm.init) {
    initScriptId = resource.settingsForm.init._scriptId;
    initFunc = resource.settingsForm.init.function
  }
  let metadata = resource.settingsForm && resource.settingsForm.form;

  if (initFunc) {
    // If so, make an API call to initialize the form,

    const path = `/${resourceType}/${resourceId}/settingsForm/init`;

    try {
      metadata = yield call(apiCallWithRetry, {
        path,
        opts: { method: 'POST' },
      });
    } catch (error) {
      yield put(
        actions.customSettings.formError(resourceId, inferErrorMessage(error))
      );

      return;
    }
  }

  // inject the current setting values (found in resource.settings)
  // into the respective field’s defaultValue prop.
  let newFieldMeta = metadata;

  if (resource.settings && metadata && typeof metadata.fieldMap === 'object') {
    newFieldMeta = produce(metadata, draft => {
      Object.keys(draft.fieldMap).forEach(key => {
        const field = draft.fieldMap[key];

        if (!resource.settings[field.name] && field.defaultValue) return;
        field.defaultValue = resource.settings[field.name] || '';
      });
    });
  }

  // Dispatch an action to record the initialized form metadata
  yield put(
    actions.customSettings.formReceived(resourceId, newFieldMeta, initScriptId)
  );
}

export const customSettingsSagas = [
  takeEvery(actionTypes.CUSTOM_SETTINGS.FORM_REQUEST, initSettingsForm),
];
