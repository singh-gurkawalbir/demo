/* global describe test expect */
import { deepClone } from 'fast-json-patch';

import {
  getFirstOutOfOrderIndex,
  clearInvalidPgOrPpStates,
  clearInvalidStagesForPgOrPp,
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

const dummyFlowId = 'flow-1234';

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
