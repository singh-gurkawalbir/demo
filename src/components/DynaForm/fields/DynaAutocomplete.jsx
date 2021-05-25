import { FormLabel, Input } from '@material-ui/core';
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
  console.log('check props', props);
  const { index, style, data } = props;

  const { items, finalTextValue} = data;
  const { label, value, disabled = false } = items[index];

  return (
    <MenuItem
      key={value}
      value={value}
      data-value={value}
      disabled={disabled}
      style={style}
      selected={value === finalTextValue}
        >
      <CeligoTruncate placement="left" lines={2}>
        {label}
      </CeligoTruncate>
    </MenuItem>
  );
};

const options = [{
  label: 'Surya',
  value: 'surya',
}, {
  label: 'Vamsi',
  value: 'vamsi',
},
];
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
          data-test={dataTest || id}
          noOptionsText=""
          value={value}
          renderOption={props => <Row {...props} data={{items: options, finalTextValue: value}} />}
          onChange={(evt, value) => {
            console.log('see ', value);
            onFieldChange(id, value);
          }}
          renderInput={params => <Input {...params} name={name} id={id} />}
        />
      </FormControl>

      {!removeHelperText && <FieldMessage {...props} />}
    </div>
  );
}
