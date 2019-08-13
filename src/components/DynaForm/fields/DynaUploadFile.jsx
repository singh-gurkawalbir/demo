import React from 'react';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'react-forms-processor/dist';

class DynaUploadFile extends React.Component {
  render() {
    const {
      options,
      disabled,
      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      required,
      value = '',
      label,
    } = this.props;
    const handleFieldChange = event => {
      const { value } = event.target;

      onFieldChange(id, value);
    };

    let acceptFileType = '.txt';

    if (options) {
      acceptFileType = `.${options}`;
    }

    return (
      <TextField
        inputProps={{ accept: acceptFileType }}
        InputLabelProps={{ shrink: true }}
        key={id}
        name={name}
        label={label}
        type="file"
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        error={!isValid}
        value={value}
        onChange={handleFieldChange}
      />
    );
  }
}

const WrappedDynaUploadFile = props => (
  <FieldWrapper {...props}>
    <DynaUploadFile />
  </FieldWrapper>
);

export default WrappedDynaUploadFile;
