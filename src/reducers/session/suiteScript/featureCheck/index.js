import produce from 'immer';
import actionTypes from '../../../../actions/types';
import { COMM_STATES } from '../../../comms/networkComms';

export const keyGen = (
  ssLinkedConnectionId,
  integrationId,
  featureName,
) => `${ssLinkedConnectionId}-${integrationId}-${featureName}`;
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
  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.FEATURE_CHECK.REQUEST:
        if (!draft[key]) draft[key] = {};
        draft[key].status = 'requesting';
        return;

      case actionTypes.SUITESCRIPT.FEATURE_CHECK.CLEAR:
        delete draft[key];

        return;

      case actionTypes.SUITESCRIPT.FEATURE_CHECK.SUCCESSFUL:
        if (!draft[key])draft[key] = {};
        draft[key].status = COMM_STATES.SUCCESS;
        return;
      case actionTypes.SUITESCRIPT.FEATURE_CHECK.FAILED:
        if (!draft[key])draft[key] = {};
        draft[key].status = COMM_STATES.ERROR;
        draft[key].message = message;

        break;
      default:
    }
  });
};
const emptyObj = {};
export function suiteScriptIAFeatureCheckState(
  state,
  { ssLinkedConnectionId, integrationId, featureName}
) {
  const key = keyGen(ssLinkedConnectionId, integrationId, featureName);

  if (!state || !state[key]) return emptyObj;

  return state[key];
}
