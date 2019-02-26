// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';

@withStyles(() => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
}))
class MaterialUiSelect extends React.Component {
  render() {
    const { classes } = this.props;
    const {
      description,
      disabled,
      id,
      // isValid,
      name,
      options = [],
      // placeholder,
      // required,
      value,
      label,
      onFieldChange,
    } = this.props;
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

    return (
      <FormControl key={id} disabled={disabled} className={classes.root}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Select
          value={value}
          onChange={evt => {
            onFieldChange(id, evt.target.value);
          }}
          input={<Input name={name} id={id} />}>
          {items}
        </Select>
        {description && <FormHelperText>{description}</FormHelperText>}
      </FormControl>
    );
  }
}

const DynaSelect = props => (
  <FieldWrapper {...props}>
    <MaterialUiSelect />
  </FieldWrapper>
);

export default DynaSelect;
