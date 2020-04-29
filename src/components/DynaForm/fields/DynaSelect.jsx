import React from 'react';
import { ListSubheader, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import ErroredMessageComponent from './ErroredMessageComponent';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(theme => ({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderRadius: 2,
    '& > .MuiInput-formControl': {
      height: 38,
      padding: '11px 15px',
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& svg': {
      right: theme.spacing(1),
      top: theme.spacing(1),
    },
  },
}));

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
  let items = options.reduce(
    (itemsSoFar, option) =>
      itemsSoFar.concat(
        option.items.map(item => {
          let label;
          let value;

          if (typeof item === 'string') {
            label = item;
            value = item;
          } else {
            ({ value } = item);
            label = item.label || item.value;
          }

          const { subHeader, disabled = false } = item;

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
        })
      ),
    []
  );
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
    <div>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <FormControl
        key={id}
        disabled={disabled}
        error={!isValid}
        required={required}
        className={classes.root}>
        <Select
          data-test={id}
          value={finalTextValue}
          IconComponent={ArrowDownIcon}
          disableUnderline
          displayEmpty
          disabled={disabled}
          onChange={e => {
            // if value is undefined could be a subHeader element since it does not have value property
            if (e.target.value !== undefined) onFieldChange(id, e.target.value);
          }}
          input={<Input name={name} id={id} />}>
          {items}
        </Select>
      </FormControl>

      {!removeHelperText && <ErroredMessageComponent {...props} />}
    </div>
  );
}
