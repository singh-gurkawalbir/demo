/* global expect, describe, test */
import sortBy from 'lodash/sortBy';
import { getAllApplications, getTileId, sortTiles, tileCompare, tileStatus } from '.';
import { applicationsList } from '../../constants/applications';
import {CONNECTORS_TO_IGNORE, TILE_STATUS} from '../constants';

const tiles = [
  {
    _integrationId: 'integration1',
    name: 'Integration One',
    numError: 0,
    numFlows: 2,
    status: TILE_STATUS.IS_PENDING_SETUP,
  },
  {
    _integrationId: 'integration2',
    name: 'Integration Two',
    numError: 4,
    numFlows: 3,
    status: TILE_STATUS.HAS_ERRORS,
  },
  {
    _integrationId: 'integration3',
    name: 'Integration Three',
    numError: 9,
    offlineConnections: ['conn1', 'conn2'],
    numFlows: 4,
    status: TILE_STATUS.HAS_ERRORS,
  },
  {
    _integrationId: 'integration4',
    name: 'Integration Four',
    numError: 0,
    offlineConnections: ['conn1', 'conn2'],
    numFlows: 5,
    status: TILE_STATUS.UNINSTALL,
  },
  {
    _integrationId: 'integration5',
    _connectorId: 'connector1',
    name: 'Connector 1',
    numFlows: 6,
  },
  {
    _integrationId: 'integration6',
    _connectorId: 'connector1',
    tag: 'tag 1',
    name: 'Connector 1',
    numError: 36,
    numFlows: 7,
    status: TILE_STATUS.UNINSTALL,
  },
  {
    _integrationId: 'integration7',
    _connectorId: 'connector1',
    tag: 'tag 2',
    name: 'Connector 1',
    numError: 49,
    offlineConnections: ['conn1'],
    numFlows: 8,
    status: TILE_STATUS.HAS_ERRORS,
  },
  {
    _integrationId: 'integration8',
    _connectorId: 'connector2',
    name: 'Connector 2',
    numFlows: 9,
  },
];

describe('getAllApplications util', () => {
  const applications = sortBy(
    applicationsList().filter(app => !CONNECTORS_TO_IGNORE.includes(app.id)),
    app => app.name.toLowerCase());
  const defaultFilter = [{ _id: 'all', name: 'All applications'}];
  const options = applications.map(a => ({_id: a.id, name: a.name}));
  const expected = [...defaultFilter, ...options];

  test('should return correct applications list to be shown in multiselect dropdown', () => {
    expect(getAllApplications()).toEqual(expected);
  });
});

describe('sortTiles util', () => {
  const tilesOrder = [
    'integration7',
    'integration8',
    'integration5',
    'integration2',
  ];

  test('should not throw error for invalid arguments', () => {
    expect(sortTiles()).toEqual([]);
  });
  test('should return original tiles if tiles order is not passed', () => {
    expect(sortTiles(tiles)).toEqual(tiles);
  });
  test('should return tiles sorted by the given tiles order', () => {
    const expected = [
      {
        _integrationId: 'integration7',
        _connectorId: 'connector1',
        tag: 'tag 2',
        name: 'Connector 1',
        numError: 49,
        offlineConnections: ['conn1'],
        numFlows: 8,
        status: TILE_STATUS.HAS_ERRORS,
      },
      {
        _integrationId: 'integration8',
        _connectorId: 'connector2',
        name: 'Connector 2',
        numFlows: 9,
      },
      {
        _integrationId: 'integration5',
        _connectorId: 'connector1',
        name: 'Connector 1',
        numFlows: 6,
      },
      {
        _integrationId: 'integration2',
        name: 'Integration Two',
        numError: 4,
        numFlows: 3,
        status: TILE_STATUS.HAS_ERRORS,
      },
      {
        _integrationId: 'integration1',
        name: 'Integration One',
        numError: 0,
        numFlows: 2,
        status: TILE_STATUS.IS_PENDING_SETUP,
      },
      {
        _integrationId: 'integration3',
        name: 'Integration Three',
        numError: 9,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 4,
        status: TILE_STATUS.HAS_ERRORS,
      },
      {
        _integrationId: 'integration4',
        name: 'Integration Four',
        numError: 0,
        offlineConnections: ['conn1', 'conn2'],
        numFlows: 5,
        status: TILE_STATUS.UNINSTALL,
      },
      {
        _integrationId: 'integration6',
        _connectorId: 'connector1',
        tag: 'tag 1',
        name: 'Connector 1',
        numError: 36,
        status: TILE_STATUS.UNINSTALL,
        numFlows: 7,
      },
    ];

    expect(sortTiles(tiles, tilesOrder)).toEqual(expected);
  });
});

