/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import Suggestions from './Suggestions';

const DynaTextWithLookup = props => {
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
    connectionId,
    // isSqlImport,
    // onLookupUpdate,
    // lookups,
    // getUpdatedFieldValue,
    // extractFields = [],
    // prefixRegexp = '',
    // getMatchedValueforSuggestion,
    // showLookup,
    // fieldMetadata,
    // fieldId,
    // recordType,
    // hideExtractFields,
  } = props;
  const ref = useRef(null);
  const [state, setState] = useState({
    cursorPosition: 0,
    userInput: value || '',
    isFocus: false,
  });
  const { userInput, cursorPosition } = state;
  const handleUpdate = useCallback(
    newValue => {
      setState({ ...state, userInput: newValue });
      onFieldChange(id, newValue);
    },
    [id, onFieldChange, state]
  );
  const handleCursorChange = useCallback(
    e => {
      const pointerIndex = e.target.selectionStart;

      setState({ ...state, cursorPosition: pointerIndex });
    },
    [state]
  );

  useEffect(() => {
    if (value !== userInput) setState({ ...state, userInput: value });
  }, [state, userInput, value]);

  // close suggestions when clicked outside
  // const handleClickOutside = event => {
  //   if (ref.current && !ref.current.contains(event.target)) {
  //     setShowSuggestions(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener('click', handleClickOutside, true);

  //   return () => {
  //     document.removeEventListener('click', handleClickOutside, true);
  //   };
  // });
  const handleFieldChange = e => {
    const inpValue = e.target.value;

    setState({
      ...state,
      userInput: inpValue,
    });
    onFieldChange(id, inpValue);
  };

  return (
    <div ref={ref}>
      <TextField
        autoComplete="off"
        id={id}
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
        value={userInput}
        onClick={handleCursorChange}
        onKeyUp={handleCursorChange}
        variant="filled"
      />
      {(showExtract || showLookup) && (
        <Suggestions
          id={id}
          onFieldChange={onFieldChange}
          resourceId={resourceId}
          flowId={flowId}
          connectionId={connectionId}
          formContext={formContext}
          resourceType={resourceType}
          value={userInput}
          showLookup={showLookup}
          showExtract={showExtract}
          cursorPosition={cursorPosition}
          onValueUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default function DynaTextWithLookupWrapped(props) {
  return (
    <FormContext.Consumer>
      {form => <DynaTextWithLookup {...props} formContext={form} />}
    </FormContext.Consumer>
  );
}
