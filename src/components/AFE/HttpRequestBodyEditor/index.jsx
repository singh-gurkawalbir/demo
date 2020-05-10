import HandlebarsEditor from '../HandlebarsEditor';

export default function HttpRequestBodyEditor(props) {
  const {
    editorId,
    defaultRule,
    disabled,
    contentType,
    layout = 'compact',
    rule,
    data,
    lookups,
    isSampleDataLoading = false,
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
      defaultRule={defaultRule}
      enableAutocomplete
      isSampleDataLoading={isSampleDataLoading}
    />
  );
}
