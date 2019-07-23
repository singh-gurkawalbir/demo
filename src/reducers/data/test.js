/* global describe, test, expect */
import each from 'jest-each';
import reducer, * as selectors from './';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';

const allResources = {};
let isConnector = false;
let uniqueId;
let flowIntegrationId;
const logIds = {};
let logId = 0;

['integrations', 'connections', 'flows', 'exports', 'imports'].forEach(rt => {
  allResources[rt] = [];
  logIds[RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt]] = 0;
  new Array(5).fill('something').forEach((v, i) => {
    uniqueId = i + 1;
    isConnector = i % 2 === 1;
    flowIntegrationId = undefined;

    if (rt === 'flows' && i === 0) {
      flowIntegrationId = `integration${uniqueId}`;
    }

    allResources[rt].push({
      _id: `${rt}${uniqueId}${isConnector ? 'connector' : ''}`,
      name: `${rt} ${uniqueId}`,
      something: 'test',
      somethingelse: 'xyz',
      _connectorId: isConnector ? `connector${uniqueId}` : undefined,
      _integrationId: flowIntegrationId,
    });
  });
});

function getRandomUser(logId) {
  const logNumber = parseInt(logId.split('-')[2], 10);
  let randomUser = logNumber % 3;

  if (randomUser === 0) {
    randomUser = 3;
  }

  return {
    _id: `user${randomUser}`,
    name: `User ${randomUser}`,
    email: `user${randomUser}@test.com`,
  };
}

function getRandomSource(logId) {
  const logNumber = parseInt(logId.split('-')[2], 10);
  let randomSource = logNumber % 4;

  if (randomSource === 0) {
    randomSource = 4;
  }

  return `source${randomSource}`;
}

