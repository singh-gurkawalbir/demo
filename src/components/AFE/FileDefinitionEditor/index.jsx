import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from '../GenericEditor';

export default function FileDefinitionEditor(props) {
  const { rule, data, editorId, result, ...other } = props;
  const parsedData = result && result.data;
  const { ...editor } = useSelector(state => selectors.editor(state, editorId));
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
        rule,
        data,
      })
    );
  };

  return (
    <Editor
      result={parsedData}
      handleInit={handleInit}
      handleDataChange={handleDataChange}
      handleRuleChange={handleRuleChange}
      {...editor}
      {...other}
      processor="structuredFileParser"
      ruleMode="json"
      dataMode="text"
      resultMode="json"
      ruleTitle="File definition rules"
      dataTitle="Available resources"
      resultTitle="Generated export"
    />
  );
}
