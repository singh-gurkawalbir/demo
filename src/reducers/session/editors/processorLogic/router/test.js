
import processorLogic from './index';
import * as GenerateMediumId from '../../../../../utils/string';

const {
  init,
  patchSet,
  updateRule,
  buildData,
  processResult,
  requestBody,

} = processorLogic;

describe('router processor logic', () => {
  let resource;

  describe('init util', () => {
    test('should correctly initialise the router afe', () => {
      const options = {
        router: {id: 'r1', name: 'router1'},
        prePatches: [{}],
        branchNamingIndex: 1,
      };
      const expectedOutput = {
        branchNamingIndex: 1,
        editorTitle: 'Add branching',
        isEdit: false,
        originalRule: {
          activeProcessor: 'filter',
          branches: [],
          entryFunction: 'branching',
          fetchScriptContent: true,
          id: 'r1',
          name: 'router1',
        },
        prePatches: [{}],
        router: {
          id: 'r1',
          name: 'router1',
        },
        rule: {
          activeProcessor: 'filter',
          entryFunction: 'branching',
          fetchScriptContent: true,
          id: 'r1',
          name: 'router1',
        },
      };

      expect(init({options})).toEqual(expectedOutput);
    });
    test('should correctly return the rule along with options', () => {
      jest.spyOn(GenerateMediumId, 'generateId').mockReturnValue('new_key');
      const options = {
        router: {id: 'r1', name: 'router1', branches: [{pageProcessors: [{id: 'p1'}]}, {pageProcessors: [{id: 'p2'}]}]},
        branchNamingIndex: 1,
      };
      const expectedOutput = {
        branchNamingIndex: 1,
        editorTitle: 'Edit branching',
        isEdit: true,
        router: {
          branches: [
            {
              pageProcessors: [
                {
                  id: 'p1',
                },
              ],
            },
            {
              pageProcessors: [
                {
                  id: 'p2',
                },
              ],
            },
          ],
          id: 'r1',
          name: 'router1',
        },
        rule: {
          activeProcessor: 'filter',
          branches: [
            {
              id: 'new_key',
              inputFilter: {
                rules: undefined,
              },
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  id: 'p1',
                },
              ],
            },
            {
              id: 'new_key',
              inputFilter: {
                rules: undefined,
              },
              name: 'Branch 1.1',
              pageProcessors: [
                {
                  id: 'p2',
                },
              ],
            },
          ],
          entryFunction: 'branching',
          fetchScriptContent: true,
          id: 'r1',
          name: 'router1',
        },
      };

      expect(init({resource, options})).toEqual(expectedOutput);
    });
    test('should correctly return the rule and options along with script context', () => {
      jest.spyOn(GenerateMediumId, 'generateId').mockReturnValue('new_key');
      const options = {
        router: {id: 'r1', name: 'router1', branches: [{pageProcessors: [{id: 'p1'}]}, {pageProcessors: [{id: 'p2'}]}]},
        branchNamingIndex: 1,
      };
      const expectedOutput = {
        branchNamingIndex: 1,
        editorTitle: 'Edit branching',
        isEdit: true,
        router: {
          branches: [
            {
              pageProcessors: [
                {
                  id: 'p1',
                },
              ],
            },
            {
              pageProcessors: [
                {
                  id: 'p2',
                },
              ],
            },
          ],
          id: 'r1',
          name: 'router1',
        },
        rule: {
          activeProcessor: 'filter',
          branches: [
            {
              id: 'new_key',
              inputFilter: {
                rules: undefined,
              },
              name: 'Branch 1.0',
              pageProcessors: [
                {
                  id: 'p1',
                },
              ],
            },
            {
              id: 'new_key',
              inputFilter: {
                rules: undefined,
              },
              name: 'Branch 1.1',
              pageProcessors: [
                {
                  id: 'p2',
                },
              ],
            },
          ],
          entryFunction: 'branching',
          fetchScriptContent: true,
          id: 'r1',
          name: 'router1',
        },
        context: {
          _integrationId: 'inetgartionID',
          _flowId: 'flowId',
          container: 'inetgration',
          type: 'hook',
        },
      };
      const scriptContext = {
        _integrationId: 'inetgartionID',
        _flowId: 'flowId',
        container: 'inetgration',
        type: 'hook',
      };

      expect(init({resource, options, scriptContext})).toEqual(expectedOutput);
    });
  });
  describe('requestBody util', () => {
    test('should return correct request body for javascript processor', () => {
      const editor = {
        rule: {
          activeProcessor: 'javascript',
        },
        data: {
          javascript: {a: 'b'},
          input_filters: {c: 'd'},
        },
      };

      expect(requestBody(editor)).toEqual({
        data: [
          {
            options: {
              contextData: {
                a: 'b',
              },
              settings: undefined,
            },
            record: undefined,
            router: {
              routeRecordsUsing: 'script',
              script: {
                _scriptId: undefined,
                code: undefined,
                function: undefined,
              },
            },
          },
        ],
      });
    });
    test('should return correct request body for input filter processor', () => {
      const editor = {
        rule: {
          activeProcessor: 'input_filters',
        },
        data: {
          javascript: {a: 'b'},
          input_filters: {c: 'd'},
        },
      };

      expect(requestBody(editor)).toEqual({
        data: [
          {
            options: {
              contextData: {
                c: 'd',
              },
              settings: undefined,
            },
            record: {

            },
            router: {
              routeRecordsUsing: 'input_filters',
              script: {
                _scriptId: undefined,
                code: undefined,
                function: undefined,
              },
            },
          },
        ],
      });
    });
    test('should return correct request body for filter with scriptContext for IA', () => {
      const editor = {
        rule: {
          activeProcessor: 'javascript',
        },
        data: {
          javascript: {a: 'b'},
          input_filters: {c: 'd'},
        },
        flow: {
          _id: 1234,
          _connectorId: 4321,
        },
        context: {
          _integrationId: 'integartionID',
          _flowId: 'flowId',
          container: 'integration',
          type: 'hook',
        },
      };

      expect(requestBody(editor)).toEqual({
        data: [
          {
            options: {
              contextData: {
                a: 'b',
              },
              settings: undefined,
            },
            record: undefined,
            router: {
              routeRecordsUsing: 'script',
              script: {
                _scriptId: undefined,
                code: undefined,
                function: undefined,
              },
            },
          },
        ],
        options: {
          _integrationId: 'integartionID',
          _flowId: 'flowId',
          container: 'integration',
          type: 'hook',
        },
      });
    });
  });
  describe('patchSet util', () => {
    test('should add and return the backgroundPatches when a script is present', () => {
      const editor = {
        rule: {activeProcessor: 'javascript', scriptId: 's1', entryFunction: 'f1', name: 'name1', code: 'code'},
        flowId: 'f1',
        resourceType: 'flows',
        router: {
          id: 'r1',
        },
        routerIndex: 1,
        prePatches: [{patch: 1}],
        isInsertingBeforeFirstRouter: false,
      };

      expect(patchSet(editor)).toEqual({
        backgroundPatches: [
          {
            patch: [
              {
                op: 'replace',
                path: '/content',
                value: 'code',
              },
            ],
            resourceId: 's1',
            resourceType: 'scripts',
          },
        ],
        foregroundPatches: [
          {
            patch: [
              {
                patch: 1,
              },
              {
                op: 'remove',
                path: '/pageProcessors',
              },
              {
                op: 'replace',
                path: '/routers/1',
                value: {
                  branches: undefined,
                  id: 'r1',
                  name: 'name1',
                  routeRecordsTo: undefined,
                  routeRecordsUsing: 'script',
                  script: {
                    _scriptId: 's1',
                    function: 'f1',
                  },
                },
              },
            ],
            resourceId: 'f1',
            resourceType: 'flows',
          },
        ],
        options: {revertChangesOnFailure: true},
      });
    });
    test('should not return the backgroundPatches for /content when no script is present', () => {
      const editor = {
        rule: {activeProcessor: 'filter', scriptId: 's1', entryFunction: 'f1', name: 'name1', code: 'code'},
        flowId: 'f1',
        resourceType: 'flows',
        router: {
          id: 'r1',
        },
        routerIndex: 1,
        prePatches: [{patch: 1}],
        isInsertingBeforeFirstRouter: false,
      };

      expect(patchSet(editor)).toEqual({
        backgroundPatches: [

        ],
        foregroundPatches: [
          {
            patch: [
              {
                patch: 1,
              },
              {
                op: 'remove',
                path: '/pageProcessors',
              },
              {
                op: 'replace',
                path: '/routers/1',
                value: {
                  branches: undefined,
                  id: 'r1',
                  name: 'name1',
                  routeRecordsTo: undefined,
                  routeRecordsUsing: 'input_filters',
                  script: {
                    _scriptId: 's1',
                    function: 'f1',
                  },
                },
              },
            ],
            resourceId: 'f1',
            resourceType: 'flows',
          },
        ],
        options: {revertChangesOnFailure: true},
      });
    });
  });

  describe('update rule function', () => {
    test('should update the draft correctly for reorder type', () => {
      const options = {
        actionType: 'reorder',
        oldIndex: 0,
        newIndex: 1,
        rulePatch: [],
      };
      const draft = {
        rule: {
          id: 'r1',
          branches: [{id: 1}, {id: 2}, {id: 3}],
        },
      };

      updateRule(draft, options, true);

      expect(draft).toEqual({rule: {branches: [{id: 2}, {id: 1}, {id: 3}], id: 'r1'}});
    });
    test('should update the draft correctly for addBranch type', () => {
      const options = {
        actionType: 'addBranch',
      };
      const draft = {
        branchNamingIndex: 1,
        rule: {
          id: 'r1',
          branches: [{id: 1}, {id: 2}, {id: 3}],
        },
      };

      updateRule(draft, options, true);

      expect(draft).toEqual({
        branchNamingIndex: 1,
        rule: {
          branches: [
            {
              id: 1,
            },
            {
              id: 2,
            },
            {
              id: 3,
            },
            {
              id: 'new_key',
              name: 'Branch 1.1',
              pageProcessors: [
                {
                  setupInProgress: true,
                },
              ],
            },
          ],
          id: 'r1',
        },
      });
    });

    describe('should update the draft correctly for setSkipEmptyRuleCleanup type', () => {
      test('should update the draft only if branch exists', () => {
        const options = {
          actionType: 'setSkipEmptyRuleCleanup',
          position: 1,
          rulePatch: true,
        };
        const draft = {
          branchNamingIndex: 1,
          rule: {
            id: 'r1',
            branches: [{id: 1}, {id: 2}, {id: 3}],
          },
        };

        updateRule(draft, options, true);

        expect(draft).toEqual({
          branchNamingIndex: 1,
          rule: {
            id: 'r1',
            branches: [
              {
                id: 1,
              },
              {
                id: 2,
                skipEmptyRuleCleanup: true,
              },
              {
                id: 3,
              },
            ],
          },
        });
      });
      test('should not update the draft if branch does not exist', () => {
        const options = {
          actionType: 'setSkipEmptyRuleCleanup',
          position: 3,
          rulePatch: true,
        };
        const draft = {
          branchNamingIndex: 1,
          rule: {
            id: 'r1',
            branches: [{id: 1}, {id: 2}, {id: 3}],
          },
        };

        updateRule(draft, options, true);

        expect(draft).toEqual({
          branchNamingIndex: 1,
          rule: {
            id: 'r1',
            branches: [
              {
                id: 1,
              },
              {
                id: 2,
              },
              {
                id: 3,
              },
            ],
          },
        });
      });
    });
    test('should update the draft correctly for when shouldReplace is true', () => {
      const options = {
        rulePatch: {name: 'yes', id: 'yes'},
      };
      const draft = {
        branchNamingIndex: 1,
        rule: {
          id: 'r1',
          branches: [{id: 1}, {id: 2}, {id: 3}],
        },
      };

      updateRule(draft, options, true);

      expect(draft).toEqual({branchNamingIndex: 1, rule: {id: 'yes', name: 'yes'}});
    });
    test('should update the draft correctly for when shouldReplace is false', () => {
      const options = {
        rulePatch: {name: 'yes', id: 'yes'},
      };
      const draft = {
        branchNamingIndex: 1,
        rule: {
          id: 'r1',
          branches: [{id: 1}, {id: 2}, {id: 3}],
        },
      };

      updateRule(draft, options, false);

      expect(draft).toEqual({branchNamingIndex: 1, rule: {id: 'yes', name: 'yes', branches: [{id: 1}, {id: 2}, {id: 3}] }});
    });
  });
  describe('buildData util', () => {
    test('should return the build data correctly', () => {
      const data = buildData(null, '{"a":"v"}');
      const output = {
        filter: JSON.stringify({a: 'v'}, null, 2),
        javascript: JSON.stringify({a: 'v'}, null, 2),
      };

      expect(data).toEqual(output);
    });
    test('should return the build data correctly for grouped data', () => {
      const data = buildData(null, '{"rows":[{"a":"v"}]}');
      const output = {
        filter: JSON.stringify({rows: [{a: 'v'}]}, null, 2),
        javascript: JSON.stringify({record: [{a: 'v'}]}, null, 2),
      };

      expect(data).toEqual(output);
    });
  });
  describe('processResult function', () => {
    test('should return correct output for result', () => {
      const data = processResult({rule: {branches: [{name: 'b1'}]}}, {data: [{data: [[0]], logs: ['a', 'b']}]});

      expect(data).toEqual({data: 'The record will pass through branch 0: b1 ', logs: ['a', 'b']});
    });
    test('should return correct output for result1', () => {
      const data = processResult({rule: {branches: [{name: 'b1'}, {name: 'b2'}]}}, {data: [[]]});

      expect(data).toEqual({data: 'The record will not pass through any of the branches.', logs: undefined});
    });
    test('should return correct output for result duplicate', () => {
      const data = processResult({rule: {branches: [{name: 'b1'}, {name: 'b2'}]}}, {mediaType: 'json', data: [{data: [0, 1]}], duration: 3});

      expect(data).toEqual({data: 'The record will pass through branches:\nbranch 0: b1\nbranch 1: b2', logs: undefined});
    });
  });
});
