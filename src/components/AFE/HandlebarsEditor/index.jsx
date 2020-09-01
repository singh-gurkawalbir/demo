import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../GenericEditor';

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
    lookups = [],
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
  } = useSelector(state => selectors.editor(state, editorId));
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const handlebarHelperFunction = useSelector(state =>
    selectors.editorHelperFunctions(state)
  );

  completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);
  const _lookups = Array.isArray(lookups) ? lookups : [];

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
  const handleRuleChange = rule => {
    if (editorVersion === 2) {
      dispatch(actions.editor.patch(editorId, { v2template: rule }));
    } else {
      dispatch(actions.editor.patch(editorId, { v1template: rule }));
    }
  };

  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  const handleInit = useCallback(() => {
    const initTempate = editorVersion === 2 ? v2template : v1template;

    dispatch(
      actions.editor.init(editorId, 'handlebars', {
        strict: props.strict,
        autoEvaluateDelay: 500,
        template: initTempate || (typeof rule === 'string' ? rule : JSON.stringify(rule, null, 2)),
        _init_template: rule,
        data: props.data,
        isSampleDataLoading: props.isSampleDataLoading,
        v1template,
        v2template,
      })
    );
    // get Helper functions when the editor initializes
    dispatch(actions.editor.refreshHelperFunctions());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorVersion, dispatch, editorId, props.strict, props.data, props.isSampleDataLoading, rule]);
  const handlePreview = () => {
    dispatch(actions.editor.evaluateRequest(editorId));
  };

  const resultTitle = useMemo(
    () =>
      autoEvaluate
        ? 'Evaluated handlebar template'
        : 'Click run to see your handlebar template evaluated here!',
    [autoEvaluate]
  );

  return (
    <Editor
      disabled={disabled}
      editorId={editorId}
      handleInit={handleInit}
      handleRuleChange={handleRuleChange}
      handlePreview={handlePreview}
      handleDataChange={handleDataChange}
      processor="handlebars"
      ruleMode={ruleMode}
      dataMode={dataMode}
      resultMode={resultMode}
      layout={layout}
      templateClassName={templateClassName}
      ruleTitle="Type your handlebar template here"
      dataTitle="Resources available in your template."
      resultTitle={resultTitle}
      violations={violations}
      rule={template}
      data={data}
      result={result ? result.data : ''}
      error={error}
      enableAutocomplete={enableAutocomplete}
      isSampleDataLoading={isSampleDataLoading}
    />
  );
}
