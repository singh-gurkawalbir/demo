/* global describe, test, expect */
import actionTypes from '../actionTypes';

import reducer, {cronExpr} from './index';

const initState = {
  activeTab: 'Minute',
  touched: false,
  subTabState: {
    Minute: {
      everyNMinutes: {
        value: '*/5',
        active: true,
      },
      everySelectedMinute: {
        value: '*',
        active: false,
      },
    },
    Hour: {
      everyHour: {
        value: '*',
        active: true,
      },
      everyNHours: {
        value: '*',
        active: false,
      },
      eachSelectedHour: {
        value: '*',
        active: false,
      },
    },
    'Day of month': {
      everyDay: {
        value: '*',
        active: true,
      },
      eachDay: {
        value: '*',
        active: false,
      },
    },
    Month: {
      everyMonth: {
        value: '*',
        active: true,
      },
      eachMonth: {
        value: '*',
        active: false,
      },
    },
    'Day of week': {
      everyWeek: {
        value: '*',
        active: true,
      },
      eachWeek: {
        value: '*',
        active: false,
      },
    },
  },
};

describe('cronBuilder reducer', () => {
  let nextState;

  test('should set Hour parent tab as active and the component as touched', () => {
    expect(initState.activeTab).toEqual('Minute');
    expect(initState.touched).toEqual(false);
    nextState = reducer(initState, {type: actionTypes.SET_PARENT_TAB, value: 'Hour'});

    expect(nextState.activeTab).toEqual('Hour');
    expect(nextState.touched).toEqual(true);
  });

  test('should set child tab everyNHours as active when everyNHours is selected and value to be set */1 ', () => {
    nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'everyNHours'});
    expect(nextState.subTabState.Hour.everyNHours.value).toEqual('*/1');

    expect(nextState.subTabState.Hour.everyNHours.active).toEqual(true);
  });

  test('should set child tab everyNHours value to every 6 hrs */6 ', () => {
    nextState = reducer(nextState, {type: actionTypes.SET_VALUE, value: '*/6'});

    expect(nextState.subTabState.Hour.everyNHours.value).toEqual('*/6');
  });
  test('switching childTabs back to everyNHours should hold its value', () => {
    nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'everyHour'});
    nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'everyNHours'});

    expect(nextState.subTabState.Hour.everyNHours.value).toEqual('*/6');
  });
  test('should set child tab eachSelectedHour value to 4,6 hrs', () => {
    nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'eachSelectedHour'});

    nextState = reducer(nextState, {type: actionTypes.SET_VALUE, value: '4,6'});

    expect(nextState.subTabState.Hour.eachSelectedHour.value).toEqual('4,6');
  });
  test('switching childTabs back to eachSelectedHour should reset it *', () => {
    nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'everyNHours'});
    nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'eachSelectedHour'});

    expect(nextState.subTabState.Hour.eachSelectedHour.value).toEqual('*');
  });
});
describe('cronBuilder selector', () => {
  describe('cronExpr', () => {
    test('should generate "? */5 * * * *" ', () => {
      expect(cronExpr(initState.subTabState)).toEqual('? */5 * * * *');
    });

    test('should generate "? */5 */6 * * *" when every hour is set to */6', () => {
      let nextState = reducer(initState, {type: actionTypes.SET_PARENT_TAB, value: 'Hour'});

      nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'everyNHours'});
      nextState = reducer(nextState, {type: actionTypes.SET_VALUE, value: '*/6'});

      expect(cronExpr(nextState.subTabState)).toEqual('? */5 */6 * * *');
    });
    test('should generate "? */5 */6 * 3,6 *" when every hour is set to */6 and every month is set to 3,6', () => {
      let nextState = reducer(initState, {type: actionTypes.SET_PARENT_TAB, value: 'Hour'});

      nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'everyNHours'});
      nextState = reducer(nextState, {type: actionTypes.SET_VALUE, value: '*/6'});

      nextState = reducer(nextState, {type: actionTypes.SET_PARENT_TAB, value: 'Month'});

      nextState = reducer(nextState, {type: actionTypes.SET_CHILD_TAB, value: 'eachMonth'});
      nextState = reducer(nextState, {type: actionTypes.SET_VALUE, value: '3,6'});

      expect(cronExpr(nextState.subTabState)).toEqual('? */5 */6 * 3,6 *');
    });
  });
});
