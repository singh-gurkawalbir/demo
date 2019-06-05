/* global describe, test, expect */
import reducer, * as selectors from './';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../utils/constants';

let logId = 0;
const allResources = {};

['integrations', 'connections', 'flows', 'exports', 'imports'].forEach(rt => {
  allResources[rt] = [];
  new Array(5).fill('something').forEach((v, i) => {
    allResources[rt].push({
      _id: `${rt}${i + 1}${i % 2 === 1 ? 'connector' : ''}`,
      name: `${rt} ${i + 1}`,
      something: 'test',
      somethingelse: 'xyz',
      _connectorId: i % 2 === 1 ? `connector${i + 1}` : undefined,
      _integrationId:
        i % 3 !== 0 && rt === 'flows' ? `integration${i + 1}` : undefined,
    });
  });
});

function getAuditLogDetails(resourceType, _resourceId) {
  logId += 1;
  const randomNumber = (logId % 4) + 1;
  const fieldChanges = [
    {
      fieldPath: 'field1',
      oldValue: `old${randomNumber}`,
      newValue: `new1${randomNumber}`,
    },
    {
      fieldPath: 'field1',
      oldValue: `old${randomNumber + 1}`,
      newValue: `new1${randomNumber + 1}`,
    },
  ];

  if (resourceType === 'import' && logId % 2 === 1) {
    fieldChanges.push({
      fieldPath: 'some_lookups',
      oldValue: `oldLookup${randomNumber + 1}`,
      newValue: `newLookup${randomNumber + 1}`,
    });
  }

  if (resourceType === 'import' && logId % 3 === 1) {
    fieldChanges.push({
      fieldPath: 'some_mapping',
      oldValue: `oldMapping${randomNumber + 1}`,
      newValue: `newMapping${randomNumber + 1}`,
    });
  }

  return {
    _id: `log${logId}`,
    resourceType,
    _resourceId,
    source: `s${randomNumber}`,
    byUser: {
      _id: `user${randomNumber}`,
      name: `User ${randomNumber}`,
      email: `user${randomNumber}@test.com`,
    },
    fieldChanges,
  };
}

function getExpectedLogs(allLogs, filters = {}) {
  const filteredLogs = allLogs.filter(l => {
    if (filters.resourceType && filters.resourceType !== l.resourceType) {
      return false;
    }

    if (filters._resourceId && filters._resourceId !== l._resourceId) {
      return false;
    }

    if (filters.byUser && filters.byUser !== l.byUser._id) {
      return false;
    }

    if (filters.source && filters.source !== l.source) {
      return false;
    }

    return true;
  });
  const expectedLogs = filteredLogs.filter(l => {
    if (!l._resourceId.includes('connector')) {
      return true;
    }

    if (['integration', 'connection', 'flow'].includes(l.resourceType)) {
      return true;
    }

    if (l.fieldChanges && l.fieldChanges.length) {
      // eslint-disable-next-line no-param-reassign
      l.fieldChanges = l.fieldChanges.filter(
        fc =>
          fc.fieldPath &&
          (fc.fieldPath.includes('mapping') || fc.fieldPath.includes('lookups'))
      );

      return l.fieldChanges.length > 0;
    }

    return false;
  });
  const expandedLogs = [];

  expectedLogs.forEach(l => {
    if (l.fieldChanges && l.fieldChanges.length > 0) {
      l.fieldChanges.forEach(fc => {
        expandedLogs.push({ ...l, fieldChanges: undefined, fieldChange: fc });
      });
    } else {
      expandedLogs.push({ ...l, fieldChange: {} });
    }
  });

  return expandedLogs;
}

