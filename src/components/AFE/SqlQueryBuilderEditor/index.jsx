import HandlebarsWithDefaultEditor from '../HandlebarsWithDefault';
import * as completers from '../editorSetup/completers';

export default function SqlQueryBuilderEditor(props) {
  const {
    rule,
    editorId,
    disabled,
    lookups,
    layout = 'compact',
    sampleData,
    defaultData,
  } = props;
  const _lookups = lookups && Array.isArray(lookups) ? lookups : [];

  completers.handleBarsCompleters.setLookupCompleter(_lookups);

  return (
    <HandlebarsWithDefaultEditor
      disabled={disabled}
      editorId={editorId}
      rule={rule}
      defaultData={defaultData}
      sampleData={sampleData}
      layout={layout}
      // override the default implementation for layout
      // templateClassName={}
      processor="sqlQueryBuilder"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      ruleTitle="Template"
      resultTitle="Preview"
      showDefaultData
    />
  );
}
