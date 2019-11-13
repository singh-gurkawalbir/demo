import { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { Paper, MenuItem, TextField, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

// TODO (Azhar) : to work on styling
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    maxHeight: 300,
    overflow: 'scroll',
    borderRadius: '0px 0px 4px 4px',
    marginTop: theme.spacing(0.5),
  },
  dynaFieldWrapper: {
    width: '100%',
  },
  formField: {
    width: '100%',
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    '& li': {
      borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    },
  },
  divider: {
    height: theme.spacing(2),
  },
}));

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      variant="filled"
      className={classes.formField}
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map(part => (
          <span
            key={part.text}
            style={{ fontWeight: part.highlight ? 500 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    </MenuItem>
  );
}

function getSuggestions({ val, suggestions, showAllSuggestions }) {
  if (showAllSuggestions) {
    return suggestions;
  }

  const inputValue = val.trim().toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 &&
          suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.value;
}

export default function DynaAutoSuggest(props) {
  const {
    id,
    disabled,
    value = '',
    placeholder,
    onFieldChange,
    labelName,
    showAllSuggestions,
    label,
    valueName,
    options = {},
  } = props;
  const classes = useStyles();
  const suggestions = (options.suggestions || []).map(option => ({
    label: labelName ? option[labelName] : option,
    value: valueName ? option[valueName] : option,
  }));
  const [stateSuggestions, setSuggestions] = useState(suggestions || []);
  const handleSuggestionsFetchRequested = ({ val }) => {
    setSuggestions(getSuggestions({ val, suggestions, showAllSuggestions }));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = (event, { newValue }) => {
    if (onFieldChange) {
      onFieldChange(id, newValue);
    }
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  };

  return (
    <FormControl disabled={disabled} className={classes.root}>
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            id,
            label,
            placeholder,
            value,
            onChange: handleChange,
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square elevation={2}>
              {options.children}
            </Paper>
          )}
        />
      </div>
    </FormControl>
  );
}
