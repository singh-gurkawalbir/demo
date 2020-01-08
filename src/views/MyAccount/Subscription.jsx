import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, LinearProgress, Drawer } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import actions from '../../actions';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import DrawerTitleBar from '../../components/drawer/TitleBar';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  transferButton: {
    margin: theme.spacing(1),
    textAlign: 'center',
    float: 'right',
  },
  wrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    width: '100%',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  linearProgressWrapper: {
    marginTop: theme.spacing(1),
  },
  itemsList: {
    marginTop: theme.spacing(1),
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    marginBottom: 0,
    '& li': {
      float: 'left',
      paddingRight: theme.spacing(1),
      marginRight: theme.spacing(1),
      borderRight: `1px solid ${theme.palette.secondary.light}`,
      fontSize: 15,
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
  subHeading: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  heading: {
    textAlign: 'left',
    marginBottom: theme.spacing(3),
  },
  bold: {
    fontWeight: 'bold',
  },
  block: {
    marginBottom: theme.spacing(3),
  },
  linkCompare: {
    marginLeft: theme.spacing(2),
  },
  headingMaster: {
    fontSize: theme.spacing(4),
    fontWeight: 'bold',
    textAlign: 'left',
    padding: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(2),
  },

  drawerPaper: {
    width: 600,
    padding: theme.spacing(1),
  },

  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  link: {
    marginTop: theme.spacing(2),
    fontSize: theme.spacing(2),
  },

  footer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function Subscription() {
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const licenseActionDetails = useSelector(state =>
    selectors.integratorLicenseWithMetadata(state)
  );
  const integratorLicense = useSelector(state =>
    selectors.integratorLicense(state)
  );
  const diyLicense = useSelector(state => selectors.diyLicense(state));
  const [showStartFreeDialog, setShowStartFreeDialog] = useState(false);
  const classes = useStyles();
  const getNumEnabledFlows = useCallback(() => {
    dispatch(actions.user.org.accounts.requestNumEnabledFlows());
  }, [dispatch]);

  useEffect(() => {
    if (integratorLicense) {
      getNumEnabledFlows();
    }
  }, [getNumEnabledFlows, integratorLicense]);
  const { numEnabledPaidFlows, numEnabledSandboxFlows } = useSelector(
    state => selectors.getNumEnabledFlows(state),
    (left, right) =>
      left.numEnabledPaidFlows === right.numEnabledPaidFlows &&
      left.numEnabledSandboxFlows === right.numEnabledSandboxFlows &&
      left.numEnabledFreeFlows === right.numEnabledFreeFlows
  );
  const productionRemainingFlows = Math.max(
    licenseActionDetails.totalFlowsAvailable - numEnabledPaidFlows,
    0
  );
  const sandboxRemainingFlows = Math.max(
    licenseActionDetails.totalSandboxFlowsAvailable - numEnabledSandboxFlows,
    0
  );
  let productionConsumedFlowsPercentage = 100;

  if (licenseActionDetails.totalFlowsAvailable > 0) {
    productionConsumedFlowsPercentage = Math.floor(
      (numEnabledPaidFlows * 100) / licenseActionDetails.totalFlowsAvailable
    );
  }

  let sandboxConsumedFlowsPercentage = 100;

  if (licenseActionDetails.totalSandboxFlowsAvailable > 0) {
    sandboxConsumedFlowsPercentage = Math.floor(
      (numEnabledSandboxFlows * 100) /
        licenseActionDetails.totalSandboxFlowsAvailable
    );
  }

  const onStartFreeTrialInterestedClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );

    return dispatch(actions.user.org.accounts.requestTrialLicense());
  }, [dispatch]);
  const onStartFreeTrialClick = useCallback(() => {
    setShowStartFreeDialog(true);
  }, []);
  const onRequestSubscriptionClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );

    return dispatch(actions.user.org.accounts.requestUpdate('upgrade'));
  }, [dispatch]);
  const onRequestUpgradeClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );

    return dispatch(actions.user.org.accounts.requestUpdate('upgrade'));
  }, [dispatch]);
  const onRequestTrialExtensionClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );

    return dispatch(actions.user.org.accounts.requestUpdate('reTrial'));
  }, [dispatch]);
  const integratorLicenseActionMessage = useSelector(state =>
    selectors.integratorLicenseActionMessage(state)
  );

  useEffect(() => {
    if (integratorLicenseActionMessage) {
      enquesnackbar({ message: integratorLicenseActionMessage });
    }
  }, [enquesnackbar, integratorLicenseActionMessage]);
  const onDrawerClose = useCallback(() => {
    setShowStartFreeDialog(false);
  }, []);

  return (
    <Fragment>
      <Drawer
        anchor="right"
        open={showStartFreeDialog}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <DrawerTitleBar
          onClose={onDrawerClose}
          title="Upgrade your subscription"
        />
        <div className={classes.content}>
          <Typography variant="body1" className={classes.block}>
            You are currently on the Free Edition of integrator.io, which gives
            you one active flow at any given time. Upgrade to one of our paid
            subscriptions and unlock multiple flow activation to fulfill all
            your integration needs.
          </Typography>

          <div className={classes.footer}>
            <div>
              <Button
                variant="outlined"
                color="primary"
                onClick={onStartFreeTrialInterestedClick}>
                YES, I &apos;M INTERESTED
              </Button>
            </div>
            <a
              className={classes.link}
              target="_blank"
              rel="noopener noreferrer"
              data-test="learnmore-link"
              href="https://www.celigo.com/ipaas-integration-platform/#Pricing">
              Learn more about our integrator.io premium packages
              <span className="arrow-box arrow-right arrow-box-20" />
            </a>
          </div>
        </div>
      </Drawer>
      {diyLicense && (
        <div className={classes.root}>
          <div className={classes.block}>
            <Typography variant="h5" className={classes.subHeading}>
              Details:
            </Typography>
            <div className={classes.wrapper}>
              <Typography variant="h3">
                Edition: {diyLicense.usageTierName}
              </Typography>
              <ul className={classes.itemsList}>
                <li>
                  <span className={classes.bold}>Expiration Date:</span>{' '}
                  {diyLicense.expirationDate}
                </li>
              </ul>
            </div>
          </div>
          <div className={classes.block}>
            <Typography variant="h5" className={classes.subHeading}>
              Current Usage:
            </Typography>
            <div className={classes.linearProgressWrapper}>
              <LinearProgress
                color="primary"
                value={diyLicense.currentUsage.usagePercent}
                variant="determinate"
                thickness={10}
                className={classes.progressBar}
              />
            </div>
            <div>
              <span className={classes.bold}>
                {diyLicense.currentUsage.usedHours} Hour
                {diyLicense.currentUsage.usedHours === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      )}
      {integratorLicense && (
        <div className={classes.root}>
          {licenseActionDetails && licenseActionDetails.isNone && (
            <div className={classes.block}>
              <Typography
                varaint="h2"
                color="primary"
                className={classes.headingMaster}>
                You currently dont have any subscription.
              </Typography>
              <div className={classes.wrapper}>
                <Button
                  onClick={onStartFreeTrialClick}
                  variant="outlined"
                  color="primary">
                  Go Unlimited For 30 Days!
                </Button>
                <Typography varaint="body2" className={classes.description}>
                  Start a 30 day free trial to explore the full capabilities of
                  integrator.io. At the end of the trial, you get to keep one
                  active flow forever.
                </Typography>
              </div>
            </div>
          )}
          {licenseActionDetails && (
            <Fragment>
              <Typography variant="h4" className={classes.heading}>
                Subscription
              </Typography>
              <div className={classes.block}>
                <Typography variant="h5" className={classes.subHeading}>
                  Details
                </Typography>
                <div className={classes.wrapper}>
                  <Typography variant="h3">
                    {licenseActionDetails.subscriptionName} Plan
                  </Typography>
                  <ul className={classes.itemsList}>
                    <li className={classes.bold}>
                      Status: {licenseActionDetails.status}
                    </li>
                    <li>
                      <span className={classes.bold}>Expires:</span>

                      {licenseActionDetails.expirationDate}
                    </li>
                    <li>
                      <span className={classes.bold}>
                        Customer Success Plan:
                      </span>
                      {licenseActionDetails.supportTier || 'N/A'}
                    </li>
                  </ul>
                </div>
              </div>
              <div className={classes.block}>
                <div>
                  <Typography variant="h5" className={classes.subHeading}>
                    Flows
                  </Typography>
                  <div className={classes.wrapper}>
                    <Typography variant="h3">
                      Production Integration Flows
                    </Typography>
                    <div className={classes.itemsList}>
                      <div>
                        <span className={classes.bold}>
                          {numEnabledPaidFlows} of{' '}
                          {licenseActionDetails.totalFlowsAvailable}
                        </span>
                        {!licenseActionDetails.totalFlowsAvailable
                          ? 'Unlimited'
                          : ` (${licenseActionDetails.totalFlowsAvailable -
                              licenseActionDetails.numAddOnFlows} from subscription + ${
                              licenseActionDetails.numAddOnFlows
                            } Add-on flows)`}
                      </div>
                      <span className={classes.bold}>
                        | {productionRemainingFlows}{' '}
                      </span>
                      <span> remaining</span>
                    </div>
                    <div className={classes.linearProgressWrapper}>
                      <LinearProgress
                        color="primary"
                        value={productionConsumedFlowsPercentage}
                        variant="determinate"
                        thickness={10}
                        className={classes.progressBar}
                      />
                    </div>
                  </div>
                  <div className={classes.wrapper}>
                    <Typography variant="h3">
                      Sandbox Integration Flows:{' '}
                    </Typography>
                    <div className={classes.itemsList}>
                      <div>
                        <span className={classes.bold}>
                          {numEnabledSandboxFlows} of{' '}
                          {licenseActionDetails.totalSandboxFlowsAvailable}
                        </span>
                      </div>
                      <span className={classes.bold}>
                        | {sandboxRemainingFlows}
                      </span>
                      <span> remaining</span>
                    </div>
                    <div className={classes.linearProgressWrapper}>
                      <LinearProgress
                        color="primary"
                        value={sandboxConsumedFlowsPercentage}
                        variant="determinate"
                        thickness={10}
                        className={classes.progressBar}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {licenseActionDetails &&
                licenseActionDetails.subscriptionActions &&
                licenseActionDetails.subscriptionActions.actions &&
                licenseActionDetails.subscriptionActions.actions.length > 0 && (
                  <div className={classes.block}>
                    <Typography variant="h4" className={classes.subHeading}>
                      Want to upgrade ?
                    </Typography>
                    <div className={classes.wrapper}>
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'start-free-trial'
                      ) > -1 && (
                        <Button
                          onClick={onStartFreeTrialClick}
                          color="primary"
                          variant="outlined">
                          Go Unlimited for 30days!
                        </Button>
                      )}
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'request-subscription'
                      ) > -1 && (
                        <Button
                          onClick={onRequestSubscriptionClick}
                          disabled={
                            licenseActionDetails.subscriptionActions
                              .__upgradeRequested
                          }
                          color="primary"
                          variant="outlined">
                          Request Subscription
                        </Button>
                      )}
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'request-upgrade'
                      ) > -1 && (
                        <Button
                          onClick={onRequestUpgradeClick}
                          disabled={
                            licenseActionDetails.subscriptionActions
                              .__upgradeRequested
                          }
                          color="primary"
                          variant="outlined">
                          Request Upgrade
                        </Button>
                      )}
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'request-trial-extension'
                      ) > -1 && <span>-or-</span>}
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'request-trial-extension'
                      ) > -1 && (
                        <Button
                          onClick={onRequestTrialExtensionClick}
                          disabled={
                            licenseActionDetails.subscriptionActions
                              .__upgradeRequested
                          }
                          color="primary"
                          variant="outlined">
                          Request Trial Extension
                        </Button>
                      )}
                      <a
                        className={classes.linkCompare}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.celigo.com/ipaas-integration-platform/#Pricing">
                        Compare Plans
                      </a>
                    </div>
                  </div>
                )}
            </Fragment>
          )}
        </div>
      )}
    </Fragment>
  );
}
