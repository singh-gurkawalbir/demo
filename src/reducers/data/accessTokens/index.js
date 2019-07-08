import actionTypes from '../../../actions/types';
import { PASSWORD_MASK } from '../../../utils/constants';

export default (state = [], action) => {
  const { type, resourceType, collection, accessToken } = action;

  if (!type) {
    return state;
  }

  let resourceIndex;
  let newState;

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION:
      if (resourceType === 'accesstokens') {
        return collection || [];
      }

      return state;
    case actionTypes.ACCESSTOKEN_TOKEN_RECEIVED:
      resourceIndex = state.findIndex(r => r._id === accessToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], ...accessToken },
          ...state.slice(resourceIndex + 1),
        ];

        return newState;
      }

      return state;
    case actionTypes.ACCESSTOKEN_TOKEN_MASK:
      resourceIndex = state.findIndex(r => r._id === accessToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          { ...state[resourceIndex], token: PASSWORD_MASK },
          ...state.slice(resourceIndex + 1),
        ];

        return newState;
      }

      return state;
    case actionTypes.ACCESSTOKEN_CREATED:
      return [...state, { ...accessToken }];
    case actionTypes.ACCESSTOKEN_UPDATED:
      resourceIndex = state.findIndex(r => r._id === accessToken._id);

      if (resourceIndex > -1) {
        return [
          ...state.slice(0, resourceIndex),
          { ...accessToken },
          ...state.slice(resourceIndex + 1),
        ];
      }

      return state;
    case actionTypes.ACCESSTOKEN_DELETED:
      resourceIndex = state.findIndex(r => r._id === accessToken._id);

      if (resourceIndex > -1) {
        newState = [
          ...state.slice(0, resourceIndex),
          ...state.slice(resourceIndex + 1),
        ];

        return newState;
      }

      return state;
    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function accessTokenList(state, integrationId) {
  if (state.length === 0) {
    return state;
  }

  const filteredTokens = state.filter(t => {
    if (integrationId) {
      return t._integrationId === integrationId;
    }

    return !t._integrationId;
  });
  let isEmbeddedToken;
  const tokens = filteredTokens.map(t => {
    isEmbeddedToken = !!(t._connectorId && !t.autoPurgeAt);

    const permissions = {
      displayToken: !isEmbeddedToken,
      generateToken: !isEmbeddedToken,
      revoke: !t.revoked,
      activate: !!t.revoked,
      edit: !isEmbeddedToken,
      /* deletion of connector tokens is not allowed by backend */
      delete: !t._connectorId && !!t.revoked,
    };
    const permissionReasons = {
      displayToken: isEmbeddedToken ? 'Embedded Token' : '',
      generateToken:
        'This api token is owned by a SmartConnector and cannot be regenerated.',
      edit:
        'This api token is owned by a SmartConnector and cannot be edited or deleted here.',
      delete: t._connectorId
        ? 'This api token is owned by a SmartConnector and cannot be edited or deleted here.'
        : 'To delete this api token you need to revoke it first.',
    };

    Object.keys(permissions).forEach(p => {
      if (permissions[p]) {
        delete permissionReasons[p];
      }
    });

    let fullAccess = !!t.fullAccess;

    if (!fullAccess && t._connectorId && t.autoPurgeAt) {
      if (
        (!t._connectionIds || !t._connectionIds.length) &&
        (!t._exportIds || !t._exportIds.length) &&
        (!t._importIds || !t._importIds.length)
      ) {
        fullAccess = true;
      }
    }

    return {
      ...t,
      token: t.token === PASSWORD_MASK ? '' : t.token,
      fullAccess,
      revoked: !!t.revoked,
      isEmbeddedToken,
      permissions,
      permissionReasons,
    };
  });

  return tokens;
}

export function accessToken(state, id) {
  return state.find(t => t._id === id);
}

// #endregion
