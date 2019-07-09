/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';
import { SUITESCRIPT_CONNECTORS } from '../../../utils/constants';

describe('suiteScript reducer', () => {
  test('any other action should return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual({});
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

      expect(newState).toEqual({ [connectionId]: { tiles } });
    });
    test('should update the state properly when the current state is not empty', () => {
      const state = {
        c2: { tiles: ['something'] },
        [connectionId]: { flows: ['something else'] },
      };
      const newState = reducer(state, tilesReceivedAction);
      const expected = { ...state };

      expected[connectionId].tiles = tiles;

      expect(newState).toEqual(expected);
    });
  });
});

describe('tiles selector', () => {
  test('should return [] when the state is empty', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.tiles(state)).toEqual([]);
    expect(selectors.tiles(state, 'something')).toEqual([]);
  });
  describe('should return correct results for different connectionIds', () => {
    const state = {
      c1: {
        tiles: [
          { _integrationId: 'i1', name: 'i one' },
          { _integrationId: 'i2', name: 'i two' },
        ],
        something: ['something else'],
      },
      c2: {
        tiles: [
          { _integrationId: 'i2', name: 'i two' },
          { _integrationId: 'i3', name: 'i three' },
          { _integrationId: 'i4', name: SUITESCRIPT_CONNECTORS[0].name },
          { _integrationId: 'i5', name: SUITESCRIPT_CONNECTORS[1].name },
        ],
        somethingElse: ['something'],
      },
    };

    test('should return correct results for connection c1 [diy integrations only]', () => {
      const newState = reducer(state, 'some action');

      expect(selectors.tiles(newState, 'c1')).toEqual([
        {
          _ioConnectionId: 'c1',
          _id: 'c1_i1',
          _integrationId: 'i1',
          name: 'i one',
        },
        {
          _ioConnectionId: 'c1',
          _id: 'c1_i2',
          _integrationId: 'i2',
          name: 'i two',
        },
      ]);
    });
    test('should return correct results for connection c2 [diy + connector integrations]', () => {
      const newState = reducer(state, 'some action');

      expect(selectors.tiles(newState, 'c2')).toEqual([
        {
          _ioConnectionId: 'c2',
          _id: 'c2_i2',
          _integrationId: 'i2',
          name: 'i two',
        },
        {
          _ioConnectionId: 'c2',
          _id: 'c2_i3',
          _integrationId: 'i3',
          name: 'i three',
        },
        {
          _ioConnectionId: 'c2',
          _id: 'c2_i4',
          _integrationId: 'i4',
          name: SUITESCRIPT_CONNECTORS[0].name,
          _connectorId: SUITESCRIPT_CONNECTORS[0]._id,
        },
        {
          _ioConnectionId: 'c2',
          _id: 'c2_i5',
          _integrationId: 'i5',
          name: SUITESCRIPT_CONNECTORS[1].name,
          _connectorId: SUITESCRIPT_CONNECTORS[1]._id,
        },
      ]);
    });
  });
});

describe('integrations selector', () => {
  test('should return [] when the state is empty', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.integrations(state)).toEqual([]);
    expect(selectors.integrations(state, 'something')).toEqual([]);
  });
  describe('should return correct results for different connectionIds', () => {
    const state = {
      c1: {
        tiles: [
          { _integrationId: 'i1', name: 'i one' },
          { _integrationId: 'i2', name: 'i two' },
        ],
        something: ['something else'],
      },
      c2: {
        tiles: [
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
        somethingElse: ['something'],
      },
    };

    test('should return correct results for connection c1 [diy integrations only]', () => {
      const newState = reducer(state, 'some action');

      expect(selectors.integrations(newState, 'c1')).toEqual([
        {
          _ioConnectionId: 'c1',
          _id: 'i1',
          name: 'i one',
        },
        {
          _ioConnectionId: 'c1',
          _id: 'i2',
          name: 'i two',
        },
      ]);
    });
    test('should return correct results for connection c2 [diy + connector integrations]', () => {
      const newState = reducer(state, 'some action');

      expect(selectors.integrations(newState, 'c2')).toEqual([
        {
          _ioConnectionId: 'c2',
          _id: 'i2',
          name: 'i two',
        },
        {
          _ioConnectionId: 'c2',
          _id: 'i3',
          name: 'i three',
        },
        {
          _ioConnectionId: 'c2',
          _id: 'i4',
          name: SUITESCRIPT_CONNECTORS[0].name,
          _connectorId: SUITESCRIPT_CONNECTORS[0]._id,
          mode: 'something',
        },
        {
          _ioConnectionId: 'c2',
          _id: 'i5',
          name: SUITESCRIPT_CONNECTORS[1].name,
          _connectorId: SUITESCRIPT_CONNECTORS[1]._id,
          mode: 'somethingElse',
        },
      ]);
    });
  });
});
