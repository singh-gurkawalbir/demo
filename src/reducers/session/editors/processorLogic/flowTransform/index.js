/* eslint-disable camelcase */
import javascript from '../javascript';
import transform from '../transform';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';

export default {
  processor: ({activeProcessor}) => activeProcessor,
  init: ({resource, options, scriptContext}) => {
    let activeProcessor = 'transform';

    const transformObj = resource?.transform || {};
    const { script = {}, expression = {} } = transformObj;
    const rule = {
      javascript: {
        fetchScriptContent: true,
      },
    };

    // set values only if undefined (to pass dirty check correctly)
    if (expression.rules?.[0]) {
      rule.transform = expression.rules?.[0];
    }
    if (script._scriptId) {
      rule.javascript.scriptId = script._scriptId;
      activeProcessor = 'javascript';
    }
    rule.javascript.entryFunction = script.function || hooksToFunctionNamesMap.transform;

    return {
      ...options,
      rule,
      activeProcessor,
      context: scriptContext,
    };
  },
  buildData: (_, sampleData) => ({
    transform: JSON.stringify(JSON.parse(sampleData)?.record, null, 2),
    javascript: sampleData,
  }),
  requestBody: editor => {
    if (editor.activeProcessor === 'transform') {
      return transform.requestBody({
        data: editor.data?.transform,
        rule: editor.rule?.transform,
      });
    }

    return javascript.requestBody({
      data: editor.data?.javascript,
      rule: editor.rule?.javascript,
      context: editor.context,
    });
  },
  validate: editor => {
    if (editor.activeProcessor === 'transform') {
      return transform.validate({
        data: editor.data?.transform,
        rule: editor.rule?.transform,
      });
    }

    return javascript.validate({
      data: editor.data?.javascript,
      rule: editor?.rule?.javascript,
    });
  },
  dirty: editor => {
    if (editor.activeProcessor === 'transform') {
      return transform.dirty({
        rule: editor.rule?.transform,
        originalRule: editor.originalRule?.transform,
      });
    }

    return javascript.dirty({
      rule: editor.rule?.javascript,
      originalRule: editor.originalRule?.javascript,
    });
  },
  processResult: (editor, result) => {
    if (editor.activeProcessor === 'transform') {
      return transform.processResult(editor, result);
    }

    return javascript.processResult(editor, result);
  },
  preSaveValidate: editor => {
    if (editor.activeProcessor === 'transform') {
      return transform.preSaveValidate({rule: editor.rule?.transform});
    }

    return {saveError: false};
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
      activeProcessor,
    } = editor;
    const {transform: transformRule, javascript} = rule || {};
    const {scriptId, code, entryFunction } = javascript || {};

    const type = activeProcessor === 'transform' ? 'expression' : 'script';
    const path = '/transform';
    const value = {
      type,
      expression: {
        version: 1,
        rules: transformRule ? [transformRule] : [[]],
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

    return patches;
  },
};
