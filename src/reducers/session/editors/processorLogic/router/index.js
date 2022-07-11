import { cloneDeep, pick } from 'lodash';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import filter from '../filter';
import javascript from '../javascript';

export default {
  init: ({ options }) => {
    const activeProcessor = 'filter';
    const { router = {}, prePatches, branchNamingIndex } = options;
    const isEdit = !prePatches;
    const editorTitle = isEdit ? 'Edit branching' : 'Add branching';

    const { routeRecordsUsing, script = {} } = router;
    const routerObj = cloneDeep(router);

    (routerObj.branches || []).forEach((branch, index) => {
      if (!branch.name) {
        // eslint-disable-next-line no-param-reassign
        branch.name = `Branch ${branchNamingIndex}.${index}`;
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
    let originalRule;

    if (!isEdit) {
      originalRule = {...rule, branches: []};
    }

    return {
      ...options,
      originalRule,
      rule,
      editorTitle,
    };
  },

  processor: () => 'branchFilter',

  requestBody: editor => {
    const {rules, data, options} = filter.requestBody({
      data: editor.data,
      rule: editor.rule,
    });

    const router = { ...rules.rules };

    router.routeRecordsUsing = router.activeProcessor === 'javascript' ? 'script' : 'input_filters';
    router.script._scriptId = router.scriptId;
    router.script.function = router.entryFunction;

    return {
      data: [{
        router: pick(router, ['id', 'branches', 'routeRecordsTo', 'routeRecordsUsing', 'script']),
        record: data[0],
        options,
      }],
    };
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
