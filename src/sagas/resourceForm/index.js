import { call, put, select, takeEvery, take, race } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import * as selectors from '../../reducers';
import {
  sanitizePatchSet,
  defaultPatchSetConverter,
  getPatchPathForCustomForms,
  getFieldWithReferenceById,
} from '../../forms/utils';
import factory from '../../forms/formFactory';
import processorLogic from '../../reducers/session/editors/processorLogic/javascript';
import { getResource, commitStagedChanges } from '../resources';
import connectionSagas, { createPayload } from '../resourceForm/connections';
import { requestAssistantMetadata } from '../resources/meta';
import { isNewId } from '../../utils/resource';
import { fileTypeToApplicationTypeMap } from '../../utils/file';
import { uploadRawData } from '../uploadFile';
import { UI_FIELD_VALUES } from '../../utils/constants';

export const SCOPES = {
  META: 'meta',
  VALUE: 'value',
  SCRIPT: 'script',
};
Object.freeze(SCOPES);

export function* patchFormField({
  resourceType,
  resourceId,
  fieldId,
  value,
  op = 'replace',
  offset = 0,
}) {
  const { merged } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  if (!merged) return; // nothing to do.

  const meta = merged.customForm && merged.customForm.form;

  if (!meta) return; // nothing to do

  const path = getPatchPathForCustomForms(meta, fieldId, offset);
  // we try to get the corresponding fieldReference for the field so that we can patch fieldReference
  const { fieldReference } = getFieldWithReferenceById({
    meta,
    id: fieldId,
  });

  if (!path) return; // nothing to do.
  let patchFieldReference = [];
  let patchLayout = [];

  // patch the entire value into the fieldReference
  if (op === 'add') {
    // when adding a new field reference use field Id to generate the name of the field reference
    patchFieldReference = [
      {
        op,
        path: `/customForm/form/fieldMap/${value && value.id}`,
        value,
      },
    ];
    patchLayout = [{ op, path, value: value && value.id }];
  } else {
    patchFieldReference = [
      { op, path: `/customForm/form/fieldMap/${fieldReference}`, value },
    ];
  }

  // patch layout field with the reference
  const patchSet = [...patchFieldReference, ...patchLayout];

  // Apply the new patch to the session
  yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.META));
}

export function* runHook({ hook, data }) {
  const { entryFunction, scriptId } = hook;
  const { merged } = yield select(selectors.resourceData, 'scripts', scriptId);

  // okay extracting script from the session
  // if it isn't there, make a call to receive the resource
  // Aren't we loading all the scripts?
  if (!merged) return; // nothing to do.

  let code = merged.content;

  if (code === undefined) {
    const origin = yield call(getResource, {
      resourceType: 'scripts',
      id: scriptId,
      message: `Loading ${merged.name} script content.`,
    });

    yield put(actions.resource.received('scripts', origin));
    code = origin.content;
  }

  const path = `/processors/javascript`;
  const opts = {
    method: 'post',
    body: processorLogic.requestBody({
      data,
      code,
      entryFunction,
    }),
  };
  const results = yield call(apiCallWithRetry, { path, opts });

  return yield results.data;
}

export function* createFormValuesPatchSet({
  resourceType,
  resourceId,
  values,
  scope,
}) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    scope
  );

  if (!resource) return { patchSet: [], finalValues: null }; // nothing to do.

  // This has the fieldMeta
  const formState = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );
  const { customForm } = resource;
  let finalValues = values;

  if (customForm && customForm.preSave) {
    // pre-save-resource
    // this resource has an embedded custom form.

    finalValues = yield call(runHook, {
      hook: customForm.preSave,
      data: values,
    });
  } else {
    let connection;

    if (resource && resource._connectionId) {
      connection = yield select(
        selectors.resource,
        'connections',
        resource._connectionId
      );
    }

    const { preSave } = factory.getResourceFormAssets({
      resourceType,
      resource,
      connection,
      isNew: formState.isNew,
    });

    if (typeof preSave === 'function') {
      // stock preSave handler present...

      finalValues = preSave(values, resource);
    }
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

const removeParentFormPatch = [{ op: 'remove', path: '/useParentForm' }];
const removeAssistantPatch = [{ op: 'remove', path: '/assistant' }];

function* deleteFormViewAssistantValue({ resourceType, resourceId }) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );

  if (resource && resource.useParentForm)
    yield put(
      actions.resource.patchStaged(
        resourceId,
        removeAssistantPatch,
        SCOPES.VALUE
      )
    );
  yield put(
    actions.resource.patchStaged(
      resourceId,
      removeParentFormPatch,
      SCOPES.VALUE
    )
  );
}

