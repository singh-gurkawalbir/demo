/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useRef, useEffect } from 'react';
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

export function Suggestions(props) {
  const {
    lookups = [],
    extractFields = [],
    matchedVal = '',
    handleUpdate,
    showLookup,
    onSuggestionClick,
    onLookupClick,
    options,
  } = props;
  const classes = useStyles();
  const filteredLookup = lookups.filter(
    l => l.name.toLowerCase().indexOf(matchedVal.toLowerCase()) > -1
  );
  const filteredExtracts = extractFields
    .map(field => ({
      label: field.name,
      value: field.id.indexOf(' ') > -1 ? `[${field.id}]` : field.id,
    }))
    .filter(e => e.label.toLowerCase().indexOf(matchedVal.toLowerCase()) > -1);

  return (
    <ul className={classes.suggestions}>
      {showLookup && (
        <DynaAddEditLookup
          showDynamicLookupOnly
          id="add-lookup"
          label="New Lookup"
          onClick={onLookupClick}
          onSave={handleUpdate(LOOKUP_ACTION.LOOKUP_ADD)}
          onSavelabel="Add New Lookup"
          options={options}
        />
      )}
      {showLookup &&
        filteredLookup.map(lookup => (
          <li key={lookup.name}>
            <DynaAddEditLookup
              id={lookup.name}
              label="Edit"
              onClick={onLookupClick}
              isEdit
              onSelect={handleUpdate(LOOKUP_ACTION.LOOKUP_SELECT, lookup)}
              onSave={handleUpdate(LOOKUP_ACTION.LOOKUP_EDIT, lookup)}
              showDynamicLookupOnly
              value={lookup}
              options={options}
            />
          </li>
        ))}
      {filteredExtracts.map(e => (
        <li key={e.label} onClick={() => onSuggestionClick(e.value, false)}>
          {e.label}
        </li>
      ))}
    </ul>
  );
}

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
    connectionId,
    resourceId,
    resourceType,
    resourceName,
    flowId,
    getUpdatedFieldValue,
    extractFields = [],
    prefixRegexp = '',
    getMatchedValueforSuggestion,
    showLookup,
  } = props;
  const ref = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lookupShown, setLookupShown] = useState(false);
  const [state, setState] = useState({
    cursorPosition: 0,
    userInput: value || '',
    isFocus: false,
    matchedVal: '',
  });
  const { userInput, cursorPosition, matchedVal } = state;

  useEffect(() => {
    if (value !== userInput) setState({ ...state, userInput: value });
  }, [state, userInput, value]);

  // close suggestions when clicked outside
  const handleClickOutside = event => {
    if (ref.current && !lookupShown && !ref.current.contains(event.target)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  const handleSuggestionClick = (_val, isLookup) => {
    const newValue = getUpdatedFieldValue(
      userInput,
      cursorPosition,
      _val,
      isLookup
    );

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
    setLookupShown(false);
  };

  const handleLookupAdd = lookup => {
    if (lookup) {
      const _lookups = [...lookups, lookup];

      handleSuggestionClick(lookup.name, true);
      onLookupUpdate(_lookups);
      setLookupShown(false);
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
  const handleLookupClick = _showLookup => {
    setLookupShown(_showLookup);
  };

  const handleSuggestions = e => {
    const pointerIndex = e.target.selectionStart;
    const _val = e.target.value;
    const _showSuggestion = !!_val
      .substring(0, pointerIndex)
      .match(prefixRegexp);
    const _filteredSuggestions = [];

    if (_showSuggestion) {
      const matchedVal = getMatchedValueforSuggestion(_val, pointerIndex);

      setState({
        ...state,
        cursorPosition: pointerIndex,
        matchedVal,
        filteredSuggestions: _filteredSuggestions,
      });
    } else {
      setState({
        ...state,
        matchedVal: '',
        cursorPosition: pointerIndex,
      });
    }

    setShowSuggestions(_showSuggestion);
  };

  return (
    <div ref={ref}>
      <TextField
        autoComplete="off"
        id={id}
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
      {showSuggestions && (
        <Suggestions
          lookups={lookups}
          extractFields={extractFields}
          matchedVal={matchedVal}
          handleLookupClick={handleLookupClick}
          handleUpdate={handleUpdate}
          showLookup={showLookup}
          options={options}
          onSuggestionClick={handleSuggestionClick}
          onLookupClick={handleLookupClick}
        />
      )}
    </div>
  );
}
