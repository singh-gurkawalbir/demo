import HandlebarsWithDefaultEditor from '../HandlebarsWithDefault';

export default function SqlQueryBuilderEditor(props) {
  const { rule, editorId, sampleData, defaultData, result, ...other } = props;

  return (
    <HandlebarsWithDefaultEditor
      editorId={editorId}
      {...other}
      rule={rule}
      defaultData={defaultData}
      sampleData={sampleData}
      processor="sqlQueryBuilder"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      ruleTitle="Template"
      resultTitle="Preview"
    />
  );
}
