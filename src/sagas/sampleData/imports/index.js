import { takeLatest, select, call, put, all } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import { deepClone } from 'fast-json-patch/lib/core';
import actionTypes from '../../../actions/types';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { convertFromImport, convertToExport } from '../../../utils/assistant';
import { requestAssistantMetadata, getNetsuiteOrSalesforceMeta} from '../../resources/meta';
import { apiCallWithRetry } from '../..';
import actions from '../../../actions';
import { isIntegrationApp } from '../../../utils/flows';
import { getAssistantConnectorType, getImportAdaptorType } from '../../../constants/applications';
import { defaultPatchSetConverter, sanitizePatchSet } from '../../../forms/formFactory/utils';
import { extractStages } from '../../../reducers/session/sampleData/resourceForm';

function convertToVirtualExport(assistantConfigOrig, assistantMetadata, resource) {
  const assistantConfig = deepClone(assistantConfigOrig);

  if (!assistantConfig.queryParams) {
    assistantConfig.queryParams = {};
  }

  if (assistantConfig.lookupConfig) {
    assistantConfig.lookupConfig.parameterValues = {}; // should not send these for preview call
  }

  assistantConfig.forPreview = true;
  const exportConfiguration = convertToExport({
    assistantData: assistantMetadata,
    assistantConfig,
  });

  if (!exportConfiguration) {
    return false;
  }

  // the export configuration has all keys starting with forward slash, we generate patches from it and create a new document.
  // This process results in the document not having the forward slash.
  const patchSet = sanitizePatchSet({
    patchSet: defaultPatchSetConverter(exportConfiguration || {}),
    resource: {},
  });

  const exportJson = jsonPatch.applyPatch({}, patchSet)?.newDocument;

  exportJson.forPreview = true;
  exportJson._connectionId = resource._connectionId;

  return exportJson;
}

function convertToVirtualExportFromPreviewConfig(assistantConfig, assistantMetadata, previewConfig, resource) {
  const {id, url, resource: previewConfigResource, sampleDataWrapper, resourcePath, ...hardCodedParams} = previewConfig;
  const {adaptorType, resource: assistantConfigResource} = assistantConfig;
  const {_connectionId, assistant} = resource;

  // if id is provided use that as an operation
  if (id) {
    const updatedAssistantConfig = {...assistantConfig};

    updatedAssistantConfig.operation = id;
    updatedAssistantConfig.assistant = assistant;
    updatedAssistantConfig.resource = previewConfigResource || assistantConfigResource;

    return convertToVirtualExport(updatedAssistantConfig, assistantMetadata, resource);
  }

  // in the cases hard coded parameters like url, header etc are provided instead of id fabricate a simple export
  if (adaptorType === 'http') {
    return {_connectionId, adaptorType: 'HTTPExport', http: {...hardCodedParams, relativeURI: url }, response: {successValues: [], resourcePath}};
  }

  return {_connectionId, adaptorType: 'RESTExport', rest: {...hardCodedParams, relativeURI: url, resourcePath}, assistant};
}

export function* _fetchAssistantSampleData({ resource }) {
  if (!resource) return;
  const {assistant, _id} = resource;

  yield put(actions.metadata.requestAssistantImportPreview(_id));

  // Fetch assistant's sample data logic
  let assistantMetadata;

  assistantMetadata = yield select(selectors.assistantData, {
    adaptorType: getAssistantConnectorType(assistant),
    assistant,
  });
  const adaptorType = getImportAdaptorType(resource);

  if (!assistantMetadata) {
    assistantMetadata = yield call(requestAssistantMetadata, {
      adaptorType,
      assistant,
    });
  }

  if (!assistantMetadata?.import) {
    return yield put(actions.metadata.failedAssistantImportPreview(_id));
  }
  const assistantConfig = convertFromImport({
    importDoc: resource,
    assistantData: assistantMetadata,
    adaptorType,
  });

  assistantConfig.adaptorType = adaptorType;
  const importEndpoint = assistantConfig.operationDetails;

  if (!importEndpoint) {
    // we can't find the endpoint if the operation is incorrect
    yield put(actions.metadata.failedAssistantImportPreview(_id));

    return false;
  }
  const {previewConfig, sampleData} = importEndpoint;

  // if there is not previewConfig just use the sample data associated sampleData
  if (!previewConfig) {
    return yield put(
      actions.metadata.receivedAssistantImportPreview(
        _id,
        sampleData
      )
    );
  }

  const {sampleDataWrapper} = previewConfig;
  const exportPayload = convertToVirtualExportFromPreviewConfig(assistantConfig, assistantMetadata, previewConfig, resource);

  // if it cannot be converted to a virtual export just fail the preview call
  if (!exportPayload) {
    yield put(actions.metadata.failedAssistantImportPreview(_id));

    return false;
  }

  try {
    const previewData = yield call(apiCallWithRetry, {
      path: '/exports/preview',
      opts: {
        method: 'POST',
        body: exportPayload,
      },
      hidden: true,
    });
    const previewStageDataList = extractStages(previewData);
    const record = previewStageDataList?.parse?.[0] || sampleData || {};

    yield put(
      actions.metadata.receivedAssistantImportPreview(
        _id,
        sampleDataWrapper ? { [sampleDataWrapper]: record } : record
      )
    );
  } catch (e) {
    yield put(actions.metadata.failedAssistantImportPreview(_id));
  }
}

