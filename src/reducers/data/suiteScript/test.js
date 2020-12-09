/* global describe, test, expect */
import each from 'jest-each';
import reducer, { selectors } from '.';
import actions from '../../../actions';
import suitescriptActions from '../../../actions/suiteScript';
import { SUITESCRIPT_CONNECTORS } from '../../../utils/constants';

const defaultState = {
  paging: {
    jobs: {
      currentPage: 0,
      rowsPerPage: 10,
    },
  },
};

const refreshlegacycontrolpanel = [
  {
    _id: 'something',
    clearCache: false,
    object: null,
    refreshMappings: false,
    ssLinkedConnectionId: 'c1',
  },
];

/**
 * TODO: Ignoring SS tests for sometime and Shiva needs to fix these.
 */

describe('suiteScript reducer', () => {
  test('any other action should return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual(defaultState);
  });
  test('any other action, when state exists, should return original state', () => {
    const someState = { something: 'something' };
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });

  describe('tests for suitescript resource reducer', () => {
    describe('should update the state properly when suitescript tiles collection received', () => {
      const connectionId = 'c1';
      const tiles = [
        { _integrationId: 'i1', name: 'i one' },
        { _integrationId: 'i2', name: 'i two' },
      ];
      const tilesReceivedAction = actions.resource.receivedCollection(
        `suitescript/connections/${connectionId}/tiles`,
        tiles
      );

      test('should update the state properly when the current state is undefined', () => {
        const newState = reducer(undefined, tilesReceivedAction);
        const expected = { refreshlegacycontrolpanel, tiles: [], integrations: [], settings: {} };

        tiles.forEach(t => {
          const tile = {status: 'success', ...t, displayName: t.name, ssLinkedConnectionId: connectionId};

          expected.tiles.push(tile);
          const { _integrationId, ssLinkedConnectionId, status, ...otherIntegrationProps } = tile;

          expected.integrations.push({
            isNotEditable: false,
            ...otherIntegrationProps,
            _id: _integrationId,
          });
        });

        expect(newState).toEqual({ ...defaultState, [connectionId]: expected });
      });
      test('should update the state properly when the current state is not empty', () => {
        const state = {
          ...defaultState,
          c2: { tiles: ['something'] },
          [connectionId]: { flows: ['something else'] },
        };
        const newState = reducer(state, tilesReceivedAction);
        const expected = { ...state };

        expected[connectionId].refreshlegacycontrolpanel = refreshlegacycontrolpanel;
        expected[connectionId].tiles = [];
        expected[connectionId].integrations = [];
        expected[connectionId].settings = {};

        tiles.forEach(t => {
          const tile = {status: 'success', ...t, displayName: t.name, ssLinkedConnectionId: connectionId};

          expected[connectionId].tiles.push(tile);
          const { _integrationId, ssLinkedConnectionId, status, ...otherIntegrationProps } = tile;

          expected[connectionId].integrations.push({
            isNotEditable: false,
            ...otherIntegrationProps,
            _id: _integrationId,
          });
        });
        expect(newState).toEqual(expected);
      });
    });
    test('should update state properly when connections collection received', () => {
      const connCollection = [
        {
          _id: '1',
          id: 'SALESFORCE_CONNECTION',
          type: 'salesforce',
          name: 'SALESFORCE_CONNECTION',
        },
        {
          _id: '2',
          id: 'NETSUITE_CONNECTION',
          type: 'netsuite',
          name: 'NETSUITE_CONNECTION',
          offline: false,
        },
      ];

      const state = reducer(undefined, actions.resource.receivedCollection(
        'suitescript/connections/connId/connections',
        connCollection
      ));

      expect(state).toEqual(
        {
          paging: {
            jobs: {
              rowsPerPage: 10,
              currentPage: 0,
            },
          },
          connId: {
            tiles: [

            ],
            connections: [
              {
                _id: '1',
                id: 'SALESFORCE_CONNECTION',
                type: 'salesforce',
                name: 'SALESFORCE_CONNECTION',
              },
              {
                _id: '2',
                id: 'NETSUITE_CONNECTION',
                type: 'netsuite',
                name: 'NETSUITE_CONNECTION',
                offline: false,
              },
            ],
          },
        }
      );
    });

    test('should update state properly when flows collection received', () => {
      const jobCollection = [
        {
          _id: 'EXP1',
          type: 'EXPORT',
        },
        {
          _id: 'IMP2',
          type: 'IMPORT',
        },
      ];

      const state = reducer(undefined, actions.resource.receivedCollection(
        'suitescript/connections/connId/integrations/intid/flows',
        jobCollection
      ));

      expect(state).toEqual(
        {
          paging: {
            jobs: {
              rowsPerPage: 10,
              currentPage: 0,
            },
          },
          connId: {
            tiles: [

            ],
            flows: [
              {
                _id: 'eEXP1',
                type: 'EXPORT',
                ssLinkedConnectionId: 'connId',
              },
              {
                _id: 'iIMP2',
                type: 'IMPORT',
                ssLinkedConnectionId: 'connId',
              },
            ],
          },
        }
      );
    });

    test('should remove deleted flows from state when flows collection received', () => {
      const jobCollection = [
        {
          _id: 'EXP1',
          type: 'EXPORT',
        },
      ];

      const state = reducer({
        paging: {
          jobs: {
            rowsPerPage: 10,
            currentPage: 0,
          },
        },
        connId: {
          tiles: [

          ],
          flows: [
            {
              _id: 'eEXP3',
              type: 'EXPORT',
              ssLinkedConnectionId: 'connId',
              _integrationId: 'intid',
            },
          ],
        },
      }, actions.resource.receivedCollection(
        'suitescript/connections/connId/integrations/intid/flows',
        jobCollection
      ));

      expect(state).toEqual(
        {
          paging: {
            jobs: {
              rowsPerPage: 10,
              currentPage: 0,
            },
          },
          connId: {
            tiles: [

            ],
            flows: [
              {
                _id: 'eEXP1',
                type: 'EXPORT',
                ssLinkedConnectionId: 'connId',
              },
            ],
          },
        }
      );
    });
    test('should update state properly when flows collection received without integration id', () => {
      const jobCollection = [
        {
          _id: 'EXP1',
          type: 'EXPORT',
          version: 'V2',
        },
      ];

      const state = reducer(undefined, actions.resource.receivedCollection(
        'suitescript/connections/connId/flows',
        jobCollection
      ));

      expect(state).toEqual(
        {
          paging: {
            jobs: {
              rowsPerPage: 10,
              currentPage: 0,
            },
          },
          connId: {
            tiles: [

            ],
            nextFlows: [
              {
                _id: 'EXP1',
                type: 'EXPORT',
                version: 'V2',
              },
            ],
          },
        }
      );
    });

    test('should update resource in the state on received action for resourceType exports', () => {
      const exp = {
        _id: '1',
        type: 'EXPORT',
        _integrationId: 'int1',
        name: 'udpating name',
      };

      const state = reducer({
        connId: {
          flows: [
            {
              name: 'name before change',
              _id: 'e1',
              type: 'EXPORT',
              _integrationId: 'int1',
            },
          ],
        },
      }, suitescriptActions.resource.received('connId', 'int1', 'exports', exp));

      expect(state).toEqual({
        connId: {
          flows: [
            {
              _id: 'e1',
              type: 'EXPORT',
              _integrationId: 'int1',
              name: 'udpating name',
              ssLinkedConnectionId: 'connId',
            },
          ],
        },
      });
    });

    test('should update resource in the state on received action for resourceType integrations', () => {
      const integration = {
        _id: '1',
        name: 'udpating integration name',
      };

      const state = reducer({
        connId: {
          integrations: [
            {
              name: 'name before change',
              _id: '1',
              isNotEditable: false,
            },
            {
              name: 'sf ns integration',
              _id: '2',
              isNotEditable: false,
            },
          ],
        },
      }, suitescriptActions.resource.received('connId', 'int1', 'integrations', integration));

      expect(state).toEqual({
        connId: {
          integrations: [
            {
              name: 'udpating integration name',
              displayName: 'udpating integration name',
              _id: '1',
              isNotEditable: false,
            },
            {
              name: 'sf ns integration',
              _id: '2',
              isNotEditable: false,
            },
          ],
        },
      });
    });

    test('should update settings in the state on received action for resourceType settings', () => {
      const settings = {
        general: {
          description: 'general settings',
          id: 'gensettings',
        },
      };

      const state = reducer({
        connId: {
          settings: {

          },
        },
      }, suitescriptActions.resource.received('connId', 'int1', 'settings', settings));

      expect(state).toEqual({
        connId: {
          settings: {
            int1: {
              general: {
                description: 'general settings',
                id: 'gensettings',
              },
            },
          },
        },
      });
    });

    test('should update connection in the state on received action for resourceType connections', () => {
      const connection = {
        _id: '2',
        id: 'NETSUITE_CONNECTION',
        type: 'netsuite',
        name: 'updating NETSUITE_CONNECTION',
        offline: true,
      };

      const state = reducer({
        connId: {
          connections: [
            {
              _id: '1',
              id: 'SALESFORCE_CONNECTION',
              type: 'salesforce',
              name: 'SALESFORCE_CONNECTION',
            },
            {
              _id: '2',
              id: 'NETSUITE_CONNECTION',
              type: 'netsuite',
              name: 'NETSUITE_CONNECTION',
              offline: false,
            },
          ],
        },
      }, suitescriptActions.resource.received('connId', 'int1', 'connections', connection));

      expect(state).toEqual({
        connId: {
          connections: [
            {
              _id: '1',
              id: 'SALESFORCE_CONNECTION',
              type: 'salesforce',
              name: 'SALESFORCE_CONNECTION',
            },
            {
              _id: '2',
              id: 'NETSUITE_CONNECTION',
              type: 'netsuite',
              name: 'updating NETSUITE_CONNECTION',
              offline: true,
            },
          ],
        },
      });
    });

    test('should remove resource from state when deleted action is called', () => {
      const state = reducer({
        connId: {
          connections: [
            {
              _id: '1',
              id: 'SALESFORCE_CONNECTION',
              type: 'salesforce',
              name: 'SALESFORCE_CONNECTION',
            },
            {
              _id: '2',
              id: 'NETSUITE_CONNECTION',
              type: 'netsuite',
              name: 'updating NETSUITE_CONNECTION',
              offline: true,
            },
          ],
        },
      }, suitescriptActions.resource.deleted('connections', '1', 'connId'));

      expect(state).toEqual({
        connId: {
          connections: [
            {
              _id: '2',
              id: 'NETSUITE_CONNECTION',
              type: 'netsuite',
              name: 'updating NETSUITE_CONNECTION',
              offline: true,
            },
          ],
        },
      });
    });
  });
  describe('tests for job actions reducer', () => {
    describe('should update state properly when setting jobs current page ', () => {
      const testCases = [
        [7, 7],
        [defaultState.paging.jobs.currentPage, 0],
        [defaultState.paging.jobs.currentPage, -5],
        [defaultState.paging.jobs.currentPage, 'something'],
      ];

      each(testCases).test('should return %s for %s', (expected, currentPage) => {
        const newState = reducer(
          defaultState,
          suitescriptActions.paging.job.setCurrentPage(currentPage)
        );

        expect(newState).toEqual({
          paging: {
            jobs: {
              ...defaultState.paging.jobs,
              currentPage: expected,
            },
          },
        });
      });
    });

    describe('should update state properly when setting jobs rows per page ', () => {
      const testCases = [
        [7, 7],
        [defaultState.paging.jobs.rowsPerPage, 0],
        [defaultState.paging.jobs.rowsPerPage, -5],
        [defaultState.paging.jobs.rowsPerPage, 'something'],
      ];

      each(testCases).test('should return %s for %s', (expected, rowsPerPage) => {
        const newState = reducer(
          defaultState,
          suitescriptActions.paging.job.setRowsPerPage(rowsPerPage)
        );

        expect(newState).toEqual({
          paging: {
            jobs: {
              ...defaultState.paging.jobs,
              rowsPerPage: expected,
            },
          },
        });
      });
    });

    test('should update state with received jobs collection', () => {
      const jobsCollection = [
        {
          type: 'import',
          _id: '1',
          _integrationId: '1',
          _flowId: '26',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
        },
        {
          type: 'import',
          _id: '2',
          _integrationId: '1',
          _flowId: '31',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
        },
        {
          type: 'export',
          _id: '25901',
          _integrationId: '1',
          _flowId: '41',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
        }];

      const state = reducer(defaultState, suitescriptActions.job.receivedCollection({
        collection: jobsCollection,
      }));

      expect(state).toEqual({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [
          {
            type: 'import',
            _id: '1',
            _integrationId: '1',
            _flowId: '26',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            numError: 0,
            numSuccess: 2,
            duration: '00:59:59',
          },
          {
            type: 'import',
            _id: '2',
            _integrationId: '1',
            _flowId: '31',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            numError: 0,
            numSuccess: 2,
            duration: '00:59:59',
          },
          {
            type: 'export',
            _id: '25901',
            _integrationId: '1',
            _flowId: '41',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            duration: '00:59:59',
          },
        ],
      });
    });
    test('should find and update state with received job', () => {
      const job = {
        type: 'import',
        _id: '1',
        _integrationId: '1',
        _flowId: '26',
        createdAt: '2020-12-04T11:03:00.000Z',
        startedAt: '2020-12-05T10:00:00.000Z',
        endedAt: '2020-12-05T12:59:59.000Z',
        status: 'completed',
        numError: 0,
        numSuccess: 5,
      };

      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [
          {
            type: 'import',
            _id: '1',
            _integrationId: '1',
            _flowId: '26',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            numError: 0,
            numSuccess: 2,
            duration: '00:59:59',
          },
          {
            type: 'export',
            _id: '1',
            _integrationId: '1',
            _flowId: '41',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            duration: '00:59:59',
          },
        ],
      }, suitescriptActions.job.received({
        job,
      }));

      expect(state).toEqual({
        jobs: [
          {
            _flowId: '26',
            _id: '1',
            _integrationId: '1',
            createdAt: '2020-12-04T11:03:00.000Z',
            duration: '02:59:59',
            endedAt: '2020-12-05T12:59:59.000Z',
            numError: 0,
            numSuccess: 5,
            startedAt: '2020-12-05T10:00:00.000Z',
            status: 'completed',
            type: 'import',
          },
          {
            _flowId: '41',
            _id: '1',
            _integrationId: '1',
            createdAt: '2020-12-04T11:03:00.000Z',
            duration: '00:59:59',
            endedAt: '2020-12-04T10:59:59.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            status: 'completed',
            type: 'export',
          },
        ],
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
      });
    });

    test('should add new job to the state with received job if status is queyed', () => {
      const job = {
        type: 'import',
        _id: '2',
        _integrationId: '1',
        _flowId: '26',
        createdAt: '2020-12-04T11:03:00.000Z',
        startedAt: '2020-12-05T10:00:00.000Z',
        endedAt: '2020-12-05T10:10:59.000Z',
        status: 'queued',
        numError: 0,
        numSuccess: 5,
      };

      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [
          {
            type: 'import',
            _id: '1',
            _integrationId: '1',
            _flowId: '26',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            numError: 0,
            numSuccess: 2,
            duration: '00:59:59',
          },
          {
            type: 'export',
            _id: '1',
            _integrationId: '1',
            _flowId: '41',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            duration: '00:59:59',
          },
        ],
      }, suitescriptActions.job.received({
        job,
      }));

      expect(state).toEqual({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [
          {
            type: 'import',
            _id: '2',
            _integrationId: '1',
            _flowId: '26',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-05T10:00:00.000Z',
            endedAt: '2020-12-05T10:10:59.000Z',
            status: 'queued',
            numError: 0,
            numSuccess: 5,
            duration: '00:10:59',
          },
          {
            type: 'import',
            _id: '1',
            _integrationId: '1',
            _flowId: '26',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            numError: 0,
            numSuccess: 2,
            duration: '00:59:59',
          },
          {
            type: 'export',
            _id: '1',
            _integrationId: '1',
            _flowId: '41',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-04T10:00:00.000Z',
            endedAt: '2020-12-04T10:59:59.000Z',
            status: 'completed',
            duration: '00:59:59',
          },
        ],
      });
    });

    test('should clear jobs in state when cleared action is called', () => {
      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [
          {
            type: 'import',
            _id: '2',
            _integrationId: '1',
            _flowId: '26',
            createdAt: '2020-12-04T11:03:00.000Z',
            startedAt: '2020-12-05T10:00:00.000Z',
            endedAt: '2020-12-05T10:10:59.000Z',
            status: 'queued',
            numError: 0,
            numSuccess: 5,
            duration: '00:10:59',
          },
        ],
      }, suitescriptActions.job.clear());

      expect(state).toEqual({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 0,
          },
        },
        jobs: [],
      });
    });

    test('should clear joberrors on error clear action', () => {
      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [],
        jobErrors: [
          {
            _id: '1',
            _jobId: '1',
            type: 'import',
            createdAt: '2020-12-04T05:57:00.000Z',
            resolved: false,
            code: '',
            message: 'Name: INVALID_KEY_OR_REF',
            recordLink: '',
          },
        ],
      }, suitescriptActions.job.error.clear());

      expect(state).toEqual({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [],
        jobErrors: undefined,
      });
    });

    test('should update joberrors in state on received action', () => {
      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [],
      }, suitescriptActions.job.receivedErrors({
        collection: [
          {
            _id: '1',
            _jobId: '1',
            type: 'export',
            createdAt: '2020-11-10T04:07:00.000Z',
            resolved: false,
            code: '',
            message: 'Error Code: Error | Error Message: MULTICURRENCY : Please Enable Multi Curency and refresh Corporate Currency',
            recordLink: '',
          },
          {
            _id: '2',
            _jobId: '2',
            type: 'import',
            createdAt: '2020-12-04T05:57:00.000Z',
            resolved: true,
            code: '',
            message: 'Name: INVALID_KEY_OR_REF',
            recordLink: '',
          },
        ],
      },
      ));

      expect(state).toEqual({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [],
        jobErrors: [{
          _id: '1',
          _jobId: '1',
          type: 'export',
          createdAt: '2020-11-10T04:07:00.000Z',
          resolved: false,
          code: '',
          message: 'Error Code: Error | Error Message: MULTICURRENCY : Please Enable Multi Curency and refresh Corporate Currency',
          recordLink: '',
        }],
      });
    });

    test('should resolve selected error ids on resolve selected errors action', () => {
      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [],
        jobErrors: [{
          _id: '1',
          _jobId: '1',
          type: 'export',
          createdAt: '2020-11-10T04:07:00.000Z',
          resolved: false,
          code: '',
          message: 'Error Code: Error | Error Message: MULTICURRENCY : Please Enable Multi Curency and refresh Corporate Currency',
          recordLink: '',
        }, {
          _id: '2',
          _jobId: '2',
          type: 'import',
          createdAt: '2020-11-10T04:07:00.000Z',
          resolved: false,
          code: '',
          message: 'Required fields missing: Name',
          recordLink: '',
        }, {
          _id: '3',
          _jobId: '3',
          type: 'export',
          createdAt: '2020-11-10T04:07:00.000Z',
          resolved: false,
          code: '',
          message: 'Request limit exceeded',
          recordLink: '',
        }],
      }, suitescriptActions.job.resolveSelectedErrorsInit({
        selectedErrorIds: ['1', '2'],
      },
      ));

      expect(state).toEqual({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [],
        jobErrors: [{
          _id: '1',
          _jobId: '1',
          type: 'export',
          createdAt: '2020-11-10T04:07:00.000Z',
          resolved: true,
          code: '',
          message: 'Error Code: Error | Error Message: MULTICURRENCY : Please Enable Multi Curency and refresh Corporate Currency',
          recordLink: '',
        }, {
          _id: '2',
          _jobId: '2',
          type: 'import',
          createdAt: '2020-11-10T04:07:00.000Z',
          resolved: true,
          code: '',
          message: 'Required fields missing: Name',
          recordLink: '',
        }, {
          _id: '3',
          _jobId: '3',
          type: 'export',
          createdAt: '2020-11-10T04:07:00.000Z',
          resolved: false,
          code: '',
          message: 'Request limit exceeded',
          recordLink: '',
        }],
      });
    });

    test('should update numErrors for all jobs on resolveAllInit action', () => {
      const jobsCollection = [
        {
          type: 'import',
          _id: '1',
          _integrationId: '1',
          _flowId: '26',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 5,
          numSuccess: 2,
        },
        {
          type: 'import',
          _id: '2',
          _integrationId: '1',
          _flowId: '31',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 3,
          numSuccess: 2,
        },
        {
          type: 'export',
          _id: '25901',
          _integrationId: '1',
          _flowId: '41',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'running',
        }];

      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: jobsCollection,
      }, suitescriptActions.job.resolveAllInit());

      expect(state).toEqual(
        {
          paging: {
            jobs: {
              currentPage: 0,
              rowsPerPage: 10,
              totalJobs: 3,
            },
          },
          jobs: [
            {
              type: 'import',
              _id: '1',
              _integrationId: '1',
              _flowId: '26',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'completed',
              numError: 0,
              numSuccess: 2,
              __original: {
                numError: 5,
              },
            },
            {
              type: 'import',
              _id: '2',
              _integrationId: '1',
              _flowId: '31',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'completed',
              numError: 0,
              numSuccess: 2,
              __original: {
                numError: 3,
              },
            },
            {
              type: 'export',
              _id: '25901',
              _integrationId: '1',
              _flowId: '41',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'running',
            },
          ],
        }
      );
    });

    test('should update numErrors for job on resolve Init action', () => {
      const jobsCollection = [
        {
          type: 'import',
          _id: '1',
          _integrationId: '1',
          _flowId: '26',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 5,
          numSuccess: 2,
        },
        {
          type: 'import',
          _id: '2',
          _integrationId: '1',
          _flowId: '31',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 3,
          numSuccess: 2,
        },
        {
          type: 'export',
          _id: '25901',
          _integrationId: '1',
          _flowId: '41',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'running',
        }];

      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: jobsCollection,
      }, suitescriptActions.job.resolveInit({
        jobId: '1',
        jobType: 'import',
      }));

      expect(state).toEqual(
        {
          paging: {
            jobs: {
              currentPage: 0,
              rowsPerPage: 10,
              totalJobs: 3,
            },
          },
          jobs: [
            {
              type: 'import',
              _id: '1',
              _integrationId: '1',
              _flowId: '26',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'completed',
              numError: 0,
              numSuccess: 2,
              __original: {
                numError: 5,
              },
            },
            {
              type: 'import',
              _id: '2',
              _integrationId: '1',
              _flowId: '31',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'completed',
              numError: 3,
              numSuccess: 2,
            },
            {
              type: 'export',
              _id: '25901',
              _integrationId: '1',
              _flowId: '41',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'running',
            },
          ],
        }
      );
    });

    test('should update with original numErrors for all jobs on resolveAllUndo action', () => {
      const jobsCollection = [
        {
          type: 'import',
          _id: '1',
          _integrationId: '1',
          _flowId: '26',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
          __original: {
            numError: 5,
          },
        },
        {
          type: 'import',
          _id: '2',
          _integrationId: '1',
          _flowId: '31',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
          __original: {
            numError: 3,
          },
        },
        {
          type: 'export',
          _id: '25901',
          _integrationId: '1',
          _flowId: '41',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'running',
        },
      ];

      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: jobsCollection,
      }, suitescriptActions.job.resolveAllUndo({}));

      expect(state).toEqual(
        {
          paging: {
            jobs: {
              currentPage: 0,
              rowsPerPage: 10,
              totalJobs: 3,
            },
          },
          jobs: [
            {
              type: 'import',
              _id: '1',
              _integrationId: '1',
              _flowId: '26',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'completed',
              numError: 5,
              numSuccess: 2,
            },
            {
              type: 'import',
              _id: '2',
              _integrationId: '1',
              _flowId: '31',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'completed',
              numError: 3,
              numSuccess: 2,
            },
            {
              type: 'export',
              _id: '25901',
              _integrationId: '1',
              _flowId: '41',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'running',
            },
          ],
        }
      );
    });

    test('should update with original numErrors for job on resolve Undo action', () => {
      const jobsCollection = [
        {
          type: 'import',
          _id: '1',
          _integrationId: '1',
          _flowId: '26',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
          __original: {
            numError: 5,
          },
        },
        {
          type: 'import',
          _id: '2',
          _integrationId: '1',
          _flowId: '31',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
          __original: {
            numError: 3,
          },
        },
        {
          type: 'export',
          _id: '25901',
          _integrationId: '1',
          _flowId: '41',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'running',
        },
      ];

      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: jobsCollection,
      }, suitescriptActions.job.resolveUndo({
        jobId: '2',
        jobType: 'import',
      }));

      expect(state).toEqual(
        {
          paging: {
            jobs: {
              currentPage: 0,
              rowsPerPage: 10,
              totalJobs: 3,
            },
          },
          jobs: [
            {
              type: 'import',
              _id: '1',
              _integrationId: '1',
              _flowId: '26',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'completed',
              numError: 0,
              numSuccess: 2,
              __original: {
                numError: 5,
              },
            },
            {
              type: 'import',
              _id: '2',
              _integrationId: '1',
              _flowId: '31',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'completed',
              numError: 3,
              numSuccess: 2,
            },
            {
              type: 'export',
              _id: '25901',
              _integrationId: '1',
              _flowId: '41',
              createdAt: '2020-12-04T11:03:00.000Z',
              startedAt: '2020-12-04T10:00:00.000Z',
              endedAt: '2020-12-04T10:59:59.000Z',
              status: 'running',
            },
          ],
        }
      );
    });
  });
});
describe('testcases for suitescript selectors', () => {
  describe('tiles selector', () => {
    test('should return [] when the state is empty', () => {
      const state = reducer(undefined, 'some action');

      expect(selectors.suiteScriptTiles(state)).toEqual([]);
      expect(selectors.suiteScriptTiles(state, 'something')).toEqual([]);
    });
    describe('should return correct results for different connectionIds', () => {
      const state = {
        c1: {
          something: ['something else'],
        },
        c2: {
          somethingElse: ['something'],
        },
      };
      const tiles = {
        c1: [
          { _integrationId: 'i1', name: 'i one' },
          { _integrationId: 'i2', name: 'i two' },
        ],
        c2: [
          { _integrationId: 'i2', name: 'i two' },
          { _integrationId: 'i3', name: 'i three' },
          { _integrationId: 'i4', name: SUITESCRIPT_CONNECTORS[0].name },
          { _integrationId: 'i5', name: SUITESCRIPT_CONNECTORS[1].name },
        ],
      };

      test('should return correct results for connection c1 [diy integrations only]', () => {
        const tilesReceivedAction = actions.resource.receivedCollection(
          'suitescript/connections/c1/tiles',
          tiles.c1
        );
        const newState = reducer(state, tilesReceivedAction);

        expect(selectors.suiteScriptTiles(newState, 'c1')).toEqual([
          {
            _integrationId: 'i1',
            name: 'i one',
            ssLinkedConnectionId: 'c1',
            displayName: 'i one',
            status: 'success',
          },
          {
            _integrationId: 'i2',
            name: 'i two',
            ssLinkedConnectionId: 'c1',
            displayName: 'i two',
            status: 'success',
          },
        ]);
      });
      test('should return correct results for connection c2 [diy + connector integrations]', () => {
        const tilesReceivedAction = actions.resource.receivedCollection(
          'suitescript/connections/c2/tiles',
          tiles.c2
        );
        const newState = reducer(state, tilesReceivedAction);

        expect(selectors.suiteScriptTiles(newState, 'c2')).toEqual([
          {
            _integrationId: 'i2',
            name: 'i two',
            ssLinkedConnectionId: 'c2',
            displayName: 'i two',
            status: 'success',
          },
          {
            _integrationId: 'i3',
            name: 'i three',
            ssLinkedConnectionId: 'c2',
            displayName: 'i three',
            status: 'success',
          },
          {
            _integrationId: 'i4',
            name: SUITESCRIPT_CONNECTORS[0].name,
            ssLinkedConnectionId: 'c2',
            _connectorId: SUITESCRIPT_CONNECTORS[0]._id,
            displayName: SUITESCRIPT_CONNECTORS[0].name,
            status: 'success',
            urlName: SUITESCRIPT_CONNECTORS[0].urlName,
          },
          {
            _integrationId: 'i5',
            name: SUITESCRIPT_CONNECTORS[1].name,
            ssLinkedConnectionId: 'c2',
            _connectorId: SUITESCRIPT_CONNECTORS[1]._id,
            displayName: SUITESCRIPT_CONNECTORS[1].name,
            status: 'success',
            urlName: SUITESCRIPT_CONNECTORS[1].urlName,
          },
        ]);
      });
    });
  });

  describe('integrations selector', () => {
    test('should return [] when the state is empty', () => {
      const state = reducer(undefined, 'some action');

      expect(selectors.suiteScriptIntegrations(state)).toEqual([]);
      expect(selectors.suiteScriptIntegrations(state, 'something')).toEqual([]);
    });
    describe('should return correct results for different connectionIds', () => {
      const state = {
        c1: {
          something: ['something else'],
        },
        c2: {
          somethingElse: ['something'],
        },
      };
      const tiles = {
        c1: [
          { _integrationId: 'i1', name: 'i one' },
          { _integrationId: 'i2', name: 'i two' },
        ],
        c2: [
          { _integrationId: 'i2', name: 'i two' },
          { _integrationId: 'i3', name: 'i three' },
          {
            _integrationId: 'i4',
            name: SUITESCRIPT_CONNECTORS[0].name,
            mode: 'something',
          },
          {
            _integrationId: 'i5',
            name: SUITESCRIPT_CONNECTORS[1].name,
            mode: 'somethingElse',
          },
        ],
      };

      test('should return correct results for connection c1 [diy integrations only]', () => {
        const tilesReceivedAction = actions.resource.receivedCollection(
          'suitescript/connections/c1/tiles',
          tiles.c1
        );
        const newState = reducer(state, tilesReceivedAction);

        expect(selectors.suiteScriptIntegrations(newState, 'c1')).toEqual([
          {
            _id: 'i1',
            name: 'i one',
            displayName: 'i one',
            isNotEditable: false,
          },
          {
            _id: 'i2',
            name: 'i two',
            displayName: 'i two',
            isNotEditable: false,
          },
        ]);
      });
      test('should return correct results for connection c2 [diy + connector integrations]', () => {
        const tilesReceivedAction = actions.resource.receivedCollection(
          'suitescript/connections/c2/tiles',
          tiles.c2
        );
        const newState = reducer(state, tilesReceivedAction);

        expect(selectors.suiteScriptIntegrations(newState, 'c2')).toEqual([
          {
            _id: 'i2',
            name: 'i two',
            displayName: 'i two',
            isNotEditable: false,
          },
          {
            _id: 'i3',
            name: 'i three',
            displayName: 'i three',
            isNotEditable: false,
          },
          {
            _id: 'i4',
            name: SUITESCRIPT_CONNECTORS[0].name,
            _connectorId: SUITESCRIPT_CONNECTORS[0]._id,
            mode: 'something',
            displayName: SUITESCRIPT_CONNECTORS[0].name,
            isNotEditable: false,
            urlName: SUITESCRIPT_CONNECTORS[0].urlName,
          },
          {
            _id: 'i5',
            name: SUITESCRIPT_CONNECTORS[1].name,
            _connectorId: SUITESCRIPT_CONNECTORS[1]._id,
            mode: 'somethingElse',
            displayName: SUITESCRIPT_CONNECTORS[1].name,
            isNotEditable: false,
            urlName: SUITESCRIPT_CONNECTORS[1].urlName,
          },
        ]);
      });
    });
  });
  describe('resource selector', () => {
    test('should return null for undefined state', () => {
      expect(selectors.suiteScriptResource(undefined, {
        resourceType: 'connections',
        id: '1',
        ssLinkedConnectionId: 'connId',
      })).toEqual(null);
    });
    test('should return connection from selectors', () => {
      const state = reducer(undefined, actions.resource.receivedCollection(
        'suitescript/connections/connId/connections',
        [
          {
            _id: '1',
            id: 'SALESFORCE_CONNECTION',
            type: 'salesforce',
            name: 'SALESFORCE_CONNECTION',
          },
          {
            _id: '2',
            id: 'NETSUITE_CONNECTION',
            type: 'netsuite',
            name: 'NETSUITE_CONNECTION',
            offline: false,
          },
        ]
      ));

      expect(selectors.suiteScriptResource(state, {
        resourceType: 'connections',
        id: '1',
        ssLinkedConnectionId: 'connId',
      })).toEqual(
        {
          _id: '1',
          id: 'SALESFORCE_CONNECTION',
          type: 'salesforce',
          name: 'SALESFORCE_CONNECTION',
        }
      );
    });

    test('should return settings from state', () => {
      const settings = {
        general: {
          description: 'general settings',
          id: 'gensettings',
        },
      };

      const state = reducer({
        connId: {
          settings: {

          },
        },
      }, suitescriptActions.resource.received('connId', 'int1', 'settings', settings));

      expect(selectors.suiteScriptResource(state, {
        resourceType: 'settings',
        id: 'int1',
        ssLinkedConnectionId: 'connId',
      })).toEqual(
        {
          general: {
            description: 'general settings',
            id: 'gensettings',
          },
        }
      );
    });

    test('should return export from state', () => {
      const jobCollection = [
        {
          _id: 'EXP1',
          type: 'EXPORT',
          _flowId: 'f1',
        },
        {
          _id: 'IMP2',
          type: 'IMPORT',
          _flowId: 'f2',
        },
      ];

      const state = reducer(undefined, actions.resource.receivedCollection(
        'suitescript/connections/connId/integrations/intid/flows',
        jobCollection
      ));

      expect(selectors.suiteScriptResource(state, {
        resourceType: 'flows',
        id: 'f1',
        ssLinkedConnectionId: 'connId',
      })).toEqual(
        {
          _id: 'eEXP1',
          ssLinkedConnectionId: 'connId',
          type: 'EXPORT',
          _flowId: 'f1',
        }
      );
    });

    describe('hasSuiteScriptData selector tests', () => {
      test('should return false if doesn\'t have suitescript data', () => {
        expect(selectors.hasSuiteScriptData(undefined)).toEqual(false);
      });

      test('should return true if state has settings', () => {
        const settings = {
          general: {
            description: 'general settings',
            id: 'gensettings',
          },
        };

        const state = reducer({
          connId: {
            settings: {

            },
          },
        }, suitescriptActions.resource.received('connId', 'int1', 'settings', settings));

        expect(selectors.hasSuiteScriptData(state, {
          resourceType: 'settings',
          integrationId: 'int1',
          ssLinkedConnectionId: 'connId',
        })).toEqual(true);
      });
      test('should return true if state has flows', () => {
        const flowCollection = [
          {
            _id: 'EXP1',
            type: 'EXPORT',
            _flowId: '26',
            ioFlowName: 'sync Acc to NS acc',
            _integrationId: 'intid',
          },
          {
            _id: 'IMP2',
            type: 'IMPORT',
          },
        ];

        const state = reducer(defaultState, actions.resource.receivedCollection(
          'suitescript/connections/connId/integrations/intid/flows',
          flowCollection
        ));

        expect(selectors.hasSuiteScriptData(state, {
          resourceType: 'flows',
          integrationId: 'intid',
          ssLinkedConnectionId: 'connId',
        })).toEqual(true);
      });
    });
  });

  test('should return resource list from state', () => {
    const flowCollection = [
      {
        _id: 'EXP1',
        type: 'EXPORT',
        _flowId: '26',
        ioFlowName: 'sync Acc to NS acc',
        _integrationId: 'intid',
      },
      {
        _id: 'IMP2',
        type: 'IMPORT',
      },
    ];

    const state = reducer(defaultState, actions.resource.receivedCollection(
      'suitescript/connections/connId/integrations/intid/flows',
      flowCollection
    ));

    expect(selectors.suiteScriptResourceList(state, {
      resourceType: 'flows',
      integrationId: 'intid',
      ssLinkedConnectionId: 'connId'})).toEqual(
      [
        {
          _flowId: '26',
          _id: 'eEXP1',
          _integrationId: 'intid',
          ioFlowName: 'sync Acc to NS acc',
          ssLinkedConnectionId: 'connId',
          type: 'EXPORT',
        },
      ]
    );
  });
  test('should return IA settings from state', () => {
    const settings = {
      general: {
        description: 'general settings',
        id: 'gensettings',
      },
      sections: [
        {
          id: 'accountsync',
          title: 'Account Sync',
        },
        {
          id: 'opportunitysync',
          title: 'Opportunity Sync',
          sections: [{
            id: 'lineitemSync',
          }],
        },
      ],
    };

    const state = reducer({
      connId: {
        settings: {

        },
      },
    }, suitescriptActions.resource.received('connId', 'int1', 'settings', settings));

    const stateSelector = selectors.makeSuiteScriptIASettings();

    expect(stateSelector(state, 'int1', 'connId')).toEqual({
      general: {
        description: 'general settings',
        id: 'gensettings',
      },
      sections: [
        {
          id: 'accountsync',
          title: 'Account Sync',
        },
        {
          id: 'opportunitysync',
          title: 'Opportunity Sync',
          sections: [
            {
              id: 'lineitemSync',
              title: 'Common',
            },
          ],
        },
      ],
      settings: {

      },
    });
  });
  describe('suitescript jobs selectors', () => {
    const jobsCollection = [
      {
        type: 'import',
        _id: '1',
        _integrationId: '1',
        _flowId: '26',
        createdAt: '2020-12-04T11:03:00.000Z',
        startedAt: '2020-12-04T10:00:00.000Z',
        endedAt: '2020-12-04T10:59:59.000Z',
        status: 'completed',
        numError: 0,
        numSuccess: 2,
      },
      {
        type: 'import',
        _id: '2',
        _integrationId: '1',
        _flowId: '31',
        createdAt: '2020-12-04T11:03:00.000Z',
        startedAt: '2020-12-04T10:00:00.000Z',
        endedAt: '2020-12-04T10:59:59.000Z',
        status: 'completed',
        numError: 0,
        numSuccess: 2,
      },
      {
        type: 'export',
        _id: '25901',
        _integrationId: '1',
        _flowId: '41',
        createdAt: '2020-12-04T11:03:00.000Z',
        startedAt: '2020-12-04T10:00:00.000Z',
        endedAt: '2020-12-04T10:59:59.000Z',
        status: 'completed',
      }];

    test('should return empty obj/list when selected on empty state', () => {
      expect(selectors.suiteScriptJobsPagingDetails(undefined)).toEqual({});
      expect(selectors.jobs(undefined)).toEqual([]);
      expect(selectors.suiteScriptJobErrors(undefined)).toEqual(undefined);
    });

    test('should return paging details for non-empty state', () => {
      const state = reducer(defaultState, suitescriptActions.job.receivedCollection({
        collection: jobsCollection,
      }));

      expect(selectors.suiteScriptJobsPagingDetails(state)).toEqual({
        currentPage: 0,
        rowsPerPage: 10,
        totalJobs: 3,
      });
    });

    test('should return job details for non-empty state', () => {
      const flowCollection = [
        {
          _id: 'EXP1',
          type: 'EXPORT',
          _flowId: '26',
          ioFlowName: 'sync Acc to NS acc',
          _integrationId: 'intid',
        },
        {
          _id: 'IMP2',
          type: 'IMPORT',
        },
      ];

      let state = reducer(defaultState, actions.resource.receivedCollection(
        'suitescript/connections/connId/integrations/intid/flows',
        flowCollection
      ));

      state = reducer(state, suitescriptActions.job.receivedCollection({
        collection: jobsCollection,
      }));

      expect(selectors.jobs(state, {
        ssLinkedConnectionId: 'connId',
        integrationId: 'intid',
      })).toEqual([
        {
          _flowId: '26',
          _id: '1',
          _integrationId: '1',
          name: 'sync Acc to NS acc',
          createdAt: '2020-12-04T11:03:00.000Z',
          duration: '00:59:59',
          endedAt: '2020-12-04T10:59:59.000Z',
          numError: 0,
          numSuccess: 2,
          startedAt: '2020-12-04T10:00:00.000Z',
          status: 'completed',
          type: 'import',
        },
        {
          _flowId: '31',
          _id: '2',
          _integrationId: '1',
          createdAt: '2020-12-04T11:03:00.000Z',
          duration: '00:59:59',
          endedAt: '2020-12-04T10:59:59.000Z',
          numError: 0,
          numSuccess: 2,
          startedAt: '2020-12-04T10:00:00.000Z',
          status: 'completed',
          type: 'import',
        },
        {
          _flowId: '41',
          _id: '25901',
          _integrationId: '1',
          createdAt: '2020-12-04T11:03:00.000Z',
          duration: '00:59:59',
          endedAt: '2020-12-04T10:59:59.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          status: 'completed',
          type: 'export',
        },
      ]);
    });

    test('should return job errors for non-empty state', () => {
      const state = reducer({
        paging: {
          jobs: {
            currentPage: 0,
            rowsPerPage: 10,
            totalJobs: 3,
          },
        },
        jobs: [],
      }, suitescriptActions.job.receivedErrors({
        collection: [
          {
            _id: '1',
            _jobId: '1',
            type: 'export',
            createdAt: '2020-11-10T04:07:00.000Z',
            resolved: false,
            code: '',
            message: 'Error Code: Error | Error Message: MULTICURRENCY : Please Enable Multi Curency and refresh Corporate Currency',
            recordLink: '',
          },
          {
            _id: '2',
            _jobId: '2',
            type: 'import',
            createdAt: '2020-12-04T05:57:00.000Z',
            resolved: true,
            code: '',
            message: 'Name: INVALID_KEY_OR_REF',
            recordLink: '',
          },
        ],
      },
      ));

      expect(selectors.suiteScriptJobErrors(state, {
        jobId: '1',
        jobType: 'export',
      })).toEqual([{
        _id: '1',
        _jobId: '1',
        type: 'export',
        createdAt: '2020-11-10T04:07:00.000Z',
        resolved: false,
        code: '',
        message: 'Error Code: Error | Error Message: MULTICURRENCY : Please Enable Multi Curency and refresh Corporate Currency',
        recordLink: '',
      }]);
    });
  });
});
