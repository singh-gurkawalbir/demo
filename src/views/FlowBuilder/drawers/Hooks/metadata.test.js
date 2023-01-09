/* global describe, test, expect */
import getHooksMetadata from './metadata';

describe('getHooksMetadata test cases', () => {
  test('should pass the test for netsuite export data', () => {
    const metadata = getHooksMetadata('exports', {
      type: 'type',
      adaptorType: 'NetSuiteExport',
    }, {
      defaultValue: {
        hooks: [{
          _stackId: 'stack_id',
        }],
        suiteScriptHooks: 'suiteScriptHooks',
      },
    });

    expect(metadata.layout.fields).toEqual([
      'hookType',
      'preSavePage.script',
      'preSavePage.stack',
      'suiteScript-header',
      'preSend.suiteScript',
    ]);
  });

  test('should pass the test for http export data', () => {
    const metadata = getHooksMetadata('exports', {
      type: 'type',
      adaptorType: 'HTTPExport',
    }, {
      defaultValue: {
        hooks: 'hooks',
        suiteScriptHooks: 'suiteScriptHooks',
      },
    });

    expect(metadata.layout.fields).toEqual([
      'hookType',
      'preSavePage.script',
      'preSavePage.stack',
    ]);
  });

  test('should pass the test for netsuite import data', () => {
    const metadata = getHooksMetadata('imports', {
      adaptorType: 'NetSuiteImport',
    }, {
      defaultValue: {
        hooks: 'hooks',
        suiteScriptHooks: 'suiteScriptHooks',
      },
    });

    expect(metadata.layout.fields).toEqual([
      'hookType',
      'preMap.script',
      'postSubmit.script',
    ]);
  });

  test('should pass the test for http import data', () => {
    const metadata = getHooksMetadata('imports', {
      adaptorType: 'HTTPImport',
    }, {
      defaultValue: {
        hooks: [{
          _stackId: 'stack_id',
        }],
        suiteScriptHooks: 'suiteScriptHooks',
      },
    });

    expect(metadata.layout.fields).toEqual([
      'hookType',
      'preMap.script',
      'preMap.stack',
      'postMap.script',
      'postMap.stack',
      'postSubmit.script',
      'postSubmit.stack',
    ]);
  });
});
