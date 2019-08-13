import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
});

export default function DynaSelect(props) {
  const {
    description,
    disabled,
    id,
    value,
    isValid,
    errorMessages,
    name,
    options = [],
    defaultValue = '',
    placeholder,
    // required,
    label,
    onFieldChange,
  } = props;
  const classes = useStyles(props);
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

  const tempPlaceHolder = placeholder || 'Please Select';
  const defaultItem = (
    <MenuItem key={tempPlaceHolder} value="">
      {tempPlaceHolder}
    </MenuItem>
  );

  items = [defaultItem, ...items];

  return (
    <FormControl key={id} disabled={disabled} className={classes.root}>
      <InputLabel shrink htmlFor={id}>
        {label}
      </InputLabel>
      <Select
        value={finalTextValue}
        displayEmpty
        onChange={evt => {
          const { value: evtValue } = evt.target;

          onFieldChange(id, evtValue);
        }}
        input={<Input name={name} id={id} />}>
        {items}
      </Select>

      <FormHelperText error={!isValid}>
        {isValid ? description : errorMessages}
      </FormHelperText>
    </FormControl>
  );
}
