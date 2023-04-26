import actions from '../../../../../actions';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../../constants/resource';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import exportFilter from '../exportFilter';

export default {
  processor: ({activeProcessor}) => activeProcessor,
  init: ({resource, options, scriptContext}) => {
    let activeProcessor = 'filter';

    const filterObj = resource?.filter || {};
    const { script = {}, expression = {} } = filterObj;
    const rule = {
      filter: expression.rules || [],
      javascript: {
        fetchScriptContent: true,
      },
    };

    // set values only if undefined (to pass dirty check correctly)
    if (script._scriptId) {
      rule.javascript.scriptId = script._scriptId;
      activeProcessor = 'javascript';
    }
    rule.javascript.entryFunction = script.function || hooksToFunctionNamesMap.filter;

    return {
      ...options,
      rule,
      activeProcessor,
      skipEmptyRuleCleanup: true,
      context: scriptContext,
    };
  },
  buildData: exportFilter.buildData,
  requestBody: exportFilter.requestBody,
  validate: exportFilter.validate,
  dirty: exportFilter.dirty,
  processResult: exportFilter.processResult,
  patchSet: editor => {
    const patches = {
      foregroundPatches: undefined,
      backgroundPatches: [],
    };
    const {
      rule,
      originalRule,
      resourceId,
      resourceType,
      activeProcessor,
    } = editor;
    const {filter: filterRules, javascript} = rule || {};
    const {filter: originalRules} = originalRule || {};
    const {scriptId, code, entryFunction } = javascript || {};

    const type = activeProcessor === 'filter' ? 'expression' : 'script';
    const path = '/filter';
    const value = {
      type,
      expression: {
        version: 1,
        rules: filterRules || [],
      },
      script: {
        _scriptId: scriptId,
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

    if ((type === 'expression' && !originalRules.length) || !scriptId) {
      // If user configures filters first time
      if ((type === 'expression' && filterRules.length) || scriptId) {
        patches.backgroundPatches.push({
          action: actions.analytics.gainsight.trackEvent(
            `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[
              resourceType
            ].toUpperCase()}_HAS_CONFIGURED_FILTER`
          ),
        });
      }
    }

    return patches;
  },
};
