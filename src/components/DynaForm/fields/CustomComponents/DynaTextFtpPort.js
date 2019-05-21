// @flow
import React from 'react';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'react-forms-processor/dist';

class FtpPort extends React.Component {
  render() {
    const {
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
    } = this.props;

    if (!value && options) {
      onFieldChange(id, options);
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
