/* global describe, test, expect */
import reducer from './';
import actions from '../../../actions';

describe('intetgrationApps installer reducer', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({ installer: {}, uninstaller: {}, addStore: {} });
  });

  describe(`integrationApps received installer install_inProgress action`, () => {
    test('should find the integration with id and set isTriggered flag to true', () => {
      const state = reducer(
        {},
        actions.integrationApps.installer.updateStep(
          1,
          'installerFunction',
          'inProgress'
        )
      );

      expect(state).toEqual({
        installer: { '1': { isTriggered: true } },
        uninstaller: { '1': {} },
        addStore: { '1': {} },
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const integrationId = 1;
      const initialState = {
        installer: {
          1: { verifying: true },
          2: { isTriggered: true },
        },
      };
      const state = reducer(
        initialState,
        actions.integrationApps.installer.updateStep(
          integrationId,
          'installerFunction',
          'inProgress'
        )
      );

      expect(state).toEqual({
        installer: {
          1: { isTriggered: true, verifying: true },
          2: { isTriggered: true },
        },
        uninstaller: { '1': {} },
        addStore: { '1': {} },
      });
    });
  });

  describe(`integrationApps received installer install_verify action`, () => {
    test('should find the integration with id and set isTriggered and verifying flag to true', () => {
      const state = reducer(
        {},
        actions.integrationApps.installer.updateStep(
          1,
          'installerFunction',
          'verify'
        )
      );

      expect(state).toEqual({
        installer: { '1': { isTriggered: true, verifying: true } },
        uninstaller: { '1': {} },
        addStore: { '1': {} },
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const integrationId = 1;
      const initialState = {
        installer: {
          1: {},
          2: { isTriggered: true },
        },
      };
      const state = reducer(
        initialState,
        actions.integrationApps.installer.updateStep(
          integrationId,
          'installerFunction',
          'verify'
        )
      );

      expect(state).toEqual({
        installer: {
          '1': { isTriggered: true, verifying: true },
          '2': { isTriggered: true },
        },
        uninstaller: { '1': {} },
        addStore: { '1': {} },
      });
    });
  });

  describe(`integrationApps received installer install_failed action`, () => {
    test('should find the integration with id and set isTriggered flag to true', () => {
      const state = reducer(
        {
          installer: { '1': { isTriggered: true } },
        },
        actions.integrationApps.installer.updateStep(
          1,
          'installerFunction',
          'failed'
        )
      );

      expect(state).toEqual({
        installer: { '1': { isTriggered: false, verifying: false } },
        uninstaller: { '1': {} },
        addStore: { '1': {} },
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const integrationId = 1;
      const initialState = {
        installer: {
          1: { verifying: true },
          2: { isTriggered: true },
        },
      };
      const state = reducer(
        initialState,
        actions.integrationApps.installer.updateStep(
          integrationId,
          'installerFunction',
          'failed'
        )
      );

      expect(state).toEqual({
        installer: {
          '1': { isTriggered: false, verifying: false },
          '2': { isTriggered: true },
        },
        uninstaller: { '1': {} },
        addStore: { '1': {} },
      });
    });
  });

  describe(`integrationApps received installer install_complete action`, () => {
    test('should find the integration with id and reset the value', () => {
      const state = reducer(
        {
          installer: { '1': { isTriggered: true } },
        },
        actions.integrationApps.installer.completedStepInstall(
          { response: 's' },
          1,
          'installerFunction'
        )
      );

      expect(state).toEqual({
        installer: { '1': {} },
        uninstaller: { '1': {} },
        addStore: { '1': {} },
      });
    });

    test('should find the integration with id and update it but should not affect any other integration in the session', () => {
      const integrationId = 1;
      const initialState = {
        installer: {
          1: { verifying: true },
          2: { isTriggered: true },
        },
      };
      const state = reducer(
        initialState,
        actions.integrationApps.installer.completedStepInstall(
          {},
          integrationId
        )
      );

      expect(state).toEqual({
        installer: {
          '1': {},
          '2': { isTriggered: true },
        },
        uninstaller: { '1': {} },
        addStore: { '1': {} },
      });
    });
  });
});
