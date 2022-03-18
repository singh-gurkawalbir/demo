import { delay, put, takeEvery, select, call } from 'redux-saga/effects';
import { nanoid } from 'nanoid';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { REVISION_TYPES } from '../../utils/constants';
import { VALID_REVERT_TO_QUERIES, VALID_REVISION_TYPES_FOR_CREATION } from '../../utils/revisions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import inferErrorMessages from '../../utils/inferErrorMessages';

export function* requestIntegrationCloneFamily({ integrationId }) {
  try {
    const cloneFamily = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/clonefamily`,
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.integrationLCM.cloneFamily.received(integrationId, cloneFamily));
  } catch (error) {
    yield put(actions.integrationLCM.cloneFamily.receivedError(integrationId, error));
  }
}

function* createRevision({ integrationId, newRevisionId}) {
  const {type, revisionInfo} = (yield select(selectors.tempRevisionInfo, integrationId, newRevisionId)) || {};
  const { description, integration: cloneIntegrationId, revertToConfig = {}} = revisionInfo || {};

  if (!VALID_REVISION_TYPES_FOR_CREATION.includes(type)) {
    return;
  }

  let path;

  if (type === REVISION_TYPES.SNAPSHOT) {
    path = `/integrations/${integrationId}/revisions/create`;
  } else if (type === REVISION_TYPES.PULL) {
    path = `/integrations/${integrationId}/pull/${cloneIntegrationId}/open`;
  } else {
    const { revertTo, revisionId } = revertToConfig;
    const queryParam = `${VALID_REVERT_TO_QUERIES.includes(revertTo) ? `?${revertTo}=true` : ''}`;

    path = `/integrations/${integrationId}/revisions/${revisionId}/revert/open${queryParam}`;
  }
  try {
    const createdRevision = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: { description },
      },
    });

    yield put(actions.resource.received(`integrations/${integrationId}/revisions`, createdRevision));
    yield put(actions.resource.created(createdRevision._id, newRevisionId));
    yield put(actions.integrationLCM.revision.created(integrationId, newRevisionId));
  } catch (e) {
  // errors
    const errors = inferErrorMessages(e.message);

    yield put(actions.integrationLCM.revision.creationError(integrationId, newRevisionId, errors?.[0]));
  }
}

function* comparePullRequest({ integrationId, revisionId }) {
  try {
    const { revisionInfo = {}} = (yield select(selectors.tempRevisionInfo, integrationId, revisionId)) || {};
    const { integration: cloneIntegrationId } = revisionInfo;
    const resourceDiff = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/pull/${cloneIntegrationId}/compare`,
      opts: {
        method: 'POST',
      },
      hidden: true,
    });

    yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
  } catch (e) {
    const errors = inferErrorMessages(e.message);

    yield put(actions.integrationLCM.compare.receivedDiffError(integrationId, errors?.[0]));
  }
}

function* compareRevertRequest({ integrationId, revisionId }) {
  try {
    const tempRevisionInfo = (yield select(selectors.tempRevisionInfo, integrationId, revisionId)) || {};
    const { revertTo, revisionId: revertToRevisionId } = tempRevisionInfo?.revisionInfo?.revertToConfig;

    const queryParam = `${VALID_REVERT_TO_QUERIES.includes(revertTo) ? `?${revertTo}=true` : ''}`;

    const resourceDiff = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/revisions/${revertToRevisionId}/revert/compare${queryParam}`,
      opts: {
        method: 'POST',
      },
    });

    yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
  } catch (e) {
    const errors = inferErrorMessages(e.message);

    yield put(actions.integrationLCM.compare.receivedDiffError(integrationId, errors?.[0]));
  }
}
function* compareRevisionChanges({ integrationId, revisionId }) {
  try {
    const resourceDiff = yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/revisions/${revisionId}/diff`,
      opts: {
        method: 'POST',
      },
      hidden: true,
    });

    yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
  } catch (e) {
    const errors = inferErrorMessages(e.message);

    yield put(actions.integrationLCM.compare.receivedDiffError(integrationId, errors?.[0]));
  }
}

function* cancelRevision({ integrationId, revisionId }) {
  try {
    yield call(apiCallWithRetry, {
      path: `/integrations/${integrationId}/revisions/${revisionId}/cancel`,
      opts: {
        method: 'POST',
      },
    });

    yield put(actions.resource.request(`integrations/${integrationId}/revisions`, revisionId));
  } catch (e) {
    // errors
  }
}

function* installStep({ revisionId }) {
// const updatedSteps = yield call(apiCallWithRetry, {
  //   path: `/integrations/${integrationId}/revisions/${revisionId}/installSteps`,
  //   opts: {
  //     method: 'POST',
  //   },
  // });
  // Handle updating with new steps also errors
  yield delay(2000);
  yield put(actions.integrationLCM.installSteps.completedStepInstall(revisionId));
}

function* fetchRevisionErrors({integrationId, revisionId }) {
  // const errors = yield call(apiCallWithRetry, {
  //   path: `/integrations/${integrationId}/revisions/${revisionId}/errors`,
  //   opts: {
  //     method: 'GET',
  //   },
  // });
  yield delay(2000);
  const errors = [{
    code: 'version_error',
    message: 'The document you are trying to update has already been updated to a newer version. This happens due to concurrent modifications on an array field in the document. Please get the latest document and try again.The document you are trying to update has already been updated to a newer version. This happens due to concurrent modifications on an array field in the document. Please get the latest document and try again.',
    createdAt: '2022-03-16T15:14:37.786',
  }];

  const errorsList = errors.map(error => ({...error, _id: nanoid()}));

  yield put(actions.integrationLCM.revision.receivedErrors(integrationId, revisionId, errorsList));
}

export default [
  takeEvery(actionTypes.INTEGRATION_LCM.CLONE_FAMILY.REQUEST, requestIntegrationCloneFamily),
  takeEvery(actionTypes.INTEGRATION_LCM.REVISION.CREATE, createRevision),
  takeEvery(actionTypes.INTEGRATION_LCM.REVISION.CREATE_SNAPSHOT, createRevision),
  takeEvery(actionTypes.INTEGRATION_LCM.COMPARE.PULL_REQUEST, comparePullRequest),
  takeEvery(actionTypes.INTEGRATION_LCM.COMPARE.REVERT_REQUEST, compareRevertRequest),
  takeEvery(actionTypes.INTEGRATION_LCM.COMPARE.REVISION_REQUEST, compareRevisionChanges),
  takeEvery(actionTypes.INTEGRATION_LCM.REVISION.CANCEL, cancelRevision),
  takeEvery(actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.INSTALL, installStep),
  takeEvery(actionTypes.INTEGRATION_LCM.REVISION.FETCH_ERRORS, fetchRevisionErrors),
];
