import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import Suggestions from './Suggestions';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';

const DynaTextWithFlowSuggestion = props => {
  const {
    id,
    name,
    label,
    placeholder,
    isValid,
    description,
    errorMessages,
    disabled,
    multiline,
    resourceId,
    resourceType,
    required,
    value,
    onFieldChange,
    flowId,
    formContext,
    showLookup = true,
    showExtract = true,
    showSuggestionsWithoutHandlebar = false,
    skipExtractWrapOnSpecialChar = false,
  } = props;
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [cursorPosition, setCursorPosition] = useState(0);
  const [suggestionEnabled, setSuggestionEnabled] = useState(false);
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const sampleData = useSelector(
    state =>
      selectors.getSampleDataContext(state, {
        flowId,
        resourceId,
        resourceType,
        stage: 'flowInput',
      }).data
  );
  const handleUpdate = useCallback(
    newValue => {
      setCursorPosition(0);
      setSuggestionEnabled(false);
      onFieldChange(id, newValue);
    },
    [id, onFieldChange]
  );
  const handleCursorChange = useCallback(e => {
    const cursorIndex = e.target.selectionStart;

    setCursorPosition(cursorIndex);
    setSuggestionEnabled(true);
  }, []);
  const handleFieldChange = e => {
    const inpValue = e.target.value;

    onFieldChange(id, inpValue);
  };

  // close suggestions when clicked outside
  const handleClickOutside = event => {
    // TODO: check for better soln.
    if (document.getElementById('manageLookup')) {
      return;
    }

    if (ref.current && !ref.current.contains(event.target)) {
      setCursorPosition(0);
      setSuggestionEnabled(false);
    }
  };

  useEffect(() => {
    if (flowId && !sampleData && !isPageGenerator) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, isPageGenerator, resourceId, resourceType, sampleData]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return (
    <div ref={ref}>
      <TextField
        autoComplete="off"
        id={`text-${id}`}
        key={id}
        data-test={id}
        name={name}
        label={label}
        placeholder={placeholder}
        helperText={isValid ? description : errorMessages}
        disabled={disabled}
        multiline={multiline}
        error={!isValid}
        onChange={handleFieldChange}
        required={required}
        value={value}
        onClick={handleCursorChange}
        onKeyUp={handleCursorChange}
        variant="filled"
      />
      {suggestionEnabled && (showExtract || showLookup) && (
        <Suggestions
          id={`suggestions-${id}`}
          onFieldChange={onFieldChange}
          resourceId={resourceId}
          flowId={flowId}
          formContext={formContext}
          resourceType={resourceType}
          value={value}
          showLookup={showLookup}
          showExtract={showExtract}
          cursorPosition={cursorPosition}
          onValueUpdate={handleUpdate}
          showSuggestionsWithoutHandlebar={showSuggestionsWithoutHandlebar}
          skipExtractWrapOnSpecialChar={skipExtractWrapOnSpecialChar}
        />
      )}
    </div>
  );
};

export default function DynaTextWithFlowSuggestionWrapper(props) {
  return (
    <FormContext.Consumer>
      {form => <DynaTextWithFlowSuggestion {...props} formContext={form} />}
    </FormContext.Consumer>
  );
}
