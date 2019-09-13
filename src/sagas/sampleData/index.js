import { takeLatest, put, select, call } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { resourceData, getResourceSampleDataWithStatus } from '../../reducers';
import { createFormValuesPatchSet, SCOPES } from '../resourceForm';

/*
 * Parsers for different file types used for converting into JSON format
 * For XLSX Files , this saga receives converted csv content as input
 * so it uses same csv parser
 */
const PARSERS = {
  csv: '/processors/csvParser',
  xlsx: '/processors/csvParser',
  xml: '/processors/xmlParser',
  fileDefinition: '/processors/structuredFileParser',
};

function getRulesFromResourceFormValues(formValues = {}) {
  if (!formValues['/transform']) return [];
  const transformRules = formValues['/transform'].rules;

  return transformRules && transformRules.length ? transformRules : [];
}

function* getPreviewData({ resourceId, resourceType, values, fetchFromDB }) {
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

  if (fetchFromDB) {
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

function* processData({ resourceId, stage, path, body }) {
  try {
    const processedData = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body,
      },
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

function* getProcessorData({ resourceId, values, stage }) {
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

  yield call(processData, { resourceId, stage, path, body });
}

function* processFileData({ resourceId, resourceType, values }) {
  if (!values) return undefined;
  const { file, type, rules, formValues } = values;

  // Update Raw Data with the file uploaded before parsing
  yield put(
    actions.sampleData.update(resourceId, { data: [{ body: file }] }, 'raw')
  );

  // JSON file does not need parsing
  if (type === 'json') return;
  // For file types : csv, xlsx and xml files
  const body = {
    rules: rules || {},
    data: file,
    options: {
      includeEmptyValues: true,
    },
  };
  const path = PARSERS[type];

  // Parse file content using processors
  yield call(processData, { resourceId, stage: 'parse', path, body });

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
  fetchFromDB,
}) {
  // Call preview/processor based on stage
  // If stage is specified make a processor call else preview
  // Takes a different route for File processors
  if (stage) {
    if (stage === 'file') {
      yield call(processFileData, { resourceId, resourceType, values });
    } else {
      yield call(getProcessorData, { resourceId, resourceType, values, stage });
    }
  } else {
    yield call(getPreviewData, {
      resourceId,
      resourceType,
      values,
      fetchFromDB,
    });
  }
}

export default [takeLatest(actionTypes.SAMPLEDATA.REQUEST, requestSampleData)];
