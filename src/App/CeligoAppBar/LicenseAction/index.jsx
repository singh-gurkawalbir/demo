import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(theme => ({
  inTrial: {
    marginBottom: theme.spacing(0.5),
  },
  expiresSoon: {
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function LicenseAction() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const licenseActionDetails = useSelector(
    state => selectors.integratorLicenseActionDetails(state),
    (left, right) =>
      left.action === right.action &&
      left.label === right.label &&
      left.upgradeRequested === right.upgradeRequested
  );
  const integratorLicenseActionMessage = useSelector(state =>
    selectors.integratorLicenseActionMessage(state)
  );

  useEffect(() => {
    if (integratorLicenseActionMessage) {
      enquesnackbar({ message: integratorLicenseActionMessage });
    }
  }, [enquesnackbar, integratorLicenseActionMessage]);
  const canRequestUpgrade = useSelector(
    state => {
      const permissions = selectors.userPermissions(state);

      return (
        permissions &&
        permissions.subscriptions &&
        permissions.subscriptions.requestUpgrade
      );
    },
    (left, right) => left === right
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
    <Button
      data-test={licenseActionDetails.label}
      className={
        licenseActionDetails.expiresSoon ? classes.expiresSoon : classes.inTrial
      }
      variant="contained"
      color="secondary"
      onClick={handleClick}>
      {licenseActionDetails.label}
    </Button>
  );
}
