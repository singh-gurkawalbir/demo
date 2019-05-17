import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'react-forms-processor/dist';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, ownProps) => {
  const { resourceType, filter } = ownProps;

  if (!resourceType) return {};

  const { resources } = selectors.resourceList(state, { type: resourceType });

  return {
    resource: resources.find(r => {
      if (filter) {
        const keys = Object.keys(filter);

        for (let i = 0; i < keys.length; i += 1) {
          const key = keys[i];

          if (r[key] !== filter[key]) return false;
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
      classes,
      description,
      errorMessages,
      id,
      isValid,
      name,
      placeholder,
      label,

      resource,
      resourceProp,
    } = this.props;
    let value = '';

    if (resource && resourceProp) {
      value = resource[resourceProp];
    }

    return (
      <TextField
        autoComplete="off"
        InputLabelProps={{ shrink: true }}
        key={id}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        value={value}
        helperText={isValid ? description : errorMessages}
        disabled
      />
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
