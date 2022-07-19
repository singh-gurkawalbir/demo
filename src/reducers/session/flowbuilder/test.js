/* global describe, test, expect */
import {selectors} from '.';

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

describe('Selectors test cases', () => {
  test('fbRouterStepsInfo must return correct configured and unconfigured steps', () => {
    expect(selectors.fbRouterStepsInfo(state1, 'flow1', 'firstRouter')).toEqual({configuredCount: 10, unconfiguredCount: 5});
    expect(selectors.fbRouterStepsInfo(state1, 'flow1', 'fourthRouter')).toEqual({configuredCount: 0, unconfiguredCount: 0});
    expect(selectors.fbRouterStepsInfo(state1, 'flow1', 'secondRouter')).toEqual({configuredCount: 4, unconfiguredCount: 2});
  });
});
