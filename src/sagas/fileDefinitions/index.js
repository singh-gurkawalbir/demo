import { put, takeLatest, call, select } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { SCOPES, saveResourceWithDefinitionID } from '../resourceForm';
import { isNewId, generateNewId } from '../../utils/resource';
import { commitStagedChanges } from '../resources';
import { selectors } from '../../reducers';

/*
 * Fetches all Supported File Definitions
 */
export function* getFileDefinitions() {
  try {
    const fileDefinitions = yield call(apiCallWithRetry, {
      path: '/ui/filedefinitions',
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.fileDefinitions.preBuilt.received(fileDefinitions));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      yield put(actions.fileDefinitions.preBuilt.receivedError(parsedError));
    }
  }
}

/*
 * Fetches definition template ( Parse / Generate rules ) for the selected definitionId
 */
export function* getDefinition({ definitionId, format }) {
  if (!definitionId || !format) {
    return;
  }
  try {
    const definition = yield call(apiCallWithRetry, {
      path: `/ui/filedefinitions/${definitionId}`,
    });

    yield put(
      actions.fileDefinitions.definition.preBuilt.received(
        definition,
        format,
        definitionId
      )
    );
  } catch (e) {
    //  handle errors
  }
}

export function* saveUserFileDefinition({ definitionRules, formValues, flowId, skipClose }) {
  const fileDefinition =
    formValues.resourceType === 'imports'
      ? definitionRules
      : definitionRules.fileDefinition;
  const resourcePath = formValues.resourceType === 'exports' ? definitionRules.resourcePath : '';
  let definitionId = (fileDefinition && fileDefinition._id) || generateNewId();
  const patchSet = jsonPatch.compare({}, fileDefinition);

  yield put(actions.resource.patchStaged(definitionId, patchSet, SCOPES.VALUE));
  yield call(commitStagedChanges, {
    resourceType: 'filedefinitions',
    id: definitionId,
    scope: SCOPES.VALUE,
  });

  if (isNewId(definitionId)) {
    const createdDefinitionId = yield select(selectors.createdResourceId, definitionId);

    if (!createdDefinitionId) {
      // when the above file definitions save call is unsuccessful
      return;
    }
    definitionId = createdDefinitionId;
  }

  const fileDefinitionDetails = {
    definitionId,
    resourcePath,
  };

  // Once definition is saved, save the resource with the id
  yield call(saveResourceWithDefinitionID, {
    formValues,
    fileDefinitionDetails,
    flowId,
    skipClose,
  });
}

export default [
  takeLatest(
    actionTypes.FILE_DEFINITIONS.PRE_BUILT.REQUEST,
    getFileDefinitions
  ),
  takeLatest(
    actionTypes.FILE_DEFINITIONS.DEFINITION.PRE_BUILT.UPDATE,
    getDefinition
  ),
  takeLatest(
    actionTypes.FILE_DEFINITIONS.DEFINITION.USER_DEFINED.SAVE,
    saveUserFileDefinition
  ),
];
