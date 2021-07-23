/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('bottom drawer reducers', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });
  test('should initialize state correct on init', () => {
    const state = reducer(undefined, actions.bottomDrawer.init());

    expect({bottomDrawer: { tabs: [] }}).toEqual(state);
  });
  test('should initialize state correct on init', () => {
    const state = reducer(undefined, actions.bottomDrawer.init());

    expect({bottomDrawer: { tabs: [] }}).toEqual(state);
  });
  test('should set tabs value and activeTabIndex correctly', () => {
    const state = reducer(undefined, actions.bottomDrawer.init());
    const newState = reducer(state, actions.bottomDrawer.initComplete([{name: 'dashboard'}]));

    expect({bottomDrawer: { tabs: [{name: 'dashboard'}], activeTabIndex: 0 }}).toEqual(newState);
  });
  test('should  not set tabs if state is not initialized', () => {
    const state = reducer(undefined, actions.bottomDrawer.initComplete([{name: 'dashboard'}]));

    expect({}).toEqual(state);
  });
  test('should not set tabs if state is not initialized', () => {
    const state = reducer(undefined, actions.bottomDrawer.initComplete([{name: 'dashboard'}]));

    expect({}).toEqual(state);
  });
  test('should add new tab correctly', () => {
    const initialState = {bottomDrawer: { tabs: [{tabType: 'dashboard'}] }};
    const state = reducer(initialState, actions.bottomDrawer.addTab({tabType: 'newTab'}));

    expect(
      {bottomDrawer: { tabs: [
        {tabType: 'dashboard'},
        {
          label: undefined,
          resourceId: undefined,
          tabType: 'newTab',
        },
      ],
      activeTabIndex: 1,
      }}
    ).toEqual(state);
  });

  test('should remove tab correctly', () => {
    const initialState = {bottomDrawer: { tabs: [
      {tabType: 'dashboard'},
      {tabType: 'scripts'},
      {tabType: 'scriptLogs', resourceId: 'r1'},
    ],
    activeTabIndex: 2,
    }};
    const state = reducer(initialState, actions.bottomDrawer.removeTab({tabType: 'scriptLogs', resourceId: 'r1'}));

    expect(
      {bottomDrawer: { tabs: [
        {tabType: 'dashboard'},
        {tabType: 'scripts'},
      ],
      activeTabIndex: 1,
      }}
    ).toEqual(state);
  });

  test('should set active tab correctly', () => {
    const initialState = {bottomDrawer: { tabs: [
      {tabType: 'dashboard'},
      {tabType: 'scripts'},
      {tabType: 'scriptLogs', resourceId: 'r1'},
    ],
    activeTabIndex: 2,
    }};
    const state = reducer(initialState, actions.bottomDrawer.setActiveTab({index: 1}));

    expect(
      {bottomDrawer: { tabs: [
        {tabType: 'dashboard'},
        {tabType: 'scripts'},
        {tabType: 'scriptLogs', resourceId: 'r1'},
      ],
      activeTabIndex: 1,
      }}
    ).toEqual(state);
  });

  test('should set active tab correctly', () => {
    const initialState = {bottomDrawer: { tabs: [
      {tabType: 'dashboard'},
      {tabType: 'scripts'},
      {tabType: 'scriptLogs', resourceId: 'r1'},
    ],
    activeTabIndex: 2,
    }};
    const state = reducer(initialState, actions.bottomDrawer.setActiveTab({tabType: 'dashboard'}));

    expect(
      {bottomDrawer: { tabs: [
        {tabType: 'dashboard'},
        {tabType: 'scripts'},
        {tabType: 'scriptLogs', resourceId: 'r1'},
      ],
      activeTabIndex: 0,
      }}
    ).toEqual(state);
  });
  test('should clear state correctly', () => {
    const initialState = {bottomDrawer: { tabs: [
      {tabType: 'dashboard'},
      {tabType: 'scripts'},
      {tabType: 'scriptLogs', resourceId: 'r1'},
    ],
    activeTabIndex: 2,
    }};
    const state = reducer(initialState, actions.bottomDrawer.clear());

    expect({}).toEqual(state);
  });
});

describe('bottom drawer tabs selector', () => {
  test('selector[bottomDrawerTabs] should return empty state in case state is not initialized', () => {
    const bottomDrawerTabs = selectors.bottomDrawerTabs(undefined, {});

    expect({}).toEqual(bottomDrawerTabs);
  });
  test('selector[bottomDrawerTabs] should return state correctly', () => {
    const state = {
      bottomDrawer: {
        tabs: [
          {a: 1},
        ],
        otherProp: 'a',
      },
    };
    const bottomDrawerTabs = selectors.bottomDrawerTabs(state);

    expect({
      tabs: [
        {a: 1},
      ],
      otherProp: 'a',
    }).toEqual(bottomDrawerTabs);
  });
});
