import { call, put, select, takeEvery, take, race } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import * as selectors from '../../../reducers';
import {
  sanitizePatchSet,
  defaultPatchSetConverter,
} from '../../../forms/utils';
import factory from '../../../forms/formFactory';
import { commitStagedChanges } from '../resources';
import connectionSagas from './connections';
import { isNewId } from '../../../utils/resource';
import { fileTypeToApplicationTypeMap } from '../../../utils/file';
import { uploadRawData } from '../../uploadFile';
import { UI_FIELD_VALUES } from '../../../utils/constants';
import suiteScriptResourceKey from '../../../utils/suiteScript';

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

  // console.log('patch set', patchSet);

  return { patchSet, finalValues };
}

export function* saveDataLoaderRawData({ resourceId, resourceType, values }) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  // Don't do anything if this is not a simple (data loader) export.
  if (!resource || resource.type !== 'simple') {
    return values;
  }

  // 'rawFile' stage gives back the file content as well as file type
  const { data: rawData } = yield select(
    selectors.getResourceSampleDataWithStatus,
    resourceId,
    'rawFile'
  );

  if (!rawData) return values;
  // Gets application file type to be passed on file upload
  const fileType = fileTypeToApplicationTypeMap[rawData.type];
  // Incase of JSON, we need to stringify the content to pass while uploading
  const fileContent =
    rawData.type === 'json' ? JSON.stringify(rawData.body) : rawData.body;
  const rawDataKey = yield call(uploadRawData, {
    file: fileContent,
    fileName: `file.${rawData.type}`,
    fileType,
  });

  return { ...values, '/rawData': rawDataKey };
}

function* deleteUISpecificValues({ values, resourceId }) {
  const valuesCopy = { ...values };

  UI_FIELD_VALUES.forEach(id => {
    // remove ui field value from the form value payload
    delete valuesCopy[id];
  });
  // remove any staged values tied to it the ui fields
  const predicateForPatchFilter = patch =>
    !UI_FIELD_VALUES.includes(patch.path);

  yield put(actions.resource.removeStage(resourceId, predicateForPatchFilter));

  return valuesCopy;
}

function* patchSkipRetries({ resourceId }) {
  const { patch } = yield select(
    selectors.stagedResource,
    resourceId,
    SCOPES.VALUE
  );
  const { flowId } = yield select(
    selectors.resourceFormState,
    'exports',
    resourceId
  );

  if (flowId) {
    const skipRetries = patch.find(
      p => p.path === '/skipRetries' && p.op === 'replace'
    );
    const flow = yield select(selectors.resource, 'flows', flowId);
    let patchSet;

    if (!flow) {
      patchSet = [
        {
          op: 'replace',
          path: `/pageGenerators`,
          value: [
            {
              skipRetries: skipRetries ? !!skipRetries.value : false,
              _exportId: resourceId,
            },
          ],
        },
      ];
    } else {
      const index =
        flow.pageGenerators &&
        flow.pageGenerators.findIndex(pg => pg._exportId === resourceId);

      if (!index || index === -1) return;
      patchSet = [
        {
          op: 'replace',
          path: `/pageGenerators/${index}/skipRetries`,
          value: skipRetries ? !!skipRetries.value : false,
        },
      ];
    }

    yield put(actions.resource.patchStaged(flowId, patchSet, SCOPES.VALUE));

    if (!isNewId(flowId))
      yield put(actions.resource.commitStaged('flows', flowId, SCOPES.VALUE));
  }
}

