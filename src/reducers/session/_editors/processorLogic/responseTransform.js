import { hooksToFunctionNamesMap } from '../../../../utils/hooks';
import flowTransform from './flowTransform';

export default {
  processor: ({activeProcessor}) => activeProcessor,
  init: ({resource, options}) => {
    let activeProcessor = 'transform';
    const transformObj = resource?.responseTransform;
    const { script = {}, expression = {} } = transformObj || {};
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
    };
  },
  buildData: sampleData => flowTransform.buildData(sampleData),
  requestBody: editor => flowTransform.requestBody(editor),
  validate: editor => flowTransform.validate(editor),
  dirty: editor => flowTransform.dirty(editor),
  processResult: (editor, result) => flowTransform.processResult(editor, result),
  patchSet: editor => {
    const patches = {
      foregroundPatches: undefined,
      backgroundPatches: [],
    };
    const {
      rule,
      data,
      resourceId,
      resourceType,
      activeProcessor,
    } = editor;
    const {transform: transformRule, javascript} = rule || {};
    const {scriptId, code, entryFunction } = javascript || {};

    const type = activeProcessor === 'transform' ? 'expression' : 'script';
    const responseTransform = {
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

    patches.foregroundPatches = {
      patch: [
        {
          op: 'replace',
          path: '/sampleResponseData',
          value: data?.transform,
        },
        {
          op: 'replace',
          path: '/responseTransform',
          value: responseTransform,
        },
      ],
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

    return patches;
  },
};

