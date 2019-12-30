import { takeLatest, put, select, call } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { resourceData, getResourceSampleDataWithStatus } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';
import { evaluateExternalProcessor } from '../../sagas/editor';
import { getCsvFromXlsx } from '../../utils/file';
import { processJsonSampleData } from '../../utils/sampleData';

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
      hidden: true,
    });

    yield put(actions.sampleData.received(resourceId, previewData));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status === 403 || e.status === 401) {
      return;
    }

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

  const { type, formValues } = values;
  let { file } = values;

  // Update Raw Data with the file uploaded before parsing
  yield put(
    actions.sampleData.update(resourceId, { data: [{ body: file }] }, 'raw')
  );

  // JSON file does not need parsing
  if (type === 'json') {
    // Update the parsed JSON file in parse stage
    yield put(
      actions.sampleData.update(
        resourceId,
        { data: [{ body: processJsonSampleData(file) }] },
        'parse'
      )
    );

    return;
  }

  // For xlsx file , content gets converted to 'csv' before parsing
  if (type === 'xlsx') {
    const { result } = getCsvFromXlsx(file);

    file = result;
    // Saving csv file content for xlsx in sample data for future use
    // Incase of FTP Imports, sampleData field in resource expects 'csvContent' for xlsx file upload to be saved
    yield put(
      actions.sampleData.update(resourceId, { data: [{ body: file }] }, 'csv')
    );
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
