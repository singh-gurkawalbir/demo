import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Editor from '../GenericEditor';
import { FILE_GENERATOR } from './constants';

export default function FileDefinitionEditor(props) {
  const { editorId, layout = 'column', processor, disabled } = props;
  const { rule, data, result, error } = useSelector(state =>
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

  let resultTitle;
  let dataMode;
  let resultMode;
  let dataTitle;

  if (processor === FILE_GENERATOR) {
    resultTitle = 'Generated file';
    dataTitle = 'Sample flow data';
    dataMode = 'json';
    resultMode = 'text';
  } else {
    resultTitle = 'Parsed output';
    dataTitle = 'Sample file';
    dataMode = 'text';
    resultMode = 'json';
  }

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, processor, {
        rule: props.rule,
        _init_rule: props.rule,
        data: props.data,
        _init_data: props.data,
        autoEvaluate: true,
      })
    );
  }, [dispatch, editorId, processor, props.data, props.rule]);

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
      processor={processor}
      layout={layout}
      ruleMode="json"
      dataMode={dataMode}
      resultMode={resultMode}
      ruleTitle="Type your file definition rules here"
      dataTitle={dataTitle}
      resultTitle={resultTitle}
      disabled={disabled}
    />
  );
}
