import produce from 'immer';
import util from '../../../../utils/json';
import { safeParse } from '../../../../utils/string';
import javascript from './javascript';

export default {
  processor: 'javascript',
  skipPreview: ({ code, entryFunction }) => !code || !entryFunction,

  requestBody: ({ data, code, entryFunction, context, mode }) => {
    let parsedData = typeof data === 'string' ? JSON.parse(data) : data;

    if (mode === 'json') {
      parsedData = {
        resource: {
          settingsForm: {
            form: parsedData,
          },
        },
        parentResource: {},
        license: {},
        parentLicense: {},
        sandbox: false,
      };
    }

    const body = {
      rules: {
        function: entryFunction,
        code,
      },
      options: context,
      data: parsedData,
    };

    return body;
  },

  dirty: editor => {
    if (editor.data !== editor.initData) {
      return true;
    }

    return javascript.dirty(editor);
  },

  validate: ({ data }) => {
    let dataError;

    if (data === '') dataError = 'Must provide some sample data.';
    else if (typeof data === 'string')
      dataError = util.validateJsonString(data);

    return { dataError: dataError !== null && dataError };
  },

  processResult: ({ settings, data, mode }, newResult) => {
    let meta;

    if (newResult) {
      meta = newResult.data;
    } else if (data) {
      const parsedData = safeParse(data);

      if (!parsedData) return undefined;
      // console.log('parsedData', parsedData);

      if (mode === 'json') {
        meta = parsedData;
      } else {
        meta =
          parsedData.resource &&
          parsedData.resource.settingsForm &&
          parsedData.resource.settingsForm.form;
      }
    }

    // inject the current setting values (found in resource.settings)
    // into the respective field’s defaultValue prop.
    return produce(meta, draft => {
      if (settings && meta && typeof draft.fieldMap === 'object') {
        Object.keys(draft.fieldMap).forEach(key => {
          const field = draft.fieldMap[key];

          field.defaultValue = settings[field.name] || '';
        });
      }
    });
  },
};
