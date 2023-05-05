import { call, put, select, takeEvery, take, race } from 'redux-saga/effects';
import { isEmpty, isEqual } from 'lodash';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { selectors } from '../../reducers';
import {
  sanitizePatchSet,
  defaultPatchSetConverter,
} from '../../forms/formFactory/utils';
import { commitStagedChangesWrapper } from '../resources';
import connectionSagas, { createPayload, pingConnectionWithId } from './connections';
import { requestAssistantMetadata } from '../resources/meta';
import {
  isNewId,
  isFileAdaptor,
  isAS2Resource,
  isRestCsvMediaTypeExport,
} from '../../utils/resource';
import { _fetchRawDataForFileAdaptors } from '../sampleData/rawDataUpdates/fileAdaptorUpdates';
import { fileTypeToApplicationTypeMap } from '../../utils/file';
import { uploadRawData } from '../uploadFile';
import { UI_FIELD_VALUES, FORM_SAVE_STATUS, emptyObject, EMPTY_RAW_DATA, PageProcessorRegex } from '../../constants';
import { isIntegrationApp, isFlowUpdatedWithPgOrPP, shouldUpdateLastModified, flowLastModifiedPatch } from '../../utils/flows';
import getResourceFormAssets from '../../forms/formFactory/getResourceFromAssets';
import getFieldsWithDefaults from '../../forms/formFactory/getFieldsWithDefaults';
import { getAsyncKey } from '../../utils/saveAndCloseButtons';
import { getAssistantFromConnection } from '../../utils/connections';
import { getAssistantConnectorType, getHttpConnector, applicationsList } from '../../constants/applications';
import { constructResourceFromFormValues } from '../utils';
import {getConnector, getConnectorMetadata} from '../resources/httpConnectors';
import { setObjectValue } from '../../utils/json';
import { addPageProcessor, getFlowAsyncKey } from '../../utils/flows/flowbuilder';
import customCloneDeep from '../../utils/customCloneDeep';

export function* createFormValuesPatchSet({
  resourceType,
  resourceId,
  values,
}) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
  );
  const accountOwner = yield select(selectors.accountOwner);

  if (!resource) return { patchSet: [], finalValues: null }; // nothing to do.

  // This has the fieldMeta
  const formState = yield select(
    selectors.resourceFormState,
    resourceType,
    resourceId
  );
  let finalValues = values;

  let connection;
  let assistantData;

  if (resource?._connectionId) {
    connection = yield select(
      selectors.resource,
      'connections',
      resource._connectionId
    );
  }
  const connectorMetaData = yield select(
    selectors.httpConnectorMetaData, connection?.http?._httpConnectorId, connection?.http?._httpConnectorVersionId, connection?.http?._httpConnectorApiId);

  const isHttpConnectorParentFormView = yield select(selectors.isHttpConnectorParentFormView, resourceId);

  const _httpConnectorId = getHttpConnector(connection?.http?._httpConnectorId)?._id;

  if (_httpConnectorId) {
    assistantData = connectorMetaData;
  }

  const { preSave } = getResourceFormAssets({
    resourceType,
    resource,
    connection,
    isNew: formState.isNew,
    assistantData,
    accountOwner,
    isHttpConnectorParentFormView,
  });

  if (typeof preSave === 'function') {
    const iClients = yield select(selectors.resourceList, {
      type: 'iClients',
    });
    let httpConnectorData;
    const httpPublishedConnector = getHttpConnector(resource?._httpConnectorId || resource?.http?._httpConnectorId);

    if (resourceType === 'connections' && httpPublishedConnector) {
      httpConnectorData = yield select(selectors.connectorData, httpPublishedConnector?._id);

      if (!httpConnectorData && httpPublishedConnector?._id) {
        httpConnectorData = yield call(getConnector, {
          httpConnectorId: httpPublishedConnector._id,
        });
      }
    }

    // stock preSave handler present...
    finalValues = preSave(values, resource, {iClients, connection, httpConnector: httpConnectorData});
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

  const { data: rawData } = yield select(
    selectors.getResourceSampleDataWithStatus,
    resourceId,
    'raw'
  );

  if (!rawData) return values;
  // Gets application file type to be passed on file upload
  const uploadedFileType = values['/file/type'];
  const fileType = fileTypeToApplicationTypeMap[uploadedFileType];
  // Incase of JSON, we need to stringify the content to pass while uploading
  const fileContent = uploadedFileType === 'json' ? JSON.stringify(rawData) : rawData;
  const rawDataKey = yield call(uploadRawData, {
    file: fileContent,
    fileName: `file.${uploadedFileType}`,
    fileType,
  });

  return { ...values, '/rawData': rawDataKey };
}

