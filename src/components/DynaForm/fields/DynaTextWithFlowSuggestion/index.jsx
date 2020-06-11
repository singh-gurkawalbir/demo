import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextField, FormLabel, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import FormContext from 'react-forms-processor/dist/components/FormContext';
import Suggestions from './Suggestions';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import FieldHelp from '../../FieldHelp';
import ErroredMessageComponent from '../ErroredMessageComponent';

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
  const [lookupModalShown, setLookupModalShown] = useState(false);
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
    const inpValue = e.target.value;

    onFieldChange(id, inpValue);
  };

  const handleLookupModalShown = useCallback(
    (val) => {
      setLookupModalShown(val)
    },
    [setLookupModalShown],
  )
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
          disabled={disabled}
          multiline={multiline}
          onChange={handleFieldChange}
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
            showLookupModal={handleLookupModalShown}
          />
        )}
        <ErroredMessageComponent
          isValid={isValid}
          description={description}
          errorMessages={errorMessages}
        />
      </div>
    </FormControl>
  );
};

export default function DynaTextWithFlowSuggestionWrapper(props) {
  return (
    <FormContext.Consumer>
      {form => <DynaTextWithFlowSuggestion {...props} formContext={form} />}
    </FormContext.Consumer>
  );
}
