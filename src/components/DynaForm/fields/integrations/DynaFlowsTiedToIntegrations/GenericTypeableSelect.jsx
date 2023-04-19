import { FormControl, FormLabel } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback } from 'react';
import Select, { components } from 'react-select';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';
import { DoneButton } from '../../../../CeligoSelect';
import SearchIcon from '../../../../icons/SearchIcon';
import FieldHelp from '../../../FieldHelp';
import FieldMessage from '../../FieldMessage';
import { CustomReactSelectStyles } from '../../reactSelectStyles/styles';

const useStyles = makeStyles({
  fullWidth: {
    width: '100%',
  },
});

const REACT_SELECT_ACTION_TYPES = {
  CLEAR: 'clear',
  SELECT_VALUE: 'set-value',
  REMOVE_VALUE: 'remove-value',
};

Object.freeze(REACT_SELECT_ACTION_TYPES);

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

const MenuListImpl = props => {
  const {children, selectProps} = props;
  const { onMenuClose} = selectProps;

  return (
    <>
      <components.MenuList {...props}>
        {children}

      </components.MenuList>
      <DoneButton onClose={onMenuClose} />
    </>
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
    dropdownIndicator = DropdownIndicator,
    menuListImpl = MenuListImpl,
    // these prop give you the ability to provide the selected values jsx implementations
    SelectedValueImpl,
    // these prop give you the ability to provide the dropdown options jsx implementations
    SelectedOptionImpl,
    unSearchable,
    isLoggable,
    defaultMenuIsOpen,
  } = props;
  const classes = useStyles();
  const customStyles = CustomReactSelectStyles();
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
      <div className={classes.fullWidth}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        variant="standard"
        className={classes.fullWidth}
        error={!isValid}
        disabled={disabled}
        required={required}>
        <span {...isLoggableAttr(isLoggable)}>
          <Select
            isDisabled={disabled}
            isMulti
            placeholder={placeholder}
            components={{DropdownIndicator: dropdownIndicator, MultiValueLabel: MultiValueLabelImpl, Option: OptionImpl, MenuList: menuListImpl}}
            options={options}
            value={value}
            onChange={handleChange}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            styles={customStyles}
            isSearchable={!unSearchable}
            defaultMenuIsOpen={defaultMenuIsOpen}
   />
        </span>

        <FieldMessage {...props} />
      </FormControl>
    </>
  );
};

