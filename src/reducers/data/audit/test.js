/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';

describe('audit reducer', () => {
  test('any other action should return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual({});
  });
  test('any other action, when state exists, should return original state', () => {
    const someState = { something: 'something' };
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });
  describe('should update the state properly when account level audit collection received', () => {
    const auditLogs = [{ _id: 'id1' }, { _id: 'id2' }];
    const auditLogsReceivedAction = actions.resource.receivedCollection(
      'audit',
      auditLogs
    );

    test('should update the state properly when the current state is undefined', () => {
      const newState = reducer(undefined, auditLogsReceivedAction);

      expect(newState).toEqual({ all: auditLogs });
    });
    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(
        { integrations: { int1: [{ _id: 'int_id1' }, { _id: 'int_id2' }] } },
        auditLogsReceivedAction
      );

      expect(newState).toEqual({ all: auditLogs });
    });
  });
  describe('should update the state properly when an integration audit collection received', () => {
    const auditLogs = [{ _id: 'int1_id1' }, { _id: 'int1_id2' }];
    const auditLogsReceivedAction = actions.resource.receivedCollection(
      'integrations/int1/audit',
      auditLogs
    );

    test('should update the state properly when the current state is undefined', () => {
      const newState = reducer(undefined, auditLogsReceivedAction);

      expect(newState).toEqual({ integrations: { int1: auditLogs } });
    });
    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(
        { integrations: { int2: [{ _id: 'int2_id1' }, { _id: 'int2_id2' }] } },
        auditLogsReceivedAction
      );

      expect(newState).toEqual({ integrations: { int1: auditLogs } });
    });
  });
  describe('clear audit logs', () => {
    test('should clear the state properly when it is empty', () => {
      const newState = reducer(undefined, actions.auditLogs.clear());

      expect(newState).toEqual({});
    });
    test('should clear the state properly when it is not empty', () => {
      const newState = reducer(
        { all: [{ _id: 'a1' }, { _id: 'a2' }], something: ['something'] },
        actions.auditLogs.clear()
      );

      expect(newState).toEqual({});
    });
  });
});

