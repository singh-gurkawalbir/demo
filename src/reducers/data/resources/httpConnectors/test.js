/* global describe, test, expect */
import reducer from '.';
import actions from '../../../../actions';

const httpConnectorId = 'connId';
const httpVersionId = 'versionId';
const httpConnectorApiId = 'apiId';
const metadata = {metadata: {}};
const key = `${httpConnectorId}${httpVersionId}${httpConnectorApiId}`;

describe('http connectors reducer', () => {
  describe('actionTypes.HTTP_CONNECTORS.RECEIVED_METADATA action', () => {
    test('should update metadata in state in given key location', () => {
      const prevState = {
        application: {},
        preview: {},
        httpConnector: {},
        assistants: { rest: {}, http: {} },
        httpConnectorMetadata: {},

      };
      const newState = reducer(prevState, actions.httpConnectors.receivedMetadata({httpConnectorId, httpVersionId, httpConnectorApiId, metadata}));

      const expectedState = {application: {},
        preview: {},
        httpConnector: {},
        assistants: { rest: {}, http: {} },
        httpConnectorMetadata: {
          [key]:
          metadata},
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('actionTypes.HTTP_CONNECTORS.RECEIVED_METADATA action', () => {
    test('should update metadata in state in given key location', () => {
      const prevState = {
        application: {},
        preview: {},
        httpConnector: {},
        assistants: { rest: {}, http: {} },
        httpConnectorMetadata: {},

      };
      const newState = reducer(prevState, actions.httpConnectors.receivedMetadata({httpConnectorId, httpVersionId, httpConnectorApiId, metadata}));

      const expectedState = {application: {},
        preview: {},
        httpConnector: {},
        assistants: { rest: {}, http: {} },
        httpConnectorMetadata: {
          [key]:
          metadata},
      };

      expect(newState).toEqual(expectedState);
    });
  });
});

