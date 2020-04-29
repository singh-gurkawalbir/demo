import xmlParser from './xmlParser';
import csvParser from './csvParser';
import csvDataGenerator from './csvDataGenerator';
import merge from './merge';
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
import salesforceQualifier from './salesforceQualifier';
import salesforceLookupFilter from './salesforceLookupFilter';

const logicMap = {
  xmlParser,
  csvParser,
  csvDataGenerator,
  merge,
  transform,
  handlebars,
  javascript,
  settingsForm,
  structuredFileParser,
  structuredFileGenerator,
  sql,
  filter,
  netsuiteLookupFilter,
  netsuiteQualificationCriteria,
  salesforceQualifier,
  salesforceLookupFilter,
};

function getLogic(editor) {
  const logic = logicMap[editor.processor];

  if (!logic) {
    throw new Error(`Processor [${editor.processor}] not supported.`);
  }

  return logic;
}

const validate = editor => {
  const violations = getLogic(editor).validate(editor);

  if (!violations.ruleError && !violations.dataError) {
    return false;
  }

  return violations;
};

const requestOptions = editor => {
  const logic = getLogic(editor);

  if (logic.skipPreview && logic.skipPreview(editor)) return undefined;

  const violations = validate(editor);

  if (violations) {
    return { violations };
  }

  return {
    processor: logic.processor || editor.processor,
    body: logic.requestBody(editor),
  };
};

// isDirty checks for changes in editor
const isDirty = editor => {
  const logic = getLogic(editor);

  if (logic.dirty) {
    return logic.dirty(editor);
  }

  return undefined;
};

const init = processor => {
  const logic = getLogic({ processor });

  return logic.init;
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
};