export function* _fetchIAMetaData({
  _importId,
  _integrationId,
  refreshMetadata,
  sampleData,
}) {
  // make a request action to update IA Metadata state
  yield put(actions.importSampleData.iaMetadataRequest({ _importId }));

  // makes refreshMetadata call incase of 'refresh' else updates with resource's sampleData
  try {
    let iaMetadata;

    if (refreshMetadata) {
      const refreshMetadataResponse = yield call(apiCallWithRetry, {
        path: `/integrations/${_integrationId}/settings/refreshMetadata`,
        opts: {
          method: 'PUT',
          body: {
            _importId,
          },
        },
        hidden: true,
      });

      if (!refreshMetadataResponse || refreshMetadataResponse?.errors?.length) {
        return yield put(
          actions.importSampleData.iaMetadataFailed({_importId})
        );
      }
      iaMetadata = refreshMetadataResponse;
    } else {
      iaMetadata = sampleData;
    }

    yield put(
      actions.importSampleData.iaMetadataReceived({
        _importId,
        metadata: iaMetadata,
      })
    );
    // TODO @Raghu: Whenever refreshMetadata call is invoked, it updates sampleData on the import as well
    // So, do we need to re-fetch the import again and invalidate any sampleData if existed further on the flow?
  } catch (e) {
    // on receiving error , update with resource's sampleData
    // TODO @Raghu: revisit once BE implementation done to support specific IAs
    yield put(
      actions.importSampleData.iaMetadataFailed({
        _importId,
      })
    );
  }
}

export function* requestSampleData({ resourceId, options = {}, refreshCache }) {
  const { merged: resource } = yield select(
    selectors.resourceData,
    'imports',
    resourceId,
    SCOPES.VALUE
  );

  if (!resource) return;
  const { adaptorType, assistant, _integrationId, sampleData } = resource;

  if (assistant) {
    return yield call(_fetchAssistantSampleData, { resource });
  }

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteImport':
      case 'NetSuiteDistributedImport': {
        // eslint-disable-next-line camelcase
        const { _connectionId: connectionId } = resource;
        let commMetaPath;
        // eslint-disable-next-line camelcase
        const importRecordType = resource?.netsuite_da?.recordType || resource?.netsuite?.recordType;

        if (options.recordType) {
          /** special case of netsuite/metadata/suitescript/connections/5c88a4bb26a9676c5d706324/recordTypes/inventorydetail?parentRecordType=salesorder
           * in case of subrecord */
          commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${options.recordType}?parentRecordType=${importRecordType}`;
        } else {
          commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${importRecordType}`;
        }

        yield call(getNetsuiteOrSalesforceMeta, {connectionId, commMetaPath, addInfo: { refreshCache }});

        return;
      }

      case 'SalesforceImport': {
        const { _connectionId: connectionId, salesforce } = resource;
        const sObjectsToFetch = options.sObjects ? options.sObjects : [salesforce.sObjectType];

        yield all(sObjectsToFetch.map(sObjectType => call(
          getNetsuiteOrSalesforceMeta, {
            connectionId,
            commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}`,
            addInfo: { refreshCache }}
        )));

        return;
      }
      default:
    }
  }

  // Fetches metadata to populate incase of imports in IAs (other than NS/SF)
  if (isIntegrationApp(resource)) {
    return yield call(_fetchIAMetaData, {
      _importId: resourceId,
      _integrationId,
      refreshMetadata: refreshCache,
      sampleData,
    });
  }
}

export default [
  takeLatest(actionTypes.IMPORT_SAMPLEDATA.REQUEST, requestSampleData),
];
