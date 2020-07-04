import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, LinearProgress, Drawer} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import DrawerTitleBar from '../../../components/drawer/TitleBar';
import ResourceTable from './ResourceTable';

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
  const capitalize = s => {
    if (typeof s !== 'string') return '';

    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [sandbox, setSandbox] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [resource, setResource] = useState('');
  const [upgradeRequested, setUpgradeRequested] = useState(false);
  const licenseActionDetails = useSelector(state =>
    selectors.endpointLicenseWithMetadata(state)
  );
  const [showStartFreeDialog, setShowStartFreeDialog] = useState(false);
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

  const [totalResources, setTotalResources] = useState(0);
  const [totalUsedResources, setTotalUsedResources] = useState(0);

  const licenseEntitlementUsage = useSelector(state => selectors.getLicenseEntitlementUsage(state));
  const totalNumberofEndpoints = licenseActionDetails?.endpoint?.production?.numEndpoints + licenseActionDetails?.endpoint?.production?.numAddOnEndpoints;
  const totalNumberofFlows = licenseActionDetails?.endpoint?.production?.numFlows + licenseActionDetails?.endpoint?.production?.numAddOnFlows;
  const totalNumberofTradingPartners = licenseActionDetails?.endpoint?.production?.numTradingPartners + licenseActionDetails?.endpoint?.production?.numAddOnTradingPartners;
  const totalNumberofAgents = licenseActionDetails?.endpoint?.production?.numAgents + licenseActionDetails?.endpoint?.production?.numAddOnAgents;

  const totalNumberofSandboxEndpoints = licenseActionDetails?.endpoint?.sandbox?.numEndpoints + licenseActionDetails?.endpoint?.sandbox?.numAddOnEndpoints;
  const totalNumberofSandboxFlows = licenseActionDetails?.endpoint?.sandbox?.numFlows + licenseActionDetails?.endpoint?.sandbox?.numAddOnFlows;
  const totalNumberofSandboxTradingPartners = licenseActionDetails?.endpoint?.sandbox?.numTradingPartners + licenseActionDetails?.endpoint?.sandbox?.numAddOnTradingPartners;
  const totalNumberofSandboxAgents = licenseActionDetails?.endpoint?.sandbox?.numAgents + licenseActionDetails?.endpoint?.sandbox?.numAddOnAgents;


  const numberofUsedEndpoints = licenseEntitlementUsage?.production?.endpointUsage?.numConsumed;
  const numberofUsedFlows = licenseEntitlementUsage?.production?.flowUsage?.numEnabled;
  const numberofUsedTradingPartners = licenseEntitlementUsage?.production?.tradingPartnerUsage?.numConsumed;
  const numberofUsedAgents = licenseEntitlementUsage?.production?.agentUsage?.numActive;

  const numberofUsedSandboxEndpoints = licenseEntitlementUsage?.sandbox?.endpointUsage?.numConsumed;
  const numberofUsedSandboxFlows = licenseEntitlementUsage?.sandbox?.flowUsage?.numEnabled;
  const numberofUsedSandboxTradingPartners = licenseEntitlementUsage?.sandbox?.tradingPartnerUsage?.numConsumed;
  const numberofUsedSandboxAgents = licenseEntitlementUsage?.sandbox?.agentUsage?.numActive;
  const onResourceDilaogClick = useCallback((type, sandbox, title, resource, totalResources, totalUsedResources) => {
    setShowResourceDialog(true);
    setType(type);
    setSandbox(sandbox);
    setTitle(title);
    setResource(resource);
    setTotalResources(totalResources);
    setTotalUsedResources(totalUsedResources);
  }, [setShowResourceDialog]);
  const onProductionEndpointsClick = useCallback(() => {
    onResourceDilaogClick('endpoints', false, 'Endpoint apps', licenseEntitlementUsage?.production?.endpointUsage?.endpoints, totalNumberofEndpoints, numberofUsedEndpoints);
  }, [onResourceDilaogClick, licenseEntitlementUsage?.production?.endpointUsage?.endpoints, totalNumberofEndpoints, numberofUsedEndpoints]);
  const onProductionFlowsClick = useCallback(() => {
    onResourceDilaogClick('flows', false, 'Integration flows', licenseEntitlementUsage?.production?.flowUsage?.flows, totalNumberofFlows, numberofUsedFlows);
  }, [onResourceDilaogClick, licenseEntitlementUsage?.production?.flowUsage?.flows, totalNumberofFlows, numberofUsedFlows]);
  const onProductionTradingPartnersClick = useCallback(() => {
    onResourceDilaogClick('tradingpartners', false, 'Trading partners', licenseEntitlementUsage?.production?.tradingPartnerUsage?.tradingPartners, totalNumberofTradingPartners, numberofUsedTradingPartners);
  }, [onResourceDilaogClick, licenseEntitlementUsage?.production?.tradingPartnerUsage?.tradingPartners, totalNumberofTradingPartners, numberofUsedTradingPartners]);
  const onProductionAgentsClick = useCallback(() => {
    onResourceDilaogClick('agents', false, 'On-premise agents', licenseEntitlementUsage?.production?.agentUsage?.agents, totalNumberofAgents, numberofUsedAgents);
  }, [onResourceDilaogClick, licenseEntitlementUsage?.production?.agentUsage?.agents, totalNumberofAgents, numberofUsedAgents]);
  const onSandboxEndpointsClick = useCallback(() => {
    onResourceDilaogClick('endpoints', true, 'Endpoint apps', licenseEntitlementUsage?.sandbox?.endpointUsage?.endpoints, totalNumberofSandboxEndpoints, numberofUsedSandboxEndpoints);
  }, [onResourceDilaogClick, licenseEntitlementUsage?.sandbox?.endpointUsage?.endpoints, totalNumberofSandboxEndpoints, numberofUsedSandboxEndpoints]);
  const onSandboxFlowsClick = useCallback(() => {
    onResourceDilaogClick('flows', true, 'Integration flows', licenseEntitlementUsage?.sandbox?.flowUsage?.flows, totalNumberofSandboxFlows, numberofUsedSandboxFlows);
  }, [onResourceDilaogClick, licenseEntitlementUsage?.sandbox?.flowUsage?.flows, totalNumberofSandboxFlows, numberofUsedSandboxFlows]);
  const onSandboxTradingPartnersClick = useCallback(() => {
    onResourceDilaogClick('tradingpartners', true, 'Trading partners', licenseEntitlementUsage?.sandbox?.tradingPartnerUsage?.tradingPartners, totalNumberofSandboxTradingPartners, numberofUsedSandboxTradingPartners);
  }, [onResourceDilaogClick, licenseEntitlementUsage?.sandbox?.tradingPartnerUsage?.tradingPartners, totalNumberofSandboxTradingPartners, numberofUsedSandboxTradingPartners]);
  const onSandboxAgentsClick = useCallback(() => {
    onResourceDilaogClick('agents', true, 'On-premise agents', licenseEntitlementUsage?.sandbox?.agentUsage?.agents, totalNumberofSandboxAgents, numberofUsedSandboxAgents);
  }, [onResourceDilaogClick, licenseEntitlementUsage?.sandbox?.agentUsage?.agents, totalNumberofSandboxAgents, numberofUsedSandboxAgents]);

  const [enquesnackbar] = useEnqueueSnackbar();
  const requestLicenseEntitlementUsage = useCallback(() => {
    dispatch(actions.user.org.accounts.requestLicenseEntitlementUsage());
  }, [dispatch]);

  useEffect(() => {
    if (!licenseEntitlementUsage) {
      requestLicenseEntitlementUsage();
    }
  }, [requestLicenseEntitlementUsage, licenseEntitlementUsage]);
  const integratorLicenseActionMessage = useSelector(state =>
    selectors.integratorLicenseActionMessage(state)
  );

  useEffect(() => {
    if (integratorLicenseActionMessage) {
      enquesnackbar({ message: integratorLicenseActionMessage });
    }
  }, [enquesnackbar, integratorLicenseActionMessage]);

  const onDrawerClose = useCallback(() => {
    setShowResourceDialog(false);
    setShowStartFreeDialog(false);
  }, []);
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
      <Drawer
        anchor="right"
        open={showResourceDialog}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <DrawerTitleBar
          onClose={onDrawerClose}
          title={title}
        />
        <div className={classes.linearProgressWrapper}>
          <div>Using {totalUsedResources} of {totalResources}</div>
          <LinearProgress
            color="primary"
            value={(totalUsedResources / totalResources) * 100}
            variant="determinate"
            thickness={10}
            className={classes.progressBar}
          />
        </div>
        <ResourceTable type={type} sandbox={sandbox} resource={resource} showDialog={setShowResourceDialog} />
      </Drawer>
      <div className={classes.root}>
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
              <div>{totalNumberofEndpoints + totalNumberofSandboxEndpoints} endpoint apps</div>
              <div>{totalNumberofTradingPartners + totalNumberofSandboxTradingPartners} trading partners</div>
              <div>API management {licenseActionDetails?.endpoint?.apiManagement ? 'Enabled' : 'Disabled'}</div>
              <div>Autopilot  {licenseActionDetails?.autopilot ? 'Enabled' : 'Disabled'} </div>
              <div>{totalNumberofFlows + totalNumberofSandboxFlows} integration flows</div>
              <div>{totalNumberofAgents + totalNumberofSandboxAgents} on-premise agents</div>
              <div>Sandbox {licenseActionDetails?.sandbox ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
          <div className={classes.block}>
            <div>
              <div className={classes.wrapper}>
                <Typography variant="h3">
                  Production Usage
                </Typography>

                <div>
                  <div className={classes.linearProgressWrapper}>
                    <div>Endpoint apps: {numberofUsedEndpoints} of {totalNumberofEndpoints}</div>
                    <LinearProgress
                      color="primary"
                      value={(numberofUsedEndpoints / totalNumberofEndpoints) * 100}
                      variant="determinate"
                      thickness={10}
                      className={classes.progressBar}
                          />
                    <Button
                      onClick={onProductionEndpointsClick}
                      variant="outlined"
                      color="primary">
                      List!
                    </Button>
                    <div>Integration flows: {numberofUsedFlows} of {totalNumberofFlows}</div>
                    <LinearProgress
                      color="primary"
                      value={(numberofUsedFlows / totalNumberofFlows) * 100}
                      variant="determinate"
                      thickness={10}
                      className={classes.progressBar}
                          />
                    <Button
                      onClick={onProductionFlowsClick}
                      variant="outlined"
                      color="primary">
                      List!
                    </Button>
                    <div>Trading partners: {numberofUsedTradingPartners} of {totalNumberofTradingPartners}</div>
                    <LinearProgress
                      color="primary"
                      value={(numberofUsedTradingPartners / totalNumberofTradingPartners) * 100}
                      variant="determinate"
                      thickness={10}
                      className={classes.progressBar}
                          />
                    <Button
                      onClick={onProductionTradingPartnersClick}
                      variant="outlined"
                      color="primary">
                      List!
                    </Button>
                    <div>On-premise agents: {numberofUsedAgents} of {totalNumberofAgents}</div>
                    <LinearProgress
                      color="primary"
                      value={(numberofUsedAgents / totalNumberofAgents) * 100}
                      variant="determinate"
                      thickness={10}
                      className={classes.progressBar}
                          />
                    <Button
                      onClick={onProductionAgentsClick}
                      variant="outlined"
                      color="primary">
                      List!
                    </Button>
                  </div>
                </div>
              </div>
              {licenseActionDetails?.sandbox && (
              <div className={classes.wrapper}>
                <Typography variant="h3">
                  Sandbox Usage
                </Typography>

                <div>
                  <div className={classes.linearProgressWrapper}>
                    <div>Endpoint apps: {numberofUsedSandboxEndpoints} of {totalNumberofSandboxEndpoints}</div>
                    <LinearProgress
                      color="primary"
                      value={(numberofUsedSandboxEndpoints / totalNumberofSandboxEndpoints) * 100}
                      variant="determinate"
                      thickness={10}
                      className={classes.progressBar}
                          />
                    <Button
                      onClick={onSandboxEndpointsClick}
                      variant="outlined"
                      color="primary">
                      List!
                    </Button>
                    <div>Integration flows: {numberofUsedSandboxFlows} of {totalNumberofSandboxFlows}</div>
                    <LinearProgress
                      color="primary"
                      value={(numberofUsedSandboxFlows / totalNumberofSandboxFlows) * 100}
                      variant="determinate"
                      thickness={10}
                      className={classes.progressBar}
                          />
                    <Button
                      onClick={onSandboxFlowsClick}
                      variant="outlined"
                      color="primary">
                      List!
                    </Button>
                    <div>Trading partners: {numberofUsedSandboxTradingPartners} of {totalNumberofSandboxTradingPartners}</div>
                    <LinearProgress
                      color="primary"
                      value={(numberofUsedSandboxTradingPartners / totalNumberofSandboxTradingPartners) * 100}
                      variant="determinate"
                      thickness={10}
                      className={classes.progressBar}
                          />
                    <Button
                      onClick={onSandboxTradingPartnersClick}
                      variant="outlined"
                      color="primary">
                      List!
                    </Button>
                    <div>On-premise agents: {numberofUsedSandboxAgents} of {totalNumberofSandboxAgents}</div>
                    <LinearProgress
                      color="primary"
                      value={(numberofUsedSandboxAgents / totalNumberofSandboxAgents) * 100}
                      variant="determinate"
                      thickness={10}
                      className={classes.progressBar}
                          />
                    <Button
                      onClick={onSandboxAgentsClick}
                      variant="outlined"
                      color="primary">
                      List!
                    </Button>
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
