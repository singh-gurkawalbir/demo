import { useRef, useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },

  noSuggestions: {
    padding: '0.5rem',
  },
  items: {
    padding: '0.5rem',
  },
  input: {
    minWidth: 365,
    height: '100%',
    margin: '2px 0px',
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: '2px',
    backgroundColor: theme.selectFormControl.background,
    alignItems: 'center',
    cursor: 'default',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: '38px',
    position: 'relative',
    boxSizing: 'border-box',
    transition: 'all 100ms ease 0s',
    outline: `0px !important`,
    color: theme.selectFormControl.color,
    padding: '2px 8px',
    fontSize: 16,
  },
  suggestions: {
    listStyle: 'none',
    maxHeight: '300px',
    padding: '0px',
    overflowY: 'auto',
    paddingLeft: 0,
    position: 'absolute',
    zIndex: 100,
    background: theme.selectFormControl.background,
    color: theme.selectFormControl.color,
    width: '100%',
    top: 32,
    boxShadow: theme.shadows[1],
    borderRadius: [[0, 0, 4, 4]],
    '& li': {
      padding: 8,
      wordBreak: 'break-word',
      '&:hover': {
        backgroundColor: theme.selectFormControl.hover,
        color: theme.selectFormControl.text,
      },
    },
  },
}));

export default function DynaAutoSuggest(props) {
  const {
    id,
    disabled,
    value,
    placeholder,
    onFieldChange,
    options = [],
  } = props;
  const wrapperRef = useRef(null);
  const classes = useStyles();
  const [state, setState] = useState({
    // The active selection's index
    activeSuggestion: 0,
    // The suggestions that match the user's input
    filteredSuggestions: [],
    // Whether or not the suggestion list is shown
    showSuggestions: false,
    // What the user has entered
    userInput: value || '',
  });
  const {
    activeSuggestion,
    filteredSuggestions,
    showSuggestions,
    userInput,
  } = state;
  const handleClickOutside = useCallback(
    event => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setState({
          ...state,
          showSuggestions: false,
        });
      }
    },
    [state]
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);

    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, [handleClickOutside]);

  const onChange = e => {
    const userInput = e.currentTarget.value;
    // Filter our suggestions that don't contain the user's input
    const filteredSuggestions = options.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    // Update the user input and filtered suggestions, reset the active
    // suggestion and make sure the suggestions are shown
    setState({
      activeSuggestion: 0,
      filteredSuggestions,
      showSuggestions: true,
      userInput,
    });
    onFieldChange(id, e.currentTarget.value);
  };

  // Event fired when the user clicks on a suggestion
  const onClick = e => {
    // Update the user input and reset the rest of the state
    setState({
      ...state,
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      userInput: e.currentTarget.innerText,
    });
  };

  // Event fired when the user presses a key down
  const onKeyDown = e => {
    const { activeSuggestion, filteredSuggestions } = state;

    // User pressed the enter key, update the input and close the
    // suggestions
    if (e.keyCode === 13) {
      setState({
        ...state,
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: filteredSuggestions[activeSuggestion],
      });
    }
    // User pressed the up arrow, decrement the index
    else if (e.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      setState({ ...state, activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow, increment the index
    else if (e.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      setState({ ...state, activeSuggestion: activeSuggestion + 1 });
    }
  };

  let suggestionsListComponent;

  if (showSuggestions && userInput) {
    if (filteredSuggestions.length) {
      suggestionsListComponent = (
        <ul className={classes.suggestions}>
          {filteredSuggestions.map((suggestion, index) => {
            let className;

            // Flag the active suggestion with a class
            if (index === activeSuggestion) {
              className = classes.suggestionActive;
            }

            return (
              // eslint-disable-next-line
              <li className={className} key={options} onClick={onClick}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    }
  }

  return (
    <FormControl key={id} disabled={disabled} className={classes.root}>
      <input
        ref={wrapperRef}
        placeholder={placeholder}
        type="text"
        className={classes.input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
      />
      {suggestionsListComponent}
    </FormControl>
  );
}
