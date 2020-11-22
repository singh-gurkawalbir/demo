import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import * as completers from '../editorSetup/completers';
import Editor from '../SqlQueryEditor';

const { merge } = require('lodash');

export default function HandlebarsWithDefaults(props) {
  const {
    editorId,
    layout,
    showDefaultData,
    templateClassName,
    disabled,
    optionalSaveParams,
    editorVersion,
    rule,
  } = props;
  const dispatch = useDispatch();
  const { template, autoEvaluate, sampleData, defaultData, result, error, isSampleDataLoading, v1template,
    v2template, lookups } = useSelector(
    state => selectors.editor(state, editorId), shallowEqual
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId), shallowEqual
  );
  const handlebarHelperFunction = useSelector(state =>
    selectors.editorHelperFunctions(state), shallowEqual
  );

  completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);
  useEffect(() => {
    completers.handleBarsCompleters.setLookupCompleter(lookups || []);
  }, [lookups]);
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

  const handleDataChange = useCallback((field, newData) => {
    dispatch(actions.editor.patch(editorId, { [field]: newData}));
  }, [dispatch, editorId]);

  const handleInit = useCallback(() => {
    let template = editorVersion === 2 ? v2template : v1template;

    if (!template && rule) {
      template = typeof rule === 'string' ? rule : JSON.stringify(rule, null, 2);
    }
    dispatch(
      actions.editor.init(editorId, 'sql', {
        props: props.strict,
        autoEvaluateDelay: 300,
        template,
        _init_template: rule,
        defaultData: props.defaultData || '',
        sampleData: props.sampleData,
        v1template,
        v2template,
        isSampleDataLoading: props.isSampleDataLoading,
        lookups: props.lookups,
        optionalSaveParams,
      })
    );
    // get Helper functions when the editor initializes
    dispatch(actions.editor.refreshHelperFunctions());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorId, props.sampleData, props.defaultData]);

  useEffect(() => {
    if (props.lookups) {
      dispatch(
        actions.editor.patch(editorId, {
          lookups: props.lookups,
        })
      );
    }
  }, [dispatch, editorId, props.lookups]);

  return (
    <Editor
      editorId={editorId}
      handleInit={handleInit}
      handleRuleChange={handleRuleChange}
      handleDataChange={handleDataChange}
      disabled={disabled}
      processor="sql"
      ruleMode="handlebars"
      dataMode="json"
      resultMode="text"
      layout={layout}
      templateClassName={templateClassName}
      ruleTitle="Type your handlebars template here"
      dataTitle="Resources available for your handlebars template"
      resultTitle={autoEvaluate ? 'Evaluated handlebars template' : 'Click preview to evaluate your handlebars template'}
      violations={violations}
      showDefaultData={showDefaultData}
      rule={template}
      sampleData={sampleData}
      defaultData={defaultData || ''}
      result={result?.data || ''}
      error={error}
      enableAutocomplete
      isSampleDataLoading={isSampleDataLoading}
    />
  );
}
