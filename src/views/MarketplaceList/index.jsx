import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch, Link } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Card, CardActions, Typography, Tooltip } from '@mui/material';
import {applicationsList} from '../../constants/applications';
import CeligoPageBar from '../../components/CeligoPageBar';
import ConnectorTemplateContent from './ConnectorTemplateContent';
import getRoutePath from '../../utils/routePaths';
import actions from '../../actions';
import useRequestForDemo from '../../hooks/useRequestForDemo';
import { selectors } from '../../reducers';
import InstallTemplateDrawer from '../../components/drawer/Install/Template';
import LoadResources from '../../components/LoadResources';
import useConfirmDialog from '../../components/ConfirmDialog';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { SUITESCRIPT_CONNECTOR_IDS, HOME_PAGE_PATH } from '../../constants';
import { capitalizeFirstLetter } from '../../utils/string';
import FilledButton from '../../components/Buttons/FilledButton';
import getImageUrl from '../../utils/image';
import PageContent from '../../components/PageContent';
import { gridViewStyles } from '../Home/View/TileView/HomeCard';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import messageStore, { message } from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  pageCenter: {
    padding: theme.spacing(3, 0),
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    margin: '0 auto',
    '& p': {
      margin: theme.spacing(2, 0),
    },
  },
  card: {
    height: '318px',
    width: '318px',
    border: '1px solid',
    position: 'relative',
    borderColor: theme.palette.secondary.lightest,
    margin: '0 auto',
    borderRadius: '4px',
    padding: [[14, 18]],
    wordBreak: 'break-word',
  },
  connectorCard: {
    '&:before': {
      content: '""',
      left: 0,
      top: 0,
      width: '100%',
      position: 'absolute',
      height: theme.spacing(1),
      background: theme.palette.primary.dark,
    },
  },
  templateCard: {
    '&:before': {
      background: theme.palette.secondary.light,
    },
  },
  description: {
    width: '200px',
    maxHeight: '100px',
    overflowY: 'auto',
  },
  cardFooter: {
    marginBottom: theme.spacing(1),
    display: 'flex',
    paddingTop: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    color: theme.palette.secondary.light,
    position: 'absolute',
    bottom: 0,
    width: 'calc(100% - 32px)',
    justifyContent: 'space-between',
  },
  cardAction: {
    margin: theme.spacing(1, 0),
    padding: 0,
    position: 'absolute',
    bottom: theme.spacing(5),
  },
  user: {
    maxWidth: '60%',
  },
  link: {
    paddingLeft: theme.spacing(1),
  },
  rightSubtitle: {
    paddingTop: theme.spacing(1),
  },
  container: {
    '& > div': {
      width: '100%',
    },
  },
}));

