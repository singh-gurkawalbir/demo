import util from '../../../../../utils/json';
import { isOldRestAdaptor, inferResourceType } from '../../../../../utils/resource';
import { PAGING_FIELD_IDS } from '../../../../../utils/editor';
import { GRAPHQL_JSON_FIELDS } from '../../../../../utils/graphql';
import handlebarHelpersList from '../handlebarHelpersList';

/* this util is used to read field label and generate editor title from it
* eg, label = 'Build HTTP request body', editor title would be same i.e. 'Build HTTP request body'
* label = 'Override access token HTTP request body', editor title would be same i.e. 'Build access token HTTP request body'
* label = 'HTTP body', editor title would be 'Build HTTP body'
* label = 'Relative URI', editor title would be 'Build relative URI'
*/
export function _constructEditorTitle(label) {
  if (!label) return label;
  let title = label;

  const regexp = /^[A-Z]{2}/;

  // if label starts with 'Override', drop this word
  // and then apply below logic
  if (title.startsWith('Override')) {
    title = title.slice(9);
  }

  if (title.startsWith('Build')) {
    return title;
  } if (regexp.test(title)) {
    // first 2 chars are uppercase so don't convert to lowercase
    return `Build ${title}`;
  }

  return `Build ${title[0].toLowerCase()}${title.slice(1)}`;
}
export function _editorSupportsV1V2data({resource, fieldId, connection, isPageGenerator, isStandaloneResource}) {
  const {adaptorType} = resource || {};
  const {isHTTP} = connection || {};
  const isOldRestResource = isOldRestAdaptor(resource, connection);

  if (fieldId === '_query') {
    // we don't get whole resource object in case of rdbms lookup query so
    // change this to true when lookup query supports toggle in future
    return false;
  }
  // lookup fields don't support toggle yet
  if (fieldId?.startsWith('lookup') || fieldId === '_body' || fieldId === '_relativeURI') return false;

  // traceKeyTemplate field doesn't support toggle.
  if (fieldId === 'traceKeyTemplate') return false;

  // for below fields,
  // the whole adaptor is not yet supported (except for native REST)
  // TODO: we will not need all these conditions once all fields/adaptors support AFE2
  const isStandaloneImport = inferResourceType(adaptorType) === 'imports' && isStandaloneResource;

  if (
    ((fieldId === 'idLockTemplate' || fieldId === 'dataURITemplate') && !isStandaloneImport) ||
    fieldId?.includes('once')
  ) {
    if (['RESTImport', 'RESTExport'].includes(adaptorType)) {
      return isHTTP;
    }

    return true;
  }

  // AFE 1/2 toggle is shown for paging fields
  if (PAGING_FIELD_IDS.includes(fieldId)) {
    return true;
  }
  // root level fields with paging configured should show AFE 1/2 toggle
  const isPagingMethodConfigured = !!(isOldRestResource ? resource?.rest?.pagingMethod : resource?.http?.paging?.method);
  // irrespective of paging, AFE 2.0 is not supported a native rest adaptor
  const isNativeRestAdaptor = ['RESTImport', 'RESTExport'].includes(adaptorType) && !isHTTP;

  if (
    isPagingMethodConfigured &&
    !isNativeRestAdaptor &&
    ['http.relativeURI', 'http.body', 'rest.relativeURI', 'rest.postBody'].includes(fieldId)
  ) {
    return true;
  }

  // no AFE1/2 is shown for PG/Standalone export (with some exceptions)
  if (isPageGenerator || isStandaloneResource) {
    return false;
  }

  // AFE 2.0 not supported for Native REST Adaptor for any fields
  if (['RESTImport', 'RESTExport'].includes(adaptorType)) {
    return isHTTP;
  }

  return [
    'HTTPImport',
    'HTTPExport',
    'FTPImport',
    'FTPExport',
    'AS2Import',
    'AS2Export',
    'VANImport',
    'VANExport',
    'S3Import',
    'S3Export',
    'RDBMSImport',
    'RDBMSExport',
    'MongodbImport',
    'MongodbExport',
    'DynamodbImport',
    'DynamodbExport',
    'SalesforceImport',
    'SalesforceExport',
    'NetSuiteImport',
    'NetSuiteExport',
  ].includes(adaptorType);
}

