import React, { useCallback, useEffect, Fragment, useState, useMemo } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import NotificationToaster from '../../../components/NotificationToaster';
import { platformLicenseActionDetails } from '../../../utils/license';
import {PillButton, TextButton} from '../../../components/Buttons';

const useStyles = makeStyles({
  inTrial: {
    marginTop: -2,
    borderRadius: 17,
    fontSize: 13,
    padding: '4px 16px',
    fontFamily: 'source sans pro semibold',
  },
  inTrialDaysLeft: {
    fontFamily: 'source sans pro',
    paddingLeft: 3,
  },
  titleStatusPanel: {
    fontSize: 15,
  },
});

function LicenseAction() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const platformLicense = useSelector(state => selectors.platformLicense(state));
  const licenseActionDetails = platformLicenseActionDetails(platformLicense);
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

      return dispatch(actions.license.requestTrialLicense());
    }

    if (licenseActionDetails.action === 'upgrade') {
      setUpgradeRequested(true);

      return dispatch(actions.license.requestLicenseUpgrade());
    }
    if (licenseActionDetails.action === 'resume') {
      setUpgradeRequested(true);

      return dispatch(actions.license.requestUpdate('ioResume'));
    }
    if (licenseActionDetails.action === 'expired') {
      return dispatch(actions.license.requestUpdate('ioRenewal'));
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
        <NotificationToaster
          variant={licenseActionDetails.action === 'expired' ? 'error' : 'info'}
          transparent
          className={clsx(classes.licenseActionDetailsWrapper)}>
          <Typography component="div" variant="body2" className={classes.titleStatusPanel}>
            {licenseActionDetails.action === 'expired' ? 'Your subscription has expired.' : 'Your subscription was renewed.'}
          </Typography>
          <TextButton
            disabled={upgradeRequested}
            data-test="renewOrResumeNow"
            color="primary"
            onClick={handleClick}>
            {licenseActionDetails.action === 'expired' ? 'Renew now.' : 'Reactivate.'}
          </TextButton>

        </NotificationToaster>
      ) : (
        <PillButton
          fill
          disableElevation
          className={classes.inTrial}
          data-test={licenseActionDetails.label}
          onClick={handleClick}>
          {licenseActionDetails.label}
          <span className={classes.inTrialDaysLeft}>{licenseActionDetails.daysLeft}</span>
        </PillButton>
      )}
    </>
  );
}

export default function LicenseActionMemo() {
  return useMemo(() => <LicenseAction />, []);
}
