import xmlParser from './xmlParser';
import csvParser from './csvParser';
import csvDataGenerator from './csvDataGenerator';
import merge from './merge';
import transform from './transform';
import handlebars from './handlebars';
import javascript from './javascript';
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
  const violations = validate(editor);

  if (violations) {
    return { violations };
  }

  return {
    processor: getLogic(editor).processor || editor.processor,
    body: getLogic(editor).requestBody(editor),
  };
};

export default {
  requestOptions,
  validate,
};
