import HandlebarsWithDefaultEditor from '../HandlebarsWithDefault';

export default function SqlQueryBuilderEditor(props) {
  const { rule, editorId, layout = 'compact', sampleData, defaultData } = props;

  return (
    <HandlebarsWithDefaultEditor
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
