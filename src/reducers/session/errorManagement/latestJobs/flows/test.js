/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../../actions';

describe('errorManagement latestJobs flows reducer test cases', () => {
  test('should return initial state when action is not matched', () => {
    expect(reducer(undefined, { type: 'RANDOM_ACTION' })).toEqual({});
    expect(reducer(null, { type: 'RANDOM_ACTION' })).toEqual(null);
    expect(reducer('string', { type: 'RANDOM_ACTION' })).toEqual('string');
    expect(reducer(undefined, { type: undefined })).toEqual({});
    expect(reducer(undefined, { type: null })).toEqual({});
  });
  describe('errorManagement latestJobs reducer', () => {
    describe('errorManagement flow latestJobs request action', () => {
      test('should find the flow with id and set requested flag to true', () => {
        const state = reducer(
          {},
          actions.errorManager.latestFlowJobs.request({
            flowId: 'flowId',
          }
          )
        );

        expect(state).toEqual({
          flowId: { status: 'request'},
        });
      });

      test('should find the flow with id and set requested flag to true and should not affect the existing data', () => {
        const state = reducer(
          {
            flowId: { status: 'received', data: [{id: 'id1'}]},
          },
          actions.errorManager.latestFlowJobs.request({
            flowId: 'flowId',
          }
          )
        );

        expect(state).toEqual({
          flowId: { status: 'request', data: [{id: 'id1'}]},
        });
      });

      test('should find the flow with id and set requested flag to true and should not affect the existing data', () => {
        const state = reducer(
          {
            flowId: { status: 'request', data: [{id: 'id1'}]},
          },
          actions.errorManager.latestFlowJobs.request({
            flowId: 'flowId',
            refresh: true,
          }
          )
        );

        expect(state).toEqual({
          flowId: { status: 'refresh', data: [{id: 'id1'}]},
        });
      });
    });

    describe('errorManagement flow latestJobs clear action', () => {
      test('should not throw any error if flow not found', () => {
        const state = reducer(
          {},
          actions.errorManager.latestFlowJobs.clear({
            flowId: 'flowId',
          }
          )
        );

        expect(state).toEqual({});
      });

      test('should find the flow with id clear data', () => {
        const state = reducer(
          {
            flowId: { status: 'received', data: [{id: 'id1'}]},
          },
          actions.errorManager.latestFlowJobs.clear({
            flowId: 'flowId',
          }
          )
        );

        expect(state).toEqual({});
      });

      test('should find the flow with id and set clear the flow data and should not affect the existing data', () => {
        const state = reducer(
          {
            flowId: { status: 'request', data: [{id: 'id1'}]},
            flowId1: { status: 'request', data: [{id: 'id1'}]},
          },
          actions.errorManager.latestFlowJobs.clear({
            flowId: 'flowId1',
          }
          )
        );

        expect(state).toEqual({
          flowId: { status: 'request', data: [{id: 'id1'}]},
        });
      });
    });

    describe('errorManager flow latestJobs received action', () => {
      test('should find the integration with id and set data', () => {
        const newState = reducer(
          {},
          actions.errorManager.latestFlowJobs.received({
            flowId: 'flowId',
            latestJobs: [
              {
                _id: '5fbcc774186317194404c4e0',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _exportId: '5e5df46617db9422ddba9f1a',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                status: 'queued',
                __lastPageGeneratorJob: true,
              },
            ]})
        );

        expect(newState).toEqual({
          flowId: {
            status: 'received',
            data: [
              {
                _id: '5fbcc774186317194404c4e0',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _exportId: '5e5df46617db9422ddba9f1a',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                status: 'queued',
                __lastPageGeneratorJob: true,
              },
            ],
          },
        });
      });

      test('should find the flow with id and update it but should not affect any other flow in the session', () => {
        const newState = reducer(
          {
            flowId: {
              status: 'received',
              data: [
                {
                  _id: '5fbcc774186317194404c4e1',
                  _userId: '5677d8839799c292124350c5',
                  type: 'flow',
                  _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                  _exportId: '5e5df46617db9422ddba9f1a',
                  _integrationId: '5e5df1e117db9422ddba9e5a',
                  status: 'queued',
                  __lastPageGeneratorJob: true,
                },
              ],
            },
          },
          actions.errorManager.latestFlowJobs.received({
            flowId: 'flowId1',
            latestJobs: [
              {
                _id: '5fbcc774186317194404c4e0',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _exportId: '5e5df46617db9422ddba9f1a',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                status: 'queued',
                __lastPageGeneratorJob: true,
              },
            ]})
        );

        expect(newState).toEqual({
          flowId: {
            status: 'received',
            data: [
              {
                _id: '5fbcc774186317194404c4e1',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _exportId: '5e5df46617db9422ddba9f1a',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                status: 'queued',
                __lastPageGeneratorJob: true,
              },
            ],
          },
          flowId1: {
            status: 'received',
            data: [
              {
                _id: '5fbcc774186317194404c4e0',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _exportId: '5e5df46617db9422ddba9f1a',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                status: 'queued',
                __lastPageGeneratorJob: true,
              },
            ],
          },
        });
      });

      test('should find the flow with id and update it with children but should not affect any other flow in the session', () => {
        const newState = reducer(
          {
            flowId: {
              status: 'received',
              data: [
                {
                  _id: '5fbcc774186317194404c4e0',
                  _userId: '5677d8839799c292124350c5',
                  type: 'flow',
                  _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                  _exportId: '5e5df46617db9422ddba9f1a',
                  _integrationId: '5e5df1e117db9422ddba9e5a',
                  status: 'queued',
                  __lastPageGeneratorJob: true,
                  children: [
                    {
                      _id: '5fbcc790fd7dbe2cbb5c9a09',
                      type: 'export',
                      _exportId: '5e5df46617db9422ddba9f1a',
                      _flowJobId: '5fbcc774186317194404c4e0',
                      startedAt: '2020-11-24T08:42:56.842Z',
                      endedAt: '2020-11-24T08:43:02.284Z',
                      lastExecutedAt: '2020-11-24T08:43:02.284Z',
                      status: 'completed',
                      numError: 0,
                      numResolved: 0,
                      numSuccess: 481,
                      numIgnore: 0,
                      numPagesGenerated: 25,
                      oIndex: 0,
                      createdAt: '2020-11-24T08:42:56.842Z',
                      lastModified: '2020-11-24T08:43:02.332Z',
                    },
                    {
                      _id: '5fbcc796fd7dbe2cbb5c9a0b',
                      type: 'import',
                      _importId: '5e5df4ad17db9422ddba9f46',
                      _flowJobId: '5fbcc774186317194404c4e0',
                      startedAt: '2020-11-24T08:43:02.020Z',
                      endedAt: '2020-11-24T08:44:02.760Z',
                      lastExecutedAt: '2020-11-24T08:44:02.760Z',
                      status: 'inprogress',
                      numError: 477,
                      numResolved: 0,
                      numSuccess: 4,
                      numIgnore: 0,
                      numPagesProcessed: 25,
                      oIndex: 1,
                      retriable: false,
                      createdAt: '2020-11-24T08:43:02.020Z',
                      lastModified: '2020-11-24T08:44:02.760Z',
                      errorFile: {
                        id: 'ab0ff7be4f354de6a0ff0f739387971e',
                        host: 's3',
                      },
                    },
                  ],
                },
              ],
            },
          },
          actions.errorManager.latestFlowJobs.received({
            flowId: 'flowId',
            latestJobs: [
              {
                _id: '5fbcc774186317194404c4e0',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _exportId: '5e5df46617db9422ddba9f1a',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                status: 'queued',
                __lastPageGeneratorJob: true,
              },
            ]})
        );

        expect(newState).toEqual({
          flowId: {
            status: 'received',
            data: [
              {
                _id: '5fbcc774186317194404c4e0',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _exportId: '5e5df46617db9422ddba9f1a',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                status: 'queued',
                __lastPageGeneratorJob: true,
                children: [
                  {
                    _id: '5fbcc790fd7dbe2cbb5c9a09',
                    type: 'export',
                    _exportId: '5e5df46617db9422ddba9f1a',
                    _flowJobId: '5fbcc774186317194404c4e0',
                    startedAt: '2020-11-24T08:42:56.842Z',
                    endedAt: '2020-11-24T08:43:02.284Z',
                    lastExecutedAt: '2020-11-24T08:43:02.284Z',
                    status: 'completed',
                    numError: 0,
                    numResolved: 0,
                    numSuccess: 481,
                    numIgnore: 0,
                    numPagesGenerated: 25,
                    oIndex: 0,
                    createdAt: '2020-11-24T08:42:56.842Z',
                    lastModified: '2020-11-24T08:43:02.332Z',
                  },
                  {
                    _id: '5fbcc796fd7dbe2cbb5c9a0b',
                    type: 'import',
                    _importId: '5e5df4ad17db9422ddba9f46',
                    _flowJobId: '5fbcc774186317194404c4e0',
                    startedAt: '2020-11-24T08:43:02.020Z',
                    endedAt: '2020-11-24T08:44:02.760Z',
                    lastExecutedAt: '2020-11-24T08:44:02.760Z',
                    status: 'inprogress',
                    numError: 477,
                    numResolved: 0,
                    numSuccess: 4,
                    numIgnore: 0,
                    numPagesProcessed: 25,
                    oIndex: 1,
                    retriable: false,
                    createdAt: '2020-11-24T08:43:02.020Z',
                    lastModified: '2020-11-24T08:44:02.760Z',
                    errorFile: {
                      id: 'ab0ff7be4f354de6a0ff0f739387971e',
                      host: 's3',
                    },
                  },
                ],
              },
            ],
          },
        });
      });
    });

    describe('errorManager flow latestJobsFamily received action', () => {
      test('should not change the state when flowId not found', () => {
        const newState = reducer(
          {},
          actions.errorManager.latestFlowJobs.receivedJobFamily({
            flowId: 'flowId',
            job: {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'queued',
              __lastPageGeneratorJob: true,
            },
          })
        );

        expect(newState).toEqual({});
      });
      test('should find the flow with id and set data', () => {
        const newState = reducer(
          {
            flowId: {
              status: 'received',
              data: [
                {
                  _id: '5fbcc774186317194404c4e0',
                  _userId: '5677d8839799c292124350c5',
                  type: 'flow',
                  _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                  _exportId: '5e5df46617db9422ddba9f1a',
                  _integrationId: '5e5df1e117db9422ddba9e5a',
                  status: 'queued',
                  __lastPageGeneratorJob: true,
                },
              ],
            },
          },
          actions.errorManager.latestFlowJobs.receivedJobFamily({
            flowId: 'flowId',
            job: {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'running',
              children: [],
              __lastPageGeneratorJob: true,
            },
          })
        );

        expect(newState).toEqual({
          flowId: {
            status: 'received',
            data: [
              {
                numError: 0,
                numResolved: 0,
                numSuccess: 0,
                numIgnore: 0,
                children: [],
                numPagesGenerated: 0,
                numPagesProcessed: 0,
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                _id: '5fbcc774186317194404c4e0',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _exportId: '5e5df46617db9422ddba9f1a',
                status: 'running',
                __lastPageGeneratorJob: true,
              },
            ],
          },
        });
      });

      test('should find the flow with id and update it but should not affect any other flow in the session', () => {
        const newState = reducer(
          {
            flowId1: {
              status: 'received',
              data: [
                {
                  _id: '5fbcc774186317194404c4e1',
                  _userId: '5677d8839799c292124350c5',
                  type: 'flow',
                  _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                  _exportId: '5e5df46617db9422ddba9f1a',
                  _integrationId: '5e5df1e117db9422ddba9e5a',
                  status: 'queued',
                  __lastPageGeneratorJob: true,
                },
              ],
            },
            flowId: {
              status: 'received',
              data: [
                {
                  _id: '5fbcc774186317194404c4e0',
                  _userId: '5677d8839799c292124350c5',
                  type: 'flow',
                  _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                  _exportId: '5e5df46617db9422ddba9f1a',
                  _integrationId: '5e5df1e117db9422ddba9e5a',
                  status: 'queued',
                  __lastPageGeneratorJob: true,
                },
              ],
            },
          },
          actions.errorManager.latestFlowJobs.receivedJobFamily({
            flowId: 'flowId',
            job: {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'running',
              children: [],
              __lastPageGeneratorJob: true,
            },
          })
        );

        expect(newState).toEqual({
          flowId: {
            status: 'received',
            data: [
              {
                numError: 0,
                numResolved: 0,
                numSuccess: 0,
                numIgnore: 0,
                children: [],
                numPagesGenerated: 0,
                numPagesProcessed: 0,
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                _id: '5fbcc774186317194404c4e0',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _exportId: '5e5df46617db9422ddba9f1a',
                status: 'running',
                __lastPageGeneratorJob: true,
              },
            ],
          },
          flowId1: {
            status: 'received',
            data: [
              {
                _id: '5fbcc774186317194404c4e1',
                _userId: '5677d8839799c292124350c5',
                type: 'flow',
                _flowId: '5e5df42ff6f85b2b9ae4a4d8',
                _exportId: '5e5df46617db9422ddba9f1a',
                _integrationId: '5e5df1e117db9422ddba9e5a',
                status: 'queued',
                __lastPageGeneratorJob: true,
              },
            ],
          },
        });
      });
    });
  });
});

