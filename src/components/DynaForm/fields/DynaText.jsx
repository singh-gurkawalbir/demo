import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { isNaN } from 'lodash';

const useStyles = makeStyles({
  dynaFieldWrapper: {
    width: '100%',
  },
  formField: {
    width: '100%',
  },
});

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
    delimiter,
    rowsMax,
    startAdornment,
    endAdornment,
    readOnly,
    inputType,
    options,
    disableText = false,
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
    const { value, valueAsNumber } = event.target;
    let returnVal = inputType === 'number' ? valueAsNumber : value;

    if (isNaN(returnVal)) {
      returnVal = undefined;
    }

    if (!delimiter) {
      onFieldChange(id, returnVal);

      return;
    }

    onFieldChange(id, value ? value.split(delimiter) : value);
  };

  const classes = useStyles();
  const inpValue = value === '' && inputType === 'number' ? 0 : value;

  return (
    <div className={classes.dynaFieldWrapper}>
      <TextField
        autoComplete="off"
        key={id}
        data-test={id}
        name={name}
        label={label}
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : null,
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : null,
          readOnly: !!readOnly,
        }}
        type={inputType}
        placeholder={placeholder}
        helperText={isValid ? description : errorMessages}
        disabled={disabled || disableText}
        multiline={multiline}
        rowsMax={rowsMax}
        required={required}
        error={!isValid}
        value={inpValue}
        variant="filled"
        onChange={handleFieldChange}
        className={classes.formField}
      />
    </div>
  );
}
