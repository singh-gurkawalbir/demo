import { cloneDeep } from 'lodash';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import filter from '../filter';
import javascript from '../javascript';

export default {
  init: ({ options }) => {
    const activeProcessor = 'filter';
    const { router = {}, routerIndex } = options;
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
    };
  },

  requestBody: editor => {
    if (editor.rule.activeProcessor === 'filter') {
      return filter.requestBody({
        data: editor.data,
        rule: editor.rule,
      });
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
  dirty: editor => {
    if (editor.rule.activeProcessor === 'javascript') {
      return javascript.dirty({
        rule: editor.rule,
        originalRule: editor.originalRule,
      });
    }

    return true;
  },
  processResult: (editor, result) => {
    if (editor.rule.activeProcessor === 'filter') {
      return filter.processResult(editor, result);
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
      resourceId,
      resourceType,
      router,
      routerIndex,
    } = editor;
    const {scriptId, code, entryFunction, activeProcessor } = rule || {};

    const type = activeProcessor === 'filter' ? 'input_filters' : 'script';
    const path = `/routers/${routerIndex}`;
    const value = {
      routeRecordsUsing: type,
      id: router.id,
      routeRecordsTo: rule.routeRecordsTo,
      branches: rule.branches,
      script: {
        scriptId,
        function: entryFunction,
      },
    };

    patches.foregroundPatches = [{
      patch: [{ op: 'replace', path, value }],
      resourceType,
      resourceId,
    }];

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
