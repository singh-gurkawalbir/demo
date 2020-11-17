import isEqual from 'lodash/isEqual';
// import xmlParser from './xmlParser';
// import csvParser from './csvParser';
// import csvDataGenerator from './csvDataGenerator';
// import merge from './merge';
// import transform from './transform';
import handlebars from './handlebars';
// import javascript from './javascript';
// import settingsForm from './settingsForm';
// import structuredFileParser from './structuredFileParser';
// import structuredFileGenerator from './structuredFileGenerator';
// import sql from './sql';
// import filter from './filter';
// import netsuiteLookupFilter from './netsuiteLookupFilter';
// import netsuiteQualificationCriteria from './netsuiteQualificationCriteria';
// import salesforceQualifier from './salesforceQualifier';
// import salesforceLookupFilter from './salesforceLookupFilter';
// import readme from './readme';

const logicMap = {
  handlebars,
};

function getLogic(editor) {
  const logic = logicMap[editor.processor];

  if (!logic) {
    throw new Error(`Processor [${editor.processor}] not supported.`);
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

  return {
    processor: logic.processor || editor.processor,
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

  // If there is no originalRule , return undefined
  // as we return a boolean only incase of rule is passed - refer @editorDrawer disableSave property
  if (!editor.originalRule) {
    return;
  }
  if (!isEqual(editor.originalRule, editor.rule)) {
    return true;
  }

  return false;
};
const init = processor => {
  if (!processor) return;
  const logic = getLogic({ processor });

  return logic.init;
};

const processResult = editor => {
  if (!editor) return;
  const logic = getLogic(editor);

  return logic.processResult;
};

/**
 * init is optional for processors and is called during EDITOR_INIT.
 * data saved during EDITOR.INIT can be modified with it
 */

export default {
  requestOptions,
  validate,
  isDirty,
  init,
  processResult,
};
