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
  state = {
    value: '',
  };
  componentDidMount() {
    const { defaultValue } = this.props;

    this.setState({ value: defaultValue });
  }
  render() {
    const { value } = this.state;
    const {
      classes,
      description,
      disableSelect,
      id,
      // isValid,
      name,
      options = [],
      // placeholder,
      // required,
      label,
      onFieldChange,
    } = this.props;
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

    return (
      <FormControl key={id} disabled={disableSelect} className={classes.root}>
        <InputLabel shrink={!!value} htmlFor={id}>
          {label}
        </InputLabel>
        <Select
          value={value}
          onChange={evt => {
            const { value } = evt.target;

            onFieldChange(id, value);
            this.setState({ value });
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
