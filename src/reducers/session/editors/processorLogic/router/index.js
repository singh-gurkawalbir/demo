import { cloneDeep } from 'lodash';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import filter from '../filter';
import javascript from '../javascript';

export default {
  init: ({ options }) => {
    const activeProcessor = 'filter';
    const { router = {}, routerIndex, prePatches } = options;
    const editorTitle = prePatches ? 'Add branching' : 'Edit branching';

    const { routeRecordsUsing, script = {} } = router;
    const routerObj = cloneDeep(router);

    (routerObj.branches || []).forEach((branch, index) => {
      if (!branch.name) {
        // eslint-disable-next-line no-param-reassign
        branch.name = `Branch ${routerIndex + 1}.${index}`;
      }
    });
    const rule = {
      ...routerObj,
      activeProcessor,
      fetchScriptContent: true,
    };

    // set values only if undefined (to pass dirty check correctly)
    if (routeRecordsUsing === 'script') {
      rule.scriptId = script._scriptId;
      rule.activeProcessor = 'javascript';
    }
    rule.entryFunction = script.function || hooksToFunctionNamesMap.router;

    return {
      ...options,
      rule,
      editorTitle,
    };
  },

  processor: editor => {
    if (editor.rule.activeProcessor === 'filter') {
      return 'branchFilter';
    }

    return 'javascript';
  },

  requestBody: editor => {
    if (editor.rule.activeProcessor === 'filter') {
      const {rules, data} = filter.requestBody({
        data: editor.data,
        rule: editor.rule,
      });

      return {
        data: [{
          router: rules.rules,
          record: data[0],
        }],
      };
    }

    return javascript.requestBody({
      data: editor.data,
      rule: editor.rule,
      context: editor.context,
    });
  },
  // No point performing parsing or validation when it is an object
  validate: editor => {
    if (editor.rule.activeProcessor === 'filter') {
      return filter.validate({
        data: editor.data,
        rule: editor.rule,
      });
    }

    return javascript.validate({
      data: editor.data,
    });
  },
  processResult: (editor, result) => {
    if (editor.rule.activeProcessor === 'filter') {
      let outputMessage = '';

      if (result?.data) {
        if (result.data[0].length === 1) {
          const branch = editor.rule.branches[result.data[0][0]]?.name;

          outputMessage = `The record will pass through branch ${result.data[0][0]}: ${branch} `;
        } else if (!result.data[0].length) {
          outputMessage = 'The record will not pass through any of the branches.';
        } else {
          outputMessage = `The record will pass through branches:\n${result.data[0].map(branchIndex => `branch ${branchIndex}: ${editor.rule.branches[branchIndex]?.name}`).join('\n')}`;
        }
      }

      return {data: outputMessage};
    }

    return javascript.processResult(editor, result);
  },
  patchSet: editor => {
    const patches = {
      foregroundPatches: undefined,
      backgroundPatches: [],
    };
    const {
      rule,
      flowId,
      resourceType,
      router,
      routerIndex,
      prePatches,
      isInsertingBeforeFirstRouter,
    } = editor;
    const {scriptId, code, entryFunction, activeProcessor } = rule || {};

    const type = activeProcessor === 'filter' ? 'input_filters' : 'script';
    const path = `/routers/${isInsertingBeforeFirstRouter ? 0 : routerIndex}`;
    const value = {
      routeRecordsUsing: type,
      id: router.id,
      routeRecordsTo: rule.routeRecordsTo,
      branches: rule.branches,
      script: {
        _scriptId: scriptId,
        function: entryFunction,
      },
    };

    patches.foregroundPatches = [
      {
        patch: [...(prePatches || []), {op: 'remove', path: '/pageProcessors'}, { op: 'replace', path, value }],
        resourceType,
        resourceId: flowId,
      },
    ];

    if (type === 'script') {
      patches.backgroundPatches.push({
        patch: [
          {
            op: 'replace',
            path: '/content',
            value: code,
          },
        ],
        resourceType: 'scripts',
        resourceId: scriptId,
      });
    }

    return patches;
  },
};
