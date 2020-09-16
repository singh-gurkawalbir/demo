import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
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
    optionalSaveParams,
    sampleRule,
  } = props;
  const { template, sampleData, defaultData, result, error, isSampleDataLoading, lookups } = useSelector(
    state => selectors.editor(state, editorId)
  );
  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId)
  );
  const handlebarHelperFunction = useSelector(state =>
    selectors.editorHelperFunctions(state)
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

  const dispatch = useDispatch();
  const handleChange = (field, value) => {
    dispatch(actions.editor.patch(editorId, { [field]: value }));
  };

  const handleInit = useCallback(() => {
    dispatch(
      actions.editor.init(editorId, 'sql', {
        props: props.strict,
        autoEvaluateDelay: 300,
        template: props.rule || sampleRule,
        _init_template: props.rule,
        defaultData: props.defaultData || '',
        sampleData: props.sampleData,
        isSampleDataLoading: props.isSampleDataLoading,
        lookups: props.lookups,
        optionalSaveParams,
      })
    );
    // get Helper functions when the editor initializes
    dispatch(actions.editor.refreshHelperFunctions());
  }, [dispatch, editorId, optionalSaveParams, props.defaultData, props.isSampleDataLoading, props.lookups, props.rule, props.sampleData, props.strict, sampleRule]);

  useEffect(() => {
    if (props.lookups && !isEqual(props.lookups, lookups)) {
      dispatch(
        actions.editor.patch(editorId, {
          lookups: props.lookups,
        })
      );
    }
  }, [dispatch, editorId, isSampleDataLoading, lookups, props.isSampleDataLoading, props.lookups]);

  useEffect(() => {
    if (props.lookups && !isEqual(props.lookups, lookups)) {
      dispatch(
        actions.editor.patch(editorId, {
          lookups: props.lookups,
        })
      );
    }
  }, [dispatch, editorId, lookups, props.lookups]);

  useEffect(() => {
    if (template === undefined && sampleRule) {
      dispatch(
        actions.editor.patch(editorId, {
          template: sampleRule,
        })
      );
    }
  }, [dispatch, editorId, sampleRule, template]);

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
      isSampleDataLoading={isSampleDataLoading}
    />
  );
}
