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
import useConfirmDialog from '../../../components/ConfirmDialog';
import RawHtml from '../../../components/RawHtml';
import messageStore from '../../../utils/messageStore';

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

function StartFreeTrialConfirmationMessage() {
  return (
    <div>
      <b>You cannot enable more than one flow at a time with your current free subscription plan.</b>
      <br /><br />Start your free trial or upgrade your plan to unlock your data integration potential with more flows.
      <br /><br /><b>FREE UNLIMITED FLOWS TRIAL </b>

      <br /><br />Experience optimal process automation for your business with full access to integratior.io.
      For 30 days, you will get:
      <ul><li>Unlimited integration flows, endpoint apps, trading partners, and on-premise agents</li>
        <li>Easy installation of Integration Apps and free templates from our vast library</li>
        <li>Integrations with multiple imports or exports (orchestration)</li>
        <li>Ad hoc data imports to thousands of applications</li>
        <li>Ability to daisy-chain flows.</li>
      </ul>

      <br />
      <a
        target="_blank" rel="noopener noreferrer"
        href="https://docs.celigo.com/hc/en-us/articles/4414582961819-Learn-how-to-make-the-most-of-your-free-trial"><u>Learn how to make the most of your free trial </u>
      </a>

      <br /><br />After 30 days, your plan will revert to the free subscription plan with 1 enabled integration flow.
    </div>
  );
}
function LicenseAction() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {confirmDialog} = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const platformLicense = useSelector(state => selectors.platformLicense(state));
  const licenseActionDetails = platformLicenseActionDetails(platformLicense);
  const platformLicenseActionMessage = useSelector(state =>
    selectors.platformLicenseActionMessage(state)
  );
  const licenseErrorCode = useSelector(state =>
    selectors.licenseErrorCode(state)
  );

  const canRequestUpgrade = useSelector(
    state =>
      selectors.resourcePermissions(state, 'subscriptions').requestUpgrade
  );

  const startFreeTrialDialog = useCallback(() => {
    const message = `What will you integrate next?
      <br/><br/><a target="_blank" rel="noopener noreferrer"
  href="/marketplace"><u>Checkout our Marketplace</u></a>  Integration Apps, templates for business process automation, and quickstart integration templates.`;

    confirmDialog({
      title: 'Congratulations! Your unlimited flows trial starts now',
      message: <RawHtml html={message} />,
      buttons: [
        { label: 'Close',
        },
      ],
    });
  }, [confirmDialog]);

  const submitUpgradeDialog = useCallback(() => {
    confirmDialog({
      title: 'Request upgrade',
      message: 'We will contact you to discuss your business needs and recommend an ideal subscription plan.',
      buttons: [
        { label: 'Submit request',
          onClick: () => {
            setUpgradeRequested(true);
            dispatch(actions.license.requestLicenseUpgrade());
          },
        },
        { label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch]);
  const requestUpgradeDialog = useCallback(() => {
    confirmDialog({
      title: 'Upgrade plan',
      message: 'You cannot enable more than one flow at a time with your current free subscription plan. Upgrade to unlock your data integration potential with more flows.',
      buttons: [
        { label: 'Request upgrade',
          onClick: () => {
            submitUpgradeDialog();
          },
        },
        { label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, submitUpgradeDialog]);

  const handleClick = useCallback(() => {
    if (licenseActionDetails.action === 'startTrial') {
      dispatch(
        actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
      );
      dispatch(actions.license.requestTrialLicense());

      return startFreeTrialDialog();
    }

    if (licenseActionDetails.action === 'upgrade') {
      return submitUpgradeDialog();
    }
    if (licenseActionDetails.action === 'resume') {
      return confirmDialog({
        title: 'Request to reactivate subscription',
        message: 'We will contact you to reactivate your subscription.',
        buttons: [
          {
            label: 'Submit request',
            onClick: () => {
              setUpgradeRequested(true);
              dispatch(actions.license.requestUpdate('ioResume'));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }
    if (licenseActionDetails.action === 'expired') {
      confirmDialog({
        title: 'Request to renew subscription',
        message: 'We will contact you to renew your subscription.',
        buttons: [
          {
            label: 'Submit request',
            onClick: () => {
              dispatch(actions.license.requestUpdate('ioRenewal'));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }
  }, [confirmDialog, dispatch, licenseActionDetails.action, startFreeTrialDialog, submitUpgradeDialog]);

  const startFreeTrialConfirmationDialog = useCallback(() => {
    confirmDialog({
      title: 'Try unlimited flows free for 30 days or upgrade plan',
      message: <StartFreeTrialConfirmationMessage />,
      buttons: [
        { label: 'Start free trial',
          onClick: () => {
            dispatch(actions.license.requestTrialLicense());
            startFreeTrialDialog();
          },
        },
        { label: 'Request upgrade',
          onClick: requestUpgradeDialog,
        },
        { label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch, requestUpgradeDialog, startFreeTrialDialog]);

  const entitlementOfEndpointsDialog = useCallback(() => {
    confirmDialog({
      title: 'Upgrade plan',
      message: 'You have reached the entitlement of endpoints for your free subscription. Upgrade to unlock your data integration potential with more endpoints.',
      buttons: [
        { label: 'Request upgrade',
          onClick: () => {
            submitUpgradeDialog();
          },
        },
        { label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, submitUpgradeDialog]);

  useEffect(() => {
    if (licenseErrorCode === 'subscription_required') {
      if (licenseActionDetails.action === 'startTrial') {
        startFreeTrialConfirmationDialog();
      } else {
        requestUpgradeDialog();
      }
      dispatch(actions.license.clearErrorMessage());
    } else if (licenseErrorCode === 'entitlement_reached') {
      entitlementOfEndpointsDialog();
      dispatch(actions.license.clearErrorMessage());
    }
  }, [dispatch, entitlementOfEndpointsDialog, licenseActionDetails.action, licenseErrorCode, requestUpgradeDialog, startFreeTrialConfirmationDialog]);

  useEffect(() => {
    if (platformLicenseActionMessage) {
      enquesnackbar({message: <RawHtml html={messageStore('LICENSE_UPGRADE_SUCCESS_MESSAGE')} />, variant: 'success'});
      dispatch(actions.license.clearActionMessage());
    }
  }, [dispatch, enquesnackbar, platformLicenseActionMessage]);

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
            {licenseActionDetails.action === 'expired' ? 'Request to renew now.' : 'Request to reactivate.'}
          </TextButton>

        </NotificationToaster>
      ) : (
        <PillButton
          fill={!upgradeRequested}
          disableElevation
          disabled={upgradeRequested}
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
