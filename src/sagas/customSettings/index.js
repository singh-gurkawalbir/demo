import shortid from 'shortid';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';

export const SCOPES = {
  META: 'meta',
  VALUE: 'value',
  SCRIPT: 'script',
};
Object.freeze(SCOPES);

export function* initSettingsForm({ resourceType, resourceId }) {
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!resource) return; // nothing to do.

  const hasInitHook =
    resource.settingsForm &&
    resource.settingsForm.init &&
    resource.settingsForm.init.function;
  let metadata;

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
      });
    } catch (error) {
      return undefined;
    }
  }
  // TODO: inject the current setting values (found in resource.settings)
  // into the respective field’s defaultValue prop.

  // Dispatch an action to record the initialized form metadata and also a “complete” status.
  yield put(
    actions.customSettings.updateForm(
      resourceId,
      'complete',
      shortid.generate(),
      metadata
    )
  );
}

export function* patchSettingsForm({ resourceId, formMeta }) {
  const patchSet = [];
  const resource = yield select(selectors.resource, 'imports', resourceId);
  let op = 'add';

  if (!resource.settingsForm) {
    patchSet.push({ op: 'add', path: '/settingsForm', value: {} });
  }

  if (resource.settingsForm.form) {
    op = 'replace';
  }

  patchSet.push({ op, path: '/settingsForm/form', value: formMeta });

  yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE));
  yield put(actions.customSettings.initForm('imports', resourceId, formMeta));
  // yield put(actions.resource.commitStaged('imports', resourceId, SCOPES.VALUE));
}

/*
// Maybe the session could be stale...and the pre-submit values might
// be excluded
// we want to init the customForm metadata with a copy of the default metadata
// we would normally send to the DynaForm component.
export function* initCustomForm({ resourceType, resourceId }) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  if (!resource) return; // nothing to do.

  if (resource.customForm && resource.customForm.form) {
    // init the resource custom form only if no current form exists.
    return;
  }

  const { merged: connection } = yield select(
    selectors.resourceData,
    'connections',
    resource._connectionId
  );
  const defaultFormAssets = factory.getResourceFormAssets({
    connection,
    resourceType,
    resource,
  });
  const {
    extractedInitFunctions,
    ...remainingMeta
  } = factory.getFieldsWithoutFuncs(
    defaultFormAssets && defaultFormAssets.fieldMeta,
    resource,
    resourceType
  );
  // Todo: have to write code to merge init functions
  const patchSet = [
    {
      op: 'replace',
      path: '/customForm',
      value: {
        form: remainingMeta,
      },
    },
  ];

  yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.META));
} */

export const customSettingsSagas = [
  takeEvery(actionTypes.CUSTOM_SETTINGS.PATCH, patchSettingsForm),
  takeEvery(actionTypes.CUSTOM_SETTINGS.INIT, initSettingsForm),
];
