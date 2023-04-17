import produce from 'immer';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { apiCallWithRetry } from '../index';
import inferErrorMessages from '../../utils/inferErrorMessages';
import { getFieldIdsInLayoutOrder } from '../../utils/form';
import customCloneDeep from '../../utils/customCloneDeep';

export function removeFieldFromLayout(layout, fieldId) {
  if (!layout) return;
  if (layout.fields?.length) {
    if (layout.fields.includes(fieldId)) {
      const fieldIndex = layout.fields.indexOf(fieldId);

      layout.fields.splice(fieldIndex, 1);
    }
  }
  if (layout.containers?.length) {
    layout.containers.forEach(container => removeFieldFromLayout(container, fieldId));
  }
}

export function layoutHasField(layout, fieldId) {
  if (!layout) return false;
  if (layout.containers?.length) {
    return layout.containers.some(container => layoutHasField(container, fieldId));
  }
  if (layout.fields?.length) {
    return layout.fields.includes(fieldId);
  }
}

export function isValidDisplayAfterRef(refId, refMetadata) {
  const { layout, fieldMap } = refMetadata;

  if (!layout) {
    return !!fieldMap[refId];
  }

  return layoutHasField(layout, refId);
}

export function* getCustomSettingsMetadata({ metadata, resourceId, resourceType }) {
  // this is for http connector
  // fetch formkey
  const formKey = `${resourceType}-${resourceId}`;
  // fetch form fields list of fields
  const formContext = yield select(selectors.formState, formKey);

  // if the metadata has displayAfter and ref is valid , remove from cs fields

  const { fieldMap, layout } = metadata || {};
  const fieldsList = layout ? getFieldIdsInLayoutOrder(layout) : Object.keys(fieldMap);

  const validDisplayAfterFieldIds = fieldsList.filter(fieldId => {
    // cs fieldId
    // fetch displayAfter
    const field = fieldMap[fieldId];

    if (!field.displayAfter) return false;

    const index = field.displayAfter?.indexOf('.');
    const displayAfterRef = field.displayAfter?.substr(index + 1);

    return isValidDisplayAfterRef(displayAfterRef, formContext.fieldMeta);
  });

  const updatedFieldMetadata = customCloneDeep(metadata);

  validDisplayAfterFieldIds.forEach(fieldId => {
    // remove field from form metadata

    if (!updatedFieldMetadata.layout) {
      delete updatedFieldMetadata.fieldMap[fieldId];
    } else {
      removeFieldFromLayout(updatedFieldMetadata.layout, fieldId);
    }
  });

  return updatedFieldMetadata;
}

export function* initSettingsForm({ resourceType, resourceId, sectionId }) {
  const resource = yield select(selectors.getSectionMetadata, resourceType, resourceId, sectionId || 'general');

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

  if (resource.settings && metadata && typeof metadata.fieldMap === 'object') {
    newFieldMeta = produce(metadata, draft => {
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
