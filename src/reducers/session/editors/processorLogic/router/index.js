import { isEqual, pick } from 'lodash';
import customCloneDeep from '../../../../../utils/customCloneDeep';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import { generateId, safeParse } from '../../../../../utils/string';
import filter from '../filter';
import javascript from '../javascript';

const moveArrayItem = (arr, oldIndex, newIndex) => {
  const newArr = [...arr];
  const element = newArr.splice(oldIndex, 1)[0];

  newArr.splice(newIndex, 0, element);

  return newArr;
};

const BranchNameRegex = /Branch \d+\.(\d+)/;

function getBranchNameIndex(branches, routerNameIndex) {
  let highestIndex = 0;
  const branchNames = branches.map(branch => branch.name);

  branches.forEach(branch => {
    if (BranchNameRegex.test(branch.name)) {
      const [, index] = branch.name.match(BranchNameRegex);

      if (+index > highestIndex) {
        highestIndex = +index;
      }
    }
  });

  while (branchNames.includes(`Branch ${routerNameIndex}.${highestIndex + 1}`)) {
    highestIndex += 1;
  }

  return highestIndex + 1;
}

export default {
  init: ({ options, scriptContext, flow }) => {
    const activeProcessor = 'filter';
    const { router = {}, prePatches, branchNamingIndex } = options;
    const isEdit = !prePatches;
    const editorTitle = isEdit ? 'Edit branching' : 'Add branching';

    const { routeRecordsUsing, script = {} } = router;
    const routerObj = customCloneDeep(router);

    (routerObj.branches || []).forEach((branch, index) => {
      if (!branch.name) {
        // eslint-disable-next-line no-param-reassign
        branch.name = `Branch ${branchNamingIndex}.${index}`;
      }
      if (!branch.inputFilter) {
        // eslint-disable-next-line no-param-reassign
        branch.inputFilter = {rules: undefined};
      }
      if (!branch.id) {
        // eslint-disable-next-line no-param-reassign
        branch.id = generateId();
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
    const originalRule = {...rule, branches: []};

    return {
      ...options,
      ...(!isEdit ? {originalRule} : {}),
      rule,
      editorTitle,
      isEdit,
      context: scriptContext,
      flow,
    };
  },

  processor: 'branchFilter',

  requestBody: editor => {
    const {context, flow} = editor;
    const { activeProcessor } = editor.rule;
    const editorData = editor.data[activeProcessor];
    const { rules, data, options } = filter.requestBody({
      data: editorData,
      rule: editor.rule,
    });
    const javascriptData = safeParse(editorData) || {};
    const router = { ...customCloneDeep(rules.rules) };
    const isIntegrationApp = flow?._connectorId;

    router.routeRecordsUsing = router.activeProcessor === 'javascript' ? 'script' : 'input_filters';
    if (!router.script) {
      router.script = {};
    }
    router.script._scriptId = router.scriptId;
    router.script.function = router.entryFunction;
    router.script.code = router.code;

    return {
      data: [{
        router: pick(router, ['id', 'branches', 'routeRecordsTo', 'routeRecordsUsing', 'script', 'name']),
        record: router.activeProcessor === 'javascript' ? javascriptData.record : data[0],
        options,
      }],
      ...(isIntegrationApp && {options: context}),
    };
  },
  // No point performing parsing or validation when it is an object
  validate: editor => {
    if (editor.rule.activeProcessor === 'filter') {
      return filter.validate({
        data: editor.data?.filter,
        rule: editor.rule,
        isInvalid: editor.isInvalid,
      });
    }

    return javascript.validate({
      data: editor.data?.javascript,
      rule: editor?.rule,
    });
  },
  dirty: editor => {
    const { activeProcessor } = editor.rule;

    if (activeProcessor === 'javascript') {
      return javascript.dirty(editor);
    }

    return !isEqual(editor.originalRule, editor.rule);
  },
  processResult: (editor, result) => {
    let outputMessage = '';
    let logs;

    if (Array.isArray(result?.data)) {
      const { data = [] } = result.data[0] || {};

      logs = result.data[0].logs;
      if (data.length === 1) {
        const branch = editor.rule.branches[data[0]]?.name;

        outputMessage = `The record will pass through branch ${data[0]}: ${branch} `;
      } else if (!data.length) {
        outputMessage = 'The record will not pass through any of the branches.';
      } else {
        outputMessage = `The record will pass through branches:\n${data.map(branchIndex => `branch ${branchIndex}: ${editor.rule.branches[branchIndex]?.name}`).join('\n')}`;
      }
    }

    return { data: outputMessage, logs };
  },
  patchSet: editor => {
    const patches = {
      foregroundPatches: undefined,
      backgroundPatches: [],
      options: {revertChangesOnFailure: true},
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
    const {scriptId, code, entryFunction, activeProcessor, name } = rule || {};

    const type = activeProcessor === 'filter' ? 'input_filters' : 'script';
    const path = `/routers/${isInsertingBeforeFirstRouter ? 0 : routerIndex}`;
    const value = {
      routeRecordsUsing: type,
      name,
      id: router.id,
      routeRecordsTo: rule.routeRecordsTo,
      branches: rule.branches,
      script: {
        _scriptId: scriptId || undefined,
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
  updateRule: (draft, action, shouldReplace) => {
    const { actionType, oldIndex, newIndex, rulePatch, position } = action;

    if (actionType === 'reorder') {
      draft.rule.branches = moveArrayItem(draft.rule.branches, oldIndex, newIndex);
    } else if (actionType === 'addBranch') {
      const branchNameIndex = getBranchNameIndex(draft.rule.branches, draft.branchNamingIndex);

      draft.rule.branches = [...draft.rule.branches, {
        id: generateId(),
        name: `Branch ${draft.branchNamingIndex}.${branchNameIndex}`,
        pageProcessors: [{setupInProgress: true}],
      }];
    } else if (actionType === 'setSkipEmptyRuleCleanup') {
      if (draft.rule.branches?.[position]?.id) {
        draft.rule.branches[position].skipEmptyRuleCleanup = rulePatch;
      }
    } else if (!shouldReplace) {
      Object.assign(draft.rule, customCloneDeep(rulePatch));
    } else {
      draft.rule = rulePatch;
    }
  },
  buildData: (_, sampleData) => {
    const data = {};
    let parsedData = safeParse(sampleData);

    data.filter = JSON.stringify(parsedData, null, 2) || '';
    // for JS panel, 'rows' is also represented as 'record'
    if (parsedData?.rows) {
      /*
       While stringifying the json in below line after the block,
       the iteration order is a combination of the insertion order for strings keys, and ascending order for number-like keys.
       Hence if commented out code is used record is inserted last, hence shows up as last property in the editor.(IO-28963)

       parsedData.record = parsedData.rows;
       delete parsedData.rows;
      */
      const {rows, ...otherProps} = parsedData;

      parsedData = {record: rows, ...otherProps};
    }

    data.javascript = JSON.stringify(parsedData, null, 2) || '';

    return data;
  },

};
