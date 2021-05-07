import React from 'react';
import { useSelector } from 'react-redux';
import { FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '../../../../icons/ErrorIcon';
import SuccessIcon from '../../../../icons/SuccessIcon';
import { selectors } from '../../../../../reducers';
import Spinner from '../../../../Spinner';

const useStyles = makeStyles(theme => ({
  message: {
    position: 'relative',
    top: theme.spacing(-2),
    display: 'flex',
    alignItems: 'center',
  },
  successIcon: {
    marginRight: 3,
    fontSize: theme.spacing(2),
    color: theme.palette.success.main,
  },
  errorIcon: {
    marginRight: 3,
    fontSize: theme.spacing(2),
  },
  spinner: {
    marginRight: theme.spacing(1),
  },
}));

export default function VerifyTag({ error }) {
  const classes = useStyles();
  const validationInProgress = useSelector(state => selectors.orgIdValidationInProgress(state));
  const validationSuccess = useSelector(state => selectors.orgIdValidationSuccess(state));

  if (validationInProgress) {
    return (
      <FormHelperText className={classes.message}>
        <Spinner className={classes.spinner} size={10} /> Verifying
      </FormHelperText>
    );
  }
  if (error) {
    return (
      <FormHelperText error className={classes.message}>
        <ErrorIcon className={classes.errorIcon} /> {error}
      </FormHelperText>
    );
  }
  if (validationSuccess) {
    return (
      <FormHelperText className={classes.message}>
        <SuccessIcon className={classes.successIcon} /> Verified
      </FormHelperText>
    );
  }

  return null;
}
