import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import * as completers from '../../../../AFE/editorSetup/completers';
import CodePanel from '../Code';

export default function HandlebarsPanel({ editorId, mode = 'handlebars', disabled, lookups, enableAutocomplete = true }) {
  const dispatch = useDispatch();
  const {
    rule,
    lastValidData,
    error,
    errorLine,
  } = useSelector(state => selectors._editor(state, editorId), shallowEqual);

  const handlebarHelperFunction = useSelector(state =>
    selectors._editorHelperFunctions(state), shallowEqual
  );

  completers.handleBarsCompleters.setFunctionCompleter(handlebarHelperFunction);
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
