import util from '../../../../utils/json';

function _isEditorV2Supported({resource, fieldId, connection, isPageGenerator}) {
  if (fieldId === '_body' || fieldId === '_relativeURI') return false;

  // for below fields,
  // the whole adaptor is not yet supported (except for native REST)
  // TODO: we will not need all these conditions once all fields/adaptors support AFE2
  if (fieldId === 'idLockTemplate' ||
  fieldId === 'dataURITemplate' ||
  fieldId === 'http.once.relativeURI' ||
  fieldId === 'http.once.body') {
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

  // BE doesnt support oracle and snowflake adaptor yet
  // remove this check once same is added in BE
  if (connection?.rdbms?.type === 'oracle' || connection?.rdbms?.type === 'snowflake') {
    return false;
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
  ].includes(resource.adaptorType);
}

export default {
  getRule: ({fieldState}) => {
    const {value, arrayIndex} = fieldState;
    const formattedRule = Array.isArray(value) ? value[arrayIndex] : value;

    return typeof formattedRule === 'string' ? formattedRule : JSON.stringify(formattedRule, null, 2);
  },
  init: props => {
    const {options, resource, fieldState, connection, isPageGenerator} = props;
    const {rule, fieldId} = options;

    const isEditorV2Supported = _isEditorV2Supported({resource, fieldId, connection, isPageGenerator});
    let v1Rule;
    let v2Rule;

    if (isEditorV2Supported) {
      v1Rule = rule;
      v2Rule = rule;
    }

    const connectionMediaType = connection?.type === 'http' ? connection?.http?.mediaType : connection?.rest?.mediaType;
    const contentType = fieldState?.options?.contentType || fieldState?.contentType || connectionMediaType;
    const resultMode = contentType === 'json' ? 'json' : 'xml';

    return {
      ...options,
      isEditorV2Supported,
      resultMode,
      editorTitle: fieldState?.label,
      v1Rule,
      v2Rule,
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
