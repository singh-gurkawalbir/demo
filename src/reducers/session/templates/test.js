
import reducer, { selectors } from '.';
import actions from '../../../actions';
import { INSTALL_STEP_TYPES } from '../../../constants';
import { COMM_STATES as PUBLISH_STATES } from '../../comms/networkComms';

describe('template test cases', () => {
  let installSteps = [
    {
      name: 'installStep',
      description: 'something',
      type: 'Stack',
    },
    {
      name: 'installStep',
      description: 'something',
      _connectionId: 'connectionId',
      type: INSTALL_STEP_TYPES.CONNECTION,
    },
    {
      name: 'installUrl',
      description: 'something',
      installURL: 'connectionId',
      type: INSTALL_STEP_TYPES.INSTALL_PACKAGE,
    },
  ];
  const connectionMap = {
    _connectionId1: { name: 'connection' },
    _connectionId2: { name: 'connection2' },
  };
  const testTemplates = [
    {
      _id: '58e718fe160a77244b441a46',
      name: 'templ',
      description: 'templ desc',
      imageURL: '',
      websiteURL: '',
      user: { name: 'Sravan Dandra', company: 'Celigo' },
    },
    {
      _id: '58e7196e160a77244b441a47',
      name: 'temp2',
      description: 'temp2',
      imageURL: '',
      websiteURL: '',
      user: { name: 'Sravan Dandra', company: 'Celigo' },
    },
    {
      _id: '590976d7534bbbfcaf656ca8',
      name: 'asdfas',
      description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      imageURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
      websiteURL: 'https://www.gstatic.com',
      applications: ['netsuite', 'zendesk'],
      user: { name: 'Sravan Dandra', company: 'Celigo' },
    },
    {
      _id: '5d89f6c483ff843008ec9d37',
      name: 'Template Test',
      description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus at nisl interdum, cursus nibh et, ornare lorem. Donec ornare ullamcorper risus a cursus. Nullam pellentesque id lectus vitae placerat. In ipsum urna, convallis id odio quis, sollicitudin interdum arcu. Ut condimentum maximus arcu a placerat. Nulla congue volutpat sem. Nunc vestibulum, est eu porta hendrerit, purus ante egestas nunc, eget ullamcorper massa nulla sit amet turpis. Etiam ut venenatis nisl. Proin vehicula turpis ac bibendum aliquam. Duis sed consequat diam. Curabitur nec dignissim nunc.\n\nAenean mauris odio, interdum pulvinar bibendum ut, dapibus et dui. Donec dignissim suscipit arcu a tempus. Cras pellentesque, tortor eu placerat tincidunt, neque libero laoreet lacus, in luctus erat dui ut urna. Vivamus eleifend urna vitae sem volutpat, id finibus nunc consectetur. Pellentesque interdum, ipsum vel tincidunt faucibus, nisi augue venenatis augue, quis vehicula dui felis et neque. Duis posuere sollicitudin lectus quis sodales. Donec pellentesque, nisl ac pulvinar porttitor, odio libero dapibus turpis, quis porta ex turpis id ex. Suspendisse quis elit ligula. Donec eget nibh vitae nunc euismod mattis id at orci. Donec consequat magna eu est semper pretium. Nam in dui eu massa aliquam blandit.',
      imageURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
      websiteURL: 'https://www.gstatic.com',
      applications: ['netsuite', 'salesforce'],
      user: { name: 'Sravan Dandra', company: 'Celigo' },
    },
    {
      _id: '5d8b77f783ff843008ec9d65',
      name: 'Stsck Template Test',
      description: 'Stack TEmplate test description',
      imageURL: 'https://www.gstatic.com/webp/gallery/1.jpg',
      websiteURL: 'https://www.gstatic.com',
      applications: ['netsuite', 'salesforce'],
      user: { name: 'Sravan Dandra', company: 'Celigo' },
    },
  ];
  const testCreatedComponents = [
    { model: 'Integration', _id: 'integrationId' },
    { model: 'Export', _id: '_exportId' },
  ];
  const testComponents = {
    objects: [
      {
        model: 'Integration',
        doc: {
          _id: '5d8b75de83ff843008ec9d44',
          name: 'Stsck Template Test',
          description: 'Description',
          install: [],
          installSteps: [],
          uninstallSteps: [],
        },
      },
      {
        model: 'Connection',
        doc: {
          _id: '5d8b760e83ff843008ec9d48',
          type: 'netsuite',
          name: 'NetSuite Connection',
          netsuite: { wsdlVersion: 'current', concurrencyLevel: 1 },
        },
      },
      {
        model: 'Connection',
        doc: {
          _id: '5d8b762b83ff843008ec9d4d',
          type: 'salesforce',
          name: 'Salesforce Connection',
          salesforce: { sandbox: false, scope: [], concurrencyLevel: 5 },
        },
      },
      {
        model: 'Flow',
        doc: {
          _id: '5d8b75ec83ff843008ec9d46',
          name: 'NetSuite to Salesforce',
          skipRetries: false,
          pageProcessors: [
            {
              responseMapping: { fields: [], lists: [] },
              type: 'import',
              _importId: '5d8b773683ff843008ec9d55',
            },
          ],
          pageGenerators: [{ _exportId: '5d8b76e183ff843008ec9d52' }],
          wizardState: 'done',
        },
      },
      {
        model: 'Flow',
        doc: {
          _id: '5d8b775983ff843008ec9d5b',
          name: 'Salesforce to NetSuite',
          skipRetries: false,
          pageProcessors: [
            {
              responseMapping: { fields: [], lists: [] },
              type: 'import',
              _importId: '5d8b779883ff843008ec9d61',
            },
          ],
          pageGenerators: [{ _exportId: '5d8b777983ff843008ec9d5e' }],
          wizardState: 'done',
        },
      },
      {
        model: 'Export',
        doc: {
          _id: '5d8b76e183ff843008ec9d52',
          name: 'NetSuite export realtime',
          _connectionId: '5d8b760e83ff843008ec9d48',
          asynchronous: true,
          type: 'distributed',
          parsers: [],
          netsuite: {
            type: 'distributed',
            skipGrouping: false,
            statsOnly: false,
            restlet: { criteria: [] },
            distributed: {
              executionContext: ['userinterface', 'webstore'],
              executionType: ['create', 'edit', 'xedit'],
              recordType: 'customer',
              disabled: false,
              sublists: null,
              forceReload: false,
              ioDomain: null,
              ioEnvironment: '',
              qualifier: null,
              settings: null,
              skipExportFieldId: null,
            },
          },
          transform: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          filter: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          inputFilter: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          adaptorType: 'NetSuiteExport',
          distributed: {
            recordType: 'customer',
            executionContext: ['userinterface', 'webstore'],
            executionType: ['create', 'edit', 'xedit'],
            qualifier: null,
            skipExportFieldId: null,
            sublists: null,
            forceReload: false,
            disabled: false,
            ioDomain: null,
          },
        },
      },
      {
        model: 'Export',
        doc: {
          _id: '5d8b777983ff843008ec9d5e',
          name: 'Salesforce realtime export',
          _connectionId: '5d8b762b83ff843008ec9d4d',
          asynchronous: true,
          type: 'distributed',
          parsers: [],
          salesforce: {
            sObjectType: 'Account',
            distributed: {
              referencedFields: [null],
              disabled: false,
              qualifier: null,
              userDefinedReferencedFields: [null],
              relatedLists: [],
            },
          },
          transform: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          filter: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          inputFilter: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          adaptorType: 'SalesforceExport',
          distributed: {
            connectorId: null,
            disabled: false,
            referencedFields: [null],
            sObjectType: 'Account',
            userDefinedReferencedFields: [null],
            qualifier: null,
            relatedLists: null,
          },
        },
      },
      {
        model: 'Import',
        doc: {
          _id: '5d8b779883ff843008ec9d61',
          name: 'NetSuite Import',
          responseTransform: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          parsers: [],
          _connectionId: '5d8b760e83ff843008ec9d48',
          distributed: true,
          lookups: [],
          netsuite_da: {
            operation: 'add',
            recordType: 'account',
            lookups: [],
            mapping: { fields: [], lists: [] },
          },
          filter: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          adaptorType: 'NetSuiteDistributedImport',
        },
      },
      {
        model: 'Import',
        doc: {
          _id: '5d8b773683ff843008ec9d55',
          name: 'Salesforce import',
          responseTransform: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          _connectionId: '5d8b762b83ff843008ec9d4d',
          distributed: false,
          hooks: { preMap: { function: 'HighTech' } },
          salesforce: {
            operation: 'insert',
            sObjectType: 'Account',
            api: 'soap',
            removeNonSubmittableFields: false,
          },
          filter: {
            type: 'expression',
            expression: { version: '1' },
            version: '1',
          },
          adaptorType: 'SalesforceImport',
        },
      },
    ],
    stackRequired: true,
    stackProvided: false,
  };
  const testTemplateId = testTemplates[0]._id;
  const testTemplateId2 = testTemplates[1]._id;

  describe('template reducer test cases', () => {
    test('should return initial state when action is not matched', () => {
      const state = reducer(undefined, { type: 'RANDOM_ACTION' });

      expect(state).toEqual({});
    });
    describe('template requested preview reducer', () => {
      test('should find the template with template Id and set status as requested', () => {
        const state = reducer(
          {},
          actions.template.requestPreview(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { preview: {status: 'requested'}},
        });
      });

      test('should find the template with template Id and reset the status value', () => {
        const state = reducer(
          { [testTemplateId]: {
            preview: {
              status: '',
            },
          },
          anotherTemplate: {
            preview: testComponents,
            connectionMap: { abc: 'def' },
          } },
          actions.template.requestPreview(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { preview: { status: 'requested'} },
          anotherTemplate: {
            preview: testComponents,
            connectionMap: { abc: 'def' },
          },
        });
      });
    });

    describe('template received preview reducer', () => {
      test('should find the template with template Id and set preview value', () => {
        const state = reducer(
          {},
          actions.template.receivedPreview(testComponents, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { preview: {components: testComponents, status: 'success'} },
        });
      });

      test('should find the template with template Id and reset the existing  value', () => {
        const state = reducer(
          { [testTemplateId]: {},
            anotherTemplate: {
              preview: testComponents,
              connectionMap: { abc: 'def' },
            } },

          actions.template.receivedPreview(testComponents, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { preview: {components: testComponents, status: 'success'} },
          anotherTemplate: {
            preview: testComponents,
            connectionMap: { abc: 'def' },
          },
        });
      });
    });

    describe('template failed preview reducer', () => {
      test('should find the template with template Id and set status as failed', () => {
        const state = reducer(
          {},
          actions.template.failedPreview(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { preview: {status: 'failure'}},
        });
      });

      test('should find the template with template Id and reset the status value', () => {
        const state = reducer(
          { [testTemplateId]: {
            preview: {
              status: 'success',
            },
          },
          anotherTemplate: {
            preview: {
              status: 'requested',
            },
          } },
          actions.template.failedPreview(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { preview: { status: 'failure'} },
          anotherTemplate: {
            preview: {
              status: 'requested',
            },
          },
        });
      });
    });
    describe('template clear reducer', () => {
      test('should find the template with template Id and clear its value', () => {
        const state = reducer(
          {
            [testTemplateId]: {
              preview: testComponents,
              connectionMap: { test: '123' },
            },
          },
          actions.template.clearTemplate(testTemplateId)
        );

        expect(state).toEqual({});
      });

      test('should find the template with template Id clear it but shouldnt clear other templates', () => {
        const state = reducer(
          {
            [testTemplateId]: {
              preview: testComponents,
              connectionMap: { test: '123' },
            },
            anotherTemplate: {
              preview: testComponents,
              connectionMap: { abc: 'def' },
            },
          },
          actions.template.clearTemplate(testTemplateId)
        );

        expect(state).toEqual({
          anotherTemplate: {
            preview: testComponents,
            connectionMap: { abc: 'def' },
          },
        });
      });
    });

    describe('template clear uploaded reducer', () => {
      test('should find the template with template Id and clear isInstallIntegration property', () => {
        const state = reducer(
          {
            [testTemplateId]: {
              preview: testComponents,
              connectionMap: { test: '123' },
              isInstallIntegration: true,
            },
          },
          actions.template.clearUploaded(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: {
            preview: testComponents,
            connectionMap: { test: '123' },
          },
        });
      });

      test('should find the template with template Id clear its isInstallIntegration property when multiple templates exist', () => {
        const state = reducer(
          {
            [testTemplateId]: {
              preview: testComponents,
              connectionMap: { test: '123' },
              isInstallIntegration: true,
            },
            anotherTemplate: {
              preview: testComponents,
              connectionMap: { abc: 'def' },
              isInstallIntegration: true,
            },
          },
          actions.template.clearUploaded(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: {
            preview: testComponents,
            connectionMap: { test: '123' },
          },
          anotherTemplate: {
            preview: testComponents,
            connectionMap: { abc: 'def' },
            isInstallIntegration: true,
          },
        });
      });
    });

    describe('template created components reducer', () => {
      test('should find the template with template Id and set components value', () => {
        const state = reducer(
          {},
          actions.template.createdComponents(
            testCreatedComponents,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            createdComponents: [
              { _id: 'integrationId', model: 'Integration' },
              { _id: '_exportId', model: 'Export' },
            ],
          },
        });
      });

      test('should not throw error when createdComponents returned is null', () => {
        const state = reducer(
          {},
          actions.template.createdComponents(null, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: {
            createdComponents: null,
          },
        });
      });

      test('should find the correct template and set the value and should not affect other template data', () => {
        const state = reducer(
          {
            [testTemplateId]: {},
            secondTemplate: {
              preview: testComponents,
            },
          },
          actions.template.createdComponents(
            testCreatedComponents,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            createdComponents: [
              { _id: 'integrationId', model: 'Integration' },
              { _id: '_exportId', model: 'Export' },
            ],
          },
          secondTemplate: {
            preview: testComponents,
          },
        });
      });
      test('should find the correct template and set the value and should not affect other properties', () => {
        const state = reducer(
          {
            [testTemplateId]: {
              connectionMap: { c1: 'c1', c2: 'c2' },
              stackId: '_stackId',
            },
            secondTemplate: {
              preview: testComponents,
              connectionMap: { c1: 'c1', c2: 'c2' },
            },
          },
          actions.template.createdComponents(
            testCreatedComponents,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            connectionMap: { c1: 'c1', c2: 'c2' },
            stackId: '_stackId',
            createdComponents: [
              { _id: 'integrationId', model: 'Integration' },
              { _id: '_exportId', model: 'Export' },
            ],
          },
          secondTemplate: {
            preview: testComponents,
            connectionMap: { c1: 'c1', c2: 'c2' },
          },
        });
      });
    });

    describe('template steps received reducer', () => {
      test('should find the template with template Id and set installSteps and connectionMap', () => {
        const state = reducer(
          {},
          actions.template.installStepsReceived(
            installSteps,
            connectionMap,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            installSteps,
            connectionMap,
          },
        });
      });

      test('should not throw error when steps returned is null', () => {
        const state = reducer(
          {},
          actions.template.installStepsReceived(null, null, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: {
            installSteps: null,
            connectionMap: null,
          },
        });
      });

      test('should find the correct template and set the value and should not affect other template data', () => {
        const state = reducer(
          {
            [testTemplateId]: {},
            secondTemplate: {
              preview: testComponents,
            },
          },
          actions.template.installStepsReceived(
            installSteps,
            connectionMap,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            installSteps,
            connectionMap,
          },
          secondTemplate: {
            preview: testComponents,
          },
        });
      });
      test('should find the correct template and set the value and should not affect other properties', () => {
        const state = reducer(
          {
            [testTemplateId]: {
              connectionMap: { c1: 'c1', c2: 'c2' },
              stackId: '_stackId',
            },
            secondTemplate: {
              preview: testComponents,
              connectionMap: { c1: 'c1', c2: 'c2' },
            },
          },
          actions.template.installStepsReceived(
            installSteps,
            connectionMap,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            connectionMap,
            stackId: '_stackId',
            installSteps,
          },
          secondTemplate: {
            preview: testComponents,
            connectionMap: { c1: 'c1', c2: 'c2' },
          },
        });
      });
    });

    describe('template steps received reducer duplicate', () => {
      test('should find the template with template Id and set installSteps and connectionMap', () => {
        const state = reducer(
          {},
          actions.template.installStepsReceived(
            installSteps,
            connectionMap,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            installSteps,
            connectionMap,
          },
        });
      });

      test('should not throw error when steps returned is null', () => {
        const state = reducer(
          {},
          actions.template.installStepsReceived(null, null, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: {
            installSteps: null,
            connectionMap: null,
          },
        });
      });

      test('should find the correct template and set the value and should not affect other template data', () => {
        const state = reducer(
          {
            [testTemplateId]: {},
            secondTemplate: {
              preview: testComponents,
            },
          },
          actions.template.installStepsReceived(
            installSteps,
            connectionMap,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            installSteps,
            connectionMap,
          },
          secondTemplate: {
            preview: testComponents,
          },
        });
      });
      test('should find the correct template and set the value and should not affect other properties', () => {
        const state = reducer(
          {
            [testTemplateId]: {
              connectionMap: { c1: 'c1', c2: 'c2' },
              stackId: '_stackId',
            },
            secondTemplate: {
              preview: testComponents,
              connectionMap: { c1: 'c1', c2: 'c2' },
            },
          },
          actions.template.installStepsReceived(
            installSteps,
            connectionMap,
            testTemplateId
          )
        );

        expect(state).toEqual({
          [testTemplateId]: {
            connectionMap,
            stackId: '_stackId',
            installSteps,
          },
          secondTemplate: {
            preview: testComponents,
            connectionMap: { c1: 'c1', c2: 'c2' },
          },
        });
      });
    });
    describe('template update steps reducer', () => {
      test('should not affect the existing state if invalid templateId is passed', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
        };
        const state = reducer(
          {
            [testTemplateId]: {},
            secondTemplate: {
              preview: testComponents,
            },
          },
          actions.template.updateStep(step, 'invalidTemplateId')
        );

        expect(state).toEqual({
          [testTemplateId]: {},
          invalidTemplateId: {},
          secondTemplate: {
            preview: testComponents,
          },
        });
      });

      test('should not affect the existing state if invalid step is passed', () => {
        const step = {
          name: 'installStep2',
          description: 'something2',
          _connectionId: 'connectionId2',
          type: 'Connection',
          status: 'failed',
        };
        const state = reducer(
          {
            [testTemplateId]: { installSteps },
            secondTemplate: {
              preview: testComponents,
            },
          },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { installSteps },
          secondTemplate: {
            preview: testComponents,
          },
        });
      });
      test('should find the template with template Id and set status details on the step', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
          status: 'triggered',
        };
        const state = reducer(
          { [testTemplateId]: { installSteps } },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          '58e718fe160a77244b441a46': {
            installSteps: [
              { description: 'something', name: 'installStep', type: 'Stack' },
              {
                _connectionId: 'connectionId',
                description: 'something',
                isTriggered: true,
                name: 'installStep',
                type: 'Connection',
              },
              {
                description: 'something',
                installURL: 'connectionId',
                name: 'installUrl',
                type: 'installPackage',
              },
            ],
          },
        });
      });
      test('should find the template with template Id and set correct status details on the step', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
          status: 'verifying',
        };
        const state = reducer(
          { [testTemplateId]: { installSteps } },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          '58e718fe160a77244b441a46': {
            installSteps: [
              { description: 'something', name: 'installStep', type: 'Stack' },
              {
                _connectionId: 'connectionId',
                description: 'something',
                isTriggered: true,
                verifying: true,
                name: 'installStep',
                type: 'Connection',
              },
              {
                description: 'something',
                installURL: 'connectionId',
                name: 'installUrl',
                type: 'installPackage',
              },
            ],
          },
        });
      });

      test('should set correct status details with stack id on the step if status is completed', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
          status: 'completed',
          stackId: 'stack-id',
        };
        const state = reducer(
          { [testTemplateId]: { installSteps } },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          '58e718fe160a77244b441a46': {
            stackId: 'stack-id',
            installSteps: [
              { description: 'something', name: 'installStep', type: 'Stack' },
              {
                _connectionId: 'connectionId',
                description: 'something',
                completed: true,
                name: 'installStep',
                type: 'Connection',
              },
              {
                description: 'something',
                installURL: 'connectionId',
                name: 'installUrl',
                type: 'installPackage',
              },
            ],
          },
        });
      });

      test('should set correct status details on the step if status is completed and verifyBundleStep is present', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
          status: 'completed',
          newConnectionId: 'new-conn',
          verifyBundleStep: 'netsuite',
        };

        installSteps = [...installSteps,
          {
            name: 'installBundle',
            description: 'something',
            installURL: 'connectionId',
            type: INSTALL_STEP_TYPES.INSTALL_PACKAGE,
            application: 'netsuite',
            sourceConnectionId: 'connectionId',
            completed: false,
            options: {},
          },
        ];

        const state = reducer(
          { [testTemplateId]: { installSteps } },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          '58e718fe160a77244b441a46': {
            cMap: {
              connectionId: 'new-conn',
            },
            installSteps: [
              { description: 'something', name: 'installStep', type: 'Stack' },
              {
                _connectionId: 'connectionId',
                description: 'something',
                completed: true,
                name: 'installStep',
                type: 'Connection',
              },
              {
                description: 'something',
                installURL: 'connectionId',
                name: 'installUrl',
                type: 'installPackage',
              },
              {
                completed: false,
                application: 'netsuite',
                description: 'something',
                installURL: 'connectionId',
                name: 'installBundle',
                type: 'installPackage',
                sourceConnectionId: 'connectionId',
                options: {},
              },
            ],
          },
        });
        installSteps.pop();
      });

      test('should set correct details on the step if the status is failed', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
          status: 'failed',
        };
        const state = reducer(
          { [testTemplateId]: { installSteps } },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          '58e718fe160a77244b441a46': {
            installSteps: [
              { description: 'something', name: 'installStep', type: 'Stack' },
              {
                _connectionId: 'connectionId',
                description: 'something',
                isTriggered: false,
                verifying: false,
                name: 'installStep',
                type: 'Connection',
              },
              {
                description: 'something',
                installURL: 'connectionId',
                name: 'installUrl',
                type: 'installPackage',
              },
            ],
          },
        });
      });

      test('should not affect the step if invalid status in passed', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
          status: 'invalid_status',
        };
        const state = reducer(
          { [testTemplateId]: { installSteps } },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          '58e718fe160a77244b441a46': {
            installSteps: [
              { description: 'something', name: 'installStep', type: 'Stack' },
              {
                _connectionId: 'connectionId',
                description: 'something',
                name: 'installStep',
                type: 'Connection',
              },
              {
                description: 'something',
                installURL: 'connectionId',
                name: 'installUrl',
                type: 'installPackage',
              },
            ],
          },
        });
      });

      test('should not throw error when step  is null', () => {
        const state = reducer(
          {},
          actions.template.updateStep(undefined, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: {},
        });
      });

      test('should find the correct template and set the value and should not affect other template data', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
          status: 'verifying2',
        };
        const state = reducer(
          {
            [testTemplateId]: {
              installSteps,
            },
            secondTemplate: {
              preview: testComponents,
            },
          },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: {
            installSteps,
          },
          secondTemplate: {
            preview: testComponents,
          },
        });
      });
      test('should find the correct template and set the value and should not affect other properties', () => {
        const step = {
          name: 'installStep',
          description: 'something',
          _connectionId: 'connectionId',
          type: 'Connection',
          status: 'verifying2',
        };
        const state = reducer(
          {
            [testTemplateId]: {
              connectionMap,
              stackId: '_stackId',
              installSteps,
            },
            secondTemplate: {
              preview: testComponents,
              connectionMap: { c1: 'c1', c2: 'c2' },
            },
          },
          actions.template.updateStep(step, testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: {
            connectionMap,
            stackId: '_stackId',
            installSteps,
          },
          secondTemplate: {
            preview: testComponents,
            connectionMap: { c1: 'c1', c2: 'c2' },
          },
        });
      });
    });

    describe('template failed install reducer', () => {
      test('should find the template with template Id and set isInstallFailed', () => {
        const state = reducer(
          {},
          actions.template.failedInstall(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { isInstallFailed: true},
        });
      });

      test('should find the template with template Id and set the isInstalled flag', () => {
        const state = reducer(
          { [testTemplateId]: {
            installSteps,
            isInstallFailed: false,
          },
          anotherTemplate: {
            installSteps,
            isInstalled: true,
          } },
          actions.template.failedInstall(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { installSteps, isInstallFailed: true },
          anotherTemplate: {
            installSteps,
            isInstalled: true,
          },
        });
      });
    });

    describe('template publish request reducer', () => {
      test('should create new template state and set publishStatus flag', () => {
        const state = reducer(
          {},
          actions.template.publish.request(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { publishStatus: PUBLISH_STATES.LOADING},
        });
      });

      test('should find the template with template Id and set publishStatus flag', () => {
        const state = reducer(
          { [testTemplateId]: {
            installSteps,
            publishStatus: PUBLISH_STATES.ERROR,
          },
          anotherTemplate: {
            installSteps,
            isInstalled: true,
          } },
          actions.template.publish.request(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { installSteps, publishStatus: PUBLISH_STATES.LOADING },
          anotherTemplate: {
            installSteps,
            isInstalled: true,
          },
        });
      });
    });

    describe('template publish success reducer', () => {
      test('should create new template state and set publishStatus flag', () => {
        const state = reducer(
          {},
          actions.template.publish.success(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { publishStatus: PUBLISH_STATES.SUCCESS},
        });
      });

      test('should find the template with template Id and set publishStatus flag', () => {
        const state = reducer(
          { [testTemplateId]: {
            installSteps,
            publishStatus: PUBLISH_STATES.ERROR,
          },
          anotherTemplate: {
            installSteps,
            isInstalled: true,
          } },
          actions.template.publish.success(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { installSteps, publishStatus: PUBLISH_STATES.SUCCESS },
          anotherTemplate: {
            installSteps,
            isInstalled: true,
          },
        });
      });
    });

    describe('template publish error reducer', () => {
      test('should create new template state and set publishStatus flag', () => {
        const state = reducer(
          {},
          actions.template.publish.error(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { publishStatus: PUBLISH_STATES.ERROR},
        });
      });

      test('should find the template with template Id and set publishStatus flag', () => {
        const state = reducer(
          { [testTemplateId]: {
            installSteps,
            publishStatus: PUBLISH_STATES.SUCCESS,
          },
          anotherTemplate: {
            installSteps,
            isInstalled: true,
          } },
          actions.template.publish.error(testTemplateId)
        );

        expect(state).toEqual({
          [testTemplateId]: { installSteps, publishStatus: PUBLISH_STATES.ERROR },
          anotherTemplate: {
            installSteps,
            isInstalled: true,
          },
        });
      });
    });
  });

  describe('template selector test cases', () => {
    test('should return empty object if state does not exist', () => {
      expect(selectors.template(undefined)).toEqual({});
      expect(selectors.previewTemplate(undefined)).toEqual({});
      expect(selectors.templateInstallSteps(undefined)).toEqual([]);
      expect(selectors.connectionMap(undefined)).toEqual({});
      expect(selectors.isFileUploaded(undefined)).toEqual({});
      expect(selectors.isPreviewStatusFailed(undefined)).toEqual({previewFailedStatus: false});
    });

    test('should return template with selected id from the state', () => {
      let state = reducer(
        {},
        actions.template.receivedPreview(testComponents, testTemplateId)
      );

      state = reducer(
        state,
        actions.template.receivedPreview(testCreatedComponents, testTemplateId2)
      );

      expect(selectors.template(state, testTemplateId)).toEqual({
        isInstallIntegration: undefined,
        preview: {
          components: testComponents,
          status: 'success',
        },
      });

      expect(selectors.previewTemplate(state, testTemplateId)).toEqual({
        components: testComponents,
        status: 'success',
      });
    });

    test('should return install steps and connection map for selected template id', () => {
      let state = reducer(
        {},
        actions.template.installStepsReceived(
          installSteps,
          connectionMap,
          testTemplateId
        )
      );

      state = reducer(
        state,
        actions.template.installStepsReceived(
          null,
          null,
          testTemplateId2
        )
      );

      expect(selectors.templateInstallSteps(state, testTemplateId)).toEqual(installSteps);
      expect(selectors.connectionMap(state, testTemplateId)).toEqual(connectionMap);
    });

    test('should return uploaded template id with isFileUploaded flag', () => {
      let state = reducer(
        {},
        actions.template.receivedPreview(testComponents, testTemplateId, true)
      );

      state = reducer(
        state,
        actions.template.receivedPreview(testCreatedComponents, testTemplateId2)
      );

      expect(selectors.isFileUploaded(state)).toEqual({
        templateId: testTemplateId,
        isFileUploaded: true,
      });
    });
    test('should return uploaded template id with previewFailedStatus flag', () => {
      const state = reducer(
        {},
        actions.template.failedPreview(testTemplateId)
      );

      expect(selectors.isPreviewStatusFailed(state)).toEqual({
        id: testTemplateId,
        previewFailedStatus: true,
      });
    });
    test('should return template id state with publishStatus flag', () => {
      const state = reducer(
        {},
        actions.template.publish.success(testTemplateId)
      );

      expect(selectors.templatePublishStatus(state, testTemplateId)).toEqual(PUBLISH_STATES.SUCCESS);
    });
    test('should return template id state with publishStatus as failed if state does not exist', () => {
      expect(selectors.templatePublishStatus(null, testTemplateId)).toBe('failed');
    });
  });
});
