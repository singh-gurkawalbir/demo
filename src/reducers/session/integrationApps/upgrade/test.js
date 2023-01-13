
import reducer, { selectors } from '.';
import actions from '../../../../actions';

describe('integrationApps utility reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toBe('string');
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toBeNull();
    expect(reducer(123, { type: 'RANDOM_ACTION' })).toBe(123);
    expect(reducer(undefined, { type: null })).toEqual({});
    expect(reducer(undefined, { type: undefined })).toEqual({});
  });

  describe('integrationApps utitlity reducer', () => {
    let state = {};

    describe('SET STATUS action', () => {
      test('should create an object with key as integration id', () => {
        const newState = reducer(
          undefined,
          actions.integrationApp.upgrade.setStatus('123', {
            status: 'done',
            inQueue: false,
            showWizard: true,
          })
        );

        expect(newState).toEqual({123: {
          status: 'done',
          inQueue: false,
          showWizard: true,
        }});
      });
      test('should not affect any other integration id state', () => {
        state = {456: {status: 'inProgress'}};
        const newState = reducer(
          state,
          actions.integrationApp.upgrade.setStatus('123', {
            status: 'done',
          })
        );

        expect(newState).toEqual({
          456: {status: 'inProgress'},
          123: { status: 'done'},
        });
      });
    });

    describe('ADD CHILD UPGRADE LIST action', () => {
      test('should add childList and set inQueue to be true', () => {
        state = {};
        const newState = reducer(
          state,
          actions.integrationApp.upgrade.addChildForUpgrade([
            '123',
            '213',
          ])
        );

        expect(newState).toEqual({
          childList: ['123', '213'],
          123: { inQueue: true },
          213: { inQueue: true },
        });
      });
    });
    describe('DELETE STATUS action', () => {
      test('should delete status of given id', () => {
        state = {
          123: { inQueue: true },
          213: { inQueue: true },
        };
        const newState = reducer(
          state,
          actions.integrationApp.upgrade.deleteStatus('123')
        );

        expect(newState).toEqual({
          213: { inQueue: true },
        });
      });
    });
  });
});

describe('integrationApps utility selectors', () => {
  describe('getStatus', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.getStatus(undefined, '213')).toEqual({});
      expect(selectors.getStatus({}, '213')).toEqual({});
      expect(selectors.getStatus(123, '213')).toEqual({});
      expect(selectors.getStatus(undefined, null)).toEqual({});
      expect(selectors.getStatus({})).toEqual({});
      expect(selectors.getStatus()).toEqual({});
    });

    test('should return correct state data when a match is found.', () => {
      const newState = {
        123: { status: 'done', inQueue: true },
      };

      expect(selectors.getStatus(newState, '123')).toEqual({ status: 'done', inQueue: true });
    });
  });

  describe('currentChildUpgrade', () => {
    test('should return empty string when no match found.', () => {
      expect(selectors.currentChildUpgrade(undefined)).toBe('');
      expect(selectors.currentChildUpgrade({})).toBe('');
      expect(selectors.currentChildUpgrade()).toBe('');
    });

    test('should return correct id when a match is found.', () => {
      const newState = {
        childList: ['123', '213'],
        123: { status: 'done', inQueue: false },
        213: { status: 'done', inQueue: true },
      };

      expect(selectors.currentChildUpgrade(newState)).toBe('213');
    });
    test('should return none when no id is inQueue true.', () => {
      const newState = {
        childList: ['123', '213'],
        123: { status: 'done', inQueue: false },
        213: { status: 'done', inQueue: false },
      };

      expect(selectors.currentChildUpgrade(newState)).toBe('none');
    });
  });
  describe('changeEditionSteps', () => {
    test('should return empty string when no match found.', () => {
      expect(selectors.changeEditionSteps(undefined, '213')).toEqual([]);
      expect(selectors.changeEditionSteps({}, '213')).toEqual([]);
      expect(selectors.changeEditionSteps(undefined, null)).toEqual([]);
      expect(selectors.changeEditionSteps({})).toEqual([]);
      expect(selectors.changeEditionSteps()).toEqual([]);
    });

    test('should return correct id when a match is found.', () => {
      const newState = {
        123: {
          steps: [
            {
              id: '34f432',
              completed: true,
            },
            {
              id: '3r2g21',
            },
          ],
        },
      };

      const expectedState = [
        {
          id: '34f432',
          completed: true,
        },
        {
          id: '3r2g21',
          isCurrentStep: true,
        },
      ];

      expect(selectors.changeEditionSteps(newState, '123')).toEqual(expectedState);
    });
  });
});

