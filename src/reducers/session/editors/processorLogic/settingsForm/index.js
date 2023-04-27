import produce from 'immer';
import { isEqual, isEmpty } from 'lodash';
import { hooksToFunctionNamesMap } from '../../../../../utils/hooks';
import util from '../../../../../utils/json';
import { safeParse, isJsonString } from '../../../../../utils/string';
import javascript from '../javascript';

export function generateScriptInput(parsedData, flowGrouping, resourceDocs, defaultMeta) {
  const {resource, parentResource, license, parentLicense} = resourceDocs || {};

  const input = {
    resource: {
      ...(resource || {}),
      settingsForm: {
        form: parsedData || defaultMeta,
      },
    },
    parentResource,
    grandParentResource: undefined,
    license: license || {},
    parentLicense: parentLicense || {},
    sandbox: !!resource?.sandbox,
  };

  // for flow grouping, the schema changes
  if (flowGrouping) {
    input.resource = {
      name: flowGrouping.title,
      settings: flowGrouping.settings,
      _id: flowGrouping.sectionId,
      settingsForm: {
        form: parsedData || defaultMeta,
      },
    };
    input.parentResource = resource || {};
    input.grandParentResource = parentResource;
  }

  return input;
}

export function extractForm(data, mode) {
  const parsedData = safeParse(data);

  if (mode === 'json') {
    return parsedData;
  }

  if (parsedData?.resource?.settingsForm) {
    return parsedData.resource.settingsForm.form;
  }
}

export function toggleData(data, mode, flowGrouping, resourceDocs) {
  if (typeof data === 'string' && !isJsonString(data)) {
    return data;
  }

  const parsedData = safeParse(data);
  const hasWrapper = !!(parsedData?.resource?.settingsForm?.form !== undefined);
  let finalData = parsedData;

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
    const defaultMeta = { fieldMap: {}, layout: { fields: [] } };

    finalData = generateScriptInput(parsedData, flowGrouping, resourceDocs, defaultMeta);
  }

  return JSON.stringify(finalData, null, 2);
}

// get correct patch path in case of flow groupings sections for integration resource
export function generatePatchPath(sectionId, allSections, path) {
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
    const { code, entryFunction } = rule?.script || {};

    return !code || !entryFunction;
  },
  init: ({options, settingsForm, settings, integrationAllSections, resourceDocs}) => {
    const isFlowGroupingSection = options.sectionId && options.sectionId !== 'general';
    let flowGrouping;

    if (isFlowGroupingSection) {
      flowGrouping = integrationAllSections?.find(sec => sec.sectionId === options.sectionId);
    }

    const { form, init = {} } = settingsForm || {};
    const mode = init._scriptId ? 'script' : 'json';
    const initForm = form || {
      fieldMap: {},
      layout: { fields: [] },
    };

    const rule = {
      script: {
        entryFunction: init.function || hooksToFunctionNamesMap.formInit,
        fetchScriptContent: true,
      },
    };

    if (init._scriptId) {
      rule.script.scriptId = init._scriptId;
    }
    const data = mode === 'script' ? toggleData(initForm, 'script', flowGrouping, resourceDocs) : initForm;

    return {
      ...options,
      data: options.data || data,
      rule: options.rule || rule,
      settings,
      context: options.settingsContext,
      insertStubKey: 'formInit',
      activeProcessor: mode,
      originalData: options.data || data,
      flowGrouping,
      resourceDocs,
      settingsFormPatchPath: generatePatchPath(options.sectionId, integrationAllSections, '/settingsForm'),
    };
  },
  requestBody: editor => {
    const { data, rule, context, activeProcessor, flowGrouping, resourceDocs } = editor;
    const {code, entryFunction} = rule.script || {};
    let parsedData = safeParse(data) || {};

    if (activeProcessor === 'json') {
      parsedData = generateScriptInput(parsedData, flowGrouping, resourceDocs);
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
    let parsedOriginalData = safeParse(editor.originalData);

    if (parsedData === undefined) {
      return false;
    }

    parsedData = parsedData?.resource?.settingsForm ? parsedData.resource.settingsForm.form : parsedData;
    parsedOriginalData = parsedOriginalData?.resource?.settingsForm ? parsedOriginalData.resource.settingsForm.form : parsedOriginalData;

    // added JSON.stringify check to consider the object keys' order as well
    if (!isEqual(parsedData, parsedOriginalData) || (JSON.stringify(parsedData) !== JSON.stringify(parsedOriginalData))) {
      return true;
    }

    return javascript.dirty({
      originalRule: editor.originalRule?.script,
      rule: editor.rule?.script,
    });
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
      settingsFormPatchPath,
    } = editor;
    const {code, scriptId, entryFunction} = rule?.script || {};
    const value = {};

    if (data) {
      const form = extractForm(data, activeProcessor);

      if (form && (!form.layout || (form.layout.fields?.length || form.layout.containers?.length))) {
        value.form = form;
      }

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
    }

    if (scriptId && activeProcessor === 'script') {
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
          path: settingsFormPatchPath,
          value,
        },
      ],
      resourceType,
      resourceId,
    });

    return patches;
  },
};
