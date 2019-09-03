/* TODO:
 * After ftp related processor functions we must include transform to json
 * Handle errors in transform/preview/parsers
 * Ultimately saga should be concerned regarding what processor calls to make and update based on stages
 */

import { takeLatest, put, select, call } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { resourceData, getResourceSampleDataWithStatus } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';

const PARSERS = {
  csv: '/processors/csvParser',
  xml: '/xmlToJson',
};

function* getPreviewData(resourceId, resourceType, values) {
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
    scope: SCOPES.VALUE,
  });
  const { merged } = yield select(
    resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );
  const patchResult = jsonPatch.applyPatch(
    merged ? jsonPatch.deepClone(merged) : {},
    jsonPatch.deepClone(patchSet)
  );
  const body = patchResult.newDocument;

  // Removing rawData field as it is not being handled form backend
  delete body.rawData;
  body.verbose = true;
  const path = `/${resourceType}/preview`;

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'POST', body },
      message: `Fetching ${resourceType} Preview`,
    });

    yield put(actions.sampleData.received(resourceId, previewData));
  } catch (e) {
    return undefined;
  }
}

function* getProcessorData(resourceId, resourceType, values, stage) {
  const path = `/processors/${stage}`;
  // Get Pre Processed data from State
  const { data: preProcessedData } = yield select(
    getResourceSampleDataWithStatus,
    resourceId,
    stage
  );
  const body = {
    data: [preProcessedData],
    rules: { rules: values },
    options: {},
  };
  const opts = {
    method: 'POST',
    body,
  };
  const processedData = yield call(apiCallWithRetry, {
    path,
    opts,
  });

  yield put(actions.sampleData.update(resourceId, processedData, stage));
}

function* processFileData(resourceId, resourceType, values) {
  if (!values) return undefined;
  let body;
  const { file, type, rules } = values;

  if (['json', 'csv', 'xml'].includes(type)) {
    // Update Raw Data with the file uploaded before parsing
    yield put(
      actions.sampleData.update(resourceId, { data: [{ body: file }] }, 'raw')
    );
  }

  if (['csv', 'xml'].includes(type)) {
    // Parse file content using processors
    if (type === 'csv') {
      body = {
        rules: rules || {},
        data: file,
        options: {
          includeEmptyValues: true,
        },
      };
    }

    if (type === 'xml') {
      body = {
        xml: file,
      };
    }

    const opts = {
      method: 'POST',
      body,
    };
    const path = PARSERS[type];
    const processedData = yield call(apiCallWithRetry, {
      path,
      opts,
    });

    yield put(actions.sampleData.update(resourceId, processedData, 'parse'));
  }
  // TODO: Call Transform processor if rules exist for this resource
}

function* requestSampleData({ resourceId, resourceType, values, stage }) {
  // Call preview/processor based on stage
  // If stage is specified make a processor call else preview
  // Takes a different route for File processors
  if (stage) {
    if (stage === 'file') {
      yield processFileData(resourceId, resourceType, values);
    } else {
      yield getProcessorData(resourceId, resourceType, values, stage);
    }
  } else {
    yield getPreviewData(resourceId, resourceType, values);
  }
}

export default [takeLatest(actionTypes.SAMPLEDATA.REQUEST, requestSampleData)];
