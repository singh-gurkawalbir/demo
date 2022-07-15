/* global describe, test, expect */
import { keyBy } from 'lodash';
import reducer, {selectors} from '.';
import actions from '../../../actions';
import { generateReactFlowGraph } from '../../../utils/flows/flowbuilder';

const state1 = {
  flow1: {
    flow: {
      pageGenerators: [],
      routers: [{
        id: 'firstRouter',
        branches: [{
          name: 'branch1',
          nextRouterId: 'secondRouter',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }, {
          name: 'branch2',
          nextRouterId: 'thirdRouter',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }, {
          name: 'branch3',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }],
      }, {
        id: 'secondRouter',
        branches: [{
          name: 'branch1',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
          nextRouterId: 'fourthRouter',
        }, {
          name: 'branch2',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }, {
          name: 'branch3',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }],
      }, {
        id: 'thirdRouter',
        branches: [{
          name: 'branch1',
          nextRouterId: 'fourthRouter',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }, {
          name: 'branch2',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }, {
          name: 'branch3',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }],
      }, {
        id: 'fourthRouter',
        branches: [{
          name: 'branch1',
          pageProcessors: [{_exportId: 'afdsf'}, {setupInProgress: true}, {_importId: '4324'}],
        }],
      }],
    },
  },
};

describe('Reducers test cases', () => {
  describe('INIT_FLOW_GRAPH action', () => {
    test('should return correct state if flow is absent', () => {
      const state = reducer({}, actions.flow.initializeFlowGraph('123'));

      return expect(state).toEqual({
        123: {
          elements: undefined,
          elementsMap: {},
          flow: undefined,
          isViewMode: undefined,
        },
      });
    });
    test('should return correct state if flow is present', () => {
      const flow = {
        _id: '62ce88288776da07ca347ab5',
        name: 'New flow',
        _integrationId: '62625e535d4b474793b6c511',
        pageProcessors: [
          {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: '62ce88258776da07ca347ab2',
          },
        ],
        pageGenerators: [
          {
            _exportId: '62ceb95c8776da07ca348619',
            skipRetries: false,
          },
        ],
        autoResolveMatchingTraceKeys: true,
      };
      const state = reducer({}, actions.flow.initializeFlowGraph('62ce88288776da07ca347ab5', flow));

      console.log({flowg: generateReactFlowGraph(flow)});
      const elements = generateReactFlowGraph(flow);

      return expect(state).toEqual({
        '62ce88288776da07ca347ab5': {
          elements,
          elementsMap: keyBy(elements),
          flow,
          isViewMode: undefined,
        },
      });
    });
  });
  const initializedState = reducer(undefined, actions.flow.initializeFlowGraph('123'));

  describe('DRAG_START action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer({}, actions.flow.dragStart());

      return expect(state).toEqual({});
    });
    test('should return correct state for given flow and stepId', () => {
      const state = reducer(initializedState, actions.flow.dragStart('123', '123'));

      return expect(state).toEqual({
        123: {
          dragStepIdInProgress: '123',
          elements: undefined,
          elementsMap: {},
          flow: undefined,
          isViewMode: undefined,
        },
      });
    });
  });
  describe('SET_DRAG_IN_PROGRESS action', () => {
    test('should return correct state for given flow', () => {
      const state1 = reducer(initializedState, actions.flow.dragStart('123', '123'));
      const state = reducer(state1, actions.flow.setDragInProgress('123'));

      return expect(state).toEqual({
        123: {
          dragStepId: '123',
          elements: undefined,
          elementsMap: {},
          flow: undefined,
          isViewMode: undefined,
        }});
    });
  });
  describe('SET_SAVE_STATUS action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer({}, actions.flow.setSaveStatus());

      return expect(state).toEqual({});
    });
    test('should set the correct status on flow which is not initialized', () => {
      const state = reducer({}, actions.flow.setSaveStatus('123', 'failed'));

      return expect(state).toEqual({
        123: {status: 'failed'},
      });
    });
    test('should set the correct status on flow which is initialized', () => {
      const state = reducer(initializedState, actions.flow.setSaveStatus('123', 'failed'));

      return expect(state).toEqual({
        123: {
          status: 'failed',
          elements: undefined,
          elementsMap: {},
          flow: undefined,
          isViewMode: undefined,
        },
      });
    });
  });
  describe('DRAG_END action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer(undefined, actions.flow.dragEnd());

      return expect(state).toEqual({});
    });
    test('should return correct state for given flow which has in progress drag', () => {
      const state1 = reducer(initializedState, actions.flow.dragStart('123', '123'));
      const state2 = reducer(state1, actions.flow.setDragInProgress('123'));
      const state = reducer(state2, actions.flow.dragEnd('123'));

      return expect(state).toEqual({
        123: {
          elements: undefined,
          elementsMap: {},
          flow: undefined,
          isViewMode: undefined,
        },
      });
    });
  });
  describe('MERGE_TARGET_SET action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer({}, actions.flow.mergeTargetSet());

      return expect(state).toEqual({});
    });
    test('should return correct state for given flow, targetId and targetType', () => {
      const state = reducer(initializedState, actions.flow.mergeTargetSet('123', 'branch', '123'));

      return expect(state).toEqual({
        123: {
          elements: undefined,
          elementsMap: {},
          flow: undefined,
          isViewMode: undefined,
          mergeTargetId: '123',
          mergeTargetType: 'branch',
        },
      });
    });
  });
  describe('MERGE_TARGET_CLEAR action', () => {
    test('should not throw exception for invalid arguments', () => {
      const state = reducer({}, actions.flow.mergeTargetClear());

      return expect(state).toEqual({});
    });
    test('should delete mergeTarget values from the flow state', () => {
      const state1 = reducer(initializedState, actions.flow.mergeTargetSet('123', 'branch', '123'));
      const state = reducer(state1, actions.flow.mergeTargetClear('123'));

      return expect(state).toEqual({
        123: {
          elements: undefined,
          elementsMap: {},
          flow: undefined,
          isViewMode: undefined,
        },
      });
    });
  });
});

