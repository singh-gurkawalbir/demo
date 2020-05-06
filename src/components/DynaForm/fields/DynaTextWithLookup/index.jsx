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
  } = props;
  const ref = useRef(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const handleUpdate = useCallback(
    newValue => {
      setCursorPosition(0);
      onFieldChange(id, newValue);
    },
    [id, onFieldChange]
  );
  const handleCursorChange = useCallback(e => {
    const cursorIndex = e.target.selectionStart;

    setCursorPosition(cursorIndex);
  }, []);
  const handleFieldChange = e => {
    const inpValue = e.target.value;

    onFieldChange(id, inpValue);
  };

  // close suggestions when clicked outside
  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setCursorPosition(0);
    }
  };

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
      {(showExtract || showLookup) && (
        <Suggestions
          id={`suggestions-${id}`}
          onFieldChange={onFieldChange}
          resourceId={resourceId}
          flowId={flowId}
          connectionId={connectionId}
          formContext={formContext}
          resourceType={resourceType}
          value={value}
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
