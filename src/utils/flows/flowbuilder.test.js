import { cloneDeep, keyBy } from 'lodash';
import { GRAPH_ELEMENTS_TYPE } from '../../constants';
import { generateId } from '../string';
import {
  getAllRouterPaths,
  getPreceedingRoutersMap,
  deleteUnUsedRouters,
  isVirtualRouter,
  generateEmptyRouter,
  addPageGenerators,
  addPageProcessor,
  deletePPStepForOldSchema,
  deletePGOrPPStepForRouters,
  generateReactFlowGraph,
  generateDefaultEdge,
  getSomePg,
  getSomePpImport,
  generateRouterNode,
  generateNewTerminal,
  generateNewEmptyNode,
  initializeFlowForReactFlow,
  generatePageGeneratorNodesAndEdges,
  generatePageProcessorNodesAndEdges,
  generateNodesAndEdgesFromNonBranchedFlow,
  populateMergeData,
  generateNodesAndEdgesFromBranchedFlow,
  mergeBetweenPPAndRouter,
  mergeTerminalNodes,
  mergeBetweenRouterAndPP,
  splitPPArray,
  getNewRouterPatchSet,
  mergeDragSourceWithTarget,
  mergeTerminalToAnEdge,
  moveStepFunction,
} from './flowbuilder';

const anyShortId = expect.stringMatching(/^[a-zA-Z0-9-_]{11}$/);
const anyPPId = expect.stringMatching(/^new-[a-zA-Z0-9-_]{11}$/);

const flow1 = {
  routers: [{
    id: 'router1',
    branches: [
      {
        name: 'branch1',
        nextRouterId: 'router2',
      },
      {
        name: 'branch1',
        nextRouterId: 'router3',
      },
      {
        name: 'branch1',
        nextRouterId: 'router2',
      },
    ],
  }, {
    id: 'router2',
    branches: [
      {
        name: 'branch1',
        nextRouterId: 'router6',
      },
      {
        name: 'branch1',
        nextRouterId: 'router4',
      },
      {
        name: 'branch1',
        nextRouterId: 'router3',
      },
    ],
  }, {
    id: 'router3',
    branches: [
      {
        name: 'branch6',
        nextRouterId: 'router6',
      },
      {
        name: 'branch1',
      },
    ],
  }, {
    id: 'router4',
    branches: [
      {
        name: 'branch6',
      },
      {
        name: 'branch1',
      },
    ],
  }, {
    id: 'router5',
    branches: [
      {
        name: 'branch6',
      },
      {
        name: 'branch1',
        nextRouterId: 'router6',
      },
    ],
  }, {
    id: 'router6',
    branches: [
      {
        name: 'branch6',
      },
      {
        name: 'branch1',
      },
    ],
  }],
};
const flow2 = {
  routers: [{
    id: 'router1',
    branches: [
      {
        name: 'branch1',
        nextRouterId: 'router2',
      },
      {
        name: 'branch1',
        nextRouterId: 'router3',
      },
    ],
  }, {
    id: 'router2',
    branches: [
      {
        name: 'branch1',
        nextRouterId: 'router4',
      },
      {
        name: 'branch1',
        nextRouterId: 'router3',
      },
    ],
  }, {
    id: 'router3',
    branches: [
      {
        name: 'branch6',
      },
      {
        name: 'branch1',
      },
    ],
  }, {
    id: 'router4',
    branches: [
      {
        name: 'branch6',
      },
      {
        name: 'branch1',
      },
    ],
  }],
};

const flow3 = {
  pageGenerators: [],
  routers: [{
    id: 'router1',
    branches: [{
      name: 'branch1.1',
      pageProcessors: [{type: 'import', _importId: 'import1'}, {type: 'import', _importId: 'import2'}],
      nextRouterId: 'router2',
    }, {
      name: 'branch1.2',
      pageProcessors: [{type: 'import', _importId: 'import3'}, {type: 'import', _importId: 'import4'}],
      nextRouterId: 'router3',
    }, {
      name: 'branch1.3',
      pageProcessors: [{type: 'import', _importId: 'import5'}, {type: 'import', _importId: 'import6'}],
    }],
  }, {
    id: 'router2',
    branches: [{
      name: 'branch2.1',
      pageProcessors: [{type: 'import', _importId: 'import1'}, {type: 'import', _importId: 'import2'}],
      nextRouterId: 'router4',
    }, {
      name: 'branch2.2',
      pageProcessors: [{type: 'import', _importId: 'import3'}, {type: 'import', _importId: 'import4'}],
    }],
  }, {
    id: 'router3',
    branches: [{
      name: 'branch3.1',
      pageProcessors: [{type: 'import', _importId: 'import1'}, {type: 'import', _importId: 'import2'}],
    }],
  }, {
    id: 'router4',
    branches: [{
      name: 'branch4.1',
      pageProcessors: [{type: 'import', _importId: 'import1'}, {type: 'import', _importId: 'import2'}],
      nextRouterId: 'router5',
    }],
  }, {
    id: 'router5',
    branches: [{
      name: 'branch5.1',
      pageProcessors: [{type: 'import', _importId: 'import1'}, {type: 'import', _importId: 'import2'}],
    }],
  }],
};

const flow4 = {
  _id: '62cda01a3d0dab426139b77d',
  lastModified: '2022-07-12T17:18:47.877Z',
  name: 'Preview functionality test',
  disabled: true,
  _integrationId: '5ab0981dbebda83f14197406',
  skipRetries: false,
  pageGenerators: [
    {
      _exportId: '62cd472e8a7b1e641f295c4a',
      id: '62cd472e8a7b1e641f295c4a',
    },
  ],
  createdAt: '2022-07-12T16:23:54.643Z',
  autoResolveMatchingTraceKeys: true,
  routers: [
    {
      routeRecordsUsing: 'input_filters',
      id: 'Ko7qmy',
      routeRecordsTo: 'first_matching_branch',
      branches: [
        {
          name: 'Branch 1.0',
          pageProcessors: [
            {
              responseMapping: {
                fields: [
                  {
                    extract: 'id',
                    generate: 'id1',
                  },
                ],
                lists: [],
              },
              type: 'import',
              _importId: '62cbc0908c8337627f657872',
              id: '62cbc0908c8337627f657872',
            },
            {
              responseMapping: {
                fields: [
                  {
                    extract: 'errors',
                    generate: 'errors21',
                  },
                ],
                lists: [],
              },
              type: 'import',
              _importId: '62cda4fb80c105471745f0f1',
              id: '62cda4fb80c105471745f0f1',
            },
          ],
          nextRouterId: 'VlrnY7',
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
              _importId: '62cda0873d0dab426139b793',
              id: '62cda0873d0dab426139b793',
            },
          ],
          nextRouterId: 'VlrnY7',
        },
      ],
      script: {
        function: 'branching',
      },
    },
    {
      routeRecordsUsing: 'input_filters',
      id: 'xwELf2',
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
              id: 'new-f5FFcQ',
            },
          ],
          nextRouterId: 'HaQWro',
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
              id: 'new-LH2VLY',
            },
          ],
          nextRouterId: 'HaQWro',
        },
      ],
      script: {
        function: 'branching',
      },
    },
    {
      id: 'HaQWro',
      branches: [
        {
          name: '',
          pageProcessors: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-gJ6rD9',
            },
          ],
        },
      ],
    },
    {
      id: 'VlrnY7',
      branches: [
        {
          name: '',
          nextRouterId: 'xwELf2',
          pageProcessors: [],
        },
      ],
    },
  ],
};
const flow5 = {
  _id: '62cda01a3d0dab426139b77d',
  lastModified: '2022-07-12T17:19:48.284Z',
  name: 'Preview functionality test',
  disabled: true,
  _integrationId: '5ab0981dbebda83f14197406',
  skipRetries: false,
  pageGenerators: [
    {
      _exportId: '62cd472e8a7b1e641f295c4a',
      id: '62cd472e8a7b1e641f295c4a',
    },
  ],
  createdAt: '2022-07-12T16:23:54.643Z',
  autoResolveMatchingTraceKeys: true,
  routers: [
    {
      routeRecordsUsing: 'input_filters',
      id: 'Ko7qmy',
      routeRecordsTo: 'first_matching_branch',
      branches: [
        {
          name: 'Branch 1.0',
          pageProcessors: [
            {
              responseMapping: {
                fields: [
                  {
                    extract: 'id',
                    generate: 'id1',
                  },
                ],
                lists: [],
              },
              type: 'import',
              _importId: '62cbc0908c8337627f657872',
              id: '62cbc0908c8337627f657872',
            },
            {
              responseMapping: {
                fields: [
                  {
                    extract: 'errors',
                    generate: 'errors21',
                  },
                ],
                lists: [],
              },
              type: 'import',
              _importId: '62cda4fb80c105471745f0f1',
              id: '62cda4fb80c105471745f0f1',
            },
          ],
          nextRouterId: 'VlrnY7',
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
              _importId: '62cda0873d0dab426139b793',
              id: '62cda0873d0dab426139b793',
            },
          ],
          nextRouterId: 'VlrnY7',
        },
        {
          name: 'Branch 3.2',
          pageProcessors: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-CAqa9G',
            },
          ],
        },
      ],
      script: {
        function: 'branching',
      },
    },
    {
      routeRecordsUsing: 'input_filters',
      id: 'xwELf2',
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
              id: 'new-3b3Wzm',
            },
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-vRnIwF',
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
              id: 'new-TUvieF',
            },
          ],
        },
      ],
      script: {
        function: 'branching',
      },
    },
    {
      id: 'VlrnY7',
      branches: [
        {
          name: '',
          nextRouterId: 'xwELf2',
          pageProcessors: [],
        },
      ],
    },
  ],
};
const flow6 = {
  _id: '62cda01a3d0dab426139b77d',
  lastModified: '2022-07-12T17:42:04.633Z',
  name: 'Preview functionality test',
  disabled: true,
  _integrationId: '5ab0981dbebda83f14197406',
  skipRetries: false,
  pageGenerators: [
    {
      _exportId: '62cd472e8a7b1e641f295c4a',
      id: '62cd472e8a7b1e641f295c4a',
    },
  ],
  createdAt: '2022-07-12T16:23:54.643Z',
  autoResolveMatchingTraceKeys: true,
  routers: [
    {
      id: 'fMyI3iHer12',
      branches: [
        {
          name: '',
          pageProcessors: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-mlNjkmHer12',
            },
          ],
          nextRouterId: 'Ko7qmyHer12',
        },
      ],
    },
    {
      routeRecordsUsing: 'input_filters',
      id: 'Ko7qmyHer12',
      routeRecordsTo: 'first_matching_branch',
      branches: [
        {
          name: 'Branch 1.0',
          pageProcessors: [
            {
              responseMapping: {
                fields: [
                  {
                    extract: 'id',
                    generate: 'id1',
                  },
                ],
                lists: [],
              },
              type: 'import',
              _importId: '62cbc0908c8337627f657872',
              id: '62cbc0908c8337627f657872',
            },
            {
              responseMapping: {
                fields: [
                  {
                    extract: 'errors',
                    generate: 'errors21',
                  },
                ],
                lists: [],
              },
              type: 'import',
              _importId: '62cda4fb80c105471745f0f1',
              id: '62cda4fb80c105471745f0f1',
            },
          ],
          nextRouterId: 'VlrnY7Her12',
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
              _importId: '62cda0873d0dab426139b793',
              id: '62cda0873d0dab426139b793',
            },
          ],
          nextRouterId: 'VlrnY7Her12',
        },
        {
          name: 'Branch 3.2',
          pageProcessors: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-z0jzjMHer12',
            },
          ],
        },
      ],
      script: {
        function: 'branching',
      },
    },
    {
      id: 'xwELf2Her12',
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
              id: 'new-3LxDQfHer12',
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
              id: 'new-vYHBhYHer12',
            },
          ],
        },
      ],
      routeRecordsUsing: 'input_filters',
      routeRecordsTo: 'first_matching_branch',
      script: {
        function: 'branching',
      },
    },
    {
      id: 'VlrnY7Her12',
      branches: [
        {
          name: '',
          nextRouterId: 'xwELf2Her12',
          pageProcessors: [],
        },
      ],
    },
  ],
};

describe('generateId function', () => {
  test('generateId should return random string', () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();

    expect(id1).not.toEqual(id2);
    expect(id2).not.toEqual(id3);
    expect(id1).not.toEqual(id3);
  });
  test('generateId should have a length of 11', () => {
    const id = generateId();

    expect(id).toHaveLength(11);
  });
});

describe('isVirtualRouter function', () => {
  test('should return true if a router is virtual router', () => {
    const router1 = {id: 'router', branches: []};
    const router2 = {id: 'router', branches: [{}]};
    const router3 = {id: 'router', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]};
    const router4 = {id: 'router', routeRecordsUsing: 'input_filters', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]};
    const router5 = {id: 'router', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}, {name: 'branch2', pageProcessors: [{setupInProgress: true}]}]};
    const router6 = {id: 'router', routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]};
    const router7 = {id: 'router', routeRecordsTo: 'all_matching_branches', routeRecordsUsing: 'input_filters', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]};

    expect(isVirtualRouter(router1)).toBeTruthy();
    expect(isVirtualRouter(router2)).toBeTruthy();
    expect(isVirtualRouter(router3)).toBeTruthy();
    expect(isVirtualRouter(router4)).not.toBeTruthy();
    expect(isVirtualRouter(router5)).not.toBeTruthy();
    expect(isVirtualRouter(router6)).not.toBeTruthy();
    expect(isVirtualRouter(router7)).not.toBeTruthy();
  });
});

describe('generateEmptyRouter function tests', () => {
  test('should return correct object as per params passed', () => {
    const router1 = generateEmptyRouter();
    const router2 = generateEmptyRouter(true);

    expect(router1).toEqual({
      branches: [{pageProcessors: [{setupInProgress: true}]}, {pageProcessors: [{setupInProgress: true}]}],
      id: expect.any(String),
      routeRecordsTo: 'first_matching_branch',
      routeRecordsUsing: 'input_filters',
      script: {_scriptId: undefined, function: undefined},
    });
    expect(router2).toEqual({
      branches: [{pageProcessors: [{setupInProgress: true}]}],
      id: anyShortId,
    });
  });
});

