/* global describe, test, expect */
import { cloneDeep, keyBy } from 'lodash';
import {
  getAllRouterPaths,
  getPreceedingRoutersMap,
  deleteUnUsedRouters,
  shortId,
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
} from './flowbuilder';

const anyShortId = expect.stringMatching(/^[a-zA-z0-9-_]{6}$/);
const anyPPId = expect.stringMatching(/^none-[a-zA-z0-9-_]{6}$/);

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

describe('shortId function', () => {
  test('shortId should return random string', () => {
    const id1 = shortId();
    const id2 = shortId();
    const id3 = shortId();

    expect(id1).not.toEqual(id2);
    expect(id2).not.toEqual(id3);
    expect(id1).not.toEqual(id3);
  });
  test('shortId should have a length of 6', () => {
    const id = shortId();

    expect(id).toHaveLength(6);
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
      branches: [{pageProcessors: [{setupInProgress: true}]}],
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
    test('should add two pageProcessors when flow is empty', () => {
      const flow = {};

      addPageProcessor(flow);
      expect(flow).toEqual({pageProcessors: [{setupInProgress: true}, {setupInProgress: true}]});
    });
    test('should add two pageProcessors when pageProcessors are empty', () => {
      const flow = {pageProcessors: []};

      addPageProcessor(flow);
      expect(flow).toEqual({pageProcessors: [{setupInProgress: true}, {setupInProgress: true}]});
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
    const flow = {};

    deletePPStepForOldSchema(flow, '/routers/0/branches/0/pageProcessors/1');
    expect(flow).toEqual({});
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
  test('should not change anything with path is not valid', () => {
    const flow = {pageProcessors: [{setupInProgress: true}, {_importId: '1234'}]};

    deletePPStepForOldSchema(flow, '/routers/0/branches/0/pageProcessors/11');
    expect(flow).toEqual({pageProcessors: [{setupInProgress: true}, {_importId: '1234'}]});
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
    test('should delete the pageGenerator by stepId', () => {
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
  describe('should delete the pageProcessor correctly', () => {
    const flow = cloneDeep(flow1);

    deletePGOrPPStepForRouters(flow, flow, 'abcd', elementsMap);
    expect(flow).toEqual({
      pageGenerators: [{id: '1234', setupInProgress: true}, {id: '5678', setupInProgress: true}],
      routers: [{branches: [{pageProcessors: [{_importId: '0000', id: '0000'}]}], id: 'router1'}],
    });
  });
  describe('should not delete the pageProcessor if incorrect step passed', () => {
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

  test('getPreceedingRoutersMap function test2', () => {
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
  test('should return correct edge object with valid params and branch params', () => {
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

    expect(obj).toEqual({data: {path: '/routers/0', router: {}}, id: anyShortId, type: 'merge'});
  });

  test('should return expected router object', () => {
    const obj = generateRouterNode({id: 'routerId', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]}, 1);

    expect(obj).toEqual({data: {path: '/routers/1', router: {branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}], id: 'routerId'}}, id: 'routerId', type: 'merge'});
  });

  test('should return expected router object and correct router type', () => {
    const obj = generateRouterNode({id: 'routerId', routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]}, 1);

    expect(obj).toEqual({data: {path: '/routers/1', router: {branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}], id: 'routerId', routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters'}}, id: 'routerId', type: 'router'});
  });
  test('should return expected router object with routerId populated and correct router type', () => {
    const obj = generateRouterNode({ routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters', branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}]}, 1);

    expect(obj).toEqual({data: {path: '/routers/1', router: {branches: [{name: 'branch1', pageProcessors: [{setupInProgress: true}]}], routeRecordsTo: 'first_matching_branch', routeRecordsUsing: 'input_filters'}}, id: anyShortId, type: 'router'});
  });
});

describe('generateNewTerminal util function', () => {
  test('should return correct terminal object', () => {
    const terminal = generateNewTerminal();

    expect(terminal).toEqual({data: {path: '/routers/undefined/branches/undefined/pageProcessors/-'}, draggable: false, id: anyShortId, type: 'terminal'});
  });
  test('should return correct terminal object with branch details', () => {
    const terminal = generateNewTerminal({branch: {pageProcessors: [{setupInProgress: true}, {setupInProgress: true}]}, branchIndex: 1, routerIndex: 1});

    expect(terminal).toEqual({data: {pageProcessors: [{setupInProgress: true}, {setupInProgress: true}], path: '/routers/1/branches/1/pageProcessors/2'}, draggable: false, id: anyShortId, type: 'terminal'});
  });

  test('should return correct terminal object with branch details', () => {
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

    expect(terminal).toEqual({data: {pageProcessors: [{setupInProgress: true}, {setupInProgress: true}], path: '/routers/1/branches/1/pageProcessors/2'}, id: anyShortId, type: 'empty'});
  });

  test('should return correct terminal object with branch details', () => {
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
  test('should return array of nodes and edges when pageGenerators exist', () => {
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

