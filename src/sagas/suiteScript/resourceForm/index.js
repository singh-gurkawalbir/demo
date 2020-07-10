import { call, put, select, takeEvery, take, race } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import * as selectors from '../../../reducers';
import {
  sanitizePatchSet,
  defaultPatchSetConverter,
} from '../../../forms/utils';
import factory from '../../../forms/formFactory';
import { commitStagedChanges, requestSuiteScriptMetadata } from '../resources';
import connectionSagas from './connections';
import { isNewId } from '../../../utils/resource';
import { suiteScriptResourceKey } from '../../../utils/suiteScript';
import { apiCallWithRetry } from '../..';
import inferErrorMessage from '../../../utils/inferErrorMessage';

export const SCOPES = {
  META: 'meta',
  VALUE: 'value',
  SCRIPT: 'script',
};
Object.freeze(SCOPES);

export function* createFormValuesPatchSet({
  resourceType,
  resourceId,
  values,
  scope,
  ssLinkedConnectionId,
  integrationId,
}) {
  const { merged: resource } = yield select(selectors.suiteScriptResourceData, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
    integrationId,
    scope,
  });

  if (!resource) return { patchSet: [], finalValues: null }; // nothing to do.

  // This has the fieldMeta
  const formState = yield select(selectors.suiteScriptResourceFormState, {
    ssLinkedConnectionId,
    integrationId,
    resourceType,
    resourceId,
  });
  let finalValues = values;
  let connection;

  if (resource && resource._connectionId) {
    connection = yield select(selectors.suiteScriptResource, {
      resourceType: 'connections',
      id: resource._connectionId,
      ssLinkedConnectionId,
    });
  }

  const { preSave } = factory.getResourceFormAssets({
    resourceType,
    resource,
    connection,
    isNew: formState.isNew,
    ssLinkedConnectionId,
  });

  if (typeof preSave === 'function') {
    // stock preSave handler present...

    finalValues = preSave(values, resource);
  }

  const patchSet = sanitizePatchSet({
    patchSet: defaultPatchSetConverter(finalValues),
    fieldMeta: formState.fieldMeta,
    resource,
  });

  return { patchSet, finalValues };
}

export function* submitFormValues({
  resourceType,
  resourceId,
  values,
  ssLinkedConnectionId,
  integrationId,
}) {
  const formValues = { ...values };
  const { patchSet, finalValues } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values: formValues,
    scope: SCOPES.VALUE,
    ssLinkedConnectionId,
    integrationId,
  });

  if (patchSet && patchSet.length > 0) {
    yield put(
      actions.suiteScript.resource.patchStaged(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
        patchSet,
        SCOPES.VALUE,
      )
    );
  }

  const { skipCommit } = yield select(selectors.suiteScriptResourceFormState, {
    resourceType,
    resourceId,
    ssLinkedConnectionId,
    integrationId,
  });

  // fetch all possible pending patches.
  if (!skipCommit) {
    const { patch } = yield select(
      selectors.stagedResource,
      suiteScriptResourceKey({
        ssLinkedConnectionId,
        resourceType,
        resourceId,
      }),
      SCOPES.VALUE
    );
    // In most cases there would be no other pending staged changes, since most
    // times a patch is followed by an immediate commit.  If however some
    // component has staged some changes, even if the patchSet above is empty,
    // we need to check the store for these un-committed ones and still call
    // the commit saga.

    if (patch && patch.length) {
      const resp = yield call(commitStagedChanges, {
        resourceType,
        id: resourceId,
        scope: SCOPES.VALUE,
        ssLinkedConnectionId,
        integrationId,
      });

      if (resp && (resp.error || resp.conflict)) {
        return yield put(
          actions.suiteScript.resourceForm.submitFailed(
            ssLinkedConnectionId,
            integrationId,
            resourceType,
            resourceId,
          )
        );
      }
    }
  }

  yield put(
    actions.suiteScript.resourceForm.submitComplete(
      ssLinkedConnectionId,
      integrationId,
      resourceType,
      resourceId,
      finalValues,
    )
  );
}

