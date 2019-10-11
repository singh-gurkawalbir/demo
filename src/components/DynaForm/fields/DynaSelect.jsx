import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ArrowDownIcon from '../../icons/ArrowDownIcon';

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
      paddingTop: 10,
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      padding: [[0, 12]],
    },
    '& > div > div ': {
      paddingBottom: 5,
    },
    '& svg': {
      right: 8,
    },
  },
}));

export default function DynaSelect(props) {
  const {
    description,
    disabled,
    id,
    value,
    isValid,
    errorMessages,
    removeHelperText = false,
    name,
    options = [],
    defaultValue = '',
    placeholder,
    // required,
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

          return (
            <MenuItem key={value} value={value}>
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
      <FormControl key={id} disabled={disabled} className={classes.root}>
        <InputLabel shrink htmlFor={id}>
          {label}
        </InputLabel>
        <Select
          data-test={id}
          value={finalTextValue}
          IconComponent={ArrowDownIcon}
          disableUnderline
          displayEmpty
          onChange={evt => {
            const { value: evtValue } = evt.target;

            onFieldChange(id, evtValue);
          }}
          input={<Input name={name} id={id} />}>
          {items}
        </Select>
      </FormControl>
      {!removeHelperText && (description || errorMessages) && (
        <FormHelperText error={!isValid}>
          {isValid ? description : errorMessages}
        </FormHelperText>
      )}
    </div>
  );
}
