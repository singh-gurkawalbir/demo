import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, LinearProgress, capitalize } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import PanelHeader from '../../../components/PanelHeader';
import UpgradeDrawer from './drawers/Upgrade';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
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
    padding: theme.spacing(0, 2),
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
  upgradeBlock: {
    marginBottom: 0,
  },
}));

export default function Subscription() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const [enquesnackbar] = useEnqueueSnackbar();
  const licenseActionDetails = useSelector(state =>
    selectors.platformLicenseWithMetadata(state)
  );
  const platformLicense = useSelector(state =>
    selectors.platformLicense(state)
  );
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const classes = useStyles();
  const getNumEnabledFlows = useCallback(() => {
    dispatch(actions.user.org.accounts.requestNumEnabledFlows());
  }, [dispatch]);

  useEffect(() => {
    if (platformLicense) {
      getNumEnabledFlows();
    }
  }, [getNumEnabledFlows, platformLicense]);
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

  const onStartFreeTrialClick = useCallback(() => {
    history.push(`${match.url}/upgrade`);
  }, [history, match.url]);
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
  const platformLicenseActionMessage = useSelector(state =>
    selectors.platformLicenseActionMessage(state)
  );

  useEffect(() => {
    if (platformLicenseActionMessage) {
      enquesnackbar({ message: platformLicenseActionMessage });
    }
  }, [enquesnackbar, platformLicenseActionMessage]);

  return (
    <>
      <UpgradeDrawer />
      <div
        data-public
        className={classes.root}>
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
          <PanelHeader title="Subscription" />
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
                  <div className={clsx(classes.block, classes.upgradeBlock)}>
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
                          Go unlimited for 30 days!
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
    </>
  );
}
