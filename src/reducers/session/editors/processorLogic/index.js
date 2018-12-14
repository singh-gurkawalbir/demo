import xmlParser from './xmlParser';
import csvParser from './csvParser';
import merge from './merge';
import transform from './transform';
import handlebars from './handlebars';

const logicMap = {
  xmlParser,
  csvParser,
  merge,
  transform,
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
    processor: editor.processor,
    body: getLogic(editor).requestBody(editor),
  };
};

export default {
  requestOptions,
  validate,
};
