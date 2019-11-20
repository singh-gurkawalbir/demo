import HandlebarsEditor from '../HandlebarsEditor';
import * as completers from '../editorSetup/completers';

export default function UrlEditor(props) {
  const { editorId, lookups, layout = 'column', rule, data, disabled } = props;
  const _lookups = lookups && Array.isArray(lookups) ? lookups : [];

  completers.handleBarsCompleters.setLookupCompleter(_lookups);

  return (
    <HandlebarsEditor
      editorId={editorId}
      processor="handlebars"
      rule={rule}
      data={data}
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
