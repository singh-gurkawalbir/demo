import { takeEvery, select, call } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import { selectors } from '../../../reducers';
import * as gainsight from '../../../utils/analytics/gainsight';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../constants/resource';
import { getResourceSubType, resourceCategory } from '../../../utils/resource';

export function* identifyUser() {
  const profile = yield select(
    selectors.userProfile
  );
  const user = yield select(selectors.ownerUser);
  const { _id, name, email, createdAt } = profile || {};
  const [firstName, ...lastName] = (name || '').split(' ');
  const accountInfo = {
    id: user?._id,
    name: user?.company || user?.name,
  };
  const userInfo = {
    id: `${accountInfo.id}_${_id}`,
    _userId: _id,
    email,
    firstName,
    lastName: lastName.join(' '),
    signUpDate: createdAt ? new Date(createdAt).getTime() : '',
  };

  gainsight.identify(userInfo, accountInfo);
}

export function trackEvent({ eventId, details }) {
  gainsight.track(eventId, details);
}

export function* trackResourceCreatedEvent({ id, resourceType }) {
  const resource = yield select(selectors.resource, resourceType, id);
  const resourceTypeSingular = RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType];

  if (!resourceTypeSingular) {
    return true;
  }

  /**
   * TODO We need to update this to get the required details for each resource type
   * once https://celigo.atlassian.net/browse/IO-10222 is updated with required details.
   */
  const details = getResourceSubType(resource);

  gainsight.track(`${resourceTypeSingular.toUpperCase()}_CREATED`, details);
  // per PM request we are sending flow/conn events under different name in addition
  if (resourceTypeSingular === 'flow' || resourceTypeSingular === 'connection') {
    gainsight.track(`CUSTOM_${resourceTypeSingular.toUpperCase()}_CREATED`, details);
  }
}

const locationFromMatch = m => {
  if (!m || !m.url) return 'unknown';
  if (m.url.endsWith('/dashboard')) return 'integrationDashboard';
  if (m.url.includes('/flowBuilder/')) return 'runDashboard';
  if (m.url.endsWith('/viewErrors')) return 'errorDrawer';

  return 'unknown';
};

const trackResolve = a => {
  gainsight.track('CUSTOM_RESOLVE_ERRORS', {
    where: locationFromMatch(a.match),
  });
};

const trackRetry = a => {
  gainsight.track('CUSTOM_RETRY_ERRORS', {
    where: locationFromMatch(a.match),
  });
};

function* getFlowStepInfo(flowId, resourceType, resourceId) {
  const out = {};

  if (!flowId || !resourceId || !resourceId) return out;
  const flow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;

  if (!flow) return out;
  const res = (yield select(selectors.resourceData, resourceType, resourceId))?.merged;

  if (!res) return out;
  const p = (flow.pageProcessors || []).find(pp => pp._exportId === resourceId);
  const isLookup = !!p;
  const isImport = resourceType === 'imports';

  out.bubbleType = resourceCategory(res, isLookup, isImport);
  let tempBubbleConnector = res.adaptorType;

  if (res._connectionId) {
    const conn = (yield select(selectors.resourceData, 'connections', res._connectionId))?.merged;

    tempBubbleConnector = conn?.assistant || conn?.type || tempBubbleConnector;
  }
  out.bubbleConnector = tempBubbleConnector;

  return out;
}

function* trackFormSubmit(a) {
  const url = a?.match?.url || '';

  let entry;

  if (url.includes('/flowBuilder/')) entry = 'flowBuilder';
  else if (url.includes('/flows/')) entry = 'flowsList';
  if (!entry) return;

  let mt;

  if (a.type === actionTypes.MAPPING.SAVE) mt = 'mapping';
  else if (a.type === actionTypes.RESPONSE_MAPPING.SAVE) mt = 'responseMapping';

  if (!mt && entry !== 'flowBuilder') return;

  const flowId = a?.flowId || a?.match?.params?.flowId;
  let { resourceId = '', resourceType } = a;

  if (!resourceType || !resourceId) {
    const { exportId, importId, resourceType: rt, id } = a?.match?.params || {};

    if (rt && id) {
      resourceType = rt;
      resourceId = id;
    } else if (exportId) {
      resourceType = 'exports';
      resourceId = exportId;
    } else if (importId) {
      resourceType = 'imports';
      resourceId = importId;
    }
  }
  const { bubbleType, bubbleConnector } = yield call(getFlowStepInfo, flowId, resourceType, resourceId);

  if (a.type === actionTypes.MAPPING.SAVE || a.type === actionTypes.RESPONSE_MAPPING.SAVE) {
    gainsight.track('CUSTOM_FLOWMAPPING_EDITED', {
      flowId,
      bubbleConnector,
      mappingType: mt,
      entryPoint: entry,
    });

    return;
  }

  const op = a?.match?.params?.operation;

  // even for adding a new bubble, the final save click is an edit
  // with the exception that the id looks like 'new-someid'
  if (flowId && op === 'edit') {
    if (resourceId.startsWith('new-')) {
      gainsight.track('CUSTOM_FLOWSTEP_ADDED', {
        flowId,
        bubbleType,
        bubbleConnector,
      });
    } else {
      gainsight.track('CUSTOM_FLOWSTEP_EDIT_SAVE', {
        flowId,
        bubbleType,
        bubbleConnector,
      });
    }
  }
}

