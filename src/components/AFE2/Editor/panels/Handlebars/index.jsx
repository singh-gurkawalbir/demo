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
    dataVersion,
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
    if (dataVersion === 2) {
      dispatch(actions._editor.patch(editorId, { rule: newRule, v2Rule: newRule }));
    } else {
      dispatch(actions._editor.patch(editorId, { rule: newRule, v1Rule: newRule }));
    }
  }, [dispatch, editorId, dataVersion]);

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
