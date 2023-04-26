import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { TextField, FormLabel, FormControl } from '@mui/material';
import timeStamps from '../../../utils/timeStamps';
import getJSONPaths from '../../../utils/jsonPaths';
import { IMPORT_FLOW_DATA_STAGE } from '../../../utils/flowData';
import { selectors } from '../../../reducers';
import FieldMessage from './FieldMessage';
import FieldHelp from '../FieldHelp';
import isLoggableAttr from '../../../utils/isLoggableAttr';

const prefixRegexp = '.*{{((?!(}|{)).)*$';
const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    width: '100%',
  },
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

export default function DynaTimestampFileName(props) {
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
    isLoggable,
  } = props;
  const classes = useStyles();
  const userTimezone = useSelector(state => selectors.userTimezone(state));
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

  const sampleDataFields = useSelector(state => {
    const { data: sampleData } = selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      resourceType,
      stage: IMPORT_FLOW_DATA_STAGE,
    });
    const fields = getJSONPaths(sampleData) || [];

    return fields.map(field => ({ label: field.id, value: field.id }));
  });

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
      const formattedTimeStamps = timeStamps.map(timeStamp => ({
        label: `timestamp "${timeStamp.name}"${userTimezone ? ` "${userTimezone}"` : ''}`,
        value: `timestamp "${timeStamp._id}"${userTimezone ? ` "${userTimezone}"` : ''}`,
      }));

      // Suggests list includes both sample data fields and timeStamp fields
      const suggestionsList = [...sampleDataFields, ...formattedTimeStamps];
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
    <FormControl variant="standard" className={classes.fieldWrapper}>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <TextField
        {...isLoggableAttr(isLoggable)}
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
      <FieldMessage
        isValid={isValid}
        description={description}
        errorMessages={errorMessages}
      />
      {suggestionsListComponent}
    </FormControl>
  );
}
