import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from '../GenericEditor';

export default function FileDefinitionEditor(props) {
  const { editorId, layout = 'column' } = props;
  const { rule, data, result, error, violations } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const dispatch = useDispatch();
  const handleRuleChange = rule => {
    dispatch(actions.editor.patch(editorId, { rule }));
  };

  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  const handleInit = () => {
    dispatch(
      actions.editor.init(props.editorId, 'structuredFileParser', {
        rule: props.rule,
        data: props.data,
      })
    );
  };

  return (
    <Editor
      handleInit={handleInit}
      handleDataChange={handleDataChange}
      handleRuleChange={handleRuleChange}
      rule={rule}
      data={data}
      result={result ? result.data : ''}
      violations={violations}
      error={error}
      processor="structuredFileParser"
      layout={layout}
      ruleMode="json"
      dataMode="text"
      resultMode="json"
      ruleTitle="File definition rules"
      dataTitle="Available resources"
      resultTitle="Generated export"
    />
  );
}
