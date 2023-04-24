import produce from 'immer';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { apiCallWithRetry } from '../index';
import inferErrorMessages from '../../utils/inferErrorMessages';
import { getConnectorCustomSettings, isDisplayRefSupportedType } from '../../utils/httpConnector';

export function* getCustomSettingsMetadata({ metadata, resourceId, resourceType }) {
  const isHttpConnector = yield select(selectors.isHttpConnector, resourceId, resourceType);

  if (!isDisplayRefSupportedType(resourceType) || !isHttpConnector) {
    return metadata;
  }
  const formKey = `${resourceType}-${resourceId}`;

  const formContext = yield select(selectors.formState, formKey);

  return getConnectorCustomSettings(formContext?.fieldMeta, metadata);
}

export function* initSettingsForm({ resourceType, resourceId, sectionId }) {
  let resource = yield select(selectors.getSectionMetadata, resourceType, resourceId, sectionId || 'general');

  if (isDisplayRefSupportedType(resourceType)) {
    // TODO : need to include in the existing above selector
    resource = (yield select(selectors.resourceData, resourceType, resourceId))?.merged;
  }
  if (!resource) return; // nothing to do.

  let initScriptId; let
    initFunc;

  if (resource.settingsForm?.init) {
    initScriptId = resource.settingsForm.init._scriptId;
    initFunc = resource.settingsForm.init.function;
  }
  let metadata = resource.settingsForm?.form;

  if (initFunc) {
    // If so, make an API call to initialize the form,

    let baseRoute = `/${resourceType}/${resourceId}`;

    // sectionId is flowGroupingId...if it is defined then we will call the flowGrouping init
    const isFlowGroupingRoute = sectionId && sectionId !== 'general';

    if (isFlowGroupingRoute) {
      baseRoute += `/flowGroupings/${sectionId}`;
    }
    const path = `${baseRoute}/settingsForm/init`;

    try {
      metadata = yield call(apiCallWithRetry, {
        path,
        opts: { method: 'POST' },
      });
    } catch (error) {
      yield put(
        actions.customSettings.formError(resourceId, inferErrorMessages(error))
      );

      return;
    }
  }

  // inject the current setting values (found in resource.settings)
  // into the respective field’s defaultValue prop.
  let newFieldMeta = yield call(getCustomSettingsMetadata, { metadata, resourceId, resourceType });

  if (resource.settings && newFieldMeta && typeof newFieldMeta.fieldMap === 'object') {
    newFieldMeta = produce(newFieldMeta, draft => {
      Object.keys(draft.fieldMap).forEach(key => {
        const field = draft.fieldMap[key];

        if (!Object.prototype.hasOwnProperty.call(resource.settings, field.name) && field.defaultValue) return;
        field.defaultValue = resource.settings[field.name];
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
