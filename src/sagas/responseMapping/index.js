import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import * as selectors from '../../reducers';
import { commitStagedChanges } from '../resources';
import responseMappingUtil from '../../utils/responseMapping';

export function* getResponseMappingFromFlow({ id, value }) {
  const { resourceIndex, flowId } = value;
  const { merged: flow = {} } = yield select(
    selectors.resourceData,
    'flows',
    flowId
  );

  if (flow) {
    const pageProcessor = flow.pageProcessors[resourceIndex];
    const { responseMapping } = pageProcessor || {};
    const formattedResponseMapping = responseMappingUtil.getFieldsAndListMappings(
      responseMapping
    );

    yield put(
      actions.responseMapping.setFormattedMapping(id, formattedResponseMapping)
    );
  }
}

export function* saveResponseMapping({ id }) {
  const { resourceIndex, flowId, mappings } = yield select(
    selectors.getResponseMapping,
    id
  );
  const patchSet = [];
  const _mappings = mappings.map(({ rowIdentifier, ...others }) => others);
  const mappingsWithListsAndFields = responseMappingUtil.generateMappingFieldsAndList(
    _mappings
  );

  patchSet.push({
    op: 'replace',
    path: `/pageProcessors/${resourceIndex}/responseMapping`,
    value: mappingsWithListsAndFields,
  });

  yield put(actions.resource.patchStaged(flowId, patchSet, SCOPES.VALUE));
  const error = yield call(commitStagedChanges, {
    resourceType: 'flows',
    id: flowId,
    scope: SCOPES.VALUE,
  });

  // trigger save failed in case of error
  // TODO check error format and save it
  if (error) yield put(actions.responseMapping.saveFailed(id));

  // trigger save complete in case of success
  yield put(actions.responseMapping.saveComplete(id));
}

export const responseMappingSagas = [
  takeEvery(actionTypes.RESPONSE_MAPPING.SAVE, saveResponseMapping),
  takeLatest(actionTypes.RESPONSE_MAPPING.INIT, getResponseMappingFromFlow),
];
