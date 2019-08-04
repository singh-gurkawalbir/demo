// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FieldWrapper } from 'react-forms-processor/dist';

const styles = () => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
});

export function MaterialUiSelect(props) {
  const {
    classes,
    description,
    disabled,
    id,
    value,
    isValid,
    errorMessages,
    name,
    options = [],
    defaultValue = '',
    label,
    onFieldChange,
  } = props;
  const items = options.reduce(
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

          if (value === evtValue) {
            return onFieldChange(id, '');
          }

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

const DynaSelect = props => (
  <FieldWrapper {...props}>
    <MaterialUiSelect classes={props.classes} />
  </FieldWrapper>
);

export default withStyles(styles)(DynaSelect);
