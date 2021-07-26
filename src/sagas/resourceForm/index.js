import { call, put, select, takeEvery, take, race } from 'redux-saga/effects';
import { isEmpty } from 'lodash';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import {
  sanitizePatchSet,
  defaultPatchSetConverter,
} from '../../forms/formFactory/utils';
import { commitStagedChanges, commitStagedChangesWrapper } from '../resources';
import connectionSagas, { createPayload } from './connections';
import { requestAssistantMetadata } from '../resources/meta';
import { isNewId } from '../../utils/resource';
import { fileTypeToApplicationTypeMap } from '../../utils/file';
import { uploadRawData } from '../uploadFile';
import { UI_FIELD_VALUES, FORM_SAVE_STATUS, emptyObject} from '../../utils/constants';
import { isIntegrationApp, isFlowUpdatedWithPgOrPP } from '../../utils/flows';
import getResourceFormAssets from '../../forms/formFactory/getResourceFromAssets';
import getFieldsWithDefaults from '../../forms/formFactory/getFieldsWithDefaults';
import { getAsyncKey } from '../../utils/saveAndCloseButtons';

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
  let finalValues = values;

  let connection;

  if (resource?._connectionId) {
    connection = yield select(
      selectors.resource,
      'connections',
      resource._connectionId
    );
  }

  const { preSave } = getResourceFormAssets({
    resourceType,
    resource,
    connection,
    isNew: formState.isNew,
  });

  if (typeof preSave === 'function') {
    const iClients = yield select(selectors.resourceList, {
      type: 'iClients',
    });

    // stock preSave handler present...
    finalValues = preSave(values, resource, {iClients, connection});
  }

  const patchSet = sanitizePatchSet({
    patchSet: defaultPatchSetConverter(finalValues),
    fieldMeta: formState.fieldMeta,
    resource,
  });

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

export function* deleteUISpecificValues({ values, resourceId }) {
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

export function* deleteFormViewAssistantValue({ resourceType, resourceId }) {
  const removeParentFormPatch = [{ op: 'remove', path: '/useParentForm' }];
  const removeAssistantPatch = [{ op: 'remove', path: '/assistant' }];

  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );

  if (resource?.useParentForm) {
    yield put(
      actions.resource.patchStaged(
        resourceId,
        removeAssistantPatch,
        SCOPES.VALUE
      )
    );
  }
  yield put(
    actions.resource.patchStaged(
      resourceId,
      removeParentFormPatch,
      SCOPES.VALUE
    )
  );
}

