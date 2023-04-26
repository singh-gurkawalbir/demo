import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextField, FormLabel, FormControl } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Suggestions from './Suggestions';
import useFormContext from '../../../Form/FormContext';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import { EXPORT_FILTERED_DATA_STAGE, IMPORT_FLOW_DATA_STAGE } from '../../../../utils/flowData';
import { handlebarRegex } from '../../../../utils/mapping';

const useStyles = makeStyles({
  dynaTextWithFlowFormControl: {
    width: '100%',
  },
  dynaTextWithFlowLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
});
export default function DynaTextWithFlowSuggestion(props) {
  const classes = useStyles();
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
    showLookup = true,
    showExtract = true,
    showSuggestionsWithoutHandlebar = false,
    skipExtractWrapOnSpecialChar = false,
    formKey,
    stage,
    isLoggable,
  } = props;
  const formContext = useFormContext(formKey);
  const ref = useRef(null);
  const [lookupModalShown, setLookupModalShown] = useState(false);
  const [state, setState] = useState({
    hideSuggestion: true,
    textInsertPosition: 0,
  });
  const { hideSuggestion, textInsertPosition } = state;
  const flowDataStage = stage || (resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_FLOW_DATA_STAGE);

  const handleUpdateAfterSuggestionInsert = useCallback(
    newValue => {
      onFieldChange(id, newValue);
      setState({
        textInsertPosition: 0,
        hideSuggestion: true,
      });
    },
    [id, onFieldChange]
  );
  const handleCursorChange = useCallback(e => {
    const cursorIndex = e.target.selectionStart;

    setState({
      textInsertPosition: cursorIndex,
      hideSuggestion: false,
    });
  }, []);
  const handleFieldChange = e => {
    let inpValue = e.target.value;
    const isHandlebarExp = handlebarRegex.test(inpValue);

    if (isHandlebarExp) {
      inpValue = inpValue.replace(/"/g, '\'');
    }
    onFieldChange(id, inpValue);
  };

  const handleLookupModalShown = useCallback(
    val => {
      setLookupModalShown(val);
    },
    [setLookupModalShown],
  );
  // close suggestions when clicked outside
  const handleClickOutside = event => {
    if (!lookupModalShown && ref.current && !ref.current.contains(event.target)) {
      setState({
        ...state,
        hideSuggestion: true,
      });
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return (
    <FormControl variant="standard" className={classes.dynaTextWithFlowFormControl}>
      <div className={classes.dynaTextWithFlowLabelWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <div ref={ref}>
        <TextField
          {...isLoggableAttr(isLoggable)}
          autoComplete="off"
          id={`text-${id}`}
          key={id}
          data-test={id}
          name={name}
          className={classes.dynaTextWithFlowFormControl}
          placeholder={placeholder}
          disabled={disabled}
          multiline={multiline}
          onChange={handleFieldChange}
          value={value}
          onClick={handleCursorChange}
          onKeyUp={handleCursorChange}
          variant="filled"
        />
        {(showExtract || showLookup) && (
          <span {...isLoggableAttr(isLoggable)}>
            <Suggestions
              stage={flowDataStage}
              hide={hideSuggestion}
              id={`suggestions-${id}`}
              onFieldChange={onFieldChange}
              resourceId={resourceId}
              flowId={flowId}
              formContext={formContext}
              resourceType={resourceType}
              value={value}
              showLookup={showLookup}
              showExtract={showExtract}
              textInsertPosition={textInsertPosition}
              onValueUpdate={handleUpdateAfterSuggestionInsert}
              showSuggestionsWithoutHandlebar={showSuggestionsWithoutHandlebar}
              skipExtractWrapOnSpecialChar={skipExtractWrapOnSpecialChar}
              showLookupModal={handleLookupModalShown}
          />
          </span>
        )}
        <FieldMessage
          isValid={isValid}
          description={description}
          errorMessages={errorMessages}
        />
      </div>
    </FormControl>
  );
}

