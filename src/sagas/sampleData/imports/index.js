import { takeLatest, select, call, put } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import { resourceData, assistantData } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { convertFromImport, convertToExport } from '../../../utils/assistant';
import { requestAssistantMetadata } from '../../resources/meta';
import { apiCallWithRetry } from '../..';
import actions from '../../../actions';
import { isIntegrationApp } from '../../../utils/flows';

function* fetchAssistantSampleData({ resource }) {
  // Fetch assistant's sample data logic
  let sampleDataWrapper;
  let assistantMetadata;
  const previewPath = `/exports/preview`;

  yield put(actions.metadata.requestAssistantImportPreview(resource._id));
  assistantMetadata = yield select(assistantData, {
    adaptorType: resource.adaptorType === 'HTTPImport' ? 'http' : 'rest',
    assistant: resource.assistant,
  });

  if (!assistantMetadata) {
    assistantMetadata = yield call(requestAssistantMetadata, {
      adaptorType: resource.adaptorType === 'HTTPImport' ? 'http' : 'rest',
      assistant: resource.assistant,
    });
  }

  // TODO: (Sravan) move this preview config logic to assistants Util.

  const assistantConfig = convertFromImport({
    importDoc: resource,
    assistantData: assistantMetadata,
    adaptorType: resource.type,
  });
  const importEndpoint = assistantConfig.operationDetails;
  const exportConfig = {};

  if (importEndpoint && importEndpoint.sampleData) {
    yield put(
      actions.metadata.receivedAssistantImportPreview(
        resource._id,
        importEndpoint.sampleData
      )
    );
  } else if (importEndpoint && importEndpoint.previewConfig) {
    if (
      importEndpoint.howToFindIdentifier &&
      importEndpoint.howToFindIdentifier.lookupOperationDetails &&
      importEndpoint.howToFindIdentifier.lookupOperationDetails.url
    ) {
      exportConfig.endpoint =
        importEndpoint.howToFindIdentifier.lookupOperationDetails.url;
      ({
        sampleDataWrapper,
      } = importEndpoint.howToFindIdentifier.lookupOperationDetails);
    } else if (importEndpoint.previewConfig) {
      exportConfig.endpoint = importEndpoint.previewConfig.url;
      exportConfig.lookupConfig = {
        url: assistantConfig.endpoint,
        parameterValues: importEndpoint.previewConfig.parameterValues,
      };
      ({ sampleDataWrapper } = importEndpoint.previewConfig);
    }

    if (!exportConfig.queryParams) {
      exportConfig.queryParams = {};
    }

    if (exportConfig.lookupConfig) {
      exportConfig.lookupConfig.parameterValues = {}; // should not send these for preview call
    }

    if (
      exportConfig.lookupConfig &&
      exportConfig.lookupConfig.parameterValues
    ) {
      exportConfig.queryParams = {
        ...assistantConfig.queryParams,
        ...assistantConfig.lookupConfig.parameterValues,
      };
    }

    if (!exportConfig || exportConfig.endpoint) {
      return false;
    }

    exportConfig.forPreview = true;
    const exportConfiguration = convertToExport({
      assistantData: assistantMetadata,
      assistantConfig: exportConfig,
    });

    exportConfiguration._connectionId = resource._connectionId;
    const opts = {
      method: 'POST',
      body: {},
    };

    try {
      const previewData = yield call(apiCallWithRetry, {
        previewPath,
        opts,
        hidden: true,
      });

      yield put(
        actions.metadata.receivedAssistantImportPreview(
          resource._id,
          sampleDataWrapper ? { sampleDataWrapper: previewData } : previewData
        )
      );
    } catch (e) {
      // Handle Errors
    }
  } else {
    yield put(actions.metadata.failedAssistantImportPreview(resource._id));
  }
}

function* fetchIAMetaData({
  _importId,
  _integrationId,
  refreshMetadata,
  sampleData,
}) {
  // make a request action to update IA Metadata state
  yield put(actions.importSampleData.iaMetadataRequest({ _importId }));

  // makes refreshMetadata call incase of 'refresh' else updates with resource's sampleData
  try {
    const iaMetadata = refreshMetadata
      ? yield call(apiCallWithRetry, {
          path: `/integrations/${_integrationId}/settings/refreshMetadata`,
          opts: {
            method: 'PUT',
            body: {
              _importId,
            },
          },
          hidden: true,
        })
      : sampleData;

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
      actions.importSampleData.iaMetadataReceived({
        _importId,
        metadata: sampleData,
      })
    );
  }
}

function* requestSampleData({ resourceId, options = {}, refreshCache }) {
  const { merged: resource } = yield select(
    resourceData,
    'imports',
    resourceId,
    SCOPES.VALUE
  );
  const { adaptorType, assistant, _integrationId, sampleData } = resource;

  if (assistant) {
    yield call(fetchAssistantSampleData, { resource });
  }

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteDistributedImport': {
        // eslint-disable-next-line camelcase
        const { _connectionId: connectionId, netsuite_da = {} } = resource;
        const { recordType } = options;
        let commMetaPath;

        if (recordType) {
          /** special case of netsuite/metadata/suitescript/connections/5c88a4bb26a9676c5d706324/recordTypes/inventorydetail?parentRecordType=salesorder
           * in case of subrecord */
          commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}?parentRecordType=${netsuite_da.recordType}`;
        } else {
          commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${netsuite_da.recordType}`;
        }

        yield put(
          actions.metadata.request(connectionId, commMetaPath, { refreshCache })
        );

        return;
      }

      case 'SalesforceImport': {
        const { _connectionId: connectionId, salesforce } = resource;

        yield put(
          actions.metadata.request(
            connectionId,
            `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`,
            { refreshCache }
          )
        );

        return;
      }

      default:
    }
  }

  // Fetches metadata to populate incase of imports in IAs (other than NS/SF)
  if (isIntegrationApp(resource)) {
    return yield call(fetchIAMetaData, {
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
