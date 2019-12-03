import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import timeStamps from '../../../utils/timeStamps';

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

export default function DynaTimestampFileName(props) {
  const {
    id,
    disabled,
    value = '',
    placeholder,
    onFieldChange,
    name,
    label,
    required,
  } = props;
  const classes = useStyles();
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
        )}${lookupHandlebarExp}}}${value.substring(
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

      setState({ ...state, userInput: newValue });
      onFieldChange(id, newValue);
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
        label: `timestamp(${timeStamp.name})`,
        value: `timestamp(${timeStamp._id})`,
      }));

      formattedTimeStamps.push({ label: 'timestamp', value: 'timestamp' });
      const _filteredSuggestions = formattedTimeStamps.filter(
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
    <Fragment>
      <TextField
        autoComplete="off"
        key={id}
        data-test={id}
        name={name}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        onClick={handleSuggestions}
        onChange={handleFieldChange}
        required={required}
        onKeyUp={handleSuggestions}
        value={value}
        variant="filled"
      />
      {suggestionsListComponent}
    </Fragment>
  );
}
