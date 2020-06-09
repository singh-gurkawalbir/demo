import { takeLatest, select, call, put, takeEvery } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { resource, resourceFormState, resourceData } from '../../../reducers';
import {
  getAddedLookupInFlow,
  isRawDataPatchSet,
  getPreviewStageData,
} from '../../../utils/flowData';
import {
  isFileAdaptor,
  isRealTimeOrDistributedResource,
  isBlobTypeResource,
  isAS2Resource,
  isRestCsvMediaTypeExport,
} from '../../../utils/resource';
import { exportPreview } from '../utils/previewCalls';
import { saveRawDataOnResource } from './utils';
import saveRawDataForFileAdaptors from './fileAdaptorUpdates';
import saveTransformationRulesForNewXMLExport from '../utils/xmlTransformationRulesGenerator';

function* fetchAndSaveRawDataForResource({ type, resourceId, tempResourceId }) {
  const resourceObj = yield select(
    resource,
    type === 'imports' ? 'imports' : 'exports',
    resourceId
  );
  const connectionObj = yield select(
    resource,
    'connections',
    resourceObj && resourceObj._connectionId
  );

  const isBlobModeFileAdaptor =
    isFileAdaptor(resourceObj) && resourceObj.file.output === 'blobKeys';

  // Raw data need not be updated on save for real time resources
  // Covers - NS/SF/Webhooks
  // Also for Blob type resources ,no need to update as its a sample blob key as sample data
  // Even for file adaptors with blob output mode, no sampledata is saved
  if (
    (!isAS2Resource(resourceObj) &&
      isRealTimeOrDistributedResource(resourceObj)) ||
    isBlobTypeResource(resourceObj) ||
    isBlobModeFileAdaptor
  ) return;

  // For file adaptors and AS2 resource , raw data is fetched from uploaded file stored in state
  // Same applies for Rest Export incase of CSV as media type
  if (
    isFileAdaptor(resourceObj) ||
    isAS2Resource(resourceObj) ||
    (type === 'exports' && isRestCsvMediaTypeExport(resourceObj, connectionObj))
  ) {
    return yield call(saveRawDataForFileAdaptors, {
      resourceId,
      tempResourceId,
      type,
    });
  }

  if (type === 'exports') {
    const exportPreviewData = yield call(exportPreview, {
      resourceId,
      hidden: true,
    });

    if (exportPreviewData) {
      const parseData = getPreviewStageData(exportPreviewData, 'raw');

      yield call(saveRawDataOnResource, {
        resourceId,
        rawData: parseData && JSON.stringify(parseData),
      });
    }
  } else {
    // TODO @Raghu : Commenting this now as there is no BE Support on saving raw data for PPs
    // Add it back when BE supports offline mode for PPs
    // const pageProcessorPreviewData = yield call(pageProcessorPreview, {
    //   flowId,
    //   _pageProcessorId: resourceId,
    //   previewType: 'raw',
    //   hidden: true,
    // });
    // if (pageProcessorPreviewData) {
    //   yield call(saveRawDataOnResource, {
    //     resourceId,
    //     rawData:
    //       pageProcessorPreviewData && JSON.stringify(pageProcessorPreviewData),
    //   });
    // }
  }
}

function* onResourceCreate({ id, resourceType, tempId }) {
  /*
   * Question: How to differentiate -- a lookup creation and an existing lookup add on flow
   */
  if (resourceType === 'exports') {
    // TODO @Raghu: figure out a way to make preview call once to save Transformation rules and also rawData
    // Merge the below two sagas
    // @Bugfix: 15331 transformation rules for XML related exports are saved after export is created
    yield call(saveTransformationRulesForNewXMLExport, {
      resourceId: id,
      tempResourceId: tempId,
    });
    const resourceObj = yield select(resource, resourceType, id);

    if (!resourceObj.isLookup) {
      // If export, get raw data calling preview and call save raw data with a patch on this id
      yield call(fetchAndSaveRawDataForResource, {
        type: 'exports',
        resourceId: id,
        tempResourceId: tempId,
      });
    }
  }

  if (resourceType === 'imports') {
    yield call(fetchAndSaveRawDataForResource, {
      type: 'imports',
      resourceId: id,
      tempResourceId: tempId,
    });
  }
}

function* onResourceUpdate({
  resourceType,
  resourceId,
  master = {},
  patch = [],
}) {
  // If it is a raw data patch set on need to update again
  if (resourceType === 'exports' && patch.length && !isRawDataPatchSet(patch)) {
    const { flowId } = yield select(
      resourceFormState,
      resourceType,
      resourceId
    );
    let { isLookup } = master;

    // Double check for lookup or export , as old lookups does not have isLookup property
    if (flowId && !isLookup) {
      const flow = yield select(resource, 'flows', flowId);
      const { pageProcessors = [] } = flow || {};

      isLookup = !!pageProcessors.find(pp => pp._exportId === resourceId);
    }

    if (isLookup) {
      yield call(fetchAndSaveRawDataForResource, {
        type: 'pageprocessors',
        flowId,
        resourceId,
      });
    } else {
      yield call(fetchAndSaveRawDataForResource, {
        type: 'exports',
        resourceId,
      });
    }
  }

  if (resourceType === 'flows') {
    const addedPageProcessorId = getAddedLookupInFlow(master, patch);

    if (addedPageProcessorId) {
      yield call(fetchAndSaveRawDataForResource, {
        type: 'pageprocessors',
        flowId: resourceId,
        resourceId: addedPageProcessorId,
      });
    }
  }

  // If it is a raw data patch set on need to update again
  if (resourceType === 'imports' && patch.length && !isRawDataPatchSet(patch)) {
    const { merged: importResource = {} } = yield select(
      resourceData,
      'imports',
      resourceId
    );

    // Whenever an assistant import gets updated, its preview data ( sampleData ) needs to be reset
    if (importResource.assistant) {
      return yield put(
        actions.metadata.resetAssistantImportPreview(resourceId)
      );
    }

    yield call(fetchAndSaveRawDataForResource, {
      type: 'imports',
      resourceId,
    });
  }
}

export default [
  takeEvery(actionTypes.RESOURCE.CREATED, onResourceCreate),
  takeLatest(actionTypes.RESOURCE.UPDATED, onResourceUpdate),
];
