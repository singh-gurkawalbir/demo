function validateJsonString(s) {
  try {
    JSON.parse(s);

    return null;
  } catch (e) {
    return e.message;
  }
}

const allLogic = {
  xmlParser: {
    requestBody: editor => {
      const rules = {
        resourcePath: editor.resourcePath,
        doc: {
          parsers: [
            {
              type: 'xml',
              rules: {
                V0_json: !editor.leanJson,
                trimSpaces: editor.trimSpaces,
                stripNewLineChars: editor.stripNewLineChars,
                attributePrefix: editor.attributePrefix,
                textNodeName: editor.textNodeName,
              },
            },
          ],
        },
      };

      return {
        data: editor.data,
        rules,
      };
    },
    validate: editor => ({
      dataError:
        !editor.data && !editor.data.length && 'Must provide some sample data.',
    }),
  },
  csvParser: {
    requestBody: editor => {
      const rowDelimiterMap = {
        '': undefined,
        cr: '\r',
        lf: '\n',
        crlf: '\r\n',
      };
      const columnDelimiterMap = {
        '': undefined,
        ',': ',',
        '|': '|',
        tab: '\t',
      };

      return {
        rules: {
          columnDelimiter: columnDelimiterMap[editor.columnDelimiter],
          rowDelimiter: rowDelimiterMap[editor.rowDelimiter],
          keyColumns: editor.keyColumns,
          hasHeaderRow: editor.hasHeaderRow,
          trimSpaces: editor.trimSpaces,
        },
        data: editor.data,
      };
    },
    validate: editor => ({
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
  transform: {
    requestBody: editor => ({
      rules: { version: '1', rules: [editor.rule || []] },
      data: [JSON.parse(editor.data)],
    }),
    validate: editor => ({
      dataError: validateJsonString(editor.data),
    }),
  },
  handlebars: {
    requestBody: editor => ({
      rules: { strict: !!editor.strict, template: editor.template },
      data: JSON.parse(editor.data),
    }),
    validate: editor => ({
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
