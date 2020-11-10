import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../GenericEditor';

const emptyArr = [];

export default function _HandlebarsEditor_(props) {
  const {
    editorId,
    layout,
    templateClassName,
    dataMode,
    ruleMode,
    disabled,
    enableAutocomplete,
    lookups = emptyArr,
  } = props;
  const dispatch = useDispatch();
  const {
    rule,
    data,
    result,
    error,
    autoEvaluate,
    initStatus,
    resultMode,
    dataVersion,
  } = useSelector(state => selectors._editor(state, editorId), shallowEqual);
  const violations = useSelector(state =>
    selectors._editorViolations(state, editorId), shallowEqual
  );
  const handlebarHelperFunction = useSelector(state =>
    selectors._editorHelperFunctions(state), shallowEqual
  );

  completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);
  const _lookups = useMemo(() => Array.isArray(lookups) ? lookups : [], [lookups]);

  completers.handleBarsCompleters.setLookupCompleter(_lookups);
  useEffect(() => {
    completers.handleBarsCompleters.setJsonCompleter(data);
  }, [data]);

  const handleRuleChange = useCallback(newRule => {
    if (dataVersion === 2) {
      dispatch(actions._editor.patch(editorId, { rule: newRule, v2Rule: newRule }));
    } else {
      dispatch(actions._editor.patch(editorId, { rule: newRule, v1Rule: newRule }));
    }
  }, [dispatch, editorId, dataVersion]);

  const handleDataChange = useCallback(data => {
    dispatch(actions._editor.patch(editorId, { data }));
  }, [dispatch, editorId]);

  return (
    <Editor
      disabled={disabled}
      editorId={editorId}
      handleRuleChange={handleRuleChange}
      handleDataChange={handleDataChange}
      ruleMode={ruleMode}
      dataMode={dataMode}
      resultMode={resultMode}
      layout={layout}
      templateClassName={templateClassName}
      ruleTitle="Type your handlebars template here"
      dataTitle="Resources available for your handlebars template"
      resultTitle={autoEvaluate ? 'Evaluated handlebars template' : 'Click preview to evaluate your handlebars template'}
      violations={violations}
      rule={rule}
      data={data && JSON.parse(data)}
      result={result?.data || ''}
      error={error}
      resultWarning={result?.warning}
      enableAutocomplete={enableAutocomplete}
      isSampleDataLoading={initStatus === 'requested'}
    />
  );
}
