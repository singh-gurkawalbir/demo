import { put, takeLatest, select } from 'redux-saga/effects';
import actions from '../../../actions';
import { resourceErrors } from '../../../reducers';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

function* requestErrorDetails({
  flowId,
  resourceId,
  loadMore = false,
  isResolved = false,
}) {
  try {
    let path = `/flows/${flowId}/${resourceId}/${
      isResolved ? 'resolved' : 'errors'
    }`;

    if (loadMore) {
      const { nextPageURL } = yield select(resourceErrors, {
        flowId,
        resourceId,
      });

      if (!nextPageURL) return;
      path = nextPageURL.replace('/api', '');
    }

    const errorDetails = yield apiCallWithRetry({
      path,
      opts: {
        method: 'GET',
      },
    });

    yield put(
      actions.errorManager.flowErrorDetails.received({
        flowId,
        resourceId,
        errorDetails,
        loadMore,
        isResolved,
      })
    );
  } catch (error) {
    actions.errorManager.flowErrorDetails.error({
      flowId,
      error,
      isResolved,
    });
  }
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST,
    requestErrorDetails
  ),
];
