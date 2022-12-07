/* global describe, test, expect */
import reducer, { selectors } from '.';
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
  describe('RESOURCE.REQUEST_COLLECTION action', () => {
    test('should do nothing if resourceType is not of type audit', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.auditLogs.request('exports'));

      expect(newState).toEqual(prevState);
    });
    test('should do nothing if resourceType is audit but no next page path is present', () => {
      const prevState = {all: []};
      const newState = reducer(prevState, actions.auditLogs.request('audit'));

      expect(newState).toEqual(prevState);
    });
    test('should correctly update the status if next page path is present for audit', () => {
      const prevState = {all: []};
      const newState = reducer(prevState, actions.auditLogs.request('audit', '123', '/audit?123'));

      expect(newState).toEqual({all: [], loadMoreStatus: 'requested'});
    });
  });
  describe('should update the state properly when account level audit collection received', () => {
    const auditLogs = [{ _id: 'id1' }, { _id: 'id2' }];
    const auditLogsReceivedAction = actions.resource.receivedCollection(
      'audit',
      auditLogs
    );

    test('should update the state properly when the current state is undefined', () => {
      const newState = reducer(undefined, auditLogsReceivedAction);

      expect(newState).toEqual({ all: auditLogs, loadMoreStatus: 'received' });
    });
    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(
        { integrations: { int1: [{ _id: 'int_id1' }, { _id: 'int_id2' }] } },
        auditLogsReceivedAction
      );

      expect(newState).toEqual({ all: auditLogs, integrations: { int1: [{ _id: 'int_id1' }, { _id: 'int_id2' }] }, loadMoreStatus: 'received' });
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

      expect(newState).toEqual({ integrations: { int1: auditLogs }, loadMoreStatus: 'received' });
    });
    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(
        { integrations: { int2: [{ _id: 'int2_id1' }, { _id: 'int2_id2' }] } },
        auditLogsReceivedAction
      );

      expect(newState).toEqual({ integrations: { int1: auditLogs }, loadMoreStatus: 'received' });
    });
    test('should update the state properly when the current state is not empty and isNextPageCollection is true', () => {
      const newState = reducer(
        { integrations: { int1: [{ _id: 'int_id1' }, { _id: 'int_id2' }] } },
        actions.resource.receivedCollection(
          'integrations/int1/audit',
          [{ _id: 'int3_id3' }],
          undefined,
          true,
        )
      );

      expect(newState).toEqual({integrations: { int1: [{ _id: 'int_id1' }, { _id: 'int_id2' }, { _id: 'int3_id3' }] }, loadMoreStatus: 'received' });
    });
  });
  describe('RESOURCE.AUDIT_LOGS_NEXT_PATH action', () => {
    test('should correctly update the state with next page path', () => {
      const prevState = {all: []};
      const newState = reducer(prevState, actions.auditLogs.receivedNextPagePath('/audit?123'));

      expect(newState).toEqual({all: [], loadMoreStatus: 'received', nextPagePath: '/audit?123'});
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
    expect(selectors.auditLogs(state, undefined, undefined)).toEqual(logs);
  });
  test('should return correct resource audilt logs', () => {
    const state = reducer({ integrations: { int1: logs } }, 'some action');

    expect(selectors.auditLogs(state)).toEqual([]);
    expect(selectors.auditLogs(state, 'integrations', 'int1')).toEqual(logs);
    expect(selectors.auditLogs(state, 'integrations', 'int1')).toEqual(
      logs
    );
  });
  test('should return correct next page path from state', () => {
    expect(selectors.auditLogsNextPagePath()).toBeUndefined();
    expect(selectors.auditLogsNextPagePath({nextPagePath: '/audit?123'})).toEqual('/audit?123');
  });
  test('should return correct load more status from state', () => {
    expect(selectors.auditLoadMoreStatus()).toBeUndefined();
    expect(selectors.auditLoadMoreStatus({loadMoreStatus: 'requested'})).toEqual('requested');
  });
});
