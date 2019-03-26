import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, ownProps) => {
  const { resourceType, filter, excludeFilter } = ownProps;

  if (!resourceType) return {};

  const { resources } = selectors.resourceList(state, { type: resourceType });

  // console.log('from dyna select', resources);

  return {
    resources: resources.filter(r => {
      if (filter) {
        const keys = Object.keys(filter);

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];

          if (r[key] !== filter[key]) return false;
        }
      }

      if (excludeFilter) {
        const keys = Object.keys(excludeFilter);

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];

          if (r[key] === excludeFilter[key]) return false;
        }
      }

      return true;
    }),
  };
};

@withStyles(() => ({
  textField: {
    minWidth: 200,
  },
}))
class DynaSelectResource extends React.Component {
  render() {
    const {
      description,
      disabled,
      id,
      name,
      resources = [],
      value,
      label,
      onFieldChange,
    } = this.props;
    const availableResourceOptions = resources.map(conn => {
      const label = conn.name;
      const value = conn._id;

      return (
        <MenuItem key={value} value={value}>
          {label}
        </MenuItem>
      );
    });

    return (
      <FormControl key={id} disabled={disabled}>
        <InputLabel shrink={!!value} htmlFor={id}>
          {label}
        </InputLabel>
        <Select
          value={value}
          onChange={evt => {
            onFieldChange(id, evt.target.value);
          }}
          input={<Input name={name} id={id} />}>
          {availableResourceOptions}
        </Select>
        {description && <FormHelperText>{description}</FormHelperText>}
      </FormControl>
    );
  }
}

const ConnectedDynaSelectResource = connect(
  mapStateToProps,
  null
)(DynaSelectResource);
const FieldWrappedDynaSelectResource = props => (
  <FieldWrapper {...props}>
    <ConnectedDynaSelectResource {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedDynaSelectResource;
