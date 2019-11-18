import { put, takeLatest, call, select } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { SCOPES, saveResourceWithDefinitionID } from '../resourceForm';
import { isNewId, generateNewId } from '../../utils/resource';
import { commitStagedChanges } from '../resources';
import * as selectors from '../../reducers';

/*
 * Fetches all Supported File Definitions
 */
function* getFileDefinitions() {
  try {
    const fileDefinitions = yield apiCallWithRetry({
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
function* getDefinition({ definitionId, format }) {
  try {
    const definition = yield apiCallWithRetry({
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
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      yield put(
        actions.fileDefinitions.definition.preBuilt.receivedError(parsedError)
      );
    }
  }
}

function* saveUserFileDefinition({ definitionRules, formValues }) {
  const fileDefinition =
    formValues.resourceType === 'imports'
      ? definitionRules
      : definitionRules.fileDefinition;
  let definitionId = (fileDefinition && fileDefinition._id) || generateNewId();
  const patchSet = jsonPatch.compare({}, fileDefinition);

  yield put(actions.resource.patchStaged(definitionId, patchSet, SCOPES.VALUE));
  yield call(commitStagedChanges, {
    resourceType: 'filedefinitions',
    id: definitionId,
    scope: SCOPES.VALUE,
  });

  if (isNewId(definitionId)) {
    definitionId = yield select(selectors.createdResourceId, definitionId);
  }

  // // Once definition is saved, save the resource with the id
  yield call(saveResourceWithDefinitionID, {
    formValues,
    definitionId,
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
