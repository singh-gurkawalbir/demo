import produce from 'immer';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import { stringCompare } from '../../../utils/sort';

export default (state = {}, action) => {
  const { type, connectionId, userRoles, message, hideNotificationMessage = false } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.NETSUITE_USER_ROLES.CLEAR:
        delete draft[connectionId].message;
        delete draft[connectionId].status;
        delete draft[connectionId].hideNotificationMessage;

        break;
      case actionTypes.NETSUITE_USER_ROLES.REQUEST:
        if (!draft[connectionId]) draft[connectionId] = {};

        draft[connectionId].hideNotificationMessage = hideNotificationMessage;

        break;
      case actionTypes.NETSUITE_USER_ROLES.RECEIVED:
        if (!draft[connectionId]) draft[connectionId] = {};
        draft[connectionId].userRoles = deepClone(userRoles);
        draft[connectionId].status = 'success';

        break;
      case actionTypes.NETSUITE_USER_ROLES.FAILED:
        if (!draft[connectionId]) draft[connectionId] = {};
        draft[connectionId].message = message;
        draft[connectionId].status = 'error';

        break;

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.netsuiteUserRoles = (
  state,
  connectionId,
  netsuiteResourceType,
  env,
  acc
) => {
  if (!state || !state[connectionId]) return {};
  const { userRoles } = state[connectionId];

  // all environments
  if (!userRoles) return state[connectionId];
  const envs = Object.keys(userRoles)
    .map(env => ({ label: env, value: env }))
    .sort(stringCompare('label'));

  if (netsuiteResourceType === 'environment') return { ...state[connectionId], optionsArr: envs };
  // get matchings accounts for a user environment
  const allAcc =
    userRoles[env] &&
    userRoles[env].accounts &&
    userRoles[env].accounts.map(account => account.account.internalId);
  const accounts =
    userRoles[env] &&
    userRoles[env].accounts &&
    userRoles[env].accounts
      .filter(
        (item, index) => allAcc.indexOf(item.account.internalId) === index
      )
      .map(account => ({
        label: account.account.name,
        value: account.account.internalId,
      }))
      .sort(stringCompare('label'));

  if (netsuiteResourceType === 'account') return { ...state[connectionId], optionsArr: accounts };
  // get matching roles for a user environment and account

  const roles =
    userRoles[env] &&
    userRoles[env].accounts &&
    userRoles[env].accounts
      .filter(account => account.account.internalId === acc)
      .map(account => ({
        label: account.role.name,
        value: account.role.internalId.toString(),
      }))
      .sort(stringCompare('label'));

  if (netsuiteResourceType === 'role') return { ...state[connectionId], optionsArr: roles };

  return { ...state[connectionId], optionsArr: null };
};
// #endregion
