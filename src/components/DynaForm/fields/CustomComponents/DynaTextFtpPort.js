// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'integrator-ui-forms/packages/core/dist';

@withStyles(() => ({
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    // minWidth: 120,
  },
}))
class FtpPort extends React.Component {
  render() {
    const {
      classes,
      description,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      value,
      label,
      options,
      valueType,
      //   touched,
    } = this.props;

    if (!value && options && options.ftp) {
      onFieldChange(id, options.ftp);
    }

    const handleFieldChange = event => {
      const { value, name } = event.target;

      if (!name || name !== this.props.name) return;

      return onFieldChange(id, value);
    };

    return (
      <TextField
        autoComplete="off"
        key={id}
        type={valueType}
        name={name}
        label={label}
        className={classes.textField}
        placeholder={placeholder}
        helperText={isValid ? description : errorMessages}
        error={!isValid}
        value={value}
        onChange={handleFieldChange}
      />
    );
  }
}

const DynaTextFtpPort = props => (
  <FieldWrapper {...props}>
    <FtpPort />
  </FieldWrapper>
);

export default DynaTextFtpPort;
