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

const useStyles = makeStyles(theme => ({
  titleStatusPanel: {
    fontSize: 15,
  },
  licenseActionDetailsWrapper: {
    background: 'none',
    border: '1px solid',
    minHeight: 'unset',
    boxShadow: 'none',
    maxWidth: 'unset',
    '&:before': {
      display: 'none',
    },
    '& > * svg': {
      fontSize: '17px !important',
      alignSelf: 'center',
    },
    '& > div:first-child': {
      padding: 0,
      width: '100%',
    },
  },
  licenseActionInfoWrapper: {
    borderColor: theme.palette.primary.main,
  },
  licenseActionErrorWrapper: {
    borderColor: theme.palette.error.main,
  },
}));

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

      return dispatch(actions.user.org.accounts.requestTrialLicense());
    }

    if (licenseActionDetails.action === 'upgrade') {
      setUpgradeRequested(true);

      return dispatch(actions.user.org.accounts.requestLicenseUpgrade());
    }
    if (licenseActionDetails.action === 'resume') {
      setUpgradeRequested(true);

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
        <NotificationToaster
          variant={licenseActionDetails.action === 'expired' ? 'error' : 'info'} className={clsx(classes.licenseActionDetailsWrapper,
            {[classes.licenseActionErrorWrapper]: licenseActionDetails.action === 'expired'},
            {[classes.licenseActionInfoWrapper]: licenseActionDetails.action !== 'expired' })}>

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
          data-test={licenseActionDetails.label}
          onClick={handleClick}>
          {licenseActionDetails.label}
        </PillButton>
      )}
    </>
  );
}

export default function LicenseActionMemo() {
  return useMemo(() => <LicenseAction />, []);
}
