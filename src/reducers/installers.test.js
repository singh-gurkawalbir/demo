
import reducer, { selectors } from '.';
import actions from '../actions';

describe('installer,uninstaller, clone and template region selector testcases', () => {
  describe('selectors.isSetupComplete test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isSetupComplete()).toBe(false);
    });

    test('should return true if all installation steps completed', () => {
      const installSteps = [
        {
          stepName: 'stepName',
          stepId: 'stepId',
          completed: true,
        },
        {
          stepName: 'stepName2',
          stepId: 'stepId2',
          completed: true,
        },
      ];
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(installSteps, undefined, 't1')
      );

      expect(selectors.isSetupComplete(state, {
        templateId: 't1',
      })).toBe(true);
    });
    test('should return false if installation steps not completed', () => {
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
        undefined,
        actions.template.installStepsReceived(installSteps, undefined, 't1')
      );

      expect(selectors.isSetupComplete(state, {
        templateId: 't1',
      })).toBe(false);
    });
    test('should return true if cloning is completed for a resource', () => {
      const installSteps = [
        {
          stepName: 'stepName',
          stepId: 'stepId',
          completed: true,
        },
        {
          stepName: 'stepName2',
          stepId: 'stepId2',
          completed: true,
        },
      ];
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(installSteps, undefined, 'imports-i1')
      );

      expect(selectors.isSetupComplete(state, {
        resourceType: 'imports',
        resourceId: 'i1',
      })).toBe(true);
    });
    test('should return false if cloning is not completed for a resource', () => {
      const installSteps = [
        {
          stepName: 'stepName',
          stepId: 'stepId',
        },
      ];
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(installSteps, undefined, 'imports-i1')
      );

      expect(selectors.isSetupComplete(state, {
        resourceType: 'imports',
        resourceId: 'i1',
      })).toBe(false);
    });

    test('should return false if empty install steps received for template', () => {
      const installSteps = [
      ];
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(installSteps, undefined, 't1')
      );

      expect(selectors.isSetupComplete(state, {
        templateId: 't1',
      })).toBe(false);
    });
  });

  describe('selectors.isIAConnectionSetupPending test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isIAConnectionSetupPending()).toBe();
    });

    test('should return undefined for if connection doesn\'t exist', () => {
      expect(selectors.isIAConnectionSetupPending({}, 'c1')).toBeUndefined();
    });

    test('should return undefined if connection is not of connector type', () => {
      const conn = {
        _id: 'c1',
      };

      const state = reducer(
        undefined,
        actions.resource.received('connections', conn)
      );

      expect(selectors.isIAConnectionSetupPending(state, 'c1')).toBeUndefined();
    });

    test('should return true if connection setup is not completed', () => {
      const conn = {
        _id: 'c1',
        _integrationId: 'i1',
        _connectorId: 'cnc',
      };

      let state = reducer(
        undefined,
        actions.resource.received('connections', conn)
      );

      const steps = [{
        _connectionId: 'c1',
        completed: false,
      }];

      state = reducer(
        state,
        actions.integrationApp.child.receivedNewChildSteps('i1', steps)
      );

      expect(selectors.isIAConnectionSetupPending(state, 'c1')).toBe(true);
    });

    test('should return false if integration mode is settings', () => {
      const conn = {
        _id: 'c1',
        _integrationId: 'i1',
        _connectorId: 'cnc',
      };

      let state = reducer(
        undefined,
        actions.resource.received('connections', conn)
      );

      const integration = {
        _id: 'i1',
        mode: 'settings',
      };

      state = reducer(
        state,
        actions.resource.received('integrations', integration)
      );

      expect(selectors.isIAConnectionSetupPending(state, 'c1')).toBe(false);
    });

    test('should return true if integration record installStep is not completed', () => {
      const conn = {
        _id: 'c1',
        _integrationId: 'i1',
        _connectorId: 'cnc',
      };

      let state = reducer(
        undefined,
        actions.resource.received('connections', conn)
      );

      const integration = {
        _id: 'i1',
        install: [
          {
            _connectionId: 'c1',
            completed: false,
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('integrations', integration)
      );

      expect(selectors.isIAConnectionSetupPending(state, 'c1')).toBe(true);
    });
  });

  describe('selectors.isUninstallComplete test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isUninstallComplete(undefined, {})).toBe(false);
    });
    test('should return true if uninstallSteps are completed', () => {
      const uninstallSteps = [{
        stepName: 'stepName',
        id: 'sid',
        completed: true,
      }, {
        stepName: 'stepName2',
        id: 'sid2',
        completed: true,
      }];

      const state = reducer(
        undefined,
        actions.integrationApp.uninstaller.receivedUninstallSteps(uninstallSteps, 'i1')
      );

      expect(selectors.isUninstallComplete(state, {
        integrationId: 'i1',
      })).toBe(true);
    });

    test('should return false if uninstallSteps are not completed', () => {
      const uninstallSteps = [{
        stepName: 'stepName',
        id: 'sid',
        completed: true,
      }, {
        stepName: 'stepName2',
        id: 'sid2',
        completed: false,
      }];

      const state = reducer(
        undefined,
        actions.integrationApp.uninstaller.receivedUninstallSteps(uninstallSteps, 'i1')
      );

      expect(selectors.isUninstallComplete(state, {
        integrationId: 'i1',
      })).toBe(false);
    });

    test('should return false for empty uninstall steps', () => {
      const uninstallSteps = [];

      const state = reducer(
        undefined,
        actions.integrationApp.uninstaller.receivedUninstallSteps(uninstallSteps, 'i1')
      );

      expect(selectors.isUninstallComplete(state, {
        integrationId: 'i1',
      })).toBe(false);
    });
  });

  describe('selectors.integrationInstallSteps test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.integrationInstallSteps()).toEqual([]);
    });

    const installSteps = [
      {
        stepId: 's1',
        completed: true,
      },
      {
        stepId: 's2',
        completed: true,
        type: 'hidden',
      },
      {
        stepId: 's3',
        completed: false,
      },
    ];

    const expected = [
      {
        completed: true,
        stepId: 's1',
      },
      {
        completed: false,
        formMeta: {
          a: 'b',
        },
        isCurrentStep: true,
        isTriggered: true,
        stepId: 's3',
      },
    ];

    test('should return installSteps for IA2.0 integration', () => {
      const integration = {
        _id: 'i1',
        installSteps,
      };

      let state = reducer(
        undefined,
        actions.resource.received('integrations', integration)
      );

      state = reducer(
        state,
        actions.integrationApp.installer.updateStep('i1', 'installFunc', 'inProgress', {
          a: 'b',
        })
      );

      expect(selectors.integrationInstallSteps(state, 'i1')).toEqual(expected);
    });

    test('should return installSteps for IA integration', () => {
      const integration = {
        _id: 'i1',
        install: installSteps,
      };

      let state = reducer(
        undefined,
        actions.resource.received('integrations', integration)
      );

      state = reducer(
        state,
        actions.integrationApp.installer.updateStep('i1', 'installFunc', 'verify')
      );

      expect(selectors.integrationInstallSteps(state, 'i1')).toEqual([
        {
          completed: true,
          stepId: 's1',
        },
        {
          completed: false,
          isCurrentStep: true,
          verifying: true,
          isTriggered: true,
          stepId: 's3',
        },
      ]);
    });

    test('should append connectionId to the matching installStep based on sourceConnectionId if present', () => {
      const newsteps = [];

      newsteps.push({name: 'NS connection', sourceConnection: {_id: 'id1'}, _connectionId: 'connId1'});

      newsteps.push({name: 'Integrator Bundle', type: 'url', sourceConnection: {_id: 'id1'}, url: 'url1'});
      const integration = {
        _id: 'i1',
        install: newsteps,
      };
      const newExpected = [];

      newExpected.push({name: 'NS connection', isCurrentStep: true, sourceConnection: {_id: 'id1'}, _connectionId: 'connId1'});
      newExpected.push({name: 'Integrator Bundle', type: 'url', sourceConnection: {_id: 'id1'}, _connId: 'connId1', url: 'url1'});

      const state = reducer(
        undefined,
        actions.resource.received('integrations', integration)
      );

      expect(selectors.integrationInstallSteps(state, 'i1')).toEqual(newExpected);
    });

    test('should append connectionId to the matching suiteapp installStep based on sourceConnectionId if present', () => {
      const newsteps = [];

      newsteps.push({name: 'NS connection', sourceConnection: {_id: 'id1'}, _connectionId: 'connId1'});

      newsteps.push({name: 'Integrator SuiteApp', type: 'url', sourceConnection: {_id: 'id1'}, url: 'url1'});
      const integration = {
        _id: 'i1',
        install: newsteps,
      };
      const newExpected = [];

      newExpected.push({name: 'NS connection', isCurrentStep: true, sourceConnection: {_id: 'id1'}, _connectionId: 'connId1'});
      newExpected.push({name: 'Integrator SuiteApp', type: 'url', sourceConnection: {_id: 'id1'}, _connId: 'connId1', url: 'url1'});

      const state = reducer(
        undefined,
        actions.resource.received('integrations', integration)
      );

      expect(selectors.integrationInstallSteps(state, 'i1')).toEqual(newExpected);
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

  describe('selectors.addNewChildSteps test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.addNewChildSteps()).toEqual({});
    });
    test('should return newChildSteps with adding current Step', () => {
      const steps = [{
        stepId: 'sid1',
      }, {
        stepId: 'sid2',
      }];

      const state = reducer(
        undefined,
        actions.integrationApp.child.receivedNewChildSteps('i1', steps)
      );

      expect(selectors.addNewChildSteps(state, 'i1')).toEqual({
        steps: [{
          stepId: 'sid1',
          isCurrentStep: true,
        }, {
          stepId: 'sid2',
        }]});
    });

    test('should return empty array when install steps are empty', () => {
      const state = reducer(
        undefined,
        actions.integrationApp.child.receivedNewChildSteps('i1', [])
      );

      expect(selectors.addNewChildSteps(state, 'i1')).toEqual({
        steps: []});
    });
    test('should return errors when add new child returns errors', () => {
      const state = reducer(
        undefined,
        actions.integrationApp.child.failedNewChildSteps('i1', 'Provide a license')
      );

      expect(selectors.addNewChildSteps(state, 'i1')).toEqual({error: 'Provide a license'});
    });
  });

  describe('selectors.isIAV2UninstallComplete test cases', () => {
    const integrationId = '123';

    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.isIAV2UninstallComplete(undefined, {})).toBe(true);
      expect(selectors.isIAV2UninstallComplete({}, {})).toBe(true);
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

      expect(selectors.isIAV2UninstallComplete(state, {integrationId})).toBe(false);
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

      expect(selectors.isIAV2UninstallComplete(state, {integrationId})).toBe(false);
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

      expect(selectors.isIAV2UninstallComplete(state, {integrationId})).toBe(false);
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

      expect(selectors.isIAV2UninstallComplete(state, {integrationId})).toBe(true);
    });
  });

  describe('selectors.redirectToOnInstallationComplete test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.redirectToOnInstallationComplete(undefined, {})).toEqual({redirectTo: null});
    });
    test('should return redirectTo as null if install is failed', () => {
      const state = reducer(
        undefined,
        actions.template.failedInstall('t1')
      );

      expect(selectors.redirectToOnInstallationComplete(state, {
        templateId: 't1',
      })).toEqual(
        {
          redirectTo: null,
          isInstallFailed: true,
        }
      );
    });
    test('should return redirectTo as null if createdComponents are empty', () => {
      const state = reducer(
        undefined,
        actions.template.createdComponents(null, 't1')
      );

      expect(selectors.redirectToOnInstallationComplete(state, {
        templateId: 't1',
      })).toEqual(
        {
          redirectTo: null,
        }
      );
    });

    test('should return redirectTo correctly when resourceType is integrations', () => {
      const state = reducer(
        undefined,
        actions.template.createdComponents([{
          model: 'Integration',
          _id: 'i1',
        }], 'integrations-i1')
      );

      expect(selectors.redirectToOnInstallationComplete(state, {
        resourceId: 'i1',
        resourceType: 'integrations',
      })).toEqual(
        {
          redirectTo: '/integrations/i1/flows',
        }
      );
    });

    test('should return redirectTo correctly when resourceType is flow and environment is sandbox', () => {
      let state = reducer(
        undefined,
        actions.template.createdComponents([{
          model: 'Flow',
          _id: 'f1',
        }], 'flows-f1')
      );

      state = reducer(
        state,
        actions.resource.received('flows', {
          _id: 'f1',
          sandbox: true,
        })
      );

      expect(selectors.redirectToOnInstallationComplete(state, {
        resourceId: 'f1',
        resourceType: 'flows',
      })).toEqual(
        {
          redirectTo: '/integrations/none/flows',
          environment: 'sandbox',
        }
      );
    });

    test('should return redirectTo correctly when resourceType is flow and environment is production', () => {
      let state = reducer(
        undefined,
        actions.template.createdComponents([{
          model: 'Flow',
          _id: 'f1',
        }], 'flows-f1')
      );

      state = reducer(
        state,
        actions.resource.received('flows', {
          _id: 'f1',
        })
      );

      expect(selectors.redirectToOnInstallationComplete(state, {
        resourceId: 'f1',
        resourceType: 'flows',
      })).toEqual(
        {
          redirectTo: '/integrations/none/flows',
          environment: 'production',
        }
      );
    });

    test('should return redirectTo correctly when resourceType is flow and if linked to an integration', () => {
      let state = reducer(
        undefined,
        actions.template.createdComponents([{
          model: 'Flow',
          _id: 'f1',
        }], 'flows-f1')
      );

      state = reducer(
        state,
        actions.resource.received('flows', {
          _id: 'f1',
          _integrationId: 'i1',
        })
      );

      expect(selectors.redirectToOnInstallationComplete(state, {
        resourceId: 'f1',
        resourceType: 'flows',
      })).toEqual(
        {
          redirectTo: '/integrations/i1/flows',
        }
      );
    });
    test('should return redirectTo correctly when resourceType is exports', () => {
      const state = reducer(
        undefined,
        actions.template.createdComponents([{
          model: 'Export',
          _id: 'e1',
        }], 'exports-e1')
      );

      expect(selectors.redirectToOnInstallationComplete(state, {
        resourceId: 'e1',
        resourceType: 'exports',
      })).toEqual(
        {
          redirectTo: '/exports',
        }
      );
    });
    test('should return redirectTo correctly when resourceType is imports', () => {
      const state = reducer(
        undefined,
        actions.template.createdComponents([{
          model: 'Import',
          _id: 'i1',
        }], 'imports-i1')
      );

      expect(selectors.redirectToOnInstallationComplete(state, {
        resourceId: 'i1',
        resourceType: 'imports',
      })).toEqual(
        {
          redirectTo: '/imports',
        }
      );
    });
  });

  describe('selectors.installSetup test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.installSetup(undefined, {})).toEqual({});
    });

    test('should return template if templateId is passed', () => {
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(
          [{
            stepId: 'sid',
          }], undefined, 't1'
        )
      );

      expect(selectors.installSetup(state, {templateId: 't1'})).toEqual(
        {
          installSteps: [{
            stepId: 'sid',
          }],
        }
      );
    });

    test('should return template if resource is passed', () => {
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(
          [{
            stepId: 'sid',
          }], undefined, 'exports-e1'
        )
      );

      expect(selectors.installSetup(state, {
        resourceType: 'exports',
        resourceId: 'e1',
      })).toEqual(
        {
          installSteps: [{
            stepId: 'sid',
          }],
        }
      );
    });

    test('should return empty object if state doesn\'t have resource or template', () => {
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(
          [{
            stepId: 'sid',
          }], undefined, 'exports-e1'
        )
      );

      expect(selectors.installSetup(state, {
        resourceType: 'exports',
        resourceId: 'e2',
      })).toEqual({});
      expect(selectors.installSetup(state, {
        templateId: 't1',
      })).toEqual({});
    });
  });

  describe('selectors.templateSetup test cases', () => {
    test('should not throw any exception for invalid arguments', () => {
      expect(selectors.templateSetup()).toEqual({});
    });
    test('should return template if templateId is passed', () => {
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(
          [{
            stepId: 'sid',
          }], undefined, 't1'
        )
      );

      expect(selectors.templateSetup(state, 't1')).toEqual(
        {
          installSteps: [{
            stepId: 'sid',
          }],
        }
      );
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

    test('should return install steps with current step set', () => {
      const installSteps = [
        {
          name: 'step name',
          stepId: 'sid',
        },
      ];
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(installSteps, undefined, 'exports-e1')
      );

      expect(selectors.cloneInstallSteps(state, 'exports', 'e1')).toEqual([
        {
          name: 'step name',
          stepId: 'sid',
          isCurrentStep: true,
        },
      ]);
    });

    test('should return install steps with current step set at correct place', () => {
      const installSteps = [
        {
          name: 'step name',
          stepId: 'sid',
          completed: true,
        },
        {
          name: 'step2',
        },
      ];
      const state = reducer(
        undefined,
        actions.template.installStepsReceived(installSteps, undefined, 'flows-f1')
      );

      expect(selectors.cloneInstallSteps(state, 'flows', 'f1')).toEqual([
        {
          name: 'step name',
          stepId: 'sid',
          completed: true,
        },
        {
          name: 'step2',
          isCurrentStep: true,
        },
      ]);
    });
  });
});