export default {
  init: props => {
    const {
      options,
      resource,
      fieldState,
      connection,
      isPageGenerator,
      isStandaloneResource,
      formValues,
      ...rest
    } = props;
    const { fieldId, paramIndex } = options;
    const { type, value, arrayIndex } = fieldState || {};
    let rule = value;

    if (
      type === 'relativeuri' ||
      type === 'httprequestbody' ||
      type === 'sqlquerybuilder'
    ) {
      // below formatting applies for only relative URI, body and sql fields
      const formattedRule =
        typeof arrayIndex === 'number' && Array.isArray(value)
          ? value[arrayIndex]
          : value || '';

      rule =
        typeof formattedRule === 'string'
          ? formattedRule
          : JSON.stringify(formattedRule, null, 2);
    } else if (type === 'soqlquery') {
      rule = value?.query;
    }

    const editorSupportsV1V2data = _editorSupportsV1V2data({
      resource,
      fieldId,
      connection,
      isPageGenerator,
      isStandaloneResource,
    });
    let v1Rule;
    let v2Rule;

    if (editorSupportsV1V2data) {
      v1Rule = rule;
      v2Rule = rule;
    }

    const connectionMediaType =
      connection?.type === 'http'
        ? connection?.http?.mediaType
        : connection?.rest?.mediaType;
    const contentType =
      fieldState?.options?.contentType ||
      fieldState?.contentType ||
      connectionMediaType;
    let resultMode;

    if (
      fieldState?.type !== 'httprequestbody' &&
      fieldState?.id !== 'webhook.successBody'
    ) {
      resultMode = 'text';
    } else if (fieldId === 'file.xml.body') {
      resultMode = 'xml';
    } else if (fieldId === 'file.json.body') {
      resultMode = 'json';
    } else {
      resultMode = contentType;
    }
    if (GRAPHQL_JSON_FIELDS.includes(fieldId)) resultMode = 'json';

    if (fieldId === 'assistantMetadata.queryParams') {
      rule = fieldState.value[Object.keys(fieldState.value)[paramIndex]];
    } else if (
      fieldId === 'oauth2.token.headers' ||
      fieldId === 'oauth2.revoke.headers' ||
      fieldId === 'oauth2.refresh.headers'
    ) {
      rule = fieldState.value[paramIndex]?.value;
    }

    return {
      ...options,
      rule: options.rule || rule, // if rule was already passed in options, use that first
      editorSupportsV1V2data,
      resultMode,
      editorTitle: _constructEditorTitle(fieldState?.label),
      v1Rule,
      v2Rule,
      ...rest,
    };
  },
  requestBody: editor => ({
    rules: { strict: !!editor.strict, template: editor.rule },
    data: JSON.parse(editor.data),
  }),
  validate: ({ data }) => ({
    dataError: !data
      ? 'Must provide some sample data.'
      : typeof data === 'string' && util.validateJsonString(data),
  }),
  processResult: ({ resultMode }, result) => {
    const { data, ...rest } = result;

    if (data) {
      if (resultMode === 'json') {
        try {
          JSON.parse(data);
        } catch (e) {
          return {
            data,
            warning: `Evaluated result is not valid JSON. ${e.message || ''}`,
            ...rest,
          };
        }
      } else if (resultMode === 'xml') {
        const xmldoc = new DOMParser().parseFromString(data, 'text/xml');
        const parseError = xmldoc.getElementsByTagName('parsererror');

        if (parseError?.length) {
          const errorText = parseError[0].childNodes?.[1]?.textContent || '';

          return {
            data,
            warning: `Evaluated result is not valid XML. ${errorText}`,
            ...rest,
          };
        }
      }
    }

    return result;
  },
  getChatOptions: () => ({
    enabled: true,
    placeholder:
      'Describe in detail what you would like me to do. I can also make changes to your template for you',
    request: {
      model: 'gpt-3.5-turbo',
      temperature: 0,
      top_p: 1,
      max_tokens: 512,
      messages: [
        {
          role: 'system',
          content: `You are an assistant tasked to build valid, handlebar templates that typically generate a valid json object. 
 These templates include handlebar placeholders that reference fields from the sample record data provided below.`,
        },
        {
          role: 'user',
          content: `Only give valid handlebar templates. 
 Do not output any explanations.
 use whitespace to format your output in a readable way.
 Assume any handlebar placeholders reference fields from the sample record data provided below.
 Always add to the existing template, unless told to replace it.`,
        },
        {
          role: 'user',
          content: `Restrict all handlebar helpers to the following list:
${handlebarHelpersList}`,
        },
        {
          role: 'user',
          content: `generate a json object template with the following fields: age, id, name. 
 The values of these fields are placeholders.`,
        },
        {
          role: 'assistant',
          content: `{
  "age": {{age}}, 
  "id": {{id}},
  "name": {{name}} 
}`,
        },
      ],
    },
  }),

  validateChatResponse: (editor, response) => {
    const isValid = typeof response === 'string' && response.length;

    if (isValid) {
      return { isValid, parsedResponse: response };
    }

    return {
      isValid,
      validationErrors: [
        'Celigo chat returned the following invalid template:',
        response,
      ],
    };
  },
};
