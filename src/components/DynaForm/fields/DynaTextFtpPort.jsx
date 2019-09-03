import React from 'react';
import TextField from '@material-ui/core/TextField';

export default function DynaTextFtpPort(props) {
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
  } = props;
  let result;

  if ((!value || [21, 22, 990].includes(value)) && options) {
    result = options;
  } else {
    result = value;
  }

  const handleFieldChange = event => {
    const { value, name } = event.target;

    if (!name || name !== props.name) return;

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
      value={result}
      onChange={handleFieldChange}
    />
  );
}