function getAuditLogDetails(resourceType, _resourceId) {
  logIds[resourceType] += 1;
  logId = logIds[resourceType];
  let randomNumber = logId % 5;

  if (randomNumber === 0) {
    randomNumber = 5;
  }

  const fieldChanges = [
    {
      fieldPath: 'field1',
      oldValue: `old${randomNumber}`,
      newValue: `new${randomNumber}`,
    },
    {
      fieldPath: 'field2',
      oldValue: `old${randomNumber + 1}`,
      newValue: `new${randomNumber + 1}`,
    },
  ];

  if (resourceType === 'import' && logId % 2 === 1) {
    fieldChanges.push({
      fieldPath: 'some_lookups',
      oldValue: `oldLookup${randomNumber + 3}`,
      newValue: `newLookup${randomNumber + 3}`,
    });
  }

  if (resourceType === 'import' && logId % 3 === 1) {
    fieldChanges.push({
      fieldPath: 'some_mapping',
      oldValue: `oldMapping${randomNumber + 4}`,
      newValue: `newMapping${randomNumber + 4}`,
    });
  }

  return {
    _id: `log-${resourceType}-${logId}`,
    resourceType,
    _resourceId,
    source: getRandomSource(`log-${resourceType}-${logId}`),
    byUser: getRandomUser(`log-${resourceType}-${logId}`),
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

function getTestCases(resourceType = undefined, resourceId = undefined) {
  let testCases = [
    [resourceType, resourceId, undefined, true],
    [resourceType, resourceId, { resourceType: 'integration' }, true],
    [resourceType, resourceId, { source: 'source1' }, true],
    [resourceType, resourceId, { byUser: 'user2' }, true],
    [resourceType, resourceId, { source: 'source3', byUser: 'user3' }, true],
    [
      resourceType,
      resourceId,
      {
        resourceType: 'integration',
        _resourceId: resourceId,
        source: 'source1',
        byUser: 'user1',
      },
      true,
    ],
    [
      resourceType,
      resourceId,
      {
        resourceType: 'flow',
        _resourceId: 'flows3',
        source: 'source3',
        byUser: 'user3',
      },
      true,
    ],
    [
      resourceType,
      resourceId,
      {
        resourceType: 'connection',
        _resourceId: 'connections5',
        source: 'source1',
        byUser: 'user2',
      },
      true,
    ],
    [
      resourceType,
      resourceId,
      {
        resourceType: 'export',
        _resourceId: 'exports1',
        source: 'source1',
        byUser: 'user1',
      },
      true,
    ],
    [
      resourceType,
      resourceId,
      {
        resourceType: 'import',
        _resourceId: 'imports3',
        source: 'source3',
        byUser: 'user3',
      },
      true,
    ],
    ['something', 'somethingelse', undefined, false],
    [
      'something',
      'somethingelse',
      {
        resourceType: 'integration',
      },
      false,
    ],
  ];

  if (!resourceType && !resourceId) {
    // account level audit logs
    testCases = testCases.concat([
      [
        undefined,
        undefined,
        {
          resourceType: 'integration',
          _resourceId: 'integrations2connector',
          source: 'source2',
          byUser: 'user2',
        },
        true,
      ],
    ]);
  }

  if (
    (!resourceType && !resourceId) ||
    (resourceType === 'integrations' &&
      resourceId &&
      resourceId.endsWith('connector'))
  ) {
    // account level or connector integration audit logs
    testCases = testCases.concat([
      [
        resourceType,
        resourceId,
        {
          resourceType: 'flow',
          _resourceId: 'flows4connector',
          source: 'source4',
          byUser: 'user1',
        },
        true,
      ],
      [
        resourceType,
        resourceId,
        {
          resourceType: 'connection',
          _resourceId: 'connections2connector',
          source: 'source2',
          byUser: 'user2',
        },
        true,
      ],
      [
        resourceType,
        resourceId,
        {
          resourceType: 'export',
          _resourceId: 'exports2connector',
          source: 'source2',
          byUser: 'user2',
        },
        false,
      ],
      [
        resourceType,
        resourceId,
        {
          resourceType: 'import',
          _resourceId: 'imports4connector',
          source: 'source4',
          byUser: 'user1',
        },
        true,
      ],
    ]);
  }

  return testCases;
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

  describe('account audit logs selector ', () => {
    const logs = [];

    Object.keys(allResources).forEach(rt => {
      logIds[RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt]] = 0;
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

    each(getTestCases(undefined, undefined)).test(
      'should return correct details when resourceType is %s, resourceId is %s and filters are %j',
      (
        resourceType,
        resourceId,
        filters,
        resultsLengthShouldBeGreaterThanZero
      ) => {
        const resultLogs = selectors.auditLogs(
          state,
          resourceType,
          resourceId,
          filters
        );

        if (resultsLengthShouldBeGreaterThanZero) {
          expect(resultLogs.length).toBeGreaterThan(0);
          expect(resultLogs).toEqual(getExpectedLogs(logs, filters));
        } else {
          expect(resultLogs.length).toEqual(0);
        }
      }
    );
  });

  describe('diy integration audit logs selector', () => {
    const logs = [];
    const resourceType = 'integrations';
    const resourceId = 'integrations1';

    Object.keys(allResources).forEach(rt => {
      logIds[RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt]] = 0;
      allResources[rt].forEach(r => {
        if (rt === resourceType) {
          if (r._id === resourceId) {
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
        audit: { [resourceType]: { [resourceId]: logs } },
      },
      'some action'
    );

    each(getTestCases(resourceType, resourceId)).test(
      'should return correct details when resourceType is %s, resourceId is %s and filters are %j',
      (
        resourceType,
        resourceId,
        filters,
        resultsLengthShouldBeGreaterThanZero
      ) => {
        const resultLogs = selectors.auditLogs(
          state,
          resourceType,
          resourceId,
          filters
        );

        if (resultsLengthShouldBeGreaterThanZero) {
          expect(resultLogs.length).toBeGreaterThan(0);
          expect(resultLogs).toEqual(getExpectedLogs(logs, filters));
        } else {
          expect(resultLogs.length).toEqual(0);
        }
      }
    );
  });

  describe('connector integration audit logs selector', () => {
    const logs = [];
    const resourceType = 'integrations';
    const resourceId = 'integrations2connector';

    Object.keys(allResources).forEach(rt => {
      logIds[RESOURCE_TYPE_PLURAL_TO_SINGULAR[rt]] = 0;
      allResources[rt].forEach(r => {
        if (rt === resourceType) {
          if (r._id === resourceId) {
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
        audit: { [resourceType]: { [resourceId]: logs } },
      },
      'some action'
    );

    each(getTestCases(resourceType, resourceId)).test(
      'should return correct details when resourceType is %s, resourceId is %s and filters are %j',
      (
        resourceType,
        resourceId,
        filters,
        resultsLengthShouldBeGreaterThanZero
      ) => {
        const resultLogs = selectors.auditLogs(
          state,
          resourceType,
          resourceId,
          filters
        );

        if (resultsLengthShouldBeGreaterThanZero) {
          expect(resultLogs.length).toBeGreaterThan(0);
          expect(resultLogs).toEqual(getExpectedLogs(logs, filters));
        } else {
          expect(resultLogs.length).toEqual(0);
        }
      }
    );
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
