/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../../actions';

describe('errorManagement latestJobs integrations reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer(undefined, { type: undefined })).toEqual({});
    expect(reducer(undefined, { type: null })).toEqual({});
  });
  describe('errorManagement integrations latestJobs reducer', () => {
    describe('errorManagement integration latestJobs request action', () => {
      test('should find the integration with id', () => {
        const state = reducer(
          {},
          actions.errorManager.integrationLatestJobs.request({
            integrationId: 'integrationId',
          }
          )
        );

        expect(state).toEqual({
          integrationId: { status: 'requested'},
        });
      });

      test('should find the integration with id and set requested flag to true and should not affect the existing data', () => {
        const state = reducer(
          {
            integrationId: { status: 'received', data: [{id: 'id1'}]},
          },
          actions.errorManager.integrationLatestJobs.request({
            integrationId: 'integrationId1',
          }
          )
        );

        expect(state).toEqual({
          integrationId: { status: 'received', data: [{id: 'id1'}]},
          integrationId1: { status: 'requested'},
        });
      });
    });

    describe('errorManagement integration latestJobs failed action', () => {
      test('should find the integration with id', () => {
        const state = reducer(
          {},
          actions.errorManager.integrationLatestJobs.error({
            integrationId: 'integrationId',
          }
          )
        );

        expect(state).toEqual({
          integrationId: { status: 'failed'},
        });
      });

      test('should find the integration with id and set failed flag to true and should not affect the existing data', () => {
        const state = reducer(
          {
            integrationId: { status: 'received', data: [{id: 'id1'}]},
          },
          actions.errorManager.integrationLatestJobs.error({
            integrationId: 'integrationId1',
          }
          )
        );

        expect(state).toEqual({
          integrationId: { status: 'received', data: [{id: 'id1'}]},
          integrationId1: { status: 'failed'},
        });
      });
    });

    describe('errorManagement integration latestJobs received action', () => {
      test('should find the integration with id', () => {
        const state = reducer(
          {},
          actions.errorManager.integrationLatestJobs.received({
            integrationId: 'integrationId',
            latestJobs: [{a: 'a', b: 'b'}],
          }
          )
        );

        expect(state).toEqual({
          integrationId: { status: 'received', data: [{a: 'a', b: 'b'}]},
        });
      });

      test('should find the integration with id and set failed flag to true and should not affect the existing data', () => {
        const state = reducer(
          {
            integrationId: { status: 'received', data: [{id: 'id1'}]},
          },
          actions.errorManager.integrationLatestJobs.received({
            integrationId: 'integrationId1',
            latestJobs: [{a: 'a'}],
          }
          )
        );

        expect(state).toEqual({
          integrationId: { status: 'received', data: [{id: 'id1'}]},
          integrationId1: { status: 'received', data: [{a: 'a'}]},
        });
      });
    });
  });
});

describe('errorManagement latestJobs integration selectors test cases', () => {
  describe('latestJobMap', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.latestJobMap(undefined, 'dummy')).toEqual({});
      expect(selectors.latestJobMap({}, 'dummy')).toEqual({});
      expect(selectors.latestJobMap(null, 'dummy')).toEqual({});
      expect(selectors.latestJobMap({}, {})).toEqual({});
      expect(selectors.latestJobMap(undefined, null)).toEqual({});
      expect(selectors.latestJobMap({})).toEqual({});
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = {
        status: 'received',
        data: [
          {
            a: 'a',
          },
        ],
      };
      const newState = reducer(
        {},
        actions.errorManager.integrationLatestJobs.received({
          integrationId: 'integrationId',
          latestJobs: [{a: 'a'}],
        }
        )
      );

      expect(selectors.latestJobMap(newState, 'integrationId')).toEqual(expectedData);
    });
  });
});
