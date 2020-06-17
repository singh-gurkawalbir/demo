/* global describe, test, expect */
import reducer, * as selectors from '.';
import actions from '../../../actions';
import { SUITESCRIPT_CONNECTORS } from '../../../utils/constants';

const defaultState = {
  paging: {
    jobs: {
      currentPage: 0,
      rowsPerPage: 10,
    },
  }
};

const refreshlegacycontrolpanel = [
  {
    _id: 'something',
    clearCache: false,
    object: null,
    refreshMappings: false,
    ssLinkedConnectionId: 'c1',
  },
];

/**
 * TODO: Ignoring SS tests for sometime and Shiva needs to fix these.
 */

describe.skip('suiteScript reducer', () => {
  test('any other action should return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual(defaultState);
  });
  test('any other action, when state exists, should return original state', () => {
    const someState = { something: 'something' };
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });
  describe('should update the state properly when suitescript tiles collection received', () => {
    const connectionId = 'c1';
    const tiles = [
      { _integrationId: 'i1', name: 'i one' },
      { _integrationId: 'i2', name: 'i two' },
    ];
    const tilesReceivedAction = actions.resource.receivedCollection(
      `suitescript/connections/${connectionId}/tiles`,
      tiles
    );

    test('should update the state properly when the current state is undefined', () => {
      const newState = reducer(undefined, tilesReceivedAction);
      const expected = { refreshlegacycontrolpanel, tiles: [], integrations: [] };

      tiles.forEach(t => {
        const tile = {status: 'success', ...t, displayName: t.name, ssLinkedConnectionId: connectionId};
        expected.tiles.push(tile);
        const { _integrationId, ssLinkedConnectionId, status, ...otherIntegrationProps } = tile;

        expected.integrations.push({
          isNotEditable: false,
          ...otherIntegrationProps,
          _id: _integrationId,
        });
      });

      expect(newState).toEqual({ ...defaultState, [connectionId]: expected });
    });
    test('should update the state properly when the current state is not empty', () => {
      const state = {
        ...defaultState,
        c2: { tiles: ['something'] },
        [connectionId]: { flows: ['something else'] },
      };
      const newState = reducer(state, tilesReceivedAction);
      const expected = { ...state };

      expected[connectionId].refreshlegacycontrolpanel = refreshlegacycontrolpanel;
      expected[connectionId].tiles = [];
      expected[connectionId].integrations = [];

      tiles.forEach(t => {
        const tile = {status: 'success', ...t, displayName: t.name, ssLinkedConnectionId: connectionId};
        expected[connectionId].tiles.push(tile);
        const { _integrationId, ssLinkedConnectionId, status, ...otherIntegrationProps } = tile;

        expected[connectionId].integrations.push({
          isNotEditable: false,
          ...otherIntegrationProps,
          _id: _integrationId,
        });
      });
      expect(newState).toEqual(expected);
    });
  });
});

describe.skip('tiles selector', () => {
  test('should return [] when the state is empty', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.tiles(state)).toEqual([]);
    expect(selectors.tiles(state, 'something')).toEqual([]);
  });
  describe('should return correct results for different connectionIds', () => {
    const state = {
      c1: {
        something: ['something else'],
      },
      c2: {
        somethingElse: ['something'],
      },
    };
    const tiles = {
      c1: [
        { _integrationId: 'i1', name: 'i one' },
        { _integrationId: 'i2', name: 'i two' },
      ],
      c2: [
        { _integrationId: 'i2', name: 'i two' },
        { _integrationId: 'i3', name: 'i three' },
        { _integrationId: 'i4', name: SUITESCRIPT_CONNECTORS[0].name },
        { _integrationId: 'i5', name: SUITESCRIPT_CONNECTORS[1].name },
      ],
    };

    test('should return correct results for connection c1 [diy integrations only]', () => {
      const tilesReceivedAction = actions.resource.receivedCollection(
        'suitescript/connections/c1/tiles',
        tiles.c1
      );
      const newState = reducer(state, tilesReceivedAction);

      expect(selectors.tiles(newState, 'c1')).toEqual([
        {
          _integrationId: 'i1',
          name: 'i one',
          ssLinkedConnectionId: 'c1',
          displayName: 'i one',
          status: 'success',
        },
        {
          _integrationId: 'i2',
          name: 'i two',
          ssLinkedConnectionId: 'c1',
          displayName: 'i two',
          status: 'success',
        },
      ]);
    });
    test('should return correct results for connection c2 [diy + connector integrations]', () => {
      const tilesReceivedAction = actions.resource.receivedCollection(
        'suitescript/connections/c2/tiles',
        tiles.c2
      );
      const newState = reducer(state, tilesReceivedAction);

      expect(selectors.tiles(newState, 'c2')).toEqual([
        {
          _integrationId: 'i2',
          name: 'i two',
          ssLinkedConnectionId: 'c2',
          displayName: 'i two',
          status: 'success',
        },
        {
          _integrationId: 'i3',
          name: 'i three',
          ssLinkedConnectionId: 'c2',
          displayName: 'i three',
          status: 'success',
        },
        {
          _integrationId: 'i4',
          name: SUITESCRIPT_CONNECTORS[0].name,
          ssLinkedConnectionId: 'c2',
          _connectorId: SUITESCRIPT_CONNECTORS[0]._id,
          displayName: SUITESCRIPT_CONNECTORS[0].name,
          status: 'success',
          urlName: SUITESCRIPT_CONNECTORS[0].urlName,
        },
        {
          _integrationId: 'i5',
          name: SUITESCRIPT_CONNECTORS[1].name,
          ssLinkedConnectionId: 'c2',
          _connectorId: SUITESCRIPT_CONNECTORS[1]._id,
          displayName: SUITESCRIPT_CONNECTORS[1].name,
          status: 'success',
          urlName: SUITESCRIPT_CONNECTORS[1].urlName,
        },
      ]);
    });
  });
});

