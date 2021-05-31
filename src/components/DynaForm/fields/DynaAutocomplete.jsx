import { FormLabel, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import React, { useCallback, useMemo, useState } from 'react';
import CeligoTruncate from '../../CeligoTruncate';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';

useState;
const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaSelectWrapper: {
    width: '100%',
  },
  focusVisibleMenuItem: {
    backgroundColor: theme.palette.secondary.lightest,
    transition: 'all .8s ease',
  },
  dynaSelectMenuItem: {
    wordBreak: 'break-word',
  },
}));

const Row = props => {
  const {optionValue: value, options} = props;

  console.log('see props', props);

  const label = options.find(opt => opt.value === value)?.label;

  return (
    <div
      key={value}
      value={value}
      data-value={value}
        >
      <CeligoTruncate placement="left" lines={2}>
        {label}
      </CeligoTruncate>
    </div>
  );
};
export default function DynaAutocomplete(props) {
  const {
    disabled,
    id,
    value: actualValue,
    isValid = true,
    removeHelperText = false,
    name,
    required,
    rootClassName,
    label,
    onFieldChange,
    dataTest,
    options: actualOptions,
  } = props;
  // const renderOption = useCallback(optionValue => <Row optionValue={optionValue} options={actualOptions} />, [actualOptions]);

  const classes = useStyles();
  const options = useMemo(() => actualOptions.map(opt => opt.value), [actualOptions]);
  const [value, setValue] = useState(actualValue);
  const [inputValue, setInputValue] = useState(actualOptions.find(opt => opt.value === actualValue)?.label || actualValue);

  const onChange = useCallback((event, newValue) => {
    console.log('onChange corrected ', event, newValue);
    setValue(newValue);
    onFieldChange(id, newValue);
  }, [id, onFieldChange]);

  const renderInput = useCallback((params, inputState) => {
    console.log('see params', params, inputState);

    return (

      <TextField
        {...params} inputState={inputState} name={name} inputVal={value}
        id={id} />
    );
  },

  [id, name, value]);

  const onInputChange = useCallback((event, newInputValue) => {
    console.log('onInput corrected ', event, newInputValue);

    if (event === null) {
      return;
    }
    setInputValue(newInputValue);
    onFieldChange(id, newInputValue);
  }, [id, onFieldChange]);

  const getOptionLabel = useCallback(option => {
    const res = actualOptions.find(opt => opt.value === option)?.label;

    return res || '';
  }, [actualOptions]);

  console.log('check props ', props, value, inputValue);

  return (
    <div className={clsx(classes.dynaSelectWrapper, rootClassName)}>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        key={id}
        disabled={disabled}
        required={required}
        className={classes.dynaSelectWrapper}>
        <Autocomplete
          disableClearable
          freeSolo
          clearOnBlur
          options={options}
          getOptionLabel={getOptionLabel}
          data-test={dataTest || id}
          value={value}
          inputValue={inputValue}
          onInputChange={onInputChange}
          onChange={onChange}
          renderInput={renderInput}
        />
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}
