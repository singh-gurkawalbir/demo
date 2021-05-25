import { FormLabel, TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import React from 'react';
import CeligoTruncate from '../../CeligoTruncate';
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

const Row = props => {
  const {value, label, disabled, style } = props;

  console.log('check props', props);

  return (
    <MenuItem
      key={value}
      value={value}
      data-value={value}
      disabled={disabled}
      style={style}
        >
      <CeligoTruncate placement="left" lines={2}>
        {label}
      </CeligoTruncate>
    </MenuItem>
  );
};

export default function DynaAutocomplete(props) {
  const {
    disabled,
    id,
    value,
    isValid = true,
    removeHelperText = false,
    name,
    required,
    rootClassName,
    label,
    onFieldChange,
    dataTest,
    options,
  } = props;

  const classes = useStyles();

  console.log('check ', props);

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
          options={options}
          getOptionLabel={option => option.label || ''}
          data-test={dataTest || id}
          value={value}
        //   getOptionLabel={option => options.find(f => f.value === option)?.label || ''}
          renderOption={option => <Row {...option} />}
          onChange={(evt, value) => {
            console.log('see ', value);
            onFieldChange(id, value);
          }}
          renderInput={params => <TextField {...params} name={name} id={id} />}
        />
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}