describe.skip('integrations selector', () => {
  test('should return [] when the state is empty', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.integrations(state)).toEqual([]);
    expect(selectors.integrations(state, 'something')).toEqual([]);
  });
  describe('should return correct results for different connectionIds', () => {
    const state = {
      c1: {
        something: ['something else'],
      },
      c2: {
        somethingElse: ['something'],
      },
    };
    const tiles = {
      c1: [
        { _integrationId: 'i1', name: 'i one' },
        { _integrationId: 'i2', name: 'i two' },
      ],
      c2: [
        { _integrationId: 'i2', name: 'i two' },
        { _integrationId: 'i3', name: 'i three' },
        {
          _integrationId: 'i4',
          name: SUITESCRIPT_CONNECTORS[0].name,
          mode: 'something',
        },
        {
          _integrationId: 'i5',
          name: SUITESCRIPT_CONNECTORS[1].name,
          mode: 'somethingElse',
        },
      ],
    };

    test('should return correct results for connection c1 [diy integrations only]', () => {
      const tilesReceivedAction = actions.resource.receivedCollection(
        'suitescript/connections/c1/tiles',
        tiles.c1
      );
      const newState = reducer(state, tilesReceivedAction);

      expect(selectors.integrations(newState, 'c1')).toEqual([
        {
          _id: 'i1',
          name: 'i one',
          displayName: 'i one',
          isNotEditable: false,
        },
        {
          _id: 'i2',
          name: 'i two',
          displayName: 'i two',
          isNotEditable: false,
        },
      ]);
    });
    test('should return correct results for connection c2 [diy + connector integrations]', () => {
      const tilesReceivedAction = actions.resource.receivedCollection(
        'suitescript/connections/c2/tiles',
        tiles.c2
      );
      const newState = reducer(state, tilesReceivedAction);

      expect(selectors.integrations(newState, 'c2')).toEqual([
        {
          _id: 'i2',
          name: 'i two',
          displayName: 'i two',
          isNotEditable: false,
        },
        {
          _id: 'i3',
          name: 'i three',
          displayName: 'i three',
          isNotEditable: false,
        },
        {
          _id: 'i4',
          name: SUITESCRIPT_CONNECTORS[0].name,
          _connectorId: SUITESCRIPT_CONNECTORS[0]._id,
          mode: 'something',
          displayName: SUITESCRIPT_CONNECTORS[0].name,
          isNotEditable: false,
          urlName: SUITESCRIPT_CONNECTORS[0].urlName,
        },
        {
          _id: 'i5',
          name: SUITESCRIPT_CONNECTORS[1].name,
          _connectorId: SUITESCRIPT_CONNECTORS[1]._id,
          mode: 'somethingElse',
          displayName: SUITESCRIPT_CONNECTORS[1].name,
          isNotEditable: false,
          urlName: SUITESCRIPT_CONNECTORS[1].urlName,
        },
      ]);
    });
  });
});
