import { FormLabel, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';

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

  const classes = useStyles();
  const options = useMemo(() => actualOptions.map(opt => opt.value), [actualOptions]);
  const [value, setValue] = useState(actualValue);
  const [inputValue, setInputValue] = useState(actualOptions.find(opt => opt.value === actualValue)?.label || actualValue);

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
          options={options}
          getOptionLabel={option => (
              actualOptions.find(opt => opt.value === `${option}`)?.label || `${option}`
          )}
          data-test={dataTest || id}
          value={value}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            const corrVal = actualOptions.find(
              opt => opt.label === newInputValue
            );

            if (corrVal) onFieldChange(id, corrVal.value);
            else onFieldChange(id, newInputValue);
          }}
          onChange={(event, newValue) => {
            setValue(newValue);
            onFieldChange(id, newValue);
          }}
          renderInput={params => (
            <TextField
              {...params} name={name}
              id={id} />
          )}
        />
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}