describe('getAllRouterPaths function', () => {
  test('get all Router paths function test', () => {
    const paths = getAllRouterPaths(flow1);

    expect(paths).toEqual([
      ['router1', 'router2', 'router6'],
      ['router1', 'router2', 'router4'],
      ['router1', 'router2', 'router3', 'router6'],
      ['router1', 'router2', 'router3'],
      ['router1', 'router3', 'router6'],
      ['router1', 'router3'],
    ]);
  });
  test('get all Router paths function test2', () => {
    const paths = getAllRouterPaths(flow2);

    expect(paths).toEqual([
      ['router1', 'router2', 'router4'],
      ['router1', 'router2', 'router3'],
      ['router1', 'router3'],
    ]);
  });

  test('get all Router paths function test3', () => {
    const paths = getAllRouterPaths(flow3);

    expect(paths).toEqual([
      ['router1', 'router2', 'router4', 'router5'],
      ['router1', 'router2'],
      ['router1', 'router3'],
      ['router1'],
    ]);
  });
  test('get all Router paths function test4', () => {
    const nFlow = {
      routers: [{id: '123', branches: [{nextRouterId: '2'}]}],
    };
    const paths = getAllRouterPaths(nFlow);

    expect(paths).toEqual([]);
  });
  test('get all Router paths function test5', () => {
    const nFlow = {
      routers: [{id: '123'}],
    };
    const paths = getAllRouterPaths(nFlow);

    expect(paths).toEqual([]);
  });
});

describe('addPageGenerators util function', () => {
  test('should return nothing when flow is not present', () => {
    const flow = undefined;

    addPageGenerators(flow);
    expect(flow).toEqual();
  });
  test('should add two pageGenerators when flow is empty', () => {
    const flow = {};

    addPageGenerators(flow);
    expect(flow).toEqual({pageGenerators: [{setupInProgress: true}, {setupInProgress: true}]});
  });
  test('should add two pageGenerators when pageGenerators are empty', () => {
    const flow = {pageGenerators: []};

    addPageGenerators(flow);
    expect(flow).toEqual({pageGenerators: [{setupInProgress: true}, {setupInProgress: true}]});
  });
  test('should add one pageGenerator when already a PG present', () => {
    const flow = {pageGenerators: [{setupInProgress: true}]};

    addPageGenerators(flow);
    expect(flow).toEqual({pageGenerators: [{setupInProgress: true}, {setupInProgress: true}]});
  });
});

describe('addPageProcessors util function', () => {
  describe('should add pageProcessor appropriately for linear flows', () => {
    test('should return nothing when flow is not present', () => {
      const flow = undefined;

      addPageProcessor(flow);
      expect(flow).toEqual();
    });
    test('should add one pageProcessor when flow is empty', () => {
      const flow = {};

      addPageProcessor(flow);
      expect(flow).toEqual({pageProcessors: [{setupInProgress: true}]});
    });
    test('should add one pageProcessor when pageProcessors are empty', () => {
      const flow = {pageProcessors: []};

      addPageProcessor(flow);
      expect(flow).toEqual({pageProcessors: [{setupInProgress: true}]});
    });
    test('should add one pageProcessor when already a PP present', () => {
      const flow = {pageProcessors: [{setupInProgress: true}]};

      addPageProcessor(flow);
      expect(flow).toEqual({pageProcessors: [{setupInProgress: true}, {setupInProgress: true}]});
    });
    test('should add PageProcessor at given position', () => {
      const flow = {pageProcessors: [{type: 'import', _importId: '1234'}, {type: 'import', _importId: '5678'}]};

      addPageProcessor(flow, 1);
      expect(flow).toEqual({pageProcessors: [{_importId: '1234', type: 'import'}, {setupInProgress: true}, {_importId: '5678', type: 'import'}]});
    });
    test('should add PageProcessor at the end when position is -1', () => {
      const flow = {pageProcessors: [{type: 'import', _importId: '1234'}, {type: 'import', _importId: '5678'}]};

      addPageProcessor(flow, -1);
      expect(flow).toEqual({pageProcessors: [{_importId: '1234', type: 'import'}, {_importId: '5678', type: 'import'}, {setupInProgress: true}]});
    });
  });
  describe('should add pageProcessor appropriately for flow with branching', () => {
    test('should add pageProcessor before first non virtual router', () => {
      const flow = {
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {
            id: 'router1',
            routeRecordsTo: 'first_matching_branch',
            routeRecordsUsing: 'input_filters',
            branches: [{
              name: 'branch1',
              pageProcessors: [{setupInProgress: true}],
            }],
          },
        ],
      };

      addPageProcessor(flow, 0, '/routers/-1/branches/-1');
      expect(flow).toEqual({
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {branches: [{nextRouterId: 'router1', pageProcessors: [{setupInProgress: true}]}], id: anyShortId},
          {branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}], id: 'router1', routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters'},
        ],
      });
    });
    test('should add pageProcessor before first non virtual router with nextRouterId', () => {
      const flow = {
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {
            id: 'router1',
            routeRecordsTo: 'first_matching_branch',
            routeRecordsUsing: 'input_filters',
            branches: [{
              name: 'branch1',
              pageProcessors: [{setupInProgress: true}],
              nextRouterId: 'router2',
            }],
          },
          {
            id: 'router2',
            branches: [{
              name: 'branch2',
              pageProcessors: [{setupInProgress: true}],
            }],
          },
        ],
      };

      addPageProcessor(flow, 0, '/routers/-1/branches/-1');
      expect(flow).toEqual({
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {branches: [{nextRouterId: 'router1', pageProcessors: [{setupInProgress: true}]}], id: anyShortId},
          {branches: [{name: 'branch1', nextRouterId: 'router2', pageProcessors: [{setupInProgress: true}]}], id: 'router1', routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters'},
          {branches: [{name: 'branch2', pageProcessors: [{setupInProgress: true}]}], id: 'router2'},
        ],
      });
    });
    test('should add pageProcessor before first virtual router', () => {
      const flow = {
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {
            id: 'router1',
            branches: [{
              name: 'branch1',
              pageProcessors: [{setupInProgress: true}],
            }],
          },
        ],
      };

      addPageProcessor(flow, 0, '/routers/-1/branches/-1');
      expect(flow).toEqual({
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {branches: [{nextRouterId: 'router1', pageProcessors: [{setupInProgress: true}]}], id: anyShortId},
          {branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}], id: 'router1'},
        ],
      });
    });
    test('should add pageProcessor before first virtual router and no pageProcessors', () => {
      const flow = {
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {
            id: 'router1',
            branches: [{
              name: 'branch1',
              pageProcessors: [],
            }],
          },
        ],
      };

      addPageProcessor(flow, 0, '/routers/-1/branches/-1');
      expect(flow).toEqual({
        pageGenerators: [{setupInProgress: true}],
        routers: [
          { branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}],
            id: 'router1',
          },
        ]});
    });
    test('should add pageProcessor before first virtual router with incremented index', () => {
      const flow = {
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {
            id: 'router1',
            branches: [{
              name: 'branch1',
              pageProcessors: [{setupInProgress: true}],
            }],
          },
        ],
      };

      addPageProcessor(flow, 1, '/routers/-1/branches/-1');
      expect(flow).toEqual({
        pageGenerators: [{setupInProgress: true}],
        routers: [
          {branches: [{nextRouterId: 'router1', pageProcessors: [{setupInProgress: true}]}], id: anyShortId},
          {branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}], id: 'router1'},
        ],
      });
    });
    describe('should insert at the given branch and given index', () => {
      const flow = {
        pageGenerators: [],
        routers: [
          {
            id: 'router1', branches: [{name: 'branch1', pageProcessors: [{type: 'import', _importId: '1234'}]}],
          },
          {
            id: 'router2', branches: [{name: 'branch2', pageProcessors: [{setupInProgress: true}, {type: 'import', _importId: '5678'}]}],
          },
        ],
      };

      test('should add at the end when index is -1', () => {
        const flow1 = cloneDeep(flow);

        addPageProcessor(flow1, -1, '/routers/0/branches/0');
        expect(flow1).toEqual({
          pageGenerators: [],
          routers: [
            {
              branches: [{name: 'branch1', pageProcessors: [{_importId: '1234', type: 'import'}, {setupInProgress: true}]}],
              id: 'router1',
            }, {
              id: 'router2', branches: [{name: 'branch2', pageProcessors: [{setupInProgress: true}, {type: 'import', _importId: '5678'}]}],
            }],
        });
      });
      test('should add at the position when index is given', () => {
        const flow1 = cloneDeep(flow);

        addPageProcessor(flow1, 0, '/routers/0/branches/0');
        expect(flow1).toEqual({
          pageGenerators: [],
          routers: [
            {
              branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}, {_importId: '1234', type: 'import'}]}],
              id: 'router1',
            }, {
              id: 'router2', branches: [{name: 'branch2', pageProcessors: [{setupInProgress: true}, {type: 'import', _importId: '5678'}]}],
            }],
        });
      });

      test('should add at the position when index is given for given router', () => {
        const flow1 = cloneDeep(flow);

        addPageProcessor(flow1, 0, '/routers/1/branches/0');
        expect(flow1).toEqual({
          pageGenerators: [],
          routers: [
            {
              branches: [{name: 'branch1', pageProcessors: [{_importId: '1234', type: 'import'}]}],
              id: 'router1',
            }, {
              id: 'router2', branches: [{name: 'branch2', pageProcessors: [{setupInProgress: true}, {setupInProgress: true}, {type: 'import', _importId: '5678'}]}],
            }],
        });
      });
    });
  });
});

describe('deletePPStepForOldSchema util function test', () => {
  test('should do nothing when flow is empty', () => {
    const flow = undefined;

    deletePPStepForOldSchema(flow, '/routers/0/branches/0/pageProcessors/1');
    expect(flow).toBeUndefined();
  });
  test('should delete the pageProcessor as per path given', () => {
    const flow = {pageProcessors: [{setupInProgress: true}, {_importId: '1234'}]};

    deletePPStepForOldSchema(flow, '/routers/0/branches/0/pageProcessors/1');
    expect(flow).toEqual({pageProcessors: [{setupInProgress: true}]});
  });
  test('should not change anything with path is not valid', () => {
    const flow = {pageProcessors: [{setupInProgress: true}, {_importId: '1234'}]};

    deletePPStepForOldSchema(flow, 'routers/2/branches/0/pageProcessors/1');
    expect(flow).toEqual({pageProcessors: [{setupInProgress: true}, {_importId: '1234'}]});
  });
  test('should not change anything with path is not valid1', () => {
    const flow = {pageProcessors: [{setupInProgress: true}, {_importId: '1234'}]};

    deletePPStepForOldSchema(flow, '/routers/0/branches/0/pageProcessors/11');
    expect(flow).toEqual({pageProcessors: [{setupInProgress: true}, {_importId: '1234'}]});
  });
});

describe('moveStepFunction util function test', () => {
  test('should change nothing or not throw any error when flow or stepInfo is missing', () => {
    const flow = {id: 'flow1'};
    const flowInput = {...flow};

    moveStepFunction(flowInput);
    expect(flow).toEqual(flowInput);
    expect(() => moveStepFunction(flowInput)).not.toThrow();
    expect(() => moveStepFunction()).not.toThrow();
  });
  test('should move steps as expected for page generators', () => {
    const flow = {pageGenerators: [{_exportId: 1}, {_exportId: 2}, {_exportId: 3}], pageProcessors: []};

    moveStepFunction(flow, {itemType: 'pg', sourceIndex: 0, targetIndex: 1});
    expect(flow).toEqual({pageGenerators: [{_exportId: 2}, {_exportId: 1}, {_exportId: 3}], pageProcessors: []});
    moveStepFunction(flow, {itemType: 'pg', sourceIndex: 0, targetIndex: 1});
    expect(flow).toEqual({pageGenerators: [{_exportId: 1}, {_exportId: 2}, {_exportId: 3}], pageProcessors: []});
    moveStepFunction(flow, {itemType: 'pg', sourceIndex: 1, targetIndex: 2});
    expect(flow).toEqual({pageGenerators: [{_exportId: 1}, {_exportId: 3}, {_exportId: 2}], pageProcessors: []});
  });

  test('should move steps as expected for pageProcessors in linear flow', () => {
    const flow = {pageGenerators: [{_exportId: 1}], pageProcessors: [{id: 1}, {id: 2}, {id: 3}, {id: 4}]};

    moveStepFunction(flow, { sourceIndex: 0, targetIndex: 1, position: 'right'});
    expect(flow).toEqual({pageGenerators: [{_exportId: 1}], pageProcessors: [{id: 2}, {id: 1}, {id: 3}, {id: 4}]});
    moveStepFunction(flow, { sourceIndex: 2, targetIndex: 3});
    expect(flow).toEqual({pageGenerators: [{_exportId: 1}], pageProcessors: [{id: 2}, {id: 1}, {id: 4}, {id: 3}]});
    moveStepFunction(flow, { sourceIndex: 3, targetIndex: 1, position: 'right'});
    expect(flow).toEqual({pageGenerators: [{_exportId: 1}], pageProcessors: [{id: 2}, {id: 1}, {id: 3}, {id: 4}]});
    moveStepFunction(flow, { sourceIndex: 3, targetIndex: 1, position: 'left'});
    expect(flow).toEqual({pageGenerators: [{_exportId: 1}], pageProcessors: [{id: 2}, {id: 4}, {id: 1}, {id: 3}]});
  });
  test('should move steps as expected for pageProcessors in branched flow', () => {
    const flow = {pageGenerators: [{_exportId: 1}],
      routers: [
        {id: 1, branches: [{name: 'r1b1', pageProcessors: [{id: 'r1b1p1'}, {id: 'r1b1p2'}]}] },
        {id: 2, branches: [{name: 'r2b1', pageProcessors: [{id: 'r2b1p1'}, {id: 'r2b1p2'}]}, {name: 'r2b2', pageProcessors: [{id: 'r2b2p1'}, {id: 'r2b2p2'}]}]},
      ]};

    moveStepFunction(flow, { sourcePath: '/routers/0/branches/0/pageProcessors/0', targetPath: '/routers/1/branches/0/pageProcessors/1', position: 'right'});
    expect(flow).toEqual({pageGenerators: [{_exportId: 1}],
      routers: [
        {id: 1, branches: [{name: 'r1b1', pageProcessors: [{id: 'r1b1p2'}]}] },
        {id: 2, branches: [{name: 'r2b1', pageProcessors: [{id: 'r2b1p1'}, {id: 'r2b1p2'}, {id: 'r1b1p1'}]}, {name: 'r2b2', pageProcessors: [{id: 'r2b2p1'}, {id: 'r2b2p2'}]}]},
      ]});
    moveStepFunction(flow, { sourcePath: '/routers/1/branches/0/pageProcessors/1', targetPath: '/routers/0/branches/0/pageProcessors/0', position: 'left'});
    expect(flow).toEqual({pageGenerators: [{_exportId: 1}],
      routers: [
        {id: 1, branches: [{name: 'r1b1', pageProcessors: [{id: 'r2b1p2'}, {id: 'r1b1p2'}]}] },
        {id: 2, branches: [{name: 'r2b1', pageProcessors: [{id: 'r2b1p1'}, {id: 'r1b1p1'}]}, {name: 'r2b2', pageProcessors: [{id: 'r2b2p1'}, {id: 'r2b2p2'}]}]},
      ]});
  });
});

