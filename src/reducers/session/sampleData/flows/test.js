/* global describe, test, expect */
import reducer, { selectors } from '.';
import actions from '../../../../actions';

const DEFAULT_STATE = {};

const dummyFlow = {
  pageGenerators: [{ _exportId: '123'}],
  pageProcessors: [{ _importId: '222'}],
  _id: 'flow-1234',
  refresh: false,
};

const dummyFlowId = 'flow-1234';

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

describe('Flow sample data reducer ', () => {
  test('should retain previous state if the action is invalid', () => {
    const prevState = {};
    const currState = reducer(prevState, { type: 'INVALID_ACTION'});

    expect(currState).toEqual(prevState);
  });

  test('should return default state if the state is undefined', () => {
    const prevState = undefined;
    const currState = reducer(prevState, { type: 'RANDOM_ACTION'});

    expect(currState).toEqual(DEFAULT_STATE);
  });

  describe('FLOW_DATA.INIT action', () => {
    test('should initialize flow state with default props if we pass an invalid flow', () => {
      const prevState = reducer(undefined, { type: 'RANDOM_ACTION'});
      const currState = reducer(prevState, actions.flowData.init());

      expect(currState).toEqual(prevState);
    });
    test('should initialize flow state with passed flow data', () => {
      const flow = { pageGenerators: [], pageProcessors: [], _id: '1234' };
      const currState = reducer(undefined, actions.flowData.init(flow));

      expect(currState).toEqual({
        1234: {
          pageGenerators: flow.pageGenerators,
          pageProcessors: flow.pageProcessors,
          refresh: undefined,
          pageGeneratorsMap: {},
          pageProcessorsMap: {},
        },
      });
    });
    test('should initialize flow state with passed flow data including refresh prop', () => {
      const flow = {
        ...dummyFlow,
        refresh: true,
      };
      const currState = reducer(undefined, actions.flowData.init(flow));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: flow.pageGenerators,
          pageProcessors: flow.pageProcessors,
          refresh: true,
          pageGeneratorsMap: {},
          pageProcessorsMap: {},
        },
      });
    });
    test('should override the existing flow state if already state is initialized', () => {
      const prevFlow = {
        pageGenerators: [
          { _exportId: '123'},
          { _exportId: '456'},
        ],
        pageProcessors: [
          { _exportId: '789'},
          { _importId: '111'},
          { _importId: '222'},
        ],
        _id: '1234',
        refresh: false,
      };
      const currFlow = {
        pageGenerators: [
          { _exportId: '333'},
        ],
        pageProcessors: [
          { _exportId: '444' },
          { _importId: '555'},
        ],
        _id: '1234',
        refresh: true,
      };
      const prevState = reducer(undefined, actions.flowData.init(prevFlow));
      const currState = reducer(prevState, actions.flowData.init(currFlow));

      expect(currState).toEqual({
        1234: {
          pageGenerators: currFlow.pageGenerators,
          pageProcessors: currFlow.pageProcessors,
          refresh: true,
          pageGeneratorsMap: {},
          pageProcessorsMap: {},
        },
      });
    });
  });
  describe('FLOW_DATA.STAGE_REQUEST action', () => {
    test('should retain previous state in case of no flowId/resourceId/stage passed', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.requestStage());

      expect(currState).toEqual(prevState);
    });
    test('should not corrupt existing state if the flowId passed does not exist on the state', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.requestStage('flow-5678', 'exp-1111', 'raw'));

      expect(currState).toEqual(prevState);
    });
    test('should update stage as requested inside pageGeneratorsMap incase of the resource being PG ', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.requestStage(dummyFlowId, '123', 'raw'));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          refresh: false,
          pageGeneratorsMap: {
            123: {
              raw: {
                status: 'requested',
              },
            },
          },
          pageProcessorsMap: {},
        },
      });
    });
    test('should update stage as request inside pageProcessorsMap incase of the resource being PP ', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.requestStage(dummyFlowId, '222', 'raw'));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          refresh: false,
          pageGeneratorsMap: {},
          pageProcessorsMap: {
            222: {
              raw: {
                status: 'requested',
              },
            },
          },
        },
      });
    });
  });
  describe('FLOW_DATA.PREVIEW_DATA_RECEIVED action', () => {
    test('should retain previous state in case of no previewType passed', () => {
      const prevState = {
        [dummyFlowId]: {
          pageGenerators: [{ _exportId: 123 }],
          pageProcessors: [{ _importId: 222 }],
          refresh: false,
          pageGeneratorsMap: {
            123: {
              raw: {
                status: 'requested',
              },
            },
          },
          pageProcessorsMap: {},
        },
      };
      const currState = reducer(prevState, actions.flowData.receivedPreviewData(dummyFlowId, '123'));

      expect(currState).toEqual(prevState);
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
      const prevState = {
        [dummyFlowId]: {
          pageGenerators: [{ _exportId: 123 }],
          pageProcessors: [{ _importId: 222 }],
          refresh: false,
          pageGeneratorsMap: {
            123: {
              raw: {
                status: 'requested',
              },
            },
          },
          pageProcessorsMap: {},
        },
      };
      const currState = reducer(prevState, actions.flowData.receivedPreviewData('flow-5678', '123', 'raw'));

      expect(currState).toEqual(prevState);
    });
    test('should update raw stage as received with preview data when passed as previewType ', () => {
      const prevState = {
        [dummyFlowId]: {
          pageGenerators: [{ _exportId: '123' }],
          pageProcessors: [{ _importId: '222' }],
          pageGeneratorsMap: {
            123: {
              raw: {
                status: 'requested',
              },
            },
          },
          pageProcessorsMap: {},
        },
      };
      const previewData = {
        data: {
          users: [],
        },
      };
      const currState = reducer(prevState, actions.flowData.receivedPreviewData(dummyFlowId, '123', previewData, 'raw'));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: [{ _exportId: '123' }],
          pageProcessors: [{ _importId: '222' }],
          pageGeneratorsMap: {
            123: {
              raw: {
                status: 'received',
                data: previewData,
              },
            },
          },
          pageProcessorsMap: {},
        },
      });
    });
    test('should update raw stage as received for pp with preview data when passed as previewType ', () => {
      const prevState = {
        [dummyFlowId]: {
          pageGenerators: [{ _exportId: '123' }],
          pageProcessors: [{ _importId: '222' }],
          pageGeneratorsMap: {},
          pageProcessorsMap: {},
        },
      };
      const previewData = {
        data: {
          users: [],
        },
      };
      const currState = reducer(prevState, actions.flowData.receivedPreviewData(dummyFlowId, '222', previewData, 'flowInput'));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: [{ _exportId: '123' }],
          pageProcessors: [{ _importId: '222' }],
          pageGeneratorsMap: {},
          pageProcessorsMap: {
            222: {
              flowInput: {
                status: 'received',
                data: previewData,
              },
            },
          },
        },
      });
    });
  });
  describe('FLOW_DATA.PROCESSOR_DATA_REQUEST action', () => {
    test('should retain previous state in case of no processor passed', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.requestProcessorData(dummyFlowId, '123'));

      expect(currState).toEqual(prevState);
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow state', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const currState = reducer(prevState, actions.flowData.requestProcessorData('flow-5678', '123', processor));

      expect(currState).toEqual(prevState);
    });
    test('should update stage as request inside pageGeneratorsMap incase of the resource being PG ', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const currState = reducer(prevState, actions.flowData.requestProcessorData(dummyFlowId, '123', 'exports', processor));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {
            123: {
              transform: {
                status: 'requested',
              },
            },
          },
          refresh: false,
          pageProcessorsMap: {},
        },
      });
    });
    test('should update stage as request inside pageProcessorsMap incase of the resource being PP ', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const currState = reducer(prevState, actions.flowData.requestProcessorData(dummyFlowId, '222', 'imports', processor));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {},
          refresh: false,
          pageProcessorsMap: {
            222: {
              transform: {
                status: 'requested',
              },
            },
          },
        },
      });
    });
  });
  describe('FLOW_DATA.PROCESSOR_DATA_RECEIVED action', () => {
    test('should retain previous state in case of no processor passed', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.receivedProcessorData(dummyFlowId, '222'));

      expect(currState).toBe(prevState);
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.receivedProcessorData('flow-5678', '222'));

      expect(currState).toBe(prevState);
    });
    test('should update processor stage as received with processor data inside pageProcessorsMap incase of the resource being PP ', () => {
      const initState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const processorData = { data: [{ test: 5 }]};
      const prevState = reducer(initState, actions.flowData.requestProcessorData(dummyFlowId, '222', 'imports', processor));
      const currState = reducer(prevState, actions.flowData.receivedProcessorData(dummyFlowId, '222', processor, processorData));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {},
          refresh: false,
          pageProcessorsMap: {
            222: {
              transform: {
                status: 'received',
                data: { test: 5 },
              },
            },
          },
        },
      });
    });
    test('should update stage as received with processor data inside pageGeneratorsMap incase of the resource being PG ', () => {
      const initState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const processorData = { data: [{ test: 5 }]};
      const prevState = reducer(initState, actions.flowData.requestProcessorData(dummyFlowId, '123', 'exports', processor));
      const currState = reducer(prevState, actions.flowData.receivedProcessorData(dummyFlowId, '123', processor, processorData));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          refresh: false,
          pageProcessorsMap: {},
          pageGeneratorsMap: {
            123: {
              transform: {
                status: 'received',
                data: { test: 5 },
              },
            },
          },
        },
      });
    });
    test('should update processor stage as received with processor data in nested data incase of hooks  ', () => {
      const initState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const processorData = { data: { data: [{ nestedTest: 5 }] }};
      const prevState = reducer(initState, actions.flowData.requestProcessorData(dummyFlowId, '222', 'imports', processor));
      const currState = reducer(prevState, actions.flowData.receivedProcessorData(dummyFlowId, '222', processor, processorData));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {},
          refresh: false,
          pageProcessorsMap: {
            222: {
              transform: {
                status: 'received',
                data: { nestedTest: 5 },
              },
            },
          },
        },
      });
    });
    test('should update processor stage as received with processor data empty incase of undefined data  ', () => {
      const initState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const processorData = undefined;
      const prevState = reducer(initState, actions.flowData.requestProcessorData(dummyFlowId, '222', 'imports', processor));
      const currState = reducer(prevState, actions.flowData.receivedProcessorData(dummyFlowId, '222', processor, processorData));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {},
          refresh: false,
          pageProcessorsMap: {
            222: {
              transform: {
                status: 'received',
                data: undefined,
              },
            },
          },
        },
      });
    });
    test('should update processor stage as received with processor data even if the request processor data action is not triggered ', () => {
      const initState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const processorData = {data: [{ userId: '123'}]};
      const currState = reducer(initState, actions.flowData.receivedProcessorData(dummyFlowId, '222', processor, processorData));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {},
          refresh: false,
          pageProcessorsMap: {
            222: {
              transform: {
                status: 'received',
                data: { userId: '123' },
              },
            },
          },
        },
      });
    });
  });
  describe('FLOW_DATA.RECEIVED_ERROR action', () => {
    test('should retain previous state in case of no stage passed', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.receivedError(dummyFlowId, '222'));

      expect(currState).toBe(prevState);
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.receivedError('flow-5678', '222'));

      expect(currState).toBe(prevState);
    });
    test('should update processor stage as error with passed error inside pageProcessorsMap as error with passed error incase of the resource being pp', () => {
      const initState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const error = { error: [{ message: ' Cannot transform the data '}] };
      const prevState = reducer(initState, actions.flowData.requestProcessorData(dummyFlowId, '222', 'imports', processor));
      const currState = reducer(prevState, actions.flowData.receivedError(dummyFlowId, '222', processor, error));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {},
          refresh: false,
          pageProcessorsMap: {
            222: {
              transform: {
                status: 'error',
                error,
              },
            },
          },
        },
      });
    });
    test('should update processor stage inside pageGeneratorsMap as error with passed error incase of the resource being pg', () => {
      const initState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const error = { error: [{ message: ' Cannot transform the data '}] };
      const prevState = reducer(initState, actions.flowData.requestProcessorData(dummyFlowId, '123', 'exports', processor));
      const currState = reducer(prevState, actions.flowData.receivedError(dummyFlowId, '123', processor, error));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {
            123: {
              transform: {
                status: 'error',
                error,
              },
            },
          },
          refresh: false,
          pageProcessorsMap: {},
        },
      });
    });
    test('should update processor stage inside pageGeneratorsMap as error with passed error even if there is no existing sample data for the resource on the state', () => {
      const initState = reducer(undefined, actions.flowData.init(dummyFlow));
      const processor = 'transform';
      const error = { error: [{ message: ' Cannot transform the data '}] };
      const currState = reducer(initState, actions.flowData.receivedError(dummyFlowId, '123', processor, error));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: dummyFlow.pageProcessors,
          pageGeneratorsMap: {
            123: {
              transform: {
                status: 'error',
                error,
              },
            },
          },
          refresh: false,
          pageProcessorsMap: {},
        },
      });
    });
  });
  describe('FLOW_DATA.FLOW_RESPONSE_MAPPING_UPDATE action', () => {
    test('should retain previous state in case of no flowId/resourceIndex/responseMapping passed', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.updateResponseMapping(dummyFlowId));

      expect(currState).toBe(prevState);
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.updateResponseMapping('flow-5678', 0, {}));

      expect(currState).toBe(prevState);
    });
    test('should not corrupt existing flow state if the passed resourceIndex is invalid', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.updateResponseMapping(dummyFlowId, -1, {
        lists: [],
      }));

      expect(currState).toBe(prevState);
    });
    test('should update resource at resourceIndex on pageProcessors with new responseMapping passed', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const dummyResponseMapping = {
        lists: [],
      };
      const currState = reducer(prevState, actions.flowData.updateResponseMapping(dummyFlowId, 0, dummyResponseMapping));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: dummyFlow.pageGenerators,
          pageProcessors: [{
            _importId: '222',
            responseMapping: dummyResponseMapping,
          }],
          pageGeneratorsMap: {},
          refresh: false,
          pageProcessorsMap: {},
        },
      });
    });
  });
  describe('FLOW_DATA.RESET_STAGES action', () => {
    test('should retain previous state in case of no flowId/resourceId passed', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.resetStages());

      expect(currState).toBe(prevState);
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.resetStages('flow-5678', '123'));

      expect(currState).toBe(prevState);
    });
    test('should retain previous state if the passed resourceId is not part of flow state ', () => {
      const currState = reducer(dummyFlowStateWithStages, actions.flowData.resetStages(dummyFlowId, '1234'));

      expect(currState).toEqual(dummyFlowStateWithStages);
    });
    test('should clear all stages for all resources from the passed resourceId if no stages are passed ', () => {
      const currState = reducer(dummyFlowStateWithStages, actions.flowData.resetStages(dummyFlowId, '456'));

      expect(currState).toEqual({
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
    test('should clear all pps following passed resourceId if it is a PP', () => {
      const currState = reducer(dummyFlowStateWithStages, actions.flowData.resetStages(dummyFlowId, '111'));

      expect(currState).toEqual({
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
    test('should clear all pgs following passed resourceId and also all pps if the resource is a PG', () => {
      const currState = reducer(dummyFlowStateWithStages, actions.flowData.resetStages(dummyFlowId, '456'));

      expect(currState).toEqual({
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
    test('should clear all resources followed by the passed resourceId and clear only passed stages for the passed resourceId', () => {
      const currState = reducer(dummyFlowStateWithStages, actions.flowData.resetStages(dummyFlowId, '456', ['transform', 'preSavePage']));

      expect(currState).toEqual({
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
          pageProcessorsMap: {},
        },
      });
    });
    test('should clear all resources followed by the passed resourceId and update status only for passed stages for the passed resourceId with stageToUpdate', () => {
      const statusToUpdate = 'refresh';
      const stages = ['transform', 'preSavePage'];
      const currState = reducer(dummyFlowStateWithStages, actions.flowData.resetStages(dummyFlowId, '456', stages, statusToUpdate));

      expect(currState).toEqual({
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
                status: 'refresh',
                data: { tx: 15 },
              },
              preSavePage: {
                status: 'refresh',
                data: { preSave: 15 },
              },
            },
          },
          pageProcessorsMap: {},
        },
      });
    });
  });
  describe('FLOW_DATA.FLOW_SEQUENCE_RESET action', () => {
    test('should retain previous state in case of no flowId passed', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.resetFlowSequence());

      expect(currState).toBe(prevState);
    });
    test('should not corrupt existing state if the flowId passed does not exist on the flow data state', () => {
      const prevState = reducer(undefined, actions.flowData.init(dummyFlow));
      const currState = reducer(prevState, actions.flowData.resetFlowSequence('flow-5678', dummyFlow));

      expect(currState).toBe(prevState);
    });
    test('should clear all pps followed by first pp out of order in the passed updatedFlow ( when user drags/deletes one of the pps and changes order in the flow builder ) ', () => {
      const updatedFlow = {
        pageGenerators: [{ _exportId: '123'}, { _exportId: '456'}],
        pageProcessors: [{ _importId: '111' }, { _exportId: '789'}],
      };
      const currState = reducer(dummyFlowStateWithStages, actions.flowData.resetFlowSequence(dummyFlowId, updatedFlow));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: [{ _exportId: '123'}, { _exportId: '456'}],
          pageProcessors: [{ _importId: '111' }, { _exportId: '789'}],
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
            789: {},
            111: {},
          },
        },
      });
    });
    test('should clear all pgs followed by first pg out of order in the passed updatedFlow and also all pps are clear ( when user drags/deletes one of the pgs and changes order in the flow builder) ', () => {
      const updatedFlow = {
        pageGenerators: [{ _exportId: '456'}, { _exportId: '123'}],
        pageProcessors: [{ _exportId: '789'}, { _importId: '111' }],
      };
      const currState = reducer(dummyFlowStateWithStages, actions.flowData.resetFlowSequence(dummyFlowId, updatedFlow));

      expect(currState).toEqual({
        [dummyFlowId]: {
          pageGenerators: [{ _exportId: '456'}, { _exportId: '123'}],
          pageProcessors: [{ _exportId: '789'}, { _importId: '111' }],
          pageGeneratorsMap: {
            123: {},
            456: {},
          },
          pageProcessorsMap: {},
        },
      });
    });
  });
});

