import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextField, FormLabel, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Suggestions from './Suggestions';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import useFormContext from '../../../Form/FormContext';
import FieldHelp from '../../FieldHelp';

const useStyles = makeStyles({
  dynaTextWithFlowFormControl: {
    width: '100%',
  },
  dynaTextWithFlowLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
});
const DynaTextWithFlowSuggestion = props => {
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
    formContext,
    showLookup = true,
    showExtract = true,
    showSuggestionsWithoutHandlebar = false,
    skipExtractWrapOnSpecialChar = false,
  } = props;
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    hideSuggestion: true,
    textInsertPosition: 0,
  });
  const { hideSuggestion, textInsertPosition } = state;
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
  const handleUpdateAfterSuggestionInsert = useCallback(
    newValue => {
      onFieldChange(id, newValue);
      setState({
        textInsertPosition: 0,
        hideSuggestion: false,
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
    const inpValue = e.target.value;

    onFieldChange(id, inpValue);
  };

  // close suggestions when clicked outside
  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setState({
        ...state,
        hideSuggestion: true,
      });
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
    <FormControl className={classes.dynaTextWithFlowFormControl}>
      <div className={classes.dynaTextWithFlowLabelWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <div ref={ref}>
        <TextField
          autoComplete="off"
          id={`text-${id}`}
          key={id}
          data-test={id}
          name={name}
          className={classes.dynaTextWithFlowFormControl}
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
          />
        )}
      </div>
    </FormControl>
  );
};

export default function DynaTextWithFlowSuggestionWrapper(props) {
  const form = useFormContext(props);

  return <DynaTextWithFlowSuggestion {...props} formContext={form} />;
}
