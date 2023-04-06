import { isEqual } from 'lodash';
import util from '../../../../../utils/json';
import { dataAsString } from '../../../../../utils/editor';
import handlebars from '../handlebars';
import { getDefaultData } from '../../../../../utils/sampleData';
import { getUnionObject } from '../../../../../utils/jsonPaths';
import { safeParse } from '../../../../../utils/string';
import { isNewId } from '../../../../../utils/resource';
import customCloneDeep from '../../../../../utils/customCloneDeep';

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
      temperature: 0.1,
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
abs: {{abs field}}
add: {{add field field}}
and: {{#and field field}} expr {{else}} expr {{/and}}
avg: {{avg field field}}
base64Encode: {{base64Encode field}}
base64Decode: {{base64Decode field decodeFormat}}
capitalize: {{capitalize field}}
capitalizeAll: {{capitalizeAll field}}
ceil: {{ceil field}}
compare: {{#compare field operator field}} expr {{else}} expr {{/compare}}
contains: {{#contains collection field}} expr {{else}} expr {{/contains}}
dateAdd: {{dateAdd dateField offsetField timeZoneField}}
dateFormat: {{dateFormat o/pformat date i/pformat timezone}}
decodeURI: {{decodeURI field}}
divide: {{divide field field}}
each: {{#each field}}{{this}}{{/each}}
encodeURI: {{encodeURI field}}
floor: {{floor field}}
getValue: {{getValue field "defaultValue"}}
hash: {{hash algorithm encoding field}}
hmac: {{hmac algorithm key encoding field keyEncoding}}
if_else: {{#if field}} expr {{else}} expr {{/if}}
ifEven: {{#ifEven field}} expr {{else}} expr {{/ifEven}}
join: {{join delimiterField field1 field2}}
jsonEncode: {{jsonEncode field}}
jsonSerialize: {{jsonSerialize field}}
lookup: {{lookup lookupName contextPath}}
lowercase: {{lowercase field}}
multiply: {{multiply field field}}
neither: {{#neither field field}} expr {{else}} expr {{/neither}}
or: {{#or field field}} expr {{else}} expr {{/or}}
random: {{random “CRYPTO”/“UUID” length}}
regexMatch: {{regexMatch field regex index options}}
regexReplace: {{regexReplace field1 field2 regex options}}
regexSearch: {{regexSearch field regex options}}
replace: {{replace field string string}}
round: {{round field}}
sortnumbers: {{sort field number="true"}}
sortstrings: {{sort field}}
split: {{split field delimiter index}}
substring: {{substring stringField startIndex endIndex}}
subtract: {{subtract field field}}
sum: {{sum <array>}}
timestamp: {{timestamp format timezone}}
toExponential: {{toExponential field fractionDigits}}
toFixed: {{toFixed field digits}}
toPrecision: {{toPrecision field precision}}
trim: {{trim field}}
unless: {{#unless field}} expr {{else}} expr {{/unless}}
uppercase: {{uppercase field}}
with: {{#with field}} {{field1}} {{field2}} {{/with}}`,
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
