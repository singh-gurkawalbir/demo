import util from '../../../../utils/json';

/* this util is used to read field label and generate editor title from it
* eg, label = 'Build HTTP request body', editor title would be same i.e. 'Build HTTP request body'
* label = 'HTTP body', editor title would be 'Build HTTP body'
* label = 'Relative URI', editor title would be 'Build relative URI'
*/
function _constructEditorTitle(label) {
  if (!label) return label;
  const regexp = /^[A-Z]{2}/;

  if (label.startsWith('Build')) {
    return label;
  } if (regexp.test(label)) {
    // first 2 chars are uppercase so don't convert to lowercase
    return `Build ${label}`;
  }

  return `Build ${label[0].toLowerCase()}${label.slice(1)}`;
}
function _editorSupportsV1V2data({resource, fieldId, connection, isPageGenerator}) {
  if (fieldId === '_query') {
    // we dont get whole resource object in case of rdbms lookup query so
    // change this to true when lookup query supports toggle in future
    return false;
  }
  // lookup fields dont support toggle yet
  if (fieldId === '_body' || fieldId === '_relativeURI') return false;

  // for below fields,
  // the whole adaptor is not yet supported (except for native REST)
  // TODO: we will not need all these conditions once all fields/adaptors support AFE2
  if (fieldId === 'idLockTemplate' ||
  fieldId === 'dataURITemplate' ||
  fieldId?.includes('once')) {
    if (['RESTImport', 'RESTExport'].includes(resource.adaptorType)) {
      return connection.isHTTP;
    }

    return true;
  }

  // no AFE1/2 is shown for PG export (with some exceptions)
  if (isPageGenerator) {
    return false;
  }

  // AFE 2.0 not supported for Native REST Adaptor for any fields
  if (['RESTImport', 'RESTExport'].includes(resource.adaptorType)) {
    return connection.isHTTP;
  }

  return [
    'HTTPImport',
    'HTTPExport',
    'FTPImport',
    'FTPExport',
    'AS2Import',
    'AS2Export',
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
  ].includes(resource.adaptorType);
}

export default {
  init: props => {
    const {options, resource, fieldState, connection, isPageGenerator, formValues, ...rest} = props;
    const {fieldId} = options;
    const {type, value, arrayIndex} = fieldState;
    let rule = value;

    if (type === 'relativeuri' || type === 'httprequestbody' || type === 'sqlquerybuilder') {
    // below formatting applies for only relative URI, body and sql fields
      const formattedRule = typeof arrayIndex === 'number' && Array.isArray(value) ? value[arrayIndex] : value;

      rule = typeof formattedRule === 'string' ? formattedRule : JSON.stringify(formattedRule, null, 2);
    } else if (type === 'soqlquery') {
      rule = value?.query;
    }

    const editorSupportsV1V2data = _editorSupportsV1V2data({resource, fieldId, connection, isPageGenerator});
    let v1Rule;
    let v2Rule;

    if (editorSupportsV1V2data) {
      v1Rule = rule;
      v2Rule = rule;
    }

    const connectionMediaType = connection?.type === 'http' ? connection?.http?.mediaType : connection?.rest?.mediaType;
    const contentType = fieldState?.options?.contentType || fieldState?.contentType || connectionMediaType;
    let resultMode;

    if (fieldState?.type !== 'httprequestbody') {
      resultMode = 'text';
    } else {
      resultMode = contentType === 'json' ? 'json' : 'xml';
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
  validate: ({data}) => ({
    dataError: !data
      ? 'Must provide some sample data.'
      : typeof data === 'string' && util.validateJsonString(data),
  }),
  processResult: ({resultMode}, result) => {
    const {data, ...rest} = result;

    if (data) {
      if (resultMode === 'json') {
        try {
          JSON.parse(data);
        } catch (e) {
          return {data, warning: `Evaluated result is not valid JSON. ${e.message || ''}`, ...rest};
        }
      } else if (resultMode === 'xml') {
        const xmldoc = new DOMParser().parseFromString(data, 'text/xml');
        const parseError = xmldoc.getElementsByTagName('parsererror');

        if (parseError?.length) {
          const errorText = parseError[0].childNodes?.[1]?.textContent || '';

          return {data, warning: `Evaluated result is not valid XML. ${errorText}`, ...rest};
        }
      }
    }

    return result;
  },
};
