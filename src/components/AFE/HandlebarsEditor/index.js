import { useEffect, useCallback } from 'react';
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
    ruleTitle,
    resultTitle,
    dataTitle,
    resultMode,
    dataMode,
    ruleMode,
    disabled,
    enableAutocomplete,
    lookups = [],
  } = props;
  const { template, data, result, error, initChangeIdentifier } = useSelector(
    state => selectors.editor(state, editorId)
  );
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
  const dispatch = useDispatch();
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
        autoEvaluate: true,
        autoEvaluateDelay: 500,
        template: props.rule,
        data: props.data,
      })
    );
    // get Helper functions when the editor initializes
    dispatch(actions.editor.refreshHelperFunctions());
  }, [dispatch, editorId, props.data, props.rule, props.strict]);
  const handlePreview = () => {
    dispatch(actions.editor.evaluateRequest(editorId));
  };

  return (
    <Editor
      changeIdentifier={initChangeIdentifier}
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
      ruleTitle={ruleTitle}
      resultTitle={resultTitle}
      violations={violations}
      rule={template}
      dataTitle={dataTitle}
      data={data}
      result={result ? result.data : ''}
      error={error}
      enableAutocomplete={enableAutocomplete}
    />
  );
}
