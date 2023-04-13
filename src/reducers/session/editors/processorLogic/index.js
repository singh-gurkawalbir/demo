import isEqual from 'lodash/isEqual';
import { getDomain } from '../../../../forms/formFactory/utils';

import xmlParser from './xmlParser';
import csvParser from './csvParser';
import jsonParser from './jsonParser';
import csvGenerator from './csvGenerator';
import transform from './transform';
import handlebars from './handlebars';
import javascript from './javascript';
import settingsForm from './settingsForm';
import structuredFileParser from './structuredFileParser';
import structuredFileGenerator from './structuredFileGenerator';
import sql from './sql';
import filter from './filter';
import netsuiteLookupFilter from './netsuiteLookupFilter';
import netsuiteQualificationCriteria from './netsuiteQualificationCriteria';
import salesforceQualificationCriteria from './salesforceQualificationCriteria';
import salesforceLookupFilter from './salesforceLookupFilter';
import readme from './readme';
import postResponseMapHook from './postResponseMapHook';
import exportFilter from './exportFilter';
import inputFilter from './inputFilter';
import outputFilter from './outputFilter';
import responseTransform from './responseTransform';
import databaseMapping from './databaseMapping';
import flowTransform from './flowTransform';
import mappings from './mappings';
import responseMappings from './responseMappings';
import router from './router';

const logicMap = {
  handlebars,
  filter,
  javascript,
  csvParser,
  xmlParser,
  jsonParser,
  sql,
  settingsForm,
  transform,
  postResponseMapHook,
  exportFilter,
  inputFilter,
  outputFilter,
  responseTransform,
  databaseMapping,
  flowTransform,
  csvGenerator,
  structuredFileParser,
  structuredFileGenerator,
  readme,
  netsuiteLookupFilter,
  salesforceLookupFilter,
  netsuiteQualificationCriteria,
  salesforceQualificationCriteria,
  mappings,
  responseMappings,
  router,
};

export function getLogic(editor) {
  const logic = logicMap[editor.editorType];

  if (!logic) {
    throw new Error(`Type [${editor.editorType}] not supported.`);
  }

  return logic;
}

const validateChatResponse = (editor, response) =>
  getLogic(editor).validateChatResponse(editor, response);

const validate = editor => {
  if (!editor) return;
  const violations = getLogic(editor).validate(editor);

  if (!violations.ruleError && !violations.dataError) {
    return false;
  }

  return violations;
};

const requestOptions = editor => {
  if (!editor) return;
  const logic = getLogic(editor);
  const skipPreview = logic.skipPreview && logic.skipPreview(editor);
  const violations = validate(editor);

  if (violations || skipPreview) {
    return { violations, skipPreview };
  }
  let processor;

  if (typeof logic.processor === 'function') {
    processor = logic.processor(editor);
  } else {
    processor = logic.processor;
  }
  processor = processor || editor.editorType;

  return {
    processor,
    body: logic.requestBody(editor),
  };
};

// isDirty checks for changes in editor
const isDirty = editor => {
  if (!editor) return;
  const logic = getLogic(editor);

  // give precedence to dirty method if implemented by editor
  if (logic.dirty) {
    return logic.dirty(editor);
  }
  // // If there is no originalRule , return undefined
  // // as we return a boolean only incase of rule is passed - refer @editorDrawer disableSave property
  // if (editor.originalRule) {
  //   return;
  // }
  if (!isEqual(editor.originalRule, editor.rule)) {
    return true;
  }

  return false;
};
/**
 * init is optional for processors and is called during EDITOR_INIT.
 * data saved during EDITOR.INIT can be modified with it
 */
const init = editorType => {
  if (!editorType) return;
  const logic = getLogic({ editorType });

  return logic.init;
};

const getChatOptions = editorType => {
  if (!editorType) return;

  // for now, while we have no "feature flag" user setting, we'll just
  // disable chat options for all domains except localhost and QA
  if (
    !['localhost', 'localhost.io', 'qa.staging.integrator.io'].includes(
      getDomain()
    )
  ) {
    return;
  }

  const logic = getLogic({ editorType });

  if (logic.getChatOptions) {
    return logic.getChatOptions();
  }
};
const updateRule = editor => {
  if (!editor) return;
  let logic;

  try {
    logic = getLogic(editor);
  // eslint-disable-next-line no-empty
  } catch (e) { }

  return logic?.updateRule;
};

const buildData = editorType => {
  if (!editorType) return;
  const logic = getLogic({ editorType });

  return logic.buildData;
};

const processResult = editor => {
  if (!editor) return;
  const logic = getLogic(editor);

  return logic.processResult;
};

const preSaveValidate = editor => {
  if (!editor) return;
  const logic = getLogic(editor);

  return logic.preSaveValidate;
};

const getPatchSet = editor => getLogic(editor).patchSet?.(editor);

export const featuresMap = options => ({
  handlebars: {
    autoEvaluate: false,
    strict: false,
    layout: 'compact',
  },
  csvParser: {
    layout: 'compact',
    autoEvaluate: true,
  },
  csvGenerator: {
    layout: 'compact',
    autoEvaluate: true,
  },
  xmlParser: {
    layout: 'compact',
  },
  settingsForm: {
    layout: `${options?.activeProcessor || 'json'}FormBuilder`,
    autoEvaluate: true,
  },
  sql: {
    layout: 'compact',
  },
  databaseMapping: {
    layout: 'compact',
  },
  filter: {
    autoEvaluate: false,
    layout: 'compact',
  },
  javascript: {
    autoEvaluate: false,
    layout: 'compact',
  },
  transform: {
    layout: 'compact',
  },
  flowTransform: {
    layout: 'compact',
    insertStubKey: 'transform',
  },
  responseTransform: {
    layout: 'compact',
    insertStubKey: 'transform',
  },
  exportFilter: {
    layout: 'compact',
    insertStubKey: 'filter',
  },
  inputFilter: {
    layout: 'compact',
    insertStubKey: 'filter',
  },
  outputFilter: {
    layout: 'compact',
    insertStubKey: 'filter',
  },
  structuredFileParser: {
    layout: 'compact',
    autoEvaluate: true,
  },
  structuredFileGenerator: {
    layout: 'compact',
    autoEvaluate: true,
  },
  postResponseMapHook: {
    layout: 'compact',
    insertStubKey: 'postResponseMap',
  },
  readme: {
    layout: 'readme',
  },
  netsuiteLookupFilter: {
    layout: 'lookupFilter',
    hidePreview: true,
  },
  salesforceLookupFilter: {
    layout: 'lookupFilter',
    hidePreview: true,
  },
  netsuiteQualificationCriteria: {
    layout: 'lookupFilter',
    hidePreview: true,
  },
  salesforceQualificationCriteria: {
    layout: 'lookupFilter',
    hidePreview: true,
  },
  mappings: {
    layout: 'compact2',
    autoEvaluate: false,
  },
  responseMappings: {
    layout: 'compact2',
    autoEvaluate: false,
  },
  router: {
    autoEvaluate: false,
    insertStubKey: 'router',
    // We need to generalize the layout name below. Here we are using
    // the same layout as for settings form. We need to find a generic name
    // for the pair of layouts.
    // also the css grid template needs to rename "hook" to "script".
    layout: `${
      options?.rule?.activeProcessor === 'filter' ? 'json' : 'script'
    }FormBuilder`,
  },
});

export default {
  requestOptions,
  validate,
  isDirty,
  init,
  processResult,
  getPatchSet,
  getChatOptions,
  validateChatResponse,
  buildData,
  preSaveValidate,
  updateRule,
};
