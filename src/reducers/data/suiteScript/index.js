import produce from 'immer';
import actionTypes from '../../../actions/types';
import { SUITESCRIPT_CONNECTORS } from '../../../utils/constants';

const emptyList = [];

export default (state = {}, action) => {
  const { type, resourceType } = action;

  if (!type || !resourceType) {
    return state;
  }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED_COLLECTION:
        {
          const { collection = [] } = action;

          if (resourceType.startsWith('suitescript/connections/')) {
            const [, , ssLinkedConnectionId] = resourceType.split('/');

            if (!draft[ssLinkedConnectionId]) {
              draft[ssLinkedConnectionId] = { tiles: [] };
            }

            if (resourceType.endsWith('/tiles')) {
              draft[ssLinkedConnectionId].tiles = collection.map(tile => {
                const connector = SUITESCRIPT_CONNECTORS.find(c =>
                  [c.name, c.ssName].includes(tile.name)
                );
                const t = {
                  ...tile,
                  ssLinkedConnectionId,
                };

                if (connector) {
                  t.name = connector.name;
                  t._connectorId = connector._id;
                }

                return t;
              });

              if (!draft[ssLinkedConnectionId].integrations) {
                draft[ssLinkedConnectionId].integrations = [];
              }

              collection.forEach(tile => {
                const connector = SUITESCRIPT_CONNECTORS.find(c =>
                  [c.name, c.ssName].includes(tile.name)
                );
                const integration = {
                  _id: tile._integrationId,
                  name: tile.name,
                };

                if (connector) {
                  // integration.name = connector.name;
                  integration._connectorId = connector._id;
                  integration.mode = tile.mode;
                }

                const index = draft[
                  ssLinkedConnectionId
                ].integrations.findIndex(i => i._id === integration._id);

                if (index > -1) {
                  draft[ssLinkedConnectionId].integrations[index] = {
                    ...draft[ssLinkedConnectionId].integrations[index],
                    ...integration,
                  };
                } else {
                  draft[ssLinkedConnectionId].integrations.push(integration);
                }

                return integration;
              });
            } else if (resourceType.endsWith('/connections')) {
              draft[ssLinkedConnectionId].connections = collection;
            } else if (resourceType.endsWith('/flows')) {
              if (!draft[ssLinkedConnectionId].flows) {
                draft[ssLinkedConnectionId].flows = [];
              }

              collection.forEach(flow => {
                const index = draft[ssLinkedConnectionId].flows.findIndex(
                  f => f.type === flow.type && f._id === flow._id
                );
                const flowId = `${
                  {
                    EXPORT: 'e',
                    IMPORT: 'i',
                    REALTIME_EXPORT: 're',
                  }[flow.type]
                }${flow._id}`;

                if (index === -1) {
                  draft[ssLinkedConnectionId].flows.push({
                    ...flow,
                    ssLinkedConnectionId,
                    _id: flowId,
                  });
                } else {
                  draft[ssLinkedConnectionId].flows[index] = {
                    ...flow,
                    ssLinkedConnectionId,
                    _id: flowId,
                  };
                }
              });
            }
          }
        }

        break;
      case actionTypes.SUITESCRIPT.RESOURCE.RECEIVED:
        {
          const { ssLinkedConnectionId, resource } = action;

          if (
            draft[ssLinkedConnectionId] &&
            draft[ssLinkedConnectionId][resourceType]
          ) {
            let index;

            if (resourceType === 'flows') {
              index = draft[ssLinkedConnectionId][resourceType].findIndex(
                r =>
                  r._id === resource._id &&
                  r._integrationId === resource._integrationId
              );
            } else {
              index = draft[ssLinkedConnectionId][resourceType].findIndex(
                r => r._id === resource._id
              );
            }

            if (index > -1) {
              draft[ssLinkedConnectionId][resourceType][index] = resource;
            }
          }
        }

        break;
      default:
    }
  });

  // if (type === actionTypes.RESOURCE.RECEIVED_COLLECTION) {
  //   if (
  //     resourceType.startsWith('suitescript/connections/') &&
  //     resourceType.endsWith('/tiles')
  //   ) {
  //     const resourceTypeParts = resourceType.split('/');
  //     const connectionId = resourceTypeParts[2];
  //     const connectionIdState = {
  //       ...(state[connectionId] || {}),
  //       /** TODO: We can remove isArray check on collection once the backend issue IO-11743 is fixed. */
  //       tiles: isArray(collection) ? collection : [],
  //     };

  //     return { ...state, [connectionId]: connectionIdState };
  //   }
  // }

  // return state;
};

