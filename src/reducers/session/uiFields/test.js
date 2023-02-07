
import reducer, { selectors, MAX_FLOW_RESOURCES, DEFAULT_STATE } from '.';
import actions from '../../../actions';

const flowId = 'flow-123';
const flow2Id = 'flow-456';

const constructMockResources = index => {
  const mockFlowResources = {
    imports: [{
      mockResponse: { test: `test${index}` },
      _id: `i${index}`,
    }],
    exports: [{
      mockOutput: { test: `test${index}` },
      _id: `e${index}`,
    }],
  };

  return mockFlowResources;
};

const mockFlowResources = {
  imports: [{
    mockResponse: { test: 'test3' },
    _id: 'i1',
  }, {
    mockResponse: { test: 'test4' },
    _id: 'i2',
  }],
  exports: [{
    mockOutput: { test: 'test1' },
    _id: 'e1',
  }, {
    mockOutput: { test: 'test2' },
    _id: 'e2',
  }],
};
const mockFlowResourcesWithSharedResources = {
  imports: [{
    mockResponse: { test: 'test3' },
    _id: 'i1',
  }, {
    mockResponse: { test: 'test5' },
    _id: 'i3',
  }],
  exports: [{
    mockOutput: { test: 'test1' },
    _id: 'e1',
  }, {
    mockOutput: { test: 'test6' },
    _id: 'e3',
  }],
};

