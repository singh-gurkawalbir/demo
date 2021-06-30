import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useRouteMatch, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions, Button, Typography } from '@material-ui/core';
import {applicationsList} from '../../constants/applications';
import CeligoPageBar from '../../components/CeligoPageBar';
import ConnectorTemplateContent from './ConnectorTemplateContent';
import getRoutePath from '../../utils/routePaths';
import actions from '../../actions';
import {
  CONTACT_SALES_MESSAGE,
} from '../../utils/messageStore';
import { selectors } from '../../reducers';
import ModalDialog from '../../components/ModalDialog';
import InstallTemplateDrawer from '../../components/drawer/Install/Template';
import LoadResources from '../../components/LoadResources';
import useConfirmDialog from '../../components/ConfirmDialog';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import { SUITESCRIPT_CONNECTOR_IDS } from '../../utils/constants';
import { capitalizeFirstLetter } from '../../utils/string';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 2),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr));',
    gridGap: theme.spacing(2),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
    position: 'relative',
    bottom: theme.spacing(2),
    '& > div': {
      maxWidth: '100%',
      minWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, minmax(100%, 1fr));',
    },
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr));',
    },
  },
  card: {
    height: '318px',
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
    display: 'grid',
    paddingTop: theme.spacing(1),
    gridTemplateColumns: '1fr 1fr',
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    color: theme.palette.secondary.light,
    position: 'absolute',
    bottom: 0,
    width: 'calc(100% - 32px)',
  },
  title: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '88%',
    textOverflow: 'ellipsis',
  },
  user: {
    textAlign: 'right',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  cardAction: {
    margin: theme.spacing(1, 0),
    padding: 0,
    position: 'absolute',
    bottom: theme.spacing(5),
  },
  link: {
    paddingLeft: theme.spacing(1),
  },
  rightSubtitle: {
    paddingTop: theme.spacing(1),
  },
  noDataTitle: {
    padding: theme.spacing(3),
    width: '700px',
  },
}));

export default function MarketplaceList() {
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const { application } = match.params;
  const [fetchedCollection, setFetchedCollection] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showMessage, setShowMessage] = useState(false);
  const userPreferences = useSelector(state =>
    selectors.userPreferences(state)
  );
  const sandbox = userPreferences.environment === 'sandbox';
  const connectors = useSelectorMemo(
    selectors.makeMarketPlaceConnectorsSelector,
    application,
    sandbox
  );
  const templates = useSelector(state =>
    selectors.marketplaceTemplatesByApp(state, application)
  );
  const applications = applicationsList();
  const connector = applications.find(c => c.id === application);
  const applicationName = connector?.name || capitalizeFirstLetter(application);

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
        message: 'Are you sure you want to install this integration app?  This integration app is already installed in your account.',
        buttons: [
          {
            label: 'Install',
            onClick: tag => {
              dispatch(
                actions.marketplace.installConnector(
                  connector._id,
                  sandbox,
                  tag
                )
              );
              history.push(getRoutePath('/dashboard'));
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    } else {
      dispatch(actions.marketplace.installConnector(connector._id, sandbox));
      history.push(getRoutePath('/dashboard'));
    }
  };

  const handleContactSalesClick = connector => {
    dispatch(actions.marketplace.contactSales(connector.name, connector._id));
    setShowMessage(true);
  };
  const handletrialEnabledClick = connector => {
    if (connector.usedTrialLicenseExists) {
      confirmDialog({
        title: 'You have already used up your trial license',
        isHtml: true,
        message: 'Click <b>Request a demo</b> to have someone contact you to learn more about your needs.',
        buttons: [
          {
            label: 'Request a demo',
            onClick: () => {
              handleContactSalesClick(connector);
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          },
        ],
      });
    } else {
      confirmDialog({
        title: `This will start your ${connector.trialPeriod} days free trial plan`,
        isHtml: true,
        message: `Click <b>Start free trial</b> to start your free trial of ${connector.name} Integration App.`,
        buttons: [
          {
            label: 'Start free trial',
            onClick: () => {
              handleConnectorInstallClick(connector);
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
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
        <Typography component="div" variant="body2" className={classes.noDataTitle}> Prebuilt templates and integration apps are not yet available for this application. Anyone with manager permission and above can use Flow Builder to create brand new custom flows using the prebuilt connector available for this application.</Typography>
      )}
      <div className={classes.root}>
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
                <Button
                  data-test="installConnector"
                  onClick={() => handleConnectorInstallClick(connector)}
                  variant="outlined"
                  color="primary">
                  Install
                </Button>
              )}
              {connector.canStartTrial && (
                <Button
                  data-test="startFreeTrial"
                  onClick={() => handletrialEnabledClick(connector)}
                  variant="outlined"
                  color="primary">
                  Start free trial
                </Button>
              )}
              {connector.canRequestDemo && (
                <Button
                  data-test="contactSales"
                  onClick={() => handleContactSalesClick(connector)}
                  variant="outlined"
                  color="primary">
                  Request a demo
                </Button>
              )}
            </CardActions>
            <div className={classes.cardFooter}>
              <Typography className={classes.title} variant="body2">
                Integration app
              </Typography>
              <Typography className={classes.user} variant="body2">
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
              <Button
                data-test="installTemplate"
                variant="outlined"
                color="primary"
                component={Link}
                to={`${location.pathname}/installTemplate/preview/${template._id}`}>
                Preview
              </Button>
            </CardActions>
            <div className={classes.cardFooter}>
              <Typography className={classes.title} variant="body2">
                Template
              </Typography>
              <Typography className={classes.user} variant="body2">
                { template?.user?.company || template?.user?.name || template?.user?.email || 'Celigo'}
              </Typography>
            </div>
          </Card>
        ))}
      </div>
      {showMessage && (
        <ModalDialog show onClose={() => setShowMessage(false)}>
          <div>Thank you! Your request has been received.</div>
          <div>
            {CONTACT_SALES_MESSAGE}
            <a
              href="http://www.celigo.com/integration-marketplace"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.link}>
              http://www.celigo.com/integration-marketplace
            </a>
          </div>
        </ModalDialog>
      )}
    </LoadResources>
  );
}