describe('auditLogs selector', () => {
  test('should return correct details when state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.auditLogs(state)).toEqual([]);
    expect(selectors.auditLogs(state, undefined, undefined, {})).toEqual([]);
    expect(selectors.auditLogs(state, 'something', 'somethingelse')).toEqual(
      []
    );
    expect(
      selectors.auditLogs(state, 'something', 'somethingelse', {})
    ).toEqual([]);
  });

  test('should return correct details for account audit logs', () => {
    const logs = [];

    Object.keys(allResources).forEach(rt => {
      allResources[rt].forEach(r => {
        logs.push(
          getAuditLogDetails(RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt], r._id)
        );
      });
    });
    const state = reducer(
      { resources: allResources, audit: { all: logs } },
      'some action'
    );
    let resultLogs = selectors.auditLogs(state);

    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs));
    resultLogs = selectors.auditLogs(state, undefined, undefined, {
      resourceType: 'integration',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, { resourceType: 'integration' })
    );
    resultLogs = selectors.auditLogs(state, undefined, undefined, {
      source: 's1',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs, { source: 's1' }));
    resultLogs = selectors.auditLogs(state, undefined, undefined, {
      byUser: 'user2',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs, { byUser: 'user2' }));
    resultLogs = selectors.auditLogs(state, undefined, undefined, {
      source: 's3',
      byUser: 'user3',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, { source: 's3', byUser: 'user3' })
    );
    resultLogs = selectors.auditLogs(state, undefined, undefined, {
      resourceType: 'integration',
      _resourceId: 'integrations1',
      source: 's2',
      byUser: 'user2',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, {
        resourceType: 'integration',
        _resourceId: 'integrations1',
        source: 's2',
        byUser: 'user2',
      })
    );
    expect(
      selectors.auditLogs(state, 'something', 'somethingelse', {})
    ).toEqual([]);
    expect(
      selectors.auditLogs(state, 'something', 'somethingelse', {
        resourceType: 'integration',
      })
    ).toEqual([]);
  });
  test('should return correct details for diy integration audit logs', () => {
    const logs = [];

    Object.keys(allResources).forEach(rt => {
      allResources[rt].forEach(r => {
        if (rt === 'integrations') {
          if (r._id === 'integrations1') {
            logs.push(
              getAuditLogDetails(RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt], r._id)
            );
          }
        } else {
          logs.push(
            getAuditLogDetails(RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt], r._id)
          );
        }
      });
    });
    const state = reducer(
      {
        resources: allResources,
        audit: { integrations: { integrations1: logs } },
      },
      'some action'
    );
    let resultLogs = selectors.auditLogs(
      state,
      'integrations',
      'integrations1'
    );

    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs));
    resultLogs = selectors.auditLogs(state, 'integrations', 'integrations1', {
      resourceType: 'integration',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, { resourceType: 'integration' })
    );
    resultLogs = selectors.auditLogs(state, 'integrations', 'integrations1', {
      source: 's1',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs, { source: 's1' }));
    resultLogs = selectors.auditLogs(state, 'integrations', 'integrations1', {
      byUser: 'user2',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs, { byUser: 'user2' }));
    resultLogs = selectors.auditLogs(state, 'integrations', 'integrations1', {
      source: 's3',
      byUser: 'user3',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, { source: 's3', byUser: 'user3' })
    );
    resultLogs = selectors.auditLogs(state, 'integrations', 'integrations1', {
      resourceType: 'integration',
      _resourceId: 'integrations1',
      source: 's3',
      byUser: 'user3',
    });
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, {
        resourceType: 'integration',
        _resourceId: 'integrations1',
        source: 's3',
        byUser: 'user3',
      })
    );
    expect(
      selectors.auditLogs(state, 'something', 'somethingelse', {})
    ).toEqual([]);
    expect(
      selectors.auditLogs(state, 'something', 'somethingelse', {
        resourceType: 'integration',
      })
    ).toEqual([]);
    expect(selectors.auditLogs(state)).toEqual([]);
  });
  test('should return correct details for connector integration audit logs', () => {
    const logs = [];

    Object.keys(allResources).forEach(rt => {
      allResources[rt].forEach(r => {
        if (rt === 'integrations') {
          if (r._id === 'integrations2connector') {
            logs.push(
              getAuditLogDetails(RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt], r._id)
            );
          }
        } else {
          logs.push(
            getAuditLogDetails(RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt], r._id)
          );
        }
      });
    });
    const state = reducer(
      {
        resources: allResources,
        audit: { integrations: { integrations2connector: logs } },
      },
      'some action'
    );
    let resultLogs = selectors.auditLogs(
      state,
      'integrations',
      'integrations2connector'
    );

    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs));
    resultLogs = selectors.auditLogs(
      state,
      'integrations',
      'integrations2connector',
      {
        resourceType: 'integration',
      }
    );
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, { resourceType: 'integration' })
    );
    resultLogs = selectors.auditLogs(
      state,
      'integrations',
      'integrations2connector',
      {
        source: 's1',
      }
    );
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs, { source: 's1' }));
    resultLogs = selectors.auditLogs(
      state,
      'integrations',
      'integrations2connector',
      {
        byUser: 'user2',
      }
    );
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(getExpectedLogs(logs, { byUser: 'user2' }));
    resultLogs = selectors.auditLogs(
      state,
      'integrations',
      'integrations2connector',
      {
        source: 's3',
        byUser: 'user3',
      }
    );
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, { source: 's3', byUser: 'user3' })
    );
    resultLogs = selectors.auditLogs(
      state,
      'integrations',
      'integrations2connector',
      {
        resourceType: 'integration',
        _resourceId: 'integrations2connector',
        source: 's4',
        byUser: 'user4',
      }
    );
    expect(resultLogs.length).toBeGreaterThan(0);
    expect(resultLogs).toEqual(
      getExpectedLogs(logs, {
        resourceType: 'integration',
        _resourceId: 'integrations2connector',
        source: 's4',
        byUser: 'user4',
      })
    );
    expect(
      selectors.auditLogs(state, 'something', 'somethingelse', {})
    ).toEqual([]);
    expect(
      selectors.auditLogs(state, 'something', 'somethingelse', {
        resourceType: 'integration',
      })
    ).toEqual([]);
    expect(selectors.auditLogs(state)).toEqual([]);
  });
});