describe('uiFields reducer test cases', () => {
  test('reducer should return previous state if action is not handled.', () => {
    const unknownAction = { type: 'unknown' };
    const newState = reducer(undefined, unknownAction);

    expect(newState).toEqual(DEFAULT_STATE);
  });
  describe('UI_FIELDS.FLOW_LEVEL.REQUEST action', () => {
    test('should create a sub state for the passed integration, if there is no existing sub state', () => {
      const newState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const expectedState = {
        ...DEFAULT_STATE,
        flows: [{
          id: flowId,
          status: 'requested',
        }],
      };

      expect(newState).toEqual(expectedState);
    });
    test('should update the status of the sub state to requested when the passed flowId is already loaded', () => {
      const reqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const recState = reducer(reqState, actions.uiFields.receivedFlowLevel(flowId, {}));
      const finalState = reducer(recState, actions.uiFields.requestFlowLevel(flowId));
      const expectedState = {
        ...DEFAULT_STATE,
        flows: [{
          id: flowId,
          status: 'requested',
        }],
      };

      expect(finalState).toEqual(expectedState);
    });
    test('should remove the oldest flow resources and push the new flow resources at the end when the number of resources exceed MAX_FLOW_RESOURCES', () => {
      let prevState = DEFAULT_STATE;

      for (let i = 0; i < MAX_FLOW_RESOURCES; i += 1) {
        const flowId = `flow-${i}`;

        prevState = reducer(prevState, actions.uiFields.requestFlowLevel(flowId));
        prevState = reducer(prevState, actions.uiFields.receivedFlowLevel(flowId, constructMockResources(i)));
      }
      const newFlowId = `flow-${MAX_FLOW_RESOURCES}`;
      const reqState = reducer(prevState, actions.uiFields.requestFlowLevel(newFlowId));

      expect(reqState.flows).toHaveLength(MAX_FLOW_RESOURCES);
      expect(reqState.flows[0].id).toBe('flow-1');
      expect(reqState.flows[MAX_FLOW_RESOURCES - 1].id).toEqual(newFlowId);
    });
  });
  describe('UI_FIELDS.FLOW_LEVEL.RECEIVED action', () => {
    test('should update the status of the sub state to received with the passed resources modified', () => {
      const prevState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const newState = reducer(prevState, actions.uiFields.receivedFlowLevel(flowId, mockFlowResources));
      const expectedState = {
        resourceMap: {
          e1: { mockOutput: { test: 'test1' } },
          e2: { mockOutput: { test: 'test2' } },
          i1: { mockResponse: { test: 'test3' } },
          i2: { mockResponse: { test: 'test4' } },
        },
        flows: [{
          id: flowId,
          status: 'received',
          resources: ['e1', 'e2', 'i1', 'i2'],
        }],
      };

      expect(newState).toEqual(expectedState);
    });
    test('should move the shared resources to resource map if the passed resource exists in the state against another flow', () => {
      const flow1ReqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const flow1RecState = reducer(flow1ReqState, actions.uiFields.receivedFlowLevel(flowId, mockFlowResources));
      const flow2ReqState = reducer(flow1RecState, actions.uiFields.requestFlowLevel(flow2Id));
      const finalState = reducer(flow2ReqState, actions.uiFields.receivedFlowLevel(flow2Id, mockFlowResourcesWithSharedResources));
      const expectedState = {
        resourceMap: {
          e1: { mockOutput: { test: 'test1' } },
          e2: { mockOutput: { test: 'test2' } },
          i1: { mockResponse: { test: 'test3' } },
          i2: { mockResponse: { test: 'test4' } },
          i3: { mockResponse: { test: 'test5' } },
          e3: { mockOutput: { test: 'test6' } },
        },
        flows: [{
          id: flowId,
          status: 'received',
          resources: ['e2', 'i2'],
        }, {
          id: flow2Id,
          status: 'received',
          resources: ['e3', 'i3'],
        }],
      };

      expect(finalState).toEqual(expectedState);
    });
    test('should remove the oldest flow resources and push the new flow resources at the end when the number of resources exceed MAX_FLOW_RESOURCES', () => {
      let prevState = DEFAULT_STATE;

      for (let i = 0; i < MAX_FLOW_RESOURCES; i += 1) {
        const flowId = `flow-${i}`;

        prevState = reducer(prevState, actions.uiFields.requestFlowLevel(flowId));
        prevState = reducer(prevState, actions.uiFields.receivedFlowLevel(flowId, constructMockResources(i)));
      }
      const newFlowId = `flow-${MAX_FLOW_RESOURCES}`;
      const reqState = reducer(prevState, actions.uiFields.receivedFlowLevel(newFlowId, {}));

      expect(reqState.flows).toHaveLength(MAX_FLOW_RESOURCES);
      expect(reqState.flows[0].id).toBe('flow-1');
      expect(reqState.flows[MAX_FLOW_RESOURCES - 1].id).toEqual(newFlowId);
    });
  });
  describe('UI_FIELDS.FLOW_LEVEL.UPDATE_RESOURCES action', () => {
    test('should do nothing if there is no flowId or resourceIds', () => {
      const state1 = reducer(DEFAULT_STATE, actions.uiFields.updateFlowResources());
      const state2 = reducer(DEFAULT_STATE, actions.uiFields.updateFlowResources('flowId'));

      expect(state1).toBe(DEFAULT_STATE);
      expect(state2).toBe(DEFAULT_STATE);
    });
    test('should update the resources of the flow', () => {
      const reqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const recState = reducer(reqState, actions.uiFields.receivedFlowLevel(flowId, mockFlowResources));

      expect(recState.flows[0].resources).toEqual(['e1', 'e2', 'i1', 'i2']);
      const newState = reducer(recState, actions.uiFields.updateFlowResources(flowId, ['e4', 'i4']));

      expect(newState.flows[0].resources).toEqual(['e4', 'i4']);
    });
  });
  describe('actionTypes.RESOURCE.RECEIVED action', () => {
    test('should do nothing if there is invalid resource or no resourceId or new resourceId', () => {
      const state1 = reducer(DEFAULT_STATE, actions.resource.received());
      const state2 = reducer(DEFAULT_STATE, actions.resource.received('exports', {}));
      const state3 = reducer(DEFAULT_STATE, actions.resource.received('exports', { _id: 'new-123' }));
      const state4 = reducer(DEFAULT_STATE, actions.resource.received('flows', { _id: '123' }));

      expect(state1).toBe(DEFAULT_STATE);
      expect(state2).toBe(DEFAULT_STATE);
      expect(state3).toBe(DEFAULT_STATE);
      expect(state4).toBe(DEFAULT_STATE);
    });
    test('should update the resourceMap with passed resource ui fields', () => {
      const reqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const recState = reducer(reqState, actions.uiFields.receivedFlowLevel(flowId, mockFlowResources));

      expect(recState.resourceMap.e1).toEqual({
        mockOutput: { test: 'test1' },
      });
      expect(recState.resourceMap.i1).toEqual({
        mockResponse: { test: 'test3' },
      });
      const _export = {
        _id: 'e1',
        mockOutput: {
          users: ['user1', 'user2'],
        },
      };
      const newState = reducer(recState, actions.resource.received('exports', _export));

      expect(newState.resourceMap.e1).toEqual({
        mockOutput: {
          users: ['user1', 'user2'],
        },
      });
      const _import = {
        _id: 'i1',
        mockResponse: {
          users: ['user3', 'user4'],
        },
      };
      const newState1 = reducer(recState, actions.resource.received('imports', _import));

      expect(newState1.resourceMap.i1).toEqual({
        mockResponse: {
          users: ['user3', 'user4'],
        },
      });
    });
  });
});

