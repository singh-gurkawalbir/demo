// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'react-forms-processor/dist';

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
      label,
      valueType,
      //   touched,
    } = this.props;
    let result;
    const { value, options } = this.props;

    if (!value && options) {
      result = options;
    } else {
      result = value;
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
        value={result}
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