export function* newIAFrameWorkPayload({ resourceId }) {
  const { patch: allPatches } = yield select(
    selectors.stagedResource,
    resourceId
  );

  if (
    allPatches &&
    allPatches.find(item => item.path === '/newIA') &&
    allPatches.find(item => item.path === '/newIA').value
  ) {
    return {
      id: (allPatches.find(item => item.path === '/_integrationId') || {})
        .value,
      connectionType: (allPatches.find(item => item.path === '/type') || {})
        .value,
      assistant: (allPatches.find(item => item.path === '/assistant') || {})
        .value,
    };
  }

  return null;
}

export function* submitFormValues({
  resourceType,
  resourceId,
  values,
  match,
  isGenerate,
}) {
  let formValues = { ...values };
  const isNewIA = yield call(newIAFrameWorkPayload, {
    resourceId,
  });

  if (isNewIA) {
    // UI will not create a connection in New IA installer. Connection payload will be given to backend.
    // Backend will create a connection and connection id will get back in reponse.
    const connectionPayload = yield call(createPayload, {
      values,
      resourceType: 'connections',
      resourceId,
    });

    return yield put(
      actions.resourceForm.submitComplete(
        resourceType,
        resourceId,
        connectionPayload
      )
    );
  }

  yield call(deleteFormViewAssistantValue, {
    resourceType,
    resourceId,
  });

  formValues = yield call(deleteUISpecificValues, {
    values: formValues,
    resourceId,
  });

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
  });

  if (patchSet && patchSet.length > 0) {
    yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE));
  }

  const { skipCommit } = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );

  if (skipCommit) {
    const resourceIdPatch = patchSet.find(
      p => p.op === 'replace' && p.path === '/resourceId'
    );

    if (resourceIdPatch && resourceIdPatch.value) {
      yield put(actions.resource.created(resourceIdPatch.value, resourceId));
    }

    return yield put(
      actions.resourceForm.submitComplete(resourceType, resourceId, finalValues)
    );
  }

  const { patch } = yield select(
    selectors.stagedResource,
    resourceId,
    SCOPES.VALUE
  );
  // In most cases there would be no other pending staged changes, since most
  // times a patch is followed by an immediate commit.  If however some
  // component has staged some changes, even if the patchSet above is empty,
  // we need to check the store for these un-committed ones and still call
  // the commit saga.
  let type = resourceType;

  if (resourceType === 'connectorLicenses') {
    // construct url for licenses
    const connectorUrlStr = '/connectors/';
    const startIndex =
      match.url.indexOf(connectorUrlStr) + connectorUrlStr.length;

    if (startIndex !== -1) {
      const connectorId = match.url.substring(
        startIndex,
        match.url.indexOf('/', startIndex)
      );

      type = `connectors/${connectorId}/licenses`;
    }
  }

  const integrationIdPatch =
    patch && patch.find(p => p.op === 'add' && p.path === '/_integrationId');

  if (
    integrationIdPatch &&
    integrationIdPatch.value &&
    (resourceType === 'accesstokens' || resourceType === 'connections')
  ) {
    type = `integrations/${integrationIdPatch.value}/${resourceType}`;
  }

  if (patch && patch.length) {
    const resp = yield call(commitStagedChanges, {
      resourceType: type,
      id: resourceId,
      scope: SCOPES.VALUE,
      // is Generate ghost code
      isGenerate,
    });

    if (resp && (resp.error || resp.conflict)) {
      return yield put(
        actions.resourceForm.submitFailed(resourceType, resourceId)
      );
    }
  }

  yield put(
    actions.resourceForm.submitComplete(resourceType, resourceId, finalValues)
  );
}

