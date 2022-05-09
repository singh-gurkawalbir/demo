import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import filter from '../filter';
import javascript from '../javascript';

export default {
  processor: ({ activeProcessor }) => activeProcessor,
  init: ({ options }) => {
    let activeProcessor = 'filter';
    const { router = {} } = options;
    const { routeRecordsUsing, script = {} } = router;

    const rule = {
      filter: router,
      javascript: {
        router,
        fetchScriptContent: true,
      },
    };

    // set values only if undefined (to pass dirty check correctly)
    if (routeRecordsUsing === 'script') {
      rule.javascript.scriptId = script._scriptId;
      activeProcessor = 'javascript';
    }
    rule.javascript.entryFunction = script.function || hooksToFunctionNamesMap.router;

    return {
      ...options,
      rule,
      activeProcessor,
    };
  },

  requestBody: editor => {
    if (editor.activeProcessor === 'filter') {
      return filter.requestBody({
        data: editor.data?.filter,
        rule: editor.rule?.filter,
      });
    }

    return javascript.requestBody({
      data: editor.data?.javascript,
      rule: editor.rule?.javascript,
      context: editor.context,
    });
  },
  // No point performing parsing or validation when it is an object
  validate: editor => {
    if (editor.activeProcessor === 'filter') {
      return filter.validate({
        data: editor.data?.filter,
        rule: editor.rule?.filter,
      });
    }

    return javascript.validate({
      data: editor.data?.javascript,
    });
  },
  dirty: editor => {
    if (editor.activeProcessor === 'javascript') {
      return filter.dirty({
        rule: editor.rule?.filter,
        originalRule: editor.originalRule?.filter,
      });
    }

    return true;
  },
  processResult: (editor, result) => {
    if (editor.activeProcessor === 'filter') {
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
      activeProcessor,
    } = editor;
    const { javascript} = rule || {};
    const {scriptId, code, entryFunction } = javascript || {};

    const type = activeProcessor === 'filter' ? 'input_filters' : 'script';
    const path = `/routers/${routerIndex}`;
    const value = {
      routeRecordsUsing: type,
      id: router.id,
      routeRecordsTo: rule[activeProcessor].routeRecordsTo,
      branches: rule[activeProcessor].branches,
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
