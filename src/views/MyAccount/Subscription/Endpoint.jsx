import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Drawer} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DrawerTitleBar from '../../../components/drawer/TitleBar';
import NotificationToaster from '../../../components/NotificationToaster';
import Progressbar from './Progressbar';
import LicenceTable from './licenseTable';
import RightDrawer from '../../../components/drawer/Right';


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
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const capitalize = s => {
    if (typeof s !== 'string') return '';

    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const titleMap = {
    endpoints: 'Endpoint apps',
    flows: 'Integration flows',
    tradingpartners: 'Trading partners',
    agents: 'On-premise agents',
  };
  const [title, setTitle] = useState('');

  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const licenseActionDetails = useSelector(state =>
    selectors.endpointLicenseWithMetadata(state)
  );
  const [showStartFreeDialog, setShowStartFreeDialog] = useState(false);
  const showMessage = (licenseActionDetails?.tier === 'free' && licenseActionDetails?.expiresInDays < 10) || false;
  const [showExpireMessage, setShowExpireMessage] = useState(showMessage);
  const [needMoreNotification, setNeedMoreNotification] = useState(licenseActionDetails?.tier === 'free' && !showExpireMessage);

  const onStartFreeTrialClick = useCallback(() => {
    setShowStartFreeDialog(true);
  }, [setShowStartFreeDialog]);
  const onStartFreeTrialInterestedClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );
    setShowStartFreeDialog(false);

    return dispatch(actions.user.org.accounts.requestTrialLicense());
  }, [dispatch, setShowStartFreeDialog]);
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

  const licenseEntitlementUsage = useSelector(state => selectors.getLicenseEntitlementUsage(state));
  const numberofUsedEndpoints = licenseEntitlementUsage?.production?.endpointUsage?.numConsumed;
  const numberofUsedFlows = licenseEntitlementUsage?.production?.flowUsage?.numEnabled;
  const numberofUsedTradingPartners = licenseEntitlementUsage?.production?.tradingPartnerUsage?.numConsumed;
  const numberofUsedAgents = licenseEntitlementUsage?.production?.agentUsage?.numActive;
  const numberofUsedSandboxEndpoints = licenseEntitlementUsage?.sandbox?.endpointUsage?.numConsumed;
  const numberofUsedSandboxFlows = licenseEntitlementUsage?.sandbox?.flowUsage?.numEnabled;
  const numberofUsedSandboxTradingPartners = licenseEntitlementUsage?.sandbox?.tradingPartnerUsage?.numConsumed;
  const numberofUsedSandboxAgents = licenseEntitlementUsage?.sandbox?.agentUsage?.numActive;
  const onCloseNotification = useCallback(() => {
    setNeedMoreNotification(false);
  }, [setNeedMoreNotification]);
  const requestLicenseEntitlementUsage = useCallback(() => {
    dispatch(actions.user.org.accounts.requestLicenseEntitlementUsage());
  }, [dispatch]);

  useEffect(() => {
    if (!licenseEntitlementUsage) {
      requestLicenseEntitlementUsage();
    }
  }, [requestLicenseEntitlementUsage, licenseEntitlementUsage]);

  const onDrawerClose = useCallback(() => {
    setShowStartFreeDialog(false);
  }, []);
  const onCloseExpireMessage = useCallback(() => {
    setShowExpireMessage(false);
  }, []);
  const handleClose = useCallback(() => {
    history.push(match?.url);
  }, [history, match?.url]);

  onCloseExpireMessage;
  if (!licenseEntitlementUsage) return null;


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
      <RightDrawer
        path=":env/:type"
        height="tall"
        title={titleMap[title]}
        onClose={handleClose}>
        <LicenceTable />
      </RightDrawer>
      { !showExpireMessage && needMoreNotification &&
      <NotificationToaster variant="info" size="large" onClose={onCloseNotification}>
        <Typography variant="info">Need more flows. Do you use FTP or AS2 connections? Need to support EDI? We`ve got you covered!.
          <Button
            variant="text"
            color="secondary"
            onClick={onRequestSubscriptionClick}> Upgrade today!
          </Button>
        </Typography>
      </NotificationToaster>}
      {showExpireMessage &&
      <NotificationToaster variant="warning" size="large" onClose={onCloseExpireMessage}>
        <Typography variant="info">Oh, no! Your free trial expires in {licenseActionDetails?.expiresInDays} days! This will disable all of your flows, then you can enable one flow to keep. Or better yet, upgrade now
          <Button
            variant="text"
            color="secondary"
            onClick={onRequestSubscriptionClick}> Upgrade now
          </Button>
          and keep them all!
        </Typography>
      </NotificationToaster>}
      <div className={classes.root}>
        {licenseActionDetails && (
        <>
          <Typography variant="h4" className={classes.heading}>
            Subscription
          </Typography>
          <div className={classes.block}>
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
              {licenseActionDetails &&
                licenseActionDetails.subscriptionActions &&
                licenseActionDetails.subscriptionActions.actions &&
                licenseActionDetails.subscriptionActions.actions.length > 0 && (
                  <div className={classes.block}>
                    <Typography variant="h4" className={classes.subHeading}>
                      Want to upgrade ?
                    </Typography>
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
                  </div>
              )}
              <div>{licenseActionDetails?.totalNumberofProductionEndpoints + licenseActionDetails?.totalNumberofSandboxEndpoints} endpoint apps</div>
              <div>{licenseActionDetails?.totalNumberofProductionTradingPartners + licenseActionDetails?.totalNumberofSandboxTradingPartners} trading partners</div>
              <div>API management {licenseActionDetails?.endpoint?.apiManagement ? 'Enabled' : 'Disabled'}</div>
              <div>Autopilot  {licenseActionDetails?.autopilot ? 'Enabled' : 'Disabled'} </div>
              <div>{licenseActionDetails?.totalNumberofProductionFlows + licenseActionDetails?.totalNumberofSandboxFlows} integration flows</div>
              <div>{licenseActionDetails?.totalNumberofProductionAgents + licenseActionDetails?.totalNumberofSandboxAgents} on-premise agents</div>
              <div>Sandbox {licenseActionDetails?.sandbox ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
          <div className={classes.block}>
            <div>
              <div className={classes.wrapper}>
                <Typography variant="h3">
                  Production usage
                </Typography>

                <div>
                  <div className={classes.linearProgressWrapper}>
                    <Progressbar
                      usedCount={numberofUsedEndpoints}
                      totalCount={licenseActionDetails?.totalNumberofProductionEndpoints}
                      env="production"
                      type="endpoints"
                      setTitle={setTitle}
                    />
                    <Progressbar
                      usedCount={numberofUsedFlows}
                      totalCount={licenseActionDetails?.totalNumberofProductionFlows}
                      env="production"
                      type="flows"
                      setTitle={setTitle}
                    />
                    <Progressbar
                      usedCount={numberofUsedTradingPartners}
                      totalCount={licenseActionDetails?.totalNumberofProductionTradingPartners}
                      env="production"
                      type="tradingpartners"
                      setTitle={setTitle}
                    />
                    <Progressbar
                      usedCount={numberofUsedAgents}
                      totalCount={licenseActionDetails?.totalNumberofProductionAgents}
                      env="production"
                      type="agents"
                      setTitle={setTitle}
                    />
                  </div>
                </div>
              </div>
              {licenseActionDetails?.sandbox && (
              <div className={classes.wrapper}>
                <Typography variant="h3">
                  Sandbox usage
                </Typography>

                <div>
                  <div className={classes.linearProgressWrapper}>
                    <Progressbar
                      usedCount={numberofUsedSandboxEndpoints}
                      totalCount={licenseActionDetails?.totalNumberofSandboxEndpoints}
                      env="sandbox"
                      type="endpoints"
                      setTitle={setTitle}
                    />
                    <Progressbar
                      usedCount={numberofUsedSandboxFlows}
                      totalCount={licenseActionDetails.totalNumberofSandboxFlows}
                      env="sandbox"
                      type="flows"
                      setTitle={setTitle}
                    />
                    <Progressbar
                      usedCount={numberofUsedSandboxTradingPartners}
                      totalCount={licenseActionDetails.totalNumberofSandboxTradingPartners}
                      env="sandbox"
                      type="tradingpartners"
                      setTitle={setTitle}
                    />
                    <Progressbar
                      usedCount={numberofUsedSandboxAgents}
                      totalCount={licenseActionDetails.totalNumberofSandboxAgents}
                      env="sandbox"
                      type="agents"
                      setTitle={setTitle}
                    />
                  </div>
                </div>
              </div>
              )}
            </div>
          </div>
        </>
        )}
      </div>
    </>
  );
}
