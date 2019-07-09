import actionTypes from '../../../actions/types';
import { SUITESCRIPT_CONNECTORS } from '../../../utils/constants';

export default (state = {}, action) => {
  const { type, resourceType, collection } = action;

  if (!type) {
    return state;
  }

  if (!resourceType) {
    return state;
  }

  if (type === actionTypes.RESOURCE.RECEIVED_COLLECTION) {
    if (
      resourceType.startsWith('suitescript/connections/') &&
      resourceType.endsWith('/tiles')
    ) {
      const resourceTypeParts = resourceType.split('/');
      const connectionId = resourceTypeParts[2];
      const connectionIdState = {
        ...(state[connectionId] || {}),
        tiles: collection || [],
      };

      return { ...state, [connectionId]: connectionIdState };
    }
  }

  return state;
};

// #region PUBLIC SELECTORS
export function tiles(state, connectionId) {
  if (
    !state ||
    !connectionId ||
    !state[connectionId] ||
    !state[connectionId].tiles
  ) {
    return [];
  }

  let list = state[connectionId].tiles;
  let connector;
  let propsToAdd = {};

  list = list.map(t => {
    propsToAdd = {
      _ioConnectionId: connectionId,
    };
    connector = SUITESCRIPT_CONNECTORS.find(
      c => c.name === t.name || c.ssName === t.name
    );

    if (connector) {
      propsToAdd = {
        ...propsToAdd,
        name: connector.name,
        _connectorId: connector._id,
      };
    }

    return {
      ...t,
      _id: [connectionId, t._integrationId].join('_'),
      ...propsToAdd,
    };
  });

  return list;
}

export function integrations(state, connectionId) {
  const tileList = tiles(state, connectionId);
  let integration;
  const integrations = tileList.map(t => {
    integration = {
      _ioConnectionId: t._ioConnectionId,
      _id: t._integrationId,
      name: t.name,
    };

    if (t._connectorId) {
      integration = {
        ...integration,
        _connectorId: t._connectorId,
        mode: t.mode,
      };
    }

    return integration;
  });

  return integrations;
}

// #endregion
