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
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationUninstallSteps(undefined, {})).toEqual({});
    });
  });

  describe('selectors.addNewStoreSteps test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.addNewStoreSteps()).toEqual({});
    });
  });

  describe('selectors.isIAV2UninstallComplete test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isIAV2UninstallComplete(undefined, {})).toEqual(true);
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