export function* getFlowUpdatePatchesOnPGorPPSave(
  resourceType,
  tempResourceId,
  flowId
) {
  if (
    !['exports', 'imports'].includes(resourceType) ||
    !flowId ||
    !isNewId(tempResourceId)
  )
    return [];

  // is pageGenerator or pageProcessor
  const createdId = yield select(selectors.createdResourceId, tempResourceId);
  const createdResource = yield select(
    selectors.resource,
    resourceType,
    createdId
  );
  const { merged: flowDoc } = yield select(
    selectors.resourceData,
    'flows',
    flowId
  );
  const addIndexPP =
    (flowDoc && flowDoc.pageProcessors && flowDoc.pageProcessors.length) || 0;
  const addIndexPG =
    (flowDoc && flowDoc.pageGenerators && flowDoc.pageGenerators.length) || 0;
  let flowPatches = [];

  if (resourceType === 'exports') {
    if (createdResource.isLookup) {
      flowPatches = [
        {
          op: 'add',
          path: `/pageProcessors/${addIndexPP}`,
          value: { type: 'export', _exportId: createdId },
        },
      ];
    } else {
      // only page generators
      // temp patch of application with value 'dataLoader' maybe present if its data loader...
      // perform replace in that case
      // eslint-disable-next-line no-lonely-if
      if (
        flowDoc &&
        flowDoc.pageGenerators &&
        flowDoc.pageGenerators[0] &&
        flowDoc.pageGenerators[0].application &&
        flowDoc.pageGenerators[0].application === 'dataLoader'
      ) {
        flowPatches = [
          {
            op: 'replace',
            path: `/pageGenerators/0`,
            value: { _exportId: createdId },
          },
        ];
      } else {
        flowPatches = [
          {
            op: 'add',
            path: `/pageGenerators/${addIndexPG}`,
            value: { _exportId: createdId },
          },
        ];
      }
    }
  } else {
    // imports resourcetype

    flowPatches = [
      {
        op: 'add',
        path: `/pageProcessors/${addIndexPP}`,
        value: { type: 'import', _importId: createdId },
      },
    ];
  }

  // only one flow patch so

  let missingPatches = [];

  if (flowPatches[0].path.includes('pageGenerators') && !flowDoc.pageGenerators)
    missingPatches = [
      {
        op: 'add',
        path: `/pageGenerators`,
        value: [],
      },
    ];
  else if (
    flowPatches[0].path.includes('pageProcessors') &&
    !flowDoc.pageProcessors
  )
    missingPatches = [
      {
        op: 'add',
        path: `/pageProcessors`,
        value: [],
      },
    ];

  return [...missingPatches, ...flowPatches];
}

export function* skipRetriesPatches(
  resourceType,
  flowId,
  resourceId,
  skipRetries
) {
  if (resourceType !== 'exports') return null;
  const createdId = yield select(selectors.createdResourceId, resourceId);
  const createdResource = yield select(
    selectors.resource,
    resourceType,
    createdId || resourceId
  );
  // if the export is a lookup then no patches should be applied

  if (createdResource.isLookup) return null;

  const { merged: flow } = yield select(
    selectors.resourceData,
    'flows',
    flowId
  );
  const index =
    flow.pageGenerators &&
    flow.pageGenerators.findIndex(
      pg => pg._exportId === (createdId || resourceId)
    );

  if (index === -1) {
    return null;
  }

  const opDetermination =
    flow.pageGenerators[index].skipRetries === undefined ? 'add' : 'replace';

  return [
    {
      op: opDetermination,
      path: `/pageGenerators/${index}/skipRetries`,
      value: skipRetries,
    },
  ];
}

function* getResourceType({ resourceType, resourceId }) {
  let updatedResourceType;

  if (resourceType === 'pageGenerator') updatedResourceType = 'exports';
  else if (resourceType === 'pageProcessor') {
    const createdId = yield select(selectors.createdResourceId, resourceId);
    const importResource = yield select(
      selectors.resource,
      'imports',
      createdId
    );

    // it should be either an export or an import
    if (importResource) updatedResourceType = 'imports';
    else updatedResourceType = 'exports';
  } else updatedResourceType = resourceType;

  return updatedResourceType;
}

function* updateFlowDoc({ resourceType, flowId, resourceId, resourceValues }) {
  const updatedResourceType = yield call(getResourceType, {
    resourceType,
    resourceId,
  });
  const flowPatches = yield call(
    getFlowUpdatePatchesOnPGorPPSave,
    updatedResourceType,
    resourceId,
    flowId
  );

  yield put(actions.resource.patchStaged(flowId, flowPatches, SCOPES.VALUE));
  // TODO: is skipRetries a ui field value should this be deleted
  // So that it does not get applied at the root of flow doc
  const skipRetries = resourceValues['/skipRetries'];

  if (skipRetries !== undefined) {
    const skipRetryPatches = yield call(
      skipRetriesPatches,
      updatedResourceType,
      flowId,
      resourceId,
      !!skipRetries
    );

    yield put(
      actions.resource.patchStaged(flowId, skipRetryPatches, SCOPES.VALUE)
    );
  }

  yield call(commitStagedChanges, {
    resourceType: 'flows',
    id: flowId,
    scope: SCOPES.VALUE,
  });

  yield put(actions.flowData.updateFlow(flowId));
}

