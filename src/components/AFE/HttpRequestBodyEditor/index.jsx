import HandlebarsEditor from '../HandlebarsEditor';

export default function HttpRequestBodyEditor(props) {
  const {
    editorId,
    disabled,
    contentType,
    layout = 'compact',
    rule,
    resultTitle,
    dataTitle,
    ruleTitle,
    data,
    lookups,
  } = props;
  const mode = contentType || 'json';

  return (
    <HandlebarsEditor
      editorId={editorId}
      rule={rule}
      data={data}
      lookups={lookups}
      disabled={disabled}
      strict={false}
      ruleMode="handlebars"
      dataMode="json"
      layout={layout}
      resultMode={mode}
      ruleTitle={ruleTitle || `HTTP Body Template (${mode})`}
      dataTitle={dataTitle || 'Data'}
      resultTitle={resultTitle || 'Final HTTP Body'}
      enableAutocomplete
    />
  );
}
