/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
// import { throwError } from 'redux-saga-test-plan/providers';
import { createNewPGStep, createNewPPStep, deleteEdge, deleteRouter, deleteStep, mergeBranch } from '.';
import actions from '../../actions';
import { FLOW_SAVING_STATUS, GRAPH_ELEMENTS_TYPE } from '../../constants';
import { selectors } from '../../reducers';
import { getChangesPatchSet } from '../../utils/json';

describe('flowbuilder sagas', () => {
  describe('createNewPGStep saga', () => {
    const flowId = '123';

    test('should dispatch setSaveStatus action if there are no changes', () =>
      expectSaga(createNewPGStep, {flowId})
        .provide([
          [matchers.call.fn(getChangesPatchSet), []],
          [select(selectors.resourceData, 'flows', flowId), {merged: undefined}],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.flow.setSaveStatus(flowId))
        .run()
    );
    test('should dispatch patchAndCommitStaged action if there are changes', () =>
      expectSaga(createNewPGStep, {flowId})
        .provide([
          [matchers.call.fn(getChangesPatchSet), []],
          [select(selectors.resourceData, 'flows', flowId), {merged: {}}],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged(
          'flows', flowId,
          [{ op: 'add', path: '/pageGenerators', value: [{ setupInProgress: true }, { setupInProgress: true }] }],
          {options: {revertChangesOnFailure: true}})
        )
        .run()
    );
  });
  describe('deleteStep saga', () => {
    const flowId = '62d561f648a4303c75f7dca2';

    test('should call deletePGOrPPStepForRouters function if step is PG and dispatch setSaveStatus and patchAndCommitStaged actions', () => {
      const stepId = '61ee3cca2959b91c0ab9ce02';
      const elementsMap = {
        '61ee3cca2959b91c0ab9ce02': {
          id: '61ee3cca2959b91c0ab9ce02',
          type: 'pg',
          data: {
            _exportId: '61ee3cca2959b91c0ab9ce02',
            id: '61ee3cca2959b91c0ab9ce02',
            path: '/pageGenerators/0',
            hideDelete: false,
          },
        },
      };
      const flow = {
        _id: '62d561f648a4303c75f7dca2',
        lastModified: '2022-07-18T13:37:08.833Z',
        name: 'Test cases',
        disabled: true,
        _integrationId: '62d535b83efe3d37ca446f52',
        skipRetries: false,
        pageGenerators: [
          {
            _exportId: '61ee3cca2959b91c0ab9ce02',
            id: '61ee3cca2959b91c0ab9ce02',
          },
        ],
        createdAt: '2022-07-18T13:36:54.709Z',
        autoResolveMatchingTraceKeys: true,
        routers: [
          {
            id: 'Q659ah',
            branches: [
              {
                name: 'Branch 1.0',
                pageProcessors: [
                  {
                    setupInProgress: true,
                    id: 'none-2duh5A',
                  },
                ],
              },
            ],
          },
        ],
      };
      const originalFlow = {
        _id: '62d561f648a4303c75f7dca2',
        lastModified: '2022-07-18T13:37:08.833Z',
        name: 'Test cases',
        disabled: true,
        _integrationId: '62d535b83efe3d37ca446f52',
        skipRetries: false,
        pageGenerators: [
          {
            _exportId: '61ee3cca2959b91c0ab9ce02',
          },
        ],
        createdAt: '2022-07-18T13:36:54.709Z',
        autoResolveMatchingTraceKeys: true,
      };
      const patchSet = [
        {
          op: 'remove',
          path: '/pageGenerators/0/id',
        },
        {
          op: 'remove',
          path: '/pageGenerators/0/_exportId',
        },
        {
          op: 'add',
          path: '/pageGenerators/0/setupInProgress',
          value: true,
        },
      ];

      return expectSaga(deleteStep, {flowId, stepId})
        .provide([
          [select(selectors.fbGraphElementsMap, flowId), elementsMap],
          [select(selectors.fbFlow, flowId), flow],
          [select(selectors.resourceData, 'flows', flowId), {merged: originalFlow}],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet))
        .run();
    });

    test('should call deletePPStepForOldSchema function if step is PG and dispatch setSaveStatus and patchAndCommitStaged actions', () => {
      const stepId = '62cd998b3d0dab426139b61c';
      const elementsMap = {
        'none-HNnRyy': {
          id: 'none-HNnRyy',
          type: 'pg',
          data: {
            setupInProgress: true,
            id: 'none-HNnRyy',
            path: '/pageGenerators/0',
            hideDelete: true,
          },
        },
        'none-HNnRyy-62cd998b3d0dab426139b61c': {
          id: 'none-HNnRyy-62cd998b3d0dab426139b61c',
          source: 'none-HNnRyy',
          target: '62cd998b3d0dab426139b61c',
          data: {
            path: '/routers/0/branches/0',
            processorIndex: 0,
          },
          type: 'default',
        },
        R0wr3d: {
          id: 'R0wr3d',
          type: 'terminal',
          draggable: false,
          data: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                type: 'import',
                _importId: '62cd998b3d0dab426139b61c',
                id: '62cd998b3d0dab426139b61c',
              },
            ],
            path: '/routers/0/branches/0/pageProcessors/1',
          },
        },
        '62cd998b3d0dab426139b61c-R0wr3d': {
          id: '62cd998b3d0dab426139b61c-R0wr3d',
          source: '62cd998b3d0dab426139b61c',
          target: 'R0wr3d',
          data: {
            path: '/routers/0/branches/0',
            processorIndex: 1,
          },
          type: 'default',
        },
        '62cd998b3d0dab426139b61c': {
          id: '62cd998b3d0dab426139b61c',
          type: 'pp',
          data: {
            resource: {
              responseMapping: {
                fields: [],
                lists: [],
              },
              type: 'import',
              _importId: '62cd998b3d0dab426139b61c',
              id: '62cd998b3d0dab426139b61c',
            },
            branch: {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '62cd998b3d0dab426139b61c',
                  id: '62cd998b3d0dab426139b61c',
                },
              ],
            },
            hideDelete: false,
            isVirtual: true,
            isFirst: true,
            isLast: true,
            path: '/routers/0/branches/0/pageProcessors/0',
          },
        },
      };
      const flow = {
        _id: '62d561f648a4303c75f7dca2',
        lastModified: '2022-07-18T14:37:25.856Z',
        name: 'Test cases',
        disabled: true,
        _integrationId: '62d535b83efe3d37ca446f52',
        skipRetries: false,
        pageGenerators: [
          {
            setupInProgress: true,
            id: 'none-HNnRyy',
          },
        ],
        createdAt: '2022-07-18T13:36:54.709Z',
        autoResolveMatchingTraceKeys: true,
        routers: [
          {
            id: 'LopgDq',
            branches: [
              {
                name: 'Branch 1.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62cd998b3d0dab426139b61c',
                    id: '62cd998b3d0dab426139b61c',
                  },
                ],
              },
            ],
          },
        ],
      };
      const originalFlow = {
        _id: '62d561f648a4303c75f7dca2',
        lastModified: '2022-07-18T14:37:25.856Z',
        name: 'Test cases',
        disabled: true,
        _integrationId: '62d535b83efe3d37ca446f52',
        skipRetries: false,
        pageProcessors: [
          {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: '62cd998b3d0dab426139b61c',
          },
        ],
        pageGenerators: [
          {
            setupInProgress: true,
          },
        ],
        createdAt: '2022-07-18T13:36:54.709Z',
        autoResolveMatchingTraceKeys: true,
      };
      const patchSet = [
        {
          op: 'remove',
          path: '/pageProcessors/0',
        },
      ];

      return expectSaga(deleteStep, {flowId, stepId})
        .provide([
          [select(selectors.fbGraphElementsMap, flowId), elementsMap],
          [select(selectors.fbFlow, flowId), flow],
          [select(selectors.resourceData, 'flows', flowId), {merged: originalFlow}],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet))
        .run();
    });

    test('should call deletePGOrPPStepForRouters function if step is PP for flow with routers and dispatch setSaveStatus and patchAndCommitStaged actions', () => {
      const stepId = '62d571143efe3d37ca447aa2';
      const elementsMap = {
        'none-5i5w3_': {
          id: 'none-5i5w3_',
          type: 'pg',
          data: {
            setupInProgress: true,
            id: 'none-5i5w3_',
            path: '/pageGenerators/0',
            hideDelete: true,
          },
        },
        'none-5i5w3_-NUeVB4': {
          id: 'none-5i5w3_-NUeVB4',
          source: 'none-5i5w3_',
          target: 'NUeVB4',
          data: {
            path: '/routers/-1/branches/-1',
            processorIndex: 0,
          },
          type: 'default',
        },
        NUeVB4: {
          id: 'NUeVB4',
          type: 'router',
          data: {
            path: '/routers/0',
            router: {
              routeRecordsUsing: 'input_filters',
              id: 'NUeVB4',
              routeRecordsTo: 'first_matching_branch',
              branches: [
                {
                  name: 'Branch 1.0',
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '62cd998b3d0dab426139b61c',
                      id: '62cd998b3d0dab426139b61c',
                    },
                  ],
                },
                {
                  name: 'Branch 1.1',
                  pageProcessors: [
                    {
                      responseMapping: {
                        fields: [],
                        lists: [],
                      },
                      type: 'import',
                      _importId: '62d571143efe3d37ca447aa2',
                      id: '62d571143efe3d37ca447aa2',
                    },
                  ],
                },
              ],
              script: {
                function: 'branchRouter',
              },
            },
          },
        },
        'NUeVB4-62cd998b3d0dab426139b61c': {
          id: 'NUeVB4-62cd998b3d0dab426139b61c',
          source: 'NUeVB4',
          target: '62cd998b3d0dab426139b61c',
          data: {
            path: '/routers/0/branches/0',
            processorIndex: 0,
            mergableTerminals: [
              'zgo03b',
            ],
          },
          type: 'default',
        },
        '86dclB': {
          id: '86dclB',
          type: 'terminal',
          draggable: true,
          data: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                type: 'import',
                _importId: '62cd998b3d0dab426139b61c',
                id: '62cd998b3d0dab426139b61c',
              },
            ],
            path: '/routers/0/branches/0/pageProcessors/1',
            draggable: true,
          },
        },
        '62cd998b3d0dab426139b61c-86dclB': {
          id: '62cd998b3d0dab426139b61c-86dclB',
          source: '62cd998b3d0dab426139b61c',
          target: '86dclB',
          data: {
            path: '/routers/0/branches/0',
            processorIndex: 1,
          },
          type: 'default',
        },
        '62cd998b3d0dab426139b61c': {
          id: '62cd998b3d0dab426139b61c',
          type: 'pp',
          data: {
            resource: {
              responseMapping: {
                fields: [],
                lists: [],
              },
              type: 'import',
              _importId: '62cd998b3d0dab426139b61c',
              id: '62cd998b3d0dab426139b61c',
            },
            branch: {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '62cd998b3d0dab426139b61c',
                  id: '62cd998b3d0dab426139b61c',
                },
              ],
            },
            hideDelete: false,
            isVirtual: false,
            isFirst: true,
            isLast: true,
            path: '/routers/0/branches/0/pageProcessors/0',
          },
        },
        'NUeVB4-62d571143efe3d37ca447aa2': {
          id: 'NUeVB4-62d571143efe3d37ca447aa2',
          source: 'NUeVB4',
          target: '62d571143efe3d37ca447aa2',
          data: {
            path: '/routers/0/branches/1',
            processorIndex: 0,
            mergableTerminals: [
              '86dclB',
            ],
          },
          type: 'default',
        },
        zgo03b: {
          id: 'zgo03b',
          type: 'terminal',
          draggable: true,
          data: {
            name: 'Branch 1.1',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                type: 'import',
                _importId: '62d571143efe3d37ca447aa2',
                id: '62d571143efe3d37ca447aa2',
              },
            ],
            path: '/routers/0/branches/1/pageProcessors/1',
            draggable: true,
          },
        },
        '62d571143efe3d37ca447aa2-zgo03b': {
          id: '62d571143efe3d37ca447aa2-zgo03b',
          source: '62d571143efe3d37ca447aa2',
          target: 'zgo03b',
          data: {
            path: '/routers/0/branches/1',
            processorIndex: 1,
          },
          type: 'default',
        },
        '62d571143efe3d37ca447aa2': {
          id: '62d571143efe3d37ca447aa2',
          type: 'pp',
          data: {
            resource: {
              responseMapping: {
                fields: [],
                lists: [],
              },
              type: 'import',
              _importId: '62d571143efe3d37ca447aa2',
              id: '62d571143efe3d37ca447aa2',
            },
            branch: {
              name: 'Branch 1.1',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '62d571143efe3d37ca447aa2',
                  id: '62d571143efe3d37ca447aa2',
                },
              ],
            },
            hideDelete: false,
            isVirtual: false,
            isFirst: true,
            isLast: true,
            path: '/routers/0/branches/1/pageProcessors/0',
          },
        },
      };
      const flow = {
        _id: '62d561f648a4303c75f7dca2',
        lastModified: '2022-07-18T14:41:26.377Z',
        name: 'Test cases',
        disabled: true,
        _integrationId: '62d535b83efe3d37ca446f52',
        skipRetries: false,
        pageGenerators: [
          {
            setupInProgress: true,
            id: 'none-5i5w3_',
          },
        ],
        createdAt: '2022-07-18T13:36:54.709Z',
        autoResolveMatchingTraceKeys: true,
        routers: [
          {
            routeRecordsUsing: 'input_filters',
            id: 'NUeVB4',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 1.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62cd998b3d0dab426139b61c',
                    id: '62cd998b3d0dab426139b61c',
                  },
                ],
              },
              {
                name: 'Branch 1.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62d571143efe3d37ca447aa2',
                    id: '62d571143efe3d37ca447aa2',
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
        ],
      };
      const originalFlow = {
        _id: '62d561f648a4303c75f7dca2',
        lastModified: '2022-07-18T14:41:26.377Z',
        name: 'Test cases',
        disabled: true,
        _integrationId: '62d535b83efe3d37ca446f52',
        skipRetries: false,
        pageGenerators: [
          {
            setupInProgress: true,
          },
        ],
        createdAt: '2022-07-18T13:36:54.709Z',
        autoResolveMatchingTraceKeys: true,
        routers: [
          {
            routeRecordsUsing: 'input_filters',
            id: 'NUeVB4',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 1.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62cd998b3d0dab426139b61c',
                  },
                ],
              },
              {
                name: 'Branch 1.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62d571143efe3d37ca447aa2',
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
        ],
      };
      const patchSet = [
        {
          op: 'remove',
          path: '/routers/0/branches/1/pageProcessors/0',
        },
      ];

      return expectSaga(deleteStep, {flowId, stepId})
        .provide([
          [select(selectors.fbGraphElementsMap, flowId), elementsMap],
          [select(selectors.fbFlow, flowId), flow],
          [select(selectors.resourceData, 'flows', flowId), {merged: originalFlow}],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet))
        .run();
    });
  });
  describe('createNewPPStep saga', () => {
    const flowId = '123';

    test('should dispatch setSaveStatus and patchAndCommitStaged action if there are changes to flow doc', () =>
      expectSaga(createNewPPStep, {flowId, path: undefined, processorIndex: undefined})
        .provide([
          [select(selectors.resourceData, 'flows', flowId), {merged: {}}],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged('flows', flowId, [{ op: 'add', path: '/pageProcessors', value: [{ setupInProgress: true }] }], {options: {revertChangesOnFailure: true}}))
        .run());
    test('should dispatch patchAndCommitStaged action if there are no changes to flow doc', () =>
      expectSaga(createNewPPStep, {flowId, path: undefined, processorIndex: undefined})
        .provide([
          [select(selectors.resourceData, 'flows', flowId), {merged: undefined}],
        ])
        .put(actions.resource.patchAndCommitStaged('flows', flowId, [], {options: {revertChangesOnFailure: true}}))
        .run());
  });
  describe('mergeBranch saga', () => {
    const flowId = '123';

    test('should not dispatch setSaveStatus and patchAndCommitStaged actions if mergeTargetId does not exist', () =>
      expectSaga(mergeBranch, {flowId})
        .provide([
          [select(selectors.fbMergeTargetId, flowId), undefined],
        ])
        .not.put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .not.put(actions.resource.patchAndCommitStaged('flows', flowId, []))
        .put(actions.flow.dragEnd(flowId))
        .put(actions.flow.mergeTargetClear(flowId))
        .run());
    test('should not dispatch setSaveStatus and patchAndCommitStaged actions if mergeTargetType does not exist', () =>
      expectSaga(mergeBranch, {flowId})
        .provide([
          [select(selectors.fbMergeTargetId, flowId), '43'],
        ])
        .not.put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .not.put(actions.resource.patchAndCommitStaged('flows', flowId, []))
        .put(actions.flow.dragEnd(flowId))
        .put(actions.flow.mergeTargetClear(flowId))
        .run());
    test('should not dispatch setSaveStatus and patchAndCommitStaged actions if branch is not mergable', () =>
      expectSaga(mergeBranch, {flowId})
        .provide([
          [select(selectors.fbMergeTargetId, flowId), '43'],
          [select(selectors.fbGraphElementsMap, flowId), {43: {type: 'merge'}}],
          [select(selectors.fbMergeTargetType, flowId), 'pp'],
        ])
        .not.put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .not.put(actions.resource.patchAndCommitStaged('flows', flowId, []))
        .put(actions.flow.dragEnd(flowId))
        .put(actions.flow.mergeTargetClear(flowId))
        .run());
    describe('should dispatch setSaveStatus and patchAndCommitStaged actions if branch is mergable', () => {
      test('if mergeTarget type is not merge', () =>
        expectSaga(mergeBranch, {flowId})
          .provide([
            [select(selectors.fbGraphElementsMap, flowId), {43: {type: 'router'}}],
            [select(selectors.fbMergeTargetId, flowId), '43'],
            [select(selectors.fbMergeTargetType, flowId), 'merge'],
          ])
          .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
          .put(actions.resource.patchAndCommitStaged('flows', flowId, []))
          .put(actions.flow.dragEnd(flowId))
          .put(actions.flow.mergeTargetClear(flowId))
          .run()
      );
      test('if mergeTarget is a mergableTerminal', () =>
        expectSaga(mergeBranch, {flowId})
          .provide([
            [select(selectors.fbDragStepId, flowId), 'dragId'],
            [select(selectors.fbGraphElementsMap, flowId), {43: {type: GRAPH_ELEMENTS_TYPE.MERGE, data: {mergableTerminals: ['dragId']}}}],
            [select(selectors.fbMergeTargetId, flowId), '43'],
            [select(selectors.fbMergeTargetType, flowId), 'merge'],
          ])
          .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
          .put(actions.resource.patchAndCommitStaged('flows', flowId, []))
          .put(actions.flow.dragEnd(flowId))
          .put(actions.flow.mergeTargetClear(flowId))
          .run()
      );
    });
  });
  describe('deleteEdge saga', () => {
    const flowId = '123';
    const edgeId = '1';
    const elementsMap = {1: {data: {path: '/routers/1'}}};
    const edge = elementsMap[1];

    test('should return if edgeId does not exist on the flow', () =>
      expectSaga(deleteEdge, {flowId, edgeId: '2'})
        .provide([
          [select(selectors.fbGraphElementsMap, flowId), elementsMap],
        ])
        .not.put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .run());

    test('should dispatch setSaveStatus and patchAndCommitStaged action if edge exists on flow', () =>
      expectSaga(deleteEdge, {flowId, edgeId})
        .provide([
          [select(selectors.fbGraphElementsMap, flowId), elementsMap],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged(
          'flows',
          flowId,
          [{
            op: 'remove',
            path: `${edge.data.path}/nextRouterId`,
          }]
        ))
        .run());
  });
  describe('deleteRouter saga', () => {
    test('should dispatch patchAndCommitStaged action with correct patch set if preceeding router exists', () => {
      const flowId = '62de216043d10d1a0dbea17d';
      const prePatches = undefined;
      const routerId = 'PkKnM8';
      const flow = {
        _id: '62de216043d10d1a0dbea17d',
        lastModified: '2022-07-25T11:44:27.598Z',
        name: 'Siddharth',
        disabled: true,
        _integrationId: '62725cd17a13ea404992c628',
        skipRetries: false,
        pageGenerators: [
          {
            _exportId: '6274f00fae5a74711e604dcc',
            id: '6274f00fae5a74711e604dcc',
          },
        ],
        createdAt: '2022-07-25T04:51:44.262Z',
        autoResolveMatchingTraceKeys: true,
        routers: [
          {
            routeRecordsUsing: 'input_filters',
            id: 'fOUq6p',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 1.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62583031cc5d605c05cb89d9',
                    id: '62583031cc5d605c05cb89d9',
                  },
                ],
              },
              {
                name: 'Branch 1.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '624dd26ee52fea5f97ff4679',
                    id: '624dd26ee52fea5f97ff4679',
                  },
                ],
                nextRouterId: 'PkKnM8',
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
          {
            routeRecordsUsing: 'input_filters',
            id: 'PkKnM8',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 2.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    setupInProgress: true,
                    id: 'none-0qNjQD',
                  },
                ],
              },
              {
                name: 'Branch 2.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    setupInProgress: true,
                    id: 'none-MSHIuK',
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
        ],
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/routers/0/branches/1/pageProcessors',
          value: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              type: 'import',
              _importId: '624dd26ee52fea5f97ff4679',
              id: '624dd26ee52fea5f97ff4679',
            },
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'none-0qNjQD',
            },
          ],
        },
        {
          op: 'replace',
          path: '/routers/0/branches/1/nextRouterId',
          value: undefined,
        },
        {
          op: 'remove',
          path: '/routers/1',
        },
      ];

      return expectSaga(deleteRouter, {flowId, routerId, prePatches})
        .provide([
          [select(selectors.fbFlow, flowId), flow],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet))
        .run();
    });
    test('should dispatch patchAndCommitStaged action with correct patch set if preceeding router exists and deleting current router results in orphan routers', () => {
      const flowId = '62de216043d10d1a0dbea17d';
      const prePatches = undefined;
      const routerId = 'xgYGp_';
      const flow = {
        _id: '62de216043d10d1a0dbea17d',
        lastModified: '2022-07-25T11:55:59.080Z',
        name: 'Siddharth',
        disabled: true,
        _integrationId: '62725cd17a13ea404992c628',
        skipRetries: false,
        pageGenerators: [
          {
            _exportId: '6274f00fae5a74711e604dcc',
            id: '6274f00fae5a74711e604dcc',
          },
        ],
        createdAt: '2022-07-25T04:51:44.262Z',
        autoResolveMatchingTraceKeys: true,
        routers: [
          {
            routeRecordsUsing: 'input_filters',
            id: 'fOUq6p',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 1.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62583031cc5d605c05cb89d9',
                    id: '62583031cc5d605c05cb89d9',
                  },
                ],
              },
              {
                name: 'Branch 1.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '624dd26ee52fea5f97ff4679',
                    id: '624dd26ee52fea5f97ff4679',
                  },
                ],
                nextRouterId: 'xgYGp_',
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
          {
            routeRecordsUsing: 'input_filters',
            id: 'xgYGp_',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 2.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62c580083511941752998459',
                    id: '62c580083511941752998459',
                  },
                ],
                nextRouterId: 'Yxx8Bs',
              },
              {
                name: 'Branch 2.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    setupInProgress: true,
                    id: 'none-SK-zLd',
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
          {
            routeRecordsUsing: 'input_filters',
            id: 'Yxx8Bs',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 3.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62bb0b63d0314c189e4ee0bd',
                    id: '62bb0b63d0314c189e4ee0bd',
                  },
                ],
              },
              {
                name: 'Branch 3.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    setupInProgress: true,
                    id: 'none-7TXXL8',
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
        ],
      };
      const patchSet = [
        {
          op: 'replace',
          path: '/routers/0/branches/1/pageProcessors',
          value: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              type: 'import',
              _importId: '624dd26ee52fea5f97ff4679',
              id: '624dd26ee52fea5f97ff4679',
            },
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              type: 'import',
              _importId: '62c580083511941752998459',
              id: '62c580083511941752998459',
            },
          ],
        },
        {
          op: 'replace',
          path: '/routers/0/branches/1/nextRouterId',
          value: 'Yxx8Bs',
        },
        {
          op: 'remove',
          path: '/routers/1',
        },
      ];

      return expectSaga(deleteRouter, {flowId, routerId, prePatches})
        .provide([
          [select(selectors.fbFlow, flowId), flow],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet))
        .run();
    });
    test('should dispatch patchAndCommitStaged action with correct patch set if it is first router', () => {
      const flowId = '62de216043d10d1a0dbea17d';
      const prePatches = undefined;
      const routerId = 'fOUq6p';
      const flow = {
        _id: '62de216043d10d1a0dbea17d',
        lastModified: '2022-07-25T12:01:08.133Z',
        name: 'Siddharth',
        disabled: true,
        _integrationId: '62725cd17a13ea404992c628',
        skipRetries: false,
        pageGenerators: [
          {
            _exportId: '6274f00fae5a74711e604dcc',
            id: '6274f00fae5a74711e604dcc',
          },
        ],
        createdAt: '2022-07-25T04:51:44.262Z',
        autoResolveMatchingTraceKeys: true,
        routers: [
          {
            routeRecordsUsing: 'input_filters',
            id: 'fOUq6p',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 1.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62583031cc5d605c05cb89d9',
                    id: '62583031cc5d605c05cb89d9',
                  },
                ],
              },
              {
                name: 'Branch 1.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '624dd26ee52fea5f97ff4679',
                    id: '624dd26ee52fea5f97ff4679',
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
        ],
      };
      const patchSet = [
        {
          op: 'remove',
          path: '/routers',
        },
        {
          op: 'add',
          path: '/pageProcessors',
          value: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              type: 'import',
              _importId: '62583031cc5d605c05cb89d9',
              id: '62583031cc5d605c05cb89d9',
            },
          ],
        },
      ];

      return expectSaga(deleteRouter, {flowId, routerId, prePatches})
        .provide([
          [select(selectors.fbFlow, flowId), flow],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet))
        .run();
    });
    test('should dispatch patchAndCommitStaged action with correct patch set if it is first router and its deletion may lead to orphan routers', () => {
      const flowId = '62de216043d10d1a0dbea17d';
      const prePatches = undefined;
      const routerId = 'v8pyFv';
      const flow = {
        _id: '62de216043d10d1a0dbea17d',
        lastModified: '2022-07-25T12:05:21.065Z',
        name: 'Siddharth',
        disabled: true,
        _integrationId: '62725cd17a13ea404992c628',
        skipRetries: false,
        pageGenerators: [
          {
            _exportId: '6274f00fae5a74711e604dcc',
            id: '6274f00fae5a74711e604dcc',
          },
        ],
        createdAt: '2022-07-25T04:51:44.262Z',
        autoResolveMatchingTraceKeys: true,
        routers: [
          {
            routeRecordsUsing: 'input_filters',
            id: 'v8pyFv',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 1.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62583031cc5d605c05cb89d9',
                    id: '62583031cc5d605c05cb89d9',
                  },
                ],
                nextRouterId: 'oqKWgQ',
              },
              {
                name: 'Branch 1.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    setupInProgress: true,
                    id: 'none-LUnRv_',
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
          {
            routeRecordsUsing: 'input_filters',
            id: 'oqKWgQ',
            routeRecordsTo: 'first_matching_branch',
            branches: [
              {
                name: 'Branch 2.0',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '62c580083511941752998459',
                    id: '62c580083511941752998459',
                  },
                ],
              },
              {
                name: 'Branch 2.1',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    setupInProgress: true,
                    id: 'none-b1muo7',
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
        ],
      };
      const patchSet = [
        {
          op: 'remove',
          path: '/routers/0/branches/1',
        },
        {
          op: 'remove',
          path: '/routers/0/routeRecordsTo',
        },
        {
          op: 'remove',
          path: '/routers/0/routeRecordsUsing',
        },
      ];

      return expectSaga(deleteRouter, {flowId, routerId, prePatches})
        .provide([
          [select(selectors.fbFlow, flowId), flow],
        ])
        .put(actions.flow.setSaveStatus(flowId, FLOW_SAVING_STATUS))
        .put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet))
        .run();
    });
  });
});