export function* submitResourceForm(params) {
  const { resourceType, resourceId, flowId, values } = params;
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
  if (cancelSave) return yield put(actions.resource.clearStaged(resourceId));

  const { submitFailed, skipCommit } = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );

  // if it fails return
  if (submitFailed || !flowId) return;

  // when there is nothing to commit there is no reason to update the flow doc..hence we return
  // however there is a usecase where we create a resource from an existing resource and that
  // is a one step process with skipCommit being true...we have to update the flow doc in that case
  if (skipCommit) {
    if (['pageGenerator', 'pageProcessor'].includes(resourceType)) {
      const { exportId, importId } = values;

      // if exportId or importId values are present it indicated its created from an existing import or export
      // in that case we allow a flow doc update
      // if its not created from an existing export or from an existing import
      if (!exportId && !importId) return;
    } else return;
  }

  yield call(updateFlowDoc, {
    resourceType,
    resourceId,
    flowId,
    resourceValues: values,
  });
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

export function* saveResourceWithDefinitionID({
  formValues,
  definitionId,
  flowId,
}) {
  const { resourceId, resourceType, values } = formValues;
  const newValues = { ...values };

  delete newValues['/file/filedefinition/rules'];
  newValues['/file/type'] = 'filedefinition';
  newValues['/file/fileDefinition/_fileDefinitionId'] = definitionId;
  yield put(
    actions.resourceForm.submit(
      resourceType,
      resourceId,
      newValues,
      null,
      false,
      false,
      flowId
    )
  );
}

export function* initFormValues({
  resourceType,
  resourceId,
  isNew,
  skipCommit,
  flowId,
}) {
  const developerMode = yield select(selectors.developerMode);
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );
  const { merged: flow } = yield select(
    selectors.resourceData,
    'flows',
    flowId
  );

  if (isNewId(resourceId)) {
    resource._id = resourceId;
  }

  if (!resource) return; // nothing to do.
  let assistantData;

  if (['exports', 'imports'].includes(resourceType) && resource.assistant) {
    if (!resource.assistantMetadata) {
      yield put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'add', path: '/assistantMetadata', value: {} }],
          SCOPES.VALUE
        )
      );
    }

    assistantData = yield select(selectors.assistantData, {
      adaptorType: ['RESTExport', 'RESTImport'].includes(resource.adaptorType)
        ? 'rest'
        : 'http',
      assistant: resource.assistant,
    });

    if (!assistantData) {
      assistantData = yield call(requestAssistantMetadata, {
        adaptorType: ['RESTExport', 'RESTImport'].includes(resource.adaptorType)
          ? 'rest'
          : 'http',
        assistant: resource.assistant,
      });
    }
  }

  let connection;

  if (resource && resource._connectionId) {
    connection = yield select(
      selectors.resource,
      'connections',
      resource._connectionId
    );
  }

  const defaultFormAssets = factory.getResourceFormAssets({
    resourceType,
    resource,
    isNew,
    assistantData,
    connection,
  });
  const { customForm } = resource;
  const form =
    customForm && customForm.form
      ? customForm.form
      : defaultFormAssets.fieldMeta;
  //
  const fieldMeta = factory.getFieldsWithDefaults(
    form,
    resourceType,
    resource,
    { developerMode, flowId }
  );
  let finalFieldMeta = fieldMeta;

  if (customForm && customForm.init) {
    // pre-save-resource
    // this resource has an embedded custom form.
    // TODO: if there is an error here we should show that message
    // in the UI.....and point them to the link to edit the
    // script or maybe prevent them from saving the script
    finalFieldMeta = yield call(runHook, {
      hook: customForm.init,
      data: fieldMeta,
    });
  } else if (typeof defaultFormAssets.init === 'function') {
    // standard form init fn...

    finalFieldMeta = defaultFormAssets.init(fieldMeta, resource, flow);
  }

  // console.log('finalFieldMeta', finalFieldMeta);
  yield put(
    actions.resourceForm.initComplete(
      resourceType,
      resourceId,
      finalFieldMeta,
      isNew,
      skipCommit,
      flowId
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
  takeEvery(actionTypes.RESOURCE.PATCH_FORM_FIELD, patchFormField),
  takeEvery(actionTypes.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.RESOURCE_FORM.SUBMIT, submitResourceForm),
  takeEvery(
    actionTypes.RESOURCE_FORM.SAVE_AND_CONTINUE,
    saveAndContinueResourceForm
  ),
  ...connectionSagas,
];
