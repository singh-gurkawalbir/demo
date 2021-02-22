import { isString } from 'lodash';
import util from '../../../../../utils/json';

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

    if (typeof data !== 'object') {
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
  validate: editor => ({
    dataError:
      typeof editor.data !== 'object' && util.validateJsonString(editor.data),
    ruleError: editor.isInvalid ? 'Invalid rule' : undefined,
  }),
  processResult: (editor, {data}) => {
    let outputMessage = '';

    if (data) {
      if (data.length > 0) {
        outputMessage = 'TRUE: record will be processed';
      } else {
        outputMessage = 'FALSE: record will be ignored/discarded';
      }
    }

    return {data: outputMessage};
  },
};
