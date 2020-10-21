import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../GenericEditor';

const emptyArr = [];

export default function HandlebarsEditor(props) {
  const {
    editorId,
    layout,
    templateClassName,
    resultMode,
    dataMode,
    ruleMode,
    disabled,
    enableAutocomplete,
    lookups = emptyArr,
    rule,
    editorVersion,
  } = props;
  const dispatch = useDispatch();
  const {
    template,
    data,
    result,
    error,
    autoEvaluate,
    isSampleDataLoading,
    v1template,
    v2template,
  } = useSelector(state => selectors.editor(state, editorId), shallowEqual);
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId), shallowEqual
  );
  const handlebarHelperFunction = useSelector(state =>
    selectors.editorHelperFunctions(state), shallowEqual
  );

  completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);
  const _lookups = useMemo(() => Array.isArray(lookups) ? lookups : [], [lookups]);

  completers.handleBarsCompleters.setLookupCompleter(_lookups);
  useEffect(() => {
    completers.handleBarsCompleters.setJsonCompleter(data);
  }, [data]);

  useEffect(() => {
    if (props.isSampleDataLoading !== isSampleDataLoading) {
      dispatch(
        actions.editor.patch(editorId, {
          isSampleDataLoading: props.isSampleDataLoading,
        })
      );
    }
  }, [dispatch, editorId, isSampleDataLoading, props.isSampleDataLoading]);
  const handleRuleChange = useCallback(newRule => {
    if (editorVersion === 2) {
      dispatch(actions.editor.patch(editorId, { template: newRule, v2template: newRule }));
    } else {
      dispatch(actions.editor.patch(editorId, { template: newRule, v1template: newRule }));
    }
  }, [dispatch, editorId, editorVersion]);

  const handleDataChange = useCallback(data => {
    dispatch(actions.editor.patch(editorId, { data }));
  }, [dispatch, editorId]);

  const handleInit = useCallback(() => {
    let template = editorVersion === 2 ? v2template : v1template;

    if (!template) {
      template = typeof rule === 'string' ? rule : JSON.stringify(rule, null, 2);
    }

    dispatch(
      actions.editor.init(editorId, 'handlebars', {
        strict: props.strict,
        autoEvaluateDelay: 500,
        template,
        _init_template: rule,
        data: props.data,
        isSampleDataLoading: props.isSampleDataLoading,
        v1template,
        v2template,
        mode: resultMode,
      })
    );
    // get Helper functions when the editor initializes
    dispatch(actions.editor.refreshHelperFunctions());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorVersion, dispatch, editorId, props.strict, props.data, props.isSampleDataLoading, rule]);

  return (
    <Editor
      disabled={disabled}
      editorId={editorId}
      handleInit={handleInit}
      handleRuleChange={handleRuleChange}
      handleDataChange={handleDataChange}
      processor="handlebars"
      ruleMode={ruleMode}
      dataMode={dataMode}
      resultMode={resultMode}
      layout={layout}
      templateClassName={templateClassName}
      ruleTitle="Type your handlebars template here"
      dataTitle="Resources available in your handlebars template"
      resultTitle={autoEvaluate ? 'Evaluated handlebars template' : 'Click preview to evaluate your handlebars template'}
      violations={violations}
      rule={template}
      data={data}
      result={result?.data || ''}
      error={error}
      resultWarning={result?.warning}
      enableAutocomplete={enableAutocomplete}
      isSampleDataLoading={isSampleDataLoading}
    />
  );
}
