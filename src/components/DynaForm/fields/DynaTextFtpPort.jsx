import React, { useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import { FormLabel, FormControl } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FieldHelp from '../FieldHelp';
import FieldMessage from './FieldMessage';
import useFormContext from '../../Form/FormContext';

const useStyle = makeStyles({
  dynaTextFtpFiedWrapper: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  dynaTextFtpFied: {
    width: '100%',
  },
});

function deriveFtpPort(ftpType, useImplicitFTPS) {
  if (ftpType === 'sftp') {
    return 22;
  }

  if (ftpType === 'ftps') {
    if (useImplicitFTPS === true) {
      return 990;
    }
  }

  return 21;
}

export default function DynaTextFtpPort(props) {
  const {
    formKey,
    description,
    errorMessages,
    id,
    isValid,
    name,
    onFieldChange,
    placeholder,
    value,
    label,
    valueType,
    disabled,
  } = props;
  const {fields} = useFormContext(formKey);
  const classes = useStyle();
  const ftpPort = deriveFtpPort(fields?.['ftp.type']?.value, fields?.['ftp.useImplicitFtps']?.value);

  useEffect(() => {
    if ((!value || [21, 22, 990].includes(+value)) && ftpPort) {
      onFieldChange(id, ftpPort, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ftpPort]);

  const handleFieldChange = useCallback(
    event => {
      const { value, name } = event.target;

      if (!name || name !== props.name) return;

      return onFieldChange(id, value);
    },
    [id, onFieldChange, props.name]
  );

  return (
    <FormControl variant="standard" className={classes.dynaTextFtpFiedWrapper}>
      <div>
        <FormLabel htmlFor={id} error={!isValid}>
          {label}
        </FormLabel>
        {/* Todo: helpText is needed here */}
        <FieldHelp {...props} />
      </div>
      <div className={classes.dynaTextFtpFiedWrapper}>
        <TextField
          autoComplete="off"
          key={id}
          type={valueType}
          name={name}
          data-test={id}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          variant="filled"
          onChange={handleFieldChange}
          className={classes.dynaTextFtpFied}
        />
        <FieldMessage
          isValid={isValid}
          errorMessages={errorMessages}
          description={description}
        />
      </div>
    </FormControl>
  );
}
