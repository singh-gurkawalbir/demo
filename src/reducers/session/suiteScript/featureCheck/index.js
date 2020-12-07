import produce from 'immer';
import actionTypes from '../../../../actions/types';
import { COMM_STATES } from '../../../comms/networkComms';

export const keyGen = (
  ssLinkedConnectionId,
  integrationId,
  featureName,
) => `${ssLinkedConnectionId || ''}${integrationId ? `-${integrationId}` : ''}${featureName ? `-${featureName}` : ''}`;
export default (state = {}, action) => {
  const {
    type,
    integrationId,
    ssLinkedConnectionId,
    featureName,
    message,
  } = action;
  const key = keyGen(
    ssLinkedConnectionId,
    integrationId,
    featureName,
  );

  // if not valid key return state

  if (!key) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.FEATURE_CHECK.REQUEST:
        if (!draft[key]) draft[key] = {};
        draft[key].status = COMM_STATES.LOADING;
        break;

      case actionTypes.SUITESCRIPT.FEATURE_CHECK.CLEAR:
        delete draft[key];

        break;

      case actionTypes.SUITESCRIPT.FEATURE_CHECK.SUCCESSFUL:
        if (!draft[key])draft[key] = {};
        draft[key].status = COMM_STATES.SUCCESS;
        break;
      case actionTypes.SUITESCRIPT.FEATURE_CHECK.FAILED:
        if (!draft[key])draft[key] = {};
        draft[key].status = COMM_STATES.ERROR;
        draft[key].message = message;

        break;
      default:
    }
  });
};

export const selectors = {};

selectors.suiteScriptIAFeatureCheckState = (
  state,
  { ssLinkedConnectionId, integrationId, featureName}
) => {
  const key = keyGen(ssLinkedConnectionId, integrationId, featureName);

  return (state?.[key]) || null;
};
