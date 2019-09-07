import { put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

function* getFileDefinitionsMeta() {
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

function* getDefinitionMeta({ definitionId, format }) {
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

export default [
  takeLatest(
    actionTypes.FILE_DEFINITIONS.SUPPORTED.REQUEST,
    getFileDefinitionsMeta
  ),
  takeLatest(
    actionTypes.FILE_DEFINITIONS.DEFINITION.SUPPORTED.UPDATE,
    getDefinitionMeta
  ),
];
