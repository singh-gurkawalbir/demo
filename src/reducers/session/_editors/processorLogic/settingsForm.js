import produce from 'immer';
import { isEqual, isEmpty } from 'lodash';
import util from '../../../../utils/json';
import { safeParse, isJsonString } from '../../../../utils/string';
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

  if (parsedData?.resource?.settingsForm) {
    return parsedData.resource.settingsForm.form;
  }
}

export function toggleData(data, mode) {
  if (typeof data === 'string' && !isJsonString(data)) {
    return data;
  }

  const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
  const hasWrapper = !!(parsedData?.resource?.settingsForm?.form !== undefined);
  let finalData = parsedData;

  // console.log(mode, hasWrapper);

  if (mode === 'json') {
    // try and find only the form meta...
    // since the user can type anything, we are not guaranteed of a
    // json schema that contains an expected shape... for now, lets
    // assume we do.
    if (hasWrapper) {
      finalData = parsedData.resource.settingsForm.form;
    }
    // script
  } else if (!hasWrapper) {
    finalData = {
      resource: {
        settingsForm: {
          form: parsedData || { fieldMap: {}, layout: { fields: [] } },
        },
      },
      parentResource: {},
      license: {},
      parentLicense: {},
      sandbox: false,
    };
  }

  return JSON.stringify(finalData, null, 2);
}

// get correct patch path in case of flowgroupings sections for integration resource
function generatePatchPath(sectionId, allSections, path) {
  if (!sectionId || sectionId === 'general' || !allSections) return path;
  // if sectionId is defined and its not general we are probably looking up a flow grouping
  const sectionsExcludingGeneral = allSections.filter(sec => sec.sectionId !== 'general');
  // general is the first section in allSections
  const ind = sectionsExcludingGeneral.findIndex(sec => sec.sectionId === sectionId);

  return `/flowGroupings/${ind}${path}`;
}

export default {
  processor: 'javascript',
  skipPreview: ({ rule }) => {
    const { code, entryFunction } = rule.script || {};

    return !code || !entryFunction;
  },
  init: ({options, settingsForm, settings, integrationAllSections}) => {
    const { form, init = {} } = settingsForm || {};
    const mode = init._scriptId ? 'script' : 'json';
    const initForm = form || {
      fieldMap: {},
      layout: { fields: [] },
    };

    const rule = {
      script: {
        entryFunction: init.function || 'main',
        fetchScriptContent: true,
      },
    };

    if (init._scriptId) {
      rule.script.scriptId = init._scriptId;
    }
    const data = mode === 'script' ? toggleData(initForm, 'script') : initForm;

    return {
      ...options,
      data: options.data || data,
      rule: options.rule || rule,
      settings,
      insertStubKey: 'formInit',
      activeProcessor: mode,
      originalData: data,
      scriptPatchPath: generatePatchPath(options.sectionId, integrationAllSections, '/content'),
      settingsFormPatchPath: generatePatchPath(options.sectionId, integrationAllSections, '/settingsForm'),
    };
  },
  requestBody: editor => {
    const { data, rule, context, activeProcessor } = editor;
    const {code, entryFunction} = rule.script || {};
    let parsedData = typeof data === 'string' ? JSON.parse(data) : data;

    if (activeProcessor === 'json') {
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
    const parsedOriginalData = safeParse(editor.originalData);

    if (parsedData === undefined) {
      return false;
    }

    if (editor.activeProcessor === 'script') {
      parsedData = parsedData?.resource?.settingsForm?.form;
    }

    // added JSON.stringify check to consider the object keys' order as well
    if (!isEqual(parsedData, parsedOriginalData) || (JSON.stringify(parsedData) !== JSON.stringify(parsedOriginalData))) {
      return true;
    }

    return javascript.dirty(editor);
  },

  validate: ({ data }) => {
    let dataError;

    if (typeof data === 'string' && !isEmpty(data)) dataError = util.validateJsonString(data);

    return { dataError: dataError !== null && dataError };
  },

  processResult: ({ settings, data, activeProcessor }, newResult) => {
    let meta;

    if (newResult) {
      meta = newResult.data;
    } else {
      const parsedData = safeParse(data);

      if (activeProcessor === 'json') {
        meta = parsedData;
      } else if (parsedData) {
        meta = parsedData.resource?.settingsForm?.form;
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

    return { data: newMeta, logs: newResult?.logs };
  },

  patchSet: editor => {
    const patches = {
      foregroundPatches: [],
    };
    const {
      rule,
      data,
      resourceId,
      resourceType,
      activeProcessor,
      scriptPatchPath,
      settingsFormPatchPath,
    } = editor;
    const {code, scriptId, entryFunction} = rule?.script || {};
    const value = {};

    if (data) {
      const form = extractForm(data, activeProcessor);

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
            path: scriptPatchPath,
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
          path: settingsFormPatchPath,
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
