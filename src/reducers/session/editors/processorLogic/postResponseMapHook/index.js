import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import javascript from '../javascript';

export default {
  processor: 'javascript',
  init: ({flow, options}) => {
    let pageProcessorsObject = {};
    const { routerIndex, branchIndex, pageProcessorIndex} = options;

    if (flow?.pageProcessors?.length) {
      pageProcessorsObject = flow.pageProcessors[pageProcessorIndex] || {};
    } else if (flow?.routers?.lenth) {
      pageProcessorsObject = flow.routers[routerIndex].branches[branchIndex].pageProcessors?.[pageProcessorIndex] || {};
    }
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
      hasRouters: flow.routers?.length,
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

    const { flowId, pageProcessorsObject, rule, routerIndex, branchIndex, pageProcessorIndex, hasRouters } = editor;
    const { code, scriptId, entryFunction } = rule || {};
    const foregroundPatchSet = [];

    if (!pageProcessorsObject.hooks) {
      if (hasRouters) {
        foregroundPatchSet.push({
          op: 'add',
          path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${pageProcessorIndex}/hooks`,
          value: {},
        });
      } else {
        foregroundPatchSet.push({
          op: 'add',
          path: `/pageProcessors/${pageProcessorIndex}/hooks`,
          value: {},
        });
      }
    }

    // Incase of user selecting None for script, pass undefined instead of '' as BE throws error if it is ''
    // removing hook object is user selects none
    if (scriptId === '') {
      if (hasRouters) {
        foregroundPatchSet.push({
          op: 'replace',
          path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${pageProcessorIndex}/hooks`,
          value: undefined,
        });
      } else {
        foregroundPatchSet.push({
          op: 'replace',
          path: `/pageProcessors/${pageProcessorIndex}/hooks`,
          value: undefined,
        });
      }
    } else {
      // Saves postResponseMap Hook on pageProcessor based on resourceIndex
      foregroundPatchSet.push({
        op:
            pageProcessorsObject.hooks &&
            pageProcessorsObject.hooks.postResponseMap
              ? 'replace'
              : 'add',
        path: hasRouters ? `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${pageProcessorIndex}/hooks/postResponseMap`
          : `/pageProcessors/${pageProcessorIndex}/hooks/postResponseMap`,
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

