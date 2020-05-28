import React from 'react';
import { ListSubheader, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';
import CeligoSelect from '../../CeligoSelect';
import { stringCompare } from '../../../utils/sort';

const useStyles = makeStyles({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaSelectWrapper: {
    width: '100%',
  },
});

export default function DynaSelect(props) {
  const {
    disabled,
    id,
    value,
    isValid = true,
    removeHelperText = false,
    name,
    options = [],
    defaultValue = '',
    placeholder,
    required,
    label,
    onFieldChange,
  } = props;
  const classes = useStyles();
  let isSubHeader;
  let items =
    options &&
    options.reduce(
      (itemsSoFar, option) =>
        itemsSoFar.concat(
          option.items.map(item => {
            let label;
            let value;
            let subHeader;

            if (typeof item === 'string') {
              label = item;
              value = item;
            } else {
              ({ value, subHeader } = item);
              label = item.label || item.value;

              if (!isSubHeader) {
                isSubHeader = subHeader;
              }
            }

            return typeof item === 'string'
              ? { label, value }
              : { ...item, label, value };
          })
        ),
      []
    );

  if (!isSubHeader) {
    items = items.sort(stringCompare('label'));
  }

  items = items.map(item => {
    const { label, value, subHeader, disabled = false } = item;

    if (subHeader) {
      return (
        <ListSubheader disableSticky key={subHeader}>
          {subHeader}
        </ListSubheader>
      );
    }

    return (
      <MenuItem key={value} value={value} disabled={disabled}>
        {label}
      </MenuItem>
    );
  });
  let finalTextValue;

  if (value === undefined || value === null) {
    finalTextValue = defaultValue;
  } else {
    finalTextValue = value;
  }

  const defaultItem = (
    <MenuItem key="__placeholder" value="">
      {placeholder || 'Please select'}
    </MenuItem>
  );

  items = [defaultItem, ...items];

  return (
    <div className={classes.dynaSelectWrapper}>
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
        <CeligoSelect
          data-test={id}
          value={finalTextValue}
          disableUnderline
          displayEmpty
          disabled={disabled}
          onChange={e => {
            // if value is undefined could be a subHeader element since it does not have value property
            if (e.target.value !== undefined) onFieldChange(id, e.target.value);
          }}
          input={<Input name={name} id={id} />}>
          {items}
        </CeligoSelect>
      </FormControl>

      {!removeHelperText && <ErroredMessageComponent {...props} />}
    </div>
  );
}
