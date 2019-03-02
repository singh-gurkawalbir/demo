import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';
import * as selectors from '../../../reducers';

const mapStateToProps = (state, ownProps) => {
  const { connectionId } = ownProps;
  const connection = selectors.resource(state, 'connections', connectionId);

  return { connection };
};

@withStyles(() => ({
  textField: {
    minWidth: 200,
  },
}))
class DynaRelativeUri extends React.Component {
  render() {
    const { classes } = this.props;
    const {
      connection,
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      // description,
      onFieldChange,
      placeholder,
      required,
      value,
      label,
    } = this.props;
    const handleFieldChange = event => {
      const { value } = event.target;

      onFieldChange(id, value);
    };

    let description = 'The description!';
    const { type } = connection;

    // console.log(this.props);

    if (type === 'http' || type === 'rest') {
      description = `Relative to: ${connection[type].baseURI}`;
    }

    return (
      <TextField
        // autoComplete="off"
        key={id}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        helperText={isValid ? description : errorMessages}
        disabled={disabled}
        required={required}
        error={!isValid}
        value={value}
        onChange={handleFieldChange}
      />
    );
  }
}

const ConnectedDynaRelativeUri = connect(
  mapStateToProps,
  null
)(DynaRelativeUri);
const FieldWrappedDynaRelativeUri = props => (
  <FieldWrapper {...props}>
    <ConnectedDynaRelativeUri {...props.fieldOpts} />
  </FieldWrapper>
);

export default FieldWrappedDynaRelativeUri;