describe('deletePGOrPPStepForRouters util function test', () => {
  const flow1 = {
    pageGenerators: [{id: '1234', setupInProgress: true}, {id: '5678', setupInProgress: true}],
    routers: [{
      id: 'router1',
      branches: [{
        pageProcessors: [{id: 'abcd', setupInProgress: true}, {id: '0000', _importId: '0000'}],
      }],
    }],
  };
  const elements = generateReactFlowGraph(flow1);
  const elementsMap = keyBy(elements, 'id');

  describe('should delete pageGenerators correctly', () => {
    test('should delete the pageGenerator by stepId', () => {
      const flow = cloneDeep(flow1);

      deletePGOrPPStepForRouters(flow, flow1, '1234', elementsMap);
      expect(flow).toEqual({
        pageGenerators: [{id: '5678', setupInProgress: true}],
        routers: [{branches: [{pageProcessors: [{id: 'abcd', setupInProgress: true}, {_importId: '0000', id: '0000'}]}], id: 'router1'}],
      });
    });
    test('should delete the pageGenerator by stepId1', () => {
      const flow = cloneDeep(flow1);

      deletePGOrPPStepForRouters(flow, flow1, '5678', elementsMap);
      expect(flow).toEqual({
        pageGenerators: [{id: '1234', setupInProgress: true}],
        routers: [{branches: [{pageProcessors: [{id: 'abcd', setupInProgress: true}, {_importId: '0000', id: '0000'}]}], id: 'router1'}],
      });
    });
    test('should not delete any step when invalid stepId is given', () => {
      const flow = cloneDeep(flow1);

      deletePGOrPPStepForRouters(flow, flow1, '56789', elementsMap);
      expect(flow).toEqual(flow1);
    });
    test('should add a empty pageGenerator if last pageGenerator is deleted', () => {
      const flow = cloneDeep(flow1);

      deletePGOrPPStepForRouters(flow, flow, '1234', elementsMap);
      deletePGOrPPStepForRouters(flow, flow, '5678', elementsMap);
      expect(flow).toEqual({
        pageGenerators: [{setupInProgress: true}],
        routers: [{branches: [{pageProcessors: [{id: 'abcd', setupInProgress: true}, {_importId: '0000', id: '0000'}]}], id: 'router1'}],
      });
    });
  });
  test('should delete the pageProcessor correctly', () => {
    const flow = cloneDeep(flow1);

    deletePGOrPPStepForRouters(flow, flow, 'abcd', elementsMap);
    expect(flow).toEqual({
      pageGenerators: [{id: '1234', setupInProgress: true}, {id: '5678', setupInProgress: true}],
      routers: [{branches: [{pageProcessors: [{_importId: '0000', id: '0000'}]}], id: 'router1'}],
    });
  });
  test('should not delete the pageProcessor if incorrect step passed', () => {
    const flow = cloneDeep(flow1);

    deletePGOrPPStepForRouters(flow, flow, 'abcd1', elementsMap);
    expect(flow).toEqual(flow1);
  });
});

describe('getPreceedingRoutersMap function', () => {
  test('getPreceedingRoutersMap function test', () => {
    const paths = getPreceedingRoutersMap(flow1);

    expect(paths).toEqual({
      router1: [],
      router2: ['router1'],
      router3: ['router1', 'router2'],
      router4: ['router1', 'router2'],
      router5: [],
      router6: ['router1', 'router2', 'router3'],
    });
  });
  test('getPreceedingRoutersMap function test1', () => {
    const paths = getPreceedingRoutersMap(flow2);

    expect(paths).toEqual({
      router1: [],
      router2: ['router1'],
      router3: ['router1', 'router2'],
      router4: ['router1', 'router2'],
    });
  });

  test('getPreceedingRoutersMap function test2', () => {
    const paths = getPreceedingRoutersMap(flow3);

    expect(paths).toEqual({
      router1: [],
      router2: ['router1'],
      router3: ['router1'],
      router4: ['router1', 'router2'],
      router5: ['router1', 'router2', 'router4'],
    });
  });
});

describe('generateDefaultEdge util function', () => {
  test('should return correct edge object', () => {
    const edge = generateDefaultEdge();

    expect(edge).toEqual({
      data: {
        path: '/routers/0/branches/0',
        processorCount: undefined,
        processorIndex: 0,
      },
      hidden: undefined,
      id: 'undefined-undefined',
      source: undefined,
      target: undefined,
      type: 'default',
    });
  });
  test('should return correct edge object with valid params', () => {
    const edge = generateDefaultEdge('source', 'target');

    expect(edge).toEqual({
      data: {
        path: '/routers/0/branches/0',
        processorCount: undefined,
        processorIndex: 0,
      },
      hidden: undefined,
      id: 'source-target',
      source: 'source',
      target: 'target',
      type: 'default',
    });
  });
  test('should return correct edge object with valid params and branch params', () => {
    const edge = generateDefaultEdge('source', 'target', {routerIndex: 1, branchIndex: 1, hidden: true, processorCount: 3});

    expect(edge).toEqual({
      data: {
        path: '/routers/1/branches/1',
        processorCount: 3,
        processorIndex: 0,
      },
      hidden: true,
      id: 'source-target',
      source: 'source',
      target: 'target',
      type: 'default',
    });
  });
  test('should return correct edge object with valid params and branch params1', () => {
    const edge = generateDefaultEdge('source', 'target', {routerIndex: 1, branchIndex: 1, index: 2, hidden: true, processorCount: 3});

    expect(edge).toEqual({
      data: {
        path: '/routers/1/branches/1',
        processorCount: 3,
        processorIndex: 2,
      },
      hidden: true,
      id: 'source-target',
      source: 'source',
      target: 'target',
      type: 'default',
    });
  });
});

describe('getSomePg util function', () => {
  test('should return expected object', () => {
    const obj = getSomePg('1234');

    expect(obj).toEqual({_exportId: '1234', id: '1234', skipRetries: true});
  });
});

describe('getSomePPImport util function', () => {
  test('should return expected object', () => {
    const obj = getSomePpImport('1234');

    expect(obj).toEqual({_importId: '1234', responseMapping: {fields: [], lists: []}, type: 'import'});
  });
});

describe('generateRouterNode util function', () => {
  test('should return expected router object', () => {
    const obj = generateRouterNode({}, 0);

    expect(obj).toEqual({data: {path: '/routers/0'}, id: anyShortId, type: 'merge'});
  });

  test('should return expected router object1', () => {
    const obj = generateRouterNode({id: 'routerId', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]}, 1);

    expect(obj).toEqual({data: {path: '/routers/1'}, id: 'routerId', type: 'merge'});
  });

  test('should return expected router object and correct router type', () => {
    const obj = generateRouterNode({id: 'routerId', routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]}, 1);

    expect(obj).toEqual({data: {path: '/routers/1', routeRecordsTo: 'first_matching_branch'}, id: 'routerId', type: 'router'});
  });
  test('should return expected router object with routerId populated and correct router type', () => {
    const obj = generateRouterNode({ routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]}, 1);

    expect(obj).toEqual({data: {path: '/routers/1', routeRecordsTo: 'first_matching_branch'}, id: anyShortId, type: 'router'});
  });
});

describe('generateNewTerminal util function', () => {
  test('should return correct terminal object', () => {
    const terminal = generateNewTerminal();

    expect(terminal).toEqual({data: {path: '/routers/undefined/branches/undefined/pageProcessors/-'}, draggable: false, id: anyShortId, type: 'terminal'});
  });
  test('should return correct terminal object with branch details', () => {
    const terminal = generateNewTerminal({branch: {pageProcessors: [{setupInProgress: true}, {setupInProgress: true}]}, branchIndex: 1, routerIndex: 1});

    expect(terminal).toEqual({data: {path: '/routers/1/branches/1/pageProcessors/2'}, draggable: false, id: anyShortId, type: 'terminal'});
  });

  test('should return correct terminal object with branch details1', () => {
    const terminal = generateNewTerminal({branch: {}, branchIndex: 1, routerIndex: 1});

    expect(terminal).toEqual({data: { path: '/routers/1/branches/1/pageProcessors/-'}, draggable: false, id: anyShortId, type: 'terminal'});
  });
});

describe('generateNewEmptyNode util function', () => {
  test('should return correct empty node object', () => {
    const terminal = generateNewEmptyNode();

    expect(terminal).toEqual({data: {path: '/routers/undefined/branches/undefined/pageProcessors/-'}, id: anyShortId, type: 'empty'});
  });
  test('should return correct terminal object with branch details', () => {
    const terminal = generateNewEmptyNode({branch: {pageProcessors: [{setupInProgress: true}, {setupInProgress: true}]}, branchIndex: 1, routerIndex: 1});

    expect(terminal).toEqual({data: { path: '/routers/1/branches/1/pageProcessors/2'}, id: anyShortId, type: 'empty'});
  });

  test('should return correct terminal object with branch details1', () => {
    const terminal = generateNewEmptyNode({branch: {}, branchIndex: 1, routerIndex: 1});

    expect(terminal).toEqual({data: {path: '/routers/1/branches/1/pageProcessors/-'}, id: anyShortId, type: 'empty'});
  });
});

describe('initializeFlowForReactFlowGraph util function', () => {
  test('should return empty when flowdoc is undefined', () => {
    expect(initializeFlowForReactFlow()).toBeUndefined();
  });
  test('should add pageGenerator and routers when flow is empty', () => {
    expect(initializeFlowForReactFlow({})).toEqual({
      pageGenerators: [{id: anyPPId, setupInProgress: true}],
      routers: [{branches: [{name: 'Branch 1.0', pageProcessors: [{id: anyPPId, setupInProgress: true}]}], id: anyShortId}],
    });
  });

  test('should add pageGenerator and routers when flow has pageProcessors', () => {
    expect(initializeFlowForReactFlow({
      pageGenerators: [{setupInProgress: true}],
      pageProcessors: [{_importId: '1234'}, {setupInProgress: true}],
    })).toEqual({
      pageGenerators: [{id: anyPPId, setupInProgress: true}],
      routers: [
        {
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [{_importId: '1234', id: '1234'}, {id: anyPPId, setupInProgress: true}],
            },
          ],
          id: anyShortId,
        },
      ],
    });
  });
  test('should add ids to pgs and pps and routers when flow has routers', () => {
    expect(initializeFlowForReactFlow({
      pageGenerators: [{setupInProgress: true}],
      routers: [
        {id: 'router1', branches: [{pageProcessors: [{_importId: '1234'}, {_exportId: '3456'}, {setupInProgress: true}]}]},
      ],
    })).toEqual({
      pageGenerators: [{id: anyPPId, setupInProgress: true}],
      routers: [
        {
          branches: [
            {pageProcessors: [{_importId: '1234', id: '1234'}, {_exportId: '3456', id: '3456'}, {id: anyPPId, setupInProgress: true}]},
          ],
          id: 'router1',
        },
      ],
    }
    );
  });
  test('should not add ids to pps and routers when flow has routers but no branches', () => {
    expect(initializeFlowForReactFlow({
      pageGenerators: [{_exportId: '123', setupInProgress: true}],
      routers: [
        {id: 'router1'},
      ],
    })).toEqual({pageGenerators: [
      {
        _exportId: '123',
        id: '123',
        setupInProgress: true,
      },
    ],
    routers: [
      {
        id: 'router1',
      },
    ]});
  });
});

