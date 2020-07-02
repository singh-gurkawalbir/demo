import { isEqual } from 'lodash';
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
  const logic = getLogic(editor);

  // give precedence to dirty method if implemented by editor
  if (logic.dirty) {
    return logic.dirty(editor);
  }

  const initKeys = Object.keys(editor).filter(key => key.indexOf('_init') !== -1);
  for (let i = 0; i < initKeys.length; i += 1) {
    const initKey = initKeys[i];
    const originalKey = initKey.replace('_init_', '');
    if (typeof editor[originalKey] === 'boolean' && !!editor[initKey] !== !!editor[originalKey]) {
      return true;
    }
    if (
      Array.isArray(editor[originalKey]) &&
            !isEqual(editor[initKey], editor[originalKey])
    ) return true;
    if (
      ['string', 'number'].includes(typeof editor[originalKey]) &&
            editor[initKey] !== editor[originalKey]
    ) return true;
  }
  return false;
};
const init = processor => {
  const logic = getLogic({ processor });

  return logic.init;
};

const processResult = editor => {
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
