import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function DynaUploadFile(props) {
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
  } = props;
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
      data-test={id}
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