export function* submitFormValues({
  resourceType,
  resourceId,
  values,
  match,
  isGenerate,
  ssLinkedConnectionId,
  integrationId,
}) {
  let formValues = { ...values };

  // formValues = yield call(deleteUISpecificValues, {
  //   values: formValues,
  //   resourceId,
  // });

  if (resourceType === 'exports') {
    delete formValues['/rawData'];

    // We have a special case for exports that define a "Data loader" flow.
    // We need to store the raw data s3 key so that when a user 'runs' the flow,
    // we can post the runKey to the api. For file connectors, we do not use rawData
    // so this is a safe export field to use for this sub-type of export.
    formValues = yield call(saveDataLoaderRawData, {
      resourceType,
      resourceId,
      values: formValues,
    });
  }

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
        resourceId,
        patchSet,
        SCOPES.VALUE,
        ssLinkedConnectionId,
        integrationId,
        resourceType
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
    if (resourceType === 'exports') {
      yield call(patchSkipRetries, { resourceId });
    }

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
        isGenerate,
        ssLinkedConnectionId,
        integrationId,
      });

      if (resp && (resp.error || resp.conflict)) {
        return yield put(
          actions.suiteScript.resourceForm.submitFailed(
            resourceType,
            resourceId,
            ssLinkedConnectionId,
            integrationId
          )
        );
      }
    }
  }

  yield put(
    actions.suiteScript.resourceForm.submitComplete(
      resourceType,
      resourceId,
      finalValues,
      ssLinkedConnectionId,
      integrationId
    )
  );
}

export function* submitResourceForm(params) {
  const { resourceType, resourceId } = params;
  const { cancelSave } = yield race({
    saveForm: call(submitFormValues, params),
    cancelSave: take(
      action =>
        action.type === actionTypes.RESOURCE_FORM.SUBMIT_ABORTED &&
        action.resourceType === resourceType &&
        action.resourceId === resourceId
    ),
  });

  // perform submit cleanup
  if (cancelSave) yield put(actions.resource.clearStaged(resourceId));
}

export function* saveAndContinueResourceForm(params) {
  const { resourceId } = params;

  yield call(submitResourceForm, params);
  const formState = yield select(
    selectors.resourceFormState,
    'connections',
    resourceId
  );
  let id = resourceId;

  if (isNewId(resourceId)) {
    id = yield select(selectors.createdResourceId, resourceId);
  }

  if (formState.submitComplete) {
    const path = `/connection/${id}/generateoauth2token`;

    try {
      const response = yield call(apiCallWithRetry, {
        path,
        opts: {
          method: 'GET',
        },
      });

      if (response && response.errors) {
        return yield put(
          actions.api.failure(
            path,
            'GET',
            JSON.stringify(response.errors),
            false
          )
        );
      }

      yield call(apiCallWithRetry, {
        path: `/connections/${id}/ping`,
        hidden: true,
      });
    } catch (error) {
      return { error };
    }
  }
}

export function* saveResourceWithDefinitionID({ formValues, definitionId }) {
  const { resourceId, resourceType, values } = formValues;
  const newValues = { ...values };

  delete newValues['/file/filedefinition/rules'];
  newValues['/file/type'] = 'filedefinition';
  newValues['/file/fileDefinition/_fileDefinitionId'] = definitionId;
  yield put(actions.resourceForm.submit(resourceType, resourceId, newValues));
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

  console.log(`ss initFormValues developerMode `, developerMode);
  console.log(`ss initFormValues ssLinkedConnectionId `, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
    integrationId,
    scope: SCOPES.VALUE,
  });
  let flow;
  const { merged: resource } = yield select(selectors.suiteScriptResourceData, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
    integrationId,
    scope: SCOPES.VALUE,
  });

  console.log(`ss initFormValues resource `, resource);
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

  // console.log('finalFieldMeta', finalFieldMeta);
  yield put(
    actions.suiteScript.resourceForm.initComplete(
      resourceType,
      resourceId,
      finalFieldMeta,
      isNew,
      skipCommit,
      flowId,
      ssLinkedConnectionId
    )
  );
}

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
}

export const resourceFormSagas = [
  takeEvery(actionTypes.RESOURCE.INIT_CUSTOM_FORM, initCustomForm),
  takeEvery(actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT, submitResourceForm),
  takeEvery(
    actionTypes.RESOURCE_FORM.SAVE_AND_CONTINUE,
    saveAndContinueResourceForm
  ),
  ...connectionSagas,
];
