import { isString } from 'lodash';
// import Ajv from 'ajv';
import util from '../../../../../utils/json';

// import json schema validation library

export default {
  requestBody: editor => {
    let data;

    if (isString(editor.data)) {
      try {
        data = JSON.parse(editor.data);
      } catch (ex) {
        data = {};
      }
    } else {
      ({ data } = editor);
    }

    if (!data || typeof data !== 'object') {
      data = {};
    }

    const { record: dataRecord, rows, settings, ...context } = data;
    /*
      data will be in following formats:
      For grouped records:
         {
          "rows": [
            {
              "id": "116",
              "recordType": "salesorder",
              "Date": "22/7/2013",
            },
            {
              "id": "116",
              "recordType": "salesorder",
              "Date": "22/7/2013",
            }
          ],
          "settings": {
            "integration": {},
            "flow": {},
            "connection": {},
            "export": {}
          },
          "lastExportDateTime": "2021-02-10T00:00:00.000Z",
          "currentExportDateTime": "2021-02-16T00:00:00.000Z",
        }
      For non-grouped records:
       {
          "record": {
            "id": "116",
            "recordType": "salesorder",
            "Date": "22/7/2013",
          },
          "settings": {
            "integration": {},
            "flow": {},
            "connection": {},
            "export": {}
          },
          "lastExportDateTime": "2021-02-10T00:00:00.000Z",
          "currentExportDateTime": "2021-02-16T00:00:00.000Z",
       }
    */
    const record = Array.isArray(rows) ? rows[0] : dataRecord;

    return {
      rules: { version: '1', rules: editor.rule || [] },
      data: typeof record === 'object' ? [record] : [{}],
      options: { settings, contextData: context },
    };
  },
  getChatOptions: () => ({
    enabled: true,
    placeholder: 'Tell me about your filter rules',
    request: {
      model: 'gpt-3.5-turbo',
      temperature: 0,
      top_p: 1,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: `You are an assistant tasked to build filter rules for Celigo's integrator.io product. 
        These rules are applied against sample record data. 
        Do not output any explanations, only output valid json.`,
        },
        {
          role: 'user',
          content: 'only process records where type = adjustment',
        },
        {
          role: 'assistant',
          content: '["equals",["string",["extract","Type"]],"Adjustment"]',
        },
        {
          role: 'user',
          content: 'only process records where isDelete is true',
        },
        {
          role: 'assistant',
          content: '["equals",["string",["extract","isDelete"]],"true"]',
        },
        {
          role: 'user',
          content:
            'only process records where CreditMemoData.length > 0 and charge != yes',
        },
        {
          role: 'assistant',
          content:
            '["and",["greaterthan",["number",["extract","CreditMemoData.length"]],0],["notequals",["string",["extract","CHARGE"]],"YES"]]',
        },
      ],
    },
  }),
  validateRule: (editor, rule) => {
    const isValid = util.validateJsonString(rule) === null;

    if (!isValid) {
      return ['Celigo chat returned the following invalid JSON:', rule];
    }
  },

  validateChatResponse: (editor, response) => {
    try {
      const parsedResponse = JSON.parse(response);

      // Test to see if rule matches JSON schema for filter rule
      // const ajv = new Ajv();
      // const validate = ajv.compile({ });

      return { isValid: true, parsedResponse };
    } catch (e) {
      return {
        isValid: false,
        validationErrors: [
          'Celigo chat returned the following invalid JSON:',
          e.message,
        ],
      };
    }
  },

  validate: editor => ({
    dataError:
      typeof editor.data !== 'object' && util.validateJsonString(editor.data),
    ruleError: editor.isInvalid ? 'Invalid rule' : undefined,
  }),
  processResult: (editor, { data }) => {
    let outputMessage = '';

    if (data) {
      if (data.length > 0) {
        outputMessage = 'TRUE: record will be processed';
      } else {
        outputMessage = 'FALSE: record will be ignored/discarded';
      }
    }

    return { data: outputMessage };
  },
};
