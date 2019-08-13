// @flow
import { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { FieldWrapper } from 'react-forms-processor/dist';
import { InputAdornment } from '@material-ui/core';

export function MaterialUiTextField(props) {
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
    touched,
  } = props;

  useEffect(() => {
    if (!touched && options && typeof options === 'string') {
      onFieldChange(id, options);
    }
  }, [id, onFieldChange, options, touched]);

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

const DynaText = props => (
  <FieldWrapper {...props}>
    <MaterialUiTextField />
  </FieldWrapper>
);

export default DynaText;
