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

    yield put(actions.fileDefinitions.supported.received(fileDefinitions));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      yield put(actions.fileDefinitions.supported.receivedError(parsedError));
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

    yield put(actions.fileDefinitions.userSupported.received(fileDefinitions));
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    if (e.status >= 400 && e.status < 500) {
      const parsedError = JSON.parse(e.message);

      yield put(
        actions.fileDefinitions.userSupported.receivedError(parsedError)
      );
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
      actions.fileDefinitions.definition.supported.received(
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
        actions.fileDefinitions.definition.supported.receivedError(parsedError)
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
      actions.fileDefinitions.definition.userSupported.received(
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
        actions.fileDefinitions.definition.userSupported.receivedError(
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
    actionTypes.FILE_DEFINITIONS.SUPPORTED.REQUEST,
    getFileDefinitions
  ),
  takeLatest(
    actionTypes.FILE_DEFINITIONS.USER_SUPPORTED.REQUEST,
    getUserFileDefinitions
  ),
  takeLatest(
    actionTypes.FILE_DEFINITIONS.DEFINITION.SUPPORTED.UPDATE,
    getDefinition
  ),
  takeLatest(
    [
      actionTypes.FILE_DEFINITIONS.DEFINITION.USER_SUPPORTED.REQUEST,
      actionTypes.FILE_DEFINITIONS.DEFINITION.USER_SUPPORTED.UPDATE,
    ],
    saveUserFileDefinition
  ),
];