export function* submitResourceForm(params) {
  const { ssLinkedConnectionId, resourceType, resourceId } = params;
  const { cancelSave } = yield race({
    saveForm: call(submitFormValues, params),
    cancelSave: take(
      action =>
        action.type === actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT_ABORTED &&
        action.ssLinkedConnectionId === ssLinkedConnectionId &&
        action.resourceType === resourceType &&
        action.resourceId === resourceId
    ),
  });

  // perform submit cleanup
  if (cancelSave) yield put(actions.resource.clearStaged(resourceId));
}

export function* initFormValues({
  resourceType,
  resourceId,
  isNew,
  skipCommit,
  flowId,
  ssLinkedConnectionId,
  integrationId,
}) {
  const developerMode = yield select(selectors.developerMode);
  let flow;
  const { merged: resource } = yield select(selectors.suiteScriptResourceData, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
    integrationId,
    scope: SCOPES.VALUE,
  });

  // ({ merged: flow } = yield select(selectors.resourceData, 'flows', flowId));

  if (isNewId(resourceId)) {
    resource._id = resourceId;
  }

  if (!resource) return; // nothing to do.
  let assistantData;
  let connection;

  if (resource && resource._connectionId) {
    connection = yield select(selectors.suiteScriptResource, {
      resourceType: 'connections',
      id: resource._connectionId,
      ssLinkedConnectionId,
      integrationId,
    });
  }

  const defaultFormAssets = factory.getResourceFormAssets({
    resourceType,
    resource,
    isNew,
    assistantData,
    connection,
    ssLinkedConnectionId,
  });
  const { customForm } = resource;
  const form =
    customForm && customForm.form
      ? customForm.form
      : defaultFormAssets.fieldMeta;
  //
  const fieldMeta = factory.getFieldsWithDefaults(
    form,
    `ss-${resourceType}`,
    resource,
    { developerMode, flowId }
  );
  let finalFieldMeta = fieldMeta;

  if (typeof defaultFormAssets.init === 'function') {
    // standard form init fn...

    finalFieldMeta = defaultFormAssets.init(fieldMeta, resource, flow);
  }

  yield put(
    actions.suiteScript.resourceForm.initComplete(
      ssLinkedConnectionId,
      resourceType,
      resourceId,
      finalFieldMeta,
      isNew,
      skipCommit,
      flowId,
    )
  );
}

function* suiteScriptSubmitIA({
  ssLinkedConnectionId,
  integrationId,
  sectionId,
  values
}) {
  const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings`;
  // bring sectionId

  const payload = jsonPatch.applyPatch({}, defaultPatchSetConverter(values)).newDocument;
  const camelCasedSectionId = sectionId.charAt(0).toLowerCase() + sectionId.slice(1);
  const opts = {method: 'PUT', body: {data: {[camelCasedSectionId]: payload}}};

  try {
    const resp = yield call(apiCallWithRetry, {path, opts});

    if (!resp?.success) {
      yield put(actions.api.failure(path, 'GET', inferErrorMessage(resp)[0], false));
      return yield put(actions.suiteScript.iaForm.submitFailed(ssLinkedConnectionId, integrationId));
    }
  } catch (error) {
    return yield put(actions.suiteScript.iaForm.submitFailed(ssLinkedConnectionId, integrationId));
  }

  // refetch settings with latest doc
  const isSuccessful = yield call(requestSuiteScriptMetadata, {resourceType: 'settings', ssLinkedConnectionId, integrationId});
  if (!isSuccessful) { return yield put(actions.suiteScript.iaForm.submitFailed(ssLinkedConnectionId, integrationId)); }

  return yield put(actions.suiteScript.iaForm.submitComplete(ssLinkedConnectionId, integrationId));
}

export const resourceFormSagas = [
  takeEvery(actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.SUITESCRIPT.IA_FORM.SUBMIT, suiteScriptSubmitIA),
  takeEvery(actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT, submitResourceForm),
  ...connectionSagas,
];
