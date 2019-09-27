import { put, takeLatest, call } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { saveResourceWithDefinitionID } from '../resourceForm';

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
 * Fetches all User Defined File Definitions
 */
function* getUserFileDefinitions() {
  try {
    const fileDefinitions = yield apiCallWithRetry({
      path: '/filedefinitions',
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.fileDefinitions.userDefined.received(fileDefinitions));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      yield put(actions.fileDefinitions.userDefined.receivedError(parsedError));
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

/*
 * Adds to the list of User Supported file definitions if it is a new Definition
 * Else, updates definition based on definitionId passed
 */
function* saveUserFileDefinition({
  definitionId,
  definitionRules,
  formValues,
}) {
  const path = `/filedefinitions${definitionId ? `/${definitionId}` : ''}`;
  const method = definitionId ? 'PUT' : 'POST';

  try {
    const definition = yield apiCallWithRetry({
      path,
      opts: {
        method,
        body: definitionRules,
      },
    });

    yield put(
      actions.fileDefinitions.definition.userDefined.received(
        definition,
        definitionId
      )
    );
    // Once definition is saved, save the resource with the id
    yield call(saveResourceWithDefinitionID, {
      formValues,
      definitionId: definition._id,
    });
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      yield put(
        actions.fileDefinitions.definition.userDefined.receivedError(
          parsedError
        )
      );
    }

    // Skip saving file definition id and save resource on error
    const { resourceId, resourceType, values } = formValues;

    yield put(
      actions.resourceForm.submitWithRawData(resourceType, resourceId, values)
    );
  }
}

export default [
  takeLatest(
    actionTypes.FILE_DEFINITIONS.PRE_BUILT.REQUEST,
    getFileDefinitions
  ),
  takeLatest(
    actionTypes.FILE_DEFINITIONS.USER_DEFINED.REQUEST,
    getUserFileDefinitions
  ),
  takeLatest(
    actionTypes.FILE_DEFINITIONS.DEFINITION.PRE_BUILT.UPDATE,
    getDefinition
  ),
  takeLatest(
    [
      actionTypes.FILE_DEFINITIONS.DEFINITION.USER_DEFINED.REQUEST,
      actionTypes.FILE_DEFINITIONS.DEFINITION.USER_DEFINED.UPDATE,
    ],
    saveUserFileDefinition
  ),
];
