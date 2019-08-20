import HandlebarsEditor from '../HandlebarsEditor';

export default function UrlEditor(props) {
  const { editorId, layout = 'column', rule, data } = props;

  return (
    <HandlebarsEditor
      editorId={editorId}
      processor="handlebars"
      rule={rule}
      data={data}
      layout={layout}
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      ruleTitle="Url Template"
      dataTitle="Sample Data"
      resultTitle="Evaluated Result"
      enableAutocomplete
    />
  );
}
