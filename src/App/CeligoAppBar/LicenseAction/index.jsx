import React, { useCallback, useEffect, Fragment, useState, useMemo } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { PillButton } from '@celigo/fuse-ui';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import NotificationToaster from '../../../components/NotificationToaster';
import { platformLicenseActionDetails } from '../../../utils/license';
import { TextButton } from '../../../components/Buttons';
import useConfirmDialog from '../../../components/ConfirmDialog';
import RawHtml from '../../../components/RawHtml';
import messageStore, { message } from '../../../utils/messageStore';
import {
  LICENSE_REACTIVATED_MESSAGE,
  LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE,
  REQUEST_UPGRADE_SUCCESS_MESSAGE,
} from '../../../constants';

const useStyles = makeStyles(theme => ({
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
      You are currently enrolled in the free subscription plan that entitles you
      to 1 enabled integration flow between 2 endpoints.
      <br />
      <br />
      <b>
        Start your free trial now to experience optimal process automation for
        your business with full access to integrator.io. For 30 days, the
        unlimited flows trial gives you:{' '}
      </b>
      <br />
      <ul className={classes.startFreeTrialOptions}>
        <li>
          Unlimited integration flows, endpoint apps, trading partners, and
          on-premise agents
        </li>
        <li>Ability to enable unlimited flows in Marketplace templates</li>
        <li>Integrations with multiple imports or exports (orchestration)</li>
        <li>Ad hoc data imports to thousands of applications</li>
        <li>Ability to daisy-chain flows</li>
      </ul>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://docs.celigo.com/hc/en-us/articles/4414582961819-Learn-how-to-make-the-most-of-your-free-trial"
      >
        Learn how to make the most of your free trial
      </a>
      <br />
      <br />
      After 30 days, your plan will revert to the free subscription plan with 1
      enabled integration flow.
    </div>
  );
}

function StartFreeOrRequestUpgradeConfirmMessage() {
  const classes = useStyles();

  return (
    <div>
      <b>
        You cannot enable more than one flow at a time with your current free
        subscription plan.
      </b>
      <br />
      <br />
      Start your free trial or upgrade your plan to unlock your data integration
      potential with more flows.
      <br /> <br />
      <b>FREE UNLIMITED FLOWS TRIAL</b>
      <br /> <br />
      Experience optimal process automation for your business with full access
      to integrator.io. For 30 days, you will get:
      <ul className={classes.startFreeTrialOptions}>
        <li>
          Unlimited integration flows, endpoint apps, trading partners, and
          on-premise agents
        </li>
        <li>Ability to enable unlimited flows in Marketplace templates</li>
        <li>Integrations with multiple imports or exports (orchestration)</li>
        <li>Ad hoc data imports to thousands of applications</li>
        <li>Ability to daisy-chain flows</li>
      </ul>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://docs.celigo.com/hc/en-us/articles/4414582961819-Learn-how-to-make-the-most-of-your-free-trial"
      >
        Learn how to make the most of your free trial
      </a>
      <br />
      <br />
      After 30 days, your plan will revert to the free subscription plan with 1
      enabled integration flow.
    </div>
  );
}
function LicenseAction() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const [upgradeButton, setUpgradeButton] = useState(true);
  const [subscriptionRenew, setSubscriptionRenew] = useState(true);
  const platformLicense = useSelector(state =>
    selectors.platformLicense(state)
  );
  const licenseActionDetails = platformLicenseActionDetails(platformLicense);
  const platformLicenseActionMessage = useSelector(state =>
    selectors.platformLicenseActionMessage(state)
  );
  const licenseErrorCode = useSelector(state =>
    selectors.licenseErrorCode(state)
  );
  const licenseErrorMessage = useSelector(
    state => selectors.licenseErrorMessage(state)
  );

  const canRequestUpgrade = useSelector(
    state =>
      selectors.resourcePermissions(state, 'subscriptions').requestUpgrade
  );

  const startFreeTrialDialog = useCallback(() => {
    const messageStartFree = message.SUBSCRIPTION.LICENSE_TRIAL_ISSUED;

    confirmDialog({
      title: message.SUBSCRIPTION.UNLIMITED_FLOWS_START,
      message: <RawHtml html={messageStartFree} />,
      buttons: [{ label: 'Close' }],
    });
  }, [confirmDialog]);

  const submitUpgradeDialog = useCallback(() => {
    confirmDialog({
      title: 'Request upgrade',
      message: messageStore('SUBSCRIPTION.CONTACT_FOR_BUSINESS_NEEDS', {
        plan: 'ideal',
      }),
      buttons: [
        {
          label: 'Submit request',
          onClick: () => {
            setUpgradeButton(false);
            dispatch(actions.license.requestLicenseUpgrade());
          },
        },
        { label: 'Cancel', variant: 'text' },
      ],
    });
  }, [confirmDialog, dispatch, setUpgradeButton]);

  const requestUpgradeDialog = useCallback(() => {
    confirmDialog({
      title: 'Upgrade plan',
      message: message.FLOWS.YOU_CANNOT_ENABLE_MORE_THAN_ONE_FLOW,
      buttons: [
        {
          label: 'Request upgrade',
          onClick: () => {
            submitUpgradeDialog();
          },
        },
        { label: 'Cancel', variant: 'text' },
      ],
    });
  }, [confirmDialog, submitUpgradeDialog]);

  const startFreeTrialConfirmationDialog = useCallback(() => {
    confirmDialog({
      title: message.SUBSCRIPTION.TRY_FULL_ACCESS,
      message: <StartFreeTrialConfirmationMessage />,
      buttons: [
        {
          label: 'Start free trial now',
          onClick: () => {
            dispatch(
              actions.analytics.gainsight.trackEvent(
                'GO_UNLIMITED_BUTTON_CLICKED'
              )
            );
            dispatch(actions.license.requestTrialLicense());
            startFreeTrialDialog();
          },
        },
        { label: 'Cancel', variant: 'text' },
      ],
    });
  }, [confirmDialog, dispatch, startFreeTrialDialog]);

  const startFreeOrRequestUpgradeDialog = useCallback(() => {
    confirmDialog({
      title: 'Try full access free for 30 days or upgrade plan',
      message: <StartFreeOrRequestUpgradeConfirmMessage />,
      buttons: [
        {
          label: 'Start free trial',
          onClick: () => {
            dispatch(
              actions.analytics.gainsight.trackEvent(
                'GO_UNLIMITED_BUTTON_CLICKED'
              )
            );
            dispatch(actions.license.requestTrialLicense());
            startFreeTrialDialog();
          },
        },
        {
          label: 'Request upgrade',
          onClick: () => {
            submitUpgradeDialog();
          },
        },
        { label: 'Cancel', variant: 'text' },
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
      setUpgradeRequested(true);

      return dispatch(actions.license.requestUpdate('ioResume', {}));
    }
    if (licenseActionDetails.action === 'expired') {
      confirmDialog({
        title: 'Request to renew subscription',
        message: message.SUBSCRIPTION.CONTACT_TO_RENEW,
        buttons: [
          {
            label: 'Submit request',
            onClick: () => {
              setSubscriptionRenew(false);
              dispatch(actions.license.requestUpdate('ioRenewal', {}));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }
  }, [
    confirmDialog,
    dispatch,
    licenseActionDetails.action,
    startFreeTrialConfirmationDialog,
    submitUpgradeDialog,
  ]);

  const entitlementOfEndpointsDialog = useCallback(() => {
    confirmDialog({
      title: 'Upgrade plan',
      message: licenseErrorMessage,
      buttons: [
        {
          label: 'Request upgrade',
          onClick: () => {
            submitUpgradeDialog();
          },
        },
        { label: 'Cancel', variant: 'text' },
      ],
    });
  }, [confirmDialog, licenseErrorMessage, submitUpgradeDialog]);

  useEffect(() => {
    if (licenseErrorCode === 'subscription_required') {
      if (licenseActionDetails.action === 'startTrial') {
        startFreeOrRequestUpgradeDialog();
      } else {
        requestUpgradeDialog();
      }
      dispatch(actions.license.clearErrorMessage());
    } else if (licenseErrorCode === 'entitlement_reached') {
      entitlementOfEndpointsDialog();
      dispatch(actions.license.clearErrorMessage());
    }
  }, [
    dispatch,
    entitlementOfEndpointsDialog,
    licenseActionDetails.action,
    licenseErrorCode,
    requestUpgradeDialog,
    startFreeOrRequestUpgradeDialog,
  ]);

  useEffect(() => {
    if (
      platformLicenseActionMessage === LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE
    ) {
      enquesnackbar({
        message: (
          <RawHtml
            html={message.SUBSCRIPTION.LICENSE_UPGRADE_SUCCESS_MESSAGE}
          />
        ),
        variant: 'success',
      });
      dispatch(actions.license.clearActionMessage());
    } else if (platformLicenseActionMessage === LICENSE_REACTIVATED_MESSAGE) {
      enquesnackbar({ message: LICENSE_REACTIVATED_MESSAGE });
      dispatch(actions.license.clearActionMessage());
    } else if (
      platformLicenseActionMessage === REQUEST_UPGRADE_SUCCESS_MESSAGE
    ) {
      enquesnackbar({
        message: (
          <RawHtml
            html={message.SUBSCRIPTION.REQUEST_UPGRADE_SUCCESS_MESSAGE}
          />
        ),
        variant: 'success',
      });
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
          className={clsx(classes.licenseActionDetailsWrapper, {
            [classes.hideElement]: subscriptionRenew === false,
          })}
        >
          <Typography
            component="div"
            variant="body2"
            className={classes.titleStatusPanel}
          >
            {licenseActionDetails.action === 'expired'
              ? 'Your subscription has expired.'
              : 'Your subscription was renewed.'}
          </Typography>
          <TextButton
            data-test="renewOrResumeNow"
            color="primary"
            onClick={handleClick}
          >
            {licenseActionDetails.action === 'expired'
              ? 'Request to renew now.'
              : 'Reactivate.'}
          </TextButton>
        </NotificationToaster>
      ) : (
        <PillButton
          filled={!upgradeRequested}
          className={clsx({
            [classes.hideElement]: upgradeButton === false,
          })}
          data-test={licenseActionDetails.label}
          id={licenseActionDetails.id}
          onClick={handleClick}
        >
          {licenseActionDetails.label}
          <span className={classes.inTrialDaysLeft}>
            {licenseActionDetails.daysLeft}
          </span>
        </PillButton>
      )}
    </>
  );
}

export default function LicenseActionMemo() {
  return useMemo(() => <LicenseAction />, []);
}
