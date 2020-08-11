import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers';

const useStyles = makeStyles({
  inTrial: {
    marginTop: -2,
  },
});

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
        classes.inTrial
      }
      variant="contained"
      color="secondary"
      onClick={handleClick}>
      {licenseActionDetails.label}
    </Button>
  );
}
