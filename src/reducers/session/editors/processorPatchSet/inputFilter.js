import actions from '../../../../actions';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../constants/resource';

export default {
  patchSet: editor => {
    const patches = {
      foregroundPatch: undefined,
      backgroundPatches: [],
    };
    const {
      processor,
      rule: filterRules = [],
      scriptId,
      code,
      entryFunction,
      optionalSaveParams = {},
    } = editor;
    const { resourceId, resourceType, rules } = optionalSaveParams || {};
    const type = processor === 'filter' ? 'expression' : 'script';
    const path = resourceType === 'imports' ? '/filter' : '/inputFilter';
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

    patches.foregroundPatch = {
      patch: [{ op: 'replace', path, value }],
      resourceType,
      resourceId,
    };

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

    if ((type === 'expression' && !rules.length) || !scriptId) {
      // If user configures filters first time
      if ((type === 'expression' && filterRules.length) || scriptId) {
        patches.backgroundPatches.push({
          action: actions.analytics.gainsight.trackEvent(
            `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[
              resourceType
            ].toUpperCase()}_HAS_CONFIGURED_INCOMING_FILTER`
          ),
        });
      }
    }

    return patches;
  },
};
