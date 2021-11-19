import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import DynaText from './DynaText';
import FieldMessage from './FieldMessage';

// TODO: Aditya Replace the component with DynaSelectApplication
const useStyles = makeStyles(theme => ({
  optionRoot: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.divider}`,
    wordBreak: 'break-word',
    padding: '0px',
    color: theme.palette.primary.main,
  },
  optionImg: {
    minWidth: '120px',
    display: 'flex',
    float: 'left',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid',
    borderColor: theme.palette.divider,
    color: theme.palette.divider,
    height: '100%',
  },
  optionLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    height: '100%',
  },
  inputLabel: {
    transform: 'unset',
    position: 'static',
    marginBottom: theme.spacing(1),
  },
  selectedContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
  },
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
const SelectStyle = theme => ({
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected
      ? theme.palette.secondary.main
      : theme.palette.secondary.light,
    backgroundColor:
          state.isSelected || state.isFocused
            ? theme.palette.background.paper2
            : theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    minHeight: 38,
    wordBreak: 'break-word',
    '&:active': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.secondary.light,
    },
  }),
  control: () => ({
    width: '100%',
    height: 38,
    border: '1px solid',
    padding: '4px 7px',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: '2px',
    backgroundColor: theme.palette.background.paper,
    alignItems: 'center',
    cursor: 'default',
    color: theme.palette.secondary.main,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    minHeight: '38px',
    position: 'relative',
    boxSizing: 'borderBox',
    transition: 'all 100ms ease 0s',
    outline: '0px !important',
    fontSize: 15,
    lineHeight: '24px',
    fontFamily: 'source sans pro !important',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  }),
  menu: provided => ({
    ...provided,
    zIndex: 2,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
    borderRadius: theme.spacing(0, 0, 0.5, 0.5),
  }),
  input: () => ({
    color: theme.palette.secondary.main,
    width: '100%',
    '& > div': {
      width: '100%',
    },
    '& * > input': {
      width: '100% !important',
      display: 'block !important',
      fontFamily: 'source sans pro !important',
    },
  }),
  placeholder: () => ({
    color: theme.palette.secondary.light,
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menuList: () => ({
    padding: '0px',
    maxHeight: '300px',
    overflowY: 'auto',
  }),
  group: () => ({
    padding: '0px',
  }),
  groupHeading: () => ({
    textAlign: 'center',
    fontSize: '12px',
    padding: '5px',
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    background: theme.palette.secondary.lightest,
    color: theme.palette.text.secondary,
  }),
  dropdownIndicator: () => ({
    color: theme.palette.secondary.light,
    padding: '8px',
    cursor: 'pointer',
    '&:hover': {
      color: fade(theme.palette.secondary.light, 0.8),
    },
  }),
  singleValue: (provided, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';
    const color = theme.palette.secondary.main;

    return { ...provided, opacity, transition, color};
  },
});
export default function DynaTypeableSelect(props) {
  const {
    id,
    disabled,
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
  const customStyles = SelectStyle(useTheme());
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
