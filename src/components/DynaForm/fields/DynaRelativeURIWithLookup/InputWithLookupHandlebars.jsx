/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import DynaAddEditLookup from '../DynaAddEditLookup';

// TODO Aditya (Refractor)
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
const LOOKUP_ACTION = {
  LOOKUP_EDIT: 'LOOKUP_EDIT',
  LOOKUP_ADD: 'LOOKUP_ADD',
  LOOKUP_SELECT: 'LOOKUP_SELECT',
};
const prefixRegexp = '.*{{((?!(}|{)).)*$';
const getSuggestions = (
  lookups = [],
  extractFields = [],
  handleUpdate,
  options
) => {
  const suggestions = [
    {
      fixed: true,
      label: 'New Lookup',
      type: 'lookup',
      component: (
        <DynaAddEditLookup
          showDynamicLookupOnly
          id="add-lookup"
          label="New Lookup"
          onSave={handleUpdate(LOOKUP_ACTION.LOOKUP_ADD)}
          onSavelabel="Add New Lookup"
          options={options}
        />
      ),
    },
  ];

  lookups.forEach(lookup => {
    if (!lookup.map) {
      suggestions.push({
        label: lookup.name,
        type: 'lookup',
        component: (
          <DynaAddEditLookup
            id={lookup.name}
            label="Edit"
            isEdit
            onSelect={handleUpdate(LOOKUP_ACTION.LOOKUP_SELECT, lookup)}
            onSave={handleUpdate(LOOKUP_ACTION.LOOKUP_EDIT, lookup)}
            showDynamicLookupOnly
            value={lookup}
            options={options}
          />
        ),
      });
    }
  });
  extractFields.forEach(field => {
    suggestions.push({
      label: field.name,
      type: 'extract',
      value: field.id,
    });
  });

  return suggestions;
};

export default function InputWithLookupHandlebars(props) {
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
    sampleData,
    isSqlImport,
    onFieldChange,
    onLookupUpdate,
    lookups,
    required,
    value,
    connectionType,
    connectionId,
    resourceId,
    resourceType,
    resourceName,
    flowId,
    extractFields = [],
  } = props;
  const classes = useStyles();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [state, setState] = useState({
    cursorPosition: 0,
    userInput: value || '',
    filteredSuggestions: [],
  });
  const { userInput, cursorPosition, filteredSuggestions } = state;

  useEffect(() => {
    if (value !== userInput) setState({ ...state, userInput: value });
  }, [state, userInput, value]);

  const handleSuggestionClick = (_val, isLookup) => {
    const tmpStr = userInput.substring(0, cursorPosition);
    const lastIndexOfBracesBeforeCursor = tmpStr.lastIndexOf('{');
    let handlebarExp = '';

    if (isLookup && connectionType === 'http') {
      handlebarExp = `{lookup "${_val}" this}`;
    } else {
      handlebarExp = `{${_val}}`;
    }

    const closeBraceIndexAfterCursor = value.indexOf(
      '}',
      lastIndexOfBracesBeforeCursor + 1
    );
    const openBraceIndexAfterCursor = value.indexOf(
      '{',
      lastIndexOfBracesBeforeCursor + 1
    );
    let newValue = '';
    const preText = `${value.substring(0, lastIndexOfBracesBeforeCursor + 1)}`;

    if (
      closeBraceIndexAfterCursor === -1 ||
      (openBraceIndexAfterCursor !== -1 &&
        openBraceIndexAfterCursor < closeBraceIndexAfterCursor)
    ) {
      const postText = `${value.substring(lastIndexOfBracesBeforeCursor + 1)}`;

      newValue = `${preText}${handlebarExp}}}${postText}`;
    } else {
      const postText = `${value.substring(closeBraceIndexAfterCursor)}`;

      newValue = `${preText}${handlebarExp}${postText}`;
    }

    setState({ ...state, userInput: newValue });
    setShowSuggestions(false);
    onFieldChange(id, newValue);
  };

  const handleLookupEdit = (oldlookup, modifiedLookup) => {
    const lookupsTmp = lookups || [];
    const indexOldLookup = lookupsTmp.findIndex(
      lookup => lookup.name === oldlookup.name
    );

    if (indexOldLookup !== -1) lookupsTmp[indexOldLookup] = modifiedLookup;
    handleSuggestionClick(modifiedLookup.name, true);
    onLookupUpdate(lookupsTmp);
  };

  const handleLookupAdd = lookup => {
    if (lookup) {
      const _lookups = [...lookups, lookup];

      handleSuggestionClick(lookup.name, true);
      onLookupUpdate(_lookups);
    }
  };

  const handleFieldChange = e => {
    const inpValue = e.target.value;

    setState({
      ...state,
      userInput: inpValue,
    });
    onFieldChange(id, inpValue);
  };

  const handleUpdate = (action, oldLookup) => lookup => {
    switch (action) {
      case LOOKUP_ACTION.LOOKUP_EDIT:
        handleLookupEdit(oldLookup, lookup);
        break;
      case LOOKUP_ACTION.LOOKUP_ADD:
        handleLookupAdd(lookup);
        break;
      case LOOKUP_ACTION.LOOKUP_SELECT:
        handleSuggestionClick(oldLookup.name, true);
        break;
      default:
    }

    setShowSuggestions(false);
  };

  const options = {
    isSQLLookup: isSqlImport,
    sampleData,
    connectionId,
    resourceId,
    resourceType,
    flowId,
    resourceName,
  };
  const suggestions = getSuggestions(
    lookups,
    extractFields,
    handleUpdate,
    options
  );
  const handleSuggestions = e => {
    const pointerIndex = e.target.selectionStart;
    const _showSuggestion = !!(
      e.target.value &&
      e.target.value.substring(0, pointerIndex).match(prefixRegexp)
    );
    let _filteredSuggestions = [];

    if (_showSuggestion) {
      const inpValue = e.target.value.substring(0, pointerIndex);
      const startIndexOfBraces = inpValue.lastIndexOf('{{');
      const inpValue2 = inpValue.substring(startIndexOfBraces + 2);

      _filteredSuggestions = suggestions.filter(
        suggestion =>
          suggestion.fixed ||
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

  if (showSuggestions && userInput && filteredSuggestions.length) {
    suggestionsListComponent = (
      <ul className={classes.suggestions}>
        {filteredSuggestions.map(suggestion => {
          if (suggestion.type === 'lookup') {
            return <li key={suggestion.label}>{suggestion.component}</li>;
          }

          return (
            <li
              key={suggestion.value}
              onClick={() => handleSuggestionClick(suggestion.value)}>
              {suggestion.label}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <React.Fragment>
      <TextField
        autoComplete="off"
        key={id}
        data-test={id}
        name={name}
        label={label}
        placeholder={placeholder}
        helperText={isValid ? description : errorMessages}
        disabled={disabled}
        multiline={multiline}
        onClick={handleSuggestions}
        error={!isValid}
        onChange={handleFieldChange}
        required={required}
        onKeyUp={handleSuggestions}
        value={userInput}
        variant="filled"
      />
      {suggestionsListComponent}
    </React.Fragment>
  );
}
