/* global describe, expect, test */
import reducer, { selectors } from '.';
import actions from '../actions';

describe('Notifications region selector testcases', () => {
  describe('selectors.mkSubscribedNotifications test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkSubscribedNotifications();

      expect(selector()).toEqual([]);
    });

    const notifications = [
      {
        id: 'n1',
        message: 'hello',
        subscribedByUser: {
          email: 'u2@abc.com',
        },
      },
      {
        id: 'n2',
        message: 'heyy',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
    ];
    const state = reducer({
      user: {
        profile: {
          email: 'u1@abc.com',
        },
      },
      data: {
        resources: {
          notifications,
        },
      },
    },
    'some-action'
    );

    test('should return all notifications for the passed email', () => {
      const selector = selectors.mkSubscribedNotifications();

      expect(selector(state, 'u2@abc.com')).toEqual([notifications[0]]);
    });

    test('should return all notifications for the profile email if no email is passed', () => {
      const selector = selectors.mkSubscribedNotifications();

      expect(selector(state)).toEqual([notifications[1]]);
    });

    test('should return empty array if notifications doesn\'t exist for passed mailid', () => {
      const selector = selectors.mkSubscribedNotifications();

      expect(selector(state, 'u3@abc.com')).toEqual([]);
    });
  });

  describe('selectors.mkDiyFlows test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkDiyFlows();

      expect(selector()).toEqual([]);
    });

    const flows = [
      {
        _id: 'f1',
        _integrationId: 'i1',
      },
      {
        _id: 'f2',
        _integrationId: 'i1',
      },
      {
        _id: 'f3',
        _integrationId: 'i2',
      },
      {
        _id: 'f4',
      },
    ];

    const state = reducer(
      undefined,
      actions.resource.receivedCollection('flows', flows)
    );
    const selector = selectors.mkDiyFlows();

    test('should return all the flows linked to the passed integrationId', () => {
      expect(selector(state, 'i1')).toEqual(
        [
          flows[0],
          flows[1],
        ]
      );
    });
    test('should return all the standalone flows if no integrationId is passed', () => {
      expect(selector(state)).toEqual(
        [
          flows[3],
        ]
      );
    });

    test('should return all the standalone flows if none is passed as integration Id', () => {
      const selector = selectors.mkDiyFlows();

      expect(selector(state, 'none')).toEqual(
        [
          flows[3],
        ]
      );
    });
  });

  describe('selectors.mkDiyConnections test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      const selector = selectors.mkDiyConnections();

      expect(selector(undefined, {})).toEqual([]);
    });

    const conns = [
      {
        _id: 'c1',
        type: 'http',
      },
      {
        _id: 'c2',
        type: 'rest',
      },
      {
        _id: 'c3',
        type: 'ns',
      },
    ];

    let state = reducer(
      undefined,
      actions.resource.receivedCollection('connections', conns)
    );

    state = reducer(
      state,
      actions.resource.received('integrations', {
        _id: 'i1',
        _registeredConnectionIds: ['c1', 'c3'],
      })
    );

    const selector = selectors.mkDiyConnections();

    test('should return all the connections if passed integrationId is none', () => {
      expect(selector(state, 'none')).toEqual(conns);
    });

    test('should return all the registered connections for the passed integrationId', () => {
      expect(selector(state, 'i1')).toEqual([
        conns[0],
        conns[2],
      ]);
    });
  });

  describe('selectors.integrationNotificationResources test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationNotificationResources()).toEqual({
        connectionValues: [],
        connections: [],
        flowValues: [],
        flows: [],
      });
    });

    const conns = [
      {
        _id: 'c1',
      },
      {
        _id: 'c2',
      },
      {
        _id: 'c3',
      },
      {
        _id: 'c4',
        _integrationId: 'i2',
      }, {
        _id: 'c5',
      }, {
        _id: 'c6',
        _integrationId: 'i3',
      }, {
        _id: 'c7',
        _integrationId: 'i2',
      },
    ];

    const notifications = [
      {
        _id: 'n1',
        _connectionId: 'c1',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
      {
        _id: 'n2',
        _flowId: 'f1',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
      {
        _id: 'n3',
        _integrationId: 'i1',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
      {
        _id: 'n4',
        _connectionId: 'c4',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
      {
        _id: 'n5',
        _flowId: 'f4',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
    ];

    let state = reducer({
      user: {
        profile: {
          email: 'u1@abc.com',
        },
      },
      data: {
        resources: {
          notifications,
        },
      },
    },
    actions.resource.receivedCollection('connections', conns)
    );

    const flows = [
      {
        _id: 'f1',
        _integrationId: 'i1',
      },
      {
        _id: 'f2',
        _integrationId: 'i1',
      },
      {
        _id: 'f3',
      },
      {
        _id: 'f4',
        name: 'flow from a to b',
        _integrationId: 'i2',
      },
    ];

    state = reducer(
      state,
      actions.resource.receivedCollection('flows', flows)
    );

    const integrations = [{
      _id: 'i1',
      _registeredConnectionIds: ['c1', 'c2'],
    }, {
      _id: 'i2',
      _connectorId: 'c1',
      settings: {
        supportsMultiStore: true,
        sections: [{
          title: 'Section1',
          id: 's1',
          sections: [{
            flows: [{
              _id: 'f4',
            }],
          },
          ],
        }, {
          title: 'Section2',
          id: 's2',
          sections: [{
            flows: [{
              _id: 'f5',
            }, {
              _id: 'f6',
            }],
          }],
        }],
      },
    }];

    state = reducer(
      state,
      actions.resource.receivedCollection('integrations', integrations)
    );

    test('should include integrationId in flow values if notification exists for integration', () => {
      expect(selectors.integrationNotificationResources(state, 'i1', {
        userEmail: 'u1@abc.com',
      })).toEqual({
        connectionValues: ['c1'],
        connections: [
          conns[0],
          conns[1],
        ],
        flowValues: [
          'i1',
          flows[0],
          flows[1],
        ],
        flows: [
          flows[0],
          flows[1],
        ],
      });
    });

    test('should return notifications if connector integrationId is passed', () => {
      expect(selectors.integrationNotificationResources(state, 'i2', {
        userEmail: 'u1@abc.com',
        childId: 's1',
      })).toEqual({
        connectionValues: [
          'c4',
        ],
        connections: [
          {
            _id: 'c4',
            _integrationId: 'i2',
          },
          {
            _id: 'c7',
            _integrationId: 'i2',
          },
        ],
        flowValues: [
          'f4',
        ],
        flows: [
          {
            _id: 'f4',
            name: 'flow from a to b',
          },
        ],
      });
    });
  });

  describe('selectors.isFlowSubscribedForNotification test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isFlowSubscribedForNotification(undefined, {})).toEqual(false);
    });

    const notifications = [
      {
        _id: 'n3',
        _flowId: 'f1',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
      {
        _id: 'n6',
        _flowId: 'f4',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
      {
        _id: 'n4',
        _integrationId: 'i1',
        subscribedByUser: {
          email: 'u1@abc.com',
        },
      },
    ];

    const flows = [{
      _id: 'f1',
      _integrationId: 'i1',
    }, {
      _id: 'f2',
    }, {
      _id: 'f3',
      _integrationId: 'i1',
    }, {
      _id: 'f4',
    }];

    const state = reducer({
      user: {
        profile: {
          email: 'u1@abc.com',
        },
      },
      data: {
        resources: {
          notifications,
        },
      },
    },
    actions.resource.receivedCollection('flows', flows)
    );

    test('should return true if flow\'s integration is subscribed for notification', () => {
      expect(selectors.isFlowSubscribedForNotification(state, 'f3')).toEqual(true);
    });

    test('should return true if flow is subscribed for notification', () => {
      expect(selectors.isFlowSubscribedForNotification(state, 'f1')).toEqual(true);
    });

    test('should return true if stand-alone flow is subscribed for notification', () => {
      expect(selectors.isFlowSubscribedForNotification(state, 'f4')).toEqual(true);
    });

    test('should return false if flow is not subscribed for notification', () => {
      expect(selectors.isFlowSubscribedForNotification(state, 'f2')).toEqual(false);
    });
  });
});

