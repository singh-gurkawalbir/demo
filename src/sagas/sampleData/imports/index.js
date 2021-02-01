import { takeLatest, select, call, put, all } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { convertFromImport } from '../../../utils/assistant';
import { requestAssistantMetadata, getNetsuiteOrSalesforceMeta} from '../../resources/meta';
import { apiCallWithRetry } from '../..';
import actions from '../../../actions';
import { isIntegrationApp } from '../../../utils/flows';

export function* _fetchAssistantSampleData({ resource }) {
  // Fetch assistant's sample data logic
  let assistantMetadata;

  yield put(actions.metadata.requestAssistantImportPreview(resource._id));
  assistantMetadata = yield select(selectors.assistantData, {
    adaptorType: resource.adaptorType === 'HTTPImport' ? 'http' : 'rest',
    assistant: resource.assistant,
  });

  if (!assistantMetadata) {
    assistantMetadata = yield call(requestAssistantMetadata, {
      adaptorType: resource.adaptorType === 'HTTPImport' ? 'http' : 'rest',
      assistant: resource.assistant,
    });
  }

  const assistantConfig = convertFromImport({
    importDoc: resource,
    assistantData: assistantMetadata,
    adaptorType: resource.type,
  });
  const importEndpoint = assistantConfig.operationDetails;

  if (importEndpoint?.sampleData) {
    yield put(
      actions.metadata.receivedAssistantImportPreview(
        resource._id,
        importEndpoint.sampleData
      )
    );

    /* assistants team is not using 'previewConfig' and they are always populating 'sampleData'.
        Do not delete this logic below in case we need to use it in future */

    // } else if (importEndpoint && importEndpoint.previewConfig) {
    //   if (
    //     importEndpoint.howToFindIdentifier &&
    //     importEndpoint.howToFindIdentifier.lookupOperationDetails &&
    //     importEndpoint.howToFindIdentifier.lookupOperationDetails.url
    //   ) {
    //     exportConfig.endpoint =
    //       importEndpoint.howToFindIdentifier.lookupOperationDetails.url;
    //     ({
    //       sampleDataWrapper,
    //     } = importEndpoint.howToFindIdentifier.lookupOperationDetails);
    //   } else if (importEndpoint.previewConfig) {
    //     exportConfig.endpoint = importEndpoint.previewConfig.url;
    //     exportConfig.lookupConfig = {
    //       url: assistantConfig.endpoint,
    //       parameterValues: importEndpoint.previewConfig.parameterValues,
    //     };
    //     ({ sampleDataWrapper } = importEndpoint.previewConfig);
    //   }

    //   if (!exportConfig.queryParams) {
    //     exportConfig.queryParams = {};
    //   }

    //   if (exportConfig.lookupConfig) {
    //     exportConfig.lookupConfig.parameterValues = {}; // should not send these for preview call
    //   }

    //   if (
    //     exportConfig.lookupConfig &&
    //     exportConfig.lookupConfig.parameterValues
    //   ) {
    //     exportConfig.queryParams = {
    //       ...assistantConfig.queryParams,
    //       ...assistantConfig.lookupConfig.parameterValues,
    //     };
    //   }

    //   if (!exportConfig || exportConfig.endpoint) {
    //     return false;
    //   }

    //   exportConfig.forPreview = true;
    //   const exportConfiguration = convertToExport({
    //     assistantData: assistantMetadata,
    //     assistantConfig: exportConfig,
    //   });

    //   exportConfiguration._connectionId = resource._connectionId;
    //   const opts = {
    //     method: 'POST',
    //     body: {},
    //   };

    //   try {
    //     const previewData = yield call(apiCallWithRetry, {
    //       previewPath,
    //       opts,
    //       hidden: true,
    //     });

  //     yield put(
  //       actions.metadata.receivedAssistantImportPreview(
  //         resource._id,
  //         sampleDataWrapper ? { sampleDataWrapper: previewData } : previewData
  //       )
  //     );
  //   } catch (e) {
  //     // Handle Errors
  //   }
  // }
  } else {
    yield put(actions.metadata.failedAssistantImportPreview(resource._id));
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
      actions.importSampleData.iaMetadataReceived({
        _importId,
        metadata: sampleData,
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
