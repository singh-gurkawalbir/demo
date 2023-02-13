
import { deepClone } from 'fast-json-patch';

import {
  getFirstOutOfOrderIndex,
  clearInvalidPgOrPpStates,
  clearInvalidStagesForPgOrPp,
  clearInvalidStatesOnRouterUpdate,
} from '.';

const dummyFlowStateWithStages = {
  'flow-1234': {
    pageGenerators: [{ _exportId: '123'}, { _exportId: '456'}],
    pageProcessors: [{ _exportId: '789'}, { _importId: '111' }],
    pageGeneratorsMap: {
      123: {
        raw: {
          status: 'received',
          data: { test: 5 },
        },
        transform: {
          status: 'received',
          data: { tx: 5 },
        },
        preSavePage: {
          status: 'received',
          data: { preSave: 5 },
        },
      },
      456: {
        raw: {
          status: 'received',
          data: { test: 15 },
        },
        transform: {
          status: 'received',
          data: { tx: 15 },
        },
        preSavePage: {
          status: 'received',
          data: { preSave: 15 },
        },
      },
    },
    pageProcessorsMap: {
      789: {
        raw: {
          status: 'received',
          data: { test: 35 },
        },
        transform: {
          status: 'received',
          data: { tx: 35 },
        },
      },
      111: {
        flowInput: {
          status: 'received',
          data: { test1: 6 },
        },
        responseTransform: {
          status: 'received',
          data: { tx: 5 },
        },
        preMap: {
          status: 'received',
          data: { preSave: 5 },
        },
      },
    },
  },
};

const dummyFlowStateWithRouters = {
  'flow-5678': {
    pageGeneratorsMap: {
      123: {
        raw: {
          status: 'received',
          data: { test: 5 },
        },
        transform: {
          status: 'received',
          data: { tx: 5 },
        },
        preSavePage: {
          status: 'received',
          data: { preSave: 5 },
        },
      },
    },
    pageProcessorsMap: {
      111: {
        flowInput: {
          status: 'received',
          data: { test1: 6 },
        },
        responseTransform: {
          status: 'received',
          data: { tx: 5 },
        },
        preMap: {
          status: 'received',
          data: { preSave: 5 },
        },
      },
    },
    routersMap: {
      'router-1': {
        router: {
          status: 'error',
          error: '{"error":"InvalidEndpoint","description":"Not found"}',
        },
      },
    },
    pageGenerators: [{ _exportId: '123' }],
    pageProcessors: [],
    routers: [
      {
        id: 'router-1',
        routeRecordsTo: 'first_matching_branch',
        branches: [
          {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                type: 'import',
                _importId: '111',
              },
            ],
          },
          { name: 'Branch 1.1', pageProcessors: [{ setupInProgress: true }] },
        ],
      },
    ],
  },
};

const dummyFlowId = 'flow-1234';
const branchedFlowId = 'flow-5678';

