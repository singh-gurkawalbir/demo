/* eslint-disable camelcase */
import isEqual from 'lodash/isEqual';
import util from '../../../../../utils/json';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';

export default {
  init: ({ options, scriptContext }) => ({
    ...options,
    insertStubKey: options.stage,
    context: scriptContext,
    rule: {
      scriptId: options.rule?._scriptId,
      entryFunction:
        options.rule?.function || hooksToFunctionNamesMap[options.stage],
      fetchScriptContent: true,
    },
  }),

  requestBody: ({ data, rule, context }) => ({
    rules: {
      function: rule.entryFunction,
      code: rule.code,
      _scriptId: rule.scriptId,
    },
    options: context,
    data: typeof data === 'string' ? JSON.parse(data) : data,
  }),
  validate: ({ data, rule }) => {
    let dataError;

    if (!data) dataError = 'Must provide some sample data.';
    else if (typeof data === 'string') {
      dataError = util.validateJsonString(data);
    }

    if (!rule.scriptId) {
      return {ruleError: 'Script is required'};
    }
    if (!rule.entryFunction) {
      return {ruleError: 'Function is required'};
    }

    return { dataError: dataError !== null && dataError };
  },
  dirty: ({ originalRule, rule }) => {
    const {
      _init_code = '',
      code = '',
      fetchScriptContent,
      ...rest
    } = rule || {};
    const {
      fetchScriptContent: originalFetchScriptContent,
      _init_code: originalInitCode,
      code: originalCode,
      ...originalRest
    } = originalRule || {};

    if (_init_code !== code) {
      return true;
    }

    if (!isEqual(originalRest, rest)) {
      return true;
    }

    return false;
  },
  processResult: (editor, result) => ({
    data: (result && (result.data || (result.data === false && 'false'))) || '',
    logs: result && result.logs,
  }),
  patchSet: editor => {
    const { code, scriptId } = editor.rule || {};

    const patches = {
      backgroundPatches: [
        {
          patch: [
            {
              op: 'replace',
              path: '/content',
              value: code,
            },
          ],
          resourceType: 'scripts',
          resourceId: scriptId,
        },
      ],
    };

    return patches;
  },
  getChatOptions: () => ({
    enabled: true,
    rulePath: 'code',
    placeholder:
      'Describe what your code should do. I will apply your request to any existing code unless you tell me to replace it.',
    request: {
      model: 'gpt-3.5-turbo',
      temperature: 0,
      top_p: 1,
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant tasked to modify or write valid Javascript code.',
        },
        {
          role: 'user',
          content: `You should answer in valid ECMASCRIPT code only.
        Return any explanations as javascript code comments.
        For readability, format the code using spaces.
        Always add or modify the existing code, unless told to replace it.`,
        },
        {
          role: 'user',
          content: `Only import from the following libraries: 
  "sjcl" version 1.8.0, a widely used crypto library
  "daysjs" version 1.11, used for parsing, validating, manipulating, and displaying date/time
  "integrator-api" used to access the integrator API. It contains exports, imports and flows namespaces with the following methods:
    exports.run( options )
    exports.runVirtual( options )
    exports.runVirtualWithPaging( options )
    imports.run( options )
    flows.run( options )`,
        },
        {
          role: 'user',
          content: 'write the code to create a listener response that returns status and data',
        },
        {
          role: 'assistant',
          content: `import { exports } from 'integrator-api'

function main(options) {
  const myData = [{
    name: 'Celigo customer',
    email: 'celigocustomer@celigo.com'
  }]
  return {
    statusCode: 200,
    body: {
      response: exports.run({_id: '5f412a934b372a34c87d34', listenerData: myData})
    }
  }
}`,
        },
      ],
    },
  }),
  validateChatResponse: (editor, response) => {
    const isValid = typeof response === 'string' && response.length > 5;

    if (isValid) {
      return { isValid, parsedResponse: response };
    }

    return {
      isValid,
      validationErrors: [
        'Celigo chat returned the following invalid code:',
        response,
      ],
    };
  },
};
