import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Drawer} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import DrawerTitleBar from '../../../components/drawer/TitleBar';
import NotificationToaster from '../../../components/NotificationToaster';
import Progressbar from './Progressbar';
import LicenceTable from './licenseTable';
import RightDrawer from '../../../components/drawer/Right';
import CheckMarkIcon from '../../../components/icons/CheckmarkIcon';
import useConfirmDialog from '../../../components/ConfirmDialog';
import Spinner from '../../../components/Spinner';
import SpinnerWrapper from '../../../components/SpinnerWrapper';
import LoadResources from '../../../components/LoadResources';


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
    paddingRight: theme.spacing(0.5),
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
  subscriptionBox: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  subscriptionHeading: {
    fontSize: 20,
    lineHeight: '20px',
    paddingBottom: 14,
  },
  subscriptionSubHeading: {
    fontSize: 15,
    margin: [[12, 0]],
  },
  subscriptionUpgradeLink: {
    color: theme.palette.primary.main,
    fontSize: 15,
    lineHeight: '17px',
    padding: 6,
    fontWeight: 'bold',
  },
  subscriptionNotificationToaster: {
    marginBottom: 12,
  },
  subscriptionMessage: {
    lineHeight: '20px',
    fontSize: 15,
  },
  subscriptionBoxInner: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  subscriptionBoxInnerLeft: {
    maxWidth: '88%',
    wordBreak: 'break-word',
  },
  subscriptionUpgradeBtn: {
    minWidth: '140px',
    minHeight: theme.spacing(4),
    alignSelf: 'flex-start',
  },
  subscriptionFeaturesItems: {
    maxWidth: '80%',
    flexWrap: 'wrap',
    '& li': {
      display: 'inline-flex',
      border: 'none',
      marginRight: 90,
      marginBottom: 12,
    },
  },
  enableIcon: {
    color: theme.palette.success.light,
    marginRight: theme.spacing(0.5),
    fontSize: 20,
  },
  subscriptionFeatureEnabled: {
    display: 'flex',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 15,
    lineHeight: '22px',
  },
  featureTextDisabled: {
    color: theme.palette.secondary.contrastText,
  },
  subscriptionFeatures: {
    paddingTop: theme.spacing(2),
  },
  productionUsageWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  productionUsageInfo: {
    width: 200,
    wordBreak: 'break-word',
  },
  productionProgressBar: {
    minWidth: 560,
    marginRight: theme.spacing(2),
  },
  productionUsageListLink: {
    color: theme.palette.primary.light,
    paddingLeft: theme.spacing(1),
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
  }
}));