describe('Selectors test cases', () => {
  describe('fbGraphElements test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.fbGraphElements()).toEqual([]);
      expect(selectors.fbGraphElements({})).toEqual([]);
      expect(selectors.fbGraphElements({}, '123')).toEqual([]);
      expect(selectors.fbGraphElements('123')).toEqual([]);
      expect(selectors.fbGraphElements({}, '')).toEqual([]);
    });
    test('should return flow elements for given flowId', () => {
      const state = {
        123: {elements: ['123']},
      };

      expect(selectors.fbGraphElements(state, '123')).toEqual(['123']);
    });
  });
  describe('fbGraphElementsMap test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.fbGraphElementsMap()).toEqual({});
      expect(selectors.fbGraphElementsMap({})).toEqual({});
      expect(selectors.fbGraphElementsMap({}, '123')).toEqual({});
      expect(selectors.fbGraphElementsMap('123')).toEqual({});
      expect(selectors.fbGraphElementsMap({}, '')).toEqual({});
    });
    test('should return flow elements map for given flowId', () => {
      const elementsMap = {123: ['123']};
      const state = {
        123: {elementsMap},
      };

      expect(selectors.fbGraphElementsMap(state, '123')).toEqual(elementsMap);
    });
  });
  describe('fbFlow test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.fbFlow()).toBeUndefined();
      expect(selectors.fbFlow({})).toBeUndefined();
      expect(selectors.fbFlow({}, '123')).toBeUndefined();
      expect(selectors.fbFlow('123')).toBeUndefined();
      expect(selectors.fbFlow({}, '')).toBeUndefined();
    });
    test('should return the flow for given flowId', () => {
      const flow = {pageProcessors: [], pageGenerators: []};
      const state = {
        123: {flow},
      };

      expect(selectors.fbFlow(state, '123')).toEqual(flow);
    });
  });
  describe('fbDragStepId test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.fbDragStepId()).toBeUndefined();
      expect(selectors.fbDragStepId({})).toBeUndefined();
      expect(selectors.fbDragStepId({}, '123')).toBeUndefined();
      expect(selectors.fbDragStepId('123')).toBeUndefined();
      expect(selectors.fbDragStepId({}, '')).toBeUndefined();
    });
    test('should return drag step Id for given flowId', () => {
      const dragStepId = '123';
      const state = {
        123: {dragStepId},
      };

      expect(selectors.fbDragStepId(state, '123')).toEqual(dragStepId);
    });
  });
  describe('fbMergeTargetType test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.fbMergeTargetType()).toBeUndefined();
      expect(selectors.fbMergeTargetType({})).toBeUndefined();
      expect(selectors.fbMergeTargetType({}, '123')).toBeUndefined();
      expect(selectors.fbMergeTargetType('123')).toBeUndefined();
      expect(selectors.fbMergeTargetType({}, '')).toBeUndefined();
    });
    test('should return merge target type for given flowId', () => {
      const mergeTargetType = 'branch';
      const state = {
        123: {mergeTargetType},
      };

      expect(selectors.fbMergeTargetType(state, '123')).toEqual(mergeTargetType);
    });
  });
  describe('fbMergeTargetId test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.fbMergeTargetId()).toBeUndefined();
      expect(selectors.fbMergeTargetId({})).toBeUndefined();
      expect(selectors.fbMergeTargetId({}, '123')).toBeUndefined();
      expect(selectors.fbMergeTargetId('123')).toBeUndefined();
      expect(selectors.fbMergeTargetId({}, '')).toBeUndefined();
    });
    test('should return flow elements for given flowId', () => {
      const mergeTargetId = '123';
      const state = {
        123: {mergeTargetId},
      };

      expect(selectors.fbMergeTargetId(state, '123')).toEqual(mergeTargetId);
    });
  });
  describe('fbDragStepIdInProgress test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.fbDragStepIdInProgress()).toBeUndefined();
      expect(selectors.fbDragStepIdInProgress({})).toBeUndefined();
      expect(selectors.fbDragStepIdInProgress({}, '123')).toBeUndefined();
      expect(selectors.fbDragStepIdInProgress('123')).toBeUndefined();
      expect(selectors.fbDragStepIdInProgress({}, '')).toBeUndefined();
    });
    test('should return "drag step id in progress" for given flowId', () => {
      const dragStepIdInProgress = true;
      const state = {
        123: {dragStepIdInProgress},
      };

      expect(selectors.fbDragStepIdInProgress(state, '123')).toEqual(dragStepIdInProgress);
    });
  });
  describe('isFlowSaveInProgress test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.isFlowSaveInProgress()).toBeFalsy();
      expect(selectors.isFlowSaveInProgress({})).toBeFalsy();
      expect(selectors.isFlowSaveInProgress({}, '123')).toBeFalsy();
      expect(selectors.isFlowSaveInProgress('123')).toBeFalsy();
      expect(selectors.isFlowSaveInProgress({}, '')).toBeFalsy();
    });
    test('should return false if status is not "saving"', () => {
      const state = {
        123: {status: 'failed'},
        124: {status: 'error'},
        125: {status: 'received'},
      };

      expect(selectors.isFlowSaveInProgress(state, '123')).toBeFalsy();
      expect(selectors.isFlowSaveInProgress(state, '123')).toBeFalsy();
      expect(selectors.isFlowSaveInProgress(state, '123')).toBeFalsy();
    });
    test('should return true if status is "saving"', () => {
      const state = {
        123: {status: 'saving'},
      };

      expect(selectors.isFlowSaveInProgress(state, '123')).toBeTruthy();
    });
  });
  describe('fbRouterStepsInfo test cases', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(selectors.fbRouterStepsInfo()).toEqual({configuredCount: 0, unconfiguredCount: 0});
      expect(selectors.fbRouterStepsInfo({}, 'flow1', 'firstRouter')).toEqual({configuredCount: 0, unconfiguredCount: 0});
    });
    test('fbRouterStepsInfo must return correct configured and unconfigured steps', () => {
      expect(selectors.fbRouterStepsInfo(state1, 'flow1', 'firstRouter')).toEqual({configuredCount: 10, unconfiguredCount: 5});
      expect(selectors.fbRouterStepsInfo(state1, 'flow1', 'fourthRouter')).toEqual({configuredCount: 0, unconfiguredCount: 0});
      expect(selectors.fbRouterStepsInfo(state1, 'flow1', 'secondRouter')).toEqual({configuredCount: 4, unconfiguredCount: 2});
    });
  });
});
