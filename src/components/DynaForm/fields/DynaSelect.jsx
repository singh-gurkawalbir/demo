import React from 'react';
import { ListSubheader } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ArrowDownIcon from '../../icons/ArrowDownIcon';
import ErroredMessageComponent from './ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
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
    height: 50,
    justifyContent: 'flex-end',
    borderRadius: 2,
    '& > Label': {
      marginTop: theme.spacing(-3),
      whiteSpace: 'nowrap',
      fontSize: 12,
      padding: [[5, 0, 5, 12]],
      width: '100%',
      '&.Mui-disabled': {
        background: theme.palette.secondary.lightest,
      },
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      padding: [[0, 12]],
    },
    '& > div > div ': {
      paddingBottom: 5,
      textAlign: 'left',
    },
    '& svg': {
      right: theme.spacing(1),
      top: theme.spacing(-1),
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
    className,
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
      {placeholder || 'Please Select'}
    </MenuItem>
  );

  items = [defaultItem, ...items];

  return (
    <div>
      <FormControl
        key={id}
        disabled={disabled}
        className={clsx(classes.root, className)}
        error={!isValid}
        required={required}>
        <InputLabel htmlFor={id} disableAnimation shrink={false}>
          {label}
        </InputLabel>
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
