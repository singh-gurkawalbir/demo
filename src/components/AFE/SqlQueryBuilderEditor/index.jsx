import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../SqlQueryEditor';

export default function SqlQueryBuilderEditor(props) {
  const { rule, editorId, sampleData, defaultData, result, ...other } = props;
  const { ...editor } = useSelector(state => selectors.editor(state, editorId));
  const stateToPropsObj = useSelector(state => {
    const editor = selectors.editor(state, props.editorId);
    // update directly to the completers
    const jsonData = editor.data;
    const helperFunctions = selectors.editorHelperFunctions(state);

    completers.handleBarsCompleters.setCompleters(jsonData, helperFunctions);

    return {
      rule: editor.template,
      errorrule: editor.template,
      sampleData: editor.sampleData,
      defaultData: editor.defaultData,
      result: editor.result ? editor.result.data : '',
      error: editor.error && editor.error.message,
      violations: editor.violations,
    };
  });
  const dispatch = useDispatch();
  const handleRuleChange = rule => {
    dispatch(actions.editor.patch(props.editorId, { template: rule }));
  };

  const handleSampleDataChange = data => {
    dispatch(
      actions.editor.patch(props.editorId, {
        sampleData: data,
      })
    );
  };

  const handleDefaultDataChange = data => {
    dispatch(
      actions.editor.patch(props.editorId, {
        defaultData: data,
      })
    );
  };

  const handleInit = () => {
    dispatch(
      actions.editor.init(props.editorId, 'handlebars', {
        strict: props.strict,
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
      {...editor}
      {...other}
      handleInit={handleInit}
      handleSampleDataChange={handleSampleDataChange}
      handleDefaultDataChange={handleDefaultDataChange}
      handleRuleChange={handleRuleChange}
      processor="sqlQueryBuilder"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      ruleTitle="Template"
      dataTitle=""
      resultTitle="Preview"
      violations={stateToPropsObj.violations}
      rule={stateToPropsObj.rule}
      sampleData={stateToPropsObj.sampleData}
      defaultData={stateToPropsObj.defaultData}
      result={stateToPropsObj.result}
      error={stateToPropsObj.error}
      enableAutocomplete
    />
  );
}
