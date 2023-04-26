import React, { useState } from 'react';
import {
  FormLabel,
  Paper,
  MenuItem,
  TextField,
  FormControl,
  InputAdornment,
} from '@mui/material';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import makeStyles from '@mui/styles/makeStyles';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import SearchIcon from '../../icons/SearchIcon';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 2000,
    left: 0,
    right: 0,
    maxHeight: 300,
    overflow: 'auto',
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
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderTop: 'none',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    '& li': {
      borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
      '& div': {
        whiteSpace: 'normal',
        wordBreak: 'break-all',
      },
    },
  },
  dynaAutoSuggestLabelWrapper: {
    display: 'flex',
  },
  divider: {
    height: theme.spacing(2),
  },
  autoSuggestDropdown: {
    position: 'absolute',
    top: 4,
    right: 0,
    marginTop: '0px !important',
    color: theme.palette.secondary.light,
    pointerEvents: 'none',
  },
  inlineDelete: {
    position: 'absolute',
    top: 4,
    right: 0,
    marginTop: '0px !important',
    color: theme.palette.secondary.light,
  },
}));

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, isEndSearchIcon, showInlineClose, ...other } = inputProps;
  const searchIcon = isEndSearchIcon ? <SearchIcon /> : <ArrowDownIcon />;
  const isValuePresent = showInlineClose && (inputProps.value.length > 0);
  const classNames = isValuePresent ? classes.inlineDelete : classes.autoSuggestDropdown;

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
        endAdornment: (<InputAdornment className={classNames} position="start">{ isValuePresent ? showInlineClose : searchIcon }</InputAdornment>),
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

function getSuggestions(val, suggestions, showAllSuggestions) {
  const { value } = val;

  if (showAllSuggestions) {
    return suggestions;
  }

  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0
    ? suggestions
    : suggestions.filter(
      suggestion => suggestion.label.toLowerCase().indexOf(inputValue) !== -1
    );
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
    autoFocus,
    isValid,
    description,
    errorMessages,
    required,
    options = {},
    isLoggable,
    isEndSearchIcon = false,
    showInlineClose,
  } = props;
  const classes = useStyles();
  const suggestions = (options.suggestions || []).map(option => ({
    label: labelName ? option[labelName] : option,
    value: valueName ? option[valueName] : option,
  }));
  const [stateSuggestions, setSuggestions] = useState(suggestions || []);
  const handleSuggestionsFetchRequested = val => {
    const _suggestions = getSuggestions(val, suggestions, showAllSuggestions);

    setSuggestions(_suggestions);
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleChange = (event, { newValue }) => {
    if (onFieldChange) {
      onFieldChange(id, newValue);
    }
  };

  const shouldRenderSuggestions = () => true;
  const autosuggestProps = {
    renderInputComponent,
    suggestions: stateSuggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
    shouldRenderSuggestions,
  };

  return (
    <FormControl variant="standard" disabled={disabled} className={classes.root}>
      <div className={classes.dynaAutoSuggestLabelWrapper}>
        <FormLabel required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <div className={classes.root} {...isLoggableAttr(isLoggable)}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            id,
            placeholder,
            autoFocus,
            value,
            disabled,
            onChange: handleChange,
            isEndSearchIcon,
            showInlineClose,
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
        <FieldMessage
          description={description}
          errorMessages={errorMessages}
          isValid={isValid}
        />
      </div>
    </FormControl>
  );
}
