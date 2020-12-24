import { call, put, race, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import { selectors } from '../../../reducers/index';
import commKeyGenerator from '../../../utils/commKeyGenerator';
import getRequestOptions from '../../../utils/requestOptions';
import { isJsonString } from '../../../utils/string';
import { apiCallWithRetry } from '../../index';

const parseErrorMessage = error => {
  // Handling error statuses in  between 400 and 500 to show customized error
  if (error.status === 403 || error.status === 401) {
    return;
  }

  if (error.status >= 400 && error.status < 500) {
    const parsedError = isJsonString(error.message)
      ? JSON.parse(error.message)
      : error.message;

    return parsedError;
  }
};

export function* getNetsuiteOrSalesforceMeta({
  connectionId,
  commMetaPath,
  addInfo,
}) {
  // check if status is set to requested, if not trigger a action to set status = request
  const {status} = yield select(selectors.metadataOptionsAndResources, {connectionId,
    commMetaPath});

  if (status !== 'requested') {
    yield put(actions.metadata.setRequestStatus(connectionId, commMetaPath));
  }
  let path = `/${commMetaPath}`;

  if (addInfo) {
    if (addInfo.refreshCache) {
      path += `${path.indexOf('?') > -1 ? '&' : '?'}refreshCache=true`;
    }

    if (addInfo.query) {
      path += `${path.indexOf('?') > -1 ? '&' : '?'}q=${encodeURIComponent(
        addInfo.query
      )}`;
    }
    if (addInfo.ignoreCache) {
      path += `${path.indexOf('?') > -1 ? '&' : '?'}ignoreCache=true`;
    }
  }

  try {
    if (addInfo && addInfo.bundlePath) {
      const bundleCheckResponse = yield call(apiCallWithRetry, {
        path: `/${addInfo.bundlePath}`,
        opts: {},
        hidden: true,
      });

      if (bundleCheckResponse && !bundleCheckResponse.success) {
        if (bundleCheckResponse.bundleURL) {
          yield put(
            actions.metadata.validationError(
              addInfo.bundleUrlHelp.replace(
                /BUNDLE_URL/g,
                bundleCheckResponse.bundleURL
              ),
              connectionId,
              commMetaPath
            )
          );
        }

        return undefined;
      }
    }

    const metadata = yield call(apiCallWithRetry, {
      path,
      opts: {},
      message: 'Loading',
    });

    // Handle Errors sent as part of response object  with status 200
    if (metadata && metadata.errors) {
      yield put(
        actions.metadata.receivedError(
          metadata.errors[0] && metadata.errors[0].message,
          connectionId,
          commMetaPath
        )
      );
    } else {
      yield put(
        actions.metadata.receivedCollection(
          metadata,
          connectionId,
          commMetaPath
        )
      );
    }

    return metadata;
  } catch (error) {
    const parsedError = parseErrorMessage(error);

    yield put(
      actions.metadata.receivedError(
        parsedError && parsedError[0] && parsedError[0].message,
        connectionId,
        commMetaPath
      )
    );
  }
}

export function* getNetsuiteOrSalesforceBundleInstallStatus({connectionId}) {
  const commMetaPath = `connections/${connectionId}/distributedApps`;
  const path = `/${commMetaPath}`;

  yield put(actions.metadata.setRequestStatus(connectionId, commMetaPath));

  try {
    const bundleInstallResponse = yield call(apiCallWithRetry, {
      path,
      opts: {},
      hidden: true,
    });

    if (bundleInstallResponse?.errors) {
      yield put(actions.metadata.receivedError(
        bundleInstallResponse.errors[0]?.message,
        connectionId,
        commMetaPath,
      ));
    } else {
      yield put(actions.metadata.receivedCollection(
        bundleInstallResponse,
        connectionId,
        commMetaPath,
      ));
    }
  } catch (error) {
    const parsedError = parseErrorMessage(error);

    yield put(
      actions.metadata.receivedError(
        parsedError && parsedError[0] && parsedError[0].message,
        connectionId,
        commMetaPath
      )
    );
  }
}

export function* getNetsuiteOrSalesforceMetaTakeLatestPerAction(params) {
  const {
    connectionId,
    commMetaPath,
  } = params;

  yield race({
    getMetadata: call(getNetsuiteOrSalesforceMeta, params),
    abortMetadata: take(
      action =>
        action.type === actionTypes.METADATA.REFRESH &&
        action.connectionId === connectionId &&
        action.commMetaPath === commMetaPath,
    ),
  });
}

export function* requestAssistantMetadata({ adaptorType = 'rest', assistant }) {
  const { path, opts } = getRequestOptions(
    actionTypes.METADATA.ASSISTANT_REQUEST,
    {
      resourceId: assistant,
      adaptorType,
    }
  );
  const commStatus = yield select(
    selectors.commStatusByKey,
    commKeyGenerator(path, opts.method)
  );

  if (commStatus && commStatus.status !== COMM_STATES.ERROR) {
    return;
  }

  let metadata;

  try {
    metadata = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return;
  }

  yield put(
    actions.assistantMetadata.received({
      adaptorType,
      assistant,
      metadata,
    })
  );

  return metadata;
}

export default [
  takeEvery(actionTypes.METADATA.REQUEST, getNetsuiteOrSalesforceMeta),
  takeEvery(actionTypes.METADATA.REFRESH, getNetsuiteOrSalesforceMetaTakeLatestPerAction),
  takeEvery(actionTypes.METADATA.ASSISTANT_REQUEST, requestAssistantMetadata),
  takeLatest(actionTypes.METADATA.BUNDLE_INSTALL_STATUS, getNetsuiteOrSalesforceBundleInstallStatus),
];
