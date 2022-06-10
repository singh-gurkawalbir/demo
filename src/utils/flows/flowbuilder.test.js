/* global describe, test, expect */
import { cloneDeep } from 'lodash';
import {
  getAllRouterPaths,
  getPreceedingRoutersMap,
  deleteUnUsedRouters,
} from './flowbuilder';

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

