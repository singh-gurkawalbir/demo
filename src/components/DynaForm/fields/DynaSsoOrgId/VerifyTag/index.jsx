import React from 'react';
import { useSelector } from 'react-redux';
import { FormHelperText } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import ErrorIcon from '../../../../icons/ErrorIcon';
import SuccessIcon from '../../../../icons/SuccessIcon';
import { selectors } from '../../../../../reducers';

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

export default function VerifyTag({ error }) {
  const classes = useStyles();
  const validationInProgress = useSelector(state => selectors.orgIdValidationInProgress(state));
  const validationSuccess = useSelector(state => selectors.orgIdValidationSuccess(state));

  if (validationInProgress) {
    return (
      <FormHelperText className={classes.message}>
        <Spinner size="small" /> Verifying...
      </FormHelperText>
    );
  }
  if (error) {
    return (
      <FormHelperText error className={classes.message}>
        <ErrorIcon className={classes.errorIcon} data-private /> {error}
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
