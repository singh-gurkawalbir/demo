import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../SqlQueryEditor';

export default function HandlebarsWithDefaults(props) {
  const { editorId, ruleTitle, resultTitle, ...other } = props;
  const {
    template,
    sampleData,
    defaultData,
    result,
    error,
    violations,
  } = useSelector(state => {
    const editor = selectors.editor(state, editorId);
    // update directly to the completers
    const jsonData = editor.data;
    const helperFunctions = selectors.editorHelperFunctions(state);

    completers.handleBarsCompleters.setCompleters(jsonData, helperFunctions);

    return editor;
  });
  const dispatch = useDispatch();
  const handleChange = (field, value) => {
    dispatch(actions.editor.patch(editorId, { [field]: value }));
  };

  const handleInit = () => {
    dispatch(
      actions.editor.init(editorId, 'handlebars', {
        props: props.strict,
        autoEvaluate: true,
        autoEvaluateDelay: 300,
        template: props.rule,
        defaultData: props.defaultData,
        sampleData: props.sampleData,
      })
    );
    // get Helper functions when the editor intializes
    dispatch(actions.editor.refreshHelperFunctions());
  };

  return (
    <Editor
      editorId={editorId}
      {...other}
      handleInit={handleInit}
      handleChange={handleChange}
      processor="sqlQueryBuilder"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      ruleTitle={ruleTitle}
      resultTitle={resultTitle}
      violations={violations}
      rule={template}
      sampleData={sampleData}
      defaultData={defaultData}
      result={result ? result.data : ''}
      error={error && error.message}
      enableAutocomplete
    />
  );
}
