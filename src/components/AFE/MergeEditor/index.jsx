import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from '../GenericEditor';

export default function MergeEditor(props) {
  const { editorId, layout = 'column' } = props;
  const { data, result, rule, error, violations } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  // const parsedData = result && result.data && result.data[0];
  const dispatch = useDispatch();
  const handleRuleChange = rule => {
    dispatch(actions.editor.patch(editorId, { rule }));
  };

  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  const handleInit = () => {
    dispatch(
      actions.editor.init(editorId, 'merge', {
        rule: props.rule,
        data: props.data,
      })
    );
  };

  return (
    <Editor
      data={data}
      rule={rule}
      error={error}
      violations={violations}
      result={result && result.data ? result.data[0] : ''}
      processor="merge"
      ruleMode="json"
      layout={layout}
      dataMode="json"
      resultMode="json"
      handleRuleChange={handleRuleChange}
      handleDataChange={handleDataChange}
      handleInit={handleInit}
      ruleTitle="Default Object"
      dataTitle="Merge Target"
      resultTitle="Final Object"
    />
  );
}
