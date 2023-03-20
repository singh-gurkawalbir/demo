import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import InputLabel from '@mui/material/InputLabel';
import DynaText from './DynaText';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  label: {
    minWidth: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  field: {
    width: '50%',
    paddingRight: theme.spacing(1),
    '& >.MuiFormControl-root': {
      width: '100%',
    },
  },
}));

export default function DynaSuiteScriptHook(props) {
  const classes = useStyles();
  const {
    id,
    disabled,
    name,
    onFieldChange,
    placeholder,
    required,
    value = {},
    label,
  } = props;
  const handleFieldChange = field => (event, fieldValue) => {
    onFieldChange(id, { ...value, [field]: fieldValue });
  };

  const isValidSuiteScriptHookField = useCallback(
    field => {
      const { function: func, fileInternalId } = value;
      const isEmptyHook = !func && !fileInternalId;

      if (field === 'function') {
        return isEmptyHook || !!func;
      }

      return isEmptyHook || !!fileInternalId;
    },
    [value]
  );

  return (
    <>
      <div className={classes.inputContainer}>
        <InputLabel className={classes.label}>{label}</InputLabel>
        <div className={classes.wrapper}>
          <div className={classes.field}>
            <DynaText
              key={id}
              name={name}
              label="Function"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              isValid={isValidSuiteScriptHookField('function')}
              value={value.function}
              onFieldChange={handleFieldChange('function')}
            />
          </div>
          <div className={classes.field}>
            <DynaText
              key={id}
              name={name}
              label="File Internal ID"
              InputLabelProps={{
                shrink: true,
              }}
              placeholder={placeholder}
              disabled={disabled}
              required={required}
              isValid={isValidSuiteScriptHookField('fileInternalId')}
              value={value.fileInternalId}
              onFieldChange={handleFieldChange('fileInternalId')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
