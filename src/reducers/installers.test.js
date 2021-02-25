/* global describe, expect, test */
import reducer, { selectors } from '.';

describe('installer,uninstaller, clone and template region selector testcases', () => {
  describe('selectors.isSetupComplete test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isSetupComplete()).toBe(false);
    });
  });

  describe('selectors.isIAConnectionSetupPending test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isIAConnectionSetupPending()).toBe();
    });
  });

  describe('selectors.isUninstallComplete test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isUninstallComplete(undefined, {})).toBe(0);
    });
  });

  describe('selectors.integrationInstallSteps test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationInstallSteps()).toBe(null);
    });
  });

  describe('selectors.integrationUninstallSteps test cases', () => {
    const integrationId = '1234';

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationUninstallSteps(undefined, {})).toEqual({});
      expect(selectors.integrationUninstallSteps({}, {})).toEqual({});
    });
    test('should return IA v2 uninstall steps if isFrameWork2 is true', () => {
      const uninstallSteps = [
        {
          stepName: 'stepName',
          stepId: 'stepId',
        },
      ];
      const state = {
        session: {
          integrationApps: {
            uninstaller: {
              5678: { },
            },
            uninstaller2: {
              1234: {
                isFetched: true,
                steps: uninstallSteps,
              },
            },
          },
        },
      };
      const expectedOutput = {
        isFetched: true,
        steps: [{
          isCurrentStep: true,
          stepName: 'stepName',
          stepId: 'stepId',
        }],
      };

      expect(selectors.integrationUninstallSteps(state, {integrationId, isFrameWork2: true})).toEqual(expectedOutput);
    });
    test('should return empty steps if all integration steps are hidden', () => {
      const uninstallSteps = [
        {
          type: 'hidden',
          stepName: 'stepName',
          stepId: 'stepId',
        },
        {
          type: 'hidden',
          stepName: 'stepName2',
          stepId: 'stepId2',
        },
      ];
      const state = {
        session: {
          integrationApps: {
            uninstaller: {
              1234: {
                steps: uninstallSteps,
              },
            },
          },
        },
      };
      const expectedOutput = {
        steps: [],
      };

      expect(selectors.integrationUninstallSteps(state, {integrationId})).toEqual(expectedOutput);
    });
    test('should return uninstall steps with correct current step flag set', () => {
      const uninstallSteps = [
        {
          type: 'form',
          stepName: 'stepName',
          stepId: 'stepId',
          completed: true,
        },
        {
          type: 'hidden',
          stepName: 'stepName2',
          stepId: 'stepId2',
        },
        {
          type: 'link',
          stepName: 'stepName3',
          stepId: 'stepId3',
        },
      ];
      const state = {
        session: {
          integrationApps: {
            uninstaller: {
              1234: {
                steps: uninstallSteps,
              },
            },
          },
        },
      };
      const expectedOutput = {
        steps: [{
          type: 'form',
          stepName: 'stepName',
          stepId: 'stepId',
          completed: true,
        },
        {
          type: 'link',
          stepName: 'stepName3',
          stepId: 'stepId3',
          isCurrentStep: true,
        }],
      };

      expect(selectors.integrationUninstallSteps(state, {integrationId})).toEqual(expectedOutput);
    });
  });

  describe('selectors.addNewStoreSteps test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.addNewStoreSteps()).toEqual({});
    });
  });

  describe('selectors.isIAV2UninstallComplete test cases', () => {
    const integrationId = '123';

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isIAV2UninstallComplete(undefined, {})).toEqual(true);
      expect(selectors.isIAV2UninstallComplete({}, {})).toEqual(true);
    });
    test('should return false if integration mode is not uninstall', () => {
      const integration = {
        _id: '123',
        name: 'A-B',
        mode: 'settings',
      };
      const state = {
        data: {
          resources: {
            integrations: [integration],
          },
        },
      };

      expect(selectors.isIAV2UninstallComplete(state, {integrationId})).toEqual(false);
    });
    test('should return false if integration steps are not fetched yet', () => {
      const integration = {
        _id: '123',
        name: 'A-B',
        mode: 'uninstall',
      };
      const state = {
        data: {
          resources: {
            integrations: [integration],
          },
        },
        session: {
          integrationApps: {
            uninstaller2: {
              123: {},
            },
          },
        },
      };

      expect(selectors.isIAV2UninstallComplete(state, {integrationId})).toEqual(false);
    });
    test('should return false if any step is incomplete', () => {
      const integration = {
        _id: '123',
        name: 'A-B',
        mode: 'uninstall',
      };
      const uninstallSteps = [
        {
          type: 'form',
          stepName: 'stepName',
          stepId: 'stepId',
          completed: true,
        },
        {
          type: 'link',
          stepName: 'stepName3',
          stepId: 'stepId3',
        },
      ];

      const state = {
        data: {
          resources: {
            integrations: [integration],
          },
        },
        session: {
          integrationApps: {
            uninstaller2: {
              123: {
                isFetched: true,
                steps: uninstallSteps,
              },
            },
          },
        },
      };

      expect(selectors.isIAV2UninstallComplete(state, {integrationId})).toEqual(false);
    });
    test('should return true if all steps is are completed', () => {
      const integration = {
        _id: '123',
        name: 'A-B',
        mode: 'uninstall',
      };
      const uninstallSteps = [
        {
          type: 'form',
          stepName: 'stepName',
          stepId: 'stepId',
          completed: true,
        },
        {
          type: 'link',
          stepName: 'stepName3',
          stepId: 'stepId3',
          completed: true,
        },
      ];

      const state = {
        data: {
          resources: {
            integrations: [integration],
          },
        },
        session: {
          integrationApps: {
            uninstaller2: {
              123: {
                isFetched: true,
                steps: uninstallSteps,
              },
            },
          },
        },
      };

      expect(selectors.isIAV2UninstallComplete(state, {integrationId})).toEqual(true);
    });
  });

  describe('selectors.redirectToOnInstallationComplete test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.redirectToOnInstallationComplete(undefined, {})).toEqual({redirectTo: null});
    });
  });

  describe('selectors.installSetup test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.installSetup(undefined, {})).toEqual({});
    });
  });

  describe('selectors.templateSetup test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.templateSetup()).toEqual({});
    });
  });

  describe('template Install Steps', () => {
    test('should return empty array when state is empty', () => {
      const state = {};

      expect(selectors.templateInstallSteps(state, 't1')).toEqual([]);
      expect(selectors.templateInstallSteps(undefined, 't1')).toEqual([]);
    });
    test('should return install steps with current step value set', () => {
      const installSteps = [
        {
          stepName: 'stepName',
          stepId: 'stepId',
        },
      ];
      const state = reducer(
        {
          session: {
            templates: {
              t1: { installSteps },
            },
          },
        },
        'some_action'
      );

      expect(selectors.templateInstallSteps(state, 't1')).toEqual([
        { stepName: 'stepName', stepId: 'stepId', isCurrentStep: true },
      ]);
    });
    test('should return install steps with current step value set on correct step', () => {
      const installSteps = [
        {
          stepName: 'stepName',
          stepId: 'stepId',
          completed: true,
        },
        {
          stepName: 'stepName2',
          stepId: 'stepId2',
        },
      ];
      const state = reducer(
        {
          session: {
            templates: {
              t1: { installSteps },
            },
          },
        },
        'some_action'
      );

      expect(selectors.templateInstallSteps(state, 't1')).toEqual([
        { stepName: 'stepName', stepId: 'stepId', completed: true },
        { stepName: 'stepName2', stepId: 'stepId2', isCurrentStep: true },
      ]);
    });
  });

  describe('selectors.cloneInstallSteps test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.cloneInstallSteps()).toEqual([]);
    });
  });
});

