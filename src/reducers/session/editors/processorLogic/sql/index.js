import { isEqual } from 'lodash';
import util from '../../../../../utils/json';
import { dataAsString } from '../../../../../utils/editor';
import handlebars from '../handlebars';
import { getDefaultData } from '../../../../../utils/sampleData';
import { getUnionObject } from '../../../../../utils/jsonPaths';
import { safeParse } from '../../../../../utils/string';
import { isNewId } from '../../../../../utils/resource';
import customCloneDeep from '../../../../../utils/customCloneDeep';
import handlebarHelpersList from '../handlebarHelpersList';

export function _hasDefaultMetaData({fieldId, resourceType}) {
  const hideDefaultDataFields = [
    'dynamodb.expressionAttributeValues',
    'dynamodb.itemDocument',
    'mongodb.document',
    'mongodb.update',
    'mongodb.ignoreLookupFilter',
    'mongodb.filter',
    '_query',
    'salesforce.soql',
  ];

  if (hideDefaultDataFields.includes(fieldId)) {
    return false;
  }
  if (resourceType === 'exports' && (fieldId === 'rdbms.query' || fieldId === 'rdbms.once.query')) {
    return false;
  }

  return true;
}

export default {
  processor: 'handlebars',
  init: props => {
    const { adaptorType } = props.resource || {};
    let modelMetadata;

    if (adaptorType === 'RDBMSImport') {
      modelMetadata = props.formValues['/modelMetadata'];
    }

    return handlebars.init({
      ...props,
      modelMetadata,
      supportsDefaultData: _hasDefaultMetaData(props.options),
    });
  },
  buildData: (
    { modelMetadata, supportsDefaultData, resourceId },
    sampleData
  ) => {
    if (!supportsDefaultData) {
      return { data: sampleData };
    }
    const parsedData = safeParse(sampleData);

    if (modelMetadata) {
      const newMeta = customCloneDeep(modelMetadata);

      return {
        data: sampleData,
        defaultData: JSON.stringify(newMeta, null, 2),
      };
    }
    const isNewResource = isNewId(resourceId);

    // we only show suggested defaults for new resource
    if (!isNewResource) {
      return { data: sampleData };
    }

    let temp = {};

    if (
      Array.isArray(parsedData) &&
      parsedData.length &&
      typeof parsedData[0] === 'object'
    ) {
      temp = customCloneDeep(getUnionObject(parsedData));
    } else if (parsedData) {
      const { data, rows, record } = parsedData;
      const sampleDataToClone = record || rows?.[0] || data?.[0] || data;

      temp = customCloneDeep(sampleDataToClone);
    }
    const defaultData = getDefaultData(temp);

    return {
      data: sampleData,
      defaultData: dataAsString(defaultData) || '',
    };
  },
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.rule },
    data: safeParse(editor.data) || {},
  }),
  dirty: editor => {
    const { originalDefaultData, defaultData, originalRule, rule } = editor;

    if (!isEqual(originalDefaultData, defaultData)) {
      return true;
    }

    if (!isEqual(originalRule, rule)) {
      return true;
    }

    return false;
  },
  validate: editor => {
    const getDataError = () => {
      const errMessages = [];

      if (editor.data) {
        const message = util.validateJsonString(editor.data);

        if (message) errMessages.push(`Sample Data: ${message}`);
      }

      if (editor.defaultData) {
        const message = util.validateJsonString(editor.defaultData);

        if (message) errMessages.push(`Default Data: ${message}`);
      }

      return errMessages.join('\n');
    };

    return {
      dataError: getDataError(),
    };
  },
  getChatOptions: () => ({
    enabled: true,
    placeholder:
      'Tell me about your SQL query. I will apply your request to the existing SQL query unless you tell me to replace it',
    request: {
      model: 'gpt-3.5-turbo',
      temperature: 0,
      top_p: 1,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: `You are an assistant tasked to build valid, handlebar enhanced SQL queries. 
        These SQL queries may also include handlebar placeholders that reference fields from the sample record data provided below.`,
        },
        {
          role: 'user',
          content: `Only give valid handlebar enhanced SQL queries. 
        Do not output any explanations, only output valid handlebar enhanced SQL.
        Do not provide any explanations and format the SQL over multiple lines.
        Assume any handlebar placeholders reference fields from the sample record data provided below.
        Always add to the existing SQL query, unless told to replace it.`,
        },
        {
          role: 'user',
          content: `Restrict all handlebar helpers to the following list:
${handlebarHelpersList}`,
        },

        {
          role: 'user',
          content: `select name and email from users where id is the userId from the sample record. 
          Also select the total from orders, joined with users on userId`,
        },
        {
          role: 'assistant',
          content: `SELECT u.name, u.email, o.total 
  FROM users u
  JOIN orders o ON o.userId = u.id
  WHERE u.id = {{userId}}`,
        },
      ],
    },
  }),
  validateChatResponse: (editor, response) => {
    const isValid = typeof response === 'string' && response.length > 5;

    if (isValid) {
      return {isValid, parsedResponse: response};
    }

    return {
      isValid,
      validationErrors: ['Celigo chat returned the following invalid SQL:', response],
    };
  },
};