// #region PUBLIC SELECTORS
export function tiles(state, ssLinkedConnectionId) {
  if (
    !state ||
    !ssLinkedConnectionId ||
    !state[ssLinkedConnectionId] ||
    !state[ssLinkedConnectionId].tiles
  ) {
    return emptyList;
  }

  return state[ssLinkedConnectionId].tiles;
}

export function integrations(state, ssLinkedConnectionId) {
  if (
    !state ||
    !ssLinkedConnectionId ||
    !state[ssLinkedConnectionId] ||
    !state[ssLinkedConnectionId].integrations
  ) {
    return emptyList;
  }

  return state[ssLinkedConnectionId].integrations;
}

export function resource(state, { resourceType, id, ssLinkedConnectionId }) {
  if (
    !state ||
    !ssLinkedConnectionId ||
    !id ||
    !resourceType ||
    !state[ssLinkedConnectionId]
  ) {
    return null;
  }

  let suiteScriptResourceType = resourceType;

  if (['exports', 'imports'].includes(suiteScriptResourceType)) {
    suiteScriptResourceType = 'flows';
  }

  const resources = state[ssLinkedConnectionId][suiteScriptResourceType];

  if (!resources) return null;

  let match = resources.find(r => r._id === id);

  if (resourceType === 'connections' && !match) {
    match = resources.find(r => r.id === id);
  }

  if (!match) return null;

  return match;

  // const ioMetadata = {
  //   ssLinkedConnectionId,
  // };

  // if (suiteScriptResourceType === 'flows') {
  //   if (match.export) {
  //     // fileCabinet,ftp,magento,newegg,rakuten,salesforce,sears
  //     ioMetadata.exportAdaptorType = match.export.type;

  //     if (match.export.netsuite && match.export.netsuite.type) {
  //       ioMetadata.exportAdaptorType = 'netsuite';
  //     }
  //   }

  //   if (match.import) {
  //     // ebay,magento,netsuite,rakuten
  //     ioMetadata.importAdaptorType = match.import.type;

  //     if (match.import.salesforce && match.import.salesforce.sObjectType) {
  //       ioMetadata.importAdaptorType = 'salesforce';
  //     } else if (match.import.newegg && match.import.newegg.method) {
  //       ioMetadata.importAdaptorType = 'newegg';
  //     } else if (match.import.sears && match.import.sears.method) {
  //       ioMetadata.importAdaptorType = 'sears';
  //     } else if (match.import._connectionId === 'ACTIVITY_STREAM') {
  //       ioMetadata.importAdaptorType = 'fileCabinet';
  //     } else if (match.import.ftp && match.import.ftp.directoryPath) {
  //       ioMetadata.importAdaptorType = 'ftp';
  //     }
  //   }
  // }

  // return {
  //   ...match,
  //   ioMetadata,
  // };
}

export function resourceList(
  state,
  { resourceType, ssLinkedConnectionId, integrationId }
) {
  if (
    !state ||
    !ssLinkedConnectionId ||
    !resourceType ||
    !state[ssLinkedConnectionId]
  ) {
    return emptyList;
  }

  if (resourceType === 'flows' && integrationId) {
    return state[ssLinkedConnectionId][resourceType].filter(
      f => f._integrationId === integrationId
    );
  }

  return state[ssLinkedConnectionId][resourceType];
}

export function hasData(
  state,
  { resourceType, integrationId, ssLinkedConnectionId }
) {
  if (
    !state ||
    !state[ssLinkedConnectionId] ||
    !state[ssLinkedConnectionId][resourceType]
  ) {
    return false;
  }

  const resources = state[ssLinkedConnectionId][resourceType];

  if (resourceType === 'flows') {
    return resources.filter(r => r._integrationId === integrationId).length > 0;
  }

  return resources.length > 0;
}

// #endregion
