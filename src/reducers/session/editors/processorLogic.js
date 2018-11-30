function validateJsonString(s) {
  try {
    JSON.parse(s);

    return null;
  } catch (e) {
    return e.message;
  }
}

const allLogic = {
  csvParser: {
    requestBody: editor => ({
      rules: {
        columnDelimiter: editor.columnDelimiter,
        rowDelimiter: editor.rowDelimiter,
        keyColumns: editor.keyColumns,
        hasHeaderRow: editor.hasHeaderRow,
        trimSpaces: editor.trimSpaces,
      },
      data: editor.data,
    }),
    validate: editor => ({
      ruleError: null,
      dataError:
        !editor.data && !editor.data.length && 'Must provide some sample data.',
    }),
  },
  merge: {
    requestBody: editor => ({
      rules: JSON.parse(editor.rule),
      data: [JSON.parse(editor.data)],
    }),
    validate: editor => ({
      ruleError: validateJsonString(editor.rule),
      dataError: validateJsonString(editor.data),
    }),
  },
  handlebars: {
    requestBody: editor => ({
      rules: { strict: !!editor.strict, template: editor.template },
      data: JSON.parse(editor.data),
    }),
    validate: editor => ({
      ruleError: null,
      dataError: validateJsonString(editor.data),
    }),
  },
};

function getLogic(editor) {
  const logic = allLogic[editor.processor];

  if (!logic) {
    throw new Error(`Processor [${editor.processor}] not supported.`);
  }

  return logic;
}

const validate = editor => {
  const result = getLogic(editor).validate(editor);
  const errors = [];

  if (result.ruleError) {
    errors.push(result.ruleError);
  }

  if (result.dataError) {
    errors.push(result.dataError);
  }

  return errors;
};

const requestOptions = editor => {
  const validationErrors = validate(editor);

  if (validationErrors.length) {
    return { errors: validationErrors };
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
