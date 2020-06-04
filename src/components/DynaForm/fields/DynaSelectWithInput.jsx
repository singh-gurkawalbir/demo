import React, { useCallback } from 'react';
import { FormControl, makeStyles, FormLabel } from '@material-ui/core';
import DynaTypeableSelect from './DynaTypeableSelect';
import FieldHelp from '../FieldHelp';

// Azhar to do styling
const useStyles = makeStyles(() => ({
  formControl: {
    display: 'flex',
    alignItems: 'flex-start',
    '& > div:first-child': { width: '100%' },
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  selectWrapper: {
    width: '100%',
  },
}));

export default function DynaSelectWithInput(props) {
  const {
    id,
    label,
    disabled,
    required,
    value,
    labelName = 'label',
    valueName = 'value',
    onFieldChange,
    helpKey,
    placeholder,
    isValid,
    options = [],
  } = props;
  const classes = useStyles();
  const handleBlur = useCallback(
    (_id, val) => {
      onFieldChange(id, val);
    },
    [id, onFieldChange]
  );

  return (
    <div className={classes.selectWrapper}>
      <div className={classes.labelWrapper}>
        <FormLabel htmlFor={id} required={required} error={!isValid}>
          {label}
        </FormLabel>
        {helpKey && <FieldHelp {...props} helpKey={helpKey} />}
      </div>
      <FormControl
        disabled={disabled}
        className={classes.formControl}
        key={value}>
        <DynaTypeableSelect
          id={id}
          labelName={labelName}
          valueName={valueName}
          value={value}
          options={options}
          disabled={disabled}
          onBlur={handleBlur}
          isValid={isValid}
          placeholder={placeholder}
        />
      </FormControl>
    </div>
  );
}
