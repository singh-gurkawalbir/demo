import { FormControl, FormLabel, makeStyles } from '@material-ui/core';
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

const useStyles = makeStyles(theme => ({
  option: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  fullWidth: {
    width: '100%',
  },
}));

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
    <div data-test={value} className={classes.option}>
      <components.Option {...props} isSelected={isSelected}>
        {React.cloneElement(children, {
          ...props,
          onClick: toggleSelection,
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

  const classes = useStyles();

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
          isMulti
          placeholder={placeholder}
          components={{DropdownIndicator, MultiValueLabel: MultiValueLabelImpl, Option: OptionImpl}}
          options={options}
          value={value}
          onChange={handleChange}
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
    />

        <FieldMessage {...props} />
      </FormControl>
    </>
  );
};

