/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../actions';

const integrationId = 'int-revisions-123';

describe('revisions reducer', () => {
  describe('RESOURCE.REQUEST_COLLECTION action', () => {
    test('should do nothing if the resourceType is not of type revisions', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.resource.requestCollection('exports'));

      expect(newState).toEqual(prevState);
    });
    test('should fetch integrationId from resourceType and add status as requested for that integration state', () => {
      const prevState = { [integrationId]: {} };
      const newState = reducer(prevState, actions.resource.requestCollection(`integrations/${integrationId}/revisions`));

      const expectedState = {
        [integrationId]: {
          status: 'requested',
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should add integrationId state if there is no existing state', () => {
      const newState = reducer({}, actions.resource.requestCollection(`integrations/${integrationId}/revisions`));

      const expectedState = {
        [integrationId]: {
          status: 'requested',
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('RESOURCE.RECEIVED_COLLECTION action', () => {
    test('should do nothing if the resourceType is not of type revisions', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.resource.receivedCollection('exports'));

      expect(newState).toEqual(prevState);
    });
    test('should fetch integrationId from resourceType and add status as received and also add data for that integration state', () => {
      const prevState = { [integrationId]: {
        status: 'requested',
      } };
      const newState = reducer(prevState, actions.resource.receivedCollection(`integrations/${integrationId}/revisions`, []));

      const expectedState = {
        [integrationId]: {
          status: 'received',
          data: [],
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should add integrationId state if there is no existing state', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.resource.receivedCollection(`integrations/${integrationId}/revisions`, []));

      const expectedState = {
        [integrationId]: {
          status: 'received',
          data: [],
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('RESOURCE.RECEIVED action', () => {
    const revisions = [
      {
        _id: 'rev-1',
        name: 'rev1',
      },
      {
        _id: 'rev-2',
        name: 'rev2',
      },
    ];

    test('should do nothing if the resourceType is not of type revisions', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.resource.received('exports', []));

      expect(newState).toEqual(prevState);
    });
    test('should add the revision at the end if the resource\'s id does not match with any of the existing revisions ', () => {
      const prevState = {
        [integrationId]: {
          status: 'received',
          data: revisions,
        },
      };
      const newRevision = {
        _id: 'rev-3',
        name: 'rev3',
      };
      const expectedState = {
        [integrationId]: {
          status: 'received',
          data: [
            ...revisions,
            newRevision,
          ],
        },
      };
      const newState = reducer(prevState, actions.resource.received(`integrations/${integrationId}/revisions`, newRevision));

      expect(newState).toEqual(expectedState);
    });
    test('should update the existing revision if the resource\'s id matches with any of the existing revisions ', () => {
      const prevState = {
        [integrationId]: {
          status: 'received',
          data: revisions,
        },
      };
      const newRevision = {
        _id: 'rev-1',
        name: 'newrev1',
      };
      const expectedState = {
        [integrationId]: {
          status: 'received',
          data: [
            {
              _id: 'rev-1',
              name: 'newrev1',
            },
            {
              _id: 'rev-2',
              name: 'rev2',
            },
          ],
        },
      };
      const newState = reducer(prevState, actions.resource.received(`integrations/${integrationId}/revisions`, newRevision));

      expect(newState).toEqual(expectedState);
    });
  });
});
describe('revisions selectors', () => {
  const revisionsList = [
    {
      _id: 'rev-1',
      name: 'rev1',
      type: 'pull',
      _createdByUserId: 'user1',
      status: 'completed',
      installSteps: [
        {
          type: 'connection',
          _connectionId: 'con-1234',

        },
        {
          type: 'merge',
        },
      ],
    },
    {
      _id: 'rev-2',
      name: 'rev2',
      _createdByUserId: 'user2',
      type: 'revert',
      status: 'inprogress',
      installSteps: [
        {
          type: 'url',
          completed: true,
        },
        {
          type: 'revert',
        },
      ],
    },
    {
      _id: 'rev-3',
      name: 'rev3',
      _createdByUserId: 'user2',
    },
  ];
  const state = {
    [integrationId]: {
      status: 'received',
      data: revisionsList,
    },
  };

  describe('revisions selector', () => {
    test('should return undefined incase of invalid params ', () => {
      expect(selectors.revisions()).toBeUndefined();
      expect(selectors.revisions({})).toBeUndefined();
      expect(selectors.revisions({}, 'i-23')).toBeUndefined();
    });
    test('should return the revisions list from the state for the passed integrationId', () => {
      expect(selectors.revisions(state, integrationId)).toBe(revisionsList);
    });
  });
  describe('revision selector', () => {
    test('should return undefined incase of invalid params ', () => {
      expect(selectors.revision()).toBeUndefined();
      expect(selectors.revision({})).toBeUndefined();
      expect(selectors.revision({}, 'i-23', 'r-123')).toBeUndefined();
    });
    test('should return the undefined if the passed revisionId does not exist in the state ', () => {
      expect(selectors.revision(state, integrationId, 'rev-7')).toBeUndefined();
    });
    test('should return the revision for the passed revisionId', () => {
      expect(selectors.revision(state, integrationId, 'rev-1')).toEqual(revisionsList[0]);
    });
  });
  describe('uniqueUserIdsFromRevisions selector', () => {
    test('should return empty array incase of invalid params or no userIds', () => {
      expect(selectors.uniqueUserIdsFromRevisions()).toEqual([]);
      expect(selectors.uniqueUserIdsFromRevisions({})).toEqual([]);
      expect(selectors.uniqueUserIdsFromRevisions({}, 'i-23')).toEqual([]);
    });
    test('should return the unique userIds list from the list of  revisions on that integration', () => {
      expect(selectors.uniqueUserIdsFromRevisions(state, integrationId)).toEqual(['user1', 'user2']);
    });
  });
  describe('revisionsFetchStatus selector', () => {
    test('should return undefined incase of invalid params ', () => {
      expect(selectors.revisionsFetchStatus()).toBeUndefined();
      expect(selectors.revisionsFetchStatus({})).toBeUndefined();
      expect(selectors.revisionsFetchStatus({}, 'i-23')).toBeUndefined();
    });
    test('should return the revisions status from the state for the passed integrationId', () => {
      const state1 = {
        [integrationId]: { status: 'requested'},
      };
      const state2 = {
        [integrationId]: {},
      };

      expect(selectors.revisionsFetchStatus(state, integrationId)).toEqual('received');
      expect(selectors.revisionsFetchStatus(state1, integrationId)).toEqual('requested');
      expect(selectors.revisionsFetchStatus(state2, integrationId)).toBeUndefined();
    });
  });
  describe('revisionInstallSteps selector', () => {
    test('should return empty array incase of invalid params or no install steps', () => {
      expect(selectors.revisionInstallSteps()).toEqual([]);
      expect(selectors.revisionInstallSteps({})).toEqual([]);
      expect(selectors.revisionInstallSteps({}, 'i-23', 'r-123')).toEqual([]);
    });
    test('should return the install steps as it is if there is no in completed step', () => {
      const installSteps = [
        {
          type: 'connection',
          _connectionId: 'con-1234',
          completed: true,
        },
        {
          type: 'merge',
          completed: true,
        },
      ];
      const s = {
        [integrationId]: {
          status: 'received',
          data: [{
            _id: 'rev-1',
            name: 'rev1',
            _createdByUserId: 'user1',
            installSteps }],
        },
      };

      expect(selectors.revisionInstallSteps(s, integrationId, 'rev-1')).toEqual(installSteps);
    });
    test('should return install steps with first in completed step having isCurrentStep as true', () => {
      const installSteps = [
        {
          type: 'connection',
          _connectionId: 'con-1234',
          isCurrentStep: true,
        },
        {
          type: 'merge',
        },
      ];

      expect(selectors.revisionInstallSteps(state, integrationId, 'rev-1')).toEqual(installSteps);
    });
  });
  describe('revisionType selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.revisionType()).toBeUndefined();
      expect(selectors.revisionType({})).toBeUndefined();
      expect(selectors.revisionType({}, 'i-23')).toBeUndefined();
    });
    test('should return revision\'s type for the passed revisionId ', () => {
      expect(selectors.revisionType(state, integrationId, 'rev-1')).toBe('pull');
      expect(selectors.revisionType(state, integrationId, 'rev-2')).toBe('revert');
    });
  });
  describe('isLoadingRevisions selector', () => {
    test('should return false if the revisions are already loaded ', () => {
      expect(selectors.isLoadingRevisions(state, integrationId)).toBeFalsy();
    });
    test('should return true if the revisions are still loading', () => {
      const s1 = {
        [integrationId]: { status: 'requested'},
      };
      const s2 = {
        [integrationId]: {},
      };

      expect(selectors.isLoadingRevisions(s1, integrationId)).toBeTruthy();
      expect(selectors.isLoadingRevisions(s2, integrationId)).toBeTruthy();
    });
  });
  describe('integrationHasNoRevisions selector', () => {
    test('should return false incase of invalid params', () => {
      expect(selectors.integrationHasNoRevisions()).toBeFalsy();
      expect(selectors.integrationHasNoRevisions({})).toBeFalsy();
      expect(selectors.integrationHasNoRevisions({}, 'i-23')).toBeFalsy();
    });
    test('should return false if the integration has loaded revisions ', () => {
      expect(selectors.integrationHasNoRevisions(state, integrationId)).toBeFalsy();
    });
    test('should return true if the request is completed but received no revisions', () => {
      const s1 = {
        [integrationId]: { status: 'received', data: []},
      };

      expect(selectors.integrationHasNoRevisions(s1, integrationId)).toBeTruthy();
    });
  });
  describe('getInProgressRevision selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.getInProgressRevision()).toBeUndefined();
      expect(selectors.getInProgressRevision({})).toBeUndefined();
      expect(selectors.getInProgressRevision({}, 'i-23')).toBeUndefined();
    });
    test('should return in progress revision for the passed integrationId', () => {
      expect(selectors.getInProgressRevision(state, integrationId)).toBe(revisionsList[1]);
    });
  });
  describe('isAnyRevisionInProgress selector', () => {
    test('should return false incase of invalid params', () => {
      expect(selectors.isAnyRevisionInProgress()).toBeFalsy();
      expect(selectors.isAnyRevisionInProgress({})).toBeFalsy();
      expect(selectors.isAnyRevisionInProgress({}, 'i-23')).toBeFalsy();
    });
    test('should return true when there is any revision in progress', () => {
      expect(selectors.isAnyRevisionInProgress(state, integrationId)).toBeTruthy();
    });
  });
});