function* updateFileAdaptorSampleData({ resourceId, resourceType, values }) {
  const resourceObj = yield call(constructResourceFromFormValues, { resourceId, resourceType, formValues: values });
  const connectionObj = yield select(
    selectors.resource,
    'connections',
    resourceObj && resourceObj._connectionId
  );

  if (
    isFileAdaptor(resourceObj) ||
    isAS2Resource(resourceObj) ||
    (resourceType === 'exports' && (isRestCsvMediaTypeExport(resourceObj, connectionObj)))
  ) {
    // IO-23787 The latest sample data which is edited, is available on the resourceObject
    // Handled in DynaFileDefintionEditor_afe when user updates the sample data and saves it
    if (['filedefinition', 'fixed', 'delimited/edifact'].includes(resourceObj?.file?.type)) {
      if (resourceObj?.sampleData) return { ...values, '/sampleData': resourceObj?.sampleData };
    }

    const sampleData = yield call(_fetchRawDataForFileAdaptors, {
      resourceId,
      resourceType,
      values,
    });

    if (sampleData !== undefined) {
      return { ...values, '/sampleData': sampleData };
    }
  }

  return values;
}

function* clearRawDataFromFormValues({ values, resourceId, resourceType }) {
  const { merged: resourceObj } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );

  // Incase of Data loader, no need to remove rawData as it is handled when the flow is run
  if (!resourceObj?.rawData || resourceObj?.rawData === EMPTY_RAW_DATA || resourceObj?.type === 'simple') {
    return values;
  }

  return { ...values, '/rawData': EMPTY_RAW_DATA };
}

