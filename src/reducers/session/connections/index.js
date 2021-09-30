import produce from 'immer';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../comms/networkComms';

const emptySet = [];
const emptyObject = {};
const updateConnectionStatus = (
  allConnectionsStatus,
  connectionId,
  connStatus
) => {
  if (allConnectionsStatus && Array.isArray(allConnectionsStatus)) {
    const connectionIndex = allConnectionsStatus.findIndex(
      c => c._id === connectionId
    );

    if (connectionIndex !== -1) {
      // allConnectionsStatus is a draft... mutating it is fine....hence disabling lint for the next lin
      // eslint-disable-next-line no-param-reassign
      allConnectionsStatus[connectionIndex] = {
        ...allConnectionsStatus[connectionIndex],
        ...connStatus,
      };
    }
  }
};

export default (state = {}, action) => {
  const { type, connectionId, queuedJobs, iClients, connections } = action;

  return produce(state, draft => {
    switch (type) {
      // TODO (Aditya): Check for this
      case actionTypes.CONNECTION.AUTHORIZED:
        // On successful authorization of oauth connection, set the connection status to online.
        updateConnectionStatus(draft.status, connectionId, {
          offline: false,
        });

        break;
      case actionTypes.CONNECTION.UPDATE_ICLIENTS:
        draft.iClients = { ...draft.iClients, [connectionId]: iClients };

        break;

      case actionTypes.CONNECTION.TRADING_PARTNER_CONNECTIONS_REQUEST:
        draft.tradingPartnerConnections = {
          ...draft.tradingPartnerConnections,
          [connectionId]: {
            status: COMM_STATES.LOADING,
          },
        };

        break;

      case actionTypes.CONNECTION.TRADING_PARTNER_CONNECTIONS_RECEIVED:
        draft.tradingPartnerConnections = {
          ...draft.tradingPartnerConnections,
          [connectionId]: {
            status: COMM_STATES.SUCCESS,
            connections,
          },
        };

        break;

      case actionTypes.CONNECTION.QUEUED_JOBS_RECEIVED:
        draft.queuedJobs = { ...draft.queuedJobs, [connectionId]: queuedJobs };
        break;

      case actionTypes.CONNECTION.ACTIVE_SET:
        draft.activeConnection = connectionId;
        break;

      default:
    }
  });
};

export const selectors = {};

selectors.activeConnection = state => state?.activeConnection;

selectors.debugLogs = state => {
  if (!state || !state.debugLogs) {
    return null;
  }

  return state.debugLogs;
};

selectors.iClients = (state, connectionId) => {
  if (!state || !state.iClients || !connectionId) {
    return emptySet;
  }

  return state.iClients[connectionId] || emptySet;
};

selectors.tradingPartnerConnections = (state, connectionId) => {
  if (!state || !state.tradingPartnerConnections || !connectionId) {
    return emptyObject;
  }

  return state.tradingPartnerConnections[connectionId] || emptyObject;
};

selectors.queuedJobs = (state, connectionId) => {
  if (!state || !state.queuedJobs || !connectionId) {
    return emptySet;
  }

  return state.queuedJobs[connectionId] || emptySet;
};
