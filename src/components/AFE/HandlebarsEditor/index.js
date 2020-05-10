import { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
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
  } = props;
  const dispatch = useDispatch();
  const {
    template,
    data,
    result,
    error,
    autoEvaluate,
    isSampleDataLoading,
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
    dispatch(
      actions.editor.patch(editorId, {
        sampleRule: props.sampleRule,
      })
    );
  }, [dispatch, editorId, props.sampleRule]);

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
    dispatch(actions.editor.patch(editorId, { template: rule }));
  };

  const handleDataChange = data => {
    dispatch(actions.editor.patch(editorId, { data }));
  };

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'handlebars', {
        strict: props.strict,
        autoEvaluateDelay: 500,
        template: props.rule ? props.rule : props.defaultRule,
        initTemplate: props.rule,
        data: props.data,
        isSampleDataLoading: props.isSampleDataLoading,
      })
    );
    // get Helper functions when the editor initializes
    dispatch(actions.editor.refreshHelperFunctions());
  }, [
    dispatch,
    editorId,
    props.data,
    props.defaultRule,
    props.isSampleDataLoading,
    props.rule,
    props.strict,
  ]);
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
