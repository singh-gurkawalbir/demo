import HandlebarsEditor from '../HandlebarsEditor';

export default function UrlEditor(props) {
  const {
    editorId,
    lookups = [],
    layout = 'column',
    rule,
    data,
    disabled,
  } = props;

  return (
    <HandlebarsEditor
      editorId={editorId}
      processor="handlebars"
      rule={rule}
      data={data}
      lookups={lookups}
      disabled={disabled}
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