describe('affectedResourcesAndUsersFromAuditLogs selector', () => {
  test('should return correct details when state is undefined', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.affectedResourcesAndUsersFromAuditLogs(state)).toEqual({
      affectedResources: {},
      users: [],
    });
    expect(
      selectors.affectedResourcesAndUsersFromAuditLogs(
        state,
        'something',
        'somethingelse'
      )
    ).toEqual({
      affectedResources: {},
      users: [],
    });
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

  test('should return correct details for account audit logs', () => {
    const state = reducer({ audit: { all: logs } }, 'some action');

    expect(selectors.affectedResourcesAndUsersFromAuditLogs(state)).toEqual({
      affectedResources: {
        type1: ['type1_1'],
        type2: ['type2_1', 'type2_2'],
      },
      users: [
        { _id: 'user1', name: 'User 1', email: 'user1@test.com' },
        { _id: 'user2', name: 'User 2', email: 'user2@test.com' },
        { _id: 'user3', name: 'User 3', email: 'user3@test.com' },
      ],
    });
    expect(
      selectors.affectedResourcesAndUsersFromAuditLogs(
        state,
        'something',
        'somethingelse'
      )
    ).toEqual({
      affectedResources: {},
      users: [],
    });
  });
  test('should return correct details for integration audit logs', () => {
    const state = reducer(
      { audit: { integrations: { int1: logs } } },
      'some action'
    );

    expect(
      selectors.affectedResourcesAndUsersFromAuditLogs(
        state,
        'integrations',
        'int1'
      )
    ).toEqual({
      affectedResources: {
        type1: ['type1_1'],
        type2: ['type2_1', 'type2_2'],
      },
      users: [
        { _id: 'user1', name: 'User 1', email: 'user1@test.com' },
        { _id: 'user2', name: 'User 2', email: 'user2@test.com' },
        { _id: 'user3', name: 'User 3', email: 'user3@test.com' },
      ],
    });
    expect(selectors.affectedResourcesAndUsersFromAuditLogs(state)).toEqual({
      affectedResources: {},
      users: [],
    });
  });
});
