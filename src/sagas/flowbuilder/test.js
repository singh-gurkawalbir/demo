/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
// import { throwError } from 'redux-saga-test-plan/providers';
import { createNewPGStep, createNewPPStep, deleteEdge, deleteStep } from '.';
import actions from '../../actions';
import { FLOW_SAVING_STATUS } from '../../constants';
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
        .put(actions.resource.patchAndCommitStaged('flows', flowId, [{ op: 'add', path: '/pageProcessors', value: [{ setupInProgress: true }, { setupInProgress: true }] }], {options: {revertChangesOnFailure: true}}))
        .run());
    test('should dispatch patchAndCommitStaged action if there are no changes to flow doc', () =>
      expectSaga(createNewPPStep, {flowId, path: undefined, processorIndex: undefined})
        .provide([
          [select(selectors.resourceData, 'flows', flowId), {merged: undefined}],
        ])
        .put(actions.resource.patchAndCommitStaged('flows', flowId, [], {options: {revertChangesOnFailure: true}}))
        .run());
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
});
