import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Select, { components } from 'react-select';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles, FormControl, FormLabel, Chip } from '@material-ui/core';
import { useSelectorMemo } from '../../../../hooks';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../LoadResources';
import { useResetWhenParentIntegrationChanges } from './DynaChildIntegrations';
import FieldHelp from '../../FieldHelp';
import FieldMessage from '../FieldMessage';
import SearchIcon from '../../../icons/SearchIcon';

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

const REACT_SELECT_ACTION_TYPES = {
  CLEAR: 'clear',
  SELECT_VALUE: 'selectProps',
  REMOVE_VALUE: 'remove-value',
};

Object.freeze(REACT_SELECT_ACTION_TYPES);

const OptionCheckbox = props => {
  const {
    onClick,
    checked,
    label,
  } = props;

  return (
    <>
      <Checkbox
        onClick={onClick}
        checked={checked}
        color="primary"
      />
      <span >{label}</span>
    </>
  );
};
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

const SelectedValueChips = ({value, label}) => (
  <Chip
    value={value}
    label={label}
  />
);

const MultiValueLabel = props => {
  const classes = useStyles();
  const {data, selectProps, children} = props;

  const correspondingLabel = selectProps.options.find(ele => ele.value === data)?.label;

  return (
    <div data-test={data} key={data} className={classes.chips}>
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
    SelectedValueImpl,
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

const TypeableSelect = props => (

  <GenericTypeableSelect
    {...props}
    SelectedOptionImpl={OptionCheckbox}
    SelectedValueImpl={SelectedValueChips}
  />
);
export default function DynaFlowsTiedToIntegration(props) {
  const {formKey, id, onFieldChange} = props;

  const selectedIntegration = useSelector(state => selectors.formState(state, formKey)?.fields?.integration?.value);
  const childIntegrations = useSelector(state => selectors.formState(state, formKey)?.fields?.childIntegrations?.value);
  const allIntegrationIds = useMemo(() => ([selectedIntegration, childIntegrations]
    .flat().filter(val => !!val)), [childIntegrations, selectedIntegration]);
  const flowsTiedToIntegrations = useSelectorMemo(selectors.mkAllFlowsTiedToIntegrations, allIntegrationIds);

  // reset flows list when either integration or childIntegrations changes
  useResetWhenParentIntegrationChanges(formKey, 'integration', onFieldChange, id);
  useResetWhenParentIntegrationChanges(formKey, 'childIntegrations', onFieldChange, id);
  const options = useMemo(() => flowsTiedToIntegrations.map(({_id, name}) => ({ label: name, value: _id})), [flowsTiedToIntegrations]);

  return (

    <LoadResources required resources="flows" >
      <TypeableSelect {...props} options={options} />
    </LoadResources>

  );
}

