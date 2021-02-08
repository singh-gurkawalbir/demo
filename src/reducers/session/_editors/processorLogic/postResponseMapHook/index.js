import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import javascript from '../javascript';

export default {
  processor: 'javascript',
  init: ({flow, options}) => {
    const pageProcessorsObject = flow?.pageProcessors?.[options.resourceIndex] || {};
    const postResponseMapHook = pageProcessorsObject?.hooks?.postResponseMap || {};
    const rule = {
      entryFunction: postResponseMapHook.function || hooksToFunctionNamesMap.postResponseMap,
      fetchScriptContent: true,
    };

    if (postResponseMapHook._scriptId) {
      rule.scriptId = postResponseMapHook._scriptId;
    }

    return {
      ...options,
      pageProcessorsObject,
      rule,
    };
  },
  requestBody: javascript.requestBody,
  validate: javascript.validate,
  dirty: javascript.dirty,
  processResult: javascript.processResult,
  patchSet: editor => {
    const patches = {
      foregroundPatches: undefined,
      backgroundPatches: [],
    };

    const { flowId, pageProcessorsObject, resourceIndex, rule } = editor;
    const { code, scriptId, entryFunction } = rule || {};
    const foregroundPatchSet = [];

    if (!pageProcessorsObject.hooks) {
      foregroundPatchSet.push({
        op: 'add',
        path: `/pageProcessors/${resourceIndex}/hooks`,
        value: {},
      });
    }

    // Incase of user selecting None for script, pass undefined instead of '' as BE throws error if it is ''
    // removing hook object is user selects none
    if (scriptId === '') {
      foregroundPatchSet.push({
        op: 'replace',
        path: `/pageProcessors/${resourceIndex}/hooks`,
        value: undefined,
      });
    } else {
      // Saves postResponseMap Hook on pageProcessor based on resourceIndex
      foregroundPatchSet.push({
        op:
            pageProcessorsObject.hooks &&
            pageProcessorsObject.hooks.postResponseMap
              ? 'replace'
              : 'add',
        path: `/pageProcessors/${resourceIndex}/hooks/postResponseMap`,
        value: {
          _scriptId: scriptId || undefined,
          function: scriptId ? entryFunction : undefined,
        },
      });
    }

    patches.foregroundPatches = [{
      patch: foregroundPatchSet,
      resourceType: 'flows',
      resourceId: flowId,
    }];

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

    return patches;
  },
};