describe('auditLogs selector', () => {
  test('should return [] when state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.auditLogs(state)).toEqual([]);
    expect(selectors.auditLogs(state, 'something', 'something')).toEqual([]);
    expect(selectors.auditLogs(state, 'something', 'something', {})).toEqual(
      []
    );
  });
  const logs = [
    {
      _id: 'log1',
      resourceType: 'type1',
      _resourceId: 'type1_1',
      source: 's1',
      byUser: { _id: 'user1', name: 'User 1', email: 'user1@test.com' },
    },
    {
      _id: 'log2',
      resourceType: 'type1',
      _resourceId: 'type1_1',
      source: 's2',
      byUser: { _id: 'user2', name: 'User 2', email: 'user2@test.com' },
    },
    {
      _id: 'log3',
      resourceType: 'type2',
      _resourceId: 'type2_1',
      source: 's3',
      byUser: { _id: 'user2', name: 'User 2', email: 'user2@test.com' },
    },
    {
      _id: 'log4',
      resourceType: 'type2',
      _resourceId: 'type2_2',
      source: 's4',
      byUser: { _id: 'user3', name: 'User 3', email: 'user3@test.com' },
    },
    {
      _id: 'log5',
      resourceType: 'type1',
      _resourceId: 'type1_1',
      source: 's1',
      byUser: { _id: 'user1', name: 'User 1', email: 'user1@test.com' },
    },
    {
      _id: 'log6',
      resourceType: 'type1',
      _resourceId: 'type1_1',
      source: 's2',
      byUser: { _id: 'user2', name: 'User 2', email: 'user2@test.com' },
    },
    {
      _id: 'log7',
      resourceType: 'type2',
      _resourceId: 'type2_1',
      source: 's3',
      byUser: { _id: 'user2', name: 'User 2', email: 'user2@test.com' },
    },
    {
      _id: 'log8',
      resourceType: 'type2',
      _resourceId: 'type2_1',
      source: 's3',
      byUser: { _id: 'user2', name: 'User 2', email: 'user2@test.com' },
    },
    {
      _id: 'log9',
      resourceType: 'type2',
      _resourceId: 'type2_2',
      source: 's3',
      byUser: { _id: 'user2', name: 'User 2', email: 'user2@test.com' },
    },
  ];

  test('should return correct account audilt logs', () => {
    const state = reducer({ all: logs }, 'some action');

    expect(selectors.auditLogs(state)).toEqual(logs);
    expect(selectors.auditLogs(state, undefined, undefined, {})).toEqual(logs);
    expect(
      selectors.auditLogs(state, undefined, undefined, {
        resourceType: 'type1',
      })
    ).toEqual(logs.filter(log => log.resourceType === 'type1'));
    expect(
      selectors.auditLogs(state, undefined, undefined, {
        source: 's1',
        byUser: 'user1',
      })
    ).toEqual(
      logs.filter(log => log.source === 's1' && log.byUser._id === 'user1')
    );
    expect(
      selectors.auditLogs(state, undefined, undefined, {
        resourceType: 'type2',
        source: 's2',
        byUser: 'user2',
      })
    ).toEqual(
      logs.filter(
        log =>
          log.resourceType === 'type2' &&
          log.source === 's2' &&
          log.byUser._id === 'user2'
      )
    );
    expect(
      selectors.auditLogs(state, undefined, undefined, {
        resourceType: 'type2',
        _resourceId: 'type2_1',
        source: 's3',
        byUser: 'user2',
      })
    ).toEqual(
      logs.filter(
        log =>
          log.resourceType === 'type2' &&
          log._resourceId === 'type2_1' &&
          log.source === 's3' &&
          log.byUser._id === 'user2'
      )
    );
    expect(
      selectors.auditLogs(state, undefined, undefined, {
        resourceType: 'something',
        _resourceId: 'something else',
        source: 'something',
        byUser: 'something else',
      })
    ).toEqual([]);
  });
  test('should return correct resource audilt logs', () => {
    const state = reducer({ integrations: { int1: logs } }, 'some action');

    expect(selectors.auditLogs(state)).toEqual([]);
    expect(selectors.auditLogs(state, 'integrations', 'int1')).toEqual(logs);
    expect(selectors.auditLogs(state, 'integrations', 'int1', {})).toEqual(
      logs
    );
    expect(
      selectors.auditLogs(state, 'integrations', 'int1', {
        resourceType: 'type1',
      })
    ).toEqual(logs.filter(log => log.resourceType === 'type1'));
    expect(
      selectors.auditLogs(state, 'integrations', 'int1', {
        source: 's1',
        byUser: 'user1',
      })
    ).toEqual(
      logs.filter(log => log.source === 's1' && log.byUser._id === 'user1')
    );
    expect(
      selectors.auditLogs(state, 'integrations', 'int1', {
        resourceType: 'type2',
        source: 's2',
        byUser: 'user2',
      })
    ).toEqual(
      logs.filter(
        log =>
          log.resourceType === 'type2' &&
          log.source === 's2' &&
          log.byUser._id === 'user2'
      )
    );
    expect(
      selectors.auditLogs(state, 'integrations', 'int1', {
        resourceType: 'type2',
        _resourceId: 'type2_1',
        source: 's3',
        byUser: 'user2',
      })
    ).toEqual(
      logs.filter(
        log =>
          log.resourceType === 'type2' &&
          log._resourceId === 'type2_1' &&
          log.source === 's3' &&
          log.byUser._id === 'user2'
      )
    );
    expect(
      selectors.auditLogs(state, 'integrations', 'int1', {
        resourceType: 'something',
        _resourceId: 'something else',
        source: 'something',
        byUser: 'something else',
      })
    ).toEqual([]);
  });
});