describe('uiFields selectors', () => {
  describe('flowResourceStatus selector', () => {
    test('should return undefined incase of invalid flow id', () => {
      expect(selectors.flowResourcesStatus({})).toBeUndefined();
      const sampleState = {
        flows: [{
          id: 'flow-1',
          status: 'received',
        }],
      };

      expect(selectors.flowResourcesStatus(sampleState, 'invalid-flow-id')).toBeUndefined();
    });
    test('should return the status of the flow resource', () => {
      const reqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));

      expect(selectors.flowResourcesStatus(reqState, flowId)).toBe('requested');
      const recState = reducer(reqState, actions.uiFields.receivedFlowLevel(flowId, {}));

      expect(selectors.flowResourcesStatus(recState, flowId)).toBe('received');
    });
  });
  describe('resourceUIFields selector', () => {
    test('should return undefined incase of invalid resourceId', () => {
      expect(selectors.resourceUIFields({})).toBeUndefined();
      const sampleState = {
        resourceMap: {
          i1: { mockResponse: { test: 'test3' } },
          i2: { mockResponse: { test: 'test4' } },
        },
      };

      expect(selectors.resourceUIFields(sampleState, 'invalid-resource-id')).toBeUndefined();
    });
    test('should return undefined incase the resourceId is not present in the state', () => {
      const reqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const recState = reducer(reqState, actions.uiFields.receivedFlowLevel(flowId, mockFlowResources));

      expect(selectors.resourceUIFields(recState, 'invalid-resource-id')).toBeUndefined();
    });
    test('should return the ui fields of the passed resourceId', () => {
      const reqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const recState = reducer(reqState, actions.uiFields.receivedFlowLevel(flowId, mockFlowResources));

      expect(selectors.resourceUIFields(recState, 'i1')).toEqual({ mockResponse: { test: 'test3' } });
      expect(selectors.resourceUIFields(recState, 'e1')).toEqual({ mockOutput: { test: 'test1' } });
    });
  });
  describe('hasLoadedAllResourceUIFields selector', () => {
    test('should return false incase of invalid resourceId', () => {
      expect(selectors.hasLoadedAllResourceUIFields({})).toBeFalsy();
      const sampleState = {
        resourceMap: {
          e1: { mockOutput: { test: 'test1' } },
        },
      };

      expect(selectors.hasLoadedAllResourceUIFields(sampleState)).toBeFalsy();
    });
    test('should return false incase the resourceId is not present in the state', () => {
      const reqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const recState = reducer(reqState, actions.uiFields.receivedFlowLevel(flowId, mockFlowResources));

      expect(selectors.hasLoadedAllResourceUIFields(recState)).toBeFalsy();
    });
    test('should return true if the ui fields of all the passed resourceIds are loaded', () => {
      const reqState = reducer(DEFAULT_STATE, actions.uiFields.requestFlowLevel(flowId));
      const recState = reducer(reqState, actions.uiFields.receivedFlowLevel(flowId, mockFlowResources));

      expect(selectors.hasLoadedAllResourceUIFields(recState, ['e1', 'e2', 'i1', 'i2'])).toBeTruthy();
    });
  });
});
