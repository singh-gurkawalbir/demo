import { isEqual } from 'lodash';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';

export default {
  processor: ({ activeProcessor }) => activeProcessor,
  init: ({ options }) => {
    let activeProcessor = 'filter';
    const { router = {} } = options;
    const { routeRecordsUsing, script = {} } = router;

    const rule = {
      filter: router,
      javascript: {
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

  requestBody: editor => ({
    rules: { version: '1', rules: [editor.rule || []] },
    data: editor.data,
  }),
  // No point performing parsing or validation when it is an object
  validate: editor => {
    const { data, rule } = editor;
    let dataError;

    if (!data) dataError = 'Must provide some sample data.';

    return {
      dataError,
      ruleError: !!rule,
    };
  },
  dirty: editor => {
    const {
      originalRule = [],
      rule = [],
    } = editor;

    return !isEqual(originalRule, rule);
  },
  processResult: (editor, result) => ({data: result?.data?.[0]}),
  preSaveValidate: editor => ({saveError: !!editor}),
};