export function* newIAFrameWorkPayload({ resourceId }) {
  const { patch: allPatches } = (yield select(
    selectors.stagedResource,
    resourceId
  )) || {};
  // TO DO: Ashok Needs to refactor this code

  if (
    allPatches &&
    allPatches.find(item => item.path === '/newIA') &&
    allPatches.find(item => item.path === '/newIA').value
  ) {
    return {
      id: (allPatches.find(item => item.path === '/_integrationId') || {})
        .value,
      connectionType: (allPatches.find(item => item.path === '/type' && item.op === 'replace') || (allPatches.find(item => item.path === '/type')) || {})
        .value,
      assistant: (allPatches.find(item => item.path === '/assistant' && item.op === 'replace') || (allPatches.find(item => item.path === '/assistant')) || {})
        .value,
      installStepConnection: (allPatches.find(item => item.path === '/installStepConnection') || {})
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
}) {
  let formValues = { ...values };
  const isNewIAPayload = yield call(newIAFrameWorkPayload, {
    resourceId,
  });

  if (isNewIAPayload?.installStepConnection) {
    // UI will not create a connection in New IA installer. Connection payload will be given to backend.
    // Backend will create a connection and connection id will get back in response.
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
  let patchSet;
  let finalValues;

  try {
    // getResourceFrom assets can throw an error when it cannot pick up a matching form
    ({ patchSet, finalValues } = yield call(createFormValuesPatchSet, {
      resourceType,
      resourceId,
      values: formValues,
      scope: SCOPES.VALUE,
    }));
  } catch (e) {
    return yield put(actions.resourceForm.submitFailed(resourceType, resourceId));
  }
  if (patchSet && patchSet.length > 0) {
    yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE));
  }

  const { skipCommit } = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );

  if (skipCommit) {
    const resourceIdPatch = patchSet?.find(
      p => p.op === 'replace' && p.path === '/resourceId'
    );

    if (resourceIdPatch?.value) {
      yield put(actions.resource.created(resourceIdPatch.value, resourceId));
    }

    return yield put(
      actions.resourceForm.submitComplete(resourceType, resourceId, finalValues)
    );
  }

  const { patch } = (yield select(
    selectors.stagedResource,
    resourceId,
    SCOPES.VALUE
  )) || {};
  // In most cases there would be no other pending staged changes, since most
  // times a patch is followed by an immediate commit.  If however some
  // component has staged some changes, even if the patchSet above is empty,
  // we need to check the store for these un-committed ones and still call
  // the commit saga.
  let type = resourceType;

  if (resourceType === 'connectorLicenses') {
    // construct url for licenses
    const connectorUrlStr = match.url.indexOf('/connectors/edit/connectors/') >= 0 ? '/connectors/edit/connectors/' : '/connectors/';
    const startIndex = match.url.indexOf(connectorUrlStr) + connectorUrlStr.length;

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

  if (patch?.length) {
    // no context = {flowId} sent on purpose for the resource forms
    // on resource submit complete updateFlowDoc will be called anyway
    // sending context = {flowId} will trigger updateFlowDoc again
    const resp = yield call(commitStagedChangesWrapper, {
      resourceType: type,
      id: resourceId,
      scope: SCOPES.VALUE,
      asyncKey: getAsyncKey(type, resourceId),
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

// this saga specifically creates new PG or PP updates to a flow document
export function* getFlowUpdatePatchesForNewPGorPP(
  resourceType,
  tempResourceId,
  flowId
) {
  if (
    !['exports', 'imports'].includes(resourceType) ||
    !flowId) return [];

  // is pageGenerator or pageProcessor
  const { merged: flowDoc, master: origFlowDoc } = (yield select(
    selectors.resourceData,
    'flows',
    flowId
  )) || emptyObject;

  // if its an existing resource and original flow document does not have any references to newly created PG or PP
  // then we can go ahead and update it...if it has existing references no point creating additional create patches
  // this was specifically created to support webhooks where in generating url we have to create a new PG...
  if (!isNewId(tempResourceId) && isFlowUpdatedWithPgOrPP(origFlowDoc, tempResourceId)) {
    return [];
  }

  const createdId = isNewId(tempResourceId)
    ? yield select(selectors.createdResourceId, tempResourceId) : tempResourceId;
  const createdResource = yield select(
    selectors.resource,
    resourceType,
    createdId
  );

  let addIndexPP = flowDoc?.pageProcessors?.length || 0;
  let addIndexPG = flowDoc?.pageGenerators?.length || 0;

  // Incoming resourceIds that model new PP or PGs (are prefixed with 'new-')  may contain a suffix
  // identifying if the resource should replace an existing pending resource, or if absent, add a new
  // resource. If this index suffix exists, we replace the pending PP/PG at that location, otherwise we
  // add a new one.
  const [, pendingIndex] = tempResourceId?.split('.');
  let pending = false;

  if (pendingIndex) {
    pending = true;
    addIndexPP = pendingIndex;
    addIndexPG = pendingIndex;
  }

  let flowPatches = [];

  if (resourceType === 'exports') {
    if (createdResource?.isLookup) {
      flowPatches = [
        {
          op: pending ? 'replace' : 'add',
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
        flowDoc?.pageGenerators?.[0]?.application === 'dataLoader'
      ) {
        flowPatches = [
          {
            op: 'replace',
            path: '/pageGenerators/0',
            value: { _exportId: createdId },
          },
        ];
      } else {
        flowPatches = [
          {
            op: pending ? 'replace' : 'add',
            path: `/pageGenerators/${addIndexPG}`,
            value: { _exportId: createdId },
          },
        ];
      }
    }
  } else {
    // imports resource type
    flowPatches = [
      {
        op: pending ? 'replace' : 'add',
        path: `/pageProcessors/${addIndexPP}`,
        value: { type: 'import', _importId: createdId },
      },
    ];
  }

  // only one flow patch so
  let missingPatches = [];

  if (flowPatches[0].path.includes('pageGenerators') && !flowDoc.pageGenerators) {
    missingPatches = [
      {
        op: 'add',
        path: '/pageGenerators',
        value: [],
      },
    ];
  } else if (
    flowPatches[0].path.includes('pageProcessors') &&
    !flowDoc.pageProcessors
  ) {
    missingPatches = [
      {
        op: 'add',
        path: '/pageProcessors',
        value: [],
      },
    ];
  }

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
  const resId = createdId || resourceId;

  const createdResource = yield select(selectors.resource, resourceType, resId);

  // if the export is a lookup then no patches should be applied
  if (createdResource?.isLookup) return [];

  const flow = (yield select(selectors.resourceData, 'flows', flowId))?.merged || emptyObject;

  const index = flow.pageGenerators?.findIndex(pg => pg._exportId === resId);

  if (index === undefined || index === null || index === -1) {
    return [];
  }
  // if its same value no point patching...return
  if (flow.pageGenerators[index].skipRetries === skipRetries) {
    return [];
  }

  const opDetermination = flow.pageGenerators[index].skipRetries === undefined ? 'add' : 'replace';

  return [
    {
      op: opDetermination,
      path: `/pageGenerators/${index}/skipRetries`,
      value: skipRetries,
    },
  ];
}

export function* touchFlow(flowId, resourceType, resourceId) {
  const out = [];
  const flow = yield select(selectors.resource, 'flows', flowId);
  const r = yield select(selectors.resource, resourceType, resourceId);

  if (flow?.lastModified && r?.lastModified && flow.lastModified < r.lastModified) {
    out.push({
      op: 'replace',
      path: '/lastModified',
      value: r.lastModified,
    });
    // this is a hack, the backend will need to enhance the audit log generation
    // https://celigo.atlassian.net/browse/IO-15873
    // until then, without the hack, flow audit log will show the following paths being changed by mistake
    if (flow?.pageProcessors?.length) {
      for (let i = 0; i < flow.pageProcessors.length; i += 1) {
        const rm = flow.pageProcessors[i]?.responseMapping;

        if (rm) {
          const ks = Object.keys(rm);
          let empty = true;

          // null check is shallow
          for (let j = 0; j < ks.length; j += 1) {
            if (rm[ks[j]] != null && (!Array.isArray(rm[ks[j]]) || rm[ks[j]].length > 0)) {
              empty = false;
              break;
            }
          }
          if (empty) {
            out.push({
              op: 'remove',
              path: `/pageProcessors/${i}/responseMapping`,
            });
          }
        }
      }
    }
  }

  return out;
}

export function* updateFlowDoc({ flowId, resourceType, resourceId, resourceValues = {} }) {
  const updatedResourceType = yield select(selectors.getResourceType, {resourceType, resourceId });
  let flowPatches = yield call(
    getFlowUpdatePatchesForNewPGorPP,
    updatedResourceType,
    resourceId,
    flowId
  );

  // if flowPatches is already non-empty, the flow will be updated and lastmodified will be changed as well
  // thus nothing to do for the lastmodified particularly
  // otherwise, check the stored flow and the changed resource to determine if the flow should be "touched"
  // to update the lastmodified
  if (!flowPatches || !flowPatches.length) {
    flowPatches = yield call(touchFlow, flowId, resourceType, resourceId);
  }

  yield put(actions.resource.patchStaged(flowId, flowPatches, SCOPES.VALUE));

  const skipRetries = resourceValues['/skipRetries'];

  if (skipRetries !== undefined) {
    const skipRetryPatches = yield call(
      skipRetriesPatches,
      updatedResourceType,
      flowId,
      resourceId,
      !!skipRetries
    );

    yield put(actions.resource.patchStaged(flowId, skipRetryPatches, SCOPES.VALUE));
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
  if (cancelSave) {
    return yield put(actions.resource.clearStaged(resourceId));
  }

  const { formSaveStatus, skipCommit } = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );

  // if it fails return
  if (formSaveStatus === FORM_SAVE_STATUS.FAILED || !flowId) return;

  const flow = (yield select(
    selectors.resourceData,
    'flows',
    flowId
  ))?.merged || emptyObject;

  // do not update the flow when its an IA
  if (isIntegrationApp(flow)) return;

  // when there is nothing to commit there is no reason to update the flow doc..hence we return
  // however there is a use case where we create a resource from an existing resource and that
  // is a one step process with skipCommit being true...we have to update the flow doc in that case
  if (skipCommit) {
    if (['pageGenerator', 'pageProcessor'].includes(resourceType)) {
      const { exportId, importId } = values || {};

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
  const asyncKey = getAsyncKey('connections', resourceId);

  yield put(actions.asyncTask.start(asyncKey));
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

      if (response?.errors) {
        yield put(actions.asyncTask.failed(asyncKey));

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
      yield put(actions.asyncTask.failed(asyncKey));

      return { error };
    }
  }
  yield put(actions.asyncTask.success(asyncKey));
}

export function* saveResourceWithDefinitionID({
  formValues,
  fileDefinitionDetails,
  flowId,
  skipClose = false,
}) {
  const { resourceId, resourceType, values } = formValues || {};
  const newValues = { ...values };
  const { definitionId, resourcePath } = fileDefinitionDetails || {};

  delete newValues['/file/filedefinition/rules'];
  newValues['/file/type'] = 'filedefinition';
  newValues['/file/fileDefinition/_fileDefinitionId'] = definitionId;
  if (resourceType === 'exports') {
    newValues['/file/fileDefinition/resourcePath'] = resourcePath;
  }
  yield put(
    actions.resourceForm.submit(
      resourceType,
      resourceId,
      newValues,
      null,
      skipClose,
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
  integrationId,
}) {
  const developerMode = yield select(selectors.developerMode);
  const resource = (yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  ))?.merged || emptyObject;
  const flow = (yield select(
    selectors.resourceData,
    'flows',
    flowId
  ))?.merged || emptyObject;

  if (isNewId(resourceId)) {
    resource._id = resourceId;
  }

  // if resource is empty.... it could be a resource looked up with invalid Id
  if (!resource || isEmpty(resource)) {
    yield put(actions.resourceForm.initFailed(resourceType, resourceId));

    return; // nothing to do.
  }
  const { assistant, assistantMetadata, _connectionId } = resource;
  const adaptorType = ['RESTExport', 'RESTImport'].includes(resource.adaptorType) ? 'rest' : 'http';

  let assistantData;

  if (['exports', 'imports'].includes(resourceType) && assistant) {
    if (!assistantMetadata) {
      yield put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'add', path: '/assistantMetadata', value: {} }],
          SCOPES.VALUE
        )
      );
    }

    assistantData = yield select(selectors.assistantData, {
      adaptorType,
      assistant,
    });

    if (!assistantData) {
      assistantData = yield call(requestAssistantMetadata, {
        adaptorType,
        assistant,
      });
    }
  }

  const connection = yield select(selectors.resource, 'connections', _connectionId);

  try {
    const defaultFormAssets = getResourceFormAssets({
      resourceType,
      resource,
      isNew,
      assistantData,
      connection,
    });

    const form = defaultFormAssets.fieldMeta;

    const fieldMeta = getFieldsWithDefaults(
      form,
      resourceType,
      resource,
      { developerMode, flowId, integrationId }
    );
    let finalFieldMeta = fieldMeta;

    if (typeof defaultFormAssets.init === 'function') {
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
  } catch (e) {
    yield put(actions.resourceForm.initFailed(resourceType, resourceId));
    // eslint-disable-next-line no-console
    console.warn(e);
  }
}

export const resourceFormSagas = [
  takeEvery(actionTypes.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.RESOURCE_FORM.SUBMIT, submitResourceForm),
  takeEvery(
    actionTypes.RESOURCE_FORM.SAVE_AND_CONTINUE,
    saveAndContinueResourceForm
  ),
  ...connectionSagas,
];
