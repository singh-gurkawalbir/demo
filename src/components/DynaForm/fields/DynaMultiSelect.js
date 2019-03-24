import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';

@withStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    // margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
}))
class MaterialUiMultiSelect extends React.Component {
  render() {
    const { classes } = this.props;
    const {
      disabled,
      id,
      // isValid,
      name,
      options = [],
      // placeholder,
      // required,
      value = [],
      label,
      onFieldChange,
      valueDelimiter,
    } = this.props;

    console.log(`check options ${JSON.stringify(this.props)}`);

    const items = options.reduce(
      (itemsSoFar, option) =>
        itemsSoFar.concat(
          option.items.map(item => {
            if (typeof item === 'string') {
              return (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              );
            }

            return (
              <MenuItem key={item.value} value={item.value}>
                {item.label || item.value}
              </MenuItem>
            );
          })
        ),
      []
    );
    let processedValue = value;

    if (valueDelimiter && typeof value === 'string') {
      processedValue = value.split(valueDelimiter);
    }

    if (processedValue && !Array.isArray(processedValue)) {
      processedValue = [processedValue];
    }

    return (
      <div key={id}>
        <FormControl
          key={id}
          disabled={disabled}
          className={classes.formControl}>
          <InputLabel htmlFor={id}>{label}</InputLabel>
          <Select
            multiple
            value={processedValue}
            onChange={evt => {
              onFieldChange(id, evt.target.value);
            }}
            input={<Input name={name} id={id} />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected &&
                  typeof selected.map === 'function' &&
                  selected.map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
              </div>
            )}>
            {items}
          </Select>
        </FormControl>
      </div>
    );
  }
}

const DynaSelect = props => (
  <FieldWrapper {...props}>
    <MaterialUiMultiSelect />
  </FieldWrapper>
);

export default DynaSelect;
