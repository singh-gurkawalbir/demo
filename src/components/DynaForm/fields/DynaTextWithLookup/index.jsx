/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import Suggestions from './Suggestions';

const useStyles = makeStyles(theme => ({
  suggestions: {
    width: '100%',
    marginLeft: 0,
    listStyleType: 'none',
    paddingLeft: 0,
    marginTop: theme.spacing(1),
    maxHeight: 200,
    overflow: 'auto',
    paddingInlineStart: theme.spacing(1),
    '& li': {
      height: 40,
      display: 'flex',
      padding: 4,
    },
  },
}));
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
    connectionId,
    importType,
    flowId,
    formContext,
    showLookup = true,
    showExtract = true,
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

  console.log('============');
  console.log('showLookup', showLookup);
  console.log('showExtract', showExtract);
  console.log('id', id);
  console.log('============');

  console.log(props);
  const ref = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lookupShown, setLookupShown] = useState(false);
  const [state, setState] = useState({
    cursorPosition: 0,
    userInput: value || '',
    isFocus: false,
    matchedVal: '',
  });
  const { userInput, cursorPosition, matchedVal } = state;
  const handleUpdate = useCallback(
    newValue => {
      setState({ ...state, userInput: newValue });
      setShowSuggestions(false);
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
  const handleClickOutside = event => {
    if (ref.current && !lookupShown && !ref.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  const handleFieldChange = e => {
    const inpValue = e.target.value;

    setState({
      ...state,
      userInput: inpValue,
    });
    console.log('inpValue', inpValue);
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
          resourceId={resourceId}
          flowId={flowId}
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
