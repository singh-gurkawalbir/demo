import { delay, put, takeEvery, select } from 'redux-saga/effects';
import { nanoid } from 'nanoid';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { REVISION_STATUS, REVISION_TYPES } from '../../utils/constants';
import actionTypes from '../../actions/types';
// import { apiCallWithRetry } from '../index';
import conflicts from '../../components/ResourceDiffVisualizer/samples/conflicts.json';
// import conflictsWithScript from '../../components/ResourceDiffVisualizer/samples/conflictsWithScript.json';
// import diff from '../../components/ResourceDiffVisualizer/samples/diff.json';
// import diffWithScript from '../../components/ResourceDiffVisualizer/samples/diffWithScript.json';

export function* requestIntegrationCloneFamily({ integrationId }) {
  try {
    // const cloneFamily = yield call(apiCallWithRetry, {
    //   path: `/integrations/${integrationId}/clonefamily`,
    //   opts: {
    //     method: 'GET',
    //   },
    // });
    const cloneFamily = [
      {
        _id: '6203b066887b312cb0811c92',
        name: 'Clone Integration using /clone route',
        sandbox: false,
      },
      {
        _id: '6203c20df06fd655e212980f',
        name: 'Clone - Master Integration',
        sandbox: false,
      },
      {
        _id: '6203f8e896c8fccb83c4cc0e',
        name: 'clone now',
        sandbox: false,
      },
    ];

    yield delay(2000);
    yield put(actions.integrationLCM.cloneFamily.received(integrationId, cloneFamily));
  } catch (error) {
    yield put(actions.integrationLCM.cloneFamily.receivedError(integrationId, error));
  }
}

function* createRevision({ integrationId, newRevisionId}) {
  const {type, revisionInfo} = (yield select(selectors.tempRevisionInfo, integrationId, newRevisionId)) || {};
  const { description } = revisionInfo || {};
  // const VALID_REVERT_TO_QUERIES = ['toAfter', 'toBefore'];

  // const createdRevision = yield call(apiCallWithRetry, {
  //   path: `/integrations/${integrationId}/pull/${cloneIntegrationId}/open`,
  //   opts: {
  //     method: 'POST',
  //     body: { description },
  //   },
  // });
  // const { revertTo, revisionId } = revertToConfig;
  // const queryParam = `${VALID_REVERT_TO_QUERIES.includes(revertTo) ? `?${revertTo}=true` : ''}`;
  // const createdRevision = yield call(apiCallWithRetry, {
  //   path: `/integrations/${integrationId}/revisions/${revisionId}/revert/open${queryParam}`,
  //   opts: {
  //     method: 'POST',
  //     body: { description },
  //   },
  // });
  const createdRevision = {
    _id: nanoid(),
    description,
    _byUserId: '609276382b22fe4803a3589e',
    createdAt: new Date().toISOString(),
    status: type === REVISION_TYPES.SNAPSHOT ? REVISION_STATUS.COMPLETED : REVISION_STATUS.IN_PROGRESS,
    type,
    _integrationId: integrationId,
    fromIntegrationIsSandbox: false,
    beforeRevisionHash: '123456789',
    installSteps: [],
  };

  yield delay(2000);
  yield put(actions.resource.received(`integrations/${integrationId}/revisions`, createdRevision));
  yield put(actions.resource.created(createdRevision._id, newRevisionId));
  yield put(actions.integrationLCM.revision.created(integrationId, newRevisionId));
}

function* comparePullRequest({ integrationId }) {
  // const { revisionInfo = {}} = (yield select(selectors.tempRevisionInfo, integrationId, revisionId)) || {};
  // const { integration: cloneIntegrationId } = revisionInfo;
  // const resourceDiff = yield call(apiCallWithRetry, {
  //   path: `/integrations/${integrationId}/pull/${cloneIntegrationId}/compare`,
  //   opts: {
  //     method: 'POST',
  //   },
  // });
  yield delay(2000);
  const resourceDiff = conflicts;

  yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
}

function* compareRevertRequest({ integrationId }) {
  // const resourceDiff = yield call(apiCallWithRetry, {
  //   path: `/integrations/${integrationId}/revisions/${revisionId}/revert/compare`,
  //   opts: {
  //     method: 'POST',
  //   },
  // });
  yield delay(2000);
  const resourceDiff = conflicts;

  yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
}
function* compareRevisionChanges({ integrationId }) {
  // const resourceDiff = yield call(apiCallWithRetry, {
  //   path: `/integrations/${integrationId}/revisions/${revisionId}/diff`,
  //   opts: {
  //     method: 'POST',
  //   },
  // });
  yield delay(2000);
  const resourceDiff = conflicts;

  yield put(actions.integrationLCM.compare.receivedDiff(integrationId, resourceDiff));
}

function* cancelRevision({ integrationId, revisionId }) {
  const revision = yield select(selectors.revision, integrationId, revisionId);

  // const resourceDiff = yield call(apiCallWithRetry, {
  //   path: `/integrations/${integrationId}/revisions/${revisionId}/cancel`,
  //   opts: {
  //     method: 'POST',
  //   },
  // });
  yield delay(2000);
  const updatedRevision = {...revision, status: REVISION_STATUS.CANCELED};

  // yield put(actions.resource.request(`integrations/${integrationId}/revisions`, revisionId));
  yield put(actions.resource.received(`integrations/${integrationId}/revisions`, updatedRevision));
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
    message: 'The document you are trying to update has already been updated to a newer version. This happens due to concurrent modifications on an array field in the document. Please get the latest document and try again.',
    createdAt: '2022-03-16T15:14:37.786',
  }];

  yield put(actions.integrationLCM.revision.receivedErrors(integrationId, revisionId, errors));
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
