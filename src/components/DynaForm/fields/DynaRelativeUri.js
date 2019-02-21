// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
// import FormHelperText from '@material-ui/core/FormHelperText';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';

@withStyles(() => ({
  textField: {
    minWidth: 200,
  },
}))
class MaterialUiTextField extends React.Component {
  render() {
    const { classes } = this.props;
    const {
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      description,
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

    // let description = 'The description!';
    // const { type } = connection;

    // console.log(connection);

    // if (type === 'http' || type === 'rest') {
    //   description = `Relative to: ${connection[type].baseURI}`;
    // }

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

const DynaRelativeUri = props => (
  <FieldWrapper {...props}>
    <MaterialUiTextField {...props.fieldOpts} />
  </FieldWrapper>
);

export default DynaRelativeUri;