export function* deleteUISpecificValues({ values, resourceId }) {
  const valuesCopy = { ...values };

  UI_FIELD_VALUES.forEach(id => {
    // remove ui field value from the form value payload
    delete valuesCopy[id];
  });

  // TO DO: This logic should be revisited
  const csvKeyColumns = valuesCopy['/file/csv']?.keyColumns;
  const xlsxKeyColumns = valuesCopy['/file/xlsx/keyColumns'];
  const groupByFields = valuesCopy['/file/groupByFields'];
  let canDeprecateOldFields = !!valuesCopy['/file/sortByFields'];

  if ((csvKeyColumns && groupByFields && !isEqual(csvKeyColumns, groupByFields)) ||
      (xlsxKeyColumns && groupByFields && !isEqual(xlsxKeyColumns, groupByFields))) {
    canDeprecateOldFields = true;
  }
  // Existing keycolumns should be removed if any changes are done in group by fields or sort by fields.
  if (canDeprecateOldFields) {
    if (valuesCopy['/file/csv']?.keyColumns) {
      valuesCopy['/file/csv'].keyColumns = undefined;
    }
    if (valuesCopy['/file/xlsx/keyColumns']) {
      valuesCopy['/file/xlsx/keyColumns'] = undefined;
    }
  } else if ((csvKeyColumns && isEqual(csvKeyColumns, groupByFields)) || (xlsxKeyColumns && isEqual(xlsxKeyColumns, groupByFields))) {
    // Group by fields is initial copy of key columns, If group by fields is not modified and it is same as key columns, then it should be removed.
    valuesCopy['/file/groupByFields'] = undefined;
  }

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
  );

  if (resource?.useParentForm) {
    yield put(
      actions.resource.patchStaged(
        resourceId,
        removeAssistantPatch,
      )
    );
  }
  yield put(
    actions.resource.patchStaged(
      resourceId,
      removeParentFormPatch,
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
  parentContext,
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
    formValues = yield call(clearRawDataFromFormValues, { resourceId, resourceType, values: formValues });
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
  if (['exports', 'imports'].includes(resourceType)) {
    formValues = yield call(updateFileAdaptorSampleData, { resourceId, resourceType, values: formValues });
  }

  let patchSet;
  let finalValues;

  try {
    // getResourceFrom assets can throw an error when it cannot pick up a matching form
    ({ patchSet, finalValues } = yield call(createFormValuesPatchSet, {
      resourceType,
      resourceId,
      values: formValues,
    }));
  } catch (e) {
    return yield put(actions.resourceForm.submitFailed(resourceType, resourceId));
  }
  if (patchSet && patchSet.length > 0) {
    yield put(actions.resource.patchStaged(resourceId, patchSet));
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
    !isEmpty(integrationIdPatch.value) &&
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
      asyncKey: getAsyncKey(type, resourceId),
      parentContext,
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
  flowId,
  isPreview,
  isLookup,
) {
  if (!['exports', 'imports'].includes(resourceType) || !flowId) return [];

  // is pageGenerator or pageProcessor
  const { merged: flowDoc, master: origFlowDoc } = (yield select(
    selectors.resourceData,
    'flows',
    flowId
  )) || emptyObject;
  const elementsMap = yield select(selectors.fbGraphElementsMap, flowId);
  const info = yield select(selectors.fbInfo, flowId);

  // if its an existing resource and original flow document does not have any references to newly created PG or PP
  // then we can go ahead and update it...if it has existing references no point creating additional create patches
  // this was specifically created to support webhooks where in generating url we have to create a new PG...
  if (!isNewId(tempResourceId) && isFlowUpdatedWithPgOrPP(origFlowDoc, tempResourceId)) {
    return [];
  }
  const flowDocClone = customCloneDeep(flowDoc);

  const observer = jsonPatch.observe(flowDocClone);

  const createdId = isNewId(tempResourceId) && !isPreview ? yield select(selectors.createdResourceId, tempResourceId) : tempResourceId;
  const createdResource = yield select(selectors.resource, resourceType, createdId);
  const isPageGenerator = resourceType === 'exports' && !createdResource?.isLookup && !isLookup;
  const step = elementsMap[tempResourceId];
  const isLinearFlow = !flowDocClone.routers?.length;

  if (isPageGenerator) {
    // only page generators
    // temp patch of application with value 'dataLoader' maybe present if its data loader...
    // perform replace in that case
    if (flowDocClone?.pageGenerators?.[0]?.application === 'dataLoader') {
      flowDocClone.pageGenerators[0] = {_exportId: createdId};
    } else if (step) {
      setObjectValue(flowDocClone, step.data.path, {_exportId: createdId});
    } else {
      if (!flowDocClone.pageGenerators) {
        flowDocClone.pageGenerators = [];
      }
      flowDocClone.pageGenerators.push({ _exportId: createdId });
    }
  } else {
    // pageProcessors
    const isLookup = resourceType === 'exports';
    const pageProcessor = {
      type: isLookup ? 'export' : 'import',
      [isLookup ? '_exportId' : '_importId']: createdId,
    };

    if (step) {
      const {path} = step.data;

      if (isLinearFlow) {
        // get pageProcessorPath, ex: /pageProcessors/0
        const [ppPath] = path.match(PageProcessorRegex);

        setObjectValue(flowDocClone, ppPath, pageProcessor);
      } else {
        setObjectValue(flowDocClone, path, pageProcessor);
      }
    } else {
      const { processorIndex, branchPath } = info;
      const insertAtIndex = processorIndex ?? -1;

      addPageProcessor(flowDocClone, insertAtIndex, branchPath, pageProcessor);
      !isPreview && (yield put(actions.flow.clearPPStepInfo(flowId)));
    }
  }

  return jsonPatch.generate(observer);
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
    // TODO: remove the hack and use flowLastModifiedPatch
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

function* updateIAFlowDoc({flow, resource }) {
  if (!shouldUpdateLastModified(flow, resource)) return;
  const patch = flowLastModifiedPatch(flow, resource);

  yield put(actions.resource.patchStaged(flow._id, patch));

  yield call(commitStagedChangesWrapper, {
    asyncKey: getFlowAsyncKey(flow._id),
    resourceType: 'flows',
    id: flow._id,
  });
}

export function* updateFlowDoc({ flowId, resourceType, resourceId, resourceValues = {} }) {
  const flow = (yield select(
    selectors.resourceData,
    'flows',
    flowId
  ))?.merged || emptyObject;

  if (isIntegrationApp(flow)) {
    // update the last modified time
    const resource = yield select(selectors.resource, resourceType, resourceId);

    yield call(updateIAFlowDoc, {flow, resource});

    return;
  }
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

  yield put(actions.resource.patchStaged(flowId, flowPatches));

  const skipRetries = resourceValues['/skipRetries'];

  if (skipRetries !== undefined) {
    const skipRetryPatches = yield call(
      skipRetriesPatches,
      updatedResourceType,
      flowId,
      resourceId,
      !!skipRetries
    );

    yield put(actions.resource.patchStaged(flowId, skipRetryPatches));
  }

  yield call(commitStagedChangesWrapper, {
    asyncKey: getFlowAsyncKey(flowId),
    resourceType: 'flows',
    id: flowId,
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
  const { resourceId, parentContext } = params;
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

      yield call(pingConnectionWithId, { connectionId: id, parentContext });
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
  fieldMeta: customFieldMeta,
  parentConnectionId,
  options,
}) {
  const applicationFieldState = yield select(selectors.fieldState, getAsyncKey('connections', parentConnectionId), 'application');
  const developerMode = yield select(selectors.developerMode);
  const accountOwner = yield select(selectors.accountOwner);
  const resource = (yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
  ))?.merged || emptyObject;

  const flow = (yield select(
    selectors.resourceData,
    'flows',
    flowId
  ))?.merged || emptyObject;
  const isHttpConnectorParentFormView = yield select(selectors.isHttpConnectorParentFormView, resourceId);

  if (isNewId(resourceId)) {
    resource._id = resourceId;
  }
  // if resource is empty.... it could be a resource looked up with invalid Id
  if (!resource || isEmpty(resource)) {
    yield put(actions.resourceForm.initFailed(resourceType, resourceId));

    return; // nothing to do.
  }
  const { assistant, assistantMetadata, _connectionId } = resource;

  const connection = yield select(selectors.resource, 'connections', _connectionId);

  const connectionAssistant = getAssistantFromConnection(assistant, connection);

  const newResource = {...resource, assistant: connectionAssistant};

  const adaptorType = getAssistantConnectorType(connectionAssistant);

  let assistantData;
  let connectorMetaData;
  // http connector check

  if (['exports', 'imports'].includes(resourceType) && !isNew) {
    if (!assistantMetadata) {
      yield put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'add', path: '/assistantMetadata', value: {} }],
        )
      );
    }
    assistantData = yield select(selectors.assistantData, {
      adaptorType,
      assistant: connectionAssistant,
    });
    connectorMetaData = yield select(
      selectors.httpConnectorMetaData, connection?.http?._httpConnectorId, connection?.http?._httpConnectorVersionId, connection?.http?._httpConnectorApiId);
    if (getHttpConnector(connection?.http?._httpConnectorId) && !connectorMetaData) {
      connectorMetaData = yield call(getConnectorMetadata, {
        connectionId: connection._id,
        httpConnectorId: connection?.http?._httpConnectorId,
        httpVersionId: connection?.http?._httpConnectorVersionId,
        httpConnectorApiId: connection?.http?._httpConnectorApiId,
      });
    } else if (!getHttpConnector(connection?.http?._httpConnectorId) && !assistantData) {
      assistantData = yield call(requestAssistantMetadata, {
        adaptorType,
        assistant: connectionAssistant,
      });
    }
  }
  // const {resources: httpConnectors} = yield select(selectors.resourceList, {
  //   type: 'httpconnectors',
  // });
  // const httpConnector = httpConnectors?.find(conn => (conn.name === resource.assistant) && conn.published);
  let httpPublishedConnector = resourceType === 'connections';

  if (resourceType === 'connections') {
    httpPublishedConnector = getHttpConnector(resource?._httpConnectorId || resource?.http?._httpConnectorId);
  } else if (resourceType === 'exports') {
    httpPublishedConnector = getHttpConnector(resource?._httpConnectorId || resource?.webhook?._httpConnectorId);
  } else if (resourceType === 'iClients') {
    const applications = applicationsList().filter(app => app._httpConnectorId);
    let app;

    if (resource?.application) {
      // new iclent inside resource
      app = applications.find(a => a.name.toLowerCase().replace(/\.|\s/g, '') === resource.application.toLowerCase().replace(/\.|\s/g, '')) || {};
    } else if (resource?._httpConnectorId) {
      // existing Iclient
      app = applications.find(a => a._httpConnectorId === resource._httpConnectorId) || {};
    } else if (applicationFieldState?.value) {
      // new Iclient inside connection
      app = applications.find(a => a.name === applicationFieldState.value) || {};
    }

    httpPublishedConnector = getHttpConnector(app?._httpConnectorId);
  }
  try {
    const defaultFormAssets = getResourceFormAssets({
      resourceType,
      resource: newResource,
      isNew,
      assistantData: getHttpConnector(connection?.http?._httpConnectorId) ? connectorMetaData : assistantData,
      connection,
      customFieldMeta,
      accountOwner,
      parentConnectionId,
      applicationFieldState,
      isHttpConnectorParentFormView,
    });

    const form = defaultFormAssets.fieldMeta;

    const fieldMeta = getFieldsWithDefaults(
      form,
      resourceType,
      newResource,
      { developerMode, flowId, integrationId }
    );
    let finalFieldMeta = fieldMeta;

    if (typeof defaultFormAssets.init === 'function') {
      let httpConnectorData;

      if (httpPublishedConnector?._id) {
        httpConnectorData = yield select(selectors.connectorData, httpPublishedConnector?._id);
      }

      if (!httpConnectorData && httpPublishedConnector?._id) {
        httpConnectorData = yield call(getConnector, {
          httpConnectorId: httpPublishedConnector._id,
        });
      }
      // standard form init fn...
      finalFieldMeta = defaultFormAssets.init(fieldMeta, newResource, flow, httpConnectorData, applicationFieldState?.value, options?.apiChange);
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

export function* reInitializeForm({ formKey, additionalPatches = {} }) {
  const formContext = yield select(selectors.formState, formKey) || {};

  const { flowId, resourceId, resourceType } = formContext.parentContext;

  if (!formKey || !resourceId || !resourceType) return;

  const stagedResource = (yield select(selectors.resourceData, resourceType, resourceId))?.merged || {};

  const resourceFormState = yield select(selectors.resourceFormState, resourceType, resourceId) || {};

  const connection = yield select(selectors.resource, 'connections', stagedResource._connectionId) || {};

  const connectorMetaData = yield select(selectors.httpConnectorMetaData, connection.http?._httpConnectorId, connection.http?._httpConnectorVersionId, connection.http?._httpConnectorApiId);

  const isCurrentParentFormView = yield select(selectors.isHttpConnectorParentFormView, resourceId);

  const stagedRes = Object.keys(stagedResource).reduce((acc, curr) => {
    acc[`/${curr}`] = stagedResource[curr];

    return acc;
  }, {});

  // use this function to get the corresponding preSave function for this current form
  const { preSave } = getResourceFormAssets({
    resourceType,
    resource: stagedResource,
    isNew: false,
    connection,
    assistantData: connectorMetaData,
    // We need the form view before switched as we need preSave of previous form view. hence negation
    isHttpConnectorParentFormView: !isCurrentParentFormView,
  });
  const finalValues = preSave(formContext.value, stagedRes, { connection });

  const allPatches = sanitizePatchSet({
    patchSet: defaultPatchSetConverter({ ...stagedRes, ...finalValues, ...additionalPatches }),
    fieldMeta: resourceFormState.fieldMeta,
    resource: {},
  });

  yield put(actions.resource.clearStaged(resourceId));
  yield put(
    actions.resource.patchStaged(resourceId, allPatches)
  );

  const allTouchedFields = Object.values(formContext.fields)
    .filter(field => !!field.touched)
    .map(field => ({ id: field.id, value: field.value }));

  yield put(
    actions.resourceForm.init(
      resourceType,
      resourceId,
      false,
      false,
      flowId,
      allTouchedFields
    )
  );
}

export const resourceFormSagas = [
  takeEvery(actionTypes.RESOURCE_FORM.INIT, initFormValues),
  takeEvery(actionTypes.RESOURCE_FORM.RE_INITIALIZE, reInitializeForm),
  takeEvery(actionTypes.RESOURCE_FORM.SUBMIT, submitResourceForm),
  takeEvery(
    actionTypes.RESOURCE_FORM.SAVE_AND_CONTINUE,
    saveAndContinueResourceForm
  ),
  ...connectionSagas,
];
