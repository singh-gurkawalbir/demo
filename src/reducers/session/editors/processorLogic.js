function validateJsonString(s) {
  try {
    JSON.parse(s);

    return null;
  } catch (e) {
    return e.message;
  }
}

const allLogic = {
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

export default {
  requestOptions: editor => ({
    processor: editor.processor,
    body: getLogic(editor).requestBody(editor),
  }),
  validate: editor => {
    const result = getLogic(editor).validate(editor);
    const errors = [];

    if (result.ruleError) {
      errors.push(result.ruleError);
    }

    if (result.dataError) {
      errors.push(result.dataError);
    }

    return errors;
  },
};
