/* global describe, test, expect */
import {
  getImportSuiteScriptHooksList,
  isValidHook,
  isValidSuiteScriptHook,
  isSuiteScriptHooksSupportedForResource,
  isStacksSupportedForResource,
  getSupportedHooksForResource,
  getHookType,
  getSelectedHooksPatchSet,
  getDefaultValuesForHooks,
} from './hooks';

describe('hooks util tests', () => {
  describe('tests for util getImportSuiteScriptHooksList', () => {
    test('test supported hooks for NetSuite suitescript 2.0', () => {
      const supportedHooks = getImportSuiteScriptHooksList(true);

      expect(supportedHooks).toEqual(['postMap', 'postSubmit']);
    });

    test('test supported hooks for NetSuite suitescript 1.0', () => {
      const supportedHooks = getImportSuiteScriptHooksList(false);

      expect(supportedHooks).toEqual(['preMap', 'postMap', 'postSubmit']);
    });
  });

  describe('tests for util isVaildHook', () => {
    test('test hook invalid case', () => {
      const hook = {
        function: 'test-hook',
      };

      const isValid = isValidHook(hook);

      expect(isValid).toEqual(false);
    });

    test('test hook invalid case-2', () => {
      const hook = {
        _stackId: '1234',
      };

      const isValid = isValidHook(hook);

      expect(isValid).toEqual(false);
    });

    test('test hook valid case', () => {
      const hook = {
        function: 'test-hook',
        _scriptId: '1234',
      };

      const isValid = isValidHook(hook);

      expect(isValid).toEqual(true);
    });

    test('test hook valid case-2', () => {
      const hook = {
        function: 'test-hook',
        _stackId: '1234',
      };

      const isValid = isValidHook(hook);

      expect(isValid).toEqual(true);
    });

    test('test hook valid case-3', () => {
      const hook = undefined;

      const isValid = isValidHook(hook);

      expect(isValid).toEqual(true);
    });
  });

  describe('tests for util isValidSuiteScriptHook', () => {
    test('test suitescript hook invalid case-1', () => {
      const hook = {
        function: 'test-function',
      };

      const isValid = isValidSuiteScriptHook(hook);

      expect(isValid).toEqual(false);
    });

    test('test suitescript hook invalid case-2', () => {
      const hook = {
        fileInternalId: '1234',
      };

      const isValid = isValidSuiteScriptHook(hook);

      expect(isValid).toEqual(false);
    });

    test('test suitescript hook valid case-1', () => {
      const hook = undefined;

      const isValid = isValidSuiteScriptHook(hook);

      expect(isValid).toEqual(true);
    });

    test('test suitescript hook valid case-2', () => {
      const hook = {
        function: 'test-function',
        fileInternalId: '1234',
      };

      const isValid = isValidSuiteScriptHook(hook);

      expect(isValid).toEqual(true);
    });
  });

  describe('tests for util isSuiteScriptHooksSupportedForResource', () => {
    test('test if suitescript Hooks Supported for a resource', () => {
      const resource = undefined;
      const resourceType = 'exports';

      const isValid = isSuiteScriptHooksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(false);
    });

    test('test if suitescript Hooks Supported for a resource valid case', () => {
      const resource = {
        adaptorType: 'NetSuiteExport',
        netsuite: {
          type: 'distributed',
        },
      };
      const resourceType = 'exports';

      const isValid = isSuiteScriptHooksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(true);
    });

    test('test if suitescript Hooks Supported for a resource invalid case', () => {
      const resource = {
        adaptorType: 'NetSuiteExport',
        netsuite: {
          type: 'search',
        },
      };
      const resourceType = 'exports';

      const isValid = isSuiteScriptHooksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(false);
    });
  });

  describe('tests for util isStacksSupportedForResource', () => {
    test('test if stacks Supported for resource type exports invalid case', () => {
      const resource = {
        adaptorType: 'NetSuiteExport',
        type: 'distributed',
      };
      const resourceType = 'exports';

      const isValid = isStacksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(false);
    });

    test('test if stacks Supported for resource type exports invalid case 2', () => {
      const resource = {
        adaptorType: 'AS2Export',
      };
      const resourceType = 'exports';

      const isValid = isStacksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(false);
    });

    test('test if stacks Supported for resource type exports invalid case 3', () => {
      const resource = {
        adaptorType: 'SalesforceExport',
        type: 'distributed',
      };
      const resourceType = 'exports';

      const isValid = isStacksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(false);
    });

    test('test if stacks Supported for resource type imports valid case', () => {
      const resource = {
        adaptorType: 'HTTPExport',
      };
      const resourceType = 'exports';

      const isValid = isStacksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(true);
    });

    test('test if stacks Supported for a resource type imports valid case 2', () => {
      const resource = {
        adaptorType: 'HTTPImport',
      };
      const resourceType = 'imports';

      const isValid = isStacksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(true);
    });

    test('test if stacks Supported for a resource type imports invalid case', () => {
      const resource = {
        adaptorType: 'SalesforceImport',
      };
      const resourceType = 'imports';

      const isValid = isStacksSupportedForResource(resource, resourceType);

      expect(isValid).toEqual(false);
    });
  });

  describe('tests for util getSupportedHooksForResource', () => {
    test('test supported hooks for rdbms imports', () => {
      const resource = {
        adaptorType: 'RDBMSImport',
      };

      const supportedHooks = getSupportedHooksForResource(resource);

      expect(supportedHooks).toEqual([
        'preMap',
        'postMap',
        'postSubmit',
      ]);
    });

    test('test supported hooks for salesforce imports', () => {
      const resource = {
        adaptorType: 'SalesforceImport',
      };

      const supportedHooks = getSupportedHooksForResource(resource);

      expect(supportedHooks).toEqual([
        'preMap',
        'postMap',
        'postSubmit',
      ]);
    });
    test('test supported hooks for netsuite imports', () => {
      const resource = {
        adaptorType: 'NetSuiteImport',
      };

      const supportedHooks = getSupportedHooksForResource(resource);

      expect(supportedHooks).toEqual([
        'preMap',
        'postSubmit',
      ]);
    });

    test('test supported hooks for netsuite imports for suitescript 2.0', () => {
      const resource = {
        adaptorType: 'NetSuiteImport',
        netsuite_da: {
          useSS2Restlets: true,
        },
      };

      const supportedHooks = getSupportedHooksForResource(resource);

      expect(supportedHooks).toEqual([
        'preMap',
        'postMap',
        'postSubmit',
      ]);
    });
  });

  describe('tests for util getHookType', () => {
    test('test hook type script', () => {
      const hookValues = {
        preMap: {
          function: 'test',
          _scriptId: 1234,
        },
      };

      const supportedHooks = getHookType(hookValues);

      expect(supportedHooks).toEqual('script');
    });

    test('test hook type stack', () => {
      const hookValues = {
        preMap: {
          function: 'test',
          _stackId: 1234,
        },
      };

      const supportedHooks = getHookType(hookValues);

      expect(supportedHooks).toEqual('stack');
    });

    test('test hook type for undefined obj', () => {
      const hookValues = {
      };

      const supportedHooks = getHookType(hookValues);

      expect(supportedHooks).toEqual('script');
    });
  });

  describe('tests for util getSelectedHooksPatchSet', () => {
    test('test patchset for IO hooks', () => {
      const selectedHooks = {
        hooks: {
          preMap: {
            function: 'test_premap',
            _scriptId: '1233',
          },
          postMap: {
            function: 'test_postmap',
            _scriptId: '1233',
          },
        },
      };

      const patchset = getSelectedHooksPatchSet(selectedHooks, {});

      expect(patchset).toEqual([
        {
          op: 'replace',
          path: '/hooks',
          value: {
            preMap: {
              _scriptId: '1233',
              function: 'test_premap',
            },
            postMap: {
              _scriptId: '1233',
              function: 'test_postmap',
            },
          },
        },
      ]);
    });

    test('test patchset for IO and suiteScript hooks', () => {
      const selectedHooks = {
        hooks: {
          preMap: {
            function: 'test_premap',
            _scriptId: '1233',
          },
          postMap: {
            function: 'test_postmap',
            _scriptId: '1233',
          },
        },
        suiteScriptHooks: {
          preSave: {
            function: 'test_ss_premap',
            fileInternalId: '1233',
          },
        },
      };

      const patchset = getSelectedHooksPatchSet(selectedHooks, {
        adaptorType: 'NetSuiteExport',
        netsuite: {
          type: 'distributed',
        },
      });

      expect(patchset).toEqual([
        {
          op: 'replace',
          path: '/hooks',
          value: {
            preMap: {
              _scriptId: '1233',
              function: 'test_premap',
            },
            postMap: {
              _scriptId: '1233',
              function: 'test_postmap',
            },
          },
        },
        {
          op: 'replace',
          path: '/netsuite/distributed/hooks',
          value: {
            preSave: {
              fileInternalId: '1233',
              function: 'test_ss_premap',
            },
          },
        },
      ]);
    });

    test('test patchset for IO and suiteScript import hooks', () => {
      const selectedHooks = {
        hooks: {
          preMap: {
            function: 'test_premap',
            _scriptId: '1233',
          },
          postMap: {
            function: 'test_postmap',
            _scriptId: '1233',
          },
        },
        suiteScriptHooks: {
          preMap: {
            function: 'test_ss_premap',
            fileInternalId: '1233',
          },
        },
      };

      const patchset = getSelectedHooksPatchSet(selectedHooks, {
        adaptorType: 'NetSuiteExport',
        netsuite_da: {
          type: 'distributed',
          recordType: 'salesorder',
        },
      });

      expect(patchset).toEqual([
        {
          op: 'replace',
          path: '/hooks',
          value: {
            preMap: {
              _scriptId: '1233',
              function: 'test_premap',
            },
            postMap: {
              _scriptId: '1233',
              function: 'test_postmap',
            },
          },
        },
        {
          op: 'replace',
          path: '/netsuite_da/hooks',
          value: {
            preMap: {
              fileInternalId: '1233',
              function: 'test_ss_premap',
            },
          },
        },
      ]);
    });
  });

  describe('test util function getDefaultValuesForHooks', () => {
    test('test defaultValues for empty resource', () => {
      const resource = undefined;

      const defValues = getDefaultValuesForHooks(resource);

      expect(defValues).toEqual({});
    });

    test('test defaultValues for hooks for resource', () => {
      const resource = {
        hooks: {
          preMap: {
            function: 'preMap_function',
            _scriptId: '1234',
          },
          postMap: {
            function: 'postMap_function',
            _scriptId: '1234',
          },
        },
      };

      const defValues = getDefaultValuesForHooks(resource);

      expect(defValues).toEqual({hooks: {
        preMap: {
          function: 'preMap_function',
          _scriptId: '1234',
        },
        postMap: {
          function: 'postMap_function',
          _scriptId: '1234',
        },
      },
      });
    });

    test('test defaultValues for hooks for resource NS export', () => {
      const resource = {
        adaptorType: 'NetSuiteExport',
        hooks: {
          preMap: {
            function: 'preMap_function',
            _scriptId: '1234',
          },
          postMap: {
            function: 'postMap_function',
            _scriptId: '1234',
          },
        },
        netsuite: {
          type: 'restlet',
          restlet: {
            hooks: {
              preSend: {
                fileInternalId: 123,
                function: 'test',
              },
            },
          },
        },
      };

      const defValues = getDefaultValuesForHooks(resource);

      expect(defValues).toEqual({hooks: {
        preMap: {
          function: 'preMap_function',
          _scriptId: '1234',
        },
        postMap: {
          function: 'postMap_function',
          _scriptId: '1234',
        },
      },
      suiteScriptHooks: {
        preSend: {
          fileInternalId: 123,
          function: 'test',
        },
      },
      });
    });

    test('test defaultValues for hooks for resource NS import', () => {
      const resource = {
        adaptorType: 'NetSuiteImport',
        hooks: {
          preMap: {
            function: 'preMap_function',
            _scriptId: '1234',
          },
          postMap: {
            function: 'postMap_function',
            _scriptId: '1234',
          },
        },
        netsuite_da: {
          hooks: {
            preMap: {
              fileInternalId: 123,
              function: 'test',
            },
          },
        },
      };

      const defValues = getDefaultValuesForHooks(resource);

      expect(defValues).toEqual({hooks: {
        preMap: {
          function: 'preMap_function',
          _scriptId: '1234',
        },
        postMap: {
          function: 'postMap_function',
          _scriptId: '1234',
        },
      },
      suiteScriptHooks: {
        preMap: {
          fileInternalId: 123,
          function: 'test',
        },
      },
      });
    });
  });
});
