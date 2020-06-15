import React, { useCallback, useEffect, useState } from 'react';
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
    margin: theme.spacing(3, 0, 0, 2),
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
    backgroundColor: theme.palette.secondary.lightest,
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
  normal: {
    fontWeight: 'normal',
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
  const capitalize = s => {
    if (typeof s !== 'string') return '';

    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const [enquesnackbar] = useEnqueueSnackbar();
  const licenseActionDetails = useSelector(state =>
    selectors.integratorLicenseWithMetadata(state)
  );
  const integratorLicense = useSelector(state =>
    selectors.integratorLicense(state)
  );
  const [upgradeRequested, setUpgradeRequested] = useState(false);
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
    setShowStartFreeDialog(false);

    return dispatch(actions.user.org.accounts.requestTrialLicense());
  }, [dispatch]);
  const onStartFreeTrialClick = useCallback(() => {
    setShowStartFreeDialog(true);
  }, []);
  const onRequestSubscriptionClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );
    setUpgradeRequested(true);

    return dispatch(actions.user.org.accounts.requestUpdate('upgrade'));
  }, [dispatch]);
  const onRequestUpgradeClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );
    setUpgradeRequested(true);

    return dispatch(actions.user.org.accounts.requestUpdate('upgrade'));
  }, [dispatch]);
  const onRequestTrialExtensionClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );
    setUpgradeRequested(true);

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
    <>
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
                  <span className={classes.bold}>Expiration date:</span>{' '}
                  {diyLicense.expirationDate}
                </li>
              </ul>
            </div>
          </div>
          <div className={classes.block}>
            <Typography variant="h5" className={classes.subHeading}>
              Current usage:
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
            <>
              <Typography variant="h4" className={classes.heading}>
                Subscription
              </Typography>
              <div className={classes.block}>
                <Typography variant="h5" className={classes.subHeading}>
                  Details
                </Typography>
                <div className={classes.wrapper}>
                  <Typography variant="h3">
                    {licenseActionDetails.subscriptionName} plan
                  </Typography>
                  <ul className={classes.itemsList}>
                    <li className={classes.bold}>
                      Status: {capitalize(licenseActionDetails.status)}
                    </li>
                    <li>
                      <span className={classes.bold}>Expires:&nbsp;</span>

                      {licenseActionDetails.expirationDate || 'N/A'}
                    </li>
                    <li>
                      <span className={classes.bold}>
                        Customer success plan:&nbsp;
                      </span>
                      {capitalize(licenseActionDetails.supportTier || 'N/A')}
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
                      Production integration flows
                    </Typography>
                    {licenseActionDetails.totalFlowsAvailable ===
                    Number.MAX_SAFE_INTEGER ? (
                      <div className={classes.bold}>Unlimited</div>
                      ) : (
                        <div>
                          <div className={classes.itemsList}>
                            <div>
                              <span className={classes.bold}>
                                {numEnabledPaidFlows} of{' '}
                                {licenseActionDetails.totalFlowsAvailable} (
                                <span className={classes.normal}>
                                  {licenseActionDetails.totalFlowsAvailable -
                                  licenseActionDetails.numAddOnFlows}{' '}
                                  from subscription +{' '}
                                  {licenseActionDetails.numAddOnFlows} Add-on
                                  flows)
                                </span>
                              </span>
                            </div>
                            <span className={classes.bold}>
                            &nbsp;| {productionRemainingFlows}
                            </span>
                            <span> &nbsp;remaining</span>
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
                      )}
                  </div>
                  <div className={classes.wrapper}>
                    <Typography variant="h3">
                      Sandbox integration flows:{' '}
                    </Typography>
                    <div className={classes.itemsList}>
                      <div>
                        <span className={classes.bold}>
                          {numEnabledSandboxFlows} of{' '}
                          {licenseActionDetails.totalSandboxFlowsAvailable ===
                          Number.MAX_SAFE_INTEGER
                            ? 'Unlimited'
                            : licenseActionDetails.totalSandboxFlowsAvailable}
                        </span>
                      </div>
                      <span className={classes.bold}>
                        &nbsp;| {sandboxRemainingFlows}
                      </span>
                      <span>&nbsp;remaining</span>
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
                          Go unlimited for 30days!
                        </Button>
                      )}
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'request-subscription'
                      ) > -1 && (
                        <Button
                          onClick={onRequestSubscriptionClick}
                          disabled={upgradeRequested}
                          color="primary"
                          variant="outlined">
                          Request subscription
                        </Button>
                      )}
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'request-upgrade'
                      ) > -1 && (
                        <Button
                          onClick={onRequestUpgradeClick}
                          disabled={upgradeRequested}
                          color="primary"
                          variant="outlined">
                          Request upgrade
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
                          disabled={upgradeRequested}
                          color="primary"
                          variant="outlined">
                          Request trial extension
                        </Button>
                      )}
                      <a
                        className={classes.linkCompare}
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.celigo.com/ipaas-integration-platform/#Pricing">
                        Compare plans
                      </a>
                    </div>
                  </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}
