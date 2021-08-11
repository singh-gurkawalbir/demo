import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const {
    type,
    collection,
    connectionIds,
    integrationId,
    deregisteredId,
    connectionId,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CONNECTION.TRADING_PARTNER_UPDATE_COMPLETE: {
        // cant implement immer here with current implementation. Need to revisit again.
        if (connectionIds?.length) {
          connectionIds.forEach(({ _id: cId}) => {
            const connection = draft.connections.find(r => r._id === cId);

            if (connection) {
              connection.ftp.tradingPartner = !(connection.ftp.tradingPartner);
            }
          });
        }

        return;
      }
      case actionTypes.CONNECTION.DEREGISTER_COMPLETE: {
        const integration = draft.integrations?.find(
              r => r._id === integrationId
            );

        if (integration) {
          integration._registeredConnectionIds = integration._registeredConnectionIds.filter(ele => ele !== deregisteredId);
        }

        return;
      }
      case actionTypes.CONNECTION.REGISTER_COMPLETE: {
        const integration = draft.integrations?.find(
              r => r._id === integrationId
            );

        if (integration) {
          integration._registeredConnectionIds = [...integration._registeredConnectionIds, ...connectionIds];
        }

        return;
      }
      case actionTypes.CONNECTION.UPDATE_STATUS: {
        if (collection?.length) {
          collection.forEach(({ _id: cId, offline, queues }) => {
            const connection = draft?.connections?.find(r => r._id === cId);

            if (connection) {
              connection.offline = !!offline;
              connection.queueSize = queues[0].size;
            }
          });
        }

        return;
      }
      case actionTypes.CONNECTION.MADE_ONLINE:
        if (!draft.tiles) {
          return draft;
        }

        draft.tiles.forEach(tile => {
          if (tile.offlineConnections) {
            // eslint-disable-next-line no-param-reassign
            tile.offlineConnections = tile.offlineConnections.filter(
              c => c !== connectionId
            );
          }
        });

        return;

      default:
        return draft;
    }
  });
};