function* trackEditorSave({ context: a }) {
  const url = a?.match?.url || '';

  if (!url.includes('/flowBuilder/')) return;
  let flowId = a?.flowId;

  if (!flowId) {
    const m = url.match(/flowBuilder\/(\w+?)\//i);

    flowId = m?.[1];
  }
  // eslint-disable-next-line prefer-const
  let { editorType, resourceType, resourceId, pageProcessorsObject: ppObj } = a?.editor || {};

  if (!editorType) return;
  if (editorType === 'postResponseMapHook' && (!resourceType || !resourceId) && ppObj) {
    resourceType = 'imports';
    resourceId = ppObj._importId;
  }
  if (!resourceType || !resourceId) return;
  const { bubbleType, bubbleConnector } = yield call(getFlowStepInfo, flowId, resourceType, resourceId);

  gainsight.track('CUSTOM_FLOWPROCESSOR_EDITED', {
    flowId,
    bubbleType,
    bubbleConnector,
    editorType,
  });
}

function* trackHookSave(a) {
  const url = a?.match?.url || '';

  if (!url.includes('/flowBuilder/')) return;
  let flowId;
  let resourceType;
  let resourceId;

  // eslint-disable-next-line prefer-const
  ({ flowId, resourceType, resourceId } = a);

  if (!resourceType || !resourceId) {
    const params = a?.match?.params || {};

    resourceType = params.resourceType;
    resourceId = params.resourceId;
  }
  const { bubbleType, bubbleConnector } = yield call(getFlowStepInfo, flowId, resourceType, resourceId);

  gainsight.track('CUSTOM_FLOWPROCESSOR_EDITED', {
    flowId,
    bubbleType,
    bubbleConnector,
    processorType: 'hooks',
  });
}

function* trackFlowEnableDisable(a) {
  if (!a.flowId || a.onOffInProgress) return;
  const { flowId } = a;
  const flow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;

  const eventId = (flow?.disabled) ? 'CUSTOM_FLOW_DISABLED' : 'CUSTOM_FLOW_ENABLED';

  gainsight.track(eventId, { flowId });
}

function trackFlowRun(a) {
  if (!a.flowId) return;
  gainsight.track('CUSTOM_FLOW_RUN', {
    flowId: a.flowId,
    timestamp: new Date().getTime(),
  });
}

function trackConnDebug(a) {
  if (!a.id || !a.debugDurInMins || !a.match?.url || !a.match.url.includes('/flowBuilder/')) return;
  const flowId = a.match?.params?.flowId;

  if (!flowId) return;
  gainsight.track('CUSTOM_CONNECTION_DEBUGGER_ENABLED', {
    connectionId: a.id,
    flowId,
    duration: a.debugDurInMins,
  });
}

export const gainsightSagas = [
  takeEvery(actionTypes.DEFAULT_ACCOUNT_SET, identifyUser),
  takeEvery(actionTypes.RESOURCE.CREATED, trackResourceCreatedEvent),
  takeEvery(actionTypes.ANALYTICS.GAINSIGHT.TRACK_EVENT, trackEvent),
  takeEvery(actionTypes.JOB.RESOLVE_SELECTED, trackResolve),
  takeEvery(actionTypes.JOB.RESOLVE_ALL, trackResolve),
  takeEvery(actionTypes.JOB.ERROR.RESOLVE_SELECTED, trackResolve),
  takeEvery(actionTypes.JOB.RETRY_SELECTED, trackRetry),
  takeEvery(actionTypes.JOB.RETRY_ALL, trackRetry),
  takeEvery(actionTypes.JOB.RETRY_FLOW_JOB, trackRetry),
  takeEvery(actionTypes.JOB.ERROR.RETRY_SELECTED, trackRetry),
  takeEvery(actionTypes.RESOURCE_FORM.SUBMIT, trackFormSubmit),
  takeEvery(actionTypes.MAPPING.SAVE, trackFormSubmit),
  takeEvery(actionTypes.RESPONSE_MAPPING.SAVE, trackFormSubmit),
  takeEvery(actionTypes.EDITOR.SAVE.REQUEST, trackEditorSave),
  takeEvery(actionTypes.HOOKS.SAVE, trackHookSave),
  takeEvery(actionTypes.FLOW.RECEIVED_ON_OFF_ACTION_STATUS, trackFlowEnableDisable),
  takeEvery(actionTypes.FLOW.RUN_REQUESTED, trackFlowRun),
  takeEvery(actionTypes.CONNECTION.ENABLE_DEBUG, trackConnDebug),
];
