
import reducer, { selectors } from '.';
import actions from '../../../../actions';
import { REVISION_CREATION_STATUS, REVISION_TYPES } from '../../../../constants';

const integrationId = 'i-lcm-123';
const revisionId = 'lcm-revision-123';
const revertRevisionId = 'rev-lcm-revision-123';

describe('lcm revision reducer test cases', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const prevState = {};
    const newState = reducer(prevState, unknownAction);

    expect(newState).toEqual(prevState);
  });
  describe('REVISION.OPEN_PULL action', () => {
    const revisionInfo = {
      description: 'first revision',
      integrationId: 'clone-i-123',
    };

    test('should create a sub state for the passed integration, if there is no existing sub state', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.integrationLCM.revision.openPull({
        integrationId,
        newRevisionId: revisionId,
        revisionInfo,
      }));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            type: REVISION_TYPES.PULL,
            revisionInfo,

          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should add type as Pull and revisionInfo against an integration with passed revisionId', () => {
      const prevState = { [integrationId]: {
        'rev-1234': {},
      }};
      const newState = reducer(prevState, actions.integrationLCM.revision.openPull({
        integrationId,
        newRevisionId: revisionId,
        revisionInfo,
      }));
      const expectedState = {
        [integrationId]: {
          'rev-1234': {},
          [revisionId]: {
            type: REVISION_TYPES.PULL,
            revisionInfo,

          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('REVISION.OPEN_REVERT action', () => {
    const revisionInfo = {
      description: 'first revision',
      integrationId: 'clone-i-123',
      revertTo: 'toBefore',
      revisionId: revertRevisionId,
    };

    test('should create a sub state for the passed integration, if there is no existing sub state', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.integrationLCM.revision.openRevert({
        integrationId,
        newRevisionId: revisionId,
        revisionInfo,
      }));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            type: REVISION_TYPES.REVERT,
            revisionInfo,

          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should add type as Revert and revisionInfo against an integration with passed revisionId', () => {
      const prevState = { [integrationId]: {
        'rev-1234': {
          type: REVISION_TYPES.PULL,
          revisionInfo: {
            description: 'first revision',
            integrationId: 'clone-i-123',
          },

        },
      }};
      const newState = reducer(prevState, actions.integrationLCM.revision.openRevert({
        integrationId,
        newRevisionId: revisionId,
        revisionInfo,
      }));
      const expectedState = {
        [integrationId]: {
          'rev-1234': {
            type: REVISION_TYPES.PULL,
            revisionInfo: {
              description: 'first revision',
              integrationId: 'clone-i-123',
            },
          },
          [revisionId]: {
            type: REVISION_TYPES.REVERT,
            revisionInfo,

          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('REVISION.CREATE_SNAPSHOT action', () => {
    const revisionInfo = { description: 'my first snapshot' };

    test('should create a sub state for the passed integration, if there is no existing sub state', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.integrationLCM.revision.createSnapshot({
        integrationId,
        newRevisionId: revisionId,
        revisionInfo,
      }));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            type: REVISION_TYPES.SNAPSHOT,
            revisionInfo,
            status: REVISION_CREATION_STATUS.CREATION_IN_PROGRESS,

          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should add type as Snapshot, status as in progress and revisionInfo against an integration with passed revisionId', () => {
      const prevState = { [integrationId]: {
        'rev-1234': {
          type: REVISION_TYPES.PULL,
          revisionInfo: {
            description: 'first revision',
            integrationId: 'clone-i-123',
          },

        },
      }};
      const newState = reducer(prevState, actions.integrationLCM.revision.createSnapshot({
        integrationId,
        newRevisionId: revisionId,
        revisionInfo,
      }));
      const expectedState = {
        [integrationId]: {
          'rev-1234': {
            type: REVISION_TYPES.PULL,
            revisionInfo: {
              description: 'first revision',
              integrationId: 'clone-i-123',
            },

          },
          [revisionId]: {
            type: REVISION_TYPES.SNAPSHOT,
            revisionInfo,
            status: REVISION_CREATION_STATUS.CREATION_IN_PROGRESS,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('REVISION.CREATE action', () => {
    test('should create state for the passed revisionId if there is no existing state', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.integrationLCM.revision.create(integrationId, revisionId));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_IN_PROGRESS,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });

    test('should add status as in progress for the passed revisionId', () => {
      const prevState = {
        [integrationId]: {
          'rev-1234': {
            status: REVISION_CREATION_STATUS.CREATED,
          },
        },
      };
      const newState = reducer(prevState, actions.integrationLCM.revision.create(integrationId, revisionId));
      const expectedState = {
        [integrationId]: {
          'rev-1234': {
            status: REVISION_CREATION_STATUS.CREATED,
          },
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_IN_PROGRESS,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should remove if there is existing error on the passed revisionId', () => {
      const prevState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'Invalid integrationId',
          },
        },
      };
      const newState = reducer(prevState, actions.integrationLCM.revision.create(integrationId, revisionId));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_IN_PROGRESS,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('REVISION.CREATION_ERROR action', () => {
    const creationError = 'invalid integrationId';

    test('should create state for the passed revisionId if there is no existing state', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.integrationLCM.revision.creationError(integrationId, revisionId, creationError));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });

    test('should add status as error and update creationError prop for the passed revisionId', () => {
      const prevState = {
        [integrationId]: {
          'rev-1234': {
            status: REVISION_CREATION_STATUS.CREATED,
          },
        },
      };
      const newState = reducer(prevState, actions.integrationLCM.revision.creationError(integrationId, revisionId, creationError));
      const expectedState = {
        [integrationId]: {
          'rev-1234': {
            status: REVISION_CREATION_STATUS.CREATED,
          },
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('REVISION.CREATED action', () => {
    test('should create state for the passed revisionId if there is no existing state', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.integrationLCM.revision.created(integrationId, revisionId));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATED,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });

    test('should add status as created for the passed revisionId', () => {
      const prevState = {
        [integrationId]: {
          'rev-1234': {
            status: REVISION_CREATION_STATUS.CREATED,
          },
        },
      };
      const newState = reducer(prevState, actions.integrationLCM.revision.created(integrationId, revisionId));
      const expectedState = {
        [integrationId]: {
          'rev-1234': {
            status: REVISION_CREATION_STATUS.CREATED,
          },
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATED,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
    test('should remove if there is existing error on the passed revisionId', () => {
      const prevState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
          },
        },
      };
      const newState = reducer(prevState, actions.integrationLCM.revision.created(integrationId, revisionId));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATED,
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  describe('REVISION.FETCH_ERRORS action', () => {
    test('should create state for the passed revisionId if there is no existing state', () => {
      const prevState = {};
      const newState = reducer(prevState, actions.integrationLCM.revision.fetchErrors(integrationId, revisionId));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            errors: {
              status: 'requested',
            },
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });

    test('should add errors object with status as requested against the passed revisionId', () => {
      const prevState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
          },
        },
      };
      const newState = reducer(prevState, actions.integrationLCM.revision.fetchErrors(integrationId, revisionId));
      const expectedState = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
            errors: {
              status: 'requested',
            },
          },
        },
      };

      expect(newState).toEqual(expectedState);
    });
  });
  // TODO @Raghu: Add test cases for this action
  // eslint-disable-next-line jest/no-commented-out-tests
  // describe('REVISION.RECEIVED_ERRORS action', () => {

  // });
});

describe('lcm revision selector test cases', () => {
  describe('tempRevisionInfo selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.tempRevisionInfo()).toBeUndefined();
      expect(selectors.tempRevisionInfo({})).toBeUndefined();
      expect(selectors.tempRevisionInfo({}, 'i-23')).toBeUndefined();
    });
    test('should return undefined if there is no revision Info for the passed revisionId', () => {
      expect(selectors.tempRevisionInfo({}, 'i-23', 'r-123')).toBeUndefined();
    });
    test('should return the expected revision info for the passed revisionId', () => {
      const state = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
            errors: {
              status: 'requested',
            },
          },
        },
      };
      const expectedState = {
        status: REVISION_CREATION_STATUS.CREATION_ERROR,
        creationError: 'invalid integrationId',
        errors: {
          status: 'requested',
        },
      };

      expect(selectors.tempRevisionInfo(state, integrationId, revisionId)).toEqual(expectedState);
    });
  });
  describe('revisionErrorsInfo selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.revisionErrorsInfo()).toBeUndefined();
      expect(selectors.revisionErrorsInfo({})).toBeUndefined();
      expect(selectors.revisionErrorsInfo({}, 'i-23')).toBeUndefined();
    });
    test('should return the expected errors info for the passed revisionId', () => {
      const state = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
            errors: {
              status: 'requested',
            },
          },
        },
      };
      const expectedState = {
        status: 'requested',
      };

      expect(selectors.revisionErrorsInfo(state, integrationId, revisionId)).toEqual(expectedState);
    });
  });
  describe('tempRevisionType selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.tempRevisionType()).toBeUndefined();
      expect(selectors.tempRevisionType({})).toBeUndefined();
      expect(selectors.tempRevisionType({}, 'i-23')).toBeUndefined();
      expect(selectors.tempRevisionType({}, 'i-23', 're-123')).toBeUndefined();
    });
    test('should return the expected revisionType for the passed revisionId', () => {
      const state = {
        [integrationId]: {
          [revisionId]: {
            type: REVISION_TYPES.PULL,
            revisionInfo: {
              description: 'first revision',
              integrationId: 'clone-i-123',
            },
          },
        }};

      expect(selectors.tempRevisionType(state, integrationId, revisionId)).toEqual(REVISION_TYPES.PULL);
    });
  });
  describe('isRevisionCreationInProgress selector', () => {
    test('should return false incase of invalid params', () => {
      expect(selectors.isRevisionCreationInProgress()).toBeFalsy();
      expect(selectors.isRevisionCreationInProgress({})).toBeFalsy();
      expect(selectors.isRevisionCreationInProgress({}, 'i-23')).toBeFalsy();
      expect(selectors.isRevisionCreationInProgress({}, 'i-23', 're-123')).toBeFalsy();
    });
    test('should return true if the status is in progress', () => {
      const state = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_IN_PROGRESS,
          },
        },
      };

      expect(selectors.isRevisionCreationInProgress(state, integrationId, revisionId)).toBeTruthy();
    });
  });
  describe('isRevisionErrorsFetchInProgress selector', () => {
    test('should return false incase of invalid params', () => {
      expect(selectors.isRevisionErrorsFetchInProgress()).toBeFalsy();
      expect(selectors.isRevisionErrorsFetchInProgress({})).toBeFalsy();
      expect(selectors.isRevisionErrorsFetchInProgress({}, 'i-23')).toBeFalsy();
      expect(selectors.isRevisionErrorsFetchInProgress({}, 'i-23', 're-123')).toBeFalsy();
    });
    test('should return true if the error fetch status is in progress', () => {
      const state = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
            errors: {
              status: 'requested',
            },
          },
        },
      };

      expect(selectors.isRevisionErrorsFetchInProgress(state, integrationId, revisionId)).toBeTruthy();
    });
  });
  describe('isRevisionErrorsRequested selector', () => {
    test('should return false incase of invalid params or no errorObj', () => {
      expect(selectors.isRevisionErrorsRequested()).toBeFalsy();
      expect(selectors.isRevisionErrorsRequested({})).toBeFalsy();
      expect(selectors.isRevisionErrorsRequested({}, 'i-23')).toBeFalsy();
      expect(selectors.isRevisionErrorsRequested({}, 'i-23', 're-123')).toBeFalsy();
    });
    test('should return true if the there is status for the errorObject against the revisionId', () => {
      const state = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
            errors: {
              status: 'requested',
            },
          },
        },
      };

      expect(selectors.isRevisionErrorsRequested(state, integrationId, revisionId)).toBeTruthy();
    });
  });
  describe('revisionErrors selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.revisionErrors()).toBeUndefined();
      expect(selectors.revisionErrors({})).toBeUndefined();
      expect(selectors.revisionErrors({}, 'i-23')).toBeUndefined();
      expect(selectors.revisionErrors({}, 'i-23', 're-123')).toBeUndefined();
    });
    test('should return error list if there are errors for the passed revisionId', () => {
      const errors = [{ _id: '123', code: 'RESOURCE', message: 'invalid resource'}];
      const state = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
            errors: {
              status: 'received',
              data: errors,
            },
          },
        },
      };

      expect(selectors.revisionErrors(state, integrationId, revisionId)).toEqual(errors);
    });
  });
  describe('revisionError selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.revisionError()).toBeUndefined();
      expect(selectors.revisionError({})).toBeUndefined();
      expect(selectors.revisionError({}, 'i-23')).toBeUndefined();
      expect(selectors.revisionError({}, 'i-23', 're-123')).toBeUndefined();
    });
    test('should return error info if there is a valid error for the passed errorId against revisionId', () => {
      const errors = [{ _id: '123', code: 'RESOURCE', message: 'invalid resource'}];
      const state = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
            errors: {
              status: 'received',
              data: errors,
            },
          },
        },
      };

      expect(selectors.revisionError(state, integrationId, revisionId, '123')).toEqual(errors[0]);
    });
  });
  describe('revisionCreationError selector', () => {
    test('should return undefined incase of invalid params', () => {
      expect(selectors.revisionCreationError()).toBeUndefined();
      expect(selectors.revisionCreationError({})).toBeUndefined();
      expect(selectors.revisionCreationError({}, 'i-23')).toBeUndefined();
    });
    test('should return creationError prop if there is a creation error for the passed revisionId', () => {
      const state = {
        [integrationId]: {
          [revisionId]: {
            status: REVISION_CREATION_STATUS.CREATION_ERROR,
            creationError: 'invalid integrationId',
            errors: {
              status: 'requested',
            },
          },
        },
      };

      expect(selectors.revisionCreationError(state, integrationId, revisionId)).toBe('invalid integrationId');
    });
  });
});

