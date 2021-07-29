import React from 'react';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ErrorIcon from '../../icons/ErrorIcon';
import WarningIcon from '../../icons/WarningIcon';

const useStyles = makeStyles(theme => ({
  textMessage: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
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
      className={clsx(classes.textMessage, className)}>
      {description && (
      <span className={classes.description}>
        {description}
      </span>
      )}
      {warningMessages && (
      <span className={classes.warning}>
        {warningMessages && !isValid && <WarningIcon className={classes.icon} />}
        {warningMessages}
      </span>
      )}
      {errorMessages && (
      <span className={classes.error}>
        {errorMessages && !isValid && <ErrorIcon className={classes.icon} />}
        {isValid ? description : errorMessages}
      </span>
      )}
    </FormHelperText>
  ) : null;
}
