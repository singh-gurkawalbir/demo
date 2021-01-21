import React, { useCallback, useEffect, Fragment } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import ErrorIcon from '../../../components/icons/ErrorIcon';

const useStyles = makeStyles(theme => ({
  inTrial: {
    marginTop: -2,
  },
  wrapper: {
    marginTop: -2,
    display: 'flex',
    flexDirection: 'row',
    borderColor: theme.palette.error.main,
    border: '1px solid',
    borderRadius: 5,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  titleStatusPanel: {
    margin: 'auto',
  },
  renewNowBtn: {
    color: theme.palette.primary.main,
  },
  icon: {

  },
}));

export default function LicenseAction() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const licenseActionDetails = useSelector(
    state => selectors.platformLicenseActionDetails(state),
    (left, right) =>
      left.action === right.action &&
      left.label === right.label &&
      left.upgradeRequested === right.upgradeRequested
  );
  const platformLicenseActionMessage = useSelector(state =>
    selectors.platformLicenseActionMessage(state)
  );

  useEffect(() => {
    if (platformLicenseActionMessage) {
      enquesnackbar({ message: platformLicenseActionMessage });
    }
  }, [enquesnackbar, platformLicenseActionMessage]);
  const canRequestUpgrade = useSelector(
    state =>
      selectors.resourcePermissions(state, 'subscriptions').requestUpgrade
  );
  const handleClick = useCallback(() => {
    if (licenseActionDetails.action === 'startTrial') {
      dispatch(
        actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
      );

      return dispatch(actions.user.org.accounts.requestTrialLicense());
    }

    if (licenseActionDetails.action === 'upgrade') {
      return dispatch(actions.user.org.accounts.requestLicenseUpgrade());
    }
    if (licenseActionDetails.action === 'resume') {
      return dispatch(actions.user.org.accounts.requestUpdate('ioResume'));
    }
    if (licenseActionDetails.action === 'expired') {
      return dispatch(actions.user.org.accounts.requestUpdate('ioRenewal'));
    }
  }, [dispatch, licenseActionDetails.action]);

  if (
    !licenseActionDetails ||
    !licenseActionDetails.action ||
    licenseActionDetails.upgradeRequested ||
    !canRequestUpgrade
  ) {
    return null;
  }

  return (
    <>
      {['resume', 'expired'].includes(licenseActionDetails.action) ? (
        <div className={classes.wrapper}>
          <ErrorIcon className={classes.icon} />
          <Typography component="div" variant="subtitle2" className={classes.titleStatusPanel}>
            {licenseActionDetails.action === 'expired' ? 'Your subscription has expired.' : 'Your license was renewed.'}
          </Typography>
          <Button
            data-test="renewOrResumeNow"
            className={classes.renewNowBtn}
            onClick={handleClick}>
            {licenseActionDetails.action === 'expired' ? 'Renew now' : 'Reactivate now'}
          </Button>
        </div>
      ) : (
        <Button
          data-test={licenseActionDetails.label}
          className={classes.inTrial}
          variant="contained"
          color="secondary"
          onClick={handleClick}>
          {licenseActionDetails.label}
        </Button>
      )}
    </>
  );
}