describe('tileStatus util', () => {
  test('should not throw error for invalid arguments', () => {
    expect(tileStatus()).toEqual({
      label: 'Success',
      variant: 'success' });
  });
  test('should return correct label and variant if tile status is pending setup', () => {
    expect(tileStatus(tiles[0])).toEqual({
      label: 'Continue setup >',
      variant: 'warning' });
  });
  test('should return correct label and variant if tile status is uninstall', () => {
    expect(tileStatus(tiles[3])).toEqual({
      label: 'Continue uninstall >',
      variant: 'warning' });
  });
  test('should return correct label and variant if tile has errors', () => {
    expect(tileStatus(tiles[1])).toEqual({
      label: '4 errors',
      variant: 'error' });
  });
  test('should return correct label and variant if tile status is success', () => {
    expect(tileStatus(tiles[4])).toEqual({
      label: 'Success',
      variant: 'success' });
  });
});

describe('getTileId util', () => {
  test('should not throw error for invalid argumets', () => {
    expect(getTileId()).toEqual('');
  });
  test('should return integrationId if tile is not suitescript', () => {
    expect(getTileId(tiles[0])).toEqual('integration1');
  });
  test('should return a combination of ssLinkedConnectionId and integrationId if tile is suitescript', () => {
    const ssTile = {
      _integrationId: 'ssIntegration1',
      ssLinkedConnectionId: 'suitescript1',
    };

    expect(getTileId(ssTile)).toEqual('suitescript1_ssIntegration1');
  });
});

describe('tileCompare function test', () => {
  test('should return string compare if sortProperty is not status', () => {
    const tileA = {
      name: 'a',
    };
    const tileB = {
      name: 'b',
    };

    expect(tileCompare('name', false)(tileA, tileB)).toEqual(-1);
  });
  test('should give higher priority to tile with connection errors', () => {
    const tileA = {
      offlineConnections: ['a', 'b'],
    };
    const tileB = {
      numError: 2,
    };

    expect(tileCompare('status', false)(tileA, tileB)).toEqual(2);
    expect(tileCompare('status', true)(tileA, tileB)).toEqual(-2);
    expect(tileCompare('status', false)(tileB, tileA)).toEqual(-2);
    expect(tileCompare('status', true)(tileB, tileA)).toEqual(2);
  });
  test('should give higher priority to tile with more errors', () => {
    const tileA = {
      offlineConnections: ['a', 'b', 'c'],
      status: TILE_STATUS.SUCCESS,
    };
    const tileB = {
      numError: 2,
      status: TILE_STATUS.HAS_ERRORS,
    };

    expect(tileCompare('status', false)(tileA, tileB)).toEqual(1);
    expect(tileCompare('status', true)(tileA, tileB)).toEqual(-1);
  });
  test('should give higher priority to tile with more errors if the status of tiles is same', () => {
    const tileA = {
      offlineConnections: ['a', 'b'],
      numError: 1,
      status: TILE_STATUS.HAS_ERRORS,
    };
    const tileB = {
      numError: 2,
      status: TILE_STATUS.HAS_ERRORS,
    };

    expect(tileCompare('status', false)(tileA, tileB)).toEqual(1);
    expect(tileCompare('status', true)(tileA, tileB)).toEqual(-1);
  });

  test('should give higher priority to successful tiles than continue setup/uninstall', () => {
    const tileA = {
      status: TILE_STATUS.SUCCESS,
    };
    const tileB = {
      status: TILE_STATUS.IS_PENDING_SETUP,
    };

    expect(tileCompare('status', false)(tileA, tileB)).toEqual(1);
    expect(tileCompare('status', true)(tileA, tileB)).toEqual(-1);
    expect(tileCompare('status', false)(tileB, tileA)).toEqual(-1);
    expect(tileCompare('status', true)(tileB, tileA)).toEqual(1);
  });
  test('should give higher priority to continue setup tiles than continue uninstall', () => {
    const tileA = {
      status: TILE_STATUS.IS_PENDING_SETUP,
    };
    const tileB = {
      status: TILE_STATUS.UNINSTALL,
    };

    expect(tileCompare('status', false)(tileA, tileB)).toEqual(1);
    expect(tileCompare('status', true)(tileA, tileB)).toEqual(-1);
    expect(tileCompare('status', false)(tileB, tileA)).toEqual(-1);
    expect(tileCompare('status', true)(tileB, tileA)).toEqual(1);
  });
});
