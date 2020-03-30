import { useEffect, useState, useMemo } from 'react';
import { InputAdornment, Typography } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { isNaN } from 'lodash';
import CopyIcon from '../../icons/CopyIcon';
import ActionButton from '../../ActionButton';

const useStyles = makeStyles(theme => ({
  dynaFieldWrapper: {
    width: '100%',
  },
  formField: {
    width: '100%',
  },
  startAdornmentText: {
    whiteSpace: 'nowrap',
    minWidth: theme.spacing(10),
  },
  subSection: {
    maxWidth: '95%',
    marginLeft: '5%',
  },
  dynaFieldCopyClipboard: {
    display: 'flex',
    width: '100%',
    flexDirection: `row !important`,
    '& > div:first-child': {
      flex: 1,
    },
  },
  copybtn: {
    marginLeft: 6,
  },
}));

function DynaText(props) {
  const {
    description,
    disabled,
    errorMessages,
    id,
    isValid = true,
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
    className,
    disableText = false,
    uppercase = false,
  } = props;
  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    setValueChanged(true);
  }, [options]);
  useEffect(() => {
    if (valueChanged && options && typeof options === 'string') {
      onFieldChange(id, options, true);
      setValueChanged(false);
    }
  }, [id, onFieldChange, options, valueChanged]);
  const handleFieldChange = event => {
    const { value, valueAsNumber } = event.target;
    let returnVal;

    if (inputType === 'number') {
      returnVal = isNaN(valueAsNumber) ? null : valueAsNumber;

      // resets the value to 0, if user tries to enter negative value
      if (returnVal < 0) returnVal = 0;
    } else {
      returnVal = value;
    }

    if (uppercase) {
      returnVal = returnVal.toUpperCase();
    }

    if (!delimiter) {
      onFieldChange(id, returnVal);

      return;
    }

    onFieldChange(id, value ? value.split(delimiter) : value);
  };

  const classes = useStyles();
  const inpValue = value === '' && inputType === 'number' ? 0 : value;
  const InputProps = useMemo(() => {
    const props = {
      startAdornment: startAdornment ? (
        <InputAdornment position="start">
          <Typography variant="body2" className={classes.startAdornmentText}>
            {startAdornment}
          </Typography>
        </InputAdornment>
      ) : null,
      endAdornment: endAdornment ? (
        <InputAdornment position="end">{endAdornment}</InputAdornment>
      ) : null,
      readOnly: !!readOnly,
    };

    if (inputType === 'number') {
      props.inputProps = {
        min: '0',
        step: '1',
      };
    }

    return props;
  }, [
    classes.startAdornmentText,
    endAdornment,
    inputType,
    readOnly,
    startAdornment,
  ]);

  return (
    <TextField
      autoComplete="off"
      key={id}
      data-test={id}
      name={name}
      label={label}
      InputProps={InputProps}
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
      className={(classes.formField, className)}
    />
  );
}

export default function TextFieldWithClipboardSupport(props) {
  const { copyToClipboard, value, subSectionField } = props;
  const classes = useStyles();

  if (copyToClipboard) {
    return (
      <div className={classes.dynaFieldCopyClipboard}>
        <DynaText {...props} />
        <CopyToClipboard text={value}>
          <ActionButton
            data-test="copyToClipboard"
            title="Copy to clipboard"
            className={classes.copybtn}>
            <CopyIcon />
          </ActionButton>
        </CopyToClipboard>
      </div>
    );
  }

  // copyToClipboard used to copy the value from clipboard.
  // subsectionfield used to add the padding to the field.
  return (
    <div
      className={clsx(classes.dynaFieldWrapper, {
        [classes.subSection]: subSectionField,
      })}>
      <DynaText {...props} />
      {}
    </div>
  );
}
