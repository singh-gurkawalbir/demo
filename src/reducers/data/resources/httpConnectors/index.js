// import { dispatch } from 'd3-dispatch';
import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (
  state = {
    application: {},
    preview: {},
    httpConnector: {},
    assistants: { rest: {}, http: {} },
    httpConnectorMetadata: {},
  },
  action
) => {
  const {
    type,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.HTTP_CONNECTORS.RECEIVED_METADATA: {
        const { httpVersionId = '', httpConnectorId = '', httpConnectorApiId = '', metadata } = action;
        const key = `${httpConnectorId}${httpVersionId}${httpConnectorApiId}`;

        draft.httpConnectorMetadata[key] = metadata;

        break;
      }
      case actionTypes.HTTP_CONNECTORS.RECEIVED_CONNECTOR: {
        const { httpConnectorId, connector } = action;

        draft.httpConnector[httpConnectorId] = connector;
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.connectorData = (state, httpConnectorId) => {
  if (!httpConnectorId) {
    return null;
  }

  return state?.httpConnector?.[httpConnectorId];
};

selectors.httpConnectorsList = state => state?.httpConnector;

selectors.httpConnectorMetaData = (state, httpConnectorId = '', httpVersionId = '', httpConnectorApiId = '') => {
  if (!httpConnectorId) {
    return null;
  }
  const key = `${httpConnectorId}${httpVersionId}${httpConnectorApiId}`;

  return state?.httpConnectorMetadata?.[key];
};

