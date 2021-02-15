/* global describe, expect, test */
import reducer, { selectors } from '.';
import actions from '../actions';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../utils/constants';

describe('tests for reducer selectors', () => {
  describe('tests for selector getResourceEditUrl', () => {
    test('should return edit url for exports', () => {
      const resourceType = 'exports';
      const resourceId = '1';
      const resource = { _id: resourceId, name: 'bob' };
      const state = reducer(
        undefined,
        actions.resource.received(resourceType, resource)
      );

      expect(selectors.getResourceEditUrl(state, resourceType, resourceId)).toEqual(
        `/${resourceType}/edit/${resourceType}/${resourceId}`
      );
    });

    test('should return edit url for imports', () => {
      const resourceType = 'imports';
      const resourceId = '1';
      const resource = { _id: resourceId, name: 'bob' };
      const state = reducer(
        undefined,
        actions.resource.received(resourceType, resource)
      );

      expect(selectors.getResourceEditUrl(state, resourceType, resourceId)).toEqual(
        `/${resourceType}/edit/${resourceType}/${resourceId}`
      );
    });

    test('should return edit url for dataLoader flows', () => {
      const resourceType = 'flows';
      const resourceId = '1';
      const resource = { _id: resourceId, name: 'bob', _exportId: 'se1' };

      const simpleExport = {
        _id: 'se1',
        type: 'simple',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', simpleExport)
      );

      state = reducer(
        state,
        actions.resource.received(resourceType, resource)
      );

      expect(selectors.getResourceEditUrl(state, resourceType, resourceId)).toEqual(
        `/integrations/none/dataLoader/${resourceId}`
      );
    });

    test('should return edit url for standalone flow', () => {
      const resourceType = 'flows';
      const resourceId = '1';
      const resource = { _id: resourceId, name: 'bob' };

      const state = reducer(
        undefined,
        actions.resource.received(resourceType, resource)
      );

      expect(selectors.getResourceEditUrl(state, resourceType, resourceId)).toEqual(
        `/integrations/none/flowBuilder/${resourceId}`
      );
    });

    test('should return edit url for standalone integration', () => {
      const resourceType = 'integrations';
      const resourceId = 'i1';
      const resource = { _id: resourceId, name: 'integration a to b' };

      const state = reducer(
        undefined,
        actions.resource.received(resourceType, resource)
      );

      expect(selectors.getResourceEditUrl(state, resourceType, resourceId)).toEqual(
        `/integrations/${resourceId}/flows`
      );
    });

    test('should return edit url for IA integration', () => {
      const resourceType = 'integrations';
      const resourceId = 'i1';
      const resource = { _id: resourceId, name: 'Salesforce NetSuite IntegrationApp', _connectorId: 'c1' };

      const state = reducer(
        undefined,
        actions.resource.received(resourceType, resource)
      );

      expect(selectors.getResourceEditUrl(state, resourceType, 'i1')).toEqual(
        `/integrationapps/SalesforceNetSuiteIntegrationApp/${resourceId}/flows`
      );
    });

    test('should return edit url for IA child integration', () => {
      const resourceType = 'integrations';
      const resourceId = 'i1';
      const childId = 'c1';
      const resource = { _id: resourceId, name: 'Salesforce NetSuite IntegrationApp', _connectorId: 'c1' };

      let state = reducer(
        undefined,
        actions.resource.received(resourceType, resource)
      );

      const childResource = {
        _id: 'c1',
        name: 'integration a to b',
        _parentId: 'i1',
        _connectorId: 'c1',
        childId,
      };

      state = reducer(
        state,
        actions.resource.received(resourceType, childResource)
      );

      expect(selectors.getResourceEditUrl(state, resourceType, 'i1', 'c1')).toEqual(
        `/integrationapps/SalesforceNetSuiteIntegrationApp/${resourceId}/child/${childId}/flows`
      );
    });

    test('should return edit url for IA flow', () => {
      const resourceType = 'integrations';
      const resourceId = 'i1';
      const childId = 'c1';
      const resource = { _id: resourceId, name: 'Salesforce NetSuite IntegrationApp', _connectorId: 'c1' };

      let state = reducer(
        undefined,
        actions.resource.received(resourceType, resource)
      );

      const childResource = {
        _id: 'c1',
        name: 'integration a to b',
        _parentId: 'i1',
        _connectorId: 'c1',
        childId,
      };

      state = reducer(
        state,
        actions.resource.received(resourceType, childResource)
      );

      const flow = {
        _id: 'f1',
        _connectorId: 'c1',
        _integrationId: 'i1',
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      expect(selectors.getResourceEditUrl(state, 'flows', 'f1')).toEqual(
        `/integrationapps/SalesforceNetSuiteIntegrationApp/${resourceId}/flowBuilder/f1`
      );
    });
  });

  describe('tests for util mkFlowConnectionList', () => {
    test('should return empty array for empty state and args', () => {
      const connectionListSelector = selectors.mkFlowConnectionList();

      expect(connectionListSelector()).toEqual([]);
    });
    test('should return all connections used in the flow', () => {
      const conns = [
        {
          _id: 'c1',
        },
        {
          _id: 'c2',
        },
        {
          _id: 'c3',
        },
        {
          _id: 'c4',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exps = [
        {
          _id: 'e1',
          _connectionId: 'c1',
        },
        {
          _id: 'e2',
          _connectionId: 'c2',
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('exports', exps)
      );

      const imps = [
        {
          _id: 'i1',
          _connectionId: 'c3',
        },
        {
          _id: 'i2',
          _connectionId: 'c4',
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('imports', imps)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
          {
            _exportId: 'e2',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
          {
            _importId: 'i2',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const connectionListSelector = selectors.mkFlowConnectionList();

      expect(connectionListSelector(state, 'f1')).toEqual([
        {
          _id: 'c1',
        },
        {
          _id: 'c2',
        },
        {
          _id: 'c3',
        },
        {
          _id: 'c4',
        },
      ]);
    });
    test('should return empty array for invalid flow id', () => {
      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
          {
            _exportId: 'e2',
          },
        ],
        pageProcessors: [
          {
            _importId: 'i1',
          },
          {
            _importId: 'i2',
          },
        ],
      };

      const state = reducer(
        undefined,
        actions.resource.received('flows', flow)
      );

      const connectionListSelector = selectors.mkFlowConnectionList();

      expect(connectionListSelector(state, 'if1')).toEqual([]);
    });

    test('should return connection ids used for dataloader flow', () => {
      const conns = [{
        _id: 'c1',
      }, {
        _id: 'c2',
      }];
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exp = {
        _id: 'e1',
        type: 'simple',
        adaptorType: 'simpleExport',
      };

      state = reducer(
        state,
        actions.resource.received('exports', exp)
      );

      const imp = {
        _id: 'i1',
        _connectionId: 'c1',
      };

      state = reducer(
        state,
        actions.resource.received('imports', imp)
      );

      const flow = {
        _id: 'f1',
        _exportId: 'e1',
        _importId: 'i1',
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const connectionListSelector = selectors.mkFlowConnectionList();

      expect(connectionListSelector(state, 'f1')).toEqual([
        {
          _id: 'c1',
        },
      ]);
    });

    test('should return connection ids used for webhook flow', () => {
      const conns = [{
        _id: 'c1',
      }, {
        _id: 'c2',
      }];
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exp = {
        _id: 'e1',
        type: 'webhook',
        adaptorType: 'WebhookExport',
      };

      state = reducer(
        state,
        actions.resource.received('exports', exp)
      );

      const imp = {
        _id: 'i1',
        _connectionId: 'c1',
        type: 'netsuite',
      };

      state = reducer(
        state,
        actions.resource.received('imports', imp)
      );

      const flow = {
        _id: 'f1',
        pageProcessors: [
          {
            type: 'import',
            _importId: 'i1',
          },
        ],
        pageGenerators: [
          {
            _exportId: 'e1',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const connectionListSelector = selectors.mkFlowConnectionList();

      expect(connectionListSelector(state, 'f1')).toEqual([
        {
          _id: 'c1',
        },
      ]);
    });
  });

  describe('tests for util mkIsAnyFlowConnectionOffline', () => {
    test('should return false for empty state and args', () => {
      const isAnyConnOfflineSelector = selectors.mkIsAnyFlowConnectionOffline();

      expect(isAnyConnOfflineSelector()).toEqual(false);
    });
    test('should return false for invalid connection id', () => {
      const isAnyConnOfflineSelector = selectors.mkIsAnyFlowConnectionOffline();

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
          {
            _exportId: 'e2',
          },
        ],
      };

      const state = reducer(
        undefined,
        actions.resource.received('flows', flow)
      );

      expect(isAnyConnOfflineSelector(state, 'invalidConnId')).toEqual(false);
    });
    test('should return true if any conn used in flow is offline', () => {
      const conns = [
        {
          _id: 'c1',
          offline: true,
        },
        {
          _id: 'c2',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exps = [
        {
          _id: 'e1',
          _connectionId: 'c1',
        },
        {
          _id: 'e2',
          _connectionId: 'c2',
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('exports', exps)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
          {
            _exportId: 'e2',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const isAnyConnOfflineSelector = selectors.mkIsAnyFlowConnectionOffline();

      expect(isAnyConnOfflineSelector(state, 'f1')).toEqual(true);
    });

    test('should return false if all connections are not offline', () => {
      const conns = [
        {
          _id: 'c1',
        },
        {
          _id: 'c2',
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const exps = [
        {
          _id: 'e1',
          _connectionId: 'c1',
        },
        {
          _id: 'e2',
          _connectionId: 'c2',
        },
      ];

      state = reducer(
        state,
        actions.resource.receivedCollection('exports', exps)
      );

      const flow = {
        _id: 'f1',
        pageGenerators: [
          {
            _exportId: 'e1',
          },
          {
            _exportId: 'e2',
          },
        ],
      };

      state = reducer(
        state,
        actions.resource.received('flows', flow)
      );

      const isAnyConnOfflineSelector = selectors.mkIsAnyFlowConnectionOffline();

      expect(isAnyConnOfflineSelector(state, 'f1')).toEqual(false);
    });
  });

  describe('tests for util flowReferencesForResource', () => {
    test('should return empty array for empty args', () => {
      expect(selectors.flowReferencesForResource()).toEqual([]);
    });

    test('should return all the flow references for export', () => {
      const exp = {
        _id: 'e1',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flows = [
        {
          _id: 'f1',
          pageGenerators: [
            {
              _exportId: 'e1',
            },
          ],
        },
        {
          _id: 'f2',
          pageProcessors: [
            {
              _exportId: 'e1',
            },
          ],
        },
      ];

      state = reducer(
        state,
        actions.flowData.init(flows[0])
      );

      state = reducer(
        state,
        actions.flowData.init(flows[1])
      );

      expect(selectors.flowReferencesForResource(state, 'exports', 'e1')).toEqual(
        [
          {
            flowId: 'f1',
            resourceId: 'e1',
          },
          {
            flowId: 'f2',
            resourceId: 'e1',
          },
        ]
      );
    });

    test('should return all the flow references for import', () => {
      const imp = {
        _id: 'i1',
      };

      let state = reducer(
        undefined,
        actions.resource.received('imports', imp)
      );

      const flows = [
        {
          _id: 'f1',
          pageProcessors: [
            {
              _exportId: 'i1',
            },
          ],
        },
        {
          _id: 'f2',
          pageProcessors: [
            {
              _exportId: 'i1',
            },
          ],
        },
      ];

      state = reducer(
        state,
        actions.flowData.init(flows[0])
      );

      state = reducer(
        state,
        actions.flowData.init(flows[1])
      );

      expect(selectors.flowReferencesForResource(state, 'imports', 'i1')).toEqual(
        [
          {
            flowId: 'f1',
            resourceId: 'i1',
          },
          {
            flowId: 'f2',
            resourceId: 'i1',
          },
        ]
      );
    });

    test('should return empty array if resource not used in any flow', () => {
      const imp = {
        _id: 'i5',
      };

      let state = reducer(
        undefined,
        actions.resource.received('imports', imp)
      );

      const flows = [
        {
          _id: 'f1',
          pageProcessors: [
            {
              _exportId: 'i1',
            },
          ],
        },
        {
          _id: 'f2',
          pageProcessors: [
            {
              _exportId: 'i1',
            },
          ],
        },
      ];

      state = reducer(
        state,
        actions.flowData.init(flows[0])
      );

      state = reducer(
        state,
        actions.flowData.init(flows[1])
      );

      expect(selectors.flowReferencesForResource(state, 'imports', 'i5')).toEqual(
        []
      );
    });
  });

  describe('tests for util isPageGenerator', () => {
    test('should return false if resourceType is imports', () => {
      expect(selectors.isPageGenerator(undefined, 'f1', 'i1', 'imports')).toEqual(false);
    });

    test('should return true if resource is new and not of lookup type', () => {
      const state = reducer(
        undefined,
        actions.resource.received('exports', {
          _id: 'new-123',
          isLookup: false,
        })
      );

      expect(selectors.isPageGenerator(state, 'f1', 'new-123', 'exports')).toEqual(true);
    });

    test('should return false if resource is of lookup type', () => {
      const state = reducer(
        undefined,
        actions.resource.received('exports', {
          _id: 'new-123',
          isLookup: true,
        })
      );

      expect(selectors.isPageGenerator(state, 'f1', 'new-123', 'exports')).toEqual(false);
    });

    test('should return true if resource is of webhook type', () => {
      const state = reducer(
        undefined,
        actions.resource.received('exports', {
          _id: 'e1',
          type: 'webhook',
        })
      );

      expect(selectors.isPageGenerator(state, 'f1', 'e1', 'exports')).toEqual(true);
    });

    test('should search in flow doc and return true if resource is of page generator type', () => {
      let state = reducer(
        undefined,
        actions.resource.received('exports', {
          _id: 'e1',
        })
      );

      state = reducer(
        state,
        actions.resource.received('flows', {
          _id: 'f1',
          pageGenerators: [
            {
              _exportId: 'e1',
            },
          ],
        })
      );
      expect(selectors.isPageGenerator(state, 'f1', 'e1', 'exports')).toEqual(true);
    });

    test('should search in flow doc and return false if passed export is of page processor type', () => {
      let state = reducer(
        undefined,
        actions.resource.received('exports', {
          _id: 'e1',
        })
      );

      state = reducer(
        state,
        actions.resource.received('flows', {
          _id: 'f1',
          pageProcessors: [
            {
              _exportId: 'e1',
            },
          ],
        })
      );
      expect(selectors.isPageGenerator(state, 'f1', 'e1', 'exports')).toEqual(false);
    });
  });

  describe('tests for util getUsedActionsForResource', () => {
    test('should return false for all actions if no no action used for export', () => {
      const exp = {
        _id: 'e1',
      };

      const state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      expect(selectors.getUsedActionsForResource(state, 'e1', 'exports')).toEqual(
        {
          hooks: false,
          inputFilter: false,
          outputFilter: false,
          postResponseMap: false,
          proceedOnFailure: false,
          responseMapping: false,
          schedule: false,
          transformation: false,
        }
      );
    });

    test('should return true for actions used for an export', () => {
      const exp = {
        _id: 'e1',
        inputFilter: {
          type: 'expression',
          expression: {
            rules: [
              {
                name: 'dummyrule',
              },
            ],
          },
        },
        filter: {
          type: 'script',
          script: {
            _scriptId: 's1',
          },
        },
        transform: {
          type: 'expression',
          expression: {
            rules: [
              [
                {
                  name: 'dummyrule',
                },
              ],
            ],
          },
        },
        hooks: {
          presend: {
            function: 'f1',
          },
        },
      };

      const state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const flowDoc = {
        _id: 'f1',
        schedule: '? 10 3 ? * *',
        proceedOnFailure: true,
      };

      expect(selectors.getUsedActionsForResource(state, 'e1', 'exports', flowDoc)).toEqual(
        {
          hooks: true,
          inputFilter: true,
          outputFilter: true,
          postResponseMap: false,
          proceedOnFailure: true,
          responseMapping: false,
          schedule: true,
          transformation: true,
        }
      );
    });

    test('should return false for all actions if no no action used for import', () => {
      const imp = {
        _id: 'i1',
      };

      const state = reducer(
        undefined,
        actions.resource.received('imports', imp)
      );

      expect(selectors.getUsedActionsForResource(state, 'i1', 'imports')).toEqual(
        {
          hooks: false,
          importMapping: false,
          inputFilter: false,
          outputFilter: false,
          postResponseMap: false,
          proceedOnFailure: false,
          responseMapping: false,
          responseTransformation: false,
          templateMapping: false,
        }
      );
    });

    test('should return true for all actions used for import', () => {
      const imp = {
        _id: 'i1',
        filter: {
          type: 'script',
          script: {
            _scriptId: 's1',
          },
        },
        transform: {
          type: 'expression',
          expression: {
            rules: [
              [
                {
                  name: 'dummyrule',
                },
              ],
            ],
          },
        },
        hooks: {
          preMap: {
            function: 'f1',
          },
        },
        mapping: {
          fields: [
            {
              generate: 'g',
            },
          ],
        },
      };

      const state = reducer(
        undefined,
        actions.resource.received('imports', imp)
      );

      const flowDoc = {
        _id: 'f1',
        proceedOnFailure: true,
        responseMapping: {
          fields: [
            {
              generate: 'g',
            },
          ],
        },
      };

      expect(selectors.getUsedActionsForResource(state, 'i1', 'imports', flowDoc)).toEqual(
        {
          hooks: true,
          importMapping: true,
          inputFilter: true,
          outputFilter: true,
          postResponseMap: false,
          proceedOnFailure: true,
          responseMapping: true,
          responseTransformation: false,
          templateMapping: false,
        }
      );
    });
  });

  describe('tests for util transferListWithMetadata', () => {
    test('should return empty array for empty state', () => {
      expect(selectors.transferListWithMetadata(undefined)).toEqual([]);
    });

    test('should return transfers with updated metadata', () => {
      const transfers = [
        {
          _id: 't1',
          status: 'done',
          toTransfer: {
            integrations: [
              {
                _id: 'i1',
                name: 'test a',
                tag: 'sample',
              },
              {
                _id: 'i2',
                name: 'test b',
              },
              {
                _id: 'none',
                name: 'sf-ns int',
              },
              {
                _id: 'i6',
              },
            ],
          },
        },
        {
          _id: 't2',
          status: 'unapproved',
          toTransfer: {
            integrations: [
              {
                _id: 'i3',
                name: 'n3',
              },
            ],
          },
        },
        {
          _id: 't3',
          status: 'unapproved',
          toTransfer: {
            integrations: [
              {
                _id: 'i4',
                name: 'n4',
              },
            ],
          },
          ownerUser: {
            email: 'e1',
            _id: 'o1',
          },
        },
      ];

      const state = reducer(
        undefined,
        actions.resource.receivedCollection('transfers', transfers)
      );

      expect(selectors.transferListWithMetadata(state)).toEqual([
        {
          _id: 't1',
          status: 'done',
          toTransfer: {
            integrations: [
              {
                _id: 'i1',
                name: 'test a',
                tag: 'sample',
              },
              {
                _id: 'i2',
                name: 'test b',
              },
              {
                _id: 'none',
                name: 'sf-ns int',
              },
              {
                _id: 'i6',
              },
            ],
          },
          integrations: 'test a (sample)\ntest b\nStandalone flows\ni6',
        },
        {
          _id: 't2',
          status: 'unapproved',
          toTransfer: {
            integrations: [
              {
                _id: 'i3',
                name: 'n3',
              },
            ],
          },
          integrations: 'n3',
        },
      ]);
    });
  });
  describe('tests for util isRestCsvMediaTypeExport', () => {
    test('should return false if export is not of type rest', () => {
      const exp = {
        adaptorType: 'HTTPExport',
        _id: 'e1',
        _connectionId: 'c1',
      };

      const state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      expect(selectors.isRestCsvMediaTypeExport(state, 'e1')).toEqual(false);
    });

    test('should return true if export is of type rest and connection mediatype is of csv type', () => {
      const exp = {
        adaptorType: 'RESTExport',
        _id: 'e1',
        _connectionId: 'c1',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      const conn = {
        _id: 'c1',
        rest: {
          mediaType: 'csv',
        },
      };

      state = reducer(
        state,
        actions.resource.received('connections', conn)
      );

      expect(selectors.isRestCsvMediaTypeExport(state, 'e1')).toEqual(true);
    });
  });

  describe('tests for util isFileProviderAssistant', () => {
    test('should return false if export is not of type Http', () => {
      const exp = {
        _id: 'e1',
        adaptorType: 'RESTExport',
      };

      const state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      expect(selectors.isFileProviderAssistant(state, 'e1')).toEqual(false);
    });

    test('should return true if export is of type Http and conn of type googleDrive', () => {
      const exp = {
        _id: 'e1',
        adaptorType: 'HTTPExport',
        _connectionId: 'c1',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      state = reducer(
        state,
        actions.resource.received(
          'connections',
          {
            _id: 'c1',
            assistant: 'googledrive',
          }
        )
      );

      expect(selectors.isFileProviderAssistant(state, 'e1')).toEqual(true);
    });
  });

  describe('tests for util isDataLoaderExport', () => {
    test('should return false if export is not of dataloader type', () => {
      const exp = {
        _id: 'e1',
        type: 'distributed',
      };

      const state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      expect(selectors.isDataLoaderExport(state, 'e1')).toEqual(false);
    });

    test('should return true if export is of dataloader type', () => {
      const exp = {
        _id: 'e1',
        type: 'simple',
      };

      const state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      expect(selectors.isDataLoaderExport(state, 'e1')).toEqual(true);
    });

    test('should return true for new resource and with flowId specified for dataloader Flow', () => {
      const exp = {
        _id: 'new-1',
        type: 'simple',
      };

      let state = reducer(
        undefined,
        actions.resource.received('exports', exp)
      );

      state = reducer(
        state,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageGenerators: [
              {
                _exportId: 'new-1',
                application: 'dataLoader',
              },
            ],
          }
        )
      );

      expect(selectors.isDataLoaderExport(state, 'new-1', 'f1')).toEqual(true);
    });
  });

  describe('tests for util isFreeFlowResource', () => {
    test('should return false on empty state', () => {
      expect(selectors.isFreeFlowResource(undefined, 'f1')).toEqual(false);
    });

    test('should return true for free flow', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            free: true,
          }
        )
      );

      expect(selectors.isFreeFlowResource(state, 'f1')).toEqual(true);
    });

    test('should return false if flow is not free', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
          }
        )
      );

      expect(selectors.isFreeFlowResource(state, 'f1')).toEqual(false);
    });
  });

  describe('tests for util isFlowViewMode', () => {
    test('should return false on empty state', () => {
      expect(selectors.isFlowViewMode(undefined, 'i1', 'f1')).toEqual(false);
    });

    test('should return true for connector flow', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            _connectorId: 'c1',
          }
        )
      );

      expect(selectors.isFlowViewMode(state, 'i1', 'f1')).toEqual(true);
    });
    test('should return true if accessLevel is monitor', () => {
      const acc = {
        _id: 'ashare1',
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
      };
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('shared/ashares', [acc])
      );

      state = reducer(state,
        actions.resource.received('preferences', {
          defaultAShareId: 'ashare1',
        }));

      expect(selectors.isFlowViewMode(state, 'i1', 'f1')).toEqual(true);
    });

    test('should return true if access level is monitor for tile ashare', () => {
      const ownAccount =
        {
          _id: 'aShare3',
          accessLevel: USER_ACCESS_LEVELS.TILE,
          integrationAccessLevel: [
            {
              _integrationId: 'i1',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            },
            {
              _integrationId: 'i2',
              accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
            },
          ],
        };
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('shared/ashares', [ownAccount])
      );

      state = reducer(
        state,
        actions.resource.receivedCollection(
          'integrations',
          [
            { _id: 'i1', _registeredConnectionIds: ['c1', 'c2'] },
            { _id: 'i2', _registeredConnectionIds: ['c2', 'c3'] },
          ]
        )
      );

      state = reducer(state,
        actions.resource.received('preferences', {
          defaultAShareId: 'aShare3',
        }));

      expect(selectors.isFlowViewMode(state, 'i1', 'f1')).toEqual(true);
    });
  });

  describe('tests for util isDataLoaderFlow', () => {
    test('should return false for non dataLoader flow', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageGenerators: [
              {
                _exportId: 'e1',
              },
            ],
          }
        )
      );

      expect(selectors.isDataLoaderFlow(state, 'f1')).toEqual(false);
    });

    test('should return true for dataLoader flow', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageGenerators: [
              {
                _exportId: 'e1',
                application: 'dataLoader',
              },
            ],
          }
        )
      );

      expect(selectors.isDataLoaderFlow(state, 'f1')).toEqual(true);
    });

    test('should return true for dataLoader flow if export is of type simple', () => {
      let state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageGenerators: [
              {
                _exportId: 'e1',
              },
            ],
          }
        )
      );

      state = reducer(
        state,
        actions.resource.received(
          'exports',
          {
            _id: 'e1',
            type: 'simple',
          }
        )
      );

      expect(selectors.isDataLoaderFlow(state, 'f1')).toEqual(true);
    });
  });

  describe('tests for util shouldShowAddPageProcessor', () => {
    test('should return true for non dataloader flow', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageGenerators: [
              {
                _exportId: 'e1',
              },
            ],
          }
        )
      );

      expect(selectors.shouldShowAddPageProcessor(state, 'f1')).toEqual(true);
    });

    test('should return false for dataloader flow if page processor already exists', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageGenerators: [
              {
                _exportId: 'e1',
                application: 'dataLoader',
              },
            ],
            pageProcessors: [
              {
                _importId: 'i1',
              },
            ],
          }
        )
      );

      expect(selectors.shouldShowAddPageProcessor(state, 'f1')).toEqual(false);
    });

    test('should return true for dataloader flow if page processor not exists', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageGenerators: [
              {
                _exportId: 'e1',
                application: 'dataLoader',
              },
            ],
          }
        )
      );

      expect(selectors.shouldShowAddPageProcessor(state, 'f1')).toEqual(true);
    });
  });

  describe('tests for util isLookUpExport', () => {
    test('should return false if resource type is not exports', () => {
      expect(selectors.isLookUpExport(undefined, {
        flowId: 'f1',
        resourceType: 'imports',
        resourceId: 'i1',
      })).toEqual(false);
    });

    test('should return true if export is lookup type', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'exports',
          {
            _id: 'e1',
            isLookup: true,
          }
        )
      );

      expect(selectors.isLookUpExport(state, {
        flowId: 'f1',
        resourceType: 'exports',
        resourceId: 'e1',
      })).toEqual(true);
    });

    test('should return true if export used as pp in flow', () => {
      let state = reducer(
        undefined,
        actions.resource.received(
          'exports',
          {
            _id: 'e1',
          }
        )
      );

      state = reducer(
        state,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageProcessors: [
              {
                _exportId: 'e1',
              },
            ],
          }
        )
      );

      expect(selectors.isLookUpExport(state, {
        flowId: 'f1',
        resourceType: 'exports',
        resourceId: 'e1',
      })).toEqual(true);
    });
  });

  describe('tests for util getCustomResourceLabel', () => {
    test('should return empty string for empty resource', () => {
      expect(selectors.getCustomResourceLabel(undefined, {
        resourceId: 'e1',
        flowId: 'f1',
      })).toEqual('');
    });
    test('should return resourceLabel as lookup for lookup exports', () => {
      const state = reducer(
        undefined,
        actions.resource.received(
          'exports',
          {
            _id: 'e1',
            isLookup: true,
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceType: 'exports',
        flowId: 'f1',
        resourceId: 'e1',
      })).toEqual('Lookup');
    });

    test('should return resourceLabel as import for dataloader pageprocessor', () => {
      let state = reducer(
        undefined,
        actions.resource.received(
          'flows',
          {
            _id: 'f1',
            pageGenerators: [
              {
                _exportId: 'e1',
              },
            ],
          }
        )
      );

      state = reducer(
        state,
        actions.resource.received(
          'exports',
          {
            _id: 'e1',
            type: 'simple',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        flowId: 'f1',
        resourceType: 'pageProcessor',
        resourceId: 'e1',
      })).toEqual('Import');
    });

    test('should return resourceLabel on resourceType for new resources', () => {
      let state = reducer(
        undefined,
        actions.resource.received(
          'exports', {
            _id: 'new-123',
            resourceType: 'exportRecords',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceId: 'new-123',
        resourceType: 'exports',
        flowId: 'f1',
      })).toEqual('Export');

      state = reducer(
        undefined,
        actions.resource.received(
          'exports', {
            _id: 'new-123',
            resourceType: 'transferFiles',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceId: 'new-123',
        resourceType: 'exports',
        flowId: 'f1',
      })).toEqual('Transfer');

      state = reducer(
        undefined,
        actions.resource.received(
          'exports', {
            _id: 'new-123',
            resourceType: 'realtime',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceId: 'new-123',
        resourceType: 'exports',
        flowId: 'f1',
      })).toEqual('Listener');

      state = reducer(
        undefined,
        actions.resource.received(
          'exports', {
            _id: 'new-123',
            resourceType: 'lookupRecords',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceId: 'new-123',
        resourceType: 'exports',
        flowId: 'f1',
      })).toEqual('Lookup');

      state = reducer(
        undefined,
        actions.resource.received(
          'imports', {
            _id: 'new-123',
            resourceType: 'importRecords',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceId: 'new-123',
        resourceType: 'imports',
        flowId: 'f1',
      })).toEqual('Import');
    });

    test('should return resourceLabel as Transfer for blob resources', () => {
      let state = reducer(
        undefined,
        actions.resource.received(
          'exports', {
            _id: 'e1',
            adaptorType: 'NetSuiteExport',
            type: 'blob',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceType: 'exports',
        resourceId: 'e1',
        flowId: 'f1',
      })).toEqual('Transfer');

      state = reducer(
        undefined,
        actions.resource.received(
          'exports', {
            _id: 'e1',
            adaptorType: 'FTPExport',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceType: 'exports',
        resourceId: 'e1',
        flowId: 'f1',
      })).toEqual('Transfer');

      state = reducer(
        undefined,
        actions.resource.received(
          'imports', {
            _id: 'i1',
            adaptorType: 'FTPImport',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceType: 'imports',
        resourceId: 'i1',
        flowId: 'f1',
      })).toEqual('Transfer');

      state = reducer(
        undefined,
        actions.resource.received(
          'imports', {
            _id: 'i1',
            adaptorType: 'SalesforceImport',
            blob: true,
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceType: 'imports',
        resourceId: 'i1',
        flowId: 'f1',
      })).toEqual('Transfer');
    });

    test('should return resourceLabel as Listener for realtime exports', () => {
      let state = reducer(
        undefined,
        actions.resource.received(
          'exports', {
            _id: 'e1',
            adaptorType: 'NetSuiteExport',
            type: 'distributed',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceType: 'exports',
        resourceId: 'e1',
        flowId: 'f1',
      })).toEqual('Listener');

      state = reducer(
        undefined,
        actions.resource.received(
          'exports', {
            _id: 'e1',
            adaptorType: 'SalesforceExport',
            type: 'distributed',
          }
        )
      );

      expect(selectors.getCustomResourceLabel(state, {
        resourceType: 'exports',
        resourceId: 'e1',
        flowId: 'f1',
      })).toEqual('Listener');
    });
  });

  describe('tests for util resourcesByIds', () => {
    test('should return empty array for empty resourceIds', () => {
      expect(selectors.resourcesByIds(undefined, 'exports', [])).toEqual([]);
    });

    test('should return exports for with provided resourceIds', () => {
      const exportDocs = [
        {
          name: 'e1',
          _id: 'e1',
        },
        {
          name: 'e2',
          _id: 'e2',
        },
        {
          name: 'e3',
          _id: 'e3',
        },
        {
          name: 'e4',
          _id: 'e4',
        },
      ];
      const state = reducer(undefined,
        actions.resource.receivedCollection(
          'exports',
          exportDocs
        )
      );

      expect(selectors.resourcesByIds(state, 'exports', ['e1', 'e2'])).toEqual([
        {
          name: 'e1',
          _id: 'e1',
        },
        {
          name: 'e2',
          _id: 'e2',
        },
      ]);
    });

    test('should return imports for with provided resourceIds', () => {
      const importDocs = [
        {
          name: 'i1',
          _id: 'i1',
        },
        {
          name: 'i2',
          _id: 'i2',
        },
        {
          name: 'i3',
          _id: 'i3',
        },
        {
          name: 'i4',
          _id: 'i4',
        },
      ];
      const state = reducer(undefined,
        actions.resource.receivedCollection(
          'imports',
          importDocs
        )
      );

      expect(selectors.resourcesByIds(state, 'imports', ['i1', 'i2'])).toEqual([
        {
          name: 'i1',
          _id: 'i1',
        },
        {
          name: 'i2',
          _id: 'i2',
        },
      ]);
    });
  });

  describe('tests for util integrationEnabledFlowIds', () => {
    test('should return empty array for empty arguments', () => {
      expect(selectors.integrationEnabledFlowIds()).toEqual([]);
    });

    test('should return all enabled flows for an integration', () => {
      const flows = [
        {
          _integrationId: 'i1',
          _id: 'f1',
        },
        {
          _integrationId: 'i1',
          _id: 'f2',
          disabled: true,
        },
        {
          _integrationId: 'i1',
          _id: 'f3',
        },
      ];

      const state = reducer(
        undefined,
        actions.resource.receivedCollection('flows', flows)
      );

      expect(selectors.integrationEnabledFlowIds(state, 'i1')).toEqual(
        [
          'f1',
          'f3',
        ]
      );
    });
  });

  describe('tests for util suiteScriptJob', () => {
    const ssLinkedConnectionId = 'c1';
    const integrationId = 'i1';

    test('should return undefined for undefined state', () => {
      expect(selectors.suiteScriptJob(undefined, {
        ssLinkedConnectionId,
        integrationId,
      })).toEqual(undefined);
    });

    test('should return job for given job Id and type', () => {
      const jobsCollection = [
        {
          type: 'import',
          _id: 'j1',
          _integrationId: 'i1',
        },
        {
          type: 'import',
          _id: 'j2',
          _integrationId: 'i1',
        },
      ];

      const state = reducer(undefined,
        actions.suiteScript.job.receivedCollection({
          collection: jobsCollection,
        })
      );

      expect(selectors.suiteScriptJob(state, {
        ssLinkedConnectionId,
        integrationId,
        jobId: 'j1',
        jobType: 'import',
      })).toEqual({
        _id: 'j1',
        _integrationId: 'i1',
        type: 'import',
      });
    });
  });

  describe('tests for util netsuiteAccountHasSuiteScriptIntegrations', () => {
    test('should return false for empty state', () => {
      expect(selectors.netsuiteAccountHasSuiteScriptIntegrations(undefined, 'c1')).toEqual(false);
    });

    test('should return true if ns account has ss integrations', () => {
      let state = reducer(
        undefined,
        actions.suiteScript.account.receivedHasIntegrations('a1', true)
      );

      state = reducer(
        state,
        actions.resource.received('connections', {
          _id: 'c1',
          netsuite: {
            account: 'a1',
          },
        })
      );

      expect(selectors.netsuiteAccountHasSuiteScriptIntegrations(state, 'c1')).toEqual(true);
    });

    test('should return true if ns account doesnot have ss integrations', () => {
      let state = reducer(
        undefined,
        actions.suiteScript.account.receivedHasIntegrations('a1', false)
      );

      state = reducer(
        state,
        actions.resource.received('connections', {
          _id: 'c1',
          netsuite: {
            account: 'a1',
          },
        })
      );

      expect(selectors.netsuiteAccountHasSuiteScriptIntegrations(state, 'c1')).toEqual(false);
    });
  });

  describe('tests for util canLinkSuiteScriptIntegrator', () => {
    test('should return false for empty state', () => {
      expect(selectors.canLinkSuiteScriptIntegrator(undefined, 'c1')).toEqual(false);
    });

    test('should return true if connId present in ssLinkedConnectionList', () => {
      const preferences = {
        ssConnectionIds: [
          'c1',
          'c2',
        ],
      };

      const state = reducer(
        undefined,
        actions.resource.received('preferences', preferences)
      );

      expect(selectors.canLinkSuiteScriptIntegrator(state, 'c1')).toEqual(true);
    });

    test('should return false if connId not present in ssLinkedConnectionList', () => {
      const preferences = {
        ssConnectionIds: [
          'c1',
          'c2',
        ],
      };

      const state = reducer(
        undefined,
        actions.resource.received('preferences', preferences)
      );

      expect(selectors.canLinkSuiteScriptIntegrator(state, 'c3')).toEqual(false);
    });

    test('should return false if given connId account already linked through another conn', () => {
      const conns = [
        {
          _id: 'c1',
          netsuite: {
            account: 'a1',
          },
        },
        {
          _id: 'c2',
          netsuite: {
            account: 'a2',
          },
        },
        {
          _id: 'c3',
          netsuite: {
            account: 'a1',
          },
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const preferences = {
        ssConnectionIds: [
          'c1',
          'c2',
        ],
      };

      state = reducer(
        state,
        actions.resource.received('preferences', preferences)
      );

      expect(selectors.canLinkSuiteScriptIntegrator(state, 'c3')).toEqual(false);
    });

    test('should return true if ns account has ns integrations', () => {
      let state = reducer(
        undefined,
        actions.suiteScript.account.receivedHasIntegrations('a1', true)
      );

      state = reducer(
        state,
        actions.resource.received('connections', {
          _id: 'c1',
          netsuite: {
            account: 'a1',
          },
        })
      );

      expect(selectors.canLinkSuiteScriptIntegrator(state, 'c1')).toEqual(true);
    });
  });

  describe('tests for util suiteScriptIntegratorLinkedConnectionId', () => {
    test('should return undefined for empty state', () => {
      expect(selectors.suiteScriptIntegratorLinkedConnectionId()).toEqual(undefined);
    });

    test('should return linkedconnectionId for given ns account', () => {
      const conns = [
        {
          _id: 'c1',
          netsuite: {
            account: 'a1',
          },
        },
        {
          _id: 'c2',
          netsuite: {
            account: 'a2',
          },
        },
        {
          _id: 'c3',
          netsuite: {
            account: 'a1',
          },
        },
      ];

      let state = reducer(
        undefined,
        actions.resource.receivedCollection('connections', conns)
      );

      const preferences = {
        ssConnectionIds: [
          'c1',
          'c2',
        ],
      };

      state = reducer(
        state,
        actions.resource.received('preferences', preferences)
      );

      expect(selectors.suiteScriptIntegratorLinkedConnectionId(state, 'a2')).toEqual('c2');
    });
  });

  describe('tests for util userHasManageAccessOnSuiteScriptAccount', () => {
    test('should return false for empty state', () => {
      expect(selectors.userHasManageAccessOnSuiteScriptAccount(undefined, 'c1')).toEqual(false);
    });

    test('should return true if account access Level is monitor', () => {
      const acc = {
        _id: 'ashare1',
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
      };
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('shared/ashares', [acc])
      );

      state = reducer(state,
        actions.resource.received('preferences', {
          defaultAShareId: 'ashare1',
        }));

      state = reducer(state,
        actions.resource.received('connections', {
          _id: 'c1',
          name: 'conn 1',
        }
        )
      );

      expect(selectors.userHasManageAccessOnSuiteScriptAccount(state, 'c1')).toEqual(false);
    });

    test('should return true if account access Level is manage', () => {
      const acc = {
        _id: 'ashare1',
        accessLevel: USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
      };
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('shared/ashares', [acc])
      );

      state = reducer(state,
        actions.resource.received('preferences', {
          defaultAShareId: 'ashare1',
        }));

      state = reducer(state,
        actions.resource.received('connections', {
          _id: 'c1',
          name: 'conn 1',
        }
        )
      );

      expect(selectors.userHasManageAccessOnSuiteScriptAccount(state, 'c1')).toEqual(true);
    });

    test('should verify if account access Level is tile and integration has manage access', () => {
      const ownAccount =
      {
        _id: 'aShare3',
        accessLevel: USER_ACCESS_LEVELS.TILE,
        integrationAccessLevel: [
          {
            _integrationId: 'i1',
            accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
          },
          {
            _integrationId: 'i2',
            accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
          },
        ],
      };
      let state = reducer(
        undefined,
        actions.resource.receivedCollection('shared/ashares', [ownAccount])
      );

      state = reducer(
        state,
        actions.resource.receivedCollection(
          'integrations',
          [
            { _id: 'i1', _registeredConnectionIds: ['c1', 'c2'] },
            { _id: 'i2', _registeredConnectionIds: ['c2', 'c3'] },
          ]
        )
      );

      state = reducer(state,
        actions.resource.received('preferences', {
          defaultAShareId: 'aShare3',
        }));
      expect(selectors.userHasManageAccessOnSuiteScriptAccount(state, 'c1')).toEqual(false);
      expect(selectors.userHasManageAccessOnSuiteScriptAccount(state, 'c2')).toEqual(true);
      expect(selectors.userHasManageAccessOnSuiteScriptAccount(state, 'c3')).toEqual(true);
    });
  });

  describe('tests for util metadataOptionsAndResources, getMetadataOptions', () => {
    test('should return metadata from state based on meta path', () => {
      const connId = 'c1';

      const accountMetadata = [
        {
          a: 'b',
        },
      ];

      const opportunityMetadata = [
        {
          c: 'd',
        },
      ];
      const requestState = reducer(
        undefined,
        actions.metadata.request(connId, `/salesforce/metadata/${connId}/sobjects/account`)
      );
      let receivedState = reducer(
        requestState,
        actions.metadata.receivedCollection(
          accountMetadata,
          connId,
          `/salesforce/metadata/${connId}/sobjects/account`
        )
      );

      receivedState = reducer(
        receivedState,
        actions.metadata.receivedCollection(
          opportunityMetadata,
          connId,
          `/salesforce/metadata/${connId}/sobjects/opportunity`
        )
      );

      expect(selectors.metadataOptionsAndResources(receivedState, {
        connectionId: connId,
        commMetaPath: `/salesforce/metadata/${connId}/sobjects/account`,
        filterKey: 'raw',
      }).data).toEqual(accountMetadata);

      expect(selectors.metadataOptionsAndResources(receivedState, {
        connectionId: connId,
        commMetaPath: `/salesforce/metadata/${connId}/sobjects/opportunity`,
        filterKey: 'raw',
      }).data).toEqual(opportunityMetadata);

      expect(selectors.getMetadataOptions(receivedState, {
        connectionId: connId,
        commMetaPath: `/salesforce/metadata/${connId}/sobjects/account`,
        filterKey: 'raw',
      }).data).toEqual(accountMetadata);

      expect(selectors.getMetadataOptions(receivedState, {
        connectionId: connId,
        commMetaPath: `/salesforce/metadata/${connId}/sobjects/opportunity`,
        filterKey: 'raw',
      }).data).toEqual(opportunityMetadata);
    });
  });

  describe('tests for util getSalesforceMasterRecordTypeInfo', () => {
    test('should return emptyObject for empty state', () => {
      expect(selectors.getSalesforceMasterRecordTypeInfo()).toEqual({});
    });

    test('should return sf metadata for master record type info', () => {
      const connId = 'c1';
      const masterRecordTypeInfoMetadata = {
        searchLayoutable: {
          a: 'b',
        },
        recordTypeInfos: [
          {
            master: true,
            recordTypeId: 'c',
          },
        ],
      };

      const commMetaPath = `salesforce/metadata/connections/${connId}/sObjectTypes/account`;

      let state = reducer(
        undefined,
        actions.metadata.request(connId, commMetaPath)
      );

      state = reducer(
        state,
        actions.metadata.receivedCollection(
          masterRecordTypeInfoMetadata,
          connId,
          commMetaPath
        )
      );

      const imp = {
        _id: 'i1',
        _connectionId: 'c1',
        salesforce: {
          sObjectType: 'account',
        },
      };

      state = reducer(
        state,
        actions.resource.received('imports', imp)
      );

      expect(selectors.getSalesforceMasterRecordTypeInfo(state, 'i1').data).toEqual(
        {
          searchLayoutable: {
            a: 'b',
          },
          recordTypeId: 'c',
        }
      );
    });
  });
});
