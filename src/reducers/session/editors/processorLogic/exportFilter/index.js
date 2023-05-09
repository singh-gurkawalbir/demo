import isEqual from 'lodash/isEqual';
import actions from '../../../../../actions';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import javascript from '../javascript';
import filter from '../filter';
import { safeParse } from '../../../../../utils/string';

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
  buildData: (_, sampleData) => {
    const parsedData = safeParse(sampleData);

    // for JS panel, 'rows' is also represented as 'record'
    if (parsedData?.rows) {
      parsedData.record = parsedData.rows;
      delete parsedData.rows;
    }

    return {
      filter: sampleData,
      javascript: JSON.stringify(parsedData, null, 2),
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
  validate: editor => {
    if (editor.activeProcessor === 'filter') {
      return filter.validate({
        data: editor.data?.filter,
        rule: editor.rule?.filter,
        isInvalid: editor.isInvalid,
      });
    }

    return javascript.validate({
      data: editor.data?.javascript,
      rule: editor?.rule?.javascript,
    });
  },
  dirty: editor => {
    if (editor.activeProcessor === 'javascript') {
      return javascript.dirty({
        rule: editor.rule?.javascript,
        originalRule: editor.originalRule?.javascript,
      });
    }
    if (!isEqual(editor.originalRule?.filter, editor.rule?.filter)) {
      return true;
    }

    return false;
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
            'EXPORT_HAS_CONFIGURED_FILTER'
          ),
        });
      }
    }

    return patches;
  },
};
