import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import Editor from '../GenericEditor';

export default function MergeEditor(props) {
  const { editorId, layout = 'column', disabled } = props;
  const { data, result, rule, error } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const dispatch = useDispatch();
  const handleRuleChange = rule => {
    dispatch(actions.editor.patch(editorId, { rule }));
  };

  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'merge', {
        rule: props.rule,
        data: props.data,
      })
    );
  }, [dispatch, editorId, props.data, props.rule]);
  const parsedResult =
    result && result.data ? JSON.stringify(result.data[0], null, 2) : '';

  return (
    <Editor
      data={data}
      rule={rule}
      error={error}
      violations={violations}
      result={parsedResult}
      disabled={disabled}
      processor="merge"
      ruleMode="json"
      layout={layout}
      dataMode="json"
      resultMode="json"
      handleRuleChange={handleRuleChange}
      handleDataChange={handleDataChange}
      handleInit={handleInit}
      ruleTitle="Default object"
      dataTitle="Merge target"
      resultTitle="Final object"
    />
  );
}
