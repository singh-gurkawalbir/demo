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

const useStyles = makeStyles(theme => ({
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
  startFreeTrialOptions: {
    paddingLeft: theme.spacing(2),
    '& > li': {
      paddingBottom: theme.spacing(0.5),
    },
  },
  hideElement: {
    display: 'none',
  },
}));

function StartFreeTrialConfirmationMessage() {
  const classes = useStyles();

  return (
    <div>
      You are currently enrolled in the free subscription plan that entitles you to 1 enabled integration flow between 2 endpoints.
      <br /><br />
      <b>Start your free trial now to experience optimal process automation for your business with full access to integrator.io. For 30 days, the unlimited flows trial gives you: </b>
      <br />

      <ul className={classes.startFreeTrialOptions}>
        <li>Unlimited integration flows, endpoint apps, trading partners, and on-premise agents</li>
        <li>Easy installation of Integration Apps and free templates from our vast library</li>
        <li>Integrations with multiple imports or exports (orchestration)</li>
        <li>Ad hoc data imports to thousands of applications</li>
        <li>Ability to daisy-chain flows.</li>
      </ul>

      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://docs.celigo.com/hc/en-us/articles/4414582961819-Learn-how-to-make-the-most-of-your-free-trial">
        Learn how to make the most of your free trial
      </a>

      <br /><br />
      After 30 days, your plan will revert to the free subscription plan with 1 enabled integration flow.
    </div>
  );
}

function SubscriptionOrFreeConfirmMessage() {
  const classes = useStyles();

  return (
    <div>
      <b>You cannot enable more than one flow at a time with your current free subscription plan.</b>
      <br /><br />
      Start your free trial or upgrade your plan to unlock your data integration potential with more flows.
      <br /> <br />
      <b>FREE UNLIMITED FLOWS TRIAL</b>
      <br /> <br />
      Experience optimal process automation for your business with full access to integrator.io. For 30 days, you will get:
      <ul className={classes.startFreeTrialOptions}>
        <li>Unlimited integration flows, endpoint apps, trading partners, and on-premise agents</li>
        <li>Easy installation of Integration Apps and free templates from our vast library</li>
        <li>Integrations with multiple imports or exports (orchestration)</li>
        <li>Ad hoc data imports to thousands of applications</li>
        <li>Ability to daisy-chain flows.</li>
      </ul>

      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://docs.celigo.com/hc/en-us/articles/4414582961819-Learn-how-to-make-the-most-of-your-free-trial">
        Learn how to make the most of your free trial
      </a>

      <br /><br />
      After 30 days, your plan will revert to the free subscription plan with 1 enabled integration flow.
    </div>
  );
}
function LicenseAction() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {confirmDialog} = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const [upgradeButton, setUpgradeButton] = useState(true);
  const [subscriptionRenew, setSubscriptionRenew] = useState(true);
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
  href="/marketplace"><u>Check out our Marketplace</u></a> to jumpstart your integrations with Integration Apps, Business Process Automation templates, and quickstart templates.`;

    confirmDialog({
      title: 'Congratulations! Your unlimited flows trial starts now.',
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
            setUpgradeButton(false);
            dispatch(actions.license.requestLicenseUpgrade());
          },
        },
        { label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch, setUpgradeButton]);

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

  const startFreeTrialConfirmationDialog = useCallback(() => {
    confirmDialog({
      title: 'Try unlimited flows free for 30 days',
      message: <StartFreeTrialConfirmationMessage />,
      buttons: [
        { label: 'Start free trial now',
          onClick: () => {
            dispatch(
              actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
            );
            dispatch(actions.license.requestTrialLicense());
            startFreeTrialDialog();
          },
        },
        { label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  }, [confirmDialog, dispatch, startFreeTrialDialog]);

  const subscriptionOrFreeTrialDialog = useCallback(() => {
    confirmDialog({
      title: 'Try unlimited flows free for 30 days or upgrade plan',
      message: <SubscriptionOrFreeConfirmMessage />,
      buttons: [
        { label: 'Start free trial',
          onClick: () => {
            dispatch(
              actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
            );
            dispatch(actions.license.requestTrialLicense());
            startFreeTrialDialog();
          },
        },
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
  }, [confirmDialog, dispatch, startFreeTrialDialog, submitUpgradeDialog]);

  const handleClick = useCallback(() => {
    if (licenseActionDetails.action === 'startTrial') {
      return startFreeTrialConfirmationDialog();
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
              setSubscriptionRenew(false);
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
  }, [confirmDialog, dispatch, licenseActionDetails.action, startFreeTrialConfirmationDialog, submitUpgradeDialog]);

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
        subscriptionOrFreeTrialDialog();
      } else {
        requestUpgradeDialog();
      }
      dispatch(actions.license.clearErrorMessage());
    } else if (licenseErrorCode === 'entitlement_reached') {
      entitlementOfEndpointsDialog();
      dispatch(actions.license.clearErrorMessage());
    }
  }, [dispatch, entitlementOfEndpointsDialog, licenseActionDetails.action, licenseErrorCode, requestUpgradeDialog, subscriptionOrFreeTrialDialog]);

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
          className={clsx(classes.licenseActionDetailsWrapper, {[classes.hideElement]: subscriptionRenew === false})}>
          <Typography component="div" variant="body2" className={classes.titleStatusPanel}>
            {licenseActionDetails.action === 'expired' ? 'Your subscription has expired.' : 'Your subscription was renewed.'}
          </Typography>
          <TextButton
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
          className={clsx(classes.inTrial, {[classes.hideElement]: upgradeButton === false})}
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