export default function Endpoint() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const { confirmDialog } = useConfirmDialog();
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
    selectors.platformLicenseWithMetadata(state)
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
  const onTrialUpgradeClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );
    setUpgradeRequested(true);
    confirmDialog({
      title: 'Upgrade and keep all my flows running',
      message: 'Great idea. Who wants to stop the magic?.We`ll be in touch shortly to get you upgraded!',
      buttons: [
        {
          label: 'Close',
        },
      ],
    });
    return dispatch(actions.user.org.accounts.requestUpdate('upgrade'));
  }, [dispatch, confirmDialog]);

  const onRequestUpgradeClick = useCallback(() => {
    dispatch(
      actions.analytics.gainsight.trackEvent('GO_UNLIMITED_BUTTON_CLICKED')
    );
    setUpgradeRequested(true);
    confirmDialog({
      title: 'I need more flows!',
      message: 'You are an integration master!. We`ll be in touch shortly to get you upgraded!.',
      buttons: [
        {
          label: 'Close',
        },
      ],
    });
    return dispatch(actions.user.org.accounts.requestUpdate('upgrade'));
  }, [dispatch, confirmDialog]);
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
    requestLicenseEntitlementUsage();
  }, [requestLicenseEntitlementUsage]);

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
  if (!licenseEntitlementUsage) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }


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
      {!showExpireMessage && needMoreNotification && (
      <div className={classes.subscriptionNotificationToaster}>
        <NotificationToaster variant="info" size="large" onClose={onCloseNotification}>
          <Typography component="div" variant="h5" className={classes.subscriptionMessage}>
            Need more flows? Do you use FTP or AS2 connections? Need to support EDI? We’ve got you covered!
            <Button
              data-test="upgradeSubscription"
              variant="text"
              color="primary"
              onClick={onRequestUpgradeClick}
              className={classes.subscriptionUpgradeLink}
              >
              Upgrade today!
            </Button>
          </Typography>
        </NotificationToaster>
      </div>)}
      {showExpireMessage &&
      <div className={classes.subscriptionNotificationToaster}>
        <NotificationToaster variant="warning" size="large" onClose={onCloseExpireMessage}>
          <Typography component="div" variant="h5" className={classes.subscriptionMessage}>
            Oh, no! Your free trial expires in {licenseActionDetails?.expiresInDays} days! This will disable all of your flows, then you can enable one flow to keep. Or better yet,
            <Button
              data-test="upgradeSubscription"
              variant="text"
              color="primary"
              onClick={onTrialUpgradeClick}
              className={classes.subscriptionUpgradeLink}
              > upgrade now
            </Button>
            and keep them all!
          </Typography>
        </NotificationToaster>
      </div>}
      <Typography variant="h4" className={classes.heading}>
        Subscription
      </Typography>
      <div className={classes.subscriptionBox}>
        <div className={classes.subscriptionBoxInner}>
          <div className={classes.subscriptionBoxInnerLeft}>
            <Typography className={classes.subscriptionHeading}>
              {licenseActionDetails.subscriptionName} plan
            </Typography>
            <ul className={classes.itemsList}>
              <li>
                <span className={classes.bold}>Status:</span>
                {capitalize(licenseActionDetails.status)}
              </li>
              <li>
                <span className={classes.bold}> Expires on:</span>
                {licenseActionDetails.expirationDate || 'N/A'} <span>{} </span>
              </li>
              <li>
                <span className={classes.bold}> Customer success plan:</span>
                {capitalize(licenseActionDetails.supportTier || 'N/A')}
              </li>
            </ul>
            <div className={classes.subscriptionFeatures}>
              <Typography variant="h6" className={classes.subscriptionSubHeading}>
                Features Include:
              </Typography>
              <div className={classes.subscriptionFeaturesList} >
                <ul className={clsx(classes.itemsList, classes.subscriptionFeaturesItems)}>
                  <li className={classes.subscriptionFeatureEnabled}>
                    {!!(licenseActionDetails?.totalNumberofEndpoints) && (<CheckMarkIcon className={classes.enableIcon} />)}
                    <Typography variant="h4" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofEndpoints)})}> {licenseActionDetails?.totalNumberofEndpoints} Endpoint apps</Typography>
                  </li>
                  <li>
                    {!!(licenseActionDetails?.totalNumberofTradingPartners) && (<CheckMarkIcon className={classes.enableIcon} />)}
                    <Typography variant="body2" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofTradingPartners)})}>{licenseActionDetails?.totalNumberofTradingPartners} Trading partners</Typography>
                  </li>
                  <li>
                    {licenseActionDetails?.autopilot && (<CheckMarkIcon className={classes.enableIcon} />)}
                    <Typography variant="body2" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.autopilot)})}>Autopilot</Typography>
                  </li>
                  <li>
                    {licenseActionDetails?.sandbox && (<CheckMarkIcon className={classes.enableIcon} />)}
                    <Typography variant="body2" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.sandbox)})}>Sandbox</Typography>
                  </li>
                  <li className={classes.subscriptionFeatureEnabled}>
                    {!!(licenseActionDetails?.totalNumberofFlows) && <CheckMarkIcon className={classes.enableIcon} />}
                    <Typography variant="h4" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofFlows)})}>{licenseActionDetails?.totalNumberofFlows} Integration flows</Typography>
                  </li>
                  <li>
                    {!!(licenseActionDetails?.totalNumberofAgents) && (<CheckMarkIcon className={classes.enableIcon} />)}
                    <Typography variant="body2" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofAgents)})}>{licenseActionDetails?.totalNumberofAgents} On-premise agents</Typography>
                  </li>
                  <li>
                    {licenseActionDetails?.endpoint?.apiManagement && (<CheckMarkIcon className={classes.enableIcon} />)}
                    <Typography variant="body2" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.endpoint?.apiManagement)})}>API Management</Typography>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {licenseActionDetails &&
                licenseActionDetails.subscriptionActions &&
                licenseActionDetails.subscriptionActions.actions &&
                licenseActionDetails.subscriptionActions.actions.length > 0 && (
                  <div>
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'start-free-trial'
                      ) > -1 && (
                        <Button
                          onClick={onStartFreeTrialClick}
                          className={classes.subscriptionUpgradeBtn}
                          color="primary"
                          variant="outlined">
                          Go unlimited for 30days!
                        </Button>
                      )}
                      {(licenseActionDetails.subscriptionActions.actions.indexOf(
                        'request-upgrade'
                      ) > -1 || licenseActionDetails.subscriptionActions.actions.indexOf(
                        'request-subscription'
                      ) > -1) && (
                        <Button
                          onClick={onRequestUpgradeClick}
                          disabled={upgradeRequested}
                          className={classes.subscriptionUpgradeBtn}
                          color="primary"
                          variant="outlined">
                          Upgrade
                        </Button>
                      )}
                      {licenseActionDetails.subscriptionActions.actions.indexOf(
                        'add-more-flows'
                      ) > -1 && (
                        <Button
                          onClick={onRequestUpgradeClick}
                          disabled={upgradeRequested}
                          className={classes.subscriptionUpgradeBtn}
                          color="primary"
                          variant="outlined">
                          Add more flows
                        </Button>
                      )}
                  </div>)}
        </div>
      </div>
      <div className={classes.subscriptionBox}>
        <div className={classes.subscriptionBoxInner}>
          <div className={classes.subscriptionBoxInnerLeft}>
            <Typography className={classes.subscriptionHeading}>
              Production usage
            </Typography>
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
      <div className={classes.subscriptionBox}>
        <div className={classes.subscriptionBoxInner}>
          <div className={classes.subscriptionBoxInnerLeft}>
            <Typography className={classes.subscriptionHeading}>
              Sandbox usage
            </Typography>
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
      </div>)}
      <LoadResources required resources="connections,flows,integrations,agents" />
    </>
  );
}
