import { takeLatest, put, select, call } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { resourceData, getResourceSampleDataWithStatus } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';
import { evaluateExternalProcessor } from '../../sagas/editor';

/*
 * Parsers for different file types used for converting into JSON format
 * For XLSX Files , this saga receives converted csv content as input
 * so it uses same csv parser
 */
const PARSERS = {
  csv: 'csvParser',
  xlsx: 'csvParser',
  xml: 'xmlParser',
  fileDefinition: 'structuredFileParser',
  fileDefinitionParser: 'structuredFileParser',
  fileDefinitionGenerator: 'structuredFileGenerator',
};

function getRulesFromResourceFormValues(formValues = {}) {
  if (!formValues['/transform']) return [];
  const transformRules = formValues['/transform'].rules;

  return transformRules && transformRules.length ? transformRules : [];
}

function* getPreviewData({ resourceId, resourceType, values, runOffline }) {
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
  const newBody = patchResult.newDocument;
  let body = { ...newBody };

  if (runOffline && body.rawData) {
    body = {
      ...body,
      verbose: true,
      runOfflineOptions: {
        runOffline: true,
        runOfflineSource: 'db',
      },
    };
  } else {
    delete body.rawData;
  }

  const path = `/${resourceType}/preview`;

  try {
    const previewData = yield call(apiCallWithRetry, {
      path,
      opts: { method: 'POST', body },
      message: `Fetching ${resourceType} Preview`,
    });

    yield put(actions.sampleData.received(resourceId, previewData));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      return yield put(
        actions.sampleData.receivedError(resourceId, parsedError)
      );
    }
  }
}

function* processData({ resourceId, processorData, stage }) {
  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    yield put(actions.sampleData.update(resourceId, processedData, stage));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      yield put(
        actions.sampleData.receivedError(resourceId, parsedError, stage)
      );
    }
  }
}

function* transformData({ resourceId, values, stage }) {
  const { data } = yield select(
    getResourceSampleDataWithStatus,
    resourceId,
    stage
  );
  const processorData = values || {};

  processorData.data = data;
  processorData.processor = stage;

  yield call(processData, { resourceId, processorData, stage });
}

function* processRawData({ resourceId, resourceType, values = {}, stage }) {
  if (stage === 'transform') {
    return yield call(transformData, { resourceId, values, stage });
  }

  const { type, file, formValues } = values;

  // Update Raw Data with the file uploaded before parsing
  yield put(
    actions.sampleData.update(resourceId, { data: [{ body: file }] }, 'raw')
  );

  // JSON file does not need parsing
  if (type === 'json') {
    // Update the same JSON file in parse stage as it does not need any parsing
    yield put(
      actions.sampleData.update(resourceId, { data: [{ body: file }] }, 'parse')
    );

    return;
  }

  const processorData = values.editorValues || {};

  processorData.data = file;
  processorData.processor = processorData.processor || PARSERS[type];
  yield call(processData, { resourceId, processorData, stage: 'parse' });
  // Call Transform processor if rules exist for this resource
  const transformRules = getRulesFromResourceFormValues(formValues);

  if (transformRules.length) {
    yield put(
      actions.sampleData.request(
        resourceId,
        resourceType,
        transformRules,
        'transform'
      )
    );
  }
}

function* requestSampleData({
  resourceId,
  resourceType,
  values,
  stage,
  runOffline,
}) {
  if (stage) {
    yield call(processRawData, { resourceId, resourceType, values, stage });
  } else {
    yield call(getPreviewData, {
      resourceId,
      resourceType,
      values,
      runOffline,
    });
  }
}

export default [takeLatest(actionTypes.SAMPLEDATA.REQUEST, requestSampleData)];