describe('generatePageGeneratorNodesAndEdges util function', () => {
  test('should return empty array when pageGenerators doesnt exist', () => {
    expect(generatePageGeneratorNodesAndEdges()).toEqual([]);
    expect(generatePageGeneratorNodesAndEdges([])).toEqual([]);
    expect(generatePageGeneratorNodesAndEdges([{setupInProgress: true}])).toEqual([]);
  });
  test('should return array of nodes and edges when pageGenerators exist', () => {
    expect(generatePageGeneratorNodesAndEdges([{id: '12234', setupInProgress: true}], '1234')).toEqual([
      {data: {hideDelete: true, id: '12234', path: '/pageGenerators/0', setupInProgress: true}, id: '12234', type: 'pg'},
      {data: {path: '/routers/-1/branches/-1', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '12234-1234', source: '12234', target: '1234', type: 'default'},
    ]);
  });
  test('should return array of nodes and edges when pageGenerators exist1', () => {
    expect(generatePageGeneratorNodesAndEdges([{id: '1', setupInProgress: true}, {id: '2', setupInProgress: true}, {id: '3', setupInProgress: true}], '1234')).toEqual(
      [
        {data: {hideDelete: undefined, id: '1', path: '/pageGenerators/0', setupInProgress: true}, id: '1', type: 'pg'},
        {data: {hideDelete: undefined, id: '2', path: '/pageGenerators/1', setupInProgress: true}, id: '2', type: 'pg'},
        {data: {hideDelete: undefined, id: '3', path: '/pageGenerators/2', setupInProgress: true}, id: '3', type: 'pg'},
        {data: {path: '/routers/-1/branches/-1', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '1-1234', source: '1', target: '1234', type: 'default'},
        {data: {path: '/routers/-1/branches/-1', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '2-1234', source: '2', target: '1234', type: 'default'},
        {data: {path: '/routers/-1/branches/-1', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '3-1234', source: '3', target: '1234', type: 'default'}]
    );
  });
  test('should return array of nodes and edges when pageGenerators exist and hideDelete should be true when flow is in viewmode', () => {
    expect(generatePageGeneratorNodesAndEdges([{id: '1', setupInProgress: true}, {id: '2', setupInProgress: true}, {id: '3', setupInProgress: true}], '1234', true)).toEqual(
      [
        {data: {hideDelete: true, id: '1', path: '/pageGenerators/0', setupInProgress: true}, id: '1', type: 'pg'},
        {data: {hideDelete: true, id: '2', path: '/pageGenerators/1', setupInProgress: true}, id: '2', type: 'pg'},
        {data: {hideDelete: true, id: '3', path: '/pageGenerators/2', setupInProgress: true}, id: '3', type: 'pg'},
        {data: {path: '/routers/-1/branches/-1', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '1-1234', source: '1', target: '1234', type: 'default'},
        {data: {path: '/routers/-1/branches/-1', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '2-1234', source: '2', target: '1234', type: 'default'},
        {data: {path: '/routers/-1/branches/-1', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '3-1234', source: '3', target: '1234', type: 'default'}]
    );
  });
  test('should return array of nodes and edges when pageGenerators exist and routerId should be zero when first router is not virtual', () => {
    expect(generatePageGeneratorNodesAndEdges([{id: '1', setupInProgress: true}, {id: '2', setupInProgress: true}, {id: '3', setupInProgress: true}], '1234', true, true)).toEqual(
      [
        {data: {hideDelete: true, id: '1', path: '/pageGenerators/0', setupInProgress: true}, id: '1', type: 'pg'},
        {data: {hideDelete: true, id: '2', path: '/pageGenerators/1', setupInProgress: true}, id: '2', type: 'pg'},
        {data: {hideDelete: true, id: '3', path: '/pageGenerators/2', setupInProgress: true}, id: '3', type: 'pg'},
        {data: {path: '/routers/0/branches/0', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '1-1234', source: '1', target: '1234', type: 'default'},
        {data: {path: '/routers/0/branches/0', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '2-1234', source: '2', target: '1234', type: 'default'},
        {data: {path: '/routers/0/branches/0', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '3-1234', source: '3', target: '1234', type: 'default'}]
    );
  });
});

describe('generatePageProcessorNodesAndEdges util function', () => {
  test('should return empty array when no pageProcessors are sent', () => {
    const elements = generatePageProcessorNodesAndEdges();

    expect(elements).toEqual([]);
  });
  test('should return correct array of nodes and edges for valid flow', () => {
    const pageProcessors = [
      {id: '1', _importId: '1', type: 'import'},
      {id: '2', type: 'export', _exportId: '2'},
      {id: '3', setupInProgress: true},
    ];
    const branchData = {
      branch: {
        pageProcessors: [{setupInProgress: true}],
        name: 'branch1',
        nextRouterId: 'router2',
      },
      branchIndex: 1,
      routerIndex: 1,
      isVirtual: true,
      branchCount: 1,
    };

    expect(generatePageProcessorNodesAndEdges(pageProcessors, branchData)).toEqual([
      {data: {path: '/routers/1/branches/1', processorCount: 3, processorIndex: 1}, hidden: undefined, id: '1-2', source: '1', target: '2', type: 'default'},
      {data: {path: '/routers/1/branches/1', processorCount: 3, processorIndex: 2}, hidden: undefined, id: '2-3', source: '2', target: '3', type: 'default'},
      {data: {branch: {name: 'branch1', nextRouterId: 'router2', pageProcessors: [{setupInProgress: true}]}, hideDelete: false, isFirst: true, isLast: false, isVirtual: true, path: '/routers/1/branches/1/pageProcessors/0', resource: {_importId: '1', id: '1', type: 'import'}}, id: '1', type: 'pp'},
      {data: {branch: {name: 'branch1', nextRouterId: 'router2', pageProcessors: [{setupInProgress: true}]}, hideDelete: false, isFirst: false, isLast: false, isVirtual: true, path: '/routers/1/branches/1/pageProcessors/1', resource: {_exportId: '2', id: '2', type: 'export'}}, id: '2', type: 'pp'},
      {data: {branch: {name: 'branch1', nextRouterId: 'router2', pageProcessors: [{setupInProgress: true}]}, hideDelete: false, isFirst: false, isLast: false, isVirtual: true, path: '/routers/1/branches/1/pageProcessors/2', resource: {id: '3', setupInProgress: true}}, id: '3', type: 'pp'},
    ]);
  });

  test('should return correct array of nodes and edges for valid flow in readonly mode', () => {
    const pageProcessors = [
      {id: '1', _importId: '1', type: 'import'},
      {id: '2', type: 'export', _exportId: '2'},
      {id: '3', setupInProgress: true},
    ];
    const branchData = {
      branch: {
        pageProcessors: [{setupInProgress: true}],
        name: 'branch1',
        nextRouterId: 'router2',
      },
      branchIndex: 1,
      routerIndex: 1,
      isVirtual: true,
      branchCount: 1,
    };

    expect(generatePageProcessorNodesAndEdges(pageProcessors, branchData, true)).toEqual([
      {data: {path: '/routers/1/branches/1', processorCount: 3, processorIndex: 1}, hidden: undefined, id: '1-2', source: '1', target: '2', type: 'default'},
      {data: {path: '/routers/1/branches/1', processorCount: 3, processorIndex: 2}, hidden: undefined, id: '2-3', source: '2', target: '3', type: 'default'},
      {data: {branch: {name: 'branch1', nextRouterId: 'router2', pageProcessors: [{setupInProgress: true}]}, hideDelete: true, isFirst: true, isLast: false, isVirtual: true, path: '/routers/1/branches/1/pageProcessors/0', resource: {_importId: '1', id: '1', type: 'import'}}, id: '1', type: 'pp'},
      {data: {branch: {name: 'branch1', nextRouterId: 'router2', pageProcessors: [{setupInProgress: true}]}, hideDelete: true, isFirst: false, isLast: false, isVirtual: true, path: '/routers/1/branches/1/pageProcessors/1', resource: {_exportId: '2', id: '2', type: 'export'}}, id: '2', type: 'pp'},
      {data: {branch: {name: 'branch1', nextRouterId: 'router2', pageProcessors: [{setupInProgress: true}]}, hideDelete: true, isFirst: false, isLast: false, isVirtual: true, path: '/routers/1/branches/1/pageProcessors/2', resource: {id: '3', setupInProgress: true}}, id: '3', type: 'pp'},
    ]);
  });
});

describe('generateNodesAndEdgesFromNonBranchedFlow util function test', () => {
  test('should return correct array for empty flow', () => {
    expect(generateNodesAndEdgesFromNonBranchedFlow()).toEqual([
      {data: {path: '/routers/0/branches/0', processorIndex: 0}, id: expect.any(String), target: anyShortId, type: 'default'},
      {data: {path: '/routers/undefined/branches/undefined/pageProcessors/-'}, draggable: false, id: anyShortId, type: 'terminal'}]);
  });
  test('should return correct array for old flow', () => {
    expect(generateNodesAndEdgesFromNonBranchedFlow({_exportId: '1234', _importId: '2345'})).toEqual([
      {data: {_exportId: '1234', hideDelete: undefined, id: '1234', path: '/pageGenerators/0'}, id: '1234', type: 'pg'},
      {data: {path: '/routers/-1/branches/-1', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: '1234-2345', source: '1234', target: '2345', type: 'default'},
      {data: {branch: undefined, hideDelete: false, isFirst: true, isLast: true, isVirtual: undefined, path: '/routers/undefined/branches/undefined/pageProcessors/0', resource: {_importId: '2345', id: '2345'}}, id: '2345', type: 'pp'},
      {data: {path: '/routers/0/branches/0', processorCount: undefined, processorIndex: 0}, hidden: undefined, id: expect.any(String), source: '2345', target: anyShortId, type: 'default'}, {data: {path: '/routers/undefined/branches/undefined/pageProcessors/-'}, draggable: false, id: anyShortId, type: 'terminal'},
    ]);
  });

  test('should return correct array for linear flow', () => {
    expect(generateNodesAndEdgesFromNonBranchedFlow({
      name: 'flow1',
      pageGenerators: [{id: '1234', _exportId: '1234'}],
      pageProcessors: [
        {type: 'export', _exportId: '5678', id: '5678'},
        {id: '9012', type: 'import', _importId: '9012'},
      ],
    })).toEqual([{
      data: {
        _exportId: '1234',
        id: '1234',
        path: '/pageGenerators/0',
      },
      id: '1234',
      type: 'pg',
    }, {
      data: {
        path: '/routers/-1/branches/-1',
        processorIndex: 0,
      },
      id: '1234-5678',
      source: '1234',
      target: '5678',
      type: 'default',
    }, {
      data: {
        path: '/routers/0/branches/0',
        processorCount: 3,
        processorIndex: 1,
      },
      id: '5678-9012',
      source: '5678',
      target: '9012',
      type: 'default',
    }, {
      data: {
        hideDelete: false,
        isFirst: true,
        isLast: false,
        path: '/routers/undefined/branches/undefined/pageProcessors/0',
        resource: {
          _exportId: '5678',
          id: '5678',
          type: 'export',
        },
      },
      id: '5678',
      type: 'pp',
    }, {
      data: {
        hideDelete: false,
        isFirst: false,
        isLast: true,
        path: '/routers/undefined/branches/undefined/pageProcessors/1',
        resource: {
          _importId: '9012',
          id: '9012',
          type: 'import',
        },
      },
      id: '9012',
      type: 'pp',
    }, {
      data: {
        path: '/routers/0/branches/0',
        processorIndex: 2,
      },
      id: expect.any(String),
      source: '9012',
      target: anyShortId,
      type: 'default',
    }, {
      data: {
        path: '/routers/undefined/branches/undefined/pageProcessors/-',
      },
      draggable: false,
      id: anyShortId,
      type: 'terminal',
    }]);
  });

  test('should return correct array for linear flow in view mode', () => {
    expect(generateNodesAndEdgesFromNonBranchedFlow({
      name: 'flow1',
      pageGenerators: [{id: '1234', _exportId: '1234'}],
      pageProcessors: [
        {type: 'export', _exportId: '5678', id: '5678'},
        {id: '9012', type: 'import', _importId: '9012'},
      ],
    }, true)).toEqual([{
      data: {
        _exportId: '1234',
        hideDelete: true,
        id: '1234',
        path: '/pageGenerators/0',
      },
      id: '1234',
      type: 'pg',
    }, {
      data: {
        path: '/routers/-1/branches/-1',
        processorIndex: 0,
      },
      id: '1234-5678',
      source: '1234',
      target: '5678',
      type: 'default',
    }, {
      data: {
        path: '/routers/0/branches/0',
        processorCount: 3,
        processorIndex: 1,
      },
      id: '5678-9012',
      source: '5678',
      target: '9012',
      type: 'default',
    }, {
      data: {
        hideDelete: true,
        isFirst: true,
        isLast: false,
        path: '/routers/undefined/branches/undefined/pageProcessors/0',
        resource: {
          _exportId: '5678',
          id: '5678',
          type: 'export',
        },
      },
      id: '5678',
      type: 'pp',
    }, {
      data: {
        hideDelete: true,
        isFirst: false,
        isLast: true,
        path: '/routers/undefined/branches/undefined/pageProcessors/1',
        resource: {
          _importId: '9012',
          id: '9012',
          type: 'import',
        },
      },
      id: '9012',
      type: 'pp',
    }, {
      data: {
        path: '/routers/0/branches/0',
        processorIndex: 2,
      },
      id: expect.any(String),
      source: '9012',
      target: anyShortId,
      type: 'default',
    }, {
      data: {
        path: '/routers/undefined/branches/undefined/pageProcessors/-',
      },
      draggable: false,
      id: anyShortId,
      type: 'terminal',
    }]);
  });
});

describe('populateMergeData util function test', () => {
  test('populate merge data should not set draggable on single terminal node', () => {
    const elements = generateReactFlowGraph(flow4);

    populateMergeData(flow4, elements);
    const terminalNodes = elements.filter(el => el.type === GRAPH_ELEMENTS_TYPE.TERMINAL);
    // eslint-disable-next-line jest/no-conditional-in-test
    const edges = elements.filter(el => el.type === GRAPH_ELEMENTS_TYPE.EDGE && !!el.data.mergableTerminals);

    expect(terminalNodes).toHaveLength(1);
    expect(terminalNodes[0].draggable).toBe(false);
    expect(edges).toEqual([]);
  });
  test('populate merge data should  set draggable on all terminal nodes and edges should have mergableTerminals info', () => {
    const elements = generateReactFlowGraph(flow5);

    populateMergeData(flow5, elements);
    const terminalNodes = elements.filter(el => el.type === GRAPH_ELEMENTS_TYPE.TERMINAL);
    // eslint-disable-next-line jest/no-conditional-in-test
    const edges = elements.filter(el => el.type === GRAPH_ELEMENTS_TYPE.EDGE && !!el.data.mergableTerminals);

    expect(terminalNodes).toHaveLength(3);
    expect(terminalNodes[0].draggable).toBe(true);
    expect(terminalNodes[1].draggable).toBe(true);
    expect(terminalNodes[2].draggable).toBe(true);

    expect(terminalNodes[0].data.draggable).toBe(true);
    expect(terminalNodes[1].data.draggable).toBe(true);
    expect(terminalNodes[2].data.draggable).toBe(true);

    expect(edges).toHaveLength(7);
    expect(edges[0].data.mergableTerminals).toHaveLength(1);
    expect(edges[1].data.mergableTerminals).toHaveLength(1);
    expect(edges[2].data.mergableTerminals).toHaveLength(2);
    expect(edges[3].data.mergableTerminals).toHaveLength(2);
    expect(edges[4].data.mergableTerminals).toHaveLength(2);
    expect(edges[5].data.mergableTerminals).toHaveLength(1);
    expect(edges[6].data.mergableTerminals).toHaveLength(1);
  });
});

describe('generateNodesAndEdgesFromBranchedFlow util function test', () => {
  test('should return correct elements for a flow with virtual routers', () => {
    const elements = generateNodesAndEdgesFromBranchedFlow(flow6);

    expect(elements).toEqual([
      {
        id: '62cd472e8a7b1e641f295c4a',
        type: 'pg',
        data: {
          _exportId: '62cd472e8a7b1e641f295c4a',
          id: '62cd472e8a7b1e641f295c4a',
          path: '/pageGenerators/0',
        },
      },
      {
        id: '62cd472e8a7b1e641f295c4a-new-mlNjkmHer12',
        source: '62cd472e8a7b1e641f295c4a',
        target: anyPPId,
        data: {
          path: '/routers/0/branches/0',
          processorIndex: 0,
        },
        type: 'default',
      },
      {
        id: expect.any(String),
        source: anyPPId,
        target: anyShortId,
        data: {
          path: '/routers/0/branches/0',
          processorCount: 0,
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: 'Ko7qmyHer12',
        type: 'router',
        data: {
          path: '/routers/1',
          routeRecordsTo: 'first_matching_branch',
        },
      },
      {
        id: 'Ko7qmyHer12-62cbc0908c8337627f657872',
        source: 'Ko7qmyHer12',
        target: '62cbc0908c8337627f657872',
        data: {
          path: '/routers/1/branches/0',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: '62cda4fb80c105471745f0f1-VlrnY7Her12',
        source: '62cda4fb80c105471745f0f1',
        target: 'VlrnY7Her12',
        data: {
          path: '/routers/1/branches/0',
          processorCount: 3,
          processorIndex: 2,
        },
        type: 'default',
      },
      {
        id: 'VlrnY7Her12',
        type: 'merge',
        data: {
          path: '/routers/3',
          mergableTerminals: [
            anyShortId,
          ],
        },
      },
      {
        id: anyShortId,
        type: 'empty',
        data: {
          name: '',
          path: '/routers/3/branches/0/pageProcessors/-',
        },
      },
      {
        id: expect.any(String),
        source: 'VlrnY7Her12',
        target: anyShortId,
        data: {
          path: '/routers/3/branches/0',
          processorIndex: 0,
        },
        type: 'default',
      },
      {
        id: expect.any(String),
        source: anyShortId,
        target: 'xwELf2Her12',
        data: {
          path: '/routers/3/branches/0',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: 'xwELf2Her12',
        type: 'router',
        data: {
          path: '/routers/2',
          routeRecordsTo: 'first_matching_branch',
        },
      },
      {
        id: expect.any(String),
        source: 'xwELf2Her12',
        target: anyPPId,
        data: {
          path: '/routers/2/branches/0',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: anyShortId,
        type: 'terminal',
        draggable: true,
        data: {
          name: 'Branch 2.0',
          path: '/routers/2/branches/0/pageProcessors/1',
          draggable: true,
        },
      },
      {
        id: expect.any(String),
        source: 'new-3LxDQfHer12',
        target: anyShortId,
        data: {
          path: '/routers/2/branches/0',
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: 'new-3LxDQfHer12',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            setupInProgress: true,
            id: 'new-3LxDQfHer12',
          },
          branch: {
            name: 'Branch 2.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                setupInProgress: true,
                id: 'new-3LxDQfHer12',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: true,
          showLeft: true,
          showRight: true,
          path: '/routers/2/branches/0/pageProcessors/0',
        },
      },
      {
        id: 'xwELf2Her12-new-vYHBhYHer12',
        source: 'xwELf2Her12',
        target: 'new-vYHBhYHer12',
        data: {
          path: '/routers/2/branches/1',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: anyShortId,
        type: 'terminal',
        draggable: true,
        data: {
          name: 'Branch 2.1',
          path: '/routers/2/branches/1/pageProcessors/1',
          draggable: true,
        },
      },
      {
        id: expect.any(String),
        source: 'new-vYHBhYHer12',
        target: anyShortId,
        data: {
          path: '/routers/2/branches/1',
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: 'new-vYHBhYHer12',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            setupInProgress: true,
            id: 'new-vYHBhYHer12',
          },
          branch: {
            name: 'Branch 2.1',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                setupInProgress: true,
                id: 'new-vYHBhYHer12',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: true,
          showLeft: true,
          showRight: true,
          path: '/routers/2/branches/1/pageProcessors/0',
        },
      },
      {
        id: '62cbc0908c8337627f657872-62cda4fb80c105471745f0f1',
        source: '62cbc0908c8337627f657872',
        target: '62cda4fb80c105471745f0f1',
        data: {
          path: '/routers/1/branches/0',
          processorCount: 3,
          processorIndex: 1,
          mergableTerminals: [
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: '62cbc0908c8337627f657872',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [
                {
                  extract: 'id',
                  generate: 'id1',
                },
              ],
              lists: [

              ],
            },
            type: 'import',
            _importId: '62cbc0908c8337627f657872',
            id: '62cbc0908c8337627f657872',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [
                    {
                      extract: 'id',
                      generate: 'id1',
                    },
                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cbc0908c8337627f657872',
                id: '62cbc0908c8337627f657872',
              },
              {
                responseMapping: {
                  fields: [
                    {
                      extract: 'errors',
                      generate: 'errors21',
                    },
                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cda4fb80c105471745f0f1',
                id: '62cda4fb80c105471745f0f1',
              },
            ],
            nextRouterId: 'VlrnY7Her12',
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: false,
          showLeft: true,
          showRight: true,
          path: '/routers/1/branches/0/pageProcessors/0',
        },
      },
      {
        id: '62cda4fb80c105471745f0f1',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [
                {
                  extract: 'errors',
                  generate: 'errors21',
                },
              ],
              lists: [

              ],
            },
            type: 'import',
            _importId: '62cda4fb80c105471745f0f1',
            id: '62cda4fb80c105471745f0f1',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [
                    {
                      extract: 'id',
                      generate: 'id1',
                    },
                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cbc0908c8337627f657872',
                id: '62cbc0908c8337627f657872',
              },
              {
                responseMapping: {
                  fields: [
                    {
                      extract: 'errors',
                      generate: 'errors21',
                    },
                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cda4fb80c105471745f0f1',
                id: '62cda4fb80c105471745f0f1',
              },
            ],
            nextRouterId: 'VlrnY7Her12',
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: false,
          isLast: false,
          showRight: true,
          path: '/routers/1/branches/0/pageProcessors/1',
        },
      },
      {
        id: 'Ko7qmyHer12-62cda0873d0dab426139b793',
        source: 'Ko7qmyHer12',
        target: '62cda0873d0dab426139b793',
        data: {
          path: '/routers/1/branches/1',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: '62cda0873d0dab426139b793-VlrnY7Her12',
        source: '62cda0873d0dab426139b793',
        target: 'VlrnY7Her12',
        data: {
          path: '/routers/1/branches/1',
          processorCount: 3,
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: '62cda0873d0dab426139b793',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            type: 'import',
            _importId: '62cda0873d0dab426139b793',
            id: '62cda0873d0dab426139b793',
          },
          branch: {
            name: 'Branch 1.1',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cda0873d0dab426139b793',
                id: '62cda0873d0dab426139b793',
              },
            ],
            nextRouterId: 'VlrnY7Her12',
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: false,
          showLeft: true,
          showRight: true,
          path: '/routers/1/branches/1/pageProcessors/0',
        },
      },
      {
        id: 'Ko7qmyHer12-new-z0jzjMHer12',
        source: 'Ko7qmyHer12',
        target: anyPPId,
        data: {
          path: '/routers/1/branches/2',
          processorIndex: 0,
        },
        type: 'default',
      },
      {
        id: anyShortId,
        type: 'terminal',
        draggable: true,
        data: {
          name: 'Branch 3.2',
          path: '/routers/1/branches/2/pageProcessors/1',
          draggable: true,
        },
      },
      {
        id: expect.any(String),
        source: anyPPId,
        target: anyShortId,
        data: {
          path: '/routers/1/branches/2',
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: 'new-z0jzjMHer12',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            setupInProgress: true,
            id: 'new-z0jzjMHer12',
          },
          branch: {
            name: 'Branch 3.2',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                setupInProgress: true,
                id: 'new-z0jzjMHer12',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: true,
          showLeft: true,
          showRight: true,
          path: '/routers/1/branches/2/pageProcessors/0',
        },
      },
      {
        id: 'new-mlNjkmHer12',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            setupInProgress: true,
            id: 'new-mlNjkmHer12',
          },
          branch: {
            name: '',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                setupInProgress: true,
                id: 'new-mlNjkmHer12',
              },
            ],
            nextRouterId: 'Ko7qmyHer12',
          },
          hideDelete: false,
          isVirtual: true,
          isFirst: true,
          isLast: false,
          showLeft: true,
          showRight: true,
          path: '/routers/0/branches/0/pageProcessors/0',
        },
      },
    ]);
  });
});
describe('generateReactFlowGraph util function test', () => {
  test('should return if flow is empty', () => {
    expect(generateReactFlowGraph()).toBeUndefined();
  });
  test('should call generateNodesAndEdgesFromNonBranchedFlow if flow does not have routers', () => {
    expect(generateReactFlowGraph({
      name: 'flow1',
      pageGenerators: [{id: '1234', _exportId: '1234'}],
      pageProcessors: [
        {type: 'export', _exportId: '5678', id: '5678'},
        {id: '9012', type: 'import', _importId: '9012'},
      ],
    })).toEqual([{
      data: {
        _exportId: '1234',
        id: '1234',
        path: '/pageGenerators/0',
      },
      id: '1234',
      type: 'pg',
    }, {
      data: {
        path: '/routers/-1/branches/-1',
        processorIndex: 0,
      },
      id: '1234-5678',
      source: '1234',
      target: '5678',
      type: 'default',
    }, {
      data: {
        path: '/routers/0/branches/0',
        processorCount: 3,
        processorIndex: 1,
      },
      id: '5678-9012',
      source: '5678',
      target: '9012',
      type: 'default',
    }, {
      data: {
        hideDelete: false,
        isFirst: true,
        isLast: false,
        path: '/routers/undefined/branches/undefined/pageProcessors/0',
        resource: {
          _exportId: '5678',
          id: '5678',
          type: 'export',
        },
      },
      id: '5678',
      type: 'pp',
    }, {
      data: {
        hideDelete: false,
        isFirst: false,
        isLast: true,
        path: '/routers/undefined/branches/undefined/pageProcessors/1',
        resource: {
          _importId: '9012',
          id: '9012',
          type: 'import',
        },
      },
      id: '9012',
      type: 'pp',
    }, {
      data: {
        path: '/routers/0/branches/0',
        processorIndex: 2,
      },
      id: expect.any(String),
      source: '9012',
      target: anyShortId,
      type: 'default',
    }, {
      data: {
        path: '/routers/undefined/branches/undefined/pageProcessors/-',
      },
      draggable: false,
      id: anyShortId,
      type: 'terminal',
    }]);
  });
  test('should call generateNodesAndEdgesFromBranchedFlow if flow has routers', () => {
    const res = generateReactFlowGraph(flow6);

    expect(res).toEqual([
      {
        id: '62cd472e8a7b1e641f295c4a',
        type: 'pg',
        data: {
          _exportId: '62cd472e8a7b1e641f295c4a',
          id: '62cd472e8a7b1e641f295c4a',
          path: '/pageGenerators/0',
        },
      },
      {
        id: '62cd472e8a7b1e641f295c4a-new-mlNjkmHer12',
        source: '62cd472e8a7b1e641f295c4a',
        target: anyPPId,
        data: {
          path: '/routers/0/branches/0',
          processorIndex: 0,
        },
        type: 'default',
      },
      {
        id: expect.any(String),
        source: anyPPId,
        target: anyShortId,
        data: {
          path: '/routers/0/branches/0',
          processorCount: 0,
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: 'Ko7qmyHer12',
        type: 'router',
        data: {
          path: '/routers/1',
          routeRecordsTo: 'first_matching_branch',
        },
      },
      {
        id: 'Ko7qmyHer12-62cbc0908c8337627f657872',
        source: 'Ko7qmyHer12',
        target: '62cbc0908c8337627f657872',
        data: {
          path: '/routers/1/branches/0',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: '62cda4fb80c105471745f0f1-VlrnY7Her12',
        source: '62cda4fb80c105471745f0f1',
        target: 'VlrnY7Her12',
        data: {
          path: '/routers/1/branches/0',
          processorCount: 3,
          processorIndex: 2,
        },
        type: 'default',
      },
      {
        id: 'VlrnY7Her12',
        type: 'merge',
        data: {
          path: '/routers/3',
          mergableTerminals: [
            anyShortId,
          ],
        },
      },
      {
        id: anyShortId,
        type: 'empty',
        data: {
          name: '',
          path: '/routers/3/branches/0/pageProcessors/-',
        },
      },
      {
        id: expect.any(String),
        source: 'VlrnY7Her12',
        target: anyShortId,
        data: {
          path: '/routers/3/branches/0',
          processorIndex: 0,
        },
        type: 'default',
      },
      {
        id: expect.any(String),
        source: anyShortId,
        target: 'xwELf2Her12',
        data: {
          path: '/routers/3/branches/0',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: 'xwELf2Her12',
        type: 'router',
        data: {
          path: '/routers/2',
          routeRecordsTo: 'first_matching_branch',
        },
      },
      {
        id: expect.any(String),
        source: 'xwELf2Her12',
        target: anyPPId,
        data: {
          path: '/routers/2/branches/0',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: anyShortId,
        type: 'terminal',
        draggable: true,
        data: {
          name: 'Branch 2.0',
          path: '/routers/2/branches/0/pageProcessors/1',
          draggable: true,
        },
      },
      {
        id: expect.any(String),
        source: 'new-3LxDQfHer12',
        target: anyShortId,
        data: {
          path: '/routers/2/branches/0',
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: 'new-3LxDQfHer12',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            setupInProgress: true,
            id: 'new-3LxDQfHer12',
          },
          branch: {
            name: 'Branch 2.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                setupInProgress: true,
                id: 'new-3LxDQfHer12',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: true,
          showLeft: true,
          showRight: true,
          path: '/routers/2/branches/0/pageProcessors/0',
        },
      },
      {
        id: 'xwELf2Her12-new-vYHBhYHer12',
        source: 'xwELf2Her12',
        target: 'new-vYHBhYHer12',
        data: {
          path: '/routers/2/branches/1',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: anyShortId,
        type: 'terminal',
        draggable: true,
        data: {
          name: 'Branch 2.1',
          path: '/routers/2/branches/1/pageProcessors/1',
          draggable: true,
        },
      },
      {
        id: expect.any(String),
        source: 'new-vYHBhYHer12',
        target: anyShortId,
        data: {
          path: '/routers/2/branches/1',
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: 'new-vYHBhYHer12',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            setupInProgress: true,
            id: 'new-vYHBhYHer12',
          },
          branch: {
            name: 'Branch 2.1',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                setupInProgress: true,
                id: 'new-vYHBhYHer12',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: true,
          showLeft: true,
          showRight: true,
          path: '/routers/2/branches/1/pageProcessors/0',
        },
      },
      {
        id: '62cbc0908c8337627f657872-62cda4fb80c105471745f0f1',
        source: '62cbc0908c8337627f657872',
        target: '62cda4fb80c105471745f0f1',
        data: {
          path: '/routers/1/branches/0',
          processorCount: 3,
          processorIndex: 1,
          mergableTerminals: [
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: '62cbc0908c8337627f657872',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [
                {
                  extract: 'id',
                  generate: 'id1',
                },
              ],
              lists: [

              ],
            },
            type: 'import',
            _importId: '62cbc0908c8337627f657872',
            id: '62cbc0908c8337627f657872',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [
                    {
                      extract: 'id',
                      generate: 'id1',
                    },
                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cbc0908c8337627f657872',
                id: '62cbc0908c8337627f657872',
              },
              {
                responseMapping: {
                  fields: [
                    {
                      extract: 'errors',
                      generate: 'errors21',
                    },
                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cda4fb80c105471745f0f1',
                id: '62cda4fb80c105471745f0f1',
              },
            ],
            nextRouterId: 'VlrnY7Her12',
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: false,
          showLeft: true,
          showRight: true,
          path: '/routers/1/branches/0/pageProcessors/0',
        },
      },
      {
        id: '62cda4fb80c105471745f0f1',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [
                {
                  extract: 'errors',
                  generate: 'errors21',
                },
              ],
              lists: [

              ],
            },
            type: 'import',
            _importId: '62cda4fb80c105471745f0f1',
            id: '62cda4fb80c105471745f0f1',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [
                    {
                      extract: 'id',
                      generate: 'id1',
                    },
                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cbc0908c8337627f657872',
                id: '62cbc0908c8337627f657872',
              },
              {
                responseMapping: {
                  fields: [
                    {
                      extract: 'errors',
                      generate: 'errors21',
                    },
                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cda4fb80c105471745f0f1',
                id: '62cda4fb80c105471745f0f1',
              },
            ],
            nextRouterId: 'VlrnY7Her12',
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: false,
          isLast: false,
          showRight: true,
          path: '/routers/1/branches/0/pageProcessors/1',
        },
      },
      {
        id: 'Ko7qmyHer12-62cda0873d0dab426139b793',
        source: 'Ko7qmyHer12',
        target: '62cda0873d0dab426139b793',
        data: {
          path: '/routers/1/branches/1',
          processorIndex: 0,
          mergableTerminals: [
            anyShortId,
          ],
        },
        type: 'default',
      },
      {
        id: '62cda0873d0dab426139b793-VlrnY7Her12',
        source: '62cda0873d0dab426139b793',
        target: 'VlrnY7Her12',
        data: {
          path: '/routers/1/branches/1',
          processorCount: 3,
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: '62cda0873d0dab426139b793',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            type: 'import',
            _importId: '62cda0873d0dab426139b793',
            id: '62cda0873d0dab426139b793',
          },
          branch: {
            name: 'Branch 1.1',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                type: 'import',
                _importId: '62cda0873d0dab426139b793',
                id: '62cda0873d0dab426139b793',
              },
            ],
            nextRouterId: 'VlrnY7Her12',
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: false,
          showLeft: true,
          showRight: true,
          path: '/routers/1/branches/1/pageProcessors/0',
        },
      },
      {
        id: 'Ko7qmyHer12-new-z0jzjMHer12',
        source: 'Ko7qmyHer12',
        target: anyPPId,
        data: {
          path: '/routers/1/branches/2',
          processorIndex: 0,
        },
        type: 'default',
      },
      {
        id: anyShortId,
        type: 'terminal',
        draggable: true,
        data: {
          name: 'Branch 3.2',
          path: '/routers/1/branches/2/pageProcessors/1',
          draggable: true,
        },
      },
      {
        id: expect.any(String),
        source: anyPPId,
        target: anyShortId,
        data: {
          path: '/routers/1/branches/2',
          processorIndex: 1,
        },
        type: 'default',
      },
      {
        id: 'new-z0jzjMHer12',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            setupInProgress: true,
            id: 'new-z0jzjMHer12',
          },
          branch: {
            name: 'Branch 3.2',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                setupInProgress: true,
                id: 'new-z0jzjMHer12',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: true,
          showLeft: true,
          showRight: true,
          path: '/routers/1/branches/2/pageProcessors/0',
        },
      },
      {
        id: 'new-mlNjkmHer12',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [

              ],
              lists: [

              ],
            },
            setupInProgress: true,
            id: 'new-mlNjkmHer12',
          },
          branch: {
            name: '',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [

                  ],
                  lists: [

                  ],
                },
                setupInProgress: true,
                id: 'new-mlNjkmHer12',
              },
            ],
            nextRouterId: 'Ko7qmyHer12',
          },
          hideDelete: false,
          isVirtual: true,
          isFirst: true,
          isLast: false,
          showLeft: true,
          showRight: true,
          path: '/routers/0/branches/0/pageProcessors/0',
        },
      },
    ]);
  });
});
describe('mergeBetweenPPAndRouter util function test', () => {
  test('should return correct patch set for given params', () => {
    const edgeSource = {data: {path: '/routers/0/branches/0/pageProcessors/0'}};
    const sourceElement = {data: {path: '/routers/1/branches/0/pageProcessors/0'}};
    const edgeTarget = {id: '123'};
    const patchSet = [];

    mergeBetweenPPAndRouter({edgeSource, patchSet, sourceElement, edgeTarget});
    expect(patchSet).toEqual(
      [{op: 'add', path: '/routers/-', value: {branches: [{nextRouterId: '123', pageProcessors: []}], id: anyShortId}},
        {op: 'replace', path: '/routers/0/branches/0/nextRouterId', value: anyShortId},
        {op: 'replace', path: '/routers/1/branches/0/nextRouterId', value: anyShortId}]
    );
  });
});
describe('mergeTerminalNodes util function test', () => {
  test('should return correct patch set for given params', () => {
    const targetElement = {data: {path: '/routers/0/branches/0/pageProcessors/0'}};
    const sourceElement = {data: {path: '/routers/1/branches/0/pageProcessors/0'}};
    const patchSet = [];

    mergeTerminalNodes({ patchSet, sourceElement, targetElement });
    expect(patchSet).toEqual(
      [{op: 'add', path: '/routers/1/branches/0/nextRouterId', value: anyShortId},
        {op: 'add', path: '/routers/0/branches/0/nextRouterId', value: anyShortId},
        {op: 'add', path: '/routers/-', value: {branches: [{pageProcessors: [{setupInProgress: true}]}], id: anyShortId}}]
    );
  });
});
describe('mergeBetweenRouterAndPP util function test', () => {
  test('should return correct patch set for given params', () => {
    const flowDoc = {
      _id: '1',
      routers: [
        {
          id: '1',
          branches: [
            {
              pageProcessors: [{id: '1'}],
              nextRouterId: '2',
            },
          ],
        },
        {id: '2'},
      ],
    };
    const edgeTarget = {data: {path: '/routers/0/branches/0/pageProcessors/0'}};
    const sourceElement = {data: {path: '/routers/1/branches/0/pageProcessors/0'}};
    const patchSet = [];

    mergeBetweenRouterAndPP({flowDoc, edgeTarget, patchSet, sourceElement});
    expect(patchSet).toEqual(
      [{op: 'add', path: '/routers/-', value: {branches: [{nextRouterId: '2', pageProcessors: [{id: '1'}]}], id: anyShortId}},
        {op: 'replace', path: '/routers/1/branches/0/nextRouterId', value: anyShortId},
        {op: 'replace', path: '/routers/0/branches/0/pageProcessors', value: []},
        {op: 'replace', path: '/routers/0/branches/0/nextRouterId', value: anyShortId}]
    );
  });
});
describe('splitPPArray util function test', () => {
  test('should split an array at given index and return the two halfs', () => {
    const ar = [0, 1, 2, 3, 4, 5];

    expect(splitPPArray(ar, 3)).toEqual([[0, 1, 2], [3, 4, 5]]);
  });
});
describe('deleteUnUsedRouters function', () => {
  test('deleteUnUsedRouters function test', () => {
    const flow3Clone = cloneDeep(flow3);

    deleteUnUsedRouters(flow3Clone);

    expect(flow3Clone).toEqual({
      pageGenerators: [],
      routers: [
        {
          branches: [
            {name: 'branch1.1', nextRouterId: 'router2', pageProcessors: [{_importId: 'import1', type: 'import'}, {_importId: 'import2', type: 'import'}]},
            {name: 'branch1.2', nextRouterId: undefined, pageProcessors: [{_importId: 'import3', type: 'import'}, {_importId: 'import4', type: 'import'}, {_importId: 'import1', type: 'import'}, {_importId: 'import2', type: 'import'}]},
            {name: 'branch1.3', pageProcessors: [{_importId: 'import5', type: 'import'}, {_importId: 'import6', type: 'import'}]}],
          id: 'router1',
        },
        {
          branches: [
            {name: 'branch2.1', nextRouterId: undefined, pageProcessors: [{_importId: 'import1', type: 'import'}, {_importId: 'import2', type: 'import'}, {_importId: 'import1', type: 'import'}, {_importId: 'import2', type: 'import'}, {_importId: 'import1', type: 'import'}, {_importId: 'import2', type: 'import'}]},
            {name: 'branch2.2', pageProcessors: [{_importId: 'import3', type: 'import'}, {_importId: 'import4', type: 'import'}]},
          ],
          id: 'router2',
        }]});
  });
});
describe('mergeTerminalToAnEdge util function test', () => {
  test('should correctly update the patchSet for merging router and a pp', () => {
    const flowDoc = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T13:24:52.482Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          setupInProgress: true,
          id: 'new-JXOwJl',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          routeRecordsUsing: 'input_filters',
          id: '8KgdZQ',
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
                  setupInProgress: true,
                  id: 'new-A0JQqR',
                },
              ],
              nextRouterId: 'atLkWY',
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
                  id: 'new-ixXs8k',
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
          id: 'atLkWY',
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
                  id: 'new-MDN2aw',
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
                  id: 'new-OKMTLa',
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
    const elements = {
      atLkWY: {
        id: 'atLkWY',
        type: 'router',
        data: {
          path: '/routers/1',
          router: {
            routeRecordsUsing: 'input_filters',
            id: 'atLkWY',
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
                    id: 'new-MDN2aw',
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
                    id: 'new-OKMTLa',
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
      'new-OKMTLa': {
        id: 'new-OKMTLa',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [],
              lists: [],
            },
            setupInProgress: true,
            id: 'new-OKMTLa',
          },
          branch: {
            name: 'Branch 2.1',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-OKMTLa',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: true,
          path: '/routers/1/branches/1/pageProcessors/0',
        },
      },
    };
    const sourceElement = {
      id: 'xwxO3x',
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
            setupInProgress: true,
            id: 'new-ixXs8k',
          },
        ],
        path: '/routers/0/branches/1/pageProcessors/1',
        draggable: true,
      },
    };
    const targetElement = {
      id: 'atLkWY-new-OKMTLa',
      source: 'atLkWY',
      target: 'new-OKMTLa',
      data: {
        path: '/routers/1/branches/1',
        processorIndex: 0,
        mergableTerminals: [
          'nzICGo',
          'xwxO3x',
        ],
      },
      type: 'default',
    };
    const patchSet = [];

    mergeTerminalToAnEdge({ flowDoc, elements, patchSet, sourceElement, targetElement });

    expect(patchSet).toEqual(
      [{op: 'add', path: '/routers/-', value: {branches: [{nextRouterId: undefined, pageProcessors: [{id: 'new-OKMTLa', responseMapping: {fields: [], lists: []}, setupInProgress: true}]}], id: anyShortId}},
        {op: 'replace', path: '/routers/0/branches/1/nextRouterId', value: anyShortId},
        {op: 'replace', path: '/routers/1/branches/1/pageProcessors', value: []},
        {op: 'replace', path: '/routers/1/branches/1/nextRouterId', value: anyShortId}]
    );
  });
  test('should correctly update the patchSet for merging pp to a router', () => {
    const flowDoc = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T13:28:43.280Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          setupInProgress: true,
          id: 'new-rMWPGe',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          routeRecordsUsing: 'input_filters',
          id: '8KgdZQ',
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
                  setupInProgress: true,
                  id: 'new-h2HmoD',
                },
              ],
              nextRouterId: 'atLkWY',
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
                  id: 'new-v9O25C',
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
          id: 'atLkWY',
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
                  id: 'new-m1zh1c',
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
                  id: 'new-O872CG',
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
    const elements = {
      atLkWY: {
        id: 'atLkWY',
        type: 'router',
        data: {
          path: '/routers/1',
          router: {
            routeRecordsUsing: 'input_filters',
            id: 'atLkWY',
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
                    id: 'new-m1zh1c',
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
                    id: 'new-O872CG',
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
      'new-h2HmoD': {
        id: 'new-h2HmoD',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [],
              lists: [],
            },
            setupInProgress: true,
            id: 'new-h2HmoD',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-h2HmoD',
              },
            ],
            nextRouterId: 'atLkWY',
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: false,
          path: '/routers/0/branches/0/pageProcessors/0',
        },
      },
    };
    const sourceElement = {
      id: '4KwSiv',
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
            setupInProgress: true,
            id: 'new-v9O25C',
          },
        ],
        path: '/routers/0/branches/1/pageProcessors/1',
        draggable: true,
      },
    };
    const targetElement = {
      id: 'new-h2HmoD-atLkWY',
      source: 'new-h2HmoD',
      target: 'atLkWY',
      data: {
        path: '/routers/0/branches/0',
        processorCount: 0,
        processorIndex: 1,
        mergableTerminals: [
          '4KwSiv',
        ],
      },
      type: 'default',
    };
    const patchSet = [];

    mergeTerminalToAnEdge({ flowDoc, elements, patchSet, sourceElement, targetElement });

    expect(patchSet).toEqual(
      [
        {
          op: 'add',
          path: '/routers/-',
          value: {
            id: anyShortId,
            branches: [
              {
                pageProcessors: [],
                nextRouterId: 'atLkWY',
              },
            ],
          },
        },
        {
          op: 'replace',
          path: '/routers/0/branches/0/nextRouterId',
          value: anyShortId,
        },
        {
          op: 'replace',
          path: '/routers/0/branches/1/nextRouterId',
          value: anyShortId,
        },
      ]
    );
  });
  test('should correctly update the patchSet for merging two pp steps', () => {
    const flowDoc = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T13:32:01.746Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          setupInProgress: true,
          id: 'new-PdXUp9',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          routeRecordsUsing: 'input_filters',
          id: '8KgdZQ',
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
                  setupInProgress: true,
                  id: 'new-7nKBWx',
                },
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-kNSxUQ',
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
                  setupInProgress: true,
                  id: 'new-QIKOtT',
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
    const elements = {
      'new-7nKBWx': {
        id: 'new-7nKBWx',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [],
              lists: [],
            },
            setupInProgress: true,
            id: 'new-7nKBWx',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-7nKBWx',
              },
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-kNSxUQ',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: false,
          path: '/routers/0/branches/0/pageProcessors/0',
        },
      },
      'new-kNSxUQ': {
        id: 'new-kNSxUQ',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [],
              lists: [],
            },
            setupInProgress: true,
            id: 'new-kNSxUQ',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-7nKBWx',
              },
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-kNSxUQ',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: false,
          isLast: true,
          path: '/routers/0/branches/0/pageProcessors/1',
        },
      },
    };
    const sourceElement = {
      id: 'nXOdSo',
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
            setupInProgress: true,
            id: 'new-QIKOtT',
          },
        ],
        path: '/routers/0/branches/1/pageProcessors/1',
        draggable: true,
      },
    };
    const targetElement = {
      id: 'new-7nKBWx-new-kNSxUQ',
      source: 'new-7nKBWx',
      target: 'new-kNSxUQ',
      data: {
        path: '/routers/0/branches/0',
        processorCount: 0,
        processorIndex: 1,
        mergableTerminals: [
          'nXOdSo',
        ],
      },
      type: 'default',
    };
    const patchSet = [];

    mergeTerminalToAnEdge({ flowDoc, elements, patchSet, sourceElement, targetElement });

    expect(patchSet).toEqual(
      [
        {
          op: 'add',
          path: '/routers/0/branches/1/nextRouterId',
          value: anyShortId,
        },
        {
          op: 'add',
          path: '/routers/0/branches/0/nextRouterId',
          value: anyShortId,
        },
        {
          op: 'add',
          path: '/routers/0/branches/0/pageProcessors',
          value: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-7nKBWx',
            },
          ],
        },
        {
          op: 'add',
          path: '/routers/-',
          value: {
            id: anyShortId,
            branches: [
              {
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    setupInProgress: true,
                    id: 'new-kNSxUQ',
                  },
                ],
              },
            ],
          },
        },
      ]
    );
  });
});
describe('mergeDragSourceWithTarget util function test', () => {
  test('should correctly update the patchSet for merging terminal nodes', () => {
    const flowDoc = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T12:41:48.251Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
          id: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          id: 'ooeMkN',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-tBPjZV',
                },
              ],
              nextRouterId: 'TXIrJG',
            },
          ],
        },
        {
          routeRecordsUsing: 'input_filters',
          id: 'TXIrJG',
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
                  setupInProgress: true,
                  id: 'new-mXhYFZ',
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
                  setupInProgress: true,
                  id: 'new-RcJOSM',
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
    const elements = {
      LrOa4J: {
        id: 'LrOa4J',
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
              setupInProgress: true,
              id: 'new-mXhYFZ',
            },
          ],
          path: '/routers/1/branches/0/pageProcessors/1',
          draggable: true,
        },
      },
      ZTCILp: {
        id: 'ZTCILp',
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
              setupInProgress: true,
              id: 'new-RcJOSM',
            },
          ],
          path: '/routers/1/branches/1/pageProcessors/1',
          draggable: true,
        },
      },
    };
    const dragNodeId = 'ZTCILp';
    const targetId = 'LrOa4J';
    const patchSet = [];

    mergeDragSourceWithTarget(flowDoc, elements, dragNodeId, targetId, patchSet);

    expect(patchSet).toEqual(
      [{op: 'add', path: '/routers/1/branches/1/nextRouterId', value: anyShortId},
        {op: 'add', path: '/routers/1/branches/0/nextRouterId', value: anyShortId},
        {op: 'add', path: '/routers/-', value: {branches: [{pageProcessors: [{setupInProgress: true}]}], id: anyShortId}}]
    );
  });
  test('should correctly update the patchSet for merging a node with merged node', () => {
    const flowDoc = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T12:58:17.512Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          setupInProgress: true,
          id: 'new-MFuyeh',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          id: 'ooeMkN',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-9sQ64n',
                },
              ],
              nextRouterId: 'TXIrJG',
            },
          ],
        },
        {
          routeRecordsUsing: 'input_filters',
          id: 'TXIrJG',
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
                  setupInProgress: true,
                  id: 'new-W70MSj',
                },
              ],
              nextRouterId: '7JB8As',
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
                  id: 'new-Pq5m42',
                },
              ],
              nextRouterId: '7JB8As',
            },
            {
              name: 'Branch 1.2',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-KF65K9',
                },
              ],
            },
          ],
          script: {
            function: 'branchRouter',
          },
        },
        {
          id: '7JB8As',
          branches: [
            {
              name: '',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-mcZNm6',
                },
              ],
            },
          ],
        },
      ],
    };
    const elements = {
      '7JB8As': {
        id: '7JB8As',
        type: 'merge',
        data: {
          path: '/routers/2',
          router: {
            id: '7JB8As',
            branches: [
              {
                name: '',
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    setupInProgress: true,
                    id: 'new-mcZNm6',
                  },
                ],
              },
            ],
          },
          mergableTerminals: [
            'Cxo5R8',
          ],
        },
      },
      Cxo5R8: {
        id: 'Cxo5R8',
        type: 'terminal',
        draggable: true,
        data: {
          name: 'Branch 1.2',
          pageProcessors: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-KF65K9',
            },
          ],
          path: '/routers/1/branches/2/pageProcessors/1',
          draggable: true,
        },
      },
    };
    const dragNodeId = 'Cxo5R8';
    const targetId = '7JB8As';
    const patchSet = [];

    mergeDragSourceWithTarget(flowDoc, elements, dragNodeId, targetId, patchSet);

    expect(patchSet).toEqual(
      [
        {
          op: 'add',
          path: '/routers/1/branches/2/nextRouterId',
          value: '7JB8As',
        },
      ]
    );
  });
  test('should correctly update the patchSet for merging a node with an edge', () => {
    const flowDoc = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T13:01:29.295Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          setupInProgress: true,
          id: 'new-fPotR8',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          routeRecordsUsing: 'input_filters',
          id: 'FGpMx6',
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
                  setupInProgress: true,
                  id: 'new-fPmGVT',
                },
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  type: 'import',
                  _importId: '6294a58b2174cb02411247e5',
                  id: '6294a58b2174cb02411247e5',
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
                  setupInProgress: true,
                  id: 'new-2UJmSw',
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
    const elements = {
      'new-fPmGVT-6294a58b2174cb02411247e5': {
        id: 'new-fPmGVT-6294a58b2174cb02411247e5',
        source: 'new-fPmGVT',
        target: '6294a58b2174cb02411247e5',
        data: {
          path: '/routers/0/branches/0',
          processorCount: 0,
          processorIndex: 1,
          mergableTerminals: [
            'GAb9dN',
          ],
        },
        type: 'default',
      },
      'new-fPmGVT': {
        id: 'new-fPmGVT',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [],
              lists: [],
            },
            setupInProgress: true,
            id: 'new-fPmGVT',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-fPmGVT',
              },
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                type: 'import',
                _importId: '6294a58b2174cb02411247e5',
                id: '6294a58b2174cb02411247e5',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: true,
          isLast: false,
          path: '/routers/0/branches/0/pageProcessors/0',
        },
      },
      '6294a58b2174cb02411247e5': {
        id: '6294a58b2174cb02411247e5',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: '6294a58b2174cb02411247e5',
            id: '6294a58b2174cb02411247e5',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-fPmGVT',
              },
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                type: 'import',
                _importId: '6294a58b2174cb02411247e5',
                id: '6294a58b2174cb02411247e5',
              },
            ],
          },
          hideDelete: false,
          isVirtual: false,
          isFirst: false,
          isLast: true,
          path: '/routers/0/branches/0/pageProcessors/1',
        },
      },
      GAb9dN: {
        id: 'GAb9dN',
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
              setupInProgress: true,
              id: 'new-2UJmSw',
            },
          ],
          path: '/routers/0/branches/1/pageProcessors/1',
          draggable: true,
        },
      },
    };
    const dragNodeId = 'GAb9dN';
    const targetId = 'new-fPmGVT-6294a58b2174cb02411247e5';
    const patchSet = [];

    mergeDragSourceWithTarget(flowDoc, elements, dragNodeId, targetId, patchSet);

    expect(patchSet).toEqual(
      [
        {
          op: 'add',
          path: '/routers/0/branches/1/nextRouterId',
          value: anyShortId,
        },
        {
          op: 'add',
          path: '/routers/0/branches/0/nextRouterId',
          value: anyShortId,
        },
        {
          op: 'add',
          path: '/routers/0/branches/0/pageProcessors',
          value: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-fPmGVT',
            },
          ],
        },
        {
          op: 'add',
          path: '/routers/-',
          value: {
            id: anyShortId,
            branches: [
              {
                pageProcessors: [
                  {
                    responseMapping: {
                      fields: [],
                      lists: [],
                    },
                    type: 'import',
                    _importId: '6294a58b2174cb02411247e5',
                    id: '6294a58b2174cb02411247e5',
                  },
                ],
              },
            ],
          },
        },
      ]
    );
  });
});
describe('getNewRouterPatchSet util function test', () => {
  test('should return correct patchSet and routerindex if not a first router', () => {
    const flow = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-27T08:31:31.963Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
          id: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          id: 'Sc3B5P',
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
                  _importId: '6294a58b2174cb02411247e5',
                  id: '6294a58b2174cb02411247e5',
                },
              ],
            },
          ],
        },
      ],
    };
    const elementsMap = {
      vFAMLP: {
        id: 'vFAMLP',
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
              _importId: '6294a58b2174cb02411247e5',
              id: '6294a58b2174cb02411247e5',
            },
          ],
          path: '/routers/0/branches/0/pageProcessors/1',
        },
      },
      '6294a58b2174cb02411247e5-vFAMLP': {
        id: '6294a58b2174cb02411247e5-vFAMLP',
        source: '6294a58b2174cb02411247e5',
        target: 'vFAMLP',
        data: {
          path: '/routers/0/branches/0',
          processorIndex: 1,
        },
        type: 'default',
      },
      '6294a58b2174cb02411247e5': {
        id: '6294a58b2174cb02411247e5',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [],
              lists: [],
            },
            type: 'import',
            _importId: '6294a58b2174cb02411247e5',
            id: '6294a58b2174cb02411247e5',
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
                _importId: '6294a58b2174cb02411247e5',
                id: '6294a58b2174cb02411247e5',
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
    const router = {
      id: 'uA4irC',
      routeRecordsTo: 'first_matching_branch',
      routeRecordsUsing: 'input_filters',
      branches: [
        {
          pageProcessors: [
            {
              setupInProgress: true,
            },
          ],
        },
        {
          pageProcessors: [
            {
              setupInProgress: true,
            },
          ],
        },
      ],
      script: {},
    };
    const edgeId = '6294a58b2174cb02411247e5-vFAMLP';
    const originalFlow = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-27T08:31:31.963Z',
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
          _importId: '6294a58b2174cb02411247e5',
        },
      ],
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
    };
    const expected = {
      patchSet: [
        {
          op: 'remove',
          path: '/pageProcessors',
        },
        {
          op: 'add',
          path: '/routers',
          value: [
            {
              id: 'Sc3B5P',
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
                      _importId: '6294a58b2174cb02411247e5',
                      id: '6294a58b2174cb02411247e5',
                    },
                  ],
                  nextRouterId: 'uA4irC',
                },
              ],
            },
            {
              id: 'uA4irC',
              routeRecordsTo: 'first_matching_branch',
              routeRecordsUsing: 'input_filters',
              branches: [
                {
                  pageProcessors: [
                    {
                      setupInProgress: true,
                    },
                  ],
                },
                {
                  pageProcessors: [
                    {
                      setupInProgress: true,
                    },
                  ],
                },
              ],
              script: {},
            },
          ],
        },
      ],
      routerIndex: 1,
    };

    expect(getNewRouterPatchSet({elementsMap, flow, router, edgeId, originalFlow})).toEqual(expected);
  });
  test('should return correct patchSet and routerindex if replacing first router', () => {
    const flow = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T12:25:53.185Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
          id: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          id: 'dxDf2j',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  setupInProgress: true,
                  id: 'new-Ta03jV',
                },
              ],
            },
          ],
        },
      ],
    };
    const elementsMap = {
      '6239e87a8e0b8b736e05bbba': {
        id: '6239e87a8e0b8b736e05bbba',
        type: 'pg',
        data: {
          _exportId: '6239e87a8e0b8b736e05bbba',
          id: '6239e87a8e0b8b736e05bbba',
          path: '/pageGenerators/0',
          hideDelete: false,
        },
      },
      '6239e87a8e0b8b736e05bbba-new-Ta03jV': {
        id: '6239e87a8e0b8b736e05bbba-new-Ta03jV',
        source: '6239e87a8e0b8b736e05bbba',
        target: 'new-Ta03jV',
        data: {
          path: '/routers/0/branches/0',
          processorIndex: 0,
        },
        type: 'default',
      },
      'new-Ta03jV': {
        id: 'new-Ta03jV',
        type: 'pp',
        data: {
          resource: {
            setupInProgress: true,
            id: 'new-Ta03jV',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                setupInProgress: true,
                id: 'new-Ta03jV',
              },
            ],
          },
          hideDelete: true,
          isVirtual: true,
          isFirst: true,
          isLast: true,
          path: '/routers/0/branches/0/pageProcessors/0',
        },
      },
    };
    const router = {
      id: 'm9BKZL',
      routeRecordsTo: 'first_matching_branch',
      routeRecordsUsing: 'input_filters',
      branches: [
        {
          pageProcessors: [
            {
              setupInProgress: true,
              id: 'new-Ta03jV',
            },
          ],
        },
        {
          pageProcessors: [
            {
              setupInProgress: true,
            },
          ],
        },
      ],
      script: {},
    };
    const edgeId = '6239e87a8e0b8b736e05bbba-new-Ta03jV';
    const originalFlow = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T12:25:53.185Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
    };
    const expected = {
      patchSet: [
        {
          op: 'add',
          path: '/routers',
          value: [
            {
              id: 'm9BKZL',
              routeRecordsTo: 'first_matching_branch',
              routeRecordsUsing: 'input_filters',
              branches: [
                {
                  pageProcessors: [
                    {
                      setupInProgress: true,
                      id: 'new-Ta03jV',
                    },
                  ],
                },
                {
                  pageProcessors: [
                    {
                      setupInProgress: true,
                    },
                  ],
                },
              ],
              script: {},
            },
          ],
        },
      ],
      routerIndex: 0,
    };

    expect(getNewRouterPatchSet({elementsMap, flow, router, edgeId, originalFlow})).toEqual(expected);
  });
  test('should add pageGenerators if none exist on the flowdoc', () => {
    const flow = {
      name: 'New flow',
      pageGenerators: [
        {
          setupInProgress: true,
          id: 'new-TOpPGy',
        },
      ],
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      routers: [
        {
          id: 'K7Q87q',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  setupInProgress: true,
                  id: 'new-hZTaxg',
                },
              ],
            },
          ],
        },
      ],
    };
    const elementsMap = {
      'new-TOpPGy': {
        id: 'new-TOpPGy',
        type: 'pg',
        data: {
          setupInProgress: true,
          id: 'new-TOpPGy',
          path: '/pageGenerators/0',
          hideDelete: true,
        },
      },
      'new-TOpPGy-new-hZTaxg': {
        id: 'new-TOpPGy-new-hZTaxg',
        source: 'new-TOpPGy',
        target: 'new-hZTaxg',
        data: {
          path: '/routers/0/branches/0',
          processorIndex: 0,
        },
        type: 'default',
      },
      'new-hZTaxg': {
        id: 'new-hZTaxg',
        type: 'pp',
        data: {
          resource: {
            setupInProgress: true,
            id: 'new-hZTaxg',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                setupInProgress: true,
                id: 'new-hZTaxg',
              },
            ],
          },
          hideDelete: true,
          isVirtual: true,
          isFirst: true,
          isLast: true,
          path: '/routers/0/branches/0/pageProcessors/0',
        },
      },
    };
    const router = {
      id: 'lDva4L',
      routeRecordsTo: 'first_matching_branch',
      routeRecordsUsing: 'input_filters',
      branches: [
        {
          pageProcessors: [
            {
              setupInProgress: true,
              id: 'new-hZTaxg',
            },
          ],
        },
        {
          pageProcessors: [
            {
              setupInProgress: true,
            },
          ],
        },
      ],
      script: {},
    };
    const edgeId = 'new-TOpPGy-new-hZTaxg';
    const originalFlow = null;
    const expected = {
      patchSet: [
        {
          op: 'add',
          path: '/routers',
          value: [
            {
              id: 'lDva4L',
              routeRecordsTo: 'first_matching_branch',
              routeRecordsUsing: 'input_filters',
              branches: [
                {
                  pageProcessors: [
                    {
                      setupInProgress: true,
                      id: 'new-hZTaxg',
                    },
                  ],
                },
                {
                  pageProcessors: [
                    {
                      setupInProgress: true,
                    },
                  ],
                },
              ],
              script: {},
            },
          ],
        },
        {
          op: 'add',
          path: '/pageGenerators',
          value: [
            {
              setupInProgress: true,
            },
          ],
        },
      ],
      routerIndex: 0,
    };

    expect(getNewRouterPatchSet({elementsMap, flow, router, edgeId, originalFlow})).toEqual(expected);
  });
  test('should return correct patchSet and routerIndex if inserting first router', () => {
    const flow = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T12:35:27.012Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
          id: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          routeRecordsUsing: 'input_filters',
          id: 'OKKXKM',
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
                  setupInProgress: true,
                  id: 'new-mOWBVd',
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
                  setupInProgress: true,
                  id: 'new-1dTGRd',
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
    const elementsMap = {
      '6239e87a8e0b8b736e05bbba': {
        id: '6239e87a8e0b8b736e05bbba',
        type: 'pg',
        data: {
          _exportId: '6239e87a8e0b8b736e05bbba',
          id: '6239e87a8e0b8b736e05bbba',
          path: '/pageGenerators/0',
          hideDelete: false,
        },
      },
      '6239e87a8e0b8b736e05bbba-OKKXKM': {
        id: '6239e87a8e0b8b736e05bbba-OKKXKM',
        source: '6239e87a8e0b8b736e05bbba',
        target: 'OKKXKM',
        data: {
          path: '/routers/-1/branches/-1',
          processorIndex: 0,
        },
        type: 'default',
      },
      OKKXKM: {
        id: 'OKKXKM',
        type: 'router',
        data: {
          path: '/routers/0',
          router: {
            routeRecordsUsing: 'input_filters',
            id: 'OKKXKM',
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
                    setupInProgress: true,
                    id: 'new-mOWBVd',
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
                    setupInProgress: true,
                    id: 'new-1dTGRd',
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
    };
    const router = {
      id: 'winev3',
      routeRecordsTo: 'first_matching_branch',
      routeRecordsUsing: 'input_filters',
      branches: [
        {
          pageProcessors: [
            {
              setupInProgress: true,
            },
          ],
          nextRouterId: 'OKKXKM',
        },
        {
          pageProcessors: [
            {
              setupInProgress: true,
            },
          ],
        },
      ],
      script: {},
    };
    const edgeId = '6239e87a8e0b8b736e05bbba-OKKXKM';
    const originalFlow = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T12:35:27.012Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          routeRecordsUsing: 'input_filters',
          id: 'OKKXKM',
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
                  setupInProgress: true,
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
                  setupInProgress: true,
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
    const expected = {
      patchSet: [
        {
          op: 'remove',
          path: '/routers/0/script/function',
        },
        {
          op: 'remove',
          path: '/routers/0/branches/1/pageProcessors/0/responseMapping',
        },
        {
          op: 'remove',
          path: '/routers/0/branches/1/name',
        },
        {
          op: 'remove',
          path: '/routers/0/branches/0/pageProcessors/0/responseMapping',
        },
        {
          op: 'remove',
          path: '/routers/0/branches/0/name',
        },
        {
          op: 'add',
          path: '/routers/0/branches/0/nextRouterId',
          value: 'OKKXKM',
        },
        {
          op: 'replace',
          path: '/routers/0/id',
          value: 'winev3',
        },
        {
          op: 'add',
          path: '/routers/1',
          value: {
            routeRecordsUsing: 'input_filters',
            id: 'OKKXKM',
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
                    setupInProgress: true,
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
                    setupInProgress: true,
                  },
                ],
              },
            ],
            script: {
              function: 'branchRouter',
            },
          },
        },
      ],
      routerIndex: 0,
    };

    expect(getNewRouterPatchSet({elementsMap, flow, router, edgeId, originalFlow})).toEqual(expected);
  });
  test('should return correct patchSet and routerIndex for replacing first router if 1 or more routers already exists', () => {
    const flow = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T12:41:48.251Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
          id: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          id: 'ooeMkN',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                  id: 'new-oDq1LZ',
                },
              ],
              nextRouterId: 'TXIrJG',
            },
          ],
        },
        {
          routeRecordsUsing: 'input_filters',
          id: 'TXIrJG',
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
                  setupInProgress: true,
                  id: 'new-YG8osX',
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
                  setupInProgress: true,
                  id: 'new-3Sp2uu',
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
    const elementsMap = {
      '6239e87a8e0b8b736e05bbba': {
        id: '6239e87a8e0b8b736e05bbba',
        type: 'pg',
        data: {
          _exportId: '6239e87a8e0b8b736e05bbba',
          id: '6239e87a8e0b8b736e05bbba',
          path: '/pageGenerators/0',
          hideDelete: false,
        },
      },
      '6239e87a8e0b8b736e05bbba-new-oDq1LZ': {
        id: '6239e87a8e0b8b736e05bbba-new-oDq1LZ',
        source: '6239e87a8e0b8b736e05bbba',
        target: 'new-oDq1LZ',
        data: {
          path: '/routers/0/branches/0',
          processorIndex: 0,
        },
        type: 'default',
      },
      'new-oDq1LZ': {
        id: 'new-oDq1LZ',
        type: 'pp',
        data: {
          resource: {
            responseMapping: {
              fields: [],
              lists: [],
            },
            setupInProgress: true,
            id: 'new-oDq1LZ',
          },
          branch: {
            name: 'Branch 1.0',
            pageProcessors: [
              {
                responseMapping: {
                  fields: [],
                  lists: [],
                },
                setupInProgress: true,
                id: 'new-oDq1LZ',
              },
            ],
            nextRouterId: 'TXIrJG',
          },
          hideDelete: false,
          isVirtual: true,
          isFirst: true,
          isLast: false,
          path: '/routers/0/branches/0/pageProcessors/0',
        },
      },
    };
    const router = {
      id: 'kirKrg',
      routeRecordsTo: 'first_matching_branch',
      routeRecordsUsing: 'input_filters',
      branches: [
        {
          pageProcessors: [
            {
              responseMapping: {
                fields: [],
                lists: [],
              },
              setupInProgress: true,
              id: 'new-oDq1LZ',
            },
          ],
          nextRouterId: 'TXIrJG',
        },
        {
          pageProcessors: [
            {
              setupInProgress: true,
            },
          ],
        },
      ],
      script: {},
    };
    const edgeId = '6239e87a8e0b8b736e05bbba-new-oDq1LZ';
    const originalFlow = {
      _id: '62d561f648a4303c75f7dca2',
      lastModified: '2022-07-29T12:41:48.251Z',
      name: 'Test cases',
      disabled: true,
      _integrationId: '62d535b83efe3d37ca446f52',
      skipRetries: false,
      pageGenerators: [
        {
          _exportId: '6239e87a8e0b8b736e05bbba',
        },
      ],
      createdAt: '2022-07-18T13:36:54.709Z',
      autoResolveMatchingTraceKeys: true,
      routers: [
        {
          id: 'ooeMkN',
          branches: [
            {
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  responseMapping: {
                    fields: [],
                    lists: [],
                  },
                  setupInProgress: true,
                },
              ],
              nextRouterId: 'TXIrJG',
            },
          ],
        },
        {
          routeRecordsUsing: 'input_filters',
          id: 'TXIrJG',
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
                  setupInProgress: true,
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
                  setupInProgress: true,
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
    const expected = {
      patchSet: [
        {
          op: 'add',
          path: '/routers/0/branches/0/pageProcessors/0/id',
          value: 'new-oDq1LZ',
        },
        {
          op: 'remove',
          path: '/routers/0/branches/0/name',
        },
        {
          op: 'add',
          path: '/routers/0/branches/1',
          value: {
            pageProcessors: [
              {
                setupInProgress: true,
              },
            ],
          },
        },
        {
          op: 'replace',
          path: '/routers/0/id',
          value: 'kirKrg',
        },
        {
          op: 'add',
          path: '/routers/0/routeRecordsTo',
          value: 'first_matching_branch',
        },
        {
          op: 'add',
          path: '/routers/0/routeRecordsUsing',
          value: 'input_filters',
        },
        {
          op: 'add',
          path: '/routers/0/script',
          value: {},
        },
      ],
      routerIndex: 0,
    };

    expect(getNewRouterPatchSet({elementsMap, flow, router, edgeId, originalFlow})).toEqual(expected);
  });
});