describe('errorManagement latestJobs flows selectors test cases', () => {
  describe('latestFlowJobsList', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.latestFlowJobsList(undefined, 'dummy')).toEqual({});
      expect(selectors.latestFlowJobsList(null, 'dummy')).toEqual({});
      expect(selectors.latestFlowJobsList('string', 'dummy')).toEqual({});
      expect(selectors.latestFlowJobsList(123, 'dummy')).toEqual({});
      expect(selectors.latestFlowJobsList({}, 'dummy')).toEqual({});
      expect(selectors.latestFlowJobsList(undefined, null)).toEqual({});
      expect(selectors.latestFlowJobsList()).toEqual({});
    });

    test('should return correct state data when a match is found.', () => {
      const expectedData = {
        status: 'received',
        data: [
          {
            _id: '5fbcc774186317194404c4e0',
            _userId: '5677d8839799c292124350c5',
            type: 'flow',
            _flowId: '5e5df42ff6f85b2b9ae4a4d8',
            _exportId: '5e5df46617db9422ddba9f1a',
            _integrationId: '5e5df1e117db9422ddba9e5a',
            status: 'queued',
            __lastPageGeneratorJob: true,
          },
        ],
      };
      const newState = reducer(
        {},
        actions.errorManager.latestFlowJobs.received({
          flowId: 'flowId',
          latestJobs: [
            {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'queued',
              __lastPageGeneratorJob: true,
            },
          ]})
      );

      expect(selectors.latestFlowJobsList(newState, 'flowId')).toEqual(expectedData);
    });
  });

  describe('getInProgressLatestJobs', () => {
    test('should return empty state when no match found.', () => {
      expect(selectors.getInProgressLatestJobs(undefined, 'dummy')).toEqual([]);
      expect(selectors.getInProgressLatestJobs(null, 'dummy')).toEqual([]);
      expect(selectors.getInProgressLatestJobs('string', 'dummy')).toEqual([]);
      expect(selectors.getInProgressLatestJobs(123, 'dummy')).toEqual([]);
      expect(selectors.getInProgressLatestJobs({}, 'dummy')).toEqual([]);
      expect(selectors.getInProgressLatestJobs(undefined, null)).toEqual([]);
      expect(selectors.getInProgressLatestJobs()).toEqual([]);
    });

    test('should return correct state data when a match is found.', () => {
      let newState = reducer(
        {},
        actions.errorManager.latestFlowJobs.received({
          flowId: 'flowId',
          latestJobs: [
            {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'queued',
              __lastPageGeneratorJob: true,
            },
          ]})
      );

      newState = reducer(
        newState,
        actions.errorManager.latestFlowJobs.receivedJobFamily({
          flowId: 'flowId',
          job: {
            _id: '5fbcc774186317194404c4e0',
            type: 'flow',
            _integrationId: '5e5df1e117db9422ddba9e5a',
            _exportId: '5e5df46617db9422ddba9f1a',
            _flowId: '5e5df42ff6f85b2b9ae4a4d8',
            startedAt: '2020-11-24T08:42:54.221Z',
            lastExecutedAt: '2020-11-24T08:44:02.760Z',
            status: 'completed',
            numError: 477,
            numResolved: 0,
            numSuccess: 485,
            numIgnore: 0,
            numPagesGenerated: 25,
            doneExporting: true,
            createdAt: '2020-11-24T08:42:28.264Z',
            lastModified: '2020-11-24T08:44:02.766Z',
            children: [
              {
                _id: '5fbcc790fd7dbe2cbb5c9a09',
                type: 'export',
                _exportId: '5e5df46617db9422ddba9f1a',
                _flowJobId: '5fbcc774186317194404c4e0',
                startedAt: '2020-11-24T08:42:56.842Z',
                endedAt: '2020-11-24T08:43:02.284Z',
                lastExecutedAt: '2020-11-24T08:43:02.284Z',
                status: 'completed',
                numError: 0,
                numResolved: 0,
                numSuccess: 481,
                numIgnore: 0,
                numPagesGenerated: 25,
                oIndex: 0,
                createdAt: '2020-11-24T08:42:56.842Z',
                lastModified: '2020-11-24T08:43:02.332Z',
              },
              {
                _id: '5fbcc796fd7dbe2cbb5c9a0b',
                type: 'import',
                _importId: '5e5df4ad17db9422ddba9f46',
                _flowJobId: '5fbcc774186317194404c4e0',
                startedAt: '2020-11-24T08:43:02.020Z',
                endedAt: '2020-11-24T08:44:02.760Z',
                lastExecutedAt: '2020-11-24T08:44:02.760Z',
                status: 'completed',
                numError: 477,
                numResolved: 0,
                numSuccess: 4,
                numIgnore: 0,
                numPagesProcessed: 25,
                oIndex: 1,
                retriable: false,
                createdAt: '2020-11-24T08:43:02.020Z',
                lastModified: '2020-11-24T08:44:02.760Z',
                errorFile: {
                  id: 'ab0ff7be4f354de6a0ff0f739387971e',
                  host: 's3',
                },
              },
            ],
          },
        })
      );

      expect(selectors.getInProgressLatestJobs(newState, 'flowId')).toEqual([]);
    });

    test('should return correct state data when a match is found with considerChildJobs.', () => {
      let newState = reducer(
        {},
        actions.errorManager.latestFlowJobs.received({
          flowId: 'flowId',
          latestJobs: [
            {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'queued',
              __lastPageGeneratorJob: true,
            },
          ]})
      );

      newState = reducer(
        newState,
        actions.errorManager.latestFlowJobs.receivedJobFamily({
          flowId: 'flowId',
          job: {
            _id: '5fbcc774186317194404c4e0',
            type: 'flow',
            _integrationId: '5e5df1e117db9422ddba9e5a',
            _exportId: '5e5df46617db9422ddba9f1a',
            _flowId: '5e5df42ff6f85b2b9ae4a4d8',
            startedAt: '2020-11-24T08:42:54.221Z',
            lastExecutedAt: '2020-11-24T08:44:02.760Z',
            status: 'running',
            numError: 477,
            numResolved: 0,
            numSuccess: 485,
            numIgnore: 0,
            numPagesGenerated: 25,
            doneExporting: true,
            createdAt: '2020-11-24T08:42:28.264Z',
            lastModified: '2020-11-24T08:44:02.766Z',
            children: [
              {
                _id: '5fbcc790fd7dbe2cbb5c9a09',
                type: 'export',
                _exportId: '5e5df46617db9422ddba9f1a',
                _flowJobId: '5fbcc774186317194404c4e0',
                startedAt: '2020-11-24T08:42:56.842Z',
                endedAt: '2020-11-24T08:43:02.284Z',
                lastExecutedAt: '2020-11-24T08:43:02.284Z',
                status: 'completed',
                numError: 0,
                numResolved: 0,
                numSuccess: 481,
                numIgnore: 0,
                numPagesGenerated: 25,
                oIndex: 0,
                createdAt: '2020-11-24T08:42:56.842Z',
                lastModified: '2020-11-24T08:43:02.332Z',
              },
              {
                _id: '5fbcc796fd7dbe2cbb5c9a0b',
                type: 'import',
                _importId: '5e5df4ad17db9422ddba9f46',
                _flowJobId: '5fbcc774186317194404c4e0',
                startedAt: '2020-11-24T08:43:02.020Z',
                endedAt: '2020-11-24T08:44:02.760Z',
                lastExecutedAt: '2020-11-24T08:44:02.760Z',
                status: 'completed',
                numError: 477,
                numResolved: 0,
                numSuccess: 4,
                numIgnore: 0,
                numPagesProcessed: 25,
                oIndex: 1,
                retriable: false,
                createdAt: '2020-11-24T08:43:02.020Z',
                lastModified: '2020-11-24T08:44:02.760Z',
                errorFile: {
                  id: 'ab0ff7be4f354de6a0ff0f739387971e',
                  host: 's3',
                },
              },
            ],
          },
        })
      );

      expect(selectors.getInProgressLatestJobs(newState, 'flowId', true)).toEqual(['5fbcc774186317194404c4e0']);
    });

    test('should return correct state data when a match is found with considerChildJobs.', () => {
      let newState = reducer(
        {},
        actions.errorManager.latestFlowJobs.received({
          flowId: 'flowId',
          latestJobs: [
            {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'queued',
              __lastPageGeneratorJob: true,
            },
          ]})
      );

      newState = reducer(
        newState,
        actions.errorManager.latestFlowJobs.receivedJobFamily({
          flowId: 'flowId',
          job: {
            _id: '5fbcc774186317194404c4e0',
            type: 'flow',
            _integrationId: '5e5df1e117db9422ddba9e5a',
            _exportId: '5e5df46617db9422ddba9f1a',
            _flowId: '5e5df42ff6f85b2b9ae4a4d8',
            startedAt: '2020-11-24T08:42:54.221Z',
            lastExecutedAt: '2020-11-24T08:44:02.760Z',
            status: 'completed',
            numError: 477,
            numResolved: 0,
            numSuccess: 485,
            numIgnore: 0,
            numPagesGenerated: 25,
            doneExporting: true,
            createdAt: '2020-11-24T08:42:28.264Z',
            lastModified: '2020-11-24T08:44:02.766Z',

          },
        })
      );

      expect(selectors.getInProgressLatestJobs(newState, 'flowId', true)).toEqual([]);
    });

    test('should return correct state data when a match is found with job containing children.', () => {
      const expectedData = ['5fbcc774186317194404c4e0'];
      let newState = reducer(
        {},
        actions.errorManager.latestFlowJobs.received({
          flowId: 'flowId',
          latestJobs: [
            {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'queued',
              __lastPageGeneratorJob: true,
            },
          ]})
      );

      newState = reducer(
        newState,
        actions.errorManager.latestFlowJobs.receivedJobFamily({
          flowId: 'flowId',
          job: {
            _id: '5fbcc774186317194404c4e0',
            type: 'flow',
            _integrationId: '5e5df1e117db9422ddba9e5a',
            _exportId: '5e5df46617db9422ddba9f1a',
            _flowId: '5e5df42ff6f85b2b9ae4a4d8',
            startedAt: '2020-11-24T08:42:54.221Z',
            lastExecutedAt: '2020-11-24T08:44:02.760Z',
            status: 'running',
            numError: 477,
            numResolved: 0,
            numSuccess: 485,
            numIgnore: 0,
            numPagesGenerated: 25,
            doneExporting: true,
            createdAt: '2020-11-24T08:42:28.264Z',
            lastModified: '2020-11-24T08:44:02.766Z',
            children: [
              {
                _id: '5fbcc790fd7dbe2cbb5c9a09',
                type: 'export',
                _exportId: '5e5df46617db9422ddba9f1a',
                _flowJobId: '5fbcc774186317194404c4e0',
                startedAt: '2020-11-24T08:42:56.842Z',
                endedAt: '2020-11-24T08:43:02.284Z',
                lastExecutedAt: '2020-11-24T08:43:02.284Z',
                status: 'completed',
                numError: 0,
                numResolved: 0,
                numSuccess: 481,
                numIgnore: 0,
                numPagesGenerated: 25,
                oIndex: 0,
                createdAt: '2020-11-24T08:42:56.842Z',
                lastModified: '2020-11-24T08:43:02.332Z',
              },
              {
                _id: '5fbcc796fd7dbe2cbb5c9a0b',
                type: 'import',
                _importId: '5e5df4ad17db9422ddba9f46',
                _flowJobId: '5fbcc774186317194404c4e0',
                startedAt: '2020-11-24T08:43:02.020Z',
                endedAt: '2020-11-24T08:44:02.760Z',
                lastExecutedAt: '2020-11-24T08:44:02.760Z',
                status: 'inprogress',
                numError: 477,
                numResolved: 0,
                numSuccess: 4,
                numIgnore: 0,
                numPagesProcessed: 25,
                oIndex: 1,
                retriable: false,
                createdAt: '2020-11-24T08:43:02.020Z',
                lastModified: '2020-11-24T08:44:02.760Z',
                errorFile: {
                  id: 'ab0ff7be4f354de6a0ff0f739387971e',
                  host: 's3',
                },
              },
            ],
          },
        })
      );

      expect(selectors.getInProgressLatestJobs(newState, 'flowId')).toEqual(expectedData);
    });

    test('should return correct inprogress data when a match is found with parent job inprogress.', () => {
      const expectedData = ['5fbcc774186317194404c4e0'];
      let newState = reducer(
        {},
        actions.errorManager.latestFlowJobs.received({
          flowId: 'flowId',
          latestJobs: [
            {
              _id: '5fbcc774186317194404c4e0',
              _userId: '5677d8839799c292124350c5',
              type: 'flow',
              _flowId: '5e5df42ff6f85b2b9ae4a4d8',
              _exportId: '5e5df46617db9422ddba9f1a',
              _integrationId: '5e5df1e117db9422ddba9e5a',
              status: 'queued',
              __lastPageGeneratorJob: true,
            },
          ]})
      );

      newState = reducer(
        newState,
        actions.errorManager.latestFlowJobs.receivedJobFamily({
          flowId: 'flowId',
          job: {
            _id: '5fbcc774186317194404c4e0',
            type: 'flow',
            _integrationId: '5e5df1e117db9422ddba9e5a',
            _exportId: '5e5df46617db9422ddba9f1a',
            _flowId: '5e5df42ff6f85b2b9ae4a4d8',
            startedAt: '2020-11-24T08:42:54.221Z',
            lastExecutedAt: '2020-11-24T08:44:02.760Z',
            status: 'completed',
            numError: 477,
            numResolved: 0,
            numSuccess: 485,
            numIgnore: 0,
            numPagesGenerated: 25,
            doneExporting: true,
            createdAt: '2020-11-24T08:42:28.264Z',
            lastModified: '2020-11-24T08:44:02.766Z',
            children: [
              {
                _id: '5fbcc790fd7dbe2cbb5c9a09',
                type: 'export',
                _exportId: '5e5df46617db9422ddba9f1a',
                _flowJobId: '5fbcc774186317194404c4e0',
                startedAt: '2020-11-24T08:42:56.842Z',
                endedAt: '2020-11-24T08:43:02.284Z',
                lastExecutedAt: '2020-11-24T08:43:02.284Z',
                status: 'completed',
                numError: 0,
                numResolved: 0,
                numSuccess: 481,
                numIgnore: 0,
                numPagesGenerated: 25,
                oIndex: 0,
                createdAt: '2020-11-24T08:42:56.842Z',
                lastModified: '2020-11-24T08:43:02.332Z',
              },
              {
                _id: '5fbcc796fd7dbe2cbb5c9a0b',
                type: 'import',
                _importId: '5e5df4ad17db9422ddba9f46',
                _flowJobId: '5fbcc774186317194404c4e0',
                startedAt: '2020-11-24T08:43:02.020Z',
                endedAt: '2020-11-24T08:44:02.760Z',
                lastExecutedAt: '2020-11-24T08:44:02.760Z',
                status: 'running',
                numError: 477,
                numResolved: 0,
                numSuccess: 4,
                numIgnore: 0,
                numPagesProcessed: 25,
                oIndex: 1,
                retriable: false,
                createdAt: '2020-11-24T08:43:02.020Z',
                lastModified: '2020-11-24T08:44:02.760Z',
                errorFile: {
                  id: 'ab0ff7be4f354de6a0ff0f739387971e',
                  host: 's3',
                },
              },
            ],
          },
        })
      );

      expect(selectors.getInProgressLatestJobs(newState, 'flowId')).toEqual([]);
      expect(selectors.getInProgressLatestJobs(newState, 'flowId', true)).toEqual(expectedData);
    });
  });
});
