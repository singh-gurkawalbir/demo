import { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import { makeStyles, useTheme, fade } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import DynaText from './DynaText';
import ErroredMessageComponent from './ErroredMessageComponent';

// TODO: Aditya Replace the component with DynaSelectApplication
const useStyles = makeStyles(theme => ({
  optionRoot: {
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.divider}`,
    wordBreak: 'break-word',
    padding: '0px',
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
      minHeight: 50,
      padding: '8px 35px 8px 8px',
    },
  },
  dynaTextContainer: {
    padding: 0,
    display: 'flex',
    '& > .MuiFilledInput-multiline': {
      minHeight: '38px',
      padding: theme.spacing(1),
      '& >:nth-child(1)': {
        margin: 0,
        minWidth: 0,
        maxWidth: '85%',
      },
      '& >:nth-child(2)': {
        minHeight: `16px !important`,
        wordBreak: 'break-word',
      },
    },
    '& > div': {
      width: '100%',
    },
  },
}));

export default function DynaTypeableSelect(props) {
  const {
    id,
    disabled,
    value,
    placeholder,
    onBlur,
    labelName,
    removeHelperText = false,
    valueName,
    options = [],
    isValid,
    TextComponent,
    components = {
      DropdownIndicator: () => null,
      IndicatorSeparator: () => null,
    },
  } = props;
  const ref = useRef(null);
  const suggestions = options.map(option => ({
    label: option[labelName],
    value: option[valueName],
    filterType: option.filterType,
  }));
  const [inputState, setInputState] = useState({
    inputValue: value || '',
    isFocus: false,
    filter: false,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const { filter, inputValue, isFocus } = inputState;
  // close clicked inside in component
  const handleClickInside = event => {
    if (
      showDropdown === false &&
      !disabled &&
      ref.current &&
      ref.current.contains(event.target)
    ) {
      setShowDropdown(true);
    }
  };

  useEffect(() => {
    // Bind the event listener
    document.addEventListener('click', handleClickInside, true);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickInside, true);
    };
  });
  const handleChange = newObj => {
    const newVal = newObj.value;

    setInputState({ ...inputState, inputValue: newVal });

    if (onBlur) onBlur(id, newVal);
  };

  const handleBlur = () => {
    setShowDropdown(false);

    if (value === inputValue) {
      return;
    }

    // check if entered value is a part of suggestions
    const selectedObj = suggestions.find(o => o.label === inputValue);
    const val = selectedObj ? selectedObj.value : inputValue;

    if (onBlur) onBlur(id, val);
    setInputState({ ...inputState, isFocus: false });
  };

  // const handleFocus = () => {
  //   setInputState({ ...inputState, isFocus: false });
  // };

  const handleTextChange = (id, val) => {
    setInputState({ filter: true, isFocus: true, inputValue: val });
    onBlur(id, val);
  };

  const handleInputChange = (newVal, event) => {
    if (event.action === 'input-change')
      setInputState({ filter: true, isFocus: true, inputValue: newVal });
  };

  const selectedValue =
    !isFocus && suggestions.find(o => o.value === inputValue);
  const inputVal =
    (!isFocus && selectedValue && selectedValue.label) || inputValue;
  const classes = useStyles();
  const theme = useTheme();
  const customStyles = {
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
      padding: '10px',
      minHeight: '48px',
      '&:active': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.light,
      },
    }),
    control: () => ({
      width: '100%',
      height: 50,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      borderRadius: '2px',
      backgroundColor: theme.palette.background.paper,
      alignItems: 'center',
      cursor: 'default',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      minHeight: '38px',
      position: 'relative',
      boxSizing: 'borderBox',
      transition: 'all 100ms ease 0s',
      outline: `0px !important`,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
    }),
    menu: () => ({
      zIndex: 2,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      width: '100%',
      boxShadow: `0px 3px 5px rgba(0,0,0,0.2)`,
      borderRadius: theme.spacing(0, 0, 0.5, 0.5),
    }),
    input: () => ({
      color: theme.palette.secondary.light,
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
      const color = theme.palette.secondary.light;

      return { ...provided, opacity, transition, color };
    },
  };
  const filterOption = (options, rawInput) => {
    if (filter) {
      return options.label.toLowerCase().indexOf(rawInput.toLowerCase()) !== -1;
    }

    return true;
  };

  return (
    <FormControl
      ref={ref}
      error={!isValid}
      disabled={disabled}
      className={classes.root}>
      {showDropdown && (
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
          onBlur={handleBlur}
          styles={customStyles}
          // onFocus={handleFocus}
          autoFocus
          openOnFocus
          components={components}
          options={suggestions}
          filterOption={filterOption}
          menuIsOpen
        />
      )}
      {!showDropdown &&
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
            onFieldChange={handleTextChange}
            className={classes.dynaTextContainer}
          />
        ))}

      {!removeHelperText && <ErroredMessageComponent {...props} />}
    </FormControl>
  );
}
