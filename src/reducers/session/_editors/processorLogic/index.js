import isEqual from 'lodash/isEqual';
import xmlParser from './xmlParser';
import csvParser from './csvParser';
// import csvDataGenerator from './csvDataGenerator';
import transform from './transform';
import handlebars from './handlebars';
import javascript from './javascript';
import settingsForm from './settingsForm';
// import structuredFileParser from './structuredFileParser';
// import structuredFileGenerator from './structuredFileGenerator';
import sql from './sql';
import filter from './filter';
// import netsuiteLookupFilter from './netsuiteLookupFilter';
// import netsuiteQualificationCriteria from './netsuiteQualificationCriteria';
// import salesforceQualifier from './salesforceQualifier';
// import salesforceLookupFilter from './salesforceLookupFilter';
// import readme from './readme';
import scriptEdit from './scriptEdit';
import postResponseMapHook from './postResponseMapHook';
import exportFilter from './exportFilter';
import inputFilter from './inputFilter';
import outputFilter from './outputFilter';
import responseTransform from './responseTransform';
import databaseMapping from './databaseMapping';
import flowTransform from './flowTransform';

const logicMap = {
  handlebars,
  filter,
  javascript,
  csvParser,
  xmlParser,
  sql,
  settingsForm,
  transform,
  scriptEdit,
  postResponseMapHook,
  exportFilter,
  inputFilter,
  outputFilter,
  responseTransform,
  databaseMapping,
  flowTransform,
};

function getLogic(editor) {
  const logic = logicMap[editor.editorType];

  if (!logic) {
    throw new Error(`Type [${editor.editorType}] not supported.`);
  }

  return logic;
}

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

const getRule = editorType => {
  if (!editorType) return;
  const logic = getLogic({ editorType });

  return logic.getRule;
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

function getPatchSetLogic(editor) {
  // TODO:
  const processorKey =
    (editor.optionalSaveParams && editor.optionalSaveParams.processorKey) ||
    editor.editorType;

  if (!processorKey) {
    throw new Error('Not supported.');
  }

  const logic = logicMap[processorKey];

  if (!logic) {
    throw new Error(`Processor [${processorKey}] not supported.`);
  }

  return logic;
}

const getPatchSet = editor => getPatchSetLogic(editor).patchSet(editor);

export const featuresMap = options => ({
  handlebars: {
    autoEvaluate: false,
    strict: false,
    layout: 'compact',
  },
  csvParser: {
    layout: 'compact',
  },
  xmlParser: {
    layout: 'compact',
  },
  settingsForm: {
    layout: `${options?.mode || 'json'}FormBuilder`,
  },
  sql: {
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
    duplicateKeyToValidate: 'generate',
    layout: 'compact',
  },
  flowTransform: {
    layout: 'compact',
  },
});

export default {
  requestOptions,
  validate,
  isDirty,
  init,
  processResult,
  getPatchSet,
  getRule,
  buildData,
};
