import { put, takeLatest, select } from 'redux-saga/effects';
import actions from '../../../actions';
import { resourceOpenErrors } from '../../../reducers';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

function* requestOpenErrorDetails({ flowId, resourceId, loadMore = false }) {
  try {
    let path = `/flows/${flowId}/${resourceId}/errors`;

    if (loadMore) {
      const { nextPageURL } = yield select(resourceOpenErrors, {
        flowId,
        resourceId,
      });

      if (!nextPageURL) return;
      path = nextPageURL.replace('/api', '');
    }

    const openErrors = yield apiCallWithRetry({
      path,
      opts: {
        method: 'GET',
      },
    });

    yield put(
      actions.errorManager.flowErrorDetails.open.received({
        flowId,
        resourceId,
        openErrors,
        loadMore,
      })
    );
  } catch (error) {
    actions.errorManager.flowErrorDetails.open.error({
      flowId,
      error,
    });
  }
}

function* requestResolvedErrorDetails({ flowId, resourceId }) {
  try {
    const resolvedErrors = yield apiCallWithRetry({
      path: `/flows/${flowId}/${resourceId}/resolved`,
      opts: {
        method: 'GET',
      },
    });

    yield put(
      actions.errorManager.flowErrorDetails.resolved.received({
        flowId,
        resourceId,
        resolvedErrors,
      })
    );
  } catch (error) {
    actions.errorManager.flowErrorDetails.resolved.error({
      flowId,
      error,
    });
  }
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.OPEN.REQUEST,
    requestOpenErrorDetails
  ),
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RESOLVED.REQUEST,
    requestResolvedErrorDetails
  ),
];
