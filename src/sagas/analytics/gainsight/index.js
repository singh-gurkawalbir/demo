import { takeEvery, select, call } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import { selectors } from '../../../reducers';
import * as gainsight from '../../../utils/analytics/gainsight';
import { ACCOUNT_IDS } from '../../../utils/constants';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../constants/resource';
import { getResourceSubType, resourceCategory } from '../../../utils/resource';

export function* identifyUser() {
  const profile = yield select(
    selectors.userProfile
  );
  const { _id, name, email, company, createdAt } = profile || {};
  const { defaultAShareId } = yield select(selectors.userPreferences);
  const [firstName, ...lastName] = (name || '').split(' ');
  const accountInfo = {
    id: defaultAShareId === ACCOUNT_IDS.OWN ? _id : defaultAShareId,
    name: company || name,
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

  const eventId = `${resourceTypeSingular.toUpperCase()}_CREATED`;
  /**
   * TODO We need to update this to get the required details for each resource type
   * once https://celigo.atlassian.net/browse/IO-10222 is updated with required details.
   */
  const details = getResourceSubType(resource);

  trackEvent({ eventId, details });
}

const locationFromMatch = m => {
  if (!m || !m.url) return 'unknown';
  if (m.url.endsWith('/dashboard')) return 'integration dashboard';
  if (m.url.includes('/flowBuilder/')) return 'run dashboard';
  if (m.url.endsWith('/viewErrors')) return 'error drawer';

  return 'unknown';
};

const trackResolve = a => {
  gainsight.trakc('CUSTOM_RESOLVE_ERRORS', {
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

  if (!url.includes('/flowBuilder/')) return;
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
      mappingType: a.type === actionTypes.RESPONSE_MAPPING.SAVE ? 'responseMapping' : 'mapping',
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
  let { processorKey: processorType, resourceType, resourceId, pageProcessorsObject: ppObj } = a?.editor?.optionalSaveParams || {};

  if (!processorType) return;
  if (processorType === 'postResponseMapHook' && (!resourceType || !resourceId) && ppObj) {
    resourceType = 'imports';
    resourceId = ppObj._importId;
  }
  if (!resourceType || !resourceId) return;
  const { bubbleType, bubbleConnector } = yield call(getFlowStepInfo, flowId, resourceType, resourceId);

  gainsight.track('CUSTOM_FLOWPROCESSOR_EDITED', {
    flowId,
    bubbleType,
    bubbleConnector,
    processorType,
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

function* trackFlowEnable(a) {
  if (!a.flowId || a.onOffInProgress) return;
  const {flowId} = a;
  const flow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;

  if (flow?.disabled) return;
  gainsight.track('CUSTOM_FLOW_ENABLED', {
    flowId,
  });
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
  takeEvery(actionTypes.EDITOR.SAVE, trackEditorSave),
  takeEvery(actionTypes.HOOKS.SAVE, trackHookSave),
  takeEvery(actionTypes.FLOW.RECEIVED_ON_OFF_ACTION_STATUS, trackFlowEnable),
  takeEvery(actionTypes.FLOW.RUN_REQUESTED, trackFlowRun),
  takeEvery(actionTypes.CONNECTION.ENABLE_DEBUG, trackConnDebug),
];
