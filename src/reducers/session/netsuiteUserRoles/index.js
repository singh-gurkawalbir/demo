import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resourceId, userRoles, message } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.NETSUITE_USER_ROLES.CLEAR:
      newState[resourceId] = { ...newState[resourceId] };
      delete newState[resourceId].message;

      return newState;
    case actionTypes.NETSUITE_USER_ROLES.REQUEST:
      if (!newState[resourceId]) newState[resourceId] = {};

      return newState;
    case actionTypes.NETSUITE_USER_ROLES.RECEIVED:
      newState[resourceId] = {
        ...newState[resourceId],
        userRoles: deepClone(userRoles),
      };

      return newState;
    case actionTypes.NETSUITE_USER_ROLES.FAILED:
      if (!newState[resourceId]) newState[resourceId] = {};
      newState[resourceId] = { ...newState[resourceId], message };

      return newState;

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function netsuiteUserRoles(
  state,
  resourceId,
  netsuiteResourceType,
  env,
  acc
) {
  if (!state || !state[resourceId]) return {};
  const { userRoles } = state[resourceId];

  // all environments
  if (!userRoles) return state[resourceId];
  const envs = Object.keys(userRoles).map(env => ({ label: env, value: env }));
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
      }));
  // get matching roles for a user environment and account
  const roles =
    userRoles[env] &&
    userRoles[env].accounts &&
    userRoles[env].accounts
      .filter(account => account.account.internalId === acc)
      .map(account => ({
        label: account.role.name,
        value: account.role.internalId,
      }));

  if (netsuiteResourceType === 'environment')
    return { ...state[resourceId], optionsArr: envs };
  else if (netsuiteResourceType === 'account')
    return { ...state[resourceId], optionsArr: accounts };
  else if (netsuiteResourceType === 'role')
    return { ...state[resourceId], optionsArr: roles };

  return { ...state[resourceId], optionsArr: null };
}
// #endregion
