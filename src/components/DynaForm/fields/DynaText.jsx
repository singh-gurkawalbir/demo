import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';

export default function DynaText(props) {
  const {
    description,
    disabled,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    required,
    value = '',
    label,
    multiline,
    valueDelimiter,
    rowsMax,
    startAdornment,
    endAdornment,
    inputType,
    options,
  } = props;
  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    setValueChanged(true);
  }, [options]);
  useEffect(() => {
    if (valueChanged && options && typeof options === 'string') {
      onFieldChange(id, options);
      setValueChanged(false);
    }
  }, [id, onFieldChange, options, valueChanged]);

  const handleFieldChange = event => {
    const { value } = event.target;

    if (!valueDelimiter) {
      onFieldChange(id, value);

      return;
    }

    onFieldChange(id, value.split(valueDelimiter));
  };

  return (
    <TextField
      autoComplete="off"
      key={id}
      name={name}
      label={label}
      InputProps={{
        startAdornment: startAdornment ? (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ) : null,
        endAdornment: endAdornment ? (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ) : null,
      }}
      type={inputType}
      placeholder={placeholder}
      helperText={isValid ? description : errorMessages}
      disabled={disabled}
      multiline={multiline}
      rowsMax={rowsMax}
      required={required}
      error={!isValid}
      value={value}
      onChange={handleFieldChange}
    />
  );
}
