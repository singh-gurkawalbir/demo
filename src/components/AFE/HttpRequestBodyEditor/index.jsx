import HandlebarsEditor from '../HandlebarsEditor';
import * as completers from '../editorSetup/completers';

export default function HttpRequestBodyEditor(props) {
  const {
    editorId,
    disabled,
    contentType,
    layout = 'compact',
    rule,
    data,
    lookups,
  } = props;
  const mode = contentType || 'json';

  if (lookups && lookups.length) {
    completers.handleBarsCompleters.setLookupCompleter(lookups);
  }

  return (
    <HandlebarsEditor
      editorId={editorId}
      rule={rule}
      data={data}
      disabled={disabled}
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
