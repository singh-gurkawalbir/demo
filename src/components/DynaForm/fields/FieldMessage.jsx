import React from 'react';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ErrorIcon from '../../icons/ErrorIcon';
import WarningIcon from '../../icons/WarningIcon';

const useStyles = makeStyles(theme => ({
  message: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    '&:empty': {
      display: 'none',
    },
  },
  error: {
    color: theme.palette.error.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  icon: {
    marginRight: 3,
    fontSize: theme.spacing(2),
    verticalAlign: 'text-bottom',
  },
  description: {
    lineHeight: '20px',
    display: 'block',
    color: theme.palette.text.hint,
    '& a': {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
  },
}));

export default function FieldMessage({ description, errorMessages, warningMessages, isValid, className }) {
  const classes = useStyles();

  return description || errorMessages || warningMessages ? (
    <FormHelperText
      error={!isValid}
      className={clsx(classes.message, { [classes.description]: description }, className)}>
      {errorMessages && (
        <span className={classes.error}>
          {errorMessages && !isValid && <ErrorIcon className={classes.icon} />}
          {isValid ? description : errorMessages}
        </span>
      )}
      {warningMessages && !errorMessages && (
        <span className={classes.warning}>
          {warningMessages && !isValid && <WarningIcon className={classes.icon} />}
          {warningMessages}
        </span>
      )}
      {description && !warningMessages && !errorMessages && isValid && (
        <span>
          {description}
        </span>
      )}
    </FormHelperText>
  ) : null;
}
