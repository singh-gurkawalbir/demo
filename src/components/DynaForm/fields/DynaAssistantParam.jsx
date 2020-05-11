import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, FormLabel, FormControl } from '@material-ui/core';
import getJSONPaths from '../../../utils/jsonPaths';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';

const prefixRegexp = '.*{{((?!(}|{)).)*$';
const useStyles = makeStyles(theme => ({
  suggestions: {
    width: '100%',
    marginLeft: 0,
    listStyleType: 'none',
    paddingLeft: 0,
    marginTop: theme.spacing(1),
    maxHeight: 400,
    overflow: 'auto',
    paddingInlineStart: theme.spacing(1),
    '& li': {
      height: 40,
      display: 'flex',
      padding: 4,
    },
  },
}));

export default function DynaAssistantParam(props) {
  const {
    description,
    errorMessages,
    id,
    flowId,
    resourceId,
    resourceType,
    isValid,
    disabled,
    value = '',
    placeholder,
    onFieldChange,
    name,
    label,
    required,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [state, setState] = useState({
    cursorPosition: 0,
    filteredSuggestions: [],
  });
  const { cursorPosition, filteredSuggestions } = state;
  const handleFieldChange = e => {
    const inpValue = e.target.value;

    onFieldChange(id, inpValue);
  };

  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const sampleDataFields = useSelector(state => {
    const { data: sampleData } = selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    });
    const fields = getJSONPaths(sampleData) || [];

    return fields.map(field => ({ label: field.id, value: field.id }));
  });

  useEffect(() => {
    // Request for sample data only incase of flow context
    if (flowId && !sampleDataFields.length && !isPageGenerator) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [
    dispatch,
    flowId,
    isPageGenerator,
    resourceId,
    resourceType,
    sampleDataFields.length,
  ]);

  // TODO Aditya: replace with regex
  const handleSuggestionClick = suggestion => {
    const tmpStr = value.substring(0, cursorPosition);
    const lastIndexOfBracesBeforeCursor = tmpStr.lastIndexOf('{');

    if (suggestion) {
      let lookupHandlebarExp = '';
      const closeBraceIndexAfterCursor = value.indexOf(
        '}',
        lastIndexOfBracesBeforeCursor + 1
      );
      const openBraceIndexAfterCursor = value.indexOf(
        '{',
        lastIndexOfBracesBeforeCursor + 1
      );
      let newValue = '';

      if (
        closeBraceIndexAfterCursor === -1 ||
        (openBraceIndexAfterCursor !== -1 &&
          openBraceIndexAfterCursor < closeBraceIndexAfterCursor)
      ) {
        lookupHandlebarExp = `${suggestion.value}}}`;

        newValue = `${value.substring(
          0,
          lastIndexOfBracesBeforeCursor + 1
        )}${lookupHandlebarExp}${value.substring(
          lastIndexOfBracesBeforeCursor + 1
        )}`;
      } else {
        lookupHandlebarExp = `${suggestion.value}`;
        const preText = `${value.substring(
          0,
          lastIndexOfBracesBeforeCursor + 1
        )}`;
        const postText = `${value.substring(closeBraceIndexAfterCursor)}`;

        newValue = `${preText}${lookupHandlebarExp}${postText}`;
      }

      onFieldChange(id, newValue);
      setState({
        ...state,
        userInput: newValue,
        cursorPosition: -1,
        filteredSuggestions: [],
      });
    }
  };

  const handleSuggestions = e => {
    const pointerIndex = e.target.selectionStart;
    const _showSuggestion = !!(
      e.target.value &&
      e.target.value.substring(0, pointerIndex).match(prefixRegexp)
    );

    if (_showSuggestion) {
      const inpValue = e.target.value.substring(0, pointerIndex);
      const startIndexOfBraces = inpValue.lastIndexOf('{{');
      const inpValue2 = inpValue.substring(startIndexOfBraces + 2);

      window.sampleDataFields = sampleDataFields;
      const suggestionsList = [
        ...sampleDataFields.map(f => ({
          ...f,
          value: `data.${f.value}`,
          label: `data.${f.label}`,
        })),
      ];
      const _filteredSuggestions = suggestionsList.filter(
        suggestion =>
          suggestion.label.toLowerCase().indexOf(inpValue2.toLowerCase()) > -1
      );

      setState({
        ...state,
        cursorPosition: pointerIndex,
        filteredSuggestions: _filteredSuggestions,
      });
    } else {
      setState({ ...state, cursorPosition: pointerIndex });
    }

    setShowSuggestions(_showSuggestion);
  };

  let suggestionsListComponent;

  if (showSuggestions && value && filteredSuggestions.length) {
    suggestionsListComponent = (
      <ul className={classes.suggestions}>
        {filteredSuggestions.map(suggestion => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <li
            onClick={() => handleSuggestionClick(suggestion)}
            key={suggestion.label}>
            {suggestion.label}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <FormControl>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <TextField
        autoComplete="off"
        key={id}
        data-test={id}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        onClick={handleSuggestions}
        onChange={handleFieldChange}
        onKeyUp={handleSuggestions}
        value={value}
        variant="filled"
      />
      <ErroredMessageComponent
        isValid={isValid}
        description={description}
        errorMessages={errorMessages}
      />
      {suggestionsListComponent}
    </FormControl>
  );
}
