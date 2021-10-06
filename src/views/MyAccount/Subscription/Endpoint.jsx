import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { capitalize, makeStyles, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import NotificationToaster from '../../../components/NotificationToaster';
import Progressbar from './Progressbar';
import LicenceTable from './licenseTable';
import RightDrawer from '../../../components/drawer/Right';
import DrawerHeader from '../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../components/drawer/Right/DrawerContent';
import CheckMarkIcon from '../../../components/icons/CheckmarkIcon';
import useConfirmDialog from '../../../components/ConfirmDialog';
import Spinner from '../../../components/Spinner';
import LoadResources from '../../../components/LoadResources';
import PanelHeader from '../../../components/PanelHeader';
import UpgradeDrawer from './drawers/Upgrade';
import { TextButton, FilledButton } from '../../../components/Buttons';

const useStyles = makeStyles(theme => ({
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
  heading: {
    paddingLeft: 0,
  },
  bold: {
    fontWeight: 'bold',
    paddingRight: theme.spacing(0.5),
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
    maxWidth: '100%',
    wordBreak: 'break-word',
  },
  subscriptionUpgradeBtn: {
    minWidth: '140px',
    minHeight: theme.spacing(4),
    alignSelf: 'flex-start',
  },
  subscriptionFeaturesItems: {
    // maxWidth: '80%',
    marginBottom: theme.spacing(2),
    flexWrap: 'wrap',
    '& li': {
      display: 'inline-flex',
      border: 'none',
      marginRight: 75,
      marginBottom: 12,
    },
  },
  enableIcon: {
    color: theme.palette.info.main,
    marginRight: theme.spacing(0.5),
    fontSize: 20,
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
  // Todo Azhar for hardcoded sandbox value
  sandboxSubscriptionBox: {
    backgroundColor: '#f5f5f0',
  },
  enableIconSandbox: {
    color: '#836A49',
  },
}));

export default function Endpoint() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const { confirmDialog } = useConfirmDialog();

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
  const showMessage = (licenseActionDetails?.tier === 'free' && licenseActionDetails?.expiresInDays < 10) || false;
  const [showExpireMessage, setShowExpireMessage] = useState(showMessage);
  const [needMoreNotification, setNeedMoreNotification] = useState(licenseActionDetails?.tier === 'free' && !showExpireMessage);

  const onStartFreeTrialClick = useCallback(() => {
    history.push(`${match.url}/upgrade`);
  }, [history, match.url]);

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

  const onCloseExpireMessage = useCallback(() => {
    setShowExpireMessage(false);
  }, []);
  const handleClose = useCallback(() => {
    history.push(match?.url);
  }, [history, match?.url]);

  if (!licenseEntitlementUsage) {
    return (
      <Spinner centerAll />
    );
  }

  return (
    <>
      <UpgradeDrawer />
      <RightDrawer
        path=":env/:type"
        height="tall"
        onClose={handleClose}>
        <DrawerHeader title={titleMap[title]} />
        <DrawerContent>
          <LicenceTable />
        </DrawerContent>
      </RightDrawer>

      {!showExpireMessage && needMoreNotification && (
      <div className={classes.subscriptionNotificationToaster}>
        <NotificationToaster variant="info" size="large" onClose={onCloseNotification}>
          <Typography component="div" variant="h5" className={classes.subscriptionMessage}>
            Need more flows? Do you use FTP or AS2 connections? Need to support EDI? We’ve got you covered!
            <TextButton
              data-test="upgradeSubscription"
              onClick={onRequestUpgradeClick}
              className={classes.subscriptionUpgradeLink}
              >
              Upgrade today!
            </TextButton>
          </Typography>
        </NotificationToaster>
      </div>
      )}
      {showExpireMessage && (
      <div className={classes.subscriptionNotificationToaster}>
        <NotificationToaster variant="warning" size="large" onClose={onCloseExpireMessage}>
          <Typography component="div" variant="h5" className={classes.subscriptionMessage}>
            Oh, no! Your free trial expires in {licenseActionDetails?.expiresInDays} days! This will disable all of your flows, then you can enable one flow to keep. Or better yet,
            <TextButton
              data-test="upgradeSubscription"
              onClick={onTrialUpgradeClick}
              className={classes.subscriptionUpgradeLink}
              > upgrade now
            </TextButton>
            and keep them all!
          </Typography>
        </NotificationToaster>
      </div>
      )}
      <PanelHeader title="Subscription" className={classes.heading} />
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
                  <li>
                    {licenseActionDetails?.sandbox && (<CheckMarkIcon className={classes.enableIcon} />)}
                    <Typography variant="body2" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.sandbox)})}>Sandbox</Typography>
                  </li>
                  <li>
                    {licenseActionDetails?.endpoint?.apiManagement && (<CheckMarkIcon className={classes.enableIcon} />)}
                    <Typography variant="body2" component="span" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.endpoint?.apiManagement)})}>API Management</Typography>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {licenseActionDetails?.subscriptionActions?.actions?.length > 0 && (
          <div>
            {licenseActionDetails.subscriptionActions.actions.indexOf(
              'start-free-trial'
            ) > -1 && (
            <FilledButton
              onClick={onStartFreeTrialClick}
              className={classes.subscriptionUpgradeBtn}>
              Go unlimited for 30 days!
            </FilledButton>
            )}
            {(licenseActionDetails.subscriptionActions.actions.indexOf(
              'request-upgrade'
            ) > -1 || licenseActionDetails.subscriptionActions.actions.indexOf(
              'request-subscription'
            ) > -1) && (
            <FilledButton
              onClick={onRequestUpgradeClick}
              disabled={upgradeRequested}
              className={classes.subscriptionUpgradeBtn}
             >
              Upgrade
            </FilledButton>
            )}
            {licenseActionDetails.subscriptionActions.actions.indexOf(
              'add-more-flows'
            ) > -1 && (
            <FilledButton
              onClick={onRequestUpgradeClick}
              disabled={upgradeRequested}
              className={classes.subscriptionUpgradeBtn}
             >
              Add more flows
            </FilledButton>
            )}
          </div>
          )}
        </div>
      </div>
      <div className={classes.subscriptionBox}>
        <div className={classes.subscriptionBoxInner}>
          <div className={classes.subscriptionBoxInnerLeft}>
            <Typography className={classes.subscriptionHeading}>
              Production entitlements
            </Typography>
            <div className={classes.subscriptionFeaturesList} >
              <ul className={clsx(classes.itemsList, classes.subscriptionFeaturesItems)}>
                <li>
                  {!!(licenseActionDetails?.totalNumberofProductionEndpoints) && (<CheckMarkIcon className={classes.enableIcon} />)}
                  <Typography variant="body2" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofProductionEndpoints)})}>
                    <Typography>{licenseActionDetails?.endpoint?.production?.numEndpoints} endpoint apps</Typography>
                    <Typography>{licenseActionDetails?.endpoint?.production?.numAddOnEndpoints > 0 ? `+ ${licenseActionDetails?.endpoint?.production?.numAddOnEndpoints} add-on endpoint apps` : ''}</Typography>
                  </Typography>
                </li>
                <li>
                  {!!(licenseActionDetails?.totalNumberofProductionTradingPartners) && (<CheckMarkIcon className={classes.enableIcon} />)}
                  <Typography variant="body2" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofProductionTradingPartners)})}>
                    <Typography>{licenseActionDetails?.endpoint?.production?.numTradingPartners} trading partners</Typography>
                    <Typography>{licenseActionDetails?.endpoint?.production?.numAddOnTradingPartners > 0 ? `+ ${licenseActionDetails?.endpoint?.production?.numAddOnTradingPartners} add-on trading partners` : ''}</Typography>
                  </Typography>
                </li>
                <li>
                  {!!(licenseActionDetails?.totalNumberofProductionFlows) && <CheckMarkIcon className={classes.enableIcon} />}
                  <Typography variant="body2" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofProductionFlows)})}>
                    <Typography>{licenseActionDetails?.endpoint?.production?.numFlows} integration flows</Typography>
                    <Typography>{licenseActionDetails?.endpoint?.production?.numAddOnFlows > 0 ? `+ ${licenseActionDetails?.endpoint?.production?.numAddOnFlows} add-on integration flows` : ''}</Typography>
                  </Typography>
                </li>
                <li>
                  {!!(licenseActionDetails?.totalNumberofProductionAgents) && (<CheckMarkIcon className={classes.enableIcon} />)}
                  <Typography variant="body2" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofProductionAgents)})}>
                    <Typography>{licenseActionDetails?.endpoint?.production?.numAgents} on-premise agents</Typography>
                    <Typography>{licenseActionDetails?.endpoint?.production?.numAddOnAgents > 0 ? `+ ${licenseActionDetails?.endpoint?.production?.numAddOnAgents} add-on on-premise agents` : ''}</Typography>
                  </Typography>
                </li>
              </ul>
            </div>
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
      <div className={clsx(classes.subscriptionBox, classes.sandboxSubscriptionBox)}>
        <div className={classes.subscriptionBoxInner}>
          <div className={classes.subscriptionBoxInnerLeft}>
            <Typography className={classes.subscriptionHeading}>
              Sandbox entitlements
            </Typography>
            <div className={classes.subscriptionFeaturesList} >
              <ul className={clsx(classes.itemsList, classes.subscriptionFeaturesItems)}>
                <li>
                  {!!(licenseActionDetails?.totalNumberofSandboxEndpoints) && (<CheckMarkIcon className={classes.enableIconSandbox} />)}
                  <Typography variant="body2" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofSandboxEndpoints)})}>
                    <Typography>{licenseActionDetails?.endpoint?.sandbox?.numEndpoints} endpoint apps</Typography>
                    <Typography>{licenseActionDetails?.endpoint?.sandbox?.numAddOnEndpoints > 0 ? `+ ${licenseActionDetails?.endpoint?.sandbox?.numAddOnEndpoints} add-on endpoint apps` : ''}</Typography>
                  </Typography>
                </li>
                <li>
                  {!!(licenseActionDetails?.totalNumberofSandboxTradingPartners) && (<CheckMarkIcon className={classes.enableIconSandbox} />)}
                  <Typography variant="body2" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofSandboxTradingPartners)})}>
                    <Typography>{licenseActionDetails?.endpoint?.sandbox?.numTradingPartners} trading partners</Typography>
                    <Typography>{licenseActionDetails?.endpoint?.sandbox?.numAddOnTradingPartners > 0 ? `+ ${licenseActionDetails?.endpoint?.sandbox?.numAddOnTradingPartners
                    } add-on trading partners` : ''}
                    </Typography>
                  </Typography>
                </li>
                <li>
                  {!!(licenseActionDetails?.totalNumberofSandboxFlows) && <CheckMarkIcon className={classes.enableIconSandbox} />}
                  <Typography variant="body2" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofSandboxFlows)})}>
                    <Typography>{licenseActionDetails?.endpoint?.sandbox?.numFlows} integration flows</Typography>
                    <Typography>{licenseActionDetails?.endpoint?.sandbox?.numAddOnFlows > 0 ? `+ ${licenseActionDetails?.endpoint?.sandbox?.numAddOnFlows} add-on integration flows` : ''}</Typography>
                  </Typography>
                </li>
                <li>
                  {!!(licenseActionDetails?.totalNumberofSandboxAgents) && (<CheckMarkIcon className={classes.enableIconSandbox} />)}
                  <Typography variant="body2" className={clsx(classes.featureText, {[classes.featureTextDisabled]: !(licenseActionDetails?.totalNumberofSandboxAgents)})}>
                    <Typography>{licenseActionDetails?.endpoint?.sandbox?.numAgents} on-premise agents</Typography>
                    <Typography>{licenseActionDetails?.endpoint?.sandbox?.numAddOnAgents > 0 ? `+ ${licenseActionDetails?.endpoint?.sandbox?.numAddOnAgents} add-on on-premise agents` : ''}</Typography>
                  </Typography>
                </li>
              </ul>
            </div>
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
      <LoadResources required resources="connections,flows,integrations,agents" />
    </>
  );
}
