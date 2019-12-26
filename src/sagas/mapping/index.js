import { call, takeEvery, put, select } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import * as selectors from '../../reducers';
import { commitStagedChanges } from '../resources';
import mappingUtil from '../../utils/mapping';
import lookupUtil from '../../utils/lookup';

export function* saveMappings({ id }) {
  const patch = [];
  const {
    mappings,
    generateFields,
    application,
    isGroupedSampleData,
    lookups,
    adaptorType,
    resource,
  } = yield select(selectors.mapping, id);
  let _mappings = mappings.map(
    ({ index, hardCodedValueTmp, rowIdentifier, ...others }) => others
  );

  _mappings = mappingUtil.generateMappingsForApp({
    mappings: _mappings,
    generateFields,
    appType: application,
    isGroupedSampleData,
    resource,
  });
  const { _id: resourceId } = resource;
  const mappingPath = mappingUtil.getMappingPath(adaptorType);

  // _mappings[0].generate = undefined;
  patch.push({
    op: _mappings ? 'replace' : 'add',
    path: mappingPath,
    value: _mappings,
  });

  if (lookups) {
    const lookupPath = lookupUtil.getLookupPath(adaptorType);

    patch.push({
      op: lookups ? 'replace' : 'add',
      path: lookupPath,
      value: lookups,
    });
  }

  yield put(actions.resource.patchStaged(resourceId, patch, SCOPES.VALUE));

  const error = yield call(commitStagedChanges, {
    resourceType: 'imports',
    id: resourceId,
    scope: SCOPES.VALUE,
  });

  if (error) return yield put(actions.mapping.saveFailed(id));

  yield put(actions.mapping.saveComplete(id));
  // yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE));
  // yield put(actions.resource.commitStaged(resourceType, resourceId, 'value'));
  // const mappingPath = mappingUtil.getMappingPath(adaptorType);
  // patchSet.push({
  //   op: mappings ? 'replace' : 'add',
  //   path: mappingPath,
  //   value: mappings,
  // });
  // // update _lookup only if its being passed as param to function
  // if (lookups) {
  //   const lookupPath = lookupUtil.getLookupPath(adaptorType);
  //   patchSet.push({
  //     op: lookups ? 'replace' : 'add',
  //     path: lookupPath,
  //     value: lookups,
  //   });
  // }
  // dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
  // dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
}

export const mappingSagas = [takeEvery(actionTypes.MAPPING.SAVE, saveMappings)];