describe('getFlowDataState selector', () => {
  test('should return undefined when the state/flowId is invalid ', () => {
    expect(selectors.getFlowDataState()).toBeUndefined();
  });
  test('should return entire flow state if there is no resourceId passed', () => {
    expect(selectors.getFlowDataState(dummyFlowStateWithStages, dummyFlowId)).toBe(dummyFlowStateWithStages[dummyFlowId]);
  });
  test('should return resource related stages data in the state if the resourceId passed is PG', () => {
    expect(selectors.getFlowDataState(dummyFlowStateWithStages, dummyFlowId, '456')).toEqual({
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
    });
  });
  test('should return resource related stages data in the state if the resourceId passed is PP', () => {
    expect(selectors.getFlowDataState(dummyFlowStateWithStages, dummyFlowId, '789')).toEqual({
      raw: {
        status: 'received',
        data: { test: 35 },
      },
      transform: {
        status: 'received',
        data: { tx: 35 },
      },
    });
  });
});
describe('getSampleDataContext selector', () => {
  test('should return default value incase of no flowId', () => {
    expect(selectors.getSampleDataContext(dummyFlowStateWithStages, {})).toEqual({});
  });
  test('should return default value incase of invalid stage passed', () => {
    const options = {
      flowId: dummyFlowId,
      resourceId: '123',
      stage: 'INVALID_STAGE',
    };

    expect(selectors.getSampleDataContext(dummyFlowStateWithStages, options)).toEqual({});
  });
  test('should return default value if the passed resourceId does not exist ', () => {
    const options = {
      flowId: dummyFlowId,
      resourceId: '111',
      stage: 'raw',
    };

    expect(selectors.getSampleDataContext(dummyFlowStateWithStages, options)).toEqual({});
  });
  test('should return resource sub state for the passed resourceId and with matched stage data', () => {
    const options = {
      flowId: dummyFlowId,
      resourceId: '789',
      stage: 'raw',
    };
    const expectedRawData = {
      status: 'received',
      data: { test: 35 },
    };

    expect(selectors.getSampleDataContext(dummyFlowStateWithStages, options)).toEqual(expectedRawData);
  });
});
