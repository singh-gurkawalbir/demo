import { call, put, select, takeEvery, take, race } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import { isEmpty } from 'lodash';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { selectors } from '../../../reducers';
import {
  sanitizePatchSet,
  defaultPatchSetConverter,
  handleIsRemoveLogic,
} from '../../../forms/formFactory/utils';
import { commitStagedChangesWrapper, requestSuiteScriptMetadata } from '../resources';
import connectionSagas from './connections';
import { isNewId } from '../../../utils/resource';
import { suiteScriptResourceKey } from '../../../utils/suiteScript';
import { apiCallWithRetry } from '../..';
import inferErrorMessages from '../../../utils/inferErrorMessages';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';
import getFieldsWithDefaults from '../../../forms/formFactory/getFieldsWithDefaults';
import { getAsyncKey } from '../../../utils/saveAndCloseButtons';

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
  ssLinkedConnectionId,
  integrationId,
}) {
  const { merged: resource } = yield select(selectors.suiteScriptResourceData, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
    integrationId,
  });

  if (!resource) return { patchSet: [], finalValues: null }; // nothing to do.

  // This has the fieldMeta
  const formState = yield select(selectors.suiteScriptResourceFormState, {
    ssLinkedConnectionId,
    integrationId,
    resourceType,
    resourceId,
  });
  const formData = yield select(
    selectors.formContext,
    resourceType,
    resourceId
  );
  let finalValues = values;
  let connection;

  if (resource && resource._connectionId) {
    connection = yield select(selectors.suiteScriptResource, {
      resourceType: 'connections',
      id: resource._connectionId,
      ssLinkedConnectionId,
    });
  }

  const { preSave } = getResourceFormAssets({
    resourceType,
    resource,
    connection,
    isNew: formState.isNew,
    ssLinkedConnectionId,
  });

  if (typeof preSave === 'function') {
    // stock preSave handler present...

    finalValues = preSave(values, resource);
    finalValues = handleIsRemoveLogic(formData.fields, finalValues);
  }

  const patchSet = sanitizePatchSet({
    patchSet: defaultPatchSetConverter(finalValues),
    fieldMeta: formState.fieldMeta,
    resource,
  });

  return { patchSet, finalValues };
}

function* submitFormValues({
  resourceType,
  resourceId,
  values,
  ssLinkedConnectionId,
  integrationId,
}) {
  const formValues = { ...values };
  let patchSet;
  let finalValues;

  try {
    // getResourceFrom assets can throw an error when it cannot pick up a matching form
    ({ patchSet, finalValues } = yield call(createFormValuesPatchSet, {
      resourceType,
      resourceId,
      values: formValues,
      ssLinkedConnectionId,
      integrationId,
    }));
  } catch (e) {
    return yield put(
      actions.resourceForm.submitFailed(resourceType, resourceId)
    );
  }
  if (patchSet && patchSet.length > 0) {
    yield put(
      actions.suiteScript.resource.patchStaged(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
        patchSet,
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
    const { patch } = (yield select(
      selectors.stagedResource,
      suiteScriptResourceKey({
        ssLinkedConnectionId,
        resourceType,
        resourceId,
      }),
    )) || {};
    // In most cases there would be no other pending staged changes, since most
    // times a patch is followed by an immediate commit.  If however some
    // component has staged some changes, even if the patchSet above is empty,
    // we need to check the store for these un-committed ones and still call
    // the commit saga.

    if (patch && patch.length) {
      const resp = yield call(commitStagedChangesWrapper, {
        resourceType,
        id: resourceId,
        ssLinkedConnectionId,
        integrationId,
        asyncKey: getAsyncKey(resourceType, resourceId),
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
  });

  // ({ merged: flow } = yield select(selectors.resourceData, 'flows', flowId));

  if (isNewId(resourceId)) {
    resource._id = resourceId;
  }

  // if resource is empty.... it could be a resource looked up with invalid Id
  if (!resource || isEmpty(resource)) {
    yield put(
      actions.suiteScript.resourceForm.initFailed(ssLinkedConnectionId, resourceType, resourceId));

    return; // nothing to do.
  }

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

  try {
    const defaultFormAssets = getResourceFormAssets({
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
    const fieldMeta = getFieldsWithDefaults(
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
  } catch (e) {
    yield put(actions.suiteScript.resourceForm.initFailed(ssLinkedConnectionId, resourceType, resourceId));
  }
}

function* suiteScriptSubmitIA({
  ssLinkedConnectionId,
  integrationId,
  sectionId,
  values,
}) {
  // get IntegrationAppName
  const integration = yield select(selectors.suiteScriptResource, {
    resourceType: 'integrations',
    id: integrationId,
    ssLinkedConnectionId,
  });

  const queryParam = integration?.urlName === 'svbns' ? `?isSVBConnector=${integration?.urlName === 'svbns'}` : '';
  const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/settings${queryParam}`;
  // bring sectionId

  const payload = jsonPatch.applyPatch({}, defaultPatchSetConverter(values)).newDocument;
  const camelCasedSectionId = sectionId.charAt(0).toLowerCase() + sectionId.slice(1);
  const opts = {method: 'PUT', body: {data: {[camelCasedSectionId]: payload}}};

  try {
    const resp = yield call(apiCallWithRetry, {path, opts});

    if (!resp?.success) {
      yield put(actions.api.failure(path, 'GET', inferErrorMessages(resp)[0], false));

      return yield put(actions.suiteScript.iaForm.submitFailed(ssLinkedConnectionId, integrationId));
    }
  } catch (error) {
    return yield put(actions.suiteScript.iaForm.submitFailed(ssLinkedConnectionId, integrationId));
  }

  // refetch settings with latest doc
  const isSuccessful = yield call(requestSuiteScriptMetadata, {resourceType: 'settings', ssLinkedConnectionId, integrationId});

  if (!isSuccessful) { return yield put(actions.suiteScript.iaForm.submitFailed(ssLinkedConnectionId, integrationId)); }

  yield put(actions.suiteScript.iaForm.submitComplete(ssLinkedConnectionId, integrationId));
  // refresh flows after saving Suitescript IA settings
  const flowpath = `suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/flows`;

  yield put(actions.resource.requestCollection(flowpath));
}

export const resourceFormSagas = [
  takeEvery(actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.SUITESCRIPT.IA_FORM.SUBMIT, suiteScriptSubmitIA),
  takeEvery(actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT, submitResourceForm),
  ...connectionSagas,
];
