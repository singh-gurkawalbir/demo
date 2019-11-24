import { takeLatest, select, call, put } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import { resourceData, assistantData } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { convertFromImport, convertToExport } from '../../../utils/assistant';
import {
  getNetsuiteOrSalesforceMeta,
  requestAssistantMetadata,
} from '../../resources/meta';
import { apiCallWithRetry } from '../..';
import actions from '../../../actions';

function* fetchAssistantSampleData({ resource }) {
  // Fetch assistant's sample data logic
  let sampleDataWrapper;
  let assistantMetadata;
  const previewPath = `/exports/preview`;

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

  const assistantConfig = convertFromImport({
    importDoc: resource,
    assistantData: assistantMetadata,
    adaptorType: resource.type,
  });
  const importEndpoint = assistantConfig.operationDetails;
  const exportConfig = {};

  if (importEndpoint && importEndpoint.sampleData) {
    yield put(
      actions.metadata.assistantImportPreview(
        resource._id,
        importEndpoint.sampleData
      )
    );

    return;
  }

  if (importEndpoint && importEndpoint.previewConfig) {
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
        actions.metadata.assistantImportPreview(
          resource._id,
          sampleDataWrapper ? { sampleDataWrapper: previewData } : previewData
        )
      );
    } catch (e) {
      // Handle Errors
    }
  }
}

function* requestSampleData({ resourceId }) {
  const { merged: resource } = yield select(
    resourceData,
    'imports',
    resourceId,
    SCOPES.VALUE
  );
  const { adaptorType, assistant } = resource;

  if (assistant) {
    yield call(fetchAssistantSampleData, { resource });
  }

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteDistributedImport': {
        // eslint-disable-next-line camelcase
        const { _connectionId: connectionId, netsuite_da } = resource;

        yield call(getNetsuiteOrSalesforceMeta, {
          connectionId,
          commMetaPath: `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${netsuite_da.recordType}`,
        });
        break;
      }

      case 'SalesforceImport': {
        const { _connectionId: connectionId, salesforce } = resource;

        yield call(getNetsuiteOrSalesforceMeta, {
          connectionId,
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`,
        });
        break;
      }

      default:
    }
  }
}

export default [
  takeLatest(actionTypes.IMPORT_SAMPLEDATA.REQUEST, requestSampleData),
];
