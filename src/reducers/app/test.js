/* global describe, test, expect */
import reducer, { selectors, defaultState } from '.';
import actions from '../../actions';

describe('app reducers', () => {
  test('any other action return default state', () => {
    const newState = reducer(undefined, 'someaction');

    expect(newState).toEqual(defaultState);
  });

  test('any other action return original state', () => {
    const someState = { something: 'something' };
    const newState = reducer(someState, 'someaction');

    expect(newState).toEqual(someState);
  });
  describe('app reload request', () => {
    test('should increment reload count and delete bannerOpened prop', () => {
      const newState = reducer(undefined, actions.app.reload());

      expect(newState).toEqual({
        appErrored: false,
        count: 2,
      });
    });
  });
  describe('app toggle banner request', () => {
    test('should toggle bannerOpened value', () => {
      const newState = reducer(undefined, actions.toggleBanner());

      expect(newState).toEqual({
        appErrored: false,
        bannerOpened: false,
        count: 1,
      });
    });
  });
  describe('app errored request', () => {
    test('should set appErrored to true', () => {
      const newState = reducer(undefined, actions.app.errored());

      expect(newState).toEqual({
        appErrored: true,
        bannerOpened: true,
        count: 1,
      });
    });
  });
  describe('app clear error request', () => {
    test('should delete appErrored prop', () => {
      const newState = reducer(undefined, actions.app.clearError());

      expect(newState).toEqual({
        bannerOpened: true,
        count: 1,
      });
    });
  });
  describe('ui version update request', () => {
    test('should set initVersion and version when initVersion was not set before', () => {
      const newState = reducer(undefined, actions.app.updateUIVersion('uiVersion'));

      expect(newState).toEqual({
        appErrored: false,
        bannerOpened: true,
        count: 1,
        initVersion: 'uiVersion',
        version: 'uiVersion',
      });
    });
    test('should not change initVersion if it was set before', () => {
      const newState = reducer(undefined, actions.app.updateUIVersion('uiVersion'));
      const newState2 = reducer(newState, actions.app.updateUIVersion('uiVersionLatest'));

      expect(newState2).toEqual({
        appErrored: false,
        bannerOpened: true,
        count: 1,
        initVersion: 'uiVersion',
        version: 'uiVersionLatest',
      });
    });
  });
  describe('user accepted account transfer request', () => {
    test('should set userAcceptedAccountTransfer to true', () => {
      const newState = reducer(undefined, actions.app.userAcceptedAccountTransfer());

      expect(newState).toEqual({
        appErrored: false,
        bannerOpened: true,
        count: 1,
        userAcceptedAccountTransfer: true,
      });
    });
  });
});

describe('app selectors', () => {
  describe('bannerOpened', () => {
    const state = reducer(undefined, actions.app.reload());

    test('should return false while reloading app ', () => {
      expect(selectors.bannerOpened(state)).toBe(false);
    });
    test('should return true if state is undefined', () => {
      expect(selectors.bannerOpened()).toBe(true);
    });
    test('should handle toggle banner', () => {
      const state2 = reducer(state, actions.toggleBanner());

      expect(selectors.bannerOpened(state2)).toBe(true);

      const state3 = reducer(state2, actions.toggleBanner());

      expect(selectors.bannerOpened(state3)).toBe(false);
    });
  });

  describe('reloadCount', () => {
    const state = reducer(undefined, actions.app.reload());

    test('should return zero if state is undefined', () => {
      expect(selectors.reloadCount()).toBe(0);
    });

    test('should return the correct reload count', () => {
      expect(selectors.reloadCount(state)).toBe(2);
    });
  });

  describe('appErrored', () => {
    const state = reducer(undefined, actions.app.reload());

    test('should return null if state is undefined', () => {
      expect(selectors.appErrored()).toBe(null);
    });

    test('should return false if there is no error in state', () => {
      expect(selectors.appErrored(state)).toBe(false);
    });
    test('should return true if there is error in state', () => {
      const state2 = reducer(undefined, actions.app.errored());

      expect(selectors.appErrored(state2)).toBe(true);
    });
  });
  describe('initVersion', () => {
    const state = reducer(undefined, actions.app.updateUIVersion('version1'));

    test('should return undefined if state is undefined', () => {
      expect(selectors.initVersion()).toBe(undefined);
    });

    test('should return correct initial version', () => {
      expect(selectors.initVersion(state)).toBe('version1');
    });
    test('should return previous version as initial version should not be changded once it is set', () => {
      const state2 = reducer(state, actions.app.updateUIVersion('version2'));

      expect(selectors.initVersion(state2)).toBe('version1');
    });
  });
  describe('version', () => {
    const state = reducer(undefined, actions.app.updateUIVersion('version1'));

    test('should return undefined if state is undefined', () => {
      expect(selectors.version()).toBe(undefined);
    });

    test('should return correct version', () => {
      expect(selectors.version(state)).toBe('version1');
    });
    test('should return updated version as version should be set to the latest one', () => {
      const state2 = reducer(state, actions.app.updateUIVersion('version2'));

      expect(selectors.version(state2)).toBe('version2');
    });
  });
  describe('isUiVersionDifferent', () => {
    const state = reducer(undefined, actions.app.updateUIVersion('version1'));

    test('should return false if state is undefined', () => {
      expect(selectors.isUiVersionDifferent()).toBe(false);
    });

    test('should return false if both versions are same', () => {
      expect(selectors.isUiVersionDifferent(state)).toBe(false);
    });
    test('should return true if both versions are different', () => {
      const state2 = reducer(state, actions.app.updateUIVersion('version2'));

      expect(selectors.isUiVersionDifferent(state2)).toBe(true);
    });
  });
  describe('isUserAcceptedAccountTransfer', () => {
    const state = reducer(undefined, actions.app.userAcceptedAccountTransfer());

    test('should return false if state is undefined', () => {
      expect(selectors.isUserAcceptedAccountTransfer()).toBe(false);
    });

    test('should return true if user accepted account transfer', () => {
      expect(selectors.isUserAcceptedAccountTransfer(state)).toBe(true);
    });
  });
});
