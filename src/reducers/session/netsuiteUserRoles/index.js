import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, connectionId, userRoles, message } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.NETSUITE_USER_ROLES.CLEAR:
      newState[connectionId] = { ...newState[connectionId] };
      delete newState[connectionId].message;

      return newState;
    case actionTypes.NETSUITE_USER_ROLES.REQUEST:
      if (!newState[connectionId]) newState[connectionId] = {};

      return newState;
    case actionTypes.NETSUITE_USER_ROLES.RECEIVED:
      newState[connectionId] = {
        ...newState[connectionId],
        userRoles: deepClone(userRoles),
      };

      return newState;
    case actionTypes.NETSUITE_USER_ROLES.FAILED:
      if (!newState[connectionId]) newState[connectionId] = {};
      newState[connectionId] = { ...newState[connectionId], message };

      return newState;

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function netsuiteUserRoles(
  state,
  connectionId,
  netsuiteResourceType,
  env,
  acc
) {
  if (!state || !state[connectionId]) return {};
  const { userRoles } = state[connectionId];

  // all environments
  if (!userRoles) return state[connectionId];
  const envs = Object.keys(userRoles).map(env => ({ label: env, value: env }));

  if (netsuiteResourceType === 'environment')
    return { ...state[connectionId], optionsArr: envs };
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

  if (netsuiteResourceType === 'account')
    return { ...state[connectionId], optionsArr: accounts };
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

  if (netsuiteResourceType === 'role')
    return { ...state[connectionId], optionsArr: roles };

  return { ...state[connectionId], optionsArr: null };
}
// #endregion
