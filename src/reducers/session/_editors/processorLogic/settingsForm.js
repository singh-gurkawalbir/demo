import produce from 'immer';
import { isEqual, isEmpty } from 'lodash';
import util from '../../../../utils/json';
import { safeParse } from '../../../../utils/string';
import javascript from './javascript';

function extractForm(data, mode) {
  let parsedData = data;

  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      return;
    }
  }

  if (mode === 'json') {
    return parsedData;
  }

  if (parsedData && parsedData.resource && parsedData.resource.settingsForm) {
    return parsedData.resource.settingsForm.form;
  }
}

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
    let parsedData = safeParse(editor.data);

    if (parsedData === undefined) {
      return false;
    }

    if (editor.mode === 'script') {
      parsedData =
        parsedData &&
        parsedData.resource &&
        parsedData.resource.settingsForm &&
        parsedData.resource.settingsForm.form;
    }

    // added JSON.stringify check to consider the object keys' order as well
    if (!isEqual(parsedData, editor._init_data) || (JSON.stringify(parsedData) !== JSON.stringify(editor._init_data))) {
      return true;
    }

    return javascript.dirty(editor);
  },

  validate: ({ data }) => {
    let dataError;

    if (typeof data === 'string' && !isEmpty(data)) dataError = util.validateJsonString(data);

    return { dataError: dataError !== null && dataError };
  },

  processResult: ({ settings, data, mode }, newResult) => {
    let meta;

    if (newResult) {
      meta = newResult.data;
    } else {
      const parsedData = safeParse(data);

      if (mode === 'json') {
        meta = parsedData;
      } else if (parsedData) {
        meta =
          parsedData.resource &&
          parsedData.resource.settingsForm &&
          parsedData.resource.settingsForm.form;
      }
    }

    // inject the current setting values (found in resource.settings)
    // into the respective field’s defaultValue prop.
    const newMeta = produce(meta, draft => {
      if (settings && meta && typeof draft.fieldMap === 'object') {
        Object.keys(draft.fieldMap).forEach(key => {
          const field = draft.fieldMap[key];

          if (typeof field !== 'object') {
            throw new Error('Invalid fieldMap. Key should be of object type');
          }

          if (!settings[field.name] && field.defaultValue) return;
          field.defaultValue = settings[field.name] || '';
        });
      }
    });

    return { data: newMeta, logs: newResult && newResult.logs };
  },

  patchSet: editor => {
    const patches = {
      foregroundPatches: [],
    };
    const {
      code,
      scriptId,
      entryFunction,
      data,
      resourceId,
      resourceType,
      mode,
    } = editor;
    const value = {};

    if (data) {
      const form = extractForm(data, mode);

      value.form = form;

      // {
      //   fieldMap: {
      //     A: {
      //       id: 'A',
      //       name: 'A',
      //       type: 'checkbox',
      //       helpText: 'Optional help for setting: A',
      //       label: 'Confirm delete?',
      //       required: true,
      //     },
      //     mode: {
      //       id: 'mode',
      //       name: 'mode',
      //       type: 'radiogroup',
      //       label: 'Mode',
      //       options: [
      //         {
      //           items: ['Create', 'Update', 'Delete'],
      //         },
      //       ],
      //     },
      //   },
      //   layout: {
      //     fields: ['A', 'mode'],
      //   },
      // };
    }

    if (scriptId) {
      value.init = {
        function: entryFunction,
        _scriptId: scriptId,
      };
      patches.foregroundPatches.push({
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

    patches.foregroundPatches.push({
      patch: [
        {
          op: 'replace',
          path: '/settingsForm',
          value,
        },
      ],
      resourceType,
      resourceId,
    });

    // console.log(patches);

    return patches;
  },
};
