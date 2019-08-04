import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import Editor from '../SqlHandlebarsEditor';

export default function SqlQueryBuilderEditor(props) {
  const { rule, editorId, sampleData, defaultData, result, ...other } = props;
  const parsedData = result || '';
  const { ...editor } = useSelector(state => selectors.editor(state, editorId));

  return (
    <Editor
      editorId={editorId}
      result={parsedData}
      {...editor}
      {...other}
      rule={rule}
      sampleData={sampleData}
      defaultData={defaultData}
      processor="sqlQueryBuilder"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      ruleTitle="Template"
      dataTitle=""
      resultTitle="Preview"
      enableAutocomplete
    />
  );
}
