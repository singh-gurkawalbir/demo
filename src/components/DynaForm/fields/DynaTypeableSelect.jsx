import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import DynaText from './DynaText';
import FieldMessage from './FieldMessage';
import isLoggableAttr from '../../../utils/isLoggableAttr';
import { CustomReactSelectStyles } from './reactSelectStyles/styles';

const useStyles = makeStyles(theme => ({
  multilineText: {
    width: '100%',
    '& div:first-child': {
      minHeight: 38,
      padding: '8px 35px 8px 8px',
    },
  },
  dynaTextContainer: {
    padding: 0,
    display: 'flex',
    marginBottom: 0,
    '& > .MuiFilledInput-multiline': {
      minHeight: 38,
      padding: theme.spacing(1),
      '& >:nth-child(1)': {
        margin: 0,
        minWidth: 0,
        maxWidth: '85%',
        paddingTop: theme.spacing(0.5),
      },
      '& >:nth-child(2)': {
        minHeight: '16px !important',
        wordBreak: 'break-word',
      },
    },
    '& > div': {
      width: '100%',
    },
  },
  dynaTypeableSelect: {
    zIndex: theme.zIndex.appBar,
  },
}));

export default function DynaTypeableSelect(props) {
  const {
    id,
    disabled,
    isLoggable,
    value: propValue = '',
    placeholder,
    endAdornment,
    onBlur,
    labelName,
    removeHelperText = false,
    valueName,
    options = [],
    isValid,
    TextComponent,
    onTouch,
    components = {
      DropdownIndicator: () => null,
      IndicatorSeparator: () => null,
    },
    showAllSuggestions = false,
  } = props;
  const classes = useStyles();
  const ref = useRef(null);
  const windowHeight = window.innerHeight;
  const suggestions = useMemo(() => options.map(option => ({
    label: option[labelName],
    value: option[valueName]?.toString(), // convert values to String
    filterType: option.filterType,
  })).filter(opt => opt.label && opt.value), [labelName, options, valueName]);

  const [value, setValue] = useState(propValue?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleFocusIn = useCallback(evt => {
    // this component is a combo of textArea and react-select. trigger focus in when user tries to focus in textarea
    if (evt.target.type !== 'textarea') {
      return;
    }
    if (!isFocused) { setIsFocused(true); }
    if (onTouch) {
      onTouch(id);
    }
  }, [id, isFocused, onTouch]);
  const handleFocusOut = useCallback(evt => {
    // this component is a combo of textArea and react-select. trigger focus out when user tries to focus out of react-select
    if (evt.target.type === 'textarea') {
      return;
    }
    if (isFocused) { setIsFocused(false); }
  }, [isFocused]);

  useEffect(() => {
    const div = ref.current;

    // Bind the event listener
    div.addEventListener('focusin', handleFocusIn, true);
    div.addEventListener('focusout', handleFocusOut, true);

    return () => {
      // Unbind the event listener on clean up
      div.removeEventListener('focusin', handleFocusIn, true);
      div.removeEventListener('focusout', handleFocusOut, true);
    };
  }, [handleFocusIn, handleFocusOut]);
  const handleChange = useCallback(newObj => {
    const newVal = newObj.value;

    setValue(newVal);
    setIsFocused(false);
    setIsTyping(false);
    onBlur(id, newVal);

    // if (hideDropdownOnChange) { setShowDropdown(false); }
  }, [id, onBlur]);

  const handleTextChange = useCallback((id, val) => {
    setValue(val);
    onBlur(id, val);
  }, [onBlur]);

  const handleKeyDown = useCallback(
    evt => {
      if (evt.key === 'Escape') {
        setIsTyping(false);
        setValue(propValue);
        setIsFocused(false);
      }
    },
    [propValue],
  );
  const handleInputChange = useCallback((newVal, event) => {
    if (event.action === 'input-change') {
      setValue(newVal);
      setIsTyping(true);
    }
  }, []);

  const handleBlur = useCallback(
    () => {
      if (propValue !== value) {
        // check if value matches the option label
        const selectedOpt = suggestions.find(suggestionItem => suggestionItem.label.toLowerCase() === value.toLowerCase());
        const newValue = selectedOpt ? selectedOpt.value : value;

        setValue(newValue);
        onBlur(id, newValue);
        setIsTyping(false);
      }
    },
    [id, onBlur, propValue, suggestions, value],
  );

  const selectedValue = !isTyping && suggestions.find(suggestionItem => suggestionItem.value === value);
  // Dont resolve to value while user is typing
  const inputVal = (!isTyping && selectedValue?.label) || value;
  const customStyles = CustomReactSelectStyles();
  const filterOption = (options, rawInput) => {
    if (showAllSuggestions) return true;
    if (!options.label || !options.value) return false;
    const input = rawInput?.toString().toLowerCase();
    const label = options.label.toString?.().toLowerCase?.();
    const value = options.value.toString?.().toLowerCase?.();

    return label.includes(input) || value.includes(input);
  };

  const {y: elementPosFromTop = 0} = ref?.current?.getBoundingClientRect() || {};

  const menuPlacement = windowHeight - elementPosFromTop > 350 ? 'bottom' : 'top';

  return (
    <FormControl
      ref={ref}
      error={!isValid}
      disabled={disabled}
      className={classes.root}>
      {isFocused && (
      <Select
        {...isLoggableAttr(isLoggable)}
        id={id}
        data-test={id}
        inputValue={inputVal}
        isDisabled={disabled}
        value={selectedValue}
          // restricting selection of 1st suggestion on tabout
        tabSelectsValue={false}
        noOptionsMessage={() => null}
        placeholder={placeholder || ''}
        onInputChange={handleInputChange}
        onChange={handleChange}
        styles={customStyles}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        menuPlacement={menuPlacement}
        menuPosition="fixed"
        autoFocus
        openOnFocus
        components={components}
        options={suggestions}
        filterOption={filterOption}
        menuIsOpen
        className={classes.dynaTypeableSelect}
        />
      )}
      {!isFocused &&
        (TextComponent ? (
          <TextComponent
            {...props}
            {...isLoggableAttr(isLoggable)}
            value={inputVal}
            disabled={disabled}
            multiline
            readOnly
            onFieldChange={handleTextChange}
            className={classes.multilineText}
            id={`text-${id}`}
          />
        ) : (
          <DynaText
            id={`text-${id}`}
            isLoggable={isLoggable}
            value={inputVal}
            disabled={disabled}
            multiline
            readOnly
            placeholder={placeholder}
            onFieldChange={handleTextChange}
            endAdornment={endAdornment}
            className={classes.dynaTextContainer}
          />
        ))}

      {!removeHelperText && <FieldMessage {...props} />}
    </FormControl>
  );
}
