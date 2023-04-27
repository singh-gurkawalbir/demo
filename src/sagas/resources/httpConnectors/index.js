import { call, put, takeEvery, select } from 'redux-saga/effects';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import {getHTTPConnectorMetadata} from '../../utils';

export function* getConnector({ httpConnectorId, message, hidden }) {
  const path = `/httpconnectors/${httpConnectorId}`;

  try {
    const connector = yield call(apiCallWithRetry, { path, message, hidden });

    yield put(actions.httpConnectors.receivedConnector({httpConnectorId, connector}));

    return connector;
  } catch (error) {
    return undefined;
  }
}
export function* getConnectorMetadata({ connectionId, httpConnectorId, httpVersionId, httpConnectorApiId, message, hidden }) {
  const path = `/httpconnectors/${httpConnectorId}?returnEverything=true`;
  const connection = yield select(selectors.resource, 'connections', connectionId);

  const connectionVersion = connection?.http?._httpConnectorVersionId;
  const connectionAPI = connection?.http?._httpConnectorApiId;

  try {
    const connectorMetadata = yield call(apiCallWithRetry, { path, message, hidden });

    const metadata = getHTTPConnectorMetadata(connectorMetadata, connectionVersion, connectionAPI);

    yield put(actions.httpConnectors.receivedMetadata({httpConnectorId, httpVersionId, httpConnectorApiId, metadata}));

    return metadata;
  } catch (error) {
    return undefined;
  }
}

export default [
  takeEvery(actionTypes.HTTP_CONNECTORS.REQUEST_CONNECTOR, getConnector),
  takeEvery(actionTypes.HTTP_CONNECTORS.REQUEST_METADATA, getConnectorMetadata),
];
