/* global describe, test, expect */

import {
  getAllRouterPaths,
  getPreceedingRoutersMap,
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

