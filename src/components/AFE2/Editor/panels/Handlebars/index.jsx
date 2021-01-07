import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import * as completers from '../../../../AFE/editorSetup/completers';
import CodePanel from '../Code';
import useFormContext from '../../../../Form/FormContext';
import lookupUtil from '../../../../../utils/lookup';

export default function HandlebarsPanel({ editorId, mode = 'handlebars', enableAutocomplete = true }) {
  const dispatch = useDispatch();
  const {resourceType, formKey, resourceId, rule, lastValidData, error, errorLine} = useSelector(state => {
    const e = selectors._editor(state, editorId);

    return {resourceType: e.resourceType,
      formKey: e.formKey,
      resourceId: e.resourceId,
      rule: e.rule,
      lastValidData: e.lastValidData,
      error: e.error,
      errorLine: e.errorLine,
    };
  }, shallowEqual);
  const adaptorType = useSelector(state => {
    const { merged: resourceData} = selectors.resourceData(state, resourceType, resourceId);

    return resourceData?.adaptorType;
  });
  const formContext = useFormContext(formKey);
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));

  const handlebarHelperFunction = useSelector(state =>
    selectors._editorHelperFunctions(state), shallowEqual
  );

  completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);

  const lookups = useMemo(() => resourceType === 'imports' &&
    lookupUtil.getLookupFromFormContext(formContext, adaptorType),
  [adaptorType, formContext, resourceType]);

  const _lookups = useMemo(() => Array.isArray(lookups) ? lookups : [], [lookups]);

  completers.handleBarsCompleters.setLookupCompleter(_lookups);
  useEffect(() => {
    completers.handleBarsCompleters.setJsonCompleter(lastValidData);
  }, [lastValidData]);

  const handleChange = useCallback(newRule => {
    dispatch(actions._editor.patchRule(editorId, newRule));
  }, [dispatch, editorId]);

  return (
    <CodePanel
      name="rule"
      value={rule}
      mode={mode}
      readOnly={disabled}
      onChange={handleChange}
      enableAutocomplete={enableAutocomplete}
      errorLine={errorLine}
      hasError={error}
    />
  );
}