export default function MarketplaceList() {
  const match = useRouteMatch();
  const history = useHistory();
  const { application } = match.params;
  const [fetchedCollection, setFetchedCollection] = useState(false);
  const classes = useStyles();
  const gridViewClasses = gridViewStyles();
  const dispatch = useDispatch();
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );
  const sandbox = userPreferences.environment === 'sandbox';
  const connectors = useSelectorMemo(
    selectors.makeMarketPlaceConnectorsSelector,
    application,
    sandbox
  );
  const marketPlaceConnectAppUrl = getImageUrl('images/react/marketplace-connect-app.png');
  const templates = useSelector(state =>
    selectors.marketplaceTemplatesByApp(state, application)
  );
  const applications = applicationsList();
  const connector = applications.find(c => c.id === application);
  const applicationName = connector?.name || capitalizeFirstLetter(application);
  const { RequestDemoDialog, requestDemo } = useRequestForDemo();

  useEffect(() => {
    if (!connectors.length && !templates.length && !fetchedCollection) {
      dispatch(actions.marketplace.requestConnectors());
      dispatch(actions.marketplace.requestTemplates());
      setFetchedCollection(true);
    }
  }, [connectors.length, dispatch, fetchedCollection, templates.length]);
  const { confirmDialog } = useConfirmDialog();
  const handleConnectorInstallClick = connector => {
    if (connector._id === SUITESCRIPT_CONNECTOR_IDS.salesforce) {
      history.push(getRoutePath(`/suitescript/integrationapps/${SUITESCRIPT_CONNECTOR_IDS.salesforce}/setup`));
    } else if (connector.installed) {
      confirmDialog({
        isPrompt: true,
        title: 'Confirm multiple installs',
        label: 'Tag',
        message: message.MARKETPLACE.MULTIPLE_INSTALLS,
        buttons: [
          {
            label: 'Install',
            variant: 'filled',
            onClick: tag => {
              dispatch(
                actions.marketplace.installConnector(
                  connector._id,
                  sandbox,
                  tag
                )
              );
              history.push(getRoutePath(HOME_PAGE_PATH));
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    } else {
      dispatch(actions.marketplace.installConnector(connector._id, sandbox));
      history.push(getRoutePath(HOME_PAGE_PATH));
    }
  };

  const handletrialEnabledClick = connector => {
    if (connector.usedTrialLicenseExists) {
      confirmDialog({
        title: 'You have already used up your trial license',
        isHtml: true,
        allowedTags: ['b'],
        message: message.MARKETPLACE.ALREADY_TRIAL_LICENCE,
        buttons: [
          {
            label: 'Request demo',
            onClick: () => {
              requestDemo(connector);
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    } else {
      confirmDialog({
        title: `This will start your ${connector.trialPeriod} days free trial plan`,
        isHtml: true,
        allowedTags: ['b'],
        message: messageStore('MARKETPLACE.TRIAL_PLAN', {connectorName: connector.name}),
        buttons: [
          {
            label: 'Start free trial',
            onClick: () => {
              handleConnectorInstallClick(connector);
            },
          },
          {
            label: 'Cancel',
            variant: 'text',
          },
        ],
      });
    }
  };

  return (
    <LoadResources required resources="integrations">
      <InstallTemplateDrawer />

      <CeligoPageBar title={`${applicationName} Integrations`}>
        <Typography component="div" variant="body2" className={classes.rightSubtitle}>Don’t see what you need? <a href="mailto:product_feedback@celigo.com" rel="noreferrer" target="_blank">Let us know.</a></Typography>
      </CeligoPageBar>

      {(!templates.length && !connectors.length) && (
      <PageContent>
        <div className={classes.pageCenter}>
          <Typography variant="h4">Connect this app to anything</Typography>
          <Typography variant="body2">Prebuilt templates and integration apps are not yet available for this application. Anyone with manager permission and above can use Flow Builder to create new custom flows using the prebuilt connector available for this application.<br /><br />Need help? Check out our <a target="blank" href="https://docs.celigo.com/hc/en-us/categories/360002670492-Connectors">documentation</a> or <a target="blank" href="https://docs.celigo.com/hc/en-us/community/topics" >join our community</a>.</Typography>
          <img src={marketPlaceConnectAppUrl} alt="Marketplace Connect App" />
        </div>
      </PageContent>
      )}
      <PageContent>
        <div className={clsx(gridViewClasses.container, classes.container)}>
          {connectors.map(connector => (
            <Card
              key={connector._id}
              className={clsx(classes.card, classes.connectorCard)}
              elevation={0}>
              <ConnectorTemplateContent
                resource={connector}
                title="Integration app"
                application={application}
                type="connector"
            />
              <CardActions className={classes.cardAction}>
                {connector.canInstall && (
                <FilledButton
                  data-test="installConnector"
                  onClick={() => handleConnectorInstallClick(connector)}>
                  Install
                </FilledButton>
                )}
                {connector.canStartTrial && (
                <FilledButton
                  data-test="startFreeTrial"
                  onClick={() => handletrialEnabledClick(connector)}>
                  Start free trial
                </FilledButton>
                )}
                {connector.canRequestDemo && (
                <Tooltip title={message.MARKETPLACE.REQUEST_DEMO} placement="bottom">
                  <span>
                    <FilledButton
                      data-test="contactSales"
                      onClick={() => requestDemo(connector)}>
                      Request demo
                    </FilledButton>
                  </span>
                </Tooltip>
                )}
              </CardActions>
              <div className={classes.cardFooter}>
                <Typography className={classes.title} variant="body2">
                  Integration app
                </Typography>
                <Typography className={classes.user} variant="body2" noWrap>
                  { connector?.user?.company || connector?.user?.name || connector?.user?.email || 'Celigo'}
                </Typography>
              </div>
            </Card>
          ))}
          {templates.map(template => (
            <Card
              key={template._id}
              className={clsx(
                classes.card,
                classes.connectorCard,
                classes.templateCard
              )}
              elevation={0}>
              <ConnectorTemplateContent
                resource={template}
                title="QuickStart Templates"
                application={application}
                type="template"
            />
              <CardActions className={classes.cardAction}>
                <FilledButton
                  data-test="installTemplate"
                  component={Link}
                  to={buildDrawerUrl({
                    path: drawerPaths.INSTALL.TEMPLATE_PREVIEW,
                    baseUrl: match.url,
                    params: { templateId: template._id },
                  })}>
                  Preview
                </FilledButton>
              </CardActions>
              <div className={classes.cardFooter}>
                <Typography className={classes.title} variant="body2">
                  Template
                </Typography>
                <Typography className={classes.user} variant="body2" noWrap>
                  { template?.user?.company || template?.user?.name || template?.user?.email || 'Celigo'}
                </Typography>
              </div>
            </Card>
          ))}
        </div>
      </PageContent>
      <RequestDemoDialog />
    </LoadResources>
  );
}
