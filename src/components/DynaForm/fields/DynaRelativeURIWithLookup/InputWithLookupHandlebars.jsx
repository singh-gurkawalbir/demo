/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import DynaAddEditLookup from '../DynaAddEditLookup';

const useStyles = makeStyles(theme => ({
  suggestions: {
    width: '100%',
    marginLeft: 0,
    listStyleType: 'none',
    paddingLeft: 10,
    marginTop: 0,
    paddingTop: 10,
    maxHeight: 400,
    overflow: 'auto',
    background: '#f3f3f3',
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
const getSuggestionsFromLookup = (lookups = [], handleUpdate) => {
  const suggestions = [
    {
      fixed: true,
      label: 'New Lookup',
      component: (
        <DynaAddEditLookup
          showDynamicLookupOnly
          id="add-lookup"
          label="New Lookup"
          onSave={handleUpdate(LOOKUP_ACTION.LOOKUP_ADD)}
          onSavelabel="Add New Lookup"
        />
      ),
    },
  ];

  lookups.forEach(lookup => {
    if (!lookup.map) {
      suggestions.push({
        label: lookup.name,
        component: (
          <DynaAddEditLookup
            id={lookup.name}
            label="Edit"
            isEdit
            onSelect={handleUpdate(LOOKUP_ACTION.LOOKUP_SELECT, lookup)}
            onSave={handleUpdate(LOOKUP_ACTION.LOOKUP_EDIT, lookup)}
            showDynamicLookupOnly
            value={lookup}
          />
        ),
      });
    }
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
    onFieldChange,
    onLookupUpdate,
    lookups,
    required,
    value,
  } = props;
  const classes = useStyles();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [state, setState] = useState({
    cursorPosition: 0,
    userInput: value || '',
    filteredSuggestions: [],
  });
  const { userInput, cursorPosition, filteredSuggestions } = state;
  const handleLookupSelect = lookup => {
    const tmpStr = userInput.substring(0, cursorPosition);
    const lastIndexOfBracesBeforeCursor = tmpStr.lastIndexOf('{');

    if (lookup) {
      const newValue = `${userInput.substring(
        0,
        lastIndexOfBracesBeforeCursor + 1
      )}{lookup "${lookup.name}" this}}}`;

      setState({ ...state, userInput: newValue });
      onFieldChange(id, newValue);
    }
  };

  const handleLookupEdit = (oldlookup, modifiedLookup) => {
    const lookupsTmp = lookups || [];
    const indexOldLookup = lookupsTmp.findIndex(
      lookup => lookup.name === oldlookup.name
    );

    if (indexOldLookup !== -1) lookupsTmp[indexOldLookup] = modifiedLookup;
    handleLookupSelect(modifiedLookup);
    onLookupUpdate(lookupsTmp);
  };

  const handleLookupAdd = lookup => {
    if (lookup) {
      const _lookups = [...lookups];

      _lookups.push(lookup);

      handleLookupSelect(lookup);
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
        handleLookupSelect(oldLookup);
        break;
      default:
    }

    setShowSuggestions(false);
  };

  const suggestions = getSuggestionsFromLookup(lookups, handleUpdate);
  const handleSuggestions = e => {
    const pointerIndex = e.target.selectionStart;
    const _showSuggestion = !!e.target.value
      .substring(0, pointerIndex)
      .match(prefixRegexp);
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
        {filteredSuggestions.map(suggestion => (
          <React.Fragment key={suggestion.label}>
            <li key={suggestion.label}>{suggestion.component}</li>
          </React.Fragment>
        ))}
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
