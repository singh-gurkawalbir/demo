import { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles(theme => ({
//   wrapper: {
//     background: theme.palette.background.paper,
//     border: '1px solid',
//     borderColor: 'transparent',
//     padding: theme.spacing(1),
//     '&:hover': {
//       border: '1px solid',
//       borderColor: theme.palette.primary.main,
//     },
//   },
// }));

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
  // const classes = useStyles();
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
    <div>
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
        variant="filled"
        // disableUnderline
        // className={classes.wrapper}
        onChange={handleFieldChange}
      />
    </div>
  );
}
