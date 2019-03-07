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
  const { connectionId, connectionType } = ownProps;

  if (!connectionType) return {};

  const { resources } = selectors.resourceList(state, { type: 'connections' });

  // console.log('from dyna select', resources);

  return {
    connections: resources.filter(
      c => c.type === connectionType && c._id !== connectionId
    ),
  };
};

@withStyles(() => ({
  textField: {
    minWidth: 200,
  },
}))
class DynaSelectConnection extends React.Component {
  render() {
    const {
      description,
      disabled,
      id,
      name,
      connections = [],
      value,
      label,
      onFieldChange,
    } = this.props;
    const availableConnectionOptions = connections.map(conn => {
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
          {availableConnectionOptions}
        </Select>
        {description && <FormHelperText>{description}</FormHelperText>}
      </FormControl>
    );
  }
}

const ConnectedDynaRelativeUri = connect(
  mapStateToProps,
  null
)(DynaSelectConnection);
const FieldWrappedDynaRelativeUri = props => (
  <FieldWrapper {...props}>
    <ConnectedDynaRelativeUri {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedDynaRelativeUri;
