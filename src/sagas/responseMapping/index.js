import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import shortid from 'shortid';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import { selectors } from '../../reducers';
import { commitStagedChanges } from '../resources';
import responseMappingUtil from '../../utils/responseMapping';

export function* responseMappingInit({ flowId, resourceId }) {
  const { merged: flow = {} } = yield select(
    selectors.resourceData,
    'flows',
    flowId
  );
  const pageProcessor = flow?.pageProcessors.find(({_importId, _exportId}) => _exportId === resourceId || _importId === resourceId);

  if (!pageProcessor) {
    return yield put(actions.responseMapping.initFailed());
  }
  const isImport = pageProcessor.type === 'import';

  if (isImport) {
    // check if responseMappingExtract is loaded
    const {data: extractFields} = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      stage: 'responseMappingExtract',
      resourceType: 'imports',
    });

    if (!extractFields) {
      // fetch can be made in parallel without masking response mapping
      yield put(actions.flowData.requestSampleData(
        flowId,
        resourceId,
        'imports',
        'responseMappingExtract',
      ));
    }
  }
  const mappings = responseMappingUtil.getFieldsAndListMappings(pageProcessor.responseMapping);

  yield put(
    actions.responseMapping.initComplete({
      mappings: mappings.map(m => ({
        ...m,
        key: shortid.generate(),
      })),
      flowId,
      resourceId,
      resourceType: isImport ? 'imports' : 'exports',
    })
  );
}

export function* responseMappingSave() {
  const { mappings, flowId, resourceId } = yield select(selectors.responseMapping);
  const { merged: flow = {} } = yield select(
    selectors.resourceData,
    'flows',
    flowId
  );
  const pageProcessorIndex = flow?.pageProcessors.findIndex(({_importId, _exportId}) => _exportId === resourceId || _importId === resourceId);

  if (!flow?.pageProcessors || pageProcessorIndex === -1) {
    return yield put(actions.responseMapping.saveFailed());
  }
  const patchSet = [];
  const mappingsWithListsAndFields = responseMappingUtil.generateMappingFieldsAndList(
    mappings
  );

  patchSet.push({
    op: 'replace',
    path: `/pageProcessors/${pageProcessorIndex}/responseMapping`,
    value: mappingsWithListsAndFields,
  });

  yield put(actions.resource.patchStaged(flowId, patchSet, SCOPES.VALUE));
  const resp = yield call(commitStagedChanges, {
    resourceType: 'flows',
    id: flowId,
    scope: SCOPES.VALUE,
  });

  // trigger save failed in case of error
  if (resp?.error) {
    return yield put(actions.responseMapping.saveFailed());
  }

  // trigger save complete in case of success
  yield put(actions.responseMapping.saveComplete());
}

export const responseMappingSagas = [
  takeLatest(actionTypes.RESPONSE_MAPPING.INIT, responseMappingInit),
  takeEvery(actionTypes.RESPONSE_MAPPING.SAVE, responseMappingSave),

];
