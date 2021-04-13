import { FormControl, FormLabel, fade, makeStyles, useTheme } from '@material-ui/core';
import React, { useCallback } from 'react';
import Select, { components } from 'react-select';
import SearchIcon from '../../../../icons/SearchIcon';
import FieldHelp from '../../../FieldHelp';
import FieldMessage from '../../FieldMessage';

const REACT_SELECT_ACTION_TYPES = {
  CLEAR: 'clear',
  SELECT_VALUE: 'selectProps',
  REMOVE_VALUE: 'remove-value',
};

Object.freeze(REACT_SELECT_ACTION_TYPES);

const useStyles = makeStyles({
  fullWidth: {
    width: '100%',
  },
  option: {
    cursor: 'pointer',
  },
});

const Option = props => {
  const classes = useStyles();

  const { value, selectProps, children} = props;
  const { onChange} = selectProps;
  const isSelected = selectProps.value.includes(value);
  const toggleSelection = () => {
    if (isSelected) {
      return onChange(null, {action: REACT_SELECT_ACTION_TYPES.REMOVE_VALUE, removedValue: value});
    }

    return onChange(null, {action: REACT_SELECT_ACTION_TYPES.SELECT_VALUE, option: {value}});
  };

  return (
    <div data-test={value} className={classes.option} onClick={toggleSelection}>
      <components.Option {...props} isSelected={isSelected}>
        {React.cloneElement(children, {
          ...props,
          checked: isSelected,
        })}

      </components.Option>
    </div>
  );
};

const MultiValueLabel = props => {
  const {data, selectProps, children} = props;

  const correspondingLabel = selectProps.options.find(ele => ele.value === data)?.label;

  return (
    <div data-test={data} key={data} >
      <components.MultiValueLabel>

        {React.cloneElement(children, {
          ...props,
          value: data,
          label: correspondingLabel,

        })}
      </components.MultiValueLabel>
    </div>
  );
};

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <SearchIcon />
  </components.DropdownIndicator>
);

export const GenericTypeableSelect = props => {
  const {
    disabled,
    required,
    isValid,
    label,
    value,
    placeholder,
    onFieldChange,
    id,
    options,
    // these prop give you the ability to provide the selected values jsx implementations
    SelectedValueImpl,
    // these prop give you the ability to provide the dropdown options jsx implementations
    SelectedOptionImpl,
  } = props;
  const theme = useTheme();
  const classes = useStyles();
  // TODO: (Azhar) most important to remove all the repeated code from all the react select
  const customStylesMultiselect = {
    option: (provided, state) => ({
      ...provided,
      padding: '0px',
      color: state.isSelected
        ? theme.palette.secondary.main
        : theme.palette.secondary.light,
      backgroundColor:
        state.isSelected || state.isFocused
          ? theme.palette.background.paper2
          : theme.palette.background.paper,
      border: 'none',
      minHeight: '38px',
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
      '&:active': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.secondary.light,
      },
    }),
    control: () => ({
      minWidth: 365,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      borderRadius: '2px',
      backgroundColor: theme.palette.background.paper,
      alignItems: 'flex-start',
      cursor: 'default',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      minHeight: '38px',
      position: 'relative',
      boxSizing: 'borderBox',
      transition: 'all 100ms ease 0s',
      outline: '0px !important',
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
    }),
    indicatorsContainer: () => ({
      height: '38px',
      display: 'flex',
      alignItems: 'center',
    }),
    menu: () => ({
      zIndex: 2,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      position: 'absolute',
      backgroundColor: theme.palette.background.paper,
      width: '100%',
    }),
    input: () => ({
      color: theme.palette.secondary.light,
      minWidth: theme.spacing(10),
    }),
    placeholder: () => ({
      color: theme.palette.secondary.light,
      position: 'absolute',

    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    menuList: () => ({
      padding: '0px',
      maxHeight: '260px',
      overflowY: 'auto',
    }),
    // group: () => ({
    //   padding: '0px',
    // }),
    valueContainer: () => ({
      minHeight: '38px',
      maxHeight: '100%',
      alignItems: 'center',
      display: 'flex',
      flex: '1',
      padding: '2px 8px',
      position: 'relative',
      overflow: 'hidden',
      flexWrap: 'wrap',
    }),
    dropdownIndicator: () => ({
      color: theme.palette.secondary.light,
      padding: theme.spacing(0.5, 1, 0, 1),
      cursor: 'pointer',
      '&:hover': {
        color: fade(theme.palette.secondary.light, 0.8),
      },
    }),
    multiValue: styles => ({
      ...styles,
      backgroundColor: 'white',
      borderRadius: theme.spacing(3),
      height: 28,
      minWidth: 'unset',
      padding: '1px 8px',
      border: `1px solid ${theme.palette.secondary.lightest}`,
    }),
    multiValueLabel: styles => ({
      ...styles,
      borderRadius: 0,
      padding: 0,
    }),
    multiValueRemove: styles => ({
      ...styles,
      paddingRight: 'unset',
      color: theme.palette.text.secondary,
      ':hover': {
        color: theme.palette.secondary.main,
      },
    }),
  };
  const handleChange = useCallback((all, optionAction) => {
    if (optionAction.action === REACT_SELECT_ACTION_TYPES.CLEAR) {
      return onFieldChange(id, []);
    }
    if (optionAction.action === REACT_SELECT_ACTION_TYPES.REMOVE_VALUE) {
      return onFieldChange(id, value?.filter(val => val !== optionAction.removedValue));
    }

    if (optionAction.action === REACT_SELECT_ACTION_TYPES.SELECT_VALUE) {
      const selectedOptionValue = optionAction.option.value;

      if (value.includes(selectedOptionValue)) { return; }

      return onFieldChange(id, [...(value || []), selectedOptionValue]);
    }
  }, [id, onFieldChange, value]);

  const MultiValueLabelImpl = props => (
    <MultiValueLabel {...props}>
      <SelectedValueImpl />
    </MultiValueLabel>
  );

  const OptionImpl = props => (
    <Option {...props}>
      <SelectedOptionImpl />
    </Option>
  );

  return (

    <>
      <div className={classes.fullWidth} >
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        className={classes.fullWidth}
        error={!isValid}
        disabled={disabled}
        required={required}>
        <Select
          isDisabled={disabled}
          isMulti
          placeholder={placeholder}
          components={{DropdownIndicator, MultiValueLabel: MultiValueLabelImpl, Option: OptionImpl}}
          options={options}
          value={value}
          onChange={handleChange}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          styles={customStylesMultiselect}
    />

        <FieldMessage {...props} />
      </FormControl>
    </>
  );
};

