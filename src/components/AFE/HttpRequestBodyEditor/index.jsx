import HandlebarsEditor from '../HandlebarsEditor';

export default function HttpRequestBodyEditor(props) {
  const { editorId, contentType, layout = 'compact', rule, data } = props;
  const mode = contentType || 'json';

  return (
    <HandlebarsEditor
      editorId={editorId}
      rule={rule}
      data={data}
      strict={false}
      ruleMode="handlebars"
      dataMode="json"
      layout={layout}
      resultMode={mode}
      ruleTitle={`HTTP Body Template (${mode})`}
      dataTitle="Data"
      resultTitle="Final HTTP Body"
      enableAutocomplete
    />
  );
}
