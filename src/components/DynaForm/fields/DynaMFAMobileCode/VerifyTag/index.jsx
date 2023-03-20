import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormHelperText } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ErrorIcon from '../../../../icons/ErrorIcon';
import SuccessIcon from '../../../../icons/SuccessIcon';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  message: {
    position: 'relative',
    top: theme.spacing(-1),
    display: 'flex',
    alignItems: 'center',
    lineHeight: theme.spacing(2),
    color: theme.palette.secondary.light,
    marginBottom: theme.spacing(1),
    '& > div': {
      marginRight: theme.spacing(0.5),
      height: theme.spacing(2),
    },
  },
  successIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: theme.spacing(2),
    color: theme.palette.success.main,
  },
  errorIcon: {
    marginRight: theme.spacing(0.5),
    fontSize: theme.spacing(2),
  },
}));

export default function VerifyTag({ isValid }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const verificationSuccess = useSelector(selectors.isMobileCodeVerified);
  const verificationFailed = useSelector(selectors.isMobileCodeVerificationFailed);

  useEffect(() => {
    if (!isValid) {
      // Field validations take precedence when isValid is false for form field
      dispatch(actions.mfa.resetMobileCodeStatus());
    }
  }, [isValid, dispatch]);

  if (verificationFailed) {
    return (
      <FormHelperText error className={classes.message}>
        <ErrorIcon className={classes.errorIcon} data-private /> Verification failed. Try entering the 6-digit code again.
      </FormHelperText>
    );
  }
  if (verificationSuccess) {
    return (
      <FormHelperText className={classes.message}>
        <SuccessIcon className={classes.successIcon} /> Verification successful
      </FormHelperText>
    );
  }

  return null;
}
