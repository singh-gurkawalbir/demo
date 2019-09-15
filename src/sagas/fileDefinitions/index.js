import { put, takeLatest, call } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

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

function* saveResourceWithDefinitionID({ formValues, definitionId }) {
  const { resourceId, resourceType, values } = formValues;
  const newValues = { ...values };

  newValues['/file/type'] = 'filedefinition';
  newValues['/file/fileDefinition/_fileDefinitionId'] = definitionId;
  yield put(
    actions.resourceForm.submitWithRawData(resourceType, resourceId, newValues)
  );
}

function* addUserSupportedDefinition({ definitionRules, formValues }) {
  try {
    const definition = yield apiCallWithRetry({
      path: '/filedefinitions',
      opts: {
        method: 'POST',
        body: definitionRules,
      },
    });

    yield put(
      actions.fileDefinitions.definition.userSupported.received(definition)
    );
    // Once definition is saved, save the resource with the id
    yield call(saveResourceWithDefinitionID, {
      formValues,
      definitionId: definition._id,
    });
  } catch (e) {
    // Handling Errors with status code between 400 and 500
    // if (e.status >= 400 && e.status < 500) {
    //   const parsedError = JSON.parse(e.message);
    //   yield put(
    //     actions.fileDefinitions.definition.userSupported.receivedError(parsedError)
    //   );
    // }
  }
}

function* updateUserSupportedDefinition({
  definitionId,
  definitionRules,
  formValues,
}) {
  try {
    const definition = yield apiCallWithRetry({
      path: `/filedefinitions/${definitionId}`,
      opts: {
        method: 'PUT',
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
    // if (e.status >= 400 && e.status < 500) {
    //   const parsedError = JSON.parse(e.message);
    //   yield put(
    //     actions.fileDefinitions.definition.userSupported.receivedError(parsedError)
    //   );
    // }
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
    actionTypes.FILE_DEFINITIONS.DEFINITION.USER_SUPPORTED.REQUEST,
    addUserSupportedDefinition
  ),
  takeLatest(
    actionTypes.FILE_DEFINITIONS.DEFINITION.USER_SUPPORTED.UPDATE,
    updateUserSupportedDefinition
  ),
];