describe('getFirstOutOfOrderIndex util', () => {
  test('should return -1 incase of empty lists passed', () => {
    expect(getFirstOutOfOrderIndex([], [])).toBe(-1);
    const currentList = [
      { _exportId: '123' },
      { _exportId: '456' },
      { _exportId: '789' },
    ];

    expect(getFirstOutOfOrderIndex(currentList, [])).toBe(-1);
  });
  test('should return the index of the first item that mismatches', () => {
    const currentList = [
      { _exportId: '123' },
      { _importId: '456' },
      { _exportId: '789' },
    ];
    const updatedListWithSwappingItems = [
      { _exportId: '123' },
      { _exportId: '789' },
      { _importId: '456' },
    ];

    expect(getFirstOutOfOrderIndex(currentList, updatedListWithSwappingItems)).toBe(1);

    const updatedListWithNewItem = [
      { _exportId: '123' },
      { _importId: '456' },
      { _importId: '789' },
      { _importId: '111' },
    ];

    expect(getFirstOutOfOrderIndex(currentList, updatedListWithNewItem)).toBe(3);
  });
});
describe('clearInvalidFlowState util', () => {
  test('should return undefined if the flow is undefined', () => {
    expect(clearInvalidPgOrPpStates(undefined, 1, true)).toBeUndefined();
  });
  test('should update the passed flow object by removing sample data states for the pp resources from the passed index', () => {
    const flowState = deepClone(dummyFlowStateWithStages);

    clearInvalidPgOrPpStates(flowState[dummyFlowId], 1);
    expect(flowState).toEqual({
      [dummyFlowId]: {
        pageGenerators: [{ _exportId: '123'}, { _exportId: '456'}],
        pageProcessors: [{ _exportId: '789'}, { _importId: '111' }],
        pageGeneratorsMap: {
          123: {
            raw: {
              status: 'received',
              data: { test: 5 },
            },
            transform: {
              status: 'received',
              data: { tx: 5 },
            },
            preSavePage: {
              status: 'received',
              data: { preSave: 5 },
            },
          },
          456: {
            raw: {
              status: 'received',
              data: { test: 15 },
            },
            transform: {
              status: 'received',
              data: { tx: 15 },
            },
            preSavePage: {
              status: 'received',
              data: { preSave: 15 },
            },
          },
        },
        pageProcessorsMap: {
          789: {
            raw: {
              status: 'received',
              data: { test: 35 },
            },
            transform: {
              status: 'received',
              data: { tx: 35 },
            },
          },
          111: {},
        },
      },
    });
  });
  test('should update the passed flow object by removing sample data states for the pg and pp resources from the passed index', () => {
    const flowState = deepClone(dummyFlowStateWithStages);

    clearInvalidPgOrPpStates(flowState[dummyFlowId], 1, true);
    expect(flowState).toEqual({
      [dummyFlowId]: {
        pageGenerators: [{ _exportId: '123'}, { _exportId: '456'}],
        pageProcessors: [{ _exportId: '789'}, { _importId: '111' }],
        pageGeneratorsMap: {
          123: {
            raw: {
              status: 'received',
              data: { test: 5 },
            },
            transform: {
              status: 'received',
              data: { tx: 5 },
            },
            preSavePage: {
              status: 'received',
              data: { preSave: 5 },
            },
          },
          456: {},
        },
        pageProcessorsMap: {},
        routersMap: {},
      },
    });
  });
});
describe('clearInvalidStagesForPgOrPp util', () => {
  test('should return undefined if the flow is undefined', () => {
    expect(clearInvalidPgOrPpStates()).toBeUndefined();
  });
  test('should retain previous flowState if there are no stages passed', () => {
    const flowState = deepClone(dummyFlowStateWithStages);

    clearInvalidStagesForPgOrPp(flowState[dummyFlowId], 1, []);
    expect(flowState).toEqual(dummyFlowStateWithStages);
  });
  test('should update pg at passed resourceIndex for all the stages list passed to empty', () => {
    const flowState = deepClone(dummyFlowStateWithStages);
    const stages = ['transform', 'preSavePage'];

    clearInvalidStagesForPgOrPp(flowState[dummyFlowId], 1, stages, undefined, true);
    expect(flowState).toEqual({
      [dummyFlowId]: {
        pageGenerators: [{ _exportId: '123'}, { _exportId: '456'}],
        pageProcessors: [{ _exportId: '789'}, { _importId: '111' }],
        pageGeneratorsMap: {
          123: {
            raw: {
              status: 'received',
              data: { test: 5 },
            },
            transform: {
              status: 'received',
              data: { tx: 5 },
            },
            preSavePage: {
              status: 'received',
              data: { preSave: 5 },
            },
          },
          456: {
            raw: {
              status: 'received',
              data: { test: 15 },
            },
            transform: {},
            preSavePage: {},
          },
        },
        pageProcessorsMap: {
          789: {
            raw: {
              status: 'received',
              data: { test: 35 },
            },
            transform: {
              status: 'received',
              data: { tx: 35 },
            },
          },
          111: {
            flowInput: {
              status: 'received',
              data: { test1: 6 },
            },
            responseTransform: {
              status: 'received',
              data: { tx: 5 },
            },
            preMap: {
              status: 'received',
              data: { preSave: 5 },
            },
          },
        },
      },
    });
  });
  test('should update pp at passed resourceIndex for all the stages list passed to empty', () => {
    const flowState = deepClone(dummyFlowStateWithStages);
    const stages = ['responseTransform', 'preMap'];

    clearInvalidStagesForPgOrPp(flowState[dummyFlowId], 1, stages, undefined);
    expect(flowState).toEqual({
      [dummyFlowId]: {
        pageGenerators: [{ _exportId: '123'}, { _exportId: '456'}],
        pageProcessors: [{ _exportId: '789'}, { _importId: '111' }],
        pageGeneratorsMap: {
          123: {
            raw: {
              status: 'received',
              data: { test: 5 },
            },
            transform: {
              status: 'received',
              data: { tx: 5 },
            },
            preSavePage: {
              status: 'received',
              data: { preSave: 5 },
            },
          },
          456: {
            raw: {
              status: 'received',
              data: { test: 15 },
            },
            transform: {
              status: 'received',
              data: { tx: 15 },
            },
            preSavePage: {
              status: 'received',
              data: { preSave: 15 },
            },
          },
        },
        pageProcessorsMap: {
          789: {
            raw: {
              status: 'received',
              data: { test: 35 },
            },
            transform: {
              status: 'received',
              data: { tx: 35 },
            },
          },
          111: {
            flowInput: {
              status: 'received',
              data: { test1: 6 },
            },
            responseTransform: {},
            preMap: {},
          },
        },
      },
    });
  });
  test('should update pp at passed resourceIndex for all the stages list passed with its status as passed statusToUpdate', () => {
    const flowState = deepClone(dummyFlowStateWithStages);
    const stages = ['responseTransform', 'preMap'];
    const statusToUpdate = 'refresh';

    clearInvalidStagesForPgOrPp(flowState[dummyFlowId], 1, stages, statusToUpdate);
    expect(flowState).toEqual({
      [dummyFlowId]: {
        pageGenerators: [{ _exportId: '123'}, { _exportId: '456'}],
        pageProcessors: [{ _exportId: '789'}, { _importId: '111' }],
        pageGeneratorsMap: {
          123: {
            raw: {
              status: 'received',
              data: { test: 5 },
            },
            transform: {
              status: 'received',
              data: { tx: 5 },
            },
            preSavePage: {
              status: 'received',
              data: { preSave: 5 },
            },
          },
          456: {
            raw: {
              status: 'received',
              data: { test: 15 },
            },
            transform: {
              status: 'received',
              data: { tx: 15 },
            },
            preSavePage: {
              status: 'received',
              data: { preSave: 15 },
            },
          },
        },
        pageProcessorsMap: {
          789: {
            raw: {
              status: 'received',
              data: { test: 35 },
            },
            transform: {
              status: 'received',
              data: { tx: 35 },
            },
          },
          111: {
            flowInput: {
              status: 'received',
              data: { test1: 6 },
            },
            responseTransform: {
              status: statusToUpdate,
              data: { tx: 5 },
            },
            preMap: {
              status: statusToUpdate,
              data: { preSave: 5 },
            },
          },
        },
      },
    });
  });
});
describe('clearInvalidStatesOnRouterUpdate util', () => {
  test('should do nothing and return undefined if the flow is undefined', () => {
    expect(clearInvalidStatesOnRouterUpdate()).toBeUndefined();
  });
  test('should do nothing if the flow is empty', () => {
    const flow = {};

    clearInvalidStatesOnRouterUpdate(flow);
    expect(flow).toBe(flow);
  });
  test('should do nothing if the routeId is invalid', () => {
    const flow = deepClone(dummyFlowStateWithRouters);
    const routeId = 'invalid';

    clearInvalidStatesOnRouterUpdate(flow[branchedFlowId], routeId);
    expect(flow).toEqual(dummyFlowStateWithRouters);
  });
  test('should do nothing if the flow is a linear flow', () => {
    const flow = deepClone(dummyFlowStateWithStages);
    const routeId = '123';

    clearInvalidStatesOnRouterUpdate(flow[dummyFlowId], routeId);
    expect(flow).toBe(flow);
  });
  test('should update the pps of the passed router to empty if the routeId is valid', () => {
    const flow = deepClone(dummyFlowStateWithRouters);

    clearInvalidStatesOnRouterUpdate(flow[branchedFlowId], 'router-1');

    const expectedState = {
      ...flow[branchedFlowId],
      pageProcessorsMap: {
        111: {},
      },
    };

    expect(flow[branchedFlowId]).toEqual(expectedState);
  });
  test('should update pps of router and all subsequent routers and their pps', () => {
    const nestedRouterFlow = {
      'flow-5678': {
        pageGeneratorsMap: {
          e1: {
            raw: {
              status: 'received',
              data: { id: '123456' },
            },
          },
        },
        pageProcessorsMap: {
          e2: {
            processedFlowInput: {
              status: 'received',
              data: { id: '123456' },
            },
            flowInput: {
              status: 'received',
              data: { id: '123456' },
            },
          },
          i1: {
            processedFlowInput: {
              status: 'received',
              data: { id: '123456' },
            },
            flowInput: {
              status: 'received',
              data: { id: '123456' },
            },
          },
          i2: {
            processedFlowInput: {
              status: 'error',
              error: 'error',
            },
            flowInput: {
              status: 'error',
              error: 'error',
            },
          },
        },
        routersMap: {
          r1: {
            router: {
              status: 'received',
              data: { id: '123456' },
            },
          },
          r2: {
            router: {
              status: 'received',
              data: { id: '123456' },
            },
          },
        },
        pageGenerators: [
          {
            _exportId: 'e1',
            skipRetries: false,
          },
        ],
        routers: [
          {
            id: 'r1',
            branches: [
              {
                name: 'Branch 2.0',
                pageProcessors: [
                  {
                    type: 'export',
                    _exportId: 'e2',
                  },
                ],
                nextRouterId: 'r2',
              },
              {
                name: 'Branch 2.1',
                pageProcessors: [
                  {
                    setupInProgress: true,
                  },
                ],
              },
            ],
          },
          {
            id: 'r2',
            branches: [
              {
                name: 'Branch 2.0',
                pageProcessors: [
                  {
                    type: 'import',
                    _importId: 'i1',
                  },
                ],
              },
              {
                name: 'Branch 2.1',
                pageProcessors: [
                  {
                    type: 'import',
                    _importId: 'i2',
                  },
                ],
              },
            ],
          },
        ],
      },
    };

    clearInvalidStatesOnRouterUpdate(nestedRouterFlow[branchedFlowId], 'r1');

    const expectedState = {
      ...nestedRouterFlow[branchedFlowId],
      pageProcessorsMap: {
        e2: {},
        i1: {},
        i2: {},
      },
      routersMap: {
        r1: {
          router: {
            status: 'received',
            data: { id: '123456' },
          },
        },
        r2: {},
      },
    };

    expect(nestedRouterFlow[branchedFlowId]).toEqual(expectedState);
  });
});
