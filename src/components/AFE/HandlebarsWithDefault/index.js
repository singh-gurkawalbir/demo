import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../SqlQueryEditor';

const { merge } = require('lodash');

export default function HandlebarsWithDefaults(props) {
  const {
    editorId,
    ruleTitle,
    layout,
    showDefaultData,
    templateClassName,
    resultTitle,
    disabled,
    lookups = [],
  } = props;
  const { template, sampleData, defaultData, result, error } = useSelector(
    state => selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const handlebarHelperFunction = useSelector(state =>
    selectors.editorHelperFunctions(state)
  );
  const _lookups = Array.isArray(lookups) ? lookups : [];

  completers.handleBarsCompleters.setLookupCompleter(_lookups);
  completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);
  useEffect(() => {
    if (!violations) {
      const jsonData = JSON.stringify(
        merge(
          {},
          defaultData ? JSON.parse(defaultData) : {},
          sampleData ? JSON.parse(sampleData) : {}
        )
      );

      completers.handleBarsCompleters.setJsonCompleter(jsonData);
    }
  }, [defaultData, sampleData, violations]);

  const dispatch = useDispatch();
  const handleChange = (field, value) => {
    dispatch(actions.editor.patch(editorId, { [field]: value }));
  };

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'sql', {
        props: props.strict,
        autoEvaluateDelay: 300,
        template: props.rule,
        initTemplate: props.rule,
        defaultData: props.defaultData || '',
        sampleData: props.sampleData,
      })
    );
    // get Helper functions when the editor initializes
    dispatch(actions.editor.refreshHelperFunctions());
  }, [
    dispatch,
    editorId,
    props.defaultData,
    props.rule,
    props.sampleData,
    props.strict,
  ]);

  return (
    <Editor
      editorId={editorId}
      handleInit={handleInit}
      handleChange={handleChange}
      disabled={disabled}
      processor="sql"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      layout={layout}
      templateClassName={templateClassName}
      ruleTitle={ruleTitle}
      resultTitle={resultTitle}
      violations={violations}
      showDefaultData={showDefaultData}
      rule={template}
      sampleData={sampleData}
      defaultData={defaultData || ''}
      result={result ? result.data : ''}
      error={error}
      enableAutocomplete
    />
  );
}
