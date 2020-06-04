import React from 'react';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ErrorIcon from '../../icons/ErrorIcon';

const useStyles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.error.main,
    '&:empty': {
      display: 'none',
    },
  },
  icon: {
    marginRight: 3,
    fontSize: theme.spacing(2),
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
const ErroredMessageComponent = ({ description, errorMessages, isValid }) => {
  const classes = useStyles();

  return description || errorMessages ? (
    <FormHelperText
      error={!isValid}
      className={clsx(classes.error, { [classes.description]: description })}>
      {errorMessages && !isValid && <ErrorIcon className={classes.icon} />}
      {isValid ? description : errorMessages}
    </FormHelperText>
  ) : null;
};

export default ErroredMessageComponent;
