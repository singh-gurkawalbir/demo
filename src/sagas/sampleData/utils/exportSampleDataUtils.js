import { deepClone, applyPatch } from 'fast-json-patch';
import { select, call, put } from 'redux-saga/effects';
import { selectors } from '../../../reducers';
import { DEFAULT_RECORD_SIZE } from '../../../utils/exportPanel';
import { createFormValuesPatchSet, SCOPES } from '../../resourceForm';
import { evaluateExternalProcessor } from '../../editor';
import actions from '../../../actions';

export function* getSampleDataRecordSize({ resourceId }) {
  const recordSize = yield select(selectors.sampleDataRecordSize, resourceId) || DEFAULT_RECORD_SIZE;

  return recordSize;
}

export function* constructResourceFromFormValues({
  formValues = {},
  resourceId,
  resourceType,
}) {
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values: formValues,
    scope: SCOPES.VALUE,
  });
  const { merged } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    SCOPES.VALUE
  );

  try {
    return applyPatch(merged ? deepClone(merged) : {}, deepClone(patchSet))
      .newDocument;
  } catch (e) {
    return {};
  }
}

export function* getProcessorOutput({ processorData }) {
  try {
    const processedData = yield call(evaluateExternalProcessor, {
      processorData,
    });

    return { data: processedData };
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      return {error: parsedError};
    }
  }
}

/**
* Given list of stages mapped with data to be saved against it
* Triggers action that saves each stage with data on resource's sample data
*/
export function* updateDataForStages({resourceId, dataForEachStageMap }) {
  const stages = Object.keys(dataForEachStageMap);

  for (let stageIndex = 0; stageIndex < stages.length; stageIndex += 1) {
    const stage = stages[stageIndex];
    const stageData = dataForEachStageMap[stage];

    yield put(actions.sampleData.update(resourceId, stageData, stage));
  }
}

/**
 * Checks if the constructed body from formValues has same file type as saved resource
 * and if body has sampleData
 */
export function* hasSampleDataOnResource({ resourceId, resourceType, body }) {
  const resource = yield select(selectors.resource, resourceType, resourceId);

  if (!resource || !body.sampleData) return false;
  const resourceFileType = resource?.file?.type;
  const bodyFileType = body?.file?.type;

  if (
    ['filedefinition', 'fixed', 'delimited/edifact'].includes(bodyFileType) &&
      resourceFileType === 'filedefinition'
  ) {
    return true;
  }

  return bodyFileType === resourceFileType;
}
